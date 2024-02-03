import { Game } from '@/views/application/Game.class.ts';

export class GameItem {
  game: Game;
  x: number = 0;
  y: number = 0;
  w: number = 0;
  h: number = 0;
  color: string = 'rgba(11,11,255,1)';
  constructor(game: Game, x: number, y: number, w: number, h: number) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = 'rgba(11,11,255,1)';
  }

  update(
    engine: CanvasRenderingContext2D,
    frame: number,
    horizontal: number,
    vertical: number,
    fire: boolean,
  ) {
    this.x += this.game.speed * horizontal;
    this.y += this.game.speed * vertical;
    this.color = fire ? 'rgba(255,11,11,1)' : 'rgba(11,11,255,1)';
    this.render(engine);
  }

  render(engine: CanvasRenderingContext2D) {
    engine.beginPath();
    engine.rect(this.x, this.y, this.w, this.h);
    engine.fillStyle = this.color;
    engine.fill();
    engine.closePath();
  }
}
