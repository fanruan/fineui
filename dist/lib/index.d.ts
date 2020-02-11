import * as decorator from "./core/decorator/decorator";
import { _i18n } from "./core/i18n";
import { _OB } from "./core/ob";
import { _func } from "./core/func";
import { _Widget, _WidgetStatic } from "./core/widget";
import { _Single } from "./base/single/single";
import { _base } from "./core/base";
import { _BasicButton, _BasicButtonStatic } from "./base/single/button/button.basic";
import { _Trigger } from "./base/single/trigger/trigger";
import { _Action, _ActionFactory } from "./core/action/action";
import { _ShowAction } from "./core/action/action.show";
import { _Behavior, _BehaviorFactory } from "./core/behavior/behavior";
import { _HighlightBehavior } from "./core/behavior/behavior.highlight";
import { _RedMarkBehavior } from "./core/behavior/behavior.redmark";
import { _Pane, _PaneStatic } from "./base/pane";
import { _LoadingPane } from "./case/loading/loading_pane";
declare type ClassConstructor<T extends {}> = T & {
    new (config: any): T;
    (config: any): T;
    readonly prototype: T;
};
export interface BI extends _func, _i18n, _base {
    OB: ClassConstructor<_OB>;
    Widget: ClassConstructor<_Widget> & _WidgetStatic;
    Single: ClassConstructor<_Single>;
    BasicButton: ClassConstructor<_BasicButton> & _BasicButtonStatic;
    Trigger: ClassConstructor<_Trigger>;
    Action: ClassConstructor<_Action>;
    ActionFactory: ClassConstructor<_ActionFactory>;
    ShowAction: ClassConstructor<_ShowAction>;
    Behavior: ClassConstructor<_Behavior>;
    BehaviorFactory: ClassConstructor<_BehaviorFactory>;
    HighlightBehavior: ClassConstructor<_HighlightBehavior>;
    RedMarkBehavior: ClassConstructor<_RedMarkBehavior>;
    Pane: ClassConstructor<_Pane> & _PaneStatic;
    LoadingPane: ClassConstructor<_LoadingPane>;
    Decorators: typeof decorator;
}
declare const _default: {
    Decorators: typeof decorator;
};
export default _default;
