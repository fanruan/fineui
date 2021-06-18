import { AbstractLabel } from "./abstract.label";

export declare class HtmlLabel extends AbstractLabel {
    props: {
        textHeight: number;
    } & AbstractLabel['props'];

    static xtype: string;
}
