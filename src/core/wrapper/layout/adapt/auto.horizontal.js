/**
 * 水平方向居中自适应容器
 * @class BI.HorizontalAutoLayout
 * @extends BI.Layout
 */
BI.HorizontalAutoLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.HorizontalAutoLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-horizon-auto-layout",
            hgap: 0,
            lgap: 0,
            rgap: 0,
            vgap: 0,
            tgap: 0,
            bgap: 0
        });
    },

    _init: function () {
        BI.HorizontalAutoLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.HorizontalAutoLayout.superclass._addElement.apply(this, arguments);
        w.element.css({
            "position": "relative",
            "margin": "0px auto"
        });
        if (o.hgap + o.lgap + (item.lgap || 0) !== 0) {
            w.element.css({
                "margin-left": o.hgap + o.lgap + (item.lgap || 0) + "px"
            })
        }
        if (o.hgap + o.rgap + (item.rgap || 0) !== 0) {
            w.element.css({
                "margin-right": o.hgap + o.rgap + (item.rgap || 0) + "px"
            })
        }
        if (o.vgap + o.tgap + (item.tgap || 0) !== 0) {
            w.element.css({
                "margin-top": o.vgap + o.tgap + (item.tgap || 0) + "px"
            })
        }
        if (o.vgap + o.bgap + (item.bgap || 0) !== 0) {
            w.element.css({
                "margin-bottom": o.vgap + o.bgap + (item.bgap || 0) + "px"
            })
        }
        return w;
    },

    resize: function () {
        // console.log("horizontal_adapt布局不需要resize");
    },

    populate: function (items) {
        BI.HorizontalAutoLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.horizontal_auto', BI.HorizontalAutoLayout);