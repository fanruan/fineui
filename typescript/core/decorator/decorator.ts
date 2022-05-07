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
 * 注册provider
 */
export function provider() {
    return function decorator<U>(Target: Constructor<U> & {xtype: string}): void {
        BI.provider(Target.xtype, Target);
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
 * 注册mixin
 * ie8下不能使用
 */
export function mixin<T>() {
    return function decorator(Target: Constructor<T> & { xtype: string }): void {
        const mixin: {
            [key: string]: Function;
        } = {};

        Object.getOwnPropertyNames(Target.prototype).forEach(name => {
            if (name === 'constructor') {
                return;
            }

            mixin[name] = Target.prototype[name];
        });

        Fix.mixin(Target.xtype, mixin);
    };
}

/**
 * 类注册mixins属性
 * ie8下不能使用
 * @param Mixins
 */
export function mixins(...Mixins: ({ new (...args: any[]): {} } & { xtype: string })[]) {
    return function classDecorator<U extends { new (...args: any[]): {} }>(constructor: U) {
        const mixins: string[] = [];

        Mixins.forEach(mixin => {
            mixin.xtype && mixins.push(mixin.xtype);
        });

        return class extends constructor {
            mixins = mixins;
        };
    };
}

/**
 * Model基类
 */
export class Model<U extends {types?: {[key: string]: unknown} | {}, context?: ReadonlyArray<string>} = {}> extends Fix.Model {
    // @ts-ignore this["computed"][key]为空
    model: Pick<{[key in keyof U["types"]]: U["types"][key]}, U["context"][number]> & ReturnType<this["state"]> & {[key in keyof this["computed"]]: ReturnType<this["computed"][key]>};

    store: this["actions"];

    state(): {[key: string]: unknown} | {} {
        return {};
    }

    context: U["context"];

    actions:{[key: string]: (...args: any[]) => any} | {};

    childContext: ReadonlyArray<keyof (this["computed"] & ReturnType<this["state"]>)>;

    // @ts-ignore this["computed"][key]为空
    TYPE: Pick<{[key in keyof this["computed"]]: ReturnType<this["computed"][key]>} & {[key in keyof ReturnType<this["state"]>]: ReturnType<this["state"]>[key]}, this["childContext"][number]>;

    computed: {[key: string]: () => unknown} | {};
}

/* 分享一段很好看的代码
// union to intersection of functions
type UnionToIoF<U> =
    (U extends any ? (k: (x: U) => void) => void : never) extends
    ((k: infer I) => void) ? I : never

// return last element from Union
type UnionPop<U> = UnionToIoF<U> extends { (a: infer A): void; } ? A : never;

// prepend an element to a tuple.
type Prepend<U, T extends ReadonlyArray<any>> =
    ((a: U, ...r: T) => void) extends (...r: infer R) => void ? R : never;

type UnionToTupleRecursively<Union, Result extends ReadonlyArray<any>> = {
    1: Result;
    0: UnionToTupleRecursively_<Union, UnionPop<Union>, Result>;
    // 0: UnionToTupleRecursively<Exclude<Union, UnionPop<Union>>, Prepend<UnionPop<Union>, Result>>
}[[Union] extends [never] ? 1 : 0];

type UnionToTupleRecursively_<Union, Element, Result extends ReadonlyArray<any>> =
    UnionToTupleRecursively<Exclude<Union, Element>, Prepend<Element, Result>>;

type UnionToTuple<U> = UnionToTupleRecursively<U, []>;
*/
