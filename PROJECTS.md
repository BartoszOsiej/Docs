# 📁 Project Registry — Bartosz Osiej

> **Central, always-current registry of every project we build and maintain.**
> This file is the single source of truth: repo → what it is → where the docs live.
> Rendered on the site at **https://bartoszosiej.github.io/Docs/projects/**

Every project listed here is live on GitHub (owner **BartoszOsiej**), documented
on this site, and maintained in the working copy at `~/`.

---

## 🔗 Repo map (at a glance)

| # | Project | Repo | Stack | Docs page |
|---|---------|------|-------|-----------|
| 1 | **Docs Hub + P2P Chat** | [BartoszOsiej/Docs](https://github.com/BartoszOsiej/Docs) | VitePress, WebTorrent | [docs](/) · [chat](/chat/) |
| 2 | **LinkShort** (URL shortener) | [BartoszOsiej/FastAPI-url](https://github.com/BartoszOsiej/FastAPI-url) | FastAPI, React 19, SQLite | [docs](/projects/fastapi-url/) |
| 3 | **Novactorio** (factory game) | [BartoszOsiej/Factorio-web-game](https://github.com/BartoszOsiej/Factorio-web-game) | TypeScript, Canvas 2D, Supabase | [docs](/projects/factorio-web-game/) |
| 4 | **NV2 Engine** (Rust voxel) | [BartoszOsiej/NV2_ENGINE](https://github.com/BartoszOsiej/NV2_ENGINE) | Rust, wgpu, AI vegetation | [docs](/projects/nv2-engine/) |
| 5 | **AURORA OS** (browser OS) | [BartoszOsiej/AURORA-OS](https://github.com/BartoszOsiej/AURORA-OS) | TypeScript, zero deps | [docs](/projects/aurora-os/) |
| 6 | **Cybersec Toolkit** | [BartoszOsiej/cybersec-tools](https://github.com/BartoszOsiej/cybersec-tools) | Rust, pcap, openssl | [docs](/projects/cybersec-tools/) |
| 7 | **Halcyon Process Monitor** | [BartoszOsiej/halcyon-process-monitor](https://github.com/BartoszOsiej/halcyon-process-monitor) | Rust, eBPF, Aya, ratatui | [docs](/projects/halcyon-process-monitor/) |
| 8 | **Externum** (programming language) | [BartoszOsiej/Externum](https://github.com/BartoszOsiej/Externum) | Python, own lexer/parser/compiler | [docs](/projects/externum/) |
| 9 | **Factory Defense** (Rust game) | [BartoszOsiej/factory_defense](https://github.com/BartoszOsiej/factory_defense) | Rust, macroquad | [docs](/projects/factory-defense/) |

---

## 1. Docs Hub + P2P Chat — `BartoszOsiej/Docs`

| | |
|---|---|
| **What** | This documentation site + the serverless P2P chat. Built with VitePress, deployed to GitHub Pages. |
| **P2P Chat** | Torrent-principle messenger that works on **static hosting** — no server, no database. Room = torrent **infohash**; every peer seeds the same blob and joins a WebTorrent swarm. Messages travel over the **BitTorrent extended protocol** (custom `NV2` extension) with a send queue until the extended handshake completes — nothing is lost. |
| **Stack** | VitePress, WebTorrent, vanilla JS, GitHub Actions |
| **Local path** | `~/Docs` |
| **Live** | https://bartoszosiej.github.io/Docs/ · chat at https://bartoszosiej.github.io/Docs/chat/ |
| **Notes** | `llms.txt` / `llms-full.txt` / `sitemap.xml` generated from the page tree. Update flow documented in `update-flow.md`. |

## 2. LinkShort — `BartoszOsiej/FastAPI-url`

| | |
|---|---|
| **What** | Production-ready URL shortener: shorten, manage, track clicks. JWT auth, per-user links, analytics. |
| **Stack** | Python 3.12, FastAPI 0.115, React 19, Tailwind 4, SQLite, Docker, Fly.io |
| **Local path** | `~/FastAPI-url` |
| **Docs** | [/projects/fastapi-url/](/projects/fastapi-url/) — Overview, Getting Started, API Reference, Deployment |

## 3. Novactorio — `BartoszOsiej/Factorio-web-game`

| | |
|---|---|
| **What** | Browser factory-automation game inspired by Factorio, written from scratch with a hand-rolled Canvas 2D engine. Co-op multiplayer, 23 languages, Stripe premium. |
| **Stack** | TypeScript 5.5 (strict), React 18, Vite 6, Supabase, Stripe, Deno Edge Functions, Cloudflare |
| **Local path** | `~/Factorio-web-game` |
| **Docs** | [/projects/factorio-web-game/](/projects/factorio-web-game/) — Overview, Architecture, Gameplay, Backend & Monetization |

## 4. NV2 Engine — `BartoszOsiej/NV2_ENGINE`

| | |
|---|---|
| **What** | Native Rust voxel engine with AI-driven procedural worlds: wgpu rendering, 97 block types, 9 biomes, water simulation, and a neural network that learns vegetation placement while you play. |
| **Stack** | Rust (nightly), wgpu, OpenSimplex2, MLP, Vulkan |
| **Local path** | `~/NV2_ENGINE` |
| **Docs** | [/projects/nv2-engine/](/projects/nv2-engine/) |

## 5. AURORA OS — `BartoszOsiej/AURORA-OS`

| | |
|---|---|
| **What** | A complete operating system running in the browser: TypeScript kernel, window manager, virtual filesystem, 37-command shell, 8 apps, themes and procedural audio. Zero runtime dependencies, no frameworks, no server. |
| **Stack** | TypeScript, zero runtime dependencies, Vite |
| **Local path** | `~/halcyon-process-monitor/aurora-os` |
| **Docs** | [/projects/aurora-os/](/projects/aurora-os/) — Overview, Architecture, User Guide |

## 6. Cybersec Toolkit — `BartoszOsiej/cybersec-tools`

| | |
|---|---|
| **What** | Four focused Rust security tools: **NetRecon** (TCP scanner), **ShadowScan** (web vulnerability scanner), **HashSleuth** (hash cracker), **PacketEye** (pcap analyzer). |
| **Stack** | Rust, clap, tokio, pcap, openssl |
| **Local path** | `~/cybersec-tools` |
| **Docs** | [/projects/cybersec-tools/](/projects/cybersec-tools/) |

## 7. Halcyon Process Monitor — `BartoszOsiej/halcyon-process-monitor`

| | |
|---|---|
| **What** | Real-time eBPF-based process and file-operation telemetry for Linux: `execve`/`openat` tracepoints, per-CPU perf buffers, 1-second sliding-window ransomware heuristic, live ratatui TUI, JSON/plain output, self-diagnostic. |
| **Stack** | Rust, eBPF (Aya), ratatui, crossterm, nightly toolchain for the BPF crate |
| **Local path** | `~/halcyon-process-monitor` |
| **Docs** | [/projects/halcyon-process-monitor/](/projects/halcyon-process-monitor/) — Overview + Architecture |

## 8. Externum — `BartoszOsiej/Externum`

| | |
|---|---|
| **What** | Our own programming language — Python readability, binary performance and Bash control from a single source. Full lexer → parser → compiler → runtime pipeline in Python. Compiles to **Python, native binary and Bash**; also runs directly (interpreter + REPL). |
| **Features (v3.0 "Sentient")** | Classes + inheritance, exceptions, imports of `.ext` modules, lambdas, comprehensions, generators, f-strings, ternary, tuple unpacking, `with/assert/del/global`, bitwise operators, multi-line literals, stdlib (`structs`, `strings`, `fs`, `mathx`) written in Externum itself. |
| **Stack** | Python 3, own lexer/parser/compiler/runtime, zero deps |
| **Local path** | `~/Externum` |
| **Docs** | [/projects/externum/](/projects/externum/) — Overview, Syntax, Examples, Compiler & CLI, Architecture |
| **Tests** | 118 unit tests, all green |

## 9. Factory Defense — `BartoszOsiej/factory_defense`

| | |
|---|---|
| **What** | Rust factory-building + tower-defense game on macroquad: build factories, manage a city economy, defend against waves. |
| **Stack** | Rust, macroquad |
| **Local path** | `~/factory_defense` |
| **Docs** | [/projects/factory-defense/](/projects/factory-defense/) |

---

## 📌 Not listed here (deliberately)

Smaller / client / one-off projects (Minecraft launchers, landing pages, client
sites) are **not** part of this registry and are not documented on this site.

## 🧭 How to keep this file fresh

1. Add a project only when it is a real, maintained project (see the 9 above).
2. Keep the repo, stack, local path and docs link accurate.
3. Update `/projects/` (site page), `llms.txt`, `llms-full.txt` and
   `sitemap.xml` together with this file (scripts: `scripts/gen-llms*.py`,
   `scripts/gen-sitemap.py`).
