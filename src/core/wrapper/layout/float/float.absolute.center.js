/**
 * absolute实现的居中布局
 * @class BI.FloatAbsoluteCenterLayout
 * @extends BI.Layout
 */
BI.FloatAbsoluteCenterLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FloatAbsoluteCenterLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-abs-c-fl",
        });
    },

    render: function () {
        BI.FloatAbsoluteCenterLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.FloatAbsoluteCenterLayout.superclass._addElement.apply(this, arguments);
        w.element.addClass("bi-abs-c-item").css({
            position: "absolute",
        });
        return w;
    },

    resize: function () {
        // console.log("float_absolute_center_adapt布局不需要resize");
    },

    populate: function (items) {
        BI.FloatAbsoluteCenterLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.absolute_center_float", BI.FloatAbsoluteCenterLayout);
