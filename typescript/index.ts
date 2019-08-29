import { _i18n } from "./core/i18n";
import { _OB } from "./core/ob";
import { _func } from "./core/func";
import { _Widget, _WidgetStatic } from "./core/widget";
import { _Single } from "./base/single/single";
import { _base } from "./core/base";
import { _BasicButton } from "./base/single/button/button.basic";
import { _Trigger } from "./base/single/trigger/trigger";
import { _Action, _ActionFactory } from "./core/action/action";
import { _ShowAction } from "./core/action/action.show";
import { _Behavior, _BehaviorFactory } from "./core/behavior/behavior";
import { _HighlightBehavior } from "./core/behavior/behavior.highlight";
import { _RedMarkBehavior } from "./core/behavior/behavior.redmark";


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
    Trigger: Constructor<_Trigger>;
    Action: Constructor<_Action>;
    ActionFactory: Constructor<_ActionFactory>;
    ShowAction: Constructor<_ShowAction>;
    Behavior: Constructor<_Behavior>;
    BehaviorFactory: Constructor<_BehaviorFactory>;
    HighlightBehavior: Constructor<_HighlightBehavior>;
    RedMarkBehavior: Constructor<_RedMarkBehavior>;
}
