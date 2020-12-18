import { _OB, OB } from "../ob";

export interface _Action extends _OB {
    actionPerformed(src: any, tar: any, callback: Function): void;

    actionBack(tar: any, src: any, callback: Function): void;
}

export interface _ActionFactory {
    createAction(key: string, options: any): _Action;
}

export declare class Action extends OB {
    actionPerformed(src: any, tar: any, callback: Function): void;

    actionBack(tar: any, src: any, callback: Function): void;
}

export declare class ActionFactory {
    createAction(key: string, options: any): Action;
}
