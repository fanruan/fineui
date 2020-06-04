import { _BasicButton } from "./button.basic";
export interface _NodeButton extends _BasicButton {
    isOpened: () => void;
    setOpened: (b: boolean) => void;
    triggerCollapse: () => void;
    triggerExpand: () => void;
}
