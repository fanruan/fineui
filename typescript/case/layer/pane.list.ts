import { Pane } from "../../base/pane";

export declare class ListPane extends Pane {
    static xtype: string;

    static EVENT_CHANGE: string;

    hasPrev(): boolean;

    hasNext(): boolean;

    prependItems<T>(items: T[]): void

    addItems<T>(items: T[]): void;

    removeItemAt(indexes?: number | number[]): void;

    populate<T>(items?: T[]): void;

    setNotSelectedValue(v: any): void;

    getNotSelectedValue<T>(): T[];

    setEnabledValue(v: any): void;

    getAllButtons<T>(): T[];

    getAllLeaves<T>(): T[];

    getSelectedButtons<T>(): T[];

    getNotSelectedButtons<T>(): T[];

    getIndexByValue(value: any): number;

    getNodeById<T>(id: any): T;

    getNodeByValue<T>(value: any): T;
}
