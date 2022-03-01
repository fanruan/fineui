/**
 *自适应水平和垂直方向都居中容器
 * Created by GUY on 2016/12/2.
 *
 * @class BI.FlexVerticalCenter
 * @extends BI.Layout
 */
BI.FlexVerticalCenter = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FlexVerticalCenter.superclass.props.apply(this, arguments), {
            baseCls: "bi-f-v-c",
            horizontalAlign: BI.HorizontalAlign.Left,
            verticalAlign: BI.VerticalAlign.Middle,
            columnSize: [],
            scrollx: false,
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
            type: "bi.flex_horizontal",
            ref: function (_ref) {
                self.layout = _ref;
            },
            verticalAlign: o.verticalAlign,
            horizontalAlign: o.horizontalAlign,
            columnSize: o.columnSize,
            rowSize: o.rowSize,
            scrollx: o.scrollx,
            scrolly: o.scrolly,
            scrollable: o.scrollable,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            hgap: o.hgap,
            innerHgap: o.innerHgap,
            innerVgap: o.innerVgap,
            items: o.items
        };
    },

    resize: function () {
        this.layout.resize();
    },

    populate: function (items) {
        this.layout.populate(items);
    }
});
BI.shortcut("bi.flex_vertical_adapt", BI.FlexVerticalCenter);
BI.shortcut("bi.flex_vertical_center_adapt", BI.FlexVerticalCenter);
