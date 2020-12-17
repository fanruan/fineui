import { Widget } from "../../core/widget";

export declare class MultiLayerSelectTreePopup extends Widget {
    static xtype: string;

    static EVENT_CHANGE: string;

    getValue<T>(): T;

    setValue(v: any): void;

    populate<T>(items: T[]): void;
}
