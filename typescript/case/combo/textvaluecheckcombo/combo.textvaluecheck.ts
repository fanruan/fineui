import { Widget } from "../../../core/widget";

export declare class TextValueCheckCombo extends Widget {
    static xtype: string;
    static EVENT_CHANGE: string;

    setTitle (v: string): void;

    setValue (v: string | number): void;

    setWarningTitle(v: string): void;

    getValue(): void;

    populate(items: any[]): string;
}
