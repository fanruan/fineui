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
        if (BI.isPlainObject(handler)) {
            options = handler
            handler = handler.handler
        }
        if (typeof handler === 'string') {
            handler = vm[handler]
        }
        return Fix.VM.prototype.$watch.call(vm, keyOrFn, handler, options)
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

    var destroy = BI.Widget.prototype.destroy;
    BI.Widget.prototype.destroy = function () {
        destroy.apply(this, arguments);
        this.store && this.store.destroy();
        BI.each(this._watchers, function (i, unwatch) {
            unwatch();
        });
        this._watchers && (this._watchers = []);
        this.store && (this.store = null);
    }
}());