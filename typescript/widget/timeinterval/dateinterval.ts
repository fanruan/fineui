import { Single } from "../../base/single/single";
import { DynamicDataComboValue } from "../dynamicdate/dynamicdate.combo";

export declare class DateInterval extends Single {
    static xtype: string;
    static EVENT_CHANGE: string;
    static EVENT_VALID: string;
    static EVENT_ERROR: string;

    getValue(): {
        start: DynamicDataComboValue;
        end: DynamicDataComboValue;
    };
}
