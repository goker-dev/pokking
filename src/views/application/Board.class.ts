function createSVGText() {
  return document.createElementNS('http://www.w3.org/2000/svg', 'svg:text');
}
export class Board {
  humans = createSVGText();
  journey = createSVGText();
  aliens = createSVGText();
  eggs = createSVGText();
  constructor() {
    this.init();
  }

  init() {
    const boardObject = document.getElementById('#board') as HTMLObjectElement;
    const svg = boardObject?.contentDocument;
    this.humans = (svg?.getElementById('humans') || createSVGText()) as SVGTextElement;
    this.journey = (svg?.getElementById('journey') || createSVGText()) as SVGTextElement;
    this.aliens = (svg?.getElementById('aliens') || createSVGText()) as SVGTextElement;
    this.eggs = (svg?.getElementById('eggs') || createSVGText()) as SVGTextElement;
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
