/**
 *
 * 可调整列宽的grid表格
 *
 * Created by GUY on 2016/1/12.
 * @class BI.ResizableTable
 * @extends BI.Widget
 */
BI.ResizableTable = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.ResizableTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-resizable-table",
            el: {
                type: "bi.grid_table"
            },
            isNeedFreeze: false,
            isNeedResize: true,
            isResizeAdapt: false,
            headerRowSize: 25,
            rowSize: 25,
            isNeedMerge: true,//是否需要合并单元格
            mergeCols: [],
            mergeRule: BI.emptyFn,
            columnSize: [],
            freezeCols: [],
            header: [],
            items: [],
            regionColumnSize: []
        })
    },

    _init: function () {
        BI.ResizableTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.resizer = BI.createWidget({
            type: "bi.layout",
            cls: "resizable-table-resizer",
            invisible: true,
            width: 2
        });
        this.regionResizerHandler = this._createResizerHandler();
        this.table = BI.createWidget(o.el, {
            type: "bi.grid_table",
            element: this.element,
            width: o.width,
            height: o.height,
            headerRowSize: o.headerRowSize,
            rowSize: o.rowSize,
            columnSize: o.columnSize,

            isNeedFreeze: o.isNeedFreeze,
            freezeCols: o.freezeCols,
            isNeedMerge: o.isNeedMerge,
            mergeCols: o.mergeCols,
            mergeRule: BI.bind(this._mergeRule, this),

            header: this._formatHeader(o.header),
            items: o.items,
            regionColumnSize: o.regionColumnSize
        });
        this.table.on(BI.Table.EVENT_TABLE_SCROLL, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this.element,
            items: [{
                el: this.regionResizerHandler,
                left: 0,
                top: 0,
                bottom: 0
            }, {
                el: this.resizer,
                left: 0,
                top: 0
            }]
        });
        this._populate();
    },

    _mergeRule: function (row1, row2) {
        var o = this.options;
        if (row1.type === "bi.resizable_table_cell") {
            row1 = row1.cell;
        }
        if (row2.type === "bi.resizable_table_cell") {
            row2 = row2.cell;
        }
        return o.mergeRule(row1, row2);
    },

    _createResizerHandler: function () {
        var self = this, o = this.options;
        var regionResizerHandler = BI.createWidget({
            type: "bi.absolute",
            cls: "resizable-table-region-resizer",
            invisible: true,
            width: 6,
            items: [{
                el: {
                    type: "bi.layout",
                    width: 2,
                    cls: "resizable-table-region-resizer-knob"
                },
                left: 2,
                top: 0,
                bottom: 0
            }]
        });
        var size = 0, offset = 0, defaultSize = 0, start = false;
        var mouseMoveTracker = new BI.MouseMoveTracker(function (deltaX, deltaY) {
            if (mouseMoveTracker.isDragging()) {
                start = true;
                offset += deltaX;
                size = BI.clamp(defaultSize + offset, 15, o.width - 15);

                self.regionResizerHandler.element.addClass("dragging");
                self._setRegionResizerHandlerPosition(size - 3, 0);
            }

        }, function () {
            if (start === true) {
                o.regionColumnSize[0] = BI.clamp(size, 15, o.width - 15);
                self.table.setRegionColumnSize(o.regionColumnSize);
                if (o.isResizeAdapt === true) {
                    var freezeColumnSize = self._getFreezeColumnSize();
                    o.columnSize[self._getFreezeColLength() - 1] += o.regionColumnSize[0] - freezeColumnSize;
                    self.table.setColumnSize(o.columnSize);
                }
                self.table.populate();
                self._populate();
                self.regionResizerHandler.element.removeClass("dragging");
                self.fireEvent(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE);
                start = false;
            }
            mouseMoveTracker.releaseMouseMoves();
        }, document);
        regionResizerHandler.element.on("mousedown", function (event) {
            defaultSize = size = self._getRegionSize();
            offset = 0;
            self._setResizerPosition(0, 0);
            mouseMoveTracker.captureMouseMoves(event);
        });
        return regionResizerHandler;
    },

    _setResizerPosition: function (left, top) {
        this.resizer.element.css({
            left: left + "px",
            top: top + "px"
        });
    },

    _setRegionResizerHandlerPosition: function (left, top) {
        this.regionResizerHandler.element.css({
            left: left + "px",
            top: top + "px"
        });
    },

    _getRegionSize: function () {
        var o = this.options;
        var regionSize = o.regionColumnSize[0] || 0;
        if (o.isNeedFreeze === false || o.freezeCols.length === 0) {
            return 0;
        }
        if (!regionSize) {
            BI.each(o.freezeCols, function (i, col) {
                regionSize += o.columnSize[col];
            });
        }
        return regionSize;
    },

    _getRegionRowSize: function () {
        var o = this.options;
        return [o.header.length * o.headerRowSize,
            Math.min(o.height - o.header.length * o.headerRowSize, o.items.length * o.rowSize)];
    },

    _getFreezeColLength: function () {
        return this.options.freezeCols.length;
    },

    _getFreezeColumnSize: function () {
        var columnSize = this.options.columnSize;
        var sum = 0;
        for (var i = 0, len = this._getFreezeColLength(); i < len; i++) {
            sum += columnSize[i];
        }
        return sum;
    },

    _getResizerLeft: function (j) {
        var left = 0;
        var columnSize = this.options.columnSize;
        var freezeColLength = this._getFreezeColLength();
        for (var i = (j >= freezeColLength ? freezeColLength : 0); i < j; i++) {
            left += columnSize[i] || 0;
        }
        if (j >= freezeColLength) {
            left += this.table.getRegionSize();
            left -= this.table.getRightHorizontalScroll();
        } else {
            left -= this.table.getLeftHorizontalScroll();
        }
        return left;
    },

    _formatHeader: function (header) {
        var self = this, o = this.options;
        var result = [];
        var resize = function (j, size) {
            self.resizer.setVisible(true);
            var height = o.headerRowSize + self._getRegionRowSize()[1];
            self.resizer.setHeight(height);

            self._setResizerPosition(self._getResizerLeft(j) + size, (o.header.length - 1) * o.headerRowSize);
        };
        var stop = function (j, size) {
            self.resizer.setVisible(false);
            o.columnSize[j] = size;
            self.table.setColumnSize(o.columnSize);
            self.table.populate();
            self._populate();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE);
        };
        BI.each(header, function (i, cols) {
            if (i === header.length - 1) {
                result[i] = [];
                BI.each(cols, function (j, col) {
                    if (j === self._getFreezeColLength() - 1 || j === cols.length - 1) {
                        result[i][j] = col;
                    } else {
                        result[i][j] = {
                            type: "bi.resizable_table_cell",
                            cell: col,
                            resize: BI.bind(resize, null, j),
                            stop: BI.bind(stop, null, j)
                        };
                        if (o.isNeedMerge) {
                            var r = i;
                            while (r > 0 && self._mergeRule(result[r][j], result[r - 1][j])) {
                                result[r - 1][j] = {
                                    type: "bi.resizable_table_cell",
                                    cell: result[r - 1][j],
                                    resize: BI.bind(resize, null, j),
                                    stop: BI.bind(stop, null, j)
                                };
                                r--;
                            }
                        }
                    }
                });
            } else {
                result.push(cols);
            }
        });
        return result;
    },

    _populate: function () {
        var o = this.options;
        var regionSize = this._getRegionSize();
        if (regionSize > 0) {
            this.regionResizerHandler.setVisible(true);
            this._setRegionResizerHandlerPosition(regionSize - 3, 0);
        } else {
            this.regionResizerHandler.setVisible(false);
        }
    },

    setWidth: function (width) {
        BI.ResizableTable.superclass.setWidth.apply(this, arguments);
        this.table.setWidth(width)
    },

    setHeight: function (height) {
        BI.ResizableTable.superclass.setHeight.apply(this, arguments);
        this.table.setHeight(height);
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

    setColumnSize: function (columnSize) {
        this.options.columnSize = columnSize;
        this.table.setColumnSize(columnSize);
    },

    getColumnSize: function () {
        return this.table.getColumnSize();
    },

    setRegionColumnSize: function (columnSize) {
        this.options.regionColumnSize = columnSize;
        this.table.setRegionColumnSize(columnSize);
    },

    getRegionColumnSize: function () {
        return this.table.getRegionColumnSize();
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

    attr: function () {
        BI.ResizableTable.superclass.attr.apply(this, arguments);
        this.table.attr.apply(this.table, arguments);
    },

    restore: function () {
        this.table.restore();
    },

    populate: function (items, header) {
        if (items) {
            this.options.items = items;
        }
        if (header) {
            this.options.header = header;
            if (this.options.isNeedResize) {
                header = this._formatHeader(header);
            }
        }
        this.table.populate(items, header);
        this._populate();
    }
});

$.shortcut("bi.resizable_table", BI.ResizableTable);