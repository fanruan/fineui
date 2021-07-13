import { Pane } from "../../../base/pane";

export declare class TextValueCheckComboPopup extends Pane {
    static xtype: string;
    static EVENT_CHANGE: string;

    populate(items: any[]): void;
    getValue(): any;
    setValue(v: any): void;
}
