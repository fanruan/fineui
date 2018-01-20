(function () {
    var kv = {};
    BI.shortcut = function (xtype, cls) {
        if (kv[xtype] != null) {
            throw ("shortcut:[" + xtype + "] has been registed");
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

    BI.createWidget = function (item, options) {
        var el, w;
        item || (item = {});
        options || (options = {});
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
            return w.type === el.type ? BI.Plugin.getObject(el.type, createWidget(w)) : BI.createWidget(BI.extend({}, item, {type: w.type}, options));
        }
        if (item.el && (item.el.type || options.type)) {
            el = BI.extend({}, options, item.el);
            w = BI.Plugin.getWidget(el.type, el);
            return w.type === el.type ? BI.Plugin.getObject(el.type, createWidget(w)) : BI.createWidget(BI.extend({}, item, {type: w.type}, options));
        }
        if (BI.isWidget(item.el)) {
            return item.el;
        }
        throw new Error("无法根据item创建组件");
    };

})();