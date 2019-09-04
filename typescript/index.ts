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


type ClassConstructor<T extends {}> = T & {
    new(config: any): T;
    (config: any): T;
    readonly prototype: T;
}

export interface _BI extends _func, _i18n, _base {
    OB: ClassConstructor<_OB>;
    Widget: ClassConstructor<_Widget> & _WidgetStatic;
    Single: ClassConstructor<_Single>;
    BasicButton: ClassConstructor<_BasicButton>;
    Trigger: ClassConstructor<_Trigger>;
    Action: ClassConstructor<_Action>;
    ActionFactory: ClassConstructor<_ActionFactory>;
    ShowAction: ClassConstructor<_ShowAction>;
    Behavior: ClassConstructor<_Behavior>;
    BehaviorFactory: ClassConstructor<_BehaviorFactory>;
    HighlightBehavior: ClassConstructor<_HighlightBehavior>;
    RedMarkBehavior: ClassConstructor<_RedMarkBehavior>;
}

interface Obj {
    [key: string]: any;
}

declare let BI: Obj & _BI;

declare const Fix: Obj;

export type Constructor<T> = new(...args: any[]) => T;

/**
 * 注册widget
 */
export function shortcut () {
    return function decorator<U> (Target: Constructor<U> & {xtype: string}): void {
        BI.shortcut(Target.xtype, Target);
    };
}

/**
 * 注册model
 */
export function model () {
    return function decorator<U extends {new (...args:any[]):{}} & {xtype: string, context?: ReadonlyArray<string>}>(Target: U): void {
        BI.model(Target.xtype, class extends Target {
            context = Target.context;
        });
    };
}

/**
 * 类注册_store属性
 * @param Model model类
 * @param opts 额外条件
 */
export function store<T> (Model?: Constructor<T> & {xtype: string}, opts: { props?(this: unknown): { [key: string]: unknown } } = {}) {
    return function classDecorator<U extends {new (...args:any[]):{}}>(constructor:U) {
        return class extends constructor {
            _store () {
                const props = opts.props ? opts.props.apply(this) : undefined;

                return BI.Models.getModel(Model.xtype, props);
            }
        };
    };
}

/**
 * Model基类
 */
export class Model<U extends {types?: {[key: string]: any}, context?: ReadonlyArray<string>} = {}> extends Fix.Model {
    model: Pick<{[key in keyof U["types"]]: U["types"][key]}, U["context"][number]> & {[key in keyof ReturnType<this["state"]>]: ReturnType<this["state"]>[key]} & {[key in keyof this["computed"]]: ReturnType<this["computed"][key]>} & {[key: string]: unknown};

    store: this["actions"];

    state (): {[key: string]: any} {
        return {};
    }

    context: U["context"];

    actions:{[key: string]: (...args: any[]) => any};

    childContext: ReadonlyArray<keyof (this["computed"] & ReturnType<this["state"]>)>;

    TYPE: Pick<{[key in keyof this["computed"]]: ReturnType<this["computed"][key]>} & {[key in keyof ReturnType<this["state"]>]: ReturnType<this["state"]>[key]}, this["childContext"][number]>;

    computed: {[key: string]: () => any};
}
