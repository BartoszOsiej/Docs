# 👻 GhostLauncher

**A full-featured Minecraft launcher for the LandOfGhost server (Minehut),
built with Electron — plus a React + TypeScript rewrite.**

GhostLauncher manages authentication, server status, RAM, and launches
Minecraft 1.21.4 with a custom shop and YouTube integration. Two
implementations exist: the production Electron app and a modern React/Vite
front-end rewrite.

---

## ✨ Features (Electron app)

| Feature | Description |
|---|---|
| **Autologin** | Microsoft / offline authentication, saved between sessions |
| **Server status** | Live LandOfGhost status via the Minehut API |
| **RAM configuration** | 2–16 GB slider, written straight to the JVM args |
| **Shop (ranks)** | In-app rank purchasing |
| **YouTube link** | Quick access to server content |
| **Launch** | Fires up Minecraft 1.21.4 with the right account & profile |

## 🚀 Quick start (Electron)

```bash
cd GhostLauncher
npm install
npm start
```

## ⚛️ React rewrite (`ghost-launcher-react`)

A React 19 + TypeScript + Vite reimplementation of the same launcher UI —
designed for web embedding and a more modern component architecture:

```bash
cd ghost-launcher-react
npm install
npm run dev
```

## 📦 Project layout

```
GhostLauncher/            # Production Electron app (package name: ghost-launcher)
├── main.js               # Electron main process
├── dist/                 # Packaged build
└── (renderer + launcher logic)

ghost-launcher-react/     # React + Vite rewrite
├── src/
└── package.json
```

## 🎮 Status

In active use by the LandOfGhost Minecraft server community.
