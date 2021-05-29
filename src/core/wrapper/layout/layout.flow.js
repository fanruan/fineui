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
            baseCls: "bi-left",
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
        var o = this.options;
        this.$innerDiv = BI.Widget._renderEngine.createElement("<div>").addClass("clearfix");
        if (o.hgap > 0) {
            this.$innerDiv.css({
                "padding-left": o.hgap / 2 / BI.pixRatio + BI.pixUnit,
                "padding-right": o.hgap / 2 / BI.pixRatio + BI.pixUnit
            });
        }
        if (o.vgap > 0) {
            this.$innerDiv.css({
                "padding-top": o.vgap / 2 / BI.pixRatio + BI.pixUnit,
                "padding-bottom": o.vgap / 2 / BI.pixRatio + BI.pixUnit
            });
        }
        this.populate(this.options.items);
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w = BI.FloatLeftLayout.superclass._addElement.apply(this, arguments);
        w.element.css({position: "relative", float: "left"});
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

    appendFragment: function (frag) {
        this.$innerDiv.append(frag);
        this.element.append(this.$innerDiv);
    },

    resize: function () {
        this.stroke(this.options.items);
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
            baseCls: "bi-right",
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
        var o = this.options;
        this.$innerDiv = BI.Widget._renderEngine.createElement("<div>").addClass("clearfix");
        if (o.hgap > 0) {
            this.$innerDiv.css({
                "padding-left": o.hgap / 2 / BI.pixRatio + BI.pixUnit,
                "padding-right": o.hgap / 2 / BI.pixRatio + BI.pixUnit
            });
        }
        if (o.vgap > 0) {
            this.$innerDiv.css({
                "padding-top": o.vgap / 2 / BI.pixRatio + BI.pixUnit,
                "padding-bottom": o.vgap / 2 / BI.pixRatio + BI.pixUnit
            });
        }
        this.populate(this.options.items);
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

    appendFragment: function (frag) {
        this.$innerDiv.append(frag);
        this.element.append(this.$innerDiv);
    },

    resize: function () {
        this.stroke(this.options.items);
    },

    populate: function (items) {
        BI.FloatRightLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.right", BI.FloatRightLayout);
