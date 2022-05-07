import { Single } from "../single";

export declare class BasicButton extends Single {
    static EVENT_CHANGE: string;

    static xtype: string;

    props: {
        stopEvent?: boolean;
        stopPropagation?: boolean;
        selected?: boolean | ((context: any) => boolean);

        /**
         * 点击一次选中有效,再点无效
         */
        once?: boolean;

        /**
         * 点击即选中, 选中了就不会被取消,与once的区别是forceSelected不影响事件的触发
         */
        forceSelected?: boolean;

        /**
         * 无论怎么点击都不会被选中
         */
        forceNotSelected?: boolean;

        /**
         * 使能选中
         */
        disableSelected?: boolean;
        shadow?: boolean;

        /**
         * 选中状态下是否显示阴影
         */
        isShadowShowingOnSelected?: boolean;
        trigger?: string | null;
        handler?: Function;
        bubble?: Function | null | string;
        text?: string;
        el?: Obj;
    } & Single["props"];

    _createShadow(): void;

    bindEvent(): void;

    _trigger(e: Event): void;

    _doClick(e: Event): void;

    beforeClick(): void;

    doClick(e?: Event): void;

    handle(): BasicButton;

    hover(): void;

    dishover(): void;

    setSelected(b: boolean): void;

    isSelected(): boolean;

    isOnce(): boolean;

    isForceSelected(): boolean;

    isForceNotSelected(): boolean;

    isDisableSelected(): boolean;

    setText(v: string): void;

    getText(): string;
}
