BI.AbsoluteLeftRightVerticalAdaptLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.AbsoluteLeftRightVerticalAdaptLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-abs-lr-v-a",
            verticalAlign: BI.VerticalAlign.Middle,
            items: {},
            llgap: 0,
            lrgap: 0,
            lhgap: 0,
            ltgap: 0,
            lbgap: 0,
            lvgap: 0,
            rlgap: 0,
            rrgap: 0,
            rhgap: 0,
            rtgap: 0,
            rbgap: 0,
            rvgap: 0
        });
    },
    render: function () {
        var o = this.options, self = this;
        BI.AbsoluteLeftRightVerticalAdaptLayout.superclass.render.apply(this, arguments);
        return {
            type: "bi.htape",
            innerHgap: o.innerHgap,
            innerVgap: o.innerVgap,
            ref: function (_ref) {
                self.layout = _ref;
            },
            verticalAlign: o.verticalAlign,
            items: this._formatItems(o.items),
            scrollx: o.scrollx,
            scrolly: o.scrolly,
            scrollable: o.scrollable
        };
    },

    _formatItems: function (items) {
        var o = this.options;
        var left, right;
        if (BI.isArray(items)) {
            BI.each(items, function (i, item) {
                if (item.left) {
                    left = item.left;
                }
                if (item.right) {
                    right = item.right;
                }
            });
        }
        var leftItems = left || items.left || [];
        var rightItems = right || items.right || [];
        leftItems = BI.map(leftItems, function (i, item) {
            var json = {
                el: BI.stripEL(item),
                width: item.width
            };
            if (o.lvgap + o.ltgap + (item.tgap || 0) + (item.vgap || 0) !== 0) {
                json.tgap = o.lvgap + o.ltgap + (item.tgap || 0) + (item.vgap || 0);
            }
            if (o.lhgap + o.llgap + (item.lgap || 0) + (item.hgap || 0) !== 0) {
                json.lgap = (i === 0 ? o.lhgap : 0) + o.llgap + (item.lgap || 0) + (item.hgap || 0);
            }
            if (o.lhgap + o.lrgap + (item.rgap || 0) + (item.hgap || 0) !== 0) {
                json.rgap = o.lhgap + o.lrgap + (item.rgap || 0) + (item.hgap || 0);
            }
            if (o.lvgap + o.lbgap + (item.bgap || 0) + (item.vgap || 0) !== 0) {
                json.bgap = o.lvgap + o.lbgap + (item.bgap || 0) + (item.vgap || 0);
            }
            return json;
        });
        rightItems = BI.map(rightItems, function (i, item) {
            var json = {
                el: BI.stripEL(item),
                width: item.width
            };
            if (o.rvgap + o.rtgap + (item.tgap || 0) + (item.vgap || 0) !== 0) {
                json.tgap = o.rvgap + o.rtgap + (item.tgap || 0) + (item.vgap || 0);
            }
            if (o.rhgap + o.rlgap + (item.lgap || 0) + (item.hgap || 0) !== 0) {
                json.lgap = (i === 0 ? o.rhgap : 0) + o.rlgap + (item.lgap || 0) + (item.hgap || 0);
            }
            if (o.rhgap + o.rrgap + (item.rgap || 0) + (item.hgap || 0) !== 0) {
                json.rgap = o.rhgap + o.rrgap + (item.rgap || 0) + (item.hgap || 0);
            }
            if (o.rvgap + o.rbgap + (item.bgap || 0) + (item.vgap || 0) !== 0) {
                json.bgap = o.rvgap + o.rbgap + (item.bgap || 0) + (item.vgap || 0);
            }
            return json;
        });
        return leftItems.concat({}, rightItems);
    },

    resize: function () {
        this.layout.stroke(this._formatItems(this.options.items));
    },

    addItem: function () {
        // do nothing
        throw new Error("不能添加子组件");
    },

    populate: function (items) {
        this.layout.populate(this._formatItems(items));
    }
});
BI.shortcut("bi.absolute_left_right_vertical_adapt", BI.AbsoluteLeftRightVerticalAdaptLayout);

BI.AbsoluteRightVerticalAdaptLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.AbsoluteRightVerticalAdaptLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-abs-r-v-a",
            verticalAlign: BI.VerticalAlign.Middle,
            items: [],
            lgap: 0,
            rgap: 0,
            hgap: 0,
            tgap: 0,
            bgap: 0,
            vgap: 0
        });
    },
    render: function () {
        var o = this.options, self = this;
        BI.AbsoluteRightVerticalAdaptLayout.superclass.render.apply(this, arguments);
        return {
            type: "bi.htape",
            ref: function (_ref) {
                self.layout = _ref;
            },
            verticalAlign: o.verticalAlign,
            items: [{}].concat(o.items),
            hgap: o.hgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            vgap: o.vgap,
            scrollx: o.scrollx,
            scrolly: o.scrolly,
            scrollable: o.scrollable
        };
    },

    resize: function () {
        this.layout.stroke([{}].concat(this.options.items));
    },

    addItem: function () {
        // do nothing
        throw new Error("不能添加子组件");
    },

    populate: function (items) {
        this.layout.populate([{}].concat(items));
    }
});
BI.shortcut("bi.absolute_right_vertical_adapt", BI.AbsoluteRightVerticalAdaptLayout);
