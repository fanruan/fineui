import { Widget } from "../../core/widget";

export declare class SelectList extends Widget {
    static xtype: string;
    
    static EVENT_CHANGE: string;

    setAllSelected(v: boolean): void;

    setToolBarVisible(v: boolean): void;

    isAllSelected(): boolean;

    hasPrev(): boolean;

    hasNext(): boolean;

    prependItems<T>(items: T[]): void;

    addItems<T>(items: T[]): void;

    populate<T>(items: T[]): void;

    resetHeight(h: number): void;

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
