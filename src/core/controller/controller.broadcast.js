/**
 * 广播
 *
 * Created by GUY on 2015/12/23.
 * @class
 */
BI.BroadcastController = BI.inherit(BI.Controller, {
    _defaultConfig: function () {
        return BI.extend(BI.BroadcastController.superclass._defaultConfig.apply(this, arguments), {});
    },

    _init: function () {
        BI.BroadcastController.superclass._init.apply(this, arguments);
        this._broadcasts = {};
    },

    on: function (name, fn) {
        if (!this._broadcasts[name]) {
            this._broadcasts[name] = [];
        }
        this._broadcasts[name].push(fn);
    },

    send: function (name) {
        var args = [].slice.call(arguments, 1);
        BI.each(this._broadcasts[name], function (i, fn) {
            fn.apply(null, args);
        });
    },

    remove: function (name, fn) {
        if (fn) {
            BI.remove(this._broadcasts[name], fn);
        } else {
            delete this._broadcasts[name];
        }
        return this;
    }
});