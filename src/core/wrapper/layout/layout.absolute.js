/**
 * 固定子组件上下左右的布局容器
 * @class BI.AbsoluteLayout
 * @extends BI.Layout
 */
BI.AbsoluteLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.AbsoluteLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-abs",
            hgap: null,
            vgap: null,
            lgap: null,
            rgap: null,
            tgap: null,
            bgap: null
        });
    },
    render: function () {
        BI.AbsoluteLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.AbsoluteLayout.superclass._addElement.apply(this, arguments);
        var left = 0, right = 0, top = 0, bottom = 0;
        if (BI.isNotNull(item.left)) {
            w.element.css({left: BI.isNumber(item.left) ? this._optimiseGap(item.left) : item.left});
            left += item.left;
        }
        if (BI.isNotNull(item.right)) {
            w.element.css({right: BI.isNumber(item.right) ? this._optimiseGap(item.right) : item.right});
            right += item.right;
        }
        if (BI.isNotNull(item.top)) {
            w.element.css({top: BI.isNumber(item.top) ? this._optimiseGap(item.top) : item.top});
            top += item.top;
        }
        if (BI.isNotNull(item.bottom)) {
            w.element.css({bottom: BI.isNumber(item.bottom) ? this._optimiseGap(item.bottom) : item.bottom});
            bottom += item.bottom;
        }

        if (BI.isNotNull(o.hgap)) {
            left += o.hgap;
            w.element.css({left: this._optimiseGap(left)});
            right += o.hgap;
            w.element.css({right: this._optimiseGap(right)});
        }
        if (BI.isNotNull(o.vgap)) {
            top += o.vgap;
            w.element.css({top: this._optimiseGap(top)});
            bottom += o.vgap;
            w.element.css({bottom: this._optimiseGap(bottom)});
        }

        if (BI.isNotNull(o.lgap)) {
            left += o.lgap;
            w.element.css({left: this._optimiseGap(left)});
        }
        if (BI.isNotNull(o.rgap)) {
            right += o.rgap;
            w.element.css({right: this._optimiseGap(right)});
        }
        if (BI.isNotNull(o.tgap)) {
            top += o.tgap;
            w.element.css({top: this._optimiseGap(top)});
        }
        if (BI.isNotNull(o.bgap)) {
            bottom += o.bgap;
            w.element.css({bottom: this._optimiseGap(bottom)});
        }

        if (BI.isNotNull(item.width)) {
            w.element.css({width: BI.isNumber(item.width) ? this._optimiseGap(item.width) : item.width});
        }
        if (BI.isNotNull(item.height)) {
            w.element.css({height: BI.isNumber(item.height) ? this._optimiseGap(item.height) : item.height});
        }
        w.element.css({position: "absolute"});
        return w;
    },

    populate: function (items) {
        BI.AbsoluteLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.absolute", BI.AbsoluteLayout);
