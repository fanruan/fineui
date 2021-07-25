BI.FloatAbsoluteLeftRightVerticalAdaptLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FloatAbsoluteLeftRightVerticalAdaptLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-abs-lr-v-fl",
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
        BI.FloatAbsoluteLeftRightVerticalAdaptLayout.superclass.render.apply(this, arguments);
        return {
            type: "bi.htape",
            ref: function (_ref) {
                self.layout = _ref;
            },
            verticalAlign: o.verticalAlign,
            items: this._formatItems(),
            vgap: "50%",
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
            var el = BI.stripEL(item);
            if(BI.isWidget(el)){
                el.element.addClass("bi-abs-c-y-item");
            } else {
                el.cls = (el.cls || "") + "bi-abs-c-y-item";
            }
            var json = {
                el: el,
                width: item.width
            };
            // if (o.lvgap + o.ltgap + (item.tgap || 0) + (item.vgap || 0) !== 0) {
            //     json.tgap = o.lvgap + o.ltgap + (item.tgap || 0) + (item.vgap || 0);
            // }
            if (o.lhgap + o.llgap + (item.lgap || 0) + (item.hgap || 0) !== 0) {
                json.lgap = (i === 0 ? o.lhgap : 0) + o.llgap + (item.lgap || 0) + (item.hgap || 0);
            }
            if (o.lhgap + o.lrgap + (item.rgap || 0) + (item.hgap || 0) !== 0) {
                json.rgap = o.lhgap + o.lrgap + (item.rgap || 0) + (item.hgap || 0);
            }
            // if (o.lvgap + o.lbgap + (item.bgap || 0) + (item.vgap || 0) !== 0) {
            //     json.bgap = o.lvgap + o.lbgap + (item.bgap || 0) + (item.vgap || 0);
            // }
            return json;
        });
        rightItems = BI.map(rightItems, function (i, item) {
            var el = BI.stripEL(item);
            if(BI.isWidget(el)){
                el.element.addClass("bi-abs-c-y-item");
            } else {
                el.cls = (el.cls || "") + "bi-abs-c-y-item";
            }
            var json = {
                el: el,
                width: item.width
            };
            // if (o.rvgap + o.rtgap + (item.tgap || 0) + (item.vgap || 0) !== 0) {
            //     json.tgap = o.rvgap + o.rtgap + (item.tgap || 0) + (item.vgap || 0);
            // }
            if (o.rhgap + o.rlgap + (item.lgap || 0) + (item.hgap || 0) !== 0) {
                json.lgap = (i === 0 ? o.rhgap : 0) + o.rlgap + (item.lgap || 0) + (item.hgap || 0);
            }
            if (o.rhgap + o.rrgap + (item.rgap || 0) + (item.hgap || 0) !== 0) {
                json.rgap = o.rhgap + o.rrgap + (item.rgap || 0) + (item.hgap || 0);
            }
            // if (o.rvgap + o.rbgap + (item.bgap || 0) + (item.vgap || 0) !== 0) {
            //     json.bgap = o.rvgap + o.rbgap + (item.bgap || 0) + (item.vgap || 0);
            // }
            return json;
        });
        return leftItems.concat({}, rightItems);
    },

    resize: function () {
        // console.log("absolute_left_right_vertical_adapt布局不需要resize");
    },

    addItem: function () {
        // do nothing
        throw new Error("不能添加子组件");
    },

    populate: function (items) {
        this.options.items = items;
        this.layout.populate(this._formatItems());
    }
});
BI.shortcut("bi.absolute_left_right_vertical_float", BI.FloatAbsoluteLeftRightVerticalAdaptLayout);

BI.FloatAbsoluteRightVerticalAdaptLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FloatAbsoluteRightVerticalAdaptLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-abs-r-v-fl",
            verticalAlign: BI.VerticalAlign.Middle,
            items: [],
            lgap: 0,
            rgap: 0,
            hgap: 0,
        });
    },
    render: function () {
        var o = this.options, self = this;
        BI.FloatAbsoluteRightVerticalAdaptLayout.superclass.render.apply(this, arguments);
        return {
            type: "bi.htape",
            ref: function (_ref) {
                self.layout = _ref;
            },
            verticalAlign: o.verticalAlign,
            items: [{}].concat(this._formatItems(o.items)),
            hgap: o.hgap,
            lgap: o.lgap,
            rgap: o.rgap,
            vgap: "50%",
            scrollx: o.scrollx,
            scrolly: o.scrolly,
            scrollable: o.scrollable
        };
    },

    _formatItems: function (items) {
        return BI.map(items, function (i, item) {
            if(!item || BI.isEmptyObject(item)){
                return item;
            }
            var el = BI.stripEL(item);
            if(BI.isWidget(el)){
                el.element.addClass("bi-abs-c-y-item");
            } else {
                el.cls = (el.cls || "") + "bi-abs-c-y-item";
            }
            return item;
        });
    },

    resize: function () {

    },

    addItem: function () {
        // do nothing
        throw new Error("不能添加子组件");
    },

    populate: function (items) {
        this.layout.populate(items);
    }
});
BI.shortcut("bi.absolute_right_vertical_float", BI.FloatAbsoluteRightVerticalAdaptLayout);
