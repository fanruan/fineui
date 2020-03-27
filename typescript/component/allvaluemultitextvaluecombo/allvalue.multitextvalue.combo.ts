import { Widget } from "../../core/widget";

export declare class AllValueMultiTextValueCombo extends Widget {
    getValue<T>(): T[];

    populate(items: any): void;

    static EVENT_CONFIRM: string;
}
