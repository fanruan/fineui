/**
 * absolute实现的居中布局
 * @class BI.AbsoluteCenterLayout
 * @extends BI.Layout
 */
BI.AbsoluteCenterLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.AbsoluteCenterLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-abs-c-a",
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
        var self = this, o = this.options;
        var items = BI.isFunction(o.items) ? this.__watch(o.items, function (context, newValue) {
            self.populate(newValue);
        }) : o.items;
        this.populate(items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.AbsoluteCenterLayout.superclass._addElement.apply(this, arguments);
        w.element.css({
            position: "absolute",
            left: this._optimiseGap(o.hgap + o.lgap + (item.lgap || 0) + (item.hgap || 0)),
            right: this._optimiseGap(o.hgap + o.rgap + (item.rgap || 0) + (item.hgap || 0)),
            top: this._optimiseGap(o.vgap + o.tgap + (item.tgap || 0) + (item.vgap || 0)),
            bottom: this._optimiseGap(o.vgap + o.bgap + (item.bgap || 0) + (item.vgap || 0)),
            margin: "auto"
        });
        return w;
    },

    populate: function (items) {
        BI.AbsoluteCenterLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.absolute_center_adapt", BI.AbsoluteCenterLayout);
