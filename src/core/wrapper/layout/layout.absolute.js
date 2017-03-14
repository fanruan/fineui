/**
 * 固定子组件上下左右的布局容器
 * @class BI.AbsoluteLayout
 * @extends BI.Layout
 */
BI.AbsoluteLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.AbsoluteLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-absolute-layout",
            hgap: null,
            vgap: null,
            lgap: null,
            rgap: null,
            tgap: null,
            bgap: null
        });
    },
    _init: function () {
        BI.AbsoluteLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.AbsoluteLayout.superclass._addElement.apply(this, arguments);
        var left = 0, right = 0, top = 0, bottom = 0;
        if (BI.isNotNull(item.left)) {
            w.element.css({"left": item.left});
            left += item.left;
        }
        if (BI.isNotNull(item.right)) {
            w.element.css({"right": item.right});
            right += item.right;
        }
        if (BI.isNotNull(item.top)) {
            w.element.css({"top": item.top});
            top += item.top;
        }
        if (BI.isNotNull(item.bottom)) {
            w.element.css({"bottom": item.bottom});
            bottom += item.bottom;
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
        w.element.css({"position": "absolute"});
        return w;
    },

    resize: function () {
        this.stroke(this.options.items);
    },

    stroke: function (items) {
        var self = this;
        BI.each(items, function (i, item) {
            if (!!item) {
                if (!BI.isWidget(item) && !item.el) {
                    throw new Error("absolute布局中el 是必要属性");
                }
                self._addElement(i, item);
            }
        });
    },

    populate: function (items) {
        BI.AbsoluteLayout.superclass.populate.apply(this, arguments);
        this.render();
    }
});
$.shortcut('bi.absolute', BI.AbsoluteLayout);