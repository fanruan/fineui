/**
 *
 * 表格
 *
 * 能处理静态宽度以及动态宽度的表， 百分比宽度的表请使用PreviewTable
 *
 * Created by GUY on 2015/9/22.
 * @class BI.Table
 * @extends BI.Widget
 */
BI.Table = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.Table.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-table",
            logic: { //冻结的页面布局逻辑
                dynamic: false
            },

            isNeedResize: false,//是否需要调整列宽
            isResizeAdapt: true,//是否需要在调整列宽或区域宽度的时候它们自适应变化

            isNeedFreeze: false,//是否需要冻结单元格
            freezeCols: [], //冻结的列号,从0开始,isNeedFreeze为true时生效

            isNeedMerge: false,//是否需要合并单元格
            mergeCols: [], //合并的单元格列号
            mergeRule: function (row1, row2) { //合并规则, 默认相等时合并
                return BI.isEqual(row1, row2);
            },

            columnSize: [],
            headerRowSize: 25,
            footerRowSize: 25,
            rowSize: 25,

            regionColumnSize: false,

            header: [],
            footer: false,
            items: [] //二维数组
        })
    },

    _calculateWidth: function (width) {
        if (!width || width === "0") {
            return "";
        }
        width = BI.parseFloat(width);
        if (width < 0) {
            width = 0;
        }
        return width > 1.01 ? width : (width * 100 + "%");
    },

    _calculateHeight: function (height) {
        return height ? height : "";
    },

    _isRightFreeze: function () {
        return BI.isNotEmptyArray(this.options.freezeCols) && BI.first(this.options.freezeCols) !== 0;
    },

    _createTopLeft: function () {
        var o = this.options, isRight = this._isRightFreeze();
        this.topLeftColGroupTds = {};
        this.topLeftBodyTds = {};
        this.topLeftBodyItems = {};
        var table = this._table();
        var colgroup = this._createColGroup(this.columnLeft, this.topLeftColGroupTds);
        var body = this.topLeftBody = this._body();
        body.element.append(this._createHeaderCells(this.topLeftItems, this.columnLeft, this.mergeLeft, this.topLeftBodyTds, this.topLeftBodyItems));
        BI.createWidget({
            type: "bi.adaptive",
            element: table,
            items: [colgroup, body]
        });
        if (isRight) {
            var w = 0;
            BI.each(o.columnSize, function (i, col) {
                if (!o.freezeCols.contains(i)) {
                    w += col;
                }
            });
            if (BI.isNumeric(w) && w > 1) {
                w = BI.parseFloat(w) + o.columnSize.length - o.freezeCols.length;
            }
        }
        return (this.topLeftContainer = BI.createWidget({
            type: "bi.adaptive",
            width: this._calculateWidth(w),
            items: [table]
        }));
    },

    _createTopRight: function () {
        var o = this.options, isRight = this._isRightFreeze();
        this.topRightColGroupTds = {};
        this.topRightBodyTds = {};
        this.topRightBodyItems = {};
        var table = this._table();
        var colgroup = this._createColGroup(this.columnRight, this.topRightColGroupTds);
        var body = this.topRightBody = this._body();
        body.element.append(this._createHeaderCells(this.topRightItems, this.columnRight, this.mergeRight, this.topRightBodyTds, this.topRightBodyItems, this.columnLeft.length));
        BI.createWidget({
            type: "bi.adaptive",
            element: table,
            items: [colgroup, body]
        });
        if (!isRight) {
            var w = 0;
            BI.each(o.columnSize, function (i, col) {
                if (!o.freezeCols.contains(i)) {
                    w += col;
                }
            });
            if (BI.isNumeric(w)) {
                w = BI.parseFloat(w) + o.columnSize.length - o.freezeCols.length;
            }
        }
        return (this.topRightContainer = BI.createWidget({
            type: "bi.adaptive",
            width: w || undefined,
            items: [table]
        }));
    },

    _createBottomLeft: function () {
        var o = this.options, isRight = this._isRightFreeze();
        this.bottomLeftColGroupTds = {};
        this.bottomLeftBodyTds = {};
        this.bottomLeftBodyItems = {};
        var table = this._table();
        var colgroup = this._createColGroup(this.columnLeft, this.bottomLeftColGroupTds);
        var body = this._createBottomLeftBody();
        BI.createWidget({
            type: "bi.adaptive",
            element: table,
            items: [colgroup, body]
        });
        if (isRight) {
            var w = 0;
            BI.each(o.columnSize, function (i, col) {
                if (!o.freezeCols.contains(i)) {
                    w += col;
                }
            });
            if (BI.isNumeric(w) && w > 1) {
                w = BI.parseFloat(w) + o.columnSize.length - o.freezeCols.length;
            }
        }
        return (this.bottomLeftContainer = BI.createWidget({
            type: "bi.adaptive",
            width: this._calculateWidth(w),
            items: [table]
        }));
    },

    _createBottomLeftBody: function () {
        var body = this.bottomLeftBody = this._body();
        body.element.append(this._createCells(this.bottomLeftItems, this.columnLeft, this.mergeLeft, this.bottomLeftBodyTds, this.bottomLeftBodyItems));
        return body;
    },

    _createBottomRight: function () {
        var o = this.options, isRight = this._isRightFreeze();
        this.bottomRightColGroupTds = {};
        this.bottomRightBodyTds = {};
        this.bottomRightBodyItems = {};
        var table = this._table();
        var colgroup = this._createColGroup(this.columnRight, this.bottomRightColGroupTds);
        var body = this._createBottomRightBody();
        BI.createWidget({
            type: "bi.adaptive",
            element: table,
            items: [colgroup, body]
        });
        if (!isRight) {
            var w = 0;
            BI.each(o.columnSize, function (i, col) {
                if (!o.freezeCols.contains(i)) {
                    w += col;
                }
            });
            if (BI.isNumeric(w) && w > 1) {
                w = BI.parseFloat(w) + o.columnSize.length - o.freezeCols.length;
            }
        }
        return (this.bottomRightContainer = BI.createWidget({
            type: "bi.adaptive",
            width: this._calculateWidth(w),
            items: [table]
        }));
    },

    _createBottomRightBody: function () {
        var body = this.bottomRightBody = this._body();
        body.element.append(this._createCells(this.bottomRightItems, this.columnRight, this.mergeRight, this.bottomRightBodyTds, this.bottomRightBodyItems, this.columnLeft.length));
        return body;
    },

    _createFreezeTable: function () {
        var self = this, o = this.options;
        var isRight = this._isRightFreeze();
        var split = this._split(o.header);
        this.topLeftItems = split.left;
        this.topRightItems = split.right;
        split = this._split(o.items);
        this.bottomLeftItems = split.left;
        this.bottomRightItems = split.right;

        this.columnLeft = [];
        this.columnRight = [];
        BI.each(o.columnSize, function (i, size) {
            if (o.freezeCols.contains(i)) {
                self[isRight ? "columnRight" : "columnLeft"].push(size);
            } else {
                self[isRight ? "columnLeft" : "columnRight"].push(size);
            }
        });
        this.mergeLeft = [];
        this.mergeRight = [];
        BI.each(o.mergeCols, function (i, col) {
            if (o.freezeCols.contains(col)) {
                self[isRight ? "mergeRight" : "mergeLeft"].push(col);
            } else {
                self[isRight ? "mergeLeft" : "mergeRight"].push(col);
            }
        });

        var topLeft = this._createTopLeft();
        var topRight = this._createTopRight();
        var bottomLeft = this._createBottomLeft();
        var bottomRight = this._createBottomRight();

        this.scrollTopLeft = BI.createWidget({
            type: "bi.adaptive",
            cls: "scroll-top-left",
            width: "100%",
            height: "100%",
            scrollable: false,
            items: [topLeft]
        });
        this.scrollTopRight = BI.createWidget({
            type: "bi.adaptive",
            cls: "scroll-top-right",
            width: "100%",
            height: "100%",
            scrollable: false,
            items: [topRight]
        });
        this.scrollBottomLeft = BI.createWidget({
            type: "bi.adaptive",
            cls: "scroll-bottom-left",
            width: "100%",
            height: "100%",
            scrollable: isRight || null,
            scrollx: !isRight,
            items: [bottomLeft]
        });
        this.scrollBottomRight = BI.createWidget({
            type: "bi.adaptive",
            cls: "scroll-bottom-right",
            width: "100%",
            height: "100%",
            scrollable: !isRight || null,
            scrollx: isRight,
            items: [bottomRight]
        });
        this.topLeft = BI.createWidget({
            type: "bi.adaptive",
            cls: "top-left",
            scrollable: false,
            items: [this.scrollTopLeft]
        });
        this.topRight = BI.createWidget({
            type: "bi.adaptive",
            cls: "top-right",
            scrollable: false,
            items: [this.scrollTopRight]
        });
        this.bottomLeft = BI.createWidget({
            type: "bi.adaptive",
            cls: "bottom-left",
            // scrollable: false,
            items: [this.scrollBottomLeft]
        });
        this.bottomRight = BI.createWidget({
            type: "bi.adaptive",
            cls: "bottom-right",
            scrollable: false,
            items: [this.scrollBottomRight]
        });

        var headerHeight = o.header.length * ((o.headerRowSize || o.rowSize) + 1) + 1;
        var leftWidth = BI.sum(o.freezeCols, function (i, col) {
            return o.columnSize[col] > 1 ? o.columnSize[col] + 1 : o.columnSize[col];
        });

        if (o.isNeedResize) {
            var resizer;
            var createResizer = function (size, position) {
                var rowSize = self.getCalculateRegionRowSize();
                resizer = BI.createWidget({
                    type: "bi.layout",
                    cls: "bi-resizer",
                    width: size.width,
                    height: rowSize[0] + rowSize[1]
                });
                BI.createWidget({
                    type: "bi.absolute",
                    element: "body",
                    items: [{
                        el: resizer,
                        left: position.left,
                        top: position.top - rowSize[0]
                    }]
                });
            };
            var resizeResizer = function (size, position) {
                var rowSize = self.getCalculateRegionRowSize();
                var columnSize = self.getCalculateRegionColumnSize();
                var height = rowSize[0] + rowSize[1];
                var sumSize = columnSize[0] + columnSize[1];
                if (size.width > sumSize / 5 * 4) {
                    size.width = sumSize / 5 * 4;
                }
                if (size.width < 10) {
                    size.width = 10;
                }
                resizer.element.css({
                    "left": position.left + "px",
                    "width": size.width + "px",
                    "height": height + "px"
                });
            };
            var stopResizer = function () {
                resizer && resizer.destroy();
                resizer = null;
            };
            var handle;
            if (o.freezeCols.length > 0 && o.freezeCols.length < o.columnSize.length) {
                if (isRight) {
                    var options = {
                        handles: "w",
                        minWidth: 15,
                        helper: "clone",
                        start: function (event, ui) {
                            createResizer(ui.size, ui.position);
                            self.fireEvent(BI.Table.EVENT_TABLE_BEFORE_REGION_RESIZE);
                        },
                        resize: function (e, ui) {
                            resizeResizer(ui.size, ui.position);
                            self.fireEvent(BI.Table.EVENT_TABLE_REGION_RESIZE);
                            e.stopPropagation();
                            //return false;
                        },
                        stop: function (e, ui) {
                            stopResizer();
                            if (o.isResizeAdapt) {
                                var increment = ui.size.width - (BI.sum(self.columnRight) + self.columnRight.length);
                                o.columnSize[self.columnLeft.length] += increment;
                            } else {
                                self.setRegionColumnSize(["fill", ui.size.width]);
                            }
                            self._resize();
                            ui.element.css("left", "");
                            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE);
                        }
                    };
                    self.bottomRight.element.resizable(options);
                    handle = $(".ui-resizable-handle", this.bottomRight.element).css("top", -1 * headerHeight);
                } else {
                    var options = {
                        handles: "e",
                        minWidth: 15,
                        helper: "clone",
                        start: function (event, ui) {
                            createResizer(ui.size, ui.position);
                            self.fireEvent(BI.Table.EVENT_TABLE_BEFORE_REGION_RESIZE);
                        },
                        resize: function (e, ui) {
                            resizeResizer(ui.size, ui.position);
                            self.fireEvent(BI.Table.EVENT_TABLE_REGION_RESIZE);
                            e.stopPropagation();
                            //return false;
                        },
                        stop: function (e, ui) {
                            stopResizer();
                            if (o.isResizeAdapt) {
                                var increment = ui.size.width - (BI.sum(self.columnLeft) + self.columnLeft.length);
                                o.columnSize[self.columnLeft.length - 1] += increment;
                            } else {
                                self.setRegionColumnSize([ui.size.width, "fill"]);
                            }
                            self._resize();
                            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE);
                        }
                    };
                    self.bottomLeft.element.resizable(options);
                    handle = $(".ui-resizable-handle", this.bottomLeft.element).css("top", -1 * headerHeight);
                }
            }
        }
        this._resize = function () {
            if (self.scrollBottomLeft.element.is(":visible")) {
                self.scrollBottomLeft.element.css({"overflow-x": "auto"});
                self.scrollBottomRight.element.css({"overflow-x": "auto"});
                self.setColumnSize(o.columnSize);
                if (isRight) {
                    self.scrollBottomLeft.element.css({"overflow-y": "auto"});
                } else {
                    self.scrollBottomRight.element.css({"overflow-y": "auto"});
                }
                if (self.scrollBottomLeft.element.hasHorizonScroll() || self.scrollBottomRight.element.hasHorizonScroll()) {
                    self.scrollBottomLeft.element.css("overflow-x", "scroll");
                    self.scrollBottomRight.element.css("overflow-x", "scroll");
                }
                if (self.scrollBottomRight.element.hasVerticalScroll()) {
                    self.scrollTopRight.element.css("overflow-y", "scroll");
                } else {
                    self.scrollTopRight.element.css("overflow-y", "hidden");
                }
                if (self.scrollBottomLeft.element.hasVerticalScroll()) {
                    self.scrollTopLeft.element.css("overflow-y", "scroll");
                } else {
                    self.scrollTopLeft.element.css("overflow-y", "hidden");
                }
                self.scrollTopLeft.element[0].scrollLeft = self.scrollBottomLeft.element[0].scrollLeft;
                self.scrollTopRight.element[0].scrollLeft = self.scrollBottomRight.element[0].scrollLeft;
                self.scrollBottomLeft.element[0].scrollTop = self.scrollBottomRight.element[0].scrollTop;
                //调整拖拽handle的高度
                if (o.isNeedResize) {
                    handle && handle.css("height", self.bottomLeft.element.height() + headerHeight);
                }
            }
        };

        var regionColumnSize = o.regionColumnSize;
        if (o.freezeCols.length === 0) {
            regionColumnSize = isRight ? ['fill', 0] : [0, 'fill'];
        } else if (o.freezeCols.length >= o.columnSize.length) {
            regionColumnSize = isRight ? [0, 'fill'] : ['fill', 0];
        }
        this.partitions = BI.createWidget(BI.extend({
            element: this.element
        }, BI.LogicFactory.createLogic("table", BI.extend({}, o.logic, {
            rows: 2,
            columns: 2,
            columnSize: regionColumnSize || (isRight ? ['fill', leftWidth] : [leftWidth, 'fill']),
            rowSize: [headerHeight, 'fill'],
            items: [[{
                el: this.topLeft
            }, {
                el: this.topRight
            }], [{
                el: this.bottomLeft
            }, {
                el: this.bottomRight
            }]]
        }))));

        //var scrollElement = isRight ? scrollBottomLeft.element : scrollBottomRight.element;
        //var scrollTopElement = isRight ? scrollTopLeft.element : scrollTopRight.element;
        //var otherElement = isRight ? scrollBottomRight.element : scrollBottomLeft.element;

        this._initFreezeScroll();
        BI.nextTick(function () {
            if (self.element.is(":visible")) {
                self._resize();
                self.fireEvent(BI.Table.EVENT_TABLE_AFTER_INIT);
            }
        });
        BI.Resizers.add(this.getName(), function (e) {
            if (BI.isWindow(e.target) && self.element.is(":visible")) {
                self._resize();
                self.fireEvent(BI.Table.EVENT_TABLE_RESIZE);
            }
        });
    },

    _initFreezeScroll: function () {
        var self = this, o = this.options;
        scroll(this.scrollBottomRight.element, this.scrollTopRight.element, this.scrollBottomLeft.element);
        scroll(this.scrollBottomLeft.element, this.scrollTopLeft.element, this.scrollBottomRight.element);

        function scroll(scrollElement, scrollTopElement, otherElement) {
            var scrolling, scrollingX;
            var fn = function (event, delta, deltaX, deltaY) {
                var inf = self._getScrollOffsetAndDur(event);
                if (deltaY < 0 || deltaY > 0) {
                    if (scrolling) {
                        scrollElement[0].scrollTop = scrolling;
                    }
                    scrolling = scrollElement[0].scrollTop - delta * inf.offset;
                    var stopPropagation = false;
                    var st = scrollElement[0].scrollTop;
                    scrollElement[0].scrollTop = scrolling;
                    if (scrollElement[0].scrollTop !== st) {
                        stopPropagation = true;
                    }
                    scrollElement[0].scrollTop = st;
                    self._animateScrollTo(scrollElement, scrollElement[0].scrollTop, scrolling, inf.dur, "linear", {
                        onStart: function () {
                        },
                        onUpdate: function (top) {
                            otherElement[0].scrollTop = top;
                            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, top);
                        },
                        onComplete: function () {
                            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, scrolling);
                            scrolling = null;
                        }
                    });


                    //otherElement[0].scrollTop = scrollTop;
                    //scrollElement[0].scrollTop = scrollTop;
                    //self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, scrollTop);
                    if (stopPropagation === true) {
                        event.stopPropagation();
                        return false;
                    }
                    return;
                }
                //if (deltaX < 0 || deltaX > 0) {
                //    if (scrollingX) {
                //        scrollElement[0].scrollLeft = scrollingX;
                //    }
                //    scrollingX = scrollElement[0].scrollLeft + delta * inf.offset;
                //    var stopPropagation = false;
                //    var sl = scrollElement[0].scrollLeft;
                //    scrollElement[0].scrollLeft = scrollingX;
                //    if (scrollElement[0].scrollLeft !== sl) {
                //        stopPropagation = true;
                //    }
                //    scrollElement[0].scrollLeft = sl;
                //    self._animateScrollTo(scrollElement, scrollElement[0].scrollLeft, scrollingX, inf.dur, "linear", {
                //        direction: "left",
                //        onStart: function () {
                //        },
                //        onUpdate: function (left) {
                //            scrollTopElement[0].scrollLeft = left;
                //            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, null, left);
                //        },
                //        onComplete: function () {
                //            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, null, scrollingX);
                //            scrollingX = null;
                //        }
                //    });
                //
                //
                //    //otherElement[0].scrollTop = scrollTop;
                //    //scrollElement[0].scrollTop = scrollTop;
                //    //self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, scrollTop);
                //    if (stopPropagation === true) {
                //        event.stopPropagation();
                //        return false;
                //    }
                //}
            };
            scrollElement.mousewheel(fn);
            var scrollTop = 0, scrollLeft = 0;
            scrollElement.scroll(function (e) {
                var change = false;
                if (scrollElement.scrollTop() != scrollTop) {
                    var old = otherElement.scrollTop();
                    otherElement.scrollTop(scrollElement.scrollTop());
                    scrollTop = scrollElement.scrollTop();
                    if (Math.abs(old - otherElement[0].scrollTop) > 0.1) {
                        e.stopPropagation();
                        change = true;
                    }
                }
                if (scrollElement.scrollLeft() != scrollLeft) {
                    var old = scrollTopElement.scrollLeft();
                    scrollTopElement.scrollLeft(scrollElement.scrollLeft());
                    scrollLeft = scrollElement.scrollLeft();
                    if (Math.abs(old - scrollTopElement[0].scrollLeft) > 0.1) {
                        e.stopPropagation();
                        change = true;
                    }
                }
                // self.fireEvent(BI.Table.EVENT_TABLE_SCROLL);
                if (change === true) {
                    e.stopPropagation();
                    //return false;
                }
            });
        }
    },

    _animateScrollTo: function (el, from, to, duration, easing, op) {
        var self = this;
        var onStart = op.onStart, onComplete = op.onComplete, onUpdate = op.onUpdate;
        var startTime = BI.getTime(), _delay, progress = 0, _request;
        _cancelTween();
        _startTween();
        var diff = to - from;
        el._stop = 0;
        function _step() {
            if (el._stop) {
                return;
            }
            if (!progress) {
                onStart.call();
            }
            progress = BI.getTime() - startTime;
            _tween();
            if (progress >= el.time) {
                el.time = (progress > el.time) ? progress + _delay - (progress - el.time) : progress + _delay - 1;
                if (el.time < progress + 1) {
                    el.time = progress + 1;
                }
            }
            if (el.time < duration) {
                el._id = _request(_step);
            } else {
                el[op.direction == 'left' ? "scrollLeft" : "scrollTop"](to);
                onComplete.call();
            }
        }

        function _tween() {
            var top = to;
            if (duration > 0) {
                el.currVal = _ease(el.time, from, diff, duration, easing);
                el[op.direction == 'left' ? "scrollLeft" : "scrollTop"](top = Math.round(el.currVal));
            } else {
                el[op.direction == 'left' ? "scrollLeft" : "scrollTop"](to);
            }
            onUpdate(top);
        }

        function _startTween() {
            _delay = 1000 / 60;
            el.time = progress + _delay;
            _request = (!requestAnimationFrame()) ? function (f) {
                _tween();
                return setTimeout(f, 0.01);
            } : requestAnimationFrame();
            el._id = _request(_step);
        }

        function requestAnimationFrame() {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                window.oRequestAnimationFrame;
        }

        function cancelAnimationFrame() {
            return window.cancelAnimationFrame ||
                window.webkitCancelAnimationFrame ||
                window.mozCancelAnimationFrame ||
                window.msCancelAnimationFrame ||
                window.oCancelAnimationFrame ||
                window.cancelRequestAnimationFrame ||
                window.webkitCancelRequestAnimationFrame ||
                window.mozCancelRequestAnimationFrame ||
                window.msCancelRequestAnimationFrame ||
                window.oCancelRequestAnimationFrame
        }

        function _cancelTween() {
            if (el._id == null) {
                return;
            }
            if (!cancelAnimationFrame()) {
                clearTimeout(el._id);
            } else {
                cancelAnimationFrame()(el._id);
            }
            el._id = null;
        }

        function _ease(t, b, c, d, type) {
            switch (type) {
                case "linear":
                    return c * t / d + b;
                    break;
                case "mcsLinearOut":
                    t /= d;
                    t--;
                    return c * Math.sqrt(1 - t * t) + b;
                    break;
                case "easeInOutSmooth":
                    t /= d / 2;
                    if (t < 1) {
                        return c / 2 * t * t + b;
                    }
                    t--;
                    return -c / 2 * (t * (t - 2) - 1) + b;
                    break;
                case "easeInOutStrong":
                    t /= d / 2;
                    if (t < 1) {
                        return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                    }
                    t--;
                    return c / 2 * ( -Math.pow(2, -10 * t) + 2 ) + b;
                    break;
                case "easeInOut":
                case "mcsEaseInOut":
                    t /= d / 2;
                    if (t < 1) {
                        return c / 2 * t * t * t + b;
                    }
                    t -= 2;
                    return c / 2 * (t * t * t + 2) + b;
                    break;
                case "easeOutSmooth":
                    t /= d;
                    t--;
                    return -c * (t * t * t * t - 1) + b;
                    break;
                case "easeOutStrong":
                    return c * ( -Math.pow(2, -10 * t / d) + 1 ) + b;
                    break;
                case "easeOut":
                case "mcsEaseOut":
                default:
                    var ts = (t /= d) * t, tc = ts * t;
                    return b + c * (0.499999999999997 * tc * ts + -2.5 * ts * ts + 5.5 * tc + -6.5 * ts + 4 * t);
            }
        }
    },

    _getScrollOffsetAndDur: function (event) {
        var offset = 40, dur = 200;
        if (event.originalEvent.wheelDelta) {
            offset = Math.abs(event.originalEvent.wheelDelta);
        }
        if (event.deltaFactor < 2) {
            offset = 3;
            dur = 17;
        }
        return {
            offset: offset,
            dur: dur
        };
    },

    resize: function () {
        this._resize();
    },

    _createCells: function (items, columnSize, mergeCols, TDs, Ws, start, rowSize) {
        var self = this, o = this.options, preCol = {}, preRow = {}, preRW = {}, preCW = {}, map = {};
        columnSize = columnSize || o.columnSize;
        mergeCols = mergeCols || o.mergeCols;
        TDs = TDs || {};
        Ws = Ws || {};
        start = start || 0;
        rowSize || (rowSize = o.rowSize);
        var frag = document.createDocumentFragment();
        BI.each(items, function (i, rows) {
            var tr = $("<tr>").addClass((i & 1) === 0 ? "odd" : "even");
            BI.each(rows, function (j, row) {
                if (!map[i]) {
                    map[i] = {};
                }
                if (!TDs[i]) {
                    TDs[i] = {};
                }
                if (!Ws[i]) {
                    Ws[i] = {};
                }
                map[i][j] = row;

                if (o.isNeedMerge && mergeCols.contains(j)) {
                    if (i === 0 && j === 0) {
                        createOneEl(0, 0);
                    } else if (j === 0 && i > 0) {
                        var isNeedMergeRow = o.mergeRule(map[i][j], map[i - 1][j]);
                        if (isNeedMergeRow === true) {
                            mergeRow(i, j);
                            preRow[i] = preCol[j];
                            preRW[i] = preCW[j];
                        } else {
                            createOneEl(i, j);
                        }
                    } else if (i === 0 && j > 0) {
                        var isNeedMergeCol = o.mergeRule(map[i][j], map[i][j - 1]);
                        if (isNeedMergeCol === true) {
                            mergeCol(i, j);
                            preCol[j] = preRow[j - 1];
                            preCW[j] = preRW[j - 1];
                        } else {
                            createOneEl(i, j);
                        }
                    } else {
                        var isNeedMergeRow = o.mergeRule(map[i][j], map[i - 1][j]);
                        var isNeedMergeCol = o.mergeRule(map[i][j], map[i][j - 1]);
                        if (isNeedMergeCol && isNeedMergeRow) {
                            return;
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
            });
            function mergeRow(i, j) {
                var height = (preCol[j].attr("height") | 0) + rowSize + 1;
                preCol[j].attr("height", height).css("height", height);
                //preCW[j].element.css("height", height);
                var rowspan = ((preCol[j].attr("rowspan") || 1) | 0) + 1;
                preCol[j].attr("rowspan", rowspan);
                preCol[j].__mergeRows.pushDistinct(i);
                TDs[i][j] = preCol[j];
                Ws[i][j] = preCW[j];
            }

            function mergeCol(i, j) {
                if (columnSize[j]) {
                    var width = preRow[i].attr("width") | 0;
                    if (width > 1.05 && columnSize[j]) {
                        width = width + columnSize[j] + 1;
                        if (j === columnSize.length - 1) {
                            width--;
                        }
                    } else {
                        width = width + columnSize[j]
                    }
                    width = self._calculateWidth(width);
                    preRow[i].attr("width", width).css("width", width);
                    preRW[i].element.width(width);
                }
                var colspan = ((preRow[i].attr("colspan") || 1) | 0) + 1;
                preRow[i].attr("colspan", colspan);
                preRow[i].__mergeCols.pushDistinct(j);
                TDs[i][j] = preRow[i];
                Ws[i][j] = preRW[i];
            }

            function createOneEl(r, c) {
                var width = self._calculateWidth(columnSize[c]);
                if (width > 1.05 && c === columnSize.length - 1) {
                    width--;
                }
                var height = self._calculateHeight(rowSize);
                var td = $("<td>").attr("height", height)
                    .attr("width", width).css({"width": width, "height": height, "position": "relative"})
                    .addClass((c & 1) === 0 ? "odd-col" : "even-col")
                    .addClass(r === 0 ? "first-row" : "")
                    .addClass(c === 0 ? "first-col" : "")
                    .addClass(c === rows.length - 1 ? "last-col" : "");
                var w = BI.createWidget(map[r][c], {
                    type: "bi.table_cell",
                    textAlign: "left",
                    width: BI.isNumeric(width) ? width : "",
                    height: BI.isNumeric(height) ? height : "",
                    _row: r,
                    _col: c + start
                });
                w.element.css("position", "relative");
                td.append(w.element);
                tr.append(td);
                preCol[c] = td;
                preCol[c].__mergeRows = [r];
                preCW[c] = w;
                preRow[r] = td;
                preRow[r].__mergeCols = [c];
                preRW[r] = w;
                TDs[r][c] = td;
                Ws[r][c] = w;
            }

            frag.appendChild(tr[0]);
        });
        return frag;
    },

    _createColGroupCells: function (columnSize, store) {
        var self = this, o = this.options;
        columnSize = columnSize || o.columnSize;
        store = store || {};
        var frag = document.createDocumentFragment();
        BI.each(columnSize, function (i, size) {
            var width = self._calculateWidth(size);
            var col = $("<col>").attr("width", width).css("width", width);
            store[i] = col;
            frag.appendChild(col[0]);
        });
        return frag;
    },

    _createHeaderCells: function (items, columnSize, mergeCols, TDs, Ws, start) {
        var self = this, o = this.options;
        start || (start = 0);
        var frag = this._createCells(items, columnSize, BI.range(o.columnSize.length), TDs, Ws, start, o.headerRowSize || o.rowSize);

        if (o.isNeedResize === true) {
            var tds = TDs[BI.size(TDs) - 1];
            BI.each(tds, function (j, td) {
                j = j | 0;
                var resizer;
                var getHeight = function (size, position) {
                    var rowSize = self.getCalculateRegionRowSize();
                    if (o.isNeedFreeze === true) {
                        var tableHeight = self.bottomRightContainer.element.outerHeight();
                        return size.height + Math.min(rowSize[1], tableHeight);
                    } else {
                        var tableHeight = self.tableContainer.element.outerHeight();
                        var offset = self.tableContainer.element.offset();
                        var offsetTop = position.top - offset.top;
                        var height = tableHeight - offsetTop;
                        height = Math.min(height, rowSize[0] - offsetTop);
                        return height;
                    }
                };
                if (j < BI.size(tds) - 1) {
                    td.resizable({
                        handles: "e",
                        minWidth: 15,
                        helper: "clone",
                        start: function (event, ui) {
                            var height = getHeight(ui.size, ui.position);
                            resizer = BI.createWidget({
                                type: "bi.layout",
                                cls: "bi-resizer",
                                width: ui.size.width,
                                height: height
                            });

                            BI.createWidget({
                                type: "bi.absolute",
                                element: "body",
                                items: [{
                                    el: resizer,
                                    left: ui.position.left,
                                    top: ui.position.top
                                }]
                            });
                            self.fireEvent(BI.Table.EVENT_TABLE_BEFORE_COLUMN_RESIZE);
                        },
                        resize: function (e, ui) {
                            var height = getHeight(ui.size, ui.position);
                            resizer.element.css({"width": ui.size.width + "px", "height": height + "px"});
                            //o.columnSize[start + j] = ui.size.width;
                            //self.setColumnSize(o.columnSize);
                            self.fireEvent(BI.Table.EVENT_TABLE_COLUMN_RESIZE);
                            e.stopPropagation();
                            //return false;
                        },
                        stop: function (e, ui) {
                            resizer.destroy();
                            resizer = null;
                            o.columnSize[start + j] = ui.size.width - 1;
                            self.setColumnSize(o.columnSize);
                            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE);
                        }
                    })
                }
            })
        }
        return frag;
    },

    _createFooterCells: function (items, columnSize, TDs, Ws) {
        var o = this.options;
        var frag = this._createCells(items, columnSize, [], TDs, Ws, 0);
        return frag;
    },

    _createColGroup: function (columnSize, store, widgets) {
        var self = this, o = this.options;
        this.colgroup = this._colgroup();
        this.colgroup.element.append(this._createColGroupCells(columnSize, store, widgets));
        return this.colgroup;
    },

    _createHeader: function () {
        var self = this, o = this.options;
        if (o.header === false) {
            return;
        }
        this.header = this._header();
        this.header.element.append(this._createHeaderCells(o.header, null, null, this.headerTds, this.headerItems));
        return this.header;
    },

    _createFooter: function (columnSize, store, widgets) {
        var self = this, o = this.options;
        if (o.footer === false) {
            return;
        }
        this.footer = this._footer();
        this.footer.element.append(this._createFooterCells(o.footer, null, this.footerTds, this.footerItems));
        return this.footer;
    },

    _createBody: function () {
        var self = this, o = this.options;
        this.body = this._body();
        this.body.element.append(this._createCells(o.items, null, null, this.bodyTds, this.bodyItems));
        return this.body;
    },

    _createNormalTable: function () {
        var self = this, o = this.options, table = this._table();
        this.colgroupTds = {};
        this.headerTds = {};
        this.footerTds = {};
        this.bodyTds = {};

        this.headerItems = {};
        this.footerItems = {};
        this.bodyItems = {};
        var colgroup = this._createColGroup(null, this.colgroupTds);
        var header = this._createHeader();
        var footer = this._createFooter();
        var body = this._createBody();

        BI.createWidget({
            type: "bi.adaptive",
            element: table,
            items: [colgroup, header, footer, body]
        });

        var w = BI.sum(this.options.columnSize) || undefined;
        w = this._calculateWidth(w);
        if (BI.isNumeric(w) && w > 1) {
            w += o.columnSize.length;
        }
        this.tableContainer = BI.createWidget({
            type: "bi.adaptive",
            width: this._calculateWidth(w),
            items: [table]
        });

        this.scrollBottomRight = BI.createWidget({
            type: "bi.adaptive",
            width: "100%",
            height: "100%",
            cls: "scroll-bottom-right",
            scrollable: true,
            items: [this.tableContainer]
        });

        BI.createWidget({
            type: "bi.adaptive",
            cls: "bottom-right",
            element: this.element,
            scrollable: false,
            items: [this.scrollBottomRight]
        });

        this._resize = function () {
            if (self.element.is(":visible")) {
                self.setColumnSize(o.columnSize);
            }
        };

        this._initNormalScroll();
        BI.Resizers.add(this.getName(), function (e) {
            if (self.element.is(":visible") && BI.isWindow(e.target)) {
                self._resize();
                self.fireEvent(BI.Table.EVENT_TABLE_RESIZE);
            }
        });
        BI.nextTick(function () {
            if (self.element.is(":visible")) {
                self.fireEvent(BI.Table.EVENT_TABLE_AFTER_INIT);
            }
        });
    },

    _initNormalScroll: function () {
        var self = this;
        var scrolling, scrollX;
        this.scrollBottomRight.element.mousewheel(function (event, delta, deltaX, deltaY) {
            var inf = self._getScrollOffsetAndDur(event);
            if (deltaY < 0 || deltaY > 0) {
                var ele = self.scrollBottomRight.element;
                if (scrolling) {
                    ele[0].scrollTop = scrolling;
                }

                scrolling = ele[0].scrollTop - delta * inf.offset;
                var stopPropagation = false;
                var st = ele[0].scrollTop;
                ele[0].scrollTop = scrolling;
                if (ele[0].scrollTop !== st) {
                    stopPropagation = true;
                }
                ele[0].scrollTop = st;
                self._animateScrollTo(ele, ele[0].scrollTop, scrolling, inf.dur, "linear", {
                    onStart: function () {
                    },
                    onUpdate: function (top) {
                        self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, top);
                    },
                    onComplete: function () {
                        self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, scrolling);
                        scrolling = null;
                    }
                });
                //var scrollTop = self.scrollBottomRight.element[0].scrollTop = self.scrollBottomRight.element[0].scrollTop - delta * offset;
                //self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, scrollTop);
                if (stopPropagation === true) {
                    event.stopPropagation();
                    return false;
                }
            }
        });
        var scrollTop = 0, scrollLeft = 0;
        this.scrollBottomRight.element.scroll(function (e) {
            var change = false;
            var scrollElement = self.scrollBottomRight.element;
            if (scrollElement.scrollTop() != scrollTop) {
                if (Math.abs(scrollElement.scrollTop() - scrollTop) > 0.1) {
                    e.stopPropagation();
                    change = true;
                }
                scrollTop = scrollElement.scrollTop();
            }
            if (scrollElement.scrollLeft() != scrollLeft) {
                if (Math.abs(scrollElement.scrollLeft() - scrollLeft) > 0.1) {
                    e.stopPropagation();
                    change = true;
                }
                scrollLeft = scrollElement.scrollLeft();
            }
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL);
            if (change === true) {
                e.stopPropagation();
                //return false;
            }
            return false;
        });
    },

    _split: function (items) {
        var o = this.options, left = [], right = [], isRight = this._isRightFreeze();
        BI.each(items, function (i, rows) {
            left.push([]);
            right.push([]);
            BI.each(rows, function (j, cell) {
                if (o.freezeCols.contains(j)) {
                    (isRight ? right : left)[i].push(cell);
                } else {
                    (isRight ? left : right)[i].push(cell);
                }
            })
        });
        return {
            left: left,
            right: right
        }
    },

    _table: function () {
        return BI.createWidget({
            type: "bi.layout",
            tagName: "table",
            cls: "table",
            attribute: {"cellspacing": 0, "cellpadding": 0}
        });
    },

    _header: function () {
        return BI.createWidget({
            type: "bi.layout",
            cls: "header",
            tagName: "thead"
        });
    },

    _footer: function () {
        return BI.createWidget({
            type: "bi.layout",
            cls: "footer",
            tagName: "tfoot"
        });
    },

    _body: function () {
        return BI.createWidget({
            type: "bi.layout",
            tagName: "tbody",
            cls: "body"
        });
    },

    _colgroup: function () {
        return BI.createWidget({
            type: "bi.layout",
            tagName: "colgroup"
        });
    },

    _init: function () {
        BI.Table.superclass._init.apply(this, arguments);

        this.populate(this.options.items);
    },

    setColumnSize: function (columnSize) {
        var self = this, o = this.options;
        var isRight = this._isRightFreeze();
        o.columnSize = columnSize || [];
        if (o.isNeedFreeze) {
            var columnLeft = [];
            var columnRight = [];
            BI.each(o.columnSize, function (i, size) {
                if (o.freezeCols.contains(i)) {
                    isRight ? columnRight.push(size) : columnLeft.push(size);
                } else {
                    isRight ? columnLeft.push(size) : columnRight.push(size);
                }
            });
            var topleft = 0, topright = 1, bottomleft = 2, bottomright = 3;
            var run = function (direction) {
                var colgroupTds, bodyTds, bodyItems, sizes;
                switch (direction) {
                    case topleft:
                        colgroupTds = self.topLeftColGroupTds;
                        bodyTds = self.topLeftBodyTds;
                        bodyItems = self.topLeftBodyItems;
                        sizes = columnLeft;
                        break;
                    case topright:
                        colgroupTds = self.topRightColGroupTds;
                        bodyTds = self.topRightBodyTds;
                        bodyItems = self.topRightBodyItems;
                        sizes = columnRight;
                        break;
                    case bottomleft:
                        colgroupTds = self.bottomLeftColGroupTds;
                        bodyTds = self.bottomLeftBodyTds;
                        bodyItems = self.bottomLeftBodyItems;
                        sizes = columnLeft;
                        break;
                    case bottomright:
                        colgroupTds = self.bottomRightColGroupTds;
                        bodyTds = self.bottomRightBodyTds;
                        bodyItems = self.bottomRightBodyItems;
                        sizes = columnRight;
                        break;
                }
                BI.each(colgroupTds, function (i, colgroup) {
                    var width = colgroup.attr("width") | 0;
                    if (width !== sizes[i]) {
                        var w = self._calculateWidth(sizes[i]);
                        colgroup.attr("width", w).css("width", w);
                        BI.each(bodyTds, function (j, items) {
                            if (items[i]) {
                                if (items[i].__mergeCols.length > 1) {
                                    var wid = 0;
                                    BI.each(sizes, function (t, s) {
                                        if (items[i].__mergeCols.contains(t)) {
                                            wid += s;
                                        }
                                    });
                                    wid = self._calculateWidth(wid);
                                    if (wid > 1) {
                                        wid += items[i].__mergeCols.length - 1;
                                    }
                                    if (BI.isNumeric(wid)) {
                                        if (i == BI.size(items) - 1) {
                                            items[i].attr("width", wid - 1).css("width", wid - 1);
                                        } else {
                                            items[i].attr("width", wid).css("width", wid);
                                        }
                                    } else {
                                        items[i].attr("width", "").css("width", "");
                                    }
                                } else {
                                    if (i == BI.size(items) - 1) {
                                        items[i].attr("width", w - 1).css("width", w - 1);
                                    } else {
                                        items[i].attr("width", w).css("width", w);
                                    }
                                }
                            }
                        });
                        BI.each(bodyItems, function (j, items) {
                            if (items[i]) {
                                if (bodyTds[j][i].__mergeCols.length > 1) {
                                    var wid = 0;
                                    BI.each(sizes, function (t, s) {
                                        if (bodyTds[j][i].__mergeCols.contains(t)) {
                                            wid += s;
                                        }
                                    });
                                    wid = self._calculateWidth(wid);
                                    if (wid > 1) {
                                        wid += bodyTds[j][i].__mergeCols.length - 1;
                                    }
                                    if (BI.isNumeric(wid)) {
                                        if (i == BI.size(items) - 1) {
                                            items[i].element.attr("width", wid - 1).css("width", wid - 1);
                                        } else {
                                            items[i].element.attr("width", wid).css("width", wid);
                                        }
                                    } else {
                                        items[i].element.attr("width", "").css("width", "");
                                    }
                                } else {
                                    if (BI.isNumeric(w)) {
                                        if (i == BI.size(items) - 1) {
                                            items[i].element.attr("width", w - 1).css("width", w - 1);
                                        } else {
                                            items[i].element.attr("width", w).css("width", w);
                                        }
                                    } else {
                                        items[i].element.attr("width", "").css("width", "");
                                    }
                                }
                            }
                        });
                    }
                })
            };
            run(topleft);
            run(topright);
            run(bottomleft);
            run(bottomright);

            var lw = 0, rw = 0;
            this.columnLeft = [];
            this.columnRight = [];
            BI.each(o.columnSize, function (i, size) {
                if (o.freezeCols.contains(i)) {
                    lw += size;
                    self[isRight ? "columnRight" : "columnLeft"].push(size);
                } else {
                    rw += size;
                    self[isRight ? "columnLeft" : "columnRight"].push(size);
                }
            });
            lw = this._calculateWidth(lw);
            rw = this._calculateWidth(rw);

            if (BI.isNumeric(lw)) {
                lw = BI.parseFloat(lw) + o.freezeCols.length;
            }
            if (BI.isNumeric(rw)) {
                rw = BI.parseFloat(rw) + o.columnSize.length - o.freezeCols.length;
            }
            this.topLeftContainer.element.width(isRight ? rw : lw);
            this.bottomLeftContainer.element.width(isRight ? rw : lw);
            this.topRightContainer.element.width(isRight ? lw : rw);
            this.bottomRightContainer.element.width(isRight ? lw : rw);
            this.scrollTopLeft.element[0].scrollLeft = this.scrollBottomLeft.element[0].scrollLeft;
            this.scrollTopRight.element[0].scrollLeft = this.scrollBottomRight.element[0].scrollLeft;
            if (o.isNeedResize && o.isResizeAdapt) {
                var leftWidth = BI.sum(o.freezeCols, function (i, col) {
                    return o.columnSize[col] > 1 ? o.columnSize[col] + 1 : o.columnSize[col];
                });
                this.partitions.attr("columnSize", isRight ? ['fill', leftWidth] : [leftWidth, 'fill']);
                this.partitions.resize();
            }
        } else {
            BI.each(this.colgroupTds, function (i, colgroup) {
                var width = colgroup.attr("width") | 0;
                if (width !== o.columnSize[i]) {
                    var w = self._calculateWidth(o.columnSize[i]);
                    colgroup.attr("width", w).css("width", w);
                    BI.each(self.bodyTds, function (j, items) {
                        if (items[i]) {
                            if (items[i].__mergeCols.length > 1) {
                                var wid = 0;
                                BI.each(o.columnSize, function (t, s) {
                                    if (items[i].__mergeCols.contains(t)) {
                                        wid += s;
                                    }
                                });
                                wid = self._calculateWidth(wid);
                                if (wid > 1) {
                                    wid += items[i].__mergeCols.length - 1;
                                }
                                if (BI.isNumeric(wid)) {
                                    if (i == BI.size(items) - 1) {
                                        items[i].attr("width", w - 1).css("width", w - 1);
                                    } else {
                                        items[i].attr("width", w).css("width", w);
                                    }
                                } else {
                                    items[i].attr("width", "").css("width", "");
                                }
                            } else {
                                if (i == BI.size(items) - 1) {
                                    items[i].attr("width", w - 1).css("width", w - 1);
                                } else {
                                    items[i].attr("width", w).css("width", w);
                                }
                            }
                        }
                    });
                    BI.each(self.headerTds, function (j, items) {
                        if (items[i]) {
                            if (items[i].__mergeCols.length > 1) {
                                var wid = 0;
                                BI.each(o.columnSize, function (t, s) {
                                    if (items[i].__mergeCols.contains(t)) {
                                        wid += s;
                                    }
                                });
                                wid = self._calculateWidth(wid);
                                if (wid > 1) {
                                    wid += items[i].__mergeCols.length - 1;
                                }
                                if (BI.isNumeric(wid)) {
                                    if (i == BI.size(items) - 1) {
                                        items[i].attr("width", w - 1).css("width", w - 1);
                                    } else {
                                        items[i].attr("width", w).css("width", w);
                                    }
                                } else {
                                    items[i].attr("width", "").css("width", "");
                                }
                            } else {
                                if (i == BI.size(items) - 1) {
                                    items[i].attr("width", w - 1).css("width", w - 1);
                                } else {
                                    items[i].attr("width", w).css("width", w);
                                }
                            }
                        }
                    });
                    BI.each(self.footerTds, function (j, items) {
                        if (items[i]) {
                            if (items[i].__mergeCols.length > 1) {
                                var wid = 0;
                                BI.each(o.columnSize, function (t, s) {
                                    if (items[i].__mergeCols.contains(t)) {
                                        wid += s;
                                    }
                                });
                                wid = self._calculateWidth(wid);
                                if (wid > 1) {
                                    wid += items[i].__mergeCols.length - 1;
                                }
                                if (BI.isNumeric(wid)) {
                                    if (i == BI.size(items) - 1) {
                                        items[i].attr("width", w - 1).css("width", w - 1);
                                    } else {
                                        items[i].attr("width", w).css("width", w);
                                    }
                                } else {
                                    items[i].attr("width", "").css("width", "");
                                }
                            } else {
                                if (i == BI.size(items) - 1) {
                                    items[i].attr("width", w - 1).css("width", w - 1);
                                } else {
                                    items[i].attr("width", w).css("width", w);
                                }
                            }
                        }
                    });
                    BI.each(self.bodyItems, function (j, items) {
                        if (items[i]) {
                            if (self.bodyTds[j][i].__mergeCols.length > 1) {
                                var wid = 0;
                                BI.each(o.columnSize, function (t, s) {
                                    if (self.bodyTds[j][i].__mergeCols.contains(t)) {
                                        wid += s;
                                    }
                                });
                                wid = self._calculateWidth(wid);
                                if (wid > 1) {
                                    wid += self.bodyTds[j][i].__mergeCols.length - 1;
                                }
                                if (BI.isNumeric(wid)) {
                                    if (i == BI.size(items) - 1) {
                                        items[i].element.attr("width", wid - 1).css("width", wid - 1);
                                    } else {
                                        items[i].element.attr("width", wid).css("width", wid);
                                    }
                                } else {
                                    items[i].element.attr("width", "").css("width", "");
                                }
                            } else {
                                if (BI.isNumeric(w)) {
                                    if (i == BI.size(items) - 1) {
                                        items[i].element.attr("width", w - 1).css("width", w - 1);
                                    } else {
                                        items[i].element.attr("width", w).css("width", w);
                                    }
                                } else {
                                    items[i].element.attr("width", "").css("width", "");
                                }
                            }
                        }
                    });
                    BI.each(self.headerItems, function (j, items) {
                        if (items[i]) {
                            if (self.headerTds[j][i].__mergeCols.length > 1) {
                                var wid = 0;
                                BI.each(o.columnSize, function (t, s) {
                                    if (self.headerTds[j][i].__mergeCols.contains(t)) {
                                        wid += s;
                                    }
                                });
                                wid = self._calculateWidth(wid);
                                if (wid > 1) {
                                    wid += self.headerTds[j][i].__mergeCols.length - 1;
                                }
                                if (BI.isNumeric(wid)) {
                                    if (i == BI.size(items) - 1) {
                                        items[i].element.attr("width", wid - 1).css("width", wid - 1);
                                    } else {
                                        items[i].element.attr("width", wid).css("width", wid);
                                    }
                                } else {
                                    items[i].element.attr("width", "").css("width", "");
                                }
                            } else {
                                if (BI.isNumeric(w)) {
                                    if (i == BI.size(items) - 1) {
                                        items[i].element.attr("width", w - 1).css("width", w - 1);
                                    } else {
                                        items[i].element.attr("width", w).css("width", w);
                                    }
                                } else {
                                    items[i].element.attr("width", "").css("width", "");
                                }
                            }
                        }
                    });
                    BI.each(self.footerItems, function (j, items) {
                        if (items[i]) {
                            if (self.footerTds[j][i].__mergeCols.length > 1) {
                                var wid = 0;
                                BI.each(o.columnSize, function (t, s) {
                                    if (self.footerTds[j][i].__mergeCols.contains(t)) {
                                        wid += s;
                                    }
                                });
                                wid = self._calculateWidth(wid);
                                if (wid > 1) {
                                    wid += self.footerTds[j][i].__mergeCols.length - 1;
                                }
                                if (BI.isNumeric(wid)) {
                                    if (i == BI.size(items) - 1) {
                                        items[i].element.attr("width", wid - 1).css("width", wid - 1);
                                    } else {
                                        items[i].element.attr("width", wid).css("width", wid);
                                    }
                                } else {
                                    items[i].element.attr("width", "").css("width", "");
                                }
                            } else {
                                if (BI.isNumeric(w)) {
                                    if (i == BI.size(items) - 1) {
                                        items[i].element.attr("width", w - 1).css("width", w - 1);
                                    } else {
                                        items[i].element.attr("width", w).css("width", w);
                                    }
                                } else {
                                    items[i].element.attr("width", "").css("width", "");
                                }
                            }
                        }
                    });
                }
            });
            var w = this._calculateWidth(BI.sum(o.columnSize));
            if (w > 1.05) {
                w += o.columnSize.length;
            }
            this.tableContainer.element.width(w);
        }
    },

    getColumnSize: function () {
        return this.options.columnSize;
    },

    getCalculateColumnSize: function () {
        var self = this, o = this.options;
        var columnSize = [];
        if (o.isNeedFreeze === true) {
            if (BI.size(this.bottomLeftBodyTds) > 0 || BI.size(this.bottomRightBodyTds) > 0) {
                if (!BI.any(this.bottomLeftBodyTds, function (i, tds) {
                        if (!BI.any(tds, function (i, item) {
                                if (item.__mergeCols.length > 1) {
                                    return true;
                                }
                            })) {
                            BI.each(tds, function (i, item) {
                                var width = item.width() / item.__mergeCols.length;
                                if (i == BI.size(tds) - 1) {
                                    width++;
                                }
                                columnSize.push(width);
                            });
                            return true;
                        }
                    })) {
                    BI.each(this.bottomLeftBodyTds[0], function (i, item) {
                        var width = item.width() / item.__mergeCols.length;
                        if (i == BI.size(self.bottomLeftBodyTds[0]) - 1) {
                            width++;
                        }
                        columnSize.push(width);
                    });
                }
                if (!BI.any(this.bottomRightBodyTds, function (i, tds) {
                        if (!BI.any(tds, function (i, item) {
                                if (item.__mergeCols.length > 1) {
                                    return true;
                                }
                            })) {
                            BI.each(tds, function (i, item) {
                                var width = item.width() / item.__mergeCols.length;
                                if (i == BI.size(tds) - 1) {
                                    width++;
                                }
                                columnSize.push(width);
                            });
                            return true;
                        }
                    })) {
                    BI.each(this.bottomRightBodyTds[0], function (i, item) {
                        var width = item.width() / item.__mergeCols.length;
                        if (i == BI.size(self.bottomRightBodyTds[0]) - 1) {
                            width++;
                        }
                        columnSize.push(width);
                    });
                }
                return columnSize;
            }
            if (!BI.any(this.topLeftBodyTds, function (i, tds) {
                    if (!BI.any(tds, function (i, item) {
                            if (item.__mergeCols.length > 1) {
                                return true;
                            }
                        })) {
                        BI.each(tds, function (i, item) {
                            var width = item.width() / item.__mergeCols.length;
                            if (i == BI.size(tds) - 1) {
                                width++;
                            }
                            columnSize.push(width);
                        });
                        return true;
                    }
                })) {
                BI.each(this.topLeftBodyTds[BI.size(this.topLeftBodyTds) - 1], function (i, item) {
                    var width = item.width() / item.__mergeCols.length;
                    if (i == BI.size(self.topLeftBodyTds[BI.size(self.topLeftBodyTds) - 1]) - 1) {
                        width++;
                    }
                    columnSize.push(width);
                });
            }
            if (!BI.any(this.topRightBodyTds, function (i, tds) {
                    if (!BI.any(tds, function (i, item) {
                            if (item.__mergeCols.length > 1) {
                                return true;
                            }
                        })) {
                        BI.each(tds, function (i, item) {
                            var width = item.width() / item.__mergeCols.length;
                            if (i == BI.size(tds) - 1) {
                                width++;
                            }
                            columnSize.push(width);
                        });
                        return true;
                    }
                })) {
                BI.each(this.topRightBodyTds[BI.size(this.topRightBodyTds) - 1], function (i, item) {
                    var width = item.width() / item.__mergeCols.length;
                    if (i == BI.size(self.topRightBodyTds[BI.size(self.topRightBodyTds) - 1]) - 1) {
                        width++;
                    }
                    columnSize.push(width);
                });
            }
        } else {
            BI.each(this.headerTds[BI.size(this.headerTds) - 1], function (i, item) {
                var width = item.width() / item.__mergeCols.length;
                if (i == BI.size(self.headerTds[BI.size(self.headerTds) - 1]) - 1) {
                    width++;
                }
                columnSize.push(width);
            });
        }
        return columnSize;
    },

    setHeaderColumnSize: function (columnSize) {
        var self = this, o = this.options;
        var isRight = this._isRightFreeze();
        if (o.isNeedFreeze) {
            var columnLeft = [];
            var columnRight = [];
            BI.each(columnSize, function (i, size) {
                if (o.freezeCols.contains(i)) {
                    isRight ? columnRight.push(size) : columnLeft.push(size);
                } else {
                    isRight ? columnLeft.push(size) : columnRight.push(size);
                }
            });
            var topleft = 0, topright = 1;
            var run = function (direction) {
                var colgroupTds, bodyTds, bodyItems, sizes;
                switch (direction) {
                    case topleft:
                        colgroupTds = self.topLeftColGroupTds;
                        bodyTds = self.topLeftBodyTds;
                        bodyItems = self.topLeftBodyItems;
                        sizes = columnLeft;
                        break;
                    case topright:
                        colgroupTds = self.topRightColGroupTds;
                        bodyTds = self.topRightBodyTds;
                        bodyItems = self.topRightBodyItems;
                        sizes = columnRight;
                        break;
                }
                BI.each(colgroupTds, function (i, colgroup) {
                    var width = colgroup.attr("width") | 0;
                    if (width !== sizes[i]) {
                        var w = self._calculateWidth(sizes[i]);
                        colgroup.attr("width", w).css("width", w);
                        BI.each(bodyTds, function (j, items) {
                            if (items[i]) {
                                if (items[i].__mergeCols.length > 1) {
                                    var wid = 0;
                                    BI.each(sizes, function (t, s) {
                                        if (items[i].__mergeCols.contains(t)) {
                                            wid += s;
                                        }
                                    });
                                    wid = self._calculateWidth(wid);
                                    if (wid > 1) {
                                        wid += items[i].__mergeCols.length - 1;
                                    }
                                    if (BI.isNumeric(wid)) {
                                        if (i == BI.size(items) - 1) {
                                            items[i].attr("width", wid - 1).css("width", wid - 1);
                                        } else {
                                            items[i].attr("width", wid).css("width", wid);
                                        }
                                    } else {
                                        items[i].attr("width", "").css("width", "");
                                    }
                                } else {
                                    if (i == BI.size(items) - 1) {
                                        items[i].attr("width", w - 1).css("width", w - 1);
                                    } else {
                                        items[i].attr("width", w).css("width", w);
                                    }
                                }
                            }
                        });
                        BI.each(bodyItems, function (j, items) {
                            if (items[i]) {
                                if (bodyTds[j][i].__mergeCols.length > 1) {
                                    var wid = 0;
                                    BI.each(sizes, function (t, s) {
                                        if (bodyTds[j][i].__mergeCols.contains(t)) {
                                            wid += s;
                                        }
                                    });
                                    wid = self._calculateWidth(wid);
                                    if (wid > 1) {
                                        wid += bodyTds[j][i].__mergeCols.length - 1;
                                    }
                                    if (BI.isNumeric(wid)) {
                                        if (i == BI.size(items) - 1) {
                                            items[i].element.attr("width", wid - 1).css("width", wid - 1);
                                        } else {
                                            items[i].element.attr("width", wid).css("width", wid);
                                        }
                                    } else {
                                        items[i].element.attr("width", "").css("width", "");
                                    }
                                } else {
                                    if (BI.isNumeric(w)) {
                                        if (i == BI.size(items) - 1) {
                                            items[i].element.attr("width", w - 1).css("width", w - 1);
                                        } else {
                                            items[i].element.attr("width", w).css("width", w);
                                        }
                                    } else {
                                        items[i].element.attr("width", "").css("width", "");
                                    }
                                }
                            }
                        });
                    }
                })
            };
            run(topleft);
            run(topright);

            var lw = 0, rw = 0;
            BI.each(columnSize, function (i, size) {
                if (o.freezeCols.contains(i)) {
                    lw += size;
                } else {
                    rw += size;
                }
            });
            lw = this._calculateWidth(lw);
            rw = this._calculateWidth(rw);

            if (BI.isNumeric(lw)) {
                lw = BI.parseFloat(lw) + o.freezeCols.length;
            }
            if (BI.isNumeric(rw)) {
                rw = BI.parseFloat(rw) + columnSize.length - o.freezeCols.length;
            }
            this.topLeftContainer.element.width(isRight ? rw : lw);
            this.topRightContainer.element.width(isRight ? lw : rw);
            this.scrollTopLeft.element[0].scrollLeft = this.scrollBottomLeft.element[0].scrollLeft;
            this.scrollTopRight.element[0].scrollLeft = this.scrollBottomRight.element[0].scrollLeft;
            if (o.isNeedResize && o.isResizeAdapt) {
                var leftWidth = BI.sum(o.freezeCols, function (i, col) {
                    return columnSize[col] > 1 ? columnSize[col] + 1 : columnSize[col];
                });
                this.partitions.attr("columnSize", isRight ? ['fill', leftWidth] : [leftWidth, 'fill']);
                this.partitions.resize();
            }
        } else {
            BI.each(this.colgroupTds, function (i, colgroup) {
                var width = colgroup.attr("width") | 0;
                if (width !== columnSize[i]) {
                    var w = self._calculateWidth(columnSize[i]);
                    colgroup.attr("width", w).css("width", w);
                    BI.each(self.headerTds, function (j, items) {
                        if (items[i]) {
                            if (items[i].__mergeCols.length > 1) {
                                var wid = 0;
                                BI.each(columnSize, function (t, s) {
                                    if (items[i].__mergeCols.contains(t)) {
                                        wid += s;
                                    }
                                });
                                wid = self._calculateWidth(wid);
                                if (wid > 1) {
                                    wid += items[i].__mergeCols.length - 1;
                                }
                                if (BI.isNumeric(wid)) {
                                    if (i == BI.size(items) - 1) {
                                        items[i].element.attr("width", wid - 1).css("width", wid - 1);
                                    } else {
                                        items[i].element.attr("width", wid).css("width", wid);
                                    }
                                } else {
                                    items[i].attr("width", "").css("width", "");
                                }
                            } else {
                                if (i == BI.size(items) - 1) {
                                    items[i].attr("width", w - 1).css("width", w - 1);
                                } else {
                                    items[i].attr("width", w).css("width", w);
                                }
                            }
                        }
                    });
                    BI.each(self.headerItems, function (j, items) {
                        if (items[i]) {
                            if (self.headerTds[j][i].__mergeCols.length > 1) {
                                var wid = 0;
                                BI.each(columnSize, function (t, s) {
                                    if (self.headerTds[j][i].__mergeCols.contains(t)) {
                                        wid += s;
                                    }
                                });
                                wid = self._calculateWidth(wid);
                                if (wid > 1) {
                                    wid += self.headerTds[j][i].__mergeCols.length - 1;
                                }
                                if (BI.isNumeric(wid)) {
                                    if (i == BI.size(items) - 1) {
                                        items[i].element.attr("width", wid - 1).css("width", wid - 1);
                                    } else {
                                        items[i].element.attr("width", wid).css("width", wid);
                                    }
                                } else {
                                    items[i].element.attr("width", "").css("width", "");
                                }
                            } else {
                                if (BI.isNumeric(w)) {
                                    if (i == BI.size(items) - 1) {
                                        items[i].element.attr("width", w - 1).css("width", w - 1);
                                    } else {
                                        items[i].element.attr("width", w).css("width", w);
                                    }
                                } else {
                                    items[i].element.attr("width", "").css("width", "");
                                }
                            }
                        }
                    });
                }
            });
            var cW = this._calculateWidth(BI.sum(columnSize));
            if (cW > 1.05) {
                cW = cW + columnSize.length;
            }
            this.tableContainer.element.width(cW);
        }
    },

    setRegionColumnSize: function (columnSize) {
        var self = this, o = this.options;
        o.regionColumnSize = columnSize;
        if (o.freezeCols.length === 0) {
            if (o.isNeedFreeze) {
                this.partitions.attr("columnSize", this._isRightFreeze() ? ['fill', 0] : [0, 'fill']);
                this.partitions.resize();
            } else {
                this.tableContainer.element.width(columnSize[0]);
            }
        } else if (o.freezeCols.length > 0 && o.freezeCols.length < o.columnSize.length) {
            if (o.isNeedFreeze) {
                this.partitions.attr("columnSize", columnSize);
                this.partitions.resize();
            } else {
                this.tableContainer.element.width(columnSize[0]);
            }
        } else {
            if (o.isNeedFreeze) {
                this.partitions.attr("columnSize", this._isRightFreeze() ? [0, 'fill'] : ['fill', 0]);
                this.partitions.resize();
            } else {
                this.tableContainer.element.width(columnSize[0]);
            }
        }
    },

    getRegionColumnSize: function () {
        return this.options.regionColumnSize;
    },

    getCalculateRegionColumnSize: function () {
        var o = this.options;
        if (o.isNeedFreeze) {
            return [this.scrollBottomLeft.element.width(), this.scrollBottomRight.element.width()];
        }
        return [this.scrollBottomRight.element.width()];
    },

    getCalculateRegionRowSize: function () {
        var o = this.options;
        if (o.isNeedFreeze) {
            return [this.scrollTopRight.element.height(), this.scrollBottomRight.element.height()];
        }
        return [this.scrollBottomRight.element.height()];
    },

    getClientRegionColumnSize: function () {
        var o = this.options;
        if (o.isNeedFreeze) {
            return [this.scrollBottomLeft.element[0].clientWidth, this.scrollBottomRight.element[0].clientWidth];
        }
        return [this.scrollBottomRight.element[0].clientWidth];
    },

    getClientRegionRowSize: function () {
        var o = this.options;
        if (o.isNeedFreeze) {
            return [this.scrollBottomLeft.element[0].clientHeight, this.scrollBottomRight.element[0].clientHeight];
        }
        return [this.scrollBottomRight.element[0].clientHeight];
    },

    getScrollRegionColumnSize: function () {
        var o = this.options;
        if (o.isNeedFreeze) {
            return [this.scrollBottomLeft.element[0].scrollWidth, this.scrollBottomRight.element[0].scrollWidth];
        }
        return [this.scrollBottomRight.element[0].scrollWidth];
    },

    getScrollRegionRowSize: function () {
        var o = this.options;
        if (o.isNeedFreeze) {
            if (o.freezeCols.length < o.columnSize.length) {
                return [this.scrollTopRight.element[0].scrollHeight, this.scrollBottomRight.element[0].scrollHeight];
            } else {
                return [this.scrollTopLeft.element[0].scrollHeight, this.scrollBottomLeft.element[0].scrollHeight];
            }
        }
        return [this.scrollBottomRight.element[0].scrollHeight];
    },

    hasVerticalScroll: function () {
        var o = this.options;
        if (o.isNeedFreeze) {
            return this.scrollBottomRight.element.hasVerticalScroll() || this.scrollBottomLeft.element.hasVerticalScroll();
        }
        return this.scrollBottomRight.element.hasVerticalScroll();
    },

    setVerticalScroll: function (scrollTop) {
        var o = this.options;
        if (o.isNeedFreeze) {
            if (this.scrollBottomRight.element[0].scrollTop !== scrollTop) {
                this.scrollBottomRight.element[0].scrollTop = scrollTop;
            }
            if (this.scrollBottomLeft.element[0].scrollTop !== scrollTop) {
                this.scrollBottomLeft.element[0].scrollTop = scrollTop;
            }
        } else {
            if (this.scrollBottomRight.element[0].scrollTop !== scrollTop) {
                this.scrollBottomRight.element[0].scrollTop = scrollTop;
            }
        }
    },

    setLeftHorizontalScroll: function (scrollLeft) {
        var o = this.options;
        if (o.isNeedFreeze) {
            if (this.scrollBottomLeft.element[0].scrollLeft !== scrollLeft) {
                this.scrollBottomLeft.element[0].scrollLeft = scrollLeft;
            }
            if (this.scrollTopLeft.element[0].scrollLeft !== scrollLeft) {
                this.scrollTopLeft.element[0].scrollLeft = scrollLeft;
            }
        } else {
            if (this.scrollBottomRight.element[0].scrollLeft !== scrollLeft) {
                this.scrollBottomRight.element[0].scrollLeft = scrollLeft;
            }
        }
    },

    setRightHorizontalScroll: function (scrollLeft) {
        var o = this.options;
        if (o.isNeedFreeze) {
            if (this.scrollBottomRight.element[0].scrollLeft !== scrollLeft) {
                this.scrollBottomRight.element[0].scrollLeft = scrollLeft;
            }
            if (this.scrollTopRight.element[0].scrollLeft !== scrollLeft) {
                this.scrollTopRight.element[0].scrollLeft = scrollLeft;
            }
        } else {
            if (this.scrollBottomRight.element[0].scrollLeft !== scrollLeft) {
                this.scrollBottomRight.element[0].scrollLeft = scrollLeft;
            }
        }
    },

    getVerticalScroll: function () {
        var o = this.options;
        if (o.isNeedFreeze) {
            return this.scrollBottomRight.element[0].scrollTop || this.scrollBottomLeft.element[0].scrollTop;
        }
        return this.scrollBottomRight.element[0].scrollTop;
    },

    getLeftHorizontalScroll: function () {
        var o = this.options;
        if (o.isNeedFreeze) {
            return this.scrollBottomLeft.element[0].scrollLeft;
        }
        return this.scrollBottomRight.element[0].scrollLeft;
    },

    getRightHorizontalScroll: function () {
        var o = this.options;
        if (o.isNeedFreeze) {
            return this.scrollBottomRight.element[0].scrollLeft;
        }
        return this.scrollBottomRight.element[0].scrollLeft;
    },

    getColumns: function () {
        var o = this.options;
        if (o.isNeedFreeze) {
            return {
                topLeft: this.topLeftBodyItems,
                topRight: this.topRightBodyItems,
                bottomLeft: this.bottomLeftBodyItems,
                bottomRight: this.bottomRightBodyItems
            }
        } else {
            return {
                header: this.headerItems,
                body: this.bodyItems,
                footer: this.footerItems
            }
        }
    },

    populate: function (items, header) {
        this.options.items = items || [];
        if (header) {
            this.options.header = header;
        }
        this.empty();
        if (this.options.isNeedFreeze) {
            this._createFreezeTable();
        } else {
            this._createNormalTable();
        }
    },

    empty: function () {
        BI.Resizers.remove(this.getName());
        BI.Table.superclass.empty.apply(this, arguments);
    },

    destroy: function () {
        BI.Table.superclass.destroy.apply(this, arguments);
    }
})
;
BI.Table.EVENT_TABLE_AFTER_INIT = "EVENT_TABLE_AFTER_INIT";
BI.Table.EVENT_TABLE_RESIZE = "EVENT_TABLE_RESIZE";
BI.Table.EVENT_TABLE_SCROLL = "EVENT_TABLE_SCROLL";
BI.Table.EVENT_TABLE_BEFORE_COLUMN_RESIZE = "EVENT_TABLE_BEFORE_COLUMN_RESIZE";
BI.Table.EVENT_TABLE_COLUMN_RESIZE = "EVENT_TABLE_COLUMN_RESIZE";
BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE = "EVENT_TABLE_AFTER_COLUMN_RESIZE";

BI.Table.EVENT_TABLE_BEFORE_REGION_RESIZE = "EVENT_TABLE_BEFORE_REGION_RESIZE";
BI.Table.EVENT_TABLE_REGION_RESIZE = "EVENT_TABLE_REGION_RESIZE";
BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE = "EVENT_TABLE_AFTER_REGION_RESIZE";
$.shortcut("bi.table_view", BI.Table);
