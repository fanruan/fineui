import { Single } from "../../base/single/single";
import { DynamicDataComboValue } from "../dynamicdate/dynamicdate.combo";

export declare class DateInterval extends Single {
    static xtype: string;
    static EVENT_CHANGE: string;
    static EVENT_VALID: string;
    static EVENT_ERROR: string;
    static EVENT_BEFORE_YEAR_MONTH_POPUPVIEW: string;

    props: {
        minDate?: string;
        maxDate?: string;
        supportDynamic?: boolean;
        watermark?: string;
    } & Single['props']

    getValue(): {
        start: DynamicDataComboValue;
        end: DynamicDataComboValue;
    };

    setMinDate(minDate: string): void;

    setMaxDate(minDate: string): void;
}
