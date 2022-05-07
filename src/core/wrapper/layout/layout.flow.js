/**
 * 靠左对齐的自由浮动布局
 * @class BI.FloatLeftLayout
 * @extends BI.Layout
 *
 * @cfg {JSON} options 配置属性
 * @cfg {Number} [hgap=0] 水平间隙
 * @cfg {Number} [vgap=0] 垂直间隙
 */
BI.FloatLeftLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FloatLeftLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-left clearfix",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    render: function () {
        BI.FloatLeftLayout.superclass.render.apply(this, arguments);
        var self = this, o = this.options;
        if (o.innerHgap !== 0) {
            this.element.css({
                paddingLeft: this._optimiseGap(o.innerHgap),
                paddingRight: this._optimiseGap(o.innerHgap)
            })
        }
        if (o.innerVgap !== 0) {
            this.element.css({
                paddingTop: this._optimiseGap(o.innerVgap),
                paddingBottom: this._optimiseGap(o.innerVgap)
            })
        }
        var items = BI.isFunction(o.items) ? this.__watch(o.items, function (context, newValue) {
            self.populate(newValue);
        }) : o.items;
        this.populate(items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.FloatLeftLayout.superclass._addElement.apply(this, arguments);
        w.element.css({position: "relative", float: "left"});
        if (BI.isNotNull(item.left)) {
            w.element.css({left: BI.isNumber(item.left) ? this._optimiseGap(item.left) : item.left});
        }
        if (BI.isNotNull(item.right)) {
            w.element.css({right: BI.isNumber(item.right) ? this._optimiseGap(item.right) : item.right});
        }
        if (BI.isNotNull(item.top)) {
            w.element.css({top: BI.isNumber(item.top) ? this._optimiseGap(item.top) : item.top});
        }
        if (BI.isNotNull(item.bottom)) {
            w.element.css({bottom: BI.isNumber(item.bottom) ? this._optimiseGap(item.bottom) : item.bottom});
        }
        if (o.vgap + o.tgap + (item.tgap || 0) + (item.vgap || 0) !== 0) {
            var top = o.vgap / 2 + o.tgap + (item.tgap || 0) + (item.vgap || 0);
            w.element.css({
                "margin-top": this._optimiseGap(top)
            });
        }
        if (o.hgap + o.lgap + (item.lgap || 0) + (item.hgap || 0) !== 0) {
            var left = o.hgap / 2 + o.lgap + (item.lgap || 0) + (item.hgap || 0);
            w.element.css({
                "margin-left": this._optimiseGap(left)
            });
        }
        if (o.hgap + o.rgap + (item.rgap || 0) + (item.hgap || 0) !== 0) {
            var right = o.hgap / 2 + o.rgap + (item.rgap || 0) + (item.hgap || 0);
            w.element.css({
                "margin-right": this._optimiseGap(right)
            });
        }
        if (o.vgap + o.bgap + (item.bgap || 0) + (item.vgap || 0) !== 0) {
            var bottom = o.vgap / 2 + o.bgap + (item.bgap || 0) + (item.vgap || 0);
            w.element.css({
                "margin-bottom": this._optimiseGap(bottom)
            });
        }
        return w;
    },

    populate: function (items) {
        BI.FloatLeftLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.left", BI.FloatLeftLayout);

/**
 * 靠右对齐的自由浮动布局
 * @class BI.FloatRightLayout
 * @extends BI.Layout
 *
 * @cfg {JSON} options 配置属性
 * @cfg {Number} [hgap=0] 水平间隙
 * @cfg {Number} [vgap=0] 垂直间隙
 */
BI.FloatRightLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FloatRightLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-right clearfix",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    render: function () {
        BI.FloatRightLayout.superclass.render.apply(this, arguments);
        var self = this, o = this.options;
        if (o.innerHgap !== 0) {
            this.element.css({
                paddingLeft: this._optimiseGap(o.innerHgap),
                paddingRight: this._optimiseGap(o.innerHgap)
            })
        }
        if (o.innerVgap !== 0) {
            this.element.css({
                paddingTop: this._optimiseGap(o.innerVgap),
                paddingBottom: this._optimiseGap(o.innerVgap)
            })
        }
        var items = BI.isFunction(o.items) ? this.__watch(o.items, function (context, newValue) {
            self.populate(newValue);
        }) : o.items;
        this.populate(items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.FloatRightLayout.superclass._addElement.apply(this, arguments);
        w.element.css({position: "relative", float: "right"});
        if (BI.isNotNull(item.left)) {
            w.element.css({left: BI.isNumber(item.left) ? item.left / BI.pixRatio + BI.pixUnit : item.left});
        }
        if (BI.isNotNull(item.right)) {
            w.element.css({right: BI.isNumber(item.right) ? item.right / BI.pixRatio + BI.pixUnit : item.right});
        }
        if (BI.isNotNull(item.top)) {
            w.element.css({top: BI.isNumber(item.top) ? item.top / BI.pixRatio + BI.pixUnit : item.top});
        }
        if (BI.isNotNull(item.bottom)) {
            w.element.css({bottom: BI.isNumber(item.bottom) ? item.bottom / BI.pixRatio + BI.pixUnit : item.bottom});
        }
        if (o.vgap + o.tgap + (item.tgap || 0) + (item.vgap || 0) !== 0) {
            w.element.css({
                "margin-top": (o.vgap / 2 + o.tgap + (item.tgap || 0) + (item.vgap || 0)) / BI.pixRatio + BI.pixUnit
            });
        }
        if (o.hgap + o.lgap + (item.lgap || 0) + (item.hgap || 0) !== 0) {
            w.element.css({
                "margin-left": (o.hgap / 2 + o.lgap + (item.lgap || 0) + (item.hgap || 0)) / BI.pixRatio + BI.pixUnit
            });
        }
        if (o.hgap + o.rgap + (item.rgap || 0) + (item.hgap || 0) !== 0) {
            w.element.css({
                "margin-right": (o.hgap / 2 + o.rgap + (item.rgap || 0) + (item.hgap || 0)) / BI.pixRatio + BI.pixUnit
            });
        }
        if (o.vgap + o.bgap + (item.bgap || 0) + (item.vgap || 0) !== 0) {
            w.element.css({
                "margin-bottom": (o.vgap / 2 + o.bgap + (item.bgap || 0) + (item.vgap || 0)) / BI.pixRatio + BI.pixUnit
            });
        }
        return w;
    },

    populate: function (items) {
        BI.FloatRightLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.right", BI.FloatRightLayout);
