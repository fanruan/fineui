import { _Pane, Pane } from "../../base/pane";

export interface _LoadingPane extends _Pane {
    __loaded: (...args: any[]) => void;
}

export declare class LoadingPane extends Pane {
    __loaded: (...args: any[]) => void;
}
