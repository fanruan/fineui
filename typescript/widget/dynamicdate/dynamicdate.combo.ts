import { Single } from '../../base/single/single';

export declare class DynamicDateCombo extends Single {
    static xtype: string;
    static Static: 1;
    static Dynamic: 2;

    static EVENT_KEY_DOWN: string;
    static EVENT_CONFIRM: string;
    static EVENT_FOCUS: string;
    static EVENT_BLUR: string;
    static EVENT_CHANGE: string;
    static EVENT_VALID: string;
    static EVENT_ERROR: string;
    static EVENT_BEFORE_POPUPVIEW: string;
    static EVENT_BEFORE_YEAR_MONTH_POPUPVIEW: string;

    setMinDate(minDate: string): void;

    setMaxDate(maxDate: string): void;

    getKey(): string;

    hidePopupView(): void;

    getValue(): DynamicDataComboValue;
}

export interface DynamicDataComboValue {
    type: number;
    value: {
        year: number;
        month: number;
        day: number;
    }
}
