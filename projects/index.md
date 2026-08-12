---
title: Projects — Bartosz Osiej
---

# 📁 Projects

> **The complete registry of every project we build and maintain.**
> Repo → what it is → stack → docs. One page, always current.
> Source of truth: [`PROJECTS.md`](https://github.com/BartoszOsiej/Docs/blob/main/PROJECTS.md)

## 🔗 All projects

<div class="project-grid">
  <ProjectCard
    icon="📚"
    title="Docs Hub"
    description="This documentation site itself — VitePress on GitHub Pages, AI-readable llms.txt, auto-deploy via GitHub Actions, and a built-in serverless P2P chat."
    :tags="['VitePress', 'GitHub Pages', 'WebTorrent']"
    tint="#38bdf8"
    link="/"
  />
  <ProjectCard
    icon="💬"
    title="P2P Chat"
    description="Torrent-principle messenger that works on static hosting. Room = torrent infohash, peers join a WebTorrent swarm, messages travel over the BitTorrent extended protocol — no server, no database."
    :tags="['WebTorrent', 'P2P', 'BitTorrent', 'Serverless']"
    tint="#a78bfa"
    link="/chat/"
  />
  <ProjectCard
    icon="🔗"
    title="LinkShort"
    description="Production-ready URL shortener. FastAPI backend with JWT auth, per-user link management, click tracking, React 19 SPA served by the API, Docker + Fly.io."
    :tags="['FastAPI', 'JWT', 'React 19', 'SQLite']"
    tint="#34d399"
    link="/projects/fastapi-url/"
  />
  <ProjectCard
    icon="🏭"
    title="Novactorio"
    description="Factorio-inspired factory-automation game in the browser. Hand-written Canvas 2D engine, 21,000+ lines of TypeScript, co-op multiplayer, 23 languages, Stripe premium."
    :tags="['TypeScript', 'Canvas 2D', 'Supabase', 'Stripe']"
    tint="#fbbf24"
    link="/projects/factorio-web-game/"
  />
  <ProjectCard
    icon="⛏️"
    title="NV2 Engine"
    description="Native Rust voxel engine with AI-driven procedural worlds. wgpu rendering, 97 block types, 9 biomes, water simulation, neural vegetation learning."
    :tags="['Rust', 'wgpu', 'Vulkan', 'MLP']"
    tint="#818cf8"
    link="/projects/nv2-engine/"
  />
  <ProjectCard
    icon="◈"
    title="AURORA OS"
    description="A complete operating system in the browser — TypeScript kernel, window manager, virtual filesystem, 37-command shell, 8 apps, themes, procedural audio. Zero runtime dependencies."
    :tags="['TypeScript', 'Web OS', 'VFS', 'WASM-free']"
    tint="#38bdf8"
    link="/projects/aurora-os/"
  />
  <ProjectCard
    icon="🛡️"
    title="Cybersec Toolkit"
    description="Four focused Rust security tools: NetRecon TCP scanner, ShadowScan web vulnerability scanner, HashSleuth hash cracker, PacketEye pcap analyzer."
    :tags="['Rust', 'Security', 'pcap', 'openssl']"
    tint="#f472b6"
    link="/projects/cybersec-tools/"
  />
  <ProjectCard
    icon="🛰️"
    title="Halcyon Process Monitor"
    description="Real-time eBPF process and file-op telemetry for Linux. execve/openat tracepoints, per-CPU perf buffers, sliding-window ransomware heuristic, ratatui TUI."
    :tags="['Rust', 'eBPF', 'Aya', 'ratatui']"
    tint="#a3e635"
    link="/projects/halcyon-process-monitor/"
  />
  <ProjectCard
    icon="📜"
    title="Externum"
    description="A programming language of our own — Python readability, binary performance and Bash control from a single source. Compiled to three targets or run directly with a REPL. 118 tests, all green."
    :tags="['Language', 'Compiler', 'Interpreter', 'REPL']"
    tint="#f59e0b"
    link="/projects/externum/"
  />
  <ProjectCard
    icon="🏭"
    title="Factory Defense"
    description="Rust factory-building + tower-defense game on macroquad: build factories, manage a city economy, defend against waves."
    :tags="['Rust', 'macroquad', 'Game']"
    tint="#34d399"
    link="/projects/factory-defense/"
  />
</div>

## 🗺️ Repo map

| Project | Repository | Docs |
|---|---|---|
| Docs Hub + P2P Chat | [BartoszOsiej/Docs](https://github.com/BartoszOsiej/Docs) | [here](/) |
| LinkShort | [BartoszOsiej/FastAPI-url](https://github.com/BartoszOsiej/FastAPI-url) | [docs](/projects/fastapi-url/) |
| Novactorio | [BartoszOsiej/Factorio-web-game](https://github.com/BartoszOsiej/Factorio-web-game) | [docs](/projects/factorio-web-game/) |
| NV2 Engine | [BartoszOsiej/NV2_ENGINE](https://github.com/BartoszOsiej/NV2_ENGINE) | [docs](/projects/nv2-engine/) |
| AURORA OS | [BartoszOsiej/AURORA-OS](https://github.com/BartoszOsiej/AURORA-OS) | [docs](/projects/aurora-os/) |
| Cybersec Toolkit | [BartoszOsiej/cybersec-tools](https://github.com/BartoszOsiej/cybersec-tools) | [docs](/projects/cybersec-tools/) |
| Halcyon Process Monitor | [BartoszOsiej/halcyon-process-monitor](https://github.com/BartoszOsiej/halcyon-process-monitor) | [docs](/projects/halcyon-process-monitor/) |
| Externum | [BartoszOsiej/Externum](https://github.com/BartoszOsiej/Externum) | [docs](/projects/externum/) |
| Factory Defense | [BartoszOsiej/factory_defense](https://github.com/BartoszOsiej/factory_defense) | [docs](/projects/factory-defense/) |

## 📌 Not listed

Smaller / client / one-off projects (Minecraft launchers, landing pages, client
sites) are deliberately **not** part of this registry.

<style scoped>
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.1rem;
  margin: 1.4rem 0 2.4rem;
}
</style>
