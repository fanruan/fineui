import { _Single } from "../single";
export interface _AbstractLabel extends _Single {
    doRedMark(...args: any[]): void;
    unRedMark(...args: any[]): void;
    doHighLight(...args: any[]): void;
    unHighLight(...args: any[]): void;
    setText(v: string): void;
    getText(): string;
    setStyle(css: any): void;
}
