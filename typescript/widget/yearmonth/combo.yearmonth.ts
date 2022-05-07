import { Single } from "../../base/single/single";

export declare class DynamicYearMonthCombo extends Single {
    static xtype: string;
    static EVENT_ERROR: string;
    static EVENT_VALID: string;
    static EVENT_FOCUS: string;
    static EVENT_CONFIRM: string;
    static EVENT_BEFORE_POPUPVIEW: string;

    hideView(): void;

    getKey(): string;

    setMinDate(minDate: string): void;

    setMaxDate(maxDate: string): void;
}
