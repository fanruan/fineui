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
        min: number;
        max: number;
    }): void;

    reset(): void
}
