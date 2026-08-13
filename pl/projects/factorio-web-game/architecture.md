# Architektura

Novactorio jest celowo wolny od frameworków po stronie renderowania. Pętla
gry, symulacja i rysowanie są pisane ręcznie na Canvas 2D API; React służy
tylko do nakładek UI. Kod to **ponad 21 000 linii TypeScript**
(21 257 LOC w `src/`).

## Przegląd warstw

```
┌─────────────────────────────────────────────────────────┐
│  Nakładka React (src/components/, src/ui/)              │
│  Routing Auth → Start → Gra, HUD, menu, czat, sklep     │
└─────────────────────────┬───────────────────────────────┘
                          │ stan gry / zdarzenia
┌─────────────────────────▼───────────────────────────────┐
│  Silnik gry (src/game/)                                 │
│  engine.ts   — główna pętla: update() + render(), entity│
│  systems.ts  — łańcuchy dostaw, taśmy, rury, AI, zaniecz.│
│  world.ts    — magazyn chunków, nieskończone przewijanie │
│  noise.ts    — generacja terenu szumem Perlina          │
│  renderer.ts — 10 wydzielonych metod rysowania          │
│  constants.ts, types.ts, audio.ts, postproc.ts          │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│  Pipeline renderowania (src/render/)                    │
│  AmbientAtmosphere · ParticleEffects · PollutionOverlay │
│  ScreenEffects · SpriteManager · WeatherSystem · utils  │
└─────────────────────────────────────────────────────────┘
```

## Mapa źródła (`src/`)

| Katalog | Pliki | Odpowiedzialność |
|---|---|---|
| `game/` | 9 | Rdzeń silnika: pętla, systemy, świat, szum, renderer, audio, postprocessing |
| `core/` | engine, systems, types | Wspólne definicje silnika/systemów/typów |
| `render/` | 7 | Efekty wizualne: atmosfera, cząsteczki, zanieczyszczenie, pogoda, sprite'y, FX ekranu |
| `components/` | — | UI React: AuthScreen, BuildMenu, ChatPanel, sklep, HUD |
| `services/` | auth, coop, trade | Usługi oparte o Supabase |
| `config/` | — | Konfiguracja sterowana środowiskiem |
| `ui/` | — | Dodatkowe prymitywy UI |
| `easter/` | — | Treść easter eggów |
| `shaders/` | — | Definicje shaderów |
| `lib/` | — | Wspólne narzędzia |

## Silnik gry (`src/game/`)

| Moduł | Odpowiedzialność |
|---|---|
| `engine.ts` | Pętla gry (`update`/`render`), cykl życia encji, logika budynków, inventory, combat, cząsteczki |
| `renderer.ts` | Wydzielone przebiegi renderowania: niebo, ziemia, encje, liczby obrażeń itd. |
| `systems.ts` | Łańcuchy dostaw, taśmociągi, sieci rur, AI wrogów, zanieczyszczenie |
| `world.ts` | Świat oparty o chunki, magazyn bloków, nieskończone przewijanie |
| `noise.ts` | Szum Perlina do generacji terenu |
| `types.ts` | Wspólne definicje typów |
| `constants.ts` | Stałe strojenia |
| `audio.ts` | Efekty dźwiękowe |
| `postproc.ts` | Efekty post-processingu |

## Pipeline renderowania (`src/render/`)

| Moduł | Odpowiedzialność |
|---|---|
| `AmbientAtmosphere.ts` | Renderowanie nieba/atmosfery |
| `ParticleEffects.ts` | Cząsteczki (dym, iskry, obrażenia) |
| `PollutionOverlay.ts` | Wizualizacja zanieczyszczenia |
| `ScreenEffects.ts` | Efekty przestrzeni ekranu |
| `SpriteManager.ts` | Zarządzanie atlasem sprite'ów |
| `WeatherSystem.ts` | Symulacja pogody |
| `utils.ts` | Pomocnicze funkcje renderowania |

## Usługi (`src/services/`)

| Usługa | Odpowiedzialność |
|---|---|
| `auth` | Integracja autoryzacji Supabase |
| `coop` | Multiplayer co-op przez Supabase Realtime |
| `trade` | Handel graczy (checkout z opłatą Stripe za transakcje) |

## Podejście do renderowania

Renderer jest zorganizowany jako osobne metody rysowania (niebo, ziemia,
encje, cząsteczki, liczby obrażeń, …) zamiast monolitowego wywołania draw —
dzięki temu każdy przebieg jest tani i łatwy do debugowania. Chunki świata
są przycinane do widocznego obszaru podczas przewijania. Pipeline
renderowania jest dodatkowo podzielony na dedykowane moduły (atmosfera,
cząsteczki, zanieczyszczenie, pogoda) nakładane na bazowy canvas.

## Nakładka UI

React 18 renderuje interfejs na canvasie: pełnoekranowy routing
(Auth → Start → Gra), menu budowania, panel czatu, sklep, statystyki
i ustawienia. Stan płynie z silnika do Reacta przez wspólny most
stanu gry.

## Rygorystyczność TypeScript

`tsconfig.app.json` działa z typowaniem `strict`; projekt waliduje
`tsc --noEmit` (`npm run typecheck`) i lintuje ESLintem (`npm run lint`).

## Skrypty

| Skrypt | Cel |
|---|---|
| `npm run dev` | Serwer dev Vite |
| `npm run build` | Build produkcyjny |
| `npm run typecheck` | Walidacja TypeScript |
| `npm run lint` | ESLint |
| `npm run preview` | Build + lokalny podgląd Wrangler |
| `npm run deploy` | Build + `wrangler deploy` (Cloudflare) |
| `npm run easter-egg` | Skrypt generatora easter eggów |

## Cel wdrożenia

Gra buduje się Vite i wdraża na **Cloudflare** przez Wrangler
(`wrangler.jsonc`), z Supabase jako backendem.
