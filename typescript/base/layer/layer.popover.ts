import { Widget } from '../../core/widget';

export declare class Popover extends Widget {
    static xtype: string;

    static EVENT_CLOSE: string;
    static EVENT_OPEN: string;
    static EVENT_CANCEL: string;
    static EVENT_CONFIRM: string;

    hide(): void;

    open(): void;

    close(): void;

    setZindex(zindex: number): void;
}

export declare class BarPopover extends Popover {
    static xtype: string;
}
