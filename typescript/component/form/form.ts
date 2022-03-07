import { Widget } from "../../core/widget";

export declare class Form extends Widget {
    static xtype: string;
    static EVENT_CHANGE: string;

    isAllValid(): boolean;

    validateWithNoTip(): boolean[];

    validate(): boolean[];

    getValue<T>(): T[];
}