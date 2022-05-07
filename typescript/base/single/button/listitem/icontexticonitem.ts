import { BasicButton } from "../button.basic";

export declare class IconTextIconItem extends BasicButton {
    static xtype: string;
    static EVENT_CHANGE: string;

    props: {
        logic?: {
            dynamic: boolean;
        };
        iconCls1?: string;
        iconCls2?: string;
        iconHeight?: number;
        iconWidth?: number;
        textHgap?: number;
        textVgap?: number;
        textLgap?: number;
        textRgap?: number;
    } & BasicButton['props'];
}
