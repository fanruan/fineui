import { BasicButton } from "../../base/single/button/button.basic";

export declare class MultiSelectBar extends BasicButton {
    static xtype: string;
    
    static EVENT_CHANGE: string;
    
    props: {
        text: string;
        isAllCheckedBySelectedValue: Function;
        disableSelected: boolean;
        isHalfCheckedBySelectedValue: Function;
        halfSelected: boolean;
        iconWrapperWidth: number;
        iconWidth: number;
        iconHeight: number;
    } & BasicButton['props'];

    setHalfSelected(v: boolean): void;

    isHalfSelected(): boolean;

    setValue<T>(selectedValues: T[]): void;
}
