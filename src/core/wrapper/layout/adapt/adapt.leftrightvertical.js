/**
 * 左右分离，垂直方向居中容器
 *          items:{
                left: [{el:{type:"bi.button"}}],
                right:[{el:{type:"bi.button"}}]
            }
 * @class BI.LeftRightVerticalAdaptLayout
 * @extends BI.Layout
 */
BI.LeftRightVerticalAdaptLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.LeftRightVerticalAdaptLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-lr-v-a",
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
        BI.LeftRightVerticalAdaptLayout.superclass.render.apply(this, arguments);
        var leftRight = this._getLeftRight(o.items);
        var layoutArray = [];
        if (leftRight.left || "left" in o.items) {
            layoutArray.push({
                type: "bi.left",
                lgap: o.innerHgap,
                vgap: o.innerVgap,
                items: [{
                    el: {
                        type: "bi.vertical_adapt",
                        ref: function (_ref) {
                            self.left = _ref;
                        },
                        height: "100%",
                        items: leftRight.left || o.items.left,
                        hgap: o.lhgap,
                        lgap: o.llgap,
                        rgap: o.lrgap,
                        tgap: o.ltgap,
                        bgap: o.lbgap,
                        vgap: o.lvgap
                    }
                }]
            });
        }
        if (leftRight.right || "right" in o.items) {
            layoutArray.push({
                type: "bi.right",
                rgap: o.innerHgap,
                vgap: o.innerVgap,
                items: [{
                    el: {
                        type: "bi.vertical_adapt",
                        ref: function (_ref) {
                            self.right = _ref;
                        },
                        height: "100%",
                        items: leftRight.right || o.items.right,
                        hgap: o.rhgap,
                        lgap: o.rlgap,
                        rgap: o.rrgap,
                        tgap: o.rtgap,
                        bgap: o.rbgap,
                        vgap: o.rvgap
                    }
                }]
            });
        }
        return layoutArray;
    },

    _getLeftRight: function (items) {
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
        return {
            left: left,
            right: right
        };
    },

    resize: function () {
        var leftRight = this._getLeftRight(this.options.items);
        this.left.stroke(leftRight.left || this.options.items.left);
        this.right.stroke(leftRight.right || this.options.items.right);
    },

    addItem: function () {
        // do nothing
        throw new Error("不能添加子组件");
    },

    populate: function (items) {
        var leftRight = this._getLeftRight(items);
        this.left.populate(leftRight.left || items.left);
        this.right.populate(leftRight.right || items.right);
    }
});
BI.shortcut("bi.left_right_vertical_adapt", BI.LeftRightVerticalAdaptLayout);


BI.LeftVerticalAdaptLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.LeftRightVerticalAdaptLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-l-v-a",
            items: [],
            columnSize: [],
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
        BI.LeftVerticalAdaptLayout.superclass.render.apply(this, arguments);
        return {
            type: "bi.vertical_adapt",
            ref: function (_ref) {
                self.layout = _ref;
            },
            items: o.items,
            columnSize: o.columnSize,
            hgap: o.hgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            vgap: o.vgap,
            innerHgap: o.innerHgap,
            innerVgap: o.innerVgap,
            scrollx: o.scrollx,
            scrolly: o.scrolly,
            scrollable: o.scrollable
        };
    },

    resize: function () {
        this.layout.resize();
    },

    addItem: function () {
        // do nothing
        throw new Error("不能添加子组件");
    },

    populate: function (items) {
        this.layout.populate.apply(this, arguments);
    }
});
BI.shortcut("bi.left_vertical_adapt", BI.LeftVerticalAdaptLayout);

BI.RightVerticalAdaptLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.RightVerticalAdaptLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-r-v-a",
            items: [],
            columnSize: [],
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
        BI.RightVerticalAdaptLayout.superclass.render.apply(this, arguments);
        return {
            type: "bi.vertical_adapt",
            ref: function (_ref) {
                self.layout = _ref;
            },
            horizontalAlign: BI.HorizontalAlign.Right,
            items: o.items,
            columnSize: o.columnSize,
            hgap: o.hgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            vgap: o.vgap,
            innerHgap: o.innerHgap,
            innerVgap: o.innerVgap,
            scrollx: o.scrollx,
            scrolly: o.scrolly,
            scrollable: o.scrollable
        };
    },

    resize: function () {
        this.layout.resize();
    },

    addItem: function () {
        // do nothing
        throw new Error("不能添加子组件");
    },

    populate: function (items) {
        this.layout.populate(items);
    }
});
BI.shortcut("bi.right_vertical_adapt", BI.RightVerticalAdaptLayout);
