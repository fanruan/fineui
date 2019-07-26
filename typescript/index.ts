import { _i18n } from "./core/i18n";
import { _OB } from "./core/ob";
import { _func } from "./core/func";
import { _Widget, _WidgetStatic } from "./core/widget";
import { _Single } from "./base/single/single";
import { _base } from "./core/base";
import { _BasicButton } from "./base/single/button/button.basic";

type Constructor<T extends {}> = T & {
    new(config: any): T;
    (config: any): T;
    readonly prototype: T;
}

export interface _BI extends _func, _i18n, _base {
    OB: Constructor<_OB>;
    Widget: Constructor<_Widget> & _WidgetStatic;
    Single: Constructor<_Single>;
    BasicButton: Constructor<_BasicButton>;
}
