BI.FlexLeftRightVerticalAdaptLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FlexLeftRightVerticalAdaptLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-f-lr-v-c",
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
        BI.FlexLeftRightVerticalAdaptLayout.superclass.render.apply(this, arguments);
        return {
            type: "bi.flex_vertical_adapt",
            ref: function (_ref) {
                self.layout = _ref;
            },
            items: this._formatItems(o.items),
            scrollx: o.scrollx,
            scrolly: o.scrolly,
            scrollable: o.scrollable,
            innerHgap: o.innerHgap,
            innerVgap: o.innerVgap,
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
                el: BI.stripEL(item)
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
        return leftItems.concat({
            el: {
                type: "bi.flex_vertical_adapt",
                css: {
                    "margin-left": "auto"
                },
                hgap: o.rhgap,
                vgap: o.rvgap,
                lgap: o.rlgap,
                rgap: o.rrgap,
                tgap: o.rtgap,
                bgap: o.rbgap,
                items: rightItems
            }
        });
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
BI.shortcut("bi.flex_left_right_vertical_adapt", BI.FlexLeftRightVerticalAdaptLayout);
