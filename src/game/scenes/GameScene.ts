import { Actor, Color, Scene, Vector } from 'excalibur';
import { PALETTE, VIEW } from '../config';
import { InputMap } from '../input/InputMap';
import { GameState } from '../systems/GameState';
import { Hud } from '../ui/Hud';

const MOVE_SPEED = 220; // px/s
const GROUND_TOP = VIEW.height - 40;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Starter scene: a dark ward, a floor, and a controllable placeholder actor.
 *
 * Enough to prove the engine boots and the input map works. Replace the demo
 * actor with the real game loop.
 */
export class GameScene extends Scene {
  private readonly keys = new InputMap();
  private readonly state = new GameState();
  private readonly hud = new Hud();
  private watcher: Actor | null = null;

  override onInitialize(): void {
    this.backgroundColor = Color.fromHex(PALETTE.background);

    const floor = new Actor({
      pos: new Vector(VIEW.width / 2, GROUND_TOP + 40),
      width: VIEW.width,
      height: 80,
      color: Color.fromHex(PALETTE.floor),
    });
    this.add(floor);

    this.watcher = new Actor({
      pos: new Vector(VIEW.width / 2, GROUND_TOP - 20),
      width: 40,
      height: 40,
      color: Color.fromHex(PALETTE.actor),
    });
    this.add(this.watcher);

    this.hud.message('Night 1', 1200);
  }

  override onPreUpdate(_engine: unknown, delta: number): void {
    const seconds = delta / 1000;
    this.state.advance(seconds);

    const watcher = this.watcher;
    if (watcher) {
      const direction = (this.keys.isDown('right') ? 1 : 0) - (this.keys.isDown('left') ? 1 : 0);
      const half = watcher.width / 2;
      watcher.pos.x = clamp(watcher.pos.x + direction * MOVE_SPEED * seconds, half, VIEW.width - half);
    }

    if (this.keys.pressed('reset')) {
      this.state.reset();
      watcher?.pos.setTo(VIEW.width / 2, GROUND_TOP - 20);
      this.hud.message('Reset');
    }

    // Latch input last so `pressed()` edges survive the whole step.
    this.keys.endFrame();
  }
}
