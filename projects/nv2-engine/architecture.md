# Architecture

NV2 Engine is organized as a Rust runtime in `Core/Src` plus auxiliary .NET
content-pipeline tools in `Bridge/Tools`. The application entry point is
`Core/Src/main.rs`, which uses `winit::application::ApplicationHandler` and
manages three explicit runtime modes: `MainMenu`, `Playing`, and `PauseMenu`.

## Layer overview

```
┌──────────────────────────────────────────────────────────────┐
│  App shell (Core/Src/main.rs)                                │
│  winit event loop · modes (MainMenu/Playing/PauseMenu)       │
│  input routing · save/load · slash commands · subtitle UI    │
└──────────────┬───────────────────────┬───────────────────────┘
               │                       │
┌──────────────▼───────────────┐  ┌────▼───────────────────────┐
│  Renderer (renderer/)       │  │  World (world/)            │
│  wgpu pipelines             │  │  chunk map (cx,cz) -> Chunk│
│  solid + water + UI + text  │  │  Biomes + ChunkGenerator   │
│  frustum culling            │  │  background generation     │
│  per-chunk GPU buffers      │  │  water simulation          │
│  texture atlas + packs      │  │  AI vegetation + training  │
└──────────────┬───────────────┘  └────┬───────────────────────┘
               │                       │
               └───────────┬───────────┘
                           ▼
              Camera::tick_movement (AABB collision,
              gravity, flight, water sinking)
```

## App shell (`main.rs`)

The `App` struct owns the renderer state, the `World` instance, input
accumulation, save/load paths, status/subtitle messaging, slash-command
input state, and menu selection state. Runtime behaviors handled here:

- New game, save and load flows
- Pause/resume transitions and cursor capture toggling
- Slash-command prompt (opened with `/`), routed to `commands::execute(...)`
- On-screen feedback passed to the renderer subtitle/command prompt system

## Rendering architecture (`renderer/`)

`renderer::State` owns the WGPU surface/device/queue, camera and
material/biome uniforms, a depth texture, the texture atlas and bind groups,
and separate pipelines for:

- solid world geometry
- water geometry
- flat UI panels
- sprite-based UI icons
- text rendering

Chunk meshes and water meshes are cached separately by chunk coordinate.
Mesh creation is rate-limited (only a small number of chunks per frame),
GPU uploads are debounced, water mesh recombination is separated from full
rebuilds, and seam repair rebuilds neighboring chunk borders when new chunks
arrive.

## World & chunk streaming (`world/`)

`World` stores loaded chunks in a `(cx, cz) -> Chunk` map with a shared
`BiomeGenerator` and a `ChunkGenerator` for background generation. Chunks
are 16×512×16 blocks; generation is parallelized with rayon through batched
async dispatch onto the global thread pool.

## Camera, movement & collision (`renderer/camera.rs`)

The authoritative movement path is: event/input capture in `main.rs` →
`renderer::State::update(...)` → `Camera::tick_movement(...)`. Implemented:

- First-person camera rotation, walking, sprinting, jumping
- Flight toggle (F) and gravity with fall-speed limiting
- Water-specific gravity and sinking behavior
- AABB-based collision against solid blocks
- Input-intent capture separated from movement integration
- Runtime movement modifiers sampled from overlapping block mediums
  (`BlockType::movement_medium(...)`, with `in_foliage_medium` and
  `footstep_volume` tracked for future audio hooks)

## UI & text

UI is a hybrid of procedural flat panel quads, sprite-based item icons
derived from the atlas, and fontdue-backed text layers. Systems include the
main menu, pause menu, hotbar, full inventory overlay, 2×2 and 3×3 crafting
overlays, hovered-slot detection, the command prompt, and subtitle/status
messaging. Menus live in `renderer/menu.rs`; font rasterization and text
measurement live in `renderer/text.rs`.

## Content pipeline (`Bridge/Tools`)

.NET 8 tools (`System.Drawing.Common`) perform atlas slicing and PNG
extraction. Python (`generate_textures.py`, Pillow) handles rotation,
flipping, brightness, grayscale/invert, and related texture transforms.
The repo also includes a custom Vulkan layer (`VkLayer_NV20.json` /
`VkLayer_NV20.dll`) usable from the VS Code task configuration.
