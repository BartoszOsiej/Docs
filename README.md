# Bartosz Osiej — Docs

Central documentation hub for all projects — [FastAPI-url](https://github.com/BartoszOsiej/FastAPI-url)
(LinkShort), [Factorio-web-game](https://github.com/BartoszOsiej/Factorio-web-game)
(Novactorio), [NV2_ENGINE](https://github.com/BartoszOsiej/NV2_ENGINE),
[AURORA-OS](https://github.com/BartoszOsiej/AURORA-OS),
[cybersec-tools](https://github.com/BartoszOsiej/cybersec-tools),
[halcyon-process-monitor](https://github.com/BartoszOsiej/halcyon-process-monitor),
[Externum](https://github.com/BartoszOsiej/externum) and
[N2-Mesh](https://github.com/BartoszOsiej/n2-mesh) —
published as a static site on GitHub Pages.

**Live site:** <https://bartoszosiej.github.io/Docs/>

> 🇵🇱 Ten dokument ma też wersję polską: [README.pl.md](README.pl.md)

## 🌍 Bilingual

The site is fully bilingual:

- **English** is the default locale (root paths, e.g. `/Docs/projects/`).
- **Polish** lives under `/Docs/pl/…` (e.g. `/Docs/pl/projects/`).
- A language switcher in the navbar toggles between them; every page has a
  matching translation.

## 📖 PDF Book & Translator

A built-in module reads PDFs as **visual books** (two-page spreads, spine,
3D page-flip) and translates pages **in the browser without any API key**:

- pdf.js renders pages; the worker + standard fonts are vendored in
  `static/pdfjs/` (no CDN).
- Translation uses keyless, CORS-enabled providers — Google's public
  endpoint first, MyMemory as fallback. A Microsoft Translator (Azure)
  provider is included behind the same interface if you ever want to plug
  in a key.
- Live demo: <https://bartoszosiej.github.io/Docs/translator>

## Tech

- [Docusaurus](https://docusaurus.dev/) — Vue-powered static site generator
  (i18n via `locales` in `.docusaurus/docusaurus.config.ts`)
- [pdf.js](https://mozilla.github.io/pdf.js/) — PDF rendering for the book viewer
- WebRTC + MQTT — power [N2 Mesh](https://bartoszosiej.github.io/n2-mesh/), the P2P chat (its own repo: `BartoszOsiej/n2-mesh`)
- Deployed via GitHub Actions → GitHub Pages

## Local development

```bash
npm install
npm run start           # dev server with hot reload
npm run build           # production build to build/
npm run serve           # preview the production build
```

`prebuild` automatically regenerates the sample PDFs
(`scripts/gen-sample-pdfs.mjs`), copies the pdf.js worker/fonts/cmaps into
`static/pdfjs/` (`scripts/copy-pdfjs.mjs`), and refreshes `llms-full.txt`
(`scripts/gen-llms-full.py`).

## Regenerating derived files

- `sitemap.xml` — generated automatically by the Docusaurus sitemap plugin
- `static/llms-full.txt` — run `scripts/gen-llms-full.py`
- `static/pdfs/sample-*.pdf` — run `scripts/gen-sample-pdfs.mjs`

## Project structure

```
Docs/
├── src/pages/index.tsx           # Landing page (EN + PL, locale-aware)
├── i18n/pl/                      # Polish locale — every page mirrored
│   └── docusaurus-plugin-content-docs/current/
│       ├── projects/…
│       └── translator.md
├── docs/
│   ├── translator.md             # PDF Book & Translator demo (EN)
├── update-flow.md                # Which repos publish updates here
├── projects/
│   ├── fastapi-url/              # LinkShort docs (4 pages)
│   ├── factorio-web-game/        # Novactorio docs (4 pages)
│   ├── nv2-engine/               # NV2 Engine docs (10 pages)
│   ├── cybersec-tools/           # Cybersec Toolkit docs (5 pages)
│   ├── aurora-os/                # AURORA OS docs (3 pages)
│   ├── halcyon-process-monitor/  # Halcyon docs (2 pages)
│   ├── externum/                 # Externum language docs (5 pages)
│   └── n2-mesh/                  # N2 Mesh P2P chat docs (2 pages)
├── static/
│   ├── pdfs/                     # Sample PDFs for the translator demo
│   ├── pdfjs/                    # Vendored pdf.js worker, fonts, cmaps
│   └── llms.txt / llms-full.txt  # AI-readable content index + snapshot
├── scripts/                      # llms-full / sample-PDF generators
└── src/
    ├── components/               # React components (PdfBookViewer, ProjectCard…)
    ├── lib/translator.ts         # Keyless translation providers
    ├── pages/index.tsx           # Bilingual landing page
    ├── theme/MDXComponents.tsx   # Global MDX component registration
    └── css/custom.css            # Aurora theme, glassmorphism, typography
```

## Publishing

Push to `main` — GitHub Actions builds the site and deploys it automatically.

See [Update Flow](https://bartoszosiej.github.io/Docs/update-flow) for
the full update map between source repositories and this site.
