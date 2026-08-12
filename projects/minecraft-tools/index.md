# 🗺️ Minecraft Tooling

**Two separate Minecraft-ecosystem projects: a standalone map launcher and a
Forge mod development tree.**

---

## 📍 Minecraft Map Launcher

A native launcher (C++ / CMake, packaged as an AppImage) that boots a
Minecraft world-map viewer with Prismlauncher integration — one click from
launcher to a browsable map of your world.

### Quick start

```bash
cmake -B build && cmake --build build
./build-appimage.sh          # produces Minecraft_Map_Launcher-x86_64.AppImage
```

### Layout

```
MinecraftMapLauncher/
├── src/                    # C++ source
├── CMakeLists.txt
├── Prismlauncher/          # Prism integration hooks
├── build-appimage.sh       # AppImage packaging
└── Minecraft_Map_Launcher-x86_64.AppImage
```

---

## ⚙️ EvoTech (Forge 1.20.1 mod)

A Minecraft Forge mod development tree targeting **1.20.1 (Forge 47.3)**, with
its own `src/main` codebase and a full `changelog.txt` tracking Forge
backports and mod changes.

### Quick start

```bash
cd evotech-mod
./gradlew build
```

### Layout

```
evotech-mod/
├── src/main/               # Mod sources + resources (mods.toml, textures)
├── gradle.properties       # MC/Forge version matrix
├── build.gradle
└── changelog.txt           # Forge + mod change log (47.x series)
```

> There is also `evotech-mod-new/`, a newer development branch of the same
> project with additional in-progress changes.
