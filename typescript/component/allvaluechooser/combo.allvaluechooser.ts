import { AbstractAllValueChooser } from "./abstract.allvaluechooser";

export declare class AllValueChooserCombo extends AbstractAllValueChooser {
    static xtype: string;

    static EVENT_CONFIRM: string;

    getAllValue(): any;

    populate(...args: any[]): void;
}
