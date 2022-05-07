import { Single } from '../../base/single/single';

export declare class MultiSelectInsertList extends Single {
    static xtype: string;
    static REQ_GET_DATA_LENGTH: 1;
    static REQ_GET_ALL_DATA: -1;
    static EVENT_CHANGE: string;

    isAllSelected(): boolean;

    resize(): void;
}
