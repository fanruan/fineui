import { _BasicButton } from "../button/button.basic";
export interface _Checkbox extends _BasicButton {
    _setEnable(enable: boolean): void;
}
export interface _CheckboxStatic {
    EVENT_CHANGE: string;
}
