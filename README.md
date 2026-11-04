# Five Nights in the Metal Ward

A single-player platformer prototype.

Built with **Excalibur.js 0.32**, TypeScript, Vite and pnpm. Everything is
client-side; there is no backend. The current milestone is one level with
run-and-jump movement and a following camera.

## Run it

```
pnpm install
pnpm dev
```

Then open the printed local URL.

```
pnpm test       # headless unit tests
pnpm typecheck
pnpm build      # static production build in dist/
pnpm preview
```

## Controls

| Action | Keyboard |
| --- | --- |
| Move | `A` / `D` or `←` / `→` |
| Jump | `Space`, `W` or `↑` |
| Reset | `R` |

The jump has variable height — tap for a short hop, hold for a full jump.

## What's in it

- **Movement:** acceleration and friction, gravity, a variable-height jump,
  coyote time and jump buffering.
- **One level:** a 2560 x 720 room with a jump gap, side walls and a rising
  trail of platforms (`src/game/level/level.ts`).
- **Camera:** follows the player with exponential smoothing and stays clamped
  inside the room.

Movement is expressed as a pure `PlayerController` with no Excalibur imports,
so it runs headless in Vitest.

## Architecture

```
src/
  main.ts                       Excalibur Engine bootstrap
  style.css                     page + canvas shell and DOM HUD styling
  game/
    config.ts                   view size, fixed step, palette, player/camera tunables
    input/InputMap.ts           keyboard action map, per-frame edge detection
    physics/aabb.ts             pure AABB helpers
    physics/kinematic.ts        swept axis-separated collision resolution
    player/PlayerController.ts  pure movement state machine
    level/level.ts              the single level's solids and spawn point
    systems/GameState.ts        elapsed-time state
    scenes/GameScene.ts         level + player + camera wiring
    ui/Hud.ts                   DOM overlay bridge
tests/                          headless Vitest suites
```

### Key decisions

- **Pure logic modules.** `aabb.ts`, `kinematic.ts`, `PlayerController` and
  `level.ts` carry no Excalibur imports, so they run headless in Vitest. The
  controller is the single source of truth for the player; the scene just
  mirrors it onto an actor each step.
- **Fixed simulation step.** The engine runs a 120 Hz fixed update, so movement
  and collision are deterministic.
- **Tune in one place.** Every number lives in `config.ts` (`PLAYER`, `CAMERA`,
  `VIEW`); `level.ts` owns the geometry.
- **HTML HUD.** Overlay text lives in the DOM, keeping it crisp at any
  resolution and trivial to style.

## Next

1. More levels, plus level transitions and a level format.
2. Hazards/damage, a health bar and a death/respawn flow.
3. Sprite art and animation for the player.
