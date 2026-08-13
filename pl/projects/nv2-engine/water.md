# Symulacja wody

Dynamiczne zachowanie cieczy żyje w `world/liquid.rs`, z integracją świata
w `world/mod.rs` i dedykowaną ścieżką renderowania półprzezroczystego
w `renderer/mesh.rs`.

## Kodowanie metadanych wody

Każdy chunk przechowuje per-wokselowy bajt `water_meta`:

| Wartość | Znaczenie |
|---|---|
| `0` | Brak stanu dynamicznego |
| `1..=7` | Płynąca woda (poziom = wysokość kolumny przepływu) |
| `8` | Źródło wody (`SOURCE_LEVEL`) |

Surowe bajty są dekodowane do dynamicznego poziomu cieczy i ponownie
kodowane przez pomocnicze funkcje `encode_level()` / `decode_level()`.

## Stałe symulacji

| Stała | Wartość | Cel |
|---|---|---|
| `SEA_LEVEL` | 46 | Poziom morza świata (z biomów) |
| `SOURCE_LEVEL` | 8 | Blok źródła |
| `FLOW_MAX` | 7 | Maksymalny poziom przepływu |
| `MAX_CHANGES_PER_STEP` | 2048 | Twardy limit zmian bloków na krok symulacji |

## Algorytm solvera

Solver jest **grawitacja-pierwsza**:

```
Dla każdego kroku symulacji:
  1. Zbierz kandydatów źródła (poziom 8) i bloki przepływu.
  2. Sortuj najwyższym Y najpierw, aby grawitacja płynęła w dół w jednym przebiegu.
  3. Dla każdego kandydata:
     - Grawitacja w dół ma absolutny priorytet:
       jeśli blok poniżej jest pusty, płyń w dół (pełny poziom przepływu).
     - Jeśli przepływ w dół jest zablokowany, rozprzestrzeniaj się bocznie
       (4 kierunki: +X, -X, +Z, -Z) z FLOW_MAX jako najlepszym wejściem.
  4. Szanuj MAX_CHANGES_PER_STEP — przestań kolejkować zmiany przy 2048.
  5. Zastosuj zmiany: ustaw water_meta na 0 (pusty) lub encode_level(poziom).
```

Kluczowe szczegóły:

- **Grawitacja bije rozprzestrzenianie boczne** — blok z otwartą przestrzenią
  poniżej nigdy nie rozprzestrzenia się na boki.
- **Sortowanie najwyższym Y najpierw** pozwala wodzie spadać przez wiele
  bloków w jednym przebiegu zamiast jednego bloku na krok.
- **Twardy limit** zapobiega patologicznym kaskadom zatrzymującym klatkę.

## Renderowanie i aktualizacje

- Woda to **osobna ścieżka meshowania i pipeline'u** od geometrii stałej.
- `renderer::State::update(...)` napędza symulację **na timerze** przed
  wyzwoleniem ograniczonych aktualizacji meshów.
- Rekombinacja meshów wody jest oddzielona od pełnych przebudów meshów wody.
- Tylko **zmienione chunki** przebudowują meshe wody — statyczna woda nigdy
  nie wyzwala przebudowy.
- `water_sim_interval` i `water_rebuild_interval` (settings.rs) kontrolują
  częstotliwość symulacji; tryb Low-End-PC zmniejsza częstotliwość
  aktualizacji.

## Integracja świata

- `World::set_water_meta(wx, wy, wz, level)` stosuje zapisy symulacji.
- Metadane wody są **przechowywane w zapisach** obok danych bloków chunków.
- Próbkowanie kolumn świadome wody w generatorze biomów pozycjonuje
  zbiorniki wodne względem poziomu morza.
