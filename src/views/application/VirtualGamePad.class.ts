import { Input } from '@/views/application/Input.class.ts';
import { Game } from '@/views/application/Game.class.ts';

export class VirtualGamePad {
  game: Game;
  w: number;
  h: number;
  left: number;
  right: number;
  bottom: number;

  clientX: number = 0;
  clientY: number = 0;
  attackX: number = 0;
  attackY: number = 0;

  goRight: boolean = false;
  goLeft: boolean = false;
  direction = 0;
  attack = 500;

  constructor(game: Game, w: number, h: number) {
    this.game = game;
    const canvas = this.game.canvas;
    this.w = w;
    this.h = h;
    this.left = 20;
    this.right = canvas.width - 10 - w;
    this.bottom = canvas.height - 20 - h;
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.clientX = e.targetTouches[0].pageX;
      this.clientY = e.targetTouches[0].pageY;
      this.attackX = e.targetTouches[1] ? e.targetTouches[1].pageX : e.targetTouches[0].pageX;
      this.attackY = e.targetTouches[1] ? e.targetTouches[1].pageY : e.targetTouches[0].pageY;
    });
    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.clientX = 0;
      this.clientY = 0;
      this.attackX = 0;
      this.attackY = 0;
    });
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      this.clientX = e.targetTouches[0].pageX;
      this.clientY = e.targetTouches[0].pageY;
      this.attackX = e.targetTouches[1] ? e.targetTouches[1].pageX : e.targetTouches[0].pageX;
      this.attackY = e.targetTouches[1] ? e.targetTouches[1].pageY : e.targetTouches[0].pageY;
    });
    window.addEventListener('deviceorientation', (e) => {
      e.preventDefault();
      if (e.beta) {
        this.goRight = e.beta > 5;
        this.goLeft = e.beta < -5;
      }
    });
    this.direction = 0;
    this.attack = 500;
  }

  isLeft() {
    return this.goLeft;
  }

  isRight() {
    return this.goRight;
  }

  isUp() {
    return (
      this.clientX > this.left &&
      this.clientX < this.left + this.w &&
      this.clientY > this.bottom &&
      this.clientY < this.bottom + this.h
    );
  }

  // isDown() {
  //     return this.clientX > this.left + this.w / 3 && this.clientX < this.left + this.w * 2 / 3 && this.clientY > this.bottom + this.h / 2 && this.clientY < this.bottom + this.h
  // }

  isAttack() {
    return (
      this.attackX > this.right &&
      this.attackX < this.right + this.w &&
      this.attackY > this.bottom &&
      this.attackY < this.bottom + this.h
    );
  }

  static images() {
    return { controllers: '/images/controllers.png' };
  }

  update(input: Input) {
    this.direction = 0;
    input.keys['ArrowRight'] = false;
    input.keys['ArrowLeft'] = false;
    input.keys['ArrowUp'] = false;
    input.keys['ArrowDown'] = false;
    input.keys['Space'] = false;
    if (this.isRight()) {
      console.log('RIGHT');
      input.keys['ArrowRight'] = true;
    }
    if (this.isLeft()) {
      console.log('LEFT');
      input.keys['ArrowLeft'] = true;
    }
    if (this.isUp()) {
      //console.log('UP');
      this.direction = 100;
      input.keys['ArrowUp'] = true;
    }
    // if (this.isDown()) {
    //     console.log('DOWN');
    //     this.direction = 300
    //     input.keys['ArrowDown'] = true;
    // }
    if (this.isAttack()) {
      //console.log('ATTACK');
      this.attack = 600;
      input.keys['Space'] = true;
    } else {
      this.attack = 500;
    }
  }

  render(engine: CanvasRenderingContext2D) {
    engine.drawImage(
      this.game.images['controllers'],
      this.direction,
      0,
      100,
      100,
      this.left,
      this.bottom,
      this.w,
      this.h,
    );
    engine.drawImage(
      this.game.images['controllers'],
      this.attack,
      0,
      100,
      100,
      this.right,
      this.bottom,
      this.w,
      this.h,
    );
  }
}
