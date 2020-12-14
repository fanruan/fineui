import { Single, _Single } from "../../../base/single/single";

export interface _IconChangeButton extends _Single {
    isSelected(): boolean;

    setSelected(v: boolean): void;

    setIcon(cls: string): void;
}

export interface _IconChangeButtonStatic {
    EVENT_CHANGE: string;
}

export declare class IconChangeButton extends Single {
    isSelected(): boolean;

    setSelected(v: boolean): void;

    setIcon(cls: string): void;
}
