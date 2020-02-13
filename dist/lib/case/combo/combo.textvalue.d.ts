import { _Widget } from "../../core/widget";
export interface _TextValueCombo extends _Widget {
    getValue(): [];
    populate(items: any): void;
}
export interface _TextValueComboStatic {
    EVENT_CHANGE: string;
}
