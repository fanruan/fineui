import { _AbstractLabel } from "./abstract.label";
export interface _Label extends _AbstractLabel {
    doRedMark(...args: any[]): void;
    unRedMark(...args: any[]): void;
}
