import type { Aabb } from '../physics/aabb';

export type SolidKind = 'ground' | 'platform';

export interface Solid extends Aabb {
  kind: SolidKind;
}

export interface Level {
  width: number;
  height: number;
  spawn: { x: number; y: number };
  solids: Solid[];
}

function solid(x: number, y: number, w: number, h: number, kind: SolidKind): Solid {
  return { x, y, w, h, kind };
}

/**
 * The single test level.
 *
 * A 2560 x 720 room: two ground slabs split by a 140 px jump gap, side walls,
 * and a rising trail of floating platforms ending at the top-right. `y` grows
 * downward, so the ground sits at the bottom of the room.
 */
export const LEVEL_ONE: Level = {
  width: 2560,
  height: 720,
  spawn: { x: 120, y: 560 },
  solids: [
    // Ground, split by a gap from x=1000 to x=1140.
    solid(0, 640, 1000, 80, 'ground'),
    solid(1140, 640, 1420, 80, 'ground'),

    // Side walls keep the player inside the room.
    solid(0, 0, 32, 640, 'ground'),
    solid(2528, 0, 32, 640, 'ground'),

    // Floating platforms, climbing left to right.
    solid(260, 540, 160, 24, 'platform'),
    solid(500, 460, 160, 24, 'platform'),
    solid(740, 380, 160, 24, 'platform'),
    solid(980, 300, 200, 24, 'platform'),
    solid(1280, 360, 180, 24, 'platform'),
    solid(1520, 440, 160, 24, 'platform'),
    solid(1760, 360, 160, 24, 'platform'),
    solid(2000, 280, 180, 24, 'platform'),
    solid(2260, 200, 200, 24, 'platform'),
  ],
};
