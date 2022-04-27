import { BasicButton } from "../../base/single/button/button.basic";

export declare class DownListGroupItem extends BasicButton {
    static xtype: string;
    static EVENT_CHANGE: string;

    props: {
        iconCls1: string;
        iconCls2: string;
    } & BasicButton['props'];

    doRedMark(...args: any[]): void;

    unRedMark(...args: any[]): void;
}
