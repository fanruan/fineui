/**
 * absolute实现的居中布局
 * @class BI.AbsoluteHorizontalLayout
 * @extends BI.Layout
 */
BI.AbsoluteHorizontalLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.AbsoluteHorizontalLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-abs-h-a",
            horizontalAlign: BI.HorizontalAlign.Center,
            rowSize: [],
            hgap: 0,
            lgap: 0,
            rgap: 0,
            vgap: 0,
            tgap: 0,
            bgap: 0
        });
    },

    render: function () {
        var self = this, o = this.options;
        BI.AbsoluteHorizontalLayout.superclass.render.apply(this, arguments);
        return {
            type: "bi.vtape",
            horizontalAlign: o.horizontalAlign,
            rowSize: o.rowSize,
            items: o.items,
            scrollx: o.scrollx,
            scrolly: o.scrolly,
            scrollable: o.scrollable,
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
BI.shortcut("bi.absolute_horizontal_adapt", BI.AbsoluteHorizontalLayout);
