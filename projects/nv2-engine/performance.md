# Performance

NV2 Engine is designed around keeping GPU bandwidth, draw calls, and CPU
meshing proportional to what actually changed — not the whole world.

## GPU bandwidth: packed vertices

- CPU-side vertices are **72 bytes**; the GPU-resident format packs them to
  **36 bytes** (Snorm8x4 / Unorm8x4).
- Vertex bandwidth is halved for every chunk upload.

## Per-chunk GPU buffers

A block edit re-uploads only the affected chunk instead of the whole loaded
area (previously ~81 chunks per change). GPU uploads are additionally
debounced rather than re-uploaded every time a single chunk changes.

## Frustum culling

Gribb–Hartmann plane extraction culls chunks outside the view, with a safety
margin and a protected 3×3 area around the player to prevent over-culling.
This reduces visible chunks by roughly half on typical scenes while keeping
the player's surroundings always rendered.

## Incremental water simulation

- The water simulation rebuilds only the chunks that actually changed,
  instead of the full render radius every tick.
- Simulation and meshing are interval-based (`water_sim_interval`,
  `water_rebuild_interval`); static water never triggers a rebuild.
- Water mesh recombination is separated from full water mesh rebuilds.

## CPU meshing budget

A configurable `mesh_build_budget` spreads chunk rebuilding across frames so
the main thread never hitches on large terrain edits. Seam repair rebuilds
only neighboring chunk borders when new chunks arrive.

## Performance profiles (`settings.rs`)

All the tunables below are centralized in `settings.rs` and switched by the
**Low-End-PC** mode (one key in the menus, persisted across runs):

| Setting | Effect |
|---|---|
| `load_radius` / `render_radius` | How far the world generates and renders |
| `cleanup_radius` | When far chunks are unloaded |
| `mesh_build_budget` | Chunks rebuilt per frame |
| `water_sim_interval` / `water_rebuild_interval` | Water simulation frequency |
| Foliage density | Vegetation placement density |
| Fog density | Atmosphere draw distance |
| Vsync | Frame pacing |

## Background AI training

The neural-network vegetation trainer runs on a background thread with
**<1% overhead** and ~5–10 ms per epoch, so learning never competes with
frame time.
