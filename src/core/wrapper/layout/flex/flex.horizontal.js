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
            baseCls: "bi-f-h",
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
        if (o.scrollable === true || o.scrollx === true) {
            this.element.addClass("f-scroll-x");
        }
        if (o.scrollable === true || o.scrolly === true) {
            this.element.addClass("f-scroll-y");
        }
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.FlexHorizontalLayout.superclass._addElement.apply(this, arguments);
        var columnSize = o.columnSize.length > 0 ? o.columnSize[i] : item.width;
        w.element.css({
            position: "relative"
        });
        if (columnSize !== "auto") {
            if (columnSize === "fill" || columnSize === "") {
                if (o.horizontalAlign !== BI.HorizontalAlign.Stretch) {
                    if (o.scrollable === true || o.scrollx === true) {
                        w.element.addClass("f-s-n");
                    }
                }
            } else {
                w.element.addClass("f-s-n");
            }
        }
        if (columnSize > 0) {
            w.element.width(columnSize <= 1 ? ((columnSize * 100).toFixed(1) + "%") : (columnSize / BI.pixRatio + BI.pixUnit));
        }
        if (columnSize === "fill") {
            w.element.addClass("f-f");
        }
        w.element.addClass("c-e");
        if (i === 0) {
            w.element.addClass("f-c");
        }
        if (i === o.items.length - 1) {
            w.element.addClass("l-c");
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
