/**
 * 自适应布局
 *
 * 1、resize
 * 2、吸附
 * 3、当前组件在最上方
 * 4、可以撤销
 * 5、上下之间插入组件
 *
 * Created by GUY on 2016/2/23.
 * @class BI.AdaptiveArrangement
 * @extends BI.Widget
 */
BI.AdaptiveArrangement = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.AdaptiveArrangement.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-adaptive-arrangement",
            resizable: true,
            layoutType: BI.Arrangement.LAYOUT_TYPE.FREE,
            items: []
        });
    },

    _init: function () {
        BI.AdaptiveArrangement.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.arrangement = BI.createWidget({
            type: "bi.arrangement",
            element: this,
            layoutType: o.layoutType,
            items: o.items
        });
        this.arrangement.on(BI.Arrangement.EVENT_SCROLL, function () {
            self.fireEvent(BI.AdaptiveArrangement.EVENT_SCROLL, arguments);
        });
        this.zIndex = 0;
        BI.each(o.items, function (i, item) {
            self._initResizable(item.el);
        });

        this.element.mousedown(function (e) {
            BI.each(self.getAllRegions(), function (i, region) {
                if (!region.el.element.__isMouseInBounds__(e)) {
                    region.el.element.removeClass("selected");
                }
            });
        });
        BI.ResizeDetector.addResizeListener(this, function () {
            self.arrangement.resize();
            self.fireEvent(BI.AdaptiveArrangement.EVENT_RESIZE);
        });
    },

    _isEqual: function () {
        return this.arrangement._isEqual.apply(this.arrangement, arguments);
    },

    _setSelect: function (item) {
        if (!item.element.hasClass("selected")) {
            item.element.css("zIndex", ++this.zIndex);
            BI.each(this.getAllRegions(), function (i, region) {
                region.el.element.removeClass("selected");
            });
            item.element.addClass("selected");
        }
    },

    _initResizable: function (item) {
        var self = this, o = this.options;
        item.element.css("zIndex", ++this.zIndex);
        item.element.mousedown(function () {
            self._setSelect(item)
        });
        // o.resizable && item.element.resizable({
        //     handles: "e, s, se",
        //     minWidth: 20,
        //     minHeight: 20,
        //     autoHide: true,
        //     helper: "bi-resizer",
        //     start: function () {
        //         item.element.css("zIndex", ++self.zIndex);
        //         self.fireEvent(BI.AdaptiveArrangement.EVENT_ELEMENT_START_RESIZE);
        //     },
        //     resize: function (e, ui) {
        //         // self._resize(item.attr("id"), ui.size);
        //         self._resize(item.attr("id"), e, ui.size, ui.position);
        //     },
        //     stop: function (e, ui) {
        //         self._stopResize(item.attr("id"), ui.size);
        //         self.fireEvent(BI.AdaptiveArrangement.EVENT_ELEMENT_STOP_RESIZE, item.attr("id"), ui.size);
        //         self.fireEvent(BI.AdaptiveArrangement.EVENT_RESIZE);
        //     }
        // });
    },

    // _resize: function (name, e, size, position) {
    //     var self = this;
    //     this.scrollInterval(e, false, true, function (changedSize) {
    //         size.width += changedSize.offsetX;
    //         size.height += changedSize.offsetY;
    //         var containerWidth = self.arrangement.container.element.width();
    //         var containerHeight = self.arrangement.container.element.height();
    //         self.arrangement.container.element.width(containerWidth + changedSize.offsetX);
    //         self.arrangement.container.element.height(containerHeight + changedSize.offsetY);
    //         switch (self.getLayoutType()) {
    //             case BI.Arrangement.LAYOUT_TYPE.FREE:
    //                 break;
    //             case BI.Arrangement.LAYOUT_TYPE.GRID:
    //                 self.setRegionSize(name, size);
    //                 break;
    //         }
    //         self.fireEvent(BI.AdaptiveArrangement.EVENT_ELEMENT_RESIZE, name, size);
    //     });
    // },
    //
    // _stopResize: function (name, size) {
    //     var self = this;
    //     this.scrollEnd();
    //     switch (this.getLayoutType()) {
    //         case BI.Arrangement.LAYOUT_TYPE.FREE:
    //             this.setRegionSize(name, size);
    //             break;
    //         case BI.Arrangement.LAYOUT_TYPE.GRID:
    //             this.setRegionSize(name, size);
    //             break;
    //     }
    // },

    _getScrollOffset: function () {
        return this.arrangement._getScrollOffset();
    },

    getClientWidth: function () {
        return this.arrangement.getClientWidth();
    },

    getClientHeight: function () {
        return this.arrangement.getClientHeight();
    },

    addRegion: function (region, position) {
        this._initResizable(region.el);
        this._setSelect(region.el);
        var self = this, flag;
        var old = this.arrangement.getAllRegions();
        if (flag = this.arrangement.addRegion(region, position)) {
            this._old = old;
        }
        return flag;
    },

    deleteRegion: function (name) {
        var flag;
        var old = this.getAllRegions();
        if (flag = this.arrangement.deleteRegion(name)) {
            this._old = old;
        } else {
            this._old = this.getAllRegions();
            this.relayout();
        }
        return flag;
    },

    setRegionSize: function (name, size) {
        var flag;
        var old = this.getAllRegions();
        if (flag = this.arrangement.setRegionSize(name, size)) {
            this._old = old;
        }
        return flag;
    },

    setPosition: function (position, size) {
        var self = this;
        return this.arrangement.setPosition(position, size);
    },

    setRegionPosition: function (name, position) {
        var region = this.getRegionByName(name);
        return this.arrangement.setRegionPosition(name, position);
    },

    setDropPosition: function (position, size) {
        return this.arrangement.setDropPosition(position, size);
    },

    scrollInterval: function (e, isBorderScroll, isOverflowScroll, cb) {
        var self = this;
        var map = {
            top: [-1, 0],
            bottom: [1, 0],
            left: [0, -1],
            right: [0, 1]
        };
        var clientSize = this.element.bounds();

        function scrollTo(direction, callback) {
            if (direction === "") {
                self.lastActiveRegion = "";
                if (self._scrollInterval) {
                    clearInterval(self._scrollInterval);
                    self._scrollInterval = null;
                }
                return;
            }
            if (self.lastActiveRegion !== direction) {
                self.lastActiveRegion = direction;
                if (self._scrollInterval) {
                    clearInterval(self._scrollInterval);
                    self._scrollInterval = null;
                }
                self._scrollInterval = setInterval(function () {
                    var offset = self._getScrollOffset();
                    var t = offset.top + map[direction][0] * 40;
                    var l = offset.left + map[direction][1] * 40;
                    if (t < 0 || l < 0) {
                        return;
                    }
                    callback({
                        offsetX: map[direction][1] * 40,
                        offsetY: map[direction][0] * 40
                    });
                    self.scrollTo({
                        top: t,
                        left: l
                    });
                }, 300);
            }
        }

        cb({
            offsetX: 0,
            offsetY: 0
        });
        var offset = this.element.offset();
        var p = {
            left: e.pageX - offset.left,
            top: e.pageY - offset.top
        };
        //向上滚
        if (isBorderScroll && p.top >= 0 && p.top <= 30) {
            scrollTo("top", cb)
        }
        //向下滚
        else if (isBorderScroll && p.top >= clientSize.height - 30 && p.top <= clientSize.height) {
            scrollTo("bottom", cb)
        }
        //向左滚
        else if (isBorderScroll && p.left >= 0 && p.left <= 30) {
            scrollTo("left", cb)
        }
        //向右滚
        else if (isBorderScroll && p.left >= clientSize.width - 30 && p.left <= clientSize.width) {
            scrollTo("right", cb)
        } else {
            if (isOverflowScroll === true) {
                if (p.top < 0) {
                    scrollTo("top", cb);
                }
                else if (p.top > clientSize.height) {
                    scrollTo("bottom", cb);
                }
                else if (p.left < 0) {
                    scrollTo("left", cb);
                }
                else if (p.left > clientSize.width) {
                    scrollTo("right", cb);
                } else {
                    scrollTo("", cb);
                }
            } else {
                scrollTo("", cb);
            }
        }
    },

    scrollEnd: function () {
        this.lastActiveRegion = "";
        if (this._scrollInterval) {
            clearInterval(this._scrollInterval);
            this._scrollInterval = null;
        }
    },

    scrollTo: function (scroll) {
        this.arrangement.scrollTo(scroll);
    },

    zoom: function (ratio) {
        this.arrangement.zoom(ratio);
    },

    resize: function () {
        this.arrangement.resize();
    },

    relayout: function () {
        return this.arrangement.relayout();
    },

    setLayoutType: function (type) {
        var self = this;
        this.arrangement.setLayoutType(type);
    },

    getLayoutType: function () {
        return this.arrangement.getLayoutType();
    },

    getLayoutRatio: function () {
        return this.arrangement.getLayoutRatio();
    },

    getHelper: function () {
        return this.arrangement.getHelper();
    },

    getRegionByName: function (name) {
        return this.arrangement.getRegionByName(name);
    },

    getAllRegions: function () {
        return this.arrangement.getAllRegions();
    },

    revoke: function () {
        if (this._old) {
            this.populate(BI.toArray(this._old));
        }
    },

    populate: function (items) {
        var self = this;
        BI.each(items, function (i, item) {
            self._initResizable(item.el);
        });
        this.arrangement.populate(items);
    }
});
BI.AdaptiveArrangement.EVENT_ELEMENT_START_RESIZE = "AdaptiveArrangement.EVENT_ELEMENT_START_RESIZE";
BI.AdaptiveArrangement.EVENT_ELEMENT_RESIZE = "AdaptiveArrangement.EVENT_ELEMENT_RESIZE";
BI.AdaptiveArrangement.EVENT_ELEMENT_STOP_RESIZE = "AdaptiveArrangement.EVENT_ELEMENT_STOP_RESIZE";
BI.AdaptiveArrangement.EVENT_RESIZE = "AdaptiveArrangement.EVENT_RESIZE";
BI.AdaptiveArrangement.EVENT_SCROLL = "AdaptiveArrangement.EVENT_SCROLL";
BI.shortcut('bi.adaptive_arrangement', BI.AdaptiveArrangement);