/**
 * 横向黏性布局
 */
BI.HorizontalStickyLayout = BI.inherit(BI.FlexHorizontalLayout, {
    props: function () {
        return BI.extend(BI.HorizontalStickyLayout.superclass.props.apply(this, arguments), {
            extraCls: "bi-h-sticky",
            horizontalAlign: BI.HorizontalAlign.Stretch,
            verticalAlign: BI.VerticalAlign.Stretch
        });
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.HorizontalStickyLayout.superclass._addElement.apply(this, arguments);
        var columnSize = o.columnSize.length > 0 ? o.columnSize[i] : item.width >= 1 ? null : item.width;
        if (o.columnSize.length > 0) {
            if (item.width >= 1 && o.columnSize[i] >= 1 && o.columnSize[i] !== item.width) {
                columnSize = null;
            }
        }
        if (columnSize !== "fill") {
            var firstItemFill = o.columnSize[0] === "fill" || o.items[0].width === "fill";
            w.element.css({
                position: "sticky",
                zIndex: 1,
                left: firstItemFill ? "" : 0,
                right: firstItemFill ? 0 : ""
            });
        } else {
            w.element.css({
                overflow: ""
            });
        }
        return w;
    }
});
BI.shortcut("bi.horizontal_sticky", BI.HorizontalStickyLayout);
