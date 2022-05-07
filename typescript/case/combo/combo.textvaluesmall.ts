import { Widget } from "../../core/widget";

export declare class SmallTextValueCombo extends Widget {
    static xtype: string;

    static EVENT_CHANGE: string;

    populate(items: any): void;

    setValue(v: string): void;

    getValue(): string;
}
