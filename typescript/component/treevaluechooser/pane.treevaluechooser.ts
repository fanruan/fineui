import { TreeValue } from '../../base/tree/ztree/treeview';
import { AbstractTreeValueChooser } from "./abstract.treevaluechooser";

export declare class TreeValueChooserPane extends AbstractTreeValueChooser {
    static xtype: string;
    static EVENT_CHANGE: string;

    setSelectedValue(v: TreeValue): void;

    setValue(v: TreeValue): void;

    getValue(): TreeValue;

    getAllValue(): TreeValue;

    populate<T>(items?: T[]): void;
}
