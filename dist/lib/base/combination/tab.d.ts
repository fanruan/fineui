import { Widget } from "../../core/widget";
export declare class Tab extends Widget {
    static xtype: string;
    static EVENT_CHANGE: string;
    setSelect(v: string | number): void;
    removeTab(v: string | number): void;
    getSelect(): string | number;
    getSelectedTab<T>(): T;
    getTab<T>(v: string | number): T;
    populate(): void;
}
