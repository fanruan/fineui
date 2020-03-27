import { Widget } from "../../core/widget";

export declare class Tab extends Widget {
    setSelect(v: string | number): void;

    removeTab(v: string | number): void;

    getSelect(): string | number;

    getSelectedTab(): any;

    getTab(v: string | number): any;

    populate(): void;

    static EVENT_CHANGE: string;
}
