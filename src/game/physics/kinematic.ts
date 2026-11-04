import type { Aabb } from './aabb';

export interface Body extends Aabb {
  vx: number;
  vy: number;
}

export interface MoveResult {
  hitX: boolean;
  hitY: boolean;
  landed: boolean;
}

/**
 * Axis-separated AABB resolution against static solids.
 *
 * Resolves the X axis first, then the Y axis, so callers can tell a wall bump
 * (hitX) apart from landing on a surface (landed). Each axis is clamped to the
 * nearest solid it would cross, so the result does not tunnel regardless of how
 * large a single step is. Bodies are assumed not to start inside a solid.
 */
export function moveAndCollide(
  body: Body,
  dx: number,
  dy: number,
  solids: readonly Aabb[],
): MoveResult {
  const result: MoveResult = { hitX: false, hitY: false, landed: false };

  if (dx !== 0) {
    const startX = body.x;
    let nextX = startX + dx;

    for (const solid of solids) {
      // Only solids whose vertical span the body currently shares can block X.
      if (body.y + body.h <= solid.y || body.y >= solid.y + solid.h) {
        continue;
      }
      if (dx > 0 && startX + body.w <= solid.x && nextX + body.w > solid.x) {
        nextX = Math.min(nextX, solid.x - body.w);
      } else if (dx < 0 && startX >= solid.x + solid.w && nextX < solid.x + solid.w) {
        nextX = Math.max(nextX, solid.x + solid.w);
      }
    }

    result.hitX = nextX !== startX + dx;
    body.x = nextX;
  }

  if (dy !== 0) {
    const startY = body.y;
    let nextY = startY + dy;

    for (const solid of solids) {
      // X was resolved above, so test the body's latest horizontal span.
      if (body.x + body.w <= solid.x || body.x >= solid.x + solid.w) {
        continue;
      }
      if (dy > 0 && startY + body.h <= solid.y && nextY + body.h > solid.y) {
        nextY = Math.min(nextY, solid.y - body.h);
        result.landed = true;
      } else if (dy < 0 && startY >= solid.y + solid.h && nextY < solid.y + solid.h) {
        nextY = Math.max(nextY, solid.y + solid.h);
      }
    }

    result.hitY = nextY !== startY + dy;
    body.y = nextY;
  }

  body.vx = result.hitX ? 0 : dx;
  body.vy = result.hitY ? 0 : dy;

  return result;
}
