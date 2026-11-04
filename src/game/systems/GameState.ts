/**
 * Placeholder game-state system.
 *
 * Tracks the passage of the night. Replace/extend with the real shift logic
 * (power, doors, cameras) as the prototype grows.
 */
export class GameState {
  night = 1;

  private elapsed = 0;

  reset(): void {
    this.night = 1;
    this.elapsed = 0;
  }

  advance(deltaSeconds: number): void {
    this.elapsed += Math.max(0, deltaSeconds);
  }

  get seconds(): number {
    return this.elapsed;
  }

  get minutes(): number {
    return Math.floor(this.elapsed / 60);
  }
}
