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

    props: function () {
        return BI.extend(BI.InlineVerticalAdaptLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-inline-vertical-adapt-layout",
            horizontalAlign: BI.HorizontalAlign.Left,
            verticalAlign: BI.VerticalAlign.Middle,
            columnSize: [],
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },

    render: function () {
        BI.InlineVerticalAdaptLayout.superclass.render.apply(this, arguments);
        var o = this.options;
        this.element.css({
            whiteSpace: "nowrap",
            textAlign: o.horizontalAlign
        });
        this.populate(o.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.InlineVerticalAdaptLayout.superclass._addElement.apply(this, arguments);
        w.element.css({
            width: o.columnSize[i] <= 1 ? (o.columnSize[i] * 100 + "%") : (o.columnSize[i] / BI.pixRatio + BI.pixUnit),
            position: "relative",
            "vertical-align": o.verticalAlign
        });
        w.element.addClass("inline-vertical-adapt-item");
        if (o.vgap + o.tgap + (item.tgap || 0) + (item.vgap || 0) !== 0) {
            w.element.css({
                "margin-top": (o.vgap + o.tgap + (item.tgap || 0) + (item.vgap || 0)) / BI.pixRatio + BI.pixUnit
            });
        }
        if (o.hgap + o.lgap + (item.lgap || 0) + (item.hgap || 0) !== 0) {
            w.element.css({
                "margin-left": ((i === 0 ? o.hgap : 0) + o.lgap + (item.lgap || 0) + (item.hgap || 0)) / BI.pixRatio + BI.pixUnit
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
        this.stroke(this.options.items);
    },

    populate: function (items) {
        BI.InlineVerticalAdaptLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.inline_vertical_adapt", BI.InlineVerticalAdaptLayout);
