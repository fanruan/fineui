import { Widget } from "../../core/widget";

export declare class DynamicYearQuarterCombo extends Widget {
    static xtype: string;
    static EVENT_CONFIRM: string;
    static EVENT_BEFORE_POPUPVIEW: string;

    setMinDate(minDate: string): void;

    setMaxDate(maxDate: string): void;
}
