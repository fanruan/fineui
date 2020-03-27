import { Widget } from "../core/widget";

export declare class Pane extends Widget {
    _assertTip: (..._args: any[]) => void;
    loading: (..._args: any[]) => void;
    loaded: (..._args: any[]) => void;
    check: (..._args: any[]) => void;

    static EVENT_LOADED: string;
}
