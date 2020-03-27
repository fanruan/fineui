import { Layout } from "../layout";

export declare class HTapeLayout extends Layout {
    resize(): void;

    stroke<T>(items: T[]): void;

    update(): any;

    populate<T>(items?: T[]): void;
}

export declare class VTapeLayout extends Layout {
    resize(): void;

    stroke<T>(items: T[]): void;

    update(): void;

    populate<T>(items?: T[]): void;
}
