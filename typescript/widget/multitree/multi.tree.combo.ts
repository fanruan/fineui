import { Single } from "../../base/single/single";
import { Widget } from "../../core/widget";

export declare class MultiTreeCombo extends Single {
    static xtype: string;
    static EVENT_FOCUS: string;
    static EVENT_BLUR: string;
    static EVENT_STOP: string;
    static EVENT_SEARCHING: string;
    static EVENT_CLICK_ITEM: string;
    static EVENT_CONFIRM: string;
    static EVENT_BEFORE_POPUPVIEW: string;

    showView(): void;
    hideView(): void;

    getSearcher(): Widget;

    focus(): void;

    blur(): void;
}
