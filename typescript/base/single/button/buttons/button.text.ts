import { BasicButton } from "../button.basic";

export declare class TextButton extends BasicButton {
    static xtype: string;
    static EVENT_CHANGE: string;

    setStyle(style: any): void;

    doRedMark(...args: any[]): void;

    unRedMark(...args: any[]): void;

    doHighLight(...args: any[]): void;

    unHighLight(...args: any[]): void;
}
