# System roślinności AI

NV2 Engine osadza małą sieć neuronową, która decyduje, gdzie należy
roślinność, i trenuje ją **w tle podczas gry** — z zerowym wpływem na FPS
(obciążenie &lt;1% CPU). To kompletna, produkcyjna implementacja MLP
w `world/ai_generator.rs` (410 linii) używająca `ndarray`.

## Przegląd architektury

```
┌─────────────────────────────────────────────────────────────┐
│                    Główny wątek gry                          │
│  Generacja świata                                            │
│   ├─ Generacja chunków (BiomeGenerator)                     │
│   ├─ Stawianie drzew (VegetationGenerator)                  │
│   ├─ Trawa/kwiaty (tradycyjnie)                             │
│   └─ Roślinność AI (place_ai_vegetation) ◄──────┐           │
│                                                  │          │
└──────────────────────────────────────────────────┬──────────┘
                                                   │
                Zapytania AI o przewidywania (nieblokujące
                przez Arc<Mutex>)
                                                   │
┌──────────────────────────────────────────────────▼──────────┐
│              Wątek AI w tle (ciągły)                        │
│  Sieć neuronowa TerrainAI                                   │
│   ├─ Przejście wprzód (inferencja)                          │
│   ├─ Przejście wstecz (trening)                             │
│   ├─ Aktualizacje wag                                        │
│   └─ Aktualizacje biasów                                     │
│                                                             │
│  Pętla treningu (100 próbek/epokę):                         │
│   1. Generuj syntetyczne cechy                              │
│   2. Wykonaj przewidywanie                                   │
│   3. Oblicz cel z heurystyki                                 │
│   4. Oblicz loss cross-entropy                               │
│   5. Backpropagacja                                          │
│   6. Zaktualizuj wszystkie wagi                              │
└─────────────────────────────────────────────────────────────┘
```

## Model

```
Warstwa wejściowa (8 cech terenu)
    ↓
Warstwa ukryta (16 neuronów) + ReLU
    ↓
Warstwa wyjściowa (4 klasy roślinności) + Softmax
```

- **Parametry:** 8×16 + 16×4 = **320 parametrów** (w1 `[8×16]`, b1 `[16]`,
  w2 `[16×4]`, b2 `[4]`)
- **Całkowita pamięć:** ~1,2 KB (512 B w1 + 64 B b1 + 256 B w2 + 16 B b2 +
  ~300 B metadanych)
- **Czas inferencji:** ~10 µs na przewidywanie (O(192) operacji)

## Cechy wejściowe (8)

| # | Cecha | Zakres |
|---|---|---|
| 1 | Wysokość terenu (znormalizowana) | 0.0–1.0 |
| 2 | Nachylenie terenu | 0.0–0.5 |
| 3 | Temperatura biomu | 0.0–1.0 |
| 4 | Wilgotność biomu | 0.0–1.0 |
| 5 | Odległość do najbliższej wody | 0.0–1.0 |
| 6 | Gęstość pobliskich roślin | 0.0–1.0 |
| 7 | Poziom światła | 0.0–1.0 |
| 8 | Seed szumu proceduralnego | 0.0–1.0 |

## Wyjścia (4 klasy roślinności)

| Wyjście | Roślinność |
|---|---|
| 0 | Kwiaty — róże, tulipany (4 kolory), mlecze, chabry, czosnki, azalie |
| 1 | Paprocie i rośliny wodne — paprocie, grzybienie, trawa morska, wysoka trawa morska, kelp |
| 2 | Małe patyki i przedmioty dekoracyjne |
| 3 | Kamyki i skały (3 warianty) |

## Matematyka

### Przejście wprzód

```
Ukryte:    h = ReLU(input @ w1.T + b1)      gdzie ReLU(x) = max(0, x)
Logity:    logits = h @ w2.T + b2
Softmax:   p_i = exp(logits_i - max(logits)) / sum_j(exp(logits_j - max(logits)))
```

### Przejście wstecz (cross-entropy)

```
Loss:        Loss = -sum_i(target_i * log(p_i))
Grad wyjścia: dL/dz2 = p - target                    (elementowo)
Wagi H→O:    dL/dw2[j,i] = dL/dz2[i] * h[j]
             dL/db2[i]   = dL/dz2[i]
Grad ukryty: dL/dh[j] = sum_i(dL/dz2[i] * w2[j,i])
             dL/dz1[j] = dL/dh[j] * relu_derivative(z1[j])
                          gdzie relu_derivative(x) = 1 if x > 0 else 0
Wagi I→H:    dL/dw1[k,j] = dL/dz1[j] * input[k]
             dL/db1[j]   = dL/dz1[j]
```

### Gradient descent

```
w := w - learning_rate * dL/dw
b := b - learning_rate * dL/db
```

## Pętla treningu

Wątek w tle działa w sposób ciągły:

```
Pętla (wątek w tle):
  Dla każdej z 100 próbek:
    - Generuj syntetyczne cechy terenu (rand::thread_rng)
    - Wykonaj przewidywanie AI (wprzód)
    - Oblicz docelową roślinność z heurystyk
    - Backpropagacja gradient descent (wstecz)
    - Zaktualizuj wagi i biasy

  Co 1000 epok:
    - Zmniejsz learning rate (×0.95), aby zapobiec przetrenowaniu
    - Opcjonalnie zapisz checkpoint modelu
```

### Heurystyka celu (syntetyczny trening)

```
if wilgotność > 0.6 and światło < 0.5:   paprocie (wyjście 1)
else if wilgotność > 0.5:                kwiaty (wyjście 0)
else if wysokość < 0.3:                  kamyki (wyjście 3)
else:                                    patyki (wyjście 2)
```

### Hiperparametry

| Parametr | Wartość | Uwagi |
|---|---|---|
| Learning rate | 0.01 | Sweet spot; 0.1 oscyluje, 0.001 zbyt wolno |
| Spadek | 0,95× / 1000 epok | Zapobiega przetrenowaniu, precyzuje wagi |
| Próbki/epokę | 100 | ~5–10 ms na epokę |
| Próg ufności | 0.5 | Tylko przewidywania o wysokiej ufności stawiają bloki |
| Rozmiar komórki | 3×3 bloki | Proceduralna różnorodność |

## Publiczne API (`ai_generator.rs`)

```rust
pub enum AIMessage {
    TrainingProgress { epoch: u32, loss: f32 },
    TextureGenerated { seed: u64, texture_data: Vec<u8> },
    VegetationDecision { wx: i32, wy: i32, wz: i32, block: BlockType, confidence: f32 },
}

pub struct TerrainAI { /* w1, b1, w2, b2, learning_rate, training_samples */ }

pub struct AISystem {
    ai: Arc<Mutex<TerrainAI>>,
    tx: Sender<AIMessage>,
    training_thread: JoinHandle<()>,
}
```

| Metoda | Sygnatura | Cel |
|---|---|---|
| `forward` | `(&self, features: &[f32; 8]) -> [f32; 4]` | Inferencja: ukryte ReLU + softmax wyjściowy |
| `backward` | `(&mut self, features: &[f32; 8], target: [f32; 4]) -> f32` | Jeden krok treningu, zwraca loss |
| `predict_vegetation` | `(&self, features: &[f32; 8]) -> (BlockType, f32)` | Przewidywanie wątkowo-bezpieczne (blokuje Arc&lt;Mutex&gt;) |
| `generate_texture` | `(seed, w, h) -> Vec&lt;u8&gt;` | Generacja tekstur wspomagana AI |

## Punkty integracji

1. **Inicjalizacja świata** — `World::new_with_settings()` uruchamia
   `AISystem` (wątek w tle) i przechowuje go z odbiornikiem wiadomości.
2. **Ekstrakcja cech** — `place_ai_vegetation()` w `vegetation.rs`
   wyodrębnia 8 cech terenu na komórkę 3×3.
3. **Przewidywanie i stawianie** — `predict_vegetation(&features)` zwraca
   blok + ufność; bloki są stawiane tylko przy `confidence > 0.5`,
   z poszanowaniem prawdopodobieństw stawiania zależnych od biomu.

## Wydajność

| Aspekt | Wartość |
|---|---|
| Rozmiar modelu | ~1,2 KB |
| Inferencja | ~10 µs (O(192) operacji) |
| Epoka | ~5–10 ms (100 próbek) |
| Narzut na rozgrywkę | ~0,8% (wątek w tle na bezczynnym CPU) |
| Koszt startu | ~+5 ms (utworzenie wątku) |

Dlaczego to szybkie: mały model, jedna warstwa ukryta, `max(0, x)` ReLU,
zoptymalizowany 4-kierunkowy softmax, bez konwolucji, uczenie online
jedną próbką.

## Testowanie

Testy jednostkowe w `ai_generator.rs` weryfikują:

- **Przejście wprzód** — wynik to poprawny rozkład prawdopodobieństwa
  (suma ≈ 1.0)
- **Trening** — loss maleje (lub pozostaje w 1,1×) między krokami

## Debugowanie

```rust
// Loguj postęp treningu co 100 epok
if epoch % 100 == 0 {
    println!("[AI] Epoch {}: Loss = {:.4}", epoch, avg_loss);
}

// Obserwuj przewidywania o wysokiej ufności
let (block, conf) = world.ai_system.predict_vegetation(&features);
if conf > 0.8 {
    println!("[AI] High confidence: {} ({}%)", block.name(), (conf * 100.0) as u32);
}
```

## Opcjonalny trening online

`online_trainer.rs` zapewnia opcjonalny tryb treningu wspomaganego chmurą
(zależności `reqwest` + `tokio` są już w Cargo.toml dla przyszłych pobrań
zestawów danych).

## Plan (Faza 2)

Zobacz stronę [Plan i zmiany](roadmap), aby poznać: integrację zestawów
danych z internetu, generację tekstur AI w czasie rzeczywistym, uczenie
preferencji gracza, współdzielenie modeli w chmurze, sezonową roślinność,
koordynację wielu biomów i trening przyspieszany GPU.
