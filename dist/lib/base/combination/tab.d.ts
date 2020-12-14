import { Widget, _Widget } from "../../core/widget";
export interface _Tab extends _Widget {
    setSelect(v: string | number): void;
    removeTab(v: string | number): void;
    getSelect(): string | number;
    getSelectedTab(): any;
    getTab(v: string | number): any;
    populate(): void;
}
export interface _TabStatic {
    EVENT_CHANGE: string;
}
export declare class Tab extends Widget {
    static xtype: string;
    static EVENT_CHANGE: string;
    setSelect(v: string | number): void;
    removeTab(v: string | number): void;
    getSelect(): string | number;
    getSelectedTab(): any;
    getTab(v: string | number): any;
    populate(): void;
}
