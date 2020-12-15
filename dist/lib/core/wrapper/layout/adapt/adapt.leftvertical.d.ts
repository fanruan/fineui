import { _Layout } from "../../layout";
export interface _LeftVerticalAdapt extends _Layout {
    resize(): void;
    populate<T>(items?: T[]): void;
}
