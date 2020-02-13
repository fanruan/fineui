import { _Layout } from "../layout";

export interface _HTapeLayout extends _Layout {
    resize(): void;

    stroke(items: []): void;

    update(): any;

    populate(items?: []): void;
}

export interface _VTapeLayout extends _Layout {
    resize(): void;

    stroke(items: []): void;

    update(): void;

    populate(items?: []): void;
}
