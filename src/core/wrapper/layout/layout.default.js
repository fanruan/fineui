/**
 * 默认的布局方式
 *
 * @class BI.DefaultLayout
 * @extends BI.Layout
 */
BI.DefaultLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.DefaultLayout.superclass.props.apply(this, arguments), {
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            items: []
        });
    },
    render: function () {
        BI.DefaultLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.DefaultLayout.superclass._addElement.apply(this, arguments);
        if (o.vgap + o.tgap + (item.tgap || 0) !== 0) {
            w.element.css({
                "margin-top": (o.vgap + o.tgap + (item.tgap || 0)) / BI.pixRatio + BI.pixUnit
            });
        }
        if (o.hgap + o.lgap + (item.lgap || 0) !== 0) {
            w.element.css({
                "margin-left": (o.hgap + o.lgap + (item.lgap || 0)) / BI.pixRatio + BI.pixUnit
            });
        }
        if (o.hgap + o.rgap + (item.rgap || 0) !== 0) {
            w.element.css({
                "margin-right": (o.hgap + o.rgap + (item.rgap || 0)) / BI.pixRatio + BI.pixUnit
            });
        }
        if (o.vgap + o.bgap + (item.bgap || 0) !== 0) {
            w.element.css({
                "margin-bottom": (o.vgap + o.bgap + (item.bgap || 0)) / BI.pixRatio + BI.pixUnit
            });
        }
        return w;
    },

    resize: function () {
        // console.log("default布局不需要resize")
    },

    populate: function (items) {
        BI.DefaultLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.default", BI.DefaultLayout);
