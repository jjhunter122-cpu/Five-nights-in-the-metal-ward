/**
 * Minimal DOM HUD bridge.
 *
 * Gameplay state lives in the scene; this class only pushes text into the
 * overlay elements declared in `index.html`.
 */
export class Hud {
  private readonly toast: HTMLElement | null;
  private readonly win: HTMLElement | null;
  private toastTimer: number | null = null;

  constructor(root: ParentNode = document) {
    this.toast = root.querySelector<HTMLElement>('#toast');
    this.win = root.querySelector<HTMLElement>('#win');
  }

  message(text: string, holdMs = 900): void {
    if (!this.toast) {
      return;
    }

    this.toast.textContent = text;
    this.toast.classList.add('visible');

    if (this.toastTimer !== null) {
      window.clearTimeout(this.toastTimer);
    }
    this.toastTimer = window.setTimeout(() => {
      this.toast?.classList.remove('visible');
      this.toastTimer = null;
    }, holdMs);
  }

  /** Show the persistent "you win" banner. */
  showWin(): void {
    this.win?.removeAttribute('hidden');
  }

  hideWin(): void {
    this.win?.setAttribute('hidden', '');
  }
}
