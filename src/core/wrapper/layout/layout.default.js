/**
 * 默认的布局方式
 *
 * @class BI.DefaultLayout
 * @extends BI.Layout
 */
BI.DefaultLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.DefaultLayout.superclass.props.apply(this, arguments), {
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            items: []
        });
    },
    render: function () {
        BI.DefaultLayout.superclass.render.apply(this, arguments);
        var self = this, o = this.options;
        var items = BI.isFunction(o.items) ? this.__watch(o.items, function (context, newValue) {
            self.populate(newValue);
        }) : o.items;
        this.populate(items);
    },

    _addElement: function (i, item) {
        var w = BI.DefaultLayout.superclass._addElement.apply(this, arguments);
        this._handleGap(w, item);
        return w;
    },

    populate: function (items) {
        BI.DefaultLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.default", BI.DefaultLayout);
