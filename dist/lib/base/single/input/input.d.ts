import { _Single } from "../single";
export interface _Input extends _Single {
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
export interface _InputStatic {
    EVENT_CHANGE: string;
    EVENT_FOCUS: string;
    EVENT_CLICK: string;
    EVENT_BLUR: string;
    EVENT_KEY_DOWN: string;
    EVENT_QUICK_DOWN: string;
    EVENT_SPACE: string;
    EVENT_BACKSPACE: string;
    EVENT_START: string;
    EVENT_PAUSE: string;
    EVENT_STOP: string;
    EVENT_CHANGE_CONFIRM: string;
    EVENT_CONFIRM: string;
    EVENT_REMOVE: string;
    EVENT_EMPTY: string;
    EVENT_VALID: string;
    EVENT_ERROR: string;
    EVENT_ENTER: string;
    EVENT_RESTRICT: string;
}
