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

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.InlineLayout.superclass._addElement.apply(this, arguments);
        var columnSize = o.columnSize.length > 0 ? o.columnSize[i] : item.width >= 1 ? null : item.width;
        if (o.columnSize.length > 0) {
            if (item.width >= 1 && o.columnSize[i] >= 1 && o.columnSize[i] !== item.width) {
                columnSize = null;
            }
        }
        if (columnSize > 0) {
            w.element.width(columnSize < 1 ? ((columnSize * 100).toFixed(1) + "%") : (columnSize / BI.pixRatio + BI.pixUnit));
        }
        w.element.css({
            position: "relative",
            "vertical-align": o.verticalAlign
        });
        w.element.addClass("i-item");
        if (columnSize === "fill" || columnSize === "") {
            var left = o.hgap + (item.lgap || 0) + (item.hgap || 0),
                right = o.hgap + (item.rgap || 0) + (item.hgap || 0);
            for (var k = 0; k < i; k++) {
                left += o.hgap + o.lgap + o.rgap + (o.columnSize[k] || o.items[k].width);
            }
            for (var k = i + 1; k < o.columnSize.length; k++) {
                right += o.hgap + o.lgap + o.rgap + (o.columnSize[k] || o.items[k].width);
            }
            if (columnSize === "fill") {
                w.element.css("min-width", "calc(100% - " + ((left + right) / BI.pixRatio + BI.pixUnit) + ")");
            }
            if (o.horizontalAlign === BI.HorizontalAlign.Stretch || !(o.scrollable === true || o.scrollx === true)) {
                w.element.css("max-width", "calc(100% - " + ((left + right) / BI.pixRatio + BI.pixUnit) + ")");
            }
        }
        if (o.verticalAlign === BI.VerticalAlign.Stretch) {
            var top = o.vgap + (item.tgap || 0) + (item.vgap || 0),
                bottom = o.vgap + (item.bgap || 0) + (item.vgap || 0);
            w.element.css("height", "calc(100% - " + ((top + bottom) / BI.pixRatio + BI.pixUnit) + ")");
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
        throw new Error("不能添加子组件");
    },

    populate: function (items) {
        BI.InlineLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.inline", BI.InlineLayout);
