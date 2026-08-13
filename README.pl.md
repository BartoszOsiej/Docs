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
  `static/pdfjs/` (bez CDN).
- Tłumaczenie używa darmowych providerów z CORS — najpierw publiczny
  endpoint Google, fallback MyMemory. Provider Microsoft Translator
  (Azure) jest zawarty za tym samym interfejsem, gdybyś chciał kiedyś
  podpiąć klucz.
- Demo na żywo: <https://bartoszosiej.github.io/Docs/translator>

## Technologia

- [Docusaurus](https://docusaurus.dev/) — generator statycznych witryn oparty o Vue
  (i18n przez `locales` w `.docusaurus/docusaurus.config.ts`)
- [pdf.js](https://mozilla.github.io/pdf.js/) — renderowanie PDF dla czytnika książek
- WebRTC + MQTT — napędzają [N2 Mesh](https://bartoszosiej.github.io/n2-mesh/), czat P2P (własne repo: `BartoszOsiej/n2-mesh`)
- Wdrażane przez GitHub Actions → GitHub Pages

## Rozwój lokalny

```bash
npm install
npm run start          # serwer dev z hot reload
npm run build           # build produkcyjny do build/
npm run serve           # podgląd buildu produkcyjnego
```

`prebuild` automatycznie regeneruje przykładowe PDF-y
(`scripts/gen-sample-pdfs.mjs`), kopiuje worker/fonty/cmaps pdf.js do
`static/pdfjs/` (`scripts/copy-pdfjs.mjs`) i odświeża `llms-full.txt`
(`scripts/gen-llms-full.py`).

## Regenerowanie plików pochodnych

- `sitemap.xml` — generowany automatycznie przez plugin sitemap Docusaurus
- `static/llms-full.txt` — uruchom `scripts/gen-llms-full.py`
- `static/pdfs/sample-*.pdf` — uruchom `scripts/gen-sample-pdfs.mjs`

## Struktura projektu

```
Docs/
├── src/pages/index.tsx           # Strona główna (EN + PL, zależna od locale)
├── i18n/pl/                      # Lokalizacja polska — każda strona zdublowana
│   └── docusaurus-plugin-content-docs/current/
│       ├── projects/…
│       └── translator.md
├── docs/
│   ├── translator.md             # Demo Książki PDF i Tłumacza (EN)
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
└── .docusaurus/
    ├── docusaurus.config.ts                # Konfiguracja witryny, locales, nav, sidebar, wyszukiwarka
    └── theme/
        ├── translator.ts         # Darmowe providery tłumaczeń
        └── components/
            └── PdfBookViewer.tsx # Wizualny czytnik książek PDF + tłumacz
```

## Publikacja

Push na `main` — GitHub Actions buduje witrynę i wdraża ją automatycznie.

Zobacz [Przepływ aktualizacji](https://bartoszosiej.github.io/Docs/pl/update-flow),
aby poznać pełną mapę aktualizacji między repozytoriami źródłowymi a tą witryną.
