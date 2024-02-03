import { GameItem } from './GameItem.class.ts';
import { Game } from '@/views/application/Game.class.ts';
import { Bullet } from '@/views/application/Bullet.class.ts';
import { Update } from '@/views/application/Game.types.ts';

export class Alien extends GameItem {
  distance = 0;
  y = 0;
  // w = 100;
  // h = 150;
  ammo = 0;
  i = 0;
  life = 10;
  walk = 0;
  speedY = 1;
  bullets: Bullet[] = [];
  isDying = false;
  constructor(game: Game, x: number, y: number, w: number, h: number, ammo: number) {
    super(game, x, y, w, h);
    this.distance = x;
    this.y = y - h;
    // this.w = 100;
    // this.h = 150;
    this.ammo = ammo;
    this.i = Math.floor(Math.random() * 13) + 1;
    this.life = 10;
    this.walk = 0;
    this.speedY = 1;
    this.bullets = [];
  }

  static images() {
    return { alienBody: '/images/alien.png', alienLegs: '/images/alien-legs.png' };
  }

  init() {}
  update({ id, engine, frame, horizontal, vertical, fire }: Update) {
    this.walk = (this.walk + 1) % 24;
    if (this.walk == 12) this.distance -= 10;

    // this show
    // fire
    if (this.x < this.game.W) {
      if (!frame && this.bullets.length < 2 && this.ammo) {
        //console.log('alien', i, this.ammo, this.bullets.length);
        this.bullets.push(new Bullet(this.game, this.x + 5, this.game.ground - 78, 10, 4, this.w));
        this.ammo--;
      }
    }

    if (
      this.game.king.dx + this.game.king.dw < this.x &&
      this.game.king.dx + this.game.king.dw + this.game.king.sw > this.x
    ) {
      // console.log('you can attack', king.isAttacking())
      if (fire && this.life && this.game.king.isAttacking()) this.life -= 1;
      //console.log(this.w * Math.floor((10 - this.life)))
    }

    if (this.life <= 0) {
      this.life = 0;
      this.die(id);
    }

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
        //console.log('alien top collision')
        //king.speedY -= 20;
        //console.log('speedY', king.speedY)
        this.game.king.parallize();
        //king.dx -= 100;
        this.game.king.y -= 30;
        this.distance += 100;
        //this.die(i);
      }
      if (
        !this.game.king.isParallized &&
        this.game.king.speedY > 0 &&
        this.game.king.dx + this.game.king.dw - this.x > 1
      ) {
        //console.log('alien front collision', king.dx, king.w, this.x)
        this.game.king.parallize();
        //king.y -= 50;
        //map.x += 100;
        this.distance += 150;
        this.y -= 25;
        //this.die(i);
      }
    }

    if (this.speedY < 0) {
      this.y += this.speedY;
    }
    if (this.y + this.h < this.game.ground) {
      this.speedY += this.game.G;
      if (this.y + this.speedY > this.game.ground - this.h) this.y = this.game.ground - this.h;
      else this.y += this.speedY;
    }

    this.bullets.forEach((bullet, id) =>
      bullet.update({ id, bullets: this.bullets, engine, frame, horizontal, vertical, fire }),
    );
    this.render(engine);
  }

  render(engine: CanvasRenderingContext2D) {
    if (this.isDying) {
      engine.globalAlpha = 1;
      if (Math.floor(Date.now() / 200) % 2) engine.globalAlpha = 0.4;
    }
    if (this.life < 10) {
      engine.drawImage(
        this.game.images['alienBody'],
        this.w * Math.floor(10 - this.life),
        0,
        this.w,
        115,
        this.x,
        this.y,
        this.w,
        115,
      );
    } else {
      engine.drawImage(
        this.game.images['alienBody'],
        0,
        0,
        this.w,
        115,
        this.x,
        this.y,
        this.w,
        115,
      );
    }
    engine.drawImage(
      this.game.images['alienLegs'],
      this.w * this.walk,
      0,
      this.w,
      49,
      this.x,
      this.y + 103,
      this.w,
      49,
    );
  }

  die(id: number | undefined) {
    if (!id || this.isDying) return;
    this.isDying = true;
    setTimeout(() => {
      this.game.aliens.splice(id, 1);
    }, 300);
  }
}
