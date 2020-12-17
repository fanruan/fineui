import { Single, _Single } from "../single";

export interface _Iframe extends _Single {
    setSrc(v: string): void;

    getSrc(): string;

    setNam(v: string): void;

    getName(): string;
}

export declare class iframe extends Single {
    static xtype: string;

    setSrc(v: string): void;

    getSrc(): string;

    setNam(v: string): void;

    getName(): string;
}
