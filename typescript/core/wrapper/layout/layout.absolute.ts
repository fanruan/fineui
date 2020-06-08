import { _Layout } from "../layout";

export interface _AbsoluteLayout extends _Layout {
    resize(): void;

    stroke<T>(items: T[]): void;

    populate<T>(items?: T[]): void;
}