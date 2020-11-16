/**
 * 水平和垂直方向都居中容器, 非自适应，用于宽度高度固定的面板
 * @class BI.HorizontalCenterLayout
 * @extends BI.Layout
 */
BI.HorizontalCenterLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.HorizontalCenterLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-horizontal-center-layout",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    render: function () {
        BI.HorizontalCenterLayout.superclass.render.apply(this, arguments);
        var self = this, o = this.options, items = o.items;
        var list = [];
        BI.each(items, function (i) {
            list.push({
                column: i,
                row: 0,
                el: BI._lazyCreateWidget({
                    type: "bi.default",
                    cls: "center-element " + (i === 0 ? "first-element " : "") + (i === items.length - 1 ? "last-element" : "")
                })
            });
        });
        BI.each(items, function (i, item) {
            if (item) {
                var w = BI._lazyCreateWidget(item);
                w.element.css({
                    position: "absolute",
                    left: o.hgap + o.lgap,
                    right: o.hgap + o.rgap,
                    top: o.vgap + o.tgap,
                    bottom: o.vgap + o.bgap,
                    width: "auto"
                });
                list[i].el.addItem(w);
            }
        });
        return {
            type: "bi.grid",
            ref: function (_ref) {
                self.wrapper = _ref;
            },
            columns: list.length,
            rows: 1,
            items: list
        };
    },

    resize: function () {
        // console.log("horizontal_center布局不需要resize");
    },

    addItem: function (item) {
        // do nothing
        throw new Error("cannot be added");
    },

    update: function (opt) {
        return this.wrapper.update(opt);
    },

    populate: function (items) {
        this.wrapper.populate.apply(this.wrapper, arguments);
    }
});
BI.shortcut("bi.horizontal_center", BI.HorizontalCenterLayout);
