# Blocks & Biomes

The complete block registry and biome model, extracted from
`world/block.rs` and `world/biomes.rs`.

## Block registry (97 block types)

Block IDs are `u8` values in a `BlockType` enum; a `BLOCK_REGISTRY` maps
numeric IDs to names and textures.

### Terrain & surfaces (0–8)
| ID | Block | ID | Block |
|---|---|---|---|
| 0 | Air | 5 | Gravel |
| 1 | Grass | 6 | Snow |
| 2 | Dirt | 7 | Cobblestone |
| 3 | Stone | 8 | Bedrock |
| 4 | Sand | | |

### Liquids & natural formations (9–24)
| ID | Block | ID | Block |
|---|---|---|---|
| 9 | Water | 17 | Redstone Ore |
| 10 | Tree Trunk | 18 | Slate Rock |
| 11 | Tree Leaves | 19 | Slate Coal Ore |
| 12 | Coal Ore | 20 | Slate Diamond Ore |
| 13 | Iron Ore | 21 | Tuff |
| 14 | Gold Ore | 22 | Ember Rock |
| 15 | Diamond Ore | 23 | Glow Rock |
| 16 | Emerald Ore | 24 | Obsidian |

### Building blocks (25–44)
| ID | Block | ID | Block |
|---|---|---|---|
| 25 | Stone Bricks | 35 | Packed Mud |
| 26 | Andesite | 36 | Rooted Soil |
| 27 | Bush | 37 | Coarse Soil |
| 28 | Tall Grass | 38 | Forest Floor |
| 29 | Flower | 39 | Bloom Floor |
| 30 | Dead Bush | 40 | Root Lattice |
| 31 | Cactus | 41 | Needle Wood |
| 32 | Clay | 42 | Warm Wood |
| 33 | Moss Mat | 43 | Wet Wood |
| 34 | Mud | 44 | Pale Wood |

### Canopies (45–51)
| ID | Block | ID | Block |
|---|---|---|---|
| 45 | Needle Canopy | 49 | Bloom Canopy |
| 46 | Warm Canopy | 50 | Dark Wood |
| 47 | Wet Canopy | 51 | Dark Canopy |
| 48 | Pale Canopy | | |

### Items & tools (52–74)
| ID | Block | ID | Block |
|---|---|---|---|
| 52 | Sapling | 64 | Wooden Pickaxe |
| 53 | Stick | 65 | Wooden Axe |
| 54 | Flint | 66 | Wooden Shovel |
| 55 | Flint Pickaxe | 67 | Wooden Hoe |
| 56 | Stone Pickaxe | 68 | Torch |
| 57 | Iron Pickaxe | 69 | Door |
| 58 | Diamond Pickaxe | 70 | Trapdoor |
| 59 | Netherite Pickaxe | 71 | Ladder |
| 60 | Planks | 72 | Fence |
| 61 | Iron Ingot | 73 | Fence Gate |
| 62 | Chest | 74 | Workbench Upgrade |
| 63 | NVCrafter | | |

### Extended vegetation — AI class 0: flowers (75–83)
| ID | Block | ID | Block |
|---|---|---|---|
| 75 | Rose | 80 | Tulip (Orange) |
| 76 | Dandelion | 81 | Cornflower |
| 77 | Tulip (Red) | 82 | Allium |
| 78 | Tulip (Pink) | 83 | Azalea Flower |
| 79 | Tulip (White) | | |

### Extended vegetation — AI class 1: ferns & water plants (84–89)
| ID | Block | ID | Block |
|---|---|---|---|
| 84 | Lily Pad | 87 | Seagrass |
| 85 | Fern | 88 | Tall Seagrass |
| 86 | Fern Plant | 89 | Kelp |

### Extended vegetation — AI classes 2–3: decorations (90–96)
| ID | Block | ID | Block |
|---|---|---|---|
| 90 | Small Stick | 94 | Mossy Cobble |
| 91 | Pebble 1 | 95 | Vine |
| 92 | Pebble 2 | 96 | Moss Carpet |
| 93 | Pebble 3 | | |

## Tool tiers

```rust
pub enum ToolTier { Hand = 1, Flint = 2, Stone = 3, Iron = 4, Diamond = 5, Netherite = 6 }
```

| Tier | Power | | Tier | Power |
|---|---|---|---|---|
| Hand | 1 | | Iron | 5 |
| Flint | 2 | | Diamond | 7 |
| Stone | 3 | | Netherite | 8 |

`ToolStats` carries tier, `speed_multiplier`, and `max_durability`.

## Movement mediums

`MovementMedium` metadata lets the engine apply physics modifiers per medium:

```rust
MovementMedium::FOLIAGE {
    movement_speed_multiplier: 0.55,
    sprint_speed_multiplier:  0.65,
    fall_speed_multiplier:    0.35,
    sound_dampening:          0.6,
}
```

The camera tracks `in_foliage_medium` and `footstep_volume` at runtime for
these hooks (audio consumption is a future feature).

---

# Biomes

Nine climate-driven biomes. Sea level is `46`.

| Biome | Temp | Humidity | Tree density | Grass density | Surface block | Vegetation tint |
|---|---|---|---|---|---|---|
| Ocean | 0.48 | 0.88 | 0.00 | 0.00 | Sand | `[0.58, 0.82, 0.74]` |
| Coast | 0.62 | 0.54 | 0.02 | 0.10 | Sand | `[0.78, 0.82, 0.48]` |
| Plains | 0.58 | 0.46 | 0.05 | 0.72 | Grass | `[0.72, 0.92, 0.54]` |
| Forest | 0.54 | 0.62 | 0.46 | 0.46 | Grass | `[0.50, 0.86, 0.42]` |
| Dark Forest | 0.50 | 0.74 | 0.74 | 0.18 | Forest Floor | `[0.38, 0.72, 0.34]` |
| Swamp | — | — | — | — | — | — |
| Taiga | — | — | — | — | — | — |
| Desert | — | — | — | — | — | — |
| Mountains | — | — | — | — | — | — |

## Tree kinds

```rust
pub enum TreeKind { Oak, Birch, Pine, DarkOak, DeadTree }
```

Biomes select tree types from constants (e.g. `PLAINS_TREES`,
`FOREST_TREES`, `DARK_FOREST_TREES`, `NO_TREES`).

## Generation channels

Terrain combines multiple OpenSimplex2 channels, each with a dedicated seed:

| Channel | Drives |
|---|---|
| Continent shape | Biome placement |
| Temperature | Climate |
| Humidity | Climate |
| Erosion | Relief |
| Peaks / relief | Mountain shapes |
| Height / detail | Surface elevation |
| Warp | Surface variation |
| Caves | Cave carving |
| Ores | Ore placement |
| Water | Water-aware column sampling |

The generator exposes **climate data** to the renderer: ambient color, fog
color, fog density, scene grade, vegetation tint, warmth, moisture, and
lushness.
