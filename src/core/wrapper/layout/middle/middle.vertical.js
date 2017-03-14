/**
 * 垂直方向都居中容器, 非自适应，用于高度不固定的面板
 * @class BI.VerticalCenterLayout
 * @extends BI.Layout
 */
BI.VerticalCenterLayout = BI.inherit(BI.Layout, {
    _defaultConfig: function () {
        return BI.extend(BI.VerticalCenterLayout.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-vertical-center-layout",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    _init: function () {
        BI.VerticalCenterLayout.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        // console.log("vertical_center布局不需要resize");
    },

    addItem: function (item) {
        //do nothing
        throw new Error("不能添加元素")
    },

    stroke: function (items) {
        var self = this, o = this.options;
        this.clear();
        var list = [];
        BI.each(items, function (i) {
            list.push({
                column: 0,
                row: i,
                el: BI.createWidget({
                    type: "bi.layout",
                    cls: "center-element " + (i === 0 ? "first-element " : "") + (i === items.length - 1 ? "last-element" : "")
                })
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
                    height: "auto"
                }).appendTo(list[i].el.element);
                self.addWidget(w);
            }
        });
        BI.createWidget({
            type: "bi.grid",
            element: this.element,
            columns: 1,
            rows: list.length,
            items: list
        });
    },

    populate: function (items) {
        BI.VerticalCenterLayout.superclass.populate.apply(this, arguments);
    }
});
$.shortcut('bi.vertical_center', BI.VerticalCenterLayout);