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
            baseCls: "bi-flex-scrollable-vertical-layout clearfix",
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
        var o = this.options;
        this.$wrapper = BI.Widget._renderEngine.createElement("<div>").addClass("flex-scrollable-vertical-layout-wrapper h-" + o.horizontalAlign).addClass("v-" + o.verticalAlign);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.FlexWrapperVerticalLayout.superclass._addElement.apply(this, arguments);
        w.element.css({
            position: "relative"
        });
        if (o.verticalAlign !== BI.VerticalAlign.Stretch && o.rowSize[i] !== "auto") {
            w.element.css({
                "flex-shrink": "0"
            });
        }
        if (o.rowSize[i] > 0) {
            w.element.height(o.rowSize[i] <= 1 ? (o.rowSize[i] * 100 + "%") : (o.rowSize[i] / BI.pixRatio + BI.pixUnit));
        }
        if (o.rowSize[i] === "fill") {
            w.element.css("flex", "1");
        }
        if (o.vgap + o.tgap + (item.tgap || 0) + (item.vgap || 0) !== 0) {
            w.element.css({
                "margin-top": ((i === 0 ? o.vgap : 0) + o.tgap + (item.tgap || 0) + (item.vgap || 0)) / BI.pixRatio + BI.pixUnit
            });
        }
        if (o.hgap + o.lgap + (item.lgap || 0) + (item.hgap || 0) !== 0) {
            w.element.css({
                "margin-left": (o.hgap + o.lgap + (item.lgap || 0) + (item.hgap || 0)) / BI.pixRatio + BI.pixUnit
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

    appendFragment: function (frag) {
        this.$wrapper.append(frag);
        this.element.append(this.$wrapper);
    },

    _getWrapper: function () {
        return this.$wrapper;
    },

    resize: function () {
        // console.log("flex_wrapper_vertical布局不需要resize");
    },

    populate: function (items) {
        BI.FlexWrapperVerticalLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.flex_scrollable_vertical", BI.FlexWrapperVerticalLayout);
