import { Widget } from "../../../core/widget";

export declare class SearchTextValueCombo extends Widget {
    static xtype: string;
    static EVENT_CHANGE: string;
    static EVENT_BEFORE_POPUPVIEW: string;

    populate(items: any[]): void;

    setValue(v: any): void;

    getValue<T>(): T[];
}
