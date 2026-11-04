import { describe, expect, it } from 'vitest';
import { aabb } from '../src/game/physics/aabb';
import { moveAndCollide } from '../src/game/physics/kinematic';

describe('moveAndCollide', () => {
  it('moves freely in open space', () => {
    const box = aabb(0, 0, 10, 10);
    const result = moveAndCollide(box, 5, 5, []);
    expect(box.x).toBe(5);
    expect(box.y).toBe(5);
    expect(result).toEqual({ hitX: false, hitY: false, landed: false });
  });

  it('stops against a wall', () => {
    const box = aabb(0, 0, 10, 10);
    const wall = aabb(20, 0, 10, 100);
    const result = moveAndCollide(box, 50, 0, [wall]);
    expect(result.hitX).toBe(true);
    expect(result.hitY).toBe(false);
    expect(box.x).toBe(10); // flush against wall.x (20) minus box width
  });

  it('lands on a floor', () => {
    const box = aabb(0, 0, 10, 10);
    const floor = aabb(0, 20, 100, 10);
    const result = moveAndCollide(box, 0, 50, [floor]);
    expect(result.landed).toBe(true);
    expect(box.y).toBe(10); // floor.y (20) minus box height
  });

  it('bonks a ceiling without counting as a landing', () => {
    const box = aabb(0, 30, 10, 10);
    const ceiling = aabb(0, 0, 100, 10);
    const result = moveAndCollide(box, 0, -50, [ceiling]);
    expect(result.hitY).toBe(true);
    expect(result.landed).toBe(false);
    expect(box.y).toBe(10); // ceiling bottom
  });

  it('does not tunnel through a thin wall on a large step', () => {
    const box = aabb(0, 0, 10, 10);
    const wall = aabb(100, 0, 4, 100);
    const result = moveAndCollide(box, 500, 0, [wall]);
    expect(result.hitX).toBe(true);
    expect(box.x).toBe(90);
  });
});
