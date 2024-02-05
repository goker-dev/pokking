function createSpan() {
  return document.createElement('span');
}
export class Board {
  humans = createSpan();
  journey = createSpan();
  aliens = createSpan();
  eggs = createSpan();
  constructor() {
    this.init();
  }

  init() {
    // const boardObject = document.getElementById('#board') as HTMLObjectElement;
    // const svg = boardObject?.contentDocument;
    this.humans = (document?.getElementById('humans') || createSpan()) as HTMLSpanElement;
    this.journey = (document?.getElementById('journey') || createSpan()) as HTMLSpanElement;
    this.aliens = (document?.getElementById('aliens') || createSpan()) as HTMLSpanElement;
    this.eggs = (document?.getElementById('eggs') || createSpan()) as HTMLSpanElement;
    this.humans.innerHTML = '0';
    this.journey.innerHTML = '0';
    this.aliens.innerHTML = '0';
    this.eggs.innerHTML = '0';
  }
  update({
    humans,
    journey,
    aliens,
    eggs,
  }: {
    humans?: number;
    journey?: number;
    aliens?: number;
    eggs?: number;
  }) {
    if (humans) this.humans.innerHTML = String(humans);
    if (journey) this.journey.innerHTML = String(journey);
    if (aliens) this.aliens.innerHTML = String(aliens);
    if (eggs) this.eggs.innerHTML = String(eggs);
  }
}
