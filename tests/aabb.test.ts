import { describe, expect, it } from 'vitest';
import { aabb, bottom, center, contains, left, overlaps, right, top } from '../src/game/physics/aabb';

describe('AABB helpers', () => {
  it('exposes edges', () => {
    const box = aabb(10, 20, 30, 40);
    expect(left(box)).toBe(10);
    expect(top(box)).toBe(20);
    expect(right(box)).toBe(40);
    expect(bottom(box)).toBe(60);
  });

  it('detects a clear overlap', () => {
    expect(overlaps(aabb(0, 0, 10, 10), aabb(5, 5, 10, 10))).toBe(true);
  });

  it('treats touching edges as non-overlapping', () => {
    expect(overlaps(aabb(0, 0, 10, 10), aabb(10, 0, 10, 10))).toBe(false);
    expect(overlaps(aabb(0, 0, 10, 10), aabb(0, 10, 10, 10))).toBe(false);
  });

  it('separates boxes on a single axis', () => {
    expect(overlaps(aabb(0, 0, 10, 10), aabb(0, 11, 10, 10))).toBe(false);
    expect(overlaps(aabb(0, 0, 10, 10), aabb(11, 0, 10, 10))).toBe(false);
  });

  it('computes the center', () => {
    expect(center(aabb(0, 0, 10, 20))).toEqual({ x: 5, y: 10 });
  });

  it('includes edges in the containment test', () => {
    const box = aabb(0, 0, 10, 10);
    expect(contains(box, { x: 5, y: 5 })).toBe(true);
    expect(contains(box, { x: 0, y: 0 })).toBe(true);
    expect(contains(box, { x: 10, y: 10 })).toBe(true);
    expect(contains(box, { x: 10.5, y: 5 })).toBe(false);
  });
});
