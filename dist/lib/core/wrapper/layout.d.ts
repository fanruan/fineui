import { _Widget } from "../widget";
export interface _Layout extends _Widget {
    addItem(item: any): any;
    prependItem(item: any): any;
    addItemAt(index: string, item: any): any;
    removeItemAt(indexes: any): void;
    shouldUpdateItem(index: number, item: any): boolean;
    updateItemAt(index: number, item: any): any;
    addItems<T>(items: T[], context?: any): void;
    prependItems<T>(items: T[], context?: any): void;
    getValue<T>(): T[];
    setText(v: string): void;
    update(opt: any): any;
    stroke<T>(items: T[]): void;
    removeWidget(nameOrWidget: any): void;
    populate<T>(items?: T[]): void;
    resize(): void;
}
