/**
 *自适应水平和垂直方向都居中容器
 * Created by GUY on 2016/12/2.
 *
 * @class BI.FlexWrapperCenterLayout
 * @extends BI.Layout
 */
BI.FlexWrapperCenterLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FlexWrapperCenterLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-flex-scrollable-center-layout clearfix",
            scrollable: true
        });
    },
    render: function () {
        BI.FlexWrapperCenterLayout.superclass.render.apply(this, arguments);
        this.$wrapper = BI.Widget._renderEngine.createElement("<div>").addClass("flex-scrollable-center-adapt-layout-wrapper");
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.FlexWrapperCenterLayout.superclass._addElement.apply(this, arguments);
        w.element.css({position: "relative"});
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
        // console.log("flex_center_adapt布局不需要resize");
    },

    populate: function (items) {
        BI.FlexWrapperCenterLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.flex_scrollable_center_adapt", BI.FlexWrapperCenterLayout);