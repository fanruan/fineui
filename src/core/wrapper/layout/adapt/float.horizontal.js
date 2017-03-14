/**
 * 浮动的水平居中布局
 */
BI.FloatHorizontalLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.FloatHorizontalLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-float-horizontal-adapt-layout",
            items: [],
            hgap: 0,
            vgap: 0,
            tgap: 0,
            bgap: 0,
            lgap: 0,
            rgap: 0
        });
    },
    _init: function () {
        BI.FloatHorizontalLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        // console.log("float_horizontal_adapt布局不需要resize");
    },

    _addElement: function (i, item) {
        var self = this, o = this.options;
        var left = BI.createWidget({
            type: "bi.vertical",
            items: [item],
            hgap: o.hgap,
            vgap: o.vgap,
            tgap: o.tgap,
            bgap: o.bgap,
            lgap: o.lgap,
            rgap: o.rgap
        });

        BI.createWidget({
            type: "bi.left",
            element: this.element,
            items: [left]
        });

        BI.nextTick(function () {
            var width = left.element.width(),
                height = left.element.height();
            BI.DOM.hang([left]);
            left.element.width(width).height(height).css("float", "none");
            BI.createWidget({
                type: "bi.horizontal_auto",
                element: self.element,
                items: [left]
            })
        });
        this.addWidget(left);
        return left;
    },

    populate: function (items) {
        BI.HorizontalAutoLayout.superclass.populate.apply(this, arguments);
    }
});
$.shortcut('bi.horizontal_float', BI.FloatHorizontalLayout);