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
            baseCls: "bi-left-right-vertical-adapt-layout",
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
        BI.LeftRightVerticalAdaptLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        // console.log("left_right_vertical_adapt布局不需要resize");
    },

    addItem: function () {
        //do nothing
        throw new Error("cannot be added")
    },

    stroke: function (items) {
        var o = this.options;
        if ("left" in items) {
            var left = BI.createWidget({
                type: "bi.vertical_adapt",
                items: items.left,
                hgap: o.lhgap,
                lgap: o.llgap,
                rgap: o.lrgap
            });
            left.element.css("height", "100%");
            BI.createWidget({
                type: "bi.left",
                element: this,
                items: [left]
            });
        }
        if ("right" in items) {
            var right = BI.createWidget({
                type: "bi.vertical_adapt",
                items: items.right,
                hgap: o.rhgap,
                lgap: o.rlgap,
                rgap: o.rrgap
            });
            right.element.css("height", "100%");
            BI.createWidget({
                type: "bi.right",
                element: this,
                items: [right]
            });
        }
    },

    populate: function (items) {
        BI.LeftRightVerticalAdaptLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
$.shortcut('bi.left_right_vertical_adapt', BI.LeftRightVerticalAdaptLayout);


BI.LeftVerticalAdaptLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.LeftRightVerticalAdaptLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-left-vertical-adapt-layout",
            items: [],
            lgap: 0,
            rgap: 0,
            hgap: 0
        });
    },
    render: function () {
        BI.LeftVerticalAdaptLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        // console.log("left_vertical_adapt布局不需要resize");
    },

    addItem: function () {
        //do nothing
        throw new Error("cannot be added")
    },

    stroke: function (items) {
        var o = this.options;
        var left = BI.createWidget({
            type: "bi.vertical_adapt",
            items: items,
            lgap: o.lgap,
            hgap: o.hgap,
            rgap: o.rgap
        });
        left.element.css("height", "100%");
        BI.createWidget({
            type: "bi.left",
            element: this,
            items: [left]
        });
    },

    populate: function (items) {
        BI.LeftVerticalAdaptLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
$.shortcut('bi.left_vertical_adapt', BI.LeftVerticalAdaptLayout);

BI.RightVerticalAdaptLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.RightVerticalAdaptLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-right-vertical-adapt-layout",
            items: [],
            lgap: 0,
            rgap: 0,
            hgap: 0
        });
    },
    render: function () {
        BI.RightVerticalAdaptLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {

    },

    addItem: function () {
        //do nothing
        throw new Error("cannot be added")
    },

    stroke: function (items) {
        var o = this.options;
        var right = BI.createWidget({
            type: "bi.vertical_adapt",
            items: items,
            lgap: o.lgap,
            hgap: o.hgap,
            rgap: o.rgap
        });
        right.element.css("height", "100%");
        BI.createWidget({
            type: "bi.right",
            element: this,
            items: [right]
        });
    },

    populate: function (items) {
        BI.RightVerticalAdaptLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
$.shortcut('bi.right_vertical_adapt', BI.RightVerticalAdaptLayout);