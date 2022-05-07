import { Widget } from "../../core/widget";

export declare class NumberEditor extends Widget {
    static xtype: string;
    static EVENT_CONFIRM: string;
    static EVENT_CHANGE: string;

    focus (): void;

    isEditing(): void;

    setUpEnable(v: boolean): void;

    setDownEnable(v: boolean): void;

    getLastValidValue(): string;

    getLastChangedValue(): string;

    getValue(): string;

    setValue(v: string): void;
}
