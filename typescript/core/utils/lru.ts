export declare class LRU {
  size: number;
  limit: number;
  head: object;
  tail: object;
  _keymap: object;

  constructor(limit?: number);

  put(key: any, value: any):void
  shift(): object;
  get(key: any, returnEntry?: boolean): any;
  has(key: any): boolean
}