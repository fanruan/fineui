import { BasicButton } from '../../../base/single/button/button.basic';

export declare class MidTreeLeafItem extends BasicButton {
    static xtype: string;
    
    doRedMark(...args: any[]): void;

    unRedMark(...args: any[]): void;

    doHighLight(...args: any[]): void;

    unHighLight(...args: any[]): void;

    getId(): string;

    getPId(): string;
}
