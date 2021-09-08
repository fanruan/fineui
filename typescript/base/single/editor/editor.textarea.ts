import { Single } from "../single";

export declare class TextAreaEditor extends Single {
    static xtype: string;
    static EVENT_CHANGE: string;
    static EVENT_FOCUS: string;
    static EVENT_BLUR: string;
    static EVENT_CONFIRM: string;
    static EVENT_EMPTY: string;
    static EVENT_KEY_DOWN: string;

    props: {
        value?: string;
        errorText?: string | ((v: string) => string)
        adjustYOffset?: number;
        adjustXOffset?: number;
        offsetStyle?: string;
        validationChecker?: Function;
        scrolly?: boolean;
        style?: any;
        watermark?: string;
    } & Single['props'];

    focus(): void;

    blur(): void;

    setStyle(style: any): void;

    getStyle(): any;

    setWatermark(v: string): void;
}
