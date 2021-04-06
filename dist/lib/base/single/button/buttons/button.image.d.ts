import { BasicButton } from "../button.basic";
export declare class ImageButton extends BasicButton {
    static xtype: string;
    static EVENT_CHANGE: string;
    setImageWidth(w: number | string): void;
    setImageHeight(h: number | string): void;
    getImageWidth(): number;
    getImageHeight(): number;
    setSrc(src: string): void;
    getSrc(): string;
}
