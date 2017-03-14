/**
 * MVC路由
 * @class BI.WRouter
 * @extends BI.Router
 * @type {*|void|Object}
 */
BI.WRouter = BI.Router.extend({
    add: function(route, callback){
        this.handlers || (this.handlers=[]);
        this.handlers.unshift({route: route, callback: callback})
    },

    route: function(route, name, callback) {
        if (!_.isRegExp(route)) route = this._routeToRegExp(route);
        if (_.isFunction(name)) {
            callback = name;
            name = '';
        }
        if (!callback) callback = this[name];
        var self = this;
        this.add(route, function(fragment) {
            var args = self._extractParameters(route, fragment);
            var result = self.execute(callback, args, name)
            if (result !== false) {
                self.trigger.apply(self, ['route:' + name].concat(args));
                self.trigger('route', name, args);
            }
            return result;
        });
        return this;
    },

    execute: function(callback, args, name) {
        if (callback) return callback.apply(this, args);
        return name;
    },

    get: function(fragment){
        var result = null;
        _.any(this.handlers, function(handler) {
            if (handler.route.test(fragment)) {
                result = handler.callback(fragment);
                return true;
            }
        });
        return result;
    }
});