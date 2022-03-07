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
        if (BI.isFunction(cls)) {
            cls = cls();
        }
        for (var k in moduleInjectionMap) {
            if (cls[k]) {
                for (var key in cls[k]) {
                    if (!moduleInjectionMap[k]) {
                        continue;
                    }
                    if (!moduleInjectionMap[k][key]) {
                        moduleInjectionMap[k][key] = [];
                    }
                    moduleInjectionMap[k][key].push({
                        version: cls[k][key],
                        moduleId: xtype
                    });
                }
            }
        }
        moduleInjection[xtype] = cls;
        return function () {
            return BI.Modules.getModule(xtype);
        };
    };

    var constantInjection = {};
    BI.constant = BI.constant || function (xtype, cls) {
        if (constantInjection[xtype] != null) {
            _global.console && console.error("constant: [" + xtype + "]已经注册过了");
        }
        constantInjection[xtype] = cls;
        return function () {
            return BI.Constants.getConstant(xtype);
        };
    };

    var modelInjection = {};
    BI.model = BI.model || function (xtype, cls) {
        if (modelInjection[xtype] != null) {
            _global.console && console.error("model: [" + xtype + "] 已经注册过了");
        }
        modelInjection[xtype] = cls;
        return function (config) {
            return BI.Models.getModel(xtype, config);
        };
    };

    var storeInjection = {};
    BI.store = BI.store || function (xtype, cls) {
        if (storeInjection[xtype] != null) {
            _global.console && console.error("store: [" + xtype + "] 已经注册过了");
        }
        storeInjection[xtype] = cls;
        return function (config) {
            return BI.Stores.getStore(xtype, config);
        };
    };

    var serviceInjection = {};
    BI.service = BI.service || function (xtype, cls) {
        if (serviceInjection[xtype] != null) {
            _global.console && console.error("service: [" + xtype + "] 已经注册过了");
        }
        serviceInjection[xtype] = cls;
        return function (config) {
            return BI.Services.getService(xtype, config);
        };
    };

    var providerInjection = {};
    BI.provider = BI.provider || function (xtype, cls) {
        if (providerInjection[xtype] != null) {
            _global.console && console.error("provider: [" + xtype + "] 已经注册过了");
        }
        providerInjection[xtype] = cls;
        return function (config) {
            return BI.Providers.getProvider(xtype, config);
        };
    };

    var configFunctions = BI.OB.configFunctions = {};
    var runConfigFunction = function (type) {
        if (!type || !configFunctions[type]) {
            return false;
        }
        var queue = configFunctions[type];
        delete configFunctions[type];

        var dependencies = BI.Providers.getProvider("bi.provider.system").getDependencies();
        var modules = moduleInjectionMap.components[type]
            || moduleInjectionMap.constants[type]
            || moduleInjectionMap.services[type]
            || moduleInjectionMap.stores[type]
            || moduleInjectionMap.models[type]
            || moduleInjectionMap.providers[type];
        for (var i = 0; i < queue.length; i++) {
            var conf = queue[i];
            var version = conf.opt.version;
            var fn = conf.fn;
            if (modules && version) {
                var findVersion = false;
                for (var j = 0; j < modules.length; j++) {
                    var module = modules[j];
                    if (module && dependencies[module.moduleId] && module.version === version) {
                        var minVersion = dependencies[module.moduleId].minVersion,
                            maxVersion = dependencies[module.moduleId].maxVersion;
                        if (minVersion && (moduleInjection[module.moduleId].version || version) < minVersion) {
                            findVersion = true;
                            break;
                        }
                        if (maxVersion && (moduleInjection[module.moduleId].version || version) > maxVersion) {
                            findVersion = true;
                            break;
                        }
                    }
                }
                if (findVersion === true) {
                    _global.console && console.error("moduleId: [" + module.moduleId + "] 接口: [" + type + "] 接口版本: [" + version + "] 已过期，版本要求为：", dependencies[module.moduleId], "=>", moduleInjection[module.moduleId]);
                    continue;
                }
            }
            if (constantInjection[type]) {
                constantInjection[type] = fn(constantInjection[type]);
                continue;
            }
            if (providerInjection[type]) {
                if (!providers[type]) {
                    providers[type] = new providerInjection[type]();
                }
                if (providerInstance[type]) {
                    delete providerInstance[type];
                }
                fn(providers[type]);
                continue;
            }
            BI.Plugin.configWidget(type, fn, conf.opt);
        }
    };
    BI.config = BI.config || function (type, configFn, opt) {
        if (BI.isFunction(type)) {
            opt = configFn;
            configFn = type;
            type = "bi.provider.system";
        }
        opt = opt || {};

        // 系统配置直接执行
        if ("bi.provider.system" === type) {
            if (!providers[type]) {
                providers[type] = new providerInjection[type]();
            }
            // 如果config被重新配置的话，需要删除掉之前的实例
            if (providerInstance[type]) {
                delete providerInstance[type];
            }
            return configFn(providers[type]);
        }

        if (!configFunctions[type]) {
            configFunctions[type] = [];
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
            if (BI.isNull(constantInjection[type])) {
                _global.console && console.error("constant: [" + type + "] 未定义");
            }
            runConfigFunction(type);
            return BI.isFunction(constantInjection[type]) ? constantInjection[type]() : constantInjection[type];
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
            runConfigFunction(type);
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
            runConfigFunction(type);
            if (!providers[type]) {
                providers[type] = new providerInjection[type]();
            }
            if (!providerInstance[type] && providers[type].$get) {
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

    var kv = {};
    BI.shortcut = BI.component = BI.shortcut || function (xtype, cls) {
        if (kv[xtype] != null) {
            _global.console && console.error("组件： [" + xtype + "] 已经注册过了");
        }
        if (cls) {
            cls["xtype"] = xtype;
        }
        kv[xtype] = cls;
    };

    // 根据配置属性生成widget
    var createWidget = function (config, context, lazy) {
        var cls = kv[config.type];

        if (!cls) {
            throw new Error("组件： [" + config.type + "] 未定义");
        }
        var pushed = false;
        var widget = new cls();
        widget._context = BI.Widget.context || context;
        if (!BI.Widget.context && context) {
            pushed = true;
            BI.Widget.pushContext(context);
        }
        callPoint(widget, config.type);
        widget._initProps(config);
        widget._initRoot();
        widget._constructed();
        // if (!lazy || config.element || config.root) {
        widget._lazyConstructor();
        // }
        pushed && BI.Widget.popContext();
        return widget;
    };

    BI.createWidget = BI.createWidget || function (item, options, context, lazy) {
        item || (item = {});
        if (BI.isWidget(options)) {
            context = options;
            options = {};
        } else {
            options || (options = {});
        }

        var el, w;
        if (item.type || options.type) {
            el = BI.extend({}, options, item);
        } else if (item.el && (item.el.type || options.type)) {
            el = BI.extend({}, options, item.el);
        }

        if (el) {
            runConfigFunction(el.type);
        }

        // 先把准备环境准备好
        BI.init();

        if (BI.isEmpty(item) && BI.isEmpty(options)) {
            return BI.createWidget({
                type: "bi.layout"
            });
        }
        if (BI.isWidget(item)) {
            return item;
        }
        if (el) {
            w = BI.Plugin.getWidget(el.type, el);
            if (w.type === el.type) {
                if (BI.Plugin.hasObject(el.type)) {
                    w.listeners = (w.listeners || []).concat([{
                        eventName: BI.Events.MOUNT,
                        action: function () {
                            BI.Plugin.getObject(el.type, this);
                        }
                    }]);
                }
                return createWidget(w, context, lazy);
            }
            return BI.createWidget(w, options, context, lazy);
        }
        if (BI.isWidget(item.el)) {
            return item.el;
        }
        throw new Error("组件：无法根据item创建组件", item);
    };

    BI._lazyCreateWidget = BI._lazyCreateWidget || function (item, options, context) {
        return BI.createWidget(item, options, context, true);
    };

    BI.createElement = BI.createElement || function () {
        var widget = BI.createWidget.apply(this, arguments);
        return widget.element;
    };

    BI.getResource = BI.getResource || function (type, config) {
        if (BI.isNotNull(constantInjection[type])) {
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
