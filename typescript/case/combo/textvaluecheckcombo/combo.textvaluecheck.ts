import { Widget } from "../../../core/widget";

export declare class TextValueCheckCombo extends Widget {
    static xtype: string;
    static EVENT_CHANGE: string;

    setTitle (v: string): void;

    setValue (v: any): void;

    setWarningTitle(v: string): void;

    getValue(): any;

    populate(items: any[]): string;
}
