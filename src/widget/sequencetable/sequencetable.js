/**
 * 带有序号的表格
 *
 * Created by GUY on 2016/5/26.
 * @class BI.SequenceTable
 * @extends BI.Widget
 */
BI.SequenceTable = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SequenceTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-sequence-table",
            el: {
                type: "bi.adaptive_table"
            },

            sequence: {},

            isNeedResize: true,
            isResizeAdapt: false,

            isNeedFreeze: false,//是否需要冻结单元格
            freezeCols: [], //冻结的列号,从0开始,isNeedFreeze为true时生效

            isNeedMerge: false,//是否需要合并单元格
            mergeCols: [], //合并的单元格列号
            mergeRule: BI.emptyFn,

            columnSize: [],
            minColumnSize: [],
            maxColumnSize: [],
            headerRowSize: 25,
            rowSize: 25,

            regionColumnSize: [],

            headerCellStyleGetter: BI.emptyFn,
            summaryCellStyleGetter: BI.emptyFn,
            sequenceCellStyleGetter: BI.emptyFn,

            header: [],
            items: [], //二维数组

            //交叉表头
            crossHeader: [],
            crossItems: [],

            showSequence: false,
            startSequence: 1//开始的序号
        });
    },

    _init: function () {
        BI.SequenceTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.sequence = BI.createWidget(o.sequence, {
            type: "bi.sequence_table_list_number",
            invisible: o.showSequence === false,
            startSequence: o.startSequence,
            isNeedFreeze: o.isNeedFreeze,
            header: o.header,
            items: o.items,
            crossHeader: o.crossHeader,
            crossItems: o.crossItems,
            headerRowSize: o.headerRowSize,
            rowSize: o.rowSize,
            width: 60,
            height: o.height - BI.GridTableScrollbar.SIZE,

            headerCellStyleGetter: o.headerCellStyleGetter,
            summaryCellStyleGetter: o.summaryCellStyleGetter,
            sequenceCellStyleGetter: o.sequenceCellStyleGetter
        });
        this.table = BI.createWidget(o.el, {
            type: "bi.adaptive_table",
            width: o.showSequence === true ? o.width - 60 : o.width,
            height: o.height,
            isNeedResize: o.isNeedResize,
            isResizeAdapt: o.isResizeAdapt,

            isNeedFreeze: o.isNeedFreeze,
            freezeCols: o.freezeCols,

            isNeedMerge: o.isNeedMerge,
            mergeCols: o.mergeCols,
            mergeRule: o.mergeRule,

            columnSize: o.columnSize,
            minColumnSize: o.minColumnSize,
            maxColumnSize: o.maxColumnSize,
            headerRowSize: o.headerRowSize,
            rowSize: o.rowSize,

            regionColumnSize: o.regionColumnSize,

            headerCellStyleGetter: o.headerCellStyleGetter,
            summaryCellStyleGetter: o.summaryCellStyleGetter,
            sequenceCellStyleGetter: o.sequenceCellStyleGetter,

            header: o.header,
            items: o.items,
            //交叉表头
            crossHeader: o.crossHeader,
            crossItems: o.crossItems
        });

        this.table.on(BI.Table.EVENT_TABLE_SCROLL, function (scroll) {
            if (self.sequence.getVerticalScroll() !== this.getVerticalScroll()) {
                self.sequence.setVerticalScroll(this.getVerticalScroll());
                self.sequence.populate();
            }
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, function () {
            o.regionColumnSize = this.getRegionColumnSize();
            o.columnSize = this.getColumnSize();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, function () {
            o.regionColumnSize = this.getRegionColumnSize();
            o.columnSize = this.getColumnSize();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, arguments);
        });

        this.htape = BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.sequence,
                left: 0,
                top: 0
            }, {
                el: this.table,
                top: 0,
                left: o.showSequence === true ? 60 : 0
            }]
        });
        this._populate();
    },

    _populate: function () {
        var o = this.options;
        this.sequence.attr({
            items: o.items,
            header: o.header,
            crossItems: o.crossItems,
            crossHeader: o.crossHeader
        });
        if (o.showSequence === true) {
            this.sequence.setVisible(true);
            this.table.element.css("left", "60px");
            this.table.setWidth(o.width - 60);
        } else {
            this.sequence.setVisible(false);
            this.table.element.css("left", "0px");
            this.table.setWidth(o.width);
        }
    },

    setWidth: function (width) {
        BI.PageTable.superclass.setWidth.apply(this, arguments);
        this.table.setWidth(this.options.showSequence ? width - 60 : width);
    },

    setHeight: function (height) {
        BI.PageTable.superclass.setHeight.apply(this, arguments);
        this.table.setHeight(height);
        this.sequence.setHeight(height - BI.GridTableScrollbar.SIZE);
    },

    setColumnSize: function (columnSize) {
        this.options.columnSize = columnSize;
        this.table.setColumnSize(columnSize);
    },

    getColumnSize: function () {
        return this.table.getColumnSize();
    },

    setRegionColumnSize: function (columnSize) {
        this.options.columnSize = columnSize;
        this.table.setRegionColumnSize(columnSize);
    },

    getRegionColumnSize: function () {
        return this.table.getRegionColumnSize();
    },

    hasLeftHorizontalScroll: function () {
        return this.table.hasLeftHorizontalScroll();
    },

    hasRightHorizontalScroll: function () {
        return this.table.hasRightHorizontalScroll();
    },

    setVerticalScroll: function (scrollTop) {
        this.table.setVerticalScroll(scrollTop);
        this.sequence.setVerticalScroll(scrollTop);
    },

    getVerticalScroll: function () {
        return this.table.getVerticalScroll();
    },

    setVPage: function (page) {
        this.sequence.setVPage && this.sequence.setVPage(page);
    },

    setHPage: function (page) {
        this.sequence.setHPage && this.sequence.setHPage(page);
    },

    attr: function () {
        BI.SequenceTable.superclass.attr.apply(this, arguments);
        this.table.attr.apply(this.table, arguments);
        this.sequence.attr.apply(this.sequence, arguments);
    },

    restore: function () {
        this.table.restore();
        this.sequence.restore();
    },

    populate: function (items, header, crossItems, crossHeader) {
        var o = this.options;
        if (items) {
            o.items = items;
        }
        if (header) {
            o.header = header;
        }
        if (crossItems) {
            o.crossItems = crossItems;
        }
        if (crossHeader) {
            o.crossHeader = crossHeader;
        }
        this._populate();
        this.table.populate.apply(this.table, arguments);
        this.sequence.populate.apply(this.sequence, arguments);
        this.sequence.setVerticalScroll(this.table.getVerticalScroll());
    },

    destroy: function () {
        this.table.destroy();
        BI.SequenceTable.superclass.destroy.apply(this, arguments);
    }
});
BI.shortcut('bi.sequence_table', BI.SequenceTable);