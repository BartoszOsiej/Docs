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
| 1 | **Docs Hub** | [BartoszOsiej/Docs](https://github.com/BartoszOsiej/Docs) | Docusaurus | [docs](/) |
| 2 | **N2 Mesh** (P2P chat) | [BartoszOsiej/n2-mesh](https://github.com/BartoszOsiej/n2-mesh) | WebRTC, static | [docs](/projects/n2-mesh/) · [live](https://bartoszosiej.github.io/n2-mesh/) |
| 3 | **LinkShort** (URL shortener) | [BartoszOsiej/FastAPI-url](https://github.com/BartoszOsiej/FastAPI-url) | FastAPI, React 19, SQLite | [docs](/projects/fastapi-url/) |
| 4 | **Novactorio** (factory game) | [BartoszOsiej/Factorio-web-game](https://github.com/BartoszOsiej/Factorio-web-game) | TypeScript, Canvas 2D, Supabase | [docs](/projects/factorio-web-game/) |
| 5 | **NV2 Engine** (Rust voxel) | [BartoszOsiej/NV2_ENGINE](https://github.com/BartoszOsiej/NV2_ENGINE) | Rust, wgpu, AI vegetation | [docs](/projects/nv2-engine/) |
| 6 | **AURORA OS** (browser OS) | [BartoszOsiej/AURORA-OS](https://github.com/BartoszOsiej/AURORA-OS) | TypeScript, zero deps | [docs](/projects/aurora-os/) |
| 7 | **Cybersec Toolkit** | [BartoszOsiej/cybersec-tools](https://github.com/BartoszOsiej/cybersec-tools) | Rust, pcap, openssl | [docs](/projects/cybersec-tools/) |
| 8 | **Talus Process Monitor** | [BartoszOsiej/talus-process-monitor](https://github.com/BartoszOsiej/talus-process-monitor) | Rust, eBPF, Aya, FrankenTUI | [docs](/projects/talus-process-monitor/) |
| 9 | **Externum** (programming language) | [BartoszOsiej/externum](https://github.com/BartoszOsiej/externum) | Python, own lexer/parser/compiler | [docs](/projects/externum/) |
| 10 | **pqguard** (post-quantum encryption) | [BartoszOsiej/pqguard](https://github.com/BartoszOsiej/pqguard) | Rust, ML-KEM-768, AES-256-GCM | [docs](/projects/pqguard/) |
| 11 | **Solana Validator** | [BartoszOsiej/solana-validator](https://github.com/BartoszOsiej/solana-validator) | Rust, PoH, Tower BFT, Turbine | [docs](/projects/solana-validator/) |
| 12 | **Prompt Inbox** | [BartoszOsiej/prompt-inbox](https://github.com/BartoszOsiej/prompt-inbox) | HTML, GitHub Issues, Agent Workflow | [docs](/projects/prompt-inbox/) |

---

## 1. Docs Hub — `BartoszOsiej/Docs`

| | |
|---|---|
| **What** | This documentation site + project registry. Built with Docusaurus, deployed to GitHub Pages. |
| **Stack** | Docusaurus, GitHub Actions |
| **Local path** | `~/Docs` |
| **Live** | https://bartoszosiej.github.io/Docs/ |
| **Notes** | `llms.txt` / `llms-full.txt` / `sitemap.xml` generated from the page tree. Update flow documented in `update-flow.md`. |

## 2. N2 Mesh (P2P Chat) — `BartoszOsiej/n2-mesh`

| | |
|---|---|
| **What** | WebRTC messenger that works on **static hosting** — no server, no database. Room = signaling **topic**; peers announce their presence on a public MQTT broker and connect directly over **WebRTC data channels** (classic signaling-server pattern), with the MQTT topic doubling as an automatic fallback on networks that block WebRTC (mobile CGNAT). Recipients deduplicate by message id — nothing is lost. Same-browser tabs connect via a `BroadcastChannel` local bridge. |
| **Stack** | Native WebRTC, own MQTT 3.1.1 client (~100 lines, no libs), vanilla JS |
| **Local path** | `~/N2-Mesh` |
| **Docs** | [/projects/n2-mesh/](/projects/n2-mesh/) — Overview + Architecture |
| **Live** | https://bartoszosiej.github.io/n2-mesh/ |

## 3. LinkShort — `BartoszOsiej/FastAPI-url`

| | |
|---|---|
| **What** | Production-ready URL shortener: shorten, manage, track clicks. JWT auth, per-user links, analytics. |
| **Stack** | Python 3.12, FastAPI 0.115, React 19, Tailwind 4, SQLite, Docker, Fly.io |
| **Local path** | `~/FastAPI-url` |
| **Docs** | [/projects/fastapi-url/](/projects/fastapi-url/) — Overview, Getting Started, API Reference, Deployment |

## 4. Novactorio — `BartoszOsiej/Factorio-web-game`

| | |
|---|---|
| **What** | Browser factory-automation game inspired by Factorio, written from scratch with a hand-rolled Canvas 2D engine. Co-op multiplayer, 23 languages, Stripe premium. |
| **Stack** | TypeScript 5.5 (strict), React 18, Vite 6, Supabase, Stripe, Deno Edge Functions, Cloudflare |
| **Local path** | `~/Factorio-web-game` |
| **Docs** | [/projects/factorio-web-game/](/projects/factorio-web-game/) — Overview, Architecture, Gameplay, Backend & Monetization |

## 5. NV2 Engine — `BartoszOsiej/NV2_ENGINE`

| | |
|---|---|
| **What** | Native Rust voxel engine with AI-driven procedural worlds: wgpu rendering, 97 block types, 9 biomes, water simulation, and a neural network that learns vegetation placement while you play. |
| **Stack** | Rust (nightly), wgpu, OpenSimplex2, MLP, Vulkan |
| **Local path** | `~/VIVIA-Beyond-the-Known` |
| **Docs** | [/projects/nv2-engine/](/projects/nv2-engine/) |

## 6. AURORA OS — `BartoszOsiej/AURORA-OS`

| | |
|---|---|
| **What** | A complete operating system running in the browser: TypeScript kernel, window manager, virtual filesystem, 37-command shell, 8 apps, themes and procedural audio. Zero runtime dependencies, no frameworks, no server. |
| **Stack** | TypeScript, zero runtime dependencies, Vite |
| **Local path** | `~/talus-process-monitor/aurora-os` |
| **Docs** | [/projects/aurora-os/](/projects/aurora-os/) — Overview, Architecture, User Guide |

## 7. Cybersec Toolkit — `BartoszOsiej/cybersec-tools`

| | |
|---|---|
| **What** | Four focused Rust security tools: **NetRecon** (TCP scanner), **ShadowScan** (web vulnerability scanner), **HashSleuth** (hash cracker), **PacketEye** (pcap analyzer). |
| **Stack** | Rust, clap, tokio, pcap, openssl |
| **Local path** | `~/cybersec-tools` |
| **Docs** | [/projects/cybersec-tools/](/projects/cybersec-tools/) |

## 8. Talus Process Monitor — `BartoszOsiej/talus-process-monitor`

| | |
|---|---|
| **What** | eBPF endpoint security agent for Linux — detect ransomware behaviour, respond at the kernel edge: `execve`/`openat`/`connect`/`accept`/`sendto`/`recvfrom` tracepoints, per-CPU perf buffers, 1-second sliding-window heuristic, automated `SIGKILL` response, FrankenTUI, JSON/plain output, self-diagnostic. |
| **Stack** | Rust, eBPF (Aya), FrankenTUI (ftui), crossterm, nightly toolchain for the BPF crate |
| **Local path** | `~/talus-process-monitor` |
| **Docs** | [/projects/talus-process-monitor/](/projects/talus-process-monitor/) — Overview + Architecture |

## 9. Externum — `BartoszOsiej/externum`

| | |
|---|---|
| **What** | Our own programming language — Python readability, binary performance and Bash control from a single source. Full lexer → parser → compiler → runtime pipeline in Python. Compiles to **Python, native binary and Bash**; also runs directly (interpreter + REPL). |
| **Features (v3.0 "Sentient")** | Classes + inheritance, exceptions, imports of `.ext` modules, lambdas, comprehensions, generators, f-strings, ternary, tuple unpacking, `with/assert/del/global`, bitwise operators, multi-line literals, stdlib (`structs`, `strings`, `fs`, `mathx`) written in Externum itself. |
| **Stack** | Python 3, own lexer/parser/compiler/runtime, zero deps |
| **Local path** | `~/Externum` |
| **Docs** | [/projects/externum/](/projects/externum/) — Overview, Syntax, Examples, Compiler & CLI, Architecture |
| **Tests** | 118 unit tests, all green |

## 10. pqguard — `BartoszOsiej/pqguard`

| | |
|---|---|
| **What** | Post-quantum file encryption CLI — ML-KEM-768 key exchange + AES-256-GCM + HKDF. NIST FIPS 203 compliant, fuzz-tested. Protects against "harvest now, decrypt later" quantum threats. |
| **Stack** | Rust, ML-KEM-768 (Kyber768), AES-256-GCM, HKDF-SHA256 |
| **Local path** | `~/pqguard` |
| **Docs** | [/projects/pqguard/](/projects/pqguard/) — Overview + Tests |
| **Published** | [crates.io](https://crates.io/crates/pqguard) |

## 11. Solana Validator — `BartoszOsiej/solana-validator`

| | |
|---|---|
| **What** | Custom Solana-like validator built from scratch in Rust — PoH clock, Tower BFT consensus, Sealevel parallel execution, Turbine block propagation with Reed-Solomon erasure coding, CRDS gossip protocol, and SBF-inspired program executor. Educational/research implementation. |
| **Stack** | Rust, SHA-256, Reed-Solomon, DashMap, Tokio |
| **Local path** | `~/solana-validator` |
| **Docs** | [/projects/solana-validator/](/projects/solana-validator/) — Overview + Tests |
| **Tests** | 110 unit tests, all green |

## 12. Prompt Inbox — `BartoszOsiej/prompt-inbox`

| | |
|---|---|
| **What** | Remote prompt inbox for the coding agent — send a prompt from anywhere, it lands as a GitHub issue, the agent handles it. Zero backend, mobile-first, static HTML. |
| **Stack** | HTML5, GitHub Issues API, zero dependencies |
| **Local path** | `~/prompt-inbox` |
| **Docs** | [/projects/prompt-inbox/](/projects/prompt-inbox/) — Overview + Tests |
| **Published** | [npm](https://www.npmjs.com/package/prompt-inbox), [GHCR](https://github.com/BartoszOsiej/prompt-inbox/pkgs/container/prompt-inbox) |

---

## ⚡ Energy Research (not a repo)

Open-access paper series on the world-scale energy transition, written
by Bartosz Osiej, hosted on this site, licensed CC-BY-4.0. Full text
(readable in the browser) lives on the **Energy Research** docs page:
https://bartoszosiej.github.io/Docs/energy/

- **Atomic Batteries** — *Betavoltaic Nuclear Batteries for Mobile
  Devices: A Comprehensive Technical Review and Feasibility Analysis*
  (honest verdict: µW niches, not smartphones)
- **Iron Age of Grid Storage** — *Iron–Air Batteries as a World-Scale
  Solution for Multi-Day Energy Storage* (100 MW / 100 h model, LCOS)
- **Digging for the Sun** — *Superhot Rock Geothermal as the World-Scale
  Source of Clean Baseload Power* (100 MWe model, honest $66–90/MWh)

Support the series: https://ko-fi.com/bartoszosiej1

---

## 🔬 R&D — Research Hub (not a repo)

Open-access research published under my own name, hosted on Zenodo with a
persistent DOI, licensed CC-BY-4.0. Full text lives on the **R&D** docs page:
https://bartoszosiej.github.io/Docs/rd/

- **Quantum Flash Tomograph** — *Single-Shot Volumetric Human Body Imaging at
  Cellular Resolution via Squeezed-State Compressed Sensing MRI*
- DOI (v4): [`10.5281/zenodo.21701871`](https://doi.org/10.5281/zenodo.21701871)
- Documented on [this site](/rd/)

---

## 📌 Not listed here (deliberately)

Smaller / client / one-off projects (Minecraft launchers, landing pages, client
sites) are **not** part of this registry and are not documented on this site.

## 🧭 How to keep this file fresh

1. Add a project only when it is a real, maintained project (see the 9 above).
2. Keep the repo, stack, local path and docs link accurate.
3. Update `/projects/` (site page), `llms.txt`, `llms-full.txt` and
   `sitemap.xml` together with this file (scripts: `scripts/gen-llms*.py`,
   the Docusaurus sitemap plugin).
