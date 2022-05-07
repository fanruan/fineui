import { Layout } from '../layout';

export declare class TdLayout extends Layout {
    static xtype: string;

    props: {
        columnSize: number[];
        rowSize: number[];
        verticalAlign: 'middle' | 'top' | 'bottom' | 'stretch';
        horizontalAlign: 'left' | 'right' | 'center' | 'stretch';
    }
}
