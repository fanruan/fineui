/**
 * window.resize 控制器
 *
 * Created by GUY on 2015/6/24.
 * @class
 */
BI.ResizeController = BI.inherit(BI.Controller, {
    init: function () {
        var self = this;
        this.resizerManger = {};
        var fn = BI.debounce(function (ev) {
            // if (BI.isWindow(ev.target)) {
            self._resize(ev);
            // }
        }, 30);
        if ("onorientationchange" in _global) {
            _global.onorientationchange = fn;
        } else {
            BI.Widget._renderEngine.createElement(_global).resize(fn);
        }
    },

    _resize: function (ev) {
        BI.each(this.resizerManger, function (key, resizer) {
            if (resizer instanceof BI.$) {
                if (resizer.is(":visible")) {
                    resizer.trigger("__resize__");
                }
                return;
            }
            if (resizer instanceof BI.Layout) {
                resizer.resize();
                return;
            }
            if (BI.isFunction(resizer)) {
                resizer(ev);
                return;
            }
        });
    },

    add: function (name, resizer) {
        var self = this;
        if (this.has(name)) {
            return this;
        }
        this.resizerManger[name] = resizer;
        return function () {
            self.remove(name);
        };
    },

    get: function (name) {
        return this.resizerManger[name];
    },

    has: function (name) {
        return this.resizerManger[name] != null;
    },

    remove: function (name) {
        if (!this.has(name)) {
            return this;
        }
        delete this.resizerManger[name];
        return this;
    }
});
