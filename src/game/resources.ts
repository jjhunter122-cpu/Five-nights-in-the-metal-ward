import { ImageSource, Loader, Sound } from 'excalibur';

function asset(path: string): string {
  return `${import.meta.env.BASE_URL}assets/${path}`;
}

export const charactersImage = new ImageSource(asset('sprites/characters.png'));
export const tilesImage = new ImageSource(asset('tiles/sheet.png'));
export const ambientSound = new Sound(asset('audio/ambient.ogg'));
export const growlSound = new Sound(asset('audio/growl.wav'));

/** Everything the game needs before the first scene starts. */
export const resources = new Loader();

resources.addResource(charactersImage);
resources.addResource(tilesImage);
resources.addResource(ambientSound);
resources.addResource(growlSound);
