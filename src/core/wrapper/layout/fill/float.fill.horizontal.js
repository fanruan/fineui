BI.FloatHorizontalFillLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.FloatHorizontalFillLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-h-float-fill",
            verticalAlign: BI.VerticalAlign.Top,
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

    resize: function () {
        // console.log("填充布局不需要resize");
    },
    addItem: function (item) {
        // do nothing
        throw new Error("不能添加子组件");
    },

    stroke: function (items) {
        var self = this, o = this.options;
        items = BI.compact(items);
        var rank = 0;
        BI.any(items, function (i, item) {
            if (BI.isEmptyObject(item)) {
                return true;
            }
            var columnSize = o.columnSize.length > 0 ? o.columnSize[i] : item.width;
            if (columnSize === "fill") {
                return true;
            }
            var w = BI._lazyCreateWidget(item);
            self.addWidget(self._getChildName(rank++), w);
            w.element.addClass("h-float-fill-item");
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
            var w = BI._lazyCreateWidget(item);
            self.addWidget(self._getChildName(rank++), w);
            w.element.addClass("h-float-fill-item");
            w.element.css({
                float: "right"
            });
        });
        BI.each(items, function (i, item) {
            var columnSize = o.columnSize.length > 0 ? o.columnSize[i] : item.width;
            if (columnSize === "fill") {
                var w = BI._lazyCreateWidget(item);
                self.addWidget(self._getChildName(rank++), w);
                w.element.addClass("h-float-fill-item");
            }
        });
    },

    populate: function (items) {
        BI.FloatHorizontalFillLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.horizontal_float_fill", BI.FloatHorizontalFillLayout);