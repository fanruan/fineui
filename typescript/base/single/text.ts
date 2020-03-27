import { Single } from "./single";

export declare class Text extends Single {
    doRedMark(keyword: string): void;

    unRedMark(): void;

    doHighLight(): void;

    unHighLight(): void;

    setStyle(css: any): void;

    setText(v: string): void;
}
