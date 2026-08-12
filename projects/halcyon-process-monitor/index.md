# 🛰️ Halcyon Process Monitor

**Real-time, eBPF-based process and file-operation telemetry for Linux.**

Halcyon Process Monitor traces `execve` and `openat` syscalls at the kernel
level using eBPF tracepoints, streams the events into userspace through
per-CPU perf buffers, and surfaces them in a live terminal TUI — while
continuously scoring per-process file-open rates against a sliding window to
flag ransomware-style mass file access.

> **Project status:** production-quality Rust + eBPF engineering showcase.

---

## 🎯 What it does

| Capability | Description |
|---|---|
| **Kernel-level tracing** | `execve` and `openat` tracepoints attached on every online CPU |
| **Verifier-safe kernel code** | Userspace pointers read exclusively via `bpf_probe_read_user` — never dereferenced |
| **Zero-copy event pipeline** | Fixed-size `ProcessEvent` records streamed through per-CPU `PerfEventArray` buffers |
| **Live TUI** | Event log, per-process stats table, and alert panel rendered with `ratatui` |
| **Sliding-window heuristic** | 1-second rolling window per PID; alerts when a process exceeds the configured open rate |
| **Multiple output modes** | Human TUI, newline-delimited JSON, plain text log, and a built-in self-diagnostic |
| **Lost-event accounting** | Perf-buffer overruns are counted and reported, never silently dropped |
| **Single static binary** | Full LTO, `panic = "abort"`, symbol-stripped release profile |

## ⚙️ Architecture

Kernel-side eBPF programs capture every `execve`/`openat` into a compact
`ProcessEvent` record pushed into a `PerfEventArray`. A dedicated userspace
reader thread opens one perf buffer per CPU, decodes events, and forwards
them over an MPSC channel to the monitor core, which feeds a 1-second sliding
window per PID and emits alerts when the threshold is crossed.

```
execve/openat ─► eBPF tracepoints ─► EVENTS (PerfEventArray)
                                        │  per-CPU perf buffers
                    reader thread ◄─────┘
                        │  MPSC channel
                   monitor core (sliding window + alerting)
                        │
              TUI / JSON / plain / diagnose
```

See the [full architecture](architecture) for the complete design.

## 🚀 Quick start

```bash
# Distro-aware installer (apt, dnf, pacman, zypper, apk, xbps)
./install.sh                       # user-local install to ~/.local
./install.sh --system              # system-wide install to /usr/local

# Or build manually
./build.sh
sudo target/release/process-monitor
```

## 🖥️ Usage

```bash
sudo process-monitor                    # TUI (default when stdout is a terminal)
sudo process-monitor --alert-threshold 100   # raise alert threshold (opens/s)
sudo process-monitor --json | jq .      # machine-readable NDJSON
sudo process-monitor --plain            # plain text log
sudo process-monitor --diagnose         # 5-second end-to-end self-diagnostic
```

**TUI keys:** `q` / `Esc` / `Ctrl+C` quit · `p` pause/resume · `c` clear log ·
`↑/↓`/`j/k` scroll · `PgUp`/`PgDn` faster · `Home`/`End` jump.

## 🛡️ The ransomware heuristic

> **For every PID, keep a 1-second sliding window of `openat` calls. If the
> window contains ≥ N opens (default 50), emit an alert.**

- Sliding window, not a rate counter — bursts are caught as reliably as steady streams
- Per-process isolation — no cross-process false positives
- `--alert-threshold 0` disables the heuristic entirely

## 📦 Project layout

```
halcyon-process-monitor/
├── process-monitor/          # Userspace: monitor core + TUI + output modes
│   └── src/
│       ├── main.rs           # CLI, mode selection, signal handling
│       ├── monitor.rs        # eBPF loading, perf reader, sliding-window tracker
│       └── tui.rs            # ratatui interface (events / stats / alerts)
├── process-monitor-ebpf/     # Kernel side (#![no_std], aya-ebpf)
│   └── src/main.rs           # tracepoint hooks → PerfEventArray
├── build.sh                  # Build script (nightly for eBPF, stable for TUI)
├── install.sh                # Distro-aware installer / uninstaller
└── ARCHITECTURE.md           # Full design document
```

## 🔧 Requirements

- Linux kernel **5.8+** (eBPF + tracepoint support)
- **root** (`CAP_BPF` / `CAP_SYS_ADMIN`) to load and attach eBPF programs
- Rust **nightly** + `rust-src` for the eBPF crate; **stable** for userspace
- `bpf-linker`, `clang`, C compiler; BTF (`/sys/kernel/btf/vmlinux`) recommended
