import { BasicButton, _BasicButton } from "../button/button.basic";
export interface _Checkbox extends _BasicButton {
    _setEnable(enable: boolean): void;
}
export interface _CheckboxStatic {
    EVENT_CHANGE: string;
}
export declare class Checkbox extends BasicButton {
    static xtype: string;
    static EVENT_CHANGE: string;
    _setEnable(enable: boolean): void;
}
