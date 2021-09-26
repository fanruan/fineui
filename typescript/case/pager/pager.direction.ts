import { Widget } from "../../core/widget";

export declare class DirectionPager extends Widget {
    static xtype: string;
    static EVENT_CHANGE: string;


    getVPage(): number;
    getHPage(): number;

    setVPage(v: number):void;
    setHPage(v: number):void;

    hasVPrev(): boolean;

    hasVNext(): boolean;

    hasHPrev(): boolean;

    hasHNext(): boolean;

    setHPagerVisible(v: boolean): void;
    setVPagerVisible(v: boolean): void;

    clear(): void;

    populate(): void;
}
