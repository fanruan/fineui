/**
 * Created by GUY on 2016/12/2.
 *
 * @class BI.FlexVerticalLayout
 * @extends BI.Layout
 */
BI.FlexVerticalLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FlexVerticalLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-f-v",
            horizontalAlign: BI.HorizontalAlign.Left,
            verticalAlign: BI.VerticalAlign.Top,
            rowSize: [],
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
        BI.FlexVerticalLayout.superclass.render.apply(this, arguments);
        var o = this.options;
        this.element.addClass("h-" + o.horizontalAlign).addClass("v-" + o.verticalAlign);
        if (o.scrollable === true || o.scrollx === true) {
            this.element.addClass("f-scroll-x");
        }
        if (o.scrollable === true || o.scrolly === true) {
            this.element.addClass("f-scroll-y");
        }
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var w = BI.FlexVerticalLayout.superclass._addElement.apply(this, arguments);
        var o = this.options;
        w.element.css({
            position: "relative"
        });
        if (o.rowSize[i] === "fill" || o.rowSize[i] === "") {
            if (o.verticalAlign !== BI.VerticalAlign.Stretch) {
                if (o.scrollable === true || o.scrolly === true) {
                    w.element.addClass("f-s-n");
                }
            }
        }
        if (o.rowSize[i] > 0) {
            w.element.addClass("f-s-n");
            w.element.height(o.rowSize[i] === "" ? "" : (o.rowSize[i] <= 1 ? ((o.rowSize[i] * 100).toFixed(1) + "%") : (o.rowSize[i] / BI.pixRatio + BI.pixUnit)));
        }
        if (o.rowSize[i] === "fill") {
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

    resize: function () {
        // console.log("flex_vertical布局不需要resize");
    },

    populate: function (items) {
        BI.FlexVerticalLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.flex_vertical", BI.FlexVerticalLayout);
