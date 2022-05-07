import { Single } from "../../base/single/single";

export declare class MultiSelectCombo extends Single {
    static xtype: string;
    static EVENT_BLUR: string;
    static EVENT_FOCUS: string;
    static EVENT_STOP: string;
    static EVENT_SEARCHING: string;
    static EVENT_CLICK_ITEM: string;
    static EVENT_CONFIRM: string;
    static REQ_GET_DATA_LENGTH: 1;
    static REQ_GET_ALL_DATA: -1;

    props: {
        itemsCreator: (options: any, callback: () => any[]) => void;
        itemHeight: number;
        text: string;
        valueFormatter: (v: string) => string;
        allowEdit: boolean;
    } & Single['props']

    _itemsCreator4Trigger(op: any, callback: Function): void;

    _stopEditing(): void;

    _defaultState(): void;

    _assertValue(): void;

    _makeMap(): Obj;

    _joinKeywords(keywords: string[], callback: Function): void;

    _joinAll(res: {
        type: number;
        value: string[];
        assist: string[];
    }, callback: Function): void;

    _adjust(callback: Function): void;

    _join(): void;

    _setStartValue(value: string): void;

    _populate(...args: any[]): void;

    showView(): void;

    hideView(): void;

    setValue(value: {
        type: number;
        value: string[];
        assist: string[];
    }): void;

    getValue(): {
        type: number;
        value: string[];
        assist: string[];
    };

    populate(...args: any[]): void;
}
