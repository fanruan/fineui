/**
 * 水平tape布局
 * @class BI.HTapeLayout
 * @extends BI.Layout
 */
BI.HTapeLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.HTapeLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-h-tape",
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
        BI.HTapeLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    addItem: function (item) {
        // do nothing
        throw new Error("不能添加子组件");
    },

    stroke: function (items) {
        var self = this, o = this.options;
        items = BI.compact(items);
        BI.each(items, function (i, item) {
            if (BI.isEmptyObject(item)) {
                return;
            }
            if (!self.hasWidget(self._getChildName(i))) {
                var w = BI._lazyCreateWidget(item);
                self.addWidget(self._getChildName(i), w);
            } else {
                w = self.getWidgetByName(self._getChildName(i));
            }
            w.element.css({
                position: "absolute",
                top: ((item.vgap || 0) + (item.tgap || 0) + o.vgap + o.tgap) / BI.pixRatio + BI.pixUnit,
                bottom: ((item.bgap || 0) + (item.vgap || 0) + o.vgap + o.bgap) / BI.pixRatio + BI.pixUnit
            });
            if (o.verticalAlign === BI.VerticalAlign.Middle) {
                w.element.css({
                    marginTop: "auto",
                    marginBottom: "auto"
                });
            } else if (o.verticalAlign === BI.VerticalAlign.Bottom) {
                w.element.css({
                    marginTop: "auto"
                });
            }
        });

        var left = {}, right = {};
        left[0] = 0;
        right[items.length - 1] = 0;

        BI.any(items, function (i, item) {
            if (BI.isEmptyObject(item)) {
                return true;
            }
            var w = self.getWidgetByName(self._getChildName(i));
            var columnSize = o.columnSize.length > 0 ? o.columnSize[i] : item.width;
            if (o.columnSize.length > 0) {
                if (item.width >= 1 && o.columnSize[i] >= 1 && o.columnSize[i] !== item.width) {
                    columnSize = item.width;
                }
            }
            if (BI.isNull(left[i])) {
                var preColumnSize = o.columnSize.length > 0 ? o.columnSize[i - 1] : items[i - 1].width;
                left[i] = left[i - 1] + preColumnSize + (items[i - 1].lgap || 0) + (items[i - 1].rgap || 0) + 2 * (items[i - 1].hgap || 0) + o.hgap + o.lgap + o.rgap;
            }
            if (columnSize < 1 && columnSize > 0) {
                w.element.css({
                    left: (left[i] * 100).toFixed(1) + "%",
                    width: (columnSize * 100).toFixed(1) + "%"
                });
            } else {
                w.element.css({
                    left: (left[i] + (item.lgap || 0) + (item.hgap || 0) + o.hgap + o.lgap) / BI.pixRatio + BI.pixUnit,
                    width: BI.isNumber(columnSize) ? columnSize / BI.pixRatio + BI.pixUnit : ""
                });
            }
            if (columnSize === "" || columnSize === "fill") {
                return true;
            }
        });
        BI.backAny(items, function (i, item) {
            if (BI.isEmptyObject(item)) {
                return true;
            }
            var w = self.getWidgetByName(self._getChildName(i));
            var columnSize = o.columnSize.length > 0 ? o.columnSize[i] : item.width;
            if (BI.isNull(right[i])) {
                var nextColumnSize = o.columnSize.length > 0 ? o.columnSize[i + 1] : items[i + 1].width;
                right[i] = right[i + 1] + nextColumnSize + (items[i + 1].lgap || 0) + (items[i + 1].rgap || 0) + 2 * (items[i + 1].hgap || 0) + o.hgap + o.lgap + o.rgap;
            }
            if (columnSize < 1 && columnSize > 0) {
                w.element.css({
                    right: (right[i] * 100).toFixed(1) + "%",
                    width: (columnSize * 100).toFixed(1) + "%"
                });
            } else {
                w.element.css({
                    right: (right[i] + (item.rgap || 0) + (item.hgap || 0) + o.hgap + o.rgap) / BI.pixRatio + BI.pixUnit,
                    width: BI.isNumber(columnSize) ? columnSize / BI.pixRatio + BI.pixUnit : ""
                });
            }
            if (columnSize === "" || columnSize === "fill") {
                return true;
            }
        });
    },

    shouldUpdate: function () {
        return false;
    },

    populate: function (items) {
        BI.HTapeLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.htape", BI.HTapeLayout);

/**
 * 垂直tape布局
 * @class BI.VTapeLayout
 * @extends BI.Layout
 */
BI.VTapeLayout = BI.inherit(BI.Layout, {
    props: function () {
        return BI.extend(BI.VTapeLayout.superclass.props.apply(this, arguments), {
            baseCls: "bi-v-tape-layout",
            horizontalAlign: BI.HorizontalAlign.Left,
            hgap: 0,
            vgap: 0,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            rowSize: [],
            items: []
        });
    },
    render: function () {
        BI.VTapeLayout.superclass.render.apply(this, arguments);
        this.populate(this.options.items);
    },

    addItem: function (item) {
        // do nothing
        throw new Error("不能添加子组件");
    },

    stroke: function (items) {
        var self = this, o = this.options;
        items = BI.compact(items);
        BI.each(items, function (i, item) {
            if (BI.isEmptyObject(item)) {
                return;
            }
            if (!self.hasWidget(self._getChildName(i))) {
                var w = BI._lazyCreateWidget(item);
                self.addWidget(self._getChildName(i), w);
            } else {
                w = self.getWidgetByName(self._getChildName(i));
            }
            w.element.css({
                position: "absolute",
                left: ((item.lgap || 0) + (item.hgap || 0) + o.hgap + o.lgap) / BI.pixRatio + BI.pixUnit,
                right: ((item.hgap || 0) + (item.rgap || 0) + o.hgap + o.rgap) / BI.pixRatio + BI.pixUnit
            });
            if (o.horizontalAlign === BI.HorizontalAlign.Center) {
                w.element.css({
                    marginLeft: "auto",
                    marginRight: "auto"
                });
            } else if (o.horizontalAlign === BI.HorizontalAlign.Right) {
                w.element.css({
                    marginLeft: "auto"
                });
            }
        });

        var top = {}, bottom = {};
        top[0] = 0;
        bottom[items.length - 1] = 0;

        BI.any(items, function (i, item) {
            if (BI.isEmptyObject(item)) {
                return true;
            }
            var w = self.getWidgetByName(self._getChildName(i));
            var rowSize = o.rowSize.length > 0 ? o.rowSize[i] : item.height;
            if (o.rowSize.length > 0) {
                if (item.height >= 1 && o.rowSize[i] >= 1 && o.rowSize[i] !== item.height) {
                    rowSize = item.height;
                }
            }
            if (BI.isNull(top[i])) {
                var preRowSize = o.rowSize.length > 0 ? o.rowSize[i - 1] : items[i - 1].height;
                top[i] = top[i - 1] + preRowSize + (items[i - 1].tgap || 0) + (items[i - 1].bgap || 0) + 2 * (items[i - 1].vgap || 0) + o.vgap + o.tgap + o.bgap;
            }
            if (rowSize < 1 && rowSize > 0) {
                w.element.css({
                    top: (top[i] * 100).toFixed(1) + "%",
                    height: (rowSize * 100).toFixed(1) + "%"
                });
            } else {
                w.element.css({
                    top: (top[i] + (item.vgap || 0) + (item.tgap || 0) + o.vgap + o.tgap) / BI.pixRatio + BI.pixUnit,
                    height: BI.isNumber(rowSize) ? rowSize / BI.pixRatio + BI.pixUnit : ""
                });
            }
            if (rowSize === "" || rowSize === "fill") {
                return true;
            }
        });
        BI.backAny(items, function (i, item) {
            if (BI.isEmptyObject(item)) {
                return true;
            }
            var w = self.getWidgetByName(self._getChildName(i));
            var rowSize = o.rowSize.length > 0 ? o.rowSize[i] : item.height;
            if (BI.isNull(bottom[i])) {
                var nextRowSize = o.rowSize.length > 0 ? o.rowSize[i + 1] : items[i + 1].height;
                bottom[i] = bottom[i + 1] + nextRowSize + (items[i + 1].tgap || 0) + (items[i + 1].bgap || 0) + 2 * (items[i + 1].vgap || 0) + o.vgap + o.tgap + o.bgap;
            }
            if (rowSize < 1 && rowSize > 0) {
                w.element.css({
                    bottom: (bottom[i] * 100).toFixed(1) + "%",
                    height: (rowSize * 100).toFixed(1) + "%"
                });
            } else {
                w.element.css({
                    bottom: (bottom[i] + (item.vgap || 0) + (item.bgap || 0) + o.vgap + o.bgap) / BI.pixRatio + BI.pixUnit,
                    height: BI.isNumber(rowSize) ? rowSize / BI.pixRatio + BI.pixUnit : ""
                });
            }
            if (rowSize === "" || rowSize === "fill") {
                return true;
            }
        });
    },

    shouldUpdate: function () {
        return false;
    },

    populate: function (items) {
        BI.VTapeLayout.superclass.populate.apply(this, arguments);
        this._mount();
    }
});
BI.shortcut("bi.vtape", BI.VTapeLayout);
