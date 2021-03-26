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
            items: this._formatItems(),
            scrollx: o.scrollx,
            scrolly: o.scrolly,
            scrollable: o.scrollable
        };
    },

    _formatItems: function () {
        var o = this.options;
        var leftItems = o.items.left || [];
        var rightItems = o.items.right || [];
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
        rightItems = BI.map(rightItems, function (i, item) {
            if (i === 0) {
                if (BI.isWidget(item)) {
                    item.addClass("flex-left-auto");
                } else {
                    var t = BI.stripEL(item);
                    t.cls = (t.cls || "") + " flex-left-auto";
                }
            }
            var json = {
                el: BI.stripEL(item)
            };
            if (o.rvgap + o.rtgap + (item.tgap || 0) + (item.vgap || 0) !== 0) {
                json.tgap = o.rvgap + o.rtgap + (item.tgap || 0) + (item.vgap || 0);
            }
            if (o.rhgap + o.rlgap + (item.lgap || 0) + (item.hgap || 0) !== 0) {
                if (i > 0) {
                    json.lgap = o.rlgap + (item.lgap || 0) + (item.hgap || 0);
                }
            }
            if (o.rhgap + o.rrgap + (item.rgap || 0) + (item.hgap || 0) !== 0) {
                json.rgap = o.rhgap + o.rrgap + (item.rgap || 0) + (item.hgap || 0);
            }
            if (o.rvgap + o.rbgap + (item.bgap || 0) + (item.vgap || 0) !== 0) {
                json.bgap = o.rvgap + o.rbgap + (item.bgap || 0) + (item.vgap || 0);
            }
            return json;
        });
        return leftItems.concat(rightItems);
    },

    resize: function () {
        // console.log("left_right_vertical_adapt布局不需要resize");
    },

    addItem: function () {
        // do nothing
        throw new Error("cannot be added");
    },

    populate: function (items) {
        this.options.items = items;
        this.layout.populate(this._formatItems());
    }
});
BI.shortcut("bi.flex_left_right_vertical_adapt", BI.FlexLeftRightVerticalAdaptLayout);
