import { _Widget, Widget } from "../../core/widget";

export interface _ButtonGroup extends _Widget {
    prependItems<T>(items: T[]): void;

    addItems<T>(items: T[]): void;

    removeItemAt(indexes: any): void;

    removeItems(values: any): void;

    populate(items?: any, ...args: any[]): void;

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
}

export interface _ButtonGroupChooseType {
    CHOOSE_TYPE_SINGLE: number;
    CHOOSE_TYPE_MULTI: number;
    CHOOSE_TYPE_ALL: number;
    CHOOSE_TYPE_NONE: number;
    CHOOSE_TYPE_DEFAULT: number;
}

export interface _ButtonGroupStatic {
    EVENT_CHANGE: string;
}

export declare class ButtonGroup extends Widget {
    static xtype: string;
    static CHOOSE_TYPE_SINGLE: number;
    static CHOOSE_TYPE_MULTI: number;
    static CHOOSE_TYPE_ALL: number;
    static CHOOSE_TYPE_NONE: number;
    static CHOOSE_TYPE_DEFAULT: number;
    static EVENT_CHANGE: string;

    prependItems<T>(items: T[]): void;

    addItems<T>(items: T[]): void;

    removeItemAt(indexes: any): void;

    removeItems(values: any): void;

    populate(items?: any, ...args: any[]): void;

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
}
