import { IconButton } from "../../../base/single/button/buttons/button.icon";
import { Single } from "../../../base/single/single";

export declare class IconChangeButton extends Single {
    static xtype: string;
    static EVENT_CHANGE: string;

    props: {
        iconCls: string;
    } & IconButton['props']

    isSelected(): boolean;

    setSelected(v: boolean): void;

    setIcon(cls: string): void;
}
