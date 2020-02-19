import { _BasicButton } from "../../base/single/button/button.basic";
export interface _MultiSelectItem extends _BasicButton {
    doClick(...args: any[]): void;
    doRedMark(...args: any[]): void;
    unRedMark(...args: any[]): void;
    setSelected(v: boolean): void;
}
export interface _MultiSelectItemStatic {
    EVENT_CHANGE: string;
}
