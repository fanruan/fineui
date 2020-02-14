import { _Single } from "./single";
export interface _Text extends _Single {
    doRedMark(keyword: string): void;
    unRedMark(): void;
    doHighLight(): void;
    unHighLight(): void;
    setStyle(css: any): void;
    setText(v: string): void;
}
