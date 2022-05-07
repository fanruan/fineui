import { Single } from "../single";

export declare class Editor extends Single {
    static xtype: string;

    props: {
        inputType?: string;
        validationChecker?: Function;
        quitChecker?: Function
        allowBlank?: boolean;
        watermark?: string;
        errorText?: string | ((v: string) => string);
        autocomplete?: string;
    } & Single['props']

    static EVENT_CHANGE: string;
    static EVENT_FOCUS: string;
    static EVENT_BLUR: string;
    static EVENT_CLICK: string;
    static EVENT_KEY_DOWN: string;
    static EVENT_SPACE: string;
    static EVENT_BACKSPACE: string;
    static EVENT_START: string;
    static EVENT_PAUSE: string;
    static EVENT_STOP: string;
    static EVENT_CONFIRM: string;
    static EVENT_CHANGE_CONFIRM: string;
    static EVENT_VALID: string;
    static EVENT_ERROR: string;
    static EVENT_ENTER: string;
    static EVENT_RESTRICT: string;
    static EVENT_REMOVE: string;
    static EVENT_EMPTY: string;

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

    getLastValidValue(): string;

    getLastChangedValue(): string;

    isEditing(): boolean;

    isValid(): boolean;
}
