import { Widget } from '../../core/widget';

export declare class PopupView extends Widget {
    static xtype: string;

    static EVENT_CHANGE: string;

    getView(): Widget;

    populate(...args: any[]): void;

    resetWidth(v: number): void;

    resetHeight(v: number): void;

    setDirection(direction: string, position: any): void;
}
