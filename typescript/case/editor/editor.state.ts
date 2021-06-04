import { Widget } from "../../core/widget";

export declare class StateEditor extends Widget {
    static xtype: string;
    static EVENT_CHANGE: string;
    static EVENT_FOCUS: string;
    static EVENT_BLUR: string;
    static EVENT_CLICK: string;
    static EVENT_KEY_DOWN: string;
    static EVENT_CLICK_LABEL: string;
    static EVENT_START: string;
    static EVENT_PAUSE: string;
    static EVENT_STOP: string;
    static EVENT_CONFIRM: string;
    static EVENT_CHANGE_CONFIRM: string;
    static EVENT_VALID: string;
    static EVENT_ERROR: string;
    static EVENT_ENTER: string;
    static EVENT_RESTRICT: string;
    static EVENT_SPACE: string;
    static EVENT_EMPTY: string;

    setWaterMark(v: string): void;

    focus(): void;

    blur(): void;

    doRedMark(...args: any[]): void;

    unRedMark(...args: any[]): void;

    doHighLight(...args: any[]): void;

    unHighLight(...args: any[]): void;

    setErrorText(v: string): void;

    getErrorText(): string;

    isEditing(): boolean;

    getLastChangedValue(): string;

    getState(): number | string | Array<string>;

    setState(...args: (number | string | Array<string>)[]): void;
}
