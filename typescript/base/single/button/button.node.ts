import { _BasicButton, BasicButton } from "./button.basic";

export interface _NodeButton extends _BasicButton {
    isOpened(): boolean;

    setOpened(b: boolean): void;

    triggerCollapse(): void;

    triggerExpand(): void;
}

export declare class NodeButton extends BasicButton {
    isOpened(): boolean;

    setOpened(b: boolean): void;

    triggerCollapse(): void;

    triggerExpand(): void;
}
