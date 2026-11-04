import type { Aabb } from '../physics/aabb';
import { moveAndCollide, type MoveResult } from '../physics/kinematic';

export interface PlayerInput {
  /** Desired horizontal direction, -1 (left) to 1 (right). */
  axis: number;
  /** True on the frame the jump button went down. */
  jumpPressed: boolean;
  /** True while the jump button is held, for variable jump height. */
  jumpHeld: boolean;
}

export interface PlayerTunables {
  width: number;
  height: number;
  maxSpeed: number;
  groundAccel: number;
  airAccel: number;
  groundFriction: number;
  airFriction: number;
  gravity: number;
  maxFallSpeed: number;
  jumpVelocity: number;
  jumpCutMultiplier: number;
  coyoteTime: number;
  jumpBufferTime: number;
}

function approach(current: number, target: number, maxDelta: number): number {
  if (current < target) {
    return Math.min(current + maxDelta, target);
  }
  if (current > target) {
    return Math.max(current - maxDelta, target);
  }
  return target;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Pure, engine-free player movement: acceleration/friction, gravity, a
 * variable-height jump, coyote time and jump buffering.
 *
 * `update` is a fixed step. Callers feed input and the level's solids and read
 * the resulting `box`/`grounded` back out.
 */
export class PlayerController {
  readonly box: Aabb;
  vx = 0;
  vy = 0;
  grounded = false;
  facing: 1 | -1 = 1;

  private coyoteTimer = 0;
  private jumpBufferTimer = 0;
  private wasJumpHeld = false;

  constructor(
    private readonly tunables: PlayerTunables,
    spawn: { x: number; y: number },
  ) {
    this.box = { x: spawn.x, y: spawn.y, w: tunables.width, h: tunables.height };
  }

  respawn(spawn: { x: number; y: number }): void {
    this.box.x = spawn.x;
    this.box.y = spawn.y;
    this.vx = 0;
    this.vy = 0;
    this.grounded = false;
    this.coyoteTimer = 0;
    this.jumpBufferTimer = 0;
    this.wasJumpHeld = false;
  }

  update(dt: number, input: PlayerInput, solids: readonly Aabb[]): MoveResult {
    const t = this.tunables;
    const axis = clamp(input.axis, -1, 1);
    if (axis !== 0) {
      this.facing = axis > 0 ? 1 : -1;
    }

    // Horizontal: accelerate toward the target speed, or brake to a stop.
    if (axis !== 0) {
      const accel = (this.grounded ? t.groundAccel : t.airAccel) * dt;
      this.vx = approach(this.vx, axis * t.maxSpeed, accel);
    } else {
      const friction = (this.grounded ? t.groundFriction : t.airFriction) * dt;
      this.vx = approach(this.vx, 0, friction);
    }

    // Coyote time: keep the ability to jump briefly after leaving the ground.
    this.coyoteTimer = this.grounded
      ? t.coyoteTime
      : Math.max(0, this.coyoteTimer - dt);

    // Jump buffering: remember a press made slightly before landing.
    this.jumpBufferTimer = input.jumpPressed
      ? t.jumpBufferTime
      : Math.max(0, this.jumpBufferTimer - dt);

    if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0) {
      this.vy = t.jumpVelocity;
      this.jumpBufferTimer = 0;
      this.coyoteTimer = 0;
      this.grounded = false;
    }

    // Variable jump height: releasing early cuts the upward velocity once.
    if (this.wasJumpHeld && !input.jumpHeld && this.vy < 0) {
      this.vy *= t.jumpCutMultiplier;
    }
    this.wasJumpHeld = input.jumpHeld;

    this.vy = Math.min(this.vy + t.gravity * dt, t.maxFallSpeed);

    const result = moveAndCollide(this.box, this.vx * dt, this.vy * dt, solids);
    if (result.hitX) {
      this.vx = 0;
    }
    if (result.hitY) {
      this.vy = 0;
    }
    this.grounded = result.landed;

    return result;
  }
}
