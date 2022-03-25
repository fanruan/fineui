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
            horizontalAlign: BI.HorizontalAlign.Left, // 如果只有一个子元素且想让该子元素横向撑满，设置成Stretch
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
        var self = this, o = this.options;
        this.element.addClass("v-" + o.verticalAlign).addClass("h-" + o.horizontalAlign);
        if (o.scrollable === true || o.scrollx === true) {
            this.element.addClass("f-scroll-x");
        }
        if (o.scrollable === true || o.scrolly === true) {
            this.element.addClass("f-scroll-y");
        }
        var items = BI.isFunction(o.items) ? this.__watch(o.items, function (context, newValue) {
            self.populate(newValue);
        }) : o.items;
        this.populate(items);
    },

    _hasFill: function () {
        var o = this.options;
        if (o.columnSize.length > 0) {
            return o.columnSize.indexOf("fill") >= 0 || o.columnSize.indexOf("auto") >= 0;
        }
        return BI.some(o.items, function (i, item) {
            if (item.width === "fill" || item.width === "auto") {
                return true;
            }
        });
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.FlexHorizontalLayout.superclass._addElement.apply(this, arguments);
        var columnSize = o.columnSize.length > 0 ? o.columnSize[i] : item.width >= 1 ? null : item.width;
        if (o.columnSize.length > 0) {
            if (item.width >= 1 && o.columnSize[i] >= 1 && o.columnSize[i] !== item.width) {
                columnSize = null;
            }
        }
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
                // 当既有动态宽度和自适应宽度的时候只压缩自适应
                if (columnSize === "" && this._hasFill()) {
                    w.element.addClass("f-s-n");
                }
            } else {
                w.element.addClass("f-s-n");
            }
        }
        if (columnSize > 0) {
            w.element.width(this._optimiseGap(columnSize));
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
        this._handleGap(w, item, i);
        return w;
    },

    populate: function (items) {
        BI.FlexHorizontalLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.flex_horizontal", BI.FlexHorizontalLayout);
