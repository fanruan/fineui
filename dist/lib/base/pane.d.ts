import { _Widget, Widget } from "../core/widget";
export interface _Pane extends _Widget {
    _assertTip(..._args: any[]): void;
    loading(..._args: any[]): void;
    loaded(..._args: any[]): void;
    check(..._args: any[]): void;
    populate(...args: any[]): void;
}
export interface _PaneStatic {
    EVENT_LOADED: string;
}
export declare class Pane extends Widget {
    static EVENT_LOADED: string;
    _assertTip(..._args: any[]): void;
    loading(): void;
    loaded(): void;
    check(): void;
    setTipVisible(b: boolean): void;
    populate(items?: any[]): void;
}
