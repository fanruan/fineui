import { OB } from "../ob";

export declare class Behavior extends OB {
    doBehavior(items: any[]): void;
}

export declare class BehaviorFactory {
    createBehavior(key: string, options: any): Behavior;
}
