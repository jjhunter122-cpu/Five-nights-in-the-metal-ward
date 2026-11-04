export interface Vec2 {
  x: number;
  y: number;
}

export interface Aabb {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function aabb(x: number, y: number, w: number, h: number): Aabb {
  return { x, y, w, h };
}

export function left(a: Aabb): number {
  return a.x;
}

export function right(a: Aabb): number {
  return a.x + a.w;
}

export function top(a: Aabb): number {
  return a.y;
}

export function bottom(a: Aabb): number {
  return a.y + a.h;
}

/**
 * Strict overlap test. Boxes that merely touch on an edge do not overlap.
 */
export function overlaps(a: Aabb, b: Aabb): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function contains(a: Aabb, p: Vec2): boolean {
  return p.x >= a.x && p.x <= a.x + a.w && p.y >= a.y && p.y <= a.y + a.h;
}

export function center(a: Aabb): Vec2 {
  return { x: a.x + a.w / 2, y: a.y + a.h / 2 };
}
