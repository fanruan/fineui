import { Single } from "../single";

export declare class AbstractLabel extends Single {
    static xtype: string;
    
    doRedMark(...args: any[]): void;

    unRedMark(...args: any[]): void;

    doHighLight(...args: any[]): void;

    unHighLight(...args: any[]): void;

    setStyle(css: any): void;
}
