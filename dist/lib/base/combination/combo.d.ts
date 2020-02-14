import { _Widget } from "../../core/widget";
export interface _Combo extends _Widget {
    populate(items: any): void;
    _setEnable(v: boolean): void;
    isViewVisible(): boolean;
    showView(e?: any): void;
    hideView(): void;
    getView(): any;
    getPopupPosition(): any;
    toggle(): void;
}
export interface _ComboStatic {
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
