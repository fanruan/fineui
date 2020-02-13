import { _Widget } from "../../../core/widget";
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
