import { Single } from "../single";

export declare class Html extends Single {
    static xtype: string;

    props: {
        text?: string;
        textAlign?: "left" | "center" | "right",
        whiteSpace?: "nowrap" | "normal",
        lineHeight?: null | number;
        highLight?: boolean;
    } & Single['props'];

    doHighLight(): void;

    unHighLight(): void;

    setValue(v: string): void;

    setStyle(css: {[key: string]: string | number}): void;

    setText(v: string): void;
}
