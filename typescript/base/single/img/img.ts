import { Single } from "../single";

export declare class Img extends Single {
    static xtype: string;

    props: {
        src: string;
    } & Single['props'];

    setSrc(src: string): void;
    getSrc(): string;
}
