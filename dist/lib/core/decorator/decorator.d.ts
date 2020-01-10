export declare type Constructor<T> = new (...args: any[]) => T;
/**
 * 注册widget
 */
export declare function shortcut(): <U>(Target: Constructor<U> & {
    xtype: string;
}) => void;
/**
 * 注册model
 */
export declare function model(): <U extends (new (...args: any[]) => {}) & {
    xtype: string;
    context?: readonly string[] | undefined;
}>(Target: U) => void;
/**
 * 类注册_store属性
 * @param Model model类
 * @param opts 额外条件
 */
export declare function store<T>(Model: Constructor<T> & {
    xtype: string;
}, opts?: {
    props?(this: unknown): {
        [key: string]: unknown;
    };
}): <U extends new (...args: any[]) => {}>(constructor: U) => {
    new (...args: any[]): {
        _store(): any;
    };
} & U;
/**
 * Model基类
 */
export declare class Model<U extends {
    types?: {
        [key: string]: unknown;
    } | {};
    context?: ReadonlyArray<string>;
} = {}> extends Fix.Model {
    model: Pick<{
        [key in keyof U["types"]]: U["types"][key];
    }, U["context"][number]> & {
        [key in keyof ReturnType<this["state"]>]: ReturnType<this["state"]>[key];
    } & {
        [key in keyof this["computed"]]: ReturnType<this["computed"][key]>;
    };
    store: this["actions"];
    state(): {
        [key: string]: unknown;
    } | {};
    context: U["context"];
    actions: {
        [key: string]: (...args: any[]) => any;
    };
    childContext: ReadonlyArray<keyof (this["computed"] & ReturnType<this["state"]>)>;
    TYPE: Pick<{
        [key in keyof this["computed"]]: ReturnType<this["computed"][key]>;
    } & {
        [key in keyof ReturnType<this["state"]>]: ReturnType<this["state"]>[key];
    }, this["childContext"][number]>;
    computed: {
        [key: string]: () => unknown;
    } | {};
}
