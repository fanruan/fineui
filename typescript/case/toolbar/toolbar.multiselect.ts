import { BasicButton } from "../../base/single/button/button.basic";

export declare class MultiSelectBar extends BasicButton {
    static xtype: string;

    static EVENT_CHANGE: string;
    
    props: {
        text: string;
        isAllCheckedBySelectedValue: (values: any[]) => boolean;
        disableSelected: boolean;
        isHalfCheckedBySelectedValue: (values: any[]) => boolean;
        halfSelected: boolean;
        iconWrapperWidth: number;
        iconWidth: number;
        iconHeight: number;
    } & BasicButton['props'];

    setHalfSelected(v: boolean): void;

    isHalfSelected(): boolean;

    setValue<T>(selectedValues: T[]): void;
}
