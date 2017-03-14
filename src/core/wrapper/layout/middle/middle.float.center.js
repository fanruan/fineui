/**
 * 浮动布局实现的居中容器
 * @class BI.FloatCenterLayout
 * @extends BI.Layout
 */
BI.FloatCenterLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.FloatCenterLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-float-center-layout",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    _init: function () {
        BI.FloatCenterLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        // console.log("floatcenter布局不需要resize");
    },

    addItem: function (item) {
        //do nothing
        throw new Error("不能添加元素")
    },

    stroke: function (items) {
        var self = this, o = this.options;
        this.clear();
        var list = [], width = 100 / items.length;
        BI.each(items, function (i) {
            var widget = BI.createWidget();
            widget.element.addClass("center-element " + (i === 0 ? "first-element " : "") + (i === items.length - 1 ? "last-element" : "")).css({
                width: width + "%",
                height: "100%"
            });
            list.push({
                el: widget
            });
        });
        BI.each(items, function (i, item) {
            if (!!item) {
                var w = BI.createWidget(item);
                w.element.css({
                    position: "absolute",
                    left: o.hgap + o.lgap,
                    right: o.hgap + o.rgap,
                    top: o.vgap + o.tgap,
                    bottom: o.vgap + o.bgap,
                    width: "auto",
                    height: "auto"
                }).appendTo(list[i].el.element);
                self.addWidget(w);
            }
        });
        BI.createWidget({
            type: "bi.left",
            element: this.element,
            items: list
        });
    },

    populate: function (items) {
        BI.FloatCenterLayout.superclass.populate.apply(this, arguments);
    }
});
$.shortcut('bi.float_center', BI.FloatCenterLayout);