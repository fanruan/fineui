/**
 * 默认的布局方式
 *
 * @class BI.DefaultLayout
 * @extends BI.Layout
 */
BI.DefaultLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.DefaultLayout.superclass._defaultConfig.apply(this, arguments), {
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            items: []
        });
    },
    _init: function () {
        BI.DefaultLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.DefaultLayout.superclass._addElement.apply(this, arguments);
        if (o.vgap + o.tgap + (item.tgap || 0) !== 0) {
            w.element.css({
                "margin-top": o.vgap + o.tgap + (item.tgap || 0) + "px"
            })
        }
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
        if (o.vgap + o.bgap + (item.bgap || 0) !== 0) {
            w.element.css({
                "margin-bottom": o.vgap + o.bgap + (item.bgap || 0) + "px"
            })
        }
        return w;
    },

    resize: function () {
        // console.log("default布局不需要resize")
    },

    populate: function (items) {
        BI.DefaultLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.default', BI.DefaultLayout);