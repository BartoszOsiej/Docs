# Bartosz Osiej — Docs

Centralne centrum dokumentacji wszystkich projektów —
[FastAPI-url](https://github.com/BartoszOsiej/FastAPI-url) (LinkShort),
[Factorio-web-game](https://github.com/BartoszOsiej/Factorio-web-game)
(Novactorio), [NV2_ENGINE](https://github.com/BartoszOsiej/NV2_ENGINE),
[AURORA-OS](https://github.com/BartoszOsiej/AURORA-OS),
[cybersec-tools](https://github.com/BartoszOsiej/cybersec-tools),
[halcyon-process-monitor](https://github.com/BartoszOsiej/halcyon-process-monitor),
[Externum](https://github.com/BartoszOsiej/externum) oraz
[N2-Mesh](https://github.com/BartoszOsiej/n2-mesh) —
publikowane jako statyczna witryna na GitHub Pages.

**Witryna na żywo:** <https://bartoszosiej.github.io/Docs/>

> 🇬🇧 This document is also available in English: [README.md](README.md)

## 🌍 Dwujęzyczność

Witryna jest w pełni dwujęzyczna:

- **Angielski** to domyślna lokalizacja (ścieżki główne, np. `/Docs/projects/`).
- **Polski** żyje pod `/Docs/pl/…` (np. `/Docs/pl/projects/`).
- Przełącznik języka w pasku nawigacji przełącza między nimi; każda strona
  ma dopasowane tłumaczenie.

## 📖 Książka PDF i Tłumacz

Wbudowany moduł czyta PDF-y jako **wizualne książki** (rozkładówki dwóch
stron, grzbiet, trójwymiarowe przewracanie kartek) i tłumaczy strony
**w przeglądarce bez żadnego klucza API**:

- pdf.js renderuje strony; worker i standardowe fonty są wgrane w
  `public/pdfjs/` (bez CDN).
- Tłumaczenie używa darmowych providerów z CORS — najpierw publiczny
  endpoint Google, fallback MyMemory. Provider Microsoft Translator
  (Azure) jest zawarty za tym samym interfejsem, gdybyś chciał kiedyś
  podpiąć klucz.
- Demo na żywo: <https://bartoszosiej.github.io/Docs/translator>

## Technologia

- [VitePress](https://vitepress.dev/) — generator statycznych witryn oparty o Vue
  (i18n przez `locales` w `.vitepress/config.mts`)
- [pdf.js](https://mozilla.github.io/pdf.js/) — renderowanie PDF dla czytnika książek
- WebRTC + MQTT — napędzają [N2 Mesh](https://bartoszosiej.github.io/n2-mesh/), czat P2P (własne repo: `BartoszOsiej/n2-mesh`)
- Wdrażane przez GitHub Actions → GitHub Pages

## Rozwój lokalny

```bash
npm install
npm run docs:dev        # serwer dev z hot reload
npm run docs:build      # build produkcyjny do .vitepress/dist
npm run docs:preview    # podgląd buildu produkcyjnego
```

`predocs:dev` / `predocs:build` automatycznie regenerują przykładowe PDF-y
(`scripts/gen-sample-pdfs.mjs`) i kopiują worker/fonty/cmaps pdf.js do
`public/pdfjs/` (`scripts/copy-pdfjs.mjs`).

## Regenerowanie plików pochodnych

- `public/sitemap.xml` — uruchom `scripts/gen-sitemap.py`
- `public/llms-full.txt` — uruchom `scripts/gen-llms-full.py`
- `public/pdfs/sample-*.pdf` — uruchom `scripts/gen-sample-pdfs.mjs`

## Struktura projektu

```
Docs/
├── index.md                      # Strona główna (EN)
├── pl/                           # Lokalizacja polska — każda strona zdublowana
│   ├── index.md
│   ├── projects/…
│   └── translator.md
├── translator.md                 # Demo Książki PDF i Tłumacza (EN)
├── update-flow.md                # Które repo publikują tu aktualizacje
├── projects/
│   ├── fastapi-url/              # Dokumentacja LinkShort (4 strony)
│   ├── factorio-web-game/        # Dokumentacja Novactorio (4 strony)
│   ├── nv2-engine/               # Dokumentacja NV2 Engine (10 stron)
│   ├── cybersec-tools/           # Dokumentacja Cybersec Toolkit (5 stron)
│   ├── aurora-os/                # Dokumentacja AURORA OS (3 strony)
│   ├── halcyon-process-monitor/  # Dokumentacja Halcyon (2 strony)
│   ├── externum/                 # Dokumentacja języka Externum (5 stron)
│   └── n2-mesh/                  # Dokumentacja czatu P2P N2 Mesh (2 strony)
├── public/
│   ├── pdfs/                     # Przykładowe PDF-y do demo tłumacza
│   └── pdfjs/                    # Wgrany worker pdf.js, fonty, cmaps
├── scripts/                      # Generatory sitemap / llms-full / przykładowych PDF
└── .vitepress/
    ├── config.mts                # Konfiguracja witryny, locales, nav, sidebar, wyszukiwarka
    └── theme/
        ├── translator.ts         # Darmowe providery tłumaczeń
        └── components/
            └── PdfBookViewer.vue # Wizualny czytnik książek PDF + tłumacz
```

## Publikacja

Push na `main` — GitHub Actions buduje witrynę i wdraża ją automatycznie.

Zobacz [Przepływ aktualizacji](https://bartoszosiej.github.io/Docs/pl/update-flow),
aby poznać pełną mapę aktualizacji między repozytoriami źródłowymi a tą witryną.
