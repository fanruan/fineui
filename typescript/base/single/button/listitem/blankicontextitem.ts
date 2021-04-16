import { BasicButton } from "../button.basic";

export declare class BlankIconTextItem extends BasicButton {
    static xtype: string;
    static EVENT_CHANGE: string;

    doClick(): void;

    setValue(): void;

    getValue(): string;

    doRedMark(...args: any[]): void;

    unRedMark(...args: any[]): void;

    doHighLight(...args: any[]): void;

    unHighLight(...args: any[]): void;
}
