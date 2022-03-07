/**
 *自适应水平和垂直方向都居中容器
 * Created by GUY on 2016/12/2.
 *
 * @class BI.FlexHorizontalLayout
 * @extends BI.Layout
 */
BI.FlexWrapperHorizontalLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FlexWrapperHorizontalLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-f-s-h",
            verticalAlign: BI.VerticalAlign.Top,
            horizontalAlign: BI.HorizontalAlign.Left,
            columnSize: [],
            scrollable: null,
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
        BI.FlexWrapperHorizontalLayout.superclass.render.apply(this, arguments);
        var self = this, o = this.options;
        this.element.addClass("v-" + o.verticalAlign).addClass("h-" + o.horizontalAlign);
        this.$wrapper = BI.Widget._renderEngine.createElement("<div>").addClass("f-s-h-w v-" + o.verticalAlign).addClass("h-" + o.horizontalAlign);
        var items = BI.isFunction(o.items) ? this.__watch(o.items, function (context, newValue) {
            self.populate(newValue);
        }) : o.items;
        this.populate(items);
    },

    _hasFill: function () {
        var o = this.options;
        if (o.columnSize.length > 0) {
            return o.columnSize.indexOf("fill") >= 0;
        }
        return BI.some(o.items, function (i, item) {
            if (item.width === "fill") {
                return true;
            }
        });
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.FlexWrapperHorizontalLayout.superclass._addElement.apply(this, arguments);
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
            this.element.addClass("f-f");
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

    appendFragment: function (frag) {
        this.$wrapper.append(frag);
        this.element.append(this.$wrapper);
    },

    _getWrapper: function () {
        return this.$wrapper;
    },

    populate: function (items) {
        BI.FlexWrapperHorizontalLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.flex_scrollable_horizontal", BI.FlexWrapperHorizontalLayout);
