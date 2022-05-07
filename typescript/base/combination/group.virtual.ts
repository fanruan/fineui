import { Widget } from '../../core/widget';

export declare class VirtualGroup extends Widget {
    static xtype: string;
    static EVENT_CHANGE: string;
    
    addItems<T>(items: T[]): void;

    prependItems<T>(items: T[]): void;

    getNotSelectedValue<T>(): T[];

    getValue<T>(): T[];

    populate(items?: any, ...args: any[]): void
}