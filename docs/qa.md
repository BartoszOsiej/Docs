# QA & Test Reports

Automated test sweep across every project in the registry — whole-project
suites, per-module and per-category breakdowns, performance benchmarks and
security/static-analysis checks. Run on 2026-08-13 (Linux, Rust 1.97, Node
22, Python 3).

Legend: ✅ pass · ⚠️ partial (see notes) · ❌ fail

## NV2 Engine (`NV2_ENGINE`)

**84 tests** (83 passed, 1 ignored = release benchmark) · full report:
[`TEST_REPORT.md`](https://github.com/BartoszOsiej/NV2_ENGINE/blob/main/TEST_REPORT.md)

| Suite | Result |
|---|---|
| Whole project | ✅ 83 passed, 0 failed |
| AI / ML modules (ai_generator, memplp, online_trainer, vegetation, biomes) | ✅ 22 tests |
| World & terrain (block, world) | ✅ 13 tests |
| Gameplay (interaction, crafting, inventory) | ✅ 39 tests |
| Renderer (camera, mesh, texture_registry) | ✅ 6 tests |
| Shell / misc (commands, assets) | ✅ 4 tests |
| Performance benchmark (release) | ✅ vegetation head 3.41 M pred/s · training up to 1.16 M samples/s |
| Security: `unsafe` blocks | ✅ 0 in the whole codebase |
| Clippy (`--all-targets`) | ⚠️ 46 warnings, 0 errors (pre-existing style nits) |

Reproduce: `cd Core && cargo test && cargo test --release qa_benchmark_report -- --ignored --nocapture`

## Cybersec Toolkit (`cybersec-tools`)

**13 tests** across the 4 crates — all passing.

| Crate | Tests |
|---|---|
| hashsleuth | ✅ 4 (identify + digest vectors) |
| netrecon | ✅ 4 (service names, port/CIDR parsing) |
| packeteye | ✅ 3 (Ethernet/IPv4/TCP parsing) |
| shadowscan | ✅ 2 (target normalization) |

The new tests exposed and fixed a real bug: phpass hash markers (`$P$`/`$H$`)
were compared against the lowercased hash and could never match.

Reproduce: `cargo test --workspace`

## Halcyon Process Monitor (`halcyon-process-monitor`)

✅ **3 tests pass** (userspace `process-monitor` crate) · 0 clippy warnings ·
7 `unsafe` blocks (syscall/interop layer — expected and reviewed).

> The `process-monitor-ebpf` crate targets `bpfel-unknown-none` and cannot be
> built/tested on the host toolchain; `build.sh` handles it explicitly.

Reproduce: `cargo test`

## Externum (`externum`)

✅ **118 tests pass** (`python3 -m unittest discover -s tests`) — lexer,
parser, compiler and runtime conformance, pure Python, no dependencies.

## AURORA OS (`AURORA-OS`)

✅ **34/34 core tests pass** · TypeScript typecheck clean (`tsc -p tsconfig.json`).

Reproduce: `npm test`

## Novactorio — Factorio Web Game (`Factorio-web-game`)

✅ Typecheck now **0 errors** · ✅ production build OK · lint: 0 unused-vars
errors (28 style-only `no-explicit-any` remain).

Fixes landed during the sweep:
- Weather transitions crashed (`lerped config.color` missing) — fixed
- Light alpha read out of bounds (`cfg[5]` of a 5-tuple) — fixed
- Player walk animation permanently frozen (`PlayerState.prevX/prevY`
  never existed) — now tracked by the renderer
- Missing `removeBuilding` import, dead weather/glow caches removed

Reproduce: `npm run typecheck && npm run build && npm run lint`

## LinkShort — FastAPI URL shortener (`FastAPI-url`)

⚠️ All 11 Python modules **compile clean**; the test suite (3 tests in
`tests/test_api.py`) requires `pytest` + `fastapi`, which are not installed
in the QA environment.

Reproduce: `pip install -r requirements.txt && pytest`

## N2 Mesh (`n2-mesh`)

✅ JavaScript syntax checks pass (`node --check` on all scripts). Pure static
P2P app — no build step, no test harness defined.

## Docs — this site

✅ **/pl/ 404 bug fixed** — `trailingSlash: true` so every route ships an
`index.html` (GitHub Pages requirement) · all Polish routes verified 200 ·
**0 broken links** in the build (EN + PL) · locale parity: every English page
has a Polish translation · TypeScript clean.

Reproduce: `npm run build` (fails the build on broken links).
