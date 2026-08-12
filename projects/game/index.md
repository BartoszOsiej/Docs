# 🚛 Transport Game

**A browser-based transport / building sandbox with vehicles, physics,
multiplayer, and terrain generation.**

A vanilla JavaScript game (no frameworks) featuring a hand-written engine:
procedural terrain, vehicle physics, building, fluids, missions, minimap,
particles, and even built-in chat + multiplayer hooks.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Procedural terrain** | Noise-based world with roads & rivers |
| **Vehicle physics** | Drive, fly, and haul across the map |
| **Building** | Place structures and production chains |
| **Multiplayer + chat** | Built-in networking hooks and chat UI |
| **Missions & leveling** | Progression system with XP |
| **Minimap & particles** | Full HUD and visual feedback |
| **Vanilla JS** | Zero dependencies — runs anywhere |

## 🚀 Quick start

```bash
# Serve the folder statically, e.g.:
python3 -m http.server 8080
# open http://localhost:8080
```

## 📦 Project layout

```
game/
├── index.html
├── src/
│   ├── main.js          # Boot + game loop
│   ├── engine.js        # Core engine
│   ├── terrain.js       # Procedural terrain
│   ├── physics.js       # Vehicle physics
│   ├── vehicles.js      # Vehicle definitions
│   ├── building.js      # Construction
│   ├── fluids.js        # Fluid simulation
│   ├── multiplayer.js   # Networking
│   ├── chat.js          # Chat UI
│   ├── missions.js      # Mission system
│   ├── leveling.js      # XP & progression
│   ├── minimap.js       # Minimap
│   ├── particles.js     # Particle effects
│   ├── renderer.js      # Canvas renderer
│   └── worldbuilder.js  # World editing
└── TODO.txt             # "Mega upgrade" roadmap to production
```

## 🎮 Status

Playable prototype with a clear `TODO.txt` roadmap (biomes, Perlin terrain,
caves, bridges, …) toward a publishable release.
