/**
 * 内联布局
 * @class BI.InlineCenterAdaptLayout
 * @extends BI.Layout
 *
 * @cfg {JSON} options 配置属性
 * @cfg {Number} [hgap=0] 水平间隙
 * @cfg {Number} [vgap=0] 垂直间隙
 */
BI.InlineCenterAdaptLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.InlineCenterAdaptLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-inline-center-adapt-layout",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    _init: function () {
        BI.InlineCenterAdaptLayout.superclass._init.apply(this, arguments);
        this.element.css({
            whiteSpace: "nowrap"
        });
        this.populate(this.options.items);
    },

    _addElement: function (i, item, length) {
        var o = this.options;
        if (!this.hasWidget(this.getName() + i)) {
            var t = BI.createWidget(item);
            t.element.css({
                "position": "relative"
            });
            var w = BI.createWidget({
                type: "bi.horizontal_auto",
                items: [t]
            });
            this.addWidget(this.getName() + i, w);
        } else {
            var w = this.getWidgetByName(this.getName() + i);
        }
        w.element.css({
            "position": "relative",
            "display": "inline-block",
            "vertical-align": "middle",
            "*display": "inline",
            "*zoom": 1,
            "min-width": 100 / length + "%"
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

    addItem: function (item) {
        throw new Error("不能添加元素");
    },

    stroke: function (items) {
        var self = this;
        BI.each(items, function (i, item) {
            if (!!item) {
                self._addElement(i, item, items.length);
            }
        });
    },

    populate: function (items) {
        BI.InlineCenterAdaptLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.inline_center_adapt', BI.InlineCenterAdaptLayout);