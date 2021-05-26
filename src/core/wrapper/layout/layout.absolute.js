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
            w.element.css({left: BI.isNumber(item.left) ? item.left / BI.pixRatio + BI.pixUnit : item.left});
            left += item.left;
        }
        if (BI.isNotNull(item.right)) {
            w.element.css({right: BI.isNumber(item.right) ? item.right / BI.pixRatio + BI.pixUnit : item.right});
            right += item.right;
        }
        if (BI.isNotNull(item.top)) {
            w.element.css({top: BI.isNumber(item.top) ? item.top / BI.pixRatio + BI.pixUnit : item.top});
            top += item.top;
        }
        if (BI.isNotNull(item.bottom)) {
            w.element.css({bottom: BI.isNumber(item.bottom) ? item.bottom / BI.pixRatio + BI.pixUnit : item.bottom});
            bottom += item.bottom;
        }

        if (BI.isNotNull(o.hgap)) {
            left += o.hgap;
            w.element.css({left: left / BI.pixRatio + BI.pixUnit});
            right += o.hgap;
            w.element.css({right: right / BI.pixRatio + BI.pixUnit});
        }
        if (BI.isNotNull(o.vgap)) {
            top += o.vgap;
            w.element.css({top: top / BI.pixRatio + BI.pixUnit});
            bottom += o.vgap;
            w.element.css({bottom: bottom / BI.pixRatio + BI.pixUnit});
        }

        if (BI.isNotNull(o.lgap)) {
            left += o.lgap;
            w.element.css({left: left / BI.pixRatio + BI.pixUnit});
        }
        if (BI.isNotNull(o.rgap)) {
            right += o.rgap;
            w.element.css({right: right / BI.pixRatio + BI.pixUnit});
        }
        if (BI.isNotNull(o.tgap)) {
            top += o.tgap;
            w.element.css({top: top / BI.pixRatio + BI.pixUnit});
        }
        if (BI.isNotNull(o.bgap)) {
            bottom += o.bgap;
            w.element.css({bottom: bottom / BI.pixRatio + BI.pixUnit});
        }

        if (BI.isNotNull(item.width)) {
            w.element.css({width: BI.isNumber(item.width) ? item.width / BI.pixRatio + BI.pixUnit : item.width});
        }
        if (BI.isNotNull(item.height)) {
            w.element.css({height: BI.isNumber(item.height) ? item.height / BI.pixRatio + BI.pixUnit : item.height});
        }
        w.element.css({position: "absolute"});
        return w;
    },

    resize: function () {
        this.stroke(this.options.items);
    },

    populate: function (items) {
        BI.AbsoluteLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.absolute", BI.AbsoluteLayout);
