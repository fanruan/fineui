/**
 *自适应水平和垂直方向都居中容器
 * Created by GUY on 2016/12/2.
 *
 * @class BI.FlexHorizontalLayout
 * @extends BI.Layout
 */
BI.FlexHorizontalLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FlexHorizontalLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-flex-horizontal-layout",
            verticalAlign: BI.VerticalAlign.Top,
            horizontalAlign: BI.HorizontalAlign.Left,// 如果只有一个子元素且想让该子元素横向撑满，设置成Stretch
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
        BI.FlexHorizontalLayout.superclass.render.apply(this, arguments);
        var o = this.options;
        this.element.addClass("v-" + o.verticalAlign).addClass("h-" + o.horizontalAlign);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.FlexHorizontalLayout.superclass._addElement.apply(this, arguments);
        w.element.css({
            position: "relative"
        });
        if (BI.contains([BI.HorizontalAlign.Left, BI.HorizontalAlign.Right], o.horizontalAlign)) {
            w.element.css({
                "flex-shrink": "0"
            });
        }
        if (o.columnSize[i] > 0) {
            w.element.width(o.columnSize[i] <= 1 ? (o.columnSize[i] * 100 + "%") : (o.columnSize[i] / BI.pixRatio + BI.pixUnit));
        }
        if (o.columnSize[i] === "fill") {
            w.element.css("flex", "1");
        }
        if (o.vgap + o.tgap + (item.tgap || 0) + (item.vgap || 0) !== 0) {
            w.element.css({
                "margin-top": (o.vgap + o.tgap + (item.tgap || 0) + (item.vgap || 0)) / BI.pixRatio + BI.pixUnit
            });
        }
        if (o.hgap + o.lgap + (item.lgap || 0) + (item.hgap || 0) !== 0) {
            w.element.css({
                "margin-left": ((i === 0 ? o.hgap : 0) + o.lgap + (item.lgap || 0) + (item.hgap || 0)) / BI.pixRatio + BI.pixUnit
            });
        }
        if (o.hgap + o.rgap + (item.rgap || 0) + (item.hgap || 0) !== 0) {
            w.element.css({
                "margin-right": (o.hgap + o.rgap + (item.rgap || 0) + (item.hgap || 0)) / BI.pixRatio + BI.pixUnit
            });
        }
        if (o.vgap + o.bgap + (item.bgap || 0) + (item.vgap || 0) !== 0) {
            w.element.css({
                "margin-bottom": (o.vgap + o.bgap + (item.bgap || 0) + (item.vgap || 0)) / BI.pixRatio + BI.pixUnit
            });
        }
        return w;
    },

    resize: function () {
        // console.log("flex_horizontal布局不需要resize");
    },

    populate: function (items) {
        BI.FlexHorizontalLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.flex_horizontal", BI.FlexHorizontalLayout);
