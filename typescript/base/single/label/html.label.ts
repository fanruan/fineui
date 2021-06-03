import { AbstractLabel } from "./abstract.label";

export declare class HtmlLabel extends AbstractLabel {
    props: {
        lineHeight: number;
    } & AbstractLabel['props'];

    static xtype: string;
}
