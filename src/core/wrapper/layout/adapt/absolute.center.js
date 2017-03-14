/**
 * absolute实现的居中布局
 * @class BI.AbsoluteCenterLayout
 * @extends BI.Layout
 */
BI.AbsoluteCenterLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.AbsoluteCenterLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-absolute-center-layout",
            hgap: 0,
            lgap: 0,
            rgap: 0,
            vgap: 0,
            tgap: 0,
            bgap: 0
        });
    },

    _init: function () {
        BI.AbsoluteCenterLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.AbsoluteCenterLayout.superclass._addElement.apply(this, arguments);
        w.element.css({
            "position": "absolute",
            "left": o.hgap + o.lgap + (item.lgap || 0),
            "right": o.hgap + o.rgap + (item.rgap || 0),
            "top": o.vgap + o.tgap + (item.tgap || 0),
            "bottom": o.vgap + o.bgap + (item.bgap || 0),
            "margin": "auto"
        });
        return w;
    },

    resize: function () {
        // console.log("absolute_center_adapt布局不需要resize");
    },

    populate: function (items) {
        BI.AbsoluteCenterLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.absolute_center_adapt', BI.AbsoluteCenterLayout);