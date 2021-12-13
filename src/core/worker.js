!(function () {
    BI.useInWorker = function () {
        function createWatcher (model, keyOrFn, cb, options) {
            if (BI.isPlainObject(cb)) {
                options = cb;
                cb = cb.handler;
            }
            options = options || {};
            return Fix.watch(model, keyOrFn, cb, BI.extend(options, {
                store: model
            }));
        }

        var models = {}, watches = {};
        addEventListener("message", function (e) {
            var data = e.data;
            switch (data.eventType) {
                case "action":
                    models[data.name][data.action].apply(models[data.name], data.args);
                    break;
                case "destroy":
                    BI.each(watches[data.name], function (i, unwatches) {
                        unwatches = BI.isArray(unwatches) ? unwatches : [unwatches];
                        BI.each(unwatches, function (j, unwatch) {
                            unwatch();
                        });
                    });
                    delete models[data.name];
                    delete watches[data.name];
                    break;
                case "create":
                    var store = models[data.name] = BI.Models.getModel(data.type, data.options);
                    watches[data.name] = [];
                    BI.each(data.watches, function (i, key) {
                        watches[data.name].push(createWatcher(store.model, key, function (newValue, oldValue) {
                            postMessage(BI.extend({}, data, {
                                eventType: "watch",
                                currentWatchType: key
                            }, {args: [newValue, oldValue]}));
                        }));
                    });
                    postMessage(BI.extend({}, data, {
                        eventType: "create"
                    }, {msg: store.model}));
                    break;
                default:
                    break;
            }
        }, false);
    };
}());
