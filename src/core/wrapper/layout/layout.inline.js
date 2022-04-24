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
            bgap: 0,
            items: []
        });
    },

    render: function () {
        BI.InlineLayout.superclass.render.apply(this, arguments);
        var self = this, o = this.options;
        this.element.css({
            textAlign: o.horizontalAlign
        });
        var items = BI.isFunction(o.items) ? this.__watch(o.items, function (context, newValue) {
            self.populate(newValue);
        }) : o.items;
        this.populate(items);
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
            var length  = 0, gap = o.hgap + o.innerHgap;
            var fillCount = 0, autoCount = 0;
            for (var k = 0, len = o.columnSize.length || o.items.length; k < len; k++) {
                var cz = o.columnSize.length > 0 ? o.columnSize[k] : o.items[k].width;
                if (cz === "fill") {
                    fillCount++;
                    cz = 0;
                } else if (cz === "" || BI.isNull(cz)) {
                    autoCount++;
                    cz = 0;
                }
                gap += o.hgap + o.lgap + o.rgap + (o.items[k].lgap || 0) + (o.items[k].rgap || 0) + (o.items[k].hgap || 0);
                length += cz;
            }
            length = length > 0 && length < 1 ? (length * 100).toFixed(1) + "%" : length / BI.pixRatio + BI.pixUnit;
            gap = gap > 0 && gap < 1 ? (gap * 100).toFixed(1) + "%" : gap / BI.pixRatio + BI.pixUnit;
            if (columnSize === "fill") {
                w.element.css("min-width", "calc((100% - " + length + " - " + gap + ")" + (fillCount > 1 ? "/" + fillCount : "") + ")");
            }
            if (o.horizontalAlign === BI.HorizontalAlign.Stretch || !(o.scrollable === true || o.scrollx === true)) {
                if (columnSize === "fill") {
                    w.element.css("max-width", "calc((100% - " + length + " - " + gap + ")" + (fillCount > 1 ? "/" + fillCount : "") + ")");
                } else {
                    w.element.css("max-width", "calc((100% - " + length + " - " + gap + ")" + (autoCount > 1 ? "/" + autoCount : "") + ")");
                }
            }
        }
        this._handleGap(w, item, i);
        if (o.verticalAlign === BI.VerticalAlign.Stretch && BI.isNull(item.height)) {
            var top = o.innerVgap + o.vgap + o.tgap + (item.tgap || 0) + (item.vgap || 0),
                bottom = o.innerVgap + o.vgap + o.bgap + (item.bgap || 0) + (item.vgap || 0);
            var gap = (top + bottom) > 0 && (top + bottom) < 1 ? ((top + bottom) * 100).toFixed(1) + "%" : (top + bottom) / BI.pixRatio + BI.pixUnit;
            w.element.css("height", "calc(100% - " + gap + ")");
        }
        return w;
    },

    populate: function (items) {
        BI.InlineLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.inline", BI.InlineLayout);
