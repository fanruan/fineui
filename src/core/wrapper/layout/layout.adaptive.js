BI.AdaptiveLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.AdaptiveLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-adaptive",
            hgap: null,
            vgap: null,
            lgap: null,
            rgap: null,
            tgap: null,
            bgap: null
        });
    },
    render: function () {
        BI.AdaptiveLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.AdaptiveLayout.superclass._addElement.apply(this, arguments);
        w.element.css({position: "relative"});
        if (BI.isNotNull(item.left)) {
            w.element.css({
                left: BI.isNumber(item.left) ? item.left / BI.pixRatio + BI.pixUnit : item.left
            });
        }
        if (BI.isNotNull(item.right)) {
            w.element.css({
                right: BI.isNumber(item.right) ? item.right / BI.pixRatio + BI.pixUnit : item.right
            });
        }
        if (BI.isNotNull(item.top)) {
            w.element.css({
                top: BI.isNumber(item.top) ? item.top / BI.pixRatio + BI.pixUnit : item.top
            });
        }
        if (BI.isNotNull(item.bottom)) {
            w.element.css({
                bottom: BI.isNumber(item.bottom) ? item.bottom / BI.pixRatio + BI.pixUnit : item.bottom
            });
        }

        this._handleGap(w, item);

        if (BI.isNotNull(item.width)) {
            w.element.css({width: BI.isNumber(item.width) ? item.width / BI.pixRatio + BI.pixUnit : item.width});
        }
        if (BI.isNotNull(item.height)) {
            w.element.css({height: BI.isNumber(item.height) ? item.height / BI.pixRatio + BI.pixUnit : item.height});
        }
        return w;
    },

    populate: function (items) {
        BI.AbsoluteLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.adaptive", BI.AdaptiveLayout);
