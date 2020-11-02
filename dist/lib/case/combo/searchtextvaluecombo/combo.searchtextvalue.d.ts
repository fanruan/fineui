import { _Widget } from "../../../core/widget";
export interface _SearchTextValueCombo extends _Widget {
    populate(items: any[]): void;
    setValue(v: any): void;
    getValue<T>(): T[];
}
export interface _SearchTextValueComboStatic {
    EVENT_CHANGE: string;
    EVENT_BEFORE_POPUPVIEW: string;
}
