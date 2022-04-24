import { Widget } from "../../core/widget";

export declare class MultifileEditor extends Widget {
    static xtype: string;
    static EVENT_CHANGE: string;
    static EVENT_UPLOADSTART: string;
    static EVENT_ERROR: string;
    static EVENT_PROGRESS: string;
    static EVENT_UPLOADED: string;

    _reset(): void;

    select(): void;

    getValue(): {
        attach_id: string;
        attach_type: string;
        filename: string;
        [key: string]: any;
    }[];

    upload(): void;

    reset(): void;

    getQueue(): {
        fileName: string;
        lastModified: number;
        lastModifiedDate: Date;
        name: string;
        size: number;
        type: string;
    }[];

    sendFiles(files: FileList): void;
}
