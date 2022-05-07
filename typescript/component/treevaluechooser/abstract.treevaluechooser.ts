import { Widget } from "../../core/widget";

export declare class AbstractTreeValueChooser extends Widget {
    _valueFormatter: (v: string) => string;

    _initData: (items: any[]) => void;

    _itemsCreator: (options: any, callback: Function) => void;

    _reqDisplayTreeNode: (options: any, callback: Function) => void;

    _reqSelectedTreeNode: (options: any, callback: Function) => void;

    _reqAdjustTreeNode: (options: any, callback: Function) => void;

    _reqInitTreeNode: (options: any, callback: Function) => void;
    
    _reqTreeNode: (options: any, callback: Function) => void;

    _getAddedValueNode: (parentValues: any[], selectedValues: any) => any[];

    _getNode: (selectedValues: any, parentValues: any[]) => any;

    _deleteNode: (selectedValues: any, values: any[]) => void;

    _buildTree: (jo: any, values: any) => void;

    _isMatch: (parentValues: any, value: any, keyword: any) => boolean;

    _getTreeNode: (parentValues: any, v: any) => any;

    _getChildren: (parentValues: any) => any;

    _getAllChildren: (parentValues: any) => any;

    _getChildCount: (parentValues: any) => number;
}
