import { Widget } from "../../core/widget";
import { Action } from "../../core/action/action";

export declare class Tab extends Widget {
    static xtype: string;

    static EVENT_CHANGE: string;

    props: {
        showIndex: any;
        cardCreator: Function;
        direction?: string; // top, bottom, left, right, custom
        single?: boolean; // 是不是单页面
        logic?: any;
        tab?: boolean;
    }

    setSelect(v: string | number, action?: Action, callback?: Function): void;

    removeTab(v: string | number): void;

    getSelect(): string | number;

    getSelectedTab<T>(): T;

    getTab<T>(v: string | number): T;

    populate(): void;
}
