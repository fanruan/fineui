import { BasicButton } from "./button.basic";
export declare class NodeButton extends BasicButton {
    isOpened(): boolean;
    setOpened(b: boolean): void;
    triggerCollapse(): void;
    triggerExpand(): void;
}
