/**
 * Grid
 *
 * Created by GUY on 2016/1/11.
 * @class BI.Grid
 * @extends BI.Widget
 */
BI.Grid = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.Grid.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-grid",
            width: 400,
            height: 300,
            overflowX: true,
            overflowY: true,
            overscanColumnCount: 0,
            overscanRowCount: 0,
            rowHeightGetter: BI.emptyFn,
            columnWidthGetter: BI.emptyFn,
            estimatedColumnSize: 100,
            estimatedRowSize: 30,
            scrollLeft: 0,
            scrollTop: 0,
            items: []
        });
    },

    _init: function () {
        BI.Grid.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.renderedCells = [];
        this.renderedKeys = [];
        this._scrollLock = false;
        this._debounceRelease = BI.debounce(function () {
            self._scrollLock = false;
        }, 150);
        this.container = BI.createWidget({
            type: "bi.absolute"
        });
        this.element.scroll(function () {
            if (self._scrollLock === true) {
                return;
            }
            o.scrollLeft = self.element.scrollLeft();
            o.scrollTop = self.element.scrollTop();
            self._calculateChildrenToRender();
            self.fireEvent(BI.Grid.EVENT_SCROLL, {
                scrollLeft: o.scrollLeft,
                scrollTop: o.scrollTop
            });
        });
        BI.createWidget({
            type: "bi.vertical",
            element: this.element,
            scrollable: o.overflowX === true && o.overflowY === true,
            scrolly: o.overflowX === false && o.overflowY === true,
            scrollx: o.overflowX === true && o.overflowY === false,
            items: [this.container]
        });
        if (o.items.length > 0) {
            this._populate();
        }
        if (o.scrollLeft !== 0 || o.scrollTop !== 0) {
            BI.nextTick(function () {
                self.element.scrollTop(o.scrollTop);
                self.element.scrollLeft(o.scrollLeft);
            });
        }
    },

    _getOverscanIndices: function (cellCount, overscanCellsCount, startIndex, stopIndex) {
        return {
            overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
            overscanStopIndex: Math.min(cellCount - 1, stopIndex + overscanCellsCount)
        }
    },

    _calculateChildrenToRender: function () {
        var self = this, o = this.options;

        var width = o.width, height = o.height, scrollLeft = BI.clamp(o.scrollLeft, 0, this._getMaxScrollLeft()), scrollTop = BI.clamp(o.scrollTop, 0, this._getMaxScrollTop()),
            overscanColumnCount = o.overscanColumnCount, overscanRowCount = o.overscanRowCount;

        if (height > 0 && width > 0) {
            var visibleColumnIndices = this._columnSizeAndPositionManager.getVisibleCellRange(width, scrollLeft);
            var visibleRowIndices = this._rowSizeAndPositionManager.getVisibleCellRange(height, scrollTop);

            var horizontalOffsetAdjustment = this._columnSizeAndPositionManager.getOffsetAdjustment(width, scrollLeft);
            var verticalOffsetAdjustment = this._rowSizeAndPositionManager.getOffsetAdjustment(height, scrollTop);

            this._renderedColumnStartIndex = visibleColumnIndices.start;
            this._renderedColumnStopIndex = visibleColumnIndices.stop;
            this._renderedRowStartIndex = visibleRowIndices.start;
            this._renderedRowStopIndex = visibleRowIndices.stop;

            var overscanColumnIndices = this._getOverscanIndices(this.columnCount, overscanColumnCount, this._renderedColumnStartIndex, this._renderedColumnStopIndex)

            var overscanRowIndices = this._getOverscanIndices(this.rowCount, overscanRowCount, this._renderedRowStartIndex, this._renderedRowStopIndex);

            var columnStartIndex = overscanColumnIndices.overscanStartIndex;
            var columnStopIndex = overscanColumnIndices.overscanStopIndex;
            var rowStartIndex = overscanRowIndices.overscanStartIndex;
            var rowStopIndex = overscanRowIndices.overscanStopIndex;

            var renderedCells = [], renderedKeys = [];

            for (var rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
                var rowDatum = this._rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex);

                for (var columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
                    var key = [rowIndex, columnIndex];
                    var columnDatum = this._columnSizeAndPositionManager.getSizeAndPositionOfCell(columnIndex);

                    var index = BI.deepIndexOf(this.renderedKeys, key);
                    if (index > -1) {
                        if (columnDatum.size !== this.renderedCells[index]._width) {
                            this.renderedCells[index]._width = columnDatum.size;
                            this.renderedCells[index].el.setWidth(columnDatum.size);
                        }
                        if (rowDatum.size !== this.renderedCells[index]._height) {
                            this.renderedCells[index]._height = rowDatum.size;
                            this.renderedCells[index].el.setHeight(rowDatum.size);
                        }
                        if (this.renderedCells[index].left !== columnDatum.offset + horizontalOffsetAdjustment) {
                            this.renderedCells[index].el.element.css("left", (columnDatum.offset + horizontalOffsetAdjustment) + "px");
                        }
                        if (this.renderedCells[index].top !== rowDatum.offset + verticalOffsetAdjustment) {
                            this.renderedCells[index].el.element.css("top", (rowDatum.offset + verticalOffsetAdjustment) + "px");
                        }
                        renderedCells.push(this.renderedCells[index]);
                    } else {
                        var child = BI.createWidget(BI.extend({
                            type: "bi.label",
                            width: columnDatum.size,
                            height: rowDatum.size
                        }, o.items[rowIndex][columnIndex], {
                            cls: (o.items[rowIndex][columnIndex].cls || "") + " grid-cell" + (rowIndex === 0 ? " first-row" : "") + (columnIndex === 0 ? " first-col" : ""),
                            _rowIndex: rowIndex,
                            _columnIndex: columnIndex,
                            _left: columnDatum.offset + horizontalOffsetAdjustment,
                            _top: rowDatum.offset + verticalOffsetAdjustment
                        }));
                        renderedCells.push({
                            el: child,
                            left: columnDatum.offset + horizontalOffsetAdjustment,
                            top: rowDatum.offset + verticalOffsetAdjustment,
                            _width: columnDatum.size,
                            _height: rowDatum.size
                        });
                    }
                    renderedKeys.push(key);
                }
            }
            //已存在的， 需要添加的和需要删除的
            var existSet = {}, addSet = {}, deleteArray = [];
            BI.each(renderedKeys, function (i, key) {
                if (BI.deepContains(self.renderedKeys, key)) {
                    existSet[i] = key;
                } else {
                    addSet[i] = key;
                }
            });
            BI.each(this.renderedKeys, function (i, key) {
                if (BI.deepContains(existSet, key)) {
                    return;
                }
                if (BI.deepContains(addSet, key)) {
                    return;
                }
                deleteArray.push(i);
            });
            BI.each(deleteArray, function (i, index) {
                self.renderedCells[index].el.destroy();
            });
            var addedItems = [];
            BI.each(addSet, function (index) {
                addedItems.push(renderedCells[index])
            });
            BI.createWidget({
                type: "bi.absolute",
                element: this.container,
                items: addedItems
            });
            this.renderedCells = renderedCells;
            this.renderedKeys = renderedKeys;
        }
    },

    _getMaxScrollLeft: function () {
        return Math.max(0, this._columnSizeAndPositionManager.getTotalSize() - this.options.width + (this.options.overflowX ? BI.DOM.getScrollWidth() : 0));
    },

    _getMaxScrollTop: function () {
        return Math.max(0, this._rowSizeAndPositionManager.getTotalSize() - this.options.height + (this.options.overflowY ? BI.DOM.getScrollWidth() : 0));
    },

    _populate: function () {
        var self = this, o = this.options;
        if (o.items.length > 0) {
            this.columnCount = o.items[0].length;
            this.rowCount = o.items.length;
            this.container.setWidth(this.columnCount * o.estimatedColumnSize);
            this.container.setHeight(this.rowCount * o.estimatedRowSize);

            this._columnSizeAndPositionManager = new BI.ScalingCellSizeAndPositionManager(this.columnCount, o.columnWidthGetter, o.estimatedColumnSize);
            this._rowSizeAndPositionManager = new BI.ScalingCellSizeAndPositionManager(this.rowCount, o.rowHeightGetter, o.estimatedRowSize);

            this._calculateChildrenToRender();
            this.element.scrollTop(o.scrollTop);
            this.element.scrollLeft(o.scrollLeft);
        }
    },

    setScrollLeft: function (scrollLeft) {
        if (this.options.scrollLeft === scrollLeft) {
            return;
        }
        this._scrollLock = true;
        this.options.scrollLeft = BI.clamp(scrollLeft || 0, 0, this._getMaxScrollLeft());
        this.element.scrollLeft(this.options.scrollLeft);
        this._debounceRelease();
        this._calculateChildrenToRender();
    },

    setScrollTop: function (scrollTop) {
        if (this.options.scrollTop === scrollTop) {
            return;
        }
        this._scrollLock = true;
        this.options.scrollTop = BI.clamp(scrollTop || 0, 0, this._getMaxScrollTop());
        this.element.scrollTop(this.options.scrollTop);
        this._debounceRelease();
        this._calculateChildrenToRender();
    },

    setOverflowX: function (b) {
        var self = this;
        if (this.options.overflowX !== !!b) {
            this.options.overflowX = !!b;
            BI.nextTick(function () {
                self.element.css({overflowX: !!b ? "auto" : "hidden"});
            });
        }
    },

    setOverflowY: function (b) {
        var self = this;
        if (this.options.overflowY !== !!b) {
            this.options.overflowY = !!b;
            BI.nextTick(function () {
                self.element.css({overflowY: !!b ? "auto" : "hidden"});
            });
        }
    },

    getScrollLeft: function () {
        return this.options.scrollLeft;
    },

    getScrollTop: function () {
        return this.options.scrollTop;
    },

    getMaxScrollLeft: function () {
        return this._getMaxScrollLeft();
    },

    getMaxScrollTop: function () {
        return this._getMaxScrollTop();
    },

    setEstimatedColumnSize: function (width) {
        this.options.estimatedColumnSize = width;
    },

    setEstimatedRowSize: function (height) {
        this.options.estimatedRowSize = height;
    },

    restore: function () {
        BI.each(this.renderedCells, function (i, cell) {
            cell.el.destroy();
        });
        this.renderedCells = [];
        this.renderedKeys = [];
        this._scrollLock = false;
    },

    populate: function (items) {
        if (items && items !== this.options.items) {
            this.options.items = items;
            this.restore();
        }
        this._populate();
    }
});
BI.Grid.EVENT_SCROLL = "EVENT_SCROLL";
$.shortcut('bi.grid_view', BI.Grid);