import { Widget } from "../../core/widget";

export declare class ButtonGroup extends Widget {
    prependItems<T>(items: T[]): void;

    addItems<T>(items: T[]): void;

    removeItemAt(indexes: any): void;

    removeItems(values: any): void;

    populate(items?: any): void;

    setNotSelectedValue(v: any): void;

    getNotSelectedValue<T>(): T[];

    setEnabledValue(v: any): void;

    getAllButtons<T>(): T[];

    getAllLeaves<T>(): T[];

    getSelectedButtons<T>(): T[];

    getNotSelectedButtons<T>(): T[];

    getIndexByValue(value: any): number;

    getNodeById(id: any): any;

    getNodeByValue(value: any): any;

    getValue<T>(): T[];

    static CHOOSE_TYPE_SINGLE: number;
    static CHOOSE_TYPE_MULTI: number;
    static CHOOSE_TYPE_ALL: number;
    static CHOOSE_TYPE_NONE: number;
    static CHOOSE_TYPE_DEFAULT: number;
    static EVENT_CHANGE: string;
}
