(function () {
    var moduleInjection = {}, moduleInjectionMap = {
        components: {},
        constants: {},
        stores: {},
        services: {},
        models: {},
        providers: {}
    };
    BI.module = BI.module || function (xtype, cls) {
        if (moduleInjection[xtype] != null) {
            _global.console && console.error("module： [" + xtype + "] 已经注册过了");
        }
        var i, len, value = {
            version: cls.version,
            moduleId: xtype
        };
        if (cls.components) {
            for (i = 0, len = cls.components.length; i < len; i++) {
                if (!moduleInjectionMap.components[cls.components[i]]) {
                    moduleInjectionMap.components[cls.components[i]] = [];
                }
                moduleInjectionMap.components[cls.components[i]].push(value);
            }
        }
        if (cls.constants) {
            for (i = 0, len = cls.constants.length; i < len; i++) {
                if (!moduleInjectionMap.constants[cls.constants[i]]) {
                    moduleInjectionMap.constants[cls.constants[i]] = [];
                }
                moduleInjectionMap.constants[cls.constants[i]].push(value);
            }
        }
        if (cls.stores) {
            for (i = 0, len = cls.stores.length; i < len; i++) {
                if (!moduleInjectionMap.stores[cls.stores[i]]) {
                    moduleInjectionMap.stores[cls.stores[i]] = [];
                }
                moduleInjectionMap.stores[cls.stores[i]].push(value);
            }
        }
        if (cls.services) {
            for (i = 0, len = cls.services.length; i < len; i++) {
                if (!moduleInjectionMap.services[cls.services[i]]) {
                    moduleInjectionMap.services[cls.services[i]] = [];
                }
                moduleInjectionMap.services[cls.services[i]].push(value);
            }
        }
        if (cls.models) {
            for (i = 0, len = cls.models.length; i < len; i++) {
                if (!moduleInjectionMap.models[cls.models[i]]) {
                    moduleInjectionMap.models[cls.models[i]] = [];
                }
                moduleInjectionMap.models[cls.models[i]].push(value);
            }
        }
        if (cls.providers) {
            for (i = 0, len = cls.providers.length; i < len; i++) {
                if (!moduleInjectionMap.providers[cls.providers[i]]) {
                    moduleInjectionMap.providers[cls.providers[i]] = [];
                }
                moduleInjectionMap.providers[cls.providers[i]].push(value);
            }
        }
        moduleInjection[xtype] = cls;
    };

    var constantInjection = {};
    BI.constant = BI.constant || function (xtype, cls) {
        if (constantInjection[xtype] != null) {
            _global.console && console.error("constant: [" + xtype + "]已经注册过了");
        }
        constantInjection[xtype] = cls;
    };

    var modelInjection = {};
    BI.model = BI.model || function (xtype, cls) {
        if (modelInjection[xtype] != null) {
            _global.console && console.error("model: [" + xtype + "] 已经注册过了");
        }
        modelInjection[xtype] = cls;
    };

    var storeInjection = {};
    BI.store = BI.store || function (xtype, cls) {
        if (storeInjection[xtype] != null) {
            _global.console && console.error("store: [" + xtype + "] 已经注册过了");
        }
        storeInjection[xtype] = cls;
    };

    var serviceInjection = {};
    BI.service = BI.service || function (xtype, cls) {
        if (serviceInjection[xtype] != null) {
            _global.console && console.error("service: [" + xtype + "] 已经注册过了");
        }
        serviceInjection[xtype] = cls;
    };

    var providerInjection = {};
    BI.provider = BI.provider || function (xtype, cls) {
        if (providerInjection[xtype] != null) {
            _global.console && console.error("provider: [" + xtype + "] 已经注册过了");
        }
        providerInjection[xtype] = cls;
    };

    var configFunctions = {};
    BI.config = BI.config || function (type, configFn, opt) {
        opt = opt || {};
        if (BI.initialized) {
            if (constantInjection[type]) {
                return (constantInjection[type] = configFn(constantInjection[type]));
            }
            if (providerInjection[type]) {
                if (!providers[type]) {
                    providers[type] = new providerInjection[type]();
                }
                // 如果config被重新配置的话，需要删除掉之前的实例
                if (providerInstance[type]) {
                    delete providerInstance[type];
                }
                return configFn(providers[type]);
            }
            return BI.Plugin.configWidget(type, configFn, opt);
        }
        if (!configFunctions[type]) {
            configFunctions[type] = [];
            BI.prepares.push(function () {
                var queue = configFunctions[type];
                var dependencies = BI.Providers.getProvider("bi.provider.system").getDependencies();
                var modules = moduleInjectionMap.components[type]
                    || moduleInjectionMap.constants[type]
                    || moduleInjectionMap.services[type]
                    || moduleInjectionMap.stores[type]
                    || moduleInjectionMap.models[type]
                    || moduleInjectionMap.providers[type];
                for (var i = 0; i < queue.length; i++) {
                    if(modules) {
                        for (var j = 0; j < modules.length; j++) {
                            var module = modules[i];
                            if (module && dependencies[module.moduleId]) {
                                if (module.version < dependencies[module.moduleId].min || module.version > dependencies[module.moduleId].max) {
                                    _global.console && console.error("module: [" + type + "] 版本: [" + module.version + "] 已过期");
                                    continue;
                                }
                            }
                        }
                    }
                    if (module && dependencies[module.moduleId]) {
                        if (module.version < dependencies[module.moduleId].min || module.version > dependencies[module.moduleId].max) {
                            _global.console && console.error("module: [" + type + "] 版本: [" + module.version + "] 已过期");
                            continue;
                        }
                    }
                    if (constantInjection[type]) {
                        constantInjection[type] = queue[i](constantInjection[type]);
                        continue;
                    }
                    if (providerInjection[type]) {
                        if (!providers[type]) {
                            providers[type] = new providerInjection[type]();
                        }
                        if (providerInstance[type]) {
                            delete providerInstance[type];
                        }
                        queue[i](providers[type]);
                        continue;
                    }
                    BI.Plugin.configWidget(type, queue[i]);
                }
                configFunctions[type] = null;
            });
        }
        configFunctions[type].push({
            fn: configFn,
            opt: opt
        });
    };

    BI.getReference = BI.getReference || function (type, fn) {
        return BI.Plugin.registerObject(type, fn);
    };

    var actions = {};
    var globalAction = [];
    BI.action = BI.action || function (type, actionFn) {
        if (BI.isFunction(type)) {
            globalAction.push(type);
            return function () {
                BI.remove(globalAction, function (idx) {
                    return globalAction.indexOf(actionFn) === idx;
                });
            };
        }
        if (!actions[type]) {
            actions[type] = [];
        }
        actions[type].push(actionFn);
        return function () {
            BI.remove(actions[type], function (idx) {
                return actions[type].indexOf(actionFn) === idx;
            });
            if (actions[type].length === 0) {
                delete actions[type];
            }
        };
    };

    var points = {};
    BI.point = BI.point || function (type, action, pointFn, after) {
        if (!points[type]) {
            points[type] = {};
        }
        if (!points[type][action]) {
            points[type][action] = {};
        }
        if (!points[type][action][after ? "after" : "before"]) {
            points[type][action][after ? "after" : "before"] = [];
        }
        points[type][action][after ? "after" : "before"].push(pointFn);
    };

    BI.Modules = BI.Modules || {
        getModule: function (type) {
            if (!moduleInjection[type]) {
                _global.console && console.error("module: [" + type + "] 未定义");
            }
            return moduleInjection[type];
        },
        getAllModules: function () {
            return moduleInjection;
        }
    };

    BI.Constants = BI.Constants || {
        getConstant: function (type) {
            if (!constantInjection[type]) {
                _global.console && console.error("constant: [" + type + "] 未定义");
            }
            return constantInjection[type];
        }
    };

    var callPoint = function (inst, types) {
        types = BI.isArray(types) ? types : [types];
        BI.each(types, function (idx, type) {
            if (points[type]) {
                for (var action in points[type]) {
                    var bfns = points[type][action].before;
                    if (bfns) {
                        BI.aspect.before(inst, action, function (bfns) {
                            return function () {
                                for (var i = 0, len = bfns.length; i < len; i++) {
                                    try {
                                        bfns[i].apply(inst, arguments);
                                    } catch (e) {
                                        _global.console && console.error(e);
                                    }
                                }
                            };
                        }(bfns));
                    }
                    var afns = points[type][action].after;
                    if (afns) {
                        BI.aspect.after(inst, action, function (afns) {
                            return function () {
                                for (var i = 0, len = afns.length; i < len; i++) {
                                    try {
                                        afns[i].apply(inst, arguments);
                                    } catch (e) {
                                        _global.console && console.error(e);
                                    }
                                }
                            };
                        }(afns));
                    }
                }
            }
        });
    };

    BI.Models = BI.Models || {
        getModel: function (type, config) {
            if (!modelInjection[type]) {
                _global.console && console.error("model: [" + type + "] 未定义");
            }
            var inst = new modelInjection[type](config);
            inst._constructor && inst._constructor(config);
            inst.mixins && callPoint(inst, inst.mixins);
            callPoint(inst, type);
            return inst;
        }
    };

    var stores = {};

    BI.Stores = BI.Stores || {
        getStore: function (type, config) {
            if (!storeInjection[type]) {
                _global.console && console.error("store: [" + type + "] 未定义");
            }
            if (stores[type]) {
                return stores[type];
            }
            var inst = stores[type] = new storeInjection[type](config);
            inst._constructor && inst._constructor(config, function () {
                delete stores[type];
            });
            callPoint(inst, type);
            return inst;
        }
    };

    var services = {};

    BI.Services = BI.Services || {
        getService: function (type, config) {
            if (!serviceInjection[type]) {
                _global.console && console.error("service: [" + type + "] 未定义");
            }
            if (services[type]) {
                return services[type];
            }
            services[type] = new serviceInjection[type](config);
            callPoint(services[type], type);
            return services[type];
        }
    };

    var providers = {},
        providerInstance = {};

    BI.Providers = BI.Providers || {
        getProvider: function (type, config) {
            if (!providerInjection[type]) {
                _global.console && console.error("provider: [" + type + "] 未定义");
            }
            if (!providers[type]) {
                providers[type] = new providerInjection[type]();
            }
            if (!providerInstance[type]) {
                providerInstance[type] = new (providers[type].$get())(config);
            }
            return providerInstance[type];
        }
    };

    BI.Actions = BI.Actions || {
        runAction: function (type, event, config) {
            BI.each(actions[type], function (i, act) {
                try {
                    act(event, config);
                } catch (e) {
                    _global.console && console.error(e);
                }
            });
        },
        runGlobalAction: function () {
            var args = [].slice.call(arguments);
            BI.each(globalAction, function (i, act) {
                try {
                    act.apply(null, args);
                } catch (e) {
                    _global.console && console.error(e);
                }
            });
        }
    };

    BI.getResource = BI.getResource || function (type, config) {
        if (constantInjection[type]) {
            return BI.Constants.getConstant(type);
        }
        if (modelInjection[type]) {
            return BI.Models.getModel(type, config);
        }
        if (storeInjection[type]) {
            return BI.Stores.getStore(type, config);
        }
        if (serviceInjection[type]) {
            return BI.Services.getService(type, config);
        }
        if (providerInjection[type]) {
            return BI.Providers.getProvider(type, config);
        }
        throw new Error("未知类型: [" + type + "] 未定义");
    };
})();
