import { Widget } from "../core/widget";

export declare class Pane extends Widget {
    static EVENT_LOADED: string;
    static EVENT_LOADING: string;

    _assertTip(..._args: any[]): void;
    loading(): void;
    loaded(): void;
    check(): void;
    setTipText(text: string): void;
    setTipVisible(b: boolean): void;
    populate(...args: any[]): void;
}
