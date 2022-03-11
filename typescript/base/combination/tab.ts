import { Widget } from "../../core/widget";
import { Action } from "../../core/action/action";

export declare class Tab extends Widget {
    static xtype: string;

    static EVENT_CHANGE: string;

    props: {
        showIndex: any;
        cardCreator: (v: any) => Obj;
        direction?: 'top' | 'bottom' | 'left' | 'right' | 'custom'; // top, bottom, left, right, custom
        single?: boolean; // 是不是单页面
        logic?: {
            dynamic: boolean;
        };
        tab?: Obj;
        keepAlives?: string[] | ((cardName: string) => boolean)
    }

    setSelect(v: string | number, action?: Action, callback?: Function): void;

    removeTab(v: string | number): void;

    getSelect(): string | number;

    getSelectedTab<T>(): T;

    getTab<T>(v: string | number): T;

    populate(): void;

    isCardExisted(cardName: string): boolean;
}
