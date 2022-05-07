import { Widget } from "../../core/widget";

export declare class Pager extends Widget {
    static xtype: string;

    static EVENT_CHANGE: string;

    static EVENT_AFTER_POPULATE: string;

    getCurrentPage(): number;

    setValue(v: number): void;

    hasPrev(): boolean;

    hasNext(): boolean;

    setAllPages(v: number): void;

    populate(): void;
}
