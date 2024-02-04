import { GameItem } from './GameItem.class.ts';
import { Game } from '@/views/application/Game.class.ts';
import { Update } from '@/views/application/Game.types.ts';

export class Bullet extends GameItem {
  distance = 0;
  r = 1000;
  speedX = 3;
  speedY = 0;
  rangeOut = false;
  constructor(game: Game, x: number, y: number, w: number, h: number, range: number) {
    super(game, x, y, w, h);
    this.distance = x;
    this.r = range || 1000; // range
    this.speedX = 3;
    this.speedY = 0;
    this.rangeOut = false;
  }

  static images() {
    return {};
  }

  override update({ id, engine, horizontal, bullets }: Update & { bullets: Bullet[] }) {
    if (this.rangeOut || this.x < 0) {
      this.remove(id, bullets);
    } else if (!this.game.king.stop && horizontal > 0) {
      this.distance -= this.speedX + this.game.speed;
    } else if (!this.game.king.stop && horizontal < 0 && this.game.king.isInBuffer()) {
      this.distance -= this.speedX - this.game.speed;
    } else {
      this.distance -= this.speedX;
    }
    this.x = this.distance;
    // if the king has shoot
    if (
      this.game.king.dx < this.x + this.w &&
      this.game.king.dx + this.game.king.w > this.x &&
      this.game.king.y < this.y + this.h &&
      this.game.king.y + this.game.king.h > this.y
    ) {
      if (this.game.king.dx + this.game.king.w - this.x > 1) {
        //console.log('the king shooted', king.dx, this.x, king.journey)
        //king.life -= 5;
        this.game.king.parallize();
        this.rangeOut = true;
        this.remove(id, bullets);
      }
    }
    if (this.y + this.h < this.game.ground) {
      this.speedY += this.game.G * 0.001;
      if (this.y + this.speedY > this.game.ground - this.h) this.remove(id, bullets);
      else this.y += this.speedY;
    }
    this.render(engine);
  }

  render(engine: CanvasRenderingContext2D) {
    engine.beginPath();
    engine.rect(this.x, this.y, this.w, this.h);
    engine.fillStyle = this.getColor();
    engine.fill();
  }

  remove(id: number | undefined, bullets: Bullet[]) {
    if (id === undefined) return;
    bullets.splice(id, 1);
  }

  getColor() {
    // this.color = {};
    // this.color.r = Math.round(Math.random() * 255);
    // this.color.g = Math.round(Math.random() * 255);
    // this.color.b = Math.round(Math.random() * 255);
    // this.color.opacity = .8;
    // return "rgba(" + this.color.r + ", " + this.color.g + ", " + this.color.b + ", " + this.color.opacity + ")";
    return 'rgba(255,11,11,1)';
  }
}
