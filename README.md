# Bartosz Osiej — Docs

Central documentation hub for all projects — [FastAPI-url](https://github.com/BartoszOsiej/FastAPI-url)
(LinkShort), [Factorio-web-game](https://github.com/BartoszOsiej/Factorio-web-game)
(Novactorio), [NV2_ENGINE](https://github.com/BartoszOsiej/NV2_ENGINE),
[AURORA-OS](https://github.com/BartoszOsiej/AURORA-OS),
[cybersec-tools](https://github.com/BartoszOsiej/cybersec-tools),
[halcyon-process-monitor](https://github.com/BartoszOsiej/halcyon-process-monitor),
[Externum](https://github.com/BartoszOsiej/Externum) and
[factory_defense](https://github.com/BartoszOsiej/factory_defense) —
published as a static site on GitHub Pages.

**Live site:** <https://bartoszosiej.github.io/Docs/>

## Tech

- [VitePress](https://vitepress.dev/) — Vue-powered static site generator
- [WebTorrent](https://webtorrent.io/) — powers the [P2P chat](https://bartoszosiej.github.io/Docs/chat/)
- Deployed via GitHub Actions → GitHub Pages

## Local development

```bash
npm install
npm run docs:dev        # dev server with hot reload
npm run docs:build      # production build to .vitepress/dist
npm run docs:preview    # preview the production build
```

## Regenerating derived files

- `public/sitemap.xml` — run `scripts/gen-sitemap.py`
- `public/llms-full.txt` — run `scripts/gen-llms-full.py`

## Project structure

```
Docs/
├── index.md                      # Landing page
├── update-flow.md                # Which repos publish updates here
├── projects/
│   ├── fastapi-url/              # LinkShort docs (4 pages)
│   ├── factorio-web-game/        # Novactorio docs (4 pages)
│   ├── nv2-engine/               # NV2 Engine docs (10 pages)
│   ├── cybersec-tools/           # Cybersec Toolkit docs (5 pages)
│   ├── aurora-os/                # AURORA OS docs (3 pages)
│   ├── halcyon-process-monitor/  # Halcyon docs (2 pages)
│   ├── externum/                 # Externum language docs (5 pages)
│   └── factory-defense/          # Factory Defense docs (1 page)
├── public/                       # Static assets (logo, hero, favicon, chat/)
│   └── chat/                     # P2P chat app (WebTorrent, no build step)
├── scripts/                      # Sitemap / llms-full generators
├── .vitepress/config.mts         # Site config, nav, sidebar, search
└── .github/workflows/deploy.yml  # Pages deployment
```

## Publishing

Push to `main` — GitHub Actions builds the site and deploys it automatically.

See [Update Flow](https://bartoszosiej.github.io/Docs/update-flow) for
the full update map between source repositories and this site.
