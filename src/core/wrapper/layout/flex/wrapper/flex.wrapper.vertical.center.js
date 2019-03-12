/**
 *自适应水平和垂直方向都居中容器
 * Created by GUY on 2016/12/2.
 *
 * @class BI.FlexVerticalCenter
 * @extends BI.Layout
 */
BI.FlexWrapperVerticalCenter = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FlexWrapperVerticalCenter.superclass.props.apply(this, arguments), {
            baseCls: "bi-flex-wrapper-vertical-center-adapt-layout clearfix",
            horizontalAlign: BI.HorizontalAlign.Left,
            columnSize: [],
            scrollx: true,
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.flex_wrapper_horizontal",
            ref: function (_ref) {
                self.wrapper = _ref;
            },
            verticalAlign: BI.VerticalAlign.Middle,
            horizontalAlign: o.horizontalAlign,
            columnSize: o.columnSize,
            scrollx: o.scrollx,
            scrolly: o.scrolly,
            scrollable: o.scrollable,
            hgap: o.hgap,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            items: o.items
        };
    },

    populate: function (items) {
        this.wrapper.populate(items);
    }
});
BI.shortcut("bi.flex_wrapper_vertical_adapt", BI.FlexWrapperVerticalCenter);
BI.shortcut("bi.flex_wrapper_vertical_center_adapt", BI.FlexWrapperVerticalCenter);