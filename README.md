# Five Nights in the Metal Ward

A single-player platformer prototype.

Built with **Excalibur.js 0.32**, TypeScript, Vite and pnpm. Everything is
client-side; there is no backend. The current milestone is one level with
run-and-jump movement, a following camera, pixel-art terrain and a spooky
soundtrack.

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

The jump has variable height — tap for a short hop, hold for a full jump. Audio
starts on your first key press (browsers require a gesture before playing
sound).

## What's in it

- **Movement:** acceleration and friction, gravity, a variable-height jump,
  coyote time and jump buffering.
- **One level:** a 2560 x 720 room with a jump gap, side walls and a rising
  trail of platforms (`src/game/level/level.ts`).
- **Camera:** follows the player with exponential smoothing at 2x zoom, clamped
  inside the room.
- **Pixel-art terrain:** `sheet.png` is autotiled onto the level's solids — a
  rusty ground set and a teal platform set.
- **Animated hero:** `characters.png` drives the player sprite (idle + run,
  mirrored when facing left).
- **Audio:** a looping ambience plus an occasional monster growl.

Movement is expressed as a pure `PlayerController` with no Excalibur imports,
so it runs headless in Vitest.

## Assets

Pixel art and audio are vendored in `public/assets/`. Attribution lives in
`docs/CREDITS.txt` (OpenGameArt, mostly CC0).

```
public/assets/
  sprites/characters.png   23 x 4 grid of 32px characters
  tiles/sheet.png          17 x 8 grid of 16px tiles
  audio/ambient.ogg        looping ambience (~97 s)
  audio/growl.wav          monster growl (converted from FLAC)
```

The frame geometry and the sprite row/columns to use are in `config.ts`
(`SPRITE`), and the tile indices in `level/terrain.ts`.

## Architecture

```
src/
  main.ts                       Excalibur Engine bootstrap + resource loading
  style.css                     page + canvas shell and DOM HUD styling
  game/
    config.ts                   view, fixed step, palette, player/camera/sprite tunables
    resources.ts                image + sound sources and the loader
    input/InputMap.ts           keyboard action map, per-frame edge detection
    physics/aabb.ts             pure AABB helpers
    physics/kinematic.ts        swept axis-separated collision resolution
    player/PlayerController.ts  pure movement state machine
    player/PlayerRig.ts         animated hero sprite
    level/level.ts              the single level's solids and spawn point
    level/terrain.ts            tileset autotiling + terrain painting
    systems/GameState.ts        elapsed-time state
    scenes/GameScene.ts         level + player + camera + audio wiring
    ui/Hud.ts                   DOM overlay bridge
tests/                          headless Vitest suites
```

### Key decisions

- **Pure logic modules.** `aabb.ts`, `kinematic.ts`, `PlayerController`,
  `level.ts` and `terrain.ts` carry no Excalibur imports, so they run headless
  in Vitest. The controller is the single source of truth for the player; the
  rig just mirrors it.
- **One-off terrain raster.** The whole level is painted into a cached
  `ex.Canvas` graphic once, instead of spawning thousands of tile actors.
- **Fixed simulation step.** The engine runs a 120 Hz fixed update, so movement
  and collision are deterministic.
- **Tune in one place.** Every number lives in `config.ts`; `level.ts` owns the
  geometry and `terrain.ts` the tile choices.

## Next

1. More levels, plus level transitions and a level format.
2. Hazards/damage, a health bar and a death/respawn flow.
3. Wire the growl to a real enemy that patrols the ward.
