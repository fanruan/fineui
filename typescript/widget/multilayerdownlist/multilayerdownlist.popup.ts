import { Widget } from "../../core/widget";

export declare class MultiLayerDownListPopup extends Widget {
    static xtype: string;

    static EVENT_CHANGE: string;
    static EVENT_SON_VALUE_CHANGE: string;

    props: {
        items: any[];
        chooseType: number;
        value: any;
    }

    getValue<T>(): T;

    setValue(v: any): void;

    populate<T>(items: T[]): void;
}
