import { Widget } from '../../../core/widget';

export declare class IconCombo extends Widget {
    static xtype: string;

    static EVENT_CHANGE: string;

    showView(): void;

    hideView(): void;

    populate(items: any[]): void;
}
