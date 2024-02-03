import { GameItem } from './GameItem.class.ts';
import { Game } from '@/views/application/Game.class.ts';
import { Update } from '@/views/application/Game.types.ts';

export class Background extends GameItem {
  i = 0;
  timer = 0;
  bg: HTMLImageElement = new Image();
  dw = 100;
  dh = 100;
  constructor(game: Game, x: number, y: number, w: number, h: number) {
    super(game, x, y, w, h);
    this.i = 0;
    this.timer = 0;
  }

  static images() {
    return { background0: '/images/bg-default-1.jpg', background1: '/images/bg-default-2.jpg' };
  }

  init() {
    this.bg = this.game.images['background0'];
    const r = Math.max(this.w / this.bg.width, this.h / this.bg.height);
    this.dw = this.bg.width * r;
    this.dh = this.bg.height * r;
    this.x = Math.abs(Math.min((this.w - this.dw) / 2, 0));
    this.y = Math.abs(Math.min(this.h - this.dh, 0));
    //console.log('background.loaded', this.w, this.h, this.dw, this.dh, r, this.x, this.y);
  }
  update({ engine, horizontal }: Update) {
    if (
      !this.game.king.stop &&
      !this.game.world.isEnd &&
      this.game.world.isStart &&
      horizontal != 0
      // this.game.king.isInBuffer()
    ) {
      if (!this.timer) {
        this.i = (this.i + 1) % 2;
      }
      this.timer = (this.timer + 1) % 3;
    }
    this.render(engine);
  }

  render(engine: CanvasRenderingContext2D) {
    engine.drawImage(
      this.game.images['background' + this.i],
      this.x,
      this.y,
      this.bg.width,
      this.bg.height,
      0,
      0,
      this.dw,
      this.dh,
    );
  }
}
