export declare type _startWith = (str: string, startTag: string) => boolean;

export declare type _endWith = (str: string, endTag: string) =>  boolean;

export declare type _getQuery = (str: string, name: string) =>  string|null;

export declare type _appendQuery = (str: string, paras: {[key: string]: string|number}) => string;

export declare type _replaceAll = (str: string, s1: string, s2: string) => string;

export declare type _perfectStart = (str: string, start: string) => string;

export declare type _allIndexOf = (str: string, sub: string) => number[];
