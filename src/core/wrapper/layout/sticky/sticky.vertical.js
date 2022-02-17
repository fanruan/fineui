/**
 * 纵向黏性布局
 */
BI.VerticalStickyLayout = BI.inherit(BI.FlexVerticalLayout, {
    props: function () {
        return BI.extend(BI.VerticalStickyLayout.superclass.props.apply(this, arguments), {
            extraCls: "bi-v-sticky",
            horizontalAlign: BI.HorizontalAlign.Stretch,
            verticalAlign: BI.VerticalAlign.Stretch
        });
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.VerticalStickyLayout.superclass._addElement.apply(this, arguments);
        var rowSize = o.rowSize.length > 0 ? o.rowSize[i] : item.height >= 1 ? null : item.height;
        if (o.rowSize.length > 0) {
            if (item.height >= 1 && o.rowSize[i] >= 1 && o.rowSize[i] !== item.height) {
                rowSize = null;
            }
        }
        if (rowSize !== "fill") {
            var firstItemFill = o.rowSize[0] === "fill" || o.items[0].height === "fill";
            w.element.css({
                position: "sticky",
                zIndex: 1,
                top: firstItemFill ? "" : 0,
                bottom: firstItemFill ? 0 : ""
            });
        } else {
            w.element.css({
                overflow: ""
            });
        }
        return w;
    }
});
BI.shortcut("bi.vertical_sticky", BI.VerticalStickyLayout);
