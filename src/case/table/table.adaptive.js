/**
 * 自适应宽度的表格
 *
 * Created by GUY on 2016/2/3.
 * @class BI.AdaptiveTable
 * @extends BI.Widget
 */
BI.AdaptiveTable = BI.inherit(BI.Widget, {

    _const: {
        perColumnSize: 100
    },

    _defaultConfig: function () {
        return BI.extend(BI.AdaptiveTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-adaptive-table",
            el: {
                type: "bi.resizable_table"
            },
            isNeedResize: true,
            isNeedFreeze: false, // 是否需要冻结单元格
            freezeCols: [], // 冻结的列号,从0开始,isNeedFreeze为true时生效

            isNeedMerge: false, // 是否需要合并单元格
            mergeCols: [], // 合并的单元格列号
            mergeRule: BI.emptyFn,

            columnSize: [],
            minColumnSize: [],
            maxColumnSize: [],

            headerRowSize: 25,
            rowSize: 25,

            regionColumnSize: [],

            header: [],
            items: [], // 二维数组

            // 交叉表头
            crossHeader: [],
            crossItems: []
        });
    },

    _init: function () {
        BI.AdaptiveTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        var data = this._digest();
        this.table = BI.createWidget(o.el, {
            type: "bi.resizable_table",
            element: this,
            width: o.width,
            height: o.height,
            isNeedResize: o.isNeedResize,
            isResizeAdapt: false,

            isNeedFreeze: o.isNeedFreeze,
            freezeCols: data.freezeCols,

            isNeedMerge: o.isNeedMerge,
            mergeCols: o.mergeCols,
            mergeRule: o.mergeRule,

            columnSize: data.columnSize,

            headerRowSize: o.headerRowSize,
            rowSize: o.rowSize,

            regionColumnSize: data.regionColumnSize,

            header: o.header,
            items: o.items,
            // 交叉表头
            crossHeader: o.crossHeader,
            crossItems: o.crossItems
        });
        this.table.on(BI.Table.EVENT_TABLE_SCROLL, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, function () {
            o.regionColumnSize = this.getRegionColumnSize();
            self._populate();
            self.table.populate();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, arguments);
        });

        this.table.on(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, function () {
            o.columnSize = this.getColumnSize();
            self._populate();
            self.table.populate();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, arguments);
        });
    },

    _getFreezeColLength: function () {
        var o = this.options;
        return o.isNeedFreeze === true ? BI.clamp(o.freezeCols.length, 0, o.columnSize.length) : 0;
    },

    _digest: function () {
        var o = this.options;
        var columnSize = o.columnSize.slice();
        var regionColumnSize = o.regionColumnSize.slice();
        var freezeCols = o.freezeCols.slice();
        var regionSize = o.regionColumnSize[0];
        var freezeColLength = this._getFreezeColLength();
        if (!regionSize || regionSize > o.width - 10 || regionSize < 10) {
            regionSize = (freezeColLength > o.columnSize.length / 2 ? 2 / 3 : 1 / 3) * o.width;
        }
        if (freezeColLength === 0) {
            regionSize = 0;
        }
        if (freezeCols.length >= columnSize.length) {
            freezeCols = [];
        }
        if (!BI.isNumber(columnSize[0])) {
            columnSize = o.minColumnSize.slice();
        }
        var summaryFreezeColumnSize = 0, summaryColumnSize = 0;
        BI.each(columnSize, function (i, size) {
            if (i < freezeColLength) {
                summaryFreezeColumnSize += size;
            }
            summaryColumnSize += size;
        });
        if (freezeColLength > 0) {
            columnSize[freezeColLength - 1] = BI.clamp(regionSize - (summaryFreezeColumnSize - columnSize[freezeColLength - 1]),
                o.minColumnSize[freezeColLength - 1] || 10, o.maxColumnSize[freezeColLength - 1] || Number.MAX_VALUE);
        }
        if (columnSize.length > 0) {
            columnSize[columnSize.length - 1] = BI.clamp(o.width - BI.GridTableScrollbar.SIZE - regionSize - (summaryColumnSize - summaryFreezeColumnSize - columnSize[columnSize.length - 1]),
                o.minColumnSize[columnSize.length - 1] || 10, o.maxColumnSize[columnSize.length - 1] || Number.MAX_VALUE);
        }
        regionColumnSize[0] = regionSize;

        return {
            freezeCols: freezeCols,
            columnSize: columnSize,
            regionColumnSize: regionColumnSize
        };
    },

    _populate: function () {
        var o = this.options;
        var data = this._digest();
        o.regionColumnSize = data.regionColumnSize;
        o.columnSize = data.columnSize;
        this.table.setColumnSize(data.columnSize);
        this.table.setRegionColumnSize(data.regionColumnSize);
        this.table.attr("freezeCols", data.freezeCols);
    },

    setWidth: function (width) {
        BI.AdaptiveTable.superclass.setWidth.apply(this, arguments);
        this.table.setWidth(width);
    },

    setHeight: function (height) {
        BI.AdaptiveTable.superclass.setHeight.apply(this, arguments);
        this.table.setHeight(height);
    },

    setColumnSize: function (columnSize) {
        this.options.columnSize = columnSize;
    },

    getColumnSize: function () {
        return this.table.getColumnSize();
    },

    setRegionColumnSize: function (regionColumnSize) {
        this.options.regionColumnSize = regionColumnSize;
    },

    getRegionColumnSize: function () {
        return this.table.getRegionColumnSize();
    },

    setVerticalScroll: function (scrollTop) {
        this.table.setVerticalScroll(scrollTop);
    },

    setLeftHorizontalScroll: function (scrollLeft) {
        this.table.setLeftHorizontalScroll(scrollLeft);
    },

    setRightHorizontalScroll: function (scrollLeft) {
        this.table.setRightHorizontalScroll(scrollLeft);
    },

    getVerticalScroll: function () {
        return this.table.getVerticalScroll();
    },

    getLeftHorizontalScroll: function () {
        return this.table.getLeftHorizontalScroll();
    },

    getRightHorizontalScroll: function () {
        return this.table.getRightHorizontalScroll();
    },

    attr: function (key, value) {
        var v = BI.AdaptiveTable.superclass.attr.apply(this, arguments);
        if (key === "freezeCols") {
            return v;
        }
        return this.table.attr.apply(this.table, arguments);
    },

    restore: function () {
        this.table.restore();
    },

    populate: function (items) {
        var self = this, o = this.options;
        this._populate();
        this.table.populate.apply(this.table, arguments);
    },

    destroy: function () {
        this.table.destroy();
        BI.AdaptiveTable.superclass.destroy.apply(this, arguments);
    }
});
BI.shortcut("bi.adaptive_table", BI.AdaptiveTable);