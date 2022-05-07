import { Single } from '../../base/single/single';

export declare class IntervalSlider extends Single {
    static xtype: string;
    static EVENT_CHANGE: string;

    max: number;

    min: number;

    getValue(): {
        min: number;
        max: number;
    }

    setMinAndMax(v: {
        min: number | string;
        max: number | string;
    }): void;

    reset(): void
}
