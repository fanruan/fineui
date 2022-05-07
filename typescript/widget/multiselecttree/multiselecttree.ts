import { Single } from '../../base/single/single';

export declare class MultiSelectTree extends Single {
    static xtype: string;
    static EVENT_CHANGE: string;

    stopSearch(): void;

    setSelectedValue(v: string[]): void;
}
