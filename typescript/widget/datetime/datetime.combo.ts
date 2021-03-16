import { Single } from '../../base/single/single';

export declare class DateTimeCombo extends Single {
    static xtype: string;

    static EVENT_CANCEL: string;
    static EVENT_CONFIRM: string;
    static EVENT_CHANGE: string;
    static EVENT_BEFORE_POPUPVIEW: string;

    hidePopupView: () => void;
}
