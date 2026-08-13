# Monitor Procesów Halcyon — Architektura

Wewnętrzna architektura Monitora Procesów Halcyon: programy eBPF po stronie
jądra, pipeline zdarzeń w przestrzeni użytkownika, heurystyka alertów
z ruchomym oknem i warstwa wyjścia.

---

## 1. Przegląd systemu

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PRZESTRZEŃ JĄDRA                                │
│   wejście syscall       programy tracepoint eBPF             map            │
│  ┌───────────┐   ┌──────────────────────────────────┐   ┌──────────────┐    │
│  │ execve    │──►│ process-monitor-ebpf             │──►│   EVENTS     │    │
│  │ openat    │   │  #[tracepoint] sys_enter_execve  │   │ PerfEventArray│   │
│  └───────────┘   │  #[tracepoint] sys_enter_openat  │   └──────┬───────┘    │
│                  └──────────────────────────────────┘          │ per-CPU    │
└─────────────────────────────────────────────────────────────────┼───────────┘
┌─────────────────────────────────────────────────────────────────▼───────────┐
│                           PRZESTRZEŃ UŻYTKOWNIKA                              │
│   wątek czytnika ──► kanał MPSC ──► Monitor (ruchome okno + alerty)          │
│                                            │                                │
│                            TUI │ JSON │ Plain │ Diagnose                     │
└──────────────────────────────────────────────────────────────────────────────┘
```

Dwa crate'y tworzą workspace:

| Crate | Rola | Toolchain |
|---|---|---|
| `process-monitor-ebpf` | Programy tracepoint po stronie jądra, `#![no_std]`, aya-ebpf | Rust **nightly** (`-Z build-std`) |
| `process-monitor` | Przestrzeń użytkownika: loader, wątek czytnika, rdzeń monitora, tryby wyjścia | Rust **stable** |

## 2. Strona jądra — `process-monitor-ebpf`

Oba programy działają w **kontekście tracepoint** przy wejściu syscall,
zanim jądro skopiuje argumenty, więc wszystkie wskaźniki przestrzeni
użytkownika są czytane przez `bpf_probe_read_user` — nigdy nie
dereferencjonowane. To utrzymuje kod bezpiecznym dla weryfikatora.

Jądro i przestrzeń użytkownika zgadzają się na stały układ `#[repr(C)]`,
więc rekordy są memcpy'owane przez bufor perf bez serializacji:

```rust
pub struct ProcessEvent {
    pub event_type: u8,             // 0 = EXEC, 1 = OPEN
    pub pid: u32,
    pub uid: u32,
    pub comm: [u8; 16],             // comm procesu (ucięty)
    pub filename: [u8; 64],         // ścieżka celu (ucięta)
}
```

**85-bajtowy payload**, który zajmuje **92 bajty na wire** — mały i
o stałym rozmiarze, co czyni buforowanie perf per-CPU tanim (bez alokacji,
bez kodowania o zmiennej długości w kontekście jądra).

## 3. Przestrzeń użytkownika — `process-monitor`

### Sekwencja startowa (`Monitor::start`)

1. **Kontrola uprawnień** — kończy pracę, chyba że `geteuid() == 0`.
2. **Ładowanie obiektu** — `aya::Ebpf::load_file` parsuje skompilowany
   obiekt eBPF.
3. **Ładowanie + dołączenie programu** — każdy program `TracePoint`
   dołącza do `syscalls/sys_enter_execve` / `sys_enter_openat`.
4. **Przekazanie mapy** — `EVENTS` `PerfEventArray` przechodzi do wątku
   czytnika.
5. **Kanał** — MPSC łączy wątek czytnika → monitor.

### Wątek czytnika (`halcyon-reader`)

- Wylicza aktywne CPU, otwiera jeden `PerfEventArrayBuffer` na CPU.
- Dekoduje partie do wstępnie zaalokowanych pul `BytesMut` (zero alokacji
  per zdarzenie w gorącej pętli).
- Liczy `events.lost` (przepełnienia buforów perf) i przekazuje `Msg::Lost`.
- Bezczyni 1 ms, gdy żaden bufor nie ma danych — ~1 ms latencji, ~zero
  bezczynnego CPU.

### Rdzeń monitora

```
stats:   HashMap<u32, ProcStats>          // pid → skumulowane statystyki
windows: HashMap<u32, VecDeque<Instant>>  // pid → timestampy otwarć (okno 1 s)
```

`handle_event` rejestruje statystyki, wpycha timestampy `Open` na ruchome
okno PID, usuwa wpisy starsze niż 1 s i emituje `Alert` dokładnie wtedy,
gdy okno przekroczy skonfigurowany próg (`--alert-threshold`, `0` wyłącza).

### Warstwa wyjścia

`Monitor::poll` zwraca `Vec<Output>` per tick (`Event` | `Alert`) routowany
przez tryb: **TUI** (`ratatui`: przewijany log zdarzeń, tabela top
procesów, panel alertów, pasek statusu) · **JSON** (NDJSON) · **Plain** ·
**Diagnose** (weryfikuje ID tracepointów pod
`/sys/kernel/tracing/events`, ładuje + dołącza, nasłuchuje 5 s, drukuje
liczniki).

## 4. Podsumowanie przepływu danych

```
jądro                 czytnik w przestrzeni użytkownika    rdzeń monitora            wyjście
──────────             ─────────────────────────────────   ─────────────            ──────
openat entry ──► mapa EVENTS ──► bufor perf ──► Msg::Event ──► ruchome okno ──► TUI / JSON / plain
                                 (per CPU)            │                │
                                                      └─ Msg::Lost ────► licznik utraty ──► pasek statusu
                                                                        └─ Alert (próg) ──► panel alertów
```

## 5. Charakterystyka wydajności

| Aspekt | Projekt |
|---|---|
| Narzut jądra | Dwa programy tracepoint; rekord o stałym rozmiarze; bez alokacji |
| Dekodowanie w przestrzeni użytkownika | Wstępnie zaalokowane pule `BytesMut`; zero alokacji per zdarzenie |
| Latencja | Zdarzenia zwykle widoczne w < 1 ms |
| Bezczynny CPU | Czytnik śpi 1 ms, gdy żadne bufory nie mają danych |
| Pamięć | Ruchome okno usuwa wpisy przy każdym poll; mapy ograniczone przez żywe PID-y |
| Binarium | Pełne LTO + `strip = "symbols"` + `panic = "abort"` profil release |
