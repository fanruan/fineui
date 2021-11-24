/**
 * 横向响应式布局
 * Created by GUY on 2016/12/2.
 *
 * @class BI.ResponsiveInlineLayout
 * @extends BI.InlineLayout
 */
BI.ResponsiveInlineLayout = BI.inherit(BI.InlineLayout, {
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
            var length = o.hgap, czs = 0;
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
                length += o.hgap + o.lgap + o.rgap + (o.items[k].lgap || 0) + (o.items[k].rgap || 0) + (o.items[k].hgap || 0) + cz;
                czs += cz;
            }
            if (columnSize === "fill") {
                var count = (o.columnSize.length || o.items.length) - fillCount - autoCount;
                if (count > 0) {
                    w.element.css("min-width", czs / count / BI.pixRatio + BI.pixUnit);
                }
                w.element.css("width", "calc((100% - " + (length / BI.pixRatio + BI.pixUnit) + ")" + (fillCount > 1 ? "/" + fillCount : "") + ")");
            }
            if (o.horizontalAlign === BI.HorizontalAlign.Stretch || !(o.scrollable === true || o.scrollx === true)) {
                if (columnSize === "fill") {
                    w.element.css("max-width", "calc((100% - " + (length / BI.pixRatio + BI.pixUnit) + ")" + (fillCount > 1 ? "/" + fillCount : "") + ")");
                } else {
                    w.element.css("max-width", "calc((100% - " + (length / BI.pixRatio + BI.pixUnit) + ")" + (autoCount > 1 ? "/" + autoCount : "") + ")");
                }
            }
        }
        this._handleGap(w, item, i);
        if (o.verticalAlign === BI.VerticalAlign.Stretch && BI.isNull(item.height)) {
            var top = o.vgap + o.tgap + (item.tgap || 0) + (item.vgap || 0),
                bottom = o.vgap + o.bgap + (item.bgap || 0) + (item.vgap || 0);
            w.element.css("height", "calc(100% - " + ((top + bottom) / BI.pixRatio + BI.pixUnit) + ")");
        }
        return w;
    }
});
BI.shortcut("bi.responsive_inline", BI.ResponsiveInlineLayout);
