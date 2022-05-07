import { BasicButton } from "./button.basic";

export declare class NodeButton extends BasicButton {
    props: {
        open?: boolean;
    } & BasicButton['props'];

    isOpened(): boolean;

    setOpened(b: boolean): void;

    triggerCollapse(): void;

    triggerExpand(): void;
}
