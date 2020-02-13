import { _Single } from "../single";
export interface _Editor extends _Single {
    setErrorText(v: string): void;
    getErrorText(): string;
    setWaterMark(v: string): void;
    disableError(): void;
    enableError(): void;
    disableWaterMark(): void;
    enableWaterMark(): void;
    focus(): void;
    blur(): void;
    selectAll(): void;
    onKeyDown(keyCode: number): void;
    getValue(): string;
    getLastValidValue(): string;
    getLastChangedValue(): string;
    isEditing(): boolean;
    isValid(): boolean;
}
export interface _EditorStatic {
    EVENT_CHANGE: string;
    EVENT_FOCUS: string;
    EVENT_BLUR: string;
    EVENT_CLICK: string;
    EVENT_KEY_DOWN: string;
    EVENT_SPACE: string;
    EVENT_BACKSPACE: string;
    EVENT_START: string;
    EVENT_PAUSE: string;
    EVENT_STOP: string;
    EVENT_CONFIRM: string;
    EVENT_CHANGE_CONFIRM: string;
    EVENT_VALID: string;
    EVENT_ERROR: string;
    EVENT_ENTER: string;
    EVENT_RESTRICT: string;
    EVENT_REMOVE: string;
    EVENT_EMPTY: string;
}
