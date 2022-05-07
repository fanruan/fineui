import { Widget, _Widget } from "../../core/widget";

export interface _AllValueMultiTextValueCombo extends _Widget {
    getValue<T>(): T[];

    populate(items: any): void;
}

export interface _AllValueMultiTextValueComboStatic {
    EVENT_CONFIRM: string;
}

export declare class AllValueMultiTextValueCombo extends Widget {
    static xtype: string;
    static EVENT_CONFIRM: string;

    getValue<T>(): T[];

    populate(items: any): void;
}
