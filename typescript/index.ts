import { _i18n } from "./core/i18n";
import { OBConstructor } from "./core/ob";
import { _func } from "./core/func";
import { WidgetConstructor } from "./core/widget";

export interface _BI extends _func, _i18n {
    OB: OBConstructor;
    Widget: WidgetConstructor;
}
