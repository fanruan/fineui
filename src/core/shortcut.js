(function () {
    var kv = {};
    BI.shortcut = BI.component = function (xtype, cls) {
        if (kv[xtype] != null) {
            _global.console && console.error("shortcut:[" + xtype + "] has been registed");
        }
        kv[xtype] = cls;
    };

    // 根据配置属性生成widget
    var createWidget = function (config) {
        if (config["classType"]) {
            return new (new Function("return " + config["classType"] + ";")())(config);
        }

        var cls = kv[config.type];
        return new cls(config);
    };

    BI.createWidget = function (item, options, context) {
        // 先把准备环境准备好
        while (BI.prepares && BI.prepares.length > 0) {
            BI.prepares.shift()();
        }
        var el, w;
        item || (item = {});
        if (BI.isWidget(options)) {
            context = options;
            options = {};
        } else {
            options || (options = {});
        }
        if (BI.isEmpty(item) && BI.isEmpty(options)) {
            return BI.createWidget({
                type: "bi.layout"
            });
        }
        if (BI.isWidget(item)) {
            return item;
        }
        if (item.type || options.type) {
            el = BI.extend({}, options, item);
            w = BI.Plugin.getWidget(el.type, el);
            w.listeners = (w.listeners || []).concat([{
                eventName: BI.Events.MOUNT,
                action: function () {
                    BI.Plugin.getObject(el.type, this);
                }
            }]);
            return w.type === el.type ? createWidget(w) : BI.createWidget(BI.extend({}, item, {type: w.type}, options));
        }
        if (item.el && (item.el.type || options.type)) {
            el = BI.extend({}, options, item.el);
            w = BI.Plugin.getWidget(el.type, el);
            w.listeners = (w.listeners || []).concat([{
                eventName: BI.Events.MOUNT,
                action: function () {
                    BI.Plugin.getObject(el.type, this);
                }
            }]);
            return w.type === el.type ? createWidget(w) : BI.createWidget(BI.extend({}, item, {type: w.type}, options));
        }
        if (BI.isWidget(item.el)) {
            return item.el;
        }
        throw new Error("无法根据item创建组件");
    };

})();