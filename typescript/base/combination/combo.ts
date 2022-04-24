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
    static closeAll: Function;

    props: {
        trigger?: 'click' | 'hover' | 'click-hover' | '';
        toggle?: boolean;
        direction?: 'top' | 'bottom' | 'left' | 'right' | 'top,left' | 'top,right' | 'bottom,left' | 'bottom,right' | 'right,innerRight' | 'right,innerLeft' | 'innerRight' | 'innerLeft';
        logic?: {
            dynamic: boolean;
        },
        container?: any; // popupview放置的容器，默认为this.element
        isDefaultInit?: boolean;
        destroyWhenHide?: boolean;
        hideWhenBlur?: boolean;
        hideWhenAnotherComboOpen?: boolean;
        isNeedAdjustHeight?: boolean; // 是否需要高度调整
        isNeedAdjustWidth?: boolean;
        stopEvent?: boolean;
        stopPropagation?: boolean;
        adjustLength?: number; // 调整的距离
        adjustXOffset?: number;
        adjustYOffset?: number;
        hideChecker?: Function;
        offsetStyle?: 'left' | 'right' | 'center';
        value?:any;
        el?: any;
        popup?: any;
        comboClass?: string;
        hoverClass?: string;
        belowMouse?: boolean;
    }
    resetListHeight(h: number): void;

    resetListWidth(w: number): void;

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
