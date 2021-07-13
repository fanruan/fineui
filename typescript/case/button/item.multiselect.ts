import { BasicButton } from "../../base/single/button/button.basic";

export declare class MultiSelectItem extends BasicButton {
    static xtype: string;

    static EVENT_CHANGE: string;

    props: {
        login: {
            dynamic: boolean;
        }
        text: string;
        iconWrapperWidth: number;
        textLgap: number;
        textRgap: number;
        textHgap: number;
    }

    doClick(...args: any[]): void;

    doRedMark(...args: any[]): void;

    unRedMark(...args: any[]): void;

    setSelected(v: boolean): void;
}
