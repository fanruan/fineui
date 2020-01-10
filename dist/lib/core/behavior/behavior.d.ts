import { _OB } from "../ob";
export interface _Behavior extends _OB {
    doBehavior(items: any[]): void;
}
export interface _BehaviorFactory {
    createBehavior(key: string, options: any): _Behavior;
}
