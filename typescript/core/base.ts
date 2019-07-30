export interface _base {
    assert: (v: any, is: Function) => Boolean

    warn: (message: any) => Boolean;

    UUID: () => string;

    isWidget: (widget: any) => Boolean;

    createWidgets: (items: any, options: any, context: any) => any;

    createItems: <T, U, K>(data: T[], innerAttr?: U[], outerAttr?: K[]) => (U & T & K)[];

    packageItems: (items: any[], layouts: any[]) => any[];

    formatEL: (obj: any) => {el: any}

    stripEL: (obj: any) => any;

    trans2Element: (widgets: any[]) => any[];

    // 集合相关方法
    where: (collection: any[]|object|string, source: object) => any[];

    findWhere: (collection: any[]|object|string, callback?: Function|object|string, thisArg?: any) => object|undefined;

    invoke: (collection: any[]|object|string, methodName: Function|string, arg?: any) => any[];

    pluck: (collection: any[]|object|string, property: string) => any[];

    shuffle: (collection: any[]|object|string) => any[];

    sample: (collection: any[]|object|string, n?: number) => any[];

    toArray: (collection: any[]|object|string) => any[];

    size: (collection: any[]|object|string) => number;

    each: (collection: any[]|object|string, callback?: Function, thisArg?: any) => any;

    map: (collection: any[]|object|string, callback?: Function|object|string, thisArg?: any) => any[];

    reduce: (collection: any[]|object|string, callback?: Function, accumulator?: any, thisArg?: any) => any;

    reduceRight: (collection: any[]|object|string, callback?: Function, accumulator?: any, thisArg?: any) => any;

    find: (collection: any[]|object|string, callback?: Function|object|string, thisArg?: any) => any;

    filter: (collection: any[]|object|string, callback?: Function|object|string, thisArg?: any) => any[];

    reject: (collection: any[]|object|string, callback?: Function|object|string, thisArg?: any) => any[];

    every: (collection: any[]|object|string, callback?: Function|object|string, thisArg?: any) => boolean;

    all: (collection: any[]|object|string, callback?: Function|object|string, thisArg?: any) => boolean;

    some: (collection: any[]|object|string, callback?: Function|object|string, thisArg?: any) => boolean;

    _any: (collection: any[]|object|string, callback?: Function|object|string, thisArg?: any) => boolean;

    max: (collection: any[]|object|string, callback?: Function|object|string, thisArg?: any) => any;

    min: (collection: any[]|object|string, callback?: Function|object|string, thisArg?: any) => any;

    sortBy: (collection: any[]|object|string, callback?: Function|object|string, thisArg?: any) => any[];

    groupBy: (collection: any[]|object|string, callback?: Function|object|string, thisArg?: any) => object;

    indexBy: (collection: any[]|object|string, callback?: Function|object|string, thisArg?: any) => object;

    countBy: (collection: any[]|object|string, callback?: Function|object|string, thisArg?: any) => object;


    count: (from: number, to: number, predicate: Function) => number;

    inverse: (from: number, to: number, predicate: Function) => number;

    firstKey: (obj: object) => string;

    lastKey: (obj: object) => string;

    firstObject: (obj: object) => any;

    lastObject: (obj: object) => any;

    concat: (obj1: any, obj2: any) => any;

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

    initial: (array: any[], callback?: Function|object|number|string, thisArg?: any) => any[];

    last: <T>(array: T[], callback?: Function|object|number|string, thisArg?: any) => T;

    rest: (array: any[], callback?: Function|object|number|string, thisArg?: any) => any[];

    compact: (array: any[]) => any[];

    flatten: (array: any[], isShallow?: boolean, callback?: Function|object|string, thisArg?: any) => any[];

    without: (array: any[], value?: any) => any[];

    union: (...array: any[]) => any[];

    intersection: (...array: any[]) => any[];

    difference: (...array: any[]) => any[];

    zip: (...array: any[]) => any[];

    unzip: (...array: any[]) => any[];

    _object: (keys: string[], values?: any[]) => any[];

    indexOf: (array: any[], value: any, fromIndex?: number) => number;

    lastIndexOf: (array: any[], value: any, fromIndex?: number) => number;

    sortedIndex: (array: any[], value: any, callback?: Function|object|string, thisArg?: any) => number;

    range: (start: number, end: number, step: number) => number[];

    take: (array: any[], n: number) => any[];

    takeRight: (array: any[], n: number) => any[];

    findIndex: (array: any[], value: any, callback?: Function|object|string, thisArg?: any) => number;

    findLastIndex: (array: any[], value: any, callback?: Function|object|string, thisArg?: any) => number;

    makeArray: (length: number, value: any) => any[];

    makeObject: (array: any[], value: any) => any;

    makeArrayByArray: (array: any[], value: any) => any[];

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

    clone: (object: object) => object;

    property: (path: any[]|string) => Function;

    propertyOf: (object: object) => Function;

    isEqual: (value: any, other: any, customizer?: Function, thisArg?: any) => boolean;

    isMatch: (object: object, source: object, customizer?: Function, thisArg?: any) => boolean;

    isEmpty: (value: any[]|object|string) => boolean;

    isElement: (value: any) => boolean;

    isNumber: (value: any) => boolean;

    isString: (value: any) => boolean;

    isArray: (value: any) => boolean;

    isObject: (value: any) => boolean;

    isPlainObject: (value: any) => boolean;

    isArguments: (value: any) => boolean;

    isFunction: (value: any) => boolean;

    isFinite: (value: any) => boolean;

    isBoolean: (value: any) => boolean;

    isDate: (value: any) => boolean;

    isRegExp: (value: any) => boolean;

    isError: (value: any) => boolean;

    isNaN: (value: any) => boolean;

    isUndefined: (value: any) => boolean;

    zipObject: (props: any[], values?: any[]) => object;

    cloneDeep: (value: any, customizer?: Function, thisArg?: any) => any;

    findKey: (object: object, predicate?: Function|object|string, thisArg?: any) => any;

    pick: (object: object, predicate?: Function|string|string[], thisArg?: any) => object;

    omit: (object: object, predicate?: Function|string|string[], thisArg?: any) => object;

    tap: (value: any, interceptor: Function, thisArg?: any) => any;

    inherit: (sb: any, sp: any, overrides?: any) => any;

    init: () => void;

    has: (obj: object, keys: string[]) => boolean;

    freeze: (value: object) => object;

    isKey: (key: any) => boolean;

    isCapitalEqual: (a: string|null|undefined, b: string|null|undefined) => boolean;

    isWidthOrHeight: (w: number|string) => boolean;

    isNotNull: (obj: any) => boolean;

    isNull: (obj: any) => boolean;

    isEmptyArray: (arr: any[]) => boolean;

    isNotEmptyArray: (arr: any[]) => boolean;

    isEmptyObject: (obj: any) => boolean;

    isNotEmptyObject: (obj: any) => boolean;

    isWindow: (obj: any) => boolean;

    isDeepMatch: (object: any, attrs: any) => boolean;

    contains: (obj: any[], target: any, fromIndex: number) => number;

    deepContains: (obj: any[], copy: any) => number;

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

    bind: (func: Function, thisArg: any, ...partials: any) => Function;

    once: (func: Function) => Function;

    partial: (func: Function, ...partials: any) => Function;

    debounce: (func: Function, wait?: number, options?: any) => Function;

    throttle: (func: Function, wait?: number, options?: any) => Function;

    delay: (func: Function, wait: number, ...args: any) => number;

    defer: (func: Function, ...args: any) => number;

    wrap: (value: any, wrapper: Function) => Function;

    nextTick: (func: Function) => Promise<any>;

    random: (min?: number, max?: number, floating?: boolean) => number;

    parseInt: (s: string) => number;

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

    sum: (array: any[], iteratee: Function, context: any) => number;

    average: (array: any[], iteratee: Function, context: any) => number;

    trim: (string?: string, chars?: string) => string;

    toUpperCase: (string: string) => string;

    toLowerCase: (string: string) => string;

    isEndWithBlank: (string: string) => boolean;

    isLiteral: (string: string) => boolean;

    stripQuotes: (string: string) => string;

    camelize: (string: string) => string;

    hyphenate: (string: string) => string;

    isNotEmptyString: (string: string) => boolean;

    isEmptyString: (string: any) => boolean;

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