import { Widget } from '../../core/widget';

export declare class HexColorChooserPopup extends Widget {
    static xtype: string;
    static EVENT_CHANGE: string;
    static EVENT_VALUE_CHANGE: string;

    setStoreColors(v: string): void;

    setValue(v: string): void;

    getValue(): string;
}
