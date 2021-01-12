import { Widget } from "../../core/widget";

export declare class Searcher extends Widget {
    static xtype: string;
    static EVENT_CHANGE: string;
    static EVENT_START: string;
    static EVENT_STOP: string;
    static EVENT_PAUSE: string;
    static EVENT_SEARCHING: string;
    static EVENT_AFTER_INIT: string;

    setAdapter(adapter: any): void;

    doSearch(): void;

    stopSearch(): void;

    isSearching(): boolean;

    isViewVisible(): boolean;

    getView<T>(): T;

    hasMatched(): boolean;

    adjustHeight(): void;

    adjustView(): void;

    setValue(v: any): void;

    getKeyword(): string;

    getKeywords(): string[];

    getValue<T>(): T;

    populate(...args: any[]): void;
}
