import { _OB, OB } from "../ob";
export interface _Behavior extends _OB {
    doBehavior(items: any[]): void;
}
export interface _BehaviorFactory {
    createBehavior(key: string, options: any): _Behavior;
}
export declare class Behavior extends OB {
    doBehavior(items: any[]): void;
}
export declare class BehaviorFactory {
    createBehavior(key: string, options: any): Behavior;
}
