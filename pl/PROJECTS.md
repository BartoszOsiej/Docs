# 📁 Rejestr Projektów — Bartosz Osiej

> **Centralny, zawsze aktualny rejestr każdego projektu, który budujemy i utrzymujemy.**
> Ten plik jest jedynym źródłem prawdy: repo → czym jest → gdzie żyje dokumentacja.
> Renderowany na stronie pod adresem **https://bartoszosiej.github.io/Docs/pl/projects/**

Każdy wymieniony tu projekt jest na żywo na GitHub (właściciel **BartoszOsiej**),
udokumentowany na tej stronie i utrzymywany w kopii roboczej w `~/`.

---

## 🔗 Mapa repozytoriów (w skrócie)

| # | Projekt | Repo | Stos | Strona dokumentacji |
|---|---------|------|-------|-----------|
| 1 | **Docs Hub** | [BartoszOsiej/Docs](https://github.com/BartoszOsiej/Docs) | Docusaurus | [docs](/) |
| 2 | **N2 Mesh** (czat P2P) | [BartoszOsiej/n2-mesh](https://github.com/BartoszOsiej/n2-mesh) | WebRTC, statyczny hosting | [docs](/projects/n2-mesh/) · [live](https://bartoszosiej.github.io/n2-mesh/) |
| 3 | **LinkShort** (skracacz URL) | [BartoszOsiej/FastAPI-url](https://github.com/BartoszOsiej/FastAPI-url) | FastAPI, React 19, SQLite | [docs](/projects/fastapi-url/) |
| 4 | **Novactorio** (gra o fabrykach) | [BartoszOsiej/Factorio-web-game](https://github.com/BartoszOsiej/Factorio-web-game) | TypeScript, Canvas 2D, Supabase | [docs](/projects/factorio-web-game/) |
| 5 | **NV2 Engine** (woksele w Rust) | [BartoszOsiej/NV2_ENGINE](https://github.com/BartoszOsiej/NV2_ENGINE) | Rust, wgpu, roślinność AI | [docs](/projects/nv2-engine/) |
| 6 | **AURORA OS** (OS w przeglądarce) | [BartoszOsiej/AURORA-OS](https://github.com/BartoszOsiej/AURORA-OS) | TypeScript, zero zależności | [docs](/projects/aurora-os/) |
| 7 | **Cybersec Toolkit** | [BartoszOsiej/cybersec-tools](https://github.com/BartoszOsiej/cybersec-tools) | Rust, pcap, openssl | [docs](/projects/cybersec-tools/) |
| 8 | **Monitor Procesów Halcyon** | [BartoszOsiej/halcyon-process-monitor](https://github.com/BartoszOsiej/halcyon-process-monitor) | Rust, eBPF, Aya, ratatui | [docs](/projects/halcyon-process-monitor/) |
| 9 | **Externum** (język programowania) | [BartoszOsiej/externum](https://github.com/BartoszOsiej/externum) | Python, własny lexer/parser/kompilator | [docs](/projects/externum/) |

---

## 1. Docs Hub — `BartoszOsiej/Docs`

| | |
|---|---|
| **Co** | Ta witryna dokumentacyjna + rejestr projektów. Zbudowana w Docusaurus, wdrażana na GitHub Pages. |
| **Stos** | Docusaurus, GitHub Actions |
| **Ścieżka lokalna** | `~/Docs` |
| **Na żywo** | https://bartoszosiej.github.io/Docs/ |
| **Uwagi** | `llms.txt` / `llms-full.txt` / `sitemap.xml` generowane z drzewa stron. Przepływ aktualizacji udokumentowany w `update-flow.md`. |

## 2. N2 Mesh (czat P2P) — `BartoszOsiej/n2-mesh`

| | |
|---|---|
| **Co** | Komunikator WebRTC działający na **statycznym hostingu** — bez serwera, bez bazy danych, bez kont. Pokój = temat **sygnalizacji**; peerowie ogłaszają obecność na publicznym brokcie MQTT i łączą się bezpośrednio przez **kanały danych WebRTC** (klasyczny wzorzec serwera sygnalizacji), a temat MQTT służy równocześnie jako automatyczny fallback w sieciach blokujących WebRTC (CGNAT komórkowy). Odbiorcy deduplikują po id wiadomości — nic nie ginie. Karty tej samej przeglądarki łączy lokalny most `BroadcastChannel`. |
| **Stos** | Natywny WebRTC, własny klient MQTT 3.1.1 (~100 linii, bez bibliotek), czysty JS |
| **Ścieżka lokalna** | `~/N2-Mesh` |
| **Dokumentacja** | [/projects/n2-mesh/](/projects/n2-mesh/) — Przegląd + Architektura |
| **Na żywo** | https://bartoszosiej.github.io/n2-mesh/ |

## 3. LinkShort — `BartoszOsiej/FastAPI-url`

| | |
|---|---|
| **Co** | Produkcyjny skracacz URL: skracaj, zarządzaj, śledź kliknięcia. Auth JWT, linki per użytkownik, analityka. |
| **Stos** | Python 3.12, FastAPI 0.115, React 19, Tailwind 4, SQLite, Docker, Fly.io |
| **Ścieżka lokalna** | `~/FastAPI-url` |
| **Dokumentacja** | [/projects/fastapi-url/](/projects/fastapi-url/) — Przegląd, Pierwsze kroki, Referencja API, Wdrożenie |

## 4. Novactorio — `BartoszOsiej/Factorio-web-game`

| | |
|---|---|
| **Co** | Przeglądarkowa gra o automatyzacji fabryk inspirowana Factorio, napisana od zera z ręcznie robionym silnikiem Canvas 2D. Co-op multiplayer, 23 języki, premium przez Stripe. |
| **Stos** | TypeScript 5.5 (strict), React 18, Vite 6, Supabase, Stripe, Deno Edge Functions, Cloudflare |
| **Ścieżka lokalna** | `~/Factorio-web-game` |
| **Dokumentacja** | [/projects/factorio-web-game/](/projects/factorio-web-game/) — Przegląd, Architektura, Rozgrywka, Backend i monetyzacja |

## 5. NV2 Engine — `BartoszOsiej/NV2_ENGINE`

| | |
|---|---|
| **Co** | Natywny silnik wokselowy w Rust z proceduralnymi światami sterowanymi przez AI: renderowanie wgpu, 97 typów bloków, 9 biomów, symulacja wody i sieć neuronowa, która uczy się rozmieszczania roślinności podczas gry. |
| **Stos** | Rust (nightly), wgpu, OpenSimplex2, MLP, Vulkan |
| **Ścieżka lokalna** | `~/NV2_ENGINE` |
| **Dokumentacja** | [/projects/nv2-engine/](/projects/nv2-engine/) |

## 6. AURORA OS — `BartoszOsiej/AURORA-OS`

| | |
|---|---|
| **Co** | Kompletny system operacyjny działający w przeglądarce: jądro w TypeScript, menedżer okien, wirtualny system plików, shell z 37 komendami, 8 aplikacji, motywy i proceduralny dźwięk. Zero zależności w runtime, zero frameworków, zero serwera. |
| **Stos** | TypeScript, zero zależności w runtime, Vite |
| **Ścieżka lokalna** | `~/halcyon-process-monitor/aurora-os` |
| **Dokumentacja** | [/projects/aurora-os/](/projects/aurora-os/) — Przegląd, Architektura, Podręcznik użytkownika |

## 7. Cybersec Toolkit — `BartoszOsiej/cybersec-tools`

| | |
|---|---|
| **Co** | Cztery skupione narzędzia bezpieczeństwa w Rust: **NetRecon** (skaner TCP), **ShadowScan** (skaner podatności webowych), **HashSleuth** (łamacz hashy), **PacketEye** (analizator pcap). |
| **Stos** | Rust, clap, tokio, pcap, openssl |
| **Ścieżka lokalna** | `~/cybersec-tools` |
| **Dokumentacja** | [/projects/cybersec-tools/](/projects/cybersec-tools/) |

## 8. Monitor Procesów Halcyon — `BartoszOsiej/halcyon-process-monitor`

| | |
|---|---|
| **Co** | Telemetria procesów i operacji na plikach w czasie rzeczywistym dla Linuksa, oparta o eBPF: tracepointy `execve`/`openat`, bufory perf per-CPU, heurystyka ransomware z 1-sekundowym ruchomym oknem, TUI ratatui na żywo, wyjście JSON/tekstowe, autodiagnostyka. |
| **Stos** | Rust, eBPF (Aya), ratatui, crossterm, nightly toolchain dla crata BPF |
| **Ścieżka lokalna** | `~/halcyon-process-monitor` |
| **Dokumentacja** | [/projects/halcyon-process-monitor/](/projects/halcyon-process-monitor/) — Przegląd + Architektura |

## 9. Externum — `BartoszOsiej/externum`

| | |
|---|---|
| **Co** | Własny język programowania — czytelność Pythona, wydajność binarnego kodu i kontrola Basha z jednego źródła. Pełny pipeline lexer → parser → kompilator → runtime w Pythonie. Kompiluje do **Pythona, natywnego binarnego kodu i Basha**; działa też wprost (interpreter + REPL). |
| **Funkcje (v3.0 „Sentient”)** | Klasy + dziedziczenie, wyjątki, importy modułów `.ext`, lambdy, comprehensions, generatory, f-stringi, ternary, rozpakowywanie krotek, `with/assert/del/global`, operatory bitowe, literały wielolinijkowe, stdlib (`structs`, `strings`, `fs`, `mathx`) napisana w samym Externum. |
| **Stos** | Python 3, własny lexer/parser/kompilator/runtime, zero zależności |
| **Ścieżka lokalna** | `~/Externum` |
| **Dokumentacja** | [/projects/externum/](/projects/externum/) — Przegląd, Składnia, Przykłady, Kompilator i CLI, Architektura |
| **Testy** | 118 testów jednostkowych, wszystkie zielone |

---

## 📌 Niewymienione tutaj (celowo)

Mniejsze / klienckie / jednorazowe projekty (launchery Minecrafta, strony
lądowania, witryny klientów) **nie** są częścią tego rejestru i nie są
dokumentowane na tej stronie.

## 🧭 Jak utrzymywać ten plik świeży

1. Dodaj projekt tylko wtedy, gdy jest prawdziwym, utrzymywanym projektem
   (patrz 9 powyżej).
2. Utrzymuj dokładne repo, stos, ścieżkę lokalną i link do dokumentacji.
3. Aktualizuj `/projects/` (stronę witryny), `llms.txt`, `llms-full.txt`
   i `sitemap.xml` razem z tym plikiem (skrypty: `scripts/gen-llms*.py`,
   the Docusaurus sitemap plugin).
