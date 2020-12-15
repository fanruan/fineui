import { Widget, _Widget } from "../../core/widget";

export interface _SignEditor extends _Widget {
    setTitle(v: string | Function): void;

    setWarningTitle(v: string | Function): void;

    setWaterMark(v: string): void;

    focus(): void;

    blur(): void;

    doRedMark(...args: any[]): void;

    unRedMark(...args: any[]): void;

    doHighLight(...args: any[]): void;

    unHighLight(...args: any[]): void;

    isValid(): boolean;

    setErrorText(v: string): void;

    getErrorText(): string;

    isEditing(): boolean;

    getLastChangedValue(): string;

    getState(): any;

    setState(...args: any[]): void;
}

export interface _SignEditorStatic {
    EVENT_CHANGE: string;
    EVENT_FOCUS: string;
    EVENT_BLUR: string;
    EVENT_CLICK: string;
    EVENT_KEY_DOWN: string;
    EVENT_CLICK_LABEL: string;
    EVENT_START: string;
    EVENT_PAUSE: string;
    EVENT_STOP: string;
    EVENT_CONFIRM: string;
    EVENT_CHANGE_CONFIRM: string;
    EVENT_VALID: string;
    EVENT_ERROR: string;
    EVENT_ENTER: string;
    EVENT_RESTRICT: string;
    EVENT_SPACE: string;
    EVENT_EMPTY: string;
}

export declare class SignEditor extends Widget {
    static xtype: string;
    static EVENT_FOCUS: string;
    static EVENT_BLUR: string;
    static EVENT_CHANGE: string;
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

    setTitle(v: string | Function): void;

    setWarningTitle(v: string | Function): void;

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

    getState(): any;

    setState(...args: any[]): void;
}
