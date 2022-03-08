import { Single } from "../../base/single/single";
import { TreeValue } from "../../base/tree/ztree/treeview";
import { Widget } from "../../core/widget";

export declare class MultiTreeInsertCombo extends Single {
    static xtype: string;
    static EVENT_FOCUS: string;
    static EVENT_BLUR: string;
    static EVENT_STOP: string;
    static EVENT_CLICK_ITEM: string;
    static EVENT_SEARCHING: string;
    static EVENT_CONFIRM: string;
    static EVENT_BEFORE_POPUPVIEW: string;

    showView(): void;

    hideView(): void;

    setValue(v: TreeValue): void;

    getValue(): TreeValue;

    populate(): void;

    getSearcher(): Widget;

    focus(): void;

    blur(): void;

    setWaterMark(v: string): void;
}
