import { PopupView } from "../../../base/layer/layer.popup";
import { Widget } from "../../../core/widget";

export declare class BubblePopupView extends PopupView {
    static xtype: string;
    static EVENT_CLICK_TOOLBAR_BUTTON: string;
}

export declare class BubblePopupBarView extends BubblePopupView {
    static xtype: string;
    static EVENT_CLICK_TOOLBAR_BUTTON: string;
}

export declare class TextBubblePopupBarView extends Widget {
    static xtype: string;
    static EVENT_CHANGE: string;

    populate(v: string): void;
}
