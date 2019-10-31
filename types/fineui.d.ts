interface Obj {
    [key: string]: any;
}

declare let BI: Obj & import("../typescript/index")._BI;

// declare let BI: Obj;

declare const Fix: Obj;

declare interface String {
    replaceAll(regx: string, callback: (str: string) => void): string;
}
