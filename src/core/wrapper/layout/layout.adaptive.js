BI.AdaptiveLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.AdaptiveLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-adaptive-layout",
            hgap: null,
            vgap: null,
            lgap: null,
            rgap: null,
            tgap: null,
            bgap: null
        });
    },
    _init: function () {
        BI.AdaptiveLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.AdaptiveLayout.superclass._addElement.apply(this, arguments);
        w.element.css({"position": "relative"});
        var left = 0, right = 0, top = 0, bottom = 0;
        if (BI.isNotNull(item.left)) {
            w.element.css({
                "margin-left": item.left
            })
        }
        if (BI.isNotNull(item.right)) {
            w.element.css({
                "margin-right": item.right
            })
        }
        if (BI.isNotNull(item.top)) {
            w.element.css({
                "margin-top": item.top
            })
        }
        if (BI.isNotNull(item.bottom)) {
            w.element.css({
                "margin-bottom": item.bottom
            })
        }

        if (BI.isNotNull(o.hgap)) {
            left += o.hgap;
            w.element.css({"left": left});
            right += o.hgap;
            w.element.css({"right": right});
        }
        if (BI.isNotNull(o.vgap)) {
            top += o.vgap;
            w.element.css({"top": top});
            bottom += o.vgap;
            w.element.css({"bottom": bottom});
        }

        if (BI.isNotNull(o.lgap)) {
            left += o.lgap;
            w.element.css({"left": left});
        }
        if (BI.isNotNull(o.rgap)) {
            right += o.rgap;
            w.element.css({"right": right});
        }
        if (BI.isNotNull(o.tgap)) {
            top += o.tgap;
            w.element.css({"top": top});
        }
        if (BI.isNotNull(o.bgap)) {
            bottom += o.bgap;
            w.element.css({"bottom": bottom});
        }

        if (BI.isNotNull(item.width)) {
            w.element.css({"width": item.width});
        }
        if (BI.isNotNull(item.height)) {
            w.element.css({"height": item.height});
        }
        return w;
    },

    resize: function () {
        this.stroke(this.options.items);
    },

    populate: function (items) {
        BI.AbsoluteLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.adaptive', BI.AdaptiveLayout);