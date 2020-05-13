import { _Widget } from "../../core/widget";

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