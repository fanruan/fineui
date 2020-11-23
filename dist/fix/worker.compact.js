;(function () {
    var contexts = {};

    var WORKER;
    BI.useWorker = function (wk) {
        WORKER = wk;

        var _init = BI.Widget.prototype._init;
        BI.Widget.prototype._init = function () {
            this.$destroyWorker = createWorker.call(this);
            try {
                _init.apply(this, arguments);
            } catch (e) {
                console.error(e);
            }
        };

        var _initRender = BI.Widget.prototype._initRender;
        var postMessage = function (data) {
            switch (data.eventType) {
                case "create":
                    this.model = data.msg;
                    _initRender.call(this);
                    break;
                case "watch":
                    var watchArgs = data.args;
                    this.watch[data.currentWatchType].apply(this, watchArgs);
                    break;
            }
        };
        BI.Widget.prototype._initRender = function () {
            if (WORKER && this._worker) {
                this.__asking = true;
                this.__async = true;
            } else {
                _initRender.apply(this, arguments);
            }
        };

        var unMount = BI.Widget.prototype.__d;
        BI.Widget.prototype.__d = function () {
            this.$destroyWorker && this.$destroyWorker();
            try {
                unMount.apply(this, arguments);
            } catch (e) {
                console.error(e);
            }
        };

        if (WORKER) {
            WORKER.addEventListener("message", function (e) {
                var data = e.data;
                postMessage.apply(contexts[data.name], [data]);
            }, false);
        }
    };

    function createWorker () {
        var self = this;
        if (this._worker) {
            var name = this.getName();
            var modelType = this._worker();
            var options;
            if (BI.isArray(modelType)) {
                options = modelType[1];
                modelType = modelType[0];
            }
            if (WORKER) {
                contexts[name] = this;
                WORKER.postMessage({
                    type: modelType,
                    name: name,
                    eventType: "create",
                    options: options,
                    watches: BI.map(this.watch, function (key) {
                        return key;
                    })
                });
                var store = {};
                this.store = new Proxy(store, {
                    get: function (target, key) {
                        return function () {
                            WORKER.postMessage({
                                type: modelType,
                                name: name,
                                eventType: "action",
                                action: key,
                                args: [].slice.call(arguments)
                            });
                        };
                    },
                    set: function (target, key, value) {
                        return Reflect.set(target, key, value);
                    }
                });
                return function () {
                    delete contexts[name];
                    WORKER.postMessage({
                        type: modelType,
                        name: name,
                        eventType: "destroy"
                    });
                };
            } else {
                this.store = BI.Models.getModel(modelType, options);
                this.store && (this.store._widget = this);
                if (this.store instanceof Fix.Model) {
                    this.model = this.store.model;
                } else {
                    this.model = this.store;
                }
                initWatch(this, this.watch);
                return function () {
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
                };
            }

        }
    }

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
}());
