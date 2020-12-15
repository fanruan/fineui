import { Single } from "../single";

export declare class Html extends Single {
    doHighLight(): void;

    unHighLight(): void;

    setValue(v: string): void;

    setStyle(css: {[key: string]: string | number}): void;

    setText(v: string): void;
}
