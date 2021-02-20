/**
 * 水平方向居中自适应容器
 * @class BI.HorizontalAutoLayout
 * @extends BI.Layout
 */
BI.HorizontalAutoLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.HorizontalAutoLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-h-o",
            hgap: 0,
            lgap: 0,
            rgap: 0,
            vgap: 0,
            tgap: 0,
            bgap: 0
        });
    },

    render: function () {
        BI.HorizontalAutoLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.HorizontalAutoLayout.superclass._addElement.apply(this, arguments);
        w.element.css({
            position: "relative",
            margin: "0px auto"
        });
        if (o.vgap + o.tgap + (item.tgap || 0) + (item.vgap || 0) !== 0) {
            w.element.css({
                "margin-top": ((i === 0 ? o.vgap : 0) + o.tgap + (item.tgap || 0) + (item.vgap || 0)) / BI.pixRatio + BI.pixUnit
            });
        }
        if (o.hgap + o.lgap + (item.lgap || 0) + (item.hgap || 0) !== 0) {
            w.element.css({
                "margin-left": (o.hgap + o.lgap + (item.lgap || 0) + (item.hgap || 0)) / BI.pixRatio + BI.pixUnit
            });
        }
        if (o.hgap + o.rgap + (item.rgap || 0) + (item.hgap || 0) !== 0) {
            w.element.css({
                "margin-right": (o.hgap + o.rgap + (item.rgap || 0) + (item.hgap || 0)) / BI.pixRatio + BI.pixUnit
            });
        }
        if (o.vgap + o.bgap + (item.bgap || 0) + (item.vgap || 0) !== 0) {
            w.element.css({
                "margin-bottom": (o.vgap + o.bgap + (item.bgap || 0) + (item.vgap || 0)) / BI.pixRatio + BI.pixUnit
            });
        }
        return w;
    },

    resize: function () {
        // console.log("horizontal_adapt布局不需要resize");
    },

    populate: function (items) {
        BI.HorizontalAutoLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.horizontal_auto", BI.HorizontalAutoLayout);
