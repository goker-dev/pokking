import { GameItem } from './GameItem.class.ts';
import { Game } from '@/views/application/Game.class.ts';
import { Update } from '@/views/application/Game.types.ts';

export class King extends GameItem {
  i = 0;
  color = '#00A';
  sx = 0;
  sy = 0;
  sw = 75;
  sh = 33;
  dx = 100;
  dy = 100;
  dw = 75;
  dh = 33;
  by = 0;
  speedX = 0;
  speedY = 0;
  arm: number[] = [];
  weapon: number[] = [];
  attack = 0;
  life = 100;
  journey = 0;
  buffer = 0;
  stop = false;
  map = {
    arm: {
      default: [[0, 47, 57, 37, 69, 34, 57, 37]],
      attack: [
        [0, 0, 60, 47, 65, 26, 57, 47],
        [0, 47, 57, 37, 69, 34, 57, 37],
        [0, 84, 57, 24, 66, 46, 57, 24],
        [0, 109, 60, 25, 63, 51, 60, 25],
        [0, 135, 60, 33, 61, 53, 60, 33],
      ],
    },
    sword: {
      default: [[0, 49, 58, 36, 117, 13, 58, 36]],
      attack: [
        [0, 0, 58, 48, 106, -11, 58, 48],
        [0, 49, 58, 36, 117, 13, 58, 36],
        [0, 85, 60, 27, 120, 35, 60, 27],
        [0, 112, 63, 17, 120, 60, 63, 17],
        [0, 129, 63, 22, 115, 70, 63, 22],
      ],
    },
  };

  isParallized: boolean = false;
  constructor(game: Game, x: number, y: number, w: number, h: number) {
    super(game, x, y, w, h);
  }

  static images() {
    return {
      head: '/images/head.png',
      torso: '/images/torso.png',
      arm: '/images/arm.png',
      sword: '/images/sword.png',
      legs: '/images/legs.png',
    };
  }

  init() {
    this.dx = this.buffer - this.w / 2;
    this.arm = this.map['arm']['default'][0];
    this.weapon = this.map['sword']['default'][0];
  }

  update({ engine, horizontal, vertical, fire }: Update) {
    if (!this.stop && horizontal > 0) {
      this.sx = (this.sx + this.sw) % 600;
      //console.log('KING RIGHT', king.journey, map.buffer, king.buffer);
      if (!this.stop && this.dx < this.game.W / 2) this.dx += this.game.speed;
    }
    if (!this.stop && horizontal < 0 && this.isInBuffer()) {
      //this.sx = (this.sx - this.sw) >= 0 ? (this.sx - this.sw) : 525;
      //console.log('KING LEFT', king.journey, map.buffer, king.buffer);
      // TODO
      // if (this.game.world.x <= this.game.buffer) this.stop = true;
      if (this.dx > this.w) this.dx -= this.game.speed;
    }
    if (!this.stop && vertical < 0 && this.y + this.h >= this.game.ground) {
      this.speedY = -15;
    }
    if (!this.stop && fire) {
      this.arm = this.map['arm']['attack'][this.attack];
      this.weapon = this.map['sword']['attack'][this.attack];
      this.attack = (this.attack + 1) % 4;
    }
    if (!this.stop && this.speedY < 0) {
      this.y += this.speedY;
    }
    if (!this.stop && this.y + this.h < this.game.ground) {
      this.speedY += this.game.G;
      if (this.y + this.speedY > this.game.ground - this.h) this.y = this.game.ground - this.h;
      else this.y += this.speedY;
    }

    this.game.board.update({ journey: this.journey });
    this.render(engine);
  }

  render(engine: CanvasRenderingContext2D) {
    if (this.isParallized && Math.floor(Date.now() / 200) % 2) {
      engine.globalAlpha = 0.4;
    } else engine.globalAlpha = 1;
    engine.drawImage(this.game.images['head'], 0, 0, 76, 67, this.dx, this.y, 76, 67);

    engine.drawImage(
      this.game.images['sword'],
      this.weapon[0],
      this.weapon[1],
      this.weapon[2],
      this.weapon[3],
      this.weapon[4] + this.dx,
      this.weapon[5] + this.y,
      this.weapon[6],
      this.weapon[7],
    );

    engine.drawImage(
      this.game.images['arm'],
      this.arm[0],
      this.arm[1],
      this.arm[2],
      this.arm[3],
      this.arm[4] + this.dx,
      this.arm[5] + this.y,
      this.arm[6],
      this.arm[7],
    );

    engine.drawImage(this.game.images['torso'], 0, 0, 76, 52, this.dx - 7, this.y + 45, 76, 52);
    engine.drawImage(
      this.game.images['legs'],
      this.sx,
      this.sy,
      this.sw,
      this.sh,
      this.dx,
      this.y + 88,
      this.dw,
      this.dh,
    );
    engine.globalAlpha = 1;
  }

  parallize() {
    this.isParallized = true;
    this.game.king.stop = true;
    //console.log('king stop', king.stop);
    setTimeout(() => {
      this.game.king.isParallized = false;
      this.game.king.stop = false;
    }, 2000);
  }

  isAttacking() {
    return this.attack == 1;
  }

  isInBuffer() {
    //console.log('king buffer', king.journey, king.buffer, king.journey > king.buffer);
    return this.game.king.journey > this.game.king.buffer;
  }
}
