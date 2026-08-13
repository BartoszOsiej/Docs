# System AI — MeMLP (Modular embedded Multi-layer Perceptron Model)

NV2 Engine osadza małą sieć neuronową — **MeMLP** (Modular embedded
Multi-layer Perceptron Model) — która decyduje, gdzie należy roślinność,
klasyfikuje biomy na podstawie cech klimatu i wybiera style tekstur
proceduralnych. Trenuje **w tle podczas gry** z zerowym wpływem na FPS
(obciążenie &lt;1% CPU). Wszystko działa w procesie: czysty CPU, jeden
checkpoint JSON, bez chmury i bez GPU.

Implementacja: `world/memplp.rs` (rdzeń MeMLP) + `world/ai_generator.rs`
(system widoczny dla silnika), z użyciem `ndarray`.

## Przegląd architektury

```
┌─────────────────────────────────────────────────────────────┐
│                    Główny wątek gry                          │
│  Generacja świata                                            │
│   ├─ Generacja chunków (BiomeGenerator)                     │
│   ├─ Stawianie drzew (VegetationGenerator)                  │
│   └─ Roślinność AI (place_ai_vegetation) ◄──────┐           │
│                                                  │          │
└──────────────────────────────────────────────────┬──────────┘
                                                   │
            Zapytania AI o przewidywania (nieblokujące
            przez Arc<Mutex>)
                                                   │
┌──────────────────────────────────────────────────▼──────────┐
│              Wątek AI w tle (ciągły)                        │
│  TerrainAI → modułowy model MeMLP                            │
│   ├─ Głowa roślinności: 8 → 24 → 16 → 4 (głębokie MLP)      │
│   ├─ Głowa bioma:       8 → 12 → 9                           │
│   ├─ Głowa tekstur:     8 → 12 → 6                           │
│   ├─ Feedback gracza   (world/ai_feedback.rs)                │
│   └─ Dane online       (world/online_trainer.rs, offline-ok) │
│                                                              │
│  Pętla treningu (200+ próbek/epokę):                         │
│   1. Pobierz akcje gracza (najwyższy priorytet)              │
│   2. Połącz dane klimatyczne online (co ~60 s, offline-safe) │
│   3. Syntetyczne próbki dla wszystkich trzech głów           │
│   4. Backpropagacja (cross-entropy)                          │
│   5. Checkpoint co 20 epok                                   │
└──────────────────────────────────────────────────────────────┘
```

## Model

MeMLP jest **modułowy**: jeden plik checkpointu zawiera kilka
specjalistycznych perceptronów wielowarstwowych, każdy rozwiązujący jedno
zadanie.

| Moduł | Kształt | Zadanie |
|---|---|---|
| `vegetation` | 8 → 24 → 16 → 4 | rozmieszczanie kwiat / paproć / patyk / kamyk |
| `biome` | 8 → 12 → 9 | klasyfikacja bioma (9 biomów, zgodnie z `BiomeId`) |
| `texture` | 8 → 12 → 6 | wybór stylu tekstur proceduralnych |

- **Liczba parametrów:** 1095 (świeży) / 623 (migrowany legacy checkpoint)
- **Checkpoint:** jeden plik JSON, ~1–4 KB (`Core/checkpoints/ai_model.json`)
- **Inferencja:** ~0,3 µs na przejście głowy (build release)
- **Trening:** ~0,5–1,2 M próbek/s na głowę (build release)

> Stare checkpointy sprzed MeMLP (jedna warstwa ukryta `8→16→4`) są
> **wykrywane i migrowane automatycznie** — wytrenowane wagi są zachowane,
> nowe głowy startują od zera. Dołączony checkpoint jest już w formacie
> v1 MeMLP.

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

## Wyjścia (głowa roślinności, 4 klasy)

| Wyjście | Roślinność |
|---|---|
| 0 | Kwiaty — róże, tulipany (4 kolory), mlecze, chabry, czosnki, azalie |
| 1 | Paprocie i rośliny wodne — paprocie, grzybienie, trawa morska, wysoka trawa morska, kelp |
| 2 | Małe patyki i przedmioty dekoracyjne |
| 3 | Kamyki i skały (3 warianty) |

## Matematyka

### Przejście wprzód (na głowę)

```
Ukryte:    h1 = ReLU(input @ w1 + b1)        gdzie ReLU(x) = max(0, x)
           h2 = ReLU(h1 @ w2 + b2)           (głębokie głowy)
Logity:    logits = h_ostatnia @ wN + bN
Softmax:   p_i = exp(logits_i - max(logits)) / sum_j(exp(logits_j - max(logits)))
```

### Przejście wstecz (cross-entropy, backprop przez wszystkie warstwy)

```
Loss:        Loss = -sum_i(target_i * log(p_i))
Grad wyjścia: dL/dz = p - target              (elementowo)
Grad wag:    dL/dw[k][i,j] = dL/dz[j] * h[k-1][i]
Grad ukryty: dL/dh = dL/dz @ w.T · ReLU'(z)   (łańcuchowo przez ReLU)
```

### Gradient descent

```
w := w - learning_rate * dL/dw
b := b - learning_rate * dL/db
```

## Pętla treningu

Wątek w tle działa w sposób ciągły, łącząc trzy źródła sygnałów:

1. **Feedback gracza** (najwyższy priorytet) — `world/ai_feedback.rs`
   zapisuje każdy blok roślinności stawiany lub niszczony przez gracza; AI
   dosłownie uczy się z tego, co robisz (bufor ograniczony do 4096 próbek).
2. **Dane klimatyczne online** — `world/online_trainer.rs` pobiera prawdziwą
   temperaturę/wilgotność z Open-Meteo (bez klucza, 8 miast od pustyni po
   tundrę…) co ~60 s, z syntetycznym fallbackiem offline.
3. **Próbki syntetyczne** — heurystyczne cele utrzymują wszystkie trzy głowy
   w formie: 200 próbek roślinności + 40 próbek bioma/tekstur na epokę.

Checkpoint zapisywany co 20 epok do `Core/checkpoints/ai_model.json`.

### Hiperparametry

| Parametr | Wartość | Uwagi |
|---|---|---|
| Learning rate | 0.01 | Sweet spot; 0.1 oscyluje, 0.001 zbyt wolno |
| Próg ufności | 0.40 | Tylko przewidywania o wysokiej ufności stawiają bloki |
| Rozmiar komórki | 3×3 bloki | Proceduralna różnorodność |
| Bufor feedbacku | 4096 | Ograniczony, najnowsze próbki wygrywają |

## Publiczne API (`ai_generator.rs`)

```rust
pub struct TerrainAI {  // opakowuje MeMLP, API silnika pozostaje stabilne
    model: MeMLP,       // vegetation (8→24→16→4) + biome (8→12→9) + texture (8→12→6)
    learning_rate: f32,
    training_samples: usize,
    // ...
}
```

| Metoda | Sygnatura | Cel |
|---|---|---|
| `forward` | `(&self, features: &[f32; 8]) -> [f32; 4]` | Inferencja głowy roślinności |
| `backward` | `(&mut self, features: &[f32; 8], target: [f32; 4]) -> f32` | Jeden krok treningu, zwraca loss |
| `predict_biome` | `(&self, features: &[f32; 8]) -> usize` | Głowa bioma (0..9, kolejność `BiomeId`) |
| `predict_texture_style` | `(&self, features: &[f32; 8]) -> usize` | Głowa tekstur (0..5) |
| `predict_vegetation` | `(&self, features: &[f32; 8]) -> (BlockType, f32)` | Przewidywanie wątkowo-bezpieczne |
| `save_checkpoint` / `load_checkpoint` | `(path)` | Persystencja JSON, migracja legacy |
| `model_stats` | `() -> (usize, u32, usize)` | parametry, wersja MeMLP, próbki |

## Punkty integracji

1. **Inicjalizacja świata** — `World::new_with_settings()` uruchamia
   `AISystem` (wątek w tle) i przechowuje go z odbiornikiem wiadomości.
2. **Ekstrakcja cech** — `place_ai_vegetation()` w `vegetation.rs`
   wyodrębnia 8 cech terenu na komórkę 3×3.
3. **Przewidywanie i stawianie** — `predict_vegetation(&features)` zwraca
   blok + ufność; bloki są stawiane tylko przy `confidence > 0.40`.
4. **Dekoracje zależne od bioma** — `DecorationAI` używa `predict_biome()`
   do wyboru stylu dekoracji (paprocie na bagnach/tajdze, kwiaty w lasach…).
5. **Uczenie od gracza** — `interaction.rs` wywołuje
   `ai_feedback::record_place` / `record_break` przy każdej interakcji
   z roślinnością.

## Wydajność

| Aspekt | Wartość |
|---|---|
| Rozmiar modelu | checkpoint ~1–4 KB |
| Inferencja | ~0,3 µs na głowę (3,4 M przewidywań/s) |
| Trening | ~0,5–1,2 M próbek/s na głowę |
| Narzut na rozgrywkę | ~0,8% (wątek w tle na bezczynnym CPU) |
| Koszt startu | ~+5 ms (utworzenie wątku) |

Zmierzono przez `cargo test --release qa_benchmark_report -- --ignored --nocapture` —
pełne liczby w `TEST_REPORT.md`.

## Funkcje Fazy 2 (2026-08-13)

### Współdzielenie modeli społeczności

Modele są przenośne. `/ai_export <path> [author]` zapisuje `nv2-model-bundle`
— pełny checkpoint z metadanymi autora / opisu / wskazówki biomu — a
`/ai_import <path>` wczytuje dowolny współdzielony bundle, sanityzuje go i
utrwala w checkpointcie runtime. API: `AISystem::export_model` /
`import_model`. To lokalna połowa roadmapy chmurowej: pliki można już
wymieniać między graczami i serwerami.

### Import datasetów treningowych

Zbiory JSON (`samples`: 8 cech terenu, `targets`: 4-klasowe rozkłady
roślinności) są walidowane i trenowane bezpośrednio — `/ai_dataset <path>
[epochs]` lub `AISystem::train_on_dataset`. Puste i niespójne pliki są
odrzucane; wiersze z NaN pomijane.

### Uczenie preferencji gracza

`TerrainAI` trzyma liczniki preferencji klas (kwiat / paproć / patyk /
kamyk) w checkpointcie (`#[serde(default)]` — stare checkpointy pozostają
kompatybilne). Postawienie rośliny zwiększa jej licznik; pętla w tle miesza
cele heurystyczne z nauczonym rozkładem (waga 30%), więc model skłania się
ku temu, co lubi gracz. `/ai_stats` pokazuje żywe liczniki.

## Testowanie

32 testy AI/ML w `world::ai_generator` (16), `world::memplp` (10),
`world::online_trainer` (2), `world::vegetation` (3) i `world::biomes` (1):

- Przejście wprzód daje poprawny rozkład prawdopodobieństwa
- Trening zmniejsza loss i dopasowuje proste wzorce
- Checkpoint JSON round-tripuje dokładnie
- **Legacy checkpointy migrują** (syntetyczne i dołączony plik)
- Tekstury proceduralne są deterministyczne względem seedu
- Bufor feedbacku gracza pozostaje ograniczony
- Heurystyczne cele pozostają w zakresie
- **Trening przetrwa ekstremalne wejścia** — klipowanie gradientu +
  ograniczone aktualizacje sprawiają, że wagi nigdy nie eksplodują do NaN
- **Wejścia NaN są odrzucane** bez ruszania wag
- **Zatrute checkpointy nadal się ładują** — wagi `null` (NaN) wczytywane
  jako `0.0` zamiast unieważniać cały plik
- **Bundle modeli round-tripują** — eksport → import zachowuje metadane i
  parametry; pliki niebędące bundle'ami są odrzucane
- **Datasety importują się i trenują** — walidacja odrzuca puste/niespójne
  pliki
- **Preferencje przesuwają cele** — blend skłania się ku ulubionej klasie
  gracza i przetrwa round-trip checkpointu

> Solidność: `Mlp::train` klipuje gradienty (±5) i ogranicza aktualizacje
> parametrów (±1), `save_checkpoint` sanityzuje NaN/Inf przed zapisem,
> a `load_checkpoint` toleruje wagi NaN zapisane jako JSON `null`.

## Plan (Faza 2)

Zobacz stronę [Plan i zmiany](./roadmap.md), aby poznać: generację tekstur AI
w czasie rzeczywistym, uczenie preferencji gracza, współdzielenie modeli
w chmurze, sezonową roślinność, koordynację wielu biomów i trening
przyspieszany GPU.
