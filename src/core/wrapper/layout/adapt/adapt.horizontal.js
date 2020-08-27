/**
 * 水平方向居中容器
 * @class BI.HorizontalAdaptLayout
 * @extends BI.Layout
 */
BI.HorizontalAdaptLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.HorizontalAdaptLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-horizontal-adapt-layout",
            verticalAlign: BI.VerticalAlign.Top,
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
        BI.HorizontalAdaptLayout.superclass.render.apply(this, arguments);
        return {
            type: "bi.horizontal",
            verticalAlign: o.verticalAlign,
            horizontalAlign: BI.HorizontalAlign.Center,
            columnSize: o.columnSize,
            items: o.items,
            scrollx: o.scrollx,
            ref: function (_ref) {
                self.layout = _ref;
            },
            hgap: o.hgap,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap
        };
    },

    resize: function () {
        // console.log("horizontal_adapt布局不需要resize");
    },

    populate: function (items) {
        this.layout.populate.apply(this, arguments);
    }
});
BI.shortcut("bi.horizontal_adapt", BI.HorizontalAdaptLayout);
