/**
 * 浮动布局实现的居中容器
 * @class BI.FloatCenterLayout
 * @extends BI.Layout
 */
BI.FloatCenterLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FloatCenterLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-float-center",
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0
        });
    },
    render: function () {
        BI.FloatCenterLayout.superclass.render.apply(this, arguments);
        var self = this, o = this.options, items = o.items;
        var list = [], width = 100 / items.length;
        BI.each(items, function (i) {
            var widget = BI._lazyCreateWidget({
                type: "bi.default"
            });
            widget.element.addClass("center-element " + (i === 0 ? "first-element " : "") + (i === items.length - 1 ? "last-element" : "")).css({
                width: width + "%",
                height: "100%"
            });
            list.push({
                el: widget
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
                    width: "auto",
                    height: "auto"
                });
                list[i].el.addItem(w);
            }
        });
        return {
            type: "bi.left",
            ref: function (_ref) {
                self.layout = _ref;
            },
            items: list
        };
    },

    resize: function () {
        // console.log("floatcenter布局不需要resize");
    },

    addItem: function (item) {
        // do nothing
        throw new Error("不能添加子组件");
    },

    populate: function (items) {
        this.layout.populate.apply(this.layout, arguments);
    }
});
BI.shortcut("bi.float_center", BI.FloatCenterLayout);
