;(function () {
    function initWatch (vm, watch) {
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
        BI.each(vm.$watchDelayCallbacks, function (i, watchDelayCallback) {
            var innerWatch = watchDelayCallback[0];
            var innerHandler = watchDelayCallback[1];
            if (BI.isKey(innerWatch)) {
                var key = innerWatch;
                innerWatch = {};
                innerWatch[key] = innerHandler;
            }
            for (var key in innerWatch) {
                var handler = innerWatch[key];
                if (BI.isArray(handler)) {
                    for (var i = 0; i < handler.length; i++) {
                        vm._watchers.push(createWatcher(vm, key, handler[i]));
                    }
                } else {
                    vm._watchers.push(createWatcher(vm, key, handler));
                }
            }
        });
    }

    function createWatcher (vm, keyOrFn, cb, options) {
        if (BI.isPlainObject(cb)) {
            options = cb;
            cb = cb.handler;
        }
        options = options || {};
        return Fix.watch(vm.model, keyOrFn, _.bind(cb, vm), BI.extend(options, {
            store: vm.store
        }));
    }

    var target = null;
    var targetStack = [];

    function pushTarget (_target) {
        if (target) targetStack.push(target);
        Fix.Model.target = target = _target;
    }

    function popTarget () {
        Fix.Model.target = target = targetStack.pop();
    }

    BI.Model = Fix.Model;

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
            try {
                var res = cb.apply(this, arguments);
            } catch (e) {
                console.error(e);
            }
            options && options.store && popTarget();
            return res;
        }, options);
    };

    function findStore (widget) {
        if (target != null) {
            return target;
        }
        widget = widget || BI.Widget.context;
        var p = widget;
        while (p) {
            if (p instanceof Fix.Model || p.store || p.__cacheStore) {
                break;
            }
            p = p._parent || (p.options && p.options.element) || p._context;
        }
        if (p) {
            if (p instanceof Fix.Model) {
                return widget.__cacheStore = p;
            }
            widget.__cacheStore = p.store || p.__cacheStore;
            return p.__cacheStore || p.store;
        }
    }

    function createStore () {
        var needPop = false;
        var workerMode = BI.Providers.getProvider("bi.provider.system").getWorkerMode();
        if (workerMode && this._worker) {
            return;
        }
        if (this.store) {
            pushTarget(this.store);
            return true;
        }
        if (this._store) {
            var store = findStore(this.options.context || this._parent || this.options.element || this._context);
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

    var _init = BI.Widget.prototype._init;
    BI.Widget.prototype._init = function () {
        var self = this;
        var needPop = createStore.call(this);
        try {
            _init.apply(this, arguments);
        } catch (e) {
            console.error(e);
        }
        needPop && popTarget();
    };

    var __initWatch = BI.Widget.prototype.__initWatch;
    BI.Widget.prototype.__initWatch = function () {
        __initWatch.apply(this, arguments);
        var workerMode = BI.Providers.getProvider("bi.provider.system").getWorkerMode();
        if (workerMode && this._worker) {
            return;
        }
        if (this._store) {
            initWatch(this, this.watch);
        }
    };

    var unMount = BI.Widget.prototype.__destroy;
    BI.Widget.prototype.__destroy = function () {
        try {
            unMount.apply(this, arguments);
        } catch (e) {
            console.error(e);
        }
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

    _.each(["_render", "__afterRender", "_mount", "__afterMount"], function (name) {
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
}());
