import { Actor, Animation, AnimationStrategy, Sprite, SpriteSheet, range, vec } from 'excalibur';
import { SPRITE } from '../config';
import { charactersImage } from '../resources';

/**
 * The player's animated sprite, sliced from `characters.png`.
 *
 * The sheet is a 23x4 grid of 32px frames; the green-hooded hero lives on
 * row 2. Idle is a single frame, run loops a short slice of the same row, and
 * facing is a horizontal mirror.
 */
export class PlayerRig {
  readonly actor: Actor;

  private readonly idle: Sprite;
  private readonly run: Animation;
  private moving = false;

  constructor() {
    const sheet = SpriteSheet.fromImageSource({
      image: charactersImage,
      grid: {
        rows: SPRITE.rows,
        columns: SPRITE.columns,
        spriteWidth: SPRITE.character,
        spriteHeight: SPRITE.character,
      },
    });

    const base = SPRITE.playerRow * SPRITE.columns;
    this.idle = sheet.getSprite(SPRITE.idleCol, SPRITE.playerRow);
    this.run = Animation.fromSpriteSheet(
      sheet,
      range(base + SPRITE.runFrom, base + SPRITE.runTo),
      90,
      AnimationStrategy.Loop,
    );

    this.actor = new Actor({ pos: vec(0, 0) });
    this.actor.graphics.use(this.idle);
  }

  setMoving(moving: boolean): void {
    if (moving === this.moving) {
      return;
    }
    this.moving = moving;
    this.actor.graphics.use(moving ? this.run : this.idle);
  }

  setFacing(facing: 1 | -1): void {
    this.actor.scale = vec(facing, 1);
  }
}
