# 🏭 Factory Defense

**A Rust factory-building + tower-defense game built on macroquad.**

Factory Defense combines base construction with combat: build factories,
manage production lines, and defend them from waves of enemies — rendered
with the lightweight `macroquad` 2D engine.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Factory building** | Place and connect production buildings |
| **Combat system** | Enemy waves with turrets and defenses |
| **City & economy** | Resource management across a living city |
| **World generation** | Procedurally generated playfield |
| **Rust + macroquad** | Single-binary game, no engine runtime |

## 🚀 Quick start

```bash
cargo run --release
# or
./run.sh
```

## 📦 Project layout

```
factory_defense/
├── src/
│   ├── main.rs       # Entry point + game loop
│   ├── game.rs       # Game state & rules
│   ├── world.rs      # World generation & tiles
│   ├── city.rs       # City / economy simulation
│   ├── factory.rs    # Factory & production chains
│   ├── combat.rs     # Enemies, turrets, projectiles
│   ├── ui.rs         # HUD & menus
│   ├── render.rs     # Rendering layer
│   └── types.rs      # Shared data types
└── Cargo.toml
```

## 🎮 Status

Early playable prototype (v0.1.0) — a solid base for a full game loop.
