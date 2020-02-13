import { _Widget } from "../../core/widget";
export interface _ButtonGroup extends _Widget {
    prependItems(items: []): void;
    addItems(items: []): void;
    removeItemAt(indexes: any): void;
    removeItems(values: any): void;
    populate(items?: any): void;
    setNotSelectedValue(v: any): void;
    getNotSelectedValue(): [];
    setEnabledValue(v: any): void;
    getAllButtons(): [];
    getAllLeaves(): [];
    getSelectedButtons(): [];
    getNotSelectedButtons(): [];
    getIndexByValue(value: any): number;
    getNodeById(id: any): any;
    getNodeByValue(value: any): any;
    getValue(): [];
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
