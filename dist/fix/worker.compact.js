;(function () {
    var contexts = {};
    var init = false;

    var WORKER;

    var enableWorker = function () {
        if (init) {
            return init;
        }
        // 开启Worker模式
        BI.config("bi.provider.system", function (provider) {
            provider.setWorkerMode(true);
        });
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
        init = postMessage;
        return postMessage;
    };

    BI.useWorker = function (wk) {
        if (!_global.Worker || !_global.Proxy) {
            return;
        }
        var postMessage = enableWorker();
        WORKER = wk;
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
                    watches: BI.map(this.$watch || this.watch, function (key) {
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
            }
        }
    }
}());
