/**
 *自适应水平和垂直方向都居中容器
 * Created by GUY on 2016/12/2.
 *
 * @class BI.FlexVerticalCenter
 * @extends BI.Layout
 */
BI.FlexVerticalCenter = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FlexVerticalCenter.superclass.props.apply(this, arguments), {
            baseCls: "bi-flex-vertical-center",
            horizontalAlign: BI.HorizontalAlign.Left,
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
        BI.FlexVerticalCenter.superclass.render.apply(this, arguments);
        var o = this.options;
        this.element.addClass(o.horizontalAlign);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.FlexVerticalCenter.superclass._addElement.apply(this, arguments);
        w.element.css({"position": "relative", "flex-shrink": "0"});
        if (o.hgap + o.lgap + (item.lgap || 0) > 0) {
            w.element.css({
                "margin-left": o.hgap + o.lgap + (item.lgap || 0) + "px"
            })
        }
        if (o.hgap + o.rgap + (item.rgap || 0) > 0) {
            w.element.css({
                "margin-right": o.hgap + o.rgap + (item.rgap || 0) + "px"
            })
        }
        if (o.vgap + o.tgap + (item.tgap || 0) > 0) {
            w.element.css({
                "margin-top": o.vgap + o.tgap + (item.tgap || 0) + "px"
            })
        }
        if (o.vgap + o.bgap + (item.bgap || 0) > 0) {
            w.element.css({
                "margin-bottom": o.vgap + o.bgap + (item.bgap || 0) + "px"
            })
        }
        return w;
    },

    resize: function () {
        // console.log("flex_vertical_center布局不需要resize");
    },

    populate: function (items) {
        BI.FlexVerticalCenter.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut('bi.flex_vertical_center', BI.FlexVerticalCenter);