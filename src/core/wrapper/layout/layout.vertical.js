/**
 * 垂直布局
 * @class BI.VerticalLayout
 * @extends BI.Layout
 */
BI.VerticalLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.VerticalLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-v",
            horizontalAlign: BI.HorizontalAlign.Stretch,
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            scrolly: true
        });
    },
    render: function () {
        BI.VerticalLayout.superclass.render.apply(this, arguments);
        var self = this, o = this.options;
        var items = BI.isFunction(o.items) ? this.__watch(o.items, function (context, newValue) {
            self.populate(newValue);
        }) : o.items;
        this.populate(items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.VerticalLayout.superclass._addElement.apply(this, arguments);
        w.element.css({
            position: "relative"
        });
        this._handleGap(w, item, null, i);
        if (o.horizontalAlign === BI.HorizontalAlign.Center) {
            w.element.css({
                marginLeft: "auto",
                marginRight: "auto"
            });
        } else if (o.horizontalAlign === BI.HorizontalAlign.Right) {
            w.element.css({
                marginLeft: "auto"
            });
        }
        return w;
    },

    populate: function (items) {
        BI.VerticalLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.vertical", BI.VerticalLayout);
