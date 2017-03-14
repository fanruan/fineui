/**
 *
 * 层级树状结构的表格
 *
 * Created by GUY on 2016/8/12.
 * @class BI.DynamicSummaryLayerTreeTable
 * @extends BI.Widget
 */
BI.DynamicSummaryLayerTreeTable = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.DynamicSummaryLayerTreeTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-dynamic-summary-layer-tree-table",
            logic: { //冻结的页面布局逻辑
                dynamic: false
            },

            isNeedResize: false,//是否需要调整列宽
            isResizeAdapt: true,//是否需要在调整列宽或区域宽度的时候它们自适应变化

            isNeedFreeze: false,//是否需要冻结单元格
            freezeCols: [], //冻结的列号,从0开始,isNeedFreeze为tree时生效

            isNeedMerge: true,//是否需要合并单元格
            mergeCols: [],
            mergeRule: function (row1, row2) { //合并规则, 默认相等时合并
                return BI.isEqual(row1, row2);
            },

            columnSize: [],
            headerRowSize: 25,
            footerRowSize: 25,
            rowSize: 25,

            regionColumnSize: false,

            header: [],
            footer: false,
            items: [],

            //交叉表头
            crossHeader: [],
            crossItems: []
        })
    },

    _getVDeep: function () {
        return this.options.crossHeader.length;//纵向深度
    },

    _getHDeep: function () {
        var o = this.options;
        return Math.max(o.mergeCols.length, o.freezeCols.length, BI.TableTree.maxDeep(o.items) - 1);
    },

    _createHeader: function (vDeep) {
        var self = this, o = this.options;
        var header = o.header || [], crossHeader = o.crossHeader || [];
        var items = BI.DynamicSummaryTreeTable.formatCrossItems(o.crossItems, vDeep);
        var result = [];
        BI.each(items, function (row, node) {
            var c = [crossHeader[row]];
            result.push(c.concat(node || []));
        });
        var newHeader = this._formatColumns(header);
        var deep = this._getHDeep();
        if (deep <= 0) {
            newHeader.unshift({
                cls: "layer-tree-table-title",
                text: BI.i18nText("BI-Row_Header")
            });
        } else {
            newHeader[0] = {
                cls: "layer-tree-table-title",
                text: BI.i18nText("BI-Row_Header")
            };
        }
        result.push(newHeader);
        return result;
    },

    _formatItems: function (nodes, deep) {
        var self = this, o = this.options;
        var result = [];

        function track(node, layer) {
            node.type || (node.type = "bi.layer_tree_table_cell");
            node.layer = layer;
            var next = [node];
            next = next.concat(node.values || []);
            if (next.length > 0) {
                result.push(next);
            }
            if (BI.isNotEmptyArray(node.children)) {
                BI.each(node.children, function (index, child) {
                    track(child, layer + 1);
                });
            }
        }

        BI.each(nodes, function (i, node) {
            BI.each(node.children, function (j, c) {
                track(c, 0);
            });
            if (BI.isArray(node.values)) {
                var next = [{cls: "summary-cell last", text: BI.i18nText("BI-Summary_Values")}].concat(node.values);
                result.push(next)
            }
        });
        return BI.DynamicSummaryTreeTable.formatSummaryItems(result, o.crossItems, deep);
    },

    _formatCols: function (cols, deep) {
        deep = deep || this._getHDeep();
        cols = this._formatColumns(cols);
        return BI.map(cols, function (i, c) {
            return c - (deep - 1);
        })
    },

    _formatColumns: function (columns, deep) {
        if (BI.isNotEmptyArray(columns)) {
            deep = deep || this._getHDeep();
            return columns.slice(Math.max(0, deep - 1));
        }
        return columns;
    },

    _init: function () {
        BI.DynamicSummaryLayerTreeTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var deep = this._getHDeep();
        var vDeep = this._getVDeep();
        var header = this._createHeader(vDeep);
        var items = this._formatItems(o.items, deep);
        this.table = BI.createWidget({
            type: "bi.table_view",
            element: this.element,
            logic: o.logic,
            isNeedResize: o.isNeedResize,
            isResizeAdapt: o.isResizeAdapt,
            isNeedFreeze: o.isNeedFreeze,
            freezeCols: this._formatCols(o.freezeCols, deep),
            isNeedMerge: o.isNeedMerge,
            mergeCols: [],
            mergeRule: o.mergeRule,
            columnSize: this._formatColumns(o.columnSize, deep),
            headerRowSize: o.headerRowSize,
            footerRowSize: o.footerRowSize,
            rowSize: o.rowSize,
            regionColumnSize: o.regionColumnSize,
            header: header,
            footer: this._formatColumns(o.footer, deep),
            items: items
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_INIT, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_INIT, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_SCROLL, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_BEFORE_REGION_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_BEFORE_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_REGION_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_BEFORE_COLUMN_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_BEFORE_COLUMN_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_COLUMN_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_COLUMN_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, arguments);
        });
    },

    resize: function () {
        this.table.resize();
    },

    setColumnSize: function (columnSize) {
        columnSize = this._formatColumns(columnSize);
        this.table.setColumnSize(columnSize);
    },

    getColumnSize: function () {
        var columnSize = this.table.getColumnSize();
        var deep = this._getHDeep();
        var pre = [];
        if (deep > 0) {
            pre = BI.makeArray(deep - 1, 0);
        }
        return pre.concat(columnSize);
    },

    getCalculateColumnSize: function () {
        var columnSize = this.table.getCalculateColumnSize();
        var deep = this._getHDeep();
        var pre = [];
        if (deep > 0) {
            pre = BI.makeArray(deep - 1, "");
        }
        return pre.concat(columnSize);
    },

    setHeaderColumnSize: function (columnSize) {
        columnSize = this._formatColumns(columnSize);
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

    attr: function (key, value) {
        var self = this;
        if (BI.isObject(key)) {
            BI.each(key, function (k, v) {
                self.attr(k, v);
            });
            return;
        }
        BI.DynamicSummaryLayerTreeTable.superclass.attr.apply(this, arguments);
        switch (key) {
            case "columnSize":
            case "footer":
                value = this._formatColumns(value);
                break;
            case "freezeCols":
                value = value.length > 0 ? [0] : [];
                break;
            case "mergeCols":
                value = value.length > 0 ? [0] : [];
                break;
        }
        this.table.attr.apply(this.table, [key, value]);
    },

    populate: function (items, header, crossItems, crossHeader) {
        var o = this.options;
        o.items = items || [];
        if (header) {
            o.header = header;
        }
        if (crossItems) {
            o.crossItems = crossItems;
        }
        if (crossHeader) {
            o.crossHeader = crossHeader;
        }
        var deep = this._getHDeep();
        var vDeep = this._getVDeep();
        var header = this._createHeader(vDeep);
        items = this._formatItems(o.items, deep);
        this.table.populate(items, header);
    },

    destroy: function () {
        this.table.destroy();
        BI.DynamicSummaryLayerTreeTable.superclass.destroy.apply(this, arguments);
    }
});

$.shortcut("bi.dynamic_summary_layer_tree_table", BI.DynamicSummaryLayerTreeTable);