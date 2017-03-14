/**
 *自适应水平和垂直方向都居中容器
 * Created by GUY on 2016/12/2.
 *
 * @class BI.FlexVerticalCenter
 * @extends BI.Layout
 */
BI.FlexVerticalCenter = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.FlexVerticalCenter.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-flex-vertical-center",
            columnSize: [],
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    _init: function () {
        BI.FlexVerticalCenter.superclass._init.apply(this, arguments);
        var o = this.options;
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
        this.render();
    }
});
$.shortcut('bi.flex_vertical_center', BI.FlexVerticalCenter);