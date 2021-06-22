import { Widget } from "../../core/widget";
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
    props: {
        trigger: 'click' | 'hover' | 'click-hover' | '';
        toggle: boolean;
        direction: 'top' | 'bottom' | 'left' | 'right' | 'top,left' | 'top,right' | 'bottom,left' | 'bottom,right' | 'right,innerRight' | 'right,innerLeft' | 'innerRight' | 'innerLeft';
        logic: {
            dynamic: boolean;
        };
        container: any;
        isDefaultInit: boolean;
        destroyWhenHide: boolean;
        hideWhenAnotherComboOpen: boolean;
        isNeedAdjustHeight: boolean;
        isNeedAdjustWidth: boolean;
        stopEvent: boolean;
        stopPropagation: boolean;
        adjustLength: number;
        adjustXOffset: number;
        adjustYOffset: number;
        hideChecker: Function;
        offsetStyle: 'left' | 'right' | 'center';
        el: any;
        popup: any;
        comboClass: string;
        hoverClass: string;
        belowMouse: boolean;
    };
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
