import { Single } from "./single";

export declare class Text extends Single {
    static xtype: string;

    static addTextFormatter: (fn: (str: string) => string) => void;

    static formatText: (str: string) => string;

    props: {
        text?: string | ((context: any) => string);
        textAlign?: "left" | "center" | "right",
        whiteSpace?: "nowrap" | "normal",
        lineHeight?: null | number;
        py?: string;
        highLight?: boolean;
        maxWidth?: null | number;
    } & Single["props"];

    doRedMark(keyword: string): void;

    unRedMark(): void;

    doHighLight(): void;

    unHighLight(): void;

    setStyle(css: any): void;
}
