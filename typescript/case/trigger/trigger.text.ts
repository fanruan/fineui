import { Trigger } from "../../base/single/trigger/trigger";

export declare class TextTrigger extends Trigger {
    static xtype: string;

    setTextCls(cls: string): void;

    setText(text: string): void;

    setTipType(v: string): void;
}