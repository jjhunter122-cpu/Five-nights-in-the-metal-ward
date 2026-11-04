# Five Nights in the Metal Ward

An Excalibur.js game prototype.

Built with **Excalibur.js 0.32**, TypeScript, Vite and pnpm. Everything is
client-side; there is no backend. This is a structured starter: the folders and
entry points are in place, but the gameplay itself is a placeholder to build on.

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
| Move | `A` / `D` or arrows |
| Jump | `Space`, `W` or `Up` |
| Attack | `J` or `Z` |
| Dash | `Shift` or `K` |
| Reset | `R` |

Movement is wired up on the placeholder actor so the stack is verifiable end to
end; jump, attack and dash are bound but not yet implemented.

## Architecture

```
src/
  main.ts                    Excalibur Engine bootstrap
  style.css                  page + canvas shell and DOM HUD styling
  game/
    config.ts                view size, fixed step, palette
    input/InputMap.ts        keyboard action map, per-frame edge detection
    physics/aabb.ts          pure AABB helpers
    physics/kinematic.ts     fixed-step axis-separated collision resolution
    systems/GameState.ts     night/time state (placeholder)
    scenes/GameScene.ts      starter scene: floor + controllable actor
    ui/Hud.ts                DOM overlay bridge
tests/                       headless Vitest suites
```

### Key decisions

- **Pure logic modules.** `aabb.ts`, `kinematic.ts` and `GameState.ts` carry no
  Excalibur imports, so they run headless in Vitest.
- **Input by physical key.** `InputMap` keys off `KeyboardEvent.code` for
  layout independence, with explicit `endFrame()` edge detection.
- **Fixed simulation step.** The engine runs a 120 Hz fixed update so movement
  is deterministic.
- **HTML HUD.** Overlay text lives in the DOM, keeping it crisp at any
  resolution and trivial to style.

## Next

1. Replace the placeholder actor with the real player controller.
2. Flesh out `GameState` (shift clock, power, ward systems).
3. Add the ward's rooms, doors and camera feeds.
