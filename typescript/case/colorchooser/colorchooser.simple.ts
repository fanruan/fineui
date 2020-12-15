import { Widget } from '../../core/widget';

export declare class SimpleColorChooser extends Widget {
    static xtype: string;
    static EVENT_CHANGE: string;
    
    isViewVisible(): boolean;

    hideView(): void;

    showView(): void;
}
