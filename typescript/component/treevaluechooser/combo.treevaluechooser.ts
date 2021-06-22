import { Widget } from "../../core/widget";
import { AbstractTreeValueChooser } from "./abstract.treevaluechooser";

export declare class TreeValueChooserCombo extends AbstractTreeValueChooser {
    static xtype: string;
    static EVENT_BEFORE_POPUPVIEW: string;
    static EVENT_CONFIRM: string;
    static EVENT_FOCUS: string;
    static EVENT_BLUR: string;
    static EVENT_STOP: string;
    static EVENT_CLICK_ITEM: string;
    static EVENT_SEARCHING: string;

    showView(): void;

    hideView(): void;

    setValue(v: any): void;

    getValue<T>(): T;

    getAllValue<T>(): T;

    populate<T>(items: T[]): void;

    getSearcher(): Widget;
}
