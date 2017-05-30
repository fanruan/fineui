/**
 *
 * Created by GUY on 2016/5/26.
 * @class BI.SequenceTableTreeNumber
 * @extends BI.Widget
 */
BI.SequenceTableTreeNumber = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SequenceTableTreeNumber.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-sequence-table-tree-number",
            isNeedFreeze: false,
            startSequence: 1,//开始的序号
            scrollTop: 0,
            headerRowSize: 25,
            rowSize: 25,

            sequenceHeaderCreator: null,

            header: [],
            items: [], //二维数组

            //交叉表头
            crossHeader: [],
            crossItems: []
        });
    },

    _init: function () {
        BI.SequenceTableTreeNumber.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.vCurr = 1;
        this.hCurr = 1;
        this.tasks = [];
        this.renderedCells = [];
        this.renderedKeys = [];

        this.container = BI.createWidget({
            type: "bi.absolute",
            width: 60,
            scrollable: false
        });

        this.scrollContainer = BI.createWidget({
            type: "bi.vertical",
            scrollable: false,
            scrolly: false,
            items: [this.container]
        });

        this.headerContainer = BI.createWidget({
            type: "bi.absolute",
            cls: "bi-border",
            width: 58,
            scrollable: false
        });

        this.layout = BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: this.headerContainer,
                height: this._getHeaderHeight() - 2
            }, {el: {type: "bi.layout"}, height: 2}, {
                el: this.scrollContainer
            }]
        });
        //缓存第一行对应的序号
        this.start = this.options.startSequence;
        this.cache = {};
        this._nextState();

        this._populate();
    },

    _getNextSequence: function (nodes) {
        var self = this;
        var start = this.start;
        var cnt = this.start;

        function track(node) {
            //如果已经有缓存了就不改计数了，复杂表会出现这种情况
            self.cache[node.text || node.value] || (self.cache[node.text || node.value] = cnt);
            cnt++;
        }

        BI.each(nodes, function (i, node) {
            if (BI.isNotEmptyArray(node.children)) {
                BI.each(node.children, function (index, child) {
                    if (index === 0) {
                        if (self.cache[child.text || child.value]) {
                            start = cnt = self.cache[child.text || child.value];
                        }
                    }
                    track(child)
                });
            }
        });
        this.start = cnt;
        return start;
    },

    _getStart: function (nodes) {
        var self = this;
        var start = this.start;
        BI.each(nodes, function (i, node) {
            if (BI.isNotEmptyArray(node.children)) {
                BI.each(node.children, function (index, child) {
                    if (index === 0) {
                        if (self.cache[child.text || child.value]) {
                            start = self.cache[child.text || child.value];
                        }
                    }
                });
            }
        });
        return start;
    },

    _formatNumber: function (nodes) {
        var self = this, o = this.options;
        var result = [];
        var count = this._getStart(nodes);

        function getLeafCount(node) {
            var cnt = 0;
            if (BI.isNotEmptyArray(node.children)) {
                BI.each(node.children, function (index, child) {
                    cnt += getLeafCount(child);
                });
                if (/**node.children.length > 1 && **/BI.isNotEmptyArray(node.values)) {
                    cnt++;
                }
            } else {
                cnt++;
            }
            return cnt;
        }

        var start = 0, top = 0;
        BI.each(nodes, function (i, node) {
            if (BI.isArray(node.children)) {
                BI.each(node.children, function (index, child) {
                    var cnt = getLeafCount(child);
                    result.push({
                        text: count++,
                        start: start,
                        top: top,
                        cnt: cnt,
                        index: index,
                        height: cnt * o.rowSize
                    });
                    start += cnt;
                    top += cnt * o.rowSize;
                });
                if (BI.isNotEmptyArray(node.values)) {
                    result.push({
                        text: BI.i18nText("BI-Summary_Values"),
                        start: start++,
                        top: top,
                        cnt: 1,
                        isSummary: true,
                        height: o.rowSize
                    });
                    top += o.rowSize;
                }
            }
        });
        return result;
    },

    _layout: function () {
        var self = this, o = this.options;
        var headerHeight = this._getHeaderHeight() - 2;
        var items = this.layout.attr("items");
        if (o.isNeedFreeze === false) {
            items[0].height = 0;
            items[1].height = 0;
        } else if (o.isNeedFreeze === true) {
            items[0].height = headerHeight;
            items[1].height = 2;
        }
        this.layout.attr("items", items);
        this.layout.resize();
        try {
            this.scrollContainer.element.scrollTop(o.scrollTop);
        } catch (e) {

        }
    },

    _getHeaderHeight: function () {
        var o = this.options;
        return o.headerRowSize * (o.crossHeader.length + (o.header.length > 0 ? 1 : 0));
    },

    _nextState: function () {
        var o = this.options;
        this._getNextSequence(o.items);
    },

    _prevState: function () {
        var self = this, o = this.options;
        var firstChild;
        BI.some(o.items, function (i, node) {
            if (BI.isNotEmptyArray(node.children)) {
                return BI.some(node.children, function (j, child) {
                    firstChild = child;
                    return true;
                });
            }
        });
        if (firstChild && BI.isNotEmptyObject(this.cache)) {
            this.start = this.cache[firstChild.text || firstChild.value];
        } else {
            this.start = 1;
        }
        this._nextState();
    },

    _getMaxScrollTop: function (numbers) {
        var cnt = 0;
        BI.each(numbers, function (i, number) {
            cnt += number.cnt;
        });
        return Math.max(0, cnt * this.options.rowSize - (this.options.height - this._getHeaderHeight()) + BI.DOM.getScrollWidth());
    },

    _createHeader: function () {
        var o = this.options;
        BI.createWidget({
            type: "bi.absolute",
            element: this.headerContainer,
            items: [{
                el: o.sequenceHeaderCreator || {
                    type: "bi.table_style_cell",
                    cls: "sequence-table-title-cell",
                    styleGetter: o.headerCellStyleGetter,
                    text: BI.i18nText("BI-Number_Index")
                },
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            }]
        });
    },

    _calculateChildrenToRender: function () {
        var self = this, o = this.options;

        var renderedCells = [], renderedKeys = [];
        var numbers = this._formatNumber(o.items);
        var intervalTree = BI.PrefixIntervalTree.uniform(numbers.length, 0);
        BI.each(numbers, function (i, number) {
            intervalTree.set(i, number.height);
        });
        var scrollTop = BI.clamp(o.scrollTop, 0, this._getMaxScrollTop(numbers));
        var index = intervalTree.greatestLowerBound(scrollTop);
        var offsetTop = -(scrollTop - (index > 0 ? intervalTree.sumTo(index - 1) : 0));
        var height = offsetTop;
        var bodyHeight = o.height - this._getHeaderHeight();
        while (height < bodyHeight && index < numbers.length) {
            renderedKeys.push(index);
            offsetTop += numbers[index].height;
            height += numbers[index].height;
            index++;
        }

        BI.each(renderedKeys, function (i, key) {
            var index = BI.deepIndexOf(self.renderedKeys, key);
            if (index > -1) {
                if (numbers[key].height !== self.renderedCells[index]._height) {
                    self.renderedCells[index]._height = numbers[key].height;
                    self.renderedCells[index].el.setHeight(numbers[key].height);
                }
                if (numbers[key].top !== self.renderedCells[index].top) {
                    self.renderedCells[index].top = numbers[key].top;
                    self.renderedCells[index].el.element.css("top", numbers[key].top + "px");
                }
                renderedCells.push(self.renderedCells[index]);
            } else {
                var child = BI.createWidget(BI.extend({
                    type: "bi.table_style_cell",
                    cls: "sequence-table-number-cell bi-border-left bi-border-right bi-border-bottom",
                    width: 60,
                    styleGetter: numbers[key].isSummary === true ? function () {
                        return o.summaryCellStyleGetter(true);
                    } : function (key) {
                        return function () {
                            return o.sequenceCellStyleGetter(key);
                        }
                    }(numbers[key].index)
                }, numbers[key]));
                renderedCells.push({
                    el: child,
                    left: 0,
                    top: numbers[key].top,
                    _height: numbers[key].height
                });
            }
        });

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

        this.container.setHeight(intervalTree.sumUntil(numbers.length));
    },

    _restore: function () {
        BI.each(this.renderedCells, function (i, cell) {
            cell.el.destroy();
        });
        this.renderedCells = [];
        this.renderedKeys = [];
    },

    _populate: function () {
        var self = this;
        BI.each(this.tasks, function (i, task) {
            task.apply(self);
        });
        this.tasks = [];
        this.headerContainer.empty();
        this._createHeader();
        this._layout();
        this._calculateChildrenToRender();
    },

    setVerticalScroll: function (scrollTop) {
        if (this.options.scrollTop !== scrollTop) {
            this.options.scrollTop = scrollTop;
            try {
                this.scrollContainer.element.scrollTop(scrollTop);
            } catch (e) {

            }
        }
    },

    getVerticalScroll: function () {
        return this.options.scrollTop;
    },

    setVPage: function (v) {
        if (v <= 1) {
            this.cache = {};
            this.start = this.options.startSequence;
            this._restore();
            this.tasks.push(this._nextState);
        } else if (v === this.vCurr + 1) {
            this.tasks.push(this._nextState);
        } else if (v === this.vCurr - 1) {
            this.tasks.push(this._prevState);
        }
        this.vCurr = v;
    },

    setHPage: function (v) {
        if (v !== this.hCurr) {
            this.tasks.push(this._prevState);
        }
        this.hCurr = v;
    },

    restore: function () {
        this._restore();
    },

    populate: function (items, header, crossItems, crossHeader) {
        var o = this.options;
        if (items && items !== this.options.items) {
            o.items = items;
            this._restore();
            this.tasks.push(this._prevState);
        }
        if (header && header !== this.options.header) {
            o.header = header;
        }
        if (crossItems && crossItems !== this.options.crossItems) {
            o.crossItems = crossItems;
        }
        if (crossHeader && crossHeader !== this.options.crossHeader) {
            o.crossHeader = crossHeader;
        }
        this._populate();
    }
});
BI.shortcut('bi.sequence_table_tree_number', BI.SequenceTableTreeNumber);/**
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
        this.arrangement.on(BI.Arrangement.EVENT_SCROLL, function () {
            self.fireEvent(BI.AdaptiveArrangement.EVENT_SCROLL, arguments);
        });
        if (o.isNeedResizeContainer) {

            var isResizing = false;
            var needEnd = false;
            var height;
            var interval;
            var startSize;
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
                start: function (e, ui) {
                    startSize = BI.clone(ui.size);
                },
                resize: function (e, ui) {
                    if (ui.size.height >= startSize.height - 10) {
                        resize(e, ui);
                    } else {
                        interval && clearInterval(interval);
                        needEnd = true;
                    }
                },
                stop: function (e, ui) {
                    var size = ui.size;
                    if (isResizing && !needEnd) {
                        size.height = height;
                    }
                    self.arrangement.setContainerSize(ui.size);
                    needEnd = false;
                    isResizing = false;
                    startSize = null;
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
        this._setSelect(region.el);
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
BI.AdaptiveArrangement.EVENT_SCROLL = "AdaptiveArrangement.EVENT_SCROLL";
BI.shortcut('bi.adaptive_arrangement', BI.AdaptiveArrangement);/**
 * Arrangement的block面板
 *
 * Created by GUY on 2016/3/1.
 * @class BI.ArrangementBlock
 * @extends BI.Widget
 */
BI.ArrangementBlock = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.ArrangementBlock.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-arrangement-block bi-mask"
        });
    },

    _init: function () {
        BI.ArrangementBlock.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        
    }
});
BI.shortcut('bi.arrangement_block', BI.ArrangementBlock);/**
 * Arrangement的drop面板
 *
 * Created by GUY on 2016/3/1.
 * @class BI.ArrangementDroppable
 * @extends BI.Widget
 */
BI.ArrangementDroppable = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.ArrangementDroppable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-arrangement-droppable bi-resizer"
        });
    },

    _init: function () {
        BI.ArrangementDroppable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        
    }
});
BI.shortcut('bi.arrangement_droppable', BI.ArrangementDroppable);/**
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

                if (lefts.length > 0) {
                    lefts = this._getTopAlignRegions(lefts[0].id).left;
                }
                if (rights.length > 0) {
                    rights = this._getTopAlignRegions(rights[0].id).right;
                }
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

                if (lefts.length > 0) {
                    lefts = this._getBottomAlignRegions(lefts[0].id).left;
                }
                if (rights.length > 0) {
                    rights = this._getBottomAlignRegions(rights[0].id).right;
                }
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

                if (tops.length > 0) {
                    tops = this._getLeftAlignRegions(tops[0].id).top;
                }
                if (bottoms.length > 0) {
                    bottoms = this._getLeftAlignRegions(bottoms[0].id).bottom;
                }
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

                if (tops.length > 0) {
                    tops = this._getRightAlignRegions(tops[0].id).top;
                }
                if (bottoms.length > 0) {
                    bottoms = this._getRightAlignRegions(bottoms[0].id).bottom;
                }
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
                    var isHeightAdjust = height > occupied.height;
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
BI.Arrangement.EVENT_SCROLL = "EVENT_SCROLL";
BI.extend(BI.Arrangement, {
    PORTION: 24,
    GRID_HEIGHT: 60,
    LAYOUT_TYPE: {
        ADAPTIVE: 0,
        FREE: 1,
        GRID: 2
    }
});
BI.shortcut('bi.arrangement', BI.Arrangement);/**
 * 表关联树
 *
 * Created by GUY on 2015/12/15.
 * @class BI.BranchRelation
 * @extends BI.Widget
 */
BI.BranchRelation = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.BranchRelation.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-branch-relation-tree",
            items: [],

            centerOffset: 0,//重心偏移量
            direction: BI.Direction.Bottom,
            align: BI.VerticalAlign.Top
        })
    },

    _init: function () {
        BI.BranchRelation.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    //树分层
    _stratification: function () {
        var levels = [];
        this.tree.recursion(function (node, route) {
            //node.isRoot = route.length <= 1;
            node.leaf = node.isLeaf();
            if (!levels[route.length - 1]) {
                levels[route.length - 1] = [];
            }
            levels[route.length - 1].push(node);
        });
        return levels;
    },

    //计算所有节点的叶子结点个数
    _calculateLeaves: function () {
        var count = 0;

        function track(node) {
            var c = 0;
            if (node.isLeaf()) {
                return 1;
            }
            BI.each(node.getChildren(), function (i, child) {
                c += track(child);
            });
            node.set("leaves", c);
            return c;
        }

        count = track(this.tree.getRoot());
        return count;
    },

    //树平移
    _translate: function (levels) {
        var adjust = [];
        var maxLevel = levels.length;
        BI.each(levels, function (i, nodes) {
            if (!adjust[i]) {
                adjust[i] = [];
            }
            BI.each(nodes, function (j, node) {
                if (node.isLeaf() && i < maxLevel - 1) {
                    var newNode = new BI.Node(BI.UUID());
                    //newNode.isEmptyRoot = node.isRoot || node.isEmptyRoot;
                    newNode.isNew = true;
                    //把node向下一层移
                    var tar = 0;
                    if (j > 0) {
                        var c = nodes[j - 1].getLastChild();
                        tar = levels[i + 1].indexOf(c) + 1;
                    }
                    levels[i + 1].splice(tar, 0, node);
                    //新增一个临时树节点
                    var index = node.parent.getChildIndex(node.id);
                    node.parent.removeChildByIndex(index);
                    node.parent.addChild(newNode, index);
                    newNode.addChild(node);
                    adjust[i].push(newNode);
                    nodes[j] = newNode;
                } else {
                    adjust[i].push(node);
                }
            })
        });
        return adjust;
    },

    //树补白
    _fill: function (levels) {
        var adjust = [];
        var maxLevel = levels.length;
        BI.each(levels, function (i, nodes) {
            if (!adjust[i]) {
                adjust[i] = [];
            }
            BI.each(nodes, function (j, node) {
                if (node.isLeaf() && i < maxLevel - 1) {
                    var newNode = new BI.Node(BI.UUID());
                    newNode.leaf = true;
                    newNode.width = node.width;
                    newNode.height = node.height;
                    newNode.isNew = true;
                    //把node向下一层移
                    var tar = 0;
                    if (j > 0) {
                        var c = nodes[j - 1].getLastChild();
                        tar = levels[i + 1].indexOf(c) + 1;
                    }
                    levels[i + 1].splice(tar, 0, newNode);
                    //新增一个临时树节点
                    node.addChild(newNode);
                }
                adjust[i].push(node);
            })
        });
        return adjust;
    },

    //树调整
    _adjust: function (adjust) {
        while (true) {
            var isAllNeedAjust = false;
            BI.backEach(adjust, function (i, nodes) {
                BI.each(nodes, function (j, node) {
                    if (!node.isNew) {
                        var needAdjust = true;
                        BI.any(node.getChildren(), function (k, n) {
                            if (!n.isNew) {
                                needAdjust = false;
                                return true;
                            }
                        });
                        if (!node.isLeaf() && needAdjust === true) {
                            var allChilds = [];
                            BI.each(node.getChildren(), function (k, n) {
                                allChilds = allChilds.concat(n.getChildren());
                            });
                            node.removeAllChilds();
                            BI.each(allChilds, function (k, c) {
                                node.addChild(c);
                            });
                            var newNode = new BI.Node(BI.UUID());
                            //newNode.isEmptyRoot = node.isRoot || node.isEmptyRoot;
                            newNode.isNew = true;
                            var index = node.parent.getChildIndex(node.id);
                            node.parent.removeChildByIndex(index);
                            node.parent.addChild(newNode, index);
                            newNode.addChild(node);
                            isAllNeedAjust = true;
                        }
                    }
                })
            });
            if (isAllNeedAjust === false) {
                break;
            } else {//树重构
                adjust = this._stratification();
            }
        }
        return adjust;
    },

    _calculateWidth: function () {
        var o = this.options;
        var width = 0;

        function track1(node) {
            var w = 0;
            if (node.isLeaf()) {
                return node.width;
            }
            BI.each(node.getChildren(), function (i, child) {
                w += track1(child);
            });
            return w;
        }

        function track2(node) {
            var w = 0;
            if (node.isLeaf()) {
                return node.height;
            }
            BI.each(node.getChildren(), function (i, child) {
                w += track2(child);
            });
            return w;
        }

        if (this._isVertical()) {
            width = track1(this.tree.getRoot());
        } else {
            width = track2(this.tree.getRoot());
        }

        return width;
    },

    _isVertical: function () {
        var o = this.options;
        return o.direction === BI.Direction.Top || o.direction === BI.Direction.Bottom;
    },

    _calculateHeight: function () {
        var o = this.options;
        var height = 0;

        function track1(node) {
            var h = 0;
            BI.each(node.getChildren(), function (i, child) {
                h = Math.max(h, track1(child));
            });
            return h + (node.height || 0);
        }

        function track2(node) {
            var h = 0;
            BI.each(node.getChildren(), function (i, child) {
                h = Math.max(h, track2(child));
            });
            return h + (node.width || 0);
        }

        if (this._isVertical()) {
            height = track1(this.tree.getRoot());
        } else {
            height = track2(this.tree.getRoot());
        }
        return height;
    },

    _calculateXY: function (levels) {
        var o = this.options;
        var width = this._calculateWidth();
        var height = this._calculateHeight();
        var levelCount = levels.length;
        var allLeavesCount = this._calculateLeaves();
        //计算坐标
        var xy = {};
        var levelHeight = height / levelCount;
        BI.each(levels, function (i, nodes) {
            //计算权重
            var weights = [];
            BI.each(nodes, function (j, node) {
                weights[j] = (node.get("leaves") || 1) / allLeavesCount;
            });
            BI.each(nodes, function (j, node) {
                //求前j个元素的权重
                var weight = BI.sum(weights.slice(0, j));
                //求坐标
                var x = weight * width + weights[j] * width / 2;
                var y = i * levelHeight + levelHeight / 2;
                xy[node.id] = {x: x, y: y};
            })
        });
        return xy;
    },

    _stroke: function (levels, xy) {
        var height = this._calculateHeight();
        var levelCount = levels.length;
        var levelHeight = height / levelCount;
        var self = this, o = this.options;
        switch (o.direction) {
            case BI.Direction.Top:
                BI.each(levels, function (i, nodes) {
                    BI.each(nodes, function (j, node) {
                        if (node.getChildrenLength() > 0 && !node.leaf) {
                            var path = "";
                            var start = xy[node.id];
                            var split = start.y + levelHeight / 2;
                            path += "M" + start.x + "," + (start.y + o.centerOffset) + "L" + start.x + "," + split;
                            var end = [];
                            BI.each(node.getChildren(), function (t, c) {
                                var e = end[t] = xy[c.id];
                                path += "M" + e.x + "," + (e.y + o.centerOffset) + "L" + e.x + "," + split;
                            });
                            if (end.length > 0) {
                                path += "M" + BI.first(end).x + "," + split + "L" + BI.last(end).x + "," + split;
                            }
                            self.svg.path(path).attr("stroke", "gray");
                        }
                    })
                });
                break;
            case BI.Direction.Bottom:
                BI.each(levels, function (i, nodes) {
                    BI.each(nodes, function (j, node) {
                        if (node.getChildrenLength() > 0 && !node.leaf) {
                            var path = "";
                            var start = xy[node.id];
                            var split = start.y - levelHeight / 2;
                            path += "M" + start.x + "," + (start.y - o.centerOffset) + "L" + start.x + "," + split;
                            var end = [];
                            BI.each(node.getChildren(), function (t, c) {
                                var e = end[t] = xy[c.id];
                                path += "M" + e.x + "," + (e.y - o.centerOffset) + "L" + e.x + "," + split;
                            });
                            if (end.length > 0) {
                                path += "M" + BI.first(end).x + "," + split + "L" + BI.last(end).x + "," + split;
                            }
                            self.svg.path(path).attr("stroke", "gray");
                        }
                    })
                });
                break;
            case BI.Direction.Left:
                BI.each(levels, function (i, nodes) {
                    BI.each(nodes, function (j, node) {
                        if (node.getChildrenLength() > 0 && !node.leaf) {
                            var path = "";
                            var start = xy[node.id];
                            var split = start.y + levelHeight / 2;
                            path += "M" + (start.y + o.centerOffset) + "," + start.x + "L" + split + "," + start.x;
                            var end = [];
                            BI.each(node.getChildren(), function (t, c) {
                                var e = end[t] = xy[c.id];
                                path += "M" + (e.y + o.centerOffset) + "," + e.x + "L" + split + "," + e.x;
                            });
                            if (end.length > 0) {
                                path += "M" + split + "," + BI.first(end).x + "L" + split + "," + BI.last(end).x;
                            }
                            self.svg.path(path).attr("stroke", "gray");
                        }
                    })
                });
                break;
            case BI.Direction.Right:
                BI.each(levels, function (i, nodes) {
                    BI.each(nodes, function (j, node) {
                        if (node.getChildrenLength() > 0 && !node.leaf) {
                            var path = "";
                            var start = xy[node.id];
                            var split = start.y - levelHeight / 2;
                            path += "M" + (start.y - o.centerOffset) + "," + start.x + "L" + split + "," + start.x;
                            var end = [];
                            BI.each(node.getChildren(), function (t, c) {
                                var e = end[t] = xy[c.id];
                                path += "M" + (e.y - o.centerOffset) + "," + e.x + "L" + split + "," + e.x;
                            });
                            if (end.length > 0) {
                                path += "M" + split + "," + BI.first(end).x + "L" + split + "," + BI.last(end).x;
                            }
                            self.svg.path(path).attr("stroke", "gray");
                        }
                    })
                });
                break;
        }
    },

    _createBranches: function (levels) {
        var self = this, o = this.options;
        if (o.direction === BI.Direction.Bottom || o.direction === BI.Direction.Right) {
            levels = levels.reverse();
        }
        var xy = this._calculateXY(levels);
        //画图
        this._stroke(levels, xy);
    },

    _isNeedAdjust: function () {
        var o = this.options;
        return o.direction === BI.Direction.Top && o.align === BI.VerticalAlign.Bottom || o.direction === BI.Direction.Bottom && o.align === BI.VerticalAlign.Top
            || o.direction === BI.Direction.Left && o.align === BI.HorizontalAlign.Right || o.direction === BI.Direction.Right && o.align === BI.HorizontalAlign.Left
    },

    setValue: function (value) {

    },

    getValue: function () {

    },

    _transformToTreeFormat: function (sNodes) {
        var i, l;
        if (!sNodes) {
            return [];
        }

        if (BI.isArray(sNodes)) {
            var r = [];
            var tmpMap = [];
            for (i = 0, l = sNodes.length; i < l; i++) {
                tmpMap[sNodes[i].id] = sNodes[i];
            }
            for (i = 0, l = sNodes.length; i < l; i++) {
                if (tmpMap[sNodes[i].pId] && sNodes[i].id != sNodes[i].pId) {
                    if (!tmpMap[sNodes[i].pId].children) {
                        tmpMap[sNodes[i].pId].children = [];
                    }
                    tmpMap[sNodes[i].pId].children.push(sNodes[i]);
                } else {
                    r.push(sNodes[i]);
                }
            }
            return r;
        } else {
            return [sNodes];
        }
    },

    populate: function (items) {
        var self = this, o = this.options;
        o.items = items || [];
        this.empty();
        items = this._transformToTreeFormat(o.items);
        this.tree = new BI.Tree();
        this.tree.initTree(items);

        this.svg = BI.createWidget({
            type: "bi.svg"
        });

        //树分层
        var levels = this._stratification();

        if (this._isNeedAdjust()) {
            //树平移
            var adjust = this._translate(levels);
            //树调整
            adjust = this._adjust(adjust);

            this._createBranches(adjust);
        } else {
            var adjust = this._fill(levels);

            this._createBranches(adjust);
        }

        var container = BI.createWidget({
            type: "bi.layout",
            width: this._isVertical() ? this._calculateWidth() : this._calculateHeight(),
            height: this._isVertical() ? this._calculateHeight() : this._calculateWidth()
        });
        BI.createWidget({
            type: "bi.absolute",
            element: container,
            items: [{
                el: this.svg,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }]
        });
        if (this._isVertical()) {
            items = [{
                type: "bi.handstand_branch_tree",
                expander: {
                    direction: o.direction
                },
                el: {
                    layouts: [{
                        type: "bi.horizontal_adapt",
                        verticalAlign: o.align
                    }]
                },
                items: items
            }]
        } else {
            items = [{
                type: "bi.branch_tree",
                expander: {
                    direction: o.direction
                },
                el: {
                    layouts: [{
                        type: "bi.vertical"
                    }, {
                        type: o.align === BI.HorizontalAlign.Left ? "bi.left" : "bi.right"
                    }]
                },
                items: items
            }]
        }
        BI.createWidget({
            type: "bi.adaptive",
            element: container,
            items: items
        });
        BI.createWidget({
            type: "bi.center_adapt",
            scrollable: true,
            element: this,
            items: [container]
        });
    }
});
BI.BranchRelation.EVENT_CHANGE = "BranchRelation.EVENT_CHANGE";
BI.shortcut("bi.branch_relation", BI.BranchRelation);/**
 * 日期控件中的月份下拉框
 *
 * Created by GUY on 2015/9/7.
 * @class BI.MonthDateCombo
 * @extends BI.Trigger
 */
BI.MonthDateCombo = BI.inherit(BI.Trigger, {
    _defaultConfig: function() {
        return BI.extend( BI.MonthDateCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-month-combo",
            height: 25
        });
    },
    _init: function() {
        BI.MonthDateCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.trigger = BI.createWidget({
            type: "bi.date_triangle_trigger"
        });

        this.popup = BI.createWidget({
            type: "bi.month_popup"
        });

        this.popup.on(BI.YearPopup.EVENT_CHANGE, function(){
            self.setValue(self.popup.getValue());
        })


        this.combo = BI.createWidget({
            type: "bi.combo",
            offsetStyle: "center",
            element: this,
            isNeedAdjustHeight: false,
            isNeedAdjustWidth: false,
            el: this.trigger,
            popup: {
                minWidth: 85,
                stopPropagation: false,
                el: this.popup
            }
        })
        this.combo.on(BI.Combo.EVENT_CHANGE, function(){
            self.combo.hideView();
            self.fireEvent(BI.MonthDateCombo.EVENT_CHANGE);
        });
    },

    setValue: function(v){
        this.trigger.setValue(v + 1);
        this.popup.setValue(v);
    },

    getValue: function(){
        return this.popup.getValue();
    }
});
BI.MonthDateCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.month_date_combo', BI.MonthDateCombo);/**
 * 年份下拉框
 *
 * Created by GUY on 2015/9/7.
 * @class BI.YearDateCombo
 * @extends BI.Trigger
 */
BI.YearDateCombo = BI.inherit(BI.Trigger, {
    _defaultConfig: function() {
        return BI.extend( BI.YearDateCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-year-combo",
            min: '1900-01-01', //最小日期
            max: '2099-12-31', //最大日期
            height: 25
        });
    },
    _init: function() {
        BI.YearDateCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.trigger = BI.createWidget({
            type: "bi.date_triangle_trigger"
        });

        this.popup = BI.createWidget({
            type: "bi.year_popup",
            min: o.min,
            max: o.max
        });

        this.popup.on(BI.YearPopup.EVENT_CHANGE, function(){
            self.setValue(self.popup.getValue());
            self.combo.hideView();
            self.fireEvent(BI.YearDateCombo.EVENT_CHANGE);
        })


        this.combo = BI.createWidget({
            type: "bi.combo",
            offsetStyle: "center",
            element: this,
            isNeedAdjustHeight: false,
            isNeedAdjustWidth: false,
            el: this.trigger,
            popup: {
                minWidth: 85,
                stopPropagation: false,
                el: this.popup
            }
        })
        this.combo.on(BI.Combo.EVENT_CHANGE, function(){
            self.fireEvent(BI.YearDateCombo.EVENT_CHANGE);
        })
    },

    setValue: function(v){
        this.trigger.setValue(v);
        this.popup.setValue(v);
    },

    getValue: function(){
        return this.popup.getValue();
    }
});
BI.YearDateCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.year_date_combo', BI.YearDateCombo);/**
 * Created by GUY on 2015/9/7.
 * @class BI.DatePicker
 * @extends BI.Widget
 */
BI.DatePicker = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.DatePicker.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-date-picker bi-background",
            height: 25,
            min: '1900-01-01', //最小日期
            max: '2099-12-31' //最大日期
        })
    },

    _init: function () {
        BI.DatePicker.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this._year = new Date().getFullYear();
        this._month = new Date().getMonth();
        this.left = BI.createWidget({
            type: "bi.icon_button",
            cls: "pre-page-h-font",
            width: 25,
            height: 25
        });
        this.left.on(BI.IconButton.EVENT_CHANGE, function () {
            if (self._month === 0) {
                self.setValue({
                    year: self.year.getValue() - 1,
                    month: 11
                })
            } else {
                self.setValue({
                    year: self.year.getValue(),
                    month: self.month.getValue() - 1
                })
            }
            self.fireEvent(BI.DatePicker.EVENT_CHANGE);
        });

        this.right = BI.createWidget({
            type: "bi.icon_button",
            cls: "next-page-h-font",
            width: 25,
            height: 25
        });

        this.right.on(BI.IconButton.EVENT_CHANGE, function () {
            if (self._month === 11) {
                self.setValue({
                    year: self.year.getValue() + 1,
                    month: 0
                })
            } else {
                self.setValue({
                    year: self.year.getValue(),
                    month: self.month.getValue() + 1
                })
            }
            self.fireEvent(BI.DatePicker.EVENT_CHANGE);
        });

        this.year = BI.createWidget({
            type: "bi.year_date_combo",
            min: o.min,
            max: o.max
        });
        this.year.on(BI.YearDateCombo.EVENT_CHANGE, function () {
            self.setValue({
                year: self.year.getValue(),
                month: self.month.getValue()
            });
            self.fireEvent(BI.DatePicker.EVENT_CHANGE);
        })
        this.month = BI.createWidget({
            type: "bi.month_date_combo"
        });
        this.month.on(BI.MonthDateCombo.EVENT_CHANGE, function () {
            self.setValue({
                year: self.year.getValue(),
                month: self.month.getValue()
            });
            self.fireEvent(BI.DatePicker.EVENT_CHANGE);
        });

        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: this.left,
                width: 25
            }, {
                type: "bi.center_adapt",
                items: [{
                    type: "bi.horizontal",
                    width: 100,
                    items: [this.year, this.month]
                }]
            }, {
                el: this.right,
                width: 25
            }]
        })
        this.setValue({
            year: this._year,
            month: this._month
        })
    },

    setValue: function (ob) {
        this._year = ob.year;
        this._month = ob.month;
        this.year.setValue(ob.year);
        this.month.setValue(ob.month);
    },

    getValue: function () {
        return {
            year: this.year.getValue(),
            month: this.month.getValue()
        }
    }
});
BI.DatePicker.EVENT_CHANGE = "EVENT_CHANGE"
BI.shortcut("bi.date_picker", BI.DatePicker);/**
 * Created by GUY on 2015/9/7.
 * @class BI.DateCalendarPopup
 * @extends BI.Widget
 */
BI.DateCalendarPopup = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.DateCalendarPopup.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-date-calendar-popup",
            min: '1900-01-01', //最小日期
            max: '2099-12-31', //最大日期
            selectedTime: null
        })
    },

    _createNav: function (v) {
        var date = BI.Calendar.getDateJSONByPage(v);
        var calendar = BI.createWidget({
            type: "bi.calendar",
            logic: {
                dynamic: true
            },
            min: this.options.min,
            max: this.options.max,
            year: date.year,
            month: date.month,
            day: this.selectedTime.day
        });
        return calendar;
    },

    _init: function () {
        BI.DateCalendarPopup.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.today = new Date();
        this._year = this.today.getFullYear();
        this._month = this.today.getMonth();
        this._day = this.today.getDate();

        this.selectedTime = o.selectedTime || {
                year: this._year,
                month: this._month,
                day: this._day
            };
        this.datePicker = BI.createWidget({
            type: "bi.date_picker",
            min: o.min,
            max: o.max
        });

        this.calendar = BI.createWidget({
            direction: "top",
            element: this,
            logic: {
                dynamic: true
            },
            type: "bi.navigation",
            tab: this.datePicker,
            cardCreator: BI.bind(this._createNav, this),

            afterCardCreated: function () {

            },

            afterCardShow: function () {
                this.setValue(self.selectedTime);
            }
        });

        this.datePicker.on(BI.DatePicker.EVENT_CHANGE, function () {
            self.selectedTime = self.datePicker.getValue();
            self.selectedTime.day = 1;
            self.calendar.setSelect(BI.Calendar.getPageByDateJSON(self.selectedTime));
        });

        this.calendar.on(BI.Navigation.EVENT_CHANGE, function () {
            self.selectedTime = self.calendar.getValue();
            self.setValue(self.selectedTime);
            self.fireEvent(BI.DateCalendarPopup.EVENT_CHANGE);
        });
    },

    setValue: function (timeOb) {
        this.datePicker.setValue(timeOb);
        this.calendar.setSelect(BI.Calendar.getPageByDateJSON(timeOb));
        this.calendar.setValue(timeOb);
        this.selectedTime = timeOb;
    },

    getValue: function () {
        return this.selectedTime;
    }
});
BI.DateCalendarPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.date_calendar_popup", BI.DateCalendarPopup);/**
 * 日期控件中的年份或月份trigger
 *
 * Created by GUY on 2015/9/7.
 * @class BI.DateTriangleTrigger
 * @extends BI.Trigger
 */
BI.DateTriangleTrigger = BI.inherit(BI.Trigger, {
    _const: {
        height: 25,
        iconWidth: 16,
        iconHeight: 13
    },

    _defaultConfig: function() {
        return BI.extend( BI.DateTriangleTrigger.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-date-triangle-trigger pull-down-ha-font cursor-pointer",
            height: 25
        });
    },
    _init: function() {
        BI.DateTriangleTrigger.superclass._init.apply(this, arguments);
        var o = this.options, c = this._const;
        this.text = BI.createWidget({
            type: "bi.label",
            cls: "list-item-text",
            textAlign: "right",
            text: o.text,
            value: o.value,
            height: c.height
        })
        this.icon = BI.createWidget({
            type: "bi.icon",
            width: c.iconWidth,
            height: c.iconHeight
        });

        BI.createWidget({
            type: "bi.center_adapt",
            element: this,
            items: [{
                type: "bi.center_adapt",
                width: 50,
                height: c.height,
                items: [this.text, this.icon]
            }]
        })
    },

    setValue: function(v){
        this.text.setValue(v);
    },

    getValue: function(){
        return this.text.getValue();
    },

    setText: function(v){
        this.text.setText(v);
    },

    getText: function(){
        return this.item.getText();
    },

    getKey: function(){

    }
});
BI.shortcut('bi.date_triangle_trigger', BI.DateTriangleTrigger);/**
 * 日期下拉框
 *
 * Created by GUY on 2015/9/7.
 * @class BI.DateCombo
 * @extends BI.Widget
 */
BI.DateCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.DateCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-date-combo",
            height: 30
        });
    },
    _init: function () {
        BI.DateCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.trigger = BI.createWidget({
            type: "bi.date_trigger"
        });

        this.trigger.on(BI.DateTrigger.EVENT_TRIGGER_CLICK, function () {
            self.combo.toggle();
        });

        this.popup = BI.createWidget({
            type: "bi.date_calendar_popup"
        });

        this.popup.on(BI.DateCalendarPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            toggle: false,
            element: this,
            isNeedAdjustHeight: false,
            isNeedAdjustWidth: false,
            el: this.trigger,
            popup: {
                width: 270,
                el: this.popup,
                stopPropagation: false
            }
        })
    },

    setValue: function (v) {
        this.trigger.setValue(v);
        this.popup.setValue(v);
    },

    getValue: function () {
        return this.popup.getValue();
    }
});
BI.shortcut('bi.date_combo', BI.DateCombo);BI.DateTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4,
        vgap: 2,
        triggerWidth: 30,
        yearLength: 4,
        yearMonthLength: 7
    },

    _defaultConfig: function () {
        return BI.extend(BI.DateTrigger.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-date-trigger bi-border",
            min: '1900-01-01', //最小日期
            max: '2099-12-31', //最大日期
            height: 25
        });
    },
    _init: function () {
        BI.DateTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            height: o.height,
            validationChecker: function (v) {
                var date = v.match(/\d+/g);
                self._autoAppend(v, date);
                return self._dateCheck(v) && Date.checkLegal(v) && self._checkVoid({
                        year: date[0],
                        month: date[1],
                        day: date[2]
                    });
            },
            quitChecker: function () {
                return false;
            },
            hgap: c.hgap,
            vgap: c.vgap,
            allowBlank: true,
            watermark: BI.i18nText("BI-Basic_Unrestricted"),
            errorText: function () {
                if (self.editor.isEditing()) {
                    return BI.i18nText("BI-Date_Trigger_Error_Text");
                }
                return BI.i18nText("BI-Year_Trigger_Invalid_Text");
            }
        });
        this.editor.on(BI.SignEditor.EVENT_KEY_DOWN, function () {
            self.fireEvent(BI.DateTrigger.EVENT_KEY_DOWN)
        });
        this.editor.on(BI.SignEditor.EVENT_FOCUS, function () {
            self.fireEvent(BI.DateTrigger.EVENT_FOCUS);
        });
        this.editor.on(BI.SignEditor.EVENT_STOP, function () {
            self.fireEvent(BI.DateTrigger.EVENT_STOP);
        });
        this.editor.on(BI.SignEditor.EVENT_VALID, function () {
            self.fireEvent(BI.DateTrigger.EVENT_VALID);
        });
        this.editor.on(BI.SignEditor.EVENT_ERROR, function () {
            self.fireEvent(BI.DateTrigger.EVENT_ERROR);
        });
        this.editor.on(BI.SignEditor.EVENT_CONFIRM, function () {
            var value = self.editor.getValue();
            if (BI.isNotNull(value)) {
                self.editor.setState(value);
            }

            if (BI.isNotEmptyString(value)) {
                var date = value.split("-");
                self.store_value = {
                    type: BI.DateTrigger.MULTI_DATE_CALENDAR,
                    value:{
                        year: date[0] | 0,
                        month: date[1] - 1,
                        day: date[2] | 0
                    }
                };
            }
            self.fireEvent(BI.DateTrigger.EVENT_CONFIRM);
        });
        this.editor.on(BI.SignEditor.EVENT_SPACE, function () {
            if (self.editor.isValid()) {
                self.editor.blur();
            }
        });
        this.editor.on(BI.SignEditor.EVENT_START, function () {
            self.fireEvent(BI.DateTrigger.EVENT_START);
        });
        this.editor.on(BI.SignEditor.EVENT_CHANGE, function () {
            self.fireEvent(BI.DateTrigger.EVENT_CHANGE);
        });
        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: BI.createWidget(),
                width: 30
            }, {
                el: this.editor
            }]
        })
    },
    _dateCheck: function (date) {
        return Date.parseDateTime(date, "%Y-%x-%d").print("%Y-%x-%d") == date || Date.parseDateTime(date, "%Y-%X-%d").print("%Y-%X-%d") == date || Date.parseDateTime(date, "%Y-%x-%e").print("%Y-%x-%e") == date || Date.parseDateTime(date, "%Y-%X-%e").print("%Y-%X-%e") == date;
    },
    _checkVoid: function (obj) {
        return !Date.checkVoid(obj.year, obj.month, obj.day, this.options.min, this.options.max)[0];
    },
    _autoAppend: function (v, dateObj) {
        var self = this;
        var date = Date.parseDateTime(v, "%Y-%X-%d").print("%Y-%X-%d");
        var yearCheck = function (v) {
            return Date.parseDateTime(v, "%Y").print("%Y") == v && date >= self.options.min && date <= self.options.max;
        };
        var monthCheck = function (v) {
            return Date.parseDateTime(v, "%Y-%X").print("%Y-%X") == v && date >= self.options.min && date <= self.options.max;
        };
        if (BI.isNotNull(dateObj) && Date.checkLegal(v)) {
            switch (v.length) {
                case this._const.yearLength:
                    if (yearCheck(v)) {
                        this.editor.setValue(v + "-");
                    }
                    break;
                case this._const.yearMonthLength:
                    if (monthCheck(v)) {
                        this.editor.setValue(v + "-");
                    }
                    break;
            }
        }
    },

    setValue: function (v) {
        var type, value, self = this;
        var date = new Date();
        this.store_value = v;
        if (BI.isNotNull(v)) {
            type = v.type || BI.DateTrigger.MULTI_DATE_CALENDAR; value = v.value;
            if(BI.isNull(value)){
                value = v;
            }
        }
        var _setInnerValue = function (date, text) {
            var dateStr = date.print("%Y-%x-%e");
            self.editor.setState(dateStr);
            self.editor.setValue(dateStr);
            self.setTitle(text + ":" + dateStr);
        };
        switch (type) {
            case BI.DateTrigger.MULTI_DATE_YEAR_PREV:
                var text = value + BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_YEAR_PREV];
                date = new Date((date.getFullYear() - 1 * value), date.getMonth(), date.getDate());
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_YEAR_AFTER:
                var text = value + BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_YEAR_AFTER];
                date = new Date((date.getFullYear() + 1 * value), date.getMonth(), date.getDate());
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_YEAR_BEGIN:
                var text = BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_YEAR_BEGIN];
                date = new Date(date.getFullYear(), 0, 1);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_YEAR_END:
                var text = BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_YEAR_END];
                date = new Date(date.getFullYear(), 11, 31);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_QUARTER_PREV:
                var text = value + BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_QUARTER_PREV];
                date = new Date().getBeforeMulQuarter(value);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_QUARTER_AFTER:
                var text = value + BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_QUARTER_AFTER];
                date = new Date().getAfterMulQuarter(value);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_QUARTER_BEGIN:
                var text = BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_QUARTER_BEGIN];
                date = new Date().getQuarterStartDate();
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_QUARTER_END:
                var text = BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_QUARTER_END];
                date = new Date().getQuarterEndDate();
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_MONTH_PREV:
                var text = value + BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_MONTH_PREV];
                date = new Date().getBeforeMultiMonth(value);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_MONTH_AFTER:
                var text = value + BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_MONTH_AFTER];
                date = new Date().getAfterMultiMonth(value);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_MONTH_BEGIN:
                var text = BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_MONTH_BEGIN];
                date = new Date(date.getFullYear(), date.getMonth(), 1);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_MONTH_END:
                var text = BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_MONTH_END];
                date = new Date(date.getFullYear(), date.getMonth(), (date.getLastDateOfMonth()).getDate());
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_WEEK_PREV:
                var text = value + BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_WEEK_PREV];
                date = date.getOffsetDate(-7 * value);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_WEEK_AFTER:
                var text = value + BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_WEEK_AFTER];
                date = date.getOffsetDate(7 * value);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_DAY_PREV:
                var text = value + BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_DAY_PREV];
                date = date.getOffsetDate(-1 * value);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_DAY_AFTER:
                var text = value + BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_DAY_AFTER];
                date = date.getOffsetDate(1 * value);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_DAY_TODAY:
                var text = BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_DAY_TODAY];
                date = new Date();
                _setInnerValue(date, text);
                break;
            default:
                if (BI.isNull(value) || BI.isNull(value.day)) {
                    this.editor.setState("");
                    this.editor.setValue("");
                    this.setTitle("");
                } else {
                    var dateStr = value.year + "-" + (value.month + 1) + "-" + value.day;
                    this.editor.setState(dateStr);
                    this.editor.setValue(dateStr);
                    this.setTitle(dateStr);
                }
                break;
        }
    },

    getKey: function () {
        return this.editor.getValue();
    },
    getValue: function () {
        return this.store_value;
    }

});

BI.DateTrigger.MULTI_DATE_YEAR_PREV = 1;
BI.DateTrigger.MULTI_DATE_YEAR_AFTER = 2;
BI.DateTrigger.MULTI_DATE_YEAR_BEGIN = 3;
BI.DateTrigger.MULTI_DATE_YEAR_END = 4;

BI.DateTrigger.MULTI_DATE_MONTH_PREV = 5;
BI.DateTrigger.MULTI_DATE_MONTH_AFTER = 6;
BI.DateTrigger.MULTI_DATE_MONTH_BEGIN = 7;
BI.DateTrigger.MULTI_DATE_MONTH_END = 8;

BI.DateTrigger.MULTI_DATE_QUARTER_PREV = 9;
BI.DateTrigger.MULTI_DATE_QUARTER_AFTER = 10;
BI.DateTrigger.MULTI_DATE_QUARTER_BEGIN = 11;
BI.DateTrigger.MULTI_DATE_QUARTER_END = 12;

BI.DateTrigger.MULTI_DATE_WEEK_PREV = 13;
BI.DateTrigger.MULTI_DATE_WEEK_AFTER = 14;

BI.DateTrigger.MULTI_DATE_DAY_PREV = 15;
BI.DateTrigger.MULTI_DATE_DAY_AFTER = 16;
BI.DateTrigger.MULTI_DATE_DAY_TODAY = 17;

BI.DateTrigger.MULTI_DATE_PARAM = 18;
BI.DateTrigger.MULTI_DATE_CALENDAR = 19;

BI.DateTrigger.MULTI_DATE_SEGMENT_NUM = {};
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_YEAR_PREV] = BI.i18nText("BI-Multi_Date_Year_Prev");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_YEAR_AFTER] = BI.i18nText("BI-Multi_Date_Year_Next");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_YEAR_BEGIN] = BI.i18nText("BI-Multi_Date_Year_Begin");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_YEAR_END] = BI.i18nText("BI-Multi_Date_Year_End");

BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_QUARTER_PREV] = BI.i18nText("BI-Multi_Date_Quarter_Prev");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_QUARTER_AFTER] = BI.i18nText("BI-Multi_Date_Quarter_Next");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_QUARTER_BEGIN] = BI.i18nText("BI-Multi_Date_Quarter_Begin");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_QUARTER_END] = BI.i18nText("BI-Multi_Date_Quarter_End");

BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_MONTH_PREV] = BI.i18nText("BI-Multi_Date_Month_Prev");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_MONTH_AFTER] = BI.i18nText("BI-Multi_Date_Month_Next");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_MONTH_BEGIN] = BI.i18nText("BI-Multi_Date_Month_Begin");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_MONTH_END] = BI.i18nText("BI-Multi_Date_Month_End");

BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_WEEK_PREV] = BI.i18nText("BI-Multi_Date_Week_Prev");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_WEEK_AFTER] = BI.i18nText("BI-Multi_Date_Week_Next");

BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_DAY_PREV] = BI.i18nText("BI-Multi_Date_Day_Prev");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_DAY_AFTER] = BI.i18nText("BI-Multi_Date_Day_Next");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_DAY_TODAY] = BI.i18nText("BI-Multi_Date_Today");

BI.DateTrigger.EVENT_FOCUS = "EVENT_FOCUS";
BI.DateTrigger.EVENT_START = "EVENT_START";
BI.DateTrigger.EVENT_STOP = "EVENT_STOP";
BI.DateTrigger.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DateTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.DateTrigger.EVENT_VALID = "EVENT_VALID";
BI.DateTrigger.EVENT_ERROR = "EVENT_ERROR";
BI.DateTrigger.EVENT_TRIGGER_CLICK = "EVENT_TRIGGER_CLICK";
BI.DateTrigger.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.shortcut("bi.date_trigger", BI.DateTrigger);/**
 * Created by zcf on 2017/2/20.
 */
BI.DatePaneWidget = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.DatePaneWidget.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-date-pane-widget",
            min: '1900-01-01', //最小日期
            max: '2099-12-31', //最大日期
            selectedTime: null
        })
    },
    _init: function () {
        BI.DatePaneWidget.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.today = new Date();
        this._year = this.today.getFullYear();
        this._month = this.today.getMonth();

        this.selectedTime = o.selectedTime || {
                year: this._year,
                month: this._month
            };

        this.datePicker = BI.createWidget({
            type: "bi.date_picker",
            min: o.min,
            max: o.max
        });
        this.datePicker.on(BI.DatePicker.EVENT_CHANGE, function () {
            self.selectedTime = self.datePicker.getValue();
            // self.selectedTime.day = 1;
            self.calendar.setSelect(BI.Calendar.getPageByDateJSON(self.selectedTime));
        });

        this.calendar = BI.createWidget({
            direction: "top",
            element: this,
            logic: {
                dynamic: false
            },
            type: "bi.navigation",
            tab: this.datePicker,
            cardCreator: BI.bind(this._createNav, this)

            // afterCardCreated: function () {
            //
            // },
            //
            // afterCardShow: function () {
            //     // this.setValue(self.selectedTime);
            // }
        });
        this.calendar.on(BI.Navigation.EVENT_CHANGE, function () {
            self.selectedTime = self.calendar.getValue();
            self.calendar.empty();
            self.setValue(self.selectedTime);
            self.fireEvent(BI.DateCalendarPopup.EVENT_CHANGE);
        });

    },

    _createNav: function (v) {
        var date = BI.Calendar.getDateJSONByPage(v);
        var calendar = BI.createWidget({
            type: "bi.calendar",
            logic: {
                dynamic: false
            },
            min: this.options.min,
            max: this.options.max,
            year: date.year,
            month: date.month,
            day: this.selectedTime.day
        });
        return calendar;
    },

    _getNewCurrentDate: function () {
        var today = new Date();
        return {
            year: today.getFullYear(),
            month: today.getMonth()
        }
    },

    _setCalenderValue: function (date) {
        this.calendar.setSelect(BI.Calendar.getPageByDateJSON(date));
        this.calendar.setValue(date);
        this.selectedTime = date;
    },

    _setDatePicker: function (timeOb) {
        if (BI.isNull(timeOb) || BI.isNull(timeOb.year) || BI.isNull(timeOb.month)) {
            this.datePicker.setValue(this._getNewCurrentDate());
        } else {
            this.datePicker.setValue(timeOb);
        }
    },

    _setCalendar: function (timeOb) {
        if (BI.isNull(timeOb) || BI.isNull(timeOb.day)) {
            this.calendar.empty();
            this._setCalenderValue(this._getNewCurrentDate());
        } else {
            this._setCalenderValue(timeOb)
        }
    },

    setValue: function (timeOb) {
        this._setDatePicker(timeOb);
        this._setCalendar(timeOb);
    },

    getValue: function () {
        return this.selectedTime;
    }

});
BI.shortcut("bi.date_pane_widget", BI.DatePaneWidget);/**
 * 带有方向的pathchooser
 *
 * Created by GUY on 2016/4/21.
 * @class BI.DirectionPathChooser
 * @extends BI.Widget
 */
BI.DirectionPathChooser = BI.inherit(BI.Widget, {

    _const: {
        lineColor: "#808080",
        selectLineColor: "#009de3"
    },

    _defaultConfig: function () {
        return BI.extend(BI.DirectionPathChooser.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-excel-table",
            items: []
        });
    },

    _init: function () {
        BI.DirectionPathChooser.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.pathChooser = BI.createWidget({
            type: "bi.path_chooser",
            element: this,
            items: o.items
        });
        this.pathChooser.on(BI.PathChooser.EVENT_CHANGE, function (start, index) {
            //self._unselectAllArrows();
            self._setValue(start, index);
            self.fireEvent(BI.DirectionPathChooser.EVENT_CHANGE);
        });
        this._drawArrows();

    },

    _unselectAllArrows: function () {
        var self = this, lineColor = this._const.lineColor;
        BI.each(this.arrows, function (region, rs) {
            BI.each(rs, function (idx, arrows) {
                BI.each(arrows, function (i, arrow) {
                    arrow.attr({fill: lineColor, stroke: lineColor});
                });
            });
        });
    },

    _drawOneArrow: function (dot, direction) {
        //0,1,2,3  上右下左
        var lineColor = this._const.lineColor;
        var selectLineColor = this._const.selectLineColor;
        var svg = this.pathChooser.svg;
        var path = "";
        switch (direction) {
            case 0:
                path = "M" + dot.x + "," + dot.y
                    + "L" + (dot.x - 3) + "," + (dot.y + 5)
                    + "L" + (dot.x + 3) + "," + (dot.y + 5)
                    + "L" + dot.x + "," + dot.y;
                break;
            case 1:
                path = "M" + dot.x + "," + dot.y
                    + "L" + (dot.x - 5) + "," + (dot.y - 3)
                    + "L" + (dot.x - 5) + "," + (dot.y + 3)
                    + "L" + dot.x + "," + dot.y;
                break;
            case 2:
                path = "M" + dot.x + "," + dot.y
                    + "L" + (dot.x - 3) + "," + (dot.y - 5)
                    + "L" + (dot.x + 3) + "," + (dot.y - 5)
                    + "L" + dot.x + "," + dot.y;
                break;
            case 3:
                path = "M" + dot.x + "," + dot.y
                    + "L" + (dot.x + 5) + "," + (dot.y - 3)
                    + "L" + (dot.x + 5) + "," + (dot.y + 3)
                    + "L" + dot.x + "," + dot.y;
                break;
        }
        return svg.path(path).attr({fill: lineColor, stroke: lineColor});
    },

    _drawArrows: function () {
        var self = this, o = this.options;
        var routes = this.pathChooser.routes;
        var pathes = this.pathChooser.pathes;
        var store = this.pathChooser.store;
        this.arrows = {};
        BI.each(routes, function (region, ps) {
            self.arrows[region] = [];
            BI.each(ps, function (idx, path) {
                self.arrows[region][idx] = [];
                var dots = pathes[region][idx];
                BI.each(dots, function (i, dot) {
                    if (i > 0 && i < dots.length - 1) {
                        var arrow;
                        if (dot.y === dots[i - 1].y) {
                            if (dots[i + 1].y != dot.y) {
                                if (store[path[path.length - 2]].direction === -1) {
                                    if (i - 1 > 0) {
                                        arrow = self._drawOneArrow(dots[i - 1], 3);
                                    }
                                } else {
                                    arrow = self._drawOneArrow(dots[i], 1);
                                }
                            }
                        } else if (dot.x === dots[i - 1].x) {
                            if (dot.y > dots[i - 1].y) {
                                if (store[BI.first(path)].direction === -1) {
                                    arrow = self._drawOneArrow(dots[i - 1], 0);
                                } else {
                                    arrow = self._drawOneArrow(dot, 2);
                                }
                            } else {
                                if (store[path[path.length - 2]].direction === -1) {
                                    arrow = self._drawOneArrow(dots[i - 1], 2);
                                } else {
                                    arrow = self._drawOneArrow(dot, 0);
                                }
                            }
                        }
                        if (arrow) {
                            self.arrows[region][idx].push(arrow);
                        }
                    }
                });
                BI.each(path, function (i, node) {
                    if (i !== 0) {
                        var arrow;
                        var from = path[i - 1];
                        if (store[from].direction === -1) {
                            var regionIndex = self.pathChooser.getRegionIndexById(from);
                            var x = getXoffsetByRegionIndex(regionIndex, -1);
                            var y = getYByXoffset(dots, x);
                            arrow = self._drawOneArrow({x: x, y: y}, 3);
                        } else {
                            var regionIndex = self.pathChooser.getRegionIndexById(node);
                            var x = getXoffsetByRegionIndex(regionIndex);
                            var y = getYByXoffset(dots, x);
                            arrow = self._drawOneArrow({x: x, y: y}, 1);
                        }
                        if (arrow) {
                            self.arrows[region][idx].push(arrow);
                        }
                    }
                });
            })
        });

        function getXoffsetByRegionIndex(regionIndex, diregion) {
            if (diregion === -1) {
                return 100 * (regionIndex + 1) - 20;
            }
            return 100 * regionIndex + 20;
        }

        function getYByXoffset(dots, xoffset) {
            var finded = BI.find(dots, function (i, dot) {
                if (i > 0) {
                    if (dots[i - 1].x < xoffset && dots[i].x > xoffset) {
                        return true;
                    }
                }
            });
            return finded.y;
        }
    },

    _setValue: function (start, index) {
        var self = this;
        var lineColor = this._const.lineColor;
        var selectLineColor = this._const.selectLineColor;
        var routes = this.pathChooser.routes;
        var starts = this.pathChooser.start;
        var each = [start];
        if (starts.contains(start)) {
            each = starts;
        }
        BI.each(each, function (i, s) {
            BI.each(self.arrows[s], function (j, arrows) {
                BI.each(arrows, function (k, arrow) {
                    arrow.attr({fill: lineColor, stroke: lineColor}).toFront();
                });
            });
        });
        BI.each(this.arrows[start][index], function (i, arrow) {
            arrow.attr({fill: selectLineColor, stroke: selectLineColor}).toFront();
        });
        var current = BI.last(routes[start][index]);
        while (current && routes[current] && routes[current].length === 1) {
            BI.each(self.arrows[current][0], function (i, arrow) {
                arrow.attr({fill: selectLineColor, stroke: selectLineColor}).toFront();
            });
            current = BI.last(routes[current][0]);
        }
    },

    setValue: function (v) {
        this.pathChooser.setValue(v);
        this._unselectAllArrows();
        var routes = this.pathChooser.routes;
        var nodes = BI.keys(routes), self = this;
        var result = [], array = [];
        BI.each(v, function (i, val) {
            if (BI.contains(nodes, val)) {
                if (array.length > 0) {
                    array.push(val);
                    result.push(array);
                    array = [];
                }
            }
            array.push(val);
        });
        if (array.length > 0) {
            result.push(array);
        }
        //画这n条路径
        BI.each(result, function (idx, path) {
            var start = path[0];
            var index = BI.findIndex(routes[start], function (idx, p) {
                if (BI.isEqual(path, p)) {
                    return true;
                }
            });
            if (index >= 0) {
                self._setValue(start, index);
            }
        });
    },

    getValue: function () {
        return this.pathChooser.getValue();
    },

    populate: function (items) {
        this.pathChooser.populate(items);
        this._drawArrows();
    }
});
BI.DirectionPathChooser.EVENT_CHANGE = "DirectionPathChooser.EVENT_CHANGE";
BI.shortcut('bi.direction_path_chooser', BI.DirectionPathChooser);/**
 * Created by roy on 15/8/14.
 */
BI.DownListCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.DownListCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-down-list-combo",
            invalid: false,
            height: 25,
            items: [],
            adjustLength: 0,
            el: {}
        })
    },

    _init: function () {
        BI.DownListCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.popupview = BI.createWidget({
            type: "bi.down_list_popup",
            items: o.items,
            chooseType: o.chooseType
        });

        this.popupview.on(BI.DownListPopup.EVENT_CHANGE, function (value) {
            self.fireEvent(BI.DownListCombo.EVENT_CHANGE, value);
            self.downlistcombo.hideView();
        });

        this.popupview.on(BI.DownListPopup.EVENT_SON_VALUE_CHANGE, function (value, fatherValue) {
            self.fireEvent(BI.DownListCombo.EVENT_SON_VALUE_CHANGE, value, fatherValue);
            self.downlistcombo.hideView();
        });


        this.downlistcombo = BI.createWidget({
            element: this,
            type: 'bi.combo',
            isNeedAdjustWidth: false,
            adjustLength: o.adjustLength,
            el: BI.createWidget(o.el, {
                type: "bi.icon_trigger",
                extraCls: o.iconCls ? o.iconCls : "pull-down-font",
                width: o.width,
                height: o.height
            }),
            popup: {
                el: this.popupview,
                stopPropagation: true,
                maxHeight: 1000
            }
        });

        this.downlistcombo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.DownListCombo.EVENT_BEFORE_POPUPVIEW);
        });
    },

    hideView: function () {
        this.downlistcombo.hideView();
    },

    populate: function (items) {
        this.popupview.populate(items);
    },

    setValue: function (v) {
        this.popupview.setValue(v);
    },
    getValue: function () {
        return this.popupview.getValue()
    }
});
BI.DownListCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.DownListCombo.EVENT_SON_VALUE_CHANGE = "EVENT_SON_VALUE_CHANGE";
BI.DownListCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";

BI.shortcut("bi.down_list_combo", BI.DownListCombo);/**
 * Created by roy on 15/9/6.
 */
BI.DownListGroup = BI.inherit(BI.Widget, {
    constants: {
        iconCls: "check-mark-ha-font"
    },
    _defaultConfig: function () {
        return BI.extend(BI.DownListGroup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-down-list-group",
            items: [
                {
                    el: {}
                }
            ]
        })
    },
    _init: function () {
        BI.DownListGroup.superclass._init.apply(this, arguments);
        var o = this.options, self = this;

        this.downlistgroup = BI.createWidget({
            element: this,
            type: "bi.button_tree",
            items: o.items,
            chooseType: 0,//0单选，1多选
            layouts: [{
                type: "bi.vertical",
                hgap: 0,
                vgap: 0
            }]
        });
        this.downlistgroup.on(BI.Controller.EVENT_CHANGE, function (type) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if(type === BI.Events.CLICK) {
                self.fireEvent(BI.DownListGroup.EVENT_CHANGE, arguments);
            }
        })
    },
    getValue:function(){
        return this.downlistgroup.getValue();
    },
    setValue:function(v){
        this.downlistgroup.setValue(v);
    }


})
BI.DownListGroup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.down_list_group", BI.DownListGroup);BI.DownListItem = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.DownListItem.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-down-list-item bi-list-item-active",
            cls: "",
            height: 25,
            logic: {
                dynamic: true
            },
            selected: false,
            iconHeight: null,
            iconWidth: null,
            textHgap: 0,
            textVgap: 0,
            textLgap: 0,
            textRgap: 0
        })
    },
    _init: function () {
        BI.DownListItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.text = BI.createWidget({
            type: "bi.icon_text_item",
            element: this,
            height: o.height,
            text: o.text,
            value: o.value,
            logic: o.logic,
            selected: o.selected,
            disabled: o.disabled,
            iconHeight: o.iconHeight,
            iconWidth: o.iconWidth,
            textHgap: o.textHgap,
            textVgap: o.textVgap,
            textLgap: o.textLgap,
            textRgap: o.textRgap,
            father: o.father
        });
        this.text.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.text.on(BI.IconTextItem.EVENT_CHANGE, function () {
            self.fireEvent(BI.DownListItem.EVENT_CHANGE);
        });
        // this.setSelected(o.selected);
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    isSelected: function () {
        return this.text.isSelected();
    },

    setSelected: function (b) {
        this.text.setSelected(b);
        // if (b === true) {
        //     this.element.addClass("dot-e-font");
        // } else {
        //     this.element.removeClass("dot-e-font");
        // }
    },

    setValue: function (v) {
        this.text.setValue(v);
    },

    getValue: function () {
        return this.text.getValue();
    }
});
BI.DownListItem.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.down_list_item", BI.DownListItem);BI.DownListGroupItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        var conf = BI.DownListGroupItem.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-down-list-group-item",
            logic: {
                dynamic: false
            },
            invalid: true,
            iconCls1: "dot-e-font",
            iconCls2: "pull-right-e-font"
        })
    },
    _init: function () {
        BI.DownListGroupItem.superclass._init.apply(this, arguments);
        var o = this.options;
        var self = this;
        this.text = BI.createWidget({
            type: "bi.label",
            cls: "list-group-item-text",
            textAlign: "left",
            text: o.text,
            value: o.value,
            height: o.height
        })

        this.icon1 = BI.createWidget({
            type: "bi.icon_button",
            cls: o.iconCls1,
            width: 25,
            forceNotSelected: true
        })

        this.icon2 = BI.createWidget({
            type: "bi.icon_button",
            cls: o.iconCls2,
            width: 25,
            forceNotSelected: true
        })

        var blank = BI.createWidget({
            type: "bi.layout",
            width: 25
        })
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.icon2,
                top: 0,
                bottom: 0,
                right: 0
            }]
        })

        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic("horizontal", BI.extend(o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection("left", this.icon1, this.text, blank)
        }))));

        this.element.on("mouseenter." + this.getName(), function (e) {
            if (self.element.__isMouseInBounds__(e) && self.isEnabled()) {
                self.hover();
            } else {
                self.dishover();
            }
        });
        this.element.on("mousemove." + this.getName(), function (e) {
            if (!self.element.__isMouseInBounds__(e) && self.isEnabled()) {
                self.dishover()
            }
        });
        this.element.on("mouseleave." + this.getName(), function () {
            if (self.isEnabled()) {
                self.dishover()
            }
        });
    },

    hover: function () {
        BI.DownListGroupItem.superclass.hover.apply(this, arguments);
        this.icon1.element.addClass("hover");
        this.icon2.element.addClass("hover");

    },

    dishover: function () {
        BI.DownListGroupItem.superclass.dishover.apply(this, arguments);
        this.icon1.element.removeClass("hover");
        this.icon2.element.removeClass("hover");
    },

    doClick: function () {
        BI.DownListGroupItem.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.DownListGroupItem.EVENT_CHANGE, this.getValue());
        }
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    setValue: function (v) {
        var self = this, o = this.options;
        v = BI.isArray(v) ? v : [v];
        BI.find(v, function(idx, value){
            if(BI.contains(o.childValues, value)){
                self.icon1.setSelected(true);
                return true;
            }else{
                self.icon1.setSelected(false);
            }
        })
    }
});
BI.DownListGroupItem.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.down_list_group_item", BI.DownListGroupItem);/**
 * Created by roy on 15/9/8.
 * 处理popup中的item分组样式
 * 一个item分组中的成员大于一时，该分组设置为单选，并且默认状态第一个成员设置为已选择项
 */
BI.DownListPopup = BI.inherit(BI.Pane, {
    constants: {
        nextIcon: "pull-right-e-font",
        height: 25,
        iconHeight: 12,
        iconWidth: 12,
        hgap: 0,
        vgap: 0,
        border: 1
    },
    _defaultConfig: function () {
        var conf = BI.DownListPopup.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-down-list-popup",
            items: [],
            chooseType: BI.Selection.Multi
        })
    },
    _init: function () {
        BI.DownListPopup.superclass._init.apply(this, arguments);
        this.singleValues = [];
        this.childValueMap = {};
        this.fatherValueMap = {};
        var self = this, o = this.options, children = this._createChildren(o.items);
        this.popup = BI.createWidget({
            type: "bi.button_tree",
            items: BI.createItems(children,
                {}, {
                    adjustLength: -2
                }
            ),
            layouts: [{
                type: "bi.vertical",
                hgap: this.constants.hgap,
                vgap: this.constants.vgap
            }],
            chooseType: o.chooseType
        });

        this.popup.on(BI.ButtonTree.EVENT_CHANGE, function (value, object) {
            var changedValue = value;
            if (BI.isNotNull(self.childValueMap[value])) {
                changedValue = self.childValueMap[value];
                self.fireEvent(BI.DownListPopup.EVENT_SON_VALUE_CHANGE, changedValue, self.fatherValueMap[value])
            } else {
                self.fireEvent(BI.DownListPopup.EVENT_CHANGE, changedValue, object);
            }


            if (!self.singleValues.contains(changedValue)) {
                var item = self.getValue();
                var result = [];
                BI.each(item, function (i, valueObject) {
                    if (valueObject.value != changedValue) {
                        result.push(valueObject);
                    }
                });
                self.setValue(result);
            }

        });

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [this.popup]
        });

    },
    _createChildren: function (items) {
        var self = this, result = [];
        BI.each(items, function (i, it) {
            var item_done = {
                type: "bi.down_list_group",
                items: []
            };

            BI.each(it, function (i, item) {
                if (BI.isNotEmptyArray(item.children) && !BI.isEmpty(item.el)) {
                    item.type = "bi.combo_group";
                    item.cls = "down-list-group";
                    item.trigger = "hover";
                    item.isNeedAdjustWidth = false;
                    item.el.title = item.el.title || item.el.text;
                    item.el.type = "bi.down_list_group_item";
                    item.el.logic = {
                        dynamic: true
                    };
                    item.el.height = self.constants.height;
                    item.el.iconCls2 = self.constants.nextIcon;
                    item.popup = {
                        lgap: 4,
                        el: {
                            type: "bi.button_tree",
                            chooseType: 0,
                            layouts: [{
                                type: "bi.vertical"
                            }]

                        }
                    };
                    item.el.childValues = [];
                    BI.each(item.children, function (i, child) {
                        var fatherValue = BI.deepClone(item.el.value);
                        var childValue = BI.deepClone(child.value);
                        self.singleValues.push(child.value);
                        child.type = "bi.down_list_item";
                        child.extraCls = " child-down-list-item";
                        child.title = child.title || child.text;
                        child.textRgap = 10;
                        child.isNeedAdjustWidth = false;
                        child.logic = {
                            dynamic: true
                        };
                        child.father = fatherValue;
                        self.fatherValueMap[self._createChildValue(fatherValue, childValue)] = fatherValue;
                        self.childValueMap[self._createChildValue(fatherValue, childValue)] = childValue;
                        child.value = self._createChildValue(fatherValue, childValue);
                        item.el.childValues.push(child.value);
                    })
                } else {
                    item.type = "bi.down_list_item";
                    item.title = item.title || item.text;
                    item.textRgap = 10;
                    item.isNeedAdjustWidth = false;
                    item.logic = {
                        dynamic: true
                    }
                }
                var el_done = {};
                el_done.el = item;
                item_done.items.push(el_done);
            });
            if (self._isGroup(item_done.items)) {
                BI.each(item_done.items, function (i, item) {
                    self.singleValues.push(item.el.value);
                })
            }

            result.push(item_done);
            if (self._needSpliter(i, items.length)) {
                var spliter_container = BI.createWidget({
                    type: "bi.vertical",
                    items: [{
                        el: {
                            type: "bi.layout",
                            cls: "bi-down-list-spliter bi-border-top cursor-pointer",
                            height: 0
                        }

                    }],
                    cls: "bi-down-list-spliter-container cursor-pointer",
                    lgap: 10,
                    rgap: 10
                });
                result.push(spliter_container);
            }
        });
        return result;
    },

    _isGroup: function (i) {
        return i.length > 1;
    },

    _needSpliter: function (i, itemLength) {
        return i < itemLength - 1;
    },

    _createChildValue: function (fatherValue, childValue) {
        return fatherValue + "_" + childValue
    },

    populate: function (items) {
        BI.DownListPopup.superclass.populate.apply(this, arguments);
        var self = this;
        self.childValueMap = {};
        self.fatherValueMap = {};
        self.singleValues = [];
        var children = self._createChildren(items);
        var popupItem = BI.createItems(children,
            {}, {
                adjustLength: -2
            }
        );
        self.popup.populate(popupItem);
    },

    setValue: function (valueItem) {
        var self = this;
        var valueArray = [];
        BI.each(valueItem, function (i, item) {
                var value;
                if (BI.isNotNull(item.childValue)) {
                    value = self._createChildValue(item.value, item.childValue);
                } else {
                    value = item.value;
                }
                valueArray.push(value);
            }
        );
        this.popup.setValue(valueArray);
    },

    getValue: function () {
        var self = this, result = [];
        var values = this.popup.getValue();
        BI.each(values, function (i, value) {
            var valueItem = {};
            if (BI.isNotNull(self.childValueMap[value])) {
                var fartherValue = self.fatherValueMap[value];
                valueItem.childValue = self.childValueMap[value];
                valueItem.value = fartherValue;
            } else {
                valueItem.value = value;
            }
            result.push(valueItem);
        });
        return result;
    }


});

BI.DownListPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.DownListPopup.EVENT_SON_VALUE_CHANGE = "EVENT_SON_VALUE_CHANGE";
BI.shortcut("bi.down_list_popup", BI.DownListPopup);/**
 *
 * Created by GUY on 2016/3/28.
 * @class BI.ExcelTableCell
 * @extends BI.Widget
 */
BI.ExcelTableCell = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.ExcelTableCell.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-excel-table-cell",
            text: ""
        });
    },

    _init: function () {
        BI.ExcelTableCell.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        BI.createWidget({
            type: "bi.label",
            element: this,
            textAlign: "left",
            whiteSpace: "normal",
            height: this.options.height,
            text: this.options.text,
            value: this.options.value
        })
    }
});
BI.shortcut('bi.excel_table_cell', BI.ExcelTableCell);/**
 *
 * Created by GUY on 2016/3/28.
 * @class BI.ExcelTableHeaderCell
 * @extends BI.Widget
 */
BI.ExcelTableHeaderCell = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.ExcelTableHeaderCell.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-excel-table-header-cell bi-background",
            text: ""
        });
    },

    _init: function () {
        BI.ExcelTableHeaderCell.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        BI.createWidget({
            type: "bi.label",
            element: this,
            textAlign: BI.HorizontalAlign.Center,
            whiteSpace: "normal",
            height: this.options.height,
            text: this.options.text,
            value: this.options.value
        })
    }
});
BI.shortcut('bi.excel_table_header_cell', BI.ExcelTableHeaderCell);/**
 * Excel表格
 *
 * Created by GUY on 2016/3/28.
 * @class BI.ExcelTable
 * @extends BI.Widget
 */
BI.ExcelTable = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.ExcelTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-excel-table",
            el: {
                type: "bi.responsive_table"
            },

            isNeedResize: false,
            isResizeAdapt: true,

            isNeedMerge: false,//是否需要合并单元格
            mergeCols: [], //合并的单元格列号
            mergeRule: function (row1, row2) { //合并规则, 默认相等时合并
                return BI.isEqual(row1, row2);
            },

            columnSize: [],
            headerRowSize: 37,
            footerRowSize: 37,
            rowSize: 37,

            regionColumnSize: false,

            items: [] //二维数组
        });
    },

    _init: function () {
        BI.ExcelTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        var mergeCols = [];
        BI.each(o.mergeCols, function (i, col) {
            mergeCols.push(col + 1);
        });
        this.table = BI.createWidget(o.el, {
            type: "bi.table_view",
            element: this,

            isNeedFreeze: false,

            isNeedMerge: o.isNeedMerge,
            mergeCols: mergeCols,
            mergeRule: o.mergeRule,

            columnSize: [""].concat(o.columnSize),
            headerRowSize: 18,
            rowSize: o.rowSize,

            regionColumnSize: o.regionColumnSize || [82, ""]
        });

        if (BI.isNotEmptyArray(o.items)) {
            this.populate(o.items);
        }
        BI.nextTick(function () {
            self.setRegionColumnSize(o.regionColumnSize || [82, ""]);
        });
    },

    resize: function () {
        this.table.resize();
    },

    setColumnSize: function (columnSize) {
        this.table.setColumnSize(columnSize);
    },

    getColumnSize: function () {
        return this.table.getColumnSize();
    },

    getCalculateColumnSize: function () {
        return this.table.getCalculateColumnSize();
    },

    setHeaderColumnSize: function (columnSize) {
        this.table.setHeaderColumnSize(columnSize);
    },

    setRegionColumnSize: function (columnSize) {
        this.table.setRegionColumnSize(columnSize);
    },

    getRegionColumnSize: function () {
        return this.table.getRegionColumnSize();
    },

    getCalculateRegionColumnSize: function () {
        return this.table.getCalculateRegionColumnSize();
    },

    getCalculateRegionRowSize: function () {
        return this.table.getCalculateRegionRowSize();
    },

    getClientRegionColumnSize: function () {
        return this.table.getClientRegionColumnSize();
    },

    getScrollRegionColumnSize: function () {
        return this.table.getScrollRegionColumnSize();
    },

    getScrollRegionRowSize: function () {
        return this.table.getScrollRegionRowSize();
    },

    hasVerticalScroll: function () {
        return this.table.hasVerticalScroll();
    },

    setVerticalScroll: function (scrollTop) {
        this.table.setVerticalScroll(scrollTop);
    },

    setLeftHorizontalScroll: function (scrollLeft) {
        this.table.setLeftHorizontalScroll(scrollLeft);
    },

    setRightHorizontalScroll: function (scrollLeft) {
        this.table.setRightHorizontalScroll(scrollLeft);
    },

    getVerticalScroll: function () {
        return this.table.getVerticalScroll();
    },

    getLeftHorizontalScroll: function () {
        return this.table.getLeftHorizontalScroll();
    },

    getRightHorizontalScroll: function () {
        return this.table.getRightHorizontalScroll();
    },

    getColumns: function () {
        return this.table.getColumns();
    },

    resizeHeader: function () {
        this.table.resize();
        this.table._resizeHeader && this.table._resizeHeader();
    },

    attr: function (key,value) {
        var self = this;
        if (BI.isObject(key)) {
            BI.each(key, function (k, v) {
                self.attr(k, v);
            });
            return;
        }
        BI.ExcelTable.superclass.attr.apply(this, arguments);
        switch (key){
            case "mergeCols":
                var mCols = [];
                BI.each(value, function (i, col) {
                    mCols.push(col + 1);
                });
                value=mCols;
                break;
        }
        this.table.attr.apply(this.table, arguments);
    },

    populate: function (rows) {
        var self = this;
        var columnSize = this.getColumnSize();
        var items = [];
        var header = [{
            type: "bi.excel_table_header_cell"
        }];
        if (BI.isNotNull(rows)) {
            BI.each(columnSize, function (i, size) {
                header.push({
                    type: "bi.excel_table_header_cell",
                    text: BI.int2Abc(i + 1)
                });
            });
            BI.each(rows, function (i, row) {
                items.push([{
                    type: "bi.excel_table_header_cell",
                    text: (i + 1)
                }].concat(row));
            });
        }
        this.table.populate(items, [header]);
    },

    destroy: function () {
        this.table.destroy();
        BI.ExcelTable.superclass.destroy.apply(this, arguments);
    }
});
BI.shortcut('bi.excel_table', BI.ExcelTable);/**
 * 文件管理控件组
 *
 * Created by GUY on 2015/12/11.
 * @class BI.FileManagerButtonGroup
 * @extends BI.Widget
 */
BI.FileManagerButtonGroup = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.FileManagerButtonGroup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-file-manager-button_group",
            items: []
        })
    },

    _init: function () {
        BI.FileManagerButtonGroup.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.button_group = BI.createWidget({
            type: "bi.button_tree",
            element: this,
            chooseType: BI.Selection.Multi,
            items: this._formatItems(o.items),
            layouts: [{
                type: "bi.vertical"
            }]
        });
        this.button_group.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
    },

    _formatItems: function (items) {
        var self = this, o = this.options;
        BI.each(items, function (i, item) {
            if (item.children && item.children.length > 0) {
                item.type = "bi.file_manager_folder_item";
            } else {
                item.type = "bi.file_manager_file_item";
            }
        });
        return items;
    },

    setValue: function (v) {
        this.button_group.setValue(v);
    },

    getValue: function () {
        return this.button_group.getValue();
    },

    getNotSelectedValue: function () {
        return this.button_group.getNotSelectedValue();
    },

    getAllLeaves: function () {
        return this.button_group.getAllLeaves();
    },

    getAllButtons: function () {
        return this.button_group.getAllButtons();
    },

    getSelectedButtons: function () {
        return this.button_group.getSelectedButtons();
    },

    getNotSelectedButtons: function () {
        return this.button_group.getNotSelectedButtons();
    },

    populate: function (items) {
        this.button_group.populate(this._formatItems(items));
    }
});
BI.FileManagerButtonGroup.EVENT_CHANGE = "FileManagerButtonGroup.EVENT_CHANGE";
BI.shortcut("bi.file_manager_button_group", BI.FileManagerButtonGroup);/**
 * 文件管理控件
 *
 * Created by GUY on 2015/12/11.
 * @class BI.FileManager
 * @extends BI.Widget
 */
BI.FileManager = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.FileManager.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-file-manager",
            el: {},
            items: []
        })
    },

    _init: function () {
        BI.FileManager.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.tree = new BI.Tree();
        var items = BI.Tree.transformToTreeFormat(o.items);
        this.tree.initTree(items);
        this.selectedValues = [];
        this.nav = BI.createWidget({
            type: "bi.file_manager_nav",
            items: BI.deepClone(items)
        });
        this.nav.on(BI.FileManagerNav.EVENT_CHANGE, function (value, obj) {
            if (value == "-1") {//根节点
                self.populate({children: self.tree.toJSON()});
            } else {
                var node = self.tree.search(obj.attr("id"));
                self.populate(BI.extend({id: node.id}, node.get("data"), {children: self.tree.toJSON(node)}));
            }
            self.setValue(self.selectedValues);
        });
        this.list = BI.createWidget(o.el, {
            type: "bi.file_manager_list",
            items: items
        });
        this.list.on(BI.Controller.EVENT_CHANGE, function (type, selected, obj) {
            if (type === BI.Events.CHANGE) {
                var node = self.tree.search(obj.attr("id"));
                self.populate(BI.extend({id: node.id}, node.get("data"), {children: self.tree.toJSON(node)}));
            } else if (type === BI.Events.CLICK) {
                var values = [];
                if (obj instanceof BI.MultiSelectBar) {
                    var t = self.list.getValue();
                    selected = t.type === BI.Selection.All;
                    values = BI.concat(t.assist, t.value);
                } else {
                    values = obj.getAllLeaves();
                }
                BI.each(values, function (i, v) {
                    if (selected === true) {
                        self.selectedValues.pushDistinct(v);
                    } else {
                        self.selectedValues.remove(v);
                    }
                });
            }
            self.setValue(self.selectedValues);
        });

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.list,
                left: 0,
                right: 0,
                top: 0,
                bottom: 10
            }, {
                el: this.nav,
                left: 40,
                right: 100,
                top: 0
            }]
        });
    },

    setValue: function (value) {
        this.selectedValues = value || [];
        this.list.setValue(this.selectedValues);
    },

    getValue: function () {
        var obj = this.list.getValue();
        var res = obj.type === BI.Selection.All ? obj.assist : obj.value;
        res.pushDistinctArray(this.selectedValues);
        return res;
    },

    _populate: function (items) {
        this.list.populate(items);
    },

    getSelectedValue: function () {
        return this.nav.getValue()[0];
    },

    getSelectedId: function () {
        return this.nav.getId()[0];
    },

    populate: function (node) {
        var clone = BI.deepClone(node);
        this._populate(node.children);
        this.nav.populate(clone);
    }
});
BI.FileManager.EVENT_CHANGE = "FileManager.EVENT_CHANGE";
BI.shortcut("bi.file_manager", BI.FileManager);/**
 * 文件管理控件
 *
 * Created by GUY on 2015/12/11.
 * @class BI.FileManagerFileItem
 * @extends BI.Single
 */
BI.FileManagerFileItem = BI.inherit(BI.Single, {

    _defaultConfig: function () {
        return BI.extend(BI.FileManagerFileItem.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-file-manager-file-item bi-list-item bi-border-bottom",
            height: 30
        })
    },

    _init: function () {
        BI.FileManagerFileItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.checked = BI.createWidget({
            type: "bi.multi_select_bar",
            text: "",
            width: 36,
            height: o.height
        });
        this.checked.on(BI.Controller.EVENT_CHANGE, function () {
            arguments[2] = self;
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: this.checked,
                width: 36
            }, {
                el: {
                    type: "bi.icon_button",
                    cls: "create-by-me-file-font"
                },
                width: 20
            }, {
                el: {
                    type: "bi.label",
                    textAlign: "left",
                    height: o.height,
                    text: o.text,
                    value: o.value
                }
            }]
        })
    },

    getAllLeaves: function(){
        return [this.options.value];
    },

    isSelected: function () {
        return this.checked.isSelected();
    },

    setSelected: function (v) {
        this.checked.setSelected(v);
    }
});
BI.FileManagerFileItem.EVENT_CHANGE = "FileManagerFileItem.EVENT_CHANGE";
BI.shortcut("bi.file_manager_file_item", BI.FileManagerFileItem);/**
 * 文件管理控件
 *
 * Created by GUY on 2015/12/11.
 * @class BI.FileManagerFolderItem
 * @extends BI.Single
 */
BI.FileManagerFolderItem = BI.inherit(BI.Single, {

    _defaultConfig: function () {
        return BI.extend(BI.FileManagerFolderItem.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-file-manager-folder-item bi-list-item bi-border-bottom",
            height: 30
        })
    },

    _init: function () {
        BI.FileManagerFolderItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.checked = BI.createWidget({
            type: "bi.multi_select_bar",
            text: "",
            width: 36,
            height: o.height
        });
        this.checked.on(BI.Controller.EVENT_CHANGE, function () {
            arguments[2] = self;
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.button = BI.createWidget({
            type: "bi.text_button",
            textAlign: "left",
            height: o.height,
            text: o.text,
            value: o.value
        });
        this.button.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.CHANGE, o.value, self);
        });

        this.tree = new BI.Tree();
        this.tree.initTree([{
            id: o.id,
            children: o.children
        }]);
        this.selectValue = [];

        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: this.checked,
                width: 36
            }, {
                el: {
                    type: "bi.icon_button",
                    cls: "create-by-me-folder-font"
                },
                width: 20
            }, {
                el: this.button
            }]
        })
    },

    setAllSelected: function (v) {
        this.checked.setSelected(v);
        this.selectValue = [];
    },

    setHalfSelected: function (v) {
        this.checked.setHalfSelected(v);
        if(!v){
            this.selectValue = [];
        }
    },

    setValue: function (v) {
        var self = this, o = this.options;
        var isHalf = false;
        var selectValue = [];
        this.tree.traverse(function (node) {
            if (node.isLeaf()) {
                if (BI.contains(v, node.get("data").value)) {
                    selectValue.push(node.get("data").value);
                } else {
                    isHalf = true;
                }
            }
        });
        this.setAllSelected(selectValue.length > 0 && !isHalf);
        this.setHalfSelected(selectValue.length > 0 && isHalf);
        if (this.checked.isHalfSelected()) {
            this.selectValue = selectValue;
        }
    },

    getAllButtons: function () {
        return [this];
    },

    getAllLeaves: function () {
        var o = this.options;
        var res = [];
        this.tree.traverse(function (node) {
            if (node.isLeaf()) {
                res.push(node.get("data").value)
            }
        });
        return res;
    },

    getNotSelectedValue: function () {
        var self = this, o = this.options;
        var res = [];
        var isAllSelected = this.checked.isSelected();
        if (isAllSelected === true) {
            return res;
        }
        var isHalfSelected = this.checked.isHalfSelected();
        this.tree.traverse(function (node) {
            if (node.isLeaf()) {
                var v = node.get("data").value;
                if (isHalfSelected === true) {
                    if (!BI.contains(self.selectValue, node.get("data").value)) {
                        res.push(v);
                    }
                } else {
                    res.push(v);
                }
            }
        });
        return res;
    },

    getValue: function () {
        var res = [];
        if (this.checked.isSelected()) {
            this.tree.traverse(function (node) {
                if (node.isLeaf()) {
                    res.push(node.get("data").value);
                }
            });
            return res;
        }
        if (this.checked.isHalfSelected()) {
            return this.selectValue;
        }
        return [];
    }
});
BI.FileManagerFolderItem.EVENT_CHANGE = "FileManagerFolderItem.EVENT_CHANGE";
BI.shortcut("bi.file_manager_folder_item", BI.FileManagerFolderItem);/**
 * 文件管理控件列表
 *
 * Created by GUY on 2015/12/11.
 * @class BI.FileManagerList
 * @extends BI.Widget
 */
BI.FileManagerList = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.FileManagerList.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-file-manager-list",
            el: {},
            items: []
        })
    },

    _init: function () {
        BI.FileManagerList.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.list = BI.createWidget({
            type: "bi.select_list",
            element: this,
            items: o.items,
            toolbar: {
                type: "bi.multi_select_bar",
                height: 40,
                text: ""
            },
            el: {
                type: "bi.list_pane",
                el: BI.isWidget(o.el) ? o.el : BI.extend({
                    type: "bi.file_manager_button_group"
                }, o.el)
            }
        });
        this.list.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
    },

    setValue: function (v) {
        this.list.setValue({
            value: v
        });
    },

    getValue: function () {
        return this.list.getValue();
    },

    populate: function (items) {
        this.list.populate(items);
        this.list.setToolBarVisible(true);
    }
});
BI.FileManagerList.EVENT_CHANGE = "FileManagerList.EVENT_CHANGE";
BI.shortcut("bi.file_manager_list", BI.FileManagerList);/**
 * 文件管理导航按钮
 *
 * Created by GUY on 2015/12/11.
 * @class BI.FileManagerNavButton
 * @extends BI.Widget
 */
BI.FileManagerNavButton = BI.inherit(BI.Widget, {

    _const: {
        normal_color: "#ffffff",
        select_color: "#f4f4f4"
    },
    _defaultConfig: function () {
        return BI.extend(BI.FileManagerNavButton.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-file-manager-nav-button",
            selected: false,
            height: 40
        })
    },

    _init: function () {
        BI.FileManagerNavButton.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.button = BI.createWidget({
            type: "bi.text_button",
            cls: "file-manager-nav-button-text bi-card",
            once: true,
            selected: o.selected,
            text: o.text,
            title: o.text,
            value: o.value,
            height: o.height,
            lgap: 20,
            rgap: 10
        });
        this.button.on(BI.Controller.EVENT_CHANGE, function () {
            arguments[2] = self;
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        var svg = BI.createWidget({
            type: "bi.svg",
            cls: "file-manager-nav-button-triangle",
            width: 15,
            height: o.height
        });
        var path = svg.path("M0,0L15,20L0,40").attr({
            "stroke": c.select_color,
            "fill": o.selected ? c.select_color : c.normal_color
        });
        this.button.on(BI.TextButton.EVENT_CHANGE, function () {
            if (this.isSelected()) {
                path.attr("fill", c.select_color);
            } else {
                path.attr("fill", c.normal_color);
            }
        });
        BI.createWidget({
            type: "bi.default",
            element: this,
            items: [this.button]
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: svg,
                right: -15,
                top: 0,
                bottom: 0
            }]
        })
    },

    isSelected: function () {
        return this.button.isSelected();
    },

    setValue: function (v) {
        this.button.setValue(v);
    },

    getValue: function () {
        return this.button.getValue();
    },

    populate: function (items) {

    }
});
BI.FileManagerNavButton.EVENT_CHANGE = "FileManagerNavButton.EVENT_CHANGE";
BI.shortcut("bi.file_manager_nav_button", BI.FileManagerNavButton);/**
 * 文件管理导航
 *
 * Created by GUY on 2015/12/11.
 * @class BI.FileManagerNav
 * @extends BI.Widget
 */
BI.FileManagerNav = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.FileManagerNav.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-file-manager-nav bi-border-left",
            height: 40,
            items: []
        })
    },

    _init: function () {
        BI.FileManagerNav.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.tree = new BI.Tree();
        this.refreshTreeData(o.items);
        this.tree.getRoot().set("data", {
            text: BI.i18nText("BI-Created_By_Me"),
            value: BI.FileManagerNav.ROOT_CREATE_BY_ME,
            id: BI.FileManagerNav.ROOT_CREATE_BY_ME
        });
        this.button_group = BI.createWidget({
            type: "bi.button_group",
            element: this,
            items: [{
                type: "bi.file_manager_nav_button",
                text: BI.i18nText("BI-Created_By_Me"),
                selected: true,
                id: BI.FileManagerNav.ROOT_CREATE_BY_ME,
                value: BI.FileManagerNav.ROOT_CREATE_BY_ME
            }],
            layouts: [{
                type: "bi.horizontal"
            }]
        });
        this.button_group.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.button_group.on(BI.ButtonGroup.EVENT_CHANGE, function (value, obj) {
            self.fireEvent(BI.FileManagerNav.EVENT_CHANGE, arguments);
        });
    },

    _getAllParents: function (id) {
        var node, res = [];
        if (!id) {
            node = this.tree.getRoot();
        } else {
            node = this.tree.search(id);
        }
        while (node.parent) {
            res.push(node);
            node = node.parent;
        }
        res.push(node);
        return res.reverse();
    },

    _formatNodes: function (nodes) {
        var res = [];
        BI.each(nodes, function (i, node) {
            res.push(BI.extend({
                type: "bi.file_manager_nav_button",
                id: node.id
            }, node.get("data")));
        });
        BI.last(res).selected = true;
        return res;
    },

    getValue: function () {
        return this.button_group.getValue();
    },

    getId: function () {
        var ids = [];
        BI.each(this.button_group.getSelectedButtons(), function (i, btn) {
            ids.push(btn.attr("id"));
        });
        return ids;
    },

    refreshTreeData: function(items){
        this.tree.initTree(BI.Tree.transformToTreeFormat(items));
        this.tree.getRoot().set("data", {
            text: BI.i18nText("BI-Created_By_Me"),
            value: BI.FileManagerNav.ROOT_CREATE_BY_ME,
            id: BI.FileManagerNav.ROOT_CREATE_BY_ME
        });
    },

    populate: function (node) {
        var parents = BI.isNull(node) ? [this.tree.getRoot()] : this._getAllParents(node.id);
        this.button_group.populate(this._formatNodes(parents));
    }
});
BI.extend(BI.FileManagerNav, {
    ROOT_CREATE_BY_ME: "-1"
});
BI.FileManagerNav.EVENT_CHANGE = "FileManagerNav.EVENT_CHANGE";
BI.shortcut("bi.file_manager_nav", BI.FileManagerNav);/**
 * Created by windy on 2017/3/13.
 * 数值微调器
 */
BI.FineTuningNumberEditor = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.FineTuningNumberEditor.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-fine-tuning-number-editor bi-border",
            value: -1
        })
    },

    _init: function () {
        BI.FineTuningNumberEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            value: this._alertInEditorValue(o.value),
            errorText: BI.i18nText("BI-Please_Input_Natural_Number"),
            validationChecker: function(v){
                return BI.isNaturalNumber(v) || self._alertOutEditorValue(v) === -1;
            }
        });
        this.editor.on(BI.TextEditor.EVENT_CONFIRM, function(){
            self._finetuning(0);
            self.fireEvent(BI.FineTuningNumberEditor.EVENT_CONFIRM);
        });
        this.topBtn = BI.createWidget({
            type: "bi.icon_button",
            trigger: "lclick,",
            cls: "column-pre-page-h-font top-button bi-border-left bi-border-bottom"
        });
        this.topBtn.on(BI.IconButton.EVENT_CHANGE, function(){
            self._finetuning(1);
            self.fireEvent(BI.FineTuningNumberEditor.EVENT_CONFIRM);
        });
        this.bottomBtn = BI.createWidget({
            type: "bi.icon_button",
            trigger: "lclick,",
            cls: "column-next-page-h-font bottom-button bi-border-left bi-border-top"
        });
        this.bottomBtn.on(BI.IconButton.EVENT_CHANGE, function(){
            self._finetuning(-1);
            self.fireEvent(BI.FineTuningNumberEditor.EVENT_CONFIRM);
        });
        this._finetuning(0);
        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [this.editor, {
                el: {
                    type: "bi.grid",
                    columns: 1,
                    rows: 2,
                    items: [{
                        column: 0,
                        row: 0,
                        el: this.topBtn
                    }, {
                        column: 0,
                        row: 1,
                        el: this.bottomBtn
                    }]
                },
                width: 30
            }]
        });
    },

    _alertOutEditorValue: function(v){
        return v === BI.i18nText("BI-Basic_Auto") ? -1 : v;
    },

    _alertInEditorValue: function(v){
        return BI.parseInt(v) === -1 ? BI.i18nText("BI-Basic_Auto") : v;
    },

    //微调
    _finetuning: function(add){
        var v = BI.parseInt(this._alertOutEditorValue(this.editor.getValue()));
        this.editor.setValue(this._alertInEditorValue(v + add));
        this.bottomBtn.setEnable((v + add) > -1);
    },

    getValue: function () {
        var v = this.editor.getValue();
        return this._alertOutEditorValue(v);
    },

    setValue: function (v) {
        this.editor.setValue(this._alertInEditorValue(v));
        this._finetuning(0);
    }

});
BI.FineTuningNumberEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.shortcut("bi.fine_tuning_number_editor", BI.FineTuningNumberEditor);/**
 * 交互行为布局
 *
 *
 * Created by GUY on 2016/7/23.
 * @class BI.InteractiveArrangement
 * @extends BI.Widget
 */
BI.InteractiveArrangement = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.InteractiveArrangement.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-interactive-arrangement",
            resizable: true,
            isNeedReLayout: true,
            isNeedResizeContainer: true,
            layoutType: BI.Arrangement.LAYOUT_TYPE.FREE,
            items: []
        });
    },

    _init: function () {
        BI.InteractiveArrangement.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.arrangement = BI.createWidget({
            type: "bi.adaptive_arrangement",
            element: this,
            resizable: o.resizable,
            isNeedReLayout: o.isNeedReLayout,
            isNeedResizeContainer: o.isNeedResizeContainer,
            layoutType: o.layoutType,
            items: o.items
        });
        this.arrangement.on(BI.AdaptiveArrangement.EVENT_SCROLL, function () {
            self.fireEvent(BI.InteractiveArrangement.EVENT_SCROLL, arguments);
        });
        this.arrangement.on(BI.AdaptiveArrangement.EVENT_RESIZE, function () {
            self.fireEvent(BI.InteractiveArrangement.EVENT_RESIZE, arguments);
        });

        this.arrangement.on(BI.AdaptiveArrangement.EVENT_ELEMENT_RESIZE, function (id, size) {
            var p = self._getRegionClientPosition(id);
            self.draw({
                left: p.left,
                top: p.top
            }, size, id);
        });
        this.arrangement.on(BI.AdaptiveArrangement.EVENT_ELEMENT_STOP_RESIZE, function (id, size) {
            self.stopDraw();
            self.setRegionSize(id, size);
        });

        this.tags = [];

    },

    _isEqual: function (num1, num2) {
        return this.arrangement._isEqual(num1, num2);
    },

    _getScrollOffset: function () {
        return this.arrangement._getScrollOffset();
    },

    _positionAt: function (position, regions) {
        var self = this;
        regions = regions || this.getAllRegions();
        var left = [], center = [], right = [], top = [], middle = [], bottom = [];
        BI.each(regions, function (i, region) {
            var client = self._getRegionClientPosition(region.id);
            if (Math.abs(client.left - position.left) <= 3) {
                left.push(region);
            }
            if (Math.abs(client.left + client.width / 2 - position.left) <= 3) {
                center.push(region);
            }
            if (Math.abs(client.left + client.width - position.left) <= 3) {
                right.push(region);
            }
            if (Math.abs(client.top - position.top) <= 3) {
                top.push(region);
            }
            if (Math.abs(client.top + client.height / 2 - position.top) <= 3) {
                middle.push(region);
            }
            if (Math.abs(client.top + client.height - position.top) <= 3) {
                bottom.push(region);
            }
        });
        return {
            left: left,
            center: center,
            right: right,
            top: top,
            middle: middle,
            bottom: bottom
        }
    },

    _getRegionClientPosition: function (name) {
        var region = this.getRegionByName(name);
        var offset = this.arrangement._getScrollOffset();
        return {
            top: region.top - offset.top,
            left: region.left - offset.left,
            width: region.width,
            height: region.height,
            id: region.id
        }
    },

    _vAlign: function (position, regions) {
        var self = this;
        var vs = this._positionAt(position, regions);
        var positions = [];
        var l;
        if (vs.left.length > 0) {
            l = this._getRegionClientPosition(vs.left[0].id).left;
        } else if (vs.right.length > 0) {
            var temp = this._getRegionClientPosition(vs.right[0].id);
            l = temp.left + temp.width;
        }
        var rs = vs.left.concat(vs.right);
        BI.each(rs, function (i, region) {
            var p = self._getRegionClientPosition(region.id);
            if (self._isEqual(p.left, l) || self._isEqual(p.left + p.width, l)) {
                var topPoint = {
                    top: p.top + p.height / 2,
                    left: l
                };
                positions.push({
                    id: region.id,
                    start: topPoint,
                    end: {
                        left: l,
                        top: position.top
                    }
                });
            }
        });
        return positions;
    },

    _leftAlign: function (position, size, regions) {
        var self = this;
        return this._vAlign({
            left: position.left,
            top: position.top + size.height / 2
        }, regions);
    },

    _rightAlign: function (position, size, regions) {
        var self = this;
        return this._vAlign({
            left: position.left + size.width,
            top: position.top + size.height / 2
        }, regions);
    },

    _hAlign: function (position, regions) {
        var self = this;
        var hs = this._positionAt(position, regions);
        var positions = [];
        var t;
        if (hs.top.length > 0) {
            var temp = this._getRegionClientPosition(hs.top[0].id);
            t = temp.top;
        } else if (hs.bottom.length > 0) {
            var temp = this._getRegionClientPosition(hs.bottom[0].id);
            t = temp.top + temp.height;
        }
        var rs = hs.top.concat(hs.bottom);
        BI.each(rs, function (i, region) {
            var p = self._getRegionClientPosition(region.id);
            if (self._isEqual(p.top, t) || self._isEqual(p.top + p.height, t)) {
                var leftPoint = {
                    top: t,
                    left: p.left + p.width / 2
                };
                positions.push({
                    id: p.id,
                    start: leftPoint,
                    end: {
                        left: position.left,
                        top: t
                    }
                });
            }
        });
        return positions;
    },

    _topAlign: function (position, size, regions) {
        var self = this;
        return this._hAlign({
            left: position.left + size.width / 2,
            top: position.top
        }, regions);
    },

    _bottomAlign: function (position, size, regions) {
        var self = this;
        return this._hAlign({
            left: position.left + size.width / 2,
            top: position.top + size.height
        }, regions);
    },

    _centerAlign: function (position, size, regions) {
        var self = this;
        var cs = this._positionAt({
            left: position.left + size.width / 2,
            top: position.top + size.height / 2
        }, regions);
        var positions = [];
        var l;
        if (cs.center.length > 0) {
            var temp = this._getRegionClientPosition(cs.center[0].id);
            l = temp.left + temp.width / 2;
        }
        BI.each(cs.center, function (i, region) {
            var p = self._getRegionClientPosition(region.id);
            if (self._isEqual(p.left + p.width / 2, l)) {
                var topPoint = {
                    top: p.top + p.height / 2,
                    left: p.left + p.width / 2
                };
                positions.push({
                    id: p.id,
                    start: topPoint,
                    end: {
                        left: l,
                        top: position.top + size.height / 2
                    }
                });
            }
        });
        return positions;
    },

    _middleAlign: function (position, size, regions) {
        var self = this;
        var cs = this._positionAt({
            left: position.left + size.width / 2,
            top: position.top + size.height / 2
        }, regions);
        var positions = [];
        var t;
        if (cs.middle.length > 0) {
            var temp = this._getRegionClientPosition(cs.middle[0].id);
            t = temp.top + temp.height / 2;
        }
        BI.each(cs.middle, function (i, region) {
            var p = self._getRegionClientPosition(region.id);
            if (self._isEqual(p.top + p.height / 2, t)) {
                var topPoint = {
                    top: p.top + p.height / 2,
                    left: p.left + p.width / 2
                };
                positions.push({
                    id: p.id,
                    start: topPoint,
                    end: {
                        left: position.left + size.width / 2,
                        top: t
                    }
                });
            }
        });
        return positions;
    },


    _drawOneTag: function (start, end) {
        var s = BI.createWidget({
            type: "bi.icon_button",
            //invisible: true,
            width: 13,
            height: 13,
            cls: "drag-tag-font interactive-arrangement-dragtag-icon"
        });
        var e = BI.createWidget({
            type: "bi.icon_button",
            //invisible: true,
            width: 13,
            height: 13,
            cls: "drag-tag-font interactive-arrangement-dragtag-icon"
        });
        if (this._isEqual(start.left, end.left)) {
            var line = BI.createWidget({
                type: "bi.layout",
                //invisible: true,
                cls: "interactive-arrangement-dragtag-line",
                width: 1,
                height: Math.abs(start.top - end.top)
            });
        } else {
            var line = BI.createWidget({
                type: "bi.layout",
                //invisible: true,
                cls: "interactive-arrangement-dragtag-line",
                height: 1,
                width: Math.abs(start.left - end.left)
            });
        }
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: s,
                left: start.left - 6,
                top: start.top - 7
            }, {
                el: e,
                left: end.left - 6,
                top: end.top - 7
            }, {
                el: line,
                left: Math.min(start.left, end.left),
                top: Math.min(start.top, end.top)
            }]
        });
        this.tags.push(s);
        this.tags.push(e);
        this.tags.push(line);
    },

    stopDraw: function () {
        BI.each(this.tags, function (i, w) {
            w.destroy();
        });
        this.tags = [];
    },

    _getRegionExcept: function (name, regions) {
        var other = [];
        BI.each(regions || this.getAllRegions(), function (i, region) {
            if (!(name && region.id === name)) {
                other.push(region);
            }
        });
        return other;
    },

    getClientWidth: function () {
        return this.arrangement.getClientWidth();
    },

    getClientHeight: function () {
        return this.arrangement.getClientHeight();
    },

    getPosition: function (name, position, size) {
        var regions = this.getAllRegions();
        var me;
        if (name) {
            me = this._getRegionClientPosition(name);
        }
        var other = this._getRegionExcept(name, regions);
        position = position || {
                left: me.left,
                top: me.top
            };
        size = size || {
                width: me.width,
                height: me.height
            };
        var left = this._leftAlign(position, size, other);
        var right = this._rightAlign(position, size, other);
        var top = this._topAlign(position, size, other, other);
        var bottom = this._bottomAlign(position, size, other);
        var center = this._centerAlign(position, size, other);
        var middle = this._middleAlign(position, size, other);

        BI.each(center, function (i, pos) {
            position.left = pos.end.left - size.width / 2;
        });
        BI.each(right, function (i, pos) {
            position.left = pos.end.left - size.width;
        });
        BI.each(left, function (i, pos) {
            position.left = pos.end.left;
        });
        BI.each(middle, function (i, pos) {
            position.top = pos.end.top - size.height / 2;
        });
        BI.each(bottom, function (i, pos) {
            position.top = pos.end.top - size.height;
        });
        BI.each(top, function (i, pos) {
            position.top = pos.end.top;
        });
        return position;
    },

    //position不动 变size
    getSize: function (name, position, size) {
        var regions = this.getAllRegions();
        var me;
        if (name) {
            me = this._getRegionClientPosition(name);
        }
        var other = this._getRegionExcept(name, regions);
        position = position || {
                left: me.left,
                top: me.top
            };
        size = size || {
                width: me.width,
                height: me.height
            };
        var left = this._leftAlign(position, size, other);
        var right = this._rightAlign(position, size, other);
        var top = this._topAlign(position, size, other, other);
        var bottom = this._bottomAlign(position, size, other);
        var center = this._centerAlign(position, size, other);
        var middle = this._middleAlign(position, size, other);

        BI.each(center, function (i, pos) {
            size.width = (pos.end.left - position.left) * 2;
        });
        BI.each(right, function (i, pos) {
            size.width = pos.end.left - position.left;
        });
        BI.each(left, function (i, pos) {
        });
        BI.each(middle, function (i, pos) {
            size.height = (pos.end.top - position.top) * 2;
        });
        BI.each(bottom, function (i, pos) {
            size.height = pos.end.top - position.top;
        });
        BI.each(top, function (i, pos) {
        });
        return size;
    },

    draw: function (position, size, name) {
        var self = this;
        this.stopDraw();
        switch (this.getLayoutType()) {
            case BI.Arrangement.LAYOUT_TYPE.ADAPTIVE:
            case BI.Arrangement.LAYOUT_TYPE.FREE:
                var other = this._getRegionExcept(name);
                var left = this._leftAlign(position, size, other);
                var right = this._rightAlign(position, size, other);
                var top = this._topAlign(position, size, other);
                var bottom = this._bottomAlign(position, size, other);
                var center = this._centerAlign(position, size, other);
                var middle = this._middleAlign(position, size, other);

                BI.each(center, function (i, pos) {
                    self._drawOneTag(pos.start, pos.end);
                });
                BI.each(right, function (i, pos) {
                    self._drawOneTag(pos.start, pos.end);
                });
                BI.each(left, function (i, pos) {
                    self._drawOneTag(pos.start, pos.end);
                });
                BI.each(middle, function (i, pos) {
                    self._drawOneTag(pos.start, pos.end);
                });
                BI.each(bottom, function (i, pos) {
                    self._drawOneTag(pos.start, pos.end);
                });
                BI.each(top, function (i, pos) {
                    self._drawOneTag(pos.start, pos.end);
                });
                break;
            case BI.Arrangement.LAYOUT_TYPE.GRID:
                break;
        }
    },

    getDirectRelativeRegions: function (name, direction) {
        return this.arrangement.getDirectRelativeRegions(name, direction);
    },

    addRegion: function (region, position) {
        this.stopDraw();
        return this.arrangement.addRegion(region, position);
    },

    deleteRegion: function (name) {
        return this.arrangement.deleteRegion(name);
    },

    setRegionSize: function (name, size) {
        size = this.getSize(name, null, size);
        return this.arrangement.setRegionSize(name, size);
    },

    setPosition: function (position, size) {
        var self = this;
        this.stopDraw();
        if (position.left > 0 && position.top > 0) {
            switch (this.getLayoutType()) {
                case BI.Arrangement.LAYOUT_TYPE.ADAPTIVE:
                    break;
                case BI.Arrangement.LAYOUT_TYPE.FREE:
                    position = this.getPosition(null, position, size);
                    this.draw(position, size);
                    break;
                case BI.Arrangement.LAYOUT_TYPE.GRID:
                    break;
            }
        }
        var at = this.arrangement.setPosition(position, size);
        return at;
    },

    setRegionPosition: function (name, position) {
        if (position.left > 0 && position.top > 0) {
            switch (this.getLayoutType()) {
                case BI.Arrangement.LAYOUT_TYPE.ADAPTIVE:
                    break;
                case BI.Arrangement.LAYOUT_TYPE.FREE:
                    position = this.getPosition(name, position);
                    break;
                case BI.Arrangement.LAYOUT_TYPE.GRID:
                    break;
            }
        }
        return this.arrangement.setRegionPosition(name, position);
    },

    zoom: function (ratio) {
        this.arrangement.zoom(ratio);
    },

    resize: function () {
        return this.arrangement.resize();
    },

    relayout: function () {
        return this.arrangement.relayout();
    },

    setLayoutType: function (type) {
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
        return this.arrangement.revoke();
    },

    populate: function (items) {
        var self = this;
        this.arrangement.populate(items);
    }
});
BI.InteractiveArrangement.EVENT_RESIZE = "InteractiveArrangement.EVENT_RESIZE";
BI.InteractiveArrangement.EVENT_SCROLL = "InteractiveArrangement.EVENT_SCROLL";
BI.shortcut('bi.interactive_arrangement', BI.InteractiveArrangement);/**
 * 月份下拉框
 *
 * Created by GUY on 2015/8/28.
 * @class BI.MonthCombo
 * @extends BI.Trigger
 */
BI.MonthCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.MonthCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-month-combo",
            height: 25
        });
    },
    _init: function () {
        BI.MonthCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.trigger = BI.createWidget({
            type: "bi.month_trigger"
        });

        this.trigger.on(BI.MonthTrigger.EVENT_CONFIRM, function (v) {
            if(this.getKey() && this.getKey() !== self.storeValue) {
                self.setValue(this.getValue());
            }else if(!this.getKey()){
                self.setValue();
            }
            self.fireEvent(BI.MonthCombo.EVENT_CONFIRM);
        });
        this.trigger.on(BI.MonthTrigger.EVENT_FOCUS, function () {
            self.storeValue = this.getKey();
        });
        this.trigger.on(BI.MonthTrigger.EVENT_START, function () {
            self.combo.hideView();
        });
        this.trigger.on(BI.MonthTrigger.EVENT_STOP, function () {
            if (!self.combo.isViewVisible()) {
                self.combo.showView();
            }
        });
        this.trigger.on(BI.MonthTrigger.EVENT_CHANGE, function () {
            self.combo.isViewVisible() && self.combo.hideView();
        });

        this.popup = BI.createWidget({
            type: "bi.month_popup"
        });
        this.popup.on(BI.MonthPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.combo.hideView();
            self.fireEvent(BI.MonthCombo.EVENT_CONFIRM);
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            isNeedAdjustHeight: false,
            isNeedAdjustWidth: false,
            el: this.trigger,
            popup: {
                minWidth: 85,
                el: this.popup
            }
        })
    },

    setValue: function (v) {
        this.trigger.setValue(v);
        this.popup.setValue(v);
    },

    getValue: function () {
        return this.popup.getValue();
    }
});

BI.MonthCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.shortcut('bi.month_combo', BI.MonthCombo);/**
 * 月份展示面板
 *
 * Created by GUY on 2015/9/2.
 * @class BI.MonthPopup
 * @extends BI.Trigger
 */
BI.MonthPopup = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MonthPopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-month-popup"
        });
    },

    _init: function () {
        BI.MonthPopup.superclass._init.apply(this, arguments);
        var self = this;

        //纵向排列月
        var month = [0, 6, 1, 7, 2, 8, 3, 9, 4, 10, 5, 11];
        var items = [];
        items.push(month.slice(0, 2));
        items.push(month.slice(2, 4));
        items.push(month.slice(4, 6));
        items.push(month.slice(6, 8));
        items.push(month.slice(8, 10));
        items.push(month.slice(10, 12));
        items = BI.map(items, function (i, item) {
            return BI.map(item, function (j, td) {
                return {
                    type: "bi.text_item",
                    cls: "bi-list-item-active",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    once: false,
                    forceSelected: true,
                    height: 23,
                    width: 38,
                    value: td,
                    text: td + 1
                };
            });
        });

        this.month = BI.createWidget({
            type: "bi.button_group",
            element: this,
            items: BI.createItems(items, {}),
            layouts: [BI.LogicFactory.createLogic("table", BI.extend({
                dynamic: true
            }, {
                columns: 2,
                rows: 6,
                columnSize: [1 / 2, 1 / 2],
                rowSize: 25
            })), {
                type: "bi.center_adapt",
                vgap: 1,
                hgap: 2
            }]
        });

        this.month.on(BI.Controller.EVENT_CHANGE, function (type) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.MonthPopup.EVENT_CHANGE);
            }
        })
    },

    getValue: function () {
        return this.month.getValue()[0];
    },

    setValue: function (v) {
        this.month.setValue([v]);
    }
});
BI.MonthPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.month_popup", BI.MonthPopup);/**
 * 月份trigger
 *
 * Created by GUY on 2015/8/21.
 * @class BI.MonthTrigger
 * @extends BI.Trigger
 */
BI.MonthTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4,
        vgap: 2,
        triggerWidth: 25,
        errorText: BI.i18nText("BI-Month_Trigger_Error_Text")
    },

    _defaultConfig: function () {
        return BI.extend(BI.MonthTrigger.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-month-trigger bi-border",
            height: 25
        });
    },
    _init: function () {
        BI.MonthTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            height: o.height,
            validationChecker: function (v) {
                return v === "" || (BI.isPositiveInteger(v) && v >= 1 && v <= 12);
            },
            quitChecker: function (v) {
                return false;
            },
            hgap: c.hgap,
            vgap: c.vgap,
            allowBlank: true,
            errorText: c.errorText
        });
        this.editor.on(BI.SignEditor.EVENT_FOCUS, function () {
            self.fireEvent(BI.MonthTrigger.EVENT_FOCUS);
        });
        this.editor.on(BI.SignEditor.EVENT_CHANGE, function () {
            self.fireEvent(BI.MonthTrigger.EVENT_CHANGE);
        });
        this.editor.on(BI.SignEditor.EVENT_CONFIRM, function () {
            var value = self.editor.getValue();
            if (BI.isNotNull(value)) {
                self.editor.setValue(value);
                self.editor.setTitle(value);
            }
            self.fireEvent(BI.MonthTrigger.EVENT_CONFIRM);
        });
        this.editor.on(BI.SignEditor.EVENT_SPACE, function () {
            if (self.editor.isValid()) {
                self.editor.blur();
            }
        });
        this.editor.on(BI.SignEditor.EVENT_START, function () {
            self.fireEvent(BI.MonthTrigger.EVENT_START);
        });
        this.editor.on(BI.SignEditor.EVENT_STOP, function () {
            self.fireEvent(BI.MonthTrigger.EVENT_STOP);
        });
        BI.createWidget({
            element: this,
            type: 'bi.htape',
            items: [
                {
                    el: this.editor
                }, {
                    el: {
                        type: "bi.text_button",
                        text: BI.i18nText("BI-Multi_Date_Month"),
                        baseCls: "bi-trigger-month-text",
                        width: c.triggerWidth
                    },
                    width: c.triggerWidth
                }, {
                    el: {
                        type: "bi.trigger_icon_button",
                        width: c.triggerWidth
                    },
                    width: c.triggerWidth
                }
            ]
        });
    },
    setValue: function (v) {
        if(BI.isNotNull(v)){
            this.editor.setState(v + 1);
            this.editor.setValue(v + 1);
            this.editor.setTitle(v + 1);
            return;
        }
        this.editor.setState();
        this.editor.setValue();
        this.editor.setTitle();
    },
    getKey: function () {
        return this.editor.getValue() | 0;
    },
    getValue: function () {
        return this.editor.getValue() - 1;
    }
});
BI.MonthTrigger.EVENT_FOCUS = "EVENT_FOCUS";
BI.MonthTrigger.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.MonthTrigger.EVENT_START = "EVENT_START";
BI.MonthTrigger.EVENT_STOP = "EVENT_STOP";
BI.MonthTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.month_trigger", BI.MonthTrigger);/**
 * @class BI.MultiLayerSelectTreeCombo
 * @extends BI.Widget
 */
BI.MultiLayerSelectTreeCombo = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiLayerSelectTreeCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multilayer_select_tree-combo",
            isDefaultInit: false,
            height: 30,
            text: "",
            items: []
        });
    },

    _init: function () {
        BI.MultiLayerSelectTreeCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.trigger = BI.createWidget({
            type: "bi.single_tree_trigger",
            text: o.text,
            height: o.height,
            items: o.items
        });

        this.popup = BI.createWidget({
            type: "bi.multilayer_select_tree_popup",
            isDefaultInit: o.isDefaultInit,
            items: o.items
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: {
                el: this.popup
            }
        });

        this.combo.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.popup.on(BI.MultiLayerSelectTreePopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.combo.hideView();
            self.fireEvent(BI.MultiLayerSelectTreeCombo.EVENT_CHANGE);
        });
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        this.trigger.setValue(v);
        this.popup.setValue(v);
    },

    getValue: function () {
        return this.popup.getValue();
    },

    populate: function (items) {
        this.combo.populate(items);
    }
});
BI.MultiLayerSelectTreeCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.multilayer_select_tree_combo", BI.MultiLayerSelectTreeCombo);/**
 * guy
 * 二级树
 * @class BI.MultiLayerSelectLevelTree
 * @extends BI.Select
 */
BI.MultiLayerSelectLevelTree = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.MultiLayerSelectLevelTree.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multilayer-select-level-tree",
            isDefaultInit: false,
            items: [],
            itemsCreator: BI.emptyFn
        })
    },

    _init: function () {
        BI.MultiLayerSelectLevelTree.superclass._init.apply(this, arguments);

        this.initTree(this.options.items);
    },

    _formatItems: function (nodes, layer) {
        var self = this;
        BI.each(nodes, function (i, node) {
            var extend = {};
            node.layer = layer;
            if (!BI.isKey(node.id)) {
                node.id = BI.UUID();
            }
            if (node.isParent === true || BI.isNotEmptyArray(node.children)) {
                switch (i) {
                    case 0 :
                        extend.type = "bi.multilayer_select_tree_first_plus_group_node";
                        break;
                    case nodes.length - 1 :
                        extend.type = "bi.multilayer_select_tree_last_plus_group_node";
                        break;
                    default :
                        extend.type = "bi.multilayer_select_tree_mid_plus_group_node";
                        break;
                }
                BI.defaults(node, extend);

                self._formatItems(node.children, layer + 1);
            } else {
                switch (i) {
                    case nodes.length - 1:
                        extend.type = "bi.multilayer_single_tree_last_tree_leaf_item";
                        break;
                    default :
                        extend.type = "bi.multilayer_single_tree_mid_tree_leaf_item";
                }
                BI.defaults(node, extend);
            }
        });
        return nodes;
    },

    _assertId: function (sNodes) {
        BI.each(sNodes, function (i, node) {
            node.id = node.id || BI.UUID();
        });
    },

    //构造树结构，
    initTree: function (nodes) {
        var self = this, o = this.options;
        this.empty();
        this._assertId(nodes);
        this.tree = BI.createWidget({
            type: "bi.custom_tree",
            element: this,
            expander: {
                type: "bi.select_tree_expander",
                isDefaultInit: o.isDefaultInit,
                el: {},
                popup: {
                    type: "bi.custom_tree"
                }
            },

            items: this._formatItems(BI.Tree.transformToTreeFormat(nodes), 0),
            itemsCreator: o.itemsCreator,

            el: {
                type: "bi.button_tree",
                chooseType: BI.Selection.Single,
                layouts: [{
                    type: "bi.vertical"
                }]
            }
        });
        this.tree.on(BI.Controller.EVENT_CHANGE, function (type) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.MultiLayerSelectLevelTree.EVENT_CHANGE, arguments);
            }
        })
    },

    populate: function (nodes) {
        this.tree.populate(this._formatItems(BI.Tree.transformToTreeFormat(nodes), 0));
    },

    doBehavior: function () {
        this.tree.doBehavior.apply(this.tree, arguments);
    },

    setValue: function (v) {
        this.tree.setValue(v);
    },

    getValue: function () {
        return this.tree.getValue();
    },

    getAllLeaves: function () {
        return this.tree.getAllLeaves();
    },

    getNodeById: function (id) {
        return this.tree.getNodeById(id);
    },

    getNodeByValue: function (id) {
        return this.tree.getNodeByValue(id);
    }
});
BI.MultiLayerSelectLevelTree.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.multilayer_select_level_tree", BI.MultiLayerSelectLevelTree);/**
 * Created by GUY on 2016/1/26.
 *
 * @class BI.MultiLayerSelectTreePopup
 * @extends BI.Pane
 */

BI.MultiLayerSelectTreePopup = BI.inherit(BI.Pane, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiLayerSelectTreePopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multilayer-select-tree-popup",
            tipText: BI.i18nText("BI-No_Selected_Item"),
            isDefaultInit: false,
            itemsCreator: BI.emptyFn,
            items: []
        });
    },

    _init: function () {
        BI.MultiLayerSelectTreePopup.superclass._init.apply(this, arguments);

        var self = this, o = this.options;

        this.tree = BI.createWidget({
            type: 'bi.multilayer_select_level_tree',
            isDefaultInit: o.isDefaultInit,
            items: o.items,
            itemsCreator: o.itemsCreator
        });

        BI.createWidget({
            type: "bi.vertical",
            scrolly: false,
            scrollable: true,
            element: this,
            items: [this.tree]
        });

        this.tree.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.tree.on(BI.MultiLayerSelectLevelTree.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiLayerSelectTreePopup.EVENT_CHANGE);
        });

        this.check();
    },

    getValue: function () {
        return this.tree.getValue();
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        this.tree.setValue(v);
    },

    populate: function (items) {
        BI.MultiLayerSelectTreePopup.superclass.populate.apply(this, arguments);
        this.tree.populate(items);
    }
});

BI.MultiLayerSelectTreePopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.multilayer_select_tree_popup", BI.MultiLayerSelectTreePopup);/**
 * 加号表示的组节点
 *
 * Created by GUY on 2016/1/27.
 * @class BI.MultiLayerSelectTreeFirstPlusGroupNode
 * @extends BI.NodeButton
 */
BI.MultiLayerSelectTreeFirstPlusGroupNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.MultiLayerSelectTreeFirstPlusGroupNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            extraCls: "bi-multilayer-select-tree-first-plus-group-node bi-list-item-active",
            layer: 0,//第几层级
            id: "",
            pId: "",
            readonly: true,
            open: false,
            height: 25
        })
    },
    _init: function () {
        BI.MultiLayerSelectTreeFirstPlusGroupNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.node = BI.createWidget({
            type: "bi.select_tree_first_plus_group_node",
            stopPropagation: true,
            logic: {
                dynamic: true
            },
            id: o.id,
            pId: o.pId,
            open: o.open,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py
        });
        this.node.on(BI.Controller.EVENT_CHANGE, function (type) {
            self.setSelected(self.isSelected());
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        var items = [];
        BI.count(0, o.layer, function () {
            items.push({
                type: "bi.layout",
                cls: "base-line-conn-background",
                width: 13,
                height: o.height
            })
        });
        items.push(this.node);
        BI.createWidget({
            type: "bi.td",
            element: this,
            columnSize: BI.makeArray(o.layer, 13),
            items: [items]
        })
    },

    isOnce: function () {
        return true;
    },

    doRedMark: function () {
        this.node.doRedMark.apply(this.node, arguments);
    },

    unRedMark: function () {
        this.node.unRedMark.apply(this.node, arguments);
    },

    isSelected: function () {
        return this.node.isSelected();
    },

    setSelected: function (b) {
        BI.MultiLayerSelectTreeFirstPlusGroupNode.superclass.setSelected.apply(this, arguments);
        this.node.setSelected(b);
    },

    doClick: function () {
        BI.NodeButton.superclass.doClick.apply(this, arguments);
        this.node.setSelected(this.isSelected());
    },

    setOpened: function (v) {
        BI.MultiLayerSelectTreeFirstPlusGroupNode.superclass.setOpened.apply(this, arguments);
        this.node.setOpened(v);
    }
});

BI.shortcut("bi.multilayer_select_tree_first_plus_group_node", BI.MultiLayerSelectTreeFirstPlusGroupNode);/**
 * 加号表示的组节点
 *
 * Created by GUY on 2016/1/27.
 * @class BI.MultiLayerSelectTreeLastPlusGroupNode
 * @extends BI.NodeButton
 */
BI.MultiLayerSelectTreeLastPlusGroupNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.MultiLayerSelectTreeLastPlusGroupNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            extraCls: "bi-multilayer-select-tree-last-plus-group-node bi-list-item-active",
            layer: 0,//第几层级
            id: "",
            pId: "",
            readonly: true,
            open: false,
            height: 25
        })
    },
    _init: function () {
        BI.MultiLayerSelectTreeLastPlusGroupNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.node = BI.createWidget({
            type: "bi.select_tree_last_plus_group_node",
            stopPropagation: true,
            logic: {
                dynamic: true
            },
            id: o.id,
            pId: o.pId,
            open: o.open,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py
        });
        this.node.on(BI.Controller.EVENT_CHANGE, function (type) {
            self.setSelected(self.isSelected());
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        var items = [];
        BI.count(0, o.layer, function () {
            items.push({
                type: "bi.layout",
                cls: "base-line-conn-background",
                width: 13,
                height: o.height
            })
        });
        items.push(this.node);
        BI.createWidget({
            type: "bi.td",
            element: this,
            columnSize: BI.makeArray(o.layer, 13),
            items: [items]
        })
    },

    doRedMark: function () {
        this.node.doRedMark.apply(this.node, arguments);
    },

    unRedMark: function () {
        this.node.unRedMark.apply(this.node, arguments);
    },

    isSelected: function () {
        return this.node.isSelected();
    },

    setSelected: function (b) {
        BI.MultiLayerSelectTreeLastPlusGroupNode.superclass.setSelected.apply(this, arguments);
        this.node.setSelected(b);
    },

    doClick: function () {
        BI.MultiLayerSelectTreeLastPlusGroupNode.superclass.doClick.apply(this, arguments);
        this.node.setSelected(this.isSelected());
    },

    setOpened: function (v) {
        BI.MultiLayerSelectTreeLastPlusGroupNode.superclass.setOpened.apply(this, arguments);
        this.node.setOpened(v);
    }
});

BI.shortcut("bi.multilayer_select_tree_last_plus_group_node", BI.MultiLayerSelectTreeLastPlusGroupNode);/**
 * 加号表示的组节点
 *
 * Created by GUY on 2016/1/27.
 * @class BI.MultiLayerSelectTreeMidPlusGroupNode
 * @extends BI.NodeButton
 */
BI.MultiLayerSelectTreeMidPlusGroupNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.MultiLayerSelectTreeMidPlusGroupNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            extraCls: "bi-multilayer-select-tree-mid-plus-group-node bi-list-item-active",
            layer: 0,//第几层级
            id: "",
            pId: "",
            readonly: true,
            open: false,
            height: 25
        })
    },
    _init: function () {
        BI.MultiLayerSelectTreeMidPlusGroupNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.node = BI.createWidget({
            type: "bi.select_tree_mid_plus_group_node",
            stopPropagation: true,
            logic: {
                dynamic: true
            },
            id: o.id,
            pId: o.pId,
            open: o.open,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py
        });
        this.node.on(BI.Controller.EVENT_CHANGE, function (type) {
            self.setSelected(self.isSelected());
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        var items = [];
        BI.count(0, o.layer, function () {
            items.push({
                type: "bi.layout",
                cls: "base-line-conn-background",
                width: 13,
                height: o.height
            })
        });
        items.push(this.node);
        BI.createWidget({
            type: "bi.td",
            element: this,
            columnSize: BI.makeArray(o.layer, 13),
            items: [items]
        })
    },

    doRedMark: function () {
        this.node.doRedMark.apply(this.node, arguments);
    },

    unRedMark: function () {
        this.node.unRedMark.apply(this.node, arguments);
    },

    isSelected: function () {
        return this.node.isSelected();
    },

    setSelected: function (b) {
        BI.MultiLayerSelectTreeMidPlusGroupNode.superclass.setSelected.apply(this, arguments);
        this.node.setSelected(b);
    },

    doClick: function () {
        BI.MultiLayerSelectTreeMidPlusGroupNode.superclass.doClick.apply(this, arguments);
        this.node.setSelected(this.isSelected());
    },

    setOpened: function (v) {
        BI.MultiLayerSelectTreeMidPlusGroupNode.superclass.setOpened.apply(this, arguments);
        this.node.setOpened(v);
    }
});

BI.shortcut("bi.multilayer_select_tree_mid_plus_group_node", BI.MultiLayerSelectTreeMidPlusGroupNode);/**
 * 多层级下拉单选树
 * Created by GUY on 2016/1/26.
 *
 * @class BI.MultiLayerSingleTreeCombo
 * @extends BI.Widget
 */
BI.MultiLayerSingleTreeCombo = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiLayerSingleTreeCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multilayer-singletree-combo",
            isDefaultInit: false,
            height: 30,
            text: "",
            itemsCreator: BI.emptyFn,
            items: []
        });
    },

    _init: function () {
        BI.MultiLayerSingleTreeCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.trigger = BI.createWidget({
            type: "bi.single_tree_trigger",
            text: o.text,
            height: o.height,
            items: o.items
        });

        this.popup = BI.createWidget({
            type: "bi.multilayer_single_tree_popup",
            isDefaultInit: o.isDefaultInit,
            items: o.items
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: {
                el: this.popup
            }
        });

        this.combo.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.popup.on(BI.MultiLayerSingleTreePopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.combo.hideView();
            self.fireEvent(BI.MultiLayerSingleTreeCombo.EVENT_CHANGE);
        });
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        this.trigger.setValue(v);
        this.popup.setValue(v);
    },

    getValue: function () {
        return this.popup.getValue();
    },

    populate: function (items) {
        this.combo.populate(items);
    }
});

BI.MultiLayerSingleTreeCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.multilayer_single_tree_combo", BI.MultiLayerSingleTreeCombo);/**
 * guy
 * 二级树
 * @class BI.MultiLayerSingleLevelTree
 * @extends BI.Single
 */
BI.MultiLayerSingleLevelTree = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.MultiLayerSingleLevelTree.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multilayer-single-level-tree",
            isDefaultInit: false,
            items: [],
            itemsCreator: BI.emptyFn
        })
    },

    _init: function () {
        BI.MultiLayerSingleLevelTree.superclass._init.apply(this, arguments);

        this.initTree(this.options.items);
    },

    _formatItems: function (nodes, layer) {
        var self = this;
        BI.each(nodes, function (i, node) {
            var extend = {};
            node.layer = layer;
            if (!BI.isKey(node.id)) {
                node.id = BI.UUID();
            }
            if (node.isParent === true || BI.isNotEmptyArray(node.children)) {
                switch (i) {
                    case 0 :
                        extend.type = "bi.multilayer_single_tree_first_plus_group_node";
                        break;
                    case nodes.length - 1 :
                        extend.type = "bi.multilayer_single_tree_last_plus_group_node";
                        break;
                    default :
                        extend.type = "bi.multilayer_single_tree_mid_plus_group_node";
                        break;
                }
                BI.defaults(node, extend);

                self._formatItems(node.children, layer + 1);
            } else {
                switch (i) {
                    case nodes.length - 1:
                        extend.type = "bi.multilayer_single_tree_last_tree_leaf_item";
                        break;
                    default :
                        extend.type = "bi.multilayer_single_tree_mid_tree_leaf_item";
                }
                BI.defaults(node, extend);
            }
        });
        return nodes;
    },

    _assertId: function (sNodes) {
        BI.each(sNodes, function (i, node) {
            node.id = node.id || BI.UUID();
        });
    },

    //构造树结构，
    initTree: function (nodes) {
        var self = this, o = this.options;
        this.empty();
        this._assertId(nodes);
        this.tree = BI.createWidget({
            type: "bi.custom_tree",
            element: this,
            expander: {
                isDefaultInit: o.isDefaultInit,
                el: {},
                popup: {
                    type: "bi.custom_tree"
                }
            },

            items: this._formatItems(BI.Tree.transformToTreeFormat(nodes), 0),
            itemsCreator: function (op, callback) {
                o.itemsCreator(op, function (items) {
                    callback(BI.Tree.transformToTreeFormat(items), 0)
                })
            },

            el: {
                type: "bi.button_tree",
                chooseType: BI.Selection.Single,
                layouts: [{
                    type: "bi.vertical"
                }]
            }
        });
        this.tree.on(BI.Controller.EVENT_CHANGE, function (type, v) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.MultiLayerSingleLevelTree.EVENT_CHANGE, v);
            }
        })
    },

    populate: function (nodes) {
        this.tree.populate(this._formatItems(BI.Tree.transformToTreeFormat(nodes), 0));
    },

    doBehavior: function () {
        this.tree.doBehavior.apply(this.tree, arguments);
    },

    setValue: function (v) {
        this.tree.setValue(v);
    },

    getValue: function () {
        return this.tree.getValue();
    },

    getAllLeaves: function () {
        return this.tree.getAllLeaves();
    },

    getNodeById: function (id) {
        return this.tree.getNodeById(id);
    },

    getNodeByValue: function (id) {
        return this.tree.getNodeByValue(id);
    }
});
BI.MultiLayerSingleLevelTree.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.multilayer_single_level_tree", BI.MultiLayerSingleLevelTree);
/**
 * Created by GUY on 2016/1/26.
 *
 * @class BI.MultiLayerSingleTreePopup
 * @extends BI.Pane
 */

BI.MultiLayerSingleTreePopup = BI.inherit(BI.Pane, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiLayerSingleTreePopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multilayer-singletree-popup",
            tipText: BI.i18nText("BI-No_Selected_Item"),
            isDefaultInit: false,
            itemsCreator: BI.emptyFn,
            items: []
        });
    },

    _init: function () {
        BI.MultiLayerSingleTreePopup.superclass._init.apply(this, arguments);

        var self = this, o = this.options;

        this.tree = BI.createWidget({
            type: 'bi.multilayer_single_level_tree',
            isDefaultInit: o.isDefaultInit,
            items: o.items,
            itemsCreator: o.itemsCreator
        });

        BI.createWidget({
            type: "bi.vertical",
            scrolly: false,
            scrollable: true,
            element: this,
            items: [this.tree]
        });

        this.tree.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.tree.on(BI.MultiLayerSingleLevelTree.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiLayerSingleTreePopup.EVENT_CHANGE);
        });

        this.check();
    },

    getValue: function () {
        return this.tree.getValue();
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        this.tree.setValue(v);
    },

    populate: function (items) {
        BI.MultiLayerSingleTreePopup.superclass.populate.apply(this, arguments);
        this.tree.populate(items);
    }
});

BI.MultiLayerSingleTreePopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.multilayer_single_tree_popup", BI.MultiLayerSingleTreePopup);/**
 * 加号表示的组节点
 *
 * Created by GUY on 2016/1/27.
 * @class BI.MultiLayerSingleTreeFirstPlusGroupNode
 * @extends BI.NodeButton
 */
BI.MultiLayerSingleTreeFirstPlusGroupNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.MultiLayerSingleTreeFirstPlusGroupNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            extraCls: "bi-multilayer-single-tree-first-plus-group-node bi-list-item",
            layer: 0,//第几层级
            id: "",
            pId: "",
            open: false,
            height: 25
        })
    },
    _init: function () {
        BI.MultiLayerSingleTreeFirstPlusGroupNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.node = BI.createWidget({
            type: "bi.first_plus_group_node",
            logic: {
                dynamic: true
            },
            id: o.id,
            pId: o.pId,
            open: o.open,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py
        });
        this.node.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {//本身实现click功能
                return;
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        var items = [];
        BI.count(0, o.layer, function () {
            items.push({
                type: "bi.layout",
                cls: "base-line-conn-background",
                width: 13,
                height: o.height
            })
        });
        items.push(this.node);
        BI.createWidget({
            type: "bi.td",
            element: this,
            columnSize: BI.makeArray(o.layer, 13),
            items: [items]
        })
    },

    doRedMark: function () {
        this.node.doRedMark.apply(this.node, arguments);
    },

    unRedMark: function () {
        this.node.unRedMark.apply(this.node, arguments);
    },

    doClick: function () {
        BI.MultiLayerSingleTreeFirstPlusGroupNode.superclass.doClick.apply(this, arguments);
        this.node.setSelected(this.isSelected());
    },

    setOpened: function (v) {
        BI.MultiLayerSingleTreeFirstPlusGroupNode.superclass.setOpened.apply(this, arguments);
        if (BI.isNotNull(this.node)) {
            this.node.setOpened(v);
        }
    }
});

BI.shortcut("bi.multilayer_single_tree_first_plus_group_node", BI.MultiLayerSingleTreeFirstPlusGroupNode);/**
 * 加号表示的组节点
 *
 * Created by GUY on 2016/1/27.
 * @class BI.MultiLayerSingleTreeLastPlusGroupNode
 * @extends BI.NodeButton
 */
BI.MultiLayerSingleTreeLastPlusGroupNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.MultiLayerSingleTreeLastPlusGroupNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            extraCls: "bi-multilayer-single-tree-last-plus-group-node bi-list-item",
            layer: 0,//第几层级
            id: "",
            pId: "",
            open: false,
            height: 25
        })
    },
    _init: function () {
        BI.MultiLayerSingleTreeLastPlusGroupNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.node = BI.createWidget({
            type: "bi.last_plus_group_node",
            logic: {
                dynamic: true
            },
            id: o.id,
            pId: o.pId,
            open: o.open,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py
        });
        this.node.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {//本身实现click功能
                return;
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        var items = [];
        BI.count(0, o.layer, function () {
            items.push({
                type: "bi.layout",
                cls: "base-line-conn-background",
                width: 13,
                height: o.height
            })
        });
        items.push(this.node);
        BI.createWidget({
            type: "bi.td",
            element: this,
            columnSize: BI.makeArray(o.layer, 13),
            items: [items]
        })
    },

    doRedMark: function () {
        this.node.doRedMark.apply(this.node, arguments);
    },

    unRedMark: function () {
        this.node.unRedMark.apply(this.node, arguments);
    },

    doClick: function () {
        BI.MultiLayerSingleTreeLastPlusGroupNode.superclass.doClick.apply(this, arguments);
        this.node.setSelected(this.isSelected());
    },

    setOpened: function (v) {
        BI.MultiLayerSingleTreeLastPlusGroupNode.superclass.setOpened.apply(this, arguments);
        if (BI.isNotNull(this.node)) {
            this.node.setOpened(v);
        }
    }
});

BI.shortcut("bi.multilayer_single_tree_last_plus_group_node", BI.MultiLayerSingleTreeLastPlusGroupNode);/**
 * 加号表示的组节点
 *
 * Created by GUY on 2016/1/27.
 * @class BI.MultiLayerSingleTreeMidPlusGroupNode
 * @extends BI.NodeButton
 */
BI.MultiLayerSingleTreeMidPlusGroupNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.MultiLayerSingleTreeMidPlusGroupNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            extraCls: "bi-multilayer-single-tree-mid-plus-group-node bi-list-item",
            layer: 0,//第几层级
            id: "",
            pId: "",
            open: false,
            height: 25
        })
    },
    _init: function () {
        BI.MultiLayerSingleTreeMidPlusGroupNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.node = BI.createWidget({
            type: "bi.mid_plus_group_node",
            logic: {
                dynamic: true
            },
            id: o.id,
            pId: o.pId,
            open: o.open,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py
        });
        this.node.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {//本身实现click功能
                return;
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        var items = [];
        BI.count(0, o.layer, function () {
            items.push({
                type: "bi.layout",
                cls: "base-line-conn-background",
                width: 13,
                height: o.height
            })
        });
        items.push(this.node);
        BI.createWidget({
            type: "bi.td",
            element: this,
            columnSize: BI.makeArray(o.layer, 13),
            items: [items]
        })
    },

    doRedMark: function () {
        this.node.doRedMark.apply(this.node, arguments);
    },

    unRedMark: function () {
        this.node.unRedMark.apply(this.node, arguments);
    },

    doClick: function () {
        BI.MultiLayerSingleTreeMidPlusGroupNode.superclass.doClick.apply(this, arguments);
        this.node.setSelected(this.isSelected());
    },

    setOpened: function (v) {
        BI.MultiLayerSingleTreeMidPlusGroupNode.superclass.setOpened.apply(this, arguments);
        if (BI.isNotNull(this.node)) {
            this.node.setOpened(v);
        }
    }
});

BI.shortcut("bi.multilayer_single_tree_mid_plus_group_node", BI.MultiLayerSingleTreeMidPlusGroupNode);/**
 *
 * Created by GUY on 2016/1/27.
 * @class BI.MultiLayerSingleTreeFirstTreeLeafItem
 * @extends BI.BasicButton
 */
BI.MultiLayerSingleTreeFirstTreeLeafItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.MultiLayerSingleTreeFirstTreeLeafItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-multilayer-single-tree-first-tree-leaf-item bi-list-item-active",
            logic: {
                dynamic: false
            },
            layer: 0,
            id: "",
            pId: "",
            height: 25
        })
    },
    _init: function () {
        BI.MultiLayerSingleTreeFirstTreeLeafItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.item = BI.createWidget({
            type: "bi.first_tree_leaf_item",
            logic: {
                dynamic: true
            },
            id: o.id,
            pId: o.pId,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py
        });
        this.item.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {//本身实现click功能
                return;
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        var items = [];
        BI.count(0, o.layer, function () {
            items.push({
                type: "bi.layout",
                cls: "base-line-conn-background",
                width: 13,
                height: o.height
            })
        });
        items.push(this.item);
        BI.createWidget({
            type: "bi.td",
            element: this,
            columnSize: BI.makeArray(o.layer, 13),
            items: [items]
        })
    },

    doRedMark: function () {
        this.item.doRedMark.apply(this.item, arguments);
    },

    unRedMark: function () {
        this.item.unRedMark.apply(this.item, arguments);
    },

    doHighLight: function () {
        this.item.doHighLight.apply(this.item, arguments);
    },

    unHighLight: function () {
        this.item.unHighLight.apply(this.item, arguments);
    },

    getId: function () {
        return this.options.id;
    },

    getPId: function () {
        return this.options.pId;
    },

    doClick: function () {
        BI.MultiLayerSingleTreeFirstTreeLeafItem.superclass.doClick.apply(this, arguments);
        this.item.setSelected(this.isSelected());
    },

    setSelected: function (v) {
        BI.MultiLayerSingleTreeFirstTreeLeafItem.superclass.setSelected.apply(this, arguments);
        this.item.setSelected(v);
    }
});

BI.shortcut("bi.multilayer_single_tree_first_tree_leaf_item", BI.MultiLayerSingleTreeFirstTreeLeafItem);/**
 *
 * Created by GUY on 2016/1/27.
 * @class BI.MultiLayerSingleTreeLastTreeLeafItem
 * @extends BI.BasicButton
 */
BI.MultiLayerSingleTreeLastTreeLeafItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.MultiLayerSingleTreeLastTreeLeafItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-multilayer-single-tree-last-tree-leaf-item bi-list-item-active",
            logic: {
                dynamic: false
            },
            layer: 0,
            id: "",
            pId: "",
            height: 25
        })
    },
    _init: function () {
        BI.MultiLayerSingleTreeLastTreeLeafItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.item = BI.createWidget({
            type: "bi.last_tree_leaf_item",
            logic: {
                dynamic: true
            },
            id: o.id,
            pId: o.pId,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py
        });
        this.item.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {//本身实现click功能
                return;
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        var items = [];
        BI.count(0, o.layer, function () {
            items.push({
                type: "bi.layout",
                cls: "base-line-conn-background",
                width: 13,
                height: o.height
            })
        });
        items.push(this.item);
        BI.createWidget({
            type: "bi.td",
            element: this,
            columnSize: BI.makeArray(o.layer, 13),
            items: [items]
        })
    },

    doRedMark: function () {
        this.item.doRedMark.apply(this.item, arguments);
    },

    unRedMark: function () {
        this.item.unRedMark.apply(this.item, arguments);
    },

    doHighLight: function () {
        this.item.doHighLight.apply(this.item, arguments);
    },

    unHighLight: function () {
        this.item.unHighLight.apply(this.item, arguments);
    },

    getId: function () {
        return this.options.id;
    },

    getPId: function () {
        return this.options.pId;
    },

    doClick: function () {
        BI.MultiLayerSingleTreeLastTreeLeafItem.superclass.doClick.apply(this, arguments);
        this.item.setSelected(this.isSelected());
    },

    setSelected: function (v) {
        BI.MultiLayerSingleTreeLastTreeLeafItem.superclass.setSelected.apply(this, arguments);
        this.item.setSelected(v);
    }
});

BI.shortcut("bi.multilayer_single_tree_last_tree_leaf_item", BI.MultiLayerSingleTreeLastTreeLeafItem);/**
 *
 * Created by GUY on 2016/1/27.
 * @class BI.MultiLayerSingleTreeMidTreeLeafItem
 * @extends BI.BasicButton
 */
BI.MultiLayerSingleTreeMidTreeLeafItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.MultiLayerSingleTreeMidTreeLeafItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-multilayer-single-tree-mid-tree-leaf-item bi-list-item-active",
            logic: {
                dynamic: false
            },
            layer: 0,
            id: "",
            pId: "",
            height: 25
        })
    },
    _init: function () {
        BI.MultiLayerSingleTreeMidTreeLeafItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.item = BI.createWidget({
            type: "bi.mid_tree_leaf_item",
            logic: {
                dynamic: true
            },
            id: o.id,
            pId: o.pId,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py
        });
        this.item.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {//本身实现click功能
                return;
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        var items = [];
        BI.count(0, o.layer, function () {
            items.push({
                type: "bi.layout",
                cls: "base-line-conn-background",
                width: 13,
                height: o.height
            })
        });
        items.push(this.item);
        BI.createWidget({
            type: "bi.td",
            element: this,
            columnSize: BI.makeArray(o.layer, 13),
            items: [items]
        })
    },

    doRedMark: function () {
        this.item.doRedMark.apply(this.item, arguments);
    },

    unRedMark: function () {
        this.item.unRedMark.apply(this.item, arguments);
    },

    doHighLight: function () {
        this.item.doHighLight.apply(this.item, arguments);
    },

    unHighLight: function () {
        this.item.unHighLight.apply(this.item, arguments);
    },

    getId: function () {
        return this.options.id;
    },

    getPId: function () {
        return this.options.pId;
    },

    doClick: function () {
        BI.MultiLayerSingleTreeMidTreeLeafItem.superclass.doClick.apply(this, arguments);
        this.item.setSelected(this.isSelected());
    },

    setSelected: function (v) {
        BI.MultiLayerSingleTreeMidTreeLeafItem.superclass.setSelected.apply(this, arguments);
        this.item.setSelected(v);
    }
});

BI.shortcut("bi.multilayer_single_tree_mid_tree_leaf_item", BI.MultiLayerSingleTreeMidTreeLeafItem);/**
 *
 * @class BI.MultiSelectCheckPane
 * @extends BI.Widget
 */
BI.MultiSelectCheckPane = BI.inherit(BI.Widget, {

    constants: {
        height: 25,
        lgap: 10,
        tgap: 5
    },

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectCheckPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-check-pane bi-background",
            items: [],
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            onClickContinueSelect: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiSelectCheckPane.superclass._init.apply(this, arguments);

        var self = this, opts = this.options;

        this.storeValue = {};
        this.display = BI.createWidget({
            type: 'bi.display_selected_list',
            items: opts.items,
            itemsCreator: function (op, callback) {
                op = BI.extend(op || {}, {
                    selectedValues: self.storeValue.value
                });
                if (self.storeValue.type === BI.Selection.Multi) {
                    callback({
                        items: BI.map(self.storeValue.value, function (i, v) {
                            var txt = opts.valueFormatter(v) || v;
                            return {
                                text: txt,
                                value: v,
                                title: txt
                            }
                        })
                    });
                    return;
                }
                opts.itemsCreator(op, callback);
            }
        });

        this.continueSelect = BI.createWidget({
            type: 'bi.text_button',
            text: BI.i18nText('BI-Continue_Select'),
            cls: 'multi-select-check-selected bi-high-light'
        });

        this.continueSelect.on(BI.TextButton.EVENT_CHANGE, function () {
            opts.onClickContinueSelect();
        });

        BI.createWidget({
            type: 'bi.vtape',
            element: this,
            items: [{
                height: this.constants.height,
                el: {
                    type: 'bi.left',
                    cls: 'multi-select-continue-select',
                    items: [
                        {
                            el: {
                                type: "bi.label",
                                text: BI.i18nText('BI-Selected_Data')
                            },
                            lgap: this.constants.lgap,
                            tgap: this.constants.tgap
                        },
                        {
                            el: this.continueSelect,
                            lgap: this.constants.lgap,
                            tgap: this.constants.tgap
                        }]
                }
            }, {
                height: 'fill',
                el: this.display
            }]
        });
    },

    setValue: function (v) {
        this.storeValue = v || {};
    },

    empty: function () {
        this.display.empty();
    },

    populate: function () {
        this.display.populate.apply(this.display, arguments);
    }
});

BI.shortcut("bi.multi_select_check_pane", BI.MultiSelectCheckPane);/**
 *
 *
 * 查看已选弹出层的展示面板
 * @class BI.DisplaySelectedList
 * @extends BI.Widget
 */
BI.DisplaySelectedList = BI.inherit(BI.Pane, {

    constants: {
        height: 25,
        lgap: 10
    },

    _defaultConfig: function () {
        return BI.extend(BI.DisplaySelectedList.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-display-list",
            itemsCreator: BI.emptyFn,
            items: []
        });
    },

    _init: function () {
        BI.DisplaySelectedList.superclass._init.apply(this, arguments);

        var self = this, opts = this.options;

        this.hasNext = false;

        this.button_group = BI.createWidget({
            type: "bi.list_pane",
            element: this,
            el: {
                type: "bi.loader",
                isDefaultInit: false,
                logic: {
                    dynamic: true,
                    scrolly: true
                },
                items: this._createItems(opts.items),
                chooseType: BI.ButtonGroup.CHOOSE_TYPE_MULTI,
                layouts: [{
                    type: "bi.vertical",
                    lgap: 10
                }]
            },
            itemsCreator: function (options, callback) {

                opts.itemsCreator(options, function (ob) {
                    self.hasNext = !!ob.hasNext;
                    callback(self._createItems(ob.items));
                })
            },
            hasNext: function () {
                return self.hasNext;
            }
        });
    },

    _createItems: function (items) {
        return BI.createItems(items, {
            type: 'bi.icon_text_item',
            cls: 'cursor-default check-font display-list-item bi-tips',
            once: true,
            invalid: true,
            selected: true,
            height: this.constants.height,
            logic: {
                dynamic: true
            }
        });
    },

    empty: function () {
        this.button_group.empty();
    },

    populate: function (items) {
        if (arguments.length === 0) {
            this.button_group.populate();
        } else {
            this.button_group.populate(this._createItems(items));
        }
    }
});

BI.shortcut('bi.display_selected_list', BI.DisplaySelectedList);/**
 *
 * @class BI.MultiSelectCombo
 * @extends BI.Single
 */
BI.MultiSelectCombo = BI.inherit(BI.Single, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-multi-select-combo',
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            height: 28
        });
    },

    _init: function () {
        BI.MultiSelectCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        var assertShowValue = function () {
            BI.isKey(self._startValue) && self.storeValue.value[self.storeValue.type === BI.Selection.All ? "remove" : "pushDistinct"](self._startValue);
            self.trigger.getSearcher().setState(self.storeValue);
            self.trigger.getCounter().setButtonChecked(self.storeValue);
        };
        this.storeValue = {};

        this.trigger = BI.createWidget({
            type: "bi.multi_select_trigger",
            height: o.height,
            // adapter: this.popup,
            masker: {
                offset: {
                    left: 1,
                    top: 1,
                    right: 2,
                    bottom: 33
                }
            },
            valueFormatter: o.valueFormatter,
            itemsCreator: function (op, callback) {
                o.itemsCreator(op, function (res) {
                    if (op.times === 1 && BI.isNotNull(op.keywords)) {
                        self.trigger.setValue(self.getValue());
                    }
                    callback.apply(self, arguments);
                });
            }
        });

        this.trigger.on(BI.MultiSelectTrigger.EVENT_START, function () {
            self._setStartValue("");
            this.getSearcher().setValue(self.storeValue);
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_STOP, function () {
            self._setStartValue("");
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_PAUSE, function () {
            if (this.getSearcher().hasMatched()) {
                var keyword = this.getSearcher().getKeyword();
                self._join({
                    type: BI.Selection.Multi,
                    value: [keyword]
                }, function () {
                    self.combo.setValue(self.storeValue);
                    self._setStartValue(keyword);
                    assertShowValue();
                    self.populate();
                    self._setStartValue("");
                })
            }
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_SEARCHING, function (keywords) {
            var last = BI.last(keywords);
            keywords = BI.initial(keywords || []);
            if (keywords.length > 0) {
                self._joinKeywords(keywords, function () {
                    if (BI.isEndWithBlank(last)) {
                        self.combo.setValue(self.storeValue);
                        assertShowValue();
                        self.combo.populate();
                        self._setStartValue("");
                    } else {
                        self.combo.setValue(self.storeValue);
                        assertShowValue();
                    }
                });
            }
        });

        this.trigger.on(BI.MultiSelectTrigger.EVENT_CHANGE, function (value, obj) {
            if (obj instanceof BI.MultiSelectBar) {
                self._joinAll(this.getValue(), function () {
                    assertShowValue();
                });
            } else {
                self._join(this.getValue(), function () {//安徽省 北京
                    assertShowValue();
                });
            }
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_BEFORE_COUNTER_POPUPVIEW, function () {
            this.getCounter().setValue(self.storeValue);
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_COUNTER_CLICK, function () {
            if (!self.combo.isViewVisible()) {
                self.combo.showView();
            }
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            toggle: false,
            el: this.trigger,
            adjustLength: 1,
            popup: {
                type: 'bi.multi_select_popup_view',
                ref: function () {
                    self.popup = this;
                    self.trigger.setAdapter(this);
                },
                listeners: [{
                    eventName: BI.MultiSelectPopupView.EVENT_CHANGE,
                    action: function () {
                        self.storeValue = this.getValue();
                        self._adjust(function () {
                            assertShowValue();
                        });
                    }
                }, {
                    eventName: BI.MultiSelectPopupView.EVENT_CLICK_CONFIRM,
                    action: function () {
                        self._defaultState();
                    }
                }, {
                    eventName: BI.MultiSelectPopupView.EVENT_CLICK_CLEAR,
                    action: function () {
                        self.setValue();
                        self._defaultState();
                    }
                }],
                itemsCreator: o.itemsCreator,
                valueFormatter: o.valueFormatter,
                onLoaded: function () {
                    BI.nextTick(function () {
                        self.combo.adjustWidth();
                        self.combo.adjustHeight();
                        self.trigger.getCounter().adjustView();
                        self.trigger.getSearcher().adjustView();
                    });
                }
            },
            hideChecker: function (e) {
                return triggerBtn.element.find(e.target).length === 0;
            }
        });

        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            this.setValue(self.storeValue);
            BI.nextTick(function () {
                self.populate();
            });
        });
        this.combo.on(BI.Combo.EVENT_AFTER_HIDEVIEW, function () {
            //important:关闭弹出时又可能没有退出编辑状态
            self.trigger.stopEditing();
            self.fireEvent(BI.MultiSelectCombo.EVENT_CONFIRM);
        });

        var triggerBtn = BI.createWidget({
            type: "bi.trigger_icon_button",
            width: o.height,
            height: o.height,
            cls: "multi-select-trigger-icon-button bi-border-left"
        });
        triggerBtn.on(BI.TriggerIconButton.EVENT_CHANGE, function () {
            self.trigger.getCounter().hideView();
            if (self.combo.isViewVisible()) {
                self.combo.hideView();
            } else {
                self.combo.showView();
            }
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.combo,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }, {
                el: triggerBtn,
                right: 0,
                top: 0,
                bottom: 0
            }]
        })
    },

    _defaultState: function () {
        this.trigger.stopEditing();
        this.combo.hideView();
    },

    _assertValue: function (val) {
        val || (val = {});
        val.type || (val.type = BI.Selection.Multi);
        val.value || (val.value = []);
    },

    _makeMap: function (values) {
        return BI.makeObject(values || []);
    },

    _joinKeywords: function (keywords, callback) {
        var self = this, o = this.options;
        this._assertValue(this.storeValue);
        o.itemsCreator({
            type: BI.MultiSelectCombo.REQ_GET_ALL_DATA,
            keywords: keywords
        }, function (ob) {
            var values = BI.pluck(ob.items, "value");
            digest(values);
        });

        function digest(items) {
            var selectedMap = self._makeMap(items);
            BI.each(keywords, function (i, val) {
                if (BI.isNotNull(selectedMap[val])) {
                    self.storeValue.value[self.storeValue.type === BI.Selection.Multi ? "pushDistinct" : "remove"](val);
                }
            });
            self._adjust(callback);
        }
    },

    _joinAll: function (res, callback) {
        var self = this, o = this.options;
        this._assertValue(res);
        o.itemsCreator({
            type: BI.MultiSelectCombo.REQ_GET_ALL_DATA,
            keywords: [this.trigger.getKey()]
        }, function (ob) {
            var items = BI.pluck(ob.items, "value");
            if (self.storeValue.type === res.type) {
                var change = false;
                var map = self._makeMap(self.storeValue.value);
                BI.each(items, function (i, v) {
                    if (BI.isNotNull(map[v])) {
                        change = true;
                        delete map[v];
                    }
                });
                change && (self.storeValue.value = BI.values(map));
                self._adjust(callback);
                return;
            }
            var selectedMap = self._makeMap(self.storeValue.value);
            var notSelectedMap = self._makeMap(res.value);
            var newItems = [];
            BI.each(items, function (i, item) {
                if (BI.isNotNull(selectedMap[items[i]])) {
                    delete selectedMap[items[i]];
                }
                if (BI.isNull(notSelectedMap[items[i]])) {
                    newItems.push(item);
                }
            });
            self.storeValue.value = newItems.concat(BI.values(selectedMap));
            self._adjust(callback);
        })
    },

    _adjust: function (callback) {
        var self = this, o = this.options;
        if (!this._count) {
            o.itemsCreator({
                type: BI.MultiSelectCombo.REQ_GET_DATA_LENGTH
            }, function (res) {
                self._count = res.count;
                adjust();
                callback();
            });
        } else {
            adjust();
            callback();
        }
        function adjust() {
            if (self.storeValue.type === BI.Selection.All && self.storeValue.value.length >= self._count) {
                self.storeValue = {
                    type: BI.Selection.Multi,
                    value: []
                }
            } else if (self.storeValue.type === BI.Selection.Multi && self.storeValue.value.length >= self._count) {
                self.storeValue = {
                    type: BI.Selection.All,
                    value: []
                }
            }
        }
    },

    _join: function (res, callback) {
        var self = this, o = this.options;
        this._assertValue(res);
        this._assertValue(this.storeValue);
        if (this.storeValue.type === res.type) {
            var map = this._makeMap(this.storeValue.value);
            BI.each(res.value, function (i, v) {
                if (!map[v]) {
                    self.storeValue.value.push(v);
                    map[v] = v;
                }
            });
            var change = false;
            BI.each(res.assist, function (i, v) {
                if (BI.isNotNull(map[v])) {
                    change = true;
                    delete map[v];
                }
            });
            change && (this.storeValue.value = BI.values(map));
            self._adjust(callback);
            return;
        }
        this._joinAll(res, callback);
    },

    _setStartValue: function (value) {
        this._startValue = value;
        this.popup.setStartValue(value);
    },

    setValue: function (v) {
        this.storeValue = v || {};
        this._assertValue(this.storeValue);
        this.combo.setValue(this.storeValue);
    },

    getValue: function () {
        return this.storeValue;
    },

    populate: function () {
        this._count = null;
        this.combo.populate.apply(this.combo, arguments);
    }
});

BI.extend(BI.MultiSelectCombo, {
    REQ_GET_DATA_LENGTH: 0,
    REQ_GET_ALL_DATA: -1
});

BI.MultiSelectCombo.EVENT_CONFIRM = "EVENT_CONFIRM";

BI.shortcut('bi.multi_select_combo', BI.MultiSelectCombo);/**
 * 多选加载数据面板
 * Created by guy on 15/11/2.
 * @class BI.MultiSelectLoader
 * @extends Widget
 */
BI.MultiSelectLoader = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectLoader.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-multi-select-loader',
            logic: {
                dynamic: true
            },
            el: {
                height: 400
            },
            valueFormatter: BI.emptyFn,
            itemsCreator: BI.emptyFn,
            onLoaded: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiSelectLoader.superclass._init.apply(this, arguments);

        var self = this, opts = this.options;
        var hasNext = false;

        this.button_group = BI.createWidget({
            type: "bi.select_list",
            element: this,
            logic: opts.logic,
            el: BI.extend({
                onLoaded: opts.onLoaded,
                el: {
                    type: "bi.loader",
                    isDefaultInit: false,
                    logic: {
                        dynamic: true,
                        scrolly: true
                    },
                    el: {
                        chooseType: BI.ButtonGroup.CHOOSE_TYPE_MULTI,
                        behaviors: {
                            redmark: function () {
                                return true;
                            }
                        },
                        layouts: [{
                            type: "bi.vertical"
                        }]
                    }
                }
            }, opts.el),
            itemsCreator: function (op, callback) {
                var startValue = self._startValue;
                self.storeValue && (op = BI.extend(op || {}, {
                    selectedValues: BI.isKey(startValue) && self.storeValue.type === BI.Selection.Multi
                        ? self.storeValue.value.concat(startValue) : self.storeValue.value
                }));
                opts.itemsCreator(op, function (ob) {
                    hasNext = ob.hasNext;
                    var firstItems = [];
                    if (op.times === 1 && self.storeValue) {
                        var json = BI.map(self.storeValue.value, function (i, v) {
                            var txt = opts.valueFormatter(v) || v;
                            return {
                                text: txt,
                                value: v,
                                title: txt,
                                selected: self.storeValue.type === BI.Selection.Multi
                            }
                        });
                        if (BI.isKey(self._startValue) && !self.storeValue.value.contains(self._startValue)) {
                            var txt = opts.valueFormatter(startValue) || startValue;
                            json.unshift({
                                text: txt,
                                value: startValue,
                                title: txt,
                                selected: true
                            })
                        }
                        firstItems = self._createItems(json);
                    }
                    callback(firstItems.concat(self._createItems(ob.items)), ob.keyword || "");
                    if (op.times === 1 && self.storeValue) {
                        BI.isKey(startValue) && self.storeValue.value[self.storeValue.type === BI.Selection.All ? "remove" : "pushDistinct"](startValue);
                        self.setValue(self.storeValue);
                    }
                    (op.times === 1) && self._scrollToTop();
                });
            },
            hasNext: function () {
                return hasNext;
            }
        });
        this.button_group.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.button_group.on(BI.SelectList.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectLoader.EVENT_CHANGE, arguments);
        });
    },

    _createItems: function (items) {
        return BI.createItems(items, {
            type: "bi.multi_select_item",
            logic: this.options.logic,
            height: 25,
            selected: this.isAllSelected()
        })
    },

    _scrollToTop: function () {
        var self = this;
        BI.delay(function () {
            self.button_group.element.scrollTop(0);
        }, 30);
    },

    isAllSelected: function () {
        return this.button_group.isAllSelected();
    },

    _assertValue: function (val) {
        val || (val = {});
        val.type || (val.type = BI.Selection.Multi);
        val.value || (val.value = []);
    },

    setStartValue: function (v) {
        this._startValue = v;
    },

    setValue: function (v) {
        this.storeValue = v || {};
        this._assertValue(this.storeValue);
        this.button_group.setValue(this.storeValue);
    },

    getValue: function () {
        return this.button_group.getValue();
    },

    getAllButtons: function () {
        return this.button_group.getAllButtons();
    },

    empty: function () {
        this.button_group.empty();
    },

    populate: function (items) {
        this.button_group.populate.apply(this.button_group, arguments);
    },

    resetHeight: function (h) {
        this.button_group.resetHeight(h);
    },

    resetWidth: function (w) {
        this.button_group.resetWidth(w);
    }
});

BI.MultiSelectLoader.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.multi_select_loader', BI.MultiSelectLoader);/**
 * 带加载的多选下拉面板
 * @class BI.MultiSelectPopupView
 * @extends Widget
 */
BI.MultiSelectPopupView = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectPopupView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-multi-select-popup-view',
            maxWidth: 'auto',
            minWidth: 135,
            maxHeight: 400,
            valueFormatter: BI.emptyFn,
            itemsCreator: BI.emptyFn,
            onLoaded: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiSelectPopupView.superclass._init.apply(this, arguments);
        var self = this, opts = this.options;

        this.loader = BI.createWidget({
            type: "bi.multi_select_loader",
            itemsCreator: opts.itemsCreator,
            valueFormatter: opts.valueFormatter,
            onLoaded: opts.onLoaded
        });

        this.popupView = BI.createWidget({
            type: "bi.multi_popup_view",
            stopPropagation: false,
            maxWidth: opts.maxWidth,
            minWidth: opts.minWidth,
            maxHeight: opts.maxHeight,
            element: this,
            buttons: [BI.i18nText('BI-Basic_Clears'), BI.i18nText('BI-Basic_Sure')],
            el: this.loader
        });

        this.popupView.on(BI.MultiPopupView.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectPopupView.EVENT_CHANGE);
        });
        this.popupView.on(BI.MultiPopupView.EVENT_CLICK_TOOLBAR_BUTTON, function (index) {
            switch (index) {
                case 0:
                    self.fireEvent(BI.MultiSelectPopupView.EVENT_CLICK_CLEAR);
                    break;
                case 1:
                    self.fireEvent(BI.MultiSelectPopupView.EVENT_CLICK_CONFIRM);
                    break;
            }
        });
    },

    isAllSelected: function () {
        return this.loader.isAllSelected();
    },

    setStartValue: function (v) {
        this.loader.setStartValue(v);
    },

    setValue: function (v) {
        this.popupView.setValue(v);
    },

    getValue: function () {
        return this.popupView.getValue();
    },

    populate: function (items) {
        this.popupView.populate.apply(this.popupView, arguments);
    },

    resetHeight: function (h) {
        this.popupView.resetHeight(h);
    },

    resetWidth: function (w) {
        this.popupView.resetWidth(w);
    }
});

BI.MultiSelectPopupView.EVENT_CHANGE = "EVENT_CHANGE";
BI.MultiSelectPopupView.EVENT_CLICK_CONFIRM = "EVENT_CLICK_CONFIRM";
BI.MultiSelectPopupView.EVENT_CLICK_CLEAR = "EVENT_CLICK_CLEAR";


BI.shortcut('bi.multi_select_popup_view', BI.MultiSelectPopupView);/**
 *
 * 复选下拉框
 * @class BI.MultiSelectTrigger
 * @extends BI.Trigger
 */

BI.MultiSelectTrigger = BI.inherit(BI.Trigger, {

    constants: {
        height: 14,
        rgap: 4,
        lgap: 4
    },

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectTrigger.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-trigger bi-border",
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            searcher: {},
            switcher: {},

            adapter: null,
            masker: {}
        });
    },

    _init: function () {
        BI.MultiSelectTrigger.superclass._init.apply(this, arguments);

        var self = this, o = this.options;
        if (o.height) {
            this.setHeight(o.height - 2);
        }

        this.searcher = BI.createWidget(o.searcher, {
            type: "bi.multi_select_searcher",
            height: o.height,
            itemsCreator: o.itemsCreator,
            valueFormatter: o.valueFormatter,
            popup: {},
            adapter: o.adapter,
            masker: o.masker
        });
        this.searcher.on(BI.MultiSelectSearcher.EVENT_START, function () {
            self.fireEvent(BI.MultiSelectTrigger.EVENT_START);
        });
        this.searcher.on(BI.MultiSelectSearcher.EVENT_PAUSE, function () {
            self.fireEvent(BI.MultiSelectTrigger.EVENT_PAUSE);
        });
        this.searcher.on(BI.MultiSelectSearcher.EVENT_SEARCHING, function () {
            self.fireEvent(BI.MultiSelectTrigger.EVENT_SEARCHING, arguments);
        });
        this.searcher.on(BI.MultiSelectSearcher.EVENT_STOP, function () {
            self.fireEvent(BI.MultiSelectTrigger.EVENT_STOP);
        });
        this.searcher.on(BI.MultiSelectSearcher.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectTrigger.EVENT_CHANGE, arguments);
        });
        this.numberCounter = BI.createWidget(o.switcher, {
            type: 'bi.multi_select_check_selected_switcher',
            valueFormatter: o.valueFormatter,
            itemsCreator: o.itemsCreator,
            adapter: o.adapter,
            masker: o.masker
        });
        this.numberCounter.on(BI.MultiSelectCheckSelectedSwitcher.EVENT_TRIGGER_CHANGE, function () {
            self.fireEvent(BI.MultiSelectTrigger.EVENT_COUNTER_CLICK);
        });
        this.numberCounter.on(BI.MultiSelectCheckSelectedSwitcher.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.MultiSelectTrigger.EVENT_BEFORE_COUNTER_POPUPVIEW);
        });

        var wrapNumberCounter = BI.createWidget({
            type: 'bi.right_vertical_adapt',
            hgap: 4,
            items: [{
                el: this.numberCounter
            }]
        });

        var wrapper = BI.createWidget({
            type: 'bi.htape',
            element: this,
            items: [
                {
                    el: this.searcher,
                    width: 'fill'
                }, {
                    el: wrapNumberCounter,
                    width: 0
                }, {
                    el: BI.createWidget(),
                    width: 30
                }]
        });

        this.numberCounter.on(BI.Events.VIEW, function (b) {
            BI.nextTick(function () {//自动调整宽度
                wrapper.attr("items")[1].width = (b === true ? self.numberCounter.element.outerWidth() + 8 : 0);
                wrapper.resize();
            });
        });

        this.element.click(function (e) {
            if (self.element.__isMouseInBounds__(e) && !self.numberCounter.element.__isMouseInBounds__(e)) {
                self.numberCounter.hideView();
            }
        });
    },

    getCounter: function () {
        return this.numberCounter;
    },

    getSearcher: function () {
        return this.searcher;
    },

    stopEditing: function () {
        this.searcher.stopSearch();
        this.numberCounter.hideView();
    },

    setAdapter: function (adapter) {
        this.searcher.setAdapter(adapter);
        this.numberCounter.setAdapter(adapter);
    },

    setValue: function (ob) {
        this.searcher.setValue(ob);
        this.numberCounter.setValue(ob);
    },

    getKey: function () {
        return this.searcher.getKey();
    },

    getValue: function () {
        return this.searcher.getValue();
    }
});

BI.MultiSelectTrigger.EVENT_TRIGGER_CLICK = "EVENT_TRIGGER_CLICK";
BI.MultiSelectTrigger.EVENT_COUNTER_CLICK = "EVENT_COUNTER_CLICK";
BI.MultiSelectTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.MultiSelectTrigger.EVENT_START = "EVENT_START";
BI.MultiSelectTrigger.EVENT_STOP = "EVENT_STOP";
BI.MultiSelectTrigger.EVENT_PAUSE = "EVENT_PAUSE";
BI.MultiSelectTrigger.EVENT_SEARCHING = "EVENT_SEARCHING";
BI.MultiSelectTrigger.EVENT_BEFORE_COUNTER_POPUPVIEW = "EVENT_BEFORE_COUNTER_POPUPVIEW";

BI.shortcut('bi.multi_select_trigger', BI.MultiSelectTrigger);/**
 * 多选加载数据搜索loader面板
 * Created by guy on 15/11/4.
 * @class BI.MultiSelectSearchLoader
 * @extends Widget
 */
BI.MultiSelectSearchLoader = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectSearchLoader.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-multi-select-search-loader',
            itemsCreator: BI.emptyFn,
            keywordGetter: BI.emptyFn,
            valueFormatter: BI.emptyFn,
        });
    },

    _init: function () {
        BI.MultiSelectSearchLoader.superclass._init.apply(this, arguments);

        var self = this, opts = this.options;
        var hasNext = false;

        this.button_group = BI.createWidget({
            type: "bi.select_list",
            element: this,
            logic: {
                dynamic: false
            },
            el: {
                tipText: BI.i18nText("BI-No_Select"),
                el: {
                    type: "bi.loader",
                    isDefaultInit: false,
                    logic: {
                        dynamic: true,
                        scrolly: true
                    },
                    el: {
                        chooseType: BI.ButtonGroup.CHOOSE_TYPE_MULTI,
                        behaviors: {
                            redmark: function () {
                                return true;
                            }
                        },
                        layouts: [{
                            type: "bi.vertical"
                        }]
                    }
                }
            },
            itemsCreator: function (op, callback) {
                self.storeValue && (op = BI.extend(op || {}, {
                    selectedValues: self.storeValue.value
                }));
                opts.itemsCreator(op, function (ob) {
                    var keyword = ob.keyword = opts.keywordGetter();
                    hasNext = ob.hasNext;
                    var firstItems = [];
                    if (op.times === 1 && self.storeValue) {
                        var json = self._filterValues(self.storeValue);
                        firstItems = self._createItems(json);
                    }
                    callback(firstItems.concat(self._createItems(ob.items)), keyword);
                    if (op.times === 1 && self.storeValue) {
                        self.setValue(self.storeValue);
                    }
                });
            },
            hasNext: function () {
                return hasNext;
            }
        });
        this.button_group.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.button_group.on(BI.SelectList.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectSearchLoader.EVENT_CHANGE, arguments);
        });
    },

    _createItems: function (items) {
        return BI.createItems(items, {
            type: "bi.multi_select_item",
            logic: {
                dynamic: false
            },
            height: 25,
            selected: this.isAllSelected()
        })
    },

    isAllSelected: function () {
        return this.button_group.isAllSelected();
    },

    _filterValues: function (src) {
        var o = this.options;
        var keyword = o.keywordGetter();
        var values = BI.deepClone(src.value) || [];
        var newValues = BI.map(values, function (i, v) {
            return {
                text: o.valueFormatter(v) || v,
                value: v
            };
        });
        if (BI.isKey(keyword)) {
            var search = BI.Func.getSearchResult(newValues, keyword);
            values = search.matched.concat(search.finded);
        }
        return BI.map(values, function (i, v) {
            return {
                text: v.text,
                title: v.text,
                value: v.value,
                selected: src.type === BI.Selection.All
            }
        })
    },

    setValue: function (v) {
        this.storeValue = v;
        this.button_group.setValue(v);
    },

    getValue: function () {
        return this.button_group.getValue();
    },

    getAllButtons: function () {
        return this.button_group.getAllButtons();
    },

    empty: function () {
        this.button_group.empty();
    },

    populate: function (items) {
        this.button_group.populate.apply(this.button_group, arguments);
    },

    resetHeight: function (h) {
        this.button_group.resetHeight(h);
    },

    resetWidth: function (w) {
        this.button_group.resetWidth(w);
    }
});

BI.MultiSelectSearchLoader.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.multi_select_search_loader', BI.MultiSelectSearchLoader);/**
 *
 * 在搜索框中输入文本弹出的面板
 * @class BI.MultiSelectSearchPane
 * @extends Widget
 */

BI.MultiSelectSearchPane = BI.inherit(BI.Widget, {

    constants: {
        height: 25,
        lgap: 10,
        tgap: 5
    },

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectSearchPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-search-pane bi-card",
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            keywordGetter: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiSelectSearchPane.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.tooltipClick = BI.createWidget({
            type: "bi.label",
            invisible: true,
            text: BI.i18nText('BI-Click_Blank_To_Select'),
            cls: 'multi-select-toolbar',
            height: this.constants.height
        });

        this.loader = BI.createWidget({
            type: "bi.multi_select_search_loader",
            keywordGetter: o.keywordGetter,
            valueFormatter: o.valueFormatter,
            itemsCreator: function (op, callback) {
                o.itemsCreator.apply(self, [op, function (res) {
                    callback(res);
                    self.setKeyword(o.keywordGetter());
                }]);
            }
        });
        this.loader.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.resizer = BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: this.tooltipClick,
                height: 0
            }, {
                el: this.loader
            }]
        });
        this.tooltipClick.setVisible(false);
    },

    setKeyword: function (keyword) {
        var btn;
        var isVisible = this.loader.getAllButtons().length > 0 && (btn = this.loader.getAllButtons()[0]) && (keyword === btn.getValue());
        if (isVisible !== this.tooltipClick.isVisible()) {
            this.tooltipClick.setVisible(isVisible);
            this.resizer.attr("items")[0].height = (isVisible ? this.constants.height : 0);
            this.resizer.resize();
        }
    },

    isAllSelected: function () {
        return this.loader.isAllSelected();
    },

    hasMatched: function () {
        return this.tooltipClick.isVisible();
    },

    setValue: function (v) {
        this.loader.setValue(v);
    },

    getValue: function () {
        return this.loader.getValue();
    },

    empty: function () {
        this.loader.empty();
    },

    populate: function (items) {
        this.loader.populate.apply(this.loader, arguments);
    }
});

BI.MultiSelectSearchPane.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.multi_select_search_pane", BI.MultiSelectSearchPane);/**
 * 查看已选按钮
 * Created by guy on 15/11/3.
 * @class BI.MultiSelectCheckSelectedButton
 * @extends BI.Single
 */
BI.MultiSelectCheckSelectedButton = BI.inherit(BI.Single, {

    _const: {
        checkSelected: BI.i18nText('BI-Check_Selected')
    },

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectCheckSelectedButton.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-multi-select-check-selected-button bi-high-light',
            itemsCreator: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiSelectCheckSelectedButton.superclass._init.apply(this, arguments);
        var self = this;
        this.numberCounter = BI.createWidget({
            type: 'bi.text_button',
            element: this,
            hgap: 4,
            text: "0",
            textAlign: 'center',
            textHeight: 15
        });
        this.numberCounter.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.numberCounter.on(BI.TextButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectCheckSelectedButton.EVENT_CHANGE, arguments);
        });

        this.numberCounter.element.hover(function () {
            self.numberCounter.setTag(self.numberCounter.getText());
            self.numberCounter.setText(self._const.checkSelected);
        }, function () {
            self.numberCounter.setText(self.numberCounter.getTag());
        });
        this.setVisible(false);
    },

    setValue: function (ob) {
        var self = this, o = this.options;
        ob || (ob = {});
        ob.type || (ob.type = BI.Selection.Multi);
        ob.value || (ob.value = []);
        if (ob.type === BI.Selection.All) {
            o.itemsCreator({
                type: BI.MultiSelectCombo.REQ_GET_DATA_LENGTH
            }, function (res) {
                var length = res.count - ob.value.length;
                BI.nextTick(function(){
                    self.numberCounter.setText(length);
                    self.setVisible(length > 0);
                });
            });
            return;
        }
        BI.nextTick(function(){
            self.numberCounter.setText(ob.value.length);
            self.setVisible(ob.value.length > 0);
        })
    },

    getValue: function () {

    }
});

BI.MultiSelectCheckSelectedButton.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.multi_select_check_selected_button', BI.MultiSelectCheckSelectedButton);/**
 * 多选输入框
 * Created by guy on 15/11/3.
 * @class BI.MultiSelectEditor
 * @extends Widget
 */
BI.MultiSelectEditor = BI.inherit(BI.Widget, {

    _const: {
        checkSelected: BI.i18nText('BI-Check_Selected')
    },

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectEditor.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-multi-select-editor',
            el: {}
        });
    },

    _init: function () {
        BI.MultiSelectEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget(o.el, {
            type: 'bi.state_editor',
            element: this,
            height: o.height,
            watermark: BI.i18nText('BI-Basic_Search'),
            allowBlank: true
        });

        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.editor.on(BI.StateEditor.EVENT_PAUSE, function () {
            self.fireEvent(BI.MultiSelectEditor.EVENT_PAUSE);
        });
        this.editor.on(BI.StateEditor.EVENT_CLICK_LABEL, function () {

        });
    },

    focus: function () {
        this.editor.focus();
    },

    blur: function () {
        this.editor.blur();
    },

    setState: function (state) {
        this.editor.setState(state);
    },

    setValue: function (v) {
        this.editor.setValue(v);
    },

    getValue: function () {
        var v = this.editor.getState();
        if (BI.isArray(v) && v.length > 0) {
            return v[v.length - 1];
        } else {
            return "";
        }
    },

    getKeywords: function () {
        var val = this.editor.getLastValidValue();
        var keywords = val.match(/[\S]+/g);
        if (BI.isEndWithBlank(val)) {
            return keywords.concat([' ']);
        }
        return keywords;
    },

    populate: function (items) {

    }
});
BI.MultiSelectEditor.EVENT_PAUSE = "MultiSelectEditor.EVENT_PAUSE";
BI.shortcut('bi.multi_select_editor', BI.MultiSelectEditor);/**
 * searcher
 * Created by guy on 15/11/3.
 * @class BI.MultiSelectSearcher
 * @extends Widget
 */
BI.MultiSelectSearcher = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectSearcher.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-multi-select-searcher',
            itemsCreator: BI.emptyFn,
            el: {},
            popup: {},
            valueFormatter: BI.emptyFn,
            adapter: null,
            masker: {}
        });
    },

    _init: function () {
        BI.MultiSelectSearcher.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget(o.el, {
            type: 'bi.multi_select_editor',
            height: o.height
        });

        this.searcher = BI.createWidget({
            type: "bi.searcher",
            element: this,
            height: o.height,
            isAutoSearch: false,
            isAutoSync: false,
            onSearch: function (op, callback) {
                callback();
            },
            el: this.editor,

            popup: BI.extend({
                type: "bi.multi_select_search_pane",
                valueFormatter: o.valueFormatter,
                keywordGetter: function () {
                    return self.editor.getValue();
                },
                itemsCreator: function (op, callback) {
                    op.keyword = self.editor.getValue();
                    this.setKeyword(op.keyword);
                    o.itemsCreator(op, callback);
                }
            }, o.popup),

            adapter: o.adapter,
            masker: o.masker
        });
        this.searcher.on(BI.Searcher.EVENT_START, function () {
            self.fireEvent(BI.MultiSelectSearcher.EVENT_START);
        });
        this.searcher.on(BI.Searcher.EVENT_PAUSE, function () {
            if (this.hasMatched()) {

            }
            self.fireEvent(BI.MultiSelectSearcher.EVENT_PAUSE);
        });
        this.searcher.on(BI.Searcher.EVENT_STOP, function () {
            self.fireEvent(BI.MultiSelectSearcher.EVENT_STOP);
        });
        this.searcher.on(BI.Searcher.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectSearcher.EVENT_CHANGE, arguments);
        });
        this.searcher.on(BI.Searcher.EVENT_SEARCHING, function () {
            var keywords = this.getKeywords();
            self.fireEvent(BI.MultiSelectSearcher.EVENT_SEARCHING, keywords);
        });
    },

    adjustView: function () {
        this.searcher.adjustView();
    },

    isSearching: function () {
        return this.searcher.isSearching();
    },

    stopSearch: function () {
        this.searcher.stopSearch();
    },

    getKeyword: function () {
        return this.editor.getValue();
    },

    hasMatched: function () {
        return this.searcher.hasMatched();
    },

    hasChecked: function () {
        return this.searcher.getView() && this.searcher.getView().hasChecked();
    },

    setAdapter: function (adapter) {
        this.searcher.setAdapter(adapter);
    },

    setState: function (ob) {
        var o = this.options;
        ob || (ob = {});
        ob.value || (ob.value = []);
        if (ob.type === BI.Selection.All) {
            if (BI.size(ob.assist) === 1) {
                this.editor.setState(o.valueFormatter(ob.assist[0] + "") || (ob.assist[0] + ""));
            } else {
                this.editor.setState(BI.size(ob.value) > 0 ? BI.Selection.Multi : BI.Selection.All);
            }
        } else {
            if (BI.size(ob.value) === 1) {
                this.editor.setState(o.valueFormatter(ob.value[0] + "") || (ob.value[0] + ""));
            } else {
                this.editor.setState(BI.size(ob.value) > 0 ? BI.Selection.Multi : BI.Selection.None);
            }
        }
    },

    setValue: function (ob) {
        this.setState(ob);
        this.searcher.setValue(ob);
    },

    getKey: function () {
        return this.editor.getValue();
    },

    getValue: function () {
        return this.searcher.getValue();
    },

    populate: function (items) {
        this.searcher.populate.apply(this.searcher, arguments);
    }
});

BI.MultiSelectSearcher.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.MultiSelectSearcher.EVENT_CHANGE = "EVENT_CHANGE";
BI.MultiSelectSearcher.EVENT_START = "EVENT_START";
BI.MultiSelectSearcher.EVENT_STOP = "EVENT_STOP";
BI.MultiSelectSearcher.EVENT_PAUSE = "EVENT_PAUSE";
BI.MultiSelectSearcher.EVENT_SEARCHING = "EVENT_SEARCHING";
BI.shortcut('bi.multi_select_searcher', BI.MultiSelectSearcher);/**
 * 查看已选switcher
 * Created by guy on 15/11/3.
 * @class BI.MultiSelectCheckSelectedSwitcher
 * @extends Widget
 */
BI.MultiSelectCheckSelectedSwitcher = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectCheckSelectedSwitcher.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-multi-select-check-selected-switcher',
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            el: {},
            popup: {},
            adapter: null,
            masker: {}
        });
    },

    _init: function () {
        BI.MultiSelectCheckSelectedSwitcher.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.button = BI.createWidget(o.el, {
            type: "bi.multi_select_check_selected_button",
            itemsCreator: o.itemsCreator
        });
        this.button.on(BI.Events.VIEW, function () {
            self.fireEvent(BI.Events.VIEW, arguments);
        });
        this.switcher = BI.createWidget({
            type: "bi.switcher",
            toggle: false,
            element: this,
            el: this.button,
            popup: BI.extend({
                type: "bi.multi_select_check_pane",
                valueFormatter: o.valueFormatter,
                itemsCreator: o.itemsCreator,
                onClickContinueSelect: function () {
                    self.switcher.hideView();
                }
            }, o.popup),
            adapter: o.adapter,
            masker: o.masker
        });
        this.switcher.on(BI.Switcher.EVENT_TRIGGER_CHANGE, function () {
            self.fireEvent(BI.MultiSelectCheckSelectedSwitcher.EVENT_TRIGGER_CHANGE);
        });
        this.switcher.on(BI.Switcher.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.MultiSelectCheckSelectedSwitcher.EVENT_BEFORE_POPUPVIEW);
        });
        this.switcher.on(BI.Switcher.EVENT_AFTER_POPUPVIEW, function () {
            var me = this;
            BI.nextTick(function () {
                me.populate();
            });
        });

        this.switcher.element.click(function (e) {
            e.stopPropagation();
        });
    },

    adjustView: function () {
        this.switcher.adjustView();
    },

    hideView: function () {
        this.switcher.empty();
        this.switcher.hideView();
    },

    setAdapter: function (adapter) {
        this.switcher.setAdapter(adapter);
    },

    setValue: function (v) {
        this.switcher.setValue(v);
    },

    setButtonChecked: function (v) {
        this.button.setValue(v)
    },

    getValue: function () {

    },

    populate: function (items) {
        this.switcher.populate.apply(this.switcher, arguments);
    }
});

BI.MultiSelectCheckSelectedSwitcher.EVENT_TRIGGER_CHANGE = "MultiSelectCheckSelectedSwitcher.EVENT_TRIGGER_CHANGE";
BI.MultiSelectCheckSelectedSwitcher.EVENT_BEFORE_POPUPVIEW = "MultiSelectCheckSelectedSwitcher.EVENT_BEFORE_POPUPVIEW";
BI.shortcut('bi.multi_select_check_selected_switcher', BI.MultiSelectCheckSelectedSwitcher);/**
 * Created by zcf_1 on 2017/5/2.
 */
BI.MultiSelectList = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectList.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-multi-select-list',
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn
        })
    },
    _init: function () {
        BI.MultiSelectList.superclass._init.apply(this, arguments);

        var self = this, o = this.options;
        this.storeValue = {};

        var assertShowValue = function () {
            BI.isKey(self._startValue) && self.storeValue.value[self.storeValue.type === BI.Selection.All ? "remove" : "pushDistinct"](self._startValue);
            self.trigger.setValue(self.storeValue);
        };

        this.adapter = BI.createWidget({
            type: "bi.multi_select_loader",
            cls: "popup-multi-select-list bi-border-left bi-border-right bi-border-bottom",
            itemsCreator: o.itemsCreator,
            valueFormatter: o.valueFormatter,
            // onLoaded: o.onLoaded,
            el: {
                height: ""
            }
        });
        this.adapter.on(BI.MultiSelectLoader.EVENT_CHANGE, function () {
            self.storeValue = this.getValue();
            self._adjust(function () {
                assertShowValue();
                self.fireEvent(BI.MultiSelectList.EVENT_CHANGE);
            });
        });

        this.searcherPane = BI.createWidget({
            type: "bi.multi_select_search_pane",
            cls: "bi-border-left bi-border-right bi-border-bottom",
            valueFormatter: o.valueFormatter,
            keywordGetter: function () {
                return self.trigger.getKeyword();
            },
            itemsCreator: function (op, callback) {
                op.keyword = self.trigger.getKeyword();
                this.setKeyword(op.keyword);
                o.itemsCreator(op, callback);
            }
        });
        this.searcherPane.setVisible(false);

        this.trigger = BI.createWidget({
            type: "bi.searcher",
            isAutoSearch: false,
            isAutoSync: false,
            onSearch: function (op, callback) {
                callback();
            },
            adapter: this.adapter,
            popup: this.searcherPane,
            height: 200,
            masker: false,
            listeners: [{
                eventName: BI.Searcher.EVENT_START,
                action: function () {
                    self._showSearcherPane();
                    self._setStartValue("");
                    this.setValue(self.storeValue);
                }
            }, {
                eventName: BI.Searcher.EVENT_STOP,
                action: function () {
                    self._showAdapter();
                    self._setStartValue("");
                    self.adapter.setValue(self.storeValue);
                    //需要刷新回到初始界面，否则搜索的结果不能放在最前面
                    self.adapter.populate();
                }
            }, {
                eventName: BI.Searcher.EVENT_PAUSE,
                action: function () {
                    if (this.hasMatched()) {
                        var keyword = this.getKeyword();
                        self._join({
                            type: BI.Selection.Multi,
                            value: [keyword]
                        }, function () {
                            self._showAdapter();
                            self.adapter.setValue(self.storeValue);
                            self._setStartValue(keyword);
                            assertShowValue();
                            self._setStartValue("");
                            self.fireEvent(BI.MultiSelectList.EVENT_CHANGE);
                        })
                    } else {
                        self._showAdapter();
                    }
                }
            }, {
                eventName: BI.Searcher.EVENT_SEARCHING,
                action: function () {
                    var keywords = this.getKeyword();
                    var last = BI.last(keywords);
                    keywords = BI.initial(keywords || []);
                    if (keywords.length > 0) {
                        self._joinKeywords(keywords, function () {
                            if (BI.isEndWithBlank(last)) {
                                self.adapter.setValue(self.storeValue);
                                assertShowValue();
                                self.adapter.populate();
                                self._setStartValue("");
                            } else {
                                self.adapter.setValue(self.storeValue);
                                assertShowValue();
                            }
                        });
                    }
                }
            }, {
                eventName: BI.Searcher.EVENT_CHANGE,
                action: function (value, obj) {
                    if (obj instanceof BI.MultiSelectBar) {
                        self._joinAll(this.getValue(), function () {
                            assertShowValue();
                        });
                    } else {
                        self._join(this.getValue(), function () {//安徽省 北京
                            assertShowValue();
                        });
                    }
                }
            }]
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: this.trigger,
                height: 30
            }, {
                el: this.adapter,
                height: "fill"
            }]
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.searcherPane,
                top: 30,
                bottom: 0,
                left: 0,
                right: 0
            }]
        })
    },

    _showAdapter: function () {
        this.adapter.setVisible(true);
        this.searcherPane.setVisible(false);
    },

    _showSearcherPane: function () {
        this.searcherPane.setVisible(true);
        this.adapter.setVisible(false);
    },

    _defaultState: function () {
        this.trigger.stopEditing();
    },

    _assertValue: function (val) {
        val || (val = {});
        val.type || (val.type = BI.Selection.Multi);
        val.value || (val.value = []);
    },

    _makeMap: function (values) {
        return BI.makeObject(values || []);
    },

    _joinKeywords: function (keywords, callback) {
        var self = this, o = this.options;
        this._assertValue(this.storeValue);
        if (!this._allData) {
            o.itemsCreator({
                type: BI.MultiSelectList.REQ_GET_ALL_DATA
            }, function (ob) {
                self._allData = BI.pluck(ob.items, "value");
                digest(self._allData);
            })
        } else {
            digest(this._allData)
        }

        function digest(items) {
            var selectedMap = self._makeMap(items);
            BI.each(keywords, function (i, val) {
                if (BI.isNotNull(selectedMap[val])) {
                    self.storeValue.value[self.storeValue.type === BI.Selection.Multi ? "pushDistinct" : "remove"](val);
                }
            });
            self._adjust(callback);
        }
    },

    _joinAll: function (res, callback) {
        var self = this, o = this.options;
        this._assertValue(res);
        o.itemsCreator({
            type: BI.MultiSelectList.REQ_GET_ALL_DATA,
            keyword: self.trigger.getKeyword()
        }, function (ob) {
            var items = BI.pluck(ob.items, "value");
            if (self.storeValue.type === res.type) {
                var change = false;
                var map = self._makeMap(self.storeValue.value);
                BI.each(items, function (i, v) {
                    if (BI.isNotNull(map[v])) {
                        change = true;
                        delete map[v];
                    }
                });
                change && (self.storeValue.value = BI.values(map));
                self._adjust(callback);
                return;
            }
            var selectedMap = self._makeMap(self.storeValue.value);
            var notSelectedMap = self._makeMap(res.value);
            var newItems = [];
            BI.each(items, function (i, item) {
                if (BI.isNotNull(selectedMap[items[i]])) {
                    delete selectedMap[items[i]];
                }
                if (BI.isNull(notSelectedMap[items[i]])) {
                    newItems.push(item);
                }
            });
            self.storeValue.value = newItems.concat(BI.values(selectedMap));
            self._adjust(callback);
        })
    },

    _adjust: function (callback) {
        var self = this, o = this.options;
        if (!this._count) {
            o.itemsCreator({
                type: BI.MultiSelectList.REQ_GET_DATA_LENGTH
            }, function (res) {
                self._count = res.count;
                adjust();
                callback();
            });
        } else {
            adjust();
            callback();
        }
        function adjust() {
            if (self.storeValue.type === BI.Selection.All && self.storeValue.value.length >= self._count) {
                self.storeValue = {
                    type: BI.Selection.Multi,
                    value: []
                }
            } else if (self.storeValue.type === BI.Selection.Multi && self.storeValue.value.length >= self._count) {
                self.storeValue = {
                    type: BI.Selection.All,
                    value: []
                }
            }
        }
    },

    _join: function (res, callback) {
        var self = this, o = this.options;
        this._assertValue(res);
        this._assertValue(this.storeValue);
        if (this.storeValue.type === res.type) {
            var map = this._makeMap(this.storeValue.value);
            BI.each(res.value, function (i, v) {
                if (!map[v]) {
                    self.storeValue.value.push(v);
                    map[v] = v;
                }
            });
            var change = false;
            BI.each(res.assist, function (i, v) {
                if (BI.isNotNull(map[v])) {
                    change = true;
                    delete map[v];
                }
            });
            change && (this.storeValue.value = BI.values(map));
            self._adjust(callback);
            return;
        }
        this._joinAll(res, callback);
    },

    _setStartValue: function (value) {
        this._startValue = value;
        this.adapter.setStartValue(value);
    },

    isAllSelected: function () {
        return this.adapter.isAllSelected();
    },

    resize: function () {
        // this.trigger.getCounter().adjustView();
        // this.trigger.adjustView();
    },
    setValue: function (v) {
        this.storeValue = v || {};
        this._assertValue(this.storeValue);
        this.adapter.setValue(this.storeValue);
        this.trigger.setValue(this.storeValue);
    },

    getValue: function () {
        return this.storeValue;
    },

    populate: function () {
        this._count = null;
        this._allData = null;
        this.adapter.populate.apply(this.adapter, arguments);
        this.trigger.populate.apply(this.trigger, arguments);
    }
});

BI.extend(BI.MultiSelectList, {
    REQ_GET_DATA_LENGTH: 0,
    REQ_GET_ALL_DATA: -1
});

BI.MultiSelectList.EVENT_CHANGE = "BI.MultiSelectList.EVENT_CHANGE";
BI.shortcut("bi.multi_select_list", BI.MultiSelectList);/**
 * Created by zcf_1 on 2017/5/11.
 */
BI.MultiSelectTree = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectTree.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-multi-select-tree',
            itemsCreator: BI.emptyFn
        })
    },

    _init: function () {
        BI.MultiSelectTree.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.storeValue = {value: {}};

        this.adapter = BI.createWidget({
            type: "bi.multi_select_tree_popup",
            itemsCreator: o.itemsCreator
        });
        this.adapter.on(BI.MultiSelectTreePopup.EVENT_CHANGE, function () {
            if (self.trigger.isSearching()) {
                self.storeValue = {value: self.searcherPane.getValue()};
            } else {
                self.storeValue = {value: self.adapter.getValue()};
            }
            self.fireEvent(BI.MultiSelectTree.EVENT_CHANGE);
        });

        this.searcherPane = BI.createWidget({//搜索中的时候用的是parttree，同adapter中的synctree不一样
            type: "bi.multi_tree_search_pane",
            cls: "bi-border-left bi-border-right bi-border-bottom",
            keywordGetter: function () {
                return self.trigger.getKeyword();
            },
            itemsCreator: function (op, callback) {
                op.keyword = self.trigger.getKeyword();
                o.itemsCreator(op, callback);
            }
        });
        this.searcherPane.setVisible(false);

        this.trigger = BI.createWidget({
            type: "bi.searcher",
            isAutoSearch: false,
            isAutoSync: false,
            onSearch: function (op, callback) {
                callback({
                    keyword: self.trigger.getKeyword()
                });
            },
            adapter: this.adapter,
            popup: this.searcherPane,
            masker: false,
            listeners: [{
                eventName: BI.Searcher.EVENT_START,
                action: function () {
                    self._showSearcherPane();
                    self.storeValue = {value: self.adapter.getValue()};
                    self.searcherPane.setValue(self.storeValue);
                }
            }, {
                eventName: BI.Searcher.EVENT_STOP,
                action: function () {
                    self._showAdapter();
                    // self.storeValue = {value: self.searcherPane.getValue()};
                    self.adapter.setValue(self.storeValue);
                    BI.nextTick(function () {
                        self.adapter.populate();
                    });
                }
            }, {
                eventName: BI.Searcher.EVENT_CHANGE,
                action: function () {
                    if (self.trigger.isSearching()) {
                        self.storeValue = {value: self.searcherPane.getValue()};
                    } else {
                        self.storeValue = {value: self.adapter.getValue()};
                    }
                    self.fireEvent(BI.MultiSelectTree.EVENT_CHANGE);
                }
            }, {
                eventName: BI.Searcher.EVENT_PAUSE,
                action: function () {
                    self._showAdapter();
                }
            }]
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: this.trigger,
                height: 30
            }, {
                el: this.adapter,
                height: "fill"
            }]
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.searcherPane,
                top: 30,
                bottom: 0,
                left: 0,
                right: 0
            }]
        })

    },

    _showAdapter: function () {
        this.adapter.setVisible(true);
        this.searcherPane.setVisible(false);
    },

    _showSearcherPane: function () {
        this.searcherPane.setVisible(true);
        this.adapter.setVisible(false);
    },

    resize: function () {

    },

    setSelectedValue: function (v) {
        this.adapter.setSelectedValue(v);
    },

    setValue: function (v) {
        this.storeValue.value = v || {};
        this.adapter.setValue({
            value: v || {}
        });
        this.trigger.setValue({
            value: v || {}
        });
    },

    stopSearch: function () {
        this.trigger.stopSearch();
    },

    updateValue: function (v) {
        this.adapter.updateValue(v);
    },

    getValue: function () {
        return this.storeValue.value;
    },

    populate: function () {
        this.trigger.populate.apply(this.trigger, arguments);
        this.adapter.populate.apply(this.adapter, arguments);
    }
});
BI.MultiSelectTree.EVENT_CHANGE = "BI.MultiSelectTree.EVENT_CHANGE";
BI.shortcut("bi.multi_select_tree", BI.MultiSelectTree);/**
 * Created by zcf on 2016/12/21.
 */
BI.MultiSelectTreePopup = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectTreePopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-tree-popup bi-border-left bi-border-right bi-border-bottom",
            itemsCreator: BI.emptyFn
        });
    },
    _init: function () {
        BI.MultiSelectTreePopup.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.popup = BI.createWidget({
            type: "bi.async_tree",
            element: this,
            itemsCreator: o.itemsCreator
        });
        this.popup.on(BI.TreeView.EVENT_AFTERINIT, function () {
            self.fireEvent(BI.MultiSelectTreePopup.EVENT_AFTER_INIT)
        });
        this.popup.on(BI.TreeView.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectTreePopup.EVENT_CHANGE)
        });
    },

    hasChecked: function () {
        return this.popup.hasChecked();
    },

    getValue: function () {
        return this.popup.getValue();
    },

    setValue: function (v) {
        v || (v = {});
        this.popup.setValue(v.value);
    },

    setSelectedValue: function (v) {
        v || (v = {});
        this.popup.setSelectedValue(v);
    },

    updateValue: function (v) {
        this.popup.updateValue(v);
        this.popup.refresh();
    },

    populate: function (config) {
        this.popup.stroke(config);
    }

});
BI.MultiSelectTreePopup.EVENT_AFTER_INIT = "BI.MultiSelectTreePopup.EVENT_AFTER_INIT";
BI.MultiSelectTreePopup.EVENT_CHANGE = "BI.MultiSelectTreePopup.EVENT_CHANGE";
BI.shortcut("bi.multi_select_tree_popup", BI.MultiSelectTreePopup);/**
 *
 * @class BI.MultiTreeCheckPane
 * @extends BI.Pane
 */
BI.MultiTreeCheckPane = BI.inherit(BI.Pane, {

    constants: {
        height: 25,
        lgap: 10,
        tgap: 5
    },

    _defaultConfig: function () {
        return BI.extend(BI.MultiTreeCheckPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-tree-check-pane bi-background",
            onClickContinueSelect: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiTreeCheckPane.superclass._init.apply(this, arguments);

        var self = this, opts = this.options;

        this.selectedValues = {};

        var continueSelect = BI.createWidget({
            type: 'bi.text_button',
            text: BI.i18nText('BI-Continue_Select'),
            cls: 'multi-tree-check-selected'
        });
        continueSelect.on(BI.TextButton.EVENT_CHANGE, function () {
            opts.onClickContinueSelect();
            BI.nextTick(function () {
                self.empty();
            });
        });

        var backToPopup = BI.createWidget({
            type: 'bi.left',
            cls: 'multi-tree-continue-select',
            items: [
                {
                    el: {
                        type: "bi.label",
                        text: BI.i18nText('BI-Selected_Data')
                    },
                    lgap: this.constants.lgap,
                    tgap: this.constants.tgap
                },
                {
                    el: continueSelect,
                    lgap: this.constants.lgap,
                    tgap: this.constants.tgap
                }]
        });

        this.display = BI.createWidget({
            type: "bi.display_tree",
            cls: "bi-multi-tree-display",
            itemsCreator: function (op, callback) {
                op.type = BI.TreeView.REQ_TYPE_GET_SELECTED_DATA;
                opts.itemsCreator(op, callback);
            }
        });

        this.display.on(BI.Events.AFTERINIT, function () {
            self.fireEvent(BI.Events.AFTERINIT);
        });

        this.display.on(BI.TreeView.EVENT_INIT, function () {
            backToPopup.setVisible(false);
        });

        this.display.on(BI.TreeView.EVENT_AFTERINIT, function () {
            backToPopup.setVisible(true);
        });

        BI.createWidget({
            type: 'bi.vtape',
            element: this,
            items: [{
                height: this.constants.height,
                el: backToPopup
            }, {
                height: 'fill',
                el: this.display
            }]
        });

    },

    empty: function () {
        this.display.empty();
    },

    populate: function (configs) {
        this.display.stroke(configs);
    },

    setValue: function (v) {
        v || (v = {});
        this.display.setValue(v.value);
    },

    getValue: function () {

    }
});

BI.MultiTreeCheckPane.EVENT_CONTINUE_CLICK = "EVENT_CONTINUE_CLICK";


BI.shortcut("bi.multi_tree_check_pane", BI.MultiTreeCheckPane);/**
 *
 * @class BI.MultiTreeCombo
 * @extends BI.Single
 */

BI.MultiTreeCombo = BI.inherit(BI.Single, {

    constants: {
        offset: {
            top: 1,
            left: 1,
            right: 2,
            bottom: 33
        }
    },

    _defaultConfig: function () {
        return BI.extend(BI.MultiTreeCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-multi-tree-combo',
            itemsCreator: BI.emptyFn,
            height: 25
        });
    },

    _init: function () {
        BI.MultiTreeCombo.superclass._init.apply(this, arguments);

        var self = this, o = this.options;

        var isInit = false;
        var want2showCounter = false;

        this.trigger = BI.createWidget({
            type: "bi.multi_select_trigger",
            height: o.height,
            // adapter: this.popup,
            masker: {
                offset: this.constants.offset
            },
            searcher: {
                type: "bi.multi_tree_searcher",
                itemsCreator: o.itemsCreator
            },
            switcher: {
                el: {
                    type: "bi.multi_tree_check_selected_button"
                },
                popup: {
                    type: "bi.multi_tree_check_pane",
                    itemsCreator: o.itemsCreator
                }
            }

        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            toggle: false,
            el: this.trigger,
            adjustLength: 1,
            popup: {
                type: 'bi.multi_tree_popup_view',
                ref: function () {
                    self.popup = this;
                    self.trigger.setAdapter(this);
                },
                listeners: [{
                    eventName: BI.MultiTreePopup.EVENT_AFTERINIT,
                    action: function () {
                        self.trigger.getCounter().adjustView();
                        isInit = true;
                        if (want2showCounter === true) {
                            showCounter();
                        }
                    }
                }, {
                    eventName: BI.MultiTreePopup.EVENT_CHANGE,
                    action: function () {
                        change = true;
                        var val = {
                            type: BI.Selection.Multi,
                            value: this.hasChecked() ? {1: 1} : {}
                        };
                        self.trigger.getSearcher().setState(val);
                        self.trigger.getCounter().setButtonChecked(val);
                    }
                }, {
                    eventName: BI.MultiTreePopup.EVENT_CLICK_CONFIRM,
                    action: function () {
                        self.combo.hideView();
                    }
                }, {
                    eventName: BI.MultiTreePopup.EVENT_CLICK_CLEAR,
                    action: function () {
                        clear = true;
                        self.setValue();
                        self._defaultState();
                    }
                }],
                itemsCreator: o.itemsCreator,
                onLoaded: function () {
                    BI.nextTick(function () {
                        self.trigger.getCounter().adjustView();
                        self.trigger.getSearcher().adjustView();
                    });
                }
            }
        });

        this.storeValue = {value: {}};
        var change = false;
        var clear = false;          //标识当前是否点击了清空

        var isSearching = function () {
            return self.trigger.getSearcher().isSearching();
        };

        var isPopupView = function () {
            return self.combo.isViewVisible();
        };

        this.trigger.on(BI.MultiSelectTrigger.EVENT_START, function () {
            self.storeValue = {value: self.combo.getValue()};
            this.setValue(self.storeValue);
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_STOP, function () {
            self.storeValue = {value: this.getValue()};
            self.combo.setValue(self.storeValue);
            BI.nextTick(function () {
                if (isPopupView()) {
                    self.combo.populate();
                }
            });
        });
        function showCounter() {
            if (isSearching()) {
                self.storeValue = {value: self.trigger.getValue()};
            } else if (isPopupView()) {
                self.storeValue = {value: self.combo.getValue()};
            }
            self.trigger.setValue(self.storeValue);
        }

        this.trigger.on(BI.MultiSelectTrigger.EVENT_BEFORE_COUNTER_POPUPVIEW, function () {
            if (want2showCounter === false) {
                want2showCounter = true;
            }
            if (isInit === true) {
                want2showCounter = null;
                showCounter();
            }
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_TRIGGER_CLICK, function () {
            self.combo.toggle();
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_COUNTER_CLICK, function () {
            if (!self.combo.isViewVisible()) {
                self.combo.showView();
            }
        });

        this.trigger.on(BI.MultiSelectTrigger.EVENT_CHANGE, function () {
            var val = {
                type: BI.Selection.Multi,
                value: this.getSearcher().hasChecked() ? {1: 1} : {}
            };
            this.getSearcher().setState(val);
            this.getCounter().setButtonChecked(val);
        });

        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            if (isSearching()) {
                return;
            }
            if (change === true) {
                self.storeValue = {value: self.combo.getValue()};
                change = false;
            }
            self.combo.setValue(self.storeValue);
            self.populate();

        });
        this.combo.on(BI.Combo.EVENT_BEFORE_HIDEVIEW, function () {
            if (isSearching()) {
                self.trigger.stopEditing();
                self.fireEvent(BI.MultiTreeCombo.EVENT_CONFIRM);
                return;
            }
            if (isPopupView()) {
                self.trigger.stopEditing();
                self.storeValue = {value: self.combo.getValue()};
                if (clear === true) {
                    self.storeValue = {value: {}};
                    clear = false;
                    change = false;
                }
                self.fireEvent(BI.MultiTreeCombo.EVENT_CONFIRM);
            }
        });

        var triggerBtn = BI.createWidget({
            type: "bi.trigger_icon_button",
            width: o.height,
            height: o.height,
            cls: "multi-select-trigger-icon-button bi-border-left"
        });
        triggerBtn.on(BI.TriggerIconButton.EVENT_CHANGE, function () {
            self.trigger.getCounter().hideView();
            if (self.combo.isViewVisible()) {
                self.combo.hideView();
            } else {
                self.combo.showView();
            }
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.combo,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }, {
                el: triggerBtn,
                right: 0,
                top: 0,
                bottom: 0
            }]
        })
    },

    _defaultState: function () {
        this.trigger.stopEditing();
        this.combo.hideView();
    },

    setValue: function (v) {
        this.storeValue.value = v || {};
        this.combo.setValue({
            value: v || {}
        });
    },

    getValue: function () {
        return this.storeValue.value;
    },

    populate: function () {
        this.combo.populate.apply(this.combo, arguments);
    }
});

BI.MultiTreeCombo.EVENT_CONFIRM = "MultiTreeCombo.EVENT_CONFIRM";

BI.shortcut('bi.multi_tree_combo', BI.MultiTreeCombo);/**
 * 带加载的多选下拉面板
 * @class BI.MultiTreePopup
 * @extends BI.Pane
 */
BI.MultiTreePopup = BI.inherit(BI.Pane, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiTreePopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-multi-tree-popup',
            maxWidth: 'auto',
            minWidth: 100,
            maxHeight: 400,
            onLoaded: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiTreePopup.superclass._init.apply(this, arguments);

        var self = this, opts = this.options;

        this.selectedValues = {};

        this.tree = BI.createWidget({
            type: "bi.async_tree",
            height: 400,
            cls:"popup-view-tree",
            itemsCreator: opts.itemsCreator,
            onLoaded: opts.onLoaded
        });

        this.popupView = BI.createWidget({
            type: "bi.multi_popup_view",
            element: this,
            stopPropagation: false,
            maxWidth: opts.maxWidth,
            minWidth: opts.minWidth,
            maxHeight: opts.maxHeight,
            buttons: [BI.i18nText('BI-Basic_Clears'), BI.i18nText('BI-Basic_Sure')],
            el: this.tree
        });

        this.popupView.on(BI.MultiPopupView.EVENT_CLICK_TOOLBAR_BUTTON, function (index) {
            switch (index) {
                case 0:
                    self.fireEvent(BI.MultiTreePopup.EVENT_CLICK_CLEAR);
                    break;
                case 1:
                    self.fireEvent(BI.MultiTreePopup.EVENT_CLICK_CONFIRM);
                    break;
            }
        });

        this.tree.on(BI.TreeView.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiTreePopup.EVENT_CHANGE);
        });

        this.tree.on(BI.TreeView.EVENT_AFTERINIT, function () {
            self.fireEvent(BI.MultiTreePopup.EVENT_AFTERINIT);
        });

    },

    getValue: function () {
        return this.tree.getValue();
    },

    setValue: function (v) {
        v || (v = {});
        this.tree.setSelectedValue(v.value);
    },

    populate: function (config) {
        this.tree.stroke(config);
    },

    hasChecked: function () {
        return this.tree.hasChecked();
    },

    resetHeight: function (h) {
        this.popupView.resetHeight(h);
    },

    resetWidth: function (w) {
        this.popupView.resetWidth(w);
    }
});

BI.MultiTreePopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.MultiTreePopup.EVENT_CLICK_CONFIRM = "EVENT_CLICK_CONFIRM";
BI.MultiTreePopup.EVENT_CLICK_CLEAR = "EVENT_CLICK_CLEAR";
BI.MultiTreePopup.EVENT_AFTERINIT = "EVENT_AFTERINIT";


BI.shortcut('bi.multi_tree_popup_view', BI.MultiTreePopup);/**
 *
 * 在搜索框中输入文本弹出的面板
 * @class BI.MultiTreeSearchPane
 * @extends BI.Pane
 */

BI.MultiTreeSearchPane = BI.inherit(BI.Pane, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiTreeSearchPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-tree-search-pane bi-card",
            itemsCreator: BI.emptyFn,
            keywordGetter: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiTreeSearchPane.superclass._init.apply(this, arguments);

        var self = this, opts = this.options;

        this.partTree = BI.createWidget({
            type: "bi.part_tree",
            element: this,
            tipText: BI.i18nText("BI-No_Select"),
            itemsCreator: function (op, callback) {
                op.keyword = opts.keywordGetter();
                opts.itemsCreator(op, callback);
            }
        });

        this.partTree.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.partTree.on(BI.TreeView.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiTreeSearchPane.EVENT_CHANGE);
        });
    },

    hasChecked: function () {
        return this.partTree.hasChecked();
    },

    setValue: function (v) {
        v || (v = {});
        this.partTree.setSelectedValue(v.value);
    },

    getValue: function () {
        return this.partTree.getValue();
    },

    empty: function () {
        this.partTree.empty();
    },

    populate: function (op) {
        this.partTree.stroke.apply(this.partTree, arguments);
    }
});

BI.MultiTreeSearchPane.EVENT_CHANGE = "EVENT_CHANGE";

BI.MultiTreeSearchPane.EVENT_CLICK_CONFIRM = "EVENT_CLICK_CONFIRM";
BI.MultiTreeSearchPane.EVENT_CLICK_CLEAR = "EVENT_CLICK_CLEAR";

BI.shortcut("bi.multi_tree_search_pane", BI.MultiTreeSearchPane);/**
 * 查看已选按钮
 * Created by guy on 15/11/3.
 * @class BI.MultiTreeCheckSelectedButton
 * @extends BI.Single
 */
BI.MultiTreeCheckSelectedButton = BI.inherit(BI.Single, {

    _const: {
        checkSelected: BI.i18nText('BI-Check_Selected')
    },

    _defaultConfig: function () {
        return BI.extend(BI.MultiTreeCheckSelectedButton.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-multi-tree-check-selected-button',
            itemsCreator: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiTreeCheckSelectedButton.superclass._init.apply(this, arguments);
        var self = this;
        this.indicator = BI.createWidget({
            type: 'bi.icon_button',
            cls: 'check-font trigger-check-selected',
            width: 15,
            height: 15,
            stopPropagation: true
        });

        this.checkSelected = BI.createWidget({
            type: 'bi.text_button',
            cls: "trigger-check-selected",
            invisible: true,
            hgap: 4,
            text: this._const.checkSelected,
            textAlign: 'center',
            textHeight: 15
        });
        this.checkSelected.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.checkSelected.on(BI.TextButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectCheckSelectedButton.EVENT_CHANGE, arguments);
        });

        BI.createWidget({
            type: "bi.horizontal",
            element: this,
            items: [this.indicator, this.checkSelected]
        })

        this.element.hover(function () {
            self.indicator.setVisible(false);
            self.checkSelected.setVisible(true);
        }, function () {
            self.indicator.setVisible(true);
            self.checkSelected.setVisible(false);
        });
        this.setVisible(false);
    },

    setValue: function (v) {
        v || (v = {});
        this.setVisible(BI.size(v.value) > 0);
    }
});

BI.MultiTreeCheckSelectedButton.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut('bi.multi_tree_check_selected_button', BI.MultiTreeCheckSelectedButton);/**
 * searcher
 * Created by guy on 15/11/3.
 * @class BI.MultiTreeSearcher
 * @extends Widget
 */
BI.MultiTreeSearcher = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiTreeSearcher.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-multi-tree-searcher',
            itemsCreator: BI.emptyFn,
            popup: {},

            adapter: null,
            masker: {}
        });
    },

    _init: function () {
        BI.MultiTreeSearcher.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: 'bi.multi_select_editor',
            height: o.height,
            el: {
                type: "bi.simple_state_editor",
                height: o.height
            }
        });

        this.searcher = BI.createWidget({
            type: "bi.searcher",
            element: this,
            isAutoSearch: false,
            isAutoSync: false,
            onSearch: function (op, callback) {
                callback({
                    keyword: self.editor.getValue()
                });
            },
            el: this.editor,

            popup: BI.extend({
                type: "bi.multi_tree_search_pane",
                keywordGetter: function () {
                    return self.editor.getValue();
                },
                itemsCreator: function (op, callback) {
                    op.keyword = self.editor.getValue();
                    o.itemsCreator(op, callback);
                }
            }, o.popup),

            adapter: o.adapter,
            masker: o.masker
        });
        this.searcher.on(BI.Searcher.EVENT_START, function () {
            self.fireEvent(BI.MultiTreeSearcher.EVENT_START);
        });
        this.searcher.on(BI.Searcher.EVENT_PAUSE, function () {
            if (this.hasMatched()) {

            }
            self.fireEvent(BI.MultiTreeSearcher.EVENT_PAUSE);
        });
        this.searcher.on(BI.Searcher.EVENT_STOP, function () {
            self.fireEvent(BI.MultiTreeSearcher.EVENT_STOP);
        });
        this.searcher.on(BI.Searcher.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiTreeSearcher.EVENT_CHANGE, arguments);
        });
    },

    adjustView: function () {
        this.searcher.adjustView();
    },

    setAdapter: function (adapter) {
        this.searcher.setAdapter(adapter);
    },

    isSearching: function () {
        return this.searcher.isSearching();
    },

    stopSearch: function () {
        this.searcher.stopSearch();
    },

    getKeyword: function () {
        return this.editor.getValue();
    },

    hasMatched: function () {
        return this.searcher.hasMatched();
    },

    hasChecked: function () {
        return this.searcher.getView() && this.searcher.getView().hasChecked();
    },

    setState: function (ob) {
        ob || (ob = {});
        ob.value || (ob.value = []);
        if (ob.type === BI.Selection.All) {
            this.editor.setState(BI.size(ob.value) > 0 ? BI.Selection.Multi : BI.Selection.All);
        } else {
            this.editor.setState(BI.size(ob.value) > 0 ? BI.Selection.Multi : BI.Selection.None);
        }
    },

    setValue: function (ob) {
        this.setState(ob);
        this.searcher.setValue(ob);
    },

    getKey: function () {
        return this.editor.getValue();
    },

    getValue: function () {
        return this.searcher.getValue();
    },

    populate: function (items) {
        this.searcher.populate.apply(this.searcher, arguments);
    }
});

BI.MultiTreeSearcher.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.MultiTreeSearcher.EVENT_CHANGE = "EVENT_CHANGE";
BI.MultiTreeSearcher.EVENT_START = "EVENT_START";
BI.MultiTreeSearcher.EVENT_STOP = "EVENT_STOP";
BI.MultiTreeSearcher.EVENT_PAUSE = "EVENT_PAUSE";
BI.shortcut('bi.multi_tree_searcher', BI.MultiTreeSearcher);//小于号的值为：0，小于等于号的值为:1
//closeMIn：最小值的符号，closeMax：最大值的符号
/**
 * Created by roy on 15/9/17.
 *
 */
BI.NumericalInterval = BI.inherit(BI.Single, {
    constants: {
        typeError: "typeBubble",
        numberError: "numberBubble",
        signalError: "signalBubble",
        editorWidth: 114,
        columns: 5,
        width: 30,
        rows: 1,
        numberErrorCls: "number-error",
        border: 1,
        less: 0,
        less_equal: 1,
        numTip: ""
    },
    _defaultConfig: function () {
        var conf = BI.NumericalInterval.superclass._defaultConfig.apply(this, arguments)
        return BI.extend(conf, {
            extraCls: "bi-numerical-interval",
            height: 25

        })
    },
    _init: function () {
        var self = this, c = this.constants, o = this.options;
        BI.NumericalInterval.superclass._init.apply(this, arguments)
        this.smallEditor = BI.createWidget({
            type: "bi.editor",
            height: o.height - 2,
            watermark: BI.i18nText("BI-Basic_Unrestricted"),
            allowBlank: true,
            value: o.min,
            level: "warning",
            tipType: "warning",
            quitChecker: function () {
                return false;
            },
            validationChecker: function (v) {
                if (!BI.isNumeric(v)) {
                    self.smallEditorBubbleType = c.typeError;
                    return false;
                }
                return true;
            },
            cls: "numerical-interval-small-editor bi-border-top bi-border-bottom bi-border-left"
        });

        this.smallTip = BI.createWidget({
            type: "bi.label",
            text: o.numTip,
            height: o.height - 2,
            invisible: true
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this.smallEditor.element,
            items: [{
                el: this.smallTip,
                top: 0,
                right: 5
            }]
        });

        this.bigEditor = BI.createWidget({
            type: "bi.editor",
            height: o.height - 2,
            watermark: BI.i18nText("BI-Basic_Unrestricted"),
            allowBlank: true,
            value: o.max,
            level: "warning",
            tipType: "warning",
            quitChecker: function () {
                return false;
            },
            validationChecker: function (v) {
                if (!BI.isNumeric(v)) {
                    self.bigEditorBubbleType = c.typeError;
                    return false;
                }
                return true;
            },
            cls: "numerical-interval-big-editor bi-border-top bi-border-bottom bi-border-right"
        });

        this.bigTip = BI.createWidget({
            type: "bi.label",
            text: o.numTip,
            height: o.height - 2,
            invisible: true
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this.bigEditor.element,
            items: [{
                el: this.bigTip,
                top: 0,
                right: 5
            }]
        });

        //this.smallCombo = BI.createWidget({
        //    type: "bi.numerical_interval_combo",
        //    cls: "numerical-interval-small-combo",
        //    height: o.height,
        //    value: o.closemin ? 1 : 0,
        //    offsetStyle: "left"
        //});
        //
        //this.bigCombo = BI.createWidget({
        //    type: "bi.numerical_interval_combo",
        //    cls: "numerical-interval-big-combo",
        //    height: o.height,
        //    value: o.closemax ? 1 : 0,
        //    offsetStyle: "left"
        //});
        this.smallCombo = BI.createWidget({
            type: "bi.icon_combo",
            cls: "numerical-interval-small-combo bi-border",
            height: o.height - 2,
            items: [{
                text: "(" + BI.i18nText("BI-Less_Than") + ")",
                iconClass: "less-font",
                value: 0
            }, {
                text: "(" + BI.i18nText("BI-Less_And_Equal") + ")",
                value: 1,
                iconClass: "less-equal-font"
            }]
        });
        if (o.closemin === true) {
            this.smallCombo.setValue(1);
        } else {
            this.smallCombo.setValue(0);
        }
        this.bigCombo = BI.createWidget({
            type: "bi.icon_combo",
            cls: "numerical-interval-big-combo bi-border",
            height: o.height - 2,
            items: [{
                text: "(" + BI.i18nText("BI-Less_Than") + ")",
                iconClass: "less-font",
                value: 0
            }, {
                text: "(" + BI.i18nText("BI-Less_And_Equal") + ")",
                value: 1,
                iconClass: "less-equal-font"
            }]
        });
        if (o.closemax === true) {
            this.bigCombo.setValue(1);
        } else {
            this.bigCombo.setValue(0);
        }
        this.label = BI.createWidget({
            type: "bi.label",
            text: BI.i18nText("BI-Basic_Value"),
            textHeight: o.height - c.border * 2,
            width: c.width - c.border * 2,
            height: o.height - c.border * 2,
            level: "warning",
            tipType: "warning"
        });
        this.left = BI.createWidget({
            type: "bi.htape",
            items: [{
                el: self.smallEditor
            }, {
                el: self.smallCombo,
                width: c.width - c.border * 2
            }]

        });
        this.right = BI.createWidget({
            type: "bi.htape",
            items: [{
                el: self.bigCombo,
                width: c.width - c.border * 2
            }, {
                el: self.bigEditor
            }]
        });


        BI.createWidget({
            element: self,
            type: "bi.center",
            hgap: 15,
            height: o.height,
            items: [
                {
                    type: "bi.absolute",
                    items: [{
                        el: self.left,
                        left: -15,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }]
                }, {
                    type: "bi.absolute",
                    items: [{
                        el: self.right,
                        left: 0,
                        right: -15,
                        top: 0,
                        bottom: 0
                    }]
                }
            ]
        });

        BI.createWidget({
            element: self,
            type: "bi.horizontal_auto",
            items: [
                self.label
            ]
        });


        self._setValidEvent(self.bigEditor, c.bigEditor);
        self._setValidEvent(self.smallEditor, c.smallEditor);
        self._setErrorEvent(self.bigEditor, c.bigEditor);
        self._setErrorEvent(self.smallEditor, c.smallEditor);
        self._setBlurEvent(self.bigEditor);
        self._setBlurEvent(self.smallEditor);
        self._setFocusEvent(self.bigEditor);
        self._setFocusEvent(self.smallEditor);
        self._setComboValueChangedEvent(self.bigCombo);
        self._setComboValueChangedEvent(self.smallCombo);
        self._setEditorValueChangedEvent(self.bigEditor);
        self._setEditorValueChangedEvent(self.smallEditor);
    },

    _checkValidation: function () {
        var self = this, c = this.constants, o = this.options;
        self._setTitle("");
        BI.Bubbles.hide(c.typeError);
        BI.Bubbles.hide(c.numberError);
        BI.Bubbles.hide(c.signalError);
        if (!self.smallEditor.isValid() || !self.bigEditor.isValid()) {
            self.element.removeClass("number-error");
            o.validation = "invalid";
            return c.typeError;
        } else {
            if (BI.isEmptyString(self.smallEditor.getValue()) || BI.isEmptyString(self.bigEditor.getValue())) {
                self.element.removeClass("number-error");
                o.validation = "valid";
                return "";
            } else {
                var smallValue = parseFloat(self.smallEditor.getValue()), bigValue = parseFloat(self.bigEditor.getValue()),
                    bigComboValue = self.bigCombo.getValue(), smallComboValue = self.smallCombo.getValue();
                if (bigComboValue[0] === c.less_equal && smallComboValue[0] === c.less_equal) {
                    if (smallValue > bigValue) {
                        self.element.addClass("number-error");
                        o.validation = "invalid";
                        return c.numberError;
                    } else {
                        self.element.removeClass("number-error");
                        o.validation = "valid";
                        return "";
                    }
                } else {
                    if (smallValue > bigValue) {
                        self.element.addClass("number-error");
                        o.validation = "invalid";
                        return c.numberError;
                    } else if (smallValue === bigValue) {
                        self.element.addClass("number-error");
                        o.validation = "invalid";
                        return c.signalError;
                    } else {
                        self.element.removeClass("number-error");
                        o.validation = "valid";
                        return "";
                    }
                }
            }

        }
    },

    _setTitle: function (v) {
        var self = this;
        self.bigEditor.setTitle(v);
        self.smallEditor.setTitle(v);
        self.label.setTitle(v);
    },

    _setFocusEvent: function (w) {
        var self = this, c = this.constants;
        w.on(BI.Editor.EVENT_FOCUS, function () {
            self._setTitle("");
            switch (self._checkValidation()) {
                case c.typeError:
                    BI.Bubbles.show(c.typeError, BI.i18nText("BI-Numerical_Interval_Input_Data"), self, {
                        offsetStyle: "center"
                    });
                    break;
                case c.numberError:
                    BI.Bubbles.show(c.numberError, BI.i18nText("BI-Numerical_Interval_Number_Value"), self, {
                        offsetStyle: "center"
                    });
                    break;
                case c.signalError:
                    BI.Bubbles.show(c.signalError, BI.i18nText("BI-Numerical_Interval_Signal_Value"), self, {
                        offsetStyle: "center"
                    });
                    break;
                default :
                    return
            }

        })
    },
    _setBlurEvent: function (w) {
        var c = this.constants, self = this;
        w.on(BI.Editor.EVENT_BLUR, function () {
            BI.Bubbles.hide(c.typeError);
            BI.Bubbles.hide(c.numberError);
            BI.Bubbles.hide(c.signalError);
            switch (self._checkValidation()) {
                case c.typeError:
                    self._setTitle(BI.i18nText("BI-Numerical_Interval_Input_Data"));
                    break;
                case c.numberError:
                    self._setTitle(BI.i18nText("BI-Numerical_Interval_Number_Value"));
                    break;
                case c.signalError:
                    self._setTitle(BI.i18nText("BI-Numerical_Interval_Signal_Value"));
                    break;
                default:
                    self._setTitle("");
            }
        })
    },

    _setErrorEvent: function (w) {
        var c = this.constants, self = this
        w.on(BI.Editor.EVENT_ERROR, function () {
            self._checkValidation();
            BI.Bubbles.show(c.typeError, BI.i18nText("BI-Numerical_Interval_Input_Data"), self, {
                offsetStyle: "center"
            });
            self.fireEvent(BI.NumericalInterval.EVENT_ERROR);
        })
    },


    _setValidEvent: function (w) {
        var self = this, c = this.constants;
        w.on(BI.Editor.EVENT_VALID, function () {
            switch (self._checkValidation()) {
                case c.numberError:
                    BI.Bubbles.show(c.numberError, BI.i18nText("BI-Numerical_Interval_Number_Value"), self, {
                        offsetStyle: "center"
                    });
                    self.fireEvent(BI.NumericalInterval.EVENT_ERROR);
                    break;
                case c.signalError:
                    BI.Bubbles.show(c.signalError, BI.i18nText("BI-Numerical_Interval_Signal_Value"), self, {
                        offsetStyle: "center"
                    });
                    self.fireEvent(BI.NumericalInterval.EVENT_ERROR);
                    break;
                default:
                    self.fireEvent(BI.NumericalInterval.EVENT_VALID);
            }
        })
    },


    _setEditorValueChangedEvent: function (w) {
        var self = this, c = this.constants;
        w.on(BI.Editor.EVENT_CHANGE, function () {
            switch (self._checkValidation()) {
                case c.typeError:
                    BI.Bubbles.show(c.typeError, BI.i18nText("BI-Numerical_Interval_Input_Data"), self, {
                        offsetStyle: "center"
                    });
                    break;
                case c.numberError:
                    BI.Bubbles.show(c.numberError, BI.i18nText("BI-Numerical_Interval_Number_Value"), self, {
                        offsetStyle: "center"
                    });
                    break;
                case c.signalError:
                    BI.Bubbles.show(c.signalError, BI.i18nText("BI-Numerical_Interval_Signal_Value"), self, {
                        offsetStyle: "center"
                    });
                    break;
                default :
                    break;
            }
            self.fireEvent(BI.NumericalInterval.EVENT_CHANGE);
        });
    },

    _setComboValueChangedEvent: function (w) {
        var self = this, c = this.constants;
        w.on(BI.IconCombo.EVENT_CHANGE, function () {
            switch (self._checkValidation()) {
                case c.typeError:
                    self._setTitle(BI.i18nText("BI-Numerical_Interval_Input_Data"));
                    self.fireEvent(BI.NumericalInterval.EVENT_ERROR);
                    break;
                case c.numberError:
                    self._setTitle(BI.i18nText("BI-Numerical_Interval_Number_Value"));
                    self.fireEvent(BI.NumericalInterval.EVENT_ERROR);
                    break;
                case c.signalError:
                    self._setTitle(BI.i18nText("BI-Numerical_Interval_Signal_Value"));
                    self.fireEvent(BI.NumericalInterval.EVENT_ERROR);
                    break;
                default :
                    self.fireEvent(BI.NumericalInterval.EVENT_CHANGE);
                    self.fireEvent(BI.NumericalInterval.EVENT_VALID);
            }
        })
    },


    isValid: function () {
        return this.options.validation === "valid";
    },

    setMinEnable: function (b) {
        this.smallEditor.setEnable(b);
    },

    setCloseMinEnable: function (b) {
        this.smallCombo.setEnable(b);
    },

    setMaxEnable: function (b) {
        this.bigEditor.setEnable(b);
    },

    setCloseMaxEnable: function (b) {
        this.bigCombo.setEnable(b);
    },

    showNumTip: function () {
        this.smallTip.setVisible(true);
        this.bigTip.setVisible(true);
    },

    hideNumTip: function () {
        this.smallTip.setVisible(false);
        this.bigTip.setVisible(false);
    },

    setNumTip: function(numTip) {
        this.smallTip.setText(numTip);
        this.bigTip.setText(numTip);
    },

    getNumTip: function() {
        return this.smallTip.getText();
    },

    setValue: function (data) {
        data = data || {};
        var self = this, combo_value;
        if (BI.isNumeric(data.min) || BI.isEmptyString(data.min)) {
            self.smallEditor.setValue(data.min);
        }

        if (!BI.isNotNull(data.min)) {
            self.smallEditor.setValue("");
        }

        if (BI.isNumeric(data.max) || BI.isEmptyString(data.max)) {
            self.bigEditor.setValue(data.max);
        }

        if (!BI.isNotNull(data.max)) {
            self.bigEditor.setValue("");
        }

        if (!BI.isNull(data.closemin)) {
            if (data.closemin === true) {
                combo_value = 1
            } else {
                combo_value = 0
            }
            self.smallCombo.setValue(combo_value);
        }

        if (!BI.isNull(data.closemax)) {
            if (data.closemax === true) {
                combo_value = 1
            } else {
                combo_value = 0
            }
            self.bigCombo.setValue(combo_value);
        }
    },


    getValue: function () {
        var self = this, value = {}, minComboValue = self.smallCombo.getValue(), maxComboValue = self.bigCombo.getValue();
        value.min = self.smallEditor.getValue();
        value.max = self.bigEditor.getValue();
        if (minComboValue[0] === 0) {
            value.closemin = false
        } else {
            value.closemin = true
        }

        if (maxComboValue[0] === 0) {
            value.closemax = false
        } else {
            value.closemax = true
        }
        return value;
    }
});
BI.NumericalInterval.EVENT_CHANGE = "EVENT_CHANGE";
BI.NumericalInterval.EVENT_VALID = "EVENT_VALID";
BI.NumericalInterval.EVENT_ERROR = "EVENT_ERROR";
BI.shortcut("bi.numerical_interval", BI.NumericalInterval);/**
 *
 * 表格
 *
 * Created by GUY on 2015/9/22.
 * @class BI.PageTableCell
 * @extends BI.Single
 */
BI.PageTableCell = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.PageTableCell.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-page-table-cell",
            text: "",
            title: ""
        })
    },

    _init: function () {
        BI.PageTableCell.superclass._init.apply(this, arguments);
        var label = BI.createWidget({
            type: "bi.label",
            element: this,
            textAlign: "left",
            whiteSpace: "nowrap",
            height: this.options.height,
            text: this.options.text,
            title: this.options.title,
            value: this.options.value,
            lgap: 5,
            rgap: 5
        });

        if (BI.isNotNull(this.options.styles) && BI.isObject(this.options.styles)) {
            this.element.css(this.options.styles);
        }
    }
});

BI.shortcut("bi.page_table_cell", BI.PageTableCell);/**
 * 分页表格
 *
 * Created by GUY on 2016/2/15.
 * @class BI.PageTable
 * @extends BI.Widget
 */
BI.PageTable = BI.inherit(BI.Widget, {

    _const: {
        scrollWidth: 18,
        minScrollWidth: 100
    },

    _defaultConfig: function () {
        return BI.extend(BI.PageTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-page-table",
            el: {
                type: "bi.sequence_table"
            },
            pager: {
                horizontal: {
                    pages: false, //总页数
                    curr: 1, //初始化当前页， pages为数字时可用

                    hasPrev: BI.emptyFn,
                    hasNext: BI.emptyFn,
                    firstPage: 1,
                    lastPage: BI.emptyFn
                },
                vertical: {
                    pages: false, //总页数
                    curr: 1, //初始化当前页， pages为数字时可用

                    hasPrev: BI.emptyFn,
                    hasNext: BI.emptyFn,
                    firstPage: 1,
                    lastPage: BI.emptyFn
                }
            },

            itemsCreator: BI.emptyFn,

            isNeedFreeze: false,//是否需要冻结单元格
            freezeCols: [], //冻结的列号,从0开始,isNeedFreeze为true时生效

            isNeedMerge: false,//是否需要合并单元格
            mergeCols: [], //合并的单元格列号
            mergeRule: BI.emptyFn,

            columnSize: [],
            minColumnSize: [],
            maxColumnSize: [],
            headerRowSize: 25,
            rowSize: 25,

            regionColumnSize: [],

            headerCellStyleGetter: BI.emptyFn,
            summaryCellStyleGetter: BI.emptyFn,
            sequenceCellStyleGetter: BI.emptyFn,

            header: [],
            items: [], //二维数组

            //交叉表头
            crossHeader: [],
            crossItems: []
        });
    },

    _init: function () {
        BI.PageTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.hCurr = 1;
        this.vCurr = 1;

        this.table = BI.createWidget(o.el, {
            type: "bi.sequence_table",
            width: o.width,
            height: o.height && o.height - 30,

            isNeedResize: true,
            isResizeAdapt: false,

            isNeedFreeze: o.isNeedFreeze,
            freezeCols: o.freezeCols,

            isNeedMerge: o.isNeedMerge,
            mergeCols: o.mergeCols,
            mergeRule: o.mergeRule,

            columnSize: o.columnSize,
            minColumnSize: o.minColumnSize,
            maxColumnSize: o.maxColumnSize,
            headerRowSize: o.headerRowSize,
            rowSize: o.rowSize,

            regionColumnSize: o.regionColumnSize,

            headerCellStyleGetter: o.headerCellStyleGetter,
            summaryCellStyleGetter: o.summaryCellStyleGetter,
            sequenceCellStyleGetter: o.sequenceCellStyleGetter,

            header: o.header,
            items: o.items,
            //交叉表头
            crossHeader: o.crossHeader,
            crossItems: o.crossItems
        });

        this.table.on(BI.Table.EVENT_TABLE_SCROLL, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, function () {
            o.regionColumnSize = this.getRegionColumnSize();
            o.columnSize = this.getColumnSize();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, function () {
            o.regionColumnSize = this.getRegionColumnSize();
            o.columnSize = this.getColumnSize();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, arguments);
        });

        this.pager = BI.createWidget(o.pager, {
            type: "bi.direction_pager",
            height: 30
        });
        this.pager.on(BI.Pager.EVENT_CHANGE, function () {
            var vpage = this.getVPage && this.getVPage();
            if (BI.isNull(vpage)) {
                vpage = this.getCurrentPage();
            }
            var hpage = this.getHPage && this.getHPage();
            o.itemsCreator({
                vpage: vpage,
                hpage: hpage
            }, function (items, header, crossItems, crossHeader) {
                self.table.setVPage ? self.table.setVPage(vpage) : self.table.setValue(vpage);
                self.table.setHPage && self.table.setHPage(hpage);
                self.populate.apply(self, arguments);
            });
        });

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.table,
                left: 0,
                top: 0
            }, {
                el: this.pager,
                left: 0,
                right: 0,
                bottom: 0
            }]
        })
    },

    setHPage: function (v) {
        this.hCurr = v;
        this.pager.setHPage && this.pager.setHPage(v);
        this.table.setHPage && this.table.setHPage(v);
    },

    setVPage: function (v) {
        this.vCurr = v;
        this.pager.setVPage && this.pager.setVPage(v);
        this.table.setVPage && this.table.setVPage(v);
    },

    getHPage: function () {
        var hpage = this.pager.getHPage && this.pager.getHPage();
        if (BI.isNotNull(hpage)) {
            return hpage;
        }
        hpage = this.pager.getCurrentPage && this.pager.getCurrentPage();
        if (BI.isNotNull(hpage)) {
            return hpage;
        }
        return this.hpage;
    },

    getVPage: function () {
        var vpage = this.pager.getVPage && this.pager.getVPage();
        if (BI.isNotNull(vpage)) {
            return vpage;
        }
        vpage = this.pager.getCurrentPage && this.pager.getCurrentPage();
        if (BI.isNotNull(vpage)) {
            return vpage;
        }
        return this.vpage;
    },

    setWidth: function (width) {
        BI.PageTable.superclass.setWidth.apply(this, arguments);
        this.table.setWidth(width);
    },

    setHeight: function (height) {
        BI.PageTable.superclass.setHeight.apply(this, arguments);
        var showPager = false;
        if (this.pager.alwaysShowPager) {
            showPager = true;
        } else if (this.pager.hasHNext && this.pager.hasHNext()) {
            showPager = true;
        } else if (this.pager.hasHPrev && this.pager.hasHPrev()) {
            showPager = true;
        } else if (this.pager.hasVNext && this.pager.hasVNext()) {
            showPager = true;
        } else if (this.pager.hasVPrev && this.pager.hasVPrev()) {
            showPager = true;
        } else if (this.pager.hasNext && this.pager.hasNext()) {
            showPager = true;
        } else if (this.pager.hasPrev && this.pager.hasPrev()) {
            showPager = true;
        }
        this.table.setHeight(height - (showPager ? 30 : 0));
    },

    setColumnSize: function (columnSize) {
        this.options.columnSize = columnSize;
        this.table.setColumnSize(columnSize);
    },

    getColumnSize: function () {
        return this.table.getColumnSize();
    },

    setRegionColumnSize: function (columnSize) {
        this.options.columnSize = columnSize;
        this.table.setRegionColumnSize(columnSize);
    },

    getRegionColumnSize: function () {
        return this.table.getRegionColumnSize();
    },

    getVerticalScroll: function () {
        return this.table.getVerticalScroll();
    },

    setLeftHorizontalScroll: function (scrollLeft) {
        this.table.setLeftHorizontalScroll(scrollLeft);
    },

    setRightHorizontalScroll: function (scrollLeft) {
        this.table.setRightHorizontalScroll(scrollLeft);
    },

    setVerticalScroll: function (scrollTop) {
        this.table.setVerticalScroll(scrollTop);
    },

    restore: function () {
        this.table.restore();
    },

    attr: function () {
        BI.PageTable.superclass.attr.apply(this, arguments);
        this.table.attr.apply(this.table, arguments);
    },

    populate: function () {
        this.pager.populate();
        this.table.populate.apply(this.table, arguments);
    },

    destroy: function () {
        this.table.destroy();
        this.pager && this.pager.destroy();
        BI.PageTable.superclass.destroy.apply(this, arguments);
    }
});
BI.shortcut('bi.page_table', BI.PageTable);/**
 * 路径选择
 *
 * Created by GUY on 2015/12/4.
 * @class BI.PathChooser
 * @extends BI.Widget
 */
BI.PathChooser = BI.inherit(BI.Widget, {

    _const: {
        lineColor: "#c4c6c6",
        selectLineColor: "#009de3"
    },

    _defaultConfig: function () {
        return BI.extend(BI.PathChooser.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-path-chooser",
            items: []
        })
    },

    _init: function () {
        BI.PathChooser.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _createRegions: function (regions) {
        var self = this;
        this.regions = BI.createWidgets(BI.map(regions, function (i, region) {
            return {
                type: "bi.path_region",
                title: self.texts[region] || region
            }
        }));
        this.regionMap = {};
        BI.each(regions, function (i, region) {
            self.regionMap[region] = i;
        });
        this.container = BI.createWidget({
            type: "bi.horizontal",
            verticalAlign: "top",
            scrollx: false,
            scrolly: false,
            hgap: 10,
            items: this.regions
        });
        BI.createWidget({
            type: "bi.vertical_adapt",
            element: this,
            scrollable: true,
            hgap: 10,
            items: [this.container]
        });
    },

    getRegionIndexById: function (id) {
        var node = this.store[id];
        var regionType = node.get("region");
        return this.regionMap[regionType];
    },

    _drawPath: function (start, offset, index) {
        var self = this;
        var starts = [];
        if (BI.contains(this.start, start)) {
            starts = this.start;
        } else {
            starts = [start];
        }

        BI.each(starts, function (i, s) {
            BI.each(self.radios[s], function (i, rad) {
                rad.setSelected(false);
            });
            BI.each(self.lines[s], function (i, line) {
                line.attr("stroke", self._const.lineColor);
            });
            BI.each(self.regionIndexes[s], function (i, idx) {
                self.regions[idx].reset();
            });
        });

        BI.each(this.routes[start][index], function (i, id) {
            var regionIndex = self.getRegionIndexById(id);
            self.regions[regionIndex].setSelect(offset + index, id);
        });
        var current = BI.last(this.routes[start][index]);

        while (current && this.routes[current] && this.routes[current].length === 1) {
            BI.each(this.routes[current][0], function (i, id) {
                var regionIndex = self.getRegionIndexById(id);
                self.regions[regionIndex].setSelect(0, id);
            });
            this.lines[current][0].attr("stroke", self._const.selectLineColor).toFront();
            current = BI.last(this.routes[current][0]);
        }
        this.lines[start][index].attr("stroke", self._const.selectLineColor).toFront();
        this.radios[start] && this.radios[start][index] && this.radios[start][index].setSelected(true);
    },

    _drawRadio: function (start, offset, index, x, y) {
        var self = this;
        var radio = BI.createWidget({
            type: "bi.radio",
            cls: "path-chooser-radio",
            selected: offset + index === 0,
            start: start,
            index: index
        });
        radio.on(BI.Radio.EVENT_CHANGE, function () {
            self._drawPath(start, offset, index);
            self.fireEvent(BI.PathChooser.EVENT_CHANGE, start, index);
        });
        if (!this.radios[start]) {
            this.radios[start] = [];
        }
        this.radios[start].push(radio);
        BI.createWidget({
            type: "bi.absolute",
            element: this.container,
            items: [{
                el: radio,
                left: x - 6.5,
                top: y - 6.5
            }]
        })
    },

    _drawLine: function (start, lines) {
        var self = this;
        if (!this.lines[start]) {
            this.lines[start] = [];
        }
        if (!this.pathes[start]) {
            this.pathes[start] = [];
        }
        var startRegionIndex = this.getRegionIndexById(start);
        //start所在的位置，然后接着往下画其他的路径
        var offset = this.regions[startRegionIndex].getIndexByValue(start);
        BI.each(lines, function (i, line) {
            self.pathes[start][i] = [];
            var idx = i + offset;
            var path = "";
            var stop = 47.5 + 29 * idx;
            var sleft = 50 + 100 * startRegionIndex;
            var radioStartX = sleft, radioStartY = stop;
            var etop = stop;
            var endRegionIndex = self.getRegionIndexById(BI.last(line));
            var endOffset = self.regions[endRegionIndex].getIndexByValue(BI.last(line));
            var eleft = 50 + 100 * endRegionIndex;
            if (BI.contains(self.start, start)) {
                radioStartX = sleft - 50;
                path += "M" + (sleft - 50) + "," + stop;
                self.pathes[start][i].push({
                    x: sleft - 50,
                    y: stop
                })
            } else if (idx === 0) {
                radioStartX = sleft + 50;
                path += "M" + sleft + "," + stop;
                self.pathes[start][i].push({
                    x: sleft,
                    y: stop
                })
            } else {
                radioStartX = sleft + 50;
                path += "M" + sleft + "," + 47.5 + "L" + (sleft + 50) + "," + 47.5 + "L" + (sleft + 50) + "," + stop;
                self.pathes[start][i].push({
                    x: sleft,
                    y: 47.5
                });
                self.pathes[start][i].push({
                    x: sleft + 50,
                    y: 47.5
                });
                self.pathes[start][i].push({
                    x: sleft + 50,
                    y: stop
                });
            }
            if (idx > 0) {
                var endY = endOffset * 29 + 47.5;
                path += "L" + (eleft - 50) + "," + etop + "L" + (eleft - 50) + "," + endY + "L" + eleft + "," + endY;
                self.pathes[start][i].push({
                    x: eleft - 50,
                    y: etop
                });
                self.pathes[start][i].push({
                    x: eleft - 50,
                    y: endY
                });
                self.pathes[start][i].push({
                    x: eleft,
                    y: endY
                });
            } else {
                path += "L" + eleft + "," + etop;
                self.pathes[start][i].push({
                    x: eleft,
                    y: etop
                });
            }

            var graph = self.svg.path(path)
                .attr({
                    stroke: idx === 0 ? self._const.selectLineColor : self._const.lineColor,
                    'stroke-dasharray': '-'
                });
            self.lines[start].push(graph);
            if (lines.length > 1) {
                self.lines[start][0].toFront();
            }
            //第一个元素无论有多少个都要显示radio
            if (BI.contains(self.start, start)) {
                self.lines[self.regions[0].getValueByIndex(0)][0].toFront();
            }
            if (lines.length > 1 || BI.contains(self.start, start)) {
                self._drawRadio(start, offset, i, radioStartX, radioStartY);
            }
        });
    },

    _drawLines: function (routes) {
        var self = this;
        this.lines = {};
        this.pathes = {};
        this.radios = {};
        this.regionIndexes = {};
        BI.each(routes, function (k, route) {
            if (!self.regionIndexes[k]) {
                self.regionIndexes[k] = [];
            }
            BI.each(route, function (i, rs) {
                BI.each(rs, function (j, id) {
                    var regionIndex = self.getRegionIndexById(id);
                    if (!BI.contains(self.regionIndexes[k], regionIndex)) {
                        self.regionIndexes[k].push(regionIndex);
                    }
                });
            })
        });
        BI.each(routes, function (k, route) {
            self._drawLine(k, route);
        });
    },

    _pushNodes: function (nodes) {
        var self = this;
        var indexes = [];
        for (var i = 0; i < nodes.length; i++) {
            var id = nodes[i];
            var index = self.getRegionIndexById(id);
            indexes.push(index);
            var region = self.regions[index];
            if (i === nodes.length - 1) {
                if (!region.hasItem(id)) {
                    region.addItem(id, self.texts[id]);
                }
                break;
            }
            if (i > 0 || BI.contains(self.start, id)) {
                region.addItem(id, self.texts[id]);
            }
        }
        for (var i = BI.first(indexes); i < BI.last(indexes); i++) {
            if (!BI.contains(indexes, i)) {
                self.regions[i].addItem("");
            }
        }
    },

    _createNodes: function () {
        var self = this, o = this.options;
        this.store = {};
        this.texts = {};
        this.start = [];
        this.end = [];
        BI.each(o.items, function (i, item) {
            self.start.push(BI.first(item).value);
            self.end.push(BI.last(item).value);
        });
        this.start = BI.uniq(this.start);
        this.end = BI.uniq(this.end);
        var regions = [];
        var tree = new BI.Tree();
        var branches = {}, max = 0;
        BI.each(o.items, function (i, items) {
            BI.each(items, function (j, item) {
                if (!BI.has(branches, item.value)) {
                    branches[item.value] = 0;
                }
                branches[item.value]++;
                max = Math.max(max, branches[item.value]);
                var prev = {};
                if (j > 0) {
                    prev = items[j - 1];
                }
                var parent = self.store[prev.value || ""];
                var node = self.store[item.value] || new BI.Node(item.value);
                node.set(item);
                self.store[item.value] = node;
                self.texts[item.value] = item.text;
                self.texts[item.region] = item.regionText;
                parent = BI.isNull(parent) ? tree.getRoot() : parent;
                if (parent.getChildIndex(item.value) === -1) {
                    tree.addNode(parent, node);
                }
            })
        });

        //算出区域列表
        tree.traverse(function (node) {
            BI.each(node.getChildren(), function (i, child) {
                if (BI.contains(regions, child.get("region"))) {
                    var index1 = BI.indexOf(regions, node.get("region"));
                    var index2 = BI.indexOf(regions, child.get("region"));
                    //交换区域
                    if (index1 > index2) {
                        var t = regions[index2];
                        for (var j = index2; j < index1; j++) {
                            regions[j] = regions[j + 1];
                        }
                        regions[index1] = t;
                    }
                } else {
                    regions.push(child.get("region"));
                }
            });
        });
        this._createRegions(regions);

        //算出节点
        BI.each(branches, function (k, branch) {
            if (branch < max) {
                delete branches[k];
            }
        });

        //过滤节点
        var nodes = [];
        var n = tree.getRoot();
        while (n && n.getChildrenLength() === 1) {
            if (BI.has(branches, n.getChildren()[0].id)) {
                delete branches[n.getChildren()[0].id];
                n = n.getChildren()[0];
            } else {
                n = null;
            }
        }
        tree.traverse(function (node) {
            if (BI.has(branches, node.id)) {
                nodes.push(node.id);
                delete branches[node.id];
            }
        });

        //填充节点
        var routes = {};
        var s, e;
        for (var i = 0, len = nodes.length; i < len + 1; i++) {
            if (len === 0) {
                s = [];
                BI.each(this.start, function (i, id) {
                    s.push(tree.search(id));
                });
                e = [];
                BI.each(this.end, function (i, id) {
                    e.push(tree.search(id));
                });
            } else if (i === len) {
                s = e;
                e = [];
                BI.each(this.end, function (i, id) {
                    e.push(tree.search(id));
                });
            } else if (i === 0) {
                s = [];
                BI.each(this.start, function (i, id) {
                    s.push(tree.search(id));
                });
                e = [tree.search(nodes[i])];
            } else {
                s = [tree.search(e[0] || tree.getRoot(), nodes[i - 1])];
                e = [tree.search(s[0], nodes[i])];
            }
            BI.each(s, function (i, n) {
                tree._recursion(n, [n.id], function (node, route) {
                    if (BI.contains(e, node)) {
                        if (!routes[n.id]) {
                            routes[n.id] = [];
                        }
                        routes[n.id].push(route);
                        self._pushNodes(route);
                        if (e.length <= 1) {
                            return true;
                        }
                    }
                })
            });
        }
        this.routes = routes;
        this._drawLines(routes);
    },

    _unselectAllPath: function () {
        var self = this;
        BI.each(this.radios, function (idx, rad) {
            BI.each(rad, function (i, r) {
                r.setSelected(false);
            });
        });
        BI.each(this.lines, function (idx, line) {
            BI.each(line, function (i, li) {
                li.attr("stroke", self._const.lineColor);
            });
        });
        BI.each(this.regions, function (idx, region) {
            region.reset();
        });
    },

    populate: function (items) {
        this.options.items = items || [];
        var self = this;
        this.empty();
        if (this.options.items.length <= 0) {
            return;
        }
        this.svg = BI.createWidget({
            type: "bi.svg"
        });
        this._createNodes();
        BI.createWidget({
            type: "bi.absolute",
            element: this.container,
            items: [{
                el: this.svg,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }]
        });
    },

    setValue: function (v) {
        this._unselectAllPath();
        var nodes = BI.keys(this.routes), self = this;
        var result = [], array = [];
        BI.each(v, function (i, val) {
            if (BI.contains(nodes, val)) {
                if (array.length > 0) {
                    array.push(val);
                    result.push(array);
                    array = [];
                }
            }
            array.push(val);
        });
        if (array.length > 0) {
            result.push(array);
        }
        //画这n条路径
        BI.each(result, function (idx, path) {
            var start = path[0];
            var index = BI.findIndex(self.routes[start], function (idx, p) {
                if (BI.isEqual(path, p)) {
                    return true;
                }
            });
            if (index >= 0) {
                var startRegionIndex = self.getRegionIndexById(start);
                var offset = self.regions[startRegionIndex].getIndexByValue(start);
                self._drawPath(start, offset, index);
            }
        });
    },

    getValue: function () {
        var path = [];
        BI.each(this.regions, function (i, region) {
            var val = region.getValue();
            if (BI.isKey(val)) {
                path.push(val);
            }
        });
        return path;
    }
});
BI.PathChooser.EVENT_CHANGE = "PathChooser.EVENT_CHANGE";
BI.shortcut("bi.path_chooser", BI.PathChooser);/**
 * 路径选择区域
 *
 * Created by GUY on 2015/12/4.
 * @class BI.PathRegion
 * @extends BI.Widget
 */
BI.PathRegion = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.PathRegion.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-path-region bi-background",
            width: 80,
            title: ""
        })
    },

    _init: function () {
        BI.PathRegion.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.zIndex = 100;
        var title = BI.createWidget({
            type: "bi.label",
            text: o.title,
            title: o.title,
            height: 30
        });
        title.element.css("zIndex", this.zIndex--);
        this.items = [];
        this.vertical = BI.createWidget({
            type: "bi.vertical",
            element: this,
            bgap: 5,
            hgap: 10,
            items: [title]
        })
    },

    hasItem: function (val) {
        return BI.any(this.items, function (i, item) {
            return val === item.getValue();
        });
    },

    addItem: function (value, text) {
        if (BI.isKey(value)) {
            var label = BI.createWidget({
                type: "bi.label",
                cls: "path-region-label bi-card bi-border bi-list-item-select",
                text: text,
                value: value,
                title: text || value,
                height: 22
            });
        } else {
            var label = BI.createWidget({
                type: "bi.layout",
                height: 24
            });
        }
        label.element.css("zIndex", this.zIndex--);
        this.items.push(label);
        this.vertical.addItem(label);
        if (this.items.length === 1) {
            this.setSelect(0, value);
        }
    },

    reset: function () {
        BI.each(this.items, function (i, item) {
            item.element.removeClass("active");
        });
    },

    setSelect: function (index, value) {
        this.reset();
        if (this.items.length <= 0) {
            return;
        }
        if (this.items.length === 1) {
            this.items[0].element.addClass("active");
            return;
        }
        if (this.items[index].attr("value") === value) {
            this.items[index].element.addClass("active");
        }
    },

    setValue: function (value) {
        this.setSelect(this.getIndexByValue(value), value);
    },

    getValueByIndex: function (idx) {
        return this.items[idx].attr("value");
    },

    getIndexByValue: function (value) {
        return BI.findIndex(this.items, function (i, item) {
            return item.attr("value") === value;
        });
    },

    getValue: function () {
        var res;
        BI.any(this.items, function (i, item) {
            if (item.element.hasClass("active")) {
                res = item.getValue();
                return true;
            }
        });
        return res;
    }
});
BI.PathRegion.EVENT_CHANGE = "PathRegion.EVENT_CHANGE";
BI.shortcut("bi.path_region", BI.PathRegion);/**
 * 预览表列
 *
 * Created by GUY on 2015/12/25.
 * @class BI.PreviewTableCell
 * @extends BI.Widget
 */
BI.PreviewTableCell = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.PreviewTableCell.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-preview-table-cell",
            text: ""
        });
    },

    _init: function () {
        BI.PreviewTableCell.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        BI.createWidget({
            type: "bi.label",
            element: this,
            textAlign: "left",
            whiteSpace: "normal",
            height: this.options.height,
            text: this.options.text,
            value: this.options.value
        })
    }
});
BI.shortcut('bi.preview_table_cell', BI.PreviewTableCell);/**
 * 预览表
 *
 * Created by GUY on 2015/12/25.
 * @class BI.PreviewTableHeaderCell
 * @extends BI.Widget
 */
BI.PreviewTableHeaderCell = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.PreviewTableHeaderCell.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-preview-table-header-cell",
            text: ""
        });
    },

    _init: function () {
        BI.PreviewTableHeaderCell.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        BI.createWidget({
            type: "bi.label",
            element: this,
            textAlign: "left",
            whiteSpace: "normal",
            height: this.options.height,
            text: this.options.text,
            value: this.options.value
        })
    }
});
BI.shortcut('bi.preview_table_header_cell', BI.PreviewTableHeaderCell);/**
 * 预览表
 *
 * Created by GUY on 2015/12/25.
 * @class BI.PreviewTable
 * @extends BI.Widget
 */
BI.PreviewTable = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.PreviewTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-preview-table",
            isNeedFreeze: false,
            freezeCols: [],
            rowSize: null,
            columnSize: [],
            headerRowSize: 30,
            header: [],
            items: []
        });
    },

    _init: function () {
        BI.PreviewTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.table = BI.createWidget({
            type: "bi.table_view",
            element: this,
            isNeedResize: false,

            isResizeAdapt: false,

            isNeedFreeze: o.isNeedFreeze,
            freezeCols: o.freezeCols,

            rowSize: o.rowSize,
            columnSize: o.columnSize,
            headerRowSize: o.headerRowSize,

            header: BI.map(o.header, function (i, items) {
                return BI.map(items, function (j, item) {
                    return BI.extend({
                        type: "bi.preview_table_header_cell"
                    }, item);
                });
            }),
            items: BI.map(o.items, function (i, items) {
                return BI.map(items, function (j, item) {
                    return BI.extend({
                        type: "bi.preview_table_cell"
                    }, item);
                });
            })
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_INIT, function () {
            self._adjustColumns();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_INIT, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_RESIZE, function () {
            self._adjustColumns();
        });
    },

    //是否有自适应调节的列，即列宽为""
    _hasAdaptCol: function (columnSize) {
        return BI.any(columnSize, function (i, size) {
            return size === "";
        })
    },

    _isPercentage: function (columnSize) {
        return columnSize[0] <= 1;
    },

    _adjustColumns: function () {
        var self = this, o = this.options;
        if (o.isNeedFreeze === true) {
            //如果存在百分比的情况
            if (this._isPercentage(o.columnSize)) {
                if (this._hasAdaptCol(o.columnSize)) {
                    var findCols = [], remain = 0;
                    BI.each(o.columnSize, function (i, size) {
                        if (size === "") {
                            findCols.push(i);
                        } else {
                            remain += size;
                        }
                    });
                    remain = 1 - remain;
                    var average = remain / findCols.length;
                    BI.each(findCols, function (i, col) {
                        o.columnSize[col] = average;
                    });
                }
                var isRight = BI.first(o.freezeCols) !== 0;
                var freezeSize = [], notFreezeSize = [];
                BI.each(o.columnSize, function (i, size) {
                    if (o.freezeCols.contains(i)) {
                        freezeSize.push(size);
                    } else {
                        notFreezeSize.push(size);
                    }
                });
                var sumFreezeSize = BI.sum(freezeSize), sumNotFreezeSize = BI.sum(notFreezeSize);
                BI.each(freezeSize, function (i, size) {
                    freezeSize[i] = size / sumFreezeSize;
                });
                BI.each(notFreezeSize, function (i, size) {
                    notFreezeSize[i] = size / sumNotFreezeSize;
                });
                this.table.setRegionColumnSize(isRight ? ["fill", sumFreezeSize] : [sumFreezeSize, "fill"]);
                this.table.setColumnSize(isRight ? (notFreezeSize.concat(freezeSize)) : (freezeSize.concat(notFreezeSize)));
            }
        } else {
            //如果存在自适应宽度的列或者是百分比计算的列，需要将整个表宽设为100%
            if (this._hasAdaptCol(o.columnSize) || this._isPercentage(o.columnSize)) {
                this.table.setRegionColumnSize(["100%"]);
            }
        }
    },

    setColumnSize: function (columnSize) {
        return this.table.setColumnSize(columnSize);
    },

    getColumnSize: function () {
        return this.table.getColumnSize();
    },

    getCalculateColumnSize: function () {
        return this.table.getCalculateColumnSize();
    },

    setHeaderColumnSize: function (columnSize) {
        return this.table.setHeaderColumnSize(columnSize);
    },

    setRegionColumnSize: function (columnSize) {
        return this.table.setRegionColumnSize(columnSize);
    },

    getRegionColumnSize: function () {
        return this.table.getRegionColumnSize();
    },

    getCalculateRegionColumnSize: function () {
        return this.table.getCalculateRegionColumnSize();
    },

    getCalculateRegionRowSize: function () {
        return this.table.getCalculateRegionRowSize();
    },

    getClientRegionColumnSize: function () {
        return this.table.getClientRegionColumnSize();
    },

    getScrollRegionColumnSize: function () {
        return this.table.getScrollRegionColumnSize()
    },

    getScrollRegionRowSize: function () {
        return this.table.getScrollRegionRowSize()
    },

    hasVerticalScroll: function () {
        return this.table.hasVerticalScroll();
    },

    setVerticalScroll: function (scrollTop) {
        return this.table.setVerticalScroll(scrollTop);
    },

    setLeftHorizontalScroll: function (scrollLeft) {
        return this.table.setLeftHorizontalScroll(scrollLeft)
    },

    setRightHorizontalScroll: function (scrollLeft) {
        return this.table.setRightHorizontalScroll(scrollLeft);
    },

    getVerticalScroll: function () {
        return this.table.getVerticalScroll();
    },

    getLeftHorizontalScroll: function () {
        return this.table.getLeftHorizontalScroll();
    },

    getRightHorizontalScroll: function () {
        return this.table.getRightHorizontalScroll();
    },

    getColumns: function () {
        return this.table.getColumns();
    },

    populate: function (items, header) {
        this.table.populate(items, header);
    }
});
BI.PreviewTable.EVENT_CHANGE = "PreviewTable.EVENT_CHANGE";
BI.shortcut('bi.preview_table', BI.PreviewTable);/**
 * 季度下拉框
 *
 * Created by GUY on 2015/8/28.
 * @class BI.QuarterCombo
 * @extends BI.Widget
 */
BI.QuarterCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.QuarterCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-quarter-combo",
            height: 25
        });
    },
    _init: function () {
        BI.QuarterCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.storeValue = "";
        this.trigger = BI.createWidget({
            type: "bi.quarter_trigger"
        });

        this.trigger.on(BI.QuarterTrigger.EVENT_FOCUS, function () {
            self.storeValue = this.getKey();
        });
        this.trigger.on(BI.QuarterTrigger.EVENT_CHANGE, function () {
            self.combo.isViewVisible() && self.combo.hideView();
        });
        this.trigger.on(BI.QuarterTrigger.EVENT_START, function () {
            self.combo.isViewVisible() && self.combo.hideView();
        });
        this.trigger.on(BI.QuarterTrigger.EVENT_STOP, function(){
            if (!self.combo.isViewVisible()) {
                self.combo.showView();
            }
        });
        this.trigger.on(BI.QuarterTrigger.EVENT_CONFIRM, function () {
            if(self.combo.isViewVisible()) {
                return;
            }
            if(this.getKey() && this.getKey() !== self.storeValue) {
                self.setValue(this.getKey());
            }else if(!this.getKey()){
                self.setValue();
            }
            self.fireEvent(BI.QuarterCombo.EVENT_CONFIRM);
        });
        this.popup = BI.createWidget({
            type: "bi.quarter_popup"
        });

        this.popup.on(BI.QuarterPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.combo.hideView();
            self.fireEvent(BI.QuarterCombo.EVENT_CONFIRM);
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            isNeedAdjustHeight: false,
            isNeedAdjustWidth: false,
            el: this.trigger,
            popup: {
                minWidth: 85,
                el: this.popup
            }
        });
    },

    setValue: function (v) {
        this.trigger.setValue(v);
        this.popup.setValue(v);
    },

    getValue: function () {
        return this.popup.getValue() || "";
    }
});

BI.QuarterCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.shortcut('bi.quarter_combo', BI.QuarterCombo);/**
 * 季度展示面板
 *
 * Created by GUY on 2015/9/2.
 * @class BI.QuarterPopup
 * @extends BI.Trigger
 */
BI.QuarterPopup = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.QuarterPopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-quarter-popup"
        });
    },

    _init: function () {
        BI.QuarterPopup.superclass._init.apply(this, arguments);
        var self = this;

        var items = [{
            text: Date._QN[01],
            value: 1
        }, {
            text: Date._QN[2],
            value: 2
        }, {
            text: Date._QN[3],
            value: 3
        }, {
            text: Date._QN[4],
            value: 4
        }];
        items = BI.map(items, function (j, item) {
            return BI.extend(item, {
                type: "bi.text_item",
                cls: "bi-list-item-active",
                textAlign: "left",
                whiteSpace: "nowrap",
                once: false,
                forceSelected: true,
                height: 25
            });
        });

        this.quarter = BI.createWidget({
            type: "bi.button_group",
            element: this,
            items: BI.createItems(items, {}),
            layouts: [{
                type: "bi.vertical"
            }]
        });

        this.quarter.on(BI.Controller.EVENT_CHANGE, function (type) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.MonthPopup.EVENT_CHANGE);
            }
        })
    },

    getValue: function () {
        return this.quarter.getValue()[0];
    },

    setValue: function (v) {
        this.quarter.setValue([v]);
    }
});
BI.QuarterPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.quarter_popup", BI.QuarterPopup);/**
 * 季度trigger
 *
 * Created by GUY on 2015/8/21.
 * @class BI.QuarterTrigger
 * @extends BI.Trigger
 */
BI.QuarterTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4,
        vgap: 2,
        triggerWidth: 30,
        textWidth: 40,
        errorText: BI.i18nText("BI-Quarter_Trigger_Error_Text")
    },

    _defaultConfig: function () {
        return BI.extend(BI.QuarterTrigger.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-quarter-trigger bi-border",
            height: 25
        });
    },
    _init: function () {
        BI.QuarterTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            height: o.height,
            validationChecker: function (v) {
                return v === "" || (BI.isPositiveInteger(v) && v >= 1 && v <= 4);
            },
            quitChecker: function (v) {
                return false;
            },
            hgap: c.hgap,
            vgap: c.vgap,
            allowBlank: true,
            errorText: c.errorText
        });
        this.editor.on(BI.SignEditor.EVENT_FOCUS, function () {
            self.fireEvent(BI.QuarterTrigger.EVENT_FOCUS);
        });
        this.editor.on(BI.SignEditor.EVENT_CHANGE, function () {
            self.fireEvent(BI.QuarterTrigger.EVENT_CHANGE);
        });
        this.editor.on(BI.SignEditor.EVENT_CONFIRM, function () {
            var value = self.editor.getValue();
            if (BI.isNotNull(value)) {
                self.editor.setValue(value);
                self.editor.setTitle(value);
            }
            self.fireEvent(BI.QuarterTrigger.EVENT_CONFIRM);
        });
        this.editor.on(BI.SignEditor.EVENT_SPACE, function () {
            if (self.editor.isValid()) {
                self.editor.blur();
            }
        });
        this.editor.on(BI.SignEditor.EVENT_START, function () {
            self.fireEvent(BI.QuarterTrigger.EVENT_START);
        });
        this.editor.on(BI.SignEditor.EVENT_STOP, function () {
            self.fireEvent(BI.QuarterTrigger.EVENT_STOP);
        });

        BI.createWidget({
            element: this,
            type: 'bi.htape',
            items: [
                {
                    el: this.editor
                }, {
                    el: {
                        type: "bi.text_button",
                        baseCls: "bi-trigger-quarter-text",
                        text: BI.i18nText("BI-Multi_Date_Quarter"),
                        width: c.textWidth
                    },
                    width: c.textWidth
                }, {
                    el: {
                        type: "bi.trigger_icon_button",
                        width: c.triggerWidth
                    },
                    width: c.triggerWidth
                }
            ]
        });
    },

    setValue: function (v) {
        this.editor.setState(v);
        this.editor.setValue(v);
        this.editor.setTitle(v);
    },

    getKey: function () {
        return this.editor.getValue();
    }
});
BI.QuarterTrigger.EVENT_FOCUS = "EVENT_FOCUS";
BI.QuarterTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.QuarterTrigger.EVENT_START = "EVENT_START";
BI.QuarterTrigger.EVENT_STOP = "EVENT_STOP";
BI.QuarterTrigger.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.shortcut("bi.quarter_trigger", BI.QuarterTrigger);/**
 * 关联视图字段Item
 *
 * Created by GUY on 2015/12/23.
 * @class BI.RelationViewItem
 * @extends BI.Widget
 */
BI.RelationViewItem = BI.inherit(BI.BasicButton, {

    _defaultConfig: function () {
        return BI.extend(BI.RelationViewItem.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-relation-view-item bi-list-item-active",
            height: 25,
            hoverIn: BI.emptyFn,
            hoverOut: BI.emptyFn
        });
    },

    _init: function () {
        BI.RelationViewItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.element.hover(o.hoverIn, o.hoverOut);
        var items = [];
        if (o.isPrimary) {
            items.push({
                type: "bi.icon",
                width: 16,
                height: 16,
                title: BI.i18nText("BI-Primary_Key")
            });
        }
        items.push({
            type: "bi.label",
            text: o.text,
            value: o.value,
            height: o.height,
            textAlign: "left",
            width: o.isPrimary ? 70 : 90
        });
        BI.createWidget({
            type: "bi.vertical_adapt",
            element: this,
            items: items,
            cls: "primary-key-font",
            lgap: 5
        });
    },

    enableHover: function (opt) {
        BI.RelationViewRegion.superclass.enableHover.apply(this, [{
            container: "body"
        }]);
    },

    setSelected: function (b) {
        this.element[b ? "addClass" : "removeClass"]("active");
    }
});
BI.shortcut('bi.relation_view_item', BI.RelationViewItem);/**
 * 关联视图
 *
 * Created by GUY on 2015/12/22.
 * @class BI.RelationView
 * @extends BI.Widget
 */
BI.RelationView = BI.inherit(BI.Widget, {

    _const: {
        lineColor: "#c4c6c6",
        selectLineColor: "#009de3"
    },

    _defaultConfig: function () {
        return BI.extend(BI.RelationView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-relation-view",
            items: []
        });
    },

    _init: function () {
        BI.RelationView.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _calculateWidths: function () {
        var widths = [];
        BI.each(this.views, function (i, items) {
            BI.each(items, function (j, obj) {
                if (!widths[j]) {
                    widths[j] = BI.MIN;
                }
                widths[j] = Math.max(widths[j], obj.getWidth());
            })
        });
        return widths;
    },

    _calculateHeights: function () {
        var heights = BI.makeArray(BI.size(this.views), BI.MIN);
        BI.each(this.views, function (i, items) {
            BI.each(items, function (j, obj) {
                heights[i] = Math.max(heights[i], obj.getHeight());
            })
        });
        return heights;
    },

    _hoverIn: function (target) {
        var self = this, c = this._const;
        BI.each(this.relations, function (start, rs) {
            BI.each(rs, function (end, relation) {
                if (relation[0].primary.value === target || relation[0].foreign.value === target) {
                    self.lines[start][end].attr("stroke", c.selectLineColor).toFront();
                    self.storeViews[start].setValue(relation[0].primary.value);
                    self.storeViews[end].setValue(relation[0].foreign.value);
                }
            });
        });
    },

    _hoverOut: function (target) {
        var self = this, c = this._const;
        BI.each(this.relations, function (start, rs) {
            BI.each(rs, function (end, relation) {
                if (relation[0].primary.value === target || relation[0].foreign.value === target) {
                    self.lines[start][end].attr("stroke", c.lineColor);
                    self.storeViews[start].setValue([]);
                    self.storeViews[end].setValue([]);
                }
            });
        });
    },

    previewRelationTables: function(relationTables, show) {
        if (!show) {
            BI.each(this.storeViews, function (i, view) {
                view.toggleRegion(true);
                view.setPreviewSelected(false);
            });
            BI.each(this.lines, function (i, lines) {
                BI.each(lines, function (j, line) {
                    line.show();
                });
            });
            return;
        }
        BI.each(this.storeViews, function (id, view) {
            if (!relationTables.contains(id)) {
                view.toggleRegion(false);
            } else {
                view.setPreviewSelected(true);
            }
        });
        BI.each(this.lines, function (id, lines) {
            BI.each(lines, function (cId, line) {
                if (!relationTables.contains(id) || !relationTables.contains(cId)) {
                    line.hide();
                }
            });
        });
    },

    populate: function (items) {
        var self = this, o = this.options, c = this._const;
        o.items = items || [];
        this.empty();
        this.svg = BI.createWidget({
            type: "bi.svg"
        });

        //算出所有的区域和关联
        var regions = this.regions = {}, relations = this.relations = {};
        BI.each(items, function (i, item) {
            var pr = item.primary.region, fr = item.foreign && item.foreign.region;
            if (pr && !relations[pr]) {
                relations[pr] = {};
            }
            if (pr && fr && !relations[pr][fr]) {
                relations[pr][fr] = [];
            }
            if (pr && !regions[pr]) {
                regions[pr] = [];
            }
            if (fr && !regions[fr]) {
                regions[fr] = [];
            }
            if (pr && !BI.deepContains(regions[pr], item.primary)) {
                regions[pr].push(item.primary);
            }
            if (fr && !BI.deepContains(regions[fr], item.foreign)) {
                regions[fr].push(item.foreign);
            }
            pr && fr && relations[pr][fr].push(item);
        });
        //求拓扑
        var topology = [];
        var rs = BI.clone(regions), store = {};
        while (!BI.isEmpty(rs)) {
            var clone = BI.clone(rs);
            BI.each(o.items, function (i, item) {
                if (!store[item.primary.region]) {
                    delete clone[item.foreign && item.foreign.region];
                }
            });
            topology.push(BI.keys(clone));
            BI.extend(store, clone);
            BI.each(clone, function (k, v) {
                delete rs[k];
            });
        }
        //构建视图
        var views = this.views = {}, storeViews = this.storeViews = {}, indexes = this.indexes = {};
        var verticals = [];
        BI.each(topology, function (i, items) {
            if (!views[i]) {
                views[i] = {};
            }
            var horizontal = [];
            BI.each(items, function (j, region) {
                var items = regions[region];
                views[i][j] = storeViews[region] = BI.createWidget({
                    type: "bi.relation_view_region_container",
                    value: region,
                    header: items[0].regionTitle,
                    text: items.length > 0 ? items[0].regionText : "",
                    handler: items.length > 0 ? items[0].regionHandler : BI.emptyFn,
                    items: items,
                    belongPackage: items.length > 0 ? items[0].belongPackage : true
                });
                if (BI.isNotNull(items[0]) && BI.isNotNull(items[0].keyword)) {
                    views[i][j].doRedMark(items[0].keyword);
                }
                views[i][j].on(BI.RelationViewRegionContainer.EVENT_HOVER_IN, function (v) {
                    self._hoverIn(v);
                });
                views[i][j].on(BI.RelationViewRegionContainer.EVENT_HOVER_OUT, function (v) {
                    self._hoverOut(v);
                });
                views[i][j].on(BI.RelationViewRegionContainer.EVENT_PREVIEW, function (v) {
                    self.fireEvent(BI.RelationView.EVENT_PREVIEW, region, v);
                });
                indexes[region] = {i: i, j: j};
                horizontal.push(views[i][j]);
            });
            verticals.push({
                type: "bi.horizontal",
                items: horizontal
            })
        });

        //求每一行的高度
        var heights = this._calculateHeights();

        //求每一列的宽度
        var widths = this._calculateWidths();

        //求相对宽度和高度
        var offsetWidths = [0], offsetHeights = [0];
        BI.each(heights, function (i, h) {
            if (i === 0) {
                return;
            }
            offsetHeights[i] = offsetHeights[i - 1] + heights[i - 1];
        });
        BI.each(widths, function (i, w) {
            if (i === 0) {
                return;
            }
            offsetWidths[i] = offsetWidths[i - 1] + widths[i - 1];
        });

        //画线
        var lines = this.lines = {};//缓存所有的线
        BI.each(relations, function (start, rs) {
            BI.each(rs, function (end, relation) {
                var startIndex = indexes[start], endIndex = indexes[end];
                var top = 0, right = 1, bottom = 2, left = 3;
                var startDirection = bottom, endDirection = top;
                // if (startIndex.j > endIndex.j) {
                //     startDirection = left;
                //     endDirection = right;
                // } else if (startIndex.j < endIndex.j) {
                //     startDirection = right;
                //     endDirection = left;
                // } else if (startIndex.i < endIndex.i) {
                //     startDirection = bottom;
                //     endDirection = top;
                // } else if (startIndex.i > endIndex.i) {
                //     startDirection = top;
                //     endDirection = bottom;
                // }
                var draw = function (i, j, direction, isForeign) {
                    var x = offsetWidths[j] + (widths[j] - views[i][j].getWidth()) / 2;
                    var y = offsetHeights[i] + (heights[i] - views[i][j].getHeight()) / 2;
                    var path = "", position;
                    switch (direction) {
                        case top:
                            position = isForeign ? views[i][j].getTopRightPosition() : views[i][j].getTopLeftPosition();
                            x += position.x;
                            y += position.y;
                            path = "M" + x + "," + y + "L" + x + "," + (y - 10);
                            y -= 10;
                            break;
                        case right:
                            position = views[i][j].getRightPosition();
                            x += position.x;
                            y += position.y;
                            path = "M" + x + "," + y + "L" + (x + 10) + "," + y;
                            x += 10;
                            break;
                        case bottom:
                            position = views[i][j].getBottomPosition();
                            x += position.x;
                            y += position.y;
                            path = "M" + x + "," + y + "L" + x + "," + (y + 10);
                            y += 10;
                            break;
                        case left:
                            position = views[i][j].getLeftPosition();
                            x += position.x;
                            y += position.y;
                            path = "M" + x + "," + y + "L" + (x - 10) + "," + y;
                            x -= 10;
                            break;
                    }
                    return {x: x, y: y, path: path};
                };
                var path = "";
                var si = draw(startIndex.i, startIndex.j, startDirection);
                var ei = draw(endIndex.i, endIndex.j, endDirection, true);
                path += si.path + ei.path;
                if (!lines[start]) {
                    lines[start] = {};
                }
                path += "M" + si.x + "," + si.y + "L" + ei.x + "," + ei.y;
                var line = lines[start][end] = self.svg.path(path)
                    .attr({"stroke": c.lineColor, "stroke-width": "2"})
                    .hover(function () {
                        line.attr("stroke", c.selectLineColor).toFront();
                        storeViews[start].setValue(relation[0].primary.value);
                        storeViews[end].setValue(relation[0].foreign.value);
                    }, function () {
                        line.attr("stroke", c.lineColor);
                        storeViews[start].setValue([]);
                        storeViews[end].setValue([]);
                    });
            });
        });
        var container = BI.createWidget();
        BI.createWidget({
            type: "bi.vertical",
            element: container,
            items: verticals
        });
        BI.createWidget({
            type: "bi.absolute",
            element: container,
            items: [{
                el: this.svg,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });

        BI.createWidget({
            type: "bi.center_adapt",
            scrollable: true,
            element: this,
            items: [container]
        });
    }
});
BI.RelationView.EVENT_CHANGE = "RelationView.EVENT_CHANGE";
BI.RelationView.EVENT_PREVIEW = "EVENT_PREVIEW";
BI.shortcut('bi.relation_view', BI.RelationView);/**
 * Created by Young's on 2017/3/10.
 */
BI.RelationViewRegionContainer = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.RelationViewRegionContainer.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-relation-view-region-container",
            width: 150
        });
    },

    _init: function () {
        BI.RelationViewRegionContainer.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.region = BI.createWidget({
            type: "bi.relation_view_region",
            value: o.value,
            header: o.header,
            text: o.text,
            handler: o.handler,
            items: o.items,
            belongPackage: o.belongPackage
        });
        this.region.on(BI.RelationViewRegion.EVENT_PREVIEW, function (v) {
            self.fireEvent(BI.RelationViewRegionContainer.EVENT_PREVIEW, v);
        });
        this.region.on(BI.RelationViewRegion.EVENT_HOVER_IN, function (v) {
            self.fireEvent(BI.RelationViewRegionContainer.EVENT_HOVER_IN, v);
        });
        this.region.on(BI.RelationViewRegion.EVENT_HOVER_OUT, function (v) {
            self.fireEvent(BI.RelationViewRegionContainer.EVENT_HOVER_OUT, v);
        });
        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [this.region],
            width: this.region.getWidth(),
            height: this.region.getHeight()
        });
    },

    doRedMark: function () {
        this.region.doRedMark.apply(this.region, arguments);
    },

    unRedMark: function () {
        this.region.unRedMark.apply(this.region, arguments);
    },

    getWidth: function () {
        return this.region.getWidth();
    },

    getHeight: function () {
        return this.region.getHeight();
    },

    //获取上方开始划线的位置
    getTopLeftPosition: function () {
        return this.region.getTopLeftPosition();
    },

    getTopRightPosition: function () {
        return this.region.getTopRightPosition();
    },

    getBottomPosition: function () {
        return this.region.getBottomPosition();
    },

    getLeftPosition: function () {
        return this.region.getLeftPosition();
    },

    getRightPosition: function () {
        return this.region.getRightPosition();
    },

    setValue: function (v) {
        this.region.setValue(v);
    },

    toggleRegion: function (v) {
        v === true ? this.region.element.fadeIn() : this.region.element.fadeOut();
    },

    setPreviewSelected: function(v) {
        this.region.setPreviewSelected(v);
    }
});
BI.RelationViewRegionContainer.EVENT_HOVER_IN = "RelationViewRegion.EVENT_HOVER_IN";
BI.RelationViewRegionContainer.EVENT_HOVER_OUT = "RelationViewRegion.EVENT_HOVER_OUT";
BI.RelationViewRegionContainer.EVENT_PREVIEW = "RelationViewRegion.EVENT_PREVIEW";
BI.shortcut("bi.relation_view_region_container", BI.RelationViewRegionContainer);/**
 * 关联视图
 *
 * Created by GUY on 2015/12/23.
 * @class BI.RelationViewRegion
 * @extends BI.BasicButton
 */
BI.RelationViewRegion = BI.inherit(BI.BasicButton, {

    _defaultConfig: function () {
        return BI.extend(BI.RelationViewRegion.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-relation-view-region cursor-pointer",
            width: 150,
            text: "",
            value: "",
            header: "",
            items: [],
            belongPackage: true
        });
    },

    _init: function () {
        BI.RelationViewRegion.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.preview = BI.createWidget({
            type: "bi.icon_button",
            cls: "relation-table-preview-font",
            width: 25,
            height: 25,
            stopPropagation: true
        });
        this.preview.on(BI.IconButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.RelationViewRegion.EVENT_PREVIEW, this.isSelected());
        });

        this.title = BI.createWidget({
            type: "bi.label",
            height: 25,
            width: 70,
            text: o.text,
            value: o.value,
            textAlign: "left"
        });
        //title放body上
        if (BI.isKey(o.header)) {
            this.title.setTitle(o.header, {
                container: "body"
            })
        }

        this.button_group = BI.createWidget({
            type: "bi.button_group",
            items: this._createItems(o.items),
            layouts: [{
                type: "bi.vertical"
            }]
        });

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [{
                type: "bi.vertical",
                cls: "relation-view-region-container bi-card bi-border " + (o.belongPackage ? "" : "other-package"),
                items: [{
                    type: "bi.vertical_adapt",
                    cls: "relation-view-region-title bi-border-bottom",
                    items: [this.preview, this.title]
                }, this.button_group]
            }],
            hgap: 25,
            vgap: 20
        })
    },

    _createItems: function (items) {
        var self = this;
        return BI.map(items, function (i, item) {
            return BI.extend(item, {
                type: "bi.relation_view_item",
                hoverIn: function () {
                    self.setValue(item.value);
                    self.fireEvent(BI.RelationViewRegion.EVENT_HOVER_IN, item.value);
                },
                hoverOut: function () {
                    self.setValue([]);
                    self.fireEvent(BI.RelationViewRegion.EVENT_HOVER_OUT, item.value);
                }
            })
        });
    },

    doRedMark: function () {
        this.title.doRedMark.apply(this.title, arguments);
    },

    unRedMark: function () {
        this.title.unRedMark.apply(this.title, arguments);
    },

    getWidth: function () {
        return this.options.width;
    },

    getHeight: function () {
        return this.button_group.getAllButtons().length * 25 + 25 + 2 * 20 + 3;
    },

    //获取上方开始划线的位置
    getTopLeftPosition: function () {
        return {
            x: 25 + 10,
            y: 20
        }
    },

    getTopRightPosition: function () {
        return {
            x: this.getWidth() - 25 - 10,
            y: 20
        }
    },

    getBottomPosition: function () {
        return {
            x: 25 + 10,
            y: this.getHeight() - 20
        }
    },

    getLeftPosition: function () {
        return {
            x: 25,
            y: 20 + 10
        }
    },

    getRightPosition: function () {
        return {
            x: this.getWidth() - 25,
            y: 20 + 10
        }
    },

    setValue: function (v) {
        this.button_group.setValue(v);
    },

    setPreviewSelected: function(v) {
        this.preview.setSelected(v);
    }
});
BI.RelationViewRegion.EVENT_HOVER_IN = "RelationViewRegion.EVENT_HOVER_IN";
BI.RelationViewRegion.EVENT_HOVER_OUT = "RelationViewRegion.EVENT_HOVER_OUT";
BI.RelationViewRegion.EVENT_PREVIEW = "RelationViewRegion.EVENT_PREVIEW";
BI.shortcut('bi.relation_view_region', BI.RelationViewRegion);/**
 * 自适应宽度的表格
 *
 * Created by GUY on 2016/2/3.
 * @class BI.ResponisveTable
 * @extends BI.Widget
 */
BI.ResponisveTable = BI.inherit(BI.Widget, {

    _const: {
        perColumnSize: 100
    },

    _defaultConfig: function () {
        return BI.extend(BI.ResponisveTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-responsive-table",
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
            items: [], //二维数组

            //交叉表头
            crossHeader: [],
            crossItems: []
        });
    },

    _init: function () {
        BI.ResponisveTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.table = BI.createWidget({
            type: "bi.table_view",
            element: this,

            isNeedFreeze: o.isNeedFreeze,
            freezeCols: o.freezeCols,

            isNeedMerge: o.isNeedMerge,
            mergeCols: o.mergeCols,
            mergeRule: o.mergeRule,

            columnSize: o.columnSize,
            headerRowSize: o.headerRowSize,
            footerRowSize: o.footerRowSize,
            rowSize: o.rowSize,

            regionColumnSize: o.regionColumnSize,

            header: o.header,
            footer: o.footer,
            items: o.items,
            //交叉表头
            crossHeader: o.crossHeader,
            crossItems: o.crossItems
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_INIT, function () {
            self._initRegionSize();
            self.table.resize();
            self._resizeHeader();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_INIT, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_RESIZE, function () {
            self._resizeRegion();
            self._resizeHeader();
            self.fireEvent(BI.Table.EVENT_TABLE_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_SCROLL, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_BEFORE_REGION_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_BEFORE_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_REGION_RESIZE, function () {
            //important:在冻结并自适应列宽的情况下要随时变更表头宽度
            if (o.isNeedResize === true && self._isAdaptiveColumn()) {
                self._resizeHeader();
            }
            self.fireEvent(BI.Table.EVENT_TABLE_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, function () {
            self._resizeHeader();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, arguments);
        });

        this.table.on(BI.Table.EVENT_TABLE_BEFORE_COLUMN_RESIZE, function () {
            self._resizeBody();
            self.fireEvent(BI.Table.EVENT_TABLE_BEFORE_COLUMN_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_COLUMN_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_COLUMN_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, function () {
            self._resizeRegion();
            self._resizeHeader();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, arguments);
        });
    },

    _initRegionSize: function () {
        var o = this.options;
        if (o.isNeedFreeze === true) {
            var regionColumnSize = this.table.getRegionColumnSize();
            var maxWidth = this.table.element.width();
            if (!regionColumnSize[0] || (regionColumnSize[0] === 'fill') || regionColumnSize[0] > maxWidth || regionColumnSize[1] > maxWidth) {
                var freezeCols = o.freezeCols;
                if (freezeCols.length === 0) {
                    this.table.setRegionColumnSize([0, "fill"]);
                } else if (freezeCols.length > 0 && freezeCols.length < o.columnSize.length) {
                    var size = maxWidth / 3;
                    if (freezeCols.length > o.columnSize.length / 2) {
                        size = maxWidth * 2 / 3;
                    }
                    this.table.setRegionColumnSize([size, "fill"]);
                } else {
                    this.table.setRegionColumnSize(["fill", 0]);
                }
            }
        }
    },

    _getBlockSize: function () {
        var o = this.options;
        var columnSize = this.table.getCalculateColumnSize();
        if (o.isNeedFreeze === true) {
            var columnSizeLeft = [], columnSizeRight = [];
            BI.each(columnSize, function (i, size) {
                if (o.freezeCols.contains(i)) {
                    columnSizeLeft.push(size);
                } else {
                    columnSizeRight.push(size);
                }
            });
            //因为有边框，所以加上数组长度的参数调整
            var sumLeft = BI.sum(columnSizeLeft) + columnSizeLeft.length, sumRight = BI.sum(columnSizeRight) + columnSizeRight.length;
            return {
                sumLeft: sumLeft,
                sumRight: sumRight,
                left: columnSizeLeft,
                right: columnSizeRight
            }
        }
        return {
            size: columnSize,
            sum: BI.sum(columnSize) + columnSize.length
        };
    },

    _isAdaptiveColumn: function (columnSize) {
        return !(BI.last(columnSize || this.table.getColumnSize()) > 1.05);
    },

    _resizeHeader: function () {
        var self = this, o = this.options;
        if (o.isNeedFreeze === true) {
            //若是当前处于自适应调节阶段
            if (this._isAdaptiveColumn()) {
                var columnSize = this.table.getCalculateColumnSize();
                this.table.setHeaderColumnSize(columnSize);
            } else {
                var regionColumnSize = this.table.getClientRegionColumnSize();
                var block = this._getBlockSize();
                var sumLeft = block.sumLeft, sumRight = block.sumRight;
                var columnSizeLeft = block.left, columnSizeRight = block.right;
                columnSizeLeft[columnSizeLeft.length - 1] += regionColumnSize[0] - sumLeft;
                columnSizeRight[columnSizeRight.length - 1] += regionColumnSize[1] - sumRight;

                var newLeft = BI.clone(columnSizeLeft), newRight = BI.clone(columnSizeRight);
                newLeft[newLeft.length - 1] = "";
                newRight[newRight.length - 1] = "";
                this.table.setColumnSize(newLeft.concat(newRight));

                block = self._getBlockSize();
                if (columnSizeLeft[columnSizeLeft.length - 1] < block.left[block.left.length - 1]) {
                    columnSizeLeft[columnSizeLeft.length - 1] = block.left[block.left.length - 1]
                }
                if (columnSizeRight[columnSizeRight.length - 1] < block.right[block.right.length - 1]) {
                    columnSizeRight[columnSizeRight.length - 1] = block.right[block.right.length - 1]
                }

                self.table.setColumnSize(columnSizeLeft.concat(columnSizeRight));
            }
        } else {
            if (!this._isAdaptiveColumn()) {
                var regionColumnSize = this.table.getClientRegionColumnSize();
                var block = this._getBlockSize();
                var sum = block.sum;
                var size = block.size;

                size[size.length - 1] += regionColumnSize[0] - sum;

                var newSize = BI.clone(size);
                newSize[newSize.length - 1] = "";
                this.table.setColumnSize(newSize);
                block = this._getBlockSize();

                if (size[size.length - 1] < block.size[block.size.length - 1]) {
                    size[size.length - 1] = block.size[block.size.length - 1]
                }
                this.table.setColumnSize(size);
            }
        }
    },

    _resizeBody: function () {
        if (this._isAdaptiveColumn()) {
            var columnSize = this.table.getCalculateColumnSize();
            this.setColumnSize(columnSize);
        }
    },

    _adjustRegion: function () {
        var o = this.options;
        var regionColumnSize = this.table.getCalculateRegionColumnSize();
        if (o.isNeedFreeze === true && o.freezeCols.length > 0 && o.freezeCols.length < o.columnSize.length) {
            var block = this._getBlockSize();
            var sumLeft = block.sumLeft, sumRight = block.sumRight;
            if (sumLeft < regionColumnSize[0] || regionColumnSize[0] >= (sumLeft + sumRight)) {
                this.table.setRegionColumnSize([sumLeft, "fill"]);
            }
            this._resizeRegion();
        }
    },

    _resizeRegion: function () {
        var o = this.options;
        var regionColumnSize = this.table.getCalculateRegionColumnSize();
        if (o.isNeedFreeze === true && o.freezeCols.length > 0 && o.freezeCols.length < o.columnSize.length) {
            var maxWidth = this.table.element.width();
            if (regionColumnSize[0] < 15 || regionColumnSize[1] < 15) {
                var freezeCols = o.freezeCols;
                var size = maxWidth / 3;
                if (freezeCols.length > o.columnSize.length / 2) {
                    size = maxWidth * 2 / 3;
                }
                this.table.setRegionColumnSize([size, "fill"]);
            }
        }
    },


    resize: function () {
        this.table.resize();
        this._resizeRegion();
        this._resizeHeader();
    },

    setColumnSize: function (columnSize) {
        this.table.setColumnSize(columnSize);
        this._adjustRegion();
        this._resizeHeader();
    },

    getColumnSize: function () {
        return this.table.getColumnSize();
    },

    getCalculateColumnSize: function () {
        return this.table.getCalculateColumnSize();
    },

    setHeaderColumnSize: function (columnSize) {
        this.table.setHeaderColumnSize(columnSize);
        this._adjustRegion();
        this._resizeHeader();
    },

    setRegionColumnSize: function (columnSize) {
        this.table.setRegionColumnSize(columnSize);
        this._resizeHeader();
    },

    getRegionColumnSize: function () {
        return this.table.getRegionColumnSize();
    },

    getCalculateRegionColumnSize: function () {
        return this.table.getCalculateRegionColumnSize();
    },

    getCalculateRegionRowSize: function () {
        return this.table.getCalculateRegionRowSize();
    },

    getClientRegionColumnSize: function () {
        return this.table.getClientRegionColumnSize();
    },

    getScrollRegionColumnSize: function () {
        return this.table.getScrollRegionColumnSize();
    },

    getScrollRegionRowSize: function () {
        return this.table.getScrollRegionRowSize();
    },

    hasVerticalScroll: function () {
        return this.table.hasVerticalScroll();
    },

    setVerticalScroll: function (scrollTop) {
        this.table.setVerticalScroll(scrollTop);
    },

    setLeftHorizontalScroll: function (scrollLeft) {
        this.table.setLeftHorizontalScroll(scrollLeft);
    },

    setRightHorizontalScroll: function (scrollLeft) {
        this.table.setRightHorizontalScroll(scrollLeft);
    },

    getVerticalScroll: function () {
        return this.table.getVerticalScroll();
    },

    getLeftHorizontalScroll: function () {
        return this.table.getLeftHorizontalScroll();
    },

    getRightHorizontalScroll: function () {
        return this.table.getRightHorizontalScroll();
    },

    getColumns: function () {
        return this.table.getColumns();
    },

    attr: function () {
        BI.ResponisveTable.superclass.attr.apply(this, arguments);
        this.table.attr.apply(this.table, arguments);
    },

    populate: function (items) {
        var self = this, o = this.options;
        this.table.populate.apply(this.table, arguments);
        if (o.isNeedFreeze === true) {
            BI.nextTick(function () {
                if (self.element.is(":visible")) {
                    self._initRegionSize();
                    self.table.resize();
                    self._resizeHeader();
                }
            });
        }
    }
});
BI.shortcut('bi.responsive_table', BI.ResponisveTable);/**
 * 加号表示的组节点
 * Created by GUY on 2015/9/6.
 * @class BI.SelectTreeFirstPlusGroupNode
 * @extends BI.NodeButton
 */
BI.SelectTreeFirstPlusGroupNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.SelectTreeFirstPlusGroupNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-select-tree-first-plus-group-node bi-list-item-active",
            logic: {
                dynamic: false
            },
            id: "",
            pId: "",
            readonly: true,
            open: false,
            height: 25
        })
    },
    _init: function () {
        BI.SelectTreeFirstPlusGroupNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.checkbox = BI.createWidget({
            type: "bi.first_tree_node_checkbox",
            stopPropagation: true
        });
        this.text = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            whiteSpace: "nowrap",
            textHeight: o.height,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py
        });
        this.checkbox.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {
                if (this.isSelected()) {
                    self.triggerExpand();
                } else {
                    self.triggerCollapse();
                }
            }
        });
        var type = BI.LogicFactory.createLogicTypeByDirection(BI.Direction.Left);
        var items = BI.LogicFactory.createLogicItemsByDirection(BI.Direction.Left, {
            width: 25,
            el: this.checkbox
        }, this.text);
        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic(type, BI.extend(o.logic, {
            items: items
        }))));
    },

    isOnce: function () {
        return true;
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doClick: function () {
        BI.NodeButton.superclass.doClick.apply(this, arguments);
    },

    setOpened: function (v) {
        BI.SelectTreeFirstPlusGroupNode.superclass.setOpened.apply(this, arguments);
        if (BI.isNotNull(this.checkbox)) {
            this.checkbox.setSelected(v);
        }
    }
});

BI.shortcut("bi.select_tree_first_plus_group_node", BI.SelectTreeFirstPlusGroupNode);/**
 * 加号表示的组节点
 * Created by GUY on 2015/9/6.
 * @class BI.SelectTreeLastPlusGroupNode
 * @extends BI.NodeButton
 */
BI.SelectTreeLastPlusGroupNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.SelectTreeLastPlusGroupNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-select-tree-last-plus-group-node bi-list-item-active",
            logic: {
                dynamic: false
            },
            id: "",
            pId: "",
            readonly: true,
            open: false,
            height: 25
        })
    },
    _init: function () {
        BI.SelectTreeLastPlusGroupNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.checkbox = BI.createWidget({
            type: "bi.last_tree_node_checkbox",
            stopPropagation: true
        })
        this.text = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            whiteSpace: "nowrap",
            textHeight: o.height,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py
        });
        this.checkbox.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {
                if (this.isSelected()) {
                    self.triggerExpand();
                } else {
                    self.triggerCollapse();
                }
            }
        });
        var type = BI.LogicFactory.createLogicTypeByDirection(BI.Direction.Left);
        var items = BI.LogicFactory.createLogicItemsByDirection(BI.Direction.Left, {
            width: 25,
            el: this.checkbox
        }, this.text);
        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic(type, BI.extend(o.logic, {
            items: items
        }))));
    },

    isOnce: function () {
        return true;
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doClick: function () {
        BI.NodeButton.superclass.doClick.apply(this, arguments);
    },

    setOpened: function (v) {
        BI.SelectTreeLastPlusGroupNode.superclass.setOpened.apply(this, arguments);
        if (BI.isNotNull(this.checkbox)) {
            this.checkbox.setSelected(v);
        }
    }
});

BI.shortcut("bi.select_tree_last_plus_group_node", BI.SelectTreeLastPlusGroupNode);/**
 * 加号表示的组节点
 * Created by GUY on 2015/9/6.
 * @class BI.SelectTreeMidPlusGroupNode
 * @extends BI.NodeButton
 */
BI.SelectTreeMidPlusGroupNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.SelectTreeMidPlusGroupNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-select-tree-mid-plus-group-node bi-list-item-active",
            logic: {
                dynamic: false
            },
            id: "",
            pId: "",
            readonly: true,
            open: false,
            height: 25
        })
    },
    _init: function () {
        BI.SelectTreeMidPlusGroupNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.checkbox = BI.createWidget({
            type: "bi.mid_tree_node_checkbox",
            stopPropagation: true
        });
        this.text = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            whiteSpace: "nowrap",
            textHeight: o.height,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py
        });
        this.checkbox.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {
                if (this.isSelected()) {
                    self.triggerExpand();
                } else {
                    self.triggerCollapse();
                }
            }
        });
        var type = BI.LogicFactory.createLogicTypeByDirection(BI.Direction.Left);
        var items = BI.LogicFactory.createLogicItemsByDirection(BI.Direction.Left, {
            width: 25,
            el: this.checkbox
        }, this.text);
        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic(type, BI.extend(o.logic, {
            items: items
        }))));
    },

    isOnce: function () {
        return true;
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doClick: function () {
        BI.NodeButton.superclass.doClick.apply(this, arguments);
    },

    setOpened: function (v) {
        BI.SelectTreeMidPlusGroupNode.superclass.setOpened.apply(this, arguments);
        if (BI.isNotNull(this.checkbox)) {
            this.checkbox.setSelected(v);
        }
    }
});

BI.shortcut("bi.select_tree_mid_plus_group_node", BI.SelectTreeMidPlusGroupNode);/**
 * @class BI.SelectTreeCombo
 * @extends BI.Widget
 */
BI.SelectTreeCombo = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SelectTreeCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-tree-combo",
            height: 30,
            text: "",
            items: []
        });
    },

    _init: function () {
        BI.SelectTreeCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.trigger = BI.createWidget({
            type: "bi.single_tree_trigger",
            text: o.text,
            height: o.height,
            items: o.items
        });

        this.popup = BI.createWidget({
            type: "bi.select_tree_popup",
            items: o.items
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: {
                el: this.popup
            }
        });

        this.combo.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.popup.on(BI.SingleTreePopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.combo.hideView();
        });
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        this.trigger.setValue(v);
        this.popup.setValue(v);
    },

    getValue: function () {
        return this.popup.getValue();
    },

    populate: function (items) {
        this.combo.populate(items);
    }
});


BI.shortcut("bi.select_tree_combo", BI.SelectTreeCombo);/**
 * @class BI.SelectTreeExpander
 * @extends BI.Widget
 */
BI.SelectTreeExpander = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SelectTreeExpander.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-tree-expander",
            trigger: "click",
            toggle: true,
            direction: "bottom",
            isDefaultInit: true,
            el: {},
            popup: {}
        });
    },

    _init: function () {
        BI.SelectTreeExpander.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.trigger = BI.createWidget(BI.extend({stopPropagation: true}, o.el));
        this.trigger.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {
                if (this.isSelected()) {
                    self.expander.setValue([]);
                }
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.expander = BI.createWidget({
            type: "bi.expander",
            element: this,
            trigger: o.trigger,
            toggle: o.toggle,
            direction: o.direction,
            isDefaultInit: o.isDefaultInit,
            el: this.trigger,
            popup: o.popup
        });
        this.expander.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {
                self.trigger.setSelected(false);
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
    },

    setValue: function (v) {
        if (BI.contains(v, this.trigger.getValue())) {
            this.trigger.setSelected(true);
            this.expander.setValue([]);
        } else {
            this.trigger.setSelected(false);
            this.expander.setValue(v);
        }
    },

    getValue: function () {
        if (this.trigger.isSelected()) {
            return [this.trigger.getValue()];
        }
        return this.expander.getValue();
    },

    populate: function (items) {
        this.expander.populate(items);
    }
});

BI.shortcut("bi.select_tree_expander", BI.SelectTreeExpander);/**
 * @class BI.SelectTreePopup
 * @extends BI.Pane
 */

BI.SelectTreePopup = BI.inherit(BI.Pane, {

    _defaultConfig: function () {
        return BI.extend(BI.SelectTreePopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-tree-popup",
            tipText: BI.i18nText("BI-No_Selected_Item"),
            items: []
        });
    },

    _formatItems: function (nodes, layer) {
        var self = this;
        BI.each(nodes, function (i, node) {
            var extend = {layer: layer};
            node.id = node.id || BI.UUID();
            if (node.isParent === true || BI.isNotEmptyArray(node.children)) {
                switch (i) {
                    case 0 :
                        extend.type = "bi.select_tree_first_plus_group_node";
                        break;
                    case nodes.length - 1 :
                        extend.type = "bi.select_tree_last_plus_group_node";
                        break;
                    default :
                        extend.type = "bi.select_tree_mid_plus_group_node";
                        break;
                }
                BI.defaults(node, extend);
                self._formatItems(node.children);
            } else {
                switch (i) {
                    case nodes.length - 1:
                        extend.type = "bi.last_tree_leaf_item";
                        break;
                    default :
                        extend.type = "bi.mid_tree_leaf_item";
                }
                BI.defaults(node, extend);
            }
        });
        return nodes;
    },

    _init: function () {
        BI.SelectTreePopup.superclass._init.apply(this, arguments);

        var self = this, o = this.options;

        this.tree = BI.createWidget({
            type: 'bi.level_tree',
            expander: {
                type: "bi.select_tree_expander",
                isDefaultInit: true
            },
            items: this._formatItems(BI.Tree.transformToTreeFormat(o.items)),
            chooseType: BI.Selection.Single
        });

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [this.tree]
        });

        this.tree.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.tree.on(BI.LevelTree.EVENT_CHANGE, function () {
            self.fireEvent(BI.SelectTreePopup.EVENT_CHANGE);
        });

        this.check();
    },

    getValue: function () {
        return this.tree.getValue();
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        this.tree.setValue(v);
    },

    populate: function (items) {
        BI.SelectTreePopup.superclass.populate.apply(this, arguments);
        this.tree.populate(items);
    }
});

BI.SelectTreePopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.select_tree_popup", BI.SelectTreePopup);/**
 *
 * Created by GUY on 2016/8/10.
 * @class BI.SequenceTableDynamicNumber
 * @extends BI.SequenceTableTreeNumber
 */
BI.SequenceTableDynamicNumber = BI.inherit(BI.SequenceTableTreeNumber, {

    _defaultConfig: function () {
        return BI.extend(BI.SequenceTableDynamicNumber.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-sequence-table-dynamic-number"
        });
    },

    _init: function () {
        BI.SequenceTableDynamicNumber.superclass._init.apply(this, arguments);
    },

    _formatNumber: function (nodes) {
        var self = this, o = this.options;
        var result = [];
        var count = this._getStart(nodes);

        function getLeafCount(node) {
            var cnt = 0;
            if (BI.isNotEmptyArray(node.children)) {
                BI.each(node.children, function (index, child) {
                    cnt += getLeafCount(child);
                });
                if (node.children.length > 1 && BI.isNotEmptyArray(node.values)) {
                    cnt++;
                }
            } else {
                cnt++;
            }
            return cnt;
        }

        var start = 0, top = 0;
        BI.each(nodes, function (i, node) {
            if (BI.isArray(node.children)) {
                BI.each(node.children, function (index, child) {
                    var cnt = getLeafCount(child);
                    result.push({
                        text: count++,
                        start: start,
                        top: top,
                        cnt: cnt,
                        index: index,
                        height: cnt * o.rowSize
                    });
                    start += cnt;
                    top += cnt * o.rowSize;
                });
                if (BI.isNotEmptyArray(node.values)) {
                    result.push({
                        text: BI.i18nText("BI-Summary_Values"),
                        start: start++,
                        top: top,
                        cnt: 1,
                        isSummary: true,
                        height: o.rowSize
                    });
                    top += o.rowSize;
                }
            }
        });
        return result;
    }
});
BI.shortcut('bi.sequence_table_dynamic_number', BI.SequenceTableDynamicNumber);/**
 *
 * Created by GUY on 2016/5/26.
 * @class BI.SequenceTableListNumber
 * @extends BI.Widget
 */
BI.SequenceTableListNumber = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SequenceTableListNumber.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-sequence-table-list-number",
            isNeedFreeze: false,
            scrollTop: 0,
            startSequence: 1,//开始的序号
            headerRowSize: 25,
            rowSize: 25,

            sequenceHeaderCreator: null,

            header: [],
            items: [], //二维数组

            //交叉表头
            crossHeader: [],
            crossItems: [],

            pageSize: 20
        });
    },

    _init: function () {
        BI.SequenceTableListNumber.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.start = o.startSequence;
        this.renderedCells = [];
        this.renderedKeys = [];

        this.container = BI.createWidget({
            type: "bi.absolute",
            width: 60,
            scrollable: false
        });

        this.scrollContainer = BI.createWidget({
            type: "bi.vertical",
            scrollable: false,
            scrolly: false,
            items: [this.container]
        });

        this.headerContainer = BI.createWidget({
            type: "bi.absolute",
            cls: "bi-border",
            width: 58,
            scrollable: false
        });

        this.layout = BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: this.headerContainer,
                height: o.headerRowSize * o.header.length - 2
            }, {
                el: {type: "bi.layout"},
                height: 2
            }, {
                el: this.scrollContainer
            }]
        });
        this._populate();
    },

    _layout: function () {
        var self = this, o = this.options;
        var headerHeight = o.headerRowSize * o.header.length - 2;
        var items = this.layout.attr("items");
        if (o.isNeedFreeze === false) {
            items[0].height = 0;
            items[1].height = 0;
        } else if (o.isNeedFreeze === true) {
            items[0].height = headerHeight;
            items[1].height = 2;
        }
        this.layout.attr("items", items);
        this.layout.resize();
        this.container.setHeight(o.items.length * o.rowSize);
        try {
            this.scrollContainer.element.scrollTop(o.scrollTop);
        } catch (e) {

        }
    },

    _createHeader: function () {
        var o = this.options;
        BI.createWidget({
            type: "bi.absolute",
            element: this.headerContainer,
            items: [{
                el: o.sequenceHeaderCreator || {
                    type: "bi.table_style_cell",
                    cls: "sequence-table-title-cell",
                    styleGetter: o.headerCellStyleGetter,
                    text: BI.i18nText("BI-Number_Index")
                },
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
            }]
        });
    },

    _calculateChildrenToRender: function () {
        var self = this, o = this.options;
        var scrollTop = BI.clamp(o.scrollTop, 0, o.rowSize * o.items.length - (o.height - o.header.length * o.headerRowSize) + BI.DOM.getScrollWidth());
        var start = Math.floor(scrollTop / o.rowSize);
        var end = start + Math.floor((o.height - o.header.length * o.headerRowSize) / o.rowSize);
        var renderedCells = [], renderedKeys = [];
        for (var i = start, cnt = 0; i <= end && i < o.items.length; i++, cnt++) {
            var index = BI.deepIndexOf(this.renderedKeys, this.start + i);
            var top = i * o.rowSize;
            if (index > -1) {
                if (o.rowSize !== this.renderedCells[index]._height) {
                    this.renderedCells[index]._height = o.rowSize;
                    this.renderedCells[index].el.setHeight(o.rowSize);
                }
                if (this.renderedCells[index].top !== top) {
                    this.renderedCells[index].top = top;
                    this.renderedCells[index].el.element.css("top", top + "px");
                }
                renderedCells.push(this.renderedCells[index]);
            } else {
                var child = BI.createWidget(BI.extend({
                    type: "bi.table_style_cell",
                    cls: "sequence-table-number-cell bi-border-left bi-border-right bi-border-bottom",
                    width: 60,
                    height: o.rowSize,
                    text: this.start + i,
                    styleGetter: function (index) {
                        return function () {
                            return o.sequenceCellStyleGetter(self.start + i - 1);
                        }
                    }(cnt)
                }));
                renderedCells.push({
                    el: child,
                    left: 0,
                    top: top,
                    _height: o.rowSize
                });
            }
            renderedKeys.push(this.start + i);
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

    _populate: function () {
        this.headerContainer.empty();
        this._createHeader();
        this._layout();
        this._calculateChildrenToRender();
    },

    setVerticalScroll: function (scrollTop) {
        if (this.options.scrollTop !== scrollTop) {
            this.options.scrollTop = scrollTop;
            try {
                this.scrollContainer.element.scrollTop(scrollTop);
            } catch (e) {

            }
        }
    },

    getVerticalScroll: function () {
        return this.options.scrollTop;
    },

    setVPage: function (v) {
        v = v < 1 ? 1 : v;
        var o = this.options;
        this.start = (v - 1) * o.pageSize + 1;
    },

    _restore: function () {
        var o = this.options;
        BI.each(this.renderedCells, function (i, cell) {
            cell.el.destroy();
        });
        this.renderedCells = [];
        this.renderedKeys = [];
    },

    restore: function () {
        this._restore();
    },

    populate: function (items, header) {
        var o = this.options;
        if (items && items !== this.options.items) {
            o.items = items;
            this._restore();
        }
        if (header && header !== this.options.header) {
            o.header = header;
        }
        this._populate();
    }
});
BI.shortcut('bi.sequence_table_list_number', BI.SequenceTableListNumber);/**
 * 带有序号的表格
 *
 * Created by GUY on 2016/5/26.
 * @class BI.SequenceTable
 * @extends BI.Widget
 */
BI.SequenceTable = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SequenceTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-sequence-table",
            el: {
                type: "bi.adaptive_table"
            },

            sequence: {},

            isNeedResize: true,
            isResizeAdapt: false,

            isNeedFreeze: false,//是否需要冻结单元格
            freezeCols: [], //冻结的列号,从0开始,isNeedFreeze为true时生效

            isNeedMerge: false,//是否需要合并单元格
            mergeCols: [], //合并的单元格列号
            mergeRule: BI.emptyFn,

            columnSize: [],
            minColumnSize: [],
            maxColumnSize: [],
            headerRowSize: 25,
            rowSize: 25,

            regionColumnSize: [],

            headerCellStyleGetter: BI.emptyFn,
            summaryCellStyleGetter: BI.emptyFn,
            sequenceCellStyleGetter: BI.emptyFn,

            header: [],
            items: [], //二维数组

            //交叉表头
            crossHeader: [],
            crossItems: [],

            showSequence: false,
            startSequence: 1//开始的序号
        });
    },

    _init: function () {
        BI.SequenceTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.sequence = BI.createWidget(o.sequence, {
            type: "bi.sequence_table_list_number",
            invisible: o.showSequence === false,
            startSequence: o.startSequence,
            isNeedFreeze: o.isNeedFreeze,
            header: o.header,
            items: o.items,
            crossHeader: o.crossHeader,
            crossItems: o.crossItems,
            headerRowSize: o.headerRowSize,
            rowSize: o.rowSize,
            width: 60,
            height: o.height && o.height - BI.GridTableScrollbar.SIZE,

            headerCellStyleGetter: o.headerCellStyleGetter,
            summaryCellStyleGetter: o.summaryCellStyleGetter,
            sequenceCellStyleGetter: o.sequenceCellStyleGetter
        });
        this.table = BI.createWidget(o.el, {
            type: "bi.adaptive_table",
            width: o.showSequence === true ? o.width - 60 : o.width,
            height: o.height,
            isNeedResize: o.isNeedResize,
            isResizeAdapt: o.isResizeAdapt,

            isNeedFreeze: o.isNeedFreeze,
            freezeCols: o.freezeCols,

            isNeedMerge: o.isNeedMerge,
            mergeCols: o.mergeCols,
            mergeRule: o.mergeRule,

            columnSize: o.columnSize,
            minColumnSize: o.minColumnSize,
            maxColumnSize: o.maxColumnSize,
            headerRowSize: o.headerRowSize,
            rowSize: o.rowSize,

            regionColumnSize: o.regionColumnSize,

            headerCellStyleGetter: o.headerCellStyleGetter,
            summaryCellStyleGetter: o.summaryCellStyleGetter,
            sequenceCellStyleGetter: o.sequenceCellStyleGetter,

            header: o.header,
            items: o.items,
            //交叉表头
            crossHeader: o.crossHeader,
            crossItems: o.crossItems
        });

        this.table.on(BI.Table.EVENT_TABLE_SCROLL, function (scroll) {
            if (self.sequence.getVerticalScroll() !== this.getVerticalScroll()) {
                self.sequence.setVerticalScroll(this.getVerticalScroll());
                self.sequence.populate();
            }
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, function () {
            o.regionColumnSize = this.getRegionColumnSize();
            o.columnSize = this.getColumnSize();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, function () {
            o.regionColumnSize = this.getRegionColumnSize();
            o.columnSize = this.getColumnSize();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, arguments);
        });

        this.htape = BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.sequence,
                left: 0,
                top: 0
            }, {
                el: this.table,
                top: 0,
                left: o.showSequence === true ? 60 : 0
            }]
        });
        this._populate();
    },

    _populate: function () {
        var o = this.options;
        this.sequence.attr({
            items: o.items,
            header: o.header,
            crossItems: o.crossItems,
            crossHeader: o.crossHeader
        });
        if (o.showSequence === true) {
            this.sequence.setVisible(true);
            this.table.element.css("left", "60px");
            this.table.setWidth(o.width - 60);
        } else {
            this.sequence.setVisible(false);
            this.table.element.css("left", "0px");
            this.table.setWidth(o.width);
        }
    },

    setWidth: function (width) {
        BI.PageTable.superclass.setWidth.apply(this, arguments);
        this.table.setWidth(this.options.showSequence ? width - 60 : width);
    },

    setHeight: function (height) {
        BI.PageTable.superclass.setHeight.apply(this, arguments);
        this.table.setHeight(height);
        this.sequence.setHeight(height - BI.GridTableScrollbar.SIZE);
    },

    setColumnSize: function (columnSize) {
        this.options.columnSize = columnSize;
        this.table.setColumnSize(columnSize);
    },

    getColumnSize: function () {
        return this.table.getColumnSize();
    },

    setRegionColumnSize: function (columnSize) {
        this.options.columnSize = columnSize;
        this.table.setRegionColumnSize(columnSize);
    },

    getRegionColumnSize: function () {
        return this.table.getRegionColumnSize();
    },

    hasLeftHorizontalScroll: function () {
        return this.table.hasLeftHorizontalScroll();
    },

    hasRightHorizontalScroll: function () {
        return this.table.hasRightHorizontalScroll();
    },

    setLeftHorizontalScroll: function (scrollLeft) {
        this.table.setLeftHorizontalScroll(scrollLeft);
    },

    setRightHorizontalScroll: function (scrollLeft) {
        this.table.setRightHorizontalScroll(scrollLeft);
    },

    setVerticalScroll: function (scrollTop) {
        this.table.setVerticalScroll(scrollTop);
        this.sequence.setVerticalScroll(scrollTop);
    },

    getVerticalScroll: function () {
        return this.table.getVerticalScroll();
    },

    setVPage: function (page) {
        this.sequence.setVPage && this.sequence.setVPage(page);
    },

    setHPage: function (page) {
        this.sequence.setHPage && this.sequence.setHPage(page);
    },

    attr: function () {
        BI.SequenceTable.superclass.attr.apply(this, arguments);
        this.table.attr.apply(this.table, arguments);
        this.sequence.attr.apply(this.sequence, arguments);
    },

    restore: function () {
        this.table.restore();
        this.sequence.restore();
    },

    populate: function (items, header, crossItems, crossHeader) {
        var o = this.options;
        if (items) {
            o.items = items;
        }
        if (header) {
            o.header = header;
        }
        if (crossItems) {
            o.crossItems = crossItems;
        }
        if (crossHeader) {
            o.crossHeader = crossHeader;
        }
        this._populate();
        this.table.populate.apply(this.table, arguments);
        this.sequence.populate.apply(this.sequence, arguments);
        this.sequence.setVerticalScroll(this.table.getVerticalScroll());
    },

    destroy: function () {
        this.table.destroy();
        BI.SequenceTable.superclass.destroy.apply(this, arguments);
    }
});
BI.shortcut('bi.sequence_table', BI.SequenceTable);/**
 * @class BI.SingleTreeCombo
 * @extends BI.Widget
 */
BI.SingleTreeCombo = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SingleTreeCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-tree-combo",
            trigger: {},
            height: 30,
            text: "",
            items: []
        });
    },

    _init: function () {
        BI.SingleTreeCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.trigger = BI.createWidget(BI.extend({
            type: "bi.single_tree_trigger",
            text: o.text,
            height: o.height,
            items: o.items
        }, o.trigger));

        this.popup = BI.createWidget({
            type: "bi.single_tree_popup",
            items: o.items
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: {
                el: this.popup
            }
        });

        this.combo.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.SingleTreeCombo.EVENT_BEFORE_POPUPVIEW, arguments);
        });

        this.popup.on(BI.SingleTreePopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.combo.hideView();
            self.fireEvent(BI.SingleTreeCombo.EVENT_CHANGE);
        });
    },

    populate: function (items) {
        this.combo.populate(items);
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        this.trigger.setValue(v);
        this.popup.setValue(v);
    },

    getValue: function () {
        return this.popup.getValue();
    }
});

BI.SingleTreeCombo.EVENT_CHANGE = "SingleTreeCombo.EVENT_CHANGE";
BI.SingleTreeCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.shortcut("bi.single_tree_combo", BI.SingleTreeCombo);/**
 * @class BI.SingleTreePopup
 * @extends BI.Pane
 */

BI.SingleTreePopup = BI.inherit(BI.Pane, {

    _defaultConfig: function () {
        return BI.extend(BI.SingleTreePopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-tree-popup",
            tipText: BI.i18nText("BI-No_Selected_Item"),
            items: []
        });
    },

    _init: function () {
        BI.SingleTreePopup.superclass._init.apply(this, arguments);

        var self = this, o = this.options;

        this.tree = BI.createWidget({
            type: 'bi.level_tree',
            expander: {
                isDefaultInit: true
            },
            items: o.items,
            chooseType: BI.Selection.Single
        });

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [this.tree]
        });

        this.tree.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.tree.on(BI.LevelTree.EVENT_CHANGE, function () {
            self.fireEvent(BI.SingleTreePopup.EVENT_CHANGE);
        });

        this.check();
    },

    getValue: function () {
        return this.tree.getValue();
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        this.tree.setValue(v);
    },

    populate: function (items) {
        BI.SingleTreePopup.superclass.populate.apply(this, arguments);
        this.tree.populate(items);
    }
});

BI.SingleTreePopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.single_tree_popup", BI.SingleTreePopup);/**
 * @class BI.SingleTreeTrigger
 * @extends BI.Trigger
 */

BI.SingleTreeTrigger = BI.inherit(BI.Trigger, {

    _defaultConfig: function () {
        return BI.extend(BI.SingleTreeTrigger.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-tree-trigger",
            height: 30,
            text: "",
            items: []
        });
    },

    _init: function () {
        BI.SingleTreeTrigger.superclass._init.apply(this, arguments);

        var self = this, o = this.options;

        this.trigger = BI.createWidget({
            type: "bi.select_text_trigger",
            element: this,
            text: o.text,
            items: o.items,
            height: o.height
        });
    },

    _checkTitle: function () {
        var self = this, val = this.getValue();
        BI.any(this.options.items, function (i, item) {
            if (val.contains(item.value)) {
                self.trigger.setTitle(item.text || item.value);
                return true;
            }
        });
    },

    setValue: function (v) {
        v = BI.isArray(v) ? v : [v];
        this.options.value = v;
        this.trigger.setValue(v);
        this._checkTitle();
    },

    getValue: function () {
        return this.options.value || [];
    },

    populate: function (items) {
        BI.SingleTreeTrigger.superclass.populate.apply(this, arguments);
        this.trigger.populate(items);
    }

});

BI.shortcut("bi.single_tree_trigger", BI.SingleTreeTrigger);/**
 * 可以单选多选切换的树
 *
 * Created by GUY on 2015/12/21.
 * @class BI.SwitchTree
 * @extends BI.Widget
 */
BI.SwitchTree = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SwitchTree.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-switch-tree",
            items: []
        });
    },

    _init: function () {
        BI.SwitchTree.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.tab = BI.createWidget({
            type: "bi.tab",
            element: this,
            tab: null,
            defaultShowIndex: BI.SwitchTree.SelectType.SingleSelect,
            cardCreator: BI.bind(this._createTree, this)
        });
    },

    _createTree: function (type) {
        var self = this, o = this.options;
        switch (type) {
            case BI.SwitchTree.SelectType.SingleSelect:
                this.levelTree = BI.createWidget({
                    type: "bi.multilayer_single_level_tree",
                    isDefaultInit: true,
                    items: BI.deepClone(o.items)
                });
                this.levelTree.on(BI.LevelTree.EVENT_CHANGE, function () {
                    self.fireEvent(BI.SwitchTree.EVENT_CHANGE, arguments);
                });
                return this.levelTree;
            case BI.SwitchTree.SelectType.MultiSelect:
                this.tree = BI.createWidget({
                    type: "bi.simple_tree",
                    items: this._removeIsParent(BI.deepClone(o.items))
                });
                this.tree.on(BI.SimpleTreeView.EVENT_CHANGE, function () {
                    self.fireEvent(BI.SwitchTree.EVENT_CHANGE, arguments);
                });
                return this.tree;
        }
    },

    _removeIsParent: function(items) {
        BI.each(items, function(i, item) {
            BI.isNotNull(item.isParent) && delete item.isParent;
        });
        return items;
    },

    switchSelect: function () {
        switch (this.getSelect()) {
            case BI.SwitchTree.SelectType.SingleSelect:
                this.setSelect(BI.SwitchTree.SelectType.MultiSelect);
                break;
            case BI.SwitchTree.SelectType.MultiSelect:
                this.setSelect(BI.SwitchTree.SelectType.SingleSelect);
                break;
        }
    },

    setSelect: function (v) {
        this.tab.setSelect(v);
    },

    getSelect: function () {
        return this.tab.getSelect();
    },

    setValue: function (v) {
        this.storeValue = v;
        switch (this.getSelect()) {
            case BI.SwitchTree.SelectType.SingleSelect:
                this.levelTree.setValue(v);
                break;
            case BI.SwitchTree.SelectType.MultiSelect:
                this.tree.setValue(v);
                break;
        }
    },

    getValue: function () {
        return this.tab.getValue();
    },

    populate: function (items) {
        this.options.items = items;
        if (BI.isNotNull(this.levelTree)) {
            this.levelTree.populate(BI.deepClone(items));
        }
        if (BI.isNotNull(this.tree)) {
            this.tree.populate(this._removeIsParent(BI.deepClone(items)));
        }
    }
});
BI.SwitchTree.EVENT_CHANGE = "SwitchTree.EVENT_CHANGE";
BI.SwitchTree.SelectType = {
    SingleSelect: BI.Selection.Single,
    MultiSelect: BI.Selection.Multi
};
BI.shortcut('bi.switch_tree', BI.SwitchTree);
/**
 * 年份下拉框
 *
 * Created by GUY on 2015/8/28.
 * @class BI.YearCombo
 * @extends BI.Widget
 */
BI.YearCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.YearCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-year-combo",
            min: '1900-01-01', //最小日期
            max: '2099-12-31', //最大日期
            height: 25
        });
    },
    _init: function () {
        BI.YearCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.storeValue = "";
        this.trigger = BI.createWidget({
            type: "bi.year_trigger",
            min: o.min,
            max: o.max
        });
        this.trigger.on(BI.YearTrigger.EVENT_FOCUS, function () {
            self.storeValue = this.getKey();
        });
        this.trigger.on(BI.YearTrigger.EVENT_START, function () {
            self.combo.isViewVisible() && self.combo.hideView();
        });
        this.trigger.on(BI.YearTrigger.EVENT_STOP, function () {
            self.combo.showView();
        });
        this.trigger.on(BI.YearTrigger.EVENT_ERROR, function () {
            self.combo.isViewVisible() && self.combo.hideView();
        });
        this.trigger.on(BI.YearTrigger.EVENT_CONFIRM, function () {
            if(self.combo.isViewVisible()) {
                return;
            }
            if (this.getKey() && this.getKey() !== self.storeValue) {
                self.setValue(this.getKey());
            } else if (!this.getKey()) {
                self.setValue();
            }
            self.fireEvent(BI.YearCombo.EVENT_CONFIRM);
        });

        this.popup = BI.createWidget({
            type: "bi.year_popup",
            min: o.min,
            max: o.max
        });

        this.popup.on(BI.YearPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.combo.hideView();
            self.fireEvent(BI.YearCombo.EVENT_CONFIRM);
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            isNeedAdjustHeight: false,
            isNeedAdjustWidth: false,
            el: this.trigger,
            popup: {
                minWidth: 85,
                stopPropagation: false,
                el: this.popup
            }
        });
        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            var value = self.trigger.getKey();
            if (BI.isNotNull(value)) {
                self.popup.setValue(value);
            } else if(!value && value !== self.storeValue){
                self.popup.setValue(self.storeValue);
            }else {
                self.setValue();
            }
        });
    },

    setValue: function (v) {
        this.trigger.setValue(v);
        this.popup.setValue(v);
    },

    getValue: function () {
        return this.popup.getValue();
    }
});
BI.YearCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.shortcut('bi.year_combo', BI.YearCombo);/**
 * 年份展示面板
 *
 * Created by GUY on 2015/9/2.
 * @class BI.YearPopup
 * @extends BI.Trigger
 */
BI.YearPopup = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.YearPopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-year-popup",
            min: '1900-01-01', //最小日期
            max: '2099-12-31' //最大日期
        });
    },

    _createYearCalendar: function (v) {
        var o = this.options, y = this._year;

        var calendar = BI.createWidget({
            type: "bi.year_calendar",
            min: o.min,
            max: o.max,
            logic: {
                dynamic: true
            },
            year: y + v * 12
        });
        calendar.setValue(this._year);
        return calendar;
    },

    _init: function () {
        BI.YearPopup.superclass._init.apply(this, arguments);
        var self = this;

        this.selectedYear = this._year = new Date().getFullYear();

        var backBtn = BI.createWidget({
            type: "bi.icon_button",
            cls: "pre-page-h-font",
            width: 25,
            height: 25,
            value: -1
        });

        var preBtn = BI.createWidget({
            type: "bi.icon_button",
            cls: "next-page-h-font",
            width: 25,
            height: 25,
            value: 1
        });

        this.navigation = BI.createWidget({
            type: "bi.navigation",
            element: this,
            logic: {
                dynamic: true
            },
            tab: {
                cls: "year-popup-navigation bi-border-top",
                height: 25,
                items: [backBtn, preBtn]
            },
            cardCreator: BI.bind(this._createYearCalendar, this),

            afterCardShow: function () {
                this.setValue(self.selectedYear);
                var calendar = this.getSelectedCard();
                backBtn.setEnable(!calendar.isFrontYear());
                preBtn.setEnable(!calendar.isFinalYear());
            }
        });

        this.navigation.on(BI.Navigation.EVENT_CHANGE, function () {
            self.selectedYear = this.getValue();
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            self.fireEvent(BI.YearPopup.EVENT_CHANGE, self.selectedYear);
        });
    },

    getValue: function () {
        return this.selectedYear;
    },

    setValue: function (v) {
        var o = this.options;
        if (Date.checkVoid(v, 1, 1, o.min, o.max)[0]) {
            v = new Date().getFullYear();
            this.selectedYear = "";
            this.navigation.setSelect(BI.YearCalendar.getPageByYear(v));
            this.navigation.setValue("");
        } else {
            this.selectedYear = v;
            this.navigation.setSelect(BI.YearCalendar.getPageByYear(v));
            this.navigation.setValue(v);
        }
    }
});
BI.YearPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.year_popup", BI.YearPopup);/**
 * 年份trigger
 *
 * Created by GUY on 2015/8/21.
 * @class BI.YearTrigger
 * @extends BI.Trigger
 */
BI.YearTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4,
        vgap: 2,
        triggerWidth: 25,
        errorText: BI.i18nText("BI-Please_Input_Positive_Integer"),
        errorTextInvalid: BI.i18nText("BI-Year_Trigger_Invalid_Text")
    },

    _defaultConfig: function () {
        return BI.extend(BI.YearTrigger.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-year-trigger bi-border",
            min: '1900-01-01', //最小日期
            max: '2099-12-31', //最大日期
            height: 25
        });
    },
    _init: function () {
        BI.YearTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            height: o.height,
            validationChecker: function (v) {
                self.editor.setErrorText(!BI.isPositiveInteger(v) ? c.errorText : c.errorTextInvalid);
                return v === "" || (BI.isPositiveInteger(v) && !Date.checkVoid(v, 1, 1, o.min, o.max)[0]);
            },
            quitChecker: function (v) {
                return false;
            },
            hgap: c.hgap,
            vgap: c.vgap,
            allowBlank: true,
            errorText: c.errorText
        })
        this.editor.on(BI.SignEditor.EVENT_FOCUS, function () {
            self.fireEvent(BI.YearTrigger.EVENT_FOCUS);
        });
        this.editor.on(BI.SignEditor.EVENT_STOP, function () {
            self.fireEvent(BI.YearTrigger.EVENT_STOP);
        });
        this.editor.on(BI.SignEditor.EVENT_CONFIRM, function () {
            var value = self.editor.getValue();
            if (BI.isNotNull(value)) {
                self.editor.setValue(value);
                self.editor.setTitle(value);
            }
            self.fireEvent(BI.YearTrigger.EVENT_CONFIRM);
        });
        this.editor.on(BI.SignEditor.EVENT_SPACE, function () {
            if (self.editor.isValid()) {
                self.editor.blur();
            }
        });
        this.editor.on(BI.SignEditor.EVENT_START, function () {
            self.fireEvent(BI.YearTrigger.EVENT_START);
        });
        this.editor.on(BI.SignEditor.EVENT_ERROR, function () {
            self.fireEvent(BI.YearTrigger.EVENT_ERROR);
        });
        BI.createWidget({
            element: this,
            type: 'bi.htape',
            items: [
                {
                    el: this.editor
                }, {
                    el: {
                        type: "bi.text_button",
                        baseCls: "bi-trigger-year-text",
                        text: BI.i18nText("BI-Multi_Date_Year"),
                        width: c.triggerWidth
                    },
                    width: c.triggerWidth
                }, {
                    el: {
                        type: "bi.trigger_icon_button",
                        width: c.triggerWidth
                    },
                    width: c.triggerWidth
                }
            ]
        });
    },
    setValue: function (v) {
        this.editor.setState(v);
        this.editor.setValue(v);
        this.editor.setTitle(v);
    },
    getKey: function () {
        return this.editor.getValue() | 0;
    }
});
BI.YearTrigger.EVENT_FOCUS = "EVENT_FOCUS";
BI.YearTrigger.EVENT_ERROR = "EVENT_ERROR";
BI.YearTrigger.EVENT_START = "EVENT_START";
BI.YearTrigger.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.YearTrigger.EVENT_STOP = "EVENT_STOP";
BI.shortcut("bi.year_trigger", BI.YearTrigger);/**
 * 年份 + 月份下拉框
 *
 * @class BI.YearMonthCombo
 * @extends BI.Widget
 */
BI.YearMonthCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.YearMonthCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-year-month-combo",
            height: 25
        });
    },
    _init: function () {
        BI.YearMonthCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.year = BI.createWidget({
            type: "bi.year_combo"
        });

        this.month = BI.createWidget({
            type: "bi.month_combo"
        });

        this.year.on(BI.YearCombo.EVENT_CONFIRM, function(){
            self.fireEvent(BI.YearMonthCombo.EVENT_CONFIRM);
        });

        this.month.on(BI.MonthCombo.EVENT_CONFIRM, function(){
            self.fireEvent(BI.YearMonthCombo.EVENT_CONFIRM);
        });

        BI.createWidget({
            type: "bi.center",
            element: this,
            hgap: 5,
            items: [this.year, this.month]
        });

    },

    setValue: function (v) {
        v = v || {};
        this.month.setValue(v.month);
        this.year.setValue(v.year);
    },

    getValue: function () {
        return {
            year: this.year.getValue(),
            month: this.month.getValue()
        };
    }
});
BI.YearMonthCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.shortcut('bi.year_month_combo', BI.YearMonthCombo);/**
 * 年份 + 月份下拉框
 *
 * @class BI.YearQuarterCombo
 * @extends BI.Widget
 */
BI.YearQuarterCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.YearQuarterCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-year-quarter-combo",
            height: 25
        });
    },
    _init: function () {
        BI.YearQuarterCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.year = BI.createWidget({
            type: "bi.year_combo"
        });

        this.quarter = BI.createWidget({
            type: "bi.quarter_combo"
        });

        this.year.on(BI.YearCombo.EVENT_CONFIRM, function(){
            self.fireEvent(BI.YearQuarterCombo.EVENT_CONFIRM);
        });

        this.quarter.on(BI.QuarterCombo.EVENT_CONFIRM, function(){
            self.fireEvent(BI.YearQuarterCombo.EVENT_CONFIRM);
        });

        BI.createWidget({
            type: "bi.center",
            element: this,
            hgap: 5,
            items: [this.year, this.quarter]
        });

    },

    setValue: function (v) {
        v = v || {};
        this.quarter.setValue(v.quarter);
        this.year.setValue(v.year);
    },

    getValue: function () {
        return {
            year: this.year.getValue(),
            quarter: this.quarter.getValue()
        };
    }
});
BI.YearQuarterCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.shortcut('bi.year_quarter_combo', BI.YearQuarterCombo);/**
 * 简单的复选下拉框控件, 适用于数据量少的情况， 与valuechooser的区别是allvaluechooser setValue和getValue返回的是所有值
 * 封装了字段处理逻辑
 *
 * Created by GUY on 2015/10/29.
 * @class BI.AbstractAllValueChooser
 * @extends BI.Widget
 */
BI.AbstractAllValueChooser = BI.inherit(BI.Widget, {

    _const: {
        perPage: 100
    },

    _defaultConfig: function () {
        return BI.extend(BI.AbstractAllValueChooser.superclass._defaultConfig.apply(this, arguments), {
            width: 200,
            height: 30,
            items: null,
            itemsCreator: BI.emptyFn,
            cache: true
        });
    },

    _valueFormatter: function (v) {
        var text = v;
        if (BI.isNotNull(this.items)) {
            BI.some(this.items, function (i, item) {
                if (item.value === v) {
                    text = item.text;
                    return true;
                }
            });
        }
        return text;
    },

    _itemsCreator: function (options, callback) {
        var self = this, o = this.options;
        if (!o.cache || !this.items) {
            o.itemsCreator({}, function (items) {
                self.items = items;
                call(items);
            });
        } else {
            call(this.items);
        }
        function call(items) {
            var keywords = (options.keywords || []).slice();
            if (options.keyword) {
                keywords.push(options.keyword);
            }
            BI.each(keywords, function (i, kw) {
                var search = BI.Func.getSearchResult(items, kw);
                items = search.matched.concat(search.finded);
            });
            if (options.selectedValues) {//过滤
                var filter = BI.makeObject(options.selectedValues, true);
                items = BI.filter(items, function (i, ob) {
                    return !filter[ob.value];
                });
            }
            if (options.type === BI.MultiSelectCombo.REQ_GET_ALL_DATA) {
                callback({
                    items: items
                });
                return;
            }
            if (options.type === BI.MultiSelectCombo.REQ_GET_DATA_LENGTH) {
                callback({count: items.length});
                return;
            }
            callback({
                items: items,
                hasNext: false
            });
        }
    }
});/**
 * 简单的复选下拉框控件, 适用于数据量少的情况， 与valuechooser的区别是allvaluechooser setValue和getValue返回的是所有值
 * 封装了字段处理逻辑
 *
 * Created by GUY on 2015/10/29.
 * @class BI.AllValueChooserCombo
 * @extends BI.AbstractAllValueChooser
 */
BI.AllValueChooserCombo = BI.inherit(BI.AbstractAllValueChooser, {

    _defaultConfig: function () {
        return BI.extend(BI.AllValueChooserCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-all-value-chooser-combo",
            width: 200,
            height: 30,
            items: null,
            itemsCreator: BI.emptyFn,
            cache: true
        });
    },

    _init: function () {
        BI.AllValueChooserCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        if (BI.isNotNull(o.items)) {
            this.items = o.items;
        }
        this.combo = BI.createWidget({
            type: 'bi.multi_select_combo',
            element: this,
            itemsCreator: BI.bind(this._itemsCreator, this),
            valueFormatter: BI.bind(this._valueFormatter, this),
            width: o.width,
            height: o.height
        });

        this.combo.on(BI.MultiSelectCombo.EVENT_CONFIRM, function () {
            self.fireEvent(BI.AllValueChooserCombo.EVENT_CONFIRM);
        });
    },

    setValue: function (v) {
        this.combo.setValue({
            type: BI.Selection.Multi,
            value: v || []
        });
    },

    getValue: function () {
        var val = this.combo.getValue() || {};
        if (val.type === BI.Selection.All) {
            return val.assist;
        }
        return val.value || [];
    },

    populate: function () {
        this.combo.populate.apply(this, arguments);
    }
});
BI.AllValueChooserCombo.EVENT_CONFIRM = "AllValueChooserCombo.EVENT_CONFIRM";
BI.shortcut('bi.all_value_chooser_combo', BI.AllValueChooserCombo);/**
 * 简单的复选下拉框控件, 适用于数据量少的情况， 与valuechooser的区别是allvaluechooser setValue和getValue返回的是所有值
 * 封装了字段处理逻辑
 *
 * Created by GUY on 2015/10/29.
 * @class BI.AllValueChooserPane
 * @extends BI.AbstractAllValueChooser
 */
BI.AllValueChooserPane = BI.inherit(BI.AbstractAllValueChooser, {

    _defaultConfig: function () {
        return BI.extend(BI.AllValueChooserPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-all-value-chooser-pane",
            width: 200,
            height: 30,
            items: null,
            itemsCreator: BI.emptyFn,
            cache: true
        });
    },

    _init: function () {
        BI.AllValueChooserPane.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        if (BI.isNotNull(o.items)) {
            this.items = o.items;
        }
        this.list = BI.createWidget({
            type: 'bi.multi_select_list',
            element: this,
            itemsCreator: BI.bind(this._itemsCreator, this),
            valueFormatter: BI.bind(this._valueFormatter, this),
            width: o.width,
            height: o.height
        });

        this.list.on(BI.MultiSelectList.EVENT_CHANGE, function () {
            self.fireEvent(BI.AllValueChooserPane.EVENT_CHANGE);
        });
    },

    setValue: function (v) {
        this.list.setValue({
            type: BI.Selection.Multi,
            value: v || []
        });
    },

    getValue: function () {
        var val = this.list.getValue() || {};
        if (val.type === BI.Selection.All) {
            return val.assist;
        }
        return val.value || [];
    },

    populate: function () {
        this.list.populate.apply(this.list, arguments);
    }
});
BI.AllValueChooserPane.EVENT_CHANGE = "AllValueChooserPane.EVENT_CHANGE";
BI.shortcut('bi.all_value_chooser_pane', BI.AllValueChooserPane);BI.AbstractTreeValueChooser = BI.inherit(BI.Widget, {

    _const: {
        perPage: 100
    },

    _defaultConfig: function () {
        return BI.extend(BI.AbstractTreeValueChooser.superclass._defaultConfig.apply(this, arguments), {
            items: null,
            itemsCreator: BI.emptyFn
        });
    },

    _initData: function (items) {
        this.items = items;
        var nodes = BI.Tree.treeFormat(items);
        this.tree = new BI.Tree();
        this.tree.initTree(nodes);
    },

    _itemsCreator: function (options, callback) {
        var self = this, o = this.options;
        if (!this.items) {
            o.itemsCreator({}, function (items) {
                self._initData(items);
                call();
            });
        } else {
            call();
        }
        function call() {
            switch (options.type) {
                case BI.TreeView.REQ_TYPE_INIT_DATA:
                    self._reqInitTreeNode(options, callback);
                    break;
                case BI.TreeView.REQ_TYPE_ADJUST_DATA:
                    self._reqAdjustTreeNode(options, callback);
                    break;
                case BI.TreeView.REQ_TYPE_SELECT_DATA:
                    self._reqSelectedTreeNode(options, callback);
                    break;
                case BI.TreeView.REQ_TYPE_GET_SELECTED_DATA:
                    self._reqDisplayTreeNode(options, callback);
                    break;
                default :
                    self._reqTreeNode(options, callback);
                    break;
            }
        }
    },

    _reqDisplayTreeNode: function (op, callback) {
        var self = this;
        var result = [];
        var selectedValues = op.selectedValues;

        if (selectedValues == null || BI.isEmpty(selectedValues)) {
            callback({});
            return;
        }

        doCheck([], this.tree.getRoot(), selectedValues);

        callback({
            items: result
        });

        function doCheck(parentValues, node, selected) {
            if (selected == null || BI.isEmpty(selected)) {
                BI.each(node.getChildren(), function (i, child) {
                    var newParents = BI.clone(parentValues);
                    newParents.push(child.value);
                    var llen = self._getChildCount(newParents);
                    createOneJson(child, node.id, llen);
                    doCheck(newParents, child, {});
                });
                return;
            }
            BI.each(selected, function (k) {
                var node = self._getTreeNode(parentValues, k);
                var newParents = BI.clone(parentValues);
                newParents.push(node.value);
                createOneJson(node, BI.last(parentValues), getCount(selected[k], newParents));
                doCheck(newParents, node, selected[k]);
            })
        }

        function getCount(jo, parentValues) {
            if (jo == null) {
                return 0;
            }
            if (BI.isEmpty(jo)) {
                return self._getChildCount(parentValues);
            }

            return BI.size(jo);
        }

        function createOneJson(node, pId, llen) {
            result.push({
                id: node.id,
                pId: pId,
                text: node.text + (llen > 0 ? ("(" + BI.i18nText("BI-Basic_Altogether") + llen + BI.i18nText("BI-Basic_Count") + ")") : ""),
                value: node.value,
                open: true
            });
        }
    },

    _reqSelectedTreeNode: function (op, callback) {
        var self = this;
        var selectedValues = BI.deepClone(op.selectedValues);
        var notSelectedValue = op.notSelectedValue || {};
        var keyword = op.keyword || "";
        var parentValues = op.parentValues || [];

        if (selectedValues == null || BI.isEmpty(selectedValues)) {
            callback({});
            return;
        }

        dealWithSelectedValues(selectedValues);
        callback(selectedValues);


        function dealWithSelectedValues(selectedValues) {
            var p = parentValues.concat(notSelectedValue);
            //存储的值中存在这个值就把它删掉
            if (canFindKey(selectedValues, p)) {
                //如果搜索的值在父亲链中
                if (isSearchValueInParent(p)) {
                    self._deleteNode(selectedValues, p);
                } else {
                    var searched = [];
                    var finded = search(parentValues, notSelectedValue, [], searched);
                    if (finded && BI.isNotEmptyArray(searched)) {
                        BI.each(searched, function (i, arr) {
                            self._deleteNode(selectedValues, arr);
                        })
                    }
                }
            }

            //存储的值中不存在这个值，但父亲节点是全选的情况
            if (isChild(selectedValues, p)) {
                var result = [], finded = false;
                //如果parentValues中有匹配的值，说明搜索结果不在当前值下
                if (isSearchValueInParent(p)) {
                    finded = true;
                } else {
                    //从当前值开始搜
                    finded = search(parentValues, notSelectedValue, result);
                    p = parentValues;
                }

                if (finded === true) {
                    var next = selectedValues;
                    BI.each(p, function (i, v) {
                        var t = next[v];
                        if (t == null) {
                            if (BI.isEmpty(next)) {
                                var split = p.slice(0, i);
                                var expanded = self._getChildren(split);
                                BI.each(expanded, function (m, child) {
                                    if (i === p.length - 1 && child.value === notSelectedValue) {
                                        return true;
                                    }
                                    next[child.value] = {};
                                });
                                next = next[v];
                            } else {
                                next = {};
                                next[v] = {};
                            }
                        } else {
                            next = t;
                        }
                    });

                    if (result.length > 0) {
                        BI.each(result, function (i, strs) {
                            self._buildTree(selectedValues, strs);
                        })
                    }
                }
            }

        }

        function search(parents, current, result, searched) {
            var newParents = BI.clone(parents);
            newParents.push(current);
            if (self._isMatch(current, keyword)) {
                searched && searched.push(newParents);
                return true;
            }

            var children = self._getChildren(newParents);

            var notSearch = [];
            var can = false;

            BI.each(children, function (i, child) {
                if (search(newParents, child.value, result, searched)) {
                    can = true;
                } else {
                    notSearch.push(child.value);
                }
            });
            if (can === true) {
                BI.each(notSearch, function (i, v) {
                    var next = BI.clone(newParents);
                    next.push(v);
                    result.push(next);
                });
            }
            return can;
        }

        function isSearchValueInParent(parentValues) {
            for (var i = 0, len = parentValues.length; i < len; i++) {
                if (self._isMatch(parentValues[i], keyword)) {
                    return true;
                }
            }
            return false;
        }

        function canFindKey(selectedValues, parents) {
            var t = selectedValues;
            for (var i = 0; i < parents.length; i++) {
                var v = parents[i];
                t = t[v];
                if (t == null) {
                    return false;
                }
            }
            return true;
        }

        function isChild(selectedValues, parents) {
            var t = selectedValues;
            for (var i = 0; i < parents.length; i++) {
                var v = parents[i];
                if (!BI.has(t, v)) {
                    return false;
                }
                t = t[v];
                if (BI.isEmpty(t)) {
                    return true;
                }
            }
            return false;
        }
    },

    _reqAdjustTreeNode: function (op, callback) {
        var self = this;
        var result = [];
        var selectedValues = op.selectedValues;
        if (selectedValues == null || BI.isEmpty(selectedValues)) {
            callback({});
            return;
        }
        BI.each(selectedValues, function (k, v) {
            result.push([k]);
        });

        dealWithSelectedValues(selectedValues, []);

        var jo = {};
        BI.each(result, function (i, strs) {
            self._buildTree(jo, strs);
        });
        callback(jo);

        function dealWithSelectedValues(selected, parents) {
            if (selected == null || BI.isEmpty(selected)) {
                return true;
            }
            var can = true;
            BI.each(selected, function (k, v) {
                var p = BI.clone(parents);
                p.push(k);
                if (!dealWithSelectedValues(selected[k], p)) {
                    BI.each(selected[k], function (nk, nv) {
                        var t = BI.clone(p);
                        t.push(nk);
                        result.push(t);
                    });
                    can = false;
                }
            });
            return can && isAllSelected(selected, parents);
        }

        function isAllSelected(selected, parents) {
            return BI.isEmpty(selected) || self._getChildCount(parents) === BI.size(selected);
        }
    },

    _reqInitTreeNode: function (op, callback) {
        var self = this;
        var result = [];
        var keyword = op.keyword || "";
        var selectedValues = op.selectedValues;
        var lastSearchValue = op.lastSearchValue || "";
        var output = search();
        BI.nextTick(function () {
            callback({
                hasNext: output.length > self._const.perPage,
                items: result,
                lastSearchValue: BI.last(output)
            })
        });

        function search() {
            var children = self._getChildren([]);
            var start = children.length;
            if (lastSearchValue !== "") {
                for (var j = 0, len = start; j < len; j++) {
                    if (children[j].value === lastSearchValue) {
                        start = j + 1;
                        break;
                    }
                }
            } else {
                start = 0;
            }
            var output = [];
            for (var i = start, len = children.length; i < len; i++) {
                if (output.length < self._const.perPage) {
                    var find = nodeSearch(1, [], children[i].value, false, result);
                } else if (output.length === self._const.perPage) {
                    var find = nodeSearch(1, [], children[i].value, false, []);
                }
                if (find[0] === true) {
                    output.push(children[i].value);
                }
                if (output.length > self._const.perPage) {
                    break;
                }
            }
            return output;
        }

        function nodeSearch(deep, parentValues, current, isAllSelect, result) {
            if (self._isMatch(current, keyword)) {
                var checked = isAllSelect || isSelected(parentValues, current);
                createOneJson(parentValues, current, false, checked, !isAllSelect && isHalf(parentValues, current), true, result);
                return [true, checked];
            }
            var newParents = BI.clone(parentValues);
            newParents.push(current);
            var children = self._getChildren(newParents);

            var can = false, checked = false;

            var isCurAllSelected = isAllSelect || isAllSelected(parentValues, current);
            BI.each(children, function (i, child) {
                var state = nodeSearch(deep + 1, newParents, child.value, isCurAllSelected, result);
                if (state[1] === true) {
                    checked = true;
                }
                if (state[0] === true) {
                    can = true;
                }
            });
            if (can === true) {
                checked = isCurAllSelected || (isSelected(parentValues, current) && checked);
                createOneJson(parentValues, current, true, checked, false, false, result);
            }
            return [can, checked];
        }

        function createOneJson(parentValues, value, isOpen, checked, half, flag, result) {
            var node = self._getTreeNode(parentValues, value)
            result.push({
                id: node.id,
                pId: node.pId,
                text: node.text,
                value: node.value,
                title: node.title,
                isParent: node.getChildrenLength() > 0,
                open: isOpen,
                checked: checked,
                halfCheck: half,
                flag: flag
            });
        }

        function isHalf(parentValues, value) {
            var find = findSelectedObj(parentValues);
            if (find == null) {
                return null;
            }
            return BI.any(find, function (v, ob) {
                if (v === value) {
                    if (ob != null && !BI.isEmpty(ob)) {
                        return true;
                    }
                }
            });
        }

        function isAllSelected(parentValues, value) {
            var find = findSelectedObj(parentValues);
            if (find == null) {
                return null;
            }
            return BI.any(find, function (v, ob) {
                if (v === value) {
                    if (ob != null && BI.isEmpty(ob)) {
                        return true;
                    }
                }
            });
        }

        function isSelected(parentValues, value) {
            var find = findSelectedObj(parentValues);
            if (find == null) {
                return false;
            }
            return BI.any(find, function (v) {
                if (v === value) {
                    return true;
                }
            });
        }

        function findSelectedObj(parentValues) {
            var find = selectedValues;
            if (find == null) {
                return null;
            }
            BI.every(parentValues, function (i, v) {
                find = find[v];
                if (find == null) {
                    return false;
                }
                return true;
            });
            return find;
        }
    },

    _reqTreeNode: function (op, callback) {
        var self = this;
        var result = [];
        var times = op.times;
        var checkState = op.checkState || {};
        var parentValues = op.parentValues || [];
        var selectedValues = op.selectedValues || {};
        var valueMap = {};
        // if (judgeState(parentValues, selectedValues, checkState)) {
        valueMap = dealWidthSelectedValue(parentValues, selectedValues);
        // }
        var nodes = this._getChildren(parentValues);
        for (var i = (times - 1) * this._const.perPage; nodes[i] && i < times * this._const.perPage; i++) {
            var state = getCheckState(nodes[i].value, parentValues, valueMap, checkState);
            result.push({
                id: nodes[i].id,
                pId: nodes[i].pId,
                value: nodes[i].value,
                text: nodes[i].text,
                times: 1,
                isParent: nodes[i].getChildrenLength() > 0,
                checked: state[0],
                halfCheck: state[1]
            })
        }
        BI.nextTick(function () {
            callback({
                items: result,
                hasNext: nodes.length > times * self._const.perPage
            });
        });

        function judgeState(parentValues, selected_value, checkState) {
            var checked = checkState.checked, half = checkState.half;
            if (parentValues.length > 0 && !checked) {
                return false;
            }
            return (parentValues.length === 0 || (checked && half) && !BI.isEmpty(selected_value));
        }

        function dealWidthSelectedValue(parentValues, selectedValues) {
            var valueMap = {};
            BI.each(parentValues, function (i, v) {
                selectedValues = selectedValues[v] || {};
            });
            BI.each(selectedValues, function (value, obj) {
                if (BI.isNull(obj)) {
                    valueMap[value] = [0, 0];
                    return;
                }
                if (BI.isEmpty(obj)) {
                    valueMap[value] = [2, 0];
                    return;
                }
                var nextNames = {};
                BI.each(obj, function (t, o) {
                    if (BI.isNull(o) || BI.isEmpty(o)) {
                        nextNames[t] = true;
                    }
                });
                valueMap[value] = [1, BI.size(nextNames)];
            });
            return valueMap;
        }

        function getCheckState(current, parentValues, valueMap, checkState) {
            var checked = checkState.checked, half = checkState.half;
            var tempCheck = false, halfCheck = false;
            if (BI.has(valueMap, current)) {
                //可能是半选
                if (valueMap[current][0] === 1) {
                    var values = BI.clone(parentValues);
                    values.push(current);
                    var childCount = self._getChildCount(values);
                    if (childCount > 0 && childCount !== valueMap[current][1]) {
                        halfCheck = true;
                    }
                } else if (valueMap[current][0] === 2) {
                    tempCheck = true;
                }
            }
            var check;
            if (!checked && !halfCheck && !tempCheck) {
                check = BI.has(valueMap, current);
            } else {
                check = ((tempCheck || checked) && !half) || BI.has(valueMap, current);
            }
            return [check, halfCheck];
        }
    },

    _getNode: function (selectedValues, parentValues) {
        var pNode = selectedValues;
        for (var i = 0, len = parentValues.length; i < len; i++) {
            if (pNode == null) {
                return null;
            }
            pNode = pNode[parentValues[i]];
        }
        return pNode;
    },

    _deleteNode: function (selectedValues, values) {
        var name = values[values.length - 1];
        var p = values.slice(0, values.length - 1);
        var pNode = this._getNode(selectedValues, p);
        if (pNode[name]) {
            delete pNode[name];
            //递归删掉空父节点
            while (p.length > 0 && BI.isEmpty(pNode)) {
                name = p[p.length - 1];
                p = p.slice(0, p.length - 1);
                pNode = this._getNode(selectedValues, p);
                delete pNode[name];
            }
        }
    },

    _buildTree: function (jo, values) {
        var t = jo;
        BI.each(values, function (i, v) {
            if (!BI.has(t, v)) {
                t[v] = {};
            }
            t = t[v];
        });
    },

    _isMatch: function (value, keyword) {
        var finded = BI.Func.getSearchResult([value], keyword);
        return finded.finded.length > 0 || finded.matched.length > 0;
    },

    _getTreeNode: function (parentValues, v) {
        var self = this;
        var findedParentNode;
        var index = 0;
        this.tree.traverse(function (node) {
            if (self.tree.isRoot(node)) {
                return;
            }
            if (index > parentValues.length) {
                return false;
            }
            if (index === parentValues.length && node.value === v) {
                findedParentNode = node;
                return false;
            }
            if (node.value === parentValues[index]) {
                index++;
                return;
            }
            return true;
        });
        return findedParentNode;
    },

    _getChildren: function (parentValues) {
        if (parentValues.length > 0) {
            var value = BI.last(parentValues);
            var parent = this._getTreeNode(parentValues.slice(0, parentValues.length - 1), value);
        } else {
            var parent = this.tree.getRoot();
        }
        return parent.getChildren();
    },

    _getChildCount: function (parentValues) {
        return this._getChildren(parentValues).length;
    }
});/**
 * 简单的复选下拉树控件, 适用于数据量少的情况
 *
 * Created by GUY on 2015/10/29.
 * @class BI.TreeValueChooserCombo
 * @extends BI.Widget
 */
BI.TreeValueChooserCombo = BI.inherit(BI.AbstractTreeValueChooser, {

    _defaultConfig: function () {
        return BI.extend(BI.TreeValueChooserCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-tree-value-chooser-combo",
            width: 200,
            height: 30,
            items: null,
            itemsCreator: BI.emptyFn
        });
    },

    _init: function () {
        BI.TreeValueChooserCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        if (BI.isNotNull(o.items)) {
            this._initData(o.items);
        }
        this.combo = BI.createWidget({
            type: 'bi.multi_tree_combo',
            element: this,
            itemsCreator: BI.bind(this._itemsCreator, this),
            width: o.width,
            height: o.height
        });

        this.combo.on(BI.MultiTreeCombo.EVENT_CONFIRM, function () {
            self.fireEvent(BI.TreeValueChooserCombo.EVENT_CONFIRM);
        });
    },

    setValue: function (v) {
        this.combo.setValue(v);
    },

    getValue: function () {
        return this.combo.getValue();
    },

    populate: function () {
        this.combo.populate.apply(this.combo, arguments);
    }
});
BI.TreeValueChooserCombo.EVENT_CONFIRM = "TreeValueChooserCombo.EVENT_CONFIRM";
BI.shortcut('bi.tree_value_chooser_combo', BI.TreeValueChooserCombo);/**
 * 简单的复选下拉树控件, 适用于数据量少的情况
 *
 * Created by GUY on 2015/10/29.
 * @class BI.TreeValueChooserPane
 * @extends BI.AbstractTreeValueChooser
 */
BI.TreeValueChooserPane = BI.inherit(BI.AbstractTreeValueChooser, {

    _defaultConfig: function () {
        return BI.extend(BI.TreeValueChooserPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-tree-value-chooser-pane",
            items: null,
            itemsCreator: BI.emptyFn
        });
    },

    _init: function () {
        BI.TreeValueChooserPane.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.pane = BI.createWidget({
            type: 'bi.multi_select_tree',
            element: this,
            itemsCreator: BI.bind(this._itemsCreator, this)
        });

        this.pane.on(BI.MultiSelectTree.EVENT_CHANGE, function () {
            self.fireEvent(BI.TreeValueChooserPane.EVENT_CHANGE);
        });
        if (BI.isNotNull(o.items)) {
            this._initData(o.items);
            this.populate();
        }
    },

    setSelectedValue: function (v) {
        this.pane.setSelectedValue(v);
    },

    setValue: function (v) {
        this.pane.setValue(v);
    },

    getValue: function () {
        return this.pane.getValue();
    },

    populate: function () {
        this.pane.populate.apply(this.pane, arguments);
    }
});
BI.TreeValueChooserPane.EVENT_CHANGE = "TreeValueChooserPane.EVENT_CHANGE";
BI.shortcut('bi.tree_value_chooser_pane', BI.TreeValueChooserPane);/**
 * 简单的复选下拉框控件, 适用于数据量少的情况
 * 封装了字段处理逻辑
 *
 * Created by GUY on 2015/10/29.
 * @class BI.AbstractValueChooser
 * @extends BI.Widget
 */
BI.AbstractValueChooser = BI.inherit(BI.Widget, {

    _const: {
        perPage: 100
    },

    _defaultConfig: function () {
        return BI.extend(BI.AbstractValueChooser.superclass._defaultConfig.apply(this, arguments), {
            items: null,
            itemsCreator: BI.emptyFn,
            cache: true
        });
    },

    _valueFormatter: function (v) {
        var text = v;
        if (BI.isNotNull(this.items)) {
            BI.some(this.items, function (i, item) {
                if (item.value === v) {
                    text = item.text;
                    return true;
                }
            });
        }
        return text;
    },

    _getItemsByTimes: function (items, times) {
        var res = [];
        for (var i = (times - 1) * this._const.perPage; items[i] && i < times * this._const.perPage; i++) {
            res.push(items[i]);
        }
        return res;
    },

    _hasNextByTimes: function (items, times) {
        return times * this._const.perPage < items.length;
    },

    _itemsCreator: function (options, callback) {
        var self = this, o = this.options;
        if (!o.cache || !this.items) {
            o.itemsCreator({}, function (items) {
                self.items = items;
                call(items);
            });
        } else {
            call(this.items);
        }
        function call(items) {
            var keywords = (options.keywords || []).slice();
            if (options.keyword) {
                keywords.push(options.keyword);
            }
            BI.each(keywords, function (i, kw) {
                var search = BI.Func.getSearchResult(items, kw);
                items = search.matched.concat(search.finded);
            });
            if (options.selectedValues) {//过滤
                var filter = BI.makeObject(options.selectedValues, true);
                items = BI.filter(items, function (i, ob) {
                    return !filter[ob.value];
                });
            }
            if (options.type === BI.MultiSelectCombo.REQ_GET_ALL_DATA) {
                callback({
                    items: items
                });
                return;
            }
            if (options.type === BI.MultiSelectCombo.REQ_GET_DATA_LENGTH) {
                callback({count: items.length});
                return;
            }
            callback({
                items: self._getItemsByTimes(items, options.times),
                hasNext: self._hasNextByTimes(items, options.times)
            });
        }
    }
});/**
 * 简单的复选下拉框控件, 适用于数据量少的情况
 * 封装了字段处理逻辑
 *
 * Created by GUY on 2015/10/29.
 * @class BI.ValueChooserCombo
 * @extends BI.Widget
 */
BI.ValueChooserCombo = BI.inherit(BI.AbstractValueChooser, {

    _defaultConfig: function () {
        return BI.extend(BI.ValueChooserCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-value-chooser-combo",
            width: 200,
            height: 30,
            items: null,
            itemsCreator: BI.emptyFn,
            cache: true
        });
    },

    _init: function () {
        BI.ValueChooserCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        if (BI.isNotNull(o.items)) {
            this.items = o.items;
        }
        this.combo = BI.createWidget({
            type: 'bi.multi_select_combo',
            element: this,
            itemsCreator: BI.bind(this._itemsCreator, this),
            valueFormatter: BI.bind(this._valueFormatter, this),
            width: o.width,
            height: o.height
        });

        this.combo.on(BI.MultiSelectCombo.EVENT_CONFIRM, function () {
            self.fireEvent(BI.ValueChooserCombo.EVENT_CONFIRM);
        });
    },

    setValue: function (v) {
        this.combo.setValue(v);
    },

    getValue: function () {
        var val = this.combo.getValue() || {};
        return {
            type: val.type,
            value: val.value
        }
    },

    populate: function () {
        this.combo.populate.apply(this, arguments);
    }
});
BI.ValueChooserCombo.EVENT_CONFIRM = "ValueChooserCombo.EVENT_CONFIRM";
BI.shortcut('bi.value_chooser_combo', BI.ValueChooserCombo);/**
 * 简单的复选下拉框控件, 适用于数据量少的情况
 * 封装了字段处理逻辑
 *
 * Created by GUY on 2015/10/29.
 * @class BI.ValueChooserPane
 * @extends BI.Widget
 */
BI.ValueChooserPane = BI.inherit(BI.AbstractValueChooser, {

    _defaultConfig: function () {
        return BI.extend(BI.ValueChooserPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-value-chooser-pane",
            items: null,
            itemsCreator: BI.emptyFn,
            cache: true
        });
    },

    _init: function () {
        BI.ValueChooserPane.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.list = BI.createWidget({
            type: 'bi.multi_select_list',
            element: this,
            itemsCreator: BI.bind(this._itemsCreator, this),
            valueFormatter: BI.bind(this._valueFormatter, this)
        });

        this.list.on(BI.MultiSelectList.EVENT_CHANGE, function () {
            self.fireEvent(BI.ValueChooserPane.EVENT_CHANGE);
        });
        if (BI.isNotNull(o.items)) {
            this.items = o.items;
            this.populate();
        }
    },

    setValue: function (v) {
        this.list.setValue(v);
    },

    getValue: function () {
        var val = this.list.getValue() || {};
        return {
            type: val.type,
            value: val.value
        }
    },

    populate: function () {
        this.list.populate.apply(this.list, arguments);
    }
});
BI.ValueChooserPane.EVENT_CHANGE = "ValueChooserPane.EVENT_CHANGE";
BI.shortcut('bi.value_chooser_pane', BI.ValueChooserPane);