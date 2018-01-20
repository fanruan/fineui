/**
 * 垂直方向都居中容器, 非自适应，用于高度不固定的面板
 * @class BI.VerticalCenterLayout
 * @extends BI.Layout
 */
BI.VerticalCenterLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.VerticalCenterLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-vertical-center-layout",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    render: function () {
        BI.VerticalCenterLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    resize: function () {
        // console.log("vertical_center布局不需要resize");
    },

    addItem: function (item) {
        // do nothing
        throw new Error("cannot be added");
    },

    stroke: function (items) {
        var self = this, o = this.options;
        var list = [];
        BI.each(items, function (i) {
            list.push({
                column: 0,
                row: i,
                el: BI.createWidget({
                    type: "bi.default",
                    cls: "center-element " + (i === 0 ? "first-element " : "") + (i === items.length - 1 ? "last-element" : "")
                }, this)
            });
        });
        BI.each(items, function (i, item) {
            if (item) {
                var w = BI.createWidget(item, this);
                w.element.css({
                    position: "absolute",
                    left: o.hgap + o.lgap,
                    right: o.hgap + o.rgap,
                    top: o.vgap + o.tgap,
                    bottom: o.vgap + o.bgap,
                    height: "auto"
                });
                list[i].el.addItem(w);
            }
        });
        BI.createWidget({
            type: "bi.grid",
            element: this,
            columns: 1,
            rows: list.length,
            items: list
        });
    },

    populate: function (items) {
        BI.VerticalCenterLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.vertical_center", BI.VerticalCenterLayout);