import { Single } from '../../base/single/single';

export declare class NumberInterval extends Single {
    static xtype: string;
    static EVENT_CHANGE: string;
    static EVENT_CONFIRM: string;
    static EVENT_VALID: string;
    static EVENT_ERROR: string;

    isStateValid(): boolean;

    setMinEnable(v: boolean): void;

    setCloseMinEnable(v: boolean): void;

    setMaxEnable(v: boolean): void;

    setCloseMaxEnable(v: boolean): void;

    showNumTip(): void;

    hideNumTip(): void;

    setNumTip(v: string): void;

    getNumTip(): void;
}
