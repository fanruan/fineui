import { Widget } from "../../core/widget";
import { Combo } from "../../base/combination/combo";

export declare class MultiLayerDownListCombo extends Widget {
    static xtype: string;

    static EVENT_CHANGE: string;
    static EVENT_SON_VALUE_CHANGE: string;
    static EVENT_BEFORE_POPUPVIEW: string;

    props: {
        adjustLength: Combo['props']['adjustLength'];
        direction: Combo['props']['direction'];
        trigger: Combo['props']['trigger'];
        container: Combo['props']['container'];
        stopPropagation: Combo['props']['stopPropagation'];
        el: Combo['props']['el'];
        chooseType: number;
        value: any;
        iconCls: string;
    }

    hideView(): void;

    showView(e?: Event): void;

    setValue(v: any): void;

    getValue<T>(): T;

    populate<T>(items: T[]): void;
}
