import { Single } from "../single";

export declare class TextAreaEditor extends Single {
    static xtype: string;
    static EVENT_CHANGE: string;
    static EVENT_FOCUS: string;
    static EVENT_BLUR: string;

    focus(): void;

    blur(): void;

    setStyle(style: any): void;

    getStyle(): any;

    setWatermark(v: string): void;
}
