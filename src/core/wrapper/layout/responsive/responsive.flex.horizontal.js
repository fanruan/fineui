/**
 * 横向响应式布局
 * Created by GUY on 2016/12/2.
 *
 * @class BI.ResponsiveFlexHorizontalLayout
 * @extends BI.FlexHorizontalLayout
 */
BI.ResponsiveFlexHorizontalLayout = BI.inherit(BI.FlexHorizontalLayout, {
    // props: function () {
    //     return BI.extend(BI.ResponsiveFlexHorizontalLayout.superclass.props.apply(this, arguments), {
    //         // extraCls: "bi-responsive-f-h"
    //     });
    // },

    mounted: function () {
        var self = this, o = this.options;
        if (o.horizontalAlign !== BI.HorizontalAlign.Center){
            return;
        }
        var defaultResize = function () {
            if (o.scrollable !== true && o.scrollx !== true) {
                var clientWidth = document.body.clientWidth;
                if(self.element.width() > 2/3 * clientWidth){
                    if (clientWidth <= 768) {
                        BI.each(self._children, function (i, child) {
                            self._clearGap(child);
                            self._handleReverseGap(child, o.items[i], i | 0);
                        });
                        self.element.css("flex-direction", "column");
                    }
                }
            }
        }
        var resize = function () {
            defaultResize();
            if (o.scrollable !== true && o.scrollx !== true) {
                var clientWidth = document.body.clientWidth;
                if(self.element.width() > 2/3 * clientWidth){
                    if (clientWidth > 768) {
                        BI.each(self._children, function (i, child) {
                            self._clearGap(child);
                        })
                        self.resize();
                        self.element.css("flex-direction", "row");
                    }
                }
            }
        }
        this.unResize = BI.Resizers.add(this.getName(), resize);
        defaultResize();
    },

    destroyed: function () {
        this.unResize();
    }
});
BI.shortcut("bi.responsive_flex_horizontal", BI.ResponsiveFlexHorizontalLayout);
