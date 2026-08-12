# Crafting Reference

Every recipe registered in `crafting.rs`, with exact patterns. The engine
supports **shaped recipes** (fixed patterns with offset matching) and
**shapeless recipes** (multiset matching).

## Surfaces

| Surface | Grid | Notes |
|---|---|---|
| Player crafting | 2×2 | Always available via `E` |
| NVCrafter | 3×3 | World-placed station; state persists in saves |

## Shapeless recipes

| Output | Input |
|---|---|
| Planks ×4 | 1 log (any wood) |

## Shaped recipes

Legend: `P` = Planks, `S` = Stick, `L` = log, `I` = Iron Ingot, `F` = Flint.

### Wood processing
**Sticks ×4** — `[P][P]`

### NVCrafter
```
[P][P][P]
[P][L][P]    (log in center)
[P][P][P]
```

### Wooden tools
**Wooden Pickaxe**
```
[P][P][P]
[ ][S][ ]
[ ][S][ ]
```

**Wooden Axe**
```
[P][P][ ]
[P][S][ ]
[ ][S][ ]
```

**Wooden Shovel**
```
[P][ ][ ]
[S][ ][ ]
[S][ ][ ]
```

**Wooden Hoe**
```
[P][P][ ]
[ ][S][ ]
[ ][S][ ]
```

### Torches
`[S][L]` → Torch

### Storage & furniture
**Chest** — 3×3 ring of planks with empty center
**Door** — 2×3 of planks
**Trapdoor** — 2×2 of planks
**Ladder** — stick/plank pattern
**Fence** — 2×3 plank+stick pattern
**Fence Gate** — 2×3 pattern
**Workbench Upgrade** — plank upgrade recipe

### Pickaxe progression
| Recipe | Pattern |
|---|---|
| Flint Pickaxe | Shapeless (flint + sticks) |
| Stone Pickaxe | Stone head + 2 sticks |
| Iron Pickaxe | Iron Ingot head + 2 sticks |

## Matching logic

- **Shaped:** `shaped_recipe_matches(grid, recipe)` — pattern is matched with
  offset support against the grid.
- **Shapeless:** `shapeless_recipe_matches(grid, recipe)` — multiset matching
  (order does not matter).
- `RecipeRegistry::match_grid()` returns the first matching shaped recipe,
  then falls back to shapeless.
- Output is an `ItemStack` (`stack_of(block, count)`).

## NVCrafter state

`NVCrafterState` is stored per block in the world (`world/mod.rs`) and is
persisted in saves. When a GUI closes, inputs return to the player inventory
(or drop into the world if there is no room). Breaking an NVCrafter flushes
its contents into world drops.

## JSON recipes

`assets.rs` also loads and validates recipes from JSON, with utilities for
shaped/shapeless recipe parsing alongside block-model loading.
