import { GameItem } from './GameItem.class.ts';
import { Game } from '@/views/application/Game.class.ts';

export class Egg extends GameItem {
  distance: number = 0;
  i: number = 0;
  isDying: boolean = false;
  constructor(game: Game, x: number, y: number, w: number, h: number) {
    super(game, x, y, w, h);
    this.distance = x;
    this.i = Math.floor(Math.random() * 13) + 1;
  }

  static images() {
    return { egg: '/images/eggs.png' };
  }
  override update(
    id: number,
    engine: CanvasRenderingContext2D,
    frame: number,
    horizontal: number,
    vertical: number,
    fire: boolean,
  ) {
    if (
      this.game.king.dx < this.x + this.w &&
      this.game.king.dx + this.game.king.dw > this.x &&
      this.game.king.y < this.y + this.h &&
      this.game.king.y + this.game.king.h > this.y
    ) {
      if (
        this.game.king.speedY > 0 &&
        this.game.king.y + this.game.king.h > this.y &&
        this.game.king.y + this.game.king.h < this.y + this.h
      ) {
        //console.log('top collision')
        if (!this.isDying) this.game.king.speedY -= 20;
        //console.log('speedY', king.speedY)
        this.die(id);
      }

      if (
        !this.isDying &&
        !this.game.king.isParallized &&
        this.game.king.speedY > 0 &&
        this.game.king.dx + this.game.king.dw - this.x > 1
      ) {
        //console.log('front collision', king.dx, king.w, this.x)
        this.game.king.parallize();
        this.die(id);
      }

      //console.log('AHHH')
    }
    this.render(engine);
  }

  render(engine: CanvasRenderingContext2D) {
    if (this.isDying) {
      if (Math.floor(Date.now() / 200) % 2) engine.globalAlpha = 0.4;
      engine.drawImage(
        this.game.images['egg'],
        650,
        0,
        this.w,
        this.h,
        this.x,
        this.y,
        this.w,
        this.h,
      );
      engine.globalAlpha = 1;
    } else {
      if (Math.floor(Date.now() / 200) % 2) this.i++;
      engine.drawImage(
        this.game.images['egg'],
        this.w * (this.i % 13),
        0,
        this.w,
        this.h,
        this.x,
        this.y,
        this.w,
        this.h,
      );
    }
  }

  die(id: number) {
    if (this.isDying) return;
    this.isDying = true;
    setTimeout(() => {
      this.game.eggs.splice(id, 1);
    }, 300);
  }
}
