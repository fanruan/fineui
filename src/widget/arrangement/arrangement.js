/**
 * 布局
 *
 * Created by GUY on 2016/2/23.
 * @class BI.Arrangement
 * @extends BI.Widget
 */
BI.Arrangement = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.Arrangement.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-arrangement",
            layoutType: BI.Arrangement.LAYOUT_TYPE.FREE,
            isNeedReLayout: true,
            items: []
        });
    },

    _init: function () {
        BI.Arrangement.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.arrangement = BI.createWidget({
            type: "bi.arrangement_droppable",
            cls: "arrangement-block",
            invisible: true
        });
        this.block = BI.createWidget({
            type: "bi.arrangement_block",
            invisible: true
        });
        this.droppable = BI.createWidget({
            type: "bi.layout",
            cls: "arrangement-drop-container",
            invisible: true
        });
        this.container = BI.createWidget({
            type: "bi.absolute",
            items: o.items.concat([this.block, this.arrangement, {
                el: this.droppable,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }])
        });

        this.scrollContainer = BI.createWidget({
            type: "bi.adaptive",
            width: "100%",
            height: "100%",
            scrollable: true,
            items: [this.container]
        });

        BI.createWidget({
            type: "bi.adaptive",
            element: this,
            items: [this.scrollContainer]
        });
        this.regions = {};
        this.locations = {};
        this.drops = {};
        this.storeDrops = {};
        if (o.items.length > 0) {
            BI.nextTick(function () {
                self.populate(o.items);
            });
        }
    },

    ////初始化操作////
    _calculateRegions: function (items) {
        var self = this, o = this.options;
        this.regions = {};
        this.drops = {};
        BI.each(items, function (i, item) {
            var region = self._createOneRegion(item);
            self.regions[region.id] = region;
            var drop = self._createOneDrop(region);
            self.drops[drop.id] = drop;
            self.storeDrops[drop.id] = drop;
        });
    },

    //定方位
    _locationRegion: function () {
        var self = this, o = this.options;
        this.locations = {};
        var reg = [];
        BI.each(this.regions, function (id, region) {
            var t = new BI.Region(region.left, region.top, region.width, region.height);
            t.id = id;
            reg.push(t);
            self.locations[id] = {top: [], left: [], right: [], bottom: []};
        });
        BI.each(reg, function (i, dim) {
            var topRegion = new BI.Region(dim.x, 0, dim.w, dim.y),
                bottomRegion = new BI.Region(dim.x, dim.y + dim.h, dim.w, BI.MAX),
                leftRegion = new BI.Region(0, dim.y, dim.x, dim.h),
                rightRegion = new BI.Region(dim.x + dim.w, dim.y, BI.MAX, dim.h);
            BI.each(reg, function (j, tar) {
                if (i !== j) {
                    if (tar.isIntersects(topRegion) && self._isLessThanEqual(tar.y + tar.h, dim.y)) {
                        self.locations[dim.id].top.push(self.regions[tar.id]);
                    }
                    if (tar.isIntersects(bottomRegion) && self._isMoreThanEqual(tar.y, dim.y + dim.h)) {
                        self.locations[dim.id].bottom.push(self.regions[tar.id]);
                    }
                    if (tar.isIntersects(leftRegion) && self._isLessThanEqual(tar.x + tar.w, dim.x)) {
                        self.locations[dim.id].left.push(self.regions[tar.id]);
                    }
                    if (tar.isIntersects(rightRegion) && self._isMoreThanEqual(tar.x, dim.x + dim.w)) {
                        self.locations[dim.id].right.push(self.regions[tar.id]);
                    }
                }
            });
        });
    },

    _isEqual: function (num1, num2) {
        return Math.abs(num1 - num2) < 2;
    },

    _isLessThan: function (num1, num2) {
        return num1 < num2 && !this._isEqual(num1, num2);
    },

    _isMoreThan: function (num1, num2) {
        return num1 > num2 && !this._isEqual(num1, num2);
    },

    _isLessThanEqual: function (num1, num2) {
        return num1 <= num2 || this._isEqual(num1, num2);
    },

    _isMoreThanEqual: function (num1, num2) {
        return num1 >= num2 || this._isEqual(num1, num2);
    },

    ////方法////
    _isPositionInBounds: function (position, bound) {
        var region = new BI.Region(bound.left, bound.top, bound.width, bound.height);
        return region.isPointInside(position.left, position.top);
    },

    //获取某区域等量相关联的区域
    _getEquivalentRelativeRegions: function (name, direction) {
        var self = this;
        direction || (direction = ["top", "bottom", "left", "right"]);
        var result = [];
        var target = this.regions[name];
        var tops = this.locations[name].top;
        var bottoms = this.locations[name].bottom;
        var lefts = this.locations[name].left;
        var rights = this.locations[name].right;
        var finded = direction.contains("top") && BI.some(tops, function (i, region) {
                if (self._isEqual(region.top + region.height, target.top) && self._isEqual(region.left, target.left) && self._isEqual(region.width, target.width)) {
                    var clone = BI.clone(region);
                    clone.height = region.height + target.height;
                    result.push(clone);
                    return true;
                }
            });
        if (!finded) {
            finded = direction.contains("bottom") && BI.some(bottoms, function (i, region) {
                    if (self._isEqual(target.top + target.height, region.top) && self._isEqual(region.left, target.left) && self._isEqual(region.width, target.width)) {
                        var clone = BI.clone(region);
                        clone.top = region.top - target.height;
                        clone.height = region.height + target.height;
                        result.push(clone);
                        return true;
                    }
                });
            if (!finded) {
                finded = direction.contains("left") && BI.some(lefts, function (i, region) {
                        if (self._isEqual(region.left + region.width, target.left) && self._isEqual(region.top, target.top) && self._isEqual(region.height, target.height)) {
                            var clone = BI.clone(region);
                            clone.width = region.width + target.width;
                            result.push(clone);
                            return true;
                        }
                    });
                if (!finded) {
                    finded = direction.contains("right") && BI.some(rights, function (i, region) {
                            if (self._isEqual(target.left + target.width, region.left) && self._isEqual(region.top, target.top) && self._isEqual(region.height, target.height)) {
                                var clone = BI.clone(region);
                                clone.left = region.left - target.width;
                                clone.width = region.width + target.width;
                                result.push(clone);
                                return true;
                            }
                        });
                    if (!finded) {
                        var findTopRegions = [], findBottomRegions = [];
                        direction.contains("top") && BI.each(tops, function (i, region) {
                            if (self._isEqual(region.top + region.height, target.top)
                                && self._isMoreThanEqual(region.left, target.left)
                                && self._isLessThanEqual(region.left + region.width, target.left + target.width)) {
                                findTopRegions.push(region);
                            }
                        });
                        direction.contains("bottom") && BI.each(bottoms, function (i, region) {
                            if (self._isEqual(target.top + target.height, region.top)
                                && self._isMoreThanEqual(region.left, target.left)
                                && self._isLessThanEqual(region.left + region.width, target.left + target.width)) {
                                findBottomRegions.push(region);
                            }
                        });
                        var topValid = isRegionsValid(findTopRegions, "top"), bottomValid = isRegionsValid(findBottomRegions, "bottom");
                        if (topValid && bottomValid) {
                            BI.each(findTopRegions, function (i, region) {
                                var clone = BI.clone(region);
                                clone.height = region.height + target.height / 2;
                                result.push(clone);
                            });
                            BI.each(findBottomRegions, function (i, region) {
                                var clone = BI.clone(region);
                                clone.top = region.top - target.height / 2;
                                clone.height = region.height + target.height / 2;
                                result.push(clone);
                            });
                        } else if (topValid) {
                            BI.each(findTopRegions, function (i, region) {
                                var clone = BI.clone(region);
                                clone.height = region.height + target.height;
                                result.push(clone);
                            });
                        } else if (bottomValid) {
                            BI.each(findBottomRegions, function (i, region) {
                                var clone = BI.clone(region);
                                clone.top = region.top - target.height;
                                clone.height = region.height + target.height;
                                result.push(clone);
                            });
                        }
                        if (!topValid && !bottomValid) {
                            var findLeftRegions = [], findRightRegions = [];
                            direction.contains("left") && BI.each(lefts, function (i, region) {
                                if (self._isEqual(region.left + region.width, target.left)
                                    && self._isMoreThanEqual(region.top, target.top)
                                    && self._isLessThanEqual(region.top + region.height, target.top + target.height)) {
                                    findLeftRegions.push(region);
                                }
                            });
                            direction.contains("right") && BI.each(rights, function (i, region) {
                                if (self._isEqual(target.left + target.width, region.left)
                                    && self._isMoreThanEqual(region.top, target.top)
                                    && self._isLessThanEqual(region.top + region.height, target.top + target.height)) {
                                    findRightRegions.push(region);
                                }
                            });
                            var leftValid = isRegionsValid(findLeftRegions, "left"), rightValid = isRegionsValid(findRightRegions, "right");
                            if (leftValid && rightValid) {
                                BI.each(findLeftRegions, function (i, region) {
                                    var clone = BI.clone(region);
                                    clone.width = region.width + target.width / 2;
                                    result.push(clone);
                                });
                                BI.each(findRightRegions, function (i, region) {
                                    var clone = BI.clone(region);
                                    clone.left = region.left - target.width / 2;
                                    clone.width = region.width + target.width / 2;
                                    result.push(clone);
                                });
                            } else if (leftValid) {
                                BI.each(findLeftRegions, function (i, region) {
                                    var clone = BI.clone(region);
                                    clone.width = region.width + target.width;
                                    result.push(clone);
                                });
                            } else if (rightValid) {
                                BI.each(findRightRegions, function (i, region) {
                                    var clone = BI.clone(region);
                                    clone.left = region.left - target.width;
                                    clone.width = region.width + target.width;
                                    result.push(clone);
                                });
                            }

                            //上下左右都不可行
                            if (!leftValid && !rightValid) {

                            }
                        }
                    }
                }
            }
        }
        return result;
        function isRegionsValid(regions, dir) {
            var occupied = self._getRegionOccupied(regions);
            switch (dir) {
                case "top":
                case "bottom":
                    return self._isEqual(occupied.left, target.left) && self._isEqual(occupied.width, target.width);
                case "left":
                case "right":
                    return self._isEqual(occupied.top, target.top) && self._isEqual(occupied.height, target.height);
            }
            return false;
        }
    },

    //获取某区域直接相关联的区域
    _getDirectRelativeRegions: function (name, direction) {
        var self = this;
        direction || (direction = ["top", "bottom", "left", "right"]);
        var result = [];
        var target = this.regions[name];
        var tops = this.locations[name].top;
        var bottoms = this.locations[name].bottom;
        var lefts = this.locations[name].left;
        var rights = this.locations[name].right;
        var finded = direction.contains("top") && BI.some(tops, function (i, region) {
                if (self._isEqual(region.top + region.height, target.top)
                    && ((self._isMoreThanEqual(region.left, target.left) && self._isLessThan(region.left, target.left + target.width))
                    || (self._isMoreThan(region.left + region.width, target.left) && self._isLessThanEqual(region.left + region.width, target.left + target.width))
                    || (self._isLessThan(region.left, target.left) && self._isMoreThan(region.left + region.width, target.left + target.width)))) {
                    var clone = BI.clone(region);
                    clone.height = region.height + target.height;
                    result.push(clone);
                }
            });
        if (!finded) {
            finded = direction.contains("bottom") && BI.some(bottoms, function (i, region) {
                    if (self._isEqual(target.top + target.height, region.top)
                        && ((self._isMoreThanEqual(region.left, target.left) && self._isLessThan(region.left, target.left + target.width))
                        || (self._isMoreThan(region.left + region.width, target.left) && self._isLessThanEqual(region.left + region.width, target.left + target.width))
                        || (self._isLessThan(region.left, target.left) && self._isMoreThan(region.left + region.width, target.left + target.width)))) {
                        var clone = BI.clone(region);
                        clone.top = region.top - target.height;
                        clone.height = region.height + target.height;
                        result.push(clone);
                    }
                });
            if (!finded) {
                finded = direction.contains("left") && BI.some(lefts, function (i, region) {
                        if (self._isEqual(region.left + region.width, target.left)
                            && ((self._isMoreThanEqual(region.top, target.top) && self._isLessThan(region.top, target.top + target.height))
                            || (self._isMoreThan(region.top + region.height, target.top) && self._isLessThanEqual(region.top + region.height, target.top + target.height))
                            || (self._isLessThan(region.top, target.top) && self._isMoreThan(region.top + region.height, target.top + target.height)))) {
                            var clone = BI.clone(region);
                            clone.width = region.width + target.width;
                            result.push(clone);
                        }
                    });
                if (!finded) {
                    finded = direction.contains("right") && BI.some(rights, function (i, region) {
                            if (self._isEqual(target.left + target.width, region.left)
                                && ((self._isMoreThanEqual(region.top, target.top) && self._isLessThan(region.top, target.top + target.height))
                                || (self._isMoreThan(region.top + region.height, target.top) && self._isLessThanEqual(region.top + region.height, target.top + target.height))
                                || (self._isLessThan(region.top, target.top) && self._isMoreThan(region.top + region.height, target.top + target.height)))) {
                                var clone = BI.clone(region);
                                clone.left = region.left - target.width;
                                clone.width = region.width + target.width;
                                result.push(clone);
                            }
                        });
                }
            }
        }
        return result;
    },

    //获取间接相关联的区域,即调整name区域后需要附带调整的所有相关区域(包括自身)
    _getInDirectRelativeRegions: function (name, direction) {
        var self = this, dict = ["top", "left", "right", "bottom"];
        var result = {};
        direction || (direction = dict);
        function recursion(regions, dir, store, cache) {
            BI.each(regions, function (i, region) {
                if (cache[region.id]) {
                    return;
                }
                cache[region.id] = true;
                if (!store[dict[3 - dir]]) {
                    store[dict[3 - dir]] = [];
                }
                store[dict[3 - dir]].push(region);
                recursion(self._getDirectRelativeRegions(region.id, [dict[dir]]), 3 - dir, store, cache);
            })
        }

        if (direction.contains("top")) {
            var store = {}, cache = {};
            recursion([this.regions[name]], dict.indexOf("top"), store, cache);
            store["top"] = BI.sortBy(store["top"], "left");
            store["bottom"] = BI.sortBy(store["bottom"], "left");
            result["top"] = store;
        }
        if (direction.contains("bottom")) {
            var store = {}, cache = {};
            recursion([this.regions[name]], dict.indexOf("bottom"), store, cache);
            store["top"] = BI.sortBy(store["top"], "left");
            store["bottom"] = BI.sortBy(store["bottom"], "left");
            result["bottom"] = store;
        }
        if (direction.contains("left")) {
            var store = {}, cache = {};
            recursion([this.regions[name]], dict.indexOf("left"), store, cache);
            store["left"] = BI.sortBy(store["left"], "top");
            store["right"] = BI.sortBy(store["right"], "top");
            result["left"] = store;
        }
        if (direction.contains("right")) {
            var store = {}, cache = {};
            recursion([this.regions[name]], dict.indexOf("right"), store, cache);
            store["left"] = BI.sortBy(store["left"], "top");
            store["right"] = BI.sortBy(store["right"], "top");
            result["right"] = store;
        }
        return result;
    },

    _getLeftAlignRegions: function (name) {
        var self = this;
        var tops = this._getDirectRelativeRegions(name, ["top"]);
        var bottoms = this._getDirectRelativeRegions(name, ["bottom"]);
        var current = this.regions[name];
        var rtop = [], rbottom = [];
        BI.each(tops, function (i, region) {
            if (self._isEqual(region.left, current.left)) {
                rtop.push(region);
            }
        });
        BI.each(bottoms, function (i, region) {
            if (self._isEqual(region.left, current.left)) {
                rbottom.push(region);
            }
        });
        return {
            top: rtop,
            bottom: rbottom
        }
    },

    _getRightAlignRegions: function (name) {
        var self = this;
        var tops = this._getDirectRelativeRegions(name, ["top"]);
        var bottoms = this._getDirectRelativeRegions(name, ["bottom"]);
        var current = this.regions[name];
        var rtop = [], rbottom = [];
        BI.each(tops, function (i, region) {
            if (self._isEqual(region.left + region.width, current.left + current.width)) {
                rtop.push(region);
            }
        });
        BI.each(bottoms, function (i, region) {
            if (self._isEqual(region.left + region.width, current.left + current.width)) {
                rbottom.push(region);
            }
        });
        return {
            top: rtop,
            bottom: rbottom
        }
    },

    _getTopAlignRegions: function (name) {
        var self = this;
        var lefts = this._getDirectRelativeRegions(name, ["left"]);
        var rights = this._getDirectRelativeRegions(name, ["right"]);
        var current = this.regions[name];
        var rleft = [], rright = [];
        BI.each(lefts, function (i, region) {
            if (self._isEqual(region.top, current.top)) {
                rleft.push(region);
            }
        });
        BI.each(rights, function (i, region) {
            if (self._isEqual(region.top, current.top)) {
                rright.push(region);
            }
        });
        return {
            left: rleft,
            right: rright
        }
    },

    _getBottomAlignRegions: function (name) {
        var self = this;
        var lefts = this._getDirectRelativeRegions(name, ["left"]);
        var rights = this._getDirectRelativeRegions(name, ["right"]);
        var current = this.regions[name];
        var rleft = [], rright = [];
        BI.each(lefts, function (i, region) {
            if (self._isEqual(region.top + region.height, current.top + current.height)) {
                rleft.push(region);
            }
        });
        BI.each(rights, function (i, region) {
            if (self._isEqual(region.top + region.height, current.top + current.height)) {
                rright.push(region);
            }
        });
        return {
            left: rleft,
            right: rright
        }
    },

    //获取占有的最大Region
    _getRegionOccupied: function (regions) {
        var self = this, o = this.options;
        if (BI.size(regions || this.regions) <= 0) {
            return {
                left: 0,
                top: 0,
                width: 0,
                height: 0
            }
        }
        var minLeft = BI.MAX, maxLeft = BI.MIN, minTop = BI.MAX, maxTop = BI.MIN;
        BI.each(regions || this.regions, function (id, region) {
            minLeft = Math.min(minLeft, region.left);
            maxLeft = Math.max(maxLeft, region.left + region.width);
            minTop = Math.min(minTop, region.top);
            maxTop = Math.max(maxTop, region.top + region.height);
        });
        return {
            left: minLeft,
            top: minTop,
            width: maxLeft - minLeft,
            height: maxTop - minTop
        }
    },

    //两个区域的交叉面积
    _getCrossArea: function (region1, region2) {
        if (region1.left <= region2.left) {
            if (region1.top <= region2.top) {
                if (region1.top + region1.height > region2.top && region1.left + region1.width > region2.left) {
                    if (this._isEqual(region1.top + region1.height, region2.top) || this._isEqual(region1.left + region1.width, region2.left)) {
                        return 0;
                    }
                    return (region1.top + region1.height - region2.top) * (region1.left + region1.width - region2.left);
                }
            } else {
                if (region2.top + region2.height > region1.top && region1.left + region1.width > region2.left) {
                    if (this._isEqual(region2.top + region2.height, region1.top) || this._isEqual(region1.left + region1.width, region2.left)) {
                        return 0;
                    }
                    return (region2.top + region2.height - region1.top) * (region1.left + region1.width - region2.left);
                }
            }
        } else {
            if (region1.top <= region2.top) {
                if (region1.top + region1.height > region2.top && region2.left + region2.width > region1.left) {
                    if (this._isEqual(region1.top + region1.height, region2.top) || this._isEqual(region2.left + region2.width, region1.left)) {
                        return 0;
                    }
                    return (region1.top + region1.height - region2.top) * (region2.left + region2.width - region1.left);
                }
            } else {
                if (region2.top + region2.height > region1.top && region2.left + region2.width > region1.left) {
                    if (this._isEqual(region2.top + region2.height, region1.top) || this._isEqual(region2.left + region2.width, region1.left)) {
                        return 0;
                    }
                    return (region2.top + region2.height - region1.top) * (region2.left + region2.width - region1.left);
                }
            }
        }
        return 0;
    },

    //是否有覆盖的组件
    _isRegionOverlay: function (regions) {
        var reg = [];
        BI.each(regions || this.regions, function (id, region) {
            reg.push(new BI.Region(region.left, region.top, region.width, region.height));
        });
        for (var i = 0, len = reg.length; i < len; i++) {
            for (var j = i + 1; j < len; j++) {
                var area1 = {
                    left: reg[i].x,
                    top: reg[i].y,
                    width: reg[i].w,
                    height: reg[i].h
                };
                var area2 = {
                    left: reg[j].x,
                    top: reg[j].y,
                    width: reg[j].w,
                    height: reg[j].h
                };
                if (reg[i].isIntersects(reg[j]) && this._getCrossArea(area1, area2) > 1) {
                    return true;
                }
            }
        }
        return false;
    },

    //布局是否是优良的
    _isArrangeFine: function (regions) {
        switch (this.options.layoutType) {
            case BI.Arrangement.LAYOUT_TYPE.ADAPTIVE:
                if (this._isRegionOverlay()) {
                    return false;
                }
                var maxRegion = this._getRegionOccupied(regions);
                var area = maxRegion.width * maxRegion.height;
                var all = 0;
                BI.each(regions || this.regions, function (id, region) {
                    all += region.width * region.height;
                });
                return Math.abs(area - all) < 8;
            case BI.Arrangement.LAYOUT_TYPE.FREE:
                return true;
            case BI.Arrangement.LAYOUT_TYPE.GRID:
                if (this._isRegionOverlay()) {
                    return false;
                }
        }
        return true;
    },

    _getRegionNames: function (regions) {
        var names = [];
        BI.each(regions || this.regions, function (i, region) {
            names.push(region.id || region.attr("id"));
        });
        return names;
    },

    _getRegionsByNames: function (names, regions) {
        names = BI.isArray(names) ? names : [names];
        regions = regions || this.regions;
        if (BI.isArray(regions)) {
            var result = [];
            BI.each(regions, function (i, region) {
                if (names.contains(region.id || region.attr("id"))) {
                    result.push(region);
                }
            });
        } else {
            var result = {};
            BI.each(names, function (i, name) {
                result[name] = regions[name];
            });
        }
        return result;
    },

    _cloneRegion: function (regions) {
        var clone = {};
        BI.each(regions || this.regions, function (id, region) {
            clone[id] = {};
            clone[id].el = region.el;
            clone[id].id = region.id;
            clone[id].left = region.left;
            clone[id].top = region.top;
            clone[id].width = region.width;
            clone[id].height = region.height;
        });
        return clone;
    },

    //测试合法性
    _test: function (regions) {
        var self = this;
        return !BI.any(regions || this.regions, function (i, region) {
            if (BI.isNaN(region.width) || BI.isNaN(region.height) || region.width <= 21 || region.height <= 21) {
                return true;
            }
        })
    },

    //对区域进行划分
    _splitRegions: function (name) {
        var result = [];
        var tid = BI.UUID();
        var _left = this._getLeftAlignRegions(name);
        var _right = this._getRightAlignRegions(name);
        var _top = this._getTopAlignRegions(name);
        var _bottom = this._getBottomAlignRegions(name);
        if (_left.top.length > 0) {
            var upid = _left.top[0].id;
            var tid = BI.UUID();
            var clone = this._cloneRegion();
            var _cur = clone[name];
            var split = Math.min(clone[name].width, clone[upid].width) / 2;//两个组件中较小宽度的一半
            var left = (clone[name].left + clone[upid].left) / 2;//求平均，减少误差
            var insert = clone[tid] = {//新增的区域
                left: left,
                top: clone[upid].top,
                width: split,
                height: clone[name].height + clone[upid].height
            };
            BI.extend(clone[name], {
                left: left + split,
                width: clone[name].width - split - (left - clone[name].left)
            });
            BI.extend(clone[upid], {
                left: left + split,
                width: clone[upid].width - split - (left - clone[upid].left)
            });
            if (this._test(clone)) {
                delete clone[tid];
                result.push({
                    type: "left-top",
                    regions: clone,
                    insert: insert
                });
            }
        }
        if (_left.bottom.length > 0) {
            var bottomid = _left.bottom[0].id;
            var tid = BI.UUID();
            var clone = this._cloneRegion();
            var _cur = clone[name];
            var split = Math.min(clone[name].width, clone[bottomid].width) / 2;
            var left = (clone[name].left + clone[bottomid].left) / 2;
            var insert = clone[tid] = {//新增的区域
                left: left,
                top: clone[name].top,
                width: split,
                height: clone[name].height + clone[bottomid].height
            };
            BI.extend(clone[name], {
                left: left + split,
                width: clone[name].width - split - (left - clone[name].left)
            });
            BI.extend(clone[bottomid], {
                left: left + split,
                width: clone[bottomid].width - split - (left - clone[bottomid].left)
            });
            if (this._test(clone)) {
                delete clone[tid];
                result.push({
                    type: "bottom-left",
                    regions: clone,
                    insert: insert
                });
            }
        }
        if (_right.top.length > 0) {
            var upid = _right.top[0].id;
            var tid = BI.UUID();
            var clone = this._cloneRegion();
            var _cur = clone[name];
            var split = Math.min(clone[name].width, clone[upid].width) / 2;//两个组件中较小宽度的一半
            var right = (clone[name].left + clone[name].width + clone[upid].left + clone[upid].width) / 2;//求平均，减少误差
            var insert = clone[tid] = {//新增的区域
                left: right - split,
                top: clone[upid].top,
                width: split,
                height: clone[name].height + clone[upid].height
            };
            BI.extend(clone[name], {
                width: right - clone[name].left - split
            });
            BI.extend(clone[upid], {
                width: right - clone[upid].left - split
            });
            if (this._test(clone)) {
                delete clone[tid];
                result.push({
                    type: "top-right",
                    regions: clone,
                    insert: insert
                });
            }
        }
        if (_right.bottom.length > 0) {
            var bottomid = _right.bottom[0].id;
            var tid = BI.UUID();
            var clone = this._cloneRegion();
            var _cur = clone[name];
            var split = Math.min(clone[name].width, clone[bottomid].width) / 2;//两个组件中较小宽度的一半
            var right = (clone[name].left + clone[name].width + clone[bottomid].left + clone[bottomid].width) / 2;//求平均，减少误差
            var insert = clone[tid] = {//新增的区域
                left: right - split,
                top: clone[name].top,
                width: split,
                height: clone[name].height + clone[bottomid].height
            };
            BI.extend(clone[name], {
                width: right - clone[name].left - split
            });
            BI.extend(clone[bottomid], {
                width: right - clone[bottomid].left - split
            });
            if (this._test(clone)) {
                delete clone[tid];
                result.push({
                    type: "bottom-right",
                    regions: clone,
                    insert: insert
                });
            }
        }
        if (_top.left.length > 0) {
            var leftid = _top.left[0].id;
            var tid = BI.UUID();
            var clone = this._cloneRegion();
            var _cur = clone[name];
            var split = Math.min(clone[name].height, clone[leftid].height) / 2;//两个组件中较小高度的一半
            var top = (clone[name].top + clone[leftid].top) / 2;//求平均，减少误差
            var insert = clone[tid] = {//新增的区域
                top: top,
                left: clone[leftid].left,
                height: split,
                width: clone[name].width + clone[leftid].width
            };
            BI.extend(clone[name], {
                top: top + split,
                height: clone[name].height - split - (top - clone[name].top)
            });
            BI.extend(clone[leftid], {
                top: top + split,
                height: clone[leftid].height - split - (top - clone[leftid].top)
            });
            if (this._test(clone)) {
                delete clone[tid];
                result.push({
                    type: "top-left",
                    regions: clone,
                    insert: insert
                });
            }
        }
        if (_top.right.length > 0) {
            var rightid = _top.right[0].id;
            var tid = BI.UUID();
            var clone = this._cloneRegion();
            var _cur = clone[name];
            var split = Math.min(clone[name].height, clone[rightid].height) / 2;//两个组件中较小高度的一半
            var top = (clone[name].top + clone[rightid].top) / 2;//求平均，减少误差
            var insert = clone[tid] = {//新增的区域
                top: top,
                left: clone[name].left,
                height: split,
                width: clone[name].width + clone[rightid].width
            };
            BI.extend(clone[name], {
                top: top + split,
                height: clone[name].height - split - (top - clone[name].top)
            });
            BI.extend(clone[rightid], {
                top: top + split,
                height: clone[rightid].height - split - (top - clone[rightid].top)
            });
            if (this._test(clone)) {
                delete clone[tid];
                result.push({
                    type: "top-right-second",
                    regions: clone,
                    insert: insert
                });
            }
        }
        if (_bottom.left.length > 0) {
            var leftid = _bottom.left[0].id;
            var tid = BI.UUID();
            var clone = this._cloneRegion();
            var _cur = clone[name];
            var split = Math.min(clone[name].height, clone[leftid].height) / 2;//两个组件中较小高度的一半
            var bottom = (clone[name].top + clone[name].height + clone[leftid].top + clone[leftid].height) / 2;//求平均，减少误差
            var insert = clone[tid] = {//新增的区域
                left: clone[leftid].left,
                top: bottom - split,
                height: split,
                width: clone[name].width + clone[leftid].width
            };
            BI.extend(clone[name], {
                height: bottom - clone[name].top - split
            });
            BI.extend(clone[leftid], {
                height: bottom - clone[leftid].top - split
            });
            if (this._test(clone)) {
                delete clone[tid];
                result.push({
                    type: "bottom-left-second",
                    regions: clone,
                    insert: insert
                });
            }
        }
        if (_bottom.right.length > 0) {
            var rightid = _bottom.right[0].id;
            var tid = BI.UUID();
            var clone = this._cloneRegion();
            var _cur = clone[name];
            var split = Math.min(clone[name].height, clone[rightid].height) / 2;//两个组件中较小高度的一半
            var bottom = (clone[name].top + clone[name].height + clone[rightid].top + clone[rightid].height) / 2;//求平均，减少误差
            var insert = clone[tid] = {//新增的区域
                left: clone[name].left,
                top: bottom - split,
                height: split,
                width: clone[name].width + clone[rightid].width
            };
            BI.extend(clone[name], {
                height: bottom - clone[name].top - split
            });
            BI.extend(clone[rightid], {
                height: bottom - clone[rightid].top - split
            });
            if (this._test(clone)) {
                delete clone[tid];
                result.push({
                    type: "bottom-right-second",
                    regions: clone,
                    insert: insert
                });
            }
        }
        //有上方居中drop
        var lefts = _top.left, rights = _top.right;
        if (lefts.length > 0 && rights.length > 0) {
            var count = 0;
            var store = [this.regions[name]];
            while (lefts.length > 0 || rights.length > 0) {
                var clone = this._cloneRegion();
                if (lefts.length > 0) {
                    store.push(this.regions[lefts[0].id]);
                }
                if (rights.length > 0) {
                    store.push(this.regions[rights[0].id]);
                }
                count++;
                var top = BI.average(store, function (i, r) {//求平均，减少误差
                    return r.top;
                });
                var occupied = this._getRegionOccupied(store);

                var split = BI.min(store, function (i, r) {
                        return r.height;
                    }).height / 2;
                var insert = clone[tid] = {
                    left: occupied.left,
                    width: occupied.width,
                    top: top,
                    height: split
                };
                BI.each(store, function (i, region) {
                    BI.extend(clone[region.id], {
                        top: top + split,
                        height: region.height - split - (top - region.top)
                    });
                });
                if (this._test(store)) {
                    delete clone[tid];
                    result.push({
                        type: "top-center" + count,
                        regions: clone,
                        insert: insert
                    });
                } else {
                    break;
                }

                if (lefts.length > 0) lefts = this._getTopAlignRegions(lefts[0].id).left;
                if (rights.length > 0) rights = this._getTopAlignRegions(rights[0].id).right;
            }
        }
        //有下方居中drop
        var lefts = _bottom.left, rights = _bottom.right;
        if (lefts.length > 0 && rights.length > 0) {
            var count = 0;
            var store = [this.regions[name]];
            while (lefts.length > 0 || rights.length > 0) {
                var clone = this._cloneRegion();
                if (lefts.length > 0) {
                    store.push(this.regions[lefts[0].id]);
                }
                if (rights.length > 0) {
                    store.push(this.regions[rights[0].id]);
                }
                count++;
                var bottom = BI.average(store, function (i, r) {//求平均，减少误差
                    return r.top + r.height;
                });
                var occupied = this._getRegionOccupied(store);

                var split = BI.min(store, function (i, r) {
                        return r.height;
                    }).height / 2;
                var insert = clone[tid] = {
                    left: occupied.left,
                    width: occupied.width,
                    top: bottom - split,
                    height: split
                };
                BI.each(store, function (i, region) {
                    BI.extend(clone[region.id], {
                        height: bottom - region.top - split
                    });
                });
                if (this._test(store)) {
                    delete clone[tid];
                    result.push({
                        type: "bottom-center" + count,
                        regions: clone,
                        insert: insert
                    });
                } else {
                    break;
                }

                if (lefts.length > 0) lefts = this._getBottomAlignRegions(lefts[0].id).left;
                if (rights.length > 0) rights = this._getBottomAlignRegions(rights[0].id).right;
            }
        }
        //有左方居中drop
        var tops = _left.top, bottoms = _left.bottom;
        if (tops.length > 0 && bottoms.length > 0) {
            var count = 0;
            var store = [this.regions[name]];
            while (tops.length > 0 || bottoms.length > 0) {
                var clone = this._cloneRegion();
                if (tops.length > 0) {
                    store.push(this.regions[tops[0].id]);
                }
                if (bottoms.length > 0) {
                    store.push(this.regions[bottoms[0].id]);
                }
                count++;
                var left = BI.average(store, function (i, r) {//求平均，减少误差
                    return r.left;
                });
                var occupied = this._getRegionOccupied(store);

                var split = BI.min(store, function (i, r) {
                        return r.width;
                    }).width / 2;
                var insert = clone[tid] = {
                    left: left,
                    width: split,
                    top: occupied.top,
                    height: occupied.height
                };
                BI.each(store, function (i, region) {
                    BI.extend(clone[region.id], {
                        left: left + split,
                        width: region.width - split - (left - region.left)
                    });
                });
                if (this._test(store)) {
                    delete clone[tid];
                    result.push({
                        type: "left-center" + count,
                        regions: clone,
                        insert: insert
                    });
                } else {
                    break;
                }

                if (tops.length > 0) tops = this._getLeftAlignRegions(tops[0].id).top;
                if (bottoms.length > 0) bottoms = this._getLeftAlignRegions(bottoms[0].id).bottom;
            }
        }
        //有右方居中drop
        var tops = _right.top, bottoms = _right.bottom;
        if (tops.length > 0 && bottoms.length > 0) {
            var count = 0;
            var store = [this.regions[name]];
            while (tops.length > 0 || bottoms.length > 0) {
                var clone = this._cloneRegion();
                if (tops.length > 0) {
                    store.push(this.regions[tops[0].id]);
                }
                if (bottoms.length > 0) {
                    store.push(this.regions[bottoms[0].id]);
                }
                count++;
                var right = BI.average(store, function (i, r) {//求平均，减少误差
                    return r.left + r.width;
                });
                var occupied = this._getRegionOccupied(store);

                var split = BI.min(store, function (i, r) {
                        return r.width;
                    }).width / 2;
                var insert = clone[tid] = {
                    left: right - split,
                    width: split,
                    top: occupied.top,
                    height: occupied.height
                };
                BI.each(store, function (i, region) {
                    BI.extend(clone[region.id], {
                        width: right - region.left - split
                    });
                });
                if (this._test(store)) {
                    delete clone[tid];
                    result.push({
                        type: "right-center" + count,
                        regions: clone,
                        insert: insert
                    });
                } else {
                    break;
                }

                if (tops.length > 0) tops = this._getRightAlignRegions(tops[0].id).top;
                if (bottoms.length > 0) bottoms = this._getRightAlignRegions(bottoms[0].id).bottom;
            }
        }
        var lefts = this._getEquivalentRelativeRegions(name, ["left"]);
        if (lefts.length === 1) {
            var clone = this._cloneRegion();
            var _cur = clone[name];
            var left = this.regions[lefts[0].id];
            var width = left.width;
            var all = left.width + _cur.width;
            var ratio = width / all;
            var split = all / 3;
            var lleft = width - split * ratio, rleft = _cur.width - split * (1 - ratio);
            var insert = false;
            if (lleft <= 21) {
                rleft = _cur.width - split;
                if (rleft <= 21) {

                } else {
                    insert = clone[tid] = {
                        top: _cur.top,
                        height: _cur.height,
                        left: _cur.left,
                        width: split,
                    };
                    BI.extend(clone[name], {
                        top: _cur.top,
                        height: _cur.height,
                        left: _cur.left + split,
                        width: _cur.width - split
                    });
                }
            } else if (rleft <= 21) {
                lleft = width - split;
                if (lleft <= 21) {
                } else {
                    insert = clone[tid] = {
                        top: _cur.top,
                        height: _cur.height,
                        left: _cur.left - split,
                        width: split,
                    };
                    BI.extend(clone[left.id], {
                        top: left.top,
                        height: left.height,
                        left: left.left,
                        width: left.width - split
                    });
                }
            } else {
                insert = clone[tid] = {
                    top: _cur.top,
                    height: _cur.height,
                    left: left.left + lleft,
                    width: split,
                };
                BI.extend(clone[name], {
                    top: _cur.top,
                    height: _cur.height,
                    left: _cur.left + _cur.width - rleft,
                    width: rleft
                });
                BI.extend(clone[left.id], {
                    top: left.top,
                    height: left.height,
                    left: left.left,
                    width: lleft
                });
            }
            if (insert !== false) {
                if (this._test(clone)) {
                    delete clone[tid];
                    result.push({
                        type: "left-line",
                        regions: clone,
                        insert: insert
                    })
                }
            }
        }
        var rights = this._getEquivalentRelativeRegions(name, ["right"]);
        if (rights.length === 1) {
            var clone = this._cloneRegion();
            var _cur = clone[name];
            var right = this.regions[rights[0].id];
            var width = right.width;
            var all = right.width + _cur.width;
            var ratio = width / all;
            var split = all / 3;
            var lleft = _cur.width - split * (1 - ratio), rleft = width - split * ratio;
            var insert = false;
            if (lleft <= 21) {
                rleft = width - split;
                if (rleft <= 21) {
                } else {
                    insert = clone[tid] = {
                        top: right.top,
                        height: right.height,
                        left: right.left,
                        width: split
                    };
                    BI.extend(clone[right.id], {
                        top: right.top,
                        height: right.height,
                        left: right.left + split,
                        width: right.width - split
                    })
                }
            } else if (rleft <= 21) {
                lleft = _cur.width - split;
                if (lleft <= 21) {
                } else {
                    insert = clone[tid] = {
                        top: _cur.top,
                        height: _cur.height,
                        left: _cur.left + lleft,
                        width: split
                    };
                    BI.extend(clone[name], {
                        top: _cur.top,
                        height: _cur.height,
                        left: _cur.left,
                        width: _cur.width - split
                    })
                }
            } else {
                insert = clone[tid] = {
                    top: _cur.top,
                    height: _cur.height,
                    left: _cur.left + lleft,
                    width: split
                };
                BI.extend(clone[name], {
                    top: _cur.top,
                    height: _cur.height,
                    left: _cur.left,
                    width: lleft
                });
                BI.extend(clone[right.id], {
                    top: right.top,
                    height: right.height,
                    left: right.left + right.width - rleft,
                    width: rleft
                });
            }
            if (insert !== false) {
                if (this._test(clone)) {
                    delete clone[tid];
                    result.push({
                        type: "right-line",
                        regions: clone,
                        insert: insert
                    })
                }
            }
        }
        var tops = this._getEquivalentRelativeRegions(name, ["top"]);
        if (tops.length === 1) {
            var clone = this._cloneRegion();
            var _cur = clone[name];
            var top = this.regions[tops[0].id];
            var height = top.height;
            var all = top.height + _cur.height;
            var ratio = height / all;
            var split = all / 3;
            var tleft = height - split * ratio, bleft = _cur.height - split * (1 - ratio);
            var insert = false;
            if (tleft <= 21) {
                bleft = _cur.height - split;
                if (bleft <= 21) {
                } else {
                    insert = clone[tid] = {
                        top: _cur.top,
                        width: _cur.width,
                        left: _cur.left,
                        height: split
                    };
                    BI.extend(clone[name], {
                        top: _cur.top + split,
                        height: _cur.height - split,
                        left: _cur.left,
                        width: _cur.width
                    });
                }
            }
            if (bleft <= 21) {
                tleft = height - split;
                if (tleft <= 21) {
                } else {
                    insert = clone[tid] = {
                        top: _cur.top - split,
                        height: split,
                        left: _cur.left,
                        width: _cur.width
                    };
                    BI.extend(clone[top.id], {
                        top: top.top,
                        height: top.height - split,
                        left: top.left,
                        width: top.width
                    });
                }
            } else {
                insert = clone[tid] = {
                    top: top.top + tleft,
                    height: split,
                    left: _cur.left,
                    width: _cur.width
                };
                BI.extend(clone[name], {
                    top: _cur.top + _cur.height - bleft,
                    height: bleft,
                    left: _cur.left,
                    width: _cur.width
                });
                BI.extend(clone[top.id], {
                    top: top.top,
                    height: tleft,
                    left: top.left,
                    width: top.width
                });
            }
            if (insert !== false) {
                if (this._test(clone)) {
                    delete clone[tid];
                    result.push({
                        type: "top-line",
                        regions: clone,
                        insert: insert
                    })
                }
            }
        }
        var bottoms = this._getEquivalentRelativeRegions(name, ["bottom"]);
        if (bottoms.length === 1) {
            var clone = this._cloneRegion();
            var _cur = clone[name];
            var bottom = this.regions[bottoms[0].id];
            var height = bottom.height;
            var all = bottom.height + _cur.height;
            var ratio = height / all;
            var split = all / 3;
            var tleft = _cur.height - split * (1 - ratio), bleft = height - split * ratio;
            var insert = false;
            if (tleft <= 21) {
                bleft = height - split;
                if (bleft <= 21) {
                } else {
                    insert = clone[tid] = {
                        top: bottom.top,
                        height: bottom.height,
                        left: bottom.left,
                        width: split
                    };
                    BI.extend(clone[bottom.id], {
                        top: bottom.top + split,
                        height: bottom.height - split,
                        left: bottom.left,
                        width: bottom.width
                    });
                }
            } else if (bleft <= 21) {
                tleft = _cur.height - split;
                if (tleft <= 21) {
                } else {
                    insert = clone[tid] = {
                        top: _cur.top + tleft,
                        height: split,
                        left: _cur.left,
                        width: _cur.width
                    };
                    BI.extend(clone[name], {
                        top: _cur.top,
                        height: _cur.height - split,
                        left: _cur.left,
                        width: _cur.width
                    });
                }
            } else {
                insert = clone[tid] = {
                    top: _cur.top + tleft,
                    height: split,
                    left: _cur.left,
                    width: _cur.width,
                };
                BI.extend(clone[name], {
                    top: _cur.top,
                    height: tleft,
                    left: _cur.left,
                    width: _cur.width
                });
                BI.extend(clone[bottom.id], {
                    top: bottom.top + bottom.height - bleft,
                    height: bleft,
                    left: bottom.left,
                    width: bottom.width
                });
            }
            if (insert !== false) {
                if (this._test(clone)) {
                    delete clone[tid];
                    result.push({
                        type: "bottom-line",
                        regions: clone,
                        insert: insert
                    })
                }
            }
        }
        if (tops.length >= 1) {
            result.push({
                type: "top-gap"
            });
        }
        if (bottoms.length >= 1) {
            result.push({
                type: "bottom-gap"
            });
        }
        //上
        var clone = this._cloneRegion();
        var _cur = clone[name];
        var insert = clone[tid] = {
            top: _cur.top,
            left: _cur.left,
            width: _cur.width,
            height: _cur.height / 2,
        };
        BI.extend(clone[name], {
            top: _cur.top + _cur.height / 2,
            left: _cur.left,
            width: _cur.width,
            height: _cur.height / 2
        });
        if (this._test(clone)) {
            delete clone[tid];
            result.push({
                type: "top",
                regions: clone,
                insert: insert
            })
        }
        //下
        var clone = this._cloneRegion();
        var _cur = clone[name];
        var insert = clone[tid] = {
            top: _cur.top + _cur.height / 2,
            left: _cur.left,
            width: _cur.width,
            height: _cur.height / 2
        };
        BI.extend(clone[name], {
            top: _cur.top,
            left: _cur.left,
            width: _cur.width,
            height: _cur.height / 2
        });
        if (this._test(clone)) {
            delete clone[tid];
            result.push({
                type: "bottom",
                regions: clone,
                insert: insert
            })
        }
        //左
        var clone = this._cloneRegion();
        var _cur = clone[name];
        var insert = clone[tid] = {
            top: _cur.top,
            left: _cur.left,
            width: _cur.width / 2,
            height: _cur.height
        };
        BI.extend(clone[name], {
            top: _cur.top,
            left: _cur.left + _cur.width / 2,
            width: _cur.width / 2,
            height: _cur.height
        });
        if (this._test(clone)) {
            delete clone[tid];
            result.push({
                type: "left",
                regions: clone,
                insert: insert
            })
        }
        //右
        var clone = this._cloneRegion();
        var _cur = clone[name];
        var insert = clone[tid] = {
            top: _cur.top,
            left: _cur.left + _cur.width / 2,
            width: _cur.width / 2,
            height: _cur.height
        };
        BI.extend(clone[name], {
            top: _cur.top,
            left: _cur.left,
            width: _cur.width / 2,
            height: _cur.height
        });
        if (this._test(clone)) {
            delete clone[tid];
            result.push({
                type: "right",
                regions: clone,
                insert: insert
            })
        }
        return result;
    },

    _positionAt: function (position, bound) {
        var left = position.left - bound.left, top = position.top - bound.top;
        var right = bound.width - left, bottom = bound.height - top;
        var halfW = bound.width / 2, halfH = bound.height / 2;
        if (left < 0 || top < 0 || right < 0 || bottom < 0) {
            return;
        }
        var devides = this._splitRegions(bound.id);
        var types = [];
        var result = {};
        var topcenterCount = 0, bottomcenterCount = 0, leftcenterCount = 0, rightcenterCount = 0;
        BI.each(devides, function (i, devide) {
            if (devide.type.indexOf("top-center") > -1) {
                topcenterCount++;
            } else if (devide.type.indexOf("bottom-center") > -1) {
                bottomcenterCount++;
            } else if (devide.type.indexOf("left-center") > -1) {
                leftcenterCount++;
            } else if (devide.type.indexOf("right-center") > -1) {
                rightcenterCount++;
            }
            types.push(devide.type);
            result[devide.type] = devide;
        });
        //drop
        if (top >= 5 && top <= 15 && left >= 5 && left <= 15 && types.contains("left-top")) {
            return result["left-top"];
        }
        if (top >= 5 && top <= 15 && right >= 5 && right <= 15 && types.contains("top-right")) {
            return result["top-right"];
        }
        if (bottom >= 5 && bottom <= 15 && left >= 5 && left <= 15 && types.contains("bottom-left")) {
            return result["bottom-left"];
        }
        if (bottom >= 5 && bottom <= 15 && right >= 5 && right <= 15 && types.contains("bottom-right")) {
            return result["bottom-right"];
        }

        if (top >= 5 && top <= 15 && left >= 25 && left <= 35 && types.contains("top-left")) {
            return result["top-left"];
        }
        if (top >= 5 && top <= 15 && right >= 25 && right <= 35 && types.contains("top-right-second")) {
            return result["top-right-second"];
        }
        if (bottom >= 5 && bottom <= 15 && left >= 25 && left <= 35 && types.contains("bottom-left-second")) {
            return result["bottom-left-second"];
        }
        if (bottom >= 5 && bottom <= 15 && right >= 25 && right <= 35 && types.contains("bottom-right-second")) {
            return result["bottom-right-second"];
        }

        //topcenter或bottomcenter
        if (left >= halfW - 10 && left <= halfW + 10 && (topcenterCount > 0 || bottomcenterCount > 0)) {
            for (var i = 1; i <= topcenterCount; i++) {
                var s = (topcenterCount - i) * 20 + 5, e = s + 10;
                if (top >= s && top <= e) {
                    return result["top-center" + i];
                }
            }
            for (var i = 1; i <= bottomcenterCount; i++) {
                var s = (bottomcenterCount - i) * 20 + 5, e = s + 10;
                if (bottom >= s && bottom <= e) {
                    return result["bottom-center" + i];
                }
            }
        }
        //leftcenter或rightcenter
        if (top >= halfH - 10 && top <= halfH + 10 && (leftcenterCount > 0 || rightcenterCount > 0)) {
            for (var i = 1; i <= leftcenterCount; i++) {
                var s = (leftcenterCount - i) * 20 + 5, e = s + 10;
                if (left >= s && left <= e) {
                    return result["left-center" + i];
                }
            }
            for (var i = 1; i <= rightcenterCount; i++) {
                var s = (rightcenterCount - i) * 20 + 5, e = s + 10;
                if (right >= s && right <= e) {
                    return result["right-center" + i];
                }
            }
        }

        //缝隙
        if (top <= 8 && types.contains("top-gap")) {
            return result["top-gap"];
        }
        if (bottom <= 8 && types.contains("bottom-gap")) {
            return result["bottom-gap"];
        }

        //三分
        if (top <= 15 && left >= 15 && right >= 15 && types.contains("top-line")) {
            return result["top-line"];
        }
        if (left <= 15 && top >= 15 && bottom >= 15 && types.contains("left-line")) {
            return result["left-line"];
        }
        if (right <= 15 && top >= 15 && bottom >= 15 && types.contains("right-line")) {
            return result["right-line"];
        }
        if (bottom <= 15 && left >= 15 && right >= 15 && types.contains("bottom-line")) {
            return result["bottom-line"];
        }

        //平分
        if (top <= 1 / 4 * bound.height && types.contains("top")) {
            return result["top"];
        }
        if (top >= 3 / 4 * bound.height && types.contains("bottom")) {
            return result["bottom"];
        }
        if (left <= bound.width / 2 && types.contains("left")) {
            return result["left"];
        }
        return result["right"];
    },


    _getScrollOffset: function () {
        return {
            left: this.scrollContainer.element[0].scrollLeft,
            top: this.scrollContainer.element[0].scrollTop
        }
    },

    ////操作////
    _createOneRegion: function (item) {
        var el = BI.createWidget(item.el);
        el.setVisible(true);
        return {
            id: el.attr("id"),
            left: item.left,
            top: item.top,
            width: item.width,
            height: item.height,
            el: el
        }
    },

    _createOneDrop: function (region) {
        if (this.storeDrops[region.id]) {
            var drop = this.storeDrops[region.id].el;
            drop.setVisible(true);
        } else {
            var drop = BI.createWidget({
                type: "bi.layout",
                cls: "arrangement-drop-region",
                widgetName: region.id
            });
        }
        return {
            id: region.id,
            left: region.left,
            top: region.top,
            width: region.width,
            height: region.height,
            el: drop
        }
    },

    _calculateDrops: function () {
        var self = this;
        BI.each(this.drops, function (id, drop) {
            drop.el.empty();
            var devides = self._splitRegions(id);
            var topcenterCount = 0, bottomcenterCount = 0, leftcenterCount = 0, rightcenterCount = 0;
            var absolutes = [];
            var horizontals = [];
            var verticals = [];
            BI.each(devides, function (i, devide) {
                if (devide.type.indexOf("top-center") > -1) {
                    topcenterCount++;
                } else if (devide.type.indexOf("bottom-center") > -1) {
                    bottomcenterCount++;
                } else if (devide.type.indexOf("left-center") > -1) {
                    leftcenterCount++;
                } else if (devide.type.indexOf("right-center") > -1) {
                    rightcenterCount++;
                }
            });
            BI.each(devides, function (i, devide) {
                switch (devide.type) {
                    case "left-top":
                        absolutes.push({
                            el: {
                                type: "bi.layout",
                                width: 10,
                                height: 10,
                                cls: "drop-devider"
                            },
                            left: 5,
                            top: 5
                        });
                        break;
                    case "top-right":
                        absolutes.push({
                            el: {
                                type: "bi.layout",
                                width: 10,
                                height: 10,
                                cls: "drop-devider"
                            },
                            right: 5,
                            top: 5
                        });
                        break;
                    case "bottom-left":
                        absolutes.push({
                            el: {
                                type: "bi.layout",
                                width: 10,
                                height: 10,
                                cls: "drop-devider"
                            },
                            left: 5,
                            bottom: 5
                        });
                        break;
                    case "bottom-right":
                        absolutes.push({
                            el: {
                                type: "bi.layout",
                                width: 10,
                                height: 10,
                                cls: "drop-devider"
                            },
                            right: 5,
                            bottom: 5
                        });
                        break;
                    case "top-left":
                        absolutes.push({
                            el: {
                                type: "bi.layout",
                                width: 10,
                                height: 10,
                                cls: "drop-devider"
                            },
                            left: 25,
                            top: 5
                        });
                        break;
                    case "top-right-second":
                        absolutes.push({
                            el: {
                                type: "bi.layout",
                                width: 10,
                                height: 10,
                                cls: "drop-devider"
                            },
                            right: 25,
                            top: 5
                        });
                        break;
                    case "bottom-left-second":
                        absolutes.push({
                            el: {
                                type: "bi.layout",
                                width: 10,
                                height: 10,
                                cls: "drop-devider"
                            },
                            left: 25,
                            bottom: 5
                        });
                        break;
                    case "bottom-right-second":
                        absolutes.push({
                            el: {
                                type: "bi.layout",
                                width: 10,
                                height: 10,
                                cls: "drop-devider"
                            },
                            right: 25,
                            bottom: 5
                        });
                        break;
                    default:
                        if (devide.type.indexOf("top-center") > -1) {
                            var num = devide.type.split("top-center")[1];
                            horizontals.push({
                                el: {
                                    type: "bi.layout",
                                    width: 20,
                                    height: 10,
                                    cls: "drop-devider"
                                },
                                tgap: 20 * (topcenterCount - BI.parseInt(num)) + 5
                            })
                        } else if (devide.type.indexOf("bottom-center") > -1) {
                            var num = devide.type.split("bottom-center")[1];
                            horizontals.push({
                                el: {
                                    type: "bi.layout",
                                    width: 20,
                                    height: 10,
                                    cls: "drop-devider"
                                },
                                bgap: 20 * (bottomcenterCount - BI.parseInt(num)) + 5
                            })
                        } else if (devide.type.indexOf("left-center") > -1) {
                            var num = devide.type.split("left-center")[1];
                            verticals.push({
                                el: {
                                    type: "bi.layout",
                                    width: 10,
                                    height: 20,
                                    cls: "drop-devider"
                                },
                                lgap: 20 * (leftcenterCount - BI.parseInt(num)) + 5
                            })
                        } else if (devide.type.indexOf("right-center") > -1) {
                            var num = devide.type.split("right-center")[1];
                            verticals.push({
                                el: {
                                    type: "bi.layout",
                                    width: 10,
                                    height: 20,
                                    cls: "drop-devider"
                                },
                                rgap: 20 * (rightcenterCount - BI.parseInt(num)) + 5
                            })
                        }
                        break;
                }

            });
            BI.createWidget({
                type: "bi.absolute",
                element: drop.el,
                items: absolutes
            });

            BI.createWidget({
                type: "bi.absolute_horizontal_adapt",
                element: drop.el,
                items: horizontals
            });

            BI.createWidget({
                type: "bi.absolute_vertical_adapt",
                element: drop.el,
                items: verticals
            });
        });
    },

    _applyRegion: function (regions) {
        var self = this, o = this.options;
        BI.each(regions || this.regions, function (i, region) {
            region.el.element.css({
                left: region.left,
                top: region.top,
                width: region.width,
                height: region.height
            });
            self.drops[region.id].left = region.left;
            self.drops[region.id].top = region.top;
            self.drops[region.id].width = region.width;
            self.drops[region.id].height = region.height;
        });
        BI.each(this.drops, function (i, region) {
            region.el.element.css({
                left: region.left,
                top: region.top,
                width: region.width,
                height: region.height
            });
        });
        this._applyContainer();
        this._calculateDrops();
        this.ratio = this.getLayoutRatio();
    },

    _renderRegion: function () {
        var self = this;
        BI.createWidget({
            type: "bi.absolute",
            element: this.container,
            items: BI.toArray(this.regions)
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this.droppable,
            items: BI.toArray(this.drops)
        });
    },

    getClientWidth: function () {
        return this.scrollContainer.element[0].clientWidth;
    },

    getClientHeight: function () {
        return this.scrollContainer.element[0].clientHeight;
    },

    _applyContainer: function () {
        //先掩藏后显示能够明确滚动条是否出现
        this.scrollContainer.element.css("overflow", "hidden");
        var occupied = this._getRegionOccupied();
        this.container.element.width(occupied.left + occupied.width).height(occupied.top + occupied.height);
        this.scrollContainer.element.css("overflow", "auto");
        return occupied;
    },

    _modifyRegion: function (regions) {
        BI.each(this.regions, function (id, region) {
            if (regions[id]) {
                region.left = regions[id].left;
                region.top = regions[id].top;
                region.width = regions[id].width;
                region.height = regions[id].height;
            }
        });
        BI.each(this.drops, function (id, region) {
            if (regions[id]) {
                region.left = regions[id].left;
                region.top = regions[id].top;
                region.width = regions[id].width;
                region.height = regions[id].height;
            }
        });
    },

    _addRegion: function (item) {
        var region = this._createOneRegion(item);
        this.regions[region.id] = region;
        var drop = this._createOneDrop(region);
        this.drops[drop.id] = drop;
        this.storeDrops[drop.id] = drop;
        this._locationRegion();
        BI.createWidget({
            type: "bi.absolute",
            element: this.container,
            items: [region]
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this.droppable,
            items: [drop]
        })
    },

    _deleteRegionByName: function (name) {
        this.regions[name].el.setVisible(false);
        this.drops[name].el.setVisible(false);
        delete this.regions[name];
        delete this.drops[name];
        this._locationRegion();
    },

    _setArrangeSize: function (size) {
        this.arrangement.element.css({
            left: size.left,
            top: size.top,
            width: size.width,
            height: size.height
        })
    },

    //Grid
    _getOneWidthPortion: function () {
        return this.getClientWidth() / BI.Arrangement.PORTION;
    },

    _getGridPositionAndSize: function (position) {
        var perWidth = this._getOneWidthPortion();
        var widthPortion = Math.round(position.width / perWidth);
        var leftPortion = Math.round(position.left / perWidth);
        var topPortion = Math.round(position.top / BI.Arrangement.GRID_HEIGHT);
        var heightPortion = Math.round(position.height / BI.Arrangement.GRID_HEIGHT);
        // if (leftPortion > BI.Arrangement.PORTION) {
        //     leftPortion = BI.Arrangement.PORTION;
        // }
        // if (widthPortion > BI.Arrangement.PORTION) {
        //     widthPortion = BI.Arrangement.PORTION;
        // }
        // if (leftPortion + widthPortion > BI.Arrangement.PORTION) {
        //     leftPortion = BI.Arrangement.PORTION - widthPortion;
        // }
        if (widthPortion === 0) {
            widthPortion = 1;
        }
        if (heightPortion === 0) {
            heightPortion = 1;
        }
        return {
            x: leftPortion,
            y: topPortion,
            w: widthPortion,
            h: heightPortion
        }
    },

    _getBlockPositionAndSize: function (position) {
        var perWidth = this._getOneWidthPortion();
        return {
            left: position.x * perWidth,
            top: position.y * BI.Arrangement.GRID_HEIGHT,
            width: position.w * perWidth,
            height: position.h * BI.Arrangement.GRID_HEIGHT
        };
    },

    _getLayoutsByRegions: function (regions) {
        var self = this;
        var result = [];
        BI.each(regions || this.regions, function (id, region) {
            result.push(BI.extend(self._getGridPositionAndSize(region), {
                i: region.id
            }))
        });
        return result;
    },

    _getLayoutIndexByName: function (layout, name) {
        return BI.findIndex(layout, function (i, l) {
            return l.i === name;
        });
    },

    _setBlockPositionAndSize: function (size) {
        this.block.element.css({
            left: size.left,
            top: size.top,
            width: size.width,
            height: size.height
        });
    },

    _getRegionsByLayout: function (layout) {
        var self = this;
        var regions = {};
        BI.each(layout, function (i, ly) {
            regions[ly.i] = BI.extend(self._getBlockPositionAndSize(ly), {
                id: ly.i
            });
        });
        return regions;
    },

    _setRegionsByLayout: function (regions, layout) {
        var self = this;
        regions || (regions = this.regions);
        BI.each(layout, function (i, ly) {
            if (regions[ly.i]) {
                BI.extend(regions[ly.i], self._getBlockPositionAndSize(ly));
            }
        });
        return regions;
    },

    _moveElement: function (layout, l, x, y, isUserAction) {
        var self = this;
        if (l.static) return layout;

        if (l.y === y && l.x === x) return layout;

        var movingUp = y && l.y > y;
        if (typeof x === 'number') l.x = x;
        if (typeof y === 'number') l.y = y;
        l.moved = true;

        var sorted = this._sortLayoutItemsByRowCol(layout);
        if (movingUp) sorted = sorted.reverse();
        var collisions = getAllCollisions(sorted, l);

        for (var i = 0, len = collisions.length; i < len; i++) {
            var collision = collisions[i];
            if (collision.moved) continue;

            if (l.y > collision.y && l.y - collision.y > collision.h / 4) continue;

            if (collision.static) {
                layout = this._moveElementAwayFromCollision(layout, collision, l, isUserAction);
            } else {
                layout = this._moveElementAwayFromCollision(layout, l, collision, isUserAction);
            }
        }

        return layout;

        function getAllCollisions(layout, layoutItem) {
            return BI.filter(layout, function (i, l) {
                return self._collides(l, layoutItem);
            });
        }
    },

    _sortLayoutItemsByRowCol: function (layout) {
        return [].concat(layout).sort(function (a, b) {
            if (a.y > b.y || (a.y === b.y && a.x > b.x)) {
                return 1;
            }
            return -1;
        });
    },

    _collides: function (l1, l2) {
        if (l1 === l2) return false; // same element
        if (l1.x + l1.w <= l2.x) return false; // l1 is left of l2
        if (l1.x >= l2.x + l2.w) return false; // l1 is right of l2
        if (l1.y + l1.h <= l2.y) return false; // l1 is above l2
        if (l1.y >= l2.y + l2.h) return false; // l1 is below l2
        return true; // boxes overlap
    },

    _getFirstCollision: function (layout, layoutItem) {
        for (var i = 0, len = layout.length; i < len; i++) {
            if (this._collides(layout[i], layoutItem)) return layout[i];
        }
    },

    _moveElementAwayFromCollision: function (layout, collidesWith,
                                             itemToMove, isUserAction) {
        if (isUserAction) {
            var fakeItem = {
                x: itemToMove.x,
                y: itemToMove.y,
                w: itemToMove.w,
                h: itemToMove.h,
                i: '-1'
            };
            fakeItem.y = Math.max(collidesWith.y - itemToMove.h, 0);
            if (!this._getFirstCollision(layout, fakeItem)) {
                return this._moveElement(layout, itemToMove, undefined, fakeItem.y);
            }
        }

        return this._moveElement(layout, itemToMove, undefined, itemToMove.y + 1);
    },

    _compactItem: function (compareWith, l, verticalCompact) {
        if (verticalCompact) {
            while (l.y > 0 && !this._getFirstCollision(compareWith, l)) {
                l.y--;
            }
        }

        var collides;
        while ((collides = this._getFirstCollision(compareWith, l))) {
            l.y = collides.y + collides.h;
        }
        return l;
    },

    compact: function (layout, verticalCompact) {
        var compareWith = getStatics(layout);
        var sorted = this._sortLayoutItemsByRowCol(layout);
        var out = [];

        for (var i = 0, len = sorted.length; i < len; i++) {
            var l = sorted[i];

            if (!l.static) {
                l = this._compactItem(compareWith, l, verticalCompact);

                compareWith.push(l);
            }

            out[layout.indexOf(l)] = l;

            l.moved = false;
        }

        return out;
        function getStatics(layout) {
            return BI.filter(layout, function (i, l) {
                return l.static;
            });
        }
    },

    ////公有方法////
    getRegionByName: function (name) {
        var obj = {};
        obj[name] = this.regions[name];
        return this._cloneRegion(obj)[name];
    },

    getAllRegions: function () {
        return BI.toArray(this._cloneRegion());
    },

    getHelper: function () {
        var helper = BI.createWidget({
            type: "bi.layout",
            width: 18,
            height: 18,
            cls: "arrangement-helper"
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [helper]
        });
        return helper;
    },

    _start: function (cur) {
        this.arrangement.setVisible(true);
        this.droppable.setVisible(true);
        if (this.options.layoutType === BI.Arrangement.LAYOUT_TYPE.GRID) {
            this.block.setVisible(true);
        }
        BI.each(this.drops, function (i, drop) {
            drop.el.setVisible(false);
        });
        if (cur) {
            if (this.drops[cur]) {
                this.drops[cur].el.setVisible(true);
            }
        }
    },

    _stop: function () {
        this.arrangement.setVisible(false);
        this.droppable.setVisible(false);
        this.block.setVisible(false);
    },

    getDirectRelativeRegions: function (name, direction) {
        direction || (direction = ["top", "bottom", "left", "right"]);
        var self = this, result = {};
        BI.each(direction, function (i, dir) {
            result[dir] = self._getDirectRelativeRegions(name, [dir]);
        });
        return result;
    },

    ////公有操作////
    setLayoutType: function (type) {
        var self = this, o = this.options;
        if (type !== o.layoutType) {
            o.layoutType = type;
            switch (o.layoutType) {
                case BI.Arrangement.LAYOUT_TYPE.ADAPTIVE:
                    this.relayout();
                    break;
                case BI.Arrangement.LAYOUT_TYPE.FREE:
                    break;
                case BI.Arrangement.LAYOUT_TYPE.GRID:
                    this.relayout();
                    break;
            }
        }
    },

    getLayoutType: function () {
        return this.options.layoutType;
    },

    getLayoutRatio: function () {
        var occupied = this._getRegionOccupied();
        var width = this.getClientWidth(), height = this.getClientHeight();
        return {
            x: BI.parseFloat(BI.contentFormat((occupied.left + occupied.width) / width, "#.##;-#.##")),
            y: BI.parseFloat(BI.contentFormat((occupied.top + occupied.height) / height, "#.##;-#.##"))
        }
    },

    addRegion: function (region, position) {
        if (position) {
            this.setPosition(position, region);
        }
        var self = this, o = this.options;
        if (!this.position) {
            return false;
        }
        var test = this._cloneRegion();
        BI.each(this.position.regions, function (i, region) {
            test[region.id].left = region.left;
            test[region.id].top = region.top;
            test[region.id].width = region.width;
            test[region.id].height = region.height;

        });
        var item = BI.extend({}, region, {
            left: this.position.insert.left,
            top: this.position.insert.top,
            width: this.position.insert.width,
            height: this.position.insert.height
        });
        var added = this._createOneRegion(item);
        test[added.id] = added;
        if (this._test(test)) {
            delete test[added.id];
            this._modifyRegion(test);
            this._addRegion(item);
            this._populate(this.getAllRegions());
            return true;
        }
        return false;
    },

    deleteRegion: function (name) {
        if (!this.regions[name]) {
            return false;
        }
        var self = this, o = this.options;
        switch (o.layoutType) {
            case BI.Arrangement.LAYOUT_TYPE.ADAPTIVE:
                var clone = this._cloneRegion();
                var regions = this._getEquivalentRelativeRegions(name);
                if (regions.length > 0) {
                    BI.each(regions, function (i, region) {
                        BI.extend(clone[region.id], region);
                    });
                    this._modifyRegion(clone);
                }
                this._deleteRegionByName(name);
                this._populate(this.getAllRegions());
                return true;
            case BI.Arrangement.LAYOUT_TYPE.FREE:
                this._deleteRegionByName(name);
                this._populate(this.getAllRegions());
                return true;
            case BI.Arrangement.LAYOUT_TYPE.GRID:
                this._deleteRegionByName(name);
                this._populate(this.getAllRegions());
                this.resize();
                return true;
        }
        return false;
    },

    setRegionSize: function (name, size) {
        var self = this, o = this.options;
        var flag = false;
        switch (o.layoutType) {
            case BI.Arrangement.LAYOUT_TYPE.ADAPTIVE:
                var current = this.regions[name];
                if (size.width !== current.width) {
                    var regions = this._getInDirectRelativeRegions(name, ["right"]).right;
                    var lefts = regions.left || [], rights = regions.right || [];
                    var offset = size.width - current.width;
                    var cloned = this._cloneRegion();
                    BI.some(lefts, function (i, left) {
                        var region = cloned[left.id];
                        region.width = region.width + offset;
                    });
                    BI.some(rights, function (i, right) {
                        var region = cloned[right.id];
                        region.width = region.width - offset;
                        region.left = region.left + offset;
                    });
                    if (this._test(cloned) && this._isArrangeFine(cloned)) {
                        this._modifyRegion(cloned);
                        flag = true;
                    }
                }
                if (size.height !== current.height) {
                    var regions = this._getInDirectRelativeRegions(name, ["bottom"]).bottom;
                    var tops = regions.top || [], bottoms = regions.bottom || [];
                    var offset = size.height - current.height;
                    var cloned = this._cloneRegion();
                    BI.some(tops, function (i, top) {
                        var region = cloned[top.id];
                        region.height = region.height + offset;
                    });
                    BI.some(bottoms, function (i, bottom) {
                        var region = cloned[bottom.id];
                        region.height = region.height - offset;
                        region.top = region.top + offset;
                    });
                    if (this._test(cloned) && this._isArrangeFine(cloned)) {
                        this._modifyRegion(cloned);
                        flag = true;
                    }
                }
                break;
            case BI.Arrangement.LAYOUT_TYPE.FREE:
                var clone = this._cloneRegion();
                BI.extend(clone[name], {
                    width: size.width,
                    height: size.height
                });
                if (this._test(clone)) {
                    this._modifyRegion(clone);
                    flag = true;
                }
                break;
            case BI.Arrangement.LAYOUT_TYPE.GRID:
                var clone = this._cloneRegion();
                BI.extend(clone[name], {
                    width: size.width,
                    height: size.height
                });
                if (this._test(clone)) {
                    var layout = this._getLayoutsByRegions(clone);
                    layout = this.compact(layout, true);
                    var regions = this._getRegionsByLayout(layout);
                    this._modifyRegion(regions);
                    flag = true;
                }
                break;
        }
        this._locationRegion();
        this._applyRegion();
        return flag;
    },

    setPosition: function (position, size) {
        var self = this, o = this.options;
        var insert, regions = [], cur;
        if (position.left < 0 || position.top < 0) {
            switch (o.layoutType) {
                case BI.Arrangement.LAYOUT_TYPE.ADAPTIVE:
                    break;
                case BI.Arrangement.LAYOUT_TYPE.FREE:
                    break;
                case BI.Arrangement.LAYOUT_TYPE.GRID:
                    this.resize();
                    break;
            }
            this._stop();
            this.position = null;
            return null;
        }
        var offset = this._getScrollOffset();
        position = {
            left: position.left + offset.left,
            top: position.top + offset.top
        };
        switch (o.layoutType) {
            case BI.Arrangement.LAYOUT_TYPE.ADAPTIVE:
                if (BI.isEmpty(this.regions)) {
                    if (self._isPositionInBounds(position, {
                            left: 0,
                            top: 0,
                            width: this.element[0].clientWidth,
                            height: this.element[0].clientHeight
                        })) {
                        insert = {
                            left: 0,
                            top: 0,
                            width: this.element[0].clientWidth,
                            height: this.element[0].clientHeight
                        };
                    }
                } else {
                    if (BI.some(this.regions, function (id, region) {
                            if (self._isPositionInBounds(position, region)) {
                                var at = self._positionAt(position, region);
                                if (!at) {
                                    insert = null;
                                } else {
                                    insert = at.insert;
                                    regions = at.regions;
                                }
                                cur = id;
                                return true;
                            }
                        })) {
                    }
                    else {
                        insert = null;
                        regions = [];
                    }
                }
                if (insert == null) {
                    this._stop();
                    self.position = null;
                    break;
                }

                this.position = {
                    insert: insert,
                    regions: regions
                };
                this._setArrangeSize(insert);
                this._start(cur);
                break;
            case BI.Arrangement.LAYOUT_TYPE.FREE:
                var insert = {
                    top: position.top < 0 ? 0 : position.top,
                    left: position.left < 0 ? 0 : position.left,
                    width: size.width,
                    height: size.height
                };
                this.position = {
                    insert: insert
                };
                this._setArrangeSize(insert);
                this._start();
                break;
            case BI.Arrangement.LAYOUT_TYPE.GRID:
                var p = {
                    top: position.top < 0 ? 0 : position.top,
                    left: position.left < 0 ? 0 : position.left,
                    width: size.width,
                    height: size.height
                };
                this._setArrangeSize(p);
                var cur = this._getGridPositionAndSize(p);
                var layout = [{
                    x: 0, y: BI.MAX, w: cur.w, h: cur.h, i: cur.i
                }].concat(this._getLayoutsByRegions());
                layout = this._moveElement(layout, layout[0], cur.x, cur.y, true);
                layout = this.compact(layout, true);
                var regions = this._setRegionsByLayout(this._cloneRegion(), layout);
                var insert = this._getBlockPositionAndSize(layout[0]);
                this.position = {
                    insert: insert,
                    regions: regions
                };
                this._applyRegion(regions);
                this._setBlockPositionAndSize(insert);
                this._start();
                break;
        }
        return this.position;
    },

    setRegionPosition: function (name, position) {
        var self = this, o = this.options;
        var offset = this._getScrollOffset();
        position = BI.extend(position, {
            left: position.left + offset.left,
            top: position.top + offset.top
        });
        switch (o.layoutType) {
            case BI.Arrangement.LAYOUT_TYPE.ADAPTIVE:
                break;
            case BI.Arrangement.LAYOUT_TYPE.FREE:
                BI.extend(this.regions[name], {
                    left: position.left < 0 ? 0 : position.left,
                    top: position.top < 0 ? 0 : position.top
                });
                this._applyRegion();
                break;
            case BI.Arrangement.LAYOUT_TYPE.GRID:
                if (!position.stop) {
                    BI.extend(this.regions[name], {
                        left: position.left < 0 ? 0 : position.left,
                        top: position.top < 0 ? 0 : position.top
                    });
                    var cloned = this._cloneRegion();
                    var cur = this._getGridPositionAndSize(BI.extend(cloned[name], {
                        left: position.left < 0 ? 0 : position.left,
                        top: position.top < 0 ? 0 : position.top
                    }));
                    var x = cur.x, y = cur.y;
                    cur = BI.extend(cur, {
                        x: 0, y: BI.MAX, i: -1
                    });
                    delete cloned[name];
                    var layout = this._getLayoutsByRegions(cloned);
                    layout = this._moveElement([cur].concat(layout), cur, x, y, true);
                    layout = this.compact(layout, true);
                    var regions = this._getRegionsByLayout(layout);
                    this._modifyRegion(regions);
                    this._applyRegion();

                    this._setBlockPositionAndSize(this._getBlockPositionAndSize(cur));
                    this.block.setVisible(true);
                } else {
                    BI.extend(this.regions[name], {
                        left: position.left < 0 ? 0 : position.left,
                        top: position.top < 0 ? 0 : position.top
                    });
                    var cloned = this._cloneRegion();
                    var layout = this._getLayoutsByRegions(cloned);
                    layout = this.compact(layout, true);
                    var regions = this._getRegionsByLayout(layout);
                    this._modifyRegion(regions);
                    this._applyRegion();
                    this.block.setVisible(false);
                }
                break;
        }
    },

    setContainerSize: function (size) {
        var self = this, o = this.options;
        var occupied = this._getRegionOccupied();
        switch (o.layoutType) {
            case BI.Arrangement.LAYOUT_TYPE.ADAPTIVE:
                if (this._isArrangeFine()) {
                    var width = size.width, height = size.height;
                    var regions = this._cloneRegion();
                    BI.each(regions, function (i, region) {
                        region.width = region.width / occupied.width * width;
                        //region.height = region.height / occupied.height * height;
                    });
                    BI.each(regions, function (id, region) {
                        var lefts = self.locations[id].left;
                        var tops = self.locations[id].top;
                        var bottoms = self.locations[id].bottom;
                        var maxRegion;
                        if (lefts.length > 0) {
                            var ids = self._getRegionNames(lefts);
                            var rs = self._getRegionsByNames(ids);
                            maxRegion = self._getRegionOccupied(rs);
                            region.left = maxRegion.left + maxRegion.width / occupied.width * width;
                        } else {
                            region.left = 0;
                        }
                        if (bottoms.length === 0) {
                            region.height = height - region.top;
                        }
                        //if (tops.length > 0) {
                        //    var ids = self._getRegionNames(tops);
                        //    var rs = self._getRegionsByNames(ids);
                        //    maxRegion = self._getRegionOccupied(rs);
                        //    region.top = maxRegion.top + maxRegion.height / occupied.height * height;
                        //}
                        //if (tops.length === 0) {
                        //    region.top = 0;
                        //}
                    });
                    if (this._test(regions)) {
                        this._modifyRegion(regions);
                        this._applyRegion();
                    }
                }
                break;
            case BI.Arrangement.LAYOUT_TYPE.FREE:
                break;
            case BI.Arrangement.LAYOUT_TYPE.GRID:
                break;
        }
        this.resize();
    },

    scrollTo: function (top) {
        this.scrollContainer.element.scrollTop(top);
    },

    zoom: function (ratio) {
        var self = this, o = this.options;
        if (!ratio) {
            return;
        }
        var occupied = this._applyContainer();
        switch (this.getLayoutType()) {
            case BI.Arrangement.LAYOUT_TYPE.ADAPTIVE:
                if (this._isArrangeFine()) {
                    var width = this.getClientWidth();
                    var xRatio = (ratio.x || 1) * width / (occupied.left + occupied.width);
                    //var yRatio = ratio.y * height / (occupied.top + occupied.height);
                    var regions = this._cloneRegion();
                    BI.each(regions, function (i, region) {
                        region.left = region.left * xRatio;
                        //region.top = region.top * yRatio;
                        region.width = region.width * xRatio;
                        //region.height = region.height * yRatio;
                    });
                    if (this._test(regions)) {
                        this._modifyRegion(regions);
                        this._applyRegion();
                    }
                    this.resize();
                    // } else {
                    this.relayout();
                }
                break;
            case BI.Arrangement.LAYOUT_TYPE.FREE:
                break;
            case BI.Arrangement.LAYOUT_TYPE.GRID:
                if (this._isArrangeFine()) {
                    var width = this.getClientWidth();
                    var xRatio = (ratio.x || 1) * width / (occupied.left + occupied.width);
                    var regions = this._cloneRegion();
                    BI.each(regions, function (i, region) {
                        region.left = region.left * xRatio;
                        region.width = region.width * xRatio;
                    });
                    if (this._test(regions)) {
                        var layout = this._getLayoutsByRegions(regions);
                        layout = this.compact(layout, true);
                        regions = this._getRegionsByLayout(layout);
                        this._modifyRegion(regions);
                        this._applyRegion();
                    }
                } else {
                    this.relayout();
                }
                break;
        }
    },

    resize: function () {
        var self = this, o = this.options;
        var occupied = this._applyContainer();
        switch (o.layoutType) {
            case BI.Arrangement.LAYOUT_TYPE.ADAPTIVE:
                if (this._isArrangeFine()) {
                    var width = this.getClientWidth(), height = this.getClientHeight();
                    var isHeightAdjust = height > occupied.top + occupied.height;
                    var regions = this._cloneRegion();
                    BI.each(regions, function (i, region) {
                        region.width = region.width / occupied.width * width;
                        //if (isHeightAdjust) {
                        //    region.height = region.height / occupied.height * height;
                        //}
                    });
                    BI.each(regions, function (id, region) {
                        var lefts = self.locations[id].left;
                        var tops = self.locations[id].top;
                        var bottoms = self.locations[id].bottom;
                        var maxRegion;
                        if (lefts.length > 0) {
                            var ids = self._getRegionNames(lefts);
                            var rs = self._getRegionsByNames(ids);
                            maxRegion = self._getRegionOccupied(rs);
                            region.left = maxRegion.left + maxRegion.width / occupied.width * width;
                        } else {
                            region.left = 0;
                        }
                        if (tops.length === 0) {
                            region.top = 0;
                        }
                        if (isHeightAdjust && bottoms.length === 0) {
                            region.height = height - region.top;
                        }
                        //if (isHeightAdjust && tops.length > 0) {
                        //    var ids = self._getRegionNames(tops);
                        //    var rs = self._getRegionsByNames(ids);
                        //    maxRegion = self._getRegionOccupied(rs);
                        //    region.top = maxRegion.top + maxRegion.height / occupied.height * height;
                        //}
                    });
                    if (this._test(regions)) {
                        this._modifyRegion(regions);
                        this._applyRegion();
                    }
                } else {
                    this.relayout();
                }
                break;
            case BI.Arrangement.LAYOUT_TYPE.FREE:
                break;
            case BI.Arrangement.LAYOUT_TYPE.GRID:
                this.zoom(this.ratio);
                var regions = this._cloneRegion();
                var layout = this._getLayoutsByRegions(regions);
                layout = this.compact(layout, true);
                regions = this._getRegionsByLayout(layout);
                this._modifyRegion(regions);
                this._applyRegion();
                break;
        }
    },

    relayout: function () {
        var self = this, o = this.options;
        if (o.isNeedReLayout === false) {
            return;
        }
        //var occupied = this._applyContainer();
        switch (o.layoutType) {
            case BI.Arrangement.LAYOUT_TYPE.ADAPTIVE:
                if (!this._isArrangeFine()) {
                    var width = this.getClientWidth(), height = this.getClientHeight();
                    var clone = BI.toArray(this._cloneRegion());
                    clone.sort(function (r1, r2) {
                        if (self._isEqual(r1.top, r2.top)) {
                            return r1.left - r2.left;
                        }
                        return r1.top - r2.top;
                    });
                    var count = clone.length;
                    var cols = 3, rows = Math.floor((count - 1) / 3 + 1);
                    var w = width / cols, h = height / rows;
                    var store = {};
                    BI.each(clone, function (i, region) {
                        var row = Math.floor(i / 3), col = i % 3;
                        BI.extend(region, {
                            top: row * 380,
                            left: col * w,
                            width: w,
                            height: 380
                        });
                        if (!store[row]) {
                            store[row] = {};
                        }
                        store[row][col] = region;
                    });
                    //非3的倍数
                    if (count % 3 !== 0) {
                        var lasts = store[rows - 1];
                        var perWidth = width / (count % 3);
                        BI.each(lasts, function (i, region) {
                            BI.extend(region, {
                                left: BI.parseInt(i) * perWidth,
                                width: perWidth
                            });
                        });
                    }
                    if (this._test(clone)) {
                        this._populate(clone);
                        this.resize();
                    }
                } else {
                    this.resize();
                }
                break;
            case BI.Arrangement.LAYOUT_TYPE.FREE:
                break;
            case BI.Arrangement.LAYOUT_TYPE.GRID:
                var width = this.getClientWidth(), height = this.getClientHeight();
                var regions = this._cloneRegion();
                var clone = BI.toArray(regions);
                clone.sort(function (r1, r2) {
                    if (self._isEqual(r1.top, r2.top)) {
                        return r1.left - r2.left;
                    }
                    return r1.top - r2.top;
                });
                var count = clone.length;
                var cols = 3, rows = Math.floor((count - 1) / 3 + 1);
                var w = width / cols, h = height / rows;
                var store = {};
                BI.each(clone, function (i, region) {
                    var row = Math.floor(i / 3), col = i % 3;
                    BI.extend(region, {
                        top: row * 380,
                        left: col * w,
                        width: w,
                        height: 380
                    });
                    if (!store[row]) {
                        store[row] = {};
                    }
                    store[row][col] = region;
                });
                //非3的倍数
                if (count % 3 !== 0) {
                    var lasts = store[rows - 1];
                    var perWidth = width / (count % 3);
                    BI.each(lasts, function (i, region) {
                        BI.extend(region, {
                            left: BI.parseInt(i) * perWidth,
                            width: perWidth
                        });
                    });
                }
                if (this._test(clone)) {
                    var layout = this._getLayoutsByRegions(regions);
                    layout = this.compact(layout, true);
                    regions = this._getRegionsByLayout(layout);
                    this._modifyRegion(regions);
                    this._populate(clone);
                }
                break;
        }
    },

    _populate: function (items) {
        this._stop();
        this._calculateRegions(items);
        this._locationRegion();
        this._applyRegion();
    },

    populate: function (items) {
        var self = this;
        BI.each(this.regions, function (name, region) {
            self.regions[name].el.setVisible(false);
            self.drops[name].el.setVisible(false);
            delete self.regions[name];
            delete self.drops[name];
        });
        this._populate(items);
        this._renderRegion();
    }
});
BI.extend(BI.Arrangement, {
    PORTION: 24,
    GRID_HEIGHT: 50,
    LAYOUT_TYPE: {
        ADAPTIVE: BICst.DASHBOARD_LAYOUT_ADAPT,
        FREE: BICst.DASHBOARD_LAYOUT_FREE,
        GRID: BICst.DASHBOARD_LAYOUT_GRID
    }
});
$.shortcut('bi.arrangement', BI.Arrangement);