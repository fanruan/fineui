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
        var self = this, o = this.options;
        var items = BI.isFunction(o.items) ? this.__watch(o.items, function (context, newValue) {
            self.populate(newValue);
        }) : o.items;
        this.populate(items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.AbsoluteLayout.superclass._addElement.apply(this, arguments);
        var left = 0, right = 0, top = 0, bottom = 0;
        var offsets = BI.pick(item, ["top", "right", "bottom", "left"]);

        if (BI.isKey(item.inset)) {
            var insets = BI.map((item.inset + "").split(" "), function (i, str) {
                return BI.parseFloat(str);
            });
            switch (insets.length) {
                case 1:
                    offsets = {top: insets[0], bottom: insets[0], left: insets[0], right: insets[0]}
                    break;
                case 2:
                    offsets = {top: insets[0], bottom: insets[0], left: insets[1], right: insets[1]}
                    break;
                case 3:
                    offsets = {top: insets[0], left: insets[1], right: insets[1], bottom: insets[2]}
                    break
                case 4:
                default:
                    offsets = {top: insets[0], right: insets[1], bottom: insets[2], left: insets[3]}
                    break;
            }
        }
        if (BI.isNotNull(offsets.left)) {
            w.element.css({left: BI.isNumber(offsets.left) ? this._optimiseGap(offsets.left) : offsets.left});
            left += offsets.left;
        }
        if (BI.isNotNull(offsets.right)) {
            w.element.css({right: BI.isNumber(offsets.right) ? this._optimiseGap(offsets.right) : offsets.right});
            right += offsets.right;
        }
        if (BI.isNotNull(offsets.top)) {
            w.element.css({top: BI.isNumber(offsets.top) ? this._optimiseGap(offsets.top) : offsets.top});
            top += offsets.top;
        }
        if (BI.isNotNull(offsets.bottom)) {
            w.element.css({bottom: BI.isNumber(offsets.bottom) ? this._optimiseGap(offsets.bottom) : offsets.bottom});
            bottom += offsets.bottom;
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
