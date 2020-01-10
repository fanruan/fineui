import { _Pane } from "../../base/pane";
export interface _LoadingPane extends _Pane {
    __loaded: (...args: any[]) => void;
}
