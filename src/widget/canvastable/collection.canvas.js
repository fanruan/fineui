/**
 * Created By Shichao on 2017/10/17
 * @class BI.CanvasCollectionView
 * @extends BI.Widget
 */
BI.CanvasCollectionView = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.CanvasCollectionView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-canvas-collection",
            overflowX: true,
            overflowY: true,
            cellSizeAndPositionGetter: BI.emptyFn,
            horizontalOverscanSize: 0,
            verticalOverscanSize: 0,
            scrollLeft: 0,
            scrollTop: 0,
            items: []
        })
    },

    _init: function () {
        BI.CanvasCollectionView.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.renderedCells = [];
        this.renderedKeys = [];
        this._scrollLock = false;
        this.scrollTop = this.scrollLeft = 0;
        this.summaryScrollTop = this.summaryScrollLeft = 0;
        this._debounceRelease = BI.debounce(function () {
            self._scrollLock = false;
        }, 1000 / 60);
        this.canvas = BI.createWidget({
            type: "bi.canvas_new"
        });
        $(document).keydown(BI.bind(this._onResize, this)); // 防止在使用ctrl + 滚轮调整窗口大小时触发mousewheel事件
        $(document).keyup(BI.bind(this._onResizeRelease, this))
        this.element.mousewheel(BI.bind(this._onMouseWheel, this))
        BI.createWidget({
            type: "bi.vertical",
            element: this,
            scrollable: false,
            scrolly: false,
            scrollx: false,
            items: [this.canvas]
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

    _onMouseWheel: function (e) {
        var o = this.options;
        if (this._scrollLock) {
            return;
        }
        if (!this._isCtrlPressed) {
            o.scrollTop += -e.originalEvent.wheelDelta;
            o.scrollTop = BI.clamp(o.scrollTop, 0, this.maxScrollTop);
            this._calculateChildrenToRender();
            this.fireEvent(BI.CanvasCollectionView.EVENT_SCROLL, {
                scrollLeft: o.scrollLeft,
                scrollTop: o.scrollTop
            });
        }
    },

    _onResize: function (e) {
        if (e.ctrlKey) {
            this._isCtrlPressed = true;
        } else {
            this._isCtrlPressed = false;
        }
    },

    _onResizeRelease: function (e) {
        var Keys = {
            CTRL: 17
        };
        var keyCode = e.keyCode;

        if (keyCode === Keys.CTRL) {
            this._isCtrlPressed = false;
        }
    },

    _getMaxScrollTop: function () {
        return this._height - this.options.height
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
        if (this._height === height && this._width === width) {
            this._isNeedReset = false;
        } else {
            this._height = height;
            this._width = width;
            this._isNeedReset = true;
        }
        this.maxScrollTop = this._getMaxScrollTop();
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
        var x, y, cellWidth, cellHeight, cellRow, cellCol, value, self = this, o = this.options;
        var scrollLeft = o.scrollLeft;
        var scrollTop = o.scrollTop;
        var left = Math.max(0, scrollLeft - o.horizontalOverscanSize);
        var top = Math.max(0, scrollTop - o.verticalOverscanSize);
        var right = Math.min(this._width, scrollLeft + o.width + o.horizontalOverscanSize);
        var bottom = Math.min(this._height, scrollTop + o.height + o.verticalOverscanSize);
        if (right > 0 && bottom > 0) {
            var childrenToDisplay = this._cellRenderers(bottom - top, right - left, left, top);
            this.canvas.remove(this.scrollLeft, this.scrollTop, o.width, o.height);
            for (var i = 0; i < childrenToDisplay.length; i++) {
                var datum = childrenToDisplay[i];
                var index = this.renderedKeys[datum.index] && this.renderedKeys[datum.index][1];
                var rect_tl_x = datum.x,
                    rect_tl_y = datum.y,
                    rect_tr_x = rect_tl_x + datum.width,
                    rect_bl_y = rect_tl_y + datum.height,
                    cell = o.items[datum.index].cell || o.items[datum.index],
                    background, color, fontWeight, text;
                while (BI.isNull(cell.styles) && !BI.isFunction(cell.styleGetter)) {
                    cell = cell.cell;
                }
                if (BI.isNull(cell.styles) && BI.isFunction(cell.styleGetter)) {
                    background = cell.styleGetter().background;
                    color = cell.styleGetter().color;
                    fontWeight = cell.styleGetter().fontWeight;
                } else if (!BI.isNull(cell.styles)) {
                    background = cell.styles.background;
                    color = cell.styles.color;
                    fontWeight = cell.styles.fontWeight;
                }
                if (BI.isNull(cell.text)) {
                    text = "";
                } else {
                    text = cell.text;
                }
                if (!BI.isString(text)) {
                    text = text.toString();
                }
                if (this.scrollLeft !== o.scrollLeft) {
                    this.canvas.translate(this.scrollLeft - o.scrollLeft, 0);
                    this.scrollLeft = o.scrollLeft;
                }
                if (this.scrollTop !== o.scrollTop) {
                    this.canvas.translate(0, this.scrollTop - o.scrollTop);
                    this.scrollTop = o.scrollTop;
                }
                if (datum.x === 0 && datum.y === 0) {
                    this.canvas.solid(rect_tl_x, rect_tl_y, rect_tl_x, rect_bl_y, rect_tr_x, rect_bl_y, rect_tr_x, rect_tl_y, rect_tl_x, rect_tl_y, {
                        strokeStyle: "rgb(212, 218, 221)",
                        fillStyle: background
                    });
                } else if (datum.x === 0) {
                    this.canvas.solid(rect_tl_x, rect_tl_y, rect_tl_x, rect_bl_y, rect_tr_x, rect_bl_y, rect_tr_x, rect_tl_y, {
                        strokeStyle: "rgb(212, 218, 221)",
                        fillStyle: background
                    });
                } else if (datum.y === 0) {
                    this.canvas.solid(rect_tl_x, rect_tl_y, rect_tr_x, rect_tl_y, rect_tr_x, rect_bl_y, rect_tl_x, rect_bl_y, {
                        strokeStyle: "rgb(212, 218, 221)",
                        fillStyle: background
                    });
                } else {
                    this.canvas.solid(rect_tr_x, rect_tl_y, rect_tl_x, rect_tl_y, rect_tl_x, rect_bl_y, rect_tr_x, rect_bl_y, {
                        strokeStyle: "rgb(212, 218, 221)",
                        fillStyle: background
                    });
                }
                this.canvas.setFontWeight(fontWeight);
                this.canvas.setFont();
                var font = this.canvas.getContext().font,
                    textSize = this._getTextPixel(font),
                    textHeight = textSize,
                    textWidth = this.canvas.getContext().measureText(text).width,
                    dotsWidth = this.canvas.getContext().measureText("...").width;
                var offsetX = this._calcOffsetX(textWidth, datum.width, "center"),
                    offsetY = this._calcOffsetY(textHeight, datum.height, "center");
                if (textHeight > datum.height) {
                    this.canvas.text(datum.x + offsetX, datum.y + offsetY, "...", color);
                } else if (textWidth + 4 > datum.width) {
                    var sliceIndex = Math.floor((datum.width - dotsWidth - 4) / textWidth * text.length);
                    this.canvas.text(datum.x + offsetX, datum.y + offsetY, text.slice(0, sliceIndex) + "...", color);
                } else {
                    this.canvas.text(datum.x + offsetX, datum.y + offsetY, text, color);
                }
                this.canvas.stroke();
            }
        }
    },

    _getTextPixel: function (font) {
        var p = font.split("px")[0],
            s = p.split(" ");
        for (var c in s) {
            var num;
            num = BI.parseInt(s[c]);
            if (!BI.isNaN(num)) {
                return num;
            }
        }
    },

    _calcOffsetX: function (textWidth, cellWidth, position) {
        switch (position) {
            case "center":
                if (textWidth >= cellWidth) {
                    return 4;
                } else {
                    return (cellWidth - textWidth) / 2;
                }
            case "right":
                if (textWidth >= cellWidth) {
                    return 0;
                } else {
                    return cellWidth - textWidth;
                }
            default:
                return 0;
        }
    },

    _calcOffsetY: function (textHeight, cellHeight, position) {
        switch (position) {
            case "center":
                if (textHeight >= cellHeight) {
                    return textHeight;
                } else {
                    return (cellHeight + textHeight) / 2;
                }
            case "bottom":
                if (textHeight >= cellHeight) {
                    return cellHeight;
                } else {
                    return cellHeight + textHeight;
                }
            default:
                return textHeight;
        }
    },

    _populate: function (items) {
        var o = this.options;
        if (items && items !== this.options.items) {
            this.options.items = items;
            this._calculateSizeAndPositionData();
        }
        if (o.items.length > 0) {
            this.canvas.setBlock();
            this.canvas.setWidth(o.width);
            this.canvas.setHeight(o.height);
            this.restore();
            this._calculateChildrenToRender();
            this.element.scrollTop(o.scrollTop);
            this.element.scrollLeft(o.scrollLeft);
        }
    },

    populate: function (items) {
        if (items && items !== this.options.items) {
            this.restore();
        }
        this._populate(items);
    },

    setWidth: function (width) {
        BI.CanvasCollectionView.superclass.setWidth.apply(this, arguments);
        this.options.width = width;
    },

    setHeight: function (height) {
        BI.CanvasCollectionView.superclass.setHeight.apply(this, arguments);
        this.options.height = height;
    },

    restore: function () {
        this.canvas.remove(this.scrollLeft, this.scrollTop, this.options.width, this.options.height);
        this.renderedKeys = [];
        this._scrollLock = false;
    },

    setScrollLeft: function (scrollLeft) {
        if (this.options.scrollLeft === scrollLeft) {
            return;
        }
        this._scrollLock = true;
        this.options.scrollLeft = scrollLeft;
        this._debounceRelease();
        this._calculateChildrenToRender();
        this.element.scrollLeft(this.options.scrollLeft);
    },

    setScrollTop: function (scrollTop) {
        if (this.options.scrollTop === scrollTop) {
            return;
        }
        this._scrollLock = true;
        this.options.scrollTop = scrollTop;
        this._debounceRelease();
        this._calculateChildrenToRender();
        this.element.scrollTop(this.options.scrollTop);
    },

    getScrollLeft: function () {
        return this.options.scrollLeft;
    },

    getScrollTop: function () {
        return this.options.scrollTop;
    }
})
BI.CanvasCollectionView.EVENT_SCROLL = "EVENT_SCROLL";
BI.shortcut("bi.canvas_collection_view", BI.CanvasCollectionView);