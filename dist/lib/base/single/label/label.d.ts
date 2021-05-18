import { AbstractLabel } from "./abstract.label";
export declare class Label extends AbstractLabel {
    props: {
        py: string;
        keyword: string;
        text: string;
    } & AbstractLabel['props'];
    static xtype: string;
}
