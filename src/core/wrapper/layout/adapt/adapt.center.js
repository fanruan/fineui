/**
 * 自适应水平和垂直方向都居中容器
 * @class BI.CenterAdaptLayout
 * @extends BI.Layout
 */
BI.CenterAdaptLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.CenterAdaptLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-c-a",
            horizontalAlign: BI.HorizontalAlign.Center,
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
        var o = this.options, self = this;
        BI.CenterAdaptLayout.superclass.render.apply(this, arguments);
        return {
            type: "bi.horizontal",
            verticalAlign: BI.VerticalAlign.Middle,
            horizontalAlign: o.horizontalAlign,
            columnSize: o.columnSize,
            scrollx: o.scrollx,
            scrolly: o.scrolly,
            scrollable: o.scrollable,
            items: o.items,
            ref: function (_ref) {
                self.layout = _ref;
            },
            hgap: o.hgap,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            innerHgap: o.innerHgap,
            innerVgap: o.innerVgap,
        };
    },

    resize: function () {
        this.layout.resize();
    },

    populate: function (items) {
        this.layout.populate.apply(this, arguments);
    }
});
BI.shortcut("bi.center_adapt", BI.CenterAdaptLayout);
