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
        var layoutArray = [];
        if ("left" in o.items) {
            layoutArray.push({
                type: "bi.left",
                items: [{
                    el: {
                        type: "bi.vertical_adapt",
                        ref: function (_ref) {
                            self.left = _ref;
                        },
                        height: "100%",
                        items: o.items.left,
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
        if ("right" in o.items) {
            layoutArray.push({
                type: "bi.right",
                items: [{
                    el: {
                        type: "bi.vertical_adapt",
                        ref: function (_ref) {
                            self.right = _ref;
                        },
                        height: "100%",
                        items: o.items.right,
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

    resize: function () {
        // console.log("left_right_vertical_adapt布局不需要resize");
    },

    addItem: function () {
        // do nothing
        throw new Error("cannot be added");
    },

    populate: function (items) {
        this.left.populate(items.left);
        this.right.populate(items.right);
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
            scrollx: o.scrollx,
            scrolly: o.scrolly,
            scrollable: o.scrollable
        };
    },

    resize: function () {
        // console.log("left_vertical_adapt布局不需要resize");
    },

    addItem: function () {
        // do nothing
        throw new Error("cannot be added");
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
            scrollx: o.scrollx,
            scrolly: o.scrolly,
            scrollable: o.scrollable
        };
    },

    resize: function () {

    },

    addItem: function () {
        // do nothing
        throw new Error("cannot be added");
    },

    populate: function (items) {
        this.layout.populate(items);
    }
});
BI.shortcut("bi.right_vertical_adapt", BI.RightVerticalAdaptLayout);
