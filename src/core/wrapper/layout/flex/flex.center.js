/**
 *自适应水平和垂直方向都居中容器
 * Created by GUY on 2016/12/2.
 *
 * @class BI.FlexCenterLayout
 * @extends BI.Layout
 */
BI.FlexCenterLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FlexCenterLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-flex-center-adapt-layout",
            hgap: 0,
            vgap: 0
        });
    },
    render: function () {
        BI.FlexCenterLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.FlexCenterLayout.superclass._addElement.apply(this, arguments);
        w.element.css({
            position: "relative",
            "flex-shrink": "0",
            "margin-left": (i === 0 ? o.hgap : 0) + "px",
            "margin-right": o.hgap + "px",
            "margin-top": o.vgap + "px",
            "margin-bottom": o.vgap + "px"
        });
        return w;
    },

    resize: function () {
        // console.log("flex_center_adapt布局不需要resize");
    },

    populate: function (items) {
        BI.FlexCenterLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.flex_center_adapt", BI.FlexCenterLayout);