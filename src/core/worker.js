!(function () {
    BI.initWorker = function () {
        function createWatcher (model, keyOrFn, cb, options) {
            options = options || {};
            return Fix.watch(model, keyOrFn, cb, BI.extend(options, {
                store: model
            }));
        }

        var models = {};
        addEventListener("message", function (e) {
            var data = e.data;
            switch (data.eventType) {
                case "action":
                    models[data.name][data.action].apply(models[data.name], data.args);
                    break;
                default:
                    var store = models[data.name] = BI.Models.getModel(data.type, data.options);
                    for (var i = 0, len = data.watches.length; i < len; i++) {
                        var key = data.watches[i];
                        createWatcher(store.model, key, function () {
                            postMessage(BI.extend({}, data, {
                                eventType: "watch",
                                currentWatchType: key
                            }, {args: [].slice.call(arguments, 0, 2)}));
                        });
                    }
                    postMessage(BI.extend({
                        eventType: "create"
                    }, data, {msg: store.model}));
                    break;
            }
        }, false);
    };
}());
