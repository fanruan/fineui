import { Widget } from "../../core/widget";

export declare class TextValueDownListCombo extends Widget {
    static xtype: string;
    static EVENT_CHANGE: string;

    getValue<T>(): [T];
}
