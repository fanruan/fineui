import { BasicButton } from "../button.basic";

export declare class IconTextItem extends BasicButton {
    static xtype: string;
    static EVENT_CHANGE: string;

    doRedMark(...args: any[]): void;

    unRedMark(...args: any[]): void;

    doHighLight(...args: any[]): void;

    unHighLight(...args: any[]): void;
}
