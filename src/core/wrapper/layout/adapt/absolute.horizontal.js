/**
 * absolute实现的居中布局
 * @class BI.AbsoluteHorizontalLayout
 * @extends BI.Layout
 */
BI.AbsoluteHorizontalLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.AbsoluteHorizontalLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-absolute-horizontal-layout",
            hgap: 0,
            lgap: 0,
            rgap: 0,
            vgap: 0,
            tgap: 0,
            bgap: 0
        });
    },

    _init: function () {
        BI.AbsoluteHorizontalLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.AbsoluteHorizontalLayout.superclass._addElement.apply(this, arguments);
        w.element.css({
            "position": "absolute",
            "left": o.hgap + o.lgap + (item.lgap || 0),
            "right": o.hgap + o.rgap + (item.rgap || 0),
            "margin": "auto"
        });
        if (o.vgap + o.tgap + (item.tgap || 0) !== 0) {
            w.element.css("top", o.vgap + o.tgap + (item.tgap || 0));
        }
        if (o.vgap + o.bgap + (item.bgap || 0) !== 0) {
            w.element.css("bottom", o.vgap + o.bgap + (item.bgap || 0));
        }
        return w;
    },

    resize: function () {
        // console.log("absolute_horizontal_adapt布局不需要resize");
    },

    populate: function (items) {
        BI.AbsoluteHorizontalLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.absolute_horizontal_adapt', BI.AbsoluteHorizontalLayout);