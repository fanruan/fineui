import { Widget } from "../../core/widget";

export declare class DownListCombo extends Widget {
    static xtype: string;
    static EVENT_CHANGE: string;
    static EVENT_SON_VALUE_CHANGE: string;
    static EVENT_BEFORE_POPUPVIEW: string;
    
    hideView: () => void;

    showView: (e?: any) => void;

    populate: (items?: any) => void;
}
