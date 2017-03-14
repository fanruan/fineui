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

    _init: function () {
        BI.QuickGridTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.topLeftGrid.setOverflowX(false);
        this.topLeftGrid.setOverflowY(false);
        this.topRightGrid.setOverflowX(false);
        this.topRightGrid.setOverflowY(false);
        this.bottomLeftGrid.setOverflowX(false);
        this.bottomLeftGrid.setOverflowY(false);
        this.bottomRightGrid.setOverflowX(false);
        this.bottomRightGrid.setOverflowY(false);
        this._leftWheelHandler = new BI.WheelHandler(
            BI.bind(this._onWheelY, this),
            BI.bind(this._shouldHandleX, this),
            BI.bind(this._shouldHandleY, this)
        );
        this._rightWheelHandler = new BI.WheelHandler(
            BI.bind(this._onWheelY, this),
            BI.bind(this._shouldHandleX, this),
            BI.bind(this._shouldHandleY, this)
        );
        this.bottomLeftGrid.element.mousewheel(function (e) {
            self._leftWheelHandler.onWheel(e.originalEvent);
        });
        this.bottomRightGrid.element.mousewheel(function (e) {
            self._rightWheelHandler.onWheel(e.originalEvent);
        });
    },

    _shouldHandleX: function (delta) {
        return false;
    },

    _shouldHandleY: function (delta) {
        if (delta > 0) {
            return this.bottomRightGrid.getScrollTop() < this.bottomRightGrid.getMaxScrollTop();
        } else {
            return this.bottomRightGrid.getScrollTop() > 0;
        }
    },

    _onWheelY: function (deltaX, deltaY) {
        var self = this;
        var scrollTop = this.bottomRightGrid.getScrollTop();
        scrollTop += deltaY;
        this.bottomLeftGrid.setScrollTop(scrollTop);
        this.bottomRightGrid.setScrollTop(scrollTop);
        self._populateScrollbar();
        this.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
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

        var otlw = regionSize;
        var otlh = o.header.length * o.headerRowSize;
        var otrw = this._width - regionSize;
        var otrh = o.header.length * o.headerRowSize;
        var oblw = regionSize;
        var oblh = this._height - o.header.length * o.headerRowSize;
        var obrw = this._width - regionSize;
        var obrh = this._height - o.header.length * o.headerRowSize;

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
        this.topLeftGrid.populate(leftHeader);
        this.topRightGrid.populate(rightHeader);
        this.bottomLeftGrid.populate(leftItems);
        this.bottomRightGrid.populate(rightItems);
    }
});
$.shortcut('bi.quick_grid_table', BI.QuickGridTable);