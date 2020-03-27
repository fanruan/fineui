import { Single } from "../../../base/single/single";

export declare class IconChangeButton extends Single {
    isSelected(): boolean;

    setSelected(v: boolean): void;

    setIcon(cls: string): void;

    static EVENT_CHANGE: string;
}
