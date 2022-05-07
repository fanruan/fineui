import { Widget } from "../../core/widget";

export declare class MultiLayerSelectTreeCombo extends Widget {
    static xtype: string;
    static EVENT_SEARCHING: string;
    static EVENT_BLUR: string;
    static EVENT_FOCUS: string;
    static EVENT_CHANGE: string;
    static EVENT_BEFORE_POPUPVIEW: string;

    setValue(v: string[] | string): void;

    getValue(): string[];

    populate<T>(items: T[]): void;

    getSearcher(): Widget;

    focus(): void;

    blur(): void;

    showView(): void;
}
