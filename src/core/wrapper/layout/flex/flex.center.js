/**
 *自适应水平和垂直方向都居中容器
 * Created by GUY on 2016/12/2.
 *
 * @class BI.FlexCenterLayout
 * @extends BI.Layout
 */
BI.FlexCenterLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FlexCenterLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-f-c",
            verticalAlign: BI.VerticalAlign.Middle,
            horizontalAlign: BI.HorizontalAlign.Center,
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
            horizontalAlign: o.horizontalAlign,
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
BI.shortcut("bi.flex_center_adapt", BI.FlexCenterLayout);
