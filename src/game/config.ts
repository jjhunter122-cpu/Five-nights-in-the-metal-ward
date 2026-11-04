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
} as const;
