import { Widget } from "../../core/widget";
import { Action } from "../../core/action/action";

export declare class Tab extends Widget {
    static xtype: string;

    static EVENT_CHANGE: string;

    setSelect(v: string | number, action?: Action, callback?: Function): void;

    removeTab(v: string | number): void;

    getSelect(): string | number;

    getSelectedTab<T>(): T;

    getTab<T>(v: string | number): T;

    populate(): void;
}
