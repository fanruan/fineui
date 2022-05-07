import { Single } from "../../base/single/single";

export declare class SingleSelectInsertCombo extends Single {
    static xtype: string;
    static EVENT_FOCUS: string;
    static EVENT_BLUR: string;
    static EVENT_STOP: string;
    static EVENT_SEARCHING: string;
    static EVENT_CLICK_ITEM: string;
    static EVENT_CONFIRM: string;

    props: {
        text?: string,
        allowNoSelect?: boolean,
        itemsCreator?: Function,
        valueFormatter?: Function,
        allowEdit?: boolean,
        watermark?: string,
    } & Single['props']
}
