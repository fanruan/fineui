export declare class PrefixIntervalTree {
  _size: number;
  _half: number;
  _heap: Int32Array;
  constructor(xs: any[]);
  set(index: number, value: any): void;
  get(index: number): any;
  getSize(): number;
  sumUntil(end: number):number;
  sumTo(inclusiveEnd: number): number;
  sum(begin: number, end: number):number;
  greatestLowerBound(t: number): number;
  greatestStrictLowerBound(t: number): number;
  leastUpperBound(t: number): number;
  leastStrictUpperBound(t: number): number;
  static uniform(size: number, initialValue: any): PrefixIntervalTree;
  static empty(size: number, initialValue: any): PrefixIntervalTree;

}