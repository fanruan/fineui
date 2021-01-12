import { Layout } from "../../layout";

export declare class LeftVerticalAdaptLayout extends Layout {
    static xtype: string;

    resize(): void;

    populate<T>(items?: T[]): void;
}
