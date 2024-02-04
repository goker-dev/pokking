export type Update = {
  id?: number;
  engine: CanvasRenderingContext2D;
  frame: number;
  horizontal: number;
  vertical: number;
  fire: boolean;
};

export type Chapter = {
  name: string;
  journey: number;
  time: number;
  humans: number;
  eggs: [{ location: number }];
  aliens: [{ location: number; ammo: number }];
};
