import { IconLabel, Label } from "../../../..";
import { BasicButton, _BasicButton } from "../button.basic";

export interface _Button extends _BasicButton {
    doRedMark(...args: any[]): void;

    unRedMark(...args: any[]): void;

    doHighLight(...args: any[]): void;

    unHighLight(...args: any[]): void;
}

export interface _ButtonStatic {
    EVENT_CHANGE: string;
}

export declare class Button extends BasicButton {
    static xtype: string;
    
    static EVENT_CHANGE: string;

    text: Label;
    icon?: IconLabel;
    
    doRedMark(...args: any[]): void;

    unRedMark(...args: any[]): void;

    doHighLight(...args: any[]): void;

    unHighLight(...args: any[]): void;
}
