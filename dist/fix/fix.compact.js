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
        return Fix.watch(vm, keyOrFn, handler, options)
    }

    var _init = BI.Widget.prototype._init;
    BI.Widget.prototype._init = function () {
        if (window.Fix && this._store) {
            this.store = this._store();
            if (this.store instanceof Fix.VM) {
                this.model = this.store.model;
            } else {
                this.model = this.store;
            }
            initWatch(this, this.watch);
        }
        _init.apply(this, arguments);
    };

    var unMount = BI.Widget.prototype._unMount;
    BI.Widget.prototype._unMount = function () {
        unMount.apply(this, arguments);
        this.store && this.store.destroy();
        BI.each(this._watchers, function (i, unwatches) {
            unwatches = BI.isArray(unwatches) ? unwatches : [unwatches];
            BI.each(unwatches, function (j, unwatch) {
                unwatch();
            })
        });
        this._watchers && (this._watchers = []);
        this.store && (this.store = null);
    }
}());