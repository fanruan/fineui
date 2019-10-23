export type Constructor<T> = new(...args: any[]) => T;

/**
 * 注册widget
 */
export function shortcut() {
    return function decorator<U>(Target: Constructor<U> & {xtype: string}): void {
        BI.shortcut(Target.xtype, Target);
    };
}

/**
 * 注册model
 */
export function model() {
    return function decorator<U extends {new(...args:any[]):{}} & {xtype: string, context?: ReadonlyArray<string>}>(Target: U): void {
        BI.model(Target.xtype, Target);
    };
}

/**
 * 类注册_store属性
 * @param Model model类
 * @param opts 额外条件
 */
export function store<T>(Model: Constructor<T> & {xtype: string}, opts: { props?(this: unknown): { [key: string]: unknown } } = {}) {
    return function classDecorator<U extends {new(...args:any[]):{}}>(constructor:U) {
        return class extends constructor {
            _store() {
                const props = opts.props ? opts.props.apply(this) : undefined;

                return BI.Models.getModel(Model.xtype, props);
            }
        };
    };
}

/**
 * Model基类
 */
export class Model<U extends {types?: {[key: string]: unknown} | {}, context?: ReadonlyArray<string>} = {}> extends Fix.Model {
    // @ts-ignore this["computed"][key]为空
    model: Pick<{[key in keyof U["types"]]: U["types"][key]}, U["context"][number]> & {[key in keyof ReturnType<this["state"]>]: ReturnType<this["state"]>[key]} & {[key in keyof this["computed"]]: ReturnType<this["computed"][key]>};

    store: this["actions"];

    state(): {[key: string]: unknown} | {} {
        return {};
    }

    context: U["context"];

    actions:{[key: string]: (...args: any[]) => any};

    childContext: ReadonlyArray<keyof (this["computed"] & ReturnType<this["state"]>)>;

    // @ts-ignore this["computed"][key]为空
    TYPE: Pick<{[key in keyof this["computed"]]: ReturnType<this["computed"][key]>} & {[key in keyof ReturnType<this["state"]>]: ReturnType<this["state"]>[key]}, this["childContext"][number]>;

    computed: {[key: string]: () => unknown} | {};
}
