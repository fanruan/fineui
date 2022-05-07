/**
 *自适应水平和垂直方向都居中容器
 * Created by GUY on 2016/12/2.
 *
 * @class BI.FlexWrapperVerticalLayout
 * @extends BI.Layout
 */
BI.FlexWrapperVerticalLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FlexWrapperVerticalLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-f-s-v",
            horizontalAlign: BI.HorizontalAlign.Left,
            verticalAlign: BI.VerticalAlign.Top,
            rowSize: [],
            scrollable: null,
            scrolly: true,
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    render: function () {
        BI.FlexWrapperVerticalLayout.superclass.render.apply(this, arguments);
        var self = this, o = this.options;
        this.element.addClass("v-" + o.verticalAlign).addClass("h-" + o.horizontalAlign);
        this.$wrapper = BI.Widget._renderEngine.createElement("<div>").addClass("f-s-v-w h-" + o.horizontalAlign).addClass("v-" + o.verticalAlign);
        var items = BI.isFunction(o.items) ? this.__watch(o.items, function (context, newValue) {
            self.populate(newValue);
        }) : o.items;
        this.populate(items);
    },

    _hasFill: function () {
        var o = this.options;
        if (o.rowSize.length > 0) {
            return o.rowSize.indexOf("fill") >= 0 || o.rowSize.indexOf("auto") >= 0;
        }
        return BI.some(o.items, function (i, item) {
            if (item.height === "fill" || item.height === "auto") {
                return true;
            }
        });
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.FlexWrapperVerticalLayout.superclass._addElement.apply(this, arguments);
        var rowSize = o.rowSize.length > 0 ? o.rowSize[i] : item.height;
        if (o.rowSize.length > 0) {
            if (item.height >= 1 && o.rowSize[i] >= 1 && o.rowSize[i] !== item.height) {
                rowSize = null;
            }
        }
        w.element.css({
            position: "relative"
        });
        if (rowSize !== "auto") {
            if (rowSize === "fill" || rowSize === "") {
                if (o.verticalAlign !== BI.VerticalAlign.Stretch) {
                    if (o.scrollable === true || o.scrolly === true) {
                        w.element.addClass("f-s-n");
                    }
                }
                // 当既有动态宽度和自适应宽度的时候只压缩自适应
                if (rowSize === "" && this._hasFill()) {
                    w.element.addClass("f-s-n");
                }
            } else {
                w.element.addClass("f-s-n");
            }
        }
        if (rowSize > 0) {
            w.element.height(this._optimiseGap(rowSize));
        }
        if (rowSize === "fill") {
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
        this._handleGap(w, item, null, i);
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
        BI.FlexWrapperVerticalLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.flex_scrollable_vertical", BI.FlexWrapperVerticalLayout);
