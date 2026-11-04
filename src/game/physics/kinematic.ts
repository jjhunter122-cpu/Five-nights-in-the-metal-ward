import type { Aabb } from './aabb';

export interface MoveResult {
  hitX: boolean;
  hitY: boolean;
  landed: boolean;
}

/**
 * Axis-separated AABB resolution against static solids.
 *
 * Mutates `box` in place. Resolves the X axis first, then the Y axis, so
 * callers can tell a wall bump (hitX) apart from landing on a surface
 * (landed). Each axis is clamped to the nearest solid it would cross, so the
 * result does not tunnel regardless of how large a single step is. The box is
 * assumed not to start inside a solid.
 */
export function moveAndCollide(
  box: Aabb,
  dx: number,
  dy: number,
  solids: readonly Aabb[],
): MoveResult {
  const result: MoveResult = { hitX: false, hitY: false, landed: false };

  if (dx !== 0) {
    const startX = box.x;
    let nextX = startX + dx;

    for (const solid of solids) {
      // Only solids whose vertical span the box currently shares can block X.
      if (box.y + box.h <= solid.y || box.y >= solid.y + solid.h) {
        continue;
      }
      if (dx > 0 && startX + box.w <= solid.x && nextX + box.w > solid.x) {
        nextX = Math.min(nextX, solid.x - box.w);
      } else if (dx < 0 && startX >= solid.x + solid.w && nextX < solid.x + solid.w) {
        nextX = Math.max(nextX, solid.x + solid.w);
      }
    }

    result.hitX = nextX !== startX + dx;
    box.x = nextX;
  }

  if (dy !== 0) {
    const startY = box.y;
    let nextY = startY + dy;

    for (const solid of solids) {
      // X was resolved above, so test the box's latest horizontal span.
      if (box.x + box.w <= solid.x || box.x >= solid.x + solid.w) {
        continue;
      }
      if (dy > 0 && startY + box.h <= solid.y && nextY + box.h > solid.y) {
        nextY = Math.min(nextY, solid.y - box.h);
        result.landed = true;
      } else if (dy < 0 && startY >= solid.y + solid.h && nextY < solid.y + solid.h) {
        nextY = Math.max(nextY, solid.y + solid.h);
      }
    }

    result.hitY = nextY !== startY + dy;
    box.y = nextY;
  }

  return result;
}
