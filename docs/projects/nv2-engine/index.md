# NV2 Engine

> **A native Rust voxel engine with AI-driven procedural worlds — a full desktop voxel game built on wgpu, featuring an embedded neural network that learns vegetation placement while you play.**

NV2 Engine (repository: `NV2_ENGINE`) is not a terrain prototype — it is a
**complete, playable voxel game and engine** written in Rust (15,800+ lines of
source across 30+ modules). It combines procedural terrain generation,
realistic climate-driven biomes, a neural-network vegetation system that
trains in the background with &lt;1% CPU overhead, animated water simulation, a
full block breaking/placing interaction layer with tool tiers and durability,
inventory and hotbar management, recipe-driven crafting (2×2 and 3×3),
save/load persistence, an in-game command system, and a complete GUI stack —
all rendered with GPU-efficient techniques.

**Stack:** Rust 2021 · wgpu 0.20 · winit 0.30 · cgmath 0.18 · OpenSimplex2 ·
rayon · ndarray · serde/serde_json · fontdue · image 0.25 · bytemuck ·
env_logger · C#/.NET 8 (content tools) · Python/Pillow (texture tools)

---

## Feature matrix

### World & terrain
| Feature | Detail |
|---|---|
| **Procedural generation** | OpenSimplex2 heightmaps, caves, ores, water-aware column sampling |
| **Chunk dimensions** | 16×512×16 — double-height chunks (raised from 256) for tall mountains & deep caves |
| **Biomes** | 9 climate-driven biomes: Ocean, Coast, Plains, Forest, Dark Forest, Swamp, Taiga, Desert, Mountains |
| **Climate model** | Temperature + humidity drive block distribution, vegetation density, fog and ambient color |
| **Generation channels** | Dedicated OpenSimplex channels + seeds for continent shape, temperature, humidity, erosion, peaks/relief, height/detail, warp, caves, ores, water |
| **Async generation** | Bounded work queue, in-flight dedup, rayon parallel generation, mpsc delivery to main thread |

### AI-driven vegetation — MeMLP
| Feature | Detail |
|---|---|
| **Architecture** | **MeMLP** (Modular embedded Multi-layer Perceptron Model) — modular, in-process, pure CPU, one JSON checkpoint |
| **Vegetation head** | Deep MLP 8→24→16→4, ~0.3 µs/prediction (3.4 M/s) |
| **Biome head** | 8→12→9 — biome classification driving biome-aware decorations |
| **Texture head** | 8→12→6 — procedural texture-style selection |
| **Input features** | 8 terrain features: height, slope, temperature, humidity, water distance, plant density, light, noise seed |
| **Output classes** | 4 vegetation classes: flowers, ferns/water plants, sticks/decorations, pebbles/rocks |
| **Background training** | Continuous thread, 240+ samples/epoch across all heads, &lt;1% CPU overhead |
| **Training method** | Online SGD + cross-entropy, backprop through all layers; trains on player feedback, online climate data (offline-safe) and synthetic samples |
| **Checkpoints** | Single JSON file; legacy 8→16→4 checkpoints migrate automatically |
| **Vegetation blocks** | 22 new block types: roses, tulips (4 colors), dandelions, cornflower, allium, azalea, ferns, lily pads, seagrass, kelp, moss carpet, vines, sticks, pebbles |
| **Confidence threshold** | 0.40 — only high-confidence predictions place blocks |

### Rendering (wgpu 0.20)
| Feature | Detail |
|---|---|
| **Per-chunk GPU buffers** | A block edit re-uploads only that chunk (previously ~81 chunks per change) |
| **Frustum culling** | Gribb–Hartmann plane extraction with safety margin + protected 3×3 area around player |
| **Packed vertices** | 72-byte CPU vertices → 36-byte GPU format (Snorm8x4/Unorm8x4) |
| **Incremental water meshing** | Only changed chunks rebuild; interval-based simulation |
| **Separate pipelines** | Solid world, water, flat UI panels, sprite UI icons, text rendering |
| **Texture atlas** | Dynamic atlas, switchable texture packs, top/bottom/side variants |
| **Text rendering** | fontdue rasterization, custom text layers |

### Gameplay
| Feature | Detail |
|---|---|
| **Block interaction** | DDA raycast targeting, held-break mining, right-click placement |
| **Tool tiers** | Hand → Flint → Stone → Iron → Diamond → Netherite, with power values and durability |
| **Inventory** | 36-slot inventory + 9-slot hotbar, stack merging, drag-and-drop |
| **Crafting** | 2×2 player grid + 3×3 NVCrafter station, shaped & shapeless recipes |
| **Recipes** | 18 recipes: planks, sticks, NVCrafter, wooden pickaxe/axe/shovel/hoe, torches, chest, door, trapdoor, ladder, fence, fence gate, workbench upgrade, flint/stone/iron pickaxes |
| **Movement** | Walk, sprint (FOV kick), jump, flight, water gravity/sinking, AABB collision, foliage movement modifiers |
| **Commands** | `/locate &lt;biome&gt; [--tp]`, `/tp &lt;x&gt; &lt;y&gt; &lt;z&gt;` |
| **Persistence** | JSON world saves (seed, chunk blocks, water metadata, NVCrafter states) |

### Special gameplay logic
| Feature | Detail |
|---|---|
| **Flint drops** | Gravel can drop flint via deterministic seeded logic |
| **Tree harvesting** | Destroying a trunk harvests the connected trunk/leaves cluster |
| **Leaf drops** | Leaves drop saplings and sticks with deterministic odds |
| **Crafter flush** | Breaking an NVCrafter flushes stored contents into world drops |
| **Placement guard** | Blocks cannot be placed inside the player AABB |

---

## Quick start

Requires a Rust toolchain (stable is enough) and a GPU with
Vulkan/Metal/DX12/GL support.

```bash
cd Core
cargo run --release
```

The game opens a window with the main menu:

| Menu item | Action |
|---|---|
| **New Game** | Start a new procedurally generated world |
| **Load/Save** | Load the saved world |
| **Low-End-PC** | Toggle the low-end performance profile |
| **Quit** | Exit |

> **Note:** `cargo run` in dev mode already builds third-party crates at
> `opt-level 3`, so even a debug build plays smoothly.

**First minutes in-game:** spawn near a forest → punch trees with your bare
hands → gather wood → open the 2×2 crafting grid (`E`) → craft wooden
planks → sticks → a wooden pickaxe → mine stone → craft a stone pickaxe →
mine iron → eventually craft an NVCrafter for 3×3 recipes.

---

## Documentation index

| Page | Contents |
|---|---|
| [Architecture](/projects/nv2-engine/architecture) | Full runtime, renderer, world, UI layering — module by module |
| [Gameplay](/projects/nv2-engine/gameplay) | Controls, interaction, inventory, crafting, commands, persistence |
| [Blocks & Biomes](/projects/nv2-engine/blocks) | Complete 97-block registry, tool tiers, 9 biome definitions, ores |
| [Crafting Reference](/projects/nv2-engine/crafting) | Every recipe with exact patterns |
| [Water Simulation](/projects/nv2-engine/water) | Liquid encoding, solver, and rendering internals |
| [AI Vegetation System](/projects/nv2-engine/ai) | Network math, training loop, hyperparameters, integration |
| [Performance](/projects/nv2-engine/performance) | GPU bandwidth, culling, meshing budgets, profiles |
| [Development](/projects/nv2-engine/development) | Build, module map, testing, extending the engine |
| [Roadmap & Changelog](/projects/nv2-engine/roadmap) | History, Phase 2 plans, known limitations |
