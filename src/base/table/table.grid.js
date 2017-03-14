/**
 * GridTable
 *
 * Created by GUY on 2016/1/12.
 * @class BI.GridTable
 * @extends BI.Widget
 */
BI.GridTable = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.GridTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-grid-table",
            headerRowSize: 25,
            rowSize: 25,
            columnSize: [],
            isNeedFreeze: false,
            freezeCols: [],
            header: [],
            items: [],
            regionColumnSize: []
        });
    },

    _init: function () {
        BI.GridTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this._width = 0;
        this._height = 0;
        this._scrollBarSize = BI.DOM.getScrollWidth();
        var rowHeightGetter = function () {
            return o.rowSize;
        };
        var columnLeftWidthGetter = function (index) {
            return o.columnSize[index];
        };
        var columnRightWidthGetter = function (index) {
            return o.columnSize[index + self._getFreezeColLength()];
        };
        this.topLeftGrid = BI.createWidget({
            type: "bi.grid_view",
            rowHeightGetter: rowHeightGetter,
            columnWidthGetter: columnLeftWidthGetter,
        });
        this.topLeftGrid.on(BI.Grid.EVENT_SCROLL, function (scroll) {
            self.bottomLeftGrid.setScrollLeft(scroll.scrollLeft);
            self._populateScrollbar();
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.topRightGrid = BI.createWidget({
            type: "bi.grid_view",
            rowHeightGetter: rowHeightGetter,
            columnWidthGetter: columnRightWidthGetter,
        });
        this.topRightGrid.on(BI.Grid.EVENT_SCROLL, function (scroll) {
            self.bottomRightGrid.setScrollLeft(scroll.scrollLeft);
            self._populateScrollbar();
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.bottomLeftGrid = BI.createWidget({
            type: "bi.grid_view",
            rowHeightGetter: rowHeightGetter,
            columnWidthGetter: columnLeftWidthGetter,
        });
        this.bottomLeftGrid.on(BI.Grid.EVENT_SCROLL, function (scroll) {
            self.bottomRightGrid.setScrollTop(scroll.scrollTop);
            self.topLeftGrid.setScrollLeft(scroll.scrollLeft);
            self._populateScrollbar();
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.bottomRightGrid = BI.createWidget({
            type: "bi.grid_view",
            rowHeightGetter: rowHeightGetter,
            columnWidthGetter: columnRightWidthGetter,
        });
        this.bottomRightGrid.on(BI.Grid.EVENT_SCROLL, function (scroll) {
            self.bottomLeftGrid.setScrollTop(scroll.scrollTop);
            self.topRightGrid.setScrollLeft(scroll.scrollLeft);
            self._populateScrollbar();
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.topLeft = BI.createWidget({
            type: "bi.vertical",
            scrollable: false,
            scrolly: false,
            items: [this.topLeftGrid]
        });
        this.topRight = BI.createWidget({
            type: "bi.vertical",
            scrollable: false,
            scrolly: false,
            items: [this.topRightGrid]
        });
        this.bottomLeft = BI.createWidget({
            type: "bi.vertical",
            scrollable: false,
            scrolly: false,
            items: [this.bottomLeftGrid]
        });
        this.bottomRight = BI.createWidget({
            type: "bi.vertical",
            scrollable: false,
            scrolly: false,
            items: [this.bottomRightGrid]
        });
        this.contextLayout = BI.createWidget({
            type: "bi.absolute",
            element: this.element,
            items: [{
                el: this.topLeft,
                top: 0,
                left: 0
            }, {
                el: this.topRight,
                top: 0
            }, {
                el: this.bottomLeft,
                left: 0
            }, {
                el: this.bottomRight
            }]
        });

        this.topScrollbar = BI.createWidget({
            type: "bi.grid_table_scrollbar",
            width: BI.GridTableScrollbar.SIZE
        });
        this.topScrollbar.on(BI.GridTableScrollbar.EVENT_SCROLL, function (scrollTop) {
            self.bottomLeftGrid.setScrollTop(scrollTop);
            self.bottomRightGrid.setScrollTop(scrollTop);
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.leftScrollbar = BI.createWidget({
            type: "bi.grid_table_horizontal_scrollbar",
            height: BI.GridTableScrollbar.SIZE
        });
        this.leftScrollbar.on(BI.GridTableHorizontalScrollbar.EVENT_SCROLL, function (scrollLeft) {
            self.topLeftGrid.setScrollLeft(scrollLeft);
            self.bottomLeftGrid.setScrollLeft(scrollLeft);
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.rightScrollbar = BI.createWidget({
            type: "bi.grid_table_horizontal_scrollbar",
            height: BI.GridTableScrollbar.SIZE
        });
        this.rightScrollbar.on(BI.GridTableHorizontalScrollbar.EVENT_SCROLL, function (scrollLeft) {
            self.topRightGrid.setScrollLeft(scrollLeft);
            self.bottomRightGrid.setScrollLeft(scrollLeft);
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.scrollBarLayout = BI.createWidget({
            type: "bi.absolute",
            element: this.element,
            items: [{
                el: this.topScrollbar,
                right: 0,
                top: 0
            }, {
                el: this.leftScrollbar,
                left: 0
            }, {
                el: this.rightScrollbar,
            }]
        });
        this._width = o.width - BI.GridTableScrollbar.SIZE;
        this._height = o.height - BI.GridTableScrollbar.SIZE;
        this.header = this._getHeader();
        this.items = this._getItems();
        if (o.items.length > 0) {
            this._populate();
        }
    },

    _getFreezeColLength: function () {
        return this.options.isNeedFreeze ? this.options.freezeCols.length : 0;
    },

    _populateScrollbar: function () {
        var o = this.options;
        var regionSize = this.getRegionSize(), totalLeftColumnSize = 0, totalRightColumnSize = 0, totalColumnSize = 0, summaryColumnSizeArray = [], totalRowSize = o.items.length * o.rowSize;
        var freezeColLength = this._getFreezeColLength();
        BI.each(o.columnSize, function (i, size) {
            if (o.isNeedFreeze === true && o.freezeCols.contains(i)) {
                totalLeftColumnSize += size;
            } else {
                totalRightColumnSize += size;
            }
            totalColumnSize += size;
            if (i === 0) {
                summaryColumnSizeArray[i] = size;
            } else {
                summaryColumnSizeArray[i] = summaryColumnSizeArray[i - 1] + size;
            }
        });
        this.topScrollbar.setContentSize(o.items.length * o.rowSize);
        this.topScrollbar.setSize(this._height - o.header.length * o.headerRowSize);
        this.topScrollbar.setPosition(Math.min(this.bottomLeftGrid.getScrollTop(), this.bottomRightGrid.getScrollTop()));
        this.topScrollbar.populate();

        this.leftScrollbar.setContentSize(totalLeftColumnSize);
        this.leftScrollbar.setSize(regionSize);
        this.leftScrollbar.setPosition(this.bottomLeftGrid.getScrollLeft());
        this.leftScrollbar.populate();

        this.rightScrollbar.setContentSize(totalRightColumnSize);
        this.rightScrollbar.setSize(this._width - regionSize);
        this.rightScrollbar.setPosition(this.bottomRightGrid.getScrollLeft());
        this.rightScrollbar.populate();

        var items = this.scrollBarLayout.attr("items");
        items[0].top = o.header.length * o.headerRowSize;
        items[1].top = this._height;
        items[2].top = this._height;
        items[2].left = regionSize;
        this.scrollBarLayout.attr("items", items);
        this.scrollBarLayout.resize();
    },

    _getHeader: function () {
        var o = this.options;
        var freezeColLength = this._getFreezeColLength();
        var leftHeader = [], rightHeader = [];
        BI.each(o.header, function (i, cols) {
            leftHeader[i] = [];
            rightHeader[i] = [];
            BI.each(cols, function (j, col) {
                var cell = {
                    type: "bi.grid_table_cell",
                    cell: col
                };
                if (j < freezeColLength) {
                    leftHeader[i].push(cell);
                } else {
                    rightHeader[i].push(cell);
                }
            });
        });
        return [leftHeader, rightHeader];
    },

    _getItems: function () {
        var o = this.options;
        var freezeColLength = this._getFreezeColLength();
        var leftItems = [], rightItems = [];
        BI.each(o.items, function (i, cols) {
            leftItems[i] = [];
            rightItems[i] = [];
            BI.each(cols, function (j, col) {
                var cell = {
                    type: "bi.grid_table_cell",
                    cell: col
                };
                if (j < freezeColLength) {
                    leftItems[i].push(cell);
                } else {
                    rightItems[i].push(cell);
                }
            });
        });
        return [leftItems, rightItems];
    },

    _populateTable: function () {
        var self = this, o = this.options;
        var regionSize = this.getRegionSize(), totalLeftColumnSize = 0, totalRightColumnSize = 0, totalColumnSize = 0, summaryColumnSizeArray = [], totalRowSize = o.items.length * o.rowSize;
        var freezeColLength = this._getFreezeColLength();
        BI.each(o.columnSize, function (i, size) {
            if (o.isNeedFreeze === true && o.freezeCols.contains(i)) {
                totalLeftColumnSize += size;
            } else {
                totalRightColumnSize += size;
            }
            totalColumnSize += size;
            if (i === 0) {
                summaryColumnSizeArray[i] = size;
            } else {
                summaryColumnSizeArray[i] = summaryColumnSizeArray[i - 1] + size;
            }
        });

        var tlw = regionSize;
        var tlh = regionSize >= summaryColumnSizeArray[freezeColLength - 1] ? (o.header.length * o.headerRowSize) : (o.header.length * o.headerRowSize + this._scrollBarSize);
        var trw = this._width - regionSize;
        var trh = (this._width - regionSize >= totalColumnSize - (summaryColumnSizeArray[freezeColLength - 1] || 0)) ? (o.header.length * o.headerRowSize) : (o.header.length * o.headerRowSize + this._scrollBarSize);
        var blw = (this._height - o.header.length * o.headerRowSize >= totalRowSize) ? regionSize : (regionSize + this._scrollBarSize);
        var blh = (regionSize >= (summaryColumnSizeArray[freezeColLength - 1] || 0)) ? (this._height - o.header.length * o.headerRowSize) : (this._height - o.header.length * o.headerRowSize + this._scrollBarSize);
        var brw = (this._height - o.header.length * o.headerRowSize >= totalRowSize) ? (this._width - regionSize) : (this._width - regionSize + this._scrollBarSize);
        var brh = (this._width - regionSize >= totalColumnSize - (summaryColumnSizeArray[freezeColLength - 1] || 0)) ? (this._height - o.header.length * o.headerRowSize) : (this._height - o.header.length * o.headerRowSize + this._scrollBarSize);

        var otlw = regionSize;
        var otlh = o.header.length * o.headerRowSize;
        var otrw = this._width - regionSize;
        var otrh = o.header.length * o.headerRowSize;
        var oblw = regionSize;
        var oblh = this._height - o.header.length * o.headerRowSize;
        var obrw = this._width - regionSize;
        var obrh = this._height - o.header.length * o.headerRowSize;

        var digest = function (w, h, tw, th, el) {
            if (w >= tw && h >= th) {
                el.element.css({
                    overflow: "hidden",
                    overflowX: "hidden",
                    overflowY: "hidden"
                })
            } else if (w >= tw) {
                el.element.css({
                    overflow: "hidden",
                    overflowX: "hidden",
                    overflowY: "auto"
                })
            } else if (h >= th) {
                el.element.css({
                    overflow: "hidden",
                    overflowX: "auto",
                    overflowY: "hidden"
                })
            } else {
                el.element.css({
                    overflow: "auto",
                    overflowX: "auto",
                    overflowY: "auto"
                })
            }
        };

        this.topLeft.setWidth(otlw);
        this.topLeft.setHeight(otlh);
        this.topRight.setWidth(otrw);
        this.topRight.setHeight(otrh);
        this.bottomLeft.setWidth(oblw);
        this.bottomLeft.setHeight(oblh);
        this.bottomRight.setWidth(obrw);
        this.bottomRight.setHeight(obrh);

        this.topLeftGrid.setWidth(tlw);
        this.topLeftGrid.setHeight(tlh);
        this.topRightGrid.setWidth(trw);
        this.topRightGrid.setHeight(trh);
        this.bottomLeftGrid.setWidth(blw);
        this.bottomLeftGrid.setHeight(blh);
        this.bottomRightGrid.setWidth(brw);
        this.bottomRightGrid.setHeight(brh);

        digest(tlw, tlh, totalLeftColumnSize, o.header.length * o.headerRowSize, this.topLeftGrid);
        digest(trw, trh, totalRightColumnSize, o.header.length * o.headerRowSize, this.topRightGrid);
        digest(blw, blh, totalLeftColumnSize, o.items.length * o.rowSize, this.bottomLeftGrid);
        digest(brw, brh, totalRightColumnSize, o.items.length * o.rowSize, this.bottomRightGrid);

        this.topLeftGrid.setEstimatedColumnSize(freezeColLength > 0 ? totalLeftColumnSize / freezeColLength : 0);
        this.topLeftGrid.setEstimatedRowSize(o.headerRowSize);
        this.topRightGrid.setEstimatedColumnSize(totalRightColumnSize / (o.columnSize.length - freezeColLength));
        this.topRightGrid.setEstimatedRowSize(o.headerRowSize);
        this.bottomLeftGrid.setEstimatedColumnSize(freezeColLength > 0 ? totalLeftColumnSize / freezeColLength : 0);
        this.bottomLeftGrid.setEstimatedRowSize(o.rowSize);
        this.bottomRightGrid.setEstimatedColumnSize(totalRightColumnSize / (o.columnSize.length - freezeColLength));
        this.bottomRightGrid.setEstimatedRowSize(o.rowSize);

        var items = this.contextLayout.attr("items");
        items[1].left = regionSize;
        items[2].top = o.header.length * o.headerRowSize;
        items[3].left = regionSize;
        items[3].top = o.header.length * o.headerRowSize;
        this.contextLayout.attr("items", items);
        this.contextLayout.resize();

        this.topLeftGrid.populate(this.header[0]);
        this.topRightGrid.populate(this.header[1]);
        this.bottomLeftGrid.populate(this.items[0]);
        this.bottomRightGrid.populate(this.items[1]);
    },

    _populate: function () {
        if (this._width <= 0 || this._height <= 0) {
            return;
        }
        this._populateTable();
        this._populateScrollbar();
    },

    getRegionSize: function () {
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

    setVerticalScroll: function (scrollTop) {
        this.bottomLeftGrid.setScrollTop(scrollTop);
        this.bottomRightGrid.setScrollTop(scrollTop);
    },

    setLeftHorizontalScroll: function (scrollLeft) {
        this.topLeftGrid.setScrollLeft(scrollLeft);
        this.bottomLeftGrid.setScrollLeft(scrollLeft);
    },

    setRightHorizontalScroll: function (scrollLeft) {
        this.topRightGrid.setScrollLeft(scrollLeft);
        this.bottomRightGrid.setScrollLeft(scrollLeft);
    },

    getVerticalScroll: function () {
        return this.bottomRightGrid.getScrollTop();
    },

    getLeftHorizontalScroll: function () {
        return this.bottomLeftGrid.getScrollLeft();
    },

    getRightHorizontalScroll: function () {
        return this.bottomRightGrid.getScrollLeft();
    },

    setWidth: function (width) {
        BI.GridTable.superclass.setWidth.apply(this, arguments);
        this._width = this.options.width - BI.GridTableScrollbar.SIZE;
    },

    setHeight: function (height) {
        BI.GridTable.superclass.setHeight.apply(this, arguments);
        this._height = this.options.height - BI.GridTableScrollbar.SIZE;
    },

    setColumnSize: function (columnSize) {
        this.options.columnSize = columnSize;
    },

    setRegionColumnSize: function (regionColumnSize) {
        this.options.regionColumnSize = regionColumnSize;
    },

    getColumnSize: function () {
        return this.options.columnSize;
    },

    getRegionColumnSize: function () {
        return this.options.regionColumnSize;
    },

    populate: function (items, header) {
        if (items && this.options.items !== items) {
            this.options.items = items;
            this.items = this._getItems();
            this._restore();
        }
        if (header && this.options.header !== header) {
            this.options.header = header;
            this.header = this._getHeader();
            this._restore();
        }
        this._populate();
    },

    _restore: function () {
        this.topLeftGrid.restore();
        this.topRightGrid.restore();
        this.bottomLeftGrid.restore();
        this.bottomRightGrid.restore();
    },

    restore: function () {
        this._restore();
    }
});
$.shortcut('bi.grid_table', BI.GridTable);