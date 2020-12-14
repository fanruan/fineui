import { _Layout } from "../layout";

export interface _DefaultLayout extends _Layout {
    resize(): void;

    populate<T>(items?: T[]): void;
}