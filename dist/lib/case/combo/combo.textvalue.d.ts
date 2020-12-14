import { _Widget, Widget } from "../../core/widget";
export interface _TextValueCombo extends _Widget {
    populate(items: any): void;
}
export interface _TextValueComboStatic {
    EVENT_CHANGE: string;
}
export declare class TextValueCombo extends Widget {
    static xtype: string;
    static EVENT_CHANGE: string;
    populate(items: any): void;
}
