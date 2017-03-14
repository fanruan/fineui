/**
 * 内联布局
 * @class BI.InlineVerticalAdaptLayout
 * @extends BI.Layout
 *
 * @cfg {JSON} options 配置属性
 * @cfg {Number} [hgap=0] 水平间隙
 * @cfg {Number} [vgap=0] 垂直间隙
 */
BI.InlineVerticalAdaptLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.InlineVerticalAdaptLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-inline-vertical-adapt-layout",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    _init: function () {
        BI.InlineVerticalAdaptLayout.superclass._init.apply(this, arguments);
        this.element.css({
            whiteSpace: "nowrap"
        });
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.InlineVerticalAdaptLayout.superclass._addElement.apply(this, arguments);
        w.element.css({
            "position": "relative",
            "display": "inline-block",
            "vertical-align": "middle",
            "*display": "inline",
            "*zoom": 1
        });
        if (o.hgap + o.lgap + (item.lgap || 0) > 0) {
            w.element.css({
                "margin-left": o.hgap + o.lgap + (item.lgap || 0) + "px"
            })
        }
        if (o.hgap + o.rgap + (item.rgap || 0) > 0) {
            w.element.css({
                "margin-right": o.hgap + o.rgap + (item.rgap || 0) + "px"
            })
        }
        if (o.vgap + o.tgap + (item.tgap || 0) > 0) {
            w.element.css({
                "margin-top": o.vgap + o.tgap + (item.tgap || 0) + "px"
            })
        }
        if (o.vgap + o.bgap + (item.bgap || 0) > 0) {
            w.element.css({
                "margin-bottom": o.vgap + o.bgap + (item.bgap || 0) + "px"
            })
        }
        return w;
    },

    resize: function () {
        this.stroke(this.options.items);
    },

    populate: function (items) {
        BI.InlineVerticalAdaptLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.inline_vertical_adapt', BI.InlineVerticalAdaptLayout);