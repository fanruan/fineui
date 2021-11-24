/**
 * 横向响应式布局
 * Created by GUY on 2016/12/2.
 *
 * @class BI.ResponsiveFlexWrapperHorizontalLayout
 * @extends BI.FlexWrapperHorizontalLayout
 */
BI.ResponsiveFlexWrapperHorizontalLayout = BI.inherit(BI.FlexWrapperHorizontalLayout, {
    props: function () {
        return BI.extend(BI.ResponsiveFlexWrapperHorizontalLayout.superclass.props.apply(this, arguments), {
            extraCls: "bi-responsive-f-h"
        });
    },

    _addElement: function (i, item) {
        var w = BI.ResponsiveFlexHorizontalLayout.superclass._addElement.apply(this, arguments);
        var o = this.options;
        var columnSize = o.columnSize.length > 0 ? o.columnSize[i] : item.width >= 1 ? null : item.width;
        if (o.columnSize.length > 0) {
            if (item.width >= 1 && o.columnSize[i] >= 1 && o.columnSize[i] !== item.width) {
                columnSize = null;
            }
        }
        if (columnSize === "fill") {
            // 给自适应列设置一个min-width
            var length = 0;
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
                length += cz;
            }
            var count = (o.columnSize.length || o.items.length) - fillCount - autoCount;
            if (count > 0) {
                w.element.css("min-width", length / count / BI.pixRatio + BI.pixUnit);
            }
        }
        return w;
    }
});
BI.shortcut("bi.responsive_flex_scrollable_horizontal", BI.ResponsiveFlexWrapperHorizontalLayout);
