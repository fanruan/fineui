import { Single } from "../single";

export declare class Input extends Single {
    static xtype: string;
    static EVENT_CHANGE: string;
    static EVENT_FOCUS: string;
    static EVENT_CLICK: string;
    static EVENT_BLUR: string;
    static EVENT_KEY_DOWN: string;
    static EVENT_QUICK_DOWN: string;
    static EVENT_SPACE: string;
    static EVENT_BACKSPACE: string;
    static EVENT_START: string;
    static EVENT_PAUSE: string;
    static EVENT_STOP: string;
    static EVENT_CHANGE_CONFIRM: string;
    static EVENT_CONFIRM: string;
    static EVENT_REMOVE: string;
    static EVENT_EMPTY: string;
    static EVENT_VALID: string;
    static EVENT_ERROR: string;
    static EVENT_ENTER: string;
    static EVENT_RESTRICT: string;

    onClick(): void;

    onKeyDown(keyCode: number): void;

    focus(): void;

    blur(): void;

    selectAll(): void;

    setValue(v: string): void;

    getValue(): string;

    isEditing(): boolean;

    getLastValidValue(): string;

    getLastChangedValue(): string;
}
