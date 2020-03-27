import { BasicButton } from "../../base/single/button/button.basic";

export declare class MultiSelectItem extends BasicButton {
    doClick(...args: any[]): void;

    doRedMark(...args: any[]): void;

    unRedMark(...args: any[]): void;

    setSelected(v: boolean): void;

    static EVENT_CHANGE: string;
}
