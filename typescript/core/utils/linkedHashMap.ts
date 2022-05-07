export declare class LinkedHashMap {
  array: any[];
  map: object;
  has(key: any): boolean;
  add(key: any,value: any): void;
  remove(key: any): void;
  size(): number;
  each(fn: (key?: any, value?: any, i?: number, array?: any[], map?: object) => any): void;
  get(key: any): any;
  toArray(): any[];
}