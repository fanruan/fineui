/**
 *
 * 表格滚动条
 *
 * Created by GUY on 2016/1/12.
 * @class BI.GridTableScrollbar
 * @extends BI.Widget
 */
BI.GridTableScrollbar = BI.inherit(BI.Widget, {
    _const: {
        FACE_MARGIN: 4,
        FACE_MARGIN_2: 4 * 2,
        FACE_SIZE_MIN: 30,
        KEYBOARD_SCROLL_AMOUNT: 40
    },
    _defaultConfig: function () {
        return BI.extend(BI.GridTableScrollbar.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "scrollbar-layout-main public-scrollbar-main",
            attributes: {
                tabIndex: 0
            },
            contentSize: 0,
            defaultPosition: 0,
            isOpaque: false,
            orientation: "vertical",
            position: 0,
            size: 0
        })
    },

    _init: function () {
        BI.GridTableScrollbar.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.focused = false;
        this.isDragging = false;
        this.face = BI.createWidget({
            type: "bi.layout",
            cls: "scrollbar-layout-face public-scrollbar-face "
            + (this._isHorizontal() ? "scrollbar-layout-face-horizontal" : "scrollbar-layout-face-vertical")
        });
        this.contextLayout = BI.createWidget({
            type: "bi.absolute",
            element: this.element,
            items: [{
                el: this.face,
                left: 0,
                top: 0
            }]
        });
        var onWheel = o.orientation === 'horizontal' ? this._onWheelX : this._onWheelY;
        this._wheelHandler = new BI.WheelHandler(
            BI.bind(onWheel, this),
            BI.bind(this._shouldHandleX, this),
            BI.bind(this._shouldHandleY, this)
        );
        this._mouseMoveTracker = new BI.MouseMoveTracker(
            BI.bind(this._onMouseMove, this),
            BI.bind(this._onMouseMoveEnd, this),
            document
        );
        this.element.on("mousedown", BI.bind(this._onMouseDown, this));
        this.element.on("mousewheel", function (e) {
            self._wheelHandler.onWheel(e.originalEvent);
        });
        this.element.on("keydown", BI.bind(this._onKeyDown, this));
        this.element.on("focus", function () {
            self.focused = true;
            self._populate();
        });
        this.element.on("blur", function () {
            self.focused = false;
            self._populate();
        });
        if (this._isHorizontal()) {
            this.element.addClass("scrollbar-layout-main-horizontal");
        } else {
            this.element.addClass("scrollbar-layout-main-vertical");
        }
        this._populate();
    },

    _isHorizontal: function () {
        return this.options.orientation === 'horizontal'
    },

    _getScale: function () {
        var o = this.options;
        var scale = o.size / o.contentSize;
        var faceSize = o.size * scale;

        if (faceSize < this._const.FACE_SIZE_MIN) {
            scale = (o.size - this._const.FACE_SIZE_MIN) / (o.contentSize - o.size);
        }
        return scale;
    },

    _getFaceSize: function () {
        var o = this.options;
        var scale = o.size / o.contentSize;
        var faceSize = o.size * scale;

        if (faceSize < this._const.FACE_SIZE_MIN) {
            faceSize = this._const.FACE_SIZE_MIN;
        }
        return faceSize;
    },

    _shouldHandleX: function (delta) {
        return this.options.orientation === 'horizontal' ?
            this._shouldHandleChange(delta) :
            false;
    },

    _shouldHandleY: function (delta) {
        return this.options.orientation !== 'horizontal' ?
            this._shouldHandleChange(delta) :
            false;
    },

    _shouldHandleChange: function (delta) {
        return this.options.position + delta !== this.options.position;
    },

    _onWheelY: function (deltaX, deltaY) {
        this._onWheel(deltaY);
    },

    _onWheelX: function (deltaX, deltaY) {
        this._onWheel(deltaX);
    },

    _onWheel: function (delta) {
        var maxPosition = this.options.contentSize - this.options.size;
        this.options.position += delta;
        if (this.options.position < 0) {
            this.options.position = 0;
        } else if (this.options.position > maxPosition) {
            this.options.position = maxPosition;
        }
        this._populate();
        this.fireEvent(BI.GridTableScrollbar.EVENT_SCROLL, this.options.position);
    },

    _onMouseDown: function (e) {
        if (e.target !== this.face.element[0]) {
            var position = this._isHorizontal() ? e.offsetX : e.offsetY;
            position /= this._getScale();
            this.options.position = BI.clamp(position - (this._getFaceSize() * 0.5 / this._getScale()), 0, this.options.contentSize - this.options.size);
            this._populate();
            this.fireEvent(BI.GridTableScrollbar.EVENT_SCROLL, this.options.position);
        } else {
            this._mouseMoveTracker.captureMouseMoves(e);
        }
        this.element[0].focus();
    },

    _onMouseMove: function (deltaX, deltaY) {
        var delta = this._isHorizontal() ? deltaX : deltaY;
        delta /= this._getScale();
        this.options.position = BI.clamp(this.options.position + delta, 0, this.options.contentSize - this.options.size);
        this.isDragging = this._mouseMoveTracker.isDragging();
        this._populate();
        this.fireEvent(BI.GridTableScrollbar.EVENT_SCROLL, this.options.position);
    },

    _onMouseMoveEnd: function (event) {
        this._mouseMoveTracker.releaseMouseMoves();
        if (this.isDragging === true) {
            this.isDragging = false;
            this._populate();
        }
    },

    _onKeyDown: function (event) {
        var Keys = {
            BACKSPACE: 8,
            TAB: 9,
            RETURN: 13,
            ALT: 18,
            ESC: 27,
            SPACE: 32,
            PAGE_UP: 33,
            PAGE_DOWN: 34,
            END: 35,
            HOME: 36,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            DELETE: 46,
            COMMA: 188,
            PERIOD: 190,
            A: 65,
            Z: 90,
            ZERO: 48,
            NUMPAD_0: 96,
            NUMPAD_9: 105
        };
        var keyCode = event.keyCode;

        if (keyCode === Keys.TAB) {
            return;
        }

        var distance = 40;
        var direction = 0;

        if (this._isHorizontal()) {
            switch (keyCode) {
                case Keys.HOME:
                    direction = -1;
                    distance = this.options.contentSize;
                    break;

                case Keys.LEFT:
                    direction = -1;
                    break;

                case Keys.RIGHT:
                    direction = 1;
                    break;

                default:
                    return;
            }
        }

        if (!this._isHorizontal()) {
            switch (keyCode) {
                case Keys.SPACE:
                    if (event.shiftKey) {
                        direction = -1;
                    } else {
                        direction = 1;
                    }
                    break;

                case Keys.HOME:
                    direction = -1;
                    distance = this.options.contentSize;
                    break;

                case Keys.UP:
                    direction = -1;
                    break;

                case Keys.DOWN:
                    direction = 1;
                    break;

                case Keys.PAGE_UP:
                    direction = -1;
                    distance = this.options.size;
                    break;

                case Keys.PAGE_DOWN:
                    direction = 1;
                    distance = this.options.size;
                    break;

                default:
                    return;
            }
        }

        this.options.position = BI.clamp(this.options.position + (distance * direction), 0, this.options.contentSize - this.options.size);
        event.preventDefault();
        this._populate();
        this.fireEvent(BI.GridTableScrollbar.EVENT_SCROLL, this.options.position);
    },

    _populate: function () {
        var self = this, o = this.options;
        if (o.size < 1 || o.contentSize <= o.size) {
            this.setVisible(false);
            return;
        }
        this.setVisible(true);

        var size = o.size;
        var isHorizontal = this._isHorizontal();
        var isActive = this.focused || this.isDragging;

        var faceSize = this._getFaceSize();
        var isOpaque = o.isOpaque;
        this.element[isOpaque === true ? "addClass" : "removeClass"]("public-scrollbar-main-opaque");
        this.element[isActive === true ? "addClass" : "removeClass"]("public-scrollbar-main-active");

        this.face.element[isActive === true ? "addClass" : "removeClass"]("public-scrollbar-face-active");

        var position = o.position * this._getScale() + this._const.FACE_MARGIN;

        var items = this.contextLayout.attr("items");
        if (isHorizontal) {
            this.setWidth(size);
            this.face.setWidth(faceSize - this._const.FACE_MARGIN_2);
            items[0].left = position;
            items[0].top = 0;
        } else {
            this.setHeight(size);
            this.face.setHeight(faceSize - this._const.FACE_MARGIN_2);
            items[0].left = 0;
            items[0].top = position;
        }
        this.contextLayout.attr("items", items);
        this.contextLayout.resize();
    },

    setContentSize: function (contentSize) {
        this.options.contentSize = contentSize;
    },

    setPosition: function (position) {
        this.options.position = position;
    },

    setSize: function (size) {
        this.options.size = size;
    },

    populate: function () {
        this._populate();
    }
});
BI.GridTableScrollbar.SIZE = 10;
BI.GridTableScrollbar.EVENT_SCROLL = "EVENT_SCROLL";
$.shortcut("bi.grid_table_scrollbar", BI.GridTableScrollbar);


BI.GridTableHorizontalScrollbar = BI.inherit(BI.Widget, {
    _const: {
        FACE_MARGIN: 4,
        FACE_MARGIN_2: 4 * 2,
        FACE_SIZE_MIN: 30,
        KEYBOARD_SCROLL_AMOUNT: 40
    },
    _defaultConfig: function () {
        return BI.extend(BI.GridTableHorizontalScrollbar.superclass._defaultConfig.apply(this, arguments), {
            attributes: {
                tabIndex: 0
            },
            contentSize: 0,
            position: 0,
            size: 0
        })
    },

    _init: function () {
        BI.GridTableHorizontalScrollbar.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.scrollbar = BI.createWidget({
            type: "bi.grid_table_scrollbar",
            orientation: "horizontal",
            isOpaque: true,
            position: o.position,
            contentSize: o.contentSize,
            size: o.size
        });
        this.scrollbar.on(BI.GridTableScrollbar.EVENT_SCROLL, function () {
            self.fireEvent(BI.GridTableHorizontalScrollbar.EVENT_SCROLL, arguments);
        });
        BI.createWidget({
            type: "bi.absolute",
            cls: "horizontal-scrollbar",
            element: this.element,
            width: o.size,
            height: BI.GridTableScrollbar.SIZE,
            items: [{
                el: {
                    type: "bi.absolute",
                    scrollable: false,
                    height: BI.GridTableScrollbar.SIZE,
                    items: [{
                        el: this.scrollbar,
                        left: 0,
                        top: 0
                    }]
                },
                top: 0,
                left: 0,
                right: 0
            }]
        });
    },

    setContentSize: function (contentSize) {
        this.options.contentSize = contentSize;
        this.scrollbar.setContentSize(contentSize);
    },

    setPosition: function (position) {
        this.options.position = position;
        this.scrollbar.setPosition(position);
    },

    setSize: function (size) {
        this.setWidth(size);
        this.options.size = size;
        this.scrollbar.setSize(size);
    },

    populate: function () {
        this.scrollbar.populate();
    }
});
BI.GridTableHorizontalScrollbar.EVENT_SCROLL = "EVENT_SCROLL";
$.shortcut("bi.grid_table_horizontal_scrollbar", BI.GridTableHorizontalScrollbar);