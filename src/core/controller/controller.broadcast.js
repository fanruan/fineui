/**
 * 广播
 *
 * Created by GUY on 2015/12/23.
 * @class
 */
BI.BroadcastController = BI.inherit(BI.Controller, {
    init: function () {
        this._broadcasts = {};
    },

    on: function (name, fn) {
        var self = this;
        if (!this._broadcasts[name]) {
            this._broadcasts[name] = [];
        }
        this._broadcasts[name].push(fn);
        return function () {
            self.remove(name, fn);
        };
    },

    send: function (name) {
        var args = [].slice.call(arguments, 1);
        BI.each(this._broadcasts[name], function (i, fn) {
            fn.apply(null, args);
        });
    },

    remove: function (name, fn) {
        var self = this;
        if (fn) {
            BI.remove(this._broadcasts[name], fn);
            if (this._broadcasts[name].length === 0) {
                delete this._broadcasts[name];
            }
        } else {
            delete this._broadcasts[name];
        }
        return this;
    }
});
