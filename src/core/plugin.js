BI.Plugin = BI.Plugin || {};
!(function () {
    var _WidgetsPlugin = {};
    var _ObjectPlugin = {};
    var _ConfigPlugin = {};
    var _ConfigRenderPlugin = {};
    var _GlobalWidgetConfigFns = [];
    var __GlobalObjectConfigFns = [];
    BI.defaults(BI.Plugin, {

        getWidget: function (type, options) {
            if (_GlobalWidgetConfigFns.length > 0) {
                var fns = _GlobalWidgetConfigFns.slice(0);
                for (var i = fns.length - 1; i >= 0; i--) {
                    fns[i](type, options);
                }
            }

            var res;
            if (_ConfigPlugin[type]) {
                for (var i = _ConfigPlugin[type].length - 1; i >= 0; i--) {
                    if (res = _ConfigPlugin[type][i](options)) {
                        options = res;
                    }
                }
            }
            // Deprecated
            if (_WidgetsPlugin[type]) {
                for (var i = _WidgetsPlugin[type].length - 1; i >= 0; i--) {
                    if (res = _WidgetsPlugin[type][i](options)) {
                        return res;
                    }
                }
            }
            return options;
        },

        config: function (widgetConfigFn, objectConfigFn) {
            _GlobalWidgetConfigFns = _GlobalWidgetConfigFns.concat(_.isArray(widgetConfigFn) ? widgetConfigFn : [widgetConfigFn]);
            __GlobalObjectConfigFns = __GlobalObjectConfigFns.concat(_.isArray(objectConfigFn) ? objectConfigFn : [objectConfigFn]);
        },

        configWidget: function (type, fn, opt) {
            // opt.single: true 最后一次注册有效
            if (!_ConfigPlugin[type] || (opt && opt.single)) {
                _ConfigPlugin[type] = [];
            }
            _ConfigPlugin[type].push(fn);
        },

        getRender: function (type, rendered) {
            var res;
            if (_ConfigRenderPlugin[type]) {
                for (var i = _ConfigRenderPlugin[type].length - 1; i >= 0; i--) {
                    if (res = _ConfigRenderPlugin[type][i](rendered)) {
                        rendered = res;
                    }
                }
            }
            return rendered;
        },

        configRender: function (type, fn) {
            if (!_ConfigRenderPlugin[type]) {
                _ConfigRenderPlugin[type] = [];
            }
            _ConfigRenderPlugin[type].push(fn);
        },

        // Deprecated
        registerWidget: function (type, fn) {
            if (!_WidgetsPlugin[type]) {
                _WidgetsPlugin[type] = [];
            }
            if (_WidgetsPlugin[type].length > 0) {
                console.log("组件已经注册过了!");
            }
            _WidgetsPlugin[type].push(fn);
        },

        // Deprecated
        relieveWidget: function (type) {
            delete _WidgetsPlugin[type];
        },

        getObject: function (type, object) {
            if (__GlobalObjectConfigFns.length > 0) {
                var fns = __GlobalObjectConfigFns.slice(0);
                for (var i = fns.length - 1; i >= 0; i--) {
                    fns[i](type, object);
                }
            }

            if (_ObjectPlugin[type]) {
                var res;
                for (var i = 0, len = _ObjectPlugin[type].length; i < len; i++) {
                    if (res = _ObjectPlugin[type][i](object)) {
                        object = res;
                    }
                }
            }
            return res || object;
        },

        hasObject: function (type) {
            return __GlobalObjectConfigFns.length > 0 || !!_ObjectPlugin[type];
        },

        registerObject: function (type, fn) {
            if (!_ObjectPlugin[type]) {
                _ObjectPlugin[type] = [];
            }
            if (_ObjectPlugin[type].length > 0) {
                console.log("对象已经注册过了!");
            }
            _ObjectPlugin[type].push(fn);
        },

        relieveObject: function (type) {
            delete _ObjectPlugin[type];
        }
    });
})();
