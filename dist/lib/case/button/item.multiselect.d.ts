import { BasicButton } from "../../base/single/button/button.basic";
export declare class MultiSelectItem extends BasicButton {
    static xtype: string;
    static EVENT_CHANGE: string;
    doClick(...args: any[]): void;
    doRedMark(...args: any[]): void;
    unRedMark(...args: any[]): void;
    setSelected(v: boolean): void;
}
