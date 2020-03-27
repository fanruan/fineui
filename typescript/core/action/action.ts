import { OB } from "../ob";

export declare class Action extends OB {
    actionPerformed(src: any, tar: any, callback: Function): void;

    actionBack(tar: any, src: any, callback: Function): void;
}

export declare class ActionFactory {
    createAction(key: string, options: any): Action;
}
