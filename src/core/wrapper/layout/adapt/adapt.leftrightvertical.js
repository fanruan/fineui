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
            rlgap: 0,
            rrgap: 0,
            rhgap: 0
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
                        height: "100%",
                        items: o.items.left,
                        hgap: o.lhgap,
                        lgap: o.llgap,
                        rgap: o.lrgap
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
                        height: "100%",
                        items: o.items.right,
                        textAlign: "right",
                        hgap: o.rhgap,
                        lgap: o.rlgap,
                        rgap: o.rrgap
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
        BI.LeftRightVerticalAdaptLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.left_right_vertical_adapt", BI.LeftRightVerticalAdaptLayout);


BI.LeftVerticalAdaptLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.LeftRightVerticalAdaptLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-l-v-a",
            items: [],
            lgap: 0,
            rgap: 0,
            hgap: 0
        });
    },
    render: function () {
        var o = this.options, self = this;
        BI.LeftVerticalAdaptLayout.superclass.render.apply(this, arguments);
        return {
            type: "bi.left",
            ref: function (_ref) {
                self.layout = _ref;
            },
            items: [{
                el: {
                    type: "bi.vertical_adapt",
                    height: "100%",
                    items: o.items,
                    lgap: o.lgap,
                    hgap: o.hgap,
                    rgap: o.rgap
                }
            }]
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
            lgap: 0,
            rgap: 0,
            hgap: 0
        });
    },
    render: function () {
        var o = this.options, self = this;
        BI.RightVerticalAdaptLayout.superclass.render.apply(this, arguments);
        return {
            type: "bi.right",
            ref: function (_ref) {
                self.layout = _ref;
            },
            items: [{
                el: {
                    type: "bi.vertical_adapt",
                    height: "100%",
                    textAlign: "right",
                    items: o.items,
                    lgap: o.lgap,
                    hgap: o.hgap,
                    rgap: o.rgap
                }
            }]
        };
    },

    resize: function () {

    },

    addItem: function () {
        // do nothing
        throw new Error("cannot be added");
    },

    populate: function (items) {
        this.layout.populate.apply(this, arguments);
    }
});
BI.shortcut("bi.right_vertical_adapt", BI.RightVerticalAdaptLayout);
