import { GameItem } from './GameItem.class.ts';
import { Egg } from '@/views/application/Egg.class.ts';
import { Alien } from '@/views/application/Alien.class.ts';
import { Game } from '@/views/application/Game.class.ts';
import { Chapter, Update } from '@/views/application/Game.types.ts';

export class World extends GameItem {
  isStart = false;
  isEnd = false;
  finished = false;
  i = 0;
  timer = 0;
  humans = 0;
  ground = 0;
  title = 'Chapter Title';
  step = 1;
  buffer = 1;
  maxTime = 60;
  constructor(game: Game, x: number, y: number, w: number, h: number) {
    super(game, x, y, w, h);
    this.i = 0;
    this.timer = 0;
    this.humans = 0;
    // this.game = game;
  }

  static images() {
    return {
      ground: '/images/ground.png',
      landscape: '/images/landscape.png',
      flags: '/images/flags.png',
    };
  }

  async init(chapter: () => Promise<Chapter>) {
    const data = await chapter();

    const buffer = this.game.W / 2;
    this.ground = this.game.H - 30;

    // log.map = data;
    //console.log('Map init', data);
    // this.eggs, (aliens = []);
    this.title = data.name;
    this.x = buffer;
    this.w = data.journey; // + W;
    console.log({ x: this.x, w: this.w });
    this.step = 1; //data.journey / this.w;
    this.buffer = (buffer / this.step) >> 0;
    this.humans = data.humans;
    this.maxTime = data.time;
    //add aliens on end of the map as count of  non-broken eggs in previous chapters
    this.game.aliens = [];
    // eggs to aliens
    this.game.eggs.forEach(() =>
      this.game.aliens.push(new Alien(this.game, this.w, this.ground, 100, 150, 1)),
    );
    // destroy the eggs
    this.game.eggs = [];
    // create new eggs from chapter data
    data.eggs.forEach((egg: { location: number }) =>
      this.game.eggs.push(new Egg(this.game, egg.location, this.ground - 50, 50, 50)),
    );
    // create new aliens from chapter data
    data.aliens.forEach((alien: { location: number; ammo: number }) =>
      this.game.aliens.push(
        new Alien(this.game, alien.location, this.ground, 100, 150, alien.ammo),
      ),
    );
    // this.startTime = new Date().getTime();
    // log.start = this.startTime;
    // console.log('background.loaded', this.w, this.h, this.dw, this.dh, r, this.x, this.y);
    console.log('EGGS', this.game.eggs.length);
    console.log('ALIENS', this.game.aliens.length);
  }
  update({ engine, frame, horizontal, vertical, fire }: Update) {
    const buffer = this.game.W / 2;
    if (!this.game.king.stop && !this.isEnd && horizontal > 0)
      if (-this.x < this.w - buffer) {
        this.x -= this.game.speed;
        this.game.king.buffer = Math.max(
          this.game.king.buffer,
          this.game.king.journey - this.buffer,
        );
      } else this.x = -(this.w - buffer);
    if (!this.game.king.stop && !this.isStart && horizontal < 0 && this.game.king.isInBuffer()) {
      //console.log('this.x', this.x)
      if (this.x - buffer < 0) {
        this.x += this.game.speed;
      }
    }

    this.game.king.journey = (Math.abs(this.x - buffer) * this.step) >> 0;
    this.isEnd = this.game.king.journey == this.w;
    if (this.isEnd && !this.finished) {
      this.finished = true;
      // this.finishTime = new Date().getTime();
      // log.finish = this.finishTime;
      // log.eggs = eggs.length;
      // log.aliens = aliens.length;
      // log.score = board.humans.innerHTML;
      // log.time = this.startToFinish();
      //console.log('FINISH', this.startTime, this.finishTime, this.startToFinish(), $('#score'));
      //console.log('LOG', log);
      //$('#log').val(JSON.stringify(log));
      // $('#message')
      //   .addClass('text-center text-warning')
      //   .html('You saved <strong>' + board.humans.innerHTML + '</strong> people.');
      // $('#score').modal({ backdrop: 'static', keyboard: false }).modal('show');
    }
    this.isStart = this.game.king.journey == 0;
    this.game.board.update({
      humans: this.humansCounter(),
      aliens: this.game.aliens.length,
      eggs: this.game.eggs.length,
    });

    this.render(engine);
    // eggs and aliens are must be rendered after the map;
    this.game.eggs.forEach((egg, id) => {
      this.game.eggs[id].x = this.x + egg.distance;
      this.game.eggs[id].update({ id, engine, frame, horizontal, vertical, fire });
    });
    this.game.aliens.forEach((alien, id) => {
      this.game.aliens[id].x = this.x + alien.distance;
      this.game.aliens[id].update({ id, engine, frame, horizontal, vertical, fire });
    });
  }

  render(engine: CanvasRenderingContext2D) {
    engine.beginPath();
    engine.fillStyle = engine.createPattern(this.game.images['ground'], 'repeat') || '#000';
    engine.save();
    engine.translate(this.x - this.buffer, this.ground);
    engine.fillRect(0, 0, this.w + this.game.W, this.h);
    engine.restore();
    engine.fill();
    engine.beginPath();
    engine.fillStyle = engine.createPattern(this.game.images['landscape'], 'repeat') || '#000';
    engine.save();
    engine.translate(this.x - this.buffer, this.ground - 200);
    engine.fillRect(0, 0, this.w + this.game.W, 200);
    engine.restore();
    engine.fill();

    // start
    engine.drawImage(
      this.game.images['flags'],
      0,
      0,
      80,
      80,
      this.x - 40,
      this.ground - 80,
      80,
      80,
    );
    // buffer - walking back distance
    if (this.game.king.buffer)
      engine.drawImage(
        this.game.images['flags'],
        80,
        0,
        80,
        80,
        this.x + this.game.king.buffer - 40 - this.game.king.w / 2,
        this.game.ground - 80,
        80,
        80,
      );
    // finish
    engine.drawImage(
      this.game.images['flags'],
      160,
      0,
      80,
      80,
      this.x + this.w - 40,
      this.game.ground - 80,
      80,
      80,
    );
  }

  // finish() {}
  //
  isFinished() {
    return this.game.king.journey == this.w;
  }
  //
  // startToFinish() {
  //   return this.finishTime - this.startTime;
  // }

  time() {
    const t = this.finished ? this.game.finishTime : new Date().getTime();
    return Math.ceil((t - this.game.startTime) / 1000);
  }

  easeInQuart(t: number) {
    return t * t * t * t;
  }

  humansCounter() {
    return Math.ceil(
      this.humans - this.humans * this.easeInQuart(Math.min(1, this.time() / this.maxTime)),
    );
  }
}
