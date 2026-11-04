export const VIEW = {
  width: 960,
  height: 540,
} as const;

export const FIXED_UPDATE_FPS = 120;

export const PALETTE = {
  background: '#0f1720',
  ground: '#2a3b2f',
  platform: '#3a4a5a',
  player: '#e0c04a',
  accent: '#d24b4b',
} as const;

/**
 * Player movement tunables, in pixels and seconds.
 *
 * Derived feel: jump height = jumpVelocity^2 / (2 * gravity) ≈ 122 px, and
 * airtime = 2 * |jumpVelocity| / gravity ≈ 0.7 s, so a full-speed run covers
 * roughly 195 px per jump.
 */
export const PLAYER = {
  width: 28,
  height: 40,
  maxSpeed: 280,
  groundAccel: 2600,
  airAccel: 1600,
  groundFriction: 3200,
  airFriction: 600,
  gravity: 2000,
  maxFallSpeed: 900,
  jumpVelocity: -700,
  jumpCutMultiplier: 0.45,
  coyoteTime: 0.1,
  jumpBufferTime: 0.12,
} as const;

/** Seconds for the camera to converge on its target (exponential smoothing). */
export const CAMERA = {
  smoothing: 0.14,
  zoom: 2,
} as const;

/** Frame geometry for the pixel-art sources in `public/assets`. */
export const SPRITE = {
  /** Tile size of `sheet.png`, a 17 x 8 grid. */
  tile: 16,
  /** Frame size of `characters.png`, a 23 x 4 grid. */
  character: 32,
  columns: 23,
  rows: 4,
  /** The green-hooded hero is the third row (0-based). */
  playerRow: 2,
  idleCol: 0,
  runFrom: 8,
  runTo: 13,
} as const;
