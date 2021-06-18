
import { Widget } from "../../core/widget";
import { AbstractListTreeValueChooser } from "./abstract.treevaluechooser.list";

export declare class ListTreeValueChooserInsertCombo extends AbstractListTreeValueChooser {
    static xtype: string;
    static EVENT_FOCUS: string;
    static EVENT_BLUR: string;
    static EVENT_STOP: string;
    static EVENT_CLICK_ITEM: string;
    static EVENT_SEARCHING: string;
    static EVENT_CONFIRM: string;
    static EVENT_BEFORE_POPUPVIEW: string;

    showView(): void;

    hideView(): void;

    setValue(v: any): void;

    getValue<T>(): T;

    populate<T>(items: T[]): void;

    getSearcher(): Widget;
}
