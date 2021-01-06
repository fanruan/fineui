export declare class Vector {
  x: number;
  y: number;
  constructor(x: number,y: number);
  cross(v: Vector): number;
  length(v: Vector): number;
}

export declare class Region {
  x: number;
  y: number;
  w: number;
  h: number;
  constructor(x: number,y: number,w: number,h: number);
  isIntersects(obj: { x: number,y: number,w: number,h: number }):boolean;
  isPointInside(x: number,y: number): boolean;
  getPosition(): number[];
}