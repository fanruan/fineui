/**
 * 超链接
 *
 * Created by GUY on 2015/9/9.
 * @class BI.A
 * @extends BI.Text
 * @abstract
 */
BI.A = BI.inherit(BI.Text, {
    _defaultConfig: function () {
        var conf = BI.A.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-a display-block",
            href: "",
            target: "_blank",
            el: null
        })
    },
    _init: function () {
        var o = this.options;
        this.options.element = $("<a href='" + o.href + "' target='" + o.target + "'>");
        BI.A.superclass._init.apply(this, arguments);
        if (o.el) {
            BI.createWidget(o.el, {
                element: this.element
            });
        }
    }
});

$.shortcut("bi.a", BI.A);