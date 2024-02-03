export class Input {
  log: {
    [k in 'keydown' | 'keyup']: {
      code: string;
      key: boolean;
      timestamp: number;
    }[];
  } = { keydown: [], keyup: [] };
  keys: { [k: string]: boolean } = {};
  keyDownBound = (e: KeyboardEvent) => this.keyDown(e);
  keyUpBound = (e: KeyboardEvent) => this.keyUp(e);
  constructor() {
    this.keys = {};
    this.keyDownBound = (e) => this.keyDown(e);
    this.keyUpBound = (e) => this.keyUp(e);
    this.addEventListener();
  }

  addEventListener() {
    document.addEventListener('keydown', this.keyDownBound, false);
    document.addEventListener('keyup', this.keyUpBound, false);
  }

  removeEventListener() {
    for (const i in this.keys) this.keys[i] = false;
    document.removeEventListener('keydown', this.keyDownBound);
    document.removeEventListener('keyup', this.keyUpBound);
  }

  keyDown(e: KeyboardEvent) {
    if (!this.keys[e.code]) {
      this.log.keydown.push({
        code: e.code,
        key: this.keys[e.code],
        timestamp: new Date().getTime(),
      });
    }
    this.keys[e.code] = true;
  }

  keyUp(e: KeyboardEvent) {
    if (this.keys[e.code]) {
      this.log.keyup.push({
        code: e.code,
        key: this.keys[e.code],
        timestamp: new Date().getTime(),
      });
    }
    this.keys[e.code] = false;
  }

  getHorizontal() {
    const r = this.keys['ArrowRight'];
    const l = this.keys['ArrowLeft'];
    return r && l ? 0 : r ? 1 : l ? -1 : 0;
  }

  getVertical() {
    const u = this.keys['ArrowUp'];
    const d = this.keys['ArrowDown'];
    return u && d ? 0 : d ? 1 : u ? -1 : 0;
  }

  getFire() {
    return this.keys['Space'];
  }
}
