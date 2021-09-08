import { Single } from "../single";

export declare class AbstractLabel extends Single {
    static xtype: string;

    props: {
        textAlign?: "left" | "center" | "right";
        whiteSpace?: "nowrap" | "normal";
        textWidth?: number | null;
        textHeight?: number | null;
        highLight?: boolean;
        handler?: Function | null;
        text?: string;
    } & Single['props']

    doRedMark(...args: any[]): void;

    unRedMark(...args: any[]): void;

    doHighLight(...args: any[]): void;

    unHighLight(...args: any[]): void;

    setStyle(css: any): void;
}
