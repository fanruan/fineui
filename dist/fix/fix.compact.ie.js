;(function () {
    function initWatch(vm, watch) {
        vm._watchers || (vm._watchers = []);
        for (var key in watch) {
            var handler = watch[key];
            if (BI.isArray(handler)) {
                for (var i = 0; i < handler.length; i++) {
                    vm._watchers.push(createWatcher(vm, key, handler[i]));
                }
            } else {
                vm._watchers.push(createWatcher(vm, key, handler));
            }
        }
    }

    function createWatcher(vm, keyOrFn, handler) {
        return Fix.watch(vm.store, keyOrFn, _.bind(handler, vm), {
            store: vm.store
        });
    }

    var target = null;
    var targetStack = [];

    function pushTarget(_target) {
        if (target) targetStack.push(target);
        Fix.Model.target = target = _target;
    }

    function popTarget() {
        Fix.Model.target = target = targetStack.pop();
    }

    var context = null;
    var contextStack = [];

    function pushContext(_context) {
        if (context) contextStack.push(context);
        Fix.Model.context = context = _context;
    }

    function popContext() {
        Fix.Model.context = context = contextStack.pop();
    }

    var oldWatch = Fix.watch;
    Fix.watch = function (model, expOrFn, cb, options) {
        if (BI.isPlainObject(cb)) {
            options = cb;
            cb = cb.handler;
        }
        if (typeof cb === "string") {
            cb = model[cb];
        }
        return oldWatch.call(this, model, expOrFn, function () {
            options && options.store && pushTarget(options.store);
            var res = cb.apply(this, arguments);
            options && options.store && popTarget();
            return res;
        }, options);
    };

    function findStore(widget) {
        if (target != null) {
            return target;
        }
        widget = widget || context;
        var p = widget;
        while (p) {
            if (p instanceof Fix.Model || p.store || p.__cacheStore) {
                break;
            }
            p = p._parent || (p.options && p.options.element);
        }
        if (p) {
            if (p instanceof Fix.Model) {
                return widget.__cacheStore = p;
            }
            widget.__cacheStore = p.store || p.__cacheStore;
            return p.__cacheStore || p.store;
        }
    }

    var _create = BI.createWidget;
    BI.createWidget = function (item, options, context) {
        var pushed = false;
        if (BI.isWidget(options)) {
            pushContext(options);
            pushed = true;
        } else if (context != null) {
            pushContext(context);
            pushed = true;
        }
        var result = _create.apply(this, arguments);
        pushed && popContext();
        return result;
    };

    _.each(["populate", "addItems", "prependItems"], function (name) {
        var old = BI.Loader.prototype[name];
        BI.Loader.prototype[name] = function () {
            pushContext(this);
            var result = old.apply(this, arguments);
            popContext();
            return result;
        };
    });

    function createStore() {
        var needPop = false;
        if (_global.Fix && this._store) {
            var store = findStore(this.options.context || this.options.element);
            if (store) {
                pushTarget(store);
                needPop = true;
            }
            this.store = this._store();
            this.store && (this.store._widget = this);
            needPop && popTarget();
            needPop = false;
            pushTarget(this.store);
            if (this.store instanceof Fix.Model) {
                this.model = this.store.model;
            } else {
                this.model = this.store;
            }
            needPop = true;
        }
        return needPop;
    }

    BI.Widget.prototype._initRender = function () {
        if (this.beforeInit) {
            this.__asking = true;
            this.beforeInit(BI.bind(function () {
                if (this.model && this.model.$vm) {
                    this.model.$vm.$digest();
                }
                this._render();
            }, this));
            if (this.__asking === true) {
                this.__async = true;
            }
        } else {
            this._render();
        }
    };

    var _init = BI.Widget.prototype._init;
    BI.Widget.prototype._init = function () {
        var self = this;
        var needPop = createStore.call(this);
        _init.apply(this, arguments);
        needPop && popTarget();
    };

    var _render = BI.Widget.prototype._render;
    BI.Widget.prototype._render = function () {
        var needPop = false;
        if (_global.Fix && this._store) {
            needPop = true;
            pushTarget(this.store);
            initWatch(this, this.watch);
        }
        _render.apply(this, arguments);
        needPop && popTarget();
    };

    var unMount = BI.Widget.prototype.__d;
    BI.Widget.prototype.__d = function () {
        unMount.apply(this, arguments);
        this.store && BI.isFunction(this.store.destroy) && this.store.destroy();
        BI.each(this._watchers, function (i, unwatches) {
            unwatches = BI.isArray(unwatches) ? unwatches : [unwatches];
            BI.each(unwatches, function (j, unwatch) {
                unwatch();
            });
        });
        this._watchers && (this._watchers = []);
        if (this.store) {
            this.store._parent && (this.store._parent = null);
            this.store._widget && (this.store._widget = null);
            this.store = null;
        }
        delete this.__cacheStore;
    };

    _.each(["_mount"], function (name) {
        var old = BI.Widget.prototype[name];
        old && (BI.Widget.prototype[name] = function () {
            this.store && pushTarget(this.store);
            try {
                var res = old.apply(this, arguments);
            } catch (e) {
                console.error(e);
            }
            this.store && popTarget();
            return res;
        });
    });

    var additionFunc = function () {
        BI.nextTick(function () {
            Fix && Fix.refreshAll && Fix.refreshAll();
        });
    };

    $(document).ajaxComplete(additionFunc);

    if (BI.history) {
        var navigate = BI.history.navigate;
        // navigate之后不会立即变化有一段延迟
        BI.history.navigate = function () {
            navigate.apply(this, arguments);
            BI.defer(function () {
                additionFunc();
            }, 200);
        }
        var back = window.history.back;
        window.history.back = function () {
            back.apply(this, arguments);
            BI.defer(function () {
                additionFunc();
            }, 200);
        }
    }

    if (BI.Router) {
        var execute = BI.Router.prototype.execute;
        BI.Router.prototype.execute = function () {
            execute.apply(this, arguments);
            additionFunc();
        }
    }

    _.each(["each", "map", "reduce", "reduceRight", "find", "filter", "reject", "every", "all", "some", "any", "max", "min",
        "sortBy", "groupBy", "indexBy", "countBy", "partition",
        "keys", "allKeys", "values", "pairs", "invert",
        "mapObject", "findKey", "pick", "omit", "tap"], function (name) {
            var old = BI[name];
            BI[name] = function (obj, fn, context) {
                return typeof fn === "function" ? old(obj, function (key, value) {
                    if (!(key in Fix.$$skipArray)) {
                        return fn.apply(this, arguments);
                    }
                }, context) : old.apply(this, arguments);
            };
        });
    BI.isEmpty = function (ob) {
        if (BI.isPlainObject(ob) && ob.__ob__) {
            return BI.keys(ob).length === 0;
        }
        return _.isEmpty(ob);
    };
    BI.keys = function (ob) {
        var keys = _.keys(ob);
        var nKeys = [];
        for (var i = 0; i < keys.length; i++) {
            if (!(keys[i] in Fix.$$skipArray)) {
                nKeys.push(keys[i]);
            }
        }
        return nKeys;
    };
    BI.values = function (ob) {
        var keys = BI.keys(obj);
        var length = keys.length;
        var values = [];
        for (var i = 0; i < length; i++) {
            values[i] = obj[keys[i]];
        }
        return values;
    };
    BI.extend = function () {
        var args = Array.prototype.slice.call(arguments);
        if (args.length < 1) {
            return {};
        }
        var object = args[0];
        var i = 1;
        while (i < args.length) {
            BI.each(args[i], function (key, v) {
                object[key] = v;
            });
            i++;
        }
        return object;
    };
    BI.size = function (ob) {
        if (BI.isPlainObject(ob) && ob.__ob__) {
            return BI.keys(ob).length;
        }
        return _.size(ob);
    };
    BI.isEmptyObject = function (ob) {
        return BI.size(ob) === 0;
    };
    BI.deepClone = function (ob) {
        return Fix.toJSON(ob);
    };

    Fix.set = function (obj, k, v) {
        try {
            if(obj) {
                obj[k] = v;
            }
        } catch (e) {

        } finally {
            return _.cloneDeep(obj);
        }
    }
    Fix.del = function (obj, k) {
        try {
            delete obj[k];
        } catch (e) {

        } finally {
            return _.cloneDeep(obj);
        }
    }
    BI.watch = Fix.watch;
}());
