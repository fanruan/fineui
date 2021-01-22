import { NodeButton } from "../button.node";

export declare class TextNode extends NodeButton {

    static xtype: string;

    setText(b: string): void;

    getText(): string;

    setValue(): void;

    getValue(): string;

    doRedMark(...args: any[]): void;

    unRedMark(...args: any[]): void;
}
