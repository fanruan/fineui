import { Widget } from "../../core/widget";

interface SingleOpt {
    container?: any, belowMouse?: boolean
}

export declare class Single extends Widget {
    props: {
        readonly?: boolean,
        title?: string | (() => string) | null,
        warningTitle?: string | (() => string) | null,
        tipType?: "success" | "warning",
        value?: any,

        /**
         * title是否跟随鼠标
         * @default false
         */
        belowMouse?: boolean,
    }

    _showToolTip(e: Event, opt?: SingleOpt): void;

    _hideTooltip(): void;

    _clearTimeOut(): void;

    enableHover(opt?: SingleOpt): void;

    disabledHover(): void;

    setTitle(title: string | Function, opt?: SingleOpt): void;

    setWarningTitle(title: string, opt?: SingleOpt): void;

    setTipType(v: string): void;

    getTipType(): string;

    isReadOnly(): boolean;

    getTitle(): string;

    getWarningTitle(): string;

    populate(..._args: any[]): void;
}
