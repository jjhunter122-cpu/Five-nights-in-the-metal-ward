import { Color, DisplayMode, Engine } from 'excalibur';
import { FIXED_UPDATE_FPS, PALETTE, VIEW } from './game/config';
import { resources } from './game/resources';
import { GameScene } from './game/scenes/GameScene';
import './style.css';

const game = new Engine({
  width: VIEW.width,
  height: VIEW.height,
  canvasElementId: 'game',
  displayMode: DisplayMode.FitContainer,
  backgroundColor: Color.fromHex(PALETTE.background),
  suppressPlayButton: true,
  fixedUpdateFps: FIXED_UPDATE_FPS,
  pixelArt: true,
});

game.addScene('game', new GameScene());

// Stop the page from scrolling or the browser from opening help while playing.
const prevent = new Set(['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'F1']);
window.addEventListener(
  'keydown',
  (event) => {
    if (prevent.has(event.code) || prevent.has(event.key)) {
      event.preventDefault();
    }
  },
  { passive: false },
);

game
  .start(resources)
  .then(() => game.goToScene('game'))
  .catch((error: unknown) => {
    console.error('Failed to start Five Nights in the Metal Ward', error);
  });
