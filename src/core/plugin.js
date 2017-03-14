BI.Plugin = BI.Plugin || {};
;
(function () {
    var _WidgetsPlugin = {};
    var _ObjectPlugin = {};
    BI.extend(BI.Plugin, {

        getWidget: function (type, options) {
            if (_WidgetsPlugin[type]) {
                var res;
                for (var i = _WidgetsPlugin[type].length-1; i >=0; i--) {
                    if (res = _WidgetsPlugin[type][i](options)) {
                        return res;
                    }
                }
            }
            return options;
        },

        registerWidget: function (type, fn) {
            if (!_WidgetsPlugin[type]) {
                _WidgetsPlugin[type] = [];
            }
            if (_WidgetsPlugin[type].length > 0) {
                console.log("组件已经注册过了!");
            }
            _WidgetsPlugin[type].push(fn);
        },

        relieveWidget: function (type) {
            delete _WidgetsPlugin[type];
        },

        getObject: function (type, object) {
            if (_ObjectPlugin[type]) {
                var res;
                for (var i = 0, len = _ObjectPlugin[type].length; i < len; i++) {
                    res = _ObjectPlugin[type][i](object);
                }
            }
            return res || object;
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