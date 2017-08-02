/**
 * QuickGridTable
 *
 * Created by GUY on 2016/1/12.
 * @class BI.QuickGridTable
 * @extends BI.GridTable
 */
BI.QuickGridTable = BI.inherit(BI.GridTable, {
    _defaultConfig: function () {
        return BI.extend(BI.QuickGridTable.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-quick-grid-table"
        });
    },

    render: function () {
        BI.QuickGridTable.superclass.render.apply(this, arguments);
        var self = this, o = this.options;
        this.topLeftGrid.setOverflowX(false);
        this.topLeftGrid.setOverflowY(false);
        this.topRightGrid.setOverflowX(false);
        this.topRightGrid.setOverflowY(false);
        this.bottomLeftGrid.setOverflowX(false);
        this.bottomLeftGrid.setOverflowY(false);
        this.bottomRightGrid.setOverflowX(false);
        this.bottomRightGrid.setOverflowY(false);
    },

    mounted: function () {
        BI.QuickGridTable.superclass.mounted.apply(this, arguments);
        var self = this;
        this._topLeftWheelHandler = new BI.WheelHandler(
            BI.bind(this._onWheelLeft, this),
            BI.bind(this._shouldHandleLeftX, this),
            BI.bind(this._shouldHandleY, this)
        );
        this._topRightWheelHandler = new BI.WheelHandler(
            BI.bind(this._onWheelRight, this),
            BI.bind(this._shouldHandleRightX, this),
            BI.bind(this._shouldHandleY, this)
        );
        this._bottomLeftWheelHandler = new BI.WheelHandler(
            BI.bind(this._onWheelLeft, this),
            BI.bind(this._shouldHandleLeftX, this),
            BI.bind(this._shouldHandleY, this)
        );
        this._bottomRightWheelHandler = new BI.WheelHandler(
            BI.bind(this._onWheelRight, this),
            BI.bind(this._shouldHandleRightX, this),
            BI.bind(this._shouldHandleY, this)
        );
        this.topLeftGrid.element.mousewheel(function (e) {
            self._topLeftWheelHandler.onWheel(e.originalEvent);
        });
        this.topRightGrid.element.mousewheel(function (e) {
            self._topRightWheelHandler.onWheel(e.originalEvent);
        });
        this.bottomLeftGrid.element.mousewheel(function (e) {
            self._bottomLeftWheelHandler.onWheel(e.originalEvent);
        });
        this.bottomRightGrid.element.mousewheel(function (e) {
            self._bottomRightWheelHandler.onWheel(e.originalEvent);
        });
    },

    _shouldHandleLeftX: function (delta) {
        if (delta > 0) {
            return this.bottomLeftGrid.getScrollLeft() < this.bottomLeftGrid.getMaxScrollLeft();
        } else {
            return this.bottomLeftGrid.getScrollLeft() > 0;
        }
    },

    _shouldHandleRightX: function (delta) {
        if (delta > 0) {
            return this.bottomRightGrid.getScrollLeft() < this.bottomRightGrid.getMaxScrollLeft();
        } else {
            return this.bottomRightGrid.getScrollLeft() > 0;
        }
    },

    _shouldHandleY: function (delta) {
        if (delta > 0) {
            return this.bottomRightGrid.getScrollTop() < this.bottomRightGrid.getMaxScrollTop();
        } else {
            return this.bottomRightGrid.getScrollTop() > 0;
        }
    },

    _onWheelLeft: function (deltaX, deltaY) {
        var self = this;
        var scrollTop = this.bottomLeftGrid.getScrollTop();
        var scrollLeft = this.bottomLeftGrid.getScrollLeft();
        scrollTop += deltaY;
        scrollLeft += deltaX;
        this.bottomLeftGrid.setScrollTop(scrollTop);
        this.bottomRightGrid.setScrollTop(scrollTop);
        this.topLeftGrid.setScrollLeft(scrollLeft);
        this.bottomLeftGrid.setScrollLeft(scrollLeft);
        self._populateScrollbar();
        this.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
    },

    _onWheelRight: function (deltaX, deltaY) {
        var self = this;
        var scrollTop = this.bottomRightGrid.getScrollTop();
        var scrollLeft = this.bottomRightGrid.getScrollLeft();
        scrollTop += deltaY;
        scrollLeft += deltaX;
        this.bottomLeftGrid.setScrollTop(scrollTop);
        this.bottomRightGrid.setScrollTop(scrollTop);
        this.topRightGrid.setScrollLeft(scrollLeft);
        this.bottomRightGrid.setScrollLeft(scrollLeft);
        self._populateScrollbar();
        this.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
    },

    _populateTable: function () {
        var self = this, o = this.options;
        var regionSize = this.getRegionSize(), totalLeftColumnSize = 0, totalRightColumnSize = 0, totalColumnSize = 0,
            summaryColumnSizeArray = [];
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

        var otlw = regionSize;
        var otlh = this._getFreezeHeaderHeight();
        var otrw = this._width - regionSize;
        var otrh = this._getFreezeHeaderHeight();
        var oblw = regionSize;
        var oblh = this._height - otlh;
        var obrw = this._width - regionSize;
        var obrh = this._height - otrh;

        this.topLeft.setWidth(otlw);
        this.topLeft.setHeight(otlh);
        this.topRight.setWidth(otrw);
        this.topRight.setHeight(otrh);
        this.bottomLeft.setWidth(oblw);
        this.bottomLeft.setHeight(oblh);
        this.bottomRight.setWidth(obrw);
        this.bottomRight.setHeight(obrh);

        this.topLeftGrid.setWidth(otlw);
        this.topLeftGrid.setHeight(otlh);
        this.topRightGrid.setWidth(otrw);
        this.topRightGrid.setHeight(otrh);
        this.bottomLeftGrid.setWidth(oblw);
        this.bottomLeftGrid.setHeight(oblh);
        this.bottomRightGrid.setWidth(obrw);
        this.bottomRightGrid.setHeight(obrh);

        this.topLeftGrid.setEstimatedColumnSize(freezeColLength > 0 ? totalLeftColumnSize / freezeColLength : 0);
        this.topLeftGrid.setEstimatedRowSize(o.headerRowSize);
        this.topRightGrid.setEstimatedColumnSize((o.columnSize.length - freezeColLength) > 0 ? (totalRightColumnSize / (o.columnSize.length - freezeColLength)) : 0);
        this.topRightGrid.setEstimatedRowSize(o.headerRowSize);
        this.bottomLeftGrid.setEstimatedColumnSize(freezeColLength > 0 ? totalLeftColumnSize / freezeColLength : 0);
        this.bottomLeftGrid.setEstimatedRowSize(o.rowSize);
        this.bottomRightGrid.setEstimatedColumnSize((o.columnSize.length - freezeColLength) > 0 ? (totalRightColumnSize / (o.columnSize.length - freezeColLength)) : 0);
        this.bottomRightGrid.setEstimatedRowSize(o.rowSize);

        var items = this.contextLayout.attr("items");
        items[1].left = regionSize;
        items[2].top = this._getFreezeHeaderHeight();
        items[3].left = regionSize;
        items[3].top = this._getFreezeHeaderHeight();
        this.contextLayout.attr("items", items);
        this.contextLayout.resize();

        var leftHeader = [], rightHeader = [], leftItems = [], rightItems = [];
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
        BI.each(this._getActualItems(), function (i, cols) {
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

        this.topLeftGrid.attr({
            overscanColumnCount: 0,
            overscanRowCount: 0
        });
        this.topRightGrid.attr({
            overscanColumnCount: 0,
            overscanRowCount: 0
        });
        this.bottomLeftGrid.attr({
            overscanColumnCount: 0,
            overscanRowCount: 0
        });
        this.bottomRightGrid.attr({
            overscanColumnCount: 0,
            overscanRowCount: 0
        });

        function overscan(grid, w, h, rSize, cSize) {
            var rCount = h / rSize;
            var cCount = w / cSize;
            if (cCount * (120 / rSize) >= 60 || rCount * (120 / cSize) >= 60) {
                grid.attr("overscanRowCount", 100);
                grid.attr("overscanColumnCount", 100);
            }
        }

        if (freezeColLength > 0) {
            overscan(this.topLeftGrid, otlw, otlh, o.headerRowSize, totalLeftColumnSize / freezeColLength);
            overscan(this.bottomLeftGrid, oblw, oblh, o.rowSize, totalLeftColumnSize / freezeColLength);
        }
        if (o.columnSize.length - freezeColLength > 0) {
            overscan(this.topRight, otrw, otrh, o.headerRowSize, totalRightColumnSize / (o.columnSize.length - freezeColLength));
            overscan(this.bottomRightGrid, obrw, obrh, o.rowSize, totalRightColumnSize / (o.columnSize.length - freezeColLength));
        }

        this.topLeftGrid.populate(leftHeader);
        this.topRightGrid.populate(rightHeader);
        this.bottomLeftGrid.populate(leftItems);
        this.bottomRightGrid.populate(rightItems);
    }
});
BI.shortcut('bi.quick_grid_table', BI.QuickGridTable);