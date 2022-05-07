import { Pane } from '../../base/pane';

export declare class MultiLayerSelectLevelTree extends Pane {
    static xtype: string;

    static EVENT_CHANGE: string;

    initTree<T>(nodes: T): void;

    populate<T>(nodes?: T[]): void;

    setValue(v: string[] | string): void;

    getValue(): string[];

    getAllLeaves<T>(): T[];

    getNodeById<T>(id: string): T;

    getNodeByValue<T>(id: string): T;
}
