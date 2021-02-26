import { BasicButton } from "../button.basic";
export declare class ImageButton extends BasicButton {
    static xtype: string;
    static EVENT_CHANGE: string;
    setWidth(w: number): void;
    setHeight(h: number): void;
    setImageWidth(w: number): void;
    setImageHeight(h: number): void;
    getImageWidth(): number;
    getImageHeight(): number;
    setSrc(src: string): void;
    getSrc(): string;
    doClick(): void;
}
