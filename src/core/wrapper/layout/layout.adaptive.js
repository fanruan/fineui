BI.AdaptiveLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.AdaptiveLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-adaptive",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    render: function () {
        BI.AdaptiveLayout.superclass.render.apply(this, arguments);
        var self = this, o = this.options;
        var items = BI.isFunction(o.items) ? this.__watch(o.items, function (context, newValue) {
            self.populate(newValue);
        }) : o.items;
        this.populate(items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.AdaptiveLayout.superclass._addElement.apply(this, arguments);
        w.element.css({position: "relative"});
        if (BI.isNotNull(item.left)) {
            w.element.css({
                left: BI.isNumber(item.left) ? this._optimiseGap(item.left) : item.left
            });
        }
        if (BI.isNotNull(item.right)) {
            w.element.css({
                right: BI.isNumber(item.right) ? this._optimiseGap(item.right) : item.right
            });
        }
        if (BI.isNotNull(item.top)) {
            w.element.css({
                top: BI.isNumber(item.top) ? this._optimiseGap(item.top) : item.top
            });
        }
        if (BI.isNotNull(item.bottom)) {
            w.element.css({
                bottom: BI.isNumber(item.bottom) ? this._optimiseGap(item.bottom) : item.bottom
            });
        }

        this._handleGap(w, item);

        if (BI.isNotNull(item.width)) {
            w.element.css({width: BI.isNumber(item.width) ? this._optimiseGap(item.width) : item.width});
        }
        if (BI.isNotNull(item.height)) {
            w.element.css({height: BI.isNumber(item.height) ? this._optimiseGap(item.height) : item.height});
        }
        return w;
    },

    populate: function (items) {
        BI.AbsoluteLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.adaptive", BI.AdaptiveLayout);
