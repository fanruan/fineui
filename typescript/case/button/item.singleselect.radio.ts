import { BasicButton } from "../../base/single/button/button.basic";

export declare class SingleSelectRadioItem extends BasicButton {
    static xtype: string;
    static EVENT_CHANGE: string;

    props: {
        iconWrapperWidth: number;
        logic: {
            dynamic: boolean;
        };
        textHgap: number;
        textLgap: number;
        textRgap: number;
        text: string;
        keyword: string;
        py: string;
        value: any;
    } & BasicButton['props']

    doRedMark(...args: any[]): void;

    unRedMark(...args: any[]): void;
}
