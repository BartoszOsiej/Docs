# Plan i zmiany

## Changelog

### Faza 2 — współdzielenie modeli, datasety, preferencje gracza (2026-08-13)

1. **Współdzielenie modeli** — przenośny format `nv2-model-bundle`
   (eksport/import przez `/ai_export`, `/ai_import`), sanityzowany pod
   kątem NaN i utrwalany po imporcie.
2. **Import datasetów treningowych** — `/ai_dataset <path> [epochs]` trenuje
   głowę roślinności na walidowanych zbiorach JSON.
3. **Uczenie preferencji gracza** — liczniki klas w checkpointcie (wstecznie
   kompatybilne), wmieszane w cele treningowe (30%).
4. **Odporność checkpointu na NaN** — klipowanie gradientu, sanityzacja przy
   zapisie, tolerancyjne ładowanie; naprawiono realny bug uszkodzenia.

Zestaw: **96 zaliczonych / 0 błędów** (97 łącznie z zignorowanym benchmarkiem
release).

### Faza 1 AI — inteligencja roślinności (v1.0.0, ukończona)

**1. Usunięto limit wysokości świata**
- `CHUNK_H` podniesiony z **256 → 512** bloków
- Wyższe góry, głębsze jaskinie, przygotowanie pod streaming bez limitu wysokości

**2. 22 nowe typy bloków roślinności** (`world/block.rs`)
- Kwiaty: róża, mlecz, tulipany (4 kolory), chaber, czosnek, azalia
- Rośliny wodne: grzybienie, paproć, roślina paprociowa, trawa morska,
  wysoka trawa morska, kelp
- Dekoracje: małe patyki, kamyki (3 warianty), porośnięty mchem bruk,
  winorośl, dywan mchu

**3. Moduł generatora AI** (`world/ai_generator.rs`, NOWY, ~600 linii)
- `TerrainAI` MLP: 8→16→4, 320 parametrów, ~1,2 KB
- `AISystem` z wątkiem treningu w tle
- Kanał `AIMessage` dla postępu treningu / generacji tekstur / decyzji
  roślinności

**4. AI zintegrowane ze światem** (`world/mod.rs`)
- `World::new_with_settings()` uruchamia system AI
- `ai_system` + `ai_receiver` przechowywane na `World`

**5. Rozszerzona generacja roślinności** (`world/vegetation.rs`)
- Nowe `place_ai_vegetation()`: komórki 3×3, 8 cech terenu, próg ufności
  0.5, prawdopodobieństwa świadome biomu

**6. Dodane zależności** (`Core/Cargo.toml`)
- `ndarray 0.15`, `rand 0.8`, `reqwest 0.11` (json), `tokio 1` (full)

### Zmiana zachowania (przed → po)

| Aspekt | Przed | Po |
|---|---|---|
| Kwiaty | Losowe, oparte o szum | Stawianie przewidywane przez AI |
| Paprocie | Brak | Wilgotne, zacienione obszary |
| Patyki/kamyki | Brak | Naturalny rozkład |
| Uczenie | — | Ciągły trening w tle |
| Wpływ na FPS | — | Brak (&lt;1%) |

## Plan — Faza 2

### Funkcja 1: Integracja zestawów danych z internetu — ✅ część lokalna
- ✅ Wczytywanie, walidacja i trening na plikach JSON (`/ai_dataset`)
- ⬜ Chmurowe repozytorium datasetów / endpointy API
- ⬜ Łączenie z live weather już działa (Open-Meteo, fallback offline)

### Funkcja 2: Generacja tekstur AI w czasie rzeczywistym
- ⬜ Generuj tekstury proceduralnie siecią
- ⬜ Zintegruj z dynamicznym atlasem renderera
- ⬜ Emituj wygenerowane tekstury przez `AIMessage::TextureGenerated`

### Funkcja 3: Uczenie online z działań gracza — ✅ ukończone (2026-08-13)
- ✅ Wybory gracza śledzone jako liczniki preferencji w checkpointcie
- ✅ Cele treningowe wmieszane z nauczonymi preferencjami (30%)
- ✅ Bezpieczne prywatnościowo: tylko lokalne cechy terenu, bez współrzędnych,
  bez danych osobowych

### Funkcja 4: Współdzielenie modeli w chmurze (multiplayer) — ✅ część lokalna
- ✅ Przenośny `nv2-model-bundle` (eksport/import przez `/ai_export`, `/ai_import`)
- ⬜ Chmurowe endpointy upload/download / marketplace modeli
- ✅ Versionowany, samoopisujący się format checkpointu

### Funkcja 5: Akceleracja GPU
- ⬜ Równoległe próbki treningowe na GPU (batchowane wprzód/wstecz)
- ⬜ Większe modele bez kosztu czasu klatki

### Funkcja 6: Głębia świata i rozgrywki
- ⬜ Sezonowe zmiany roślinności
- ⬜ Koordynacja wielu biomów
- ⬜ Streaming chunków bez limitu wysokości
- ⬜ Dedykowany system audio rozgrywki (sygnały ośrodków ruchu już śledzone)
- ⬜ Sieciowanie / multiplayer
- ⬜ Edytor treści w silniku

## Znane ograniczenia (Faza 1)

1. Brak łączności z internetem (Faza 2)
2. Tylko syntetyczne dane treningowe
3. Uczenie w jednej skali
4. Brak trwałości modelu między sesjami
5. Podstawowa generacja tekstur
