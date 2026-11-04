export type Action = 'left' | 'right' | 'jump' | 'attack' | 'dash' | 'reset';

export type Bindings = Record<Action, readonly string[]>;

export const DEFAULT_BINDINGS: Bindings = {
  left: ['KeyA', 'ArrowLeft'],
  right: ['KeyD', 'ArrowRight'],
  jump: ['Space', 'KeyW', 'ArrowUp'],
  attack: ['KeyJ', 'KeyZ'],
  dash: ['ShiftLeft', 'ShiftRight', 'KeyK'],
  reset: ['KeyR'],
};

/**
 * Keyboard action map with per-frame edge detection.
 *
 * Physical keys are tracked by `KeyboardEvent.code`, so bindings survive
 * layout changes. Call `endFrame()` once per simulation step so that
 * `pressed()` reports a rising edge for exactly one frame.
 */
export class InputMap {
  private readonly down = new Set<string>();
  private readonly previous = new Set<string>();
  private readonly bindings: Bindings;

  constructor(bindings: Bindings = DEFAULT_BINDINGS) {
    this.bindings = bindings;
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onBlur);
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    this.down.add(event.code);
  };

  private readonly onKeyUp = (event: KeyboardEvent): void => {
    this.down.delete(event.code);
  };

  private readonly onBlur = (): void => {
    this.down.clear();
  };

  isDown(action: Action): boolean {
    return this.bindings[action].some((code) => this.down.has(code));
  }

  /** True only on the frame the action transitions from up to down. */
  pressed(action: Action): boolean {
    return this.isDown(action) && !this.bindings[action].some((code) => this.previous.has(code));
  }

  /** Latch the current state as `previous`; call once per step. */
  endFrame(): void {
    this.previous.clear();
    for (const code of this.down) {
      this.previous.add(code);
    }
  }

  dispose(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onBlur);
  }
}
