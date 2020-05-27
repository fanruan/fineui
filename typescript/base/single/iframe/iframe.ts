import { _Single } from "../single";

export interface _Iframe extends _Single {
    setSrc(v: string): void;

    getSrc(): string;

    setNam(v: string): void;

    getName(): string;
}
