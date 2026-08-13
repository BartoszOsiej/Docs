# Przepływ aktualizacji

Ta strona dokumentuje, **które repozytoria publikują aktualizacje do których**,
w tym jak ta witryna dokumentacyjna pozostaje w zgodzie z projektami źródłowymi.

## Mapa repozytoriów

| Repozytorium | Właściciel | Rola |
|---|---|---|
| [BartoszOsiej/FastAPI-url](https://github.com/BartoszOsiej/FastAPI-url) | BartoszOsiej (fork od ghost0development) | Źródło: skracacz URL LinkShort |
| [BartoszOsiej/Factorio-web-game](https://github.com/BartoszOsiej/Factorio-web-game) | BartoszOsiej | Źródło: gra przeglądarkowa Novactorio |
| [BartoszOsiej/NV2_ENGINE](https://github.com/BartoszOsiej/NV2_ENGINE) | BartoszOsiej | Źródło: NV2 Engine — natywna gra wokselowa w Rust |
| [BartoszOsiej/AURORA-OS](https://github.com/BartoszOsiej/AURORA-OS) | BartoszOsiej | Źródło: AURORA OS — system operacyjny w przeglądarce w TypeScript |
| [BartoszOsiej/cybersec-tools](https://github.com/BartoszOsiej/cybersec-tools) | BartoszOsiej | Źródło: Cybersec Toolkit — 4 narzędzia bezpieczeństwa w Rust |
| [BartoszOsiej/halcyon-process-monitor](https://github.com/BartoszOsiej/halcyon-process-monitor) | BartoszOsiej | Źródło: Monitor Procesów Halcyon — telemetria eBPF |
| [BartoszOsiej/externum](https://github.com/BartoszOsiej/externum) | BartoszOsiej | Źródło: język Externum |
| [BartoszOsiej/n2-mesh](https://github.com/BartoszOsiej/n2-mesh) | BartoszOsiej | Źródło: N2 Mesh — czat P2P (własna witryna GitHub Pages) |
| [BartoszOsiej/Docs](https://github.com/BartoszOsiej/Docs) | BartoszOsiej | **Ta witryna** — centrum dokumentacji na GitHub Pages |

## Diagram przepływu aktualizacji

```
┌────────────┐   ┌────────────┐   ┌────────────┐   ┌──────────────┐
│ FastAPI-url│   │ Factorio-  │   │ NV2_ENGINE │   │ cybersec-    │
│ (LinkShort)│   │ web-game   │   │ (NV2 Eng)  │   │ tools        │
└─────┬──────┘   └─────┬──────┘   └─────┬──────┘   └──────┬───────┘
      │ docs updates  │ docs updates   │ docs updates   │ docs updates
      ▼               ▼                ▼                ▼
┌──────────────────────────────────────────────────────────────┐
│                      BartoszOsiej/Docs                       │
│              (ta witryna GitHub Pages)                       │
└─────────────────────────────┬────────────────────────────────┘
                              │  git push (main)
                              ▼
                    GitHub Actions
                    build + deploy
                              │
                              ▼
              https://bartoszosiej.github.io/Docs/
```

## Jak aktualizacje trafiają na tę witrynę

| # | Repozytorium źródłowe | Co wpływa | Kiedy |
|---|---|---|---|
| 1 | `FastAPI-url` | Zmiany API, nowe endpointy, aktualizacje funkcji | Gdy zmienia się API lub SPA |
| 2 | `Factorio-web-game` | Zmiany dokumentacji silnika/systemów/backendu | Gdy zmienia się rozgrywka lub backend |
| 3 | `NV2_ENGINE` | Dokumentacja silnika, AI, rozgrywki i wydajności | Gdy zmienia się silnik |
| 4 | `cybersec-tools` | Dokumentacja narzędzi, użycia, referencja CLI | Gdy zmienia się narzędzie |
| 5 | `halcyon-process-monitor` | Dokumentacja architektury eBPF i użycia | Gdy zmienia się monitor |
| 6 | `Externum` | Specyfikacja języka, składnia, kompilator i runtime | Gdy zmienia się język |
| 7 | `Docs` (to repo) | Finalnie renderowana witryna | Przy każdym pushu na `main` |

### Publikowanie aktualizacji dokumentacji (repozytoria źródłowe)

1. Edytuj Markdown w odpowiedniej sekcji projektu w `Docs`:
   - `projects/fastapi-url/` — LinkShort
   - `projects/factorio-web-game/` — Novactorio
   - `projects/nv2-engine/` — NV2 Engine
   - `projects/cybersec-tools/` — Cybersec Toolkit
   - `projects/halcyon-process-monitor/` — Monitor Procesów Halcyon
   - `projects/externum/` — Externum (5 stron)
2. Zatwierdź zmiany w repozytorium `Docs` i wypchnij na `main`.
3. GitHub Actions buduje witrynę VitePress i automatycznie wdraża ją na
   GitHub Pages — bez ręcznych kroków.

> **Uwaga:** dokumentacja żyje w repozytorium `Docs` (jedno źródło prawdy
> dla witryny). Projekty źródłowe publikują *fakty* (zmiany w kodzie);
> dokumentacja jest *aktualizowana* w tym repo. Jeśli wolisz, aby
> dokumentacja żyła obok kodu, każde repozytorium źródłowe może trzymać
> własny folder `docs/`, a workflow może go tu przenieść — patrz
> „Wariant alternatywny” poniżej.

## Wariant alternatywny: mirror docs-w-kodzie

Jeśli chcesz, aby dokumentacja żyła wewnątrz każdego repozytorium źródłowego
i synchronizowała się automatycznie:

```
FastAPI-url/docs/*.md ──┐
                        ├──► (GitHub Action: kopiuj docs/ → repo Docs) ──► Docs
Factorio-web-game/docs/*.md ──┘
```

Workflow w każdym repozytorium źródłowym pobierałby `Docs`, kopiował swój
folder `docs/`, zatwierdzał i wypychał. To trzyma dokumentację obok kodu,
który opisuje, z tą witryną jako renderowanym wyjściem.

## Pipeline wdrożeniowy (to repo)

| Etap | Szczegóły |
|---|---|
| Generator statycznej witryny | VitePress (Node.js) |
| Build | `npm run docs:build` |
| Publikacja | GitHub Actions → `actions/deploy-pages` |
| URL | <https://bartoszosiej.github.io/Docs/> |

## Uwaga o koncie GitHub

- `BartoszOsiej` to obecne konto; `ghost0development` to starsze konto,
  z którego sklonowano `FastAPI-url`.
- Lokalne klony `FastAPI-url` śledzą `origin` = `BartoszOsiej` i
  `upstream` = `ghost0development` (dla ściągania poprawek z upstreamu).
