/**
 * Collection
 *
 * Created by GUY on 2016/1/15.
 * @class BI.Collection
 * @extends BI.Widget
 */
BI.Collection = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.Collection.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-collection",
            width: 400,
            height: 300,
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
        BI.Collection.superclass._init.apply(this, arguments);
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
            self.fireEvent(BI.Collection.EVENT_SCROLL, {
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
            this._calculateSizeAndPositionData();
            this._populate();
        }
        if (o.scrollLeft !== 0 || o.scrollTop !== 0) {
            BI.nextTick(function () {
                self.element.scrollTop(o.scrollTop);
                self.element.scrollLeft(o.scrollLeft);
            });
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

            if (
                cellMetadatum.height == null || isNaN(cellMetadatum.height) ||
                cellMetadatum.width == null || isNaN(cellMetadatum.width) ||
                cellMetadatum.x == null || isNaN(cellMetadatum.x) ||
                cellMetadatum.y == null || isNaN(cellMetadatum.y)
            ) {
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
        return this._cellGroupRenderer()
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
        var childrenToDisplay = this._cellRenderers(bottom - top, right - left, left, top);
        var renderedCells = [], renderedKeys = [];
        for (var i = 0, len = childrenToDisplay.length; i < len; i++) {
            var datum = childrenToDisplay[i];
            var index = BI.deepIndexOf(this.renderedKeys, datum.index);
            if (index > -1) {
                if (datum.width !== this.renderedCells[index]._width) {
                    this.renderedCells[index]._width = datum.width;
                    this.renderedCells[index].el.setWidth(datum.width);
                }
                if (datum.height !== this.renderedCells[index]._height) {
                    this.renderedCells[index]._height = datum.height;
                    this.renderedCells[index].el.setHeight(datum.height);
                }
                if (this.renderedCells[index].left !== datum.x) {
                    this.renderedCells[index].el.element.css("left", datum.x + "px");
                }
                if (this.renderedCells[index].top !== datum.y) {
                    this.renderedCells[index].el.element.css("top", datum.y + "px");
                }
                renderedCells.push(this.renderedCells[index]);
            } else {
                var child = BI.createWidget(BI.extend({
                    type: "bi.label",
                    width: datum.width,
                    height: datum.height
                }, o.items[datum.index], {
                    cls: (o.items[datum.index].cls || "") + " container-cell" + (datum.y === 0 ? " first-row" : "") + (datum.x === 0 ? " first-col" : ""),
                    _left: datum.x,
                    _top: datum.y
                }));
                renderedCells.push({
                    el: child,
                    left: datum.x,
                    top: datum.y,
                    _width: datum.width,
                    _height: datum.height
                });
            }
            renderedKeys.push(datum.index);
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
    },

    _getMaxScrollLeft: function () {
        return Math.max(0, this._width - this.options.width + (this.options.overflowX ? BI.DOM.getScrollWidth() : 0));
    },

    _getMaxScrollTop: function () {
        return Math.max(0, this._height - this.options.height + (this.options.overflowY ? BI.DOM.getScrollWidth() : 0));
    },

    _populate: function () {
        var o = this.options;
        if (o.items.length > 0) {
            this.container.setWidth(this._width);
            this.container.setHeight(this._height);

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
            this._calculateSizeAndPositionData();
        }
        this._populate();
    }
});
BI.Collection.EVENT_SCROLL = "EVENT_SCROLL";
$.shortcut('bi.collection_view', BI.Collection);