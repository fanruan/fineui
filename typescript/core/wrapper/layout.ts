import { _Widget } from "../widget";

export interface _Layout extends _Widget {
    addItem(item: any): any;

    prependItem(item: any): any;

    addItemAt(index: string, item: any): any;

    removeItemAt(indexes: any): void;

    shouldUpdateItem(index: number, item: any): boolean;

    updateItemAt(index: number, item: any): any;

    addItems(items: [], context?: any): void;

    prependItems(items: [], context?: any): void;

    getValue(): [];

    setText(v: string): void;

    update(opt: any): any;

    stroke(items: []): void;

    removeWidget(nameOrWidget: any): void;

    populate(items?: []): void;

    resize(): void;
}
