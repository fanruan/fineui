import { Single } from "../../../base/single/single";

export declare class IconChangeButton extends Single {
    static xtype: string;
    static EVENT_CHANGE: string;

    isSelected(): boolean;

    setSelected(v: boolean): void;

    setIcon(cls: string): void;
}
