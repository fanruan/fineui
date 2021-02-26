/**
 * 垂直方向居中容器
 * @class BI.VerticalAdaptLayout
 * @extends BI.Layout
 */
BI.VerticalAdaptLayout = BI.inherit(BI.Layout, {
    props: {
        baseCls: "bi-v-a",
        horizontalAlign: BI.HorizontalAlign.Left,
        columnSize: [],
        scrollx: false,
        hgap: 0,
        vgap: 0,
        lgap: 0,
        rgap: 0,
        tgap: 0,
        bgap: 0
    },

    render: function () {
        var self = this, o = this.options;
        BI.VerticalAdaptLayout.superclass.render.apply(this, arguments);
        return {
            type: "bi.horizontal",
            verticalAlign: BI.VerticalAlign.Middle,
            horizontalAlign: o.horizontalAlign,
            columnSize: o.columnSize,
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
            bgap: o.bgap
        };
    },

    resize: function () {
        // console.log("vertical_adapt布局不需要resize");
    },

    populate: function (items) {
        this.layout.populate.apply(this, arguments);
    }
});
BI.shortcut("bi.vertical_adapt", BI.VerticalAdaptLayout);
