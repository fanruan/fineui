import { Widget } from '../../core/widget';

export declare class CustomTree extends Widget {
    static xtype: string;
    static EVENT_CHANGE: string;

    initTree(nodes: any, ...args: any[]): void;

    stroke(...args: any[]): void;

    populate(nodes?: any, ...args: any[]): void;

    getAllButtons<T>(): T[];

    getAllLeaves<T>(): T[];

    getNodeById(id: any): any;

    getNodeByValue(value: any): any;

    getValue<T>(): T[];
}
