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
            isNeedReLayout: true,
            isNeedResizeContainer: true,
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
            isNeedReLayout: o.isNeedReLayout,
            layoutType: o.layoutType,
            items: o.items
        });
        if (o.isNeedResizeContainer) {

            var isResizing = false;
            var height;
            var interval;
            var resize = function (e, ui) {
                if (isResizing) {
                    return;
                }
                isResizing = true;
                height = ui.size.height;
                interval = setInterval(function () {
                    height += 40;
                    self.arrangement.setContainerSize({
                        width: ui.size.width,
                        height: height
                    });
                    self.arrangement.scrollTo(height);
                }, 500);
            };
            this.arrangement.container.element.resizable({
                handles: "s",
                minWidth: 100,
                minHeight: 20,
                helper: "bi-resizer",
                autoHide: true,
                resize: function (e, ui) {
                    if (ui.size.height >= self.arrangement.container.element.height()) {
                        resize(e, ui);
                    } else {
                        interval && clearInterval(interval);
                    }
                },
                stop: function (e, ui) {
                    var size = ui.size;
                    if (isResizing) {
                        size.height = height;
                    }
                    self.arrangement.setContainerSize(ui.size);
                    isResizing = false;
                    interval && clearInterval(interval);
                    self.fireEvent(BI.AdaptiveArrangement.EVENT_RESIZE);
                }
            });
            this._setLayoutType(o.layoutType);
        }
        this.zIndex = 0;
        BI.each(o.items, function (i, item) {
            self._initResizable(item.el);
        });

        this.element.click(function (e) {
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

    _initResizable: function (item) {
        var self = this, o = this.options;
        item.element.css("zIndex", ++this.zIndex);
        item.element.mousedown(function () {
            if (!item.element.hasClass("selected")) {
                item.element.css("zIndex", ++self.zIndex);
                BI.each(self.getAllRegions(), function (i, region) {
                    region.el.element.removeClass("selected");
                });
                item.element.addClass("selected");
            }
        });
        o.resizable && item.element.resizable({
            handles: "e, s, se",
            minWidth: 20,
            minHeight: 20,
            autoHide: true,
            helper: "bi-resizer",
            start: function () {
                item.element.css("zIndex", ++self.zIndex);
                self.fireEvent(BI.AdaptiveArrangement.EVENT_ELEMENT_START_RESIZE);
            },
            resize: function (e, ui) {
                // self._resize(item.attr("id"), ui.size);
                self._resize(item.attr("id"), ui.size);
                self.fireEvent(BI.AdaptiveArrangement.EVENT_ELEMENT_RESIZE, item.attr("id"), ui.size);
            },
            stop: function (e, ui) {
                self._stopResize(item.attr("id"), ui.size);
                self.fireEvent(BI.AdaptiveArrangement.EVENT_ELEMENT_STOP_RESIZE, item.attr("id"), ui.size);
                self.fireEvent(BI.AdaptiveArrangement.EVENT_RESIZE);
            }
        });
    },

    _resize: function (name, size) {
        var self = this;
        switch (this.getLayoutType()) {
            case BI.Arrangement.LAYOUT_TYPE.ADAPTIVE:
                break;
            case BI.Arrangement.LAYOUT_TYPE.FREE:
                break;
            case BI.Arrangement.LAYOUT_TYPE.GRID:
                this.setRegionSize(name, size);
                break;
        }
    },

    _stopResize: function (name, size) {
        var self = this;
        switch (this.getLayoutType()) {
            case BI.Arrangement.LAYOUT_TYPE.ADAPTIVE:
                this.setRegionSize(name, {
                    width: size.width,
                    height: size.height
                });
                break;
            case BI.Arrangement.LAYOUT_TYPE.FREE:
                this.setRegionSize(name, size);
                break;
            case BI.Arrangement.LAYOUT_TYPE.GRID:
                this.setRegionSize(name, size);
                break;
        }
    },

    //检查宽高是否规范
    _checkRegionSize: function (name, size) {
        var self = this;
        switch (this.getLayoutType()) {
            case BI.Arrangement.LAYOUT_TYPE.ADAPTIVE:
                var newSize = {};
                var leftid, rightid, topid, bottomid;
                var region = this.getRegionByName(name);
                var rs = this.arrangement._getInDirectRelativeRegions(name, ["right"]).right;
                var bs = this.arrangement._getInDirectRelativeRegions(name, ["bottom"]).bottom;
                if (rs.left.length > 0) {
                    topid = BI.first(rs.left).id;
                    bottomid = BI.last(rs.left).id;
                }
                if (bs.top.length > 0) {
                    leftid = BI.first(bs.top).id;
                    rightid = BI.last(bs.top).id;
                }
                if (this.arrangement._isEqual(region.width, size.width)) {
                    topid = name;
                    bottomid = name;
                }
                if (this.arrangement._isEqual(region.height, size.height)) {
                    leftid = name;
                    rightid = name;
                }
                var tops = topid ? this.getDirectRelativeRegions(topid, ["top"]).top : [];
                var bottoms = bottomid ? this.getDirectRelativeRegions(bottomid, ["bottom"]).bottom : [];
                var lefts = leftid ? this.getDirectRelativeRegions(leftid, ["left"]).left : [];
                var rights = rightid ? this.getDirectRelativeRegions(rightid, ["right"]).right : [];
                if (region.width !== size.width) {
                    if (rights.length === 0) {//最右边的组件不能调整宽度
                        newSize.width = region.width;
                    } else {
                        var finded = BI.find(tops.concat(bottoms), function (i, r) {
                            r = self.getRegionByName(r.id);
                            return Math.abs(size.width + region.left - (r.left + r.width)) <= 3;
                        });
                        if (finded) {
                            finded = this.getRegionByName(finded.id);
                            newSize.width = finded.left + finded.width - region.left;
                        } else {
                            newSize.width = size.width;
                        }
                    }
                } else {
                    newSize.width = size.width;
                }
                if (region.height !== size.height) {
                    if (bottoms.length === 0) {
                        newSize.height = region.height;
                    } else {
                        var finded = BI.find(lefts.concat(rights), function (i, r) {
                            r = self.getRegionByName(r.id);
                            return Math.abs(size.height + region.top - (r.top + r.height)) <= 3;
                        });
                        if (finded) {
                            finded = this.getRegionByName(finded.id);
                            newSize.height = finded.top + finded.height - region.top;
                        } else {
                            newSize.height = size.height;
                        }
                    }
                } else {
                    newSize.height = size.height;
                }
                return newSize;
            case BI.Arrangement.LAYOUT_TYPE.FREE:
                return size;
            case BI.Arrangement.LAYOUT_TYPE.GRID:
                return size;
        }
    },

    _getScrollOffset: function () {
        return this.arrangement._getScrollOffset();
    },

    _setLayoutType: function (type) {
        try {
            //BI.nextTick(function () {
            switch (type) {
                case BI.Arrangement.LAYOUT_TYPE.ADAPTIVE:
                    $(">.ui-resizable-s", this.arrangement.container.element).css("zIndex", "");
                    break;
                case BI.Arrangement.LAYOUT_TYPE.FREE:
                    $(">.ui-resizable-s", this.arrangement.container.element).css("zIndex", "-1");
                    break;
                case BI.Arrangement.LAYOUT_TYPE.GRID:
                    $(">.ui-resizable-s", this.arrangement.container.element).css("zIndex", "-1");
                    break;
            }
            this.arrangement.container.element.resizable("option", "disabled", type === BI.Arrangement.LAYOUT_TYPE.FREE);
            //});
        } catch (e) {

        }
    },

    getClientWidth: function () {
        return this.arrangement.getClientWidth();
    },

    getClientHeight: function () {
        return this.arrangement.getClientHeight();
    },

    getDirectRelativeRegions: function (name, direction) {
        return this.arrangement.getDirectRelativeRegions(name, direction);
    },

    addRegion: function (region, position) {
        this._initResizable(region.el);
        var self = this, flag;
        var old = this.arrangement.getAllRegions();
        if (BI.isNotNull(this.position)) {
            switch (this.getLayoutType()) {
                case BI.Arrangement.LAYOUT_TYPE.ADAPTIVE:
                    var type = this.position.type;
                    var current = this.position.region;
                    switch (type) {
                        case "top-gap":
                            var t = this.arrangement._getEquivalentRelativeRegions(current.id, ["top"])[0];
                            current = this.getRegionByName(t.id);
                            break;
                        case "bottom-gap":
                            break;
                    }
                    var id = BI.UUID();
                    var insert = this.position.insert;
                    if (insert.height > 0) {
                        var clone = this.arrangement._cloneRegion();
                        //找到最下面的组件
                        var occupied = this.arrangement._getRegionOccupied();
                        var bottomRegions = [];
                        BI.each(clone, function (i, region) {
                            if (self.arrangement._isEqual(region.top + region.height, occupied.top + occupied.height)) {
                                bottomRegions.push(region);
                            }
                        });
                        var bs = this.arrangement._getInDirectRelativeRegions(current.id, ["bottom"]).bottom;
                        var seen = [current.id];
                        var bottoms = bs.bottom;
                        var occ = this.arrangement._getRegionOccupied(bottoms);
                        clone[id] = BI.extend({}, region, {
                            left: occ.left,
                            width: occ.width,
                            top: current.top + current.height,
                            height: insert.height
                        });
                        while (bottoms.length > 0) {
                            BI.each(bottoms, function (i, bottom) {
                                seen.push(bottom.id);
                                var r = self.getRegionByName(bottom.id);
                                BI.extend(clone[bottom.id], {
                                    top: r.top + insert.height
                                });
                            });
                            var t = [];
                            BI.each(bottoms, function (i, bottom) {
                                var n = self.arrangement._getInDirectRelativeRegions(bottom.id, ["bottom"]).bottom;
                                BI.each(n.top, function (i, region) {
                                    if (!seen.contains(region.id)) {
                                        seen.push(region.id);
                                        var r = self.getRegionByName(region.id);
                                        BI.extend(clone[region.id], {
                                            height: r.height + insert.height
                                        });
                                    }
                                });
                                t = t.concat(n.bottom);
                            });
                            t = BI.uniq(t, function (i, region) {
                                return region.id;
                            });
                            bottoms = t;
                        }
                        BI.each(bottomRegions, function (i, region) {
                            if (!seen.contains(region.id)) {
                                region.height = region.height + insert.height;
                            }
                        });
                        this.arrangement.populate(BI.toArray(clone));
                        this.arrangement.resize();
                        flag = true;
                    }
                    break;
                case BI.Arrangement.LAYOUT_TYPE.FREE:
                    break;
                case BI.Arrangement.LAYOUT_TYPE.GRID:
                    break;
            }
            this.position = null;
        } else {
            if (flag = this.arrangement.addRegion(region, position)) {
                this._old = old;
            }
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
        return true;
    },

    setRegionSize: function (name, size) {
        var flag;
        var old = this.getAllRegions();
        size = this._checkRegionSize(name, size);
        if (flag = this.arrangement.setRegionSize(name, size)) {
            this._old = old;
        }
        return flag;
    },

    setPosition: function (position, size) {
        var self = this;
        var at = this.arrangement.setPosition(position, size);
        this.position = null;
        if (!at) {
            switch (this.getLayoutType()) {
                case BI.Arrangement.LAYOUT_TYPE.ADAPTIVE:
                    if (position.left < 0 || position.top < 0) {
                        return null;
                    }
                    var offset = this.arrangement._getScrollOffset();
                    position = {
                        left: position.left + offset.left,
                        top: position.top + offset.top
                    };
                    BI.some(this.getAllRegions(), function (id, region) {
                        if (self.arrangement._isPositionInBounds(position, region)) {
                            var at = self.arrangement._positionAt(position, region);
                            if (at.type === "top-gap" || at.type === "bottom-gap") {
                                self.arrangement._setArrangeSize({
                                    top: region.top - 8 + (at.type === "bottom-gap" ? region.height : 0),
                                    left: region.left,
                                    width: region.width,
                                    height: 16
                                });
                                self.position = {
                                    insert: {
                                        height: (size || {}).height
                                    },
                                    type: at.type,
                                    region: region
                                };
                                self.arrangement._start();
                            }
                            return true;
                        }
                    });
                    break;
                case BI.Arrangement.LAYOUT_TYPE.FREE:
                    break;
                case BI.Arrangement.LAYOUT_TYPE.GRID:
                    break;
            }
        }
        return this.position || at;
    },

    setRegionPosition: function (name, position) {
        var region = this.getRegionByName(name);
        region.el.element.css("zIndex", ++this.zIndex);
        return this.arrangement.setRegionPosition(name, position);
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
        this._setLayoutType(type);
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
        switch (this.getLayoutType()) {
            case BI.Arrangement.LAYOUT_TYPE.ADAPTIVE:
                BI.nextTick(function () {
                    self.arrangement.resize();
                });
                break;
            case BI.Arrangement.LAYOUT_TYPE.FREE:
                break;
            case BI.Arrangement.LAYOUT_TYPE.GRID:
                break;
        }
    }
});
BI.AdaptiveArrangement.EVENT_ELEMENT_START_RESIZE = "AdaptiveArrangement.EVENT_ELEMENT_START_RESIZE";
BI.AdaptiveArrangement.EVENT_ELEMENT_RESIZE = "AdaptiveArrangement.EVENT_ELEMENT_RESIZE";
BI.AdaptiveArrangement.EVENT_ELEMENT_STOP_RESIZE = "AdaptiveArrangement.EVENT_ELEMENT_STOP_RESIZE";
BI.AdaptiveArrangement.EVENT_RESIZE = "AdaptiveArrangement.EVENT_RESIZE";
$.shortcut('bi.adaptive_arrangement', BI.AdaptiveArrangement);