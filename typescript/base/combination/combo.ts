import { Widget, _Widget } from "../../core/widget";

export interface _Combo extends _Widget {
    populate(...args: any[]): void;

    _setEnable(v: boolean): void;

    isViewVisible(): boolean;

    showView(e?: Event): void;

    hideView(): void;

    getView(): any;

    getPopupPosition(): any;

    adjustHeight(e?: MouseEvent): void;

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

export declare class Combo extends Widget {
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

    populate(...args: any[]): void;

    _setEnable(v: boolean): void;

    isViewVisible(): boolean;

    showView(e?: Event): void;

    hideView(): void;

    getView(): any;

    getPopupPosition(): any;

    adjustHeight(e?: MouseEvent): void;

    toggle(): void;
}
