type _module = (xtype: string, cls: any) => void;
type _constant = <T>(xtype: string, cls: T) => (() => T);
type _model = (xtype: string, cls: any) => Function;
type _store = (xtype: string, cls: any) => Function;
type _service = (xtype: string, cls: any) => Function;
type _provider = (xtype: string, cls: any) => Function;

interface _modules {
    getModule: (type: string) => any;
    getAllModules: () => any;
}

interface _constants {
    getConstant: (type: string) => any;
}

interface _models {
    getModel: (type: string, options?: any) => any;
}

interface _stores {
    getStore: (type: string, options?: any) => any;
}

interface _providers {
    getProvider: (type: string, options?: any) => any;
}

interface _services {
    getService: (type: string, options?: any) => any;
}


export type _inject = {
    module: _module;
    constant: _constant;
    model: _model;
    store: _store;
    provider: _provider;
    service: _service;
    Modules: _modules;
    Constants: _constants;
    Models: _models;
    Stores: _stores;
    Providers: _providers;
    Services: _services;
}
