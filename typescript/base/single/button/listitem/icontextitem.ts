import { BasicButton } from "../button.basic";

export declare class IconTextItem extends BasicButton {
    static xtype: string;
    static EVENT_CHANGE: string;

    props: {
        direction?: string;
        logic?: {
            dynamic: boolean;
        };
        iconWrapperWidth?: number;
        iconCls?: string;
        iconHeight?: number;
        iconWidth?: number;
        textHgap?: number;
        textVgap?: number;
        textLgap?: number;
        textRgap?: number;
        text?: string;
        keyword?: string;
    } & BasicButton['props']

    doRedMark(...args: any[]): void;

    unRedMark(...args: any[]): void;

    doHighLight(...args: any[]): void;

    unHighLight(...args: any[]): void;
}
