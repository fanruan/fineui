import { Widget } from '../../core/widget';

export declare class SearchEditor extends Widget {
    static xtype: string;

    static EVENT_CHANGE: string;
    static EVENT_FOCUS: string;
    static EVENT_BLUR: string;
    static EVENT_CLICK: string;
    static EVENT_KEY_DOWN: string;
    static EVENT_SPACE: string;
    static EVENT_BACKSPACE: string;
    static EVENT_CLEAR: string;
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
    
    setWaterMark(v: string): void;
    
    focus(): void;

    blur(): void;

    getKeywords(): string[];

    getLastValidValue(): string;

    getLastChangedValue(): string;

    isEditing(): boolean;

    isValid(): boolean;

    showClearIcon(): void;

    hideClearIcon(): void;
}
