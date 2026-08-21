<img src="https://capsule-render.vercel.app/api?type=venom&color=0:0d1117,50:0969da,100:a371f7&height=140&section=header&text=Bartosz%20Osiej%20%C2%B7%20Docs&fontSize=34&fontColor=fff&desc=central%20documentation%20hub%20%C2%B7%20bilingual%20EN%2FPL%20%C2%B7%20PDF%20book%20viewer%20with%20keyless%20translation&descSize=14&descAlignY=72" width="100%" />

<div align="center">

[![npm](https://img.shields.io/npm/v/bartosz-osiej-docs?style=for-the-badge&logo=nodedotjs)](https://www.npmjs.com/package/bartosz-osiej-docs)
[![GHCR](https://img.shields.io/badge/GHCR-image-2496ED?style=for-the-badge&logo=docker)](https://github.com/BartoszOsiej/Docs/pkgs/container/docs)
[![Live](https://img.shields.io/badge/live-GitHub_Pages-2ea043?style=for-the-badge&logo=githubpages)](https://bartoszosiej.github.io/Docs/)
![Docusaurus](https://img.shields.io/badge/Docusaurus-3-FF6B35?style=for-the-badge&logo=docusaurus)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/BartoszOsiej/Docs/badge)](https://securityscorecards.dev/viewer/?uri=github.com/BartoszOsiej/Docs)

**Central documentation hub for every project — published as a bilingual
static site with a built-in PDF book viewer and keyless in-browser translation.**

**→ [bartoszosiej.github.io/Docs](https://bartoszosiej.github.io/Docs/)**

</div>

## 📖 Covered projects

| Project | Docs pages |
|---|---|
| [FastAPI-url](https://github.com/BartoszOsiej/FastAPI-url) (LinkShort) | 4 |
| [Factorio-web-game](https://github.com/BartoszOsiej/Factorio-web-game) (Novactorio) | 4 |
| [NV2_ENGINE](https://github.com/BartoszOsiej/NV2_ENGINE) | 10 |
| [cybersec-tools](https://github.com/BartoszOsiej/cybersec-tools) | 5 |
| [AURORA-OS](https://github.com/BartoszOsiej/AURORA-OS) | 3 |
| [halcyon-process-monitor](https://github.com/BartoszOsiej/halcyon-process-monitor) | 2 |
| [externum](https://github.com/BartoszOsiej/externum) | 5 |
| [n2-mesh](https://github.com/BartoszOsiej/n2-mesh) | 2 |

## 🌍 Bilingual

- **English** is the default locale (root paths, e.g. `/Docs/projects/`)
- **Polish** lives under `/Docs/pl/…`
- A language switcher in the navbar toggles between them; every page has a matching translation

> 🇵🇱 Ten dokument ma też wersję polską: [README.pl.md](README.pl.md)

<details>
<summary><b>📕 PDF Book & Translator — the cool part</b></summary>

A built-in module reads PDFs as **visual books** (two-page spreads, spine,
3D page-flip) and translates pages **in the browser without any API key**:

- pdf.js renders pages; worker + standard fonts are vendored in `static/pdfjs/` (no CDN)
- Translation uses keyless, CORS-enabled providers — Google's public endpoint first, MyMemory as fallback; an Azure Translator provider is included behind the same interface
- **Live demo:** <https://bartoszosiej.github.io/Docs/translator>

</details>

<details>
<summary><b>🛠️ Tech & local development</b></summary>

```bash
npm install
npm run start           # dev server with hot reload
npm run build           # production build to build/
npm run serve           # preview the production build
```

`prebuild` automatically regenerates sample PDFs, copies pdf.js assets, and refreshes `llms-full.txt`.

- [Docusaurus](https://docusaurus.dev/) static site generator
- [pdf.js](https://mozilla.github.io/pdf.js/) for the book viewer
- Deployed via GitHub Actions → GitHub Pages

</details>

<details>
<summary><b>📁 Project structure</b></summary>

```
Docs/
├── docs/
│   ├── translator.md             # PDF Book & Translator demo (EN)
│   └── projects/                 # per-project documentation
├── i18n/pl/                      # Polish locale — every page mirrored
├── static/
│   ├── pdfs/                     # Sample PDFs for the translator demo
│   ├── pdfjs/                    # Vendored pdf.js worker, fonts, cmaps
│   └── llms.txt / llms-full.txt  # AI-readable content index + snapshot
├── scripts/                      # llms-full / sample-PDF generators
└── src/
    ├── components/               # PdfBookViewer, ProjectCard…
    ├── lib/translator.ts         # Keyless translation providers
    └── css/custom.css            # Aurora theme, glassmorphism
```

</details>

---

<div align="center">

**Part of [BartoszOsiej](https://github.com/BartoszOsiej)'s portfolio**

MIT © 2026 Bartosz Osiej

</div>
