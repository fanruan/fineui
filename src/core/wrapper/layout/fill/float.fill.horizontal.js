BI.FloatHorizontalFillLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FloatHorizontalFillLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-h-float-fill",
            horizontalAlign: BI.HorizontalAlign.Stretch,
            verticalAlign: BI.VerticalAlign.Stretch,
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            columnSize: [],
            items: []
        });
    },
    render: function () {
        BI.FloatHorizontalFillLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    addItem: function (item) {
        // do nothing
        throw new Error("不能添加子组件");
    },

    stroke: function (items) {
        var self = this, o = this.options;
        items = BI.compact(items);
        var rank = 0;

        function createWidget (i, item, desc) {
            if (o.verticalAlign !== BI.VerticalAlign.Stretch) {
                var w = BI._lazyCreateWidget({
                    type: "bi.vertical_adapt",
                    horizontalAlign: BI.HorizontalAlign.Stretch,
                    verticalAlign: o.verticalAlign,
                    columnSize: ["fill"],
                    items: [item]
                });
            } else {
                var w = BI._lazyCreateWidget(item);
            }
            if (o.vgap + o.tgap + (item.tgap || 0) + (item.vgap || 0) !== 0) {
                w.element.css({
                    "margin-top": (o.vgap + o.tgap + (item.tgap || 0) + (item.vgap || 0)) / BI.pixRatio + BI.pixUnit
                });
            }
            if (desc) {
                if (o.hgap + o.rgap + (item.rgap || 0) + (item.hgap || 0) !== 0) {
                    w.element.css({
                        "margin-right": ((i === o.items.length - 1 ? o.hgap : 0) + o.rgap + (item.rgap || 0) + (item.hgap || 0)) / BI.pixRatio + BI.pixUnit
                    });
                }
                if (o.hgap + o.lgap + (item.lgap || 0) + (item.hgap || 0) !== 0) {
                    w.element.css({
                        "margin-left": (o.hgap + o.lgap + (item.lgap || 0) + (item.hgap || 0)) / BI.pixRatio + BI.pixUnit
                    });
                }
            } else {
                if (o.hgap + o.lgap + (item.lgap || 0) + (item.hgap || 0) !== 0) {
                    w.element.css({
                        "margin-left": ((i === 0 ? o.hgap : 0) + o.lgap + (item.lgap || 0) + (item.hgap || 0)) / BI.pixRatio + BI.pixUnit
                    });
                }
                if (o.hgap + o.rgap + (item.rgap || 0) + (item.hgap || 0) !== 0) {
                    w.element.css({
                        "margin-right": (o.hgap + o.rgap + (item.rgap || 0) + (item.hgap || 0)) / BI.pixRatio + BI.pixUnit
                    });
                }
            }
            if (o.vgap + o.bgap + (item.bgap || 0) + (item.vgap || 0) !== 0) {
                w.element.css({
                    "margin-bottom": (o.vgap + o.bgap + (item.bgap || 0) + (item.vgap || 0)) / BI.pixRatio + BI.pixUnit
                });
            }
            var top = o.vgap + o.tgap + (item.tgap || 0) + (item.vgap || 0),
                bottom = o.vgap + o.bgap + (item.bgap || 0) + (item.vgap || 0);
            if (o.verticalAlign === BI.VerticalAlign.Stretch && BI.isNull(item.height)) {
                w.element.css({
                    height: "calc(100% - " + ((top + bottom) / BI.pixRatio + BI.pixUnit) + ")"
                });
            }
            w.element.css({
                position: "relative"
            });
            return w;
        }

        BI.any(items, function (i, item) {
            if (BI.isEmptyObject(item)) {
                return true;
            }
            var columnSize = o.columnSize.length > 0 ? o.columnSize[i] : item.width;
            if (columnSize === "fill") {
                return true;
            }
            var w = createWidget(i, item);
            self.addWidget(self._getChildName(rank++), w);
            w.element.css({
                float: "left"
            });
        });
        BI.backAny(items, function (i, item) {
            if (BI.isEmptyObject(item)) {
                return true;
            }
            var columnSize = o.columnSize.length > 0 ? o.columnSize[i] : item.width;
            if (columnSize === "fill") {
                return true;
            }
            var w = createWidget(i, item, true);
            self.addWidget(self._getChildName(rank++), w);
            w.element.css({
                float: "right"
            });
        });
        BI.each(items, function (i, item) {
            var columnSize = o.columnSize.length > 0 ? o.columnSize[i] : item.width;
            if (columnSize === "fill") {
                var w = createWidget(i, item);
                self.addWidget(self._getChildName(rank++), w);
            }
        });
    },

    resize: function () {
        // console.log("填充布局不需要resize");
    },

    update: function (opt) {
        return this.forceUpdate(opt);
    },

    populate: function (items) {
        BI.FloatHorizontalFillLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.horizontal_float_fill", BI.FloatHorizontalFillLayout);
