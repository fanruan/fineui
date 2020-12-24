import { Widget } from '../../core/widget';

export declare class DynamicYearMonthPopup extends Widget {
    static xtype: string;
    static BUTTON_CLEAR_EVENT_CHANGE: string;
    static BUTTON_lABEL_EVENT_CHANGE: string;
    static BUTTON_OK_EVENT_CHANGE: string;
    static EVENT_CHANGE: string;

    setMinDate(minDate?: string): void;

    setMaxDate(maxDate?: string): void;
}
