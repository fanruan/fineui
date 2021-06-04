import { BasicButton } from "../button.basic";

export declare class IconButton extends BasicButton {
    static xtype: string;
    static EVENT_CHANGE: string;

    props: {
        iconWidth?: number;
        iconHeight?: number;
    } & BasicButton['props']
}
