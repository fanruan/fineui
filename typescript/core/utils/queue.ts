export declare class Queue {
  capacity: number;
  array: any[];
  constructor(capacity: number);
  contains(v: any): boolean;
  indexOf(v: any): boolean;
  getElementByIndex(index: number): any;
  push(v: any): void;
  pop(): void;
  shift(): void;
  unshift(v: any): void;
  remove(v: any): void;
  splice(...args: any[]): void;
  slice(start?: number, end?: number): void;
  size(): number;
  each(fn: (i?: number, item?: any, array?: any[]) => any, scope: object): void
  toArray(): any[];
  fromArray(array: any[]): void
  clear(): void;  

}