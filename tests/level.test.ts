import { describe, expect, it } from 'vitest';
import { overlaps } from '../src/game/physics/aabb';
import { LEVEL_ONE } from '../src/game/level/level';

const finalPlatform = LEVEL_ONE.solids[LEVEL_ONE.solids.length - 1]!;

describe('level goal', () => {
  it('is reachable: a player standing on the final platform overlaps it', () => {
    const player = {
      x: finalPlatform.x + finalPlatform.w / 2 - 14,
      y: finalPlatform.y - 40,
      w: 28,
      h: 40,
    };
    expect(overlaps(player, LEVEL_ONE.goal)).toBe(true);
  });

  it('sits within the final platform width', () => {
    expect(LEVEL_ONE.goal.x).toBeGreaterThanOrEqual(finalPlatform.x);
    expect(LEVEL_ONE.goal.x + LEVEL_ONE.goal.w).toBeLessThanOrEqual(
      finalPlatform.x + finalPlatform.w,
    );
  });

  it('rests on top of the final platform', () => {
    expect(LEVEL_ONE.goal.y + LEVEL_ONE.goal.h).toBe(finalPlatform.y);
  });

  it('does not overlap the spawn point', () => {
    const spawnBox = { x: LEVEL_ONE.spawn.x, y: LEVEL_ONE.spawn.y, w: 28, h: 40 };
    expect(overlaps(spawnBox, LEVEL_ONE.goal)).toBe(false);
  });
});
