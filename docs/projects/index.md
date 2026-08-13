# 📁 Projects

> **The complete registry of every project we build and maintain.**
> Repo → what it is → stack → docs. One page, always current.
> Source of truth: [`PROJECTS.md`](https://github.com/BartoszOsiej/Docs/blob/main/PROJECTS.md)

## 🔗 All projects

<div className="project-grid">
  <ProjectCard
    icon="📚"
    title="Docs Hub"
    description="This documentation site itself — Docusaurus on GitHub Pages, AI-readable llms.txt, auto-deploy via GitHub Actions, and the registry of every project."
    tags={['Docusaurus', 'GitHub Pages']}
    tint="#38bdf8"
    link="/"
  />
  <ProjectCard
    icon="🔬"
    title="R&D — Research Hub"
    description="Open-access research published under my own name on Zenodo with a persistent DOI. Hosts the Quantum Flash Tomograph preprint — full text, metadata and a web-wide citation audit, licensed CC-BY-4.0."
    tags={['Research', 'Preprint', 'DOI', 'Open Access']}
    tint="#2dd4bf"
    link="/rd/"
  />
  <ProjectCard
    icon="💬"
    title="N2 Mesh — P2P Chat"
    description="WebRTC messenger that works on static hosting. Peers announce their presence on a public MQTT topic and connect directly over WebRTC data channels — no server, no database. Fully documented in its own docs pages."
    tags={['WebRTC', 'P2P', 'MQTT', 'Serverless']}
    tint="#a78bfa"
    link="/projects/n2-mesh/"
  />
  <ProjectCard
    icon="🔗"
    title="LinkShort"
    description="Production-ready URL shortener. FastAPI backend with JWT auth, per-user link management, click tracking, React 19 SPA served by the API, Docker + Fly.io."
    tags={['FastAPI', 'JWT', 'React 19', 'SQLite']}
    tint="#34d399"
    link="/projects/fastapi-url/"
  />
  <ProjectCard
    icon="🏭"
    title="Novactorio"
    description="Factorio-inspired factory-automation game in the browser. Hand-written Canvas 2D engine, 21,000+ lines of TypeScript, co-op multiplayer, 23 languages, Stripe premium."
    tags={['TypeScript', 'Canvas 2D', 'Supabase', 'Stripe']}
    tint="#fbbf24"
    link="/projects/factorio-web-game/"
  />
  <ProjectCard
    icon="⛏️"
    title="NV2 Engine"
    description="Native Rust voxel engine with AI-driven procedural worlds. wgpu rendering, 97 block types, 9 biomes, water simulation, neural vegetation learning."
    tags={['Rust', 'wgpu', 'Vulkan', 'MLP']}
    tint="#818cf8"
    link="/projects/nv2-engine/"
  />
  <ProjectCard
    icon="◈"
    title="AURORA OS"
    description="A complete operating system in the browser — TypeScript kernel, window manager, virtual filesystem, 37-command shell, 8 apps, themes, procedural audio. Zero runtime dependencies."
    tags={['TypeScript', 'Web OS', 'VFS', 'WASM-free']}
    tint="#38bdf8"
    link="/projects/aurora-os/"
  />
  <ProjectCard
    icon="🛡️"
    title="Cybersec Toolkit"
    description="Four focused Rust security tools: NetRecon TCP scanner, ShadowScan web vulnerability scanner, HashSleuth hash cracker, PacketEye pcap analyzer."
    tags={['Rust', 'Security', 'pcap', 'openssl']}
    tint="#f472b6"
    link="/projects/cybersec-tools/"
  />
  <ProjectCard
    icon="🛰️"
    title="Halcyon Process Monitor"
    description="Real-time eBPF process and file-op telemetry for Linux. execve/openat tracepoints, per-CPU perf buffers, sliding-window ransomware heuristic, ratatui TUI."
    tags={['Rust', 'eBPF', 'Aya', 'ratatui']}
    tint="#a3e635"
    link="/projects/halcyon-process-monitor/"
  />
  <ProjectCard
    icon="📜"
    title="Externum"
    description="A programming language of our own — Python readability, binary performance and Bash control from a single source. Compiled to three targets or run directly with a REPL. 118 tests, all green."
    tags={['Language', 'Compiler', 'Interpreter', 'REPL']}
    tint="#f59e0b"
    link="/projects/externum/"
  />
</div>

## 🗺️ Repo map

> Interactive — drag the nodes, scroll to zoom, click a project to open its docs.

<RepoMap />


## 📌 Not listed

Smaller / client / one-off projects (Minecraft launchers, landing pages, client
sites) are deliberately **not** part of this registry.

