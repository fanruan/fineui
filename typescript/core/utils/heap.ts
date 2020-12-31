export declare class Heap<T> {
  _items: T[];
  _size: number;
  _comparator: (a: T, b: T) => boolean;

  constructor(items: T[], comparator?: (a: T, b: T) => boolean);

  empty(): boolean;
  pop(): T;
  push(item: T): void;
  size(): number;
  peek(): T;
}