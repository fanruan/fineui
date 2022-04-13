import { Widget } from "../../core/widget";

export declare class Collapse extends Widget {
    static xtype: string;
    static EVENT_EXPAND: string;

    getValue(): string[];

    setValue(v: string[]): void;
}
