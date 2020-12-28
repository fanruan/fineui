import { Widget } from "../core/widget";

export declare class Pane extends Widget {
    static EVENT_LOADED: string;

    _assertTip(..._args: any[]): void;
    loading(): void;
    loaded(): void;
    check(): void;
    setTipVisible(b: boolean): void;
    populate(...args: any[]): void;
}
