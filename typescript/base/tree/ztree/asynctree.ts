import { TreeView, TreeValue } from "./treeview";

export declare class AsyncTree extends TreeView {
    static xtype: string;

    _beforeExpandNode<T>(treeId: string, treeNode: T): void;

    _join(valueA: TreeValue, valueB: TreeValue): TreeValue;

    _getJoinValue(): TreeValue;
}
