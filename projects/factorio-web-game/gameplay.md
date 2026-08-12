# Gameplay Systems

Novactorio recreates the factory-automation loop in the browser: gather
resources, build machines, route materials, research, and survive.

## Core loop

1. **Mine** raw resources from the procedurally generated world.
2. **Build** machines, belts, pipes, and inserters to automate production.
3. **Research** upgrades in the research tree.
4. **Expand** — pollution attracts and evolves enemies.
5. **Co-op** — share the factory with friends in real time.

## Supply chains & logistics

`systems.ts` implements the material-flow simulation:

- **Conveyor belts** — items move along belts and merge/split at junctions.
- **Inserters** — transfer items between belts, containers, and machines.
- **Pipe networks** — fluids and materials flow through connected pipes.
- **Supply chains** — recipes consume inputs and produce outputs; machines
  pause when inputs run dry.

## World generation

- **Chunk-based** infinite world (`world.ts`).
- **Perlin noise** terrain (`noise.ts`) with smooth height variation.
- **Seamless scrolling** — chunks generate and unload around the player.

## Combat & evolution

- **Enemy AI** — enemies spawn, path toward your pollution/factory, and attack.
- **Pollution** — production emits pollution; higher pollution drives faster
  enemy evolution (bigger, tougher enemies over time).

## Combat & interactions

- **Build / remove** blocks and machines with a build menu.
- **Inventory** per player with hotbar-style access.
- **Particles & damage numbers** for juicy feedback (`renderer.ts`).

## Co-op multiplayer

Supabase Realtime broadcasts:

- Player positions (movement sync)
- Build actions (place / remove)
- Chat messages (`ChatPanel`)

Each client runs the deterministic simulation locally; realtime events keep
shared state consistent across players.

## Premium features

A premium tier (Stripe) unlocks additional content. See
[Backend & Monetization](backend) for the payment flow.

## Controls & UI

- Responsive UI works on desktop and mobile (touch input).
- 23 languages via runtime i18n switching.
