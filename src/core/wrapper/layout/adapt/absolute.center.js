/**
 * absolute实现的居中布局
 * @class BI.AbsoluteCenterLayout
 * @extends BI.Layout
 */
BI.AbsoluteCenterLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.AbsoluteCenterLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-absolute-center-layout",
            hgap: 0,
            lgap: 0,
            rgap: 0,
            vgap: 0,
            tgap: 0,
            bgap: 0
        });
    },

    render: function () {
        BI.AbsoluteCenterLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.AbsoluteCenterLayout.superclass._addElement.apply(this, arguments);
        w.element.css({
            position: "absolute",
            left: (o.hgap + o.lgap + (item.lgap || 0) + (item.hgap || 0)) / BI.pixRatio + BI.pixUnit,
            right: (o.hgap + o.rgap + (item.rgap || 0) + (item.hgap || 0)) / BI.pixRatio + BI.pixUnit,
            top: (o.vgap + o.tgap + (item.tgap || 0) + (item.vgap || 0)) / BI.pixRatio + BI.pixUnit,
            bottom: (o.vgap + o.bgap + (item.bgap || 0) + (item.vgap || 0)) / BI.pixRatio + BI.pixUnit,
            margin: "auto"
        });
        return w;
    },

    resize: function () {
        // console.log("absolute_center_adapt布局不需要resize");
    },

    populate: function (items) {
        BI.AbsoluteCenterLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.absolute_center_adapt", BI.AbsoluteCenterLayout);
