import { _Single } from "../single";
export interface _BasicButton extends _Single {
    _createShadow(): void;
    bindEvent(): void;
    _trigger(e: Event): void;
    _doClick(e: Event): void;
    beforeClick(): void;
    doClick(): void;
    handle(): _BasicButton;
    hover(): void;
    dishover(): void;
    setSelected(b: boolean): void;
    isSelected(): boolean;
    isOnce(): boolean;
    isForceSelected(): boolean;
    isForceNotSelected(): boolean;
    isDisableSelected(): boolean;
    setText(v: string): void;
    getText(): string;
}
export interface _BasicButtonStatic {
    EVENT_CHANGE: string;
}
