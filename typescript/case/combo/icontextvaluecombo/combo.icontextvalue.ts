import { Widget } from '../../../core/widget';

export declare class IconTextValueCombo extends Widget {
    static xtype: string;
    static EVENT_CHANGE: string;

    populate<T>(items: T[]): void;
}
