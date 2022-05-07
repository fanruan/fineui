import { Widget } from "../../core/widget";

export declare class Loader extends Widget {
    static xtype: string;

    static EVENT_CHANGE: string;

    _prevLoad(): void;

    _nextLoad(): void;

    hasPrev(): boolean;

    hasNext(): boolean;

    prependItems<T>(items: T[]): void;

    addItems<T>(items: T[]): void;

    populate(...args: any[]): void;

    setNotSelectedValue(...args: any[]): void;

    getNotSelectedValue<T>(): T;

    getAllButtons<T>(): T[];

    getAllLeaves<T>(): T[];

    getSelectedButtons<T>(): T[];

    getNotSelectedButtons<T>(): T[];

    getIndexByValue(value: any): number;

    getNodeById(id: any): any;

    getNodeByValue(value: any): any;

    getValue<T>(): T[];
}
