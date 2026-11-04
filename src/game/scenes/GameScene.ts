import { Actor, Canvas, Color, Scene, Vector, vec } from 'excalibur';
import { CAMERA, PALETTE, PLAYER, SPRITE, VIEW } from '../config';
import { InputMap } from '../input/InputMap';
import { LEVEL_ONE } from '../level/level';
import { drawTerrain } from '../level/terrain';
import { overlaps } from '../physics/aabb';
import { PlayerController, type PlayerInput } from '../player/PlayerController';
import { PlayerRig } from '../player/PlayerRig';
import { ambientSound, growlSound, tilesImage } from '../resources';
import { GameState } from '../systems/GameState';
import { Hud } from '../ui/Hud';

const AMBIENT_VOLUME = 0.35;
const GROWL_VOLUME = 0.5;

const NEUTRAL_INPUT: PlayerInput = { axis: 0, jumpPressed: false, jumpHeld: false };

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Single-level platformer scene.
 *
 * The level is painted once into a cached tile graphic, a pure
 * `PlayerController` owns the movement, the sprite rig mirrors it, and the
 * camera follows with exponential smoothing, clamped to the room. Reaching the
 * goal banner wins; `R` restarts.
 */
export class GameScene extends Scene {
  private readonly keys = new InputMap();
  private readonly state = new GameState();
  private readonly hud = new Hud();
  private readonly player = new PlayerController(PLAYER, LEVEL_ONE.spawn);
  private readonly solids = LEVEL_ONE.solids;
  private readonly rig = new PlayerRig();

  private audioStarted = false;
  private won = false;

  override onInitialize(): void {
    this.backgroundColor = Color.fromHex(PALETTE.background);
    this.camera.zoom = CAMERA.zoom;

    const terrain = new Canvas({
      width: LEVEL_ONE.width,
      height: LEVEL_ONE.height,
      cache: true,
      draw: (ctx) => drawTerrain(ctx, tilesImage.image, this.solids, LEVEL_ONE.goal),
    });
    const terrainActor = new Actor({
      pos: vec(LEVEL_ONE.width / 2, LEVEL_ONE.height / 2),
    });
    terrainActor.graphics.use(terrain);
    this.add(terrainActor);

    this.add(this.rig.actor);

    this.syncPlayerActor();
    this.snapCamera();
    this.hud.message('Reach the signpost', 1600);
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
      this.won = false;
      this.hud.hideWin();
      this.hud.message('Reset');
    } else {
      const wasGrounded = this.player.grounded;
      // Once won, ignore input but keep the physics settling the player.
      this.player.update(dt, this.won ? NEUTRAL_INPUT : input, this.solids);

      if (!this.won && !wasGrounded && this.player.grounded) {
        // Touchdown: only on the airborne -> grounded edge, not every resting step.
        void growlSound.play(GROWL_VOLUME);
      }

      if (!this.won && overlaps(this.player.box, LEVEL_ONE.goal)) {
        this.won = true;
        this.hud.showWin();
      }
    }

    this.rig.setMoving(this.player.grounded && Math.abs(this.player.vx) > 8);
    this.rig.setFacing(this.player.facing);

    this.syncPlayerActor();
    this.updateCamera(dt);
    this.updateAudio();

    // Latch input last so `pressed()` edges survive the whole step.
    this.keys.endFrame();
  }

  private syncPlayerActor(): void {
    const { box } = this.player;
    // Bottom-align the 32px sprite with the 40px collision box.
    this.rig.actor.pos.setTo(
      box.x + box.w / 2,
      box.y + box.h - SPRITE.character / 2,
    );
  }

  /** Half the visible world, accounting for camera zoom. */
  private get visibleHalf(): { x: number; y: number } {
    return {
      x: VIEW.width / (2 * CAMERA.zoom),
      y: VIEW.height / (2 * CAMERA.zoom),
    };
  }

  private cameraTarget(): Vector {
    const { box } = this.player;
    const half = this.visibleHalf;
    return new Vector(
      clamp(box.x + box.w / 2, half.x, LEVEL_ONE.width - half.x),
      clamp(box.y + box.h / 2, half.y, LEVEL_ONE.height - half.y),
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

  /** Loop the ambience in the background, starting on the first key press. */
  private updateAudio(): void {
    if (!this.audioStarted && this.keys.anyDown()) {
      ambientSound.loop = true;
      void ambientSound.play(AMBIENT_VOLUME);
      this.audioStarted = true;
    }
  }
}
