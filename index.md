---
layout: home
title: Bartosz Osiej — Engineering Docs Hub

hero:
  name: "Bartosz Osiej"
  text: "Engineering Docs Hub"
  tagline: >
    A curated documentation hub for every project — a production URL
    shortener, browser games, a native Rust voxel engine, a Rust
    cybersecurity toolkit, a browser OS, an eBPF security monitor, a
    programming language, AI models, launchers and client work.
  image:
    src: /hero.svg
    alt: Projects
  actions:
    - theme: brand
      text: 🚀 Explore Projects
      link: /projects/fastapi-url/
    - theme: alt
      text: 💬 P2P Chat (torrent-based)
      link: /chat/
    - theme: alt
      text: LinkShort — URL Shortener
      link: /projects/fastapi-url/
    - theme: alt
      text: Novactorio — Factory Game
      link: /projects/factorio-web-game/
    - theme: alt
      text: NV2 Engine — Rust Voxel Game
      link: /projects/nv2-engine/

features:
  - icon: 🔗
    title: LinkShort
    details: Production-ready URL shortener — FastAPI, JWT auth, click tracking, React 19 SPA, SQLite.
    link: /projects/fastapi-url/
  - icon: 🏭
    title: Novactorio
    details: Browser factory-automation game with a hand-written Canvas 2D engine, co-op, 23 languages, Stripe premium.
    link: /projects/factorio-web-game/
  - icon: ⛏️
    title: NV2 Engine
    details: Native Rust voxel engine — wgpu rendering, 97 block types, AI-trained vegetation.
    link: /projects/nv2-engine/
  - icon: ◈
    title: AURORA OS
    details: A complete operating system in the browser — window manager, virtual filesystem, 37-command shell and 8 apps, all in TypeScript.
    link: /projects/aurora-os/
  - icon: 🛡️
    title: Cybersec Toolkit
    details: Four focused Rust security tools — port scanning, web vuln checks, hash cracking, pcap analysis.
    link: /projects/cybersec-tools/
  - icon: 🛰️
    title: Halcyon Monitor
    details: eBPF-based process & file telemetry for Linux with a ransomware sliding-window heuristic and a live TUI.
    link: /projects/halcyon-process-monitor/
  - icon: 💬
    title: P2P Chat
    details: A serverless, torrent-principle chat that works on static hosting — peers connect via WebTorrent swarms.
    link: /chat/
  - icon: 🔄
    title: Update Flow
    details: Which repositories publish updates to this documentation site, and how.
    link: /update-flow
---

<AuroraBackground />

<ScrollReveal>
## ✨ Flagship Projects

<div class="project-grid">
  <ProjectCard
    icon="🔗"
    title="LinkShort"
    description="Production-ready URL shortener. FastAPI backend with JWT auth, per-user link management, click tracking, and a React 19 single-page app served directly by the API."
    :tags="['FastAPI', 'JWT', 'React 19', 'SQLite', 'Docker']"
    tint="#34d399"
    link="/projects/fastapi-url/"
  />
  <ProjectCard
    icon="🏭"
    title="Novactorio"
    description="A Factorio-inspired factory-automation game in the browser. Hand-written Canvas 2D engine, 21,000+ lines of TypeScript, co-op multiplayer, 23 languages, Stripe premium."
    :tags="['TypeScript', 'Canvas 2D', 'Supabase', 'Stripe', 'Cloudflare']"
    tint="#fbbf24"
    link="/projects/factorio-web-game/"
  />
  <ProjectCard
    icon="⛏️"
    title="NV2 Engine"
    description="A native Rust voxel engine with AI-driven procedural worlds. wgpu rendering, 97 block types, 9 biomes, water simulation, and a neural network that learns vegetation while you play."
    :tags="['Rust', 'wgpu', 'OpenSimplex2', 'MLP', 'Vulkan']"
    tint="#818cf8"
    link="/projects/nv2-engine/"
  />
  <ProjectCard
    icon="🛡️"
    title="Cybersec Toolkit"
    description="Four focused Rust security tools: NetRecon TCP scanner, ShadowScan web vulnerability scanner, HashSleuth hash cracker, and PacketEye pcap analyzer."
    :tags="['Rust', 'Security', 'pcap', 'openssl', 'CLI']"
    tint="#f472b6"
    link="/projects/cybersec-tools/"
  />
  <ProjectCard
    icon="◈"
    title="AURORA OS"
    description="A complete operating system in the browser — TypeScript kernel, window manager, virtual filesystem, 37-command shell, 8 apps, themes and procedural audio. Zero runtime dependencies."
    :tags="['TypeScript', 'Web OS', 'VFS', 'WASM-free']"
    tint="#38bdf8"
    link="/projects/aurora-os/"
  />
  <ProjectCard
    icon="🛰️"
    title="Halcyon Process Monitor"
    description="Real-time eBPF process and file-op telemetry for Linux. execve/openat tracepoints, per-CPU perf buffers, a 1-second sliding-window ransomware heuristic, and a ratatui TUI."
    :tags="['Rust', 'eBPF', 'Aya', 'ratatui', 'Linux']"
    tint="#a3e635"
    link="/projects/halcyon-process-monitor/"
  />
</div>
</ScrollReveal>

<ScrollReveal :delay="120">
## 🧩 More Projects

<div class="project-grid">
  <ProjectCard
    icon="📜"
    title="Externum"
    description="A programming language fusing Python readability, binary performance and Bash control into a unified paradigm — Python 3.10+, stdlib only."
    :tags="['Language', 'Python', 'Compiler']"
    tint="#f59e0b"
    link="/projects/externum/"
  />
  <ProjectCard
    icon="🇵🇱"
    title="PolishAI"
    description="A self-developing Polish-language transformer with dynamic qint8 quantization and AVX2 acceleration."
    :tags="['Python', 'PyTorch', 'NLP', 'Quantization']"
    tint="#fb7185"
    link="/projects/polish-ai/"
  />
  <ProjectCard
    icon="🎬"
    title="Video MoE"
    description="A ~60M-parameter Mixture-of-Experts transformer for video generation on resource-constrained hardware — CPU-first, quantized."
    :tags="['Python', 'PyTorch', 'MoE', 'Video']"
    tint="#c084fc"
    link="/projects/video-moe/"
  />
  <ProjectCard
    icon="🏭"
    title="Factory Defense"
    description="A Rust factory-building + tower-defense game on macroquad: build factories, manage a city economy, defend against waves."
    :tags="['Rust', 'macroquad', 'Game']"
    tint="#34d399"
    link="/projects/factory-defense/"
  />
  <ProjectCard
    icon="👻"
    title="GhostLauncher"
    description="A full-featured Electron Minecraft launcher for the LandOfGhost server — autologin, Minehut status, RAM config, shop — plus a React rewrite."
    :tags="['Electron', 'React', 'Minecraft']"
    tint="#f97316"
    link="/projects/ghost-launcher/"
  />
  <ProjectCard
    icon="🗺️"
    title="Minecraft Tooling"
    description="A native Minecraft map launcher (C++/AppImage, Prismlauncher) and the EvoTech Forge 1.20.1 mod development tree."
    :tags="['C++', 'CMake', 'Forge', 'AppImage']"
    tint="#22d3ee"
    link="/projects/minecraft-tools/"
  />
  <ProjectCard
    icon="🚛"
    title="Transport Game"
    description="A vanilla-JS browser sandbox with procedural terrain, vehicle physics, building, fluids, missions, and multiplayer hooks."
    :tags="['JavaScript', 'Canvas', 'Game']"
    tint="#a3e635"
    link="/projects/game/"
  />
  <ProjectCard
    icon="💼"
    title="Ghost Developments"
    description="A Next.js marketing site for an IT services business — portfolio, pricing, contact, and booking pages."
    :tags="['Next.js', 'React', 'TypeScript']"
    tint="#e879f9"
    link="/projects/ghostdev/"
  />
  <ProjectCard
    icon="🗂️"
    title="Client Projects"
    description="A catalog of commissioned and hobby work: Netlify SPAs, PyInstaller desktop apps, launchers, game servers and business sites."
    :tags="['Vite', 'Python', 'Electron', 'Netlify']"
    tint="#94a3b8"
    link="/projects/client-projects/"
  />
</div>
</ScrollReveal>

<ScrollReveal :delay="120">
## 🎯 What makes this hub special

<div class="grid-3">
  <GlowCard>
    <h3>🔍 Deep, code-accurate docs</h3>
    <p>Every page is written from the actual source — real endpoints, real modules, real numbers. No filler, no guesswork.</p>
  </GlowCard>
  <GlowCard>
    <h3>🤖 AI-readable</h3>
    <p><code>llms.txt</code> and <code>llms-full.txt</code> make the entire site fully scrapable by AI agents.</p>
  </GlowCard>
  <GlowCard>
    <h3>🔄 Live update flow</h3>
    <p>A single GitHub Actions pipeline rebuilds and deploys the site on every push to main.</p>
  </GlowCard>
  <GlowCard>
    <h3>💬 Serverless chat</h3>
    <p>The built-in [P2P chat](/chat/) runs on WebTorrent swarms — no server, no database, works on static GitHub Pages.</p>
  </GlowCard>
</div>
</ScrollReveal>

<style scoped>
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.1rem;
  margin: 1.4rem 0 2.4rem;
}
.grid-3 {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
  margin: 1.4rem 0 2rem;
}
.grid-3 h3 { margin-top: 0; }
.grid-3 p { opacity: 0.8; line-height: 1.6; }
</style>
