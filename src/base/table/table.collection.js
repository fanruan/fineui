/**
 * CollectionTable
 *
 * Created by GUY on 2016/1/12.
 * @class BI.CollectionTable
 * @extends BI.Widget
 */
BI.CollectionTable = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.CollectionTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-collection-table",
            headerRowSize: 25,
            rowSize: 25,
            columnSize: [],
            isNeedFreeze: false,
            freezeCols: [],
            isNeedMerge: false,
            mergeCols: [],
            mergeRule: BI.emptyFn,
            header: [],
            items: [],
            regionColumnSize: []
        });
    },

    _init: function () {
        BI.CollectionTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this._width = 0;
        this._height = 0;
        this._scrollBarSize = BI.DOM.getScrollWidth();
        this.topLeftCollection = BI.createWidget({
            type: "bi.collection_view",
            cellSizeAndPositionGetter: function (index) {
                return self.topLeftItems[index];
            }
        });
        this.topLeftCollection.on(BI.Collection.EVENT_SCROLL, function (scroll) {
            self.bottomLeftCollection.setScrollLeft(scroll.scrollLeft);
            self._populateScrollbar();
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.topRightCollection = BI.createWidget({
            type: "bi.collection_view",
            cellSizeAndPositionGetter: function (index) {
                return self.topRightItems[index];
            }
        });
        this.topRightCollection.on(BI.Collection.EVENT_SCROLL, function (scroll) {
            self.bottomRightCollection.setScrollLeft(scroll.scrollLeft);
            self._populateScrollbar();
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.bottomLeftCollection = BI.createWidget({
            type: "bi.collection_view",
            cellSizeAndPositionGetter: function (index) {
                return self.bottomLeftItems[index];
            }
        });
        this.bottomLeftCollection.on(BI.Collection.EVENT_SCROLL, function (scroll) {
            self.bottomRightCollection.setScrollTop(scroll.scrollTop);
            self.topLeftCollection.setScrollLeft(scroll.scrollLeft);
            self._populateScrollbar();
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.bottomRightCollection = BI.createWidget({
            type: "bi.collection_view",
            cellSizeAndPositionGetter: function (index) {
                return self.bottomRightItems[index];
            }
        });
        this.bottomRightCollection.on(BI.Collection.EVENT_SCROLL, function (scroll) {
            self.bottomLeftCollection.setScrollTop(scroll.scrollTop);
            self.topRightCollection.setScrollLeft(scroll.scrollLeft);
            self._populateScrollbar();
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.topLeft = BI.createWidget({
            type: "bi.vertical",
            scrollable: false,
            scrolly: false,
            items: [this.topLeftCollection]
        });
        this.topRight = BI.createWidget({
            type: "bi.vertical",
            scrollable: false,
            scrolly: false,
            items: [this.topRightCollection]
        });
        this.bottomLeft = BI.createWidget({
            type: "bi.vertical",
            scrollable: false,
            scrolly: false,
            items: [this.bottomLeftCollection]
        });
        this.bottomRight = BI.createWidget({
            type: "bi.vertical",
            scrollable: false,
            scrolly: false,
            items: [this.bottomRightCollection]
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
            self.bottomLeftCollection.setScrollTop(scrollTop);
            self.bottomRightCollection.setScrollTop(scrollTop);
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.leftScrollbar = BI.createWidget({
            type: "bi.grid_table_horizontal_scrollbar",
            height: BI.GridTableScrollbar.SIZE
        });
        this.leftScrollbar.on(BI.GridTableScrollbar.EVENT_SCROLL, function (scrollLeft) {
            self.topLeftCollection.setScrollLeft(scrollLeft);
            self.bottomLeftCollection.setScrollLeft(scrollLeft);
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.rightScrollbar = BI.createWidget({
            type: "bi.grid_table_horizontal_scrollbar",
            height: BI.GridTableScrollbar.SIZE
        });
        this.rightScrollbar.on(BI.GridTableScrollbar.EVENT_SCROLL, function (scrollLeft) {
            self.topRightCollection.setScrollLeft(scrollLeft);
            self.bottomRightCollection.setScrollLeft(scrollLeft);
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
        if (o.items.length > 0 || o.header.length < 0) {
            this._digest();
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
        this.topScrollbar.setPosition(this.bottomRightCollection.getScrollTop());
        this.topScrollbar.populate();

        this.leftScrollbar.setContentSize(totalLeftColumnSize);
        this.leftScrollbar.setSize(regionSize);
        this.leftScrollbar.setPosition(this.bottomLeftCollection.getScrollLeft());
        this.leftScrollbar.populate();

        this.rightScrollbar.setContentSize(totalRightColumnSize);
        this.rightScrollbar.setSize(this._width - regionSize);
        this.rightScrollbar.setPosition(this.bottomRightCollection.getScrollLeft());
        this.rightScrollbar.populate();

        var items = this.scrollBarLayout.attr("items");
        items[0].top = o.header.length * o.headerRowSize;
        items[1].top = this._height;
        items[2].top = this._height;
        items[2].left = regionSize;
        this.scrollBarLayout.attr("items", items);
        this.scrollBarLayout.resize();
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

        this.topLeftCollection.setWidth(tlw);
        this.topLeftCollection.setHeight(tlh);
        this.topRightCollection.setWidth(trw);
        this.topRightCollection.setHeight(trh);
        this.bottomLeftCollection.setWidth(blw);
        this.bottomLeftCollection.setHeight(blh);
        this.bottomRightCollection.setWidth(brw);
        this.bottomRightCollection.setHeight(brh);

        digest(tlw, tlh, totalLeftColumnSize, o.header.length * o.headerRowSize, this.topLeftCollection);
        digest(trw, trh, totalRightColumnSize, o.header.length * o.headerRowSize, this.topRightCollection);
        digest(blw, blh, totalLeftColumnSize, o.items.length * o.rowSize, this.bottomLeftCollection);
        digest(brw, brh, totalRightColumnSize, o.items.length * o.rowSize, this.bottomRightCollection);

        var items = this.contextLayout.attr("items");
        items[1].left = regionSize;
        items[2].top = o.header.length * o.headerRowSize;
        items[3].left = regionSize;
        items[3].top = o.header.length * o.headerRowSize;
        this.contextLayout.attr("items", items);
        this.contextLayout.resize();

        var leftHeader = [], rightHeader = [], leftItems = [], rightItems = [];
        var run = function (positions, items, rendered) {
            BI.each(positions, function (i, item) {
                var cell = {
                    type: "bi.collection_table_cell",
                    cell: items[item.row][item.col]
                };
                rendered.push(cell);
            });
        };
        run(this.topLeftItems, o.header, leftHeader);
        run(this.topRightItems, o.header, rightHeader);
        run(this.bottomLeftItems, o.items, leftItems);
        run(this.bottomRightItems, o.items, rightItems);

        this.topLeftCollection.populate(leftHeader);
        this.topRightCollection.populate(rightHeader);
        this.bottomLeftCollection.populate(leftItems);
        this.bottomRightCollection.populate(rightItems);
    },

    _digest: function () {
        var o = this.options;
        var freezeColLength = this._getFreezeColLength();
        this.topLeftItems = this._serialize(o.header, 0, freezeColLength, o.headerRowSize, o.columnSize, o.mergeCols);
        this.topRightItems = this._serialize(o.header, freezeColLength, o.columnSize.length, o.headerRowSize, o.columnSize, true);
        this.bottomLeftItems = this._serialize(o.items, 0, freezeColLength, o.rowSize, o.columnSize, o.mergeCols);
        this.bottomRightItems = this._serialize(o.items, freezeColLength, o.columnSize.length, o.rowSize, o.columnSize, o.mergeCols);
    },

    _serialize: function (items, startCol, endCol, rowHeight, columnSize, mergeCols) {
        var self = this, o = this.options;
        var result = [], cache = {}, preCol = {}, preRow = {}, map = {};
        var summaryColumnSize = [];
        for (var i = startCol; i < endCol; i++) {
            if (i === startCol) {
                summaryColumnSize[i] = columnSize[i];
            } else {
                summaryColumnSize[i] = summaryColumnSize[i - 1] + columnSize[i];
            }
        }
        var mergeRow = function (i, j) {
            preCol[j]._height += rowHeight;
            preCol[j].__mergeRows.push(i);
        };

        var mergeCol = function (i, j) {
            preRow[i]._width += columnSize[j];
            preRow[i].__mergeCols.push(j);
        };

        var createOneEl = function (r, c) {
            var width = columnSize[c];
            var height = rowHeight;
            map[r][c]._row = r;
            map[r][c]._col = c;
            map[r][c]._width = width;
            map[r][c]._height = height;
            preCol[c] = map[r][c];
            preCol[c].__mergeRows = [r];
            preRow[r] = map[r][c];
            preRow[r].__mergeCols = [c];

            result.push({
                x: summaryColumnSize[c] - columnSize[c],
                y: +r * rowHeight,
                item: map[r][c]
            });
        };

        BI.each(items, function (i, cols) {
            for (var j = startCol; j < endCol; j++) {
                if (!cache[i]) {
                    cache[i] = {};
                }
                if (!map[i]) {
                    map[i] = {};
                }
                cache[i][j] = cols[j];
                map[i][j] = {};
                if (mergeCols === true || mergeCols.indexOf(j) > -1) {
                    if (i === 0 && j === startCol) {
                        createOneEl(0, startCol);
                    } else if (j === startCol && i > 0) {
                        var isNeedMergeRow = o.mergeRule(cache[i][j], cache[i - 1][j]);
                        if (isNeedMergeRow === true) {
                            mergeRow(i, j);
                            preRow[i] = preCol[j];
                        } else {
                            createOneEl(i, j);
                        }
                    } else if (i === 0 && j > startCol) {
                        var isNeedMergeCol = o.mergeRule(cache[i][j], cache[i][j - 1]);
                        if (isNeedMergeCol === true) {
                            mergeCol(i, j);
                            preCol[j] = preRow[i];
                        } else {
                            createOneEl(i, j);
                        }
                    } else {
                        var isNeedMergeRow = o.mergeRule(cache[i][j], cache[i - 1][j]);
                        var isNeedMergeCol = o.mergeRule(cache[i][j], cache[i][j - 1]);
                        if (isNeedMergeCol && isNeedMergeRow) {
                            continue;
                            //mergeRow(i, j);//优先合并列
                        }
                        if (isNeedMergeCol) {
                            mergeCol(i, j);
                        }
                        if (isNeedMergeRow) {
                            mergeRow(i, j);
                        }
                        if (!isNeedMergeCol && !isNeedMergeRow) {
                            createOneEl(i, j);
                        }
                    }
                } else {
                    createOneEl(i, j);
                }
            }
        });
        return BI.map(result, function (i, item) {
            return {
                x: item.x,
                y: item.y,
                row: item.item._row,
                col: item.item._col,
                width: item.item._width,
                height: item.item._height
            }
        });
    },

    _populate: function () {
        if (this._width <= 0 || this._height <= 0) {
            return;
        }
        if (this._isNeedDigest === true) {
            this._digest();
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
        this.bottomLeftCollection.setScrollTop(scrollTop);
        this.bottomRightCollection.setScrollTop(scrollTop);
    },

    setLeftHorizontalScroll: function (scrollLeft) {
        this.topLeftCollection.setScrollLeft(scrollLeft);
        this.bottomLeftCollection.setScrollLeft(scrollLeft);
    },

    setRightHorizontalScroll: function (scrollLeft) {
        this.topRightCollection.setScrollLeft(scrollLeft);
        this.bottomRightCollection.setScrollLeft(scrollLeft);
    },

    getVerticalScroll: function () {
        return this.bottomRightCollection.getScrollTop();
    },

    getLeftHorizontalScroll: function () {
        return this.bottomLeftCollection.getScrollLeft();
    },

    getRightHorizontalScroll: function () {
        return this.bottomRightCollection.getScrollLeft();
    },

    setWidth: function (width) {
        BI.CollectionTable.superclass.setWidth.apply(this, arguments);
        this._width = this.options.width - BI.GridTableScrollbar.SIZE;
    },

    setHeight: function (height) {
        BI.CollectionTable.superclass.setHeight.apply(this, arguments);
        this._height = this.options.height - BI.GridTableScrollbar.SIZE;
    },

    setColumnSize: function (columnSize) {
        this._isNeedDigest = true;
        this.options.columnSize = columnSize;
    },

    setRegionColumnSize: function (regionColumnSize) {
        this._isNeedDigest = true;
        this.options.regionColumnSize = regionColumnSize;
    },

    getColumnSize: function () {
        return this.options.columnSize;
    },

    getRegionColumnSize: function () {
        return this.options.regionColumnSize;
    },

    populate: function (items, header) {
        if (items && items !== this.options.items) {
            this._isNeedDigest = true;
            this.options.items = items;
            this._restore();
        }
        if (header && header !== this.options.header) {
            this._isNeedDigest = true;
            this.options.header = header;
            this._restore();
        }
        this._populate();
    },

    _restore: function () {
        this.topLeftCollection.restore();
        this.topRightCollection.restore();
        this.bottomLeftCollection.restore();
        this.bottomRightCollection.restore();
    },

    restore: function () {
        this._restore();
    }
});
$.shortcut('bi.collection_table', BI.CollectionTable);