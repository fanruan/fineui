import { _Single } from "../single";
export interface _Trigger extends _Single {
    setKey(..._args: any[]): void;
    getKey(): string;
}
