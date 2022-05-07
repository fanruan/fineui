import { Single } from '../../base/single/single';

export declare class DynamicDateTimeCombo extends Single {
    static xtype: string;
    static EVENT_KEY_DOWN: string;
    static EVENT_CONFIRM: string;
    static EVENT_FOCUS: string;
    static EVENT_BLUR: string;
    static EVENT_CHANGE: string;
    static EVENT_VALID: string;
    static EVENT_ERROR: string;
    static EVENT_BEFORE_POPUPVIEW: string;
    static EVENT_BEFORE_YEAR_MONTH_POPUPVIEW: string;
    static Static: 1;
    static Dynamic: 2;
    props: {
        minDate?: string;
        maxDate?: string;
        format?: string;
        allowEdit?: boolean;
        supportDynamic?: boolean;
        attributes?: {
            tabIndex?: number;
        };
        watermark?: string;
    } & Single['props'];

    setMinDate(minDate: string): void;

    setMaxDate(minDate: string): void;

    getKey(): string;

    hidePopupView(): void;

    focus(): void;

    blur(): void;

    setWaterMark(v: string): void
}
