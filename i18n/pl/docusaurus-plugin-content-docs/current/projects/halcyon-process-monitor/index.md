# 🛰️ Monitor Procesów Halcyon

<a class="tests-cta" href="./testy">🧪 Zobacz animowane wyniki testów — 9/9 →</a>

**Telemetria procesów i operacji na plikach w czasie rzeczywistym dla
Linuksa, oparta o eBPF.**

Monitor Procesów Halcyon śledzi syscalle `execve` i `openat` na poziomie
jądra przez tracepointy eBPF, strumieniuje zdarzenia do przestrzeni
użytkownika przez bufory perf per-CPU i pokazuje je w żywym TUI
terminala — jednocześnie ciągle oceniając wskaźniki otwarć plików per
proces względem ruchomego okna, aby wykrywać masowy dostęp do plików
w stylu ransomware.

> **Status projektu:** showcase produkcyjnej inżynierii Rust + eBPF.

---

## 🎯 Co robi

| Możliwość | Opis |
|---|---|
| **Śledzenie na poziomie jądra** | Tracepointy `execve` i `openat` dołączane na każdym aktywnym CPU |
| **Kod jądra bezpieczny dla weryfikatora** | Wskaźniki przestrzeni użytkownika czytane wyłącznie przez `bpf_probe_read_user` — nigdy nie dereferencjonowane |
| **Pipeline zdarzeń zero-copy** | Rekordy `ProcessEvent` o stałym rozmiarze strumieniowane przez bufory `PerfEventArray` per-CPU |
| **TUI na żywo** | Log zdarzeń, tabela statystyk per proces i panel alertów renderowane przez `ratatui` |
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

Pełny projekt znajdziesz w [pełnej architekturze](/projects/halcyon-process-monitor/architecture).

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

## 📦 Struktura projektu

```
halcyon-process-monitor/
├── process-monitor/          # Przestrzeń użytkownika: rdzeń monitora + TUI + tryby wyjścia
│   └── src/
│       ├── main.rs           # CLI, wybór trybu, obsługa sygnałów
│       ├── monitor.rs        # ładowanie eBPF, czytnik perf, tracker ruchomego okna
│       └── tui.rs            # interfejs ratatui (zdarzenia / statystyki / alerty)
├── process-monitor-ebpf/     # Strona jądra (#![no_std], aya-ebpf)
│   └── src/main.rs           # hooki tracepoint → PerfEventArray
├── build.sh                  # Skrypt builda (nightly dla eBPF, stable dla TUI)
├── install.sh                # Instalator / deinstalator świadomy dystrybucji
└── ARCHITECTURE.md           # Pełny dokument projektowy
```

## 🔧 Wymagania

- Jądro Linuksa **5.8+** (eBPF + wsparcie tracepointów)
- **root** (`CAP_BPF` / `CAP_SYS_ADMIN`) do ładowania i dołączania programów eBPF
- Rust **nightly** + `rust-src` dla crata eBPF; **stable** dla przestrzeni użytkownika
- `bpf-linker`, `clang`, kompilator C; BTF (`/sys/kernel/btf/vmlinux`) zalecane
