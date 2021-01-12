import { Widget } from "../../core/widget";

export declare class AllCountPager extends Widget {
    static xtype: string;
    static EVENT_CHANGE: string;

    setAllPages(v: number): void;

    setValue(v: number): void;

    setVPage(v: number):void;

    setCount(v: number | string): void;

    getCurrentPage(): number;

    hasPrev(): boolean;

    hasNext(): boolean;

    setPagerVisible(v: boolean): void;

    populate(): void;
}