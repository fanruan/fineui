/**
 * 内联布局
 * @class BI.InlineHorizontalAdaptLayout
 * @extends BI.Layout
 *
 * @cfg {JSON} options 配置属性
 * @cfg {Number} [hgap=0] 水平间隙
 * @cfg {Number} [vgap=0] 垂直间隙
 */
BI.InlineHorizontalAdaptLayout = BI.inherit(BI.Layout, {

    props: function () {
        return BI.extend(BI.InlineHorizontalAdaptLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-inline-horizontal-adapt-layout",
            horizontalAlign: BI.HorizontalAlign.Center,
            verticalAlign: BI.VerticalAlign.Top,
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
        BI.InlineHorizontalAdaptLayout.superclass.render.apply(this, arguments);
        var o = this.options;
        this.element.css({
            whiteSpace: "nowrap",
            textAlign: o.horizontalAlign
        });
        this.populate(o.items);
    },

    _addElement: function (i, item, length) {
        var o = this.options;
        var w = BI.InlineHorizontalAdaptLayout.superclass._addElement.apply(this, arguments);
        w.element.css({
            width: o.columnSize[i] <= 1 ? (o.columnSize[i] * 100 + "%") : o.columnSize[i],
            position: "relative",
            "vertical-align": o.verticalAlign
        });
        w.element.addClass("inline-horizontal-adapt-item");
        if (o.vgap + o.tgap + (item.tgap || 0) + (item.vgap || 0) !== 0) {
            w.element.css({
                "margin-top": o.vgap + o.tgap + (item.tgap || 0) + (item.vgap || 0) + "px"
            });
        }
        if (o.hgap + o.lgap + (item.lgap || 0) + (item.hgap || 0) !== 0) {
            w.element.css({
                "margin-left": (i === 0 ? o.hgap : 0) + o.lgap + (item.lgap || 0) + (item.hgap || 0) + "px"
            });
        }
        if (o.hgap + o.rgap + (item.rgap || 0) + (item.hgap || 0) !== 0) {
            w.element.css({
                "margin-right": o.hgap + o.rgap + (item.rgap || 0) + (item.hgap || 0) + "px"
            });
        }
        if (o.vgap + o.bgap + (item.bgap || 0) + (item.vgap || 0) !== 0) {
            w.element.css({
                "margin-bottom": o.vgap + o.bgap + (item.bgap || 0) + (item.vgap || 0) + "px"
            });
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
            if (item) {
                self._addElement(i, item, items.length);
            }
        });
    },

    populate: function (items) {
        BI.InlineHorizontalAdaptLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.inline_horizontal_adapt", BI.InlineHorizontalAdaptLayout);
