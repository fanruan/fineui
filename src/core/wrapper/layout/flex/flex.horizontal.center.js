/**
 * Created by GUY on 2016/12/2.
 *
 * @class BI.FlexHorizontalCenter
 * @extends BI.Layout
 */
BI.FlexHorizontalCenter = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FlexHorizontalCenter.superclass.props.apply(this, arguments), {
            baseCls: "bi-flex-horizontal-center-adapt-layout",
            verticalAlign: BI.VerticalAlign.Top,
            rowSize: [],
            scrolly: false,
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
            type: "bi.flex_vertical",
            ref: function (_ref) {
                self.wrapper = _ref;
            },
            horizontalAlign: BI.HorizontalAlign.Center,
            verticalAlign: o.verticalAlign,
            columnSize: o.columnSize,
            rowSize: o.rowSize,
            scrollx: o.scrollx,
            scrolly: o.scrolly,
            scrollable: o.scrollable,
            hgap: o.hgap,
            vgap: o.vgap,
            tgap: o.tgap,
            bgap: o.bgap,
            items: o.items
        };
    },

    resize: function () {
        // console.log("flex_vertical_center_adapt布局不需要resize");
    },

    update: function (opt) {
        return this.wrapper.update(opt);
    },

    populate: function (items) {
        this.wrapper.populate(items);
    }
});
BI.shortcut("bi.flex_horizontal_adapt", BI.FlexHorizontalCenter);
BI.shortcut("bi.flex_horizontal_center_adapt", BI.FlexHorizontalCenter);
