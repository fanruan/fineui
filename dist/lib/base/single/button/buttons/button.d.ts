import { IconLabel, Label } from "../../../..";
import { BasicButton } from "../button.basic";
export declare class Button extends BasicButton {
    static xtype: string;
    static EVENT_CHANGE: string;
    props: {
        minWidth?: number;
        readonly?: boolean;
        iconCls?: string;
        level?: 'common' | 'success' | 'warning' | 'ignore';
        block?: boolean;
        clear?: boolean;
        ghost?: boolean;
        textAlign?: 'center' | 'left' | 'right';
        whiteSpace?: 'nowrap' | 'normal';
        textWidth?: number | null;
        textHeight?: number | null;
    } & BasicButton['props'];
    text: Label;
    icon?: IconLabel;
    doRedMark(...args: any[]): void;
    unRedMark(...args: any[]): void;
    doHighLight(...args: any[]): void;
    unHighLight(...args: any[]): void;
}
