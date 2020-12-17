import { Pane } from "../../base/pane";

export declare class MultiTreePopup extends Pane {
    static xtype: string;
    static EVENT_CHANGE: string;
    static EVENT_CLICK_CONFIRM: string;
    static EVENT_CLICK_CLEAR: string;
    static EVENT_AFTERINIT: string;
    
    hasChecked(): boolean;

    resetHeight(h: number): void;

    resetWidth(w: number): void;
}
