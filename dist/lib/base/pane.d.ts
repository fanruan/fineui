import { _Widget } from "../core/widget";
export interface _Pane extends _Widget {
    _assertTip: (..._args: any[]) => void;
    loading: (..._args: any[]) => void;
    loaded: (..._args: any[]) => void;
    check: (..._args: any[]) => void;
}
export interface _PaneStatic {
    EVENT_LOADED: string;
}
