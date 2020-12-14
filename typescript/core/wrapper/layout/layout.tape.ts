import { Layout } from "typescript";
import { _Layout } from "../layout";

export interface _HTapeLayout extends _Layout {
    resize(): void;

    stroke<T>(items: T[]): void;

    update(): any;

    populate<T>(items?: T[]): void;
}

export interface _VTapeLayout extends _Layout {
    resize(): void;

    stroke<T>(items: T[]): void;

    update(): void;

    populate<T>(items?: T[]): void;
}

export declare class HTapeLayout extends Layout {
    static xtype: string;
}

export declare class VTapeLayout extends Layout {
    static xtype: string;
}
