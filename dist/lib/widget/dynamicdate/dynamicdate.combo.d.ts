import { Single } from '../../base/single/single';
export declare class DynamicDateCombo extends Single {
    static xtype: string;
    static Dynamic: number;
    static Static: number;
    static EVENT_KEY_DOWN: string;
    static EVENT_CONFIRM: string;
    static EVENT_FOCUS: string;
    static EVENT_BLUR: string;
    static EVENT_CHANGE: string;
    static EVENT_VALID: string;
    static EVENT_ERROR: string;
    static EVENT_BEFORE_POPUPVIEW: string;
    setMinDate(minDate: string): void;
    setMaxDate(maxDate: string): void;
    getKey(): string;
    hidePopupView(): void;
}
