import { Widget } from '../../core/widget';

export declare class ListView extends Widget {
    static xtype: string;

    restore(): void;

    populate<T>(items: T[]): void;
}
