import { Widget } from "../../core/widget";

export declare class DynamicDateTimePane extends Widget {
    static xtype: string;
    static EVENT_CHANGE: string;
    static EVENT_BEFORE_YEAR_MONTH_POPUPVIEW: string;

    setMinDate(minDate: string): void;

    setMaxDate(minDate: string): void;
}
