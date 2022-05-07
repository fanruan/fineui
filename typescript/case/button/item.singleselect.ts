import { BasicButton } from "../../base/single/button/button.basic";

export declare class SingleSelectItem extends BasicButton {
    static xtype: string;
    static EVENT_CHANGE: string;

    doRedMark(): void;

    unRedMark(): void;
}
