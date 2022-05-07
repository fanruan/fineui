import { Trigger } from "../../base/single/trigger/trigger";

export declare class SelectTextTrigger extends Trigger {
    static xtype: string;

    props: {
        items: any[];
        text: string | Function;
    } & Trigger['props'];
}
