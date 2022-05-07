import { Widget } from "../../../core/widget";

export declare class BubbleCombo extends Widget {
    static xtype: string;
    static EVENT_TRIGGER_CHANGE: string;
    static EVENT_CHANGE: string;
    static EVENT_EXPAND: string;
    static EVENT_COLLAPSE: string;
    static EVENT_AFTER_INIT: string;
    static EVENT_BEFORE_POPUPVIEW: string;
    static EVENT_AFTER_POPUPVIEW: string;
    static EVENT_BEFORE_HIDEVIEW: string;
    static EVENT_AFTER_HIDEVIEW: string;

    hideView(): void;

    showView(): void;

    isViewVisible(): boolean;

    adjustWidth(e?:MouseEvent): void;

    adjustHeight(e?: MouseEvent): void;
}
