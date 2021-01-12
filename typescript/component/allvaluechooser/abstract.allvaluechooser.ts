import { Widget } from "../../core/widget";

export declare class AbstractAllValueChooser extends Widget {
    static xtype: string;

    _valueFormatter(v: string | number): string;
    
    _itemsCreator(options: any, callback: Function): void;

    _assertValue(v: {
        type: string;
        value: any[];
    }): {
        type: string;
        value: any[];
    }
}
