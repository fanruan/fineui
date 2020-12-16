import { BasicButton } from "../../base/single/button/button.basic";
export declare class MultiSelectBar extends BasicButton {
    static xtype: string;
    static EVENT_CHANGE: string;
    setHalfSelected(v: boolean): void;
    isHalfSelected(): boolean;
    setValue<T>(selectedValues: T[]): void;
}
