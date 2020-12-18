import { Layout, _Layout } from "../../layout";
export interface _LeftVerticalAdapt extends _Layout {
    resize(): void;
    populate<T>(items?: T[]): void;
}
export declare class LeftVerticalAdaptLayout extends Layout {
    static xtype: string;
    resize(): void;
    populate<T>(items?: T[]): void;
}
