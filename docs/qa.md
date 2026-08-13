# QA & Test Reports

Automated test sweep across every project in the registry — whole-project
suites, per-module breakdowns, performance benchmarks and
security/static-analysis checks. Run on 2026-08-13 (Linux, Rust 1.97, Node
22, Python 3).

Legend: ✅ pass · ⚠️ partial (see notes) · ❌ fail

## Overview

| # | Project | Suite | Total | Passed | Failed | Ignored | Status |
|---|---------|-------|-------|--------|--------|---------|--------|
| 1 | [NV2 Engine](#nv2-engine-nv2_engine) | `cargo test` | 97 | 96 | 0 | 1 (release bench) | ✅ |
| 2 | [Cybersec Toolkit](#cybersec-toolkit-cybersec-tools) | `cargo test --workspace` | 13 | 13 | 0 | 0 | ✅ |
| 3 | [Halcyon Process Monitor](#halcyon-process-monitor-halcyon-process-monitor) | `cargo test` | 3 | 3 | 0 | 0 | ✅ |
| 4 | [Externum](#externum-externum) | `unittest discover` | 118 | 118 | 0 | 0 | ✅ |
| 5 | [AURORA OS](#aurora-os-aurora-os) | `npm test` + `tsc` | 34 | 34 | 0 | 0 | ✅ |
| 6 | [Novactorio](#novactorio--factorio-web-game-factorio-web-game) | typecheck + build + lint | — | — | — | — | ✅ |
| 7 | [LinkShort](#linkshort--fastapi-url-shortener-fastapi-url) | `pytest tests/` | 11 | 11 | 0 | 0 | ✅ |
| 8 | [N2 Mesh](#n2-mesh-n2-mesh) | `npm test` | 19 | 19 | 0 | 0 | ✅ |
| 9 | [Docs — this site](#docs--this-site) | `npm run build` | — | — | — | — | ✅ |

**Σ 295 automated tests · 294 passed · 0 failed** (+ build/lint/typecheck
gates on the web projects).

---

## NV2 Engine (`NV2_ENGINE`)

**97 tests** (96 passed, 1 ignored = release benchmark) · full report:
[`TEST_REPORT.md`](https://github.com/BartoszOsiej/NV2_ENGINE/blob/main/TEST_REPORT.md)

| Suite | Tests | Result |
|---|---|---|
| Whole project | 97 (96 + 1 ignored) | ✅ 96 passed, 0 failed |
| AI / ML modules (ai_generator, memplp, online_trainer, vegetation, biomes) | 32 | ✅ |
| World & terrain (block, world) | 13 | ✅ |
| Gameplay (interaction, crafting, inventory) | 38 | ✅ |
| Renderer (camera, mesh, texture_registry) | 6 | ✅ |
| Shell / misc (commands, assets) | 7 | ✅ |

| Module | Tests | Result |
|---|---|---|
| `world::ai_generator` (AI system, model bundles, datasets, preferences, checkpoints, textures) | 16 | ✅ |
| `world::memplp` (MeMLP core — train/forward, NaN hardening, migration, JSON roundtrip) | 10 | ✅ |
| `interaction` (block break/place incl. AI feedback) | 19 | ✅ |
| `inventory` | 13 | ✅ |
| `world::block` (block registry) | 7 | ✅ |
| `commands` (locate/tp + `/ai_export`, `/ai_import`, `/ai_dataset`, `/ai_stats`) | 6 | ✅ |
| `world` (world manager, spawn, raycast, saves) | 6 | ✅ |
| `crafting` | 6 | ✅ |
| `world::vegetation` (AI placement, canopies, tree pass) | 3 | ✅ |
| `renderer::camera` | 3 | ✅ |
| `world::online_trainer` (internet datasets + offline fallback) | 2 | ✅ |
| `renderer::mesh` (chunk meshing + water) | 2 | ✅ |
| `world::biomes` | 1 | ✅ |
| `renderer::texture_registry` | 1 | ✅ |
| `assets` | 1 | ✅ |

| Check | Result |
|---|---|
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

---

## Cybersec Toolkit (`cybersec-tools`)

**13 tests** across the 4 crates — all passing.

| Crate | Tests | Coverage | Result |
|---|---|---|---|
| hashsleuth | 4 | identify + digest vectors | ✅ |
| netrecon | 4 | service names, port/CIDR parsing | ✅ |
| packeteye | 3 | Ethernet/IPv4/TCP parsing | ✅ |
| shadowscan | 2 | target normalization | ✅ |

The new tests exposed and fixed a real bug: phpass hash markers (`$P$`/`$H$`)
were compared against the lowercased hash and could never match.

Reproduce: `cargo test --workspace`

---

## Halcyon Process Monitor (`halcyon-process-monitor`)

**3 tests** (userspace `process-monitor` crate).

| Check | Result |
|---|---|
| Unit tests (`cargo test`) | ✅ 3 passed, 0 failed |
| Clippy | ✅ 0 warnings |
| `unsafe` blocks | ⚠️ 7 (syscall/interop layer — expected and reviewed) |

> The `process-monitor-ebpf` crate targets `bpfel-unknown-none` and cannot be
> built/tested on the host toolchain; `build.sh` handles it explicitly.

Reproduce: `cargo test`

---

## Externum (`externum`)

**118 tests** — pure Python, no dependencies.

| Test class | Stage | Tests | Result |
|---|---|---|---|
| `TestLexer` | Lexer | 10 | ✅ |
| `TestParser` | Parser | 28 | ✅ |
| `TestCompiler` | Compiler | 6 | ✅ |
| `TestRuntime` | Runtime conformance | 55 | ✅ |
| `TestMultilineLiterals` | Extra: multi-line literals | 5 | ✅ |
| `TestClassesWithBlankLines` | Extra: classes with blank lines | 2 | ✅ |
| `TestMoreFeatures` | Extra: comprehensions, bitwise, `with`/`assert`, f-strings… | 12 | ✅ |

Reproduce: `python3 -m unittest discover -s tests`

---

## AURORA OS (`AURORA-OS`)

**34/34 core tests** (EventBus, FileSystem, shell interpreter) ·
TypeScript typecheck clean.

| Area | Tests | Result |
|---|---|---|
| Core logic (`npm test`, Node harness) | 34 | ✅ 34 passed, 0 failed |
| TypeScript (`tsc -p tsconfig.json`) | — | ✅ 0 errors |

Reproduce: `npm test`

---

## Novactorio — Factorio Web Game (`Factorio-web-game`)

No unit-test harness; the quality gates are typecheck, build and lint.

| Gate | Result |
|---|---|
| Typecheck (`tsc --noEmit -p tsconfig.app.json`) | ✅ 0 errors |
| Production build (`vite build`) | ✅ built in ~4 s |
| Lint (`eslint .`) | ✅ 0 errors (all 28 `no-explicit-any` removed; 7 react-hooks style warnings remain) |

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

---

## LinkShort — FastAPI URL shortener (`FastAPI-url`)

**11/11 API tests pass** — `tests/test_api.py` (Python 3.9 venv).

| Test | Endpoint(s) | Asserts | Result |
|---|---|---|---|
| `test_health` | `GET /health` | 200 | ✅ |
| `test_register_login` | `POST /auth/register`, `/auth/login` | JWT issued | ✅ |
| `test_shorten` | `POST /urls/shorten`, `GET /urls/{code}/stats`, `GET /urls/r/{code}` | 200 + 302 redirect | ✅ |
| `test_login_and_me` | `/auth/login`, `/auth/me` | 200; wrong password → 401; no token → 401/403 | ✅ |
| `test_duplicate_email_rejected` | `POST /auth/register` | duplicate → 400 | ✅ |
| `test_shorten_requires_auth` | `POST /urls/shorten` | no token → 401/403 | ✅ |
| `test_my_urls_lists_only_own_links` | `GET /urls/my` | per-user isolation | ✅ |
| `test_redirect_counts_clicks` | `GET /urls/r/{code}`, stats | 3 hits → `clicks == 3` | ✅ |
| `test_stats_404_for_unknown_code` | `GET /urls/zzzzzz/stats` | 404 | ✅ |
| `test_delete_removes_link` | `DELETE /urls/{code}`, redirect | 204; redirect after delete → 404 | ✅ |
| `test_delete_enforces_ownership` | `DELETE /urls/{code}` (two users) | other user → 404 | ✅ |

All 11 Python modules compile clean. Ran on **Python 3.9** (the QA
environment's default 3.14 has no prebuilt wheels for the 2024-pinned
`pydantic-core`/`bcrypt`; the Docker image uses 3.12, where the pins
install cleanly).

Reproduce: `python3.9 -m venv venv && venv/bin/pip install -r requirements.txt && venv/bin/pytest tests/ -v`

---

## N2 Mesh (`n2-mesh`)

**19/19 unit tests pass** (`npm test`, `node:test` on `core.js`) — pure
logic extracted into `core.js` (no browser, no network, no deps).

| Group | Tests | Coverage | Result |
|---|---|---|---|
| Bytes | 2 | utf8 round-trips, plain arrays | ✅ |
| Ids & dedup | 5 | `newMid` uniqueness; `isNewMid` first-sight/expiry/cap; empty ids | ✅ |
| Room parsing | 2 | hash normalisation, 48-char cap, `lobby` fallback | ✅ |
| Nick colors | 1 | stable, deterministic | ✅ |
| MQTT packets | 9 | single/multi-byte remaining length, PINGREQ, PUBLISH round-trip, QoS>0 packet id, CONNECT header, SUB/UNSUB structure | ✅ |

The tests caught a real bug: `mqttParsePublish` checked the **DUP flag**
(`0x08`) instead of the **QoS level** (`0x06`) when skipping packet ids,
misparsing QoS-1 PUBLISH payloads — fixed.

Reproduce: `npm test && npm run check`

---

## Docs — this site

| Check | Result |
|---|---|
| Production build (`npm run build`, EN + PL) | ✅ 0 broken links (fails the build on broken links) |
| Polish routes (`/Docs/pl/…`) | ✅ all verified 200 (`trailingSlash: true`) |
| Locale parity | ✅ every English page has a Polish translation |
| TypeScript | ✅ clean |

Reproduce: `npm run build`
