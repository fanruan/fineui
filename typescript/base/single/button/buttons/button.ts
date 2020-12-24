import { IconLabel, Label } from "../../../..";
import { BasicButton } from "../button.basic";

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
