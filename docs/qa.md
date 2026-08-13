# QA & Test Reports

Automated test sweep across every project in the registry — whole-project
suites, per-module and per-category breakdowns, performance benchmarks and
security/static-analysis checks. Run on 2026-08-13 (Linux, Rust 1.97, Node
22, Python 3).

Legend: ✅ pass · ⚠️ partial (see notes) · ❌ fail

## NV2 Engine (`NV2_ENGINE`)

**97 tests** (96 passed, 1 ignored = release benchmark) · full report:
[`TEST_REPORT.md`](https://github.com/BartoszOsiej/NV2_ENGINE/blob/main/TEST_REPORT.md)

| Suite | Result |
|---|---|
| Whole project | ✅ 96 passed, 0 failed |
| AI / ML modules (ai_generator, memplp, online_trainer, vegetation, biomes) | ✅ 32 tests |
| World & terrain (block, world) | ✅ 13 tests |
| Gameplay (interaction, crafting, inventory) | ✅ 38 tests |
| Renderer (camera, mesh, texture_registry) | ✅ 6 tests |
| Shell / misc (commands, assets) | ✅ 7 tests |
| Performance benchmark (release) | ✅ vegetation head ~1.44 M pred/s · training up to ~0.96 M samples/s (this machine) |
| Security: `unsafe` blocks | ✅ 0 in the whole codebase |
| Clippy (`--all-targets`) | ⚠️ 43 warnings, 0 errors (pre-existing style nits; new code warning-free) |

**Bug found & fixed during this sweep — NaN checkpoint corruption:**
background training could explode weights into NaN (unbounded gradient
updates), and serde_json serialises NaN as JSON `null`, which made the whole
checkpoint unloadable. Fixed with three layers of defence: gradient clipping
+ bounded updates in `Mlp::train`, NaN/Inf sanitisation on save, and
tolerant loading (`null` weights read back as `0.0`). 4 new regression
tests added — see `Src/world/memplp.rs` and `Src/world/ai_generator.rs`.

**Phase-2 features landed in the same sweep** (each with tests):
community **model sharing** (`/ai_export`, `/ai_import` — portable
`nv2-model-bundle`), **training-dataset import** (`/ai_dataset`), and
**player-preference learning** (per-class counters in the checkpoint,
blended into training targets). 9 new tests total.

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

✅ Typecheck **0 errors** · ✅ production build OK · ✅ **lint 0 errors**
(all 28 `no-explicit-any` removed in this sweep; 7 react-hooks style
warnings remain).

Fixes landed during the sweep:
- Weather transitions crashed (`lerped config.color` missing) — fixed
- Light alpha read out of bounds (`cfg[5]` of a 5-tuple) — fixed
- Player walk animation permanently frozen (`PlayerState.prevX/prevY`
  never existed) — now tracked by the renderer
- Missing `removeBuilding` import, dead weather/glow caches removed
- **Save format typed** — `SaveData` tuples now typed; the previously
  loaded-but-never-saved `totalPollutionGenerated` / `worldSeed` are now
  persisted

Reproduce: `npm run typecheck && npm run build && npm run lint`

## LinkShort — FastAPI URL shortener (`FastAPI-url`)

✅ **11/11 API tests pass** — `tests/test_api.py`: health, register/login,
me, duplicate-email rejection, auth-gated shorten, per-user `/urls/my`
isolation, click counting, 404s, delete + ownership enforcement.
All 11 Python modules compile clean. Ran on **Python 3.9** (the QA
environment's default 3.14 has no prebuilt wheels for the 2024-pinned
`pydantic-core`/`bcrypt`; the Docker image uses 3.12, where the pins
install cleanly).

Reproduce: `python3.9 -m venv venv && venv/bin/pip install -r requirements.txt && venv/bin/pytest tests/ -v`

## N2 Mesh (`n2-mesh`)

✅ **19/19 unit tests pass** (`npm test`, `node:test` on `core.js`) ·
syntax checks clean. Pure logic (bytes, ids, dedup, room parsing, the
MQTT 3.1.1 packet layer) was extracted into `core.js` for headless
testing.

The tests caught a real bug: `mqttParsePublish` checked the **DUP flag**
(`0x08`) instead of the **QoS level** (`0x06`) when skipping packet ids,
misparsing QoS-1 PUBLISH payloads — fixed.

## Docs — this site

✅ **/pl/ 404 bug fixed** — `trailingSlash: true` so every route ships an
`index.html` (GitHub Pages requirement) · all Polish routes verified 200 ·
**0 broken links** in the build (EN + PL) · locale parity: every English page
has a Polish translation · TypeScript clean.

Reproduce: `npm run build` (fails the build on broken links).
