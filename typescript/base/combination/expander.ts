import { Widget } from "../../core/widget";

export declare class Expander extends Widget {
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

    populate(items?: any, ...args: any[]): void;

    setValue(v: string): void;

    getValue(): string;

    isViewVisible(): boolean;

    isExpanded(): boolean;

    showView(): void;

    hideView(): void;

    getView<T>(): T;

    getAllLeaves<T>(): T[];

    getNodeById<T>(id: string): T;

    getNodeByValue<T>(v: string): T;

    destroy(): void;

}
