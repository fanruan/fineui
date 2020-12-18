import { Single, _Single } from "../single";

export interface _Trigger extends _Single {
    setKey(..._args: any[]): void;

    getKey(): string;
}

export declare class Trigger extends Single {
    static xtype: string;

    setKey(..._args: any[]): void;

    getKey(): string;
}
