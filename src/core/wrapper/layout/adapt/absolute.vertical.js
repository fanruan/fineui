/**
 * absolute实现的居中布局
 * @class BI.AbsoluteVerticalLayout
 * @extends BI.Layout
 */
BI.AbsoluteVerticalLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.AbsoluteVerticalLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-absolute-vertical-layout",
            hgap: 0,
            lgap: 0,
            rgap: 0,
            vgap: 0,
            tgap: 0,
            bgap: 0
        });
    },

    render: function () {
        BI.AbsoluteVerticalLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.AbsoluteVerticalLayout.superclass._addElement.apply(this, arguments);
        w.element.css({
            "position": "absolute",
            "left": item.lgap,
            "right": item.rgap,
            "top": o.vgap + o.tgap + (item.tgap || 0),
            "bottom": o.vgap + o.bgap + (item.bgap || 0),
            "margin": "auto"
        });
        if (o.hgap + o.lgap + (item.lgap || 0) !== 0) {
            w.element.css("left", o.hgap + o.lgap + (item.lgap || 0));
        }
        if (o.hgap + o.rgap + (item.rgap || 0) !== 0) {
            w.element.css("right", o.hgap + o.rgap + (item.rgap || 0));
        }
        return w;
    },

    resize: function () {
        // console.log("absolute_vertical_adapt布局不需要resize");
    },

    populate: function (items) {
        BI.AbsoluteVerticalLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut('bi.absolute_vertical_adapt', BI.AbsoluteVerticalLayout);