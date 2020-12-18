import { BasicButton, _BasicButton } from "../button.basic";

export interface _IconTextItem extends _BasicButton {
    doRedMark(...args: any[]): void;

    unRedMark(...args: any[]): void;

    doHighLight(...args: any[]): void;

    unHighLight(...args: any[]): void;
}

export interface _IconTextItemStatic {
    EVENT_CHANGE: string;
}

export declare class IconTextItem extends BasicButton {
    static xtype: string;
    static EVENT_CHANGE: string;

    doRedMark(...args: any[]): void;

    unRedMark(...args: any[]): void;

    doHighLight(...args: any[]): void;

    unHighLight(...args: any[]): void;
}
