/**
 * 垂直方向都居中容器, 非自适应，用于高度不固定的面板
 * @class BI.VerticalCenterLayout
 * @extends BI.Layout
 */
BI.VerticalCenterLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.VerticalCenterLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-v-center",
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
        var self = this, o = this.options, items = o.items;
        var list = [];
        BI.each(items, function (i) {
            list.push({
                column: 0,
                row: i,
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
                    left: self._optimiseGap(o.hgap + o.lgap),
                    right: self._optimiseGap(o.hgap + o.rgap),
                    top: self._optimiseGap(o.vgap + o.tgap),
                    bottom: self._optimiseGap(o.vgap + o.bgap),
                    height: "auto"
                });
                list[i].el.addItem(w);
            }
        });
        return {
            type: "bi.grid",
            ref: function (_ref) {
                self.layout = _ref;
            },
            columns: 1,
            rows: list.length,
            items: list
        };
    },

    resize: function () {
        // console.log("vertical_center布局不需要resize");
    },

    addItem: function (item) {
        // do nothing
        throw new Error("不能添加子组件");
    },

    populate: function (items) {
        this.layout.populate.apply(this.layout, arguments);
    }
});
BI.shortcut("bi.vertical_center", BI.VerticalCenterLayout);
