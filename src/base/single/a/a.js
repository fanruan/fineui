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
            el: null,
            tagName: "a"
        });
    },

    render: function () {
        var o = this.options;
        BI.A.superclass.render.apply(this, arguments);
        this.element.attr({href: o.href, target: o.target});
        if (o.el) {
            BI.createWidget(o.el, {
                element: this
            });
        }
    }
});

BI.shortcut("bi.a", BI.A);
