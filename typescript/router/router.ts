export declare class Router {
    constructor(op: {[key: string]: any});

    route(route: string, callback: Function): this;
    route(route: string, name: string, callback?: Function): this;

    execute(callback?: Function, args?: any[]): void;

    navigate(fragment: string, options?: {[key: string]: any} | boolean): this;
}

export declare class History {
    atRoot(): boolean;

    getSearch(): string;

    getHash(window?: Window): string;

    getPath(): string;

    getFragment(fragment?: string): string;

    start(op?: {[key: string]: any}): void;

    stop(): void;

    route(route: string, callback: Function): void;

    checkRoute(route: string): { route: string, callback: Function};

    unRoute(route: string): void;

    checkUrl(e?: Event): void;

    loadUrl(fragment: string): boolean;

    navigate(fragment: string, options?: {[key: string]: any} | boolean): void;
}
