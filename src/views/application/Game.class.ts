import { Input } from '@/views/application/Input.class.ts';
import { VirtualGamePad } from '@/views/application/VirtualGamePad.class.ts';
import { King } from '@/views/application/King.class.ts';
import { World } from '@/views/application/World.class.ts';
import { Board } from '@/views/application/Board.class.ts';
import { Egg } from '@/views/application/Egg.class.ts';
import { Alien } from '@/views/application/Alien.class.ts';
import { Background } from '@/views/application/Background.class.ts';
export class Game {
  loading = true;
  FPS = 32;
  FRAME = 0;
  container = document.createElement('div');
  canvas = document.createElement('canvas');
  engine = this.canvas.getContext('2d');
  W: number = 100;
  H: number = 100;
  log = {};
  G = 1; // Gravity
  ground = this.H - 30;
  buffer = this.W / 2;
  speed = 8;
  images: { [k: string]: HTMLImageElement } = {};
  eggs: Egg[] = [];
  aliens: Alien[] = [];
  time = new Date().getTime();
  chapters = ['./maps/chapter-001.json', './maps/chapter-002.json'];

  input: Input = new Input();
  gamePad: VirtualGamePad | undefined;

  board: Board = new Board();
  world: World = new World(this, 0, 0, 100, 100);
  background: Background = new Background(this, 0, 0, 100, 100);
  king: King = new King(this, 100, 100, 110, 120);

  startTime: number = 0;
  finishTime: number = 1;
  // constructor() {
  //   this.input = new Input();
  //   this.board = new Board();
  //   this.king = new King(this, 100, 100, 110, 120);
  //   this.world = new World(this, 0, 0, 100, 100);
  //   this.background = new Background(this, 0, 0, 100, 100);
  // }
  init(container: HTMLDivElement, screenWidth: number, screenHeight: number) {
    this.container = container;
    if (container.hasChildNodes()) return;
    console.log('New Game');
    this.W = screenWidth;
    this.H = screenHeight;
    // $('#game').css({width: W, height: H, overflow: 'hidden'});
    this.ground = this.H - 30;
    this.buffer = this.W / 2;
    this.time = new Date().getTime();
    this.canvas.setAttribute('width', this.W.toString());
    this.canvas.setAttribute('height', this.H.toString());
    // container.appendChild(this.canvas);
    this.container.appendChild<HTMLCanvasElement>(this.canvas);

    if (this.isTouchDevice()) this.gamePad = new VirtualGamePad(this, 100, 100);

    // log.keydown = [];
    // log.keyup = [];
    // log.score = 0;
    // log.time = 0;

    this.board.init();
    this.world = new World(this, 0, 0, this.W, this.H);
    this.background = new Background(this, 0, 0, this.W, this.H);

    //this.item = new GameItem(50, 50, 50, 50);

    Object.assign(this.images, World.images());
    Object.assign(this.images, Background.images());
    Object.assign(this.images, King.images());
    Object.assign(this.images, Egg.images());
    Object.assign(this.images, Alien.images());
    Object.assign(this.images, VirtualGamePad.images());

    console.log('this.images', this.images);
    this.preload().then(
      async (value) => {
        this.images = {};
        for (const i in value) Object.assign(this.images, value[i]);
        console.log('All images are loaded!');
        this.loading = false;
        await this.world.init(this.chapters[0]);
        this.background.init();
        this.king.init();
        this.update();
      },
      (reason) => {
        console.log('images load error', reason);
      },
    );
  }

  isTouchDevice() {
    try {
      document.createEvent('TouchEvent');
      return true;
    } catch (e) {
      return false;
    }
  }

  preload() {
    const promises: Promise<{ [k: string]: HTMLImageElement }>[] = [];
    Object.entries(this.images).map(([key, item]) => {
      promises.push(
        new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve({ [key]: img });
          img.onerror = () => reject({ [key]: item });
          img.src = String(item);
        }),
      );
    });
    return Promise.all(promises);
  }

  update() {
    if (this.loading || !this.engine) return;
    if (this.gamePad) this.gamePad.update(this.input);

    this.engine.clearRect(0, 0, this.W, this.H);
    this.FRAME = (this.FRAME + 1) % this.FPS;
    const horizontal = this.input.getHorizontal();
    const vertical = this.input.getVertical();
    const fire = this.input.getFire();

    this.background.update(this.engine, this.FRAME, horizontal, vertical, fire);
    this.world.update(this.engine, this.FRAME, horizontal, vertical, fire);
    this.king.update(this.engine, this.FRAME, horizontal, vertical, fire);
    //this.item.update(this.engine, this.FRAME, horizontal, vertical, fire);
    if (this.gamePad) this.gamePad.render(this.engine);

    if (this.world.isEnd) {
      this.input.removeEventListener();
    }
  }
}
