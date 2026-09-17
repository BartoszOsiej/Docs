# 🛰️ Talus — Monitor Procesów

<a class="tests-cta" href="./testy">🧪 Zobacz animowane wyniki testów — 95/95 →</a>

**Agent bezpieczeństwa endpointów oparty na eBPF dla Linuksa — wykrywaj zachowania ransomware, reaguj na krawędzi jądra.**

Talus śledzi syscalle `execve`, `openat`, `connect`, `accept`, `sendto`
i `recvfrom` na poziomie jądra przez tracepointy eBPF, strumieniuje
zdarzenia do przestrzeni użytkownika przez bufory perf per-CPU i pokazuje
je w żywym frankentui terminala — jednocześnie ciągle oceniając wskaźniki
otwarć plików per proces względem ruchomego okna, aby wykrywać masowy
dostęp do plików w stylu ransomware, i automatycznie wysyłając `SIGKILL`
do naruszających procesów.

> **Status projektu:** showcase produkcyjnej inżynierii Rust + eBPF,
> z komercyjnym systemem licencjonowania — klucze podpisane Ed25519 i
> działający backend aktywacyjny na Cloudflare Workers + D1 (darmowy tier).

---

## 🎯 Co robi

| Możliwość | Opis |
|---|---|
| **Śledzenie na poziomie jądra** | Tracepointy `execve` i `openat` dołączane na każdym aktywnym CPU |
| **Kod jądra bezpieczny dla weryfikatora** | Wskaźniki przestrzeni użytkownika czytane wyłącznie przez `bpf_probe_read_user` — nigdy nie dereferencjonowane |
| **Pipeline zdarzeń zero-copy** | Rekordy `ProcessEvent` o stałym rozmiarze strumieniowane przez bufory `PerfEventArray` per-CPU |
| **FrankenTUI na żywo** | 7-panelowy cyberpunkowy interfejs: zdarzenia, procesy, sieć, pliki, rozszerzenia, alerty, heatmapa |
| **Heurystyka ruchomego okna** | 1-sekundowe rolowane okno per PID; alerty, gdy proces przekroczy skonfigurowany wskaźnik otwarć |
| **Wiele trybów wyjścia** | TUI dla człowieka, JSON z podziałem na linie, czysty log tekstowy i wbudowana autodiagnostyka |
| **Liczenie utraconych zdarzeń** | Przepełnienia buforów perf są liczone i raportowane, nigdy cicho pomijane |
| **Pojedyncze statyczne binarium** | Pełne LTO, `panic = "abort"`, profil release bez symboli |

## ⚙️ Architektura

Programy eBPF po stronie jądra przechwytują każde `execve`/`openat` do
zwartego rekordu `ProcessEvent` wrzucanego do `PerfEventArray`.
Dedykowany wątek czytnika w przestrzeni użytkownika otwiera jeden bufor
perf na CPU, dekoduje zdarzenia i przekazuje je kanałem MPSC do rdzenia
monitora, który karmi 1-sekundowe ruchome okno per PID i emituje alerty
po przekroczeniu progu.

```
execve/openat ─► tracepointy eBPF ─► EVENTS (PerfEventArray)
                                        │  bufory perf per-CPU
                    wątek czytnika ◄─────┘
                        │  kanał MPSC
                   rdzeń monitora (ruchome okno + alerty)
                        │
              TUI / JSON / plain / diagnose
```

Pełny projekt znajdziesz w [pełnej architekturze](/projects/talus-process-monitor/architecture).

## 🚀 Szybki start

```bash
# Instalator świadomy dystrybucji (apt, dnf, pacman, zypper, apk, xbps)
./install.sh                       # instalacja użytkownika do ~/.local
./install.sh --system              # instalacja systemowa do /usr/local

# Albo zbuduj ręcznie
./build.sh
sudo target/release/process-monitor
```

## 🖥️ Użycie

```bash
sudo process-monitor                    # TUI (domyślnie, gdy stdout to terminal)
sudo process-monitor --alert-threshold 100   # podnieś próg alertu (otwarcia/s)
sudo process-monitor --json | jq .      # NDJSON czytelny dla maszyn
sudo process-monitor --plain            # czysty log tekstowy
sudo process-monitor --diagnose         # 5-sekundowa autodiagnostyka end-to-end
```

**Klawisze TUI:** `q` / `Esc` / `Ctrl+C` wyjście · `p` pauza/wznowienie ·
`c` wyczyść log · `↑/↓`/`j/k` przewijanie · `PgUp`/`PgDn` szybciej ·
`Home`/`End` skok.

## 🛡️ Heurystyka ransomware

> **Dla każdego PID trzymaj 1-sekundowe ruchome okno wywołań `openat`. Jeśli
> okno zawiera ≥ N otwarć (domyślnie 50), wyemituj alert.**

- Ruchome okno, nie licznik wskaźnika — serie są łapane równie
  niezawodnie jak stałe strumienie
- Izolacja per proces — brak fałszywych pozytywów między procesami
- `--alert-threshold 0` całkowicie wyłącza heurystykę

## ◆ Licencjonowanie i edycje

Talus występuje w dwóch edycjach. **Community** jest darmowa (MIT);
funkcje **Enterprise** (auto-kill, dashboard webowy, Kafka, ClickHouse,
MemGraph, biblioteka C FFI) odblokowuje płatny klucz licencyjny.

| Warstwa | Implementacja |
|---|---|
| **Podpisane klucze** | `base64(payload).base64(podpis Ed25519)` — binarka osadza wyłącznie klucz *publiczny*; klucz prywatny nigdy nie opuszcza maszyny właściciela |
| **Serwer aktywacyjny** | Cloudflare Worker + D1 (darmowy tier) — weryfikuje podpisy po stronie serwera, egzekwuje wygasanie, cofnięcia i limity stanowisk, rate-limit 5 prób / 5 min per maszyna |
| **Kontrola stanowisk** | Autorytatywna w D1 (`max_seats`); przenosiny maszyny to `deactivate` → `activate`; ponowna aktywacja tej samej maszyny jest idempotentna |
| **Utwardzenie klienta** | Lokalny cache weryfikowany względem podpisanego klucza przy każdym uruchomieniu (fail-closed), znacznik trialu z SHA-256, ochrona przed downgrade, 30-dniowa praca offline |
| **Trial** | 30-dniowy trial Enterprise przy pierwszym uruchomieniu |

```bash
talus license activate <KLUCZ>   # aktywacja online (1 klucz = 1 maszyna)
talus license show               # tier, wygasanie, stanowiska, funkcje
```

**Kwoty** cen ustala właściciel przy sprzedaży i nie publikuje ich w repo —
strukturę opisuje [`docs/pricing-tiers.md`](https://github.com/BartoszOsiej/talus-process-monitor/blob/master/docs/pricing-tiers.md),
a warunki licencji [`docs/EULA.txt`](https://github.com/BartoszOsiej/talus-process-monitor/blob/master/docs/EULA.txt).

## 📦 Struktura projektu

```
talus-process-monitor/
├── process-monitor/          # Przestrzeń użytkownika: rdzeń monitora + TUI + web + FFI + licencje
│   └── src/
│       ├── main.rs           # CLI, wybór trybu, obsługa sygnałów
│       ├── monitor.rs        # ładowanie eBPF, czytnik perf, tracker ruchomego okna
│       ├── license.rs        # weryfikacja licencji Ed25519, aktywacja, feature gating
│       ├── audit.rs          # odporny na manipulację dziennik audytu (łańcuch hashy)
│       └── tui.rs            # 7-panelowy frankentui (ftui) cyberpunkowy interfejs
├── process-monitor-ebpf/     # Strona jądra (#![no_std], aya-ebpf)
│   └── src/main.rs           # hooki tracepoint → PerfEventArray
├── license-keygen/           # keygen CLI (tylko właściciel; klucze poza repo)
├── license-server/           # backend aktywacyjny Cloudflare Worker + D1
├── scripts/                  # issue / revoke / list-activations / health-check
├── build.sh                  # Skrypt builda (nightly dla eBPF, stable dla TUI)
├── install.sh                # Instalator / deinstalator świadomy dystrybucji
└── ARCHITECTURE.md           # Pełny dokument projektowy (w tym podsystem licencji)
```

## 🔧 Wymagania

- Jądro Linuksa **5.8+** (eBPF + wsparcie tracepointów)
- **root** (`CAP_BPF` / `CAP_SYS_ADMIN`) do ładowania i dołączania programów eBPF
- Rust **nightly** + `rust-src` dla crata eBPF; **stable** dla przestrzeni użytkownika
- `bpf-linker`, `clang`, kompilator C; BTF (`/sys/kernel/btf/vmlinux`) zalecane
