import { Pane } from '../../base/pane'

export declare class MultiLayerSingleLevelTree extends Pane {
    static xtype: string;
    static EVENT_CHANGE: string;

    initTree(nodes: any, ...args: any[]): void;

    populate(nodes: any, ...args: any[]): void;

    getAllLeaves<T>(): T[];

    getNodeById(id: any): any;

    getNodeByValue(value: any): any;
}