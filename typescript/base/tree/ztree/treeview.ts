import { Pane } from "../../pane";

export declare class TreeView extends Pane {
    static xtype: string;
    static REQ_TYPE_INIT_DATA: 1;
    static REQ_TYPE_ADJUST_DATA: 2;
    static REQ_TYPE_SELECT_DATA: 3;
    static REQ_TYPE_GET_SELECTED_DATA: 4;

    static EVENT_CHANGE: string;
    static EVENT_INIT: string;
    static EVENT_AFTERINIT: string;

    _createTree(): void;

    _selectTreeNode<T>(treeId: string, treeNode: T): void;

    _configSetting(): {[key: string]: any};

    _getParentValues<T, U>(treeNode: T): U;

    _getNodeValue<T, U>(treeNode: T): U;

    _getHalfSelectedValues<T>(map: TreeValue, node: T): void;

    _getTree<T>(map: TreeValue, values: string[]): TreeValue;

    _addTreeNode(map: TreeValue, values: string[], key: string, value: string): void;

    _buildTree(map: TreeValue, values: string[]): void;

    _getSelectedValues(): TreeValue;

    _dealWidthNodes<T>(nodes: T[]): T[];

    _loadMore(): void;

    _initTree(setting: {[key: string]: any}): void;

    initTree<T>(node: T, setting: {[key: string]: any}): void;

    start(): void;

    stop(): void;

    stroke(config: {[key: string]: any}): void;

    hasChecked(): boolean;

    checkAll<T>(checked: T[]): void;

    expandAll(flag: boolean): void;

    setValue(value: TreeValue, param: {[key: string]: any}): void;

    setSelectedValue(value: TreeValue): void;

    updateValue(value: TreeValue, param: {[key: string]: any}): void;

    refresh(): void;

    getValue(): TreeValue;

    // @ts-ignore
    populate(config?: {[key: string]: any}): void;
}

export interface TreeValue {
    [key: string]: TreeValue;
}
