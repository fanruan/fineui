(function ($) {

    var kv = {}; // alex:键(编辑器简称,如text)值(也是一个字符串,如FR.TextEditor)对
    $.shortcut = function (xtype, cls) {
        if (kv[xtype] != null) {
            throw ("shortcut:[" + xtype + "] has been registed");
        }
        kv[xtype] = cls;
        $.extend(cls.prototype, {
            xtype: xtype
        })
    };

    // 根据配置属性生成widget
    var createWidget = function (config) {
        // alex:如果是一个jquery对象,就在外面套一层,变成一个FR.Widget
        if (config instanceof $) {
            return new BI.Widget({
                element: config
            });
        }
        if (config['classType']) {
            return new (new Function('return ' + config['classType'] + ';')())(config);
        }

        if (!config.type) {

        }
        var xtype = config.type.toLowerCase();
        var cls = kv[xtype];
        return new cls(config);
    };

    BI.createWidget = function (item, options) {
        var el;
        options || (options = {});
        if (BI.isEmpty(item) && BI.isEmpty(options)) {
            return BI.Plugin.getObject("bi.layout", BI.createWidget({
                type: "bi.layout"
            }));
        }
        if (BI.isWidget(item)) {
            return item;
        }
        if (item && (item.type || options.type)) {
            el = BI.extend({}, options, item);
            return BI.Plugin.getObject(el.type, createWidget(BI.Plugin.getWidget(el.type, el)));
        }
        if (item && item.el && (item.el.type || options.type)) {
            el = BI.extend({}, options, item.el);
            return BI.Plugin.getObject(el.type, createWidget(BI.Plugin.getWidget(el.type, el)));
        }
        if (item && BI.isWidget(item.el)) {
            return item.el;
        }
        throw new Error('无法根据item创建组件');
    }

})(jQuery);