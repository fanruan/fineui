/**
 * CollectionView
 *
 * Created by GUY on 2016/1/15.
 * @class BI.CollectionView
 * @extends BI.Widget
 */
BI.CollectionView = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.CollectionView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-collection",
            // width: 400, //必设
            // height: 300, //必设
            overflowX: true,
            overflowY: true,
            cellSizeAndPositionGetter: BI.emptyFn,
            horizontalOverscanSize: 0,
            verticalOverscanSize: 0,
            scrollLeft: 0,
            scrollTop: 0,
            items: []
        });
    },

    _init: function () {
        BI.CollectionView.superclass._init.apply(this, arguments);
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
            self.fireEvent(BI.CollectionView.EVENT_SCROLL, {
                scrollLeft: o.scrollLeft,
                scrollTop: o.scrollTop
            });
        });
        BI._lazyCreateWidget({
            type: "bi.vertical",
            element: this,
            scrollable: o.overflowX === true && o.overflowY === true,
            scrolly: o.overflowX === false && o.overflowY === true,
            scrollx: o.overflowX === true && o.overflowY === false,
            items: [this.container]
        });
        if (o.items.length > 0) {
            this._calculateSizeAndPositionData();
            this._populate();
        }
    },

    // mounted之后绑定事件
    mounted: function () {
        var  o = this.options;
        if (o.scrollLeft !== 0 || o.scrollTop !== 0) {
            this.element.scrollTop(o.scrollTop);
            this.element.scrollLeft(o.scrollLeft);
        }
    },

    _calculateSizeAndPositionData: function () {
        var o = this.options;
        var cellMetadata = [];
        var sectionManager = new BI.SectionManager();
        var height = 0;
        var width = 0;

        for (var index = 0, len = o.items.length; index < len; index++) {
            var cellMetadatum = o.cellSizeAndPositionGetter(index);

            if (cellMetadatum.height == null || isNaN(cellMetadatum.height) ||
                cellMetadatum.width == null || isNaN(cellMetadatum.width) ||
                cellMetadatum.x == null || isNaN(cellMetadatum.x) ||
                cellMetadatum.y == null || isNaN(cellMetadatum.y)) {
                throw Error();
            }

            height = Math.max(height, cellMetadatum.y + cellMetadatum.height);
            width = Math.max(width, cellMetadatum.x + cellMetadatum.width);

            cellMetadatum.index = index;
            cellMetadata[index] = cellMetadatum;
            sectionManager.registerCell(cellMetadatum, index);
        }

        this._cellMetadata = cellMetadata;
        this._sectionManager = sectionManager;
        this._height = height;
        this._width = width;
    },

    _cellRenderers: function (height, width, x, y) {
        this._lastRenderedCellIndices = this._sectionManager.getCellIndices(height, width, x, y);
        return this._cellGroupRenderer();
    },

    _cellGroupRenderer: function () {
        var self = this, o = this.options;
        var rendered = [];
        BI.each(this._lastRenderedCellIndices, function (i, index) {
            var cellMetadata = self._sectionManager.getCellMetadata(index);
            rendered.push(cellMetadata);
        });
        return rendered;
    },

    _calculateChildrenToRender: function () {
        var self = this, o = this.options;
        var scrollLeft = BI.clamp(o.scrollLeft, 0, this._getMaxScrollLeft());
        var scrollTop = BI.clamp(o.scrollTop, 0, this._getMaxScrollTop());
        var left = Math.max(0, scrollLeft - o.horizontalOverscanSize);
        var top = Math.max(0, scrollTop - o.verticalOverscanSize);
        var right = Math.min(this._width, scrollLeft + o.width + o.horizontalOverscanSize);
        var bottom = Math.min(this._height, scrollTop + o.height + o.verticalOverscanSize);
        if (right > 0 && bottom > 0) {
            // 如果滚动的区间并没有超出渲染的范围
            if (top >= this.renderRange.minY && bottom <= this.renderRange.maxY && left >= this.renderRange.minX && right <= this.renderRange.maxX) {
                return;
            }
            var childrenToDisplay = this._cellRenderers(bottom - top, right - left, left, top);
            var renderedCells = [], renderedKeys = {}, renderedWidgets = {};
            // 存储所有的left和top
            var lefts = {}, tops = {};
            for (var i = 0, len = childrenToDisplay.length; i < len; i++) {
                var datum = childrenToDisplay[i];
                lefts[datum.x] = datum.x;
                lefts[datum.x + datum.width] = datum.x + datum.width;
                tops[datum.y] = datum.y;
                tops[datum.y + datum.height] = datum.y + datum.height;
            }
            lefts = BI.toArray(lefts);
            tops = BI.toArray(tops);
            var leftMap = BI.invert(lefts);
            var topMap = BI.invert(tops);
            // 存储上下左右四个边界
            var leftBorder = {}, rightBorder = {}, topBorder = {}, bottomBorder = {};
            var assertMinBorder = function (border, offset) {
                if (border[offset] == null) {
                    border[offset] = Number.MAX_VALUE;
                }
            };
            var assertMaxBorder = function (border, offset) {
                if (border[offset] == null) {
                    border[offset] = 0;
                }
            };
            var lastDatum = BI.last(BI.sortBy(this._sectionManager.getAllCellMetadata(), function (index, child) {
                return (child.x + child.width + child.y + child.height);
            }));
            for (var i = 0, len = childrenToDisplay.length; i < len; i++) {
                var datum = childrenToDisplay[i];
                var index = this.renderedKeys[datum.index] && this.renderedKeys[datum.index][1];
                var child;
                if (index >= 0) {
                    if (datum.width !== this.renderedCells[index]._width) {
                        this.renderedCells[index]._width = datum.width;
                        this.renderedCells[index].el.setWidth(datum.width);
                    }
                    if (datum.height !== this.renderedCells[index]._height) {
                        this.renderedCells[index]._height = datum.height;
                        this.renderedCells[index].el.setHeight(datum.height);
                    }
                    if (this.renderedCells[index]._left !== datum.x) {
                        this.renderedCells[index].el.element.css("left", datum.x / BI.pixRatio + BI.pixUnit);
                    }
                    if (this.renderedCells[index]._top !== datum.y) {
                        this.renderedCells[index].el.element.css("top", datum.y  / BI.pixRatio + BI.pixUnit);
                    }
                    renderedCells.push(child = this.renderedCells[index]);
                } else {
                    child = BI._lazyCreateWidget(BI.extend({
                        type: "bi.label",
                        width: datum.width,
                        height: datum.height
                    }, o.items[datum.index], {
                        cls: (o.items[datum.index].cls || "") + " collection-cell" + (datum.y === 0 ? " first-row" : "") + (datum.x === 0 ? " first-col" : "") + ((datum.height + datum.y) === (lastDatum.height + lastDatum.y) ? " last-row" : "") + ((datum.width + datum.x) === (lastDatum.width + lastDatum.x) ? " last-col" : ""),
                        _left: datum.x,
                        _top: datum.y
                    }));
                    renderedCells.push({
                        el: child,
                        left: datum.x,
                        top: datum.y,
                        _left: datum.x,
                        _top: datum.y,
                        _width: datum.width,
                        _height: datum.height
                    });
                }
                var startTopIndex = topMap[datum.y] | 0;
                var endTopIndex = topMap[datum.y + datum.height] | 0;
                for (var k = startTopIndex; k <= endTopIndex; k++) {
                    var t = tops[k];
                    assertMinBorder(leftBorder, t);
                    assertMaxBorder(rightBorder, t);
                    leftBorder[t] = Math.min(leftBorder[t], datum.x);
                    rightBorder[t] = Math.max(rightBorder[t], datum.x + datum.width);
                }
                var startLeftIndex = leftMap[datum.x] | 0;
                var endLeftIndex = leftMap[datum.x + datum.width] | 0;
                for (var k = startLeftIndex; k <= endLeftIndex; k++) {
                    var l = lefts[k];
                    assertMinBorder(topBorder, l);
                    assertMaxBorder(bottomBorder, l);
                    topBorder[l] = Math.min(topBorder[l], datum.y);
                    bottomBorder[l] = Math.max(bottomBorder[l], datum.y + datum.height);
                }

                renderedKeys[datum.index] = [datum.index, i];
                renderedWidgets[i] = child;
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
                deleteArray.push(key[1]);
            });
            BI.each(deleteArray, function (i, index) {
                // 性能优化，不调用destroy方法防止触发destroy事件
                self.renderedCells[index].el._destroy();
            });
            var addedItems = [];
            BI.each(addSet, function (index, key) {
                addedItems.push(renderedCells[key[1]]);
            });
            this.container.addItems(addedItems);
            // 拦截父子级关系
            this.container._children = renderedWidgets;
            this.container.attr("items", renderedCells);
            this.renderedCells = renderedCells;
            this.renderedKeys = renderedKeys;

            // Todo 左右比较特殊
            var minX = BI.min(leftBorder);
            var maxX = BI.max(rightBorder);

            var minY = BI.max(topBorder);
            var maxY = BI.min(bottomBorder);

            this.renderRange = {minX: minX, minY: minY, maxX: maxX, maxY: maxY};
        }
    },

    _getMaxScrollLeft: function () {
        return Math.max(0, this._width - this.options.width + (this.options.overflowX ? BI.DOM.getScrollWidth() : 0));
    },

    _getMaxScrollTop: function () {
        return Math.max(0, this._height - this.options.height + (this.options.overflowY ? BI.DOM.getScrollWidth() : 0));
    },

    _populate: function (items) {
        var o = this.options;
        this._reRange();
        if (items && items !== this.options.items) {
            this.options.items = items;
            this._calculateSizeAndPositionData();
        }
        if (o.items.length > 0) {
            this.container.setWidth(this._width);
            this.container.setHeight(this._height);

            this._calculateChildrenToRender();
            // 元素未挂载时不能设置scrollTop
            try {
                this.element.scrollTop(o.scrollTop);
                this.element.scrollLeft(o.scrollLeft);
            } catch (e) {
            }
        }
    },

    setScrollLeft: function (scrollLeft) {
        if (this.options.scrollLeft === scrollLeft) {
            return;
        }
        this._scrollLock = true;
        this.options.scrollLeft = BI.clamp(scrollLeft || 0, 0, this._getMaxScrollLeft());
        this._debounceRelease();
        this._calculateChildrenToRender();
        this.element.scrollLeft(this.options.scrollLeft);
    },

    setScrollTop: function (scrollTop) {
        if (this.options.scrollTop === scrollTop) {
            return;
        }
        this._scrollLock = true;
        this.options.scrollTop = BI.clamp(scrollTop || 0, 0, this._getMaxScrollTop());
        this._debounceRelease();
        this._calculateChildrenToRender();
        this.element.scrollTop(this.options.scrollTop);
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
BI.CollectionView.EVENT_SCROLL = "EVENT_SCROLL";
BI.shortcut("bi.collection_view", BI.CollectionView);
