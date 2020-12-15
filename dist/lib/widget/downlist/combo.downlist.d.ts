import { Widget, _Widget } from "../../core/widget";
export interface _DownListCombo extends _Widget {
    hideView: () => void;
    showView: (e?: any) => void;
    populate: (items?: any) => void;
}
export interface _DownListComboStatic {
    EVENT_CHANGE: string;
    EVENT_SON_VALUE_CHANGE: string;
    EVENT_BEFORE_POPUPVIEW: string;
}
export declare class DownListCombo extends Widget {
    static xtype: string;
    static EVENT_CHANGE: string;
    static EVENT_SON_VALUE_CHANGE: string;
    static EVENT_BEFORE_POPUPVIEW: string;
    hideView: () => void;
    showView: (e?: any) => void;
    populate: (items?: any) => void;
}
