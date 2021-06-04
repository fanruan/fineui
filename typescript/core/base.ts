import { _Widget } from "./widget";

export interface _base {
    assert: (v: any, is: Function) => Boolean

    warn: (message: any) => Boolean;

    UUID: () => string;

    isWidget: (widget: any) => widget is _Widget;

    createWidgets: (items: any, options: any, context: any) => any;

    createItems: <T, U, K>(data: T[], innerAttr?: U, outerAttr?: K) => (U & T & K)[];

    packageItems: (items: any[], layouts: any[]) => any[];

    formatEL: <T>(obj: T) => {el: T} | T

    stripEL: <T>(obj: {el: T} | T) => T;

    trans2Element: (widgets: any[]) => any[];

    // 集合相关方法
    where: (collection: any[]|object|string, source: object) => any[];

    findWhere: (collection: any[]|object|string, callback?: Function|object|string, thisArg?: any) => object|undefined;

    invoke: (collection: any[]|object|string, methodName: Function|string, arg?: any) => any[];

    pluck: (collection: any[]|object|string, property: string) => any[];

    shuffle: (collection: any[]|object|string) => any[];

    sample: (collection: any[]|object|string, n?: number) => any[];

    toArray: (collection: any[]|object|string) => any[];

    size: (collection: any) => number;

    each: <T>(collection: T[]|object|string, callback?: ((index: number, value: T) => void)|object|string, thisArg?: any) => any;

    map: <T, U>(collection: T[]|object|string|null|undefined, callback?: ((index: number, value: T) => U)|object|string, thisArg?: any) => U[];

    reduce: <T, U>(collection: T[]|object|string, callback?: ((total: U extends T ? U : T, currentValue: T, currentIndex: number) => U extends T ? U : T)|object|string, initialValue?: U|T) => U extends T ? U : T;

    reduceRight: <T, U>(collection: T[]|object|string, callback?: ((total: U extends T ? U : T, currentValue: T, currentIndex: number) => U extends T ? U : T)|object|string, initialValue?: U|T) => U extends T ? U : T;

    find: <T>(collection: T[]|object|string, callback?: ((index: number, value: T) => boolean)|object|string, thisArg?: any) => T | undefined;

    filter: <T>(collection: T[]|object|string, callback?: ((index: number, value: T) => boolean)|object|string, thisArg?: any) => T[];

    reject: <T>(collection: T[]|object|string, callback?: ((index: number, value: T) => boolean)|object|string, thisArg?: any) => T[];

    every: <T>(collection: T[]|object|string, callback?: ((index: number, value: T) => boolean)|object|string, thisArg?: any) => boolean;

    all: <T>(collection: T[]|object|string, callback?: ((index: number, value: T) => boolean)|object|string, thisArg?: any) => boolean;

    some: <T>(collection: T[]|object|string, callback?: ((index: number, value: T) => boolean)|object|string, thisArg?: any) => boolean;

    any: <T>(collection: T[]|object|string, callback?: ((index: number, value: T) => boolean)|object|string, thisArg?: any) => boolean;

    max: <T>(collection: T[]) => T;

    min: <T>(collection: T[]) => T;

    sortBy: <T>(collection: any[]|object|string, callback?: ((index: number, value: T) => number)|object|string, thisArg?: any) => any[];

    groupBy: <T>(collection: any[]|object|string, callback?: ((index: number, value: T) => any)|object|string, thisArg?: any) => object;

    indexBy: <T>(collection: any[]|object|string, callback?: ((index: number, value: T) => any)|object|string, thisArg?: any) => object;

    countBy: <T>(collection: any[]|object|string, callback?: ((index: number, value: T) => any)|object|string, thisArg?: any) => object;


    count: (from: number, to: number, predicate: Function) => number;

    inverse: (from: number, to: number, predicate: Function) => number;

    firstKey: (obj: object) => string;

    lastKey: (obj: object) => string;

    firstObject: (obj: object) => any;

    lastObject: (obj: object) => any;

    concat: (obj1: any, obj2: any, ...args: any[]) => any;

    backEach: (obj: any, predicate: Function, context?: any) => boolean;

    backAny: (obj: any, predicate: Function, context?: any) => boolean;

    backEvery: (obj: any, predicate: Function, context?: any) => boolean;

    backFindKey: (obj: any, predicate: Function, context?: any) => string;

    backFind: (obj: any, predicate: Function, context?: any) => any;

    remove: (obj: any, predicate: any, context?: any) => void;

    removeAt: (obj: any, index: number|number[]) => void;

    string2Array: (str: string) => string[];

    array2String: (array: any[]) => string;

    abc2Int: (str: string) => number;

    int2Abc: (num: number) => string;

    // 数组相关的方法
    first: <T>(array: T[], callback?: Function|object|number|string, thisArg?: any) => T;

    initial: <T>(array: T[], callback?: Function|object|number|string, thisArg?: any) => T[];

    last: <T>(array: T[], callback?: Function|object|number|string, thisArg?: any) => T;

    rest: <T>(array: T[], callback?: Function|object|number|string, thisArg?: any) => T[];

    compact: (array: any[]) => any[];

    flatten: (array: any[], isShallow?: boolean, callback?: Function|object|string, thisArg?: any) => any[];

    without: (array: any[], value?: any) => any[];

    union: (...array: any[]) => any[];

    intersection: (...array: any[]) => any[];

    difference: (...array: any[]) => any[];

    zip: (...array: any[]) => any[];

    unzip: (...array: any[]) => any[];

    object: (keys: string[], values?: any[]) => any[];

    indexOf: (array: any[], value: any, fromIndex?: number) => number;

    lastIndexOf: (array: any[], value: any, fromIndex?: number) => number;

    sortedIndex: (array: any[], value: any, callback?: Function|object|string, thisArg?: any) => number;

    range: (start: number, end: number, step: number) => number[];

    take: <T>(array: T[], n: number) => T[];

    takeRight: <T>(array: T[], n: number) => T[];

    findIndex: (array: any[], value: any, callback?: Function|object|string, thisArg?: any) => number;

    findLastIndex: (array: any[], value: any, callback?: Function|object|string, thisArg?: any) => number;

    makeArray: <T>(length: number, value?: T) => number[] | T[];

    makeObject: (array: any[], value: any) => any;

    makeArrayByArray: <T>(array: any[], value: T) => T[];

    uniq: <T>(array: T[], isSorted?: boolean, iteratee?: any, context?: any) => T[];

    // 对象相关方法
    keys: (object: object) => string[];

    allKeys: (object: object) => string[];

    values: (object: object) => any[];

    pairs: (object: object) => any[];

    invert: (object: object, multiValue: boolean) => object;

    create: (prototype: object, properties?: object) => object;

    functions: (object: object) => string[];

    extend: (object: object, ...sources: any[]) => object;

    defaults: (object: object, ...sources: any[]) => object;

    clone: <T>(object: T) => T;

    property: (path: any[]|string) => Function;

    propertyOf: (object: object) => Function;

    isEqual: (value: any, other: any, customizer?: Function, thisArg?: any) => boolean;

    isMatch: (object: object, source: object, customizer?: Function, thisArg?: any) => boolean;

    isEmpty: (value: any[]|object|string|null|undefined|number) => boolean;

    isElement: (value: any) => boolean;

    isNumber: (value: any) => value is number;

    isString: (value: any) => value is string;

    isArray: <T>(value: T[] | any) => value is T[];

    isObject: (value: any) => value is object;

    isPlainObject: (value: any) => value is object;

    isArguments: (value: any) => boolean;

    isFunction: (value: any) => value is Function;

    isFinite: (value: any) => value is number;

    isBoolean: (value: any) => value is boolean;

    isDate: (value: any) => value is Date;

    isRegExp: (value: any) => value is RegExp;

    isError: (value: any) => value is Error;

    isNaN: (value: any) => value is number;

    isUndefined: (value: any) => value is undefined;

    zipObject: (props: any[], values?: any[]) => object;

    cloneDeep: <T>(value: T) => T;

    findKey: (object: object, predicate?: Function|object|string, thisArg?: any) => any;

    pick: (object: object, predicate?: Function|string|string[], thisArg?: any) => object;

    omit: (object: object, predicate?: Function|string|string[], thisArg?: any) => object;

    tap: (value: any, interceptor: Function, thisArg?: any) => any;

    inherit: (sb: any, sp: any, overrides?: any) => any;

    init: () => void;

    has: (obj: object, keys: string|string[]) => boolean;

    freeze: <T>(value: T) => T;

    isKey: (key: any) => key is (number | string);

    isCapitalEqual: (a: string|null|undefined, b: string|null|undefined) => boolean;

    isWidthOrHeight: (w: number|string) => boolean;

    isNotNull: <T>(obj: T) => obj is NonNullable<T>;

    isNull: (obj: any) => obj is (undefined | null);

    isEmptyArray: <T, U>(arr: T[] | U) => arr is T[] & {length: 0};

    isNotEmptyArray: <T, U>(arr: T[] | U) => arr is [T, ...T[]];

    isEmptyObject: (obj: any) => boolean;

    isNotEmptyObject: (obj: any) => obj is object;

    isWindow: (obj: any) => obj is Window;

    deepClone: <T>(obj: T) => T;

    deepExtend: merge['deepExtend'];

    isDeepMatch: (object: any, attrs: any) => boolean;

    contains: (obj: any[], target: any, fromIndex?: number) => boolean;

    deepContains: (obj: any[], copy: any) => boolean;

    deepIndexOf: (obj: any[], target: any) => number;

    deepRemove: (obj: any[], target: any) => boolean;

    deepWithout: (obj: any[], target: any) => any[];

    deepUnique: (array: any[]) => any[];

    deepDiff: (object: any, other: any) => string[];

    uniqueId: (prefix?: string) => string;

    result: (object: any, key: string) => any;

    chain: (value: any) => any;

    iteratee: (func?: Function, thisArg?: any) => Function;

    unescape: (str?: string) => string;

    bind: <T extends Function>(func: T, thisArg: any, ...partials: any) => T;

    once: (func: Function) => Function;

    partial: (func: Function, ...partials: any) => Function;

    debounce: <T extends Function>(func: T, wait?: number, options?: any) => T;

    throttle: <T extends Function>(func: T, wait?: number, options?: any) => T;

    delay: (func: Function, wait: number, ...args: any[]) => number;

    defer: (func: Function, ...args: any[]) => number;

    wrap: (value: any, wrapper: Function) => Function;

    nextTick: (func: Function) => Promise<any>;

    random: (min?: number, max?: number, floating?: boolean) => number;

    parseInt: (s: string | number) => number;

    parseSafeInt: (s: string) => number;

    parseFloat: (string: string) => number;

    isNaturalNumber: (value: string|number) => boolean;

    isPositiveInteger: (value: string|number) => boolean;

    isNegativeInteger: (value: string|number) => boolean;

    isInteger: (value: string|number) => boolean;

    isNumeric: (value: string|number) => boolean;

    isFloat: (value: string|number) => boolean;

    isOdd: (value: string|number) => boolean;

    isEven: (value: string|number) => boolean;

    sum: (array: any[], iteratee?: Function, context?: any) => number;

    average: (array: any[], iteratee?: Function, context?: any) => number;

    trim: (string?: string, chars?: string) => string;

    toUpperCase: (string: string) => string;

    toLowerCase: (string: string) => string;

    isEndWithBlank: (string: string) => boolean;

    isLiteral: (string: string) => boolean;

    stripQuotes: (string: string) => string;

    camelize: (string: string) => string;

    hyphenate: (string: string) => string;

    isNotEmptyString: (string: any) => boolean;

    isEmptyString: (str: any) => str is "";

    encrypt: (type: string, text: string, key: string) => string;

    escape: (string: string) => string;

    leftPad: (val: string, size: number, ch: string) => string;

    format: (format: string, ...str: string[]) => string;

    isLeapYear: (year: number) => boolean;

    checkDateVoid: (YY: string | number, MM: string | number, DD: string | number, minDate: string, maxDate: string) => (number|string)[];

    checkDateLegal: (str: string) => boolean;

    parseDateTime: (str: string, fmt: string) => Date;

    getDate: (...args: (number | string)[]) => Date;

    getTime: (...args: any[]) => number;
}

type merge = {
    deepExtend<TObject, TSource>(object: TObject, source: TSource): TObject & TSource;

    deepExtend<TObject, TSource1, TSource2>(object: TObject, source1: TSource1, source2: TSource2): TObject & TSource1 & TSource2;

    deepExtend<TObject, TSource1, TSource2>(object: TObject, source1: TSource1, source2: TSource2): TObject & TSource1 & TSource2;

    deepExtend<TObject, TSource1, TSource2, TSource3>(object: TObject, source1: TSource1, source2: TSource2, source3: TSource3): TObject & TSource1 & TSource2 & TSource3;

    deepExtend<TObject, TSource1, TSource2, TSource3, TSource4>(object: TObject, source1: TSource1, source2: TSource2, source3: TSource3, source4: TSource4): TObject & TSource1 & TSource2 & TSource3 & TSource4;

    deepExtend(object: any, ...otherArgs: any[]): any;
}
