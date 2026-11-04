import { describe, expect, it } from 'vitest';
import { PLAYER } from '../src/game/config';
import { aabb, type Aabb } from '../src/game/physics/aabb';
import { PlayerController } from '../src/game/player/PlayerController';

const DT = 1 / 120;

function idleInput() {
  return { axis: 0, jumpPressed: false, jumpHeld: false };
}

function simulate(
  player: PlayerController,
  solids: readonly Aabb[],
  steps: number,
  input: () => ReturnType<typeof idleInput>,
): void {
  for (let i = 0; i < steps; i += 1) {
    player.update(DT, input(), solids);
  }
}

describe('PlayerController', () => {
  const ground = aabb(0, 200, 1000, 40);

  it('falls under gravity and lands on the ground', () => {
    const player = new PlayerController(PLAYER, { x: 100, y: 100 });
    simulate(player, [ground], 240, idleInput);
    expect(player.grounded).toBe(true);
    expect(player.box.y).toBe(160); // ground top (200) minus player height (40)
    expect(player.vy).toBe(0);
  });

  it('jumps when the button is pressed while grounded', () => {
    const player = new PlayerController(PLAYER, { x: 100, y: 160 });
    player.update(DT, idleInput(), [ground]);
    expect(player.grounded).toBe(true);

    const startY = player.box.y;
    player.update(DT, { axis: 0, jumpPressed: true, jumpHeld: true }, [ground]);
    expect(player.grounded).toBe(false);
    expect(player.vy).toBeLessThan(0);

    simulate(player, [ground], 20, () => ({ axis: 0, jumpPressed: false, jumpHeld: true }));
    expect(player.box.y).toBeLessThan(startY);
  });

  it('reaches a higher apex when the jump is held', () => {
    function apex(holdSteps: number): number {
      const player = new PlayerController(PLAYER, { x: 100, y: 160 });
      player.update(DT, idleInput(), [ground]);
      let minY = player.box.y;
      player.update(DT, { axis: 0, jumpPressed: true, jumpHeld: true }, [ground]);
      for (let i = 0; i < 120; i += 1) {
        player.update(DT, { axis: 0, jumpPressed: false, jumpHeld: i < holdSteps }, [ground]);
        minY = Math.min(minY, player.box.y);
      }
      return minY;
    }

    expect(apex(0)).toBeGreaterThan(apex(120)); // shorter tap rises less
  });

  it('accelerates right and is blocked by a wall', () => {
    const wall = aabb(300, 0, 40, 300);
    const player = new PlayerController(PLAYER, { x: 100, y: 160 });
    simulate(player, [ground, wall], 240, () => ({ axis: 1, jumpPressed: false, jumpHeld: false }));
    expect(player.box.x + player.box.w).toBe(300); // flush against the wall
    expect(player.vx).toBe(0);
  });

  it('allows a jump shortly after walking off a ledge (coyote time)', () => {
    // A short ledge that ends at x=200, over open air.
    const ledge = aabb(0, 200, 200, 40);
    const player = new PlayerController(PLAYER, { x: 100, y: 160 });
    player.update(DT, idleInput(), [ledge]);

    // Walk right until we leave the ledge, then jump a few frames later.
    let leftGround = false;
    for (let i = 0; i < 200 && !leftGround; i += 1) {
      player.update(DT, { axis: 1, jumpPressed: false, jumpHeld: false }, [ledge]);
      if (!player.grounded) {
        leftGround = true;
      }
    }
    expect(leftGround).toBe(true);

    // Within the coyote window, a buffered press should still launch us.
    player.update(DT, { axis: 1, jumpPressed: true, jumpHeld: true }, [ledge]);
    expect(player.vy).toBeLessThan(0);
  });

  it('respawn resets position and velocity', () => {
    const player = new PlayerController(PLAYER, { x: 100, y: 100 });
    simulate(player, [ground], 120, () => ({ axis: 1, jumpPressed: false, jumpHeld: false }));
    player.respawn({ x: 500, y: 50 });
    expect(player.box.x).toBe(500);
    expect(player.box.y).toBe(50);
    expect(player.vx).toBe(0);
    expect(player.vy).toBe(0);
    expect(player.grounded).toBe(false);
  });
});
