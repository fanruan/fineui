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
            layoutType: BI.Arrangement.LAYOUT_TYPE.GRID,
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
        this.container = BI.createWidget({
            type: "bi.absolute",
            items: o.items.concat([this.block, this.arrangement])
        });

        this.scrollContainer = BI.createWidget({
            type: "bi.adaptive",
            width: "100%",
            height: "100%",
            scrollable: true,
            items: [this.container]
        });
        this.scrollContainer.element.scroll(function () {
            self.fireEvent(BI.Arrangement.EVENT_SCROLL, {
                scrollLeft: self.scrollContainer.element.scrollLeft(),
                scrollTop: self.scrollContainer.element.scrollTop(),
                clientWidth: self.scrollContainer.element[0].clientWidth,
                clientHeight: self.scrollContainer.element[0].clientHeight
            });
        });

        BI.createWidget({
            type: "bi.adaptive",
            element: this,
            items: [this.scrollContainer]
        });
        this.regions = {};
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
        BI.each(items, function (i, item) {
            var region = self._createOneRegion(item);
            self.regions[region.id] = region;
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

    _applyRegion: function (regions) {
        var self = this, o = this.options;
        BI.each(regions || this.regions, function (i, region) {
            region.el.element.css({
                left: region.left,
                top: region.top,
                width: region.width,
                height: region.height
            });
        });
        this._applyContainer();
        this.ratio = this.getLayoutRatio();
    },

    _renderRegion: function () {
        var self = this;
        BI.createWidget({
            type: "bi.absolute",
            element: this.container,
            items: BI.toArray(this.regions)
        });
    },

    getClientWidth: function () {
        return this.scrollContainer.element[0].clientWidth;
    },

    getClientHeight: function () {
        return this.scrollContainer.element[0].clientHeight;
    },

    getContainerSize: function () {
        return this.container.element.bounds();
    },

    setContainerSize: function (bounds) {
        return this.container.element.bounds(bounds);
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
    },

    _addRegion: function (item) {
        var region = this._createOneRegion(item);
        this.regions[region.id] = region;
        BI.createWidget({
            type: "bi.absolute",
            element: this.container,
            items: [region]
        });
    },

    _deleteRegionByName: function (name) {
        this.regions[name].el.setVisible(false);
        delete this.regions[name];
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
    _getOneHeightPortion: function () {
        return this.getClientHeight() / BI.Arrangement.H_PORTION;
    },

    _getGridPositionAndSize: function (position) {
        var perWidth = this._getOneWidthPortion();
        var perHeight = this._getOneHeightPortion();
        var widthPortion = Math.round(position.width / perWidth);
        var leftPortion = Math.round(position.left / perWidth);
        var topPortion = Math.round(position.top / perHeight);
        var heightPortion = Math.round(position.height / perHeight);
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
        var perHeight = this._getOneHeightPortion();
        return {
            left: position.x * perWidth,
            top: position.y * perHeight,
            width: position.w * perWidth,
            height: position.h * perHeight
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
        if (l._static) {
            return layout;
        }

        if (l.y === y && l.x === x) {
            return layout;
        }

        var movingUp = y && l.y > y;
        if (typeof x === 'number') {
            l.x = x;
        }
        if (typeof y === 'number') {
            l.y = y;
        }
        l.moved = true;

        var sorted = this._sortLayoutItemsByRowCol(layout);
        if (movingUp) {
            sorted = sorted.reverse();
        }
        var collisions = getAllCollisions(sorted, l);

        for (var i = 0, len = collisions.length; i < len; i++) {
            var collision = collisions[i];
            if (collision.moved) {
                continue;
            }

            if (l.y > collision.y && l.y - collision.y > collision.h / 4) {
                continue;
            }

            if (collision._static) {
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
        if (l1 === l2) {
            return false;
        } // same element
        if (l1.x + l1.w <= l2.x) {
            return false;
        } // l1 is left of l2
        if (l1.x >= l2.x + l2.w) {
            return false;
        } // l1 is right of l2
        if (l1.y + l1.h <= l2.y) {
            return false;
        } // l1 is above l2
        if (l1.y >= l2.y + l2.h) {
            return false;
        } // l1 is below l2
        return true; // boxes overlap
    },

    _getFirstCollision: function (layout, layoutItem) {
        for (var i = 0, len = layout.length; i < len; i++) {
            if (this._collides(layout[i], layoutItem)) {
                return layout[i];
            }
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

            if (!l._static) {
                l = this._compactItem(compareWith, l, verticalCompact);

                compareWith.push(l);
            }

            out[layout.indexOf(l)] = l;

            l.moved = false;
        }

        return out;
        function getStatics(layout) {
            return BI.filter(layout, function (i, l) {
                return l._static;
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
            cls: "arrangement-helper bi-border"
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [helper]
        });
        return helper;
    },

    _start: function () {
        this.arrangement.setVisible(true);
        if (this.options.layoutType === BI.Arrangement.LAYOUT_TYPE.GRID) {
            this.block.setVisible(true);
        }
    },

    _stop: function () {
        this.arrangement.setVisible(false);
        this.block.setVisible(false);
    },

    ////公有操作////
    setLayoutType: function (type) {
        var self = this, o = this.options;
        if (type !== o.layoutType) {
            o.layoutType = type;
            switch (o.layoutType) {
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
        this._applyRegion();
        return flag;
    },

    setPosition: function (position, size) {
        var self = this, o = this.options;
        var insert, regions = [], cur;
        if (position.left < 0 || position.top < 0) {
            switch (o.layoutType) {
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

    setDropPosition: function (position, size) {
        var self = this;
        this.arrangement.setVisible(true);
        var offset = this._getScrollOffset();
        this._setArrangeSize(BI.extend({}, size, {
            left: position.left + offset.left,
            top: position.top + offset.top
        }));
        return function () {
            self.arrangement.setVisible(false);
        }
    },

    scrollTo: function (scroll) {
        this.scrollContainer.element.scrollTop(scroll.top);
        this.scrollContainer.element.scrollLeft(scroll.left);
    },

    zoom: function (ratio) {
        var self = this, o = this.options;
        if (!ratio) {
            return;
        }
        var occupied = this._applyContainer();
        switch (this.getLayoutType()) {
            case BI.Arrangement.LAYOUT_TYPE.FREE:
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
            case BI.Arrangement.LAYOUT_TYPE.GRID:
                if (this._isArrangeFine()) {
                    var width = this.getClientWidth(), height = this.getClientHeight();
                    var xRatio = (ratio.x || 1) * width / (occupied.left + occupied.width);
                    var yRatio = (ratio.y || 1) * height / (occupied.top + occupied.height);
                    var regions = this._cloneRegion();
                    BI.each(regions, function (i, region) {
                        region.left = region.left * xRatio;
                        region.width = region.width * xRatio;
                        region.top = region.top * yRatio;
                        region.height = region.height * yRatio;
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
        switch (o.layoutType) {
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
        switch (o.layoutType) {
            case BI.Arrangement.LAYOUT_TYPE.FREE:
                break;
            case BI.Arrangement.LAYOUT_TYPE.GRID:
                if (!this._isArrangeFine()) {
                    var perHeight = this._getOneHeightPortion();
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
                    var cols = 4, rows = Math.floor((count - 1) / 4 + 1);
                    var w = width / cols, h = height / rows;
                    var store = {};
                    BI.each(clone, function (i, region) {
                        var row = Math.floor(i / 4), col = i % 4;
                        BI.extend(region, {
                            top: row * perHeight * 6,
                            left: col * w,
                            width: w,
                            height: perHeight * 6
                        });
                        if (!store[row]) {
                            store[row] = {};
                        }
                        store[row][col] = region;
                    });
                    //非4的倍数
                    // if (count % 4 !== 0) {
                    //     var lasts = store[rows - 1];
                    //     var perWidth = width / (count % 4);
                    //     BI.each(lasts, function (i, region) {
                    //         BI.extend(region, {
                    //             left: BI.parseInt(i) * perWidth,
                    //             width: perWidth
                    //         });
                    //     });
                    // }
                    if (this._test(clone)) {
                        var layout = this._getLayoutsByRegions(regions);
                        layout = this.compact(layout, true);
                        regions = this._getRegionsByLayout(layout);
                        this._modifyRegion(regions);
                        this._populate(clone);
                    }
                } else {
                    this.resize();
                }
                break;
        }
    },

    _populate: function (items) {
        this._stop();
        this._calculateRegions(items);
        this._applyRegion();
    },

    populate: function (items) {
        var self = this;
        BI.each(this.regions, function (name, region) {
            self.regions[name].el.setVisible(false);
            delete self.regions[name];
        });
        this._populate(items);
        this._renderRegion();
    }
});
BI.Arrangement.EVENT_SCROLL = "EVENT_SCROLL";
BI.extend(BI.Arrangement, {
    PORTION: 36,
    H_PORTION: 18,
    LAYOUT_TYPE: {
        GRID: 0,
        FREE: 1
    }
});
BI.shortcut('bi.arrangement', BI.Arrangement);