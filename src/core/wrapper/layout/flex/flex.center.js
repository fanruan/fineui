/**
 *自适应水平和垂直方向都居中容器
 * Created by GUY on 2016/12/2.
 *
 * @class BI.FlexCenterLayout
 * @extends BI.Layout
 */
BI.FlexCenterLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.FlexCenterLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-flex-center-layout"
        });
    },
    _init: function () {
        BI.FlexCenterLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.FlexCenterLayout.superclass._addElement.apply(this, arguments);
        w.element.css({"position": "relative", "flex-shrink": "0"});
        return w;
    },

    resize: function () {
        // console.log("flex_center布局不需要resize");
    },

    populate: function (items) {
        BI.FlexCenterLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.flex_center', BI.FlexCenterLayout);