# Bartosz Osiej — Docs

Central documentation hub for the [FastAPI-url](https://github.com/BartoszOsiej/FastAPI-url)
(LinkShort) and [Factorio-web-game](https://github.com/BartoszOsiej/Factorio-web-game)
(Novactorio) projects, published as a static site on GitHub Pages.

**Live site:** <https://bartoszosiej.github.io/Docs/>

## Tech

- [VitePress](https://vitepress.dev/) — Vue-powered static site generator
- Deployed via GitHub Actions → GitHub Pages

## Local development

```bash
npm install
npm run docs:dev        # dev server with hot reload
npm run docs:build      # production build to .vitepress/dist
npm run docs:preview    # preview the production build
```

## Project structure

```
Docs/
├── index.md                      # Landing page
├── update-flow.md                # Which repos publish updates here
├── projects/
│   ├── fastapi-url/              # LinkShort docs (4 pages)
│   └── factorio-web-game/        # Novactorio docs (4 pages)
├── public/                       # Static assets (logo, hero, favicon)
├── .vitepress/config.mts         # Site config, nav, sidebar, search
└── .github/workflows/deploy.yml  # Pages deployment
```

## Publishing

Push to `main` — GitHub Actions builds the site and deploys it automatically.

See [Update Flow](https://bartoszosiej.github.io/Docs/update-flow.html) for
the full update map between source repositories and this site.
