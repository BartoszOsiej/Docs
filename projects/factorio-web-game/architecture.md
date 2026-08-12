# Architecture

Novactorio is deliberately framework-free on the rendering side. The game loop,
simulation, and drawing are hand-written on the Canvas 2D API; React is used
only for UI overlays.

## Layer overview

```
┌─────────────────────────────────────────────────────────┐
│  React overlay (src/components/)                        │
│  Auth → Start → Game routing, HUD, menus, chat, shop    │
└─────────────────────────┬───────────────────────────────┘
                          │ game state / events
┌─────────────────────────▼───────────────────────────────┐
│  Game engine (src/game/)                                │
│  engine.ts   — main loop: update() + render(), entities │
│  systems.ts  — supply chains, belts, pipes, AI, pollution│
│  world.ts    — chunk storage, infinite scrolling        │
│  noise.ts    — Perlin noise terrain generation          │
│  renderer.ts — 10 dedicated draw methods                │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│  Canvas 2D API + post-processing (postproc.ts)          │
└─────────────────────────────────────────────────────────┘
```

## Game engine (`src/game/`)

| Module | Responsibility |
|---|---|
| `engine.ts` | Game loop (`update`/`render`), entity lifecycle, building logic, inventory, combat, particles |
| `renderer.ts` | 10 extracted render passes: sky, ground, entities, damage numbers, etc. |
| `systems.ts` | Supply chains, conveyor belts, pipe networks, enemy AI, pollution |
| `world.ts` | Chunk-based world, block storage, infinite scrolling |
| `noise.ts` | Perlin noise for terrain generation |
| `types.ts` | Shared type definitions |
| `constants.ts` | Tuning constants |
| `audio.ts` | Sound effects |
| `postproc.ts` | Post-processing effects |

## Rendering approach

The renderer is organized as discrete draw methods (sky, ground, entities,
particles, damage numbers, …) rather than a monolithic draw call, keeping each
pass cheap and debuggable. World chunks are culled to the visible area while
scrolling.

## UI overlay (`src/components/`)

React 18 renders the interface on top of the canvas: full screen routing
(Auth → Start → Game), build menu, chat panel, shop, stats, and settings.
State flows from the engine into React through a shared game-state bridge.

## i18n (`src/i18n.ts`)

Runtime-switchable localization with 23 languages. Polish and English are the
fully translated reference locales; the language can be switched live without
a reload.

## Config & environment (`src/config/`)

Environment-driven configuration via `import.meta.env`:

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon (publishable) key |
| `VITE_ADMIN_USERS` | Comma-separated admin usernames |

## Deployment target

The game builds with Vite and deploys to Cloudflare (Wrangler):

```bash
npm run build
wrangler deploy
```

## TypeScript strictness

`tsconfig` runs with `strict: true` and the project validates with
`tsc --noEmit` (`npm run typecheck`), keeping the codebase type-safe across
~4,800 lines of game logic.
