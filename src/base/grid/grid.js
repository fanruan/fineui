/**
 * GridView
 *
 * Created by GUY on 2016/1/11.
 * @class BI.GridView
 * @extends BI.Widget
 */
BI.GridView = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.GridView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-grid-view",
            // width: 400, //必设
            // height: 300, //必设
            scrollable: true,
            scrollx: false,
            scrolly: false,
            overflowX: true,
            overflowY: true,
            overscanColumnCount: 0,
            overscanRowCount: 0,
            rowHeightGetter: BI.emptyFn, // number类型或function类型
            columnWidthGetter: BI.emptyFn, // number类型或function类型
            // estimatedColumnSize: 100, //columnWidthGetter为function时必设
            // estimatedRowSize: 30, //rowHeightGetter为function时必设
            scrollLeft: 0,
            scrollTop: 0,
            items: [],
            itemFormatter: function (item, row, col) {
                return item;
            }
        });
    },

    render: function () {
        var self = this, o = this.options;
        this.renderedCells = [];
        this.renderedKeys = [];
        this.renderRange = {};
        this._scrollLock = false;
        this._debounceRelease = BI.debounce(function () {
            self._scrollLock = false;
        }, 1000 / 60);
        this.container = BI._lazyCreateWidget({
            type: "bi.absolute"
        });
        this.element.scroll(function () {
            if (self._scrollLock === true) {
                return;
            }
            o.scrollLeft = self.element.scrollLeft();
            o.scrollTop = self.element.scrollTop();
            self._calculateChildrenToRender();
            self.fireEvent(BI.GridView.EVENT_SCROLL, {
                scrollLeft: o.scrollLeft,
                scrollTop: o.scrollTop
            });
        });
        // 兼容一下
        var scrollable = o.scrollable, scrollx = o.scrollx, scrolly = o.scrolly;
        if (o.overflowX === false) {
            if (o.overflowY === false) {
                scrollable = false;
            } else {
                scrollable = "y"
            }
        } else {
            if (o.overflowY === false) {
                scrollable = "x";
            }
        }
        BI._lazyCreateWidget({
            type: "bi.vertical",
            element: this,
            scrollable: scrollable,
            scrolly: scrolly,
            scrollx: scrollx,
            items: [this.container]
        });
        o.items = BI.isFunction(o.items) ? this.__watch(o.items, function (context, newValue) {
            self.populate(newValue);
        }) : o.items;
        if (o.items.length > 0) {
            this._calculateSizeAndPositionData();
            this._populate();
        }
    },

    // mounted之后绑定事件
    mounted: function () {
        var o = this.options;
        if (o.scrollLeft !== 0 || o.scrollTop !== 0) {
            this.element.scrollTop(o.scrollTop);
            this.element.scrollLeft(o.scrollLeft);
        }
    },

    _calculateSizeAndPositionData: function () {
        var o = this.options;
        this.rowCount = 0;
        this.columnCount = 0;
        if (BI.isNumber(o.columnCount)) {
            this.columnCount = o.columnCount;
        } else if (o.items.length > 0) {
            this.columnCount = o.items[0].length;
        }
        if (BI.isNumber(o.rowCount)) {
            this.rowCount = o.rowCount;
        } else {
            this.rowCount = o.items.length;
        }
        this._columnSizeAndPositionManager = new BI.ScalingCellSizeAndPositionManager(this.columnCount, o.columnWidthGetter, o.estimatedColumnSize);
        this._rowSizeAndPositionManager = new BI.ScalingCellSizeAndPositionManager(this.rowCount, o.rowHeightGetter, o.estimatedRowSize);
    },

    _getOverscanIndices: function (cellCount, overscanCellsCount, startIndex, stopIndex) {
        return {
            overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
            overscanStopIndex: Math.min(cellCount - 1, stopIndex + overscanCellsCount)
        };
    },

    _calculateChildrenToRender: function () {
        var self = this, o = this.options;

        var width = o.width, height = o.height, scrollLeft = BI.clamp(o.scrollLeft, 0, this._getMaxScrollLeft()),
            scrollTop = BI.clamp(o.scrollTop, 0, this._getMaxScrollTop()),
            overscanColumnCount = o.overscanColumnCount, overscanRowCount = o.overscanRowCount;

        if (height > 0 && width > 0) {
            var visibleColumnIndices = this._columnSizeAndPositionManager.getVisibleCellRange(width, scrollLeft);
            var visibleRowIndices = this._rowSizeAndPositionManager.getVisibleCellRange(height, scrollTop);

            if (BI.isEmpty(visibleColumnIndices) || BI.isEmpty(visibleRowIndices)) {
                return;
            }
            var horizontalOffsetAdjustment = this._columnSizeAndPositionManager.getOffsetAdjustment(width, scrollLeft);
            var verticalOffsetAdjustment = this._rowSizeAndPositionManager.getOffsetAdjustment(height, scrollTop);

            this._renderedColumnStartIndex = visibleColumnIndices.start;
            this._renderedColumnStopIndex = visibleColumnIndices.stop;
            this._renderedRowStartIndex = visibleRowIndices.start;
            this._renderedRowStopIndex = visibleRowIndices.stop;

            var overscanColumnIndices = this._getOverscanIndices(this.columnCount, overscanColumnCount, this._renderedColumnStartIndex, this._renderedColumnStopIndex);

            var overscanRowIndices = this._getOverscanIndices(this.rowCount, overscanRowCount, this._renderedRowStartIndex, this._renderedRowStopIndex);

            var columnStartIndex = overscanColumnIndices.overscanStartIndex;
            var columnStopIndex = overscanColumnIndices.overscanStopIndex;
            var rowStartIndex = overscanRowIndices.overscanStartIndex;
            var rowStopIndex = overscanRowIndices.overscanStopIndex;

            // 算区间size
            var minRowDatum = this._rowSizeAndPositionManager.getSizeAndPositionOfCell(rowStartIndex);
            var minColumnDatum = this._columnSizeAndPositionManager.getSizeAndPositionOfCell(columnStartIndex);
            var maxRowDatum = this._rowSizeAndPositionManager.getSizeAndPositionOfCell(rowStopIndex);
            var maxColumnDatum = this._columnSizeAndPositionManager.getSizeAndPositionOfCell(columnStopIndex);
            var top = minRowDatum.offset + verticalOffsetAdjustment;
            var left = minColumnDatum.offset + horizontalOffsetAdjustment;
            var bottom = maxRowDatum.offset + verticalOffsetAdjustment + maxRowDatum.size;
            var right = maxColumnDatum.offset + horizontalOffsetAdjustment + maxColumnDatum.size;
            // 如果滚动的区间并没有超出渲染的范围
            if (top >= this.renderRange.minY && bottom <= this.renderRange.maxY && left >= this.renderRange.minX && right <= this.renderRange.maxX) {
                return;
            }

            var renderedCells = [], renderedKeys = {}, renderedWidgets = {};
            var minX = this._getMaxScrollLeft(), minY = this._getMaxScrollTop(), maxX = 0, maxY = 0;
            var count = 0;
            for (var rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
                var rowDatum = this._rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex);

                for (var columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
                    var key = rowIndex + "-" + columnIndex;
                    var columnDatum = this._columnSizeAndPositionManager.getSizeAndPositionOfCell(columnIndex);

                    var index = this.renderedKeys[key] && this.renderedKeys[key][2];
                    var child;
                    if (index >= 0) {
                        // if (columnDatum.size !== this.renderedCells[index]._width) {
                        // this.renderedCells[index]._width = columnDatum.size;
                        this.renderedCells[index].el.setWidth(columnDatum.size);
                        // }
                        // if (rowDatum.size !== this.renderedCells[index]._height) {
                        // this.renderedCells[index]._height = rowDatum.size;
                        this.renderedCells[index].el.setHeight(rowDatum.size);
                        // }
                        // if (this.renderedCells[index]._left !== columnDatum.offset + horizontalOffsetAdjustment) {
                        this.renderedCells[index].el.element.css("left", (columnDatum.offset + horizontalOffsetAdjustment) / BI.pixRatio + BI.pixUnit);
                        // }
                        // if (this.renderedCells[index]._top !== rowDatum.offset + verticalOffsetAdjustment) {
                        this.renderedCells[index].el.element.css("top", (rowDatum.offset + verticalOffsetAdjustment) / BI.pixRatio + BI.pixUnit);
                        // }
                        child = this.renderedCells[index].el;
                        renderedCells.push(this.renderedCells[index]);
                    } else {
                        var item = o.itemFormatter(o.items[rowIndex][columnIndex], rowIndex, columnIndex);
                        child = BI._lazyCreateWidget(BI.extend({
                            type: "bi.label",
                            width: columnDatum.size,
                            height: rowDatum.size
                        }, item, {
                            cls: (item.cls || "") + " grid-cell" + (rowIndex === 0 ? " first-row" : "") + (columnIndex === 0 ? " first-col" : ""),
                            _rowIndex: rowIndex,
                            _columnIndex: columnIndex,
                            _left: columnDatum.offset + horizontalOffsetAdjustment,
                            _top: rowDatum.offset + verticalOffsetAdjustment
                        }), this);
                        renderedCells.push({
                            el: child,
                            left: columnDatum.offset + horizontalOffsetAdjustment,
                            top: rowDatum.offset + verticalOffsetAdjustment,
                            _left: columnDatum.offset + horizontalOffsetAdjustment,
                            _top: rowDatum.offset + verticalOffsetAdjustment
                            // _width: columnDatum.size,
                            // _height: rowDatum.size
                        });
                    }
                    minX = Math.min(minX, columnDatum.offset + horizontalOffsetAdjustment);
                    maxX = Math.max(maxX, columnDatum.offset + horizontalOffsetAdjustment + columnDatum.size);
                    minY = Math.min(minY, rowDatum.offset + verticalOffsetAdjustment);
                    maxY = Math.max(maxY, rowDatum.offset + verticalOffsetAdjustment + rowDatum.size);
                    renderedKeys[key] = [rowIndex, columnIndex, count];
                    renderedWidgets[count] = child;
                    count++;
                }
            }
            // 已存在的， 需要添加的和需要删除的
            var existSet = {}, addSet = {}, deleteArray = [];
            BI.each(renderedKeys, function (i, key) {
                if (self.renderedKeys[i]) {
                    existSet[i] = key;
                } else {
                    addSet[i] = key;
                }
            });
            BI.each(this.renderedKeys, function (i, key) {
                if (existSet[i]) {
                    return;
                }
                if (addSet[i]) {
                    return;
                }
                deleteArray.push(key[2]);
            });
            BI.each(deleteArray, function (i, index) {
                // 性能优化，不调用destroy方法防止触发destroy事件
                self.renderedCells[index].el._destroy();
            });
            var addedItems = [];
            BI.each(addSet, function (index, key) {
                addedItems.push(renderedCells[key[2]]);
            });
            // 与listview一样, 给上下文
            this.container.addItems(addedItems, this);
            // 拦截父子级关系
            this.container._children = renderedWidgets;
            this.container.attr("items", renderedCells);
            this.renderedCells = renderedCells;
            this.renderedKeys = renderedKeys;
            this.renderRange = {minX: minX, minY: minY, maxX: maxX, maxY: maxY};
        }
    },

    _getMaxScrollLeft: function () {
        return Math.max(0, this._getContainerWidth() - this.options.width + (this.options.overflowX ? BI.DOM.getScrollWidth() : 0));
    },

    _getMaxScrollTop: function () {
        return Math.max(0, this._getContainerHeight() - this.options.height + (this.options.overflowY ? BI.DOM.getScrollWidth() : 0));
    },

    _getContainerWidth: function () {
        return this.columnCount * this.options.estimatedColumnSize;
    },

    _getContainerHeight: function () {
        return this.rowCount * this.options.estimatedRowSize;
    },

    _populate: function (items) {
        var self = this, o = this.options;
        this._reRange();
        if (items && items !== this.options.items) {
            this.options.items = items;
            this._calculateSizeAndPositionData();
        }
        this.container.setWidth(this._getContainerWidth());
        this.container.setHeight(this._getContainerHeight());

        // 元素未挂载时不能设置scrollTop
        this._debounceRelease();
        try {
            this.element.scrollTop(o.scrollTop);
            this.element.scrollLeft(o.scrollLeft);
        } catch (e) {
        }
        this._calculateChildrenToRender();
    },

    setScrollLeft: function (scrollLeft) {
        if (this.options.scrollLeft === scrollLeft) {
            return;
        }
        this._scrollLock = true;
        this.options.scrollLeft = BI.clamp(scrollLeft || 0, 0, this._getMaxScrollLeft());
        this._debounceRelease();
        this.element.scrollLeft(this.options.scrollLeft);
        this._calculateChildrenToRender();
    },

    setScrollTop: function (scrollTop) {
        if (this.options.scrollTop === scrollTop) {
            return;
        }
        this._scrollLock = true;
        this.options.scrollTop = BI.clamp(scrollTop || 0, 0, this._getMaxScrollTop());
        this._debounceRelease();
        this.element.scrollTop(this.options.scrollTop);
        this._calculateChildrenToRender();
    },

    setColumnCount: function (columnCount) {
        this.options.columnCount = columnCount;
    },

    setRowCount: function (rowCount) {
        this.options.rowCount = rowCount;
    },

    setOverflowX: function (b) {
        var self = this;
        if (this.options.overflowX !== !!b) {
            this.options.overflowX = !!b;
            BI.nextTick(function () {
                self.element.css({overflowX: b ? "auto" : "hidden"});
            });
        }
    },

    setOverflowY: function (b) {
        var self = this;
        if (this.options.overflowY !== !!b) {
            this.options.overflowY = !!b;
            BI.nextTick(function () {
                self.element.css({overflowY: b ? "auto" : "hidden"});
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

    // 重新计算children
    _reRange: function () {
        this.renderRange = {};
    },

    _clearChildren: function () {
        this.container._children = {};
        this.container.attr("items", []);
    },

    restore: function () {
        BI.each(this.renderedCells, function (i, cell) {
            cell.el._destroy();
        });
        this._clearChildren();
        this.renderedCells = [];
        this.renderedKeys = [];
        this.renderRange = {};
        this._scrollLock = false;
    },

    populate: function (items) {
        if (items && items !== this.options.items) {
            this.restore();
        }
        this._populate(items);
    }
});
BI.GridView.EVENT_SCROLL = "EVENT_SCROLL";
BI.shortcut("bi.grid_view", BI.GridView);
