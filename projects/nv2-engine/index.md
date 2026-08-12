# NV2 Engine

> **A native Rust voxel engine with AI-driven procedural worlds.**

NV2 Engine (repository: `NV2_ENGINE`) is a desktop voxel game and engine
written in Rust with `wgpu` rendering. It combines procedural terrain
generation (OpenSimplex2 noise), realistic biomes, a neural-network-driven
vegetation system that trains in the background while you play, animated water
simulation, a full block breaking/placing interaction layer, inventory and
crafting, save/load, and an in-game command system.

**Stack:** Rust 2021, wgpu 0.20, winit 0.30, cgmath 0.18, OpenSimplex2,
rayon, ndarray, serde/serde_json, fontdue.

## Highlights

- **Procedural worlds** — OpenSimplex2 heightmaps, caves, and 7+ biomes
  (forest, jungle, taiga, swamp, plains, highlands, and more).
- **512-block-deep chunks** (16×512×16) — tall mountains, deep caves, ready
  for unlimited-height streaming.
- **AI vegetation** — an embedded 8→16→4 MLP (~1.2 KB) learns in the
  background (<1% CPU overhead) and places 22 vegetation block types where
  they belong by biome.
- **GPU-efficient rendering** — per-chunk GPU buffers, frustum culling,
  36-byte packed vertices, and incremental water meshing.
- **Full gameplay loop** — break/place blocks, tool gating, inventory,
  hotbar, crafting, flight, sprint with FOV kick, save/load, and commands.
- **Low-End-PC mode** — one-key performance profile persisted across runs.

## Quick start

Requires a Rust toolchain (stable is enough) and a GPU with
Vulkan/Metal/DX12/GL support.

```bash
cd Core
cargo run --release
```

The game opens a window with the main menu: **New Game**, **Load/Save**,
**Low-End-PC**, and **Quit**. `N` starts a new game, `L` loads from the menu.

> **Note:** `cargo run` in dev mode already builds third-party crates at
> `opt-level 3`, so even a debug build plays smoothly.

## Related pages

- [Architecture](architecture) — runtime, renderer, world, UI layers
- [Gameplay](gameplay) — controls, interaction, inventory, crafting, commands
- [AI Vegetation System](ai) — the embedded neural network and training loop
- [Performance](performance) — GPU bandwidth, culling, meshing budgets
