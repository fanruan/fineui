import { Widget } from "../../core/widget";

export declare class DownListPopup extends Widget {
    static xtype: string;
    static EVENT_CHANGE: string;
    static EVENT_SON_VALUE_CHANGE: string;

    populate: (items: any) => void;
}