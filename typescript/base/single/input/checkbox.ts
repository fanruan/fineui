import { BasicButton } from "../button/button.basic";

export declare class Checkbox extends BasicButton {
    static xtype: string;
    static EVENT_CHANGE: string;

    _setEnable(enable: boolean): void;
}
