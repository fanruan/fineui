import { _Widget } from "../../core/widget";

export interface _AllValueMultiTextValueCombo extends _Widget {
    getValue(): [];

    populate(items: any): void;
}

export interface _AllValueMultiTextValueComboStatic {
    EVENT_CONFIRM: string;
}
