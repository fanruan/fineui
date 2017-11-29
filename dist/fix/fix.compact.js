;(function () {
    function initWatch(vm, watch) {
        vm._watchers || (vm._watchers = []);
        for (var key in watch) {
            var handler = watch[key]
            if (BI.isArray(handler)) {
                for (var i = 0; i < handler.length; i++) {
                    vm._watchers.push(createWatcher(vm, key, handler[i]))
                }
            } else {
                vm._watchers.push(createWatcher(vm, key, handler))
            }
        }
    }

    function createWatcher(vm, keyOrFn, handler, options) {
        return Fix.watch(vm.model, keyOrFn, _.bind(handler, vm), options)
    }

    var target = null
    const targetStack = []

    function pushTarget(_target) {
        if (target) targetStack.push(target)
        Fix.Model.target = target = _target
    }

    function popTarget() {
        Fix.Model.target = target = targetStack.pop()
    }

    var _init = BI.Widget.prototype._init;
    BI.Widget.prototype._init = function () {
        var needPop = false;
        if (window.Fix && this._store) {
            var p = this.options.element;
            while (p) {
                if (p.store) {
                    break;
                }
                p = p._parent || (p.options && p.options.element);
            }
            if (p) {
                pushTarget(p.store);
                needPop = true;
            }
            this.store = this._store();
            needPop && popTarget();
            needPop = false;
            pushTarget(this.store);
            if (this.store instanceof Fix.Model) {
                this.model = this.store.model;
            } else {
                this.model = this.store;
            }
            initWatch(this, this.watch);
            needPop = true;
        }
        _init.apply(this, arguments);
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
            })
        });
        this._watchers && (this._watchers = []);
        this.store && (this.store._parent = null, this.store = null);
    }

    _.each(["mounted", "populate"], function (name) {
        var old = BI.Widget.prototype[name];
        old && (BI.Widget.prototype[name] = function () {
            this.store && pushTarget(this.store);
            return old.apply(this, arguments);
            this.store && popTarget();
        });
    })

    _.each(["each", "map", "reduce", "reduceRight", "find", "filter", "reject", "every", "all", "some", "any", "max", "min",
        "sortBy", "groupBy", "indexBy", "countBy", "partition",
        "keys", "allKeys", "values", "pairs", "invert",
        "mapObject", "findKey", "pick", "omit", "tap"], function (name) {
        var old = BI[name]
        BI[name] = function (obj, fn) {
            return typeof fn === "function" ? old(obj, function (key, value) {
                if (!(key in Fix.$$skipArray)) {
                    return fn.apply(null, arguments);
                }
            }) : old.apply(null, arguments);
        }
    });
}());