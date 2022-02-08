import { Single } from "../../base/single/single";

export declare class TimeCombo extends Single {
    static xtype: string;
    static EVENT_KEY_DOWN: string;
    static EVENT_CONFIRM: string;
    static EVENT_CHANGE: string;
    static EVENT_VALID: string;
    static EVENT_ERROR: string;
    static EVENT_BEFORE_POPUPVIEW: string;

    hidePopupView(): void;

    focus(): void;

    blur(): void;

    setWaterMark(v: string): void;
}
