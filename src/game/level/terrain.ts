import type { Solid, SolidKind } from './level';

export interface TileRef {
  col: number;
  row: number;
}

const TILE = 16;

/**
 * Autotile picks into `public/assets/tiles/sheet.png` (a 17x8 grid of 16px
 * tiles). The sheet holds two colour variants of the same ground blob: a rusty
 * set on rows 0-1 and a teal set on rows 2-3. Ground uses the rust set, the
 * floating platforms use the teal set. Tile (11,1) is a flat, uniform fill.
 */
const RUST: Record<'topLeft' | 'top' | 'topRight' | 'left' | 'right', TileRef> = {
  topLeft: { col: 7, row: 0 },
  top: { col: 8, row: 0 },
  topRight: { col: 10, row: 0 },
  left: { col: 7, row: 1 },
  right: { col: 10, row: 1 },
};

const TEAL: Record<'topLeft' | 'top' | 'topRight' | 'left' | 'right', TileRef> = {
  topLeft: { col: 7, row: 2 },
  top: { col: 8, row: 2 },
  topRight: { col: 10, row: 2 },
  left: { col: 7, row: 3 },
  right: { col: 10, row: 3 },
};

const FILL: TileRef = { col: 11, row: 1 };

/** Choose the tile for cell (i, j) of a solid spanning `cols` columns. */
export function pickTile(kind: SolidKind, i: number, j: number, cols: number): TileRef {
  const material = kind === 'ground' ? RUST : TEAL;
  const isFirstCol = i === 0;
  const isLastCol = i === cols - 1 && cols > 1;

  if (j === 0) {
    if (isFirstCol) {
      return material.topLeft;
    }
    if (isLastCol) {
      return material.topRight;
    }
    return material.top;
  }

  if (isFirstCol) {
    return material.left;
  }
  if (isLastCol) {
    return material.right;
  }
  return FILL;
}

/**
 * Paint every solid into a 2D context using the tileset. Each solid is clipped
 * to its own rectangle so partial edge tiles cannot bleed into the gaps
 * between platforms.
 */
export function drawTerrain(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  solids: readonly Solid[],
): void {
  for (const solid of solids) {
    const cols = Math.ceil(solid.w / TILE);
    const rows = Math.ceil(solid.h / TILE);

    ctx.save();
    ctx.beginPath();
    ctx.rect(solid.x, solid.y, solid.w, solid.h);
    ctx.clip();

    for (let j = 0; j < rows; j += 1) {
      for (let i = 0; i < cols; i += 1) {
        const tile = pickTile(solid.kind, i, j, cols);
        ctx.drawImage(
          image,
          tile.col * TILE,
          tile.row * TILE,
          TILE,
          TILE,
          solid.x + i * TILE,
          solid.y + j * TILE,
          TILE,
          TILE,
        );
      }
    }

    ctx.restore();
  }
}
