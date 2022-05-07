import { BasicButton } from "../button.basic";

export declare class BlankIconTextItem extends BasicButton {
    static xtype: string;
    static EVENT_CHANGE: string;

    props: {
        blankWidth?: number;
        iconHeight?: number | null;
        iconWidth?: number | null;
        textHgap?: number;
        textVgap?: number;
        textLgap?: number;
        textRgap?: number;
        text?: string;
        keyword?: string;
    } & BasicButton['props'];

    doClick(): void;

    setValue(): void;

    getValue(): string;

    doRedMark(...args: any[]): void;

    unRedMark(...args: any[]): void;

    doHighLight(...args: any[]): void;

    unHighLight(...args: any[]): void;
}
