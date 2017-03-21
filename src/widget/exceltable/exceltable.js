/**
 * Excel表格
 *
 * Created by GUY on 2016/3/28.
 * @class BI.ExcelTable
 * @extends BI.Widget
 */
BI.ExcelTable = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.ExcelTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-excel-table",
            el: {
                type: "bi.adaptive_table"
            },

            isNeedResize: false,
            isResizeAdapt: true,

            isNeedMerge: false,//是否需要合并单元格
            mergeCols: [], //合并的单元格列号
            mergeRule: function (row1, row2) { //合并规则, 默认相等时合并
                return BI.isEqual(row1, row2);
            },

            columnSize: [],
            headerRowSize: 37,
            footerRowSize: 37,
            rowSize: 37,

            regionColumnSize: false,

            items: [] //二维数组
        });
    },

    _init: function () {
        BI.ExcelTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        var mergeCols = [];
        BI.each(o.mergeCols, function (i, col) {
            mergeCols.push(col + 1);
        });
        this.table = BI.createWidget(o.el, {
            type: "bi.table_view",
            element: this,
            isNeedResize: o.isNeedResize,
            isResizeAdapt: o.isResizeAdapt,

            isNeedFreeze: false,

            isNeedMerge: o.isNeedMerge,
            mergeCols: mergeCols,
            mergeRule: o.mergeRule,

            columnSize: [""].concat(o.columnSize),
            headerRowSize: 18,
            rowSize: o.rowSize,

            regionColumnSize: o.regionColumnSize || [82, ""]
        });

        if (BI.isNotEmptyArray(o.items)) {
            this.populate(o.items);
        }
        BI.nextTick(function () {
            self.setRegionColumnSize(o.regionColumnSize || [82, ""]);
        });
    },

    resize: function () {
        this.table.resize();
    },

    setColumnSize: function (columnSize) {
        this.table.setColumnSize(columnSize);
    },

    getColumnSize: function () {
        return this.table.getColumnSize();
    },

    getCalculateColumnSize: function () {
        return this.table.getCalculateColumnSize();
    },

    setHeaderColumnSize: function (columnSize) {
        this.table.setHeaderColumnSize(columnSize);
    },

    setRegionColumnSize: function (columnSize) {
        this.table.setRegionColumnSize(columnSize);
    },

    getRegionColumnSize: function () {
        return this.table.getRegionColumnSize();
    },

    getCalculateRegionColumnSize: function () {
        return this.table.getCalculateRegionColumnSize();
    },

    getCalculateRegionRowSize: function () {
        return this.table.getCalculateRegionRowSize();
    },

    getClientRegionColumnSize: function () {
        return this.table.getClientRegionColumnSize();
    },

    getScrollRegionColumnSize: function () {
        return this.table.getScrollRegionColumnSize();
    },

    getScrollRegionRowSize: function () {
        return this.table.getScrollRegionRowSize();
    },

    hasVerticalScroll: function () {
        return this.table.hasVerticalScroll();
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

    getColumns: function () {
        return this.table.getColumns();
    },

    resizeHeader: function () {
        this.table.resize();
        this.table._resizeHeader && this.table._resizeHeader();
    },

    attr: function (key,value) {
        var self = this;
        if (BI.isObject(key)) {
            BI.each(key, function (k, v) {
                self.attr(k, v);
            });
            return;
        }
        BI.ExcelTable.superclass.attr.apply(this, arguments);
        switch (key){
            case "mergeCols":
                var mCols = [];
                BI.each(value, function (i, col) {
                    mCols.push(col + 1);
                });
                value=mCols;
                break;
        }
        this.table.attr.apply(this.table, arguments);
    },

    populate: function (rows) {
        var self = this;
        var columnSize = this.getColumnSize();
        var items = [];
        var header = [{
            type: "bi.excel_table_header_cell"
        }];
        if (BI.isNotNull(rows)) {
            BI.each(columnSize, function (i, size) {
                header.push({
                    type: "bi.excel_table_header_cell",
                    text: BI.int2Abc(i + 1)
                });
            });
            BI.each(rows, function (i, row) {
                items.push([{
                    type: "bi.excel_table_header_cell",
                    text: (i + 1)
                }].concat(row));
            });
        }
        this.table.populate(items, [header]);
    },

    destroy: function () {
        this.table.destroy();
        BI.ExcelTable.superclass.destroy.apply(this, arguments);
    }
});
$.shortcut('bi.excel_table', BI.ExcelTable);