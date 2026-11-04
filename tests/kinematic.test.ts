import { describe, expect, it } from 'vitest';
import type { Body } from '../src/game/physics/kinematic';
import { moveAndCollide } from '../src/game/physics/kinematic';
import { aabb } from '../src/game/physics/aabb';

function makeBody(x: number, y: number, w = 10, h = 10): Body {
  return { x, y, w, h, vx: 0, vy: 0 };
}

describe('moveAndCollide', () => {
  it('moves freely in open space', () => {
    const body = makeBody(0, 0);
    const result = moveAndCollide(body, 5, 5, []);
    expect(body.x).toBe(5);
    expect(body.y).toBe(5);
    expect(result).toEqual({ hitX: false, hitY: false, landed: false });
  });

  it('stops against a wall and clears the hit axis', () => {
    const body = makeBody(0, 0);
    const wall = aabb(20, 0, 10, 100);
    const result = moveAndCollide(body, 50, 0, [wall]);
    expect(result.hitX).toBe(true);
    expect(body.x).toBe(10); // flush against wall.x (20) minus body width
    expect(body.vx).toBe(0);
  });

  it('lands on a floor', () => {
    const body = makeBody(0, 0);
    const floor = aabb(0, 20, 100, 10);
    const result = moveAndCollide(body, 0, 50, [floor]);
    expect(result.landed).toBe(true);
    expect(body.y).toBe(10); // floor.y (20) minus body height
    expect(body.vy).toBe(0);
  });

  it('bonks a ceiling without counting as a landing', () => {
    const body = makeBody(0, 30);
    const ceiling = aabb(0, 0, 100, 10);
    const result = moveAndCollide(body, 0, -50, [ceiling]);
    expect(result.hitY).toBe(true);
    expect(result.landed).toBe(false);
    expect(body.y).toBe(10); // ceiling bottom
  });
});
