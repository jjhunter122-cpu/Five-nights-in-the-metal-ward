import { Actor, Color, Scene, Vector } from 'excalibur';
import { CAMERA, PALETTE, PLAYER, VIEW } from '../config';
import { InputMap } from '../input/InputMap';
import { LEVEL_ONE } from '../level/level';
import { PlayerController, type PlayerInput } from '../player/PlayerController';
import { GameState } from '../systems/GameState';
import { Hud } from '../ui/Hud';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Single-level platformer scene.
 *
 * The level's solids are drawn as rectangles, a pure `PlayerController` owns
 * the movement, and the camera follows the player with exponential smoothing,
 * clamped so it never shows outside the room.
 */
export class GameScene extends Scene {
  private readonly keys = new InputMap();
  private readonly state = new GameState();
  private readonly hud = new Hud();
  private readonly player = new PlayerController(PLAYER, LEVEL_ONE.spawn);
  private readonly solids = LEVEL_ONE.solids;
  private playerActor: Actor | null = null;

  override onInitialize(): void {
    this.backgroundColor = Color.fromHex(PALETTE.background);

    for (const solid of this.solids) {
      this.add(
        new Actor({
          pos: new Vector(solid.x + solid.w / 2, solid.y + solid.h / 2),
          width: solid.w,
          height: solid.h,
          color: Color.fromHex(solid.kind === 'ground' ? PALETTE.ground : PALETTE.platform),
        }),
      );
    }

    this.playerActor = new Actor({
      pos: new Vector(PLAYER.width / 2, PLAYER.height / 2),
      width: PLAYER.width,
      height: PLAYER.height,
      color: Color.fromHex(PALETTE.player),
    });
    this.add(this.playerActor);

    this.syncPlayerActor();
    this.snapCamera();
    this.hud.message('Level 1', 1200);
  }

  override onPreUpdate(_engine: unknown, delta: number): void {
    const dt = delta / 1000;
    this.state.advance(dt);

    const input: PlayerInput = {
      axis: (this.keys.isDown('right') ? 1 : 0) - (this.keys.isDown('left') ? 1 : 0),
      jumpPressed: this.keys.pressed('jump'),
      jumpHeld: this.keys.isDown('jump'),
    };

    if (this.keys.pressed('reset')) {
      this.player.respawn(LEVEL_ONE.spawn);
      this.state.reset();
      this.hud.message('Reset');
    } else {
      this.player.update(dt, input, this.solids);
    }

    this.syncPlayerActor();
    this.updateCamera(dt);

    // Latch input last so `pressed()` edges survive the whole step.
    this.keys.endFrame();
  }

  private syncPlayerActor(): void {
    if (this.playerActor) {
      const { box } = this.player;
      this.playerActor.pos.setTo(box.x + box.w / 2, box.y + box.h / 2);
    }
  }

  private cameraTarget(): Vector {
    const { box } = this.player;
    const halfW = VIEW.width / 2;
    const halfH = VIEW.height / 2;
    return new Vector(
      clamp(box.x + box.w / 2, halfW, LEVEL_ONE.width - halfW),
      clamp(box.y + box.h / 2, halfH, LEVEL_ONE.height - halfH),
    );
  }

  private snapCamera(): void {
    this.camera.pos = this.cameraTarget();
  }

  private updateCamera(dt: number): void {
    const target = this.cameraTarget();
    const current = this.camera.pos;
    const k = 1 - Math.exp(-dt / CAMERA.smoothing);
    this.camera.pos = new Vector(
      current.x + (target.x - current.x) * k,
      current.y + (target.y - current.y) * k,
    );
  }
}
