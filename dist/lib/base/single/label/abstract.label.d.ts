import { _Single, Single } from "../single";
export interface _AbstractLabel extends _Single {
    doRedMark(...args: any[]): void;
    unRedMark(...args: any[]): void;
    doHighLight(...args: any[]): void;
    unHighLight(...args: any[]): void;
    setText(v: string): void;
    getText(): string;
    setStyle(css: any): void;
}
export declare class AbstractLabel extends Single {
    static xtype: string;
    doRedMark(...args: any[]): void;
    unRedMark(...args: any[]): void;
    doHighLight(...args: any[]): void;
    unHighLight(...args: any[]): void;
    setStyle(css: any): void;
}
