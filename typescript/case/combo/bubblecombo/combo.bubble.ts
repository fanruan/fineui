import { Widget, _Widget } from "../../../core/widget";

export interface _BubbleCombo extends _Widget {
    hideView(): void;

    showView(): void;

    isViewVisible(): boolean;
}

export interface _BubbleComboStatic {
    EVENT_TRIGGER_CHANGE: string;
    EVENT_CHANGE: string;
    EVENT_EXPAND: string;
    EVENT_COLLAPSE: string;
    EVENT_AFTER_INIT: string;
    EVENT_BEFORE_POPUPVIEW: string;
    EVENT_AFTER_POPUPVIEW: string;
    EVENT_BEFORE_HIDEVIEW: string;
    EVENT_AFTER_HIDEVIEW: string;
}

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
}
