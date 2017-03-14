/**
 * 垂直布局
 * @class BI.VerticalLayout
 * @extends BI.Layout
 */
BI.VerticalLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.VerticalLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-vertical-layout",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            scrolly: true
        });
    },
    _init: function () {
        BI.VerticalLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.VerticalLayout.superclass._addElement.apply(this, arguments);
        w.element.css({
            "position": "relative"
        });
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
        this.stroke(this.options.items);
    },

    populate: function (items) {
        BI.VerticalLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.vertical', BI.VerticalLayout);