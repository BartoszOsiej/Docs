---
title: Projekty — Bartosz Osiej
---

# 📁 Projekty

> **Kompletny rejestr każdego projektu, który budujemy i utrzymujemy.**
> Repo → czym jest → stos → dokumentacja. Jedna strona, zawsze aktualna.
> Źródło prawdy: [`PROJECTS.md`](https://github.com/BartoszOsiej/Docs/blob/main/PROJECTS.md)

## 🔗 Wszystkie projekty

<div class="project-grid">
  <ProjectCard
    icon="📚"
    title="Docs Hub"
    description="Ta witryna dokumentacyjna — VitePress na GitHub Pages, czytelne dla AI llms.txt, auto-wdrożenie przez GitHub Actions oraz rejestr wszystkich projektów."
    :tags="['VitePress', 'GitHub Pages']"
    tint="#38bdf8"
    link="/"
  />
  <ProjectCard
    icon="💬"
    title="N2 Mesh — czat P2P"
    description="Komunikator WebRTC działający na statycznym hostingu. Peerzy ogłaszają obecność na publicznym temacie MQTT i łączą się bezpośrednio przez kanały danych WebRTC — bez serwera i bazy danych."
    :tags="['WebRTC', 'P2P', 'MQTT', 'Serverless']"
    tint="#a78bfa"
    link="/projects/n2-mesh/"
  />
  <ProjectCard
    icon="🔗"
    title="LinkShort"
    description="Produkcyjny skracacz URL. Backend FastAPI z auth JWT, zarządzanie linkami per użytkownik, śledzenie kliknięć, SPA React 19 serwowane przez API, Docker + Fly.io."
    :tags="['FastAPI', 'JWT', 'React 19', 'SQLite']"
    tint="#34d399"
    link="/projects/fastapi-url/"
  />
  <ProjectCard
    icon="🏭"
    title="Novactorio"
    description="Gra z automatyzacją fabryk inspirowana Factorio, w przeglądarce. Własny silnik Canvas 2D, ponad 21 000 linii TypeScript, multiplayer co-op, 23 języki, premium przez Stripe."
    :tags="['TypeScript', 'Canvas 2D', 'Supabase', 'Stripe']"
    tint="#fbbf24"
    link="/projects/factorio-web-game/"
  />
  <ProjectCard
    icon="⛏️"
    title="NV2 Engine"
    description="Natywny silnik wokselowy w Rust ze światami proceduralnymi sterowanymi przez AI. Renderowanie wgpu, 97 typów bloków, 9 biomów, symulacja wody, sieć neuronowa ucząca się roślinności."
    :tags="['Rust', 'wgpu', 'Vulkan', 'MLP']"
    tint="#818cf8"
    link="/projects/nv2-engine/"
  />
  <ProjectCard
    icon="◈"
    title="AURORA OS"
    description="Kompletny system operacyjny w przeglądarce — jądro w TypeScript, menedżer okien, wirtualny system plików, shell z 37 komendami, 8 aplikacji, motywy, proceduralny dźwięk. Zero zależności w runtime."
    :tags="['TypeScript', 'Web OS', 'VFS', 'WASM-free']"
    tint="#38bdf8"
    link="/projects/aurora-os/"
  />
  <ProjectCard
    icon="🛡️"
    title="Cybersec Toolkit"
    description="Cztery skupione narzędzia bezpieczeństwa w Rust: skaner TCP NetRecon, skaner podatności webowych ShadowScan, łamacz hashy HashSleuth, analizator pcap PacketEye."
    :tags="['Rust', 'Security', 'pcap', 'openssl']"
    tint="#f472b6"
    link="/projects/cybersec-tools/"
  />
  <ProjectCard
    icon="🛰️"
    title="Monitor Procesów Halcyon"
    description="Telemetria procesów i operacji na plikach w czasie rzeczywistym dla Linuksa, oparta o eBPF. Tracepointy execve/openat, bufory perf per-CPU, heurystyka ransomware z ruchomym oknem, TUI ratatui."
    :tags="['Rust', 'eBPF', 'Aya', 'ratatui']"
    tint="#a3e635"
    link="/projects/halcyon-process-monitor/"
  />
  <ProjectCard
    icon="📜"
    title="Externum"
    description="Własny język programowania — czytelność Pythona, wydajność binarnego kodu i kontrola Basha z jednego źródła. Kompilacja do trzech targetów albo wykonanie wprost z REPL. 118 testów, wszystkie zielone."
    :tags="['Language', 'Compiler', 'Interpreter', 'REPL']"
    tint="#f59e0b"
    link="/projects/externum/"
  />
</div>

## 🗺️ Mapa repozytoriów

| Projekt | Repozytorium | Dokumentacja |
|---|---|---|
| Docs Hub | [BartoszOsiej/Docs](https://github.com/BartoszOsiej/Docs) | [tutaj](/) |
| N2 Mesh (czat P2P) | [BartoszOsiej/n2-mesh](https://github.com/BartoszOsiej/n2-mesh) | [dokumentacja](/projects/n2-mesh/) · [na żywo](https://bartoszosiej.github.io/n2-mesh/) |
| LinkShort | [BartoszOsiej/FastAPI-url](https://github.com/BartoszOsiej/FastAPI-url) | [dokumentacja](/projects/fastapi-url/) |
| Novactorio | [BartoszOsiej/Factorio-web-game](https://github.com/BartoszOsiej/Factorio-web-game) | [dokumentacja](/projects/factorio-web-game/) |
| NV2 Engine | [BartoszOsiej/NV2_ENGINE](https://github.com/BartoszOsiej/NV2_ENGINE) | [dokumentacja](/projects/nv2-engine/) |
| AURORA OS | [BartoszOsiej/AURORA-OS](https://github.com/BartoszOsiej/AURORA-OS) | [dokumentacja](/projects/aurora-os/) |
| Cybersec Toolkit | [BartoszOsiej/cybersec-tools](https://github.com/BartoszOsiej/cybersec-tools) | [dokumentacja](/projects/cybersec-tools/) |
| Monitor Procesów Halcyon | [BartoszOsiej/halcyon-process-monitor](https://github.com/BartoszOsiej/halcyon-process-monitor) | [dokumentacja](/projects/halcyon-process-monitor/) |
| Externum | [BartoszOsiej/externum](https://github.com/BartoszOsiej/externum) | [dokumentacja](/projects/externum/) |

## 📌 Niewymienione

Mniejsze / klienckie / jednorazowe projekty (launchery Minecrafta, strony
lądowania, witryny klientów) celowo **nie** należą do tego rejestru.

<style scoped>
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.1rem;
  margin: 1.4rem 0 2.4rem;
}
</style>
