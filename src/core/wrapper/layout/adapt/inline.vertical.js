/**
 * 内联布局
 * @class BI.InlineVerticalAdaptLayout
 * @extends BI.Layout
 *
 * @cfg {JSON} options 配置属性
 * @cfg {Number} [hgap=0] 水平间隙
 * @cfg {Number} [vgap=0] 垂直间隙
 */
BI.InlineVerticalAdaptLayout = BI.inherit(BI.Layout, {

    props: function () {
        return BI.extend(BI.InlineVerticalAdaptLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-i-v-a",
            horizontalAlign: BI.HorizontalAlign.Left,
            verticalAlign: BI.VerticalAlign.Middle,
            columnSize: [],
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
            type: "bi.inline",
            ref: function (_ref) {
                self.layout = _ref;
            },
            items: o.items,
            horizontalAlign: o.horizontalAlign,
            verticalAlign: o.verticalAlign,
            columnSize: o.columnSize,
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
        this.layout.populate.apply(this.layout, arguments);
    }
});
BI.shortcut("bi.inline_vertical_adapt", BI.InlineVerticalAdaptLayout);
