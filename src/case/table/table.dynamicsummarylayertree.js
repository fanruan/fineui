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

            el: {
                type: "bi.resizable_table"
            },
            isNeedResize: true,//是否需要调整列宽
            isResizeAdapt: true,//是否需要在调整列宽或区域宽度的时候它们自适应变化

            isNeedFreeze: false,//是否需要冻结单元格
            freezeCols: [], //冻结的列号,从0开始,isNeedFreeze为tree时生效

            isNeedMerge: true,//是否需要合并单元格
            mergeCols: [],
            mergeRule: BI.emptyFn,

            columnSize: [],
            minColumnSize: [],
            maxColumnSize: [],
            headerRowSize: 25,
            footerRowSize: 25,
            rowSize: 25,

            regionColumnSize: [],

            headerCellStyleGetter: BI.emptyFn,
            summaryCellStyleGetter: BI.emptyFn,
            sequenceCellStyleGetter: BI.emptyFn,

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
        var items = BI.TableTree.formatCrossItems(o.crossItems, vDeep, o.headerCellStyleGetter);
        var result = [];
        BI.each(items, function (row, node) {
            var c = [crossHeader[row]];
            result.push(c.concat(node || []));
        });
        if (header && header.length > 0) {
            var newHeader = this._formatColumns(header);
            var deep = this._getHDeep();
            if (deep <= 0) {
                newHeader.unshift({
                    type: "bi.table_style_cell",
                    text: BI.i18nText("BI-Row_Header"),
                    styleGetter: o.headerCellStyleGetter
                });
            } else {
                newHeader[0] = {
                    type: "bi.table_style_cell",
                    text: BI.i18nText("BI-Row_Header"),
                    styleGetter: o.headerCellStyleGetter
                };
            }
            result.push(newHeader);
        }
        return result;
    },

    _formatItems: function (nodes, header, deep) {
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
                var next = [{
                    type: "bi.table_style_cell",
                    text: BI.i18nText("BI-Summary_Values"),
                    styleGetter: function () {
                        return o.summaryCellStyleGetter(true);
                    }
                }].concat(node.values);
                result.push(next)
            }
        });
        return BI.DynamicSummaryTreeTable.formatSummaryItems(result, header, o.crossItems, 1);
    },

    _formatColumns: function (columns, deep) {
        if (BI.isNotEmptyArray(columns)) {
            deep = deep || this._getHDeep();
            return columns.slice(Math.max(0, deep - 1));
        }
        return columns;
    },

    _formatFreezeCols: function () {
        if (this.options.freezeCols.length > 0) {
            return [0];
        }
        return [];
    },

    _formatColumnSize: function (columnSize, deep) {
        if (columnSize.length <= 0) {
            return [];
        }
        var result = [0];
        deep = deep || this._getHDeep();
        BI.each(columnSize, function (i, size) {
            if (i < deep) {
                result[0] += size;
                return;
            }
            result.push(size);
        });
        return result;
    },

    _recomputeColumnSize: function () {
        var o = this.options;
        o.regionColumnSize = this.table.getRegionColumnSize();
        var columnSize = this.table.getColumnSize();
        if (o.freezeCols.length > 1) {
            for (var i = 0; i < o.freezeCols.length - 1; i++) {
                columnSize.splice(1, 0, 0);
            }
        }
        o.columnSize = columnSize;
    },

    _digest: function () {
        var o = this.options;
        var deep = this._getHDeep();
        var vDeep = this._getVDeep();
        var header = this._createHeader(vDeep);
        var data = this._formatItems(o.items, header, deep);
        // var columnSize = o.columnSize.slice();
        // var minColumnSize = o.minColumnSize.slice();
        // var maxColumnSize = o.maxColumnSize.slice();
        // BI.removeAt(columnSize, data.deletedCols);
        // BI.removeAt(minColumnSize, data.deletedCols);
        // BI.removeAt(maxColumnSize, data.deletedCols);
        return {
            header: data.header,
            items: data.items,
            columnSize: this._formatColumnSize(o.columnSize, deep),
            minColumnSize: this._formatColumns(o.minColumnSize, deep),
            maxColumnSize: this._formatColumns(o.maxColumnSize, deep),
            freezeCols: this._formatFreezeCols()
        }
    },

    _init: function () {
        BI.DynamicSummaryLayerTreeTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var data = this._digest();
        this.table = BI.createWidget(o.el, {
            type: "bi.resizable_table",
            element: this,
            width: o.width,
            height: o.height,
            isNeedResize: o.isNeedResize,
            isResizeAdapt: o.isResizeAdapt,
            isNeedFreeze: o.isNeedFreeze,
            freezeCols: data.freezeCols,
            isNeedMerge: o.isNeedMerge,
            mergeCols: [],
            mergeRule: o.mergeRule,
            columnSize: data.columnSize,
            minColumnSize: data.minColumnSize,
            maxColumnSize: data.maxColumnSize,
            headerRowSize: o.headerRowSize,
            rowSize: o.rowSize,
            regionColumnSize: o.regionColumnSize,
            headerCellStyleGetter: o.headerCellStyleGetter,
            summaryCellStyleGetter: o.summaryCellStyleGetter,
            sequenceCellStyleGetter: o.sequenceCellStyleGetter,
            header: data.header,
            items: data.items
        });
        this.table.on(BI.Table.EVENT_TABLE_SCROLL, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, function () {
            self._recomputeColumnSize();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, function () {
            self._recomputeColumnSize();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, arguments);
        });
    },

    setWidth: function (width) {
        BI.DynamicSummaryLayerTreeTable.superclass.setWidth.apply(this, arguments);
        this.table.setWidth(width);
    },

    setHeight: function (height) {
        BI.DynamicSummaryLayerTreeTable.superclass.setHeight.apply(this, arguments);
        this.table.setHeight(height);
    },

    setColumnSize: function (columnSize) {
        this.options.columnSize = columnSize;
    },

    getColumnSize: function () {
        return this.options.columnSize;
    },

    setRegionColumnSize: function (columnSize) {
        this.options.regionColumnSize = columnSize;
        this.table.setRegionColumnSize(columnSize);
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
            case "minColumnSize":
            case "maxColumnSize":
            case "freezeCols":
            case "mergeCols":
                return;
        }
        this.table.attr.apply(this.table, [key, value]);
    },

    restore: function () {
        this.table.restore();
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
        var data = this._digest();
        this.table.setColumnSize(data.columnSize);
        this.table.attr("minColumnSize", data.minColumnSize);
        this.table.attr("maxColumnSize", data.maxColumnSize);
        this.table.attr("freezeCols", data.freezeCols);
        this.table.populate(data.items, data.header);
    },

    destroy: function () {
        this.table.destroy();
        BI.DynamicSummaryLayerTreeTable.superclass.destroy.apply(this, arguments);
    }
});

BI.shortcut("bi.dynamic_summary_layer_tree_table", BI.DynamicSummaryLayerTreeTable);