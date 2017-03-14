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
    _defaultConfig: function () {
        return BI.extend(BI.LeftRightVerticalAdaptLayout.superclass._defaultConfig.apply(this, arguments), {
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
    _init: function () {
        BI.LeftRightVerticalAdaptLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        // console.log("left_right_vertical_adapt布局不需要resize");
    },

    addItem: function () {
        //do nothing
        throw new Error("不能添加元素")
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
                element: this.element,
                items: [left]
            });
            this.addWidget(left);
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
                element: this.element,
                items: [right]
            });
            this.addWidget(right);
        }
    },

    populate: function (items) {
        BI.LeftRightVerticalAdaptLayout.superclass.populate.apply(this, arguments);
    }
});
$.shortcut('bi.left_right_vertical_adapt', BI.LeftRightVerticalAdaptLayout);


BI.LeftVerticalAdaptLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.LeftRightVerticalAdaptLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-left-vertical-adapt-layout",
            items: [],
            lgap: 0,
            rgap: 0,
            hgap: 0
        });
    },
    _init: function () {
        BI.LeftVerticalAdaptLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        console.log("left_vertical_adapt布局不需要resize");
    },

    addItem: function () {
        //do nothing
        throw new Error("不能添加元素")
    },

    populate: function (items) {
        BI.LeftVerticalAdaptLayout.superclass.populate.apply(this, arguments);
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
            element: this.element,
            items: [left]
        });
        this.addWidget(left);
    }
});
$.shortcut('bi.left_vertical_adapt', BI.LeftVerticalAdaptLayout);

BI.RightVerticalAdaptLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.RightVerticalAdaptLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-right-vertical-adapt-layout",
            items: [],
            lgap: 0,
            rgap: 0,
            hgap: 0
        });
    },
    _init: function () {
        BI.RightVerticalAdaptLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        console.log("right_vertical_adapt布局不需要resize");
    },

    addItem: function () {
        //do nothing
        throw new Error("不能添加元素")
    },

    populate: function (items) {
        BI.RightVerticalAdaptLayout.superclass.populate.apply(this, arguments);
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
            element: this.element,
            items: [right]
        });
        this.addWidget(right);
    }
});
$.shortcut('bi.right_vertical_adapt', BI.RightVerticalAdaptLayout);