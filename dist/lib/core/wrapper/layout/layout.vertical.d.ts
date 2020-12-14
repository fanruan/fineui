import { Layout, _Layout } from "../layout";
export interface _VerticalLayout extends _Layout {
    resize(): void;
    populate<T>(items?: T[]): void;
}
export declare class VerticalLayout extends Layout {
    static xtype: string;
}
