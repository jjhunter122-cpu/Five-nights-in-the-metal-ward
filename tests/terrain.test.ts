import { describe, expect, it } from 'vitest';
import { pickTile } from '../src/game/level/terrain';

describe('pickTile', () => {
  it('caps the top row with corners on the ends', () => {
    expect(pickTile('ground', 0, 0, 10)).toEqual({ col: 7, row: 0 });
    expect(pickTile('ground', 5, 0, 10)).toEqual({ col: 8, row: 0 });
    expect(pickTile('ground', 9, 0, 10)).toEqual({ col: 10, row: 0 });
  });

  it('uses a flat fill for the interior', () => {
    expect(pickTile('ground', 5, 3, 10)).toEqual({ col: 11, row: 1 });
  });

  it('wraps the body with left and right edge tiles', () => {
    expect(pickTile('ground', 0, 2, 10)).toEqual({ col: 7, row: 1 });
    expect(pickTile('ground', 9, 2, 10)).toEqual({ col: 10, row: 1 });
  });

  it('uses the teal variant for platforms', () => {
    expect(pickTile('platform', 0, 0, 10)).toEqual({ col: 7, row: 2 });
    expect(pickTile('platform', 5, 0, 10)).toEqual({ col: 8, row: 2 });
  });

  it('handles single-column solids without right tiles', () => {
    expect(pickTile('ground', 0, 0, 1)).toEqual({ col: 7, row: 0 });
    expect(pickTile('ground', 0, 1, 1)).toEqual({ col: 7, row: 1 });
  });
});
