# Update Flow

This page documents **which repositories publish updates to which**, including
how this documentation site stays in sync with the source projects.

## Repository map

| Repository | Owner | Role |
|---|---|---|
| [BartoszOsiej/FastAPI-url](https://github.com/BartoszOsiej/FastAPI-url) | BartoszOsiej (fork of ghost0development) | Source: LinkShort URL shortener |
| [BartoszOsiej/Factorio-web-game](https://github.com/BartoszOsiej/Factorio-web-game) | BartoszOsiej | Source: Novactorio browser game |
| [BartoszOsiej/NV2_ENGINE](https://github.com/BartoszOsiej/NV2_ENGINE) | BartoszOsiej | Source: NV2 Engine — native Rust voxel game |
| [BartoszOsiej/cybersec-tools](https://github.com/BartoszOsiej/cybersec-tools) | BartoszOsiej | Source: Cybersec Toolkit — 4 Rust security tools |
| [BartoszOsiej/Docs](https://github.com/BartoszOsiej/Docs) | BartoszOsiej | **This site** — GitHub Pages docs hub |

## Update flow diagram

```
┌────────────┐   ┌────────────┐   ┌────────────┐   ┌──────────────┐
│ FastAPI-url│   │ Factorio-  │   │ NV2_ENGINE │   │ cybersec-    │
│ (LinkShort)│   │ web-game   │   │ (NV2 Eng)  │   │ tools        │
└─────┬──────┘   └─────┬──────┘   └─────┬──────┘   └──────┬───────┘
      │ docs updates  │ docs updates   │ docs updates   │ docs updates
      ▼               ▼                ▼                ▼
┌──────────────────────────────────────────────────────────────┐
│                      BartoszOsiej/Docs                       │
│                    (this GitHub Pages site)                  │
└─────────────────────────────┬────────────────────────────────┘
                              │  git push (main)
                              ▼
                    GitHub Actions
                    build + deploy
                              │
                              ▼
              https://bartoszosiej.github.io/Docs/
```

## How updates reach this site

| # | Source repo | What flows in | When |
|---|---|---|---|
| 1 | `FastAPI-url` | API changes, new endpoints, feature updates | When the API or SPA changes |
| 2 | `Factorio-web-game` | Engine/systems/backend documentation changes | When gameplay or backend changes |
| 3 | `NV2_ENGINE` | Engine, AI, gameplay and performance documentation | When the engine changes |
| 4 | `cybersec-tools` | Tool docs, usage, CLI reference | When a tool changes |
| 5 | `Docs` (this repo) | Final rendered site | On every push to `main` |

### Publishing a docs update (source repos)

1. Edit the Markdown under the relevant project's section in `Docs`:
   - `projects/fastapi-url/` — LinkShort
   - `projects/factorio-web-game/` — Novactorio
   - `projects/nv2-engine/` — NV2 Engine
   - `projects/cybersec-tools/` — Cybersec Toolkit
2. Commit to the `Docs` repository and push to `main`.
3. GitHub Actions builds the VitePress site and deploys it to GitHub Pages
   automatically — no manual steps.

> **Note:** The documentation lives in the `Docs` repository (single source of
> truth for the site). The source projects publish *facts* (code changes);
> the docs are *updated* in this repo. If you prefer docs to live next to the
> code, each source repo can hold its own `docs/` folder and a workflow can
> mirror it here — see "Alternative pattern" below.

## Alternative pattern: docs-in-source mirror

If you want documentation to live inside each source repo and auto-sync:

```
FastAPI-url/docs/*.md ──┐
                        ├──► (GitHub Action: copy docs/ → Docs repo) ──► Docs
Factorio-web-game/docs/*.md ──┘
```

A workflow in each source repo would checkout `Docs`, copy its `docs/`
folder, commit, and push. This keeps docs next to the code they describe,
with this site as the rendered output.

## Deployment pipeline (this repo)

| Stage | Detail |
|---|---|
| Static site generator | VitePress (Node.js) |
| Build | `npm run docs:build` |
| Publish | GitHub Actions → `actions/deploy-pages` |
| URL | <https://bartoszosiej.github.io/Docs/> |

## GitHub account note

- `BartoszOsiej` is the current account; `ghost0development` is the older
  account from which `FastAPI-url` was forked.
- Local clones of `FastAPI-url` track `origin` = `BartoszOsiej` and
  `upstream` = `ghost0development` (for pulling upstream fixes).
