import { Widget } from "../../core/widget";

export declare class Switcher extends Widget {
    static xtype: string;
    static EVENT_EXPAND: string;
    static EVENT_COLLAPSE: string;
    static EVENT_TRIGGER_CHANGE: string;
    static EVENT_CHANGE: string;
    static EVENT_AFTER_INIT: string;
    static EVENT_BEFORE_POPUPVIEW: string;
    static EVENT_AFTER_POPUPVIEW: string;
    static EVENT_BEFORE_HIDEVIEW: string;
    static EVENT_AFTER_HIDEVIEW: string;

    populate(...args: any[]): void;

    setAdapter(adapter: any): void;

    isViewVisible(): boolean;

    isExpanded(): boolean;

    showView(): void;

    hideView(): void;

    getView<T>(): T;

    adjustView(): void;

    getAllLeaves<T>(): T[];

    getNodeById<T>(id: string): T | undefined;

    getNodeByValue<T>(value: any): T | undefined;
}
