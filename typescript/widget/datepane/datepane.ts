import { Widget } from "../../core/widget";

export declare class DynamicDatePane extends Widget {
    static xtype: string;
    static EVENT_CHANGE: string;
    static EVENT_BEFORE_YEAR_MONTH_POPUPVIEW: string;
    static Static: 1;
    static Dynamic: 2;

    setMinDate(minDate: string): void;

    setMaxDate(minDate: string): void;
}
