import { AbstractLabel, IconLabel, Label } from "../../../..";
import { BasicButton } from "../button.basic";

export declare class Button extends BasicButton {
    static xtype: string;

    static EVENT_CHANGE: string;

    props: {
        minWidth?: number;
        readonly?: boolean;
        iconCls?: string;
        level?: 'common' | 'success' | 'warning' |'ignore',
        block?: boolean; // 是否块状显示，即不显示边框，没有最小宽度的限制
        clear?: boolean; // 是否去掉边框和背景
        ghost?: boolean; // 是否幽灵显示, 即正常状态无背景
    } & AbstractLabel['props'] & IconLabel['props'] & BasicButton['props'];

    text: Label;
    icon?: IconLabel;

    doRedMark(...args: any[]): void;

    unRedMark(...args: any[]): void;

    doHighLight(...args: any[]): void;

    unHighLight(...args: any[]): void;
}
