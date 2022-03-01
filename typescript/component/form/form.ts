import { Widget } from "../../core/widget";

export declare class Form extends Widget {
    static xtype: string;
    static EVENT_VALID: string;
    static EVENT_ERROR: string;

    isAllValid(): boolean;

    validateWithNoTip(): boolean[];

    validate(): boolean[];

    getValue<T>(): T[];
}