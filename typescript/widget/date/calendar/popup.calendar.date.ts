import { Widget } from "../../../core/widget";

export declare class DateCalendarPopup extends Widget {
    static xtype: string;
    static EVENT_CHANGE: string;
    static EVENT_BEFORE_YEAR_MONTH_POPUPVIEW: string;

    setMinDate(v: string): void;
    setMaxDate(v: string): void;
    setValue(v: {
        year: number;
        month: number;
        day: number;
    }): void;
    getValue(): {
        year: number;
        month: number;
        day: number;
    }
}
