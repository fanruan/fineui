/**
 * 内联布局
 * @class BI.InlineLayout
 * @extends BI.Layout
 *
 * @cfg {JSON} options 配置属性
 * @cfg {Number} [hgap=0] 水平间隙
 * @cfg {Number} [vgap=0] 垂直间隙
 */
BI.InlineLayout = BI.inherit(BI.Layout, {

    props: function () {
        return BI.extend(BI.InlineLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-i",
            horizontalAlign: BI.HorizontalAlign.Left,
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
        BI.InlineLayout.superclass.render.apply(this, arguments);
        var o = this.options;
        this.element.css({
            textAlign: o.horizontalAlign
        });
        this.populate(o.items);
    },

    _addElement: function (i, item, length) {
        var o = this.options;
        var w = BI.InlineLayout.superclass._addElement.apply(this, arguments);
        w.element.css({
            width: o.columnSize[i] === "" ? "" : (o.columnSize[i] <= 1 ? ((o.columnSize[i] * 100).toFixed(1) + "%") : (o.columnSize[i] / BI.pixRatio + BI.pixUnit)),
            position: "relative",
            "vertical-align": o.verticalAlign
        });
        w.element.addClass("i-item");
        if (o.columnSize[i] === "fill") {
            var left = o.hgap + (item.lgap || 0) + (item.hgap || 0),
                right = o.hgap + (item.rgap || 0) + (item.hgap || 0);
            for (var k = 0; k < i; k++) {
                left += o.hgap + o.lgap + o.rgap + o.columnSize[k];
            }
            for (var k = i + 1; k < o.columnSize.length; k++) {
                right += o.hgap + o.lgap + o.rgap + o.columnSize[k];
            }
            w.element.css("min-width", "calc(100% - " + ((left + right) / BI.pixRatio + BI.pixUnit) + ")");
        }
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
        BI.InlineLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.inline", BI.InlineLayout);
