import { _OB } from "../ob";
export interface _Action extends _OB {
    actionPerformed(src: any, tar: any, callback: Function): void;
    actionBack(tar: any, src: any, callback: Function): void;
}
export interface _ActionFactory {
    createAction(key: string, options: any): _Action;
}
