import { _Layout } from "../layout";

export interface _VerticalLayout extends _Layout {
    resize(): void;

    populate<T>(items?: T[]): void;
}
