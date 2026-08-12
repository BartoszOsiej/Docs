# Gameplay

NV2 Engine is a full survival-sandbox loop: generate a procedural world,
break and place blocks with tool gating, gather resources, craft, and
explore biomes with AI-placed vegetation.

## Controls

| Input | Action |
|---|---|
| `W` `A` `S` `D` | Move |
| `Space` | Jump (or ascend in flight mode) |
| `Shift` | Sprint (with FOV kick) |
| `F` | Toggle flight mode |
| `E` | Open / close inventory |
| `Esc` | Pause menu (or close inventory) |
| `/` | Open the command prompt |
| Left mouse | Break block (held to keep breaking; tool-gated) |
| Right mouse | Place block / use item |
| Mouse wheel | Switch hotbar slot |
| Mouse | Look around (captured while playing) |

In menus, `↑` / `↓` (or `W` / `S`) navigate and `Enter` / `Space` confirm;
`N` starts a new game and `L` loads from the main menu.

## Block interaction

- **Breaking** — left mouse; the held tool's tier gates which blocks can be
  broken (a wooden tier cannot break stone-tier blocks).
- **Placing** — right mouse places the selected hotbar block.
- Interaction is driven by block raycasting in `interaction.rs`, bridged to
  gameplay and GUI state through the renderer's `InteractionController`.

## Inventory, hotbar & crafting

- **Hotbar** — scroll to switch the active stack.
- **Inventory** — `E` opens the full overlay; drag-and-drop stack management.
- **Crafting** — recipe-driven; a 2×2 player crafting overlay and the 3×3
  NVCrafter overlay. Recipes are parsed from JSON and matched against
  inventory contents in `crafting.rs`.

## Movement & physics

Walking, sprinting (with an FOV kick), jumping, gravity, fall-speed
limiting, and water-specific sinking. Flight mode (`F`) disables gravity.
Collision is AABB-based against solid blocks; movement modifiers are sampled
from the block medium the player stands in.

## Commands

Open the prompt with `/` and type a command:

```
/locate forest       Find the nearest forest biome
/tp 100 80 -50       Teleport to absolute coordinates
```

Commands are dispatched by `commands::execute(...)` in `commands.rs`.

## World persistence

The world serializes to JSON (`saves/world.json`) via `world/storage.rs`
using serde/serde_json. The pause menu offers **Save** and **Save & Exit**;
the main menu **Load/Save** restores a saved world.

## Day/night & atmosphere

The renderer drives day/night phase progression through `elapsed_time`,
water animation timing, climate/biome-driven fog and ambient color uniforms,
a crosshair, subtitle overlays, and the command prompt overlay.
