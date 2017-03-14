/**
 * window.resize 控制器
 *
 * Created by GUY on 2015/6/24.
 * @class
 */
BI.ResizeController = BI.inherit(BI.Controller, {
    _defaultConfig: function () {
        return BI.extend(BI.ResizeController.superclass._defaultConfig.apply(this, arguments), {});
    },

    _init: function () {
        BI.ResizeController.superclass._init.apply(this, arguments);
        var self = this;
        this.resizerManger = {};
        var fn = BI.debounce(function (ev) {
            //if (BI.isWindow(ev.target)) {
            self._resize(ev);
            //}
        }, 30);
        $(window).resize(fn);
    },

    _resize: function (ev) {
        BI.each(this.resizerManger, function (key, resizer) {
            if (resizer instanceof $) {
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
        })
    },

    add: function (name, resizer) {
        if (this.has(name)) {
            return this;
        }
        this.resizerManger[name] = resizer;
        return this;
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