import { Single } from "./single";

export declare class Text extends Single {
    static xtype: string;

    props: {
        text?: string;
        textAlign?: "left" | "center" | "right",
        whiteSpace?: "nowrap" | "normal",
        lineHeight?: null | number;
        py?: string;
        highLight?: boolean;
        maxWidth?: null | number;
    } & Single['props'];

    doRedMark(keyword: string): void;

    unRedMark(): void;

    doHighLight(): void;

    unHighLight(): void;

    setStyle(css: any): void;
}
