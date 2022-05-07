import { Text } from "../single/text";

export declare class A extends Text {
    static xtype: string;
    props: {
        href: string;
        el: Obj;
    } & Text['props'];
}
