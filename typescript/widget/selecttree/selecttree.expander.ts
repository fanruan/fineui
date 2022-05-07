import { Widget } from '../../core/widget';

export declare class SelectTreeExpander extends Widget {
    static xtype: string;
    
    getAllLeaves<T>(): T[];

    setValue(v: any): void;

    getValue<T>(): T;

    populate<T>(items: T[]): void;
}
