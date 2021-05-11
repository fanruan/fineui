import { Single } from '../../base/single/single';

export declare class YearMonthInterval extends Single {
    static xtype: string;
    static EVENT_VALID: string;
    static EVENT_ERROR: string;
    static EVENT_CHANGE: string;
    static EVENT_BEFORE_POPUPVIEW: string;

    getValue(): {
        start: number;
        end: number;
    };

    setMinDate(minDate: string): void;

    setMaxDate(maxDate: string): void;
}
