;(function () {
    var contexts = {};

    var worker;
    BI.useWorker = function (wk) {
        worker = wk;

        var _init = BI.Widget.prototype._init;
        BI.Widget.prototype._init = function () {
            createWorker.call(this);
            try {
                _init.apply(this, arguments);
            } catch (e) {
                console.error(e);
            }
        };

        var _initRender = BI.Widget.prototype._initRender;
        BI.Widget.prototype.postMessage = function (data) {
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
            if (_global.Worker && this._worker) {
                this.__asking = true;
                this.__async = true;
            } else {
                _initRender.apply(this, arguments);
            }
        };

        var unMount = BI.Widget.prototype.__d;
        BI.Widget.prototype.__d = function () {
            delete contexts[this.getName()];
            try {
                unMount.apply(this, arguments);
            } catch (e) {
                console.error(e);
            }
        };

        worker.addEventListener("message", function (e) {
            var data = e.data;
            contexts[data.name].postMessage(data);
        }, false);
    };

    function createWorker () {
        var self = this;
        if (_global.Worker && this._worker) {
            var name = this.getName();
            contexts[name] = this;
            var modelType = this._worker();
            worker.postMessage({
                type: modelType,
                name: name,
                eventType: "create",
                watches: BI.map(this.watch, function (key) {
                    return key;
                })
            });
            var store = {};
            this.store = new Proxy(store, {
                get (target, key) {
                    return function () {
                        worker.postMessage({
                            type: modelType,
                            name: name,
                            eventType: "action",
                            action: key,
                            args: [].slice.call(arguments)
                        });
                    };
                },
                set (target, key, value) {
                    return Reflect.set(target, key, value);
                }
            });
        }
    }
}());
