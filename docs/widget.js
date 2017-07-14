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
        BI.some(nodes, function (i, node) {
            if (BI.isNotEmptyArray(node.children)) {
                return BI.some(node.children, function (index, child) {
                    if (index === 0) {
                        if (self.cache[child.text || child.value]) {
                            start = self.cache[child.text || child.value];
                            return true;
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

        $(document).mousedown(function (e) {
            BI.each(self.getAllRegions(), function (i, region) {
                if (region.el.element.find(e.target).length === 0) {
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
            // if (this._isRegionOverlay()) {
            //     return false;
            // }
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
        if (this.options.layoutType === BI.Arrangement.LAYOUT_TYPE.GRID) {
            this.block.setVisible(true);
        } else {
            this.arrangement.setVisible(true);
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
                        //做一下自适应布局到网格布局的兼容
                        var perWidth = self._getOneWidthPortion();
                        var widthPortion = Math.round(region.width / perWidth);
                        var leftPortion = Math.round(region.left / perWidth);
                        var comparePortion = Math.round((region.width + region.left) / perWidth);
                        if (leftPortion + widthPortion !== comparePortion) {
                            region.left = leftPortion * perWidth;
                            region.width = comparePortion * perWidth - region.left;
                        }
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
                            self.svg.path(path).attr("stroke", "#d4dadd");
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
                            self.svg.path(path).attr("stroke", "#d4dadd");
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
                            self.svg.path(path).attr("stroke", "#d4dadd");
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
                            self.svg.path(path).attr("stroke", "#d4dadd");
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
            baseCls: "bi-date-combo bi-border",
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
            extraCls: "bi-date-trigger",
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
            direction: "bottom",
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
            direction: o.direction,
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

    showView: function () {
        this.downlistcombo.showView();
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
            // invalid: true,
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
        });

        this.icon1 = BI.createWidget({
            type: "bi.icon_button",
            cls: o.iconCls1,
            width: 25,
            forceNotSelected: true
        });

        this.icon2 = BI.createWidget({
            type: "bi.icon_button",
            cls: o.iconCls2,
            width: 25,
            forceNotSelected: true
        });

        var blank = BI.createWidget({
            type: "bi.layout",
            width: 25
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.icon2,
                top: 0,
                bottom: 0,
                right: 0
            }]
        });

        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic("horizontal", BI.extend(o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection("left", this.icon1, this.text, blank)
        }))));

        this.element.hover(function () {
            if (self.isEnabled()) {
                self.hover();
            }
        }, function () {
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
        BI.find(v, function (idx, value) {
            if (BI.contains(o.childValues, value)) {
                self.icon1.setSelected(true);
                return true;
            } else {
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
            layoutType: BI.Arrangement.LAYOUT_TYPE.GRID,
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
                case BI.Arrangement.LAYOUT_TYPE.FREE:
                    position = this.getPosition(name, position);
                    break;
                case BI.Arrangement.LAYOUT_TYPE.GRID:
                    break;
            }
        }
        return this.arrangement.setRegionPosition(name, position);
    },

    setDropPosition: function (position, size) {
        var self = this;
        this.stopDraw();
        if (position.left > 0 && position.top > 0) {
            switch (this.getLayoutType()) {
                case BI.Arrangement.LAYOUT_TYPE.FREE:
                    position = this.getPosition(null, position, size);
                    this.draw(position, size);
                    break;
                case BI.Arrangement.LAYOUT_TYPE.GRID:
                    break;
            }
        }
        var callback = self.arrangement.setDropPosition(position, size);
        return function () {
            callback();
            self.stopDraw();
        }
    },

    scrollInterval: function () {
        this.arrangement.scrollInterval.apply(this.arrangement, arguments);
    },

    scrollEnd: function () {
        this.arrangement.scrollEnd.apply(this.arrangement, arguments);
    },

    scrollTo: function (scroll) {
        this.arrangement.scrollTo(scroll);
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
 * Created by zcf on 2016/9/26.
 */
BI.IntervalSlider = BI.inherit(BI.Widget, {
    _constant: {
        EDITOR_WIDTH: 58,
        EDITOR_R_GAP: 60,
        EDITOR_HEIGHT: 30,
        HEIGHT: 28,
        SLIDER_WIDTH_HALF: 15,
        SLIDER_WIDTH: 30,
        SLIDER_HEIGHT: 30,
        TRACK_HEIGHT: 24
    },

    _defaultConfig: function () {
        return BI.extend(BI.IntervalSlider.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-slider bi-slider-track"
        })
    },

    _init: function () {
        BI.IntervalSlider.superclass._init.apply(this, arguments);

        var self = this;
        var c = this._constant;
        this.enable = false;
        this.valueOne = "";
        this.valueTwo = "";
        this.calculation = new BI.AccurateCalculationModel();

        this.backgroundTrack = BI.createWidget({
            type: "bi.layout",
            cls: "background-track",
            height: c.TRACK_HEIGHT
        });
        this.grayTrack = BI.createWidget({
            type: "bi.layout",
            cls: "gray-track",
            height: 8
        });
        this.blueTrack = BI.createWidget({
            type: "bi.layout",
            cls: "blue-track bi-high-light-background",
            height: 8
        });
        this.track = this._createTrackWrapper();

        this.labelOne = BI.createWidget({
            type: "bi.sign_editor",
            cls: "slider-editor-button bi-border",
            errorText: "",
            allowBlank: false,
            height: c.HEIGHT,
            width: c.EDITOR_WIDTH,
            validationChecker: function (v) {
                return self._checkValidation(v);
            }
        });
        this.labelOne.on(BI.Editor.EVENT_CONFIRM, function () {
            var v = BI.parseFloat(this.getValue());
            self.valueOne = v;
            var percent = self._getPercentByValue(v);
            var significantPercent = BI.parseFloat(percent.toFixed(1));//分成1000份
            self._setLabelOnePosition(significantPercent);
            self._setSliderOnePosition(significantPercent);
            self._setBlueTrack();
            self.fireEvent(BI.IntervalSlider.EVENT_CHANGE);
        });

        this.labelTwo = BI.createWidget({
            type: "bi.sign_editor",
            cls: "slider-editor-button bi-border",
            errorText: "",
            allowBlank: false,
            height: c.HEIGHT,
            width: c.EDITOR_WIDTH,
            validationChecker: function (v) {
                return self._checkValidation(v);
            }
        });
        this.labelTwo.on(BI.Editor.EVENT_CONFIRM, function () {
            var v = BI.parseFloat(this.getValue());
            self.valueTwo = v;
            var percent = self._getPercentByValue(v);
            var significantPercent = BI.parseFloat(percent.toFixed(1));
            self._setLabelTwoPosition(significantPercent);
            self._setSliderTwoPosition(significantPercent);
            self._setBlueTrack();
            self.fireEvent(BI.IntervalSlider.EVENT_CHANGE);
        });

        this.sliderOne = BI.createWidget({
            type: "bi.single_slider_slider"
        });
        this.sliderOne.element.draggable({
            axis: "x",
            containment: this.grayTrack.element,
            scroll: false,
            drag: function (e, ui) {
                var percent = (ui.position.left) * 100 / (self._getGrayTrackLength());
                var significantPercent = BI.parseFloat(percent.toFixed(1));
                self._setLabelOnePosition(significantPercent);
                var v = self._getValueByPercent(significantPercent);
                self.labelOne.setValue(v);
                self.valueOne = v;
                self._setBlueTrack();
            },
            stop: function (e, ui) {
                var percent = (ui.position.left) * 100 / (self._getGrayTrackLength());
                var significantPercent = BI.parseFloat(percent.toFixed(1));
                self._setSliderOnePosition(significantPercent);
                self.fireEvent(BI.IntervalSlider.EVENT_CHANGE);
            }
        });

        this.sliderTwo = BI.createWidget({
            type: "bi.single_slider_slider"
        });
        this.sliderTwo.element.draggable({
            axis: "x",
            containment: this.grayTrack.element,
            scroll: false,
            drag: function (e, ui) {
                var percent = (ui.position.left) * 100 / (self._getGrayTrackLength());
                var significantPercent = BI.parseFloat(percent.toFixed(1));
                self._setLabelTwoPosition(significantPercent);
                var v = self._getValueByPercent(significantPercent);
                self.labelTwo.setValue(v);
                self.valueTwo = v;
                self._setBlueTrack();
            },
            stop: function (e, ui) {
                var percent = (ui.position.left) * 100 / (self._getGrayTrackLength());
                var significantPercent = BI.parseFloat(percent.toFixed(1));
                self._setSliderTwoPosition(significantPercent);
                self.fireEvent(BI.IntervalSlider.EVENT_CHANGE);
            }
        });
        this._setVisible(false);

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.vertical",
                    items: [{
                        type: "bi.absolute",
                        items: [{
                            el: this.track,
                            width: "100%",
                            height: c.TRACK_HEIGHT
                        }]
                    }],
                    hgap: 7,
                    height: c.TRACK_HEIGHT
                },
                top: 33,
                left: 0,
                width: "100%"
            },
                this._createLabelWrapper(),
                this._createSliderWrapper()
            ]
        })
    },

    _createLabelWrapper: function () {
        var c = this._constant;
        return {
            el: {
                type: "bi.vertical",
                items: [{
                    type: "bi.absolute",
                    items: [{
                        el: this.labelOne,
                        top: 0,
                        left: "0%"
                    }]
                }, {
                    type: "bi.absolute",
                    items: [{
                        el: this.labelTwo,
                        top: 0,
                        left: "100%"
                    }]
                }],
                rgap: c.EDITOR_R_GAP,
                height: 90
            },
            top: 0,
            left: 0,
            width: "100%"
        }
    },

    _createSliderWrapper: function () {
        var c = this._constant;
        return {
            el: {
                type: "bi.vertical",
                items: [{
                    type: "bi.absolute",
                    items: [{
                        el: this.sliderOne,
                        top: 0,
                        left: "0%"
                    }]
                }, {
                    type: "bi.absolute",
                    items: [{
                        el: this.sliderTwo,
                        top: 0,
                        left: "100%"
                    }]
                }],
                hgap: c.SLIDER_WIDTH_HALF,
                height: c.SLIDER_HEIGHT
            },
            top: 30,
            left: 0,
            width: "100%"
        }
    },

    _createTrackWrapper: function () {
        return BI.createWidget({
            type: "bi.absolute",
            items: [{
                el: this.backgroundTrack,
                width: "100%"
            }, {
                el: {
                    type: "bi.vertical",
                    items: [{
                        type: "bi.absolute",
                        items: [{
                            el: this.grayTrack,
                            top: 0,
                            left: 0,
                            width: "100%"
                        }, {
                            el: this.blueTrack,
                            top: 0,
                            left: 0,
                            width: "0%"
                        }]
                    }],
                    hgap: 8,
                    height: 8
                },
                top: 8,
                left: 0,
                width: "100%"
            }]
        })
    },

    _checkValidation: function (v) {
        return BI.isNumeric(v) && !(BI.isNull(v) || v < this.min || v > this.max)
    },

    _checkOverlap: function () {
        var labelOneLeft = this.labelOne.element[0].offsetLeft;
        var labelTwoLeft = this.labelTwo.element[0].offsetLeft;
        if (labelOneLeft <= labelTwoLeft) {
            if ((labelTwoLeft - labelOneLeft) < 90) {
                this.labelTwo.element.css({"top": 60});
            } else {
                this.labelTwo.element.css({"top": 0});
            }
        } else {
            if ((labelOneLeft - labelTwoLeft) < 90) {
                this.labelTwo.element.css({"top": 60});
            } else {
                this.labelTwo.element.css({"top": 0});
            }
        }
    },

    _setLabelOnePosition: function (percent) {
        this.labelOne.element.css({"left": percent + "%"});
        this._checkOverlap();
    },

    _setLabelTwoPosition: function (percent) {
        this.labelTwo.element.css({"left": percent + "%"});
        this._checkOverlap();
    },

    _setSliderOnePosition: function (percent) {
        this.sliderOne.element.css({"left": percent + "%"});
    },

    _setSliderTwoPosition: function (percent) {
        this.sliderTwo.element.css({"left": percent + "%"});
    },

    _setBlueTrackLeft: function (percent) {
        this.blueTrack.element.css({"left": percent + "%"});
    },

    _setBlueTrackWidth: function (percent) {
        this.blueTrack.element.css({"width": percent + "%"});
    },

    _setBlueTrack: function () {
        var percentOne = this._getPercentByValue(this.labelOne.getValue());
        var percentTwo = this._getPercentByValue(this.labelTwo.getValue());
        if (percentOne <= percentTwo) {
            this._setBlueTrackLeft(percentOne);
            this._setBlueTrackWidth(percentTwo - percentOne);
        } else {
            this._setBlueTrackLeft(percentTwo);
            this._setBlueTrackWidth(percentOne - percentTwo);
        }
    },

    _setAllPosition: function (one, two) {
        this._setSliderOnePosition(one);
        this._setLabelOnePosition(one);
        this._setSliderTwoPosition(two);
        this._setLabelTwoPosition(two);
        this._setBlueTrack();
    },

    _setVisible: function (visible) {
        this.sliderOne.setVisible(visible);
        this.sliderTwo.setVisible(visible);
        this.labelOne.setVisible(visible);
        this.labelTwo.setVisible(visible);
    },

    _setErrorText: function () {
        var errorText = BI.i18nText("BI-Please_Enter") + this.min + "-" + this.max + BI.i18nText("BI-Basic_De") + BI.i18nText("BI-Basic_Number");
        this.labelOne.setErrorText(errorText);
        this.labelTwo.setErrorText(errorText);
    },

    _getGrayTrackLength: function () {
        return this.grayTrack.element[0].scrollWidth
    },

    //其中取max-min后保留4为有效数字后的值的小数位数为最终value的精度
    _getValueByPercent: function (percent) {//return (((max-min)*percent)/100+min)
        var sub = this.calculation.accurateSubtraction(this.max, this.min);
        var mul = this.calculation.accurateMultiplication(sub, percent);
        var div = this.calculation.accurateDivisionTenExponent(mul, 2);
        return BI.parseFloat(this.calculation.accurateAddition(div, this.min).toFixed(this.precision));
    },

    _getPercentByValue: function (v) {
        return (v - this.min) * 100 / (this.max - this.min);
    },

    _setDraggableEnable: function (enable) {
        if (enable) {
            this.sliderOne.element.draggable("enable");
            this.sliderTwo.element.draggable("enable")
        } else {
            this.sliderOne.element.draggable("disable");
            this.sliderTwo.element.draggable("disable")
        }
    },

    getValue: function () {
        if (this.valueOne <= this.valueTwo) {
            return {min: this.valueOne, max: this.valueTwo}
        } else {
            return {min: this.valueTwo, max: this.valueOne}
        }
    },

    setMinAndMax: function (v) {
        var minNumber = BI.parseFloat(v.min);
        var maxNumber = BI.parseFloat(v.max);
        if ((!isNaN(minNumber)) && (!isNaN(maxNumber)) && (maxNumber >= minNumber )) {
            this.min = minNumber;
            this.max = maxNumber;
            this.valueOne = minNumber;
            this.valueTwo = maxNumber;
            //计算每一份值的精度(最大值和最小值的差值保留4为有效数字后的精度)
            //如果差值的整数位数大于4,toPrecision得到的是科学计数法1234 => 1.2e+3
            var sub = this.calculation.accurateSubtraction(this.max, this.min);
            var pre = sub.toPrecision(4);
            var precisionString = pre.indexOf("e") > -1 ? (BI.parseFloat(sub.toPrecision(4)) + "") : pre;
            var arr = precisionString.split(".");
            this.precision = arr.length > 1 ? arr[1] : 0;
            this._setDraggableEnable(true);
        }
        if (maxNumber === minNumber) {
            this._setDraggableEnable(false);
        }
    },

    setValue: function (v) {
        var valueOne = BI.parseFloat(v.min);
        var valueTwo = BI.parseFloat(v.max);
        if (!isNaN(valueOne) && !isNaN(valueTwo)) {
            if (this._checkValidation(valueOne)) {
                this.valueOne = valueOne;
            }
            if (this._checkValidation(valueTwo)) {
                this.valueTwo = valueTwo;
            }
            if (valueOne < this.min) {
                this.valueOne = this.min;
            }
            if (valueTwo > this.max) {
                this.valueTwo = this.max;
            }
        }
    },

    reset: function () {
        this._setVisible(false);
        this.enable = false;
        this.valueOne = "";
        this.valueTwo = "";
        this.min = NaN;
        this.max = NaN;
        this._setBlueTrackWidth(0);
    },

    populate: function () {
        if (!isNaN(this.min) && !isNaN(this.max)) {
            this.enable = true;
            this._setVisible(true);
            this._setErrorText();
            if ((BI.isNumeric(this.valueOne) || BI.isNotEmptyString(this.valueOne)) && (BI.isNumeric(this.valueTwo) || BI.isNotEmptyString(this.valueTwo))) {
                this.labelOne.setValue(this.valueOne);
                this.labelTwo.setValue(this.valueTwo);
                this._setAllPosition(this._getPercentByValue(this.valueOne), this._getPercentByValue(this.valueTwo));
            } else {
                this.labelOne.setValue(this.min);
                this.labelTwo.setValue(this.max);
                this._setAllPosition(0, 100)
            }
        }
    }
});
BI.IntervalSlider.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.interval_slider", BI.IntervalSlider);/**
 * Created by zcf on 2017/3/1.
 * 万恶的IEEE-754
 * 使用字符串精确计算含小数加法、减法、乘法和10的指数倍除法，支持负数
 */
BI.AccurateCalculationModel = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.AccurateCalculationModel.superclass._defaultConfig.apply(this, arguments), {
            baseCls: ""
        })
    },

    _init: function () {
        BI.AccurateCalculationModel.superclass._init.apply(this, arguments);
    },

    _getMagnitude: function (n) {
        var magnitude = "1";
        for (var i = 0; i < n; i++) {
            magnitude += "0";
        }
        return BI.parseInt(magnitude);
    },

    _formatDecimal: function (stringNumber1, stringNumber2) {
        if (stringNumber1.numDecimalLength === stringNumber2.numDecimalLength) {
            return;
        }
        var magnitudeDiff = stringNumber1.numDecimalLength - stringNumber2.numDecimalLength;
        if (magnitudeDiff > 0) {
            var needAddZero = stringNumber2
        } else {
            var needAddZero = stringNumber1;
            magnitudeDiff = (0 - magnitudeDiff);
        }
        for (var i = 0; i < magnitudeDiff; i++) {
            if (needAddZero.numDecimal === "0" && i === 0) {
                continue
            }
            needAddZero.numDecimal += "0"
        }
    },

    _stringNumberFactory: function (num) {
        var strNum = num.toString();
        var numStrArray = strNum.split(".");
        var numInteger = numStrArray[0];
        if (numStrArray.length === 1) {
            var numDecimal = "0";
            var numDecimalLength = 0;
        } else {
            var numDecimal = numStrArray[1];
            var numDecimalLength = numStrArray[1].length;
        }
        return {
            "numInteger": numInteger,
            "numDecimal": numDecimal,
            "numDecimalLength": numDecimalLength
        }
    },

    _accurateSubtraction: function (num1, num2) {//num1-num2 && num1>num2
        var stringNumber1 = this._stringNumberFactory(num1);
        var stringNumber2 = this._stringNumberFactory(num2);
        //整数部分计算
        var integerResult = BI.parseInt(stringNumber1.numInteger) - BI.parseInt(stringNumber2.numInteger);
        //小数部分
        this._formatDecimal(stringNumber1, stringNumber2);
        var decimalMaxLength = getDecimalMaxLength(stringNumber1, stringNumber2);

        if (BI.parseInt(stringNumber1.numDecimal) >= BI.parseInt(stringNumber2.numDecimal)) {
            var decimalResultTemp = (BI.parseInt(stringNumber1.numDecimal) - BI.parseInt(stringNumber2.numDecimal)).toString();
            var decimalResult = addZero(decimalResultTemp, decimalMaxLength);
        } else {//否则借位
            integerResult--;
            var borrow = this._getMagnitude(decimalMaxLength);
            var decimalResultTemp = (borrow + BI.parseInt(stringNumber1.numDecimal) - BI.parseInt(stringNumber2.numDecimal)).toString();
            var decimalResult = addZero(decimalResultTemp, decimalMaxLength);
        }
        var result = integerResult + "." + decimalResult;
        return BI.parseFloat(result);

        function getDecimalMaxLength(num1, num2) {
            if (num1.numDecimal.length >= num2.numDecimal.length) {
                return num1.numDecimal.length
            }
            return num2.numDecimal.length
        }

        function addZero(resultTemp, length) {
            var diff = length - resultTemp.length;
            for (var i = 0; i < diff; i++) {
                resultTemp = "0" + resultTemp;
            }
            return resultTemp
        }
    },

    _accurateAddition: function (num1, num2) {//加法结合律
        var stringNumber1 = this._stringNumberFactory(num1);
        var stringNumber2 = this._stringNumberFactory(num2);
        //整数部分计算
        var integerResult = BI.parseInt(stringNumber1.numInteger) + BI.parseInt(stringNumber2.numInteger);
        //小数部分
        this._formatDecimal(stringNumber1, stringNumber2);

        var decimalResult = (BI.parseInt(stringNumber1.numDecimal) + BI.parseInt(stringNumber2.numDecimal)).toString();

        if (decimalResult !== "0") {
            if (decimalResult.length <= stringNumber1.numDecimal.length) {
                decimalResult = addZero(decimalResult, stringNumber1.numDecimal.length)
            } else {
                integerResult++;//进一
                decimalResult = decimalResult.slice(1);
            }
        }
        var result = integerResult + "." + decimalResult;
        return BI.parseFloat(result);

        function addZero(resultTemp, length) {
            var diff = length - resultTemp.length;
            for (var i = 0; i < diff; i++) {
                resultTemp = "0" + resultTemp;
            }
            return resultTemp
        }
    },

    _accurateMultiplication: function (num1, num2) {//乘法分配律
        var stringNumber1 = this._stringNumberFactory(num1);
        var stringNumber2 = this._stringNumberFactory(num2);
        //整数部分计算
        var integerResult = BI.parseInt(stringNumber1.numInteger) * BI.parseInt(stringNumber2.numInteger);
        //num1的小数和num2的整数
        var dec1Int2 = this._accurateDivisionTenExponent(BI.parseInt(stringNumber1.numDecimal) * BI.parseInt(stringNumber2.numInteger), stringNumber1.numDecimalLength);
        //num1的整数和num2的小数
        var int1dec2 = this._accurateDivisionTenExponent(BI.parseInt(stringNumber1.numInteger) * BI.parseInt(stringNumber2.numDecimal), stringNumber2.numDecimalLength);
        //小数*小数
        var dec1dec2 = this._accurateDivisionTenExponent(BI.parseInt(stringNumber1.numDecimal) * BI.parseInt(stringNumber2.numDecimal), (stringNumber1.numDecimalLength + stringNumber2.numDecimalLength));

        return this._accurateAddition(this._accurateAddition(this._accurateAddition(integerResult, dec1Int2), int1dec2), dec1dec2);
    },

    _accurateDivisionTenExponent: function (num, n) {// num/10^n && n>0
        var stringNumber = this._stringNumberFactory(num);
        if (stringNumber.numInteger.length > n) {
            var integerResult = stringNumber.numInteger.slice(0, (stringNumber.numInteger.length - n));
            var partDecimalResult = stringNumber.numInteger.slice(-n);
        } else {
            var integerResult = "0";
            var partDecimalResult = addZero(stringNumber.numInteger, n);
        }
        var result = integerResult + "." + partDecimalResult + stringNumber.numDecimal;
        return BI.parseFloat(result);

        function addZero(resultTemp, length) {
            var diff = length - resultTemp.length;
            for (var i = 0; i < diff; i++) {
                resultTemp = "0" + resultTemp;
            }
            return resultTemp
        }
    },

    accurateSubtraction: function (num1, num2) {
        if (num1 >= 0 && num2 >= 0) {
            if (num1 >= num2) {
                return this._accurateSubtraction(num1, num2)
            }
            return -this._accurateSubtraction(num2, num1)
        }
        if (num1 >= 0 && num2 < 0) {
            return this._accurateAddition(num1, -num2)
        }
        if (num1 < 0 && num2 >= 0) {
            return -this._accurateAddition(-num1, num2)
        }
        if (num1 < 0 && num2 < 0) {
            if (num1 >= num2) {
                return this._accurateSubtraction(-num2, -num1)
            }
            return this._accurateSubtraction(-num1, -num2)
        }
    },

    accurateAddition: function (num1, num2) {
        if (num1 >= 0 && num2 >= 0) {
            return this._accurateAddition(num1, num2)
        }
        if (num1 >= 0 && num2 < 0) {
            return this.accurateSubtraction(num1, -num2)
        }
        if (num1 < 0 && num2 >= 0) {
            return this.accurateSubtraction(num2, -num1)
        }
        if (num1 < 0 && num2 < 0) {
            return -this._accurateAddition(-num1, -num2)
        }
    },

    accurateMultiplication: function (num1, num2) {
        if (num1 >= 0 && num2 >= 0) {
            return this._accurateMultiplication(num1, num2)
        }
        if (num1 >= 0 && num2 < 0) {
            return -this._accurateMultiplication(num1, -num2)
        }
        if (num1 < 0 && num2 >= 0) {
            return -this._accurateMultiplication(-num1, num2)
        }
        if (num1 < 0 && num2 < 0) {
            return this._accurateMultiplication(-num1, -num2)
        }
    },

    accurateDivisionTenExponent: function (num1, n) {
        if (num1 >= 0) {
            return this._accurateDivisionTenExponent(num1, n);
        }
        return -this._accurateDivisionTenExponent(-num1, n);
    }
});/**
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
            behaviors: {},
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
            if (this.getKey() && this.getKey() !== self.storeValue) {
                self.setValue(this.getValue());
            } else if (!this.getKey()) {
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
            type: "bi.month_popup",
            behaviors: o.behaviors
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
        });
        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.MonthCombo.EVENT_BEFORE_POPUPVIEW);
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

BI.MonthCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.MonthCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
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
            baseCls: "bi-month-popup",
            behaviors: {}
        });
    },

    _init: function () {
        BI.MonthPopup.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

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
            behaviors: o.behaviors,
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
            cls: "bi-list-item-none",
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
            cls: "bi-list-item-none",
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
            cls: "bi-list-item-none",
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
            cls: "bi-list-item-none",
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
            cls: "bi-list-item-none",
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
            cls: "bi-list-item-none",
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
            cls: "bi-list-item-none",
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
            cls: "bi-list-item-none",
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
            cls: "bi-list-item-none",
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
                        //预防trigger内部把当前的storeValue改掉
                        self.trigger.setValue(BI.deepClone(self.getValue()));
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
                self._join(this.getValue(), function () {
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
        //暂存的值一定是新的值，不然v改掉后，storeValue也跟着改了
        this.storeValue = BI.deepClone(v);
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
            // self.trigger.setValue(self.storeValue);
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
                    this.setValue(BI.deepClone(self.storeValue));
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
            if (self.searcher.isSearching()) {
                self.storeValue = {value: self.searcherPane.getValue()};
            } else {
                self.storeValue = {value: self.adapter.getValue()};
            }
            self.setSelectedValue(self.storeValue.value);
            self.fireEvent(BI.MultiSelectTree.EVENT_CHANGE);
        });

        //搜索中的时候用的是parttree，同adapter中的synctree不一样
        this.searcherPane = BI.createWidget({
            type: "bi.multi_tree_search_pane",
            cls: "bi-border-left bi-border-right bi-border-bottom",
            keywordGetter: function () {
                return self.searcher.getKeyword();
            },
            itemsCreator: function (op, callback) {
                op.keyword = self.searcher.getKeyword();
                o.itemsCreator(op, callback);
            }
        });
        this.searcherPane.setVisible(false);

        this.searcher = BI.createWidget({
            type: "bi.searcher",
            isAutoSearch: false,
            isAutoSync: false,
            onSearch: function (op, callback) {
                callback({
                    keyword: self.searcher.getKeyword()
                });
            },
            adapter: this.adapter,
            popup: this.searcherPane,
            masker: false,
            listeners: [{
                eventName: BI.Searcher.EVENT_START,
                action: function () {
                    self._showSearcherPane();
                    // self.storeValue = {value: self.adapter.getValue()};
                    // self.searcherPane.setSelectedValue(self.storeValue.value);
                }
            }, {
                eventName: BI.Searcher.EVENT_STOP,
                action: function () {
                    self._showAdapter();
                    // self.storeValue = {value: self.searcherPane.getValue()};
                    // self.adapter.setSelectedValue(self.storeValue.value);
                    BI.nextTick(function () {
                        self.adapter.populate();
                    });
                }
            }, {
                eventName: BI.Searcher.EVENT_CHANGE,
                action: function () {
                    if (self.searcher.isSearching()) {
                        self.storeValue = {value: self.searcherPane.getValue()};
                    } else {
                        self.storeValue = {value: self.adapter.getValue()};
                    }
                    self.setSelectedValue(self.storeValue.value);
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
                el: this.searcher,
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
        this.storeValue.value = v || {};
        this.adapter.setSelectedValue(v);
        this.searcherPane.setSelectedValue(v);
        this.searcher.setValue({
            value: v || {}
        });
    },

    setValue: function (v) {
        this.adapter.setValue(v);
    },

    stopSearch: function () {
        this.searcher.stopSearch();
    },

    updateValue: function (v) {
        this.adapter.updateValue(v);
    },

    getValue: function () {
        return this.storeValue.value;
    },

    populate: function () {
        this.searcher.populate.apply(this.searcher, arguments);
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
        this.popup.setValue(v);
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
        this.display.setSelectedValue(v.value);
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
            },
            hideChecker: function (e) {
                return triggerBtn.element.find(e.target).length === 0;
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
            }else{
                if (isPopupView()) {
                    self.trigger.stopEditing();
                    self.storeValue = {value: self.combo.getValue()};
                    if (clear === true) {
                        self.storeValue = {value: {}};
                    }
                    self.fireEvent(BI.MultiTreeCombo.EVENT_CONFIRM);
                }
            }
            clear = false;
            change = false;
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
        this.setSelectedValue(v.value);
    },

    setSelectedValue: function (v) {
        v || (v = {});
        this.partTree.setSelectedValue(v);
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
            height: 25,
            validation: "valid"
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

    isStateValid: function () {
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
        lineColor: "#d4dadd",
        selectLineColor: "#3f8ce8"
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
            behaviors: {},
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
        this.trigger.on(BI.QuarterTrigger.EVENT_STOP, function () {
            if (!self.combo.isViewVisible()) {
                self.combo.showView();
            }
        });
        this.trigger.on(BI.QuarterTrigger.EVENT_CONFIRM, function () {
            if (self.combo.isViewVisible()) {
                return;
            }
            if (this.getKey() && this.getKey() !== self.storeValue) {
                self.setValue(this.getKey());
            } else if (!this.getKey()) {
                self.setValue();
            }
            self.fireEvent(BI.QuarterCombo.EVENT_CONFIRM);
        });
        this.popup = BI.createWidget({
            type: "bi.quarter_popup",
            behaviors: o.behaviors
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
        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.QuarterCombo.EVENT_BEFORE_POPUPVIEW);
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
BI.QuarterCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
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
            baseCls: "bi-quarter-popup",
            behaviors: {}
        });
    },

    _init: function () {
        BI.QuarterPopup.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

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
            behaviors: o.behaviors,
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
            var sumLeft = BI.sum(columnSizeLeft) + columnSizeLeft.length,
                sumRight = BI.sum(columnSizeRight) + columnSizeRight.length;
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
                self._initRegionSize();
                self.table.resize();
                self._resizeHeader();
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
BI.shortcut('bi.sequence_table', BI.SequenceTable);/*! jQuery UI - v1.12.1 - 2017-07-14
* http://jqueryui.com
* Includes: widget.js, position.js, data.js, disable-selection.js, focusable.js, form-reset-mixin.js, jquery-1-7.js, keycode.js, labels.js, scroll-parent.js, tabbable.js, unique-id.js, widgets/draggable.js, widgets/droppable.js, widgets/resizable.js, widgets/selectable.js, widgets/sortable.js, widgets/mouse.js, effect.js, effects/effect-blind.js, effects/effect-bounce.js, effects/effect-clip.js, effects/effect-drop.js, effects/effect-explode.js, effects/effect-fade.js, effects/effect-fold.js, effects/effect-highlight.js, effects/effect-puff.js, effects/effect-pulsate.js, effects/effect-scale.js, effects/effect-shake.js, effects/effect-size.js, effects/effect-slide.js, effects/effect-transfer.js
* Copyright jQuery Foundation and other contributors; Licensed MIT */

(function(t){"function"==typeof define&&define.amd?define(["jquery"],t):t(jQuery)})(function(t){function e(t){for(var e=t.css("visibility");"inherit"===e;)t=t.parent(),e=t.css("visibility");return"hidden"!==e}t.ui=t.ui||{},t.ui.version="1.12.1";var i=0,s=Array.prototype.slice;t.cleanData=function(e){return function(i){var s,n,o;for(o=0;null!=(n=i[o]);o++)try{s=t._data(n,"events"),s&&s.remove&&t(n).triggerHandler("remove")}catch(a){}e(i)}}(t.cleanData),t.widget=function(e,i,s){var n,o,a,r={},l=e.split(".")[0];e=e.split(".")[1];var h=l+"-"+e;return s||(s=i,i=t.Widget),t.isArray(s)&&(s=t.extend.apply(null,[{}].concat(s))),t.expr[":"][h.toLowerCase()]=function(e){return!!t.data(e,h)},t[l]=t[l]||{},n=t[l][e],o=t[l][e]=function(t,e){return this._createWidget?(arguments.length&&this._createWidget(t,e),void 0):new o(t,e)},t.extend(o,n,{version:s.version,_proto:t.extend({},s),_childConstructors:[]}),a=new i,a.options=t.widget.extend({},a.options),t.each(s,function(e,s){return t.isFunction(s)?(r[e]=function(){function t(){return i.prototype[e].apply(this,arguments)}function n(t){return i.prototype[e].apply(this,t)}return function(){var e,i=this._super,o=this._superApply;return this._super=t,this._superApply=n,e=s.apply(this,arguments),this._super=i,this._superApply=o,e}}(),void 0):(r[e]=s,void 0)}),o.prototype=t.widget.extend(a,{widgetEventPrefix:n?a.widgetEventPrefix||e:e},r,{constructor:o,namespace:l,widgetName:e,widgetFullName:h}),n?(t.each(n._childConstructors,function(e,i){var s=i.prototype;t.widget(s.namespace+"."+s.widgetName,o,i._proto)}),delete n._childConstructors):i._childConstructors.push(o),t.widget.bridge(e,o),o},t.widget.extend=function(e){for(var i,n,o=s.call(arguments,1),a=0,r=o.length;r>a;a++)for(i in o[a])n=o[a][i],o[a].hasOwnProperty(i)&&void 0!==n&&(e[i]=t.isPlainObject(n)?t.isPlainObject(e[i])?t.widget.extend({},e[i],n):t.widget.extend({},n):n);return e},t.widget.bridge=function(e,i){var n=i.prototype.widgetFullName||e;t.fn[e]=function(o){var a="string"==typeof o,r=s.call(arguments,1),l=this;return a?this.length||"instance"!==o?this.each(function(){var i,s=t.data(this,n);return"instance"===o?(l=s,!1):s?t.isFunction(s[o])&&"_"!==o.charAt(0)?(i=s[o].apply(s,r),i!==s&&void 0!==i?(l=i&&i.jquery?l.pushStack(i.get()):i,!1):void 0):t.error("no such method '"+o+"' for "+e+" widget instance"):t.error("cannot call methods on "+e+" prior to initialization; "+"attempted to call method '"+o+"'")}):l=void 0:(r.length&&(o=t.widget.extend.apply(null,[o].concat(r))),this.each(function(){var e=t.data(this,n);e?(e.option(o||{}),e._init&&e._init()):t.data(this,n,new i(o,this))})),l}},t.Widget=function(){},t.Widget._childConstructors=[],t.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{classes:{},disabled:!1,create:null},_createWidget:function(e,s){s=t(s||this.defaultElement||this)[0],this.element=t(s),this.uuid=i++,this.eventNamespace="."+this.widgetName+this.uuid,this.bindings=t(),this.hoverable=t(),this.focusable=t(),this.classesElementLookup={},s!==this&&(t.data(s,this.widgetFullName,this),this._on(!0,this.element,{remove:function(t){t.target===s&&this.destroy()}}),this.document=t(s.style?s.ownerDocument:s.document||s),this.window=t(this.document[0].defaultView||this.document[0].parentWindow)),this.options=t.widget.extend({},this.options,this._getCreateOptions(),e),this._create(),this.options.disabled&&this._setOptionDisabled(this.options.disabled),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:function(){return{}},_getCreateEventData:t.noop,_create:t.noop,_init:t.noop,destroy:function(){var e=this;this._destroy(),t.each(this.classesElementLookup,function(t,i){e._removeClass(i,t)}),this.element.off(this.eventNamespace).removeData(this.widgetFullName),this.widget().off(this.eventNamespace).removeAttr("aria-disabled"),this.bindings.off(this.eventNamespace)},_destroy:t.noop,widget:function(){return this.element},option:function(e,i){var s,n,o,a=e;if(0===arguments.length)return t.widget.extend({},this.options);if("string"==typeof e)if(a={},s=e.split("."),e=s.shift(),s.length){for(n=a[e]=t.widget.extend({},this.options[e]),o=0;s.length-1>o;o++)n[s[o]]=n[s[o]]||{},n=n[s[o]];if(e=s.pop(),1===arguments.length)return void 0===n[e]?null:n[e];n[e]=i}else{if(1===arguments.length)return void 0===this.options[e]?null:this.options[e];a[e]=i}return this._setOptions(a),this},_setOptions:function(t){var e;for(e in t)this._setOption(e,t[e]);return this},_setOption:function(t,e){return"classes"===t&&this._setOptionClasses(e),this.options[t]=e,"disabled"===t&&this._setOptionDisabled(e),this},_setOptionClasses:function(e){var i,s,n;for(i in e)n=this.classesElementLookup[i],e[i]!==this.options.classes[i]&&n&&n.length&&(s=t(n.get()),this._removeClass(n,i),s.addClass(this._classes({element:s,keys:i,classes:e,add:!0})))},_setOptionDisabled:function(t){this._toggleClass(this.widget(),this.widgetFullName+"-disabled",null,!!t),t&&(this._removeClass(this.hoverable,null,"ui-state-hover"),this._removeClass(this.focusable,null,"ui-state-focus"))},enable:function(){return this._setOptions({disabled:!1})},disable:function(){return this._setOptions({disabled:!0})},_classes:function(e){function i(i,o){var a,r;for(r=0;i.length>r;r++)a=n.classesElementLookup[i[r]]||t(),a=e.add?t(t.unique(a.get().concat(e.element.get()))):t(a.not(e.element).get()),n.classesElementLookup[i[r]]=a,s.push(i[r]),o&&e.classes[i[r]]&&s.push(e.classes[i[r]])}var s=[],n=this;return e=t.extend({element:this.element,classes:this.options.classes||{}},e),this._on(e.element,{remove:"_untrackClassesElement"}),e.keys&&i(e.keys.match(/\S+/g)||[],!0),e.extra&&i(e.extra.match(/\S+/g)||[]),s.join(" ")},_untrackClassesElement:function(e){var i=this;t.each(i.classesElementLookup,function(s,n){-1!==t.inArray(e.target,n)&&(i.classesElementLookup[s]=t(n.not(e.target).get()))})},_removeClass:function(t,e,i){return this._toggleClass(t,e,i,!1)},_addClass:function(t,e,i){return this._toggleClass(t,e,i,!0)},_toggleClass:function(t,e,i,s){s="boolean"==typeof s?s:i;var n="string"==typeof t||null===t,o={extra:n?e:i,keys:n?t:e,element:n?this.element:t,add:s};return o.element.toggleClass(this._classes(o),s),this},_on:function(e,i,s){var n,o=this;"boolean"!=typeof e&&(s=i,i=e,e=!1),s?(i=n=t(i),this.bindings=this.bindings.add(i)):(s=i,i=this.element,n=this.widget()),t.each(s,function(s,a){function r(){return e||o.options.disabled!==!0&&!t(this).hasClass("ui-state-disabled")?("string"==typeof a?o[a]:a).apply(o,arguments):void 0}"string"!=typeof a&&(r.guid=a.guid=a.guid||r.guid||t.guid++);var l=s.match(/^([\w:-]*)\s*(.*)$/),h=l[1]+o.eventNamespace,c=l[2];c?n.on(h,c,r):i.on(h,r)})},_off:function(e,i){i=(i||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,e.off(i).off(i),this.bindings=t(this.bindings.not(e).get()),this.focusable=t(this.focusable.not(e).get()),this.hoverable=t(this.hoverable.not(e).get())},_delay:function(t,e){function i(){return("string"==typeof t?s[t]:t).apply(s,arguments)}var s=this;return setTimeout(i,e||0)},_hoverable:function(e){this.hoverable=this.hoverable.add(e),this._on(e,{mouseenter:function(e){this._addClass(t(e.currentTarget),null,"ui-state-hover")},mouseleave:function(e){this._removeClass(t(e.currentTarget),null,"ui-state-hover")}})},_focusable:function(e){this.focusable=this.focusable.add(e),this._on(e,{focusin:function(e){this._addClass(t(e.currentTarget),null,"ui-state-focus")},focusout:function(e){this._removeClass(t(e.currentTarget),null,"ui-state-focus")}})},_trigger:function(e,i,s){var n,o,a=this.options[e];if(s=s||{},i=t.Event(i),i.type=(e===this.widgetEventPrefix?e:this.widgetEventPrefix+e).toLowerCase(),i.target=this.element[0],o=i.originalEvent)for(n in o)n in i||(i[n]=o[n]);return this.element.trigger(i,s),!(t.isFunction(a)&&a.apply(this.element[0],[i].concat(s))===!1||i.isDefaultPrevented())}},t.each({show:"fadeIn",hide:"fadeOut"},function(e,i){t.Widget.prototype["_"+e]=function(s,n,o){"string"==typeof n&&(n={effect:n});var a,r=n?n===!0||"number"==typeof n?i:n.effect||i:e;n=n||{},"number"==typeof n&&(n={duration:n}),a=!t.isEmptyObject(n),n.complete=o,n.delay&&s.delay(n.delay),a&&t.effects&&t.effects.effect[r]?s[e](n):r!==e&&s[r]?s[r](n.duration,n.easing,o):s.queue(function(i){t(this)[e](),o&&o.call(s[0]),i()})}}),t.widget,function(){function e(t,e,i){return[parseFloat(t[0])*(u.test(t[0])?e/100:1),parseFloat(t[1])*(u.test(t[1])?i/100:1)]}function i(e,i){return parseInt(t.css(e,i),10)||0}function s(e){var i=e[0];return 9===i.nodeType?{width:e.width(),height:e.height(),offset:{top:0,left:0}}:t.isWindow(i)?{width:e.width(),height:e.height(),offset:{top:e.scrollTop(),left:e.scrollLeft()}}:i.preventDefault?{width:0,height:0,offset:{top:i.pageY,left:i.pageX}}:{width:e.outerWidth(),height:e.outerHeight(),offset:e.offset()}}var n,o=Math.max,a=Math.abs,r=/left|center|right/,l=/top|center|bottom/,h=/[\+\-]\d+(\.[\d]+)?%?/,c=/^\w+/,u=/%$/,d=t.fn.position;t.position={scrollbarWidth:function(){if(void 0!==n)return n;var e,i,s=t("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),o=s.children()[0];return t("body").append(s),e=o.offsetWidth,s.css("overflow","scroll"),i=o.offsetWidth,e===i&&(i=s[0].clientWidth),s.remove(),n=e-i},getScrollInfo:function(e){var i=e.isWindow||e.isDocument?"":e.element.css("overflow-x"),s=e.isWindow||e.isDocument?"":e.element.css("overflow-y"),n="scroll"===i||"auto"===i&&e.width<e.element[0].scrollWidth,o="scroll"===s||"auto"===s&&e.height<e.element[0].scrollHeight;return{width:o?t.position.scrollbarWidth():0,height:n?t.position.scrollbarWidth():0}},getWithinInfo:function(e){var i=t(e||window),s=t.isWindow(i[0]),n=!!i[0]&&9===i[0].nodeType,o=!s&&!n;return{element:i,isWindow:s,isDocument:n,offset:o?t(e).offset():{left:0,top:0},scrollLeft:i.scrollLeft(),scrollTop:i.scrollTop(),width:i.outerWidth(),height:i.outerHeight()}}},t.fn.position=function(n){if(!n||!n.of)return d.apply(this,arguments);n=t.extend({},n);var u,p,f,g,m,_,v=t(n.of),b=t.position.getWithinInfo(n.within),y=t.position.getScrollInfo(b),w=(n.collision||"flip").split(" "),k={};return _=s(v),v[0].preventDefault&&(n.at="left top"),p=_.width,f=_.height,g=_.offset,m=t.extend({},g),t.each(["my","at"],function(){var t,e,i=(n[this]||"").split(" ");1===i.length&&(i=r.test(i[0])?i.concat(["center"]):l.test(i[0])?["center"].concat(i):["center","center"]),i[0]=r.test(i[0])?i[0]:"center",i[1]=l.test(i[1])?i[1]:"center",t=h.exec(i[0]),e=h.exec(i[1]),k[this]=[t?t[0]:0,e?e[0]:0],n[this]=[c.exec(i[0])[0],c.exec(i[1])[0]]}),1===w.length&&(w[1]=w[0]),"right"===n.at[0]?m.left+=p:"center"===n.at[0]&&(m.left+=p/2),"bottom"===n.at[1]?m.top+=f:"center"===n.at[1]&&(m.top+=f/2),u=e(k.at,p,f),m.left+=u[0],m.top+=u[1],this.each(function(){var s,r,l=t(this),h=l.outerWidth(),c=l.outerHeight(),d=i(this,"marginLeft"),_=i(this,"marginTop"),x=h+d+i(this,"marginRight")+y.width,C=c+_+i(this,"marginBottom")+y.height,D=t.extend({},m),T=e(k.my,l.outerWidth(),l.outerHeight());"right"===n.my[0]?D.left-=h:"center"===n.my[0]&&(D.left-=h/2),"bottom"===n.my[1]?D.top-=c:"center"===n.my[1]&&(D.top-=c/2),D.left+=T[0],D.top+=T[1],s={marginLeft:d,marginTop:_},t.each(["left","top"],function(e,i){t.ui.position[w[e]]&&t.ui.position[w[e]][i](D,{targetWidth:p,targetHeight:f,elemWidth:h,elemHeight:c,collisionPosition:s,collisionWidth:x,collisionHeight:C,offset:[u[0]+T[0],u[1]+T[1]],my:n.my,at:n.at,within:b,elem:l})}),n.using&&(r=function(t){var e=g.left-D.left,i=e+p-h,s=g.top-D.top,r=s+f-c,u={target:{element:v,left:g.left,top:g.top,width:p,height:f},element:{element:l,left:D.left,top:D.top,width:h,height:c},horizontal:0>i?"left":e>0?"right":"center",vertical:0>r?"top":s>0?"bottom":"middle"};h>p&&p>a(e+i)&&(u.horizontal="center"),c>f&&f>a(s+r)&&(u.vertical="middle"),u.important=o(a(e),a(i))>o(a(s),a(r))?"horizontal":"vertical",n.using.call(this,t,u)}),l.offset(t.extend(D,{using:r}))})},t.ui.position={fit:{left:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollLeft:s.offset.left,a=s.width,r=t.left-e.collisionPosition.marginLeft,l=n-r,h=r+e.collisionWidth-a-n;e.collisionWidth>a?l>0&&0>=h?(i=t.left+l+e.collisionWidth-a-n,t.left+=l-i):t.left=h>0&&0>=l?n:l>h?n+a-e.collisionWidth:n:l>0?t.left+=l:h>0?t.left-=h:t.left=o(t.left-r,t.left)},top:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollTop:s.offset.top,a=e.within.height,r=t.top-e.collisionPosition.marginTop,l=n-r,h=r+e.collisionHeight-a-n;e.collisionHeight>a?l>0&&0>=h?(i=t.top+l+e.collisionHeight-a-n,t.top+=l-i):t.top=h>0&&0>=l?n:l>h?n+a-e.collisionHeight:n:l>0?t.top+=l:h>0?t.top-=h:t.top=o(t.top-r,t.top)}},flip:{left:function(t,e){var i,s,n=e.within,o=n.offset.left+n.scrollLeft,r=n.width,l=n.isWindow?n.scrollLeft:n.offset.left,h=t.left-e.collisionPosition.marginLeft,c=h-l,u=h+e.collisionWidth-r-l,d="left"===e.my[0]?-e.elemWidth:"right"===e.my[0]?e.elemWidth:0,p="left"===e.at[0]?e.targetWidth:"right"===e.at[0]?-e.targetWidth:0,f=-2*e.offset[0];0>c?(i=t.left+d+p+f+e.collisionWidth-r-o,(0>i||a(c)>i)&&(t.left+=d+p+f)):u>0&&(s=t.left-e.collisionPosition.marginLeft+d+p+f-l,(s>0||u>a(s))&&(t.left+=d+p+f))},top:function(t,e){var i,s,n=e.within,o=n.offset.top+n.scrollTop,r=n.height,l=n.isWindow?n.scrollTop:n.offset.top,h=t.top-e.collisionPosition.marginTop,c=h-l,u=h+e.collisionHeight-r-l,d="top"===e.my[1],p=d?-e.elemHeight:"bottom"===e.my[1]?e.elemHeight:0,f="top"===e.at[1]?e.targetHeight:"bottom"===e.at[1]?-e.targetHeight:0,g=-2*e.offset[1];0>c?(s=t.top+p+f+g+e.collisionHeight-r-o,(0>s||a(c)>s)&&(t.top+=p+f+g)):u>0&&(i=t.top-e.collisionPosition.marginTop+p+f+g-l,(i>0||u>a(i))&&(t.top+=p+f+g))}},flipfit:{left:function(){t.ui.position.flip.left.apply(this,arguments),t.ui.position.fit.left.apply(this,arguments)},top:function(){t.ui.position.flip.top.apply(this,arguments),t.ui.position.fit.top.apply(this,arguments)}}}}(),t.ui.position,t.extend(t.expr[":"],{data:t.expr.createPseudo?t.expr.createPseudo(function(e){return function(i){return!!t.data(i,e)}}):function(e,i,s){return!!t.data(e,s[3])}}),t.fn.extend({disableSelection:function(){var t="onselectstart"in document.createElement("div")?"selectstart":"mousedown";return function(){return this.on(t+".ui-disableSelection",function(t){t.preventDefault()})}}(),enableSelection:function(){return this.off(".ui-disableSelection")}}),t.ui.focusable=function(i,s){var n,o,a,r,l,h=i.nodeName.toLowerCase();return"area"===h?(n=i.parentNode,o=n.name,i.href&&o&&"map"===n.nodeName.toLowerCase()?(a=t("img[usemap='#"+o+"']"),a.length>0&&a.is(":visible")):!1):(/^(input|select|textarea|button|object)$/.test(h)?(r=!i.disabled,r&&(l=t(i).closest("fieldset")[0],l&&(r=!l.disabled))):r="a"===h?i.href||s:s,r&&t(i).is(":visible")&&e(t(i)))},t.extend(t.expr[":"],{focusable:function(e){return t.ui.focusable(e,null!=t.attr(e,"tabindex"))}}),t.ui.focusable,t.fn.form=function(){return"string"==typeof this[0].form?this.closest("form"):t(this[0].form)},t.ui.formResetMixin={_formResetHandler:function(){var e=t(this);setTimeout(function(){var i=e.data("ui-form-reset-instances");t.each(i,function(){this.refresh()})})},_bindFormResetHandler:function(){if(this.form=this.element.form(),this.form.length){var t=this.form.data("ui-form-reset-instances")||[];t.length||this.form.on("reset.ui-form-reset",this._formResetHandler),t.push(this),this.form.data("ui-form-reset-instances",t)}},_unbindFormResetHandler:function(){if(this.form.length){var e=this.form.data("ui-form-reset-instances");e.splice(t.inArray(this,e),1),e.length?this.form.data("ui-form-reset-instances",e):this.form.removeData("ui-form-reset-instances").off("reset.ui-form-reset")}}},"1.7"===t.fn.jquery.substring(0,3)&&(t.each(["Width","Height"],function(e,i){function s(e,i,s,o){return t.each(n,function(){i-=parseFloat(t.css(e,"padding"+this))||0,s&&(i-=parseFloat(t.css(e,"border"+this+"Width"))||0),o&&(i-=parseFloat(t.css(e,"margin"+this))||0)}),i}var n="Width"===i?["Left","Right"]:["Top","Bottom"],o=i.toLowerCase(),a={innerWidth:t.fn.innerWidth,innerHeight:t.fn.innerHeight,outerWidth:t.fn.outerWidth,outerHeight:t.fn.outerHeight};t.fn["inner"+i]=function(e){return void 0===e?a["inner"+i].call(this):this.each(function(){t(this).css(o,s(this,e)+"px")})},t.fn["outer"+i]=function(e,n){return"number"!=typeof e?a["outer"+i].call(this,e):this.each(function(){t(this).css(o,s(this,e,!0,n)+"px")})}}),t.fn.addBack=function(t){return this.add(null==t?this.prevObject:this.prevObject.filter(t))}),t.ui.keyCode={BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38},t.ui.escapeSelector=function(){var t=/([!"#$%&'()*+,./:;<=>?@[\]^`{|}~])/g;return function(e){return e.replace(t,"\\$1")}}(),t.fn.labels=function(){var e,i,s,n,o;return this[0].labels&&this[0].labels.length?this.pushStack(this[0].labels):(n=this.eq(0).parents("label"),s=this.attr("id"),s&&(e=this.eq(0).parents().last(),o=e.add(e.length?e.siblings():this.siblings()),i="label[for='"+t.ui.escapeSelector(s)+"']",n=n.add(o.find(i).addBack(i))),this.pushStack(n))},t.fn.scrollParent=function(e){var i=this.css("position"),s="absolute"===i,n=e?/(auto|scroll|hidden)/:/(auto|scroll)/,o=this.parents().filter(function(){var e=t(this);return s&&"static"===e.css("position")?!1:n.test(e.css("overflow")+e.css("overflow-y")+e.css("overflow-x"))}).eq(0);return"fixed"!==i&&o.length?o:t(this[0].ownerDocument||document)},t.extend(t.expr[":"],{tabbable:function(e){var i=t.attr(e,"tabindex"),s=null!=i;return(!s||i>=0)&&t.ui.focusable(e,s)}}),t.fn.extend({uniqueId:function(){var t=0;return function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++t)})}}(),removeUniqueId:function(){return this.each(function(){/^ui-id-\d+$/.test(this.id)&&t(this).removeAttr("id")})}}),t.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());var n=!1;t(document).on("mouseup",function(){n=!1}),t.widget("ui.mouse",{version:"1.12.1",options:{cancel:"input, textarea, button, select, option",distance:1,delay:0},_mouseInit:function(){var e=this;this.element.on("mousedown."+this.widgetName,function(t){return e._mouseDown(t)}).on("click."+this.widgetName,function(i){return!0===t.data(i.target,e.widgetName+".preventClickEvent")?(t.removeData(i.target,e.widgetName+".preventClickEvent"),i.stopImmediatePropagation(),!1):void 0}),this.started=!1},_mouseDestroy:function(){this.element.off("."+this.widgetName),this._mouseMoveDelegate&&this.document.off("mousemove."+this.widgetName,this._mouseMoveDelegate).off("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(e){if(!n){this._mouseMoved=!1,this._mouseStarted&&this._mouseUp(e),this._mouseDownEvent=e;var i=this,s=1===e.which,o="string"==typeof this.options.cancel&&e.target.nodeName?t(e.target).closest(this.options.cancel).length:!1;return s&&!o&&this._mouseCapture(e)?(this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){i.mouseDelayMet=!0},this.options.delay)),this._mouseDistanceMet(e)&&this._mouseDelayMet(e)&&(this._mouseStarted=this._mouseStart(e)!==!1,!this._mouseStarted)?(e.preventDefault(),!0):(!0===t.data(e.target,this.widgetName+".preventClickEvent")&&t.removeData(e.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(t){return i._mouseMove(t)},this._mouseUpDelegate=function(t){return i._mouseUp(t)},this.document.on("mousemove."+this.widgetName,this._mouseMoveDelegate).on("mouseup."+this.widgetName,this._mouseUpDelegate),e.preventDefault(),n=!0,!0)):!0}},_mouseMove:function(e){if(this._mouseMoved){if(t.ui.ie&&(!document.documentMode||9>document.documentMode)&&!e.button)return this._mouseUp(e);if(!e.which)if(e.originalEvent.altKey||e.originalEvent.ctrlKey||e.originalEvent.metaKey||e.originalEvent.shiftKey)this.ignoreMissingWhich=!0;else if(!this.ignoreMissingWhich)return this._mouseUp(e)}return(e.which||e.button)&&(this._mouseMoved=!0),this._mouseStarted?(this._mouseDrag(e),e.preventDefault()):(this._mouseDistanceMet(e)&&this._mouseDelayMet(e)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,e)!==!1,this._mouseStarted?this._mouseDrag(e):this._mouseUp(e)),!this._mouseStarted)},_mouseUp:function(e){this.document.off("mousemove."+this.widgetName,this._mouseMoveDelegate).off("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,e.target===this._mouseDownEvent.target&&t.data(e.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(e)),this._mouseDelayTimer&&(clearTimeout(this._mouseDelayTimer),delete this._mouseDelayTimer),this.ignoreMissingWhich=!1,n=!1,e.preventDefault()},_mouseDistanceMet:function(t){return Math.max(Math.abs(this._mouseDownEvent.pageX-t.pageX),Math.abs(this._mouseDownEvent.pageY-t.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return!0}}),t.ui.plugin={add:function(e,i,s){var n,o=t.ui[e].prototype;for(n in s)o.plugins[n]=o.plugins[n]||[],o.plugins[n].push([i,s[n]])},call:function(t,e,i,s){var n,o=t.plugins[e];if(o&&(s||t.element[0].parentNode&&11!==t.element[0].parentNode.nodeType))for(n=0;o.length>n;n++)t.options[o[n][0]]&&o[n][1].apply(t.element,i)}},t.ui.safeActiveElement=function(t){var e;try{e=t.activeElement}catch(i){e=t.body}return e||(e=t.body),e.nodeName||(e=t.body),e},t.ui.safeBlur=function(e){e&&"body"!==e.nodeName.toLowerCase()&&t(e).trigger("blur")},t.widget("ui.draggable",t.ui.mouse,{version:"1.12.1",widgetEventPrefix:"drag",options:{addClasses:!0,appendTo:"parent",axis:!1,connectToSortable:!1,containment:!1,cursor:"auto",cursorAt:!1,grid:!1,handle:!1,helper:"original",iframeFix:!1,opacity:!1,refreshPositions:!1,revert:!1,revertDuration:500,scope:"default",scroll:!0,scrollSensitivity:20,scrollSpeed:20,snap:!1,snapMode:"both",snapTolerance:20,stack:!1,zIndex:!1,drag:null,start:null,stop:null},_create:function(){"original"===this.options.helper&&this._setPositionRelative(),this.options.addClasses&&this._addClass("ui-draggable"),this._setHandleClassName(),this._mouseInit()},_setOption:function(t,e){this._super(t,e),"handle"===t&&(this._removeHandleClassName(),this._setHandleClassName())},_destroy:function(){return(this.helper||this.element).is(".ui-draggable-dragging")?(this.destroyOnClear=!0,void 0):(this._removeHandleClassName(),this._mouseDestroy(),void 0)},_mouseCapture:function(e){var i=this.options;return this.helper||i.disabled||t(e.target).closest(".ui-resizable-handle").length>0?!1:(this.handle=this._getHandle(e),this.handle?(this._blurActiveElement(e),this._blockFrames(i.iframeFix===!0?"iframe":i.iframeFix),!0):!1)},_blockFrames:function(e){this.iframeBlocks=this.document.find(e).map(function(){var e=t(this);return t("<div>").css("position","absolute").appendTo(e.parent()).outerWidth(e.outerWidth()).outerHeight(e.outerHeight()).offset(e.offset())[0]})},_unblockFrames:function(){this.iframeBlocks&&(this.iframeBlocks.remove(),delete this.iframeBlocks)},_blurActiveElement:function(e){var i=t.ui.safeActiveElement(this.document[0]),s=t(e.target);s.closest(i).length||t.ui.safeBlur(i)},_mouseStart:function(e){var i=this.options;return this.helper=this._createHelper(e),this._addClass(this.helper,"ui-draggable-dragging"),this._cacheHelperProportions(),t.ui.ddmanager&&(t.ui.ddmanager.current=this),this._cacheMargins(),this.cssPosition=this.helper.css("position"),this.scrollParent=this.helper.scrollParent(!0),this.offsetParent=this.helper.offsetParent(),this.hasFixedAncestor=this.helper.parents().filter(function(){return"fixed"===t(this).css("position")}).length>0,this.positionAbs=this.element.offset(),this._refreshOffsets(e),this.originalPosition=this.position=this._generatePosition(e,!1),this.originalPageX=e.pageX,this.originalPageY=e.pageY,i.cursorAt&&this._adjustOffsetFromHelper(i.cursorAt),this._setContainment(),this._trigger("start",e)===!1?(this._clear(),!1):(this._cacheHelperProportions(),t.ui.ddmanager&&!i.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e),this._mouseDrag(e,!0),t.ui.ddmanager&&t.ui.ddmanager.dragStart(this,e),!0)},_refreshOffsets:function(t){this.offset={top:this.positionAbs.top-this.margins.top,left:this.positionAbs.left-this.margins.left,scroll:!1,parent:this._getParentOffset(),relative:this._getRelativeOffset()},this.offset.click={left:t.pageX-this.offset.left,top:t.pageY-this.offset.top}},_mouseDrag:function(e,i){if(this.hasFixedAncestor&&(this.offset.parent=this._getParentOffset()),this.position=this._generatePosition(e,!0),this.positionAbs=this._convertPositionTo("absolute"),!i){var s=this._uiHash();if(this._trigger("drag",e,s)===!1)return this._mouseUp(new t.Event("mouseup",e)),!1;this.position=s.position}return this.helper[0].style.left=this.position.left+"px",this.helper[0].style.top=this.position.top+"px",t.ui.ddmanager&&t.ui.ddmanager.drag(this,e),!1},_mouseStop:function(e){var i=this,s=!1;return t.ui.ddmanager&&!this.options.dropBehaviour&&(s=t.ui.ddmanager.drop(this,e)),this.dropped&&(s=this.dropped,this.dropped=!1),"invalid"===this.options.revert&&!s||"valid"===this.options.revert&&s||this.options.revert===!0||t.isFunction(this.options.revert)&&this.options.revert.call(this.element,s)?t(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){i._trigger("stop",e)!==!1&&i._clear()}):this._trigger("stop",e)!==!1&&this._clear(),!1},_mouseUp:function(e){return this._unblockFrames(),t.ui.ddmanager&&t.ui.ddmanager.dragStop(this,e),this.handleElement.is(e.target)&&this.element.trigger("focus"),t.ui.mouse.prototype._mouseUp.call(this,e)},cancel:function(){return this.helper.is(".ui-draggable-dragging")?this._mouseUp(new t.Event("mouseup",{target:this.element[0]})):this._clear(),this},_getHandle:function(e){return this.options.handle?!!t(e.target).closest(this.element.find(this.options.handle)).length:!0},_setHandleClassName:function(){this.handleElement=this.options.handle?this.element.find(this.options.handle):this.element,this._addClass(this.handleElement,"ui-draggable-handle")},_removeHandleClassName:function(){this._removeClass(this.handleElement,"ui-draggable-handle")},_createHelper:function(e){var i=this.options,s=t.isFunction(i.helper),n=s?t(i.helper.apply(this.element[0],[e])):"clone"===i.helper?this.element.clone().removeAttr("id"):this.element;return n.parents("body").length||n.appendTo("parent"===i.appendTo?this.element[0].parentNode:i.appendTo),s&&n[0]===this.element[0]&&this._setPositionRelative(),n[0]===this.element[0]||/(fixed|absolute)/.test(n.css("position"))||n.css("position","absolute"),n},_setPositionRelative:function(){/^(?:r|a|f)/.test(this.element.css("position"))||(this.element[0].style.position="relative")},_adjustOffsetFromHelper:function(e){"string"==typeof e&&(e=e.split(" ")),t.isArray(e)&&(e={left:+e[0],top:+e[1]||0}),"left"in e&&(this.offset.click.left=e.left+this.margins.left),"right"in e&&(this.offset.click.left=this.helperProportions.width-e.right+this.margins.left),"top"in e&&(this.offset.click.top=e.top+this.margins.top),"bottom"in e&&(this.offset.click.top=this.helperProportions.height-e.bottom+this.margins.top)},_isRootNode:function(t){return/(html|body)/i.test(t.tagName)||t===this.document[0]},_getParentOffset:function(){var e=this.offsetParent.offset(),i=this.document[0];return"absolute"===this.cssPosition&&this.scrollParent[0]!==i&&t.contains(this.scrollParent[0],this.offsetParent[0])&&(e.left+=this.scrollParent.scrollLeft(),e.top+=this.scrollParent.scrollTop()),this._isRootNode(this.offsetParent[0])&&(e={top:0,left:0}),{top:e.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:e.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"!==this.cssPosition)return{top:0,left:0};var t=this.element.position(),e=this._isRootNode(this.scrollParent[0]);return{top:t.top-(parseInt(this.helper.css("top"),10)||0)+(e?0:this.scrollParent.scrollTop()),left:t.left-(parseInt(this.helper.css("left"),10)||0)+(e?0:this.scrollParent.scrollLeft())}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var e,i,s,n=this.options,o=this.document[0];return this.relativeContainer=null,n.containment?"window"===n.containment?(this.containment=[t(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,t(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,t(window).scrollLeft()+t(window).width()-this.helperProportions.width-this.margins.left,t(window).scrollTop()+(t(window).height()||o.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top],void 0):"document"===n.containment?(this.containment=[0,0,t(o).width()-this.helperProportions.width-this.margins.left,(t(o).height()||o.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top],void 0):n.containment.constructor===Array?(this.containment=n.containment,void 0):("parent"===n.containment&&(n.containment=this.helper[0].parentNode),i=t(n.containment),s=i[0],s&&(e=/(scroll|auto)/.test(i.css("overflow")),this.containment=[(parseInt(i.css("borderLeftWidth"),10)||0)+(parseInt(i.css("paddingLeft"),10)||0),(parseInt(i.css("borderTopWidth"),10)||0)+(parseInt(i.css("paddingTop"),10)||0),(e?Math.max(s.scrollWidth,s.offsetWidth):s.offsetWidth)-(parseInt(i.css("borderRightWidth"),10)||0)-(parseInt(i.css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(e?Math.max(s.scrollHeight,s.offsetHeight):s.offsetHeight)-(parseInt(i.css("borderBottomWidth"),10)||0)-(parseInt(i.css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom],this.relativeContainer=i),void 0):(this.containment=null,void 0)},_convertPositionTo:function(t,e){e||(e=this.position);var i="absolute"===t?1:-1,s=this._isRootNode(this.scrollParent[0]);return{top:e.top+this.offset.relative.top*i+this.offset.parent.top*i-("fixed"===this.cssPosition?-this.offset.scroll.top:s?0:this.offset.scroll.top)*i,left:e.left+this.offset.relative.left*i+this.offset.parent.left*i-("fixed"===this.cssPosition?-this.offset.scroll.left:s?0:this.offset.scroll.left)*i}},_generatePosition:function(t,e){var i,s,n,o,a=this.options,r=this._isRootNode(this.scrollParent[0]),l=t.pageX,h=t.pageY;return r&&this.offset.scroll||(this.offset.scroll={top:this.scrollParent.scrollTop(),left:this.scrollParent.scrollLeft()}),e&&(this.containment&&(this.relativeContainer?(s=this.relativeContainer.offset(),i=[this.containment[0]+s.left,this.containment[1]+s.top,this.containment[2]+s.left,this.containment[3]+s.top]):i=this.containment,t.pageX-this.offset.click.left<i[0]&&(l=i[0]+this.offset.click.left),t.pageY-this.offset.click.top<i[1]&&(h=i[1]+this.offset.click.top),t.pageX-this.offset.click.left>i[2]&&(l=i[2]+this.offset.click.left),t.pageY-this.offset.click.top>i[3]&&(h=i[3]+this.offset.click.top)),a.grid&&(n=a.grid[1]?this.originalPageY+Math.round((h-this.originalPageY)/a.grid[1])*a.grid[1]:this.originalPageY,h=i?n-this.offset.click.top>=i[1]||n-this.offset.click.top>i[3]?n:n-this.offset.click.top>=i[1]?n-a.grid[1]:n+a.grid[1]:n,o=a.grid[0]?this.originalPageX+Math.round((l-this.originalPageX)/a.grid[0])*a.grid[0]:this.originalPageX,l=i?o-this.offset.click.left>=i[0]||o-this.offset.click.left>i[2]?o:o-this.offset.click.left>=i[0]?o-a.grid[0]:o+a.grid[0]:o),"y"===a.axis&&(l=this.originalPageX),"x"===a.axis&&(h=this.originalPageY)),{top:h-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.offset.scroll.top:r?0:this.offset.scroll.top),left:l-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.offset.scroll.left:r?0:this.offset.scroll.left)}
},_clear:function(){this._removeClass(this.helper,"ui-draggable-dragging"),this.helper[0]===this.element[0]||this.cancelHelperRemoval||this.helper.remove(),this.helper=null,this.cancelHelperRemoval=!1,this.destroyOnClear&&this.destroy()},_trigger:function(e,i,s){return s=s||this._uiHash(),t.ui.plugin.call(this,e,[i,s,this],!0),/^(drag|start|stop)/.test(e)&&(this.positionAbs=this._convertPositionTo("absolute"),s.offset=this.positionAbs),t.Widget.prototype._trigger.call(this,e,i,s)},plugins:{},_uiHash:function(){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}}),t.ui.plugin.add("draggable","connectToSortable",{start:function(e,i,s){var n=t.extend({},i,{item:s.element});s.sortables=[],t(s.options.connectToSortable).each(function(){var i=t(this).sortable("instance");i&&!i.options.disabled&&(s.sortables.push(i),i.refreshPositions(),i._trigger("activate",e,n))})},stop:function(e,i,s){var n=t.extend({},i,{item:s.element});s.cancelHelperRemoval=!1,t.each(s.sortables,function(){var t=this;t.isOver?(t.isOver=0,s.cancelHelperRemoval=!0,t.cancelHelperRemoval=!1,t._storedCSS={position:t.placeholder.css("position"),top:t.placeholder.css("top"),left:t.placeholder.css("left")},t._mouseStop(e),t.options.helper=t.options._helper):(t.cancelHelperRemoval=!0,t._trigger("deactivate",e,n))})},drag:function(e,i,s){t.each(s.sortables,function(){var n=!1,o=this;o.positionAbs=s.positionAbs,o.helperProportions=s.helperProportions,o.offset.click=s.offset.click,o._intersectsWith(o.containerCache)&&(n=!0,t.each(s.sortables,function(){return this.positionAbs=s.positionAbs,this.helperProportions=s.helperProportions,this.offset.click=s.offset.click,this!==o&&this._intersectsWith(this.containerCache)&&t.contains(o.element[0],this.element[0])&&(n=!1),n})),n?(o.isOver||(o.isOver=1,s._parent=i.helper.parent(),o.currentItem=i.helper.appendTo(o.element).data("ui-sortable-item",!0),o.options._helper=o.options.helper,o.options.helper=function(){return i.helper[0]},e.target=o.currentItem[0],o._mouseCapture(e,!0),o._mouseStart(e,!0,!0),o.offset.click.top=s.offset.click.top,o.offset.click.left=s.offset.click.left,o.offset.parent.left-=s.offset.parent.left-o.offset.parent.left,o.offset.parent.top-=s.offset.parent.top-o.offset.parent.top,s._trigger("toSortable",e),s.dropped=o.element,t.each(s.sortables,function(){this.refreshPositions()}),s.currentItem=s.element,o.fromOutside=s),o.currentItem&&(o._mouseDrag(e),i.position=o.position)):o.isOver&&(o.isOver=0,o.cancelHelperRemoval=!0,o.options._revert=o.options.revert,o.options.revert=!1,o._trigger("out",e,o._uiHash(o)),o._mouseStop(e,!0),o.options.revert=o.options._revert,o.options.helper=o.options._helper,o.placeholder&&o.placeholder.remove(),i.helper.appendTo(s._parent),s._refreshOffsets(e),i.position=s._generatePosition(e,!0),s._trigger("fromSortable",e),s.dropped=!1,t.each(s.sortables,function(){this.refreshPositions()}))})}}),t.ui.plugin.add("draggable","cursor",{start:function(e,i,s){var n=t("body"),o=s.options;n.css("cursor")&&(o._cursor=n.css("cursor")),n.css("cursor",o.cursor)},stop:function(e,i,s){var n=s.options;n._cursor&&t("body").css("cursor",n._cursor)}}),t.ui.plugin.add("draggable","opacity",{start:function(e,i,s){var n=t(i.helper),o=s.options;n.css("opacity")&&(o._opacity=n.css("opacity")),n.css("opacity",o.opacity)},stop:function(e,i,s){var n=s.options;n._opacity&&t(i.helper).css("opacity",n._opacity)}}),t.ui.plugin.add("draggable","scroll",{start:function(t,e,i){i.scrollParentNotHidden||(i.scrollParentNotHidden=i.helper.scrollParent(!1)),i.scrollParentNotHidden[0]!==i.document[0]&&"HTML"!==i.scrollParentNotHidden[0].tagName&&(i.overflowOffset=i.scrollParentNotHidden.offset())},drag:function(e,i,s){var n=s.options,o=!1,a=s.scrollParentNotHidden[0],r=s.document[0];a!==r&&"HTML"!==a.tagName?(n.axis&&"x"===n.axis||(s.overflowOffset.top+a.offsetHeight-e.pageY<n.scrollSensitivity?a.scrollTop=o=a.scrollTop+n.scrollSpeed:e.pageY-s.overflowOffset.top<n.scrollSensitivity&&(a.scrollTop=o=a.scrollTop-n.scrollSpeed)),n.axis&&"y"===n.axis||(s.overflowOffset.left+a.offsetWidth-e.pageX<n.scrollSensitivity?a.scrollLeft=o=a.scrollLeft+n.scrollSpeed:e.pageX-s.overflowOffset.left<n.scrollSensitivity&&(a.scrollLeft=o=a.scrollLeft-n.scrollSpeed))):(n.axis&&"x"===n.axis||(e.pageY-t(r).scrollTop()<n.scrollSensitivity?o=t(r).scrollTop(t(r).scrollTop()-n.scrollSpeed):t(window).height()-(e.pageY-t(r).scrollTop())<n.scrollSensitivity&&(o=t(r).scrollTop(t(r).scrollTop()+n.scrollSpeed))),n.axis&&"y"===n.axis||(e.pageX-t(r).scrollLeft()<n.scrollSensitivity?o=t(r).scrollLeft(t(r).scrollLeft()-n.scrollSpeed):t(window).width()-(e.pageX-t(r).scrollLeft())<n.scrollSensitivity&&(o=t(r).scrollLeft(t(r).scrollLeft()+n.scrollSpeed)))),o!==!1&&t.ui.ddmanager&&!n.dropBehaviour&&t.ui.ddmanager.prepareOffsets(s,e)}}),t.ui.plugin.add("draggable","snap",{start:function(e,i,s){var n=s.options;s.snapElements=[],t(n.snap.constructor!==String?n.snap.items||":data(ui-draggable)":n.snap).each(function(){var e=t(this),i=e.offset();this!==s.element[0]&&s.snapElements.push({item:this,width:e.outerWidth(),height:e.outerHeight(),top:i.top,left:i.left})})},drag:function(e,i,s){var n,o,a,r,l,h,c,u,d,p,f=s.options,g=f.snapTolerance,m=i.offset.left,_=m+s.helperProportions.width,v=i.offset.top,b=v+s.helperProportions.height;for(d=s.snapElements.length-1;d>=0;d--)l=s.snapElements[d].left-s.margins.left,h=l+s.snapElements[d].width,c=s.snapElements[d].top-s.margins.top,u=c+s.snapElements[d].height,l-g>_||m>h+g||c-g>b||v>u+g||!t.contains(s.snapElements[d].item.ownerDocument,s.snapElements[d].item)?(s.snapElements[d].snapping&&s.options.snap.release&&s.options.snap.release.call(s.element,e,t.extend(s._uiHash(),{snapItem:s.snapElements[d].item})),s.snapElements[d].snapping=!1):("inner"!==f.snapMode&&(n=g>=Math.abs(c-b),o=g>=Math.abs(u-v),a=g>=Math.abs(l-_),r=g>=Math.abs(h-m),n&&(i.position.top=s._convertPositionTo("relative",{top:c-s.helperProportions.height,left:0}).top),o&&(i.position.top=s._convertPositionTo("relative",{top:u,left:0}).top),a&&(i.position.left=s._convertPositionTo("relative",{top:0,left:l-s.helperProportions.width}).left),r&&(i.position.left=s._convertPositionTo("relative",{top:0,left:h}).left)),p=n||o||a||r,"outer"!==f.snapMode&&(n=g>=Math.abs(c-v),o=g>=Math.abs(u-b),a=g>=Math.abs(l-m),r=g>=Math.abs(h-_),n&&(i.position.top=s._convertPositionTo("relative",{top:c,left:0}).top),o&&(i.position.top=s._convertPositionTo("relative",{top:u-s.helperProportions.height,left:0}).top),a&&(i.position.left=s._convertPositionTo("relative",{top:0,left:l}).left),r&&(i.position.left=s._convertPositionTo("relative",{top:0,left:h-s.helperProportions.width}).left)),!s.snapElements[d].snapping&&(n||o||a||r||p)&&s.options.snap.snap&&s.options.snap.snap.call(s.element,e,t.extend(s._uiHash(),{snapItem:s.snapElements[d].item})),s.snapElements[d].snapping=n||o||a||r||p)}}),t.ui.plugin.add("draggable","stack",{start:function(e,i,s){var n,o=s.options,a=t.makeArray(t(o.stack)).sort(function(e,i){return(parseInt(t(e).css("zIndex"),10)||0)-(parseInt(t(i).css("zIndex"),10)||0)});a.length&&(n=parseInt(t(a[0]).css("zIndex"),10)||0,t(a).each(function(e){t(this).css("zIndex",n+e)}),this.css("zIndex",n+a.length))}}),t.ui.plugin.add("draggable","zIndex",{start:function(e,i,s){var n=t(i.helper),o=s.options;n.css("zIndex")&&(o._zIndex=n.css("zIndex")),n.css("zIndex",o.zIndex)},stop:function(e,i,s){var n=s.options;n._zIndex&&t(i.helper).css("zIndex",n._zIndex)}}),t.ui.draggable,t.widget("ui.droppable",{version:"1.12.1",widgetEventPrefix:"drop",options:{accept:"*",addClasses:!0,greedy:!1,scope:"default",tolerance:"intersect",activate:null,deactivate:null,drop:null,out:null,over:null},_create:function(){var e,i=this.options,s=i.accept;this.isover=!1,this.isout=!0,this.accept=t.isFunction(s)?s:function(t){return t.is(s)},this.proportions=function(){return arguments.length?(e=arguments[0],void 0):e?e:e={width:this.element[0].offsetWidth,height:this.element[0].offsetHeight}},this._addToManager(i.scope),i.addClasses&&this._addClass("ui-droppable")},_addToManager:function(e){t.ui.ddmanager.droppables[e]=t.ui.ddmanager.droppables[e]||[],t.ui.ddmanager.droppables[e].push(this)},_splice:function(t){for(var e=0;t.length>e;e++)t[e]===this&&t.splice(e,1)},_destroy:function(){var e=t.ui.ddmanager.droppables[this.options.scope];this._splice(e)},_setOption:function(e,i){if("accept"===e)this.accept=t.isFunction(i)?i:function(t){return t.is(i)};else if("scope"===e){var s=t.ui.ddmanager.droppables[this.options.scope];this._splice(s),this._addToManager(i)}this._super(e,i)},_activate:function(e){var i=t.ui.ddmanager.current;this._addActiveClass(),i&&this._trigger("activate",e,this.ui(i))},_deactivate:function(e){var i=t.ui.ddmanager.current;this._removeActiveClass(),i&&this._trigger("deactivate",e,this.ui(i))},_over:function(e){var i=t.ui.ddmanager.current;i&&(i.currentItem||i.element)[0]!==this.element[0]&&this.accept.call(this.element[0],i.currentItem||i.element)&&(this._addHoverClass(),this._trigger("over",e,this.ui(i)))},_out:function(e){var i=t.ui.ddmanager.current;i&&(i.currentItem||i.element)[0]!==this.element[0]&&this.accept.call(this.element[0],i.currentItem||i.element)&&(this._removeHoverClass(),this._trigger("out",e,this.ui(i)))},_drop:function(e,i){var s=i||t.ui.ddmanager.current,n=!1;return s&&(s.currentItem||s.element)[0]!==this.element[0]?(this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each(function(){var i=t(this).droppable("instance");return i.options.greedy&&!i.options.disabled&&i.options.scope===s.options.scope&&i.accept.call(i.element[0],s.currentItem||s.element)&&o(s,t.extend(i,{offset:i.element.offset()}),i.options.tolerance,e)?(n=!0,!1):void 0}),n?!1:this.accept.call(this.element[0],s.currentItem||s.element)?(this._removeActiveClass(),this._removeHoverClass(),this._trigger("drop",e,this.ui(s)),this.element):!1):!1},ui:function(t){return{draggable:t.currentItem||t.element,helper:t.helper,position:t.position,offset:t.positionAbs}},_addHoverClass:function(){this._addClass("ui-droppable-hover")},_removeHoverClass:function(){this._removeClass("ui-droppable-hover")},_addActiveClass:function(){this._addClass("ui-droppable-active")},_removeActiveClass:function(){this._removeClass("ui-droppable-active")}});var o=t.ui.intersect=function(){function t(t,e,i){return t>=e&&e+i>t}return function(e,i,s,n){if(!i.offset)return!1;var o=(e.positionAbs||e.position.absolute).left+e.margins.left,a=(e.positionAbs||e.position.absolute).top+e.margins.top,r=o+e.helperProportions.width,l=a+e.helperProportions.height,h=i.offset.left,c=i.offset.top,u=h+i.proportions().width,d=c+i.proportions().height;switch(s){case"fit":return o>=h&&u>=r&&a>=c&&d>=l;case"intersect":return o+e.helperProportions.width/2>h&&u>r-e.helperProportions.width/2&&a+e.helperProportions.height/2>c&&d>l-e.helperProportions.height/2;case"pointer":return t(n.pageY,c,i.proportions().height)&&t(n.pageX,h,i.proportions().width);case"touch":return(a>=c&&d>=a||l>=c&&d>=l||c>a&&l>d)&&(o>=h&&u>=o||r>=h&&u>=r||h>o&&r>u);default:return!1}}}();t.ui.ddmanager={current:null,droppables:{"default":[]},prepareOffsets:function(e,i){var s,n,o=t.ui.ddmanager.droppables[e.options.scope]||[],a=i?i.type:null,r=(e.currentItem||e.element).find(":data(ui-droppable)").addBack();t:for(s=0;o.length>s;s++)if(!(o[s].options.disabled||e&&!o[s].accept.call(o[s].element[0],e.currentItem||e.element))){for(n=0;r.length>n;n++)if(r[n]===o[s].element[0]){o[s].proportions().height=0;continue t}o[s].visible="none"!==o[s].element.css("display"),o[s].visible&&("mousedown"===a&&o[s]._activate.call(o[s],i),o[s].offset=o[s].element.offset(),o[s].proportions({width:o[s].element[0].offsetWidth,height:o[s].element[0].offsetHeight}))}},drop:function(e,i){var s=!1;return t.each((t.ui.ddmanager.droppables[e.options.scope]||[]).slice(),function(){this.options&&(!this.options.disabled&&this.visible&&o(e,this,this.options.tolerance,i)&&(s=this._drop.call(this,i)||s),!this.options.disabled&&this.visible&&this.accept.call(this.element[0],e.currentItem||e.element)&&(this.isout=!0,this.isover=!1,this._deactivate.call(this,i)))}),s},dragStart:function(e,i){e.element.parentsUntil("body").on("scroll.droppable",function(){e.options.refreshPositions||t.ui.ddmanager.prepareOffsets(e,i)})},drag:function(e,i){e.options.refreshPositions&&t.ui.ddmanager.prepareOffsets(e,i),t.each(t.ui.ddmanager.droppables[e.options.scope]||[],function(){if(!this.options.disabled&&!this.greedyChild&&this.visible){var s,n,a,r=o(e,this,this.options.tolerance,i),l=!r&&this.isover?"isout":r&&!this.isover?"isover":null;l&&(this.options.greedy&&(n=this.options.scope,a=this.element.parents(":data(ui-droppable)").filter(function(){return t(this).droppable("instance").options.scope===n}),a.length&&(s=t(a[0]).droppable("instance"),s.greedyChild="isover"===l)),s&&"isover"===l&&(s.isover=!1,s.isout=!0,s._out.call(s,i)),this[l]=!0,this["isout"===l?"isover":"isout"]=!1,this["isover"===l?"_over":"_out"].call(this,i),s&&"isout"===l&&(s.isout=!1,s.isover=!0,s._over.call(s,i)))}})},dragStop:function(e,i){e.element.parentsUntil("body").off("scroll.droppable"),e.options.refreshPositions||t.ui.ddmanager.prepareOffsets(e,i)}},t.uiBackCompat!==!1&&t.widget("ui.droppable",t.ui.droppable,{options:{hoverClass:!1,activeClass:!1},_addActiveClass:function(){this._super(),this.options.activeClass&&this.element.addClass(this.options.activeClass)},_removeActiveClass:function(){this._super(),this.options.activeClass&&this.element.removeClass(this.options.activeClass)},_addHoverClass:function(){this._super(),this.options.hoverClass&&this.element.addClass(this.options.hoverClass)},_removeHoverClass:function(){this._super(),this.options.hoverClass&&this.element.removeClass(this.options.hoverClass)}}),t.ui.droppable,t.widget("ui.resizable",t.ui.mouse,{version:"1.12.1",widgetEventPrefix:"resize",options:{alsoResize:!1,animate:!1,animateDuration:"slow",animateEasing:"swing",aspectRatio:!1,autoHide:!1,classes:{"ui-resizable-se":"ui-icon ui-icon-gripsmall-diagonal-se"},containment:!1,ghost:!1,grid:!1,handles:"e,s,se",helper:!1,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:90,resize:null,start:null,stop:null},_num:function(t){return parseFloat(t)||0},_isNumber:function(t){return!isNaN(parseFloat(t))},_hasScroll:function(e,i){if("hidden"===t(e).css("overflow"))return!1;var s=i&&"left"===i?"scrollLeft":"scrollTop",n=!1;return e[s]>0?!0:(e[s]=1,n=e[s]>0,e[s]=0,n)},_create:function(){var e,i=this.options,s=this;this._addClass("ui-resizable"),t.extend(this,{_aspectRatio:!!i.aspectRatio,aspectRatio:i.aspectRatio,originalElement:this.element,_proportionallyResizeElements:[],_helper:i.helper||i.ghost||i.animate?i.helper||"ui-resizable-helper":null}),this.element[0].nodeName.match(/^(canvas|textarea|input|select|button|img)$/i)&&(this.element.wrap(t("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),top:this.element.css("top"),left:this.element.css("left")})),this.element=this.element.parent().data("ui-resizable",this.element.resizable("instance")),this.elementIsWrapper=!0,e={marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom"),marginLeft:this.originalElement.css("marginLeft")},this.element.css(e),this.originalElement.css("margin",0),this.originalResizeStyle=this.originalElement.css("resize"),this.originalElement.css("resize","none"),this._proportionallyResizeElements.push(this.originalElement.css({position:"static",zoom:1,display:"block"})),this.originalElement.css(e),this._proportionallyResize()),this._setupHandles(),i.autoHide&&t(this.element).on("mouseenter",function(){i.disabled||(s._removeClass("ui-resizable-autohide"),s._handles.show())}).on("mouseleave",function(){i.disabled||s.resizing||(s._addClass("ui-resizable-autohide"),s._handles.hide())}),this._mouseInit()},_destroy:function(){this._mouseDestroy();var e,i=function(e){t(e).removeData("resizable").removeData("ui-resizable").off(".resizable").find(".ui-resizable-handle").remove()};return this.elementIsWrapper&&(i(this.element),e=this.element,this.originalElement.css({position:e.css("position"),width:e.outerWidth(),height:e.outerHeight(),top:e.css("top"),left:e.css("left")}).insertAfter(e),e.remove()),this.originalElement.css("resize",this.originalResizeStyle),i(this.originalElement),this},_setOption:function(t,e){switch(this._super(t,e),t){case"handles":this._removeHandles(),this._setupHandles();break;default:}},_setupHandles:function(){var e,i,s,n,o,a=this.options,r=this;if(this.handles=a.handles||(t(".ui-resizable-handle",this.element).length?{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",nw:".ui-resizable-nw"}:"e,s,se"),this._handles=t(),this.handles.constructor===String)for("all"===this.handles&&(this.handles="n,e,s,w,se,sw,ne,nw"),s=this.handles.split(","),this.handles={},i=0;s.length>i;i++)e=t.trim(s[i]),n="ui-resizable-"+e,o=t("<div>"),this._addClass(o,"ui-resizable-handle "+n),o.css({zIndex:a.zIndex}),this.handles[e]=".ui-resizable-"+e,this.element.append(o);this._renderAxis=function(e){var i,s,n,o;e=e||this.element;for(i in this.handles)this.handles[i].constructor===String?this.handles[i]=this.element.children(this.handles[i]).first().show():(this.handles[i].jquery||this.handles[i].nodeType)&&(this.handles[i]=t(this.handles[i]),this._on(this.handles[i],{mousedown:r._mouseDown})),this.elementIsWrapper&&this.originalElement[0].nodeName.match(/^(textarea|input|select|button)$/i)&&(s=t(this.handles[i],this.element),o=/sw|ne|nw|se|n|s/.test(i)?s.outerHeight():s.outerWidth(),n=["padding",/ne|nw|n/.test(i)?"Top":/se|sw|s/.test(i)?"Bottom":/^e$/.test(i)?"Right":"Left"].join(""),e.css(n,o),this._proportionallyResize()),this._handles=this._handles.add(this.handles[i])},this._renderAxis(this.element),this._handles=this._handles.add(this.element.find(".ui-resizable-handle")),this._handles.disableSelection(),this._handles.on("mouseover",function(){r.resizing||(this.className&&(o=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)),r.axis=o&&o[1]?o[1]:"se")}),a.autoHide&&(this._handles.hide(),this._addClass("ui-resizable-autohide"))},_removeHandles:function(){this._handles.remove()},_mouseCapture:function(e){var i,s,n=!1;for(i in this.handles)s=t(this.handles[i])[0],(s===e.target||t.contains(s,e.target))&&(n=!0);return!this.options.disabled&&n},_mouseStart:function(e){var i,s,n,o=this.options,a=this.element;return this.resizing=!0,this._renderProxy(),i=this._num(this.helper.css("left")),s=this._num(this.helper.css("top")),o.containment&&(i+=t(o.containment).scrollLeft()||0,s+=t(o.containment).scrollTop()||0),this.offset=this.helper.offset(),this.position={left:i,top:s},this.size=this._helper?{width:this.helper.width(),height:this.helper.height()}:{width:a.width(),height:a.height()},this.originalSize=this._helper?{width:a.outerWidth(),height:a.outerHeight()}:{width:a.width(),height:a.height()},this.sizeDiff={width:a.outerWidth()-a.width(),height:a.outerHeight()-a.height()},this.originalPosition={left:i,top:s},this.originalMousePosition={left:e.pageX,top:e.pageY},this.aspectRatio="number"==typeof o.aspectRatio?o.aspectRatio:this.originalSize.width/this.originalSize.height||1,n=t(".ui-resizable-"+this.axis).css("cursor"),t("body").css("cursor","auto"===n?this.axis+"-resize":n),this._addClass("ui-resizable-resizing"),this._propagate("start",e),!0},_mouseDrag:function(e){var i,s,n=this.originalMousePosition,o=this.axis,a=e.pageX-n.left||0,r=e.pageY-n.top||0,l=this._change[o];return this._updatePrevProperties(),l?(i=l.apply(this,[e,a,r]),this._updateVirtualBoundaries(e.shiftKey),(this._aspectRatio||e.shiftKey)&&(i=this._updateRatio(i,e)),i=this._respectSize(i,e),this._updateCache(i),this._propagate("resize",e),s=this._applyChanges(),!this._helper&&this._proportionallyResizeElements.length&&this._proportionallyResize(),t.isEmptyObject(s)||(this._updatePrevProperties(),this._trigger("resize",e,this.ui()),this._applyChanges()),!1):!1},_mouseStop:function(e){this.resizing=!1;var i,s,n,o,a,r,l,h=this.options,c=this;return this._helper&&(i=this._proportionallyResizeElements,s=i.length&&/textarea/i.test(i[0].nodeName),n=s&&this._hasScroll(i[0],"left")?0:c.sizeDiff.height,o=s?0:c.sizeDiff.width,a={width:c.helper.width()-o,height:c.helper.height()-n},r=parseFloat(c.element.css("left"))+(c.position.left-c.originalPosition.left)||null,l=parseFloat(c.element.css("top"))+(c.position.top-c.originalPosition.top)||null,h.animate||this.element.css(t.extend(a,{top:l,left:r})),c.helper.height(c.size.height),c.helper.width(c.size.width),this._helper&&!h.animate&&this._proportionallyResize()),t("body").css("cursor","auto"),this._removeClass("ui-resizable-resizing"),this._propagate("stop",e),this._helper&&this.helper.remove(),!1},_updatePrevProperties:function(){this.prevPosition={top:this.position.top,left:this.position.left},this.prevSize={width:this.size.width,height:this.size.height}},_applyChanges:function(){var t={};return this.position.top!==this.prevPosition.top&&(t.top=this.position.top+"px"),this.position.left!==this.prevPosition.left&&(t.left=this.position.left+"px"),this.size.width!==this.prevSize.width&&(t.width=this.size.width+"px"),this.size.height!==this.prevSize.height&&(t.height=this.size.height+"px"),this.helper.css(t),t},_updateVirtualBoundaries:function(t){var e,i,s,n,o,a=this.options;o={minWidth:this._isNumber(a.minWidth)?a.minWidth:0,maxWidth:this._isNumber(a.maxWidth)?a.maxWidth:1/0,minHeight:this._isNumber(a.minHeight)?a.minHeight:0,maxHeight:this._isNumber(a.maxHeight)?a.maxHeight:1/0},(this._aspectRatio||t)&&(e=o.minHeight*this.aspectRatio,s=o.minWidth/this.aspectRatio,i=o.maxHeight*this.aspectRatio,n=o.maxWidth/this.aspectRatio,e>o.minWidth&&(o.minWidth=e),s>o.minHeight&&(o.minHeight=s),o.maxWidth>i&&(o.maxWidth=i),o.maxHeight>n&&(o.maxHeight=n)),this._vBoundaries=o},_updateCache:function(t){this.offset=this.helper.offset(),this._isNumber(t.left)&&(this.position.left=t.left),this._isNumber(t.top)&&(this.position.top=t.top),this._isNumber(t.height)&&(this.size.height=t.height),this._isNumber(t.width)&&(this.size.width=t.width)},_updateRatio:function(t){var e=this.position,i=this.size,s=this.axis;return this._isNumber(t.height)?t.width=t.height*this.aspectRatio:this._isNumber(t.width)&&(t.height=t.width/this.aspectRatio),"sw"===s&&(t.left=e.left+(i.width-t.width),t.top=null),"nw"===s&&(t.top=e.top+(i.height-t.height),t.left=e.left+(i.width-t.width)),t},_respectSize:function(t){var e=this._vBoundaries,i=this.axis,s=this._isNumber(t.width)&&e.maxWidth&&e.maxWidth<t.width,n=this._isNumber(t.height)&&e.maxHeight&&e.maxHeight<t.height,o=this._isNumber(t.width)&&e.minWidth&&e.minWidth>t.width,a=this._isNumber(t.height)&&e.minHeight&&e.minHeight>t.height,r=this.originalPosition.left+this.originalSize.width,l=this.originalPosition.top+this.originalSize.height,h=/sw|nw|w/.test(i),c=/nw|ne|n/.test(i);return o&&(t.width=e.minWidth),a&&(t.height=e.minHeight),s&&(t.width=e.maxWidth),n&&(t.height=e.maxHeight),o&&h&&(t.left=r-e.minWidth),s&&h&&(t.left=r-e.maxWidth),a&&c&&(t.top=l-e.minHeight),n&&c&&(t.top=l-e.maxHeight),t.width||t.height||t.left||!t.top?t.width||t.height||t.top||!t.left||(t.left=null):t.top=null,t},_getPaddingPlusBorderDimensions:function(t){for(var e=0,i=[],s=[t.css("borderTopWidth"),t.css("borderRightWidth"),t.css("borderBottomWidth"),t.css("borderLeftWidth")],n=[t.css("paddingTop"),t.css("paddingRight"),t.css("paddingBottom"),t.css("paddingLeft")];4>e;e++)i[e]=parseFloat(s[e])||0,i[e]+=parseFloat(n[e])||0;return{height:i[0]+i[2],width:i[1]+i[3]}},_proportionallyResize:function(){if(this._proportionallyResizeElements.length)for(var t,e=0,i=this.helper||this.element;this._proportionallyResizeElements.length>e;e++)t=this._proportionallyResizeElements[e],this.outerDimensions||(this.outerDimensions=this._getPaddingPlusBorderDimensions(t)),t.css({height:i.height()-this.outerDimensions.height||0,width:i.width()-this.outerDimensions.width||0})},_renderProxy:function(){var e=this.element,i=this.options;this.elementOffset=e.offset(),this._helper?(this.helper=this.helper||t("<div style='overflow:hidden;'></div>"),this._addClass(this.helper,this._helper),this.helper.css({width:this.element.outerWidth(),height:this.element.outerHeight(),position:"absolute",left:this.elementOffset.left+"px",top:this.elementOffset.top+"px",zIndex:++i.zIndex}),this.helper.appendTo("body").disableSelection()):this.helper=this.element},_change:{e:function(t,e){return{width:this.originalSize.width+e}},w:function(t,e){var i=this.originalSize,s=this.originalPosition;return{left:s.left+e,width:i.width-e}},n:function(t,e,i){var s=this.originalSize,n=this.originalPosition;return{top:n.top+i,height:s.height-i}},s:function(t,e,i){return{height:this.originalSize.height+i}},se:function(e,i,s){return t.extend(this._change.s.apply(this,arguments),this._change.e.apply(this,[e,i,s]))},sw:function(e,i,s){return t.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[e,i,s]))},ne:function(e,i,s){return t.extend(this._change.n.apply(this,arguments),this._change.e.apply(this,[e,i,s]))},nw:function(e,i,s){return t.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,[e,i,s]))}},_propagate:function(e,i){t.ui.plugin.call(this,e,[i,this.ui()]),"resize"!==e&&this._trigger(e,i,this.ui())},plugins:{},ui:function(){return{originalElement:this.originalElement,element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,originalPosition:this.originalPosition}}}),t.ui.plugin.add("resizable","animate",{stop:function(e){var i=t(this).resizable("instance"),s=i.options,n=i._proportionallyResizeElements,o=n.length&&/textarea/i.test(n[0].nodeName),a=o&&i._hasScroll(n[0],"left")?0:i.sizeDiff.height,r=o?0:i.sizeDiff.width,l={width:i.size.width-r,height:i.size.height-a},h=parseFloat(i.element.css("left"))+(i.position.left-i.originalPosition.left)||null,c=parseFloat(i.element.css("top"))+(i.position.top-i.originalPosition.top)||null;i.element.animate(t.extend(l,c&&h?{top:c,left:h}:{}),{duration:s.animateDuration,easing:s.animateEasing,step:function(){var s={width:parseFloat(i.element.css("width")),height:parseFloat(i.element.css("height")),top:parseFloat(i.element.css("top")),left:parseFloat(i.element.css("left"))};n&&n.length&&t(n[0]).css({width:s.width,height:s.height}),i._updateCache(s),i._propagate("resize",e)}})}}),t.ui.plugin.add("resizable","containment",{start:function(){var e,i,s,n,o,a,r,l=t(this).resizable("instance"),h=l.options,c=l.element,u=h.containment,d=u instanceof t?u.get(0):/parent/.test(u)?c.parent().get(0):u;d&&(l.containerElement=t(d),/document/.test(u)||u===document?(l.containerOffset={left:0,top:0},l.containerPosition={left:0,top:0},l.parentData={element:t(document),left:0,top:0,width:t(document).width(),height:t(document).height()||document.body.parentNode.scrollHeight}):(e=t(d),i=[],t(["Top","Right","Left","Bottom"]).each(function(t,s){i[t]=l._num(e.css("padding"+s))}),l.containerOffset=e.offset(),l.containerPosition=e.position(),l.containerSize={height:e.innerHeight()-i[3],width:e.innerWidth()-i[1]},s=l.containerOffset,n=l.containerSize.height,o=l.containerSize.width,a=l._hasScroll(d,"left")?d.scrollWidth:o,r=l._hasScroll(d)?d.scrollHeight:n,l.parentData={element:d,left:s.left,top:s.top,width:a,height:r}))},resize:function(e){var i,s,n,o,a=t(this).resizable("instance"),r=a.options,l=a.containerOffset,h=a.position,c=a._aspectRatio||e.shiftKey,u={top:0,left:0},d=a.containerElement,p=!0;d[0]!==document&&/static/.test(d.css("position"))&&(u=l),h.left<(a._helper?l.left:0)&&(a.size.width=a.size.width+(a._helper?a.position.left-l.left:a.position.left-u.left),c&&(a.size.height=a.size.width/a.aspectRatio,p=!1),a.position.left=r.helper?l.left:0),h.top<(a._helper?l.top:0)&&(a.size.height=a.size.height+(a._helper?a.position.top-l.top:a.position.top),c&&(a.size.width=a.size.height*a.aspectRatio,p=!1),a.position.top=a._helper?l.top:0),n=a.containerElement.get(0)===a.element.parent().get(0),o=/relative|absolute/.test(a.containerElement.css("position")),n&&o?(a.offset.left=a.parentData.left+a.position.left,a.offset.top=a.parentData.top+a.position.top):(a.offset.left=a.element.offset().left,a.offset.top=a.element.offset().top),i=Math.abs(a.sizeDiff.width+(a._helper?a.offset.left-u.left:a.offset.left-l.left)),s=Math.abs(a.sizeDiff.height+(a._helper?a.offset.top-u.top:a.offset.top-l.top)),i+a.size.width>=a.parentData.width&&(a.size.width=a.parentData.width-i,c&&(a.size.height=a.size.width/a.aspectRatio,p=!1)),s+a.size.height>=a.parentData.height&&(a.size.height=a.parentData.height-s,c&&(a.size.width=a.size.height*a.aspectRatio,p=!1)),p||(a.position.left=a.prevPosition.left,a.position.top=a.prevPosition.top,a.size.width=a.prevSize.width,a.size.height=a.prevSize.height)},stop:function(){var e=t(this).resizable("instance"),i=e.options,s=e.containerOffset,n=e.containerPosition,o=e.containerElement,a=t(e.helper),r=a.offset(),l=a.outerWidth()-e.sizeDiff.width,h=a.outerHeight()-e.sizeDiff.height;e._helper&&!i.animate&&/relative/.test(o.css("position"))&&t(this).css({left:r.left-n.left-s.left,width:l,height:h}),e._helper&&!i.animate&&/static/.test(o.css("position"))&&t(this).css({left:r.left-n.left-s.left,width:l,height:h})}}),t.ui.plugin.add("resizable","alsoResize",{start:function(){var e=t(this).resizable("instance"),i=e.options;t(i.alsoResize).each(function(){var e=t(this);e.data("ui-resizable-alsoresize",{width:parseFloat(e.width()),height:parseFloat(e.height()),left:parseFloat(e.css("left")),top:parseFloat(e.css("top"))})})},resize:function(e,i){var s=t(this).resizable("instance"),n=s.options,o=s.originalSize,a=s.originalPosition,r={height:s.size.height-o.height||0,width:s.size.width-o.width||0,top:s.position.top-a.top||0,left:s.position.left-a.left||0};t(n.alsoResize).each(function(){var e=t(this),s=t(this).data("ui-resizable-alsoresize"),n={},o=e.parents(i.originalElement[0]).length?["width","height"]:["width","height","top","left"];t.each(o,function(t,e){var i=(s[e]||0)+(r[e]||0);i&&i>=0&&(n[e]=i||null)}),e.css(n)})},stop:function(){t(this).removeData("ui-resizable-alsoresize")}}),t.ui.plugin.add("resizable","ghost",{start:function(){var e=t(this).resizable("instance"),i=e.size;e.ghost=e.originalElement.clone(),e.ghost.css({opacity:.25,display:"block",position:"relative",height:i.height,width:i.width,margin:0,left:0,top:0}),e._addClass(e.ghost,"ui-resizable-ghost"),t.uiBackCompat!==!1&&"string"==typeof e.options.ghost&&e.ghost.addClass(this.options.ghost),e.ghost.appendTo(e.helper)},resize:function(){var e=t(this).resizable("instance");e.ghost&&e.ghost.css({position:"relative",height:e.size.height,width:e.size.width})},stop:function(){var e=t(this).resizable("instance");e.ghost&&e.helper&&e.helper.get(0).removeChild(e.ghost.get(0))}}),t.ui.plugin.add("resizable","grid",{resize:function(){var e,i=t(this).resizable("instance"),s=i.options,n=i.size,o=i.originalSize,a=i.originalPosition,r=i.axis,l="number"==typeof s.grid?[s.grid,s.grid]:s.grid,h=l[0]||1,c=l[1]||1,u=Math.round((n.width-o.width)/h)*h,d=Math.round((n.height-o.height)/c)*c,p=o.width+u,f=o.height+d,g=s.maxWidth&&p>s.maxWidth,m=s.maxHeight&&f>s.maxHeight,_=s.minWidth&&s.minWidth>p,v=s.minHeight&&s.minHeight>f;s.grid=l,_&&(p+=h),v&&(f+=c),g&&(p-=h),m&&(f-=c),/^(se|s|e)$/.test(r)?(i.size.width=p,i.size.height=f):/^(ne)$/.test(r)?(i.size.width=p,i.size.height=f,i.position.top=a.top-d):/^(sw)$/.test(r)?(i.size.width=p,i.size.height=f,i.position.left=a.left-u):((0>=f-c||0>=p-h)&&(e=i._getPaddingPlusBorderDimensions(this)),f-c>0?(i.size.height=f,i.position.top=a.top-d):(f=c-e.height,i.size.height=f,i.position.top=a.top+o.height-f),p-h>0?(i.size.width=p,i.position.left=a.left-u):(p=h-e.width,i.size.width=p,i.position.left=a.left+o.width-p))
}}),t.ui.resizable,t.widget("ui.selectable",t.ui.mouse,{version:"1.12.1",options:{appendTo:"body",autoRefresh:!0,distance:0,filter:"*",tolerance:"touch",selected:null,selecting:null,start:null,stop:null,unselected:null,unselecting:null},_create:function(){var e=this;this._addClass("ui-selectable"),this.dragged=!1,this.refresh=function(){e.elementPos=t(e.element[0]).offset(),e.selectees=t(e.options.filter,e.element[0]),e._addClass(e.selectees,"ui-selectee"),e.selectees.each(function(){var i=t(this),s=i.offset(),n={left:s.left-e.elementPos.left,top:s.top-e.elementPos.top};t.data(this,"selectable-item",{element:this,$element:i,left:n.left,top:n.top,right:n.left+i.outerWidth(),bottom:n.top+i.outerHeight(),startselected:!1,selected:i.hasClass("ui-selected"),selecting:i.hasClass("ui-selecting"),unselecting:i.hasClass("ui-unselecting")})})},this.refresh(),this._mouseInit(),this.helper=t("<div>"),this._addClass(this.helper,"ui-selectable-helper")},_destroy:function(){this.selectees.removeData("selectable-item"),this._mouseDestroy()},_mouseStart:function(e){var i=this,s=this.options;this.opos=[e.pageX,e.pageY],this.elementPos=t(this.element[0]).offset(),this.options.disabled||(this.selectees=t(s.filter,this.element[0]),this._trigger("start",e),t(s.appendTo).append(this.helper),this.helper.css({left:e.pageX,top:e.pageY,width:0,height:0}),s.autoRefresh&&this.refresh(),this.selectees.filter(".ui-selected").each(function(){var s=t.data(this,"selectable-item");s.startselected=!0,e.metaKey||e.ctrlKey||(i._removeClass(s.$element,"ui-selected"),s.selected=!1,i._addClass(s.$element,"ui-unselecting"),s.unselecting=!0,i._trigger("unselecting",e,{unselecting:s.element}))}),t(e.target).parents().addBack().each(function(){var s,n=t.data(this,"selectable-item");return n?(s=!e.metaKey&&!e.ctrlKey||!n.$element.hasClass("ui-selected"),i._removeClass(n.$element,s?"ui-unselecting":"ui-selected")._addClass(n.$element,s?"ui-selecting":"ui-unselecting"),n.unselecting=!s,n.selecting=s,n.selected=s,s?i._trigger("selecting",e,{selecting:n.element}):i._trigger("unselecting",e,{unselecting:n.element}),!1):void 0}))},_mouseDrag:function(e){if(this.dragged=!0,!this.options.disabled){var i,s=this,n=this.options,o=this.opos[0],a=this.opos[1],r=e.pageX,l=e.pageY;return o>r&&(i=r,r=o,o=i),a>l&&(i=l,l=a,a=i),this.helper.css({left:o,top:a,width:r-o,height:l-a}),this.selectees.each(function(){var i=t.data(this,"selectable-item"),h=!1,c={};i&&i.element!==s.element[0]&&(c.left=i.left+s.elementPos.left,c.right=i.right+s.elementPos.left,c.top=i.top+s.elementPos.top,c.bottom=i.bottom+s.elementPos.top,"touch"===n.tolerance?h=!(c.left>r||o>c.right||c.top>l||a>c.bottom):"fit"===n.tolerance&&(h=c.left>o&&r>c.right&&c.top>a&&l>c.bottom),h?(i.selected&&(s._removeClass(i.$element,"ui-selected"),i.selected=!1),i.unselecting&&(s._removeClass(i.$element,"ui-unselecting"),i.unselecting=!1),i.selecting||(s._addClass(i.$element,"ui-selecting"),i.selecting=!0,s._trigger("selecting",e,{selecting:i.element}))):(i.selecting&&((e.metaKey||e.ctrlKey)&&i.startselected?(s._removeClass(i.$element,"ui-selecting"),i.selecting=!1,s._addClass(i.$element,"ui-selected"),i.selected=!0):(s._removeClass(i.$element,"ui-selecting"),i.selecting=!1,i.startselected&&(s._addClass(i.$element,"ui-unselecting"),i.unselecting=!0),s._trigger("unselecting",e,{unselecting:i.element}))),i.selected&&(e.metaKey||e.ctrlKey||i.startselected||(s._removeClass(i.$element,"ui-selected"),i.selected=!1,s._addClass(i.$element,"ui-unselecting"),i.unselecting=!0,s._trigger("unselecting",e,{unselecting:i.element})))))}),!1}},_mouseStop:function(e){var i=this;return this.dragged=!1,t(".ui-unselecting",this.element[0]).each(function(){var s=t.data(this,"selectable-item");i._removeClass(s.$element,"ui-unselecting"),s.unselecting=!1,s.startselected=!1,i._trigger("unselected",e,{unselected:s.element})}),t(".ui-selecting",this.element[0]).each(function(){var s=t.data(this,"selectable-item");i._removeClass(s.$element,"ui-selecting")._addClass(s.$element,"ui-selected"),s.selecting=!1,s.selected=!0,s.startselected=!0,i._trigger("selected",e,{selected:s.element})}),this._trigger("stop",e),this.helper.remove(),!1}}),t.widget("ui.sortable",t.ui.mouse,{version:"1.12.1",widgetEventPrefix:"sort",ready:!1,options:{appendTo:"parent",axis:!1,connectWith:!1,containment:!1,cursor:"auto",cursorAt:!1,dropOnEmpty:!0,forcePlaceholderSize:!1,forceHelperSize:!1,grid:!1,handle:!1,helper:"original",items:"> *",opacity:!1,placeholder:!1,revert:!1,scroll:!0,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1e3,activate:null,beforeStop:null,change:null,deactivate:null,out:null,over:null,receive:null,remove:null,sort:null,start:null,stop:null,update:null},_isOverAxis:function(t,e,i){return t>=e&&e+i>t},_isFloating:function(t){return/left|right/.test(t.css("float"))||/inline|table-cell/.test(t.css("display"))},_create:function(){this.containerCache={},this._addClass("ui-sortable"),this.refresh(),this.offset=this.element.offset(),this._mouseInit(),this._setHandleClassName(),this.ready=!0},_setOption:function(t,e){this._super(t,e),"handle"===t&&this._setHandleClassName()},_setHandleClassName:function(){var e=this;this._removeClass(this.element.find(".ui-sortable-handle"),"ui-sortable-handle"),t.each(this.items,function(){e._addClass(this.instance.options.handle?this.item.find(this.instance.options.handle):this.item,"ui-sortable-handle")})},_destroy:function(){this._mouseDestroy();for(var t=this.items.length-1;t>=0;t--)this.items[t].item.removeData(this.widgetName+"-item");return this},_mouseCapture:function(e,i){var s=null,n=!1,o=this;return this.reverting?!1:this.options.disabled||"static"===this.options.type?!1:(this._refreshItems(e),t(e.target).parents().each(function(){return t.data(this,o.widgetName+"-item")===o?(s=t(this),!1):void 0}),t.data(e.target,o.widgetName+"-item")===o&&(s=t(e.target)),s?!this.options.handle||i||(t(this.options.handle,s).find("*").addBack().each(function(){this===e.target&&(n=!0)}),n)?(this.currentItem=s,this._removeCurrentsFromItems(),!0):!1:!1)},_mouseStart:function(e,i,s){var n,o,a=this.options;if(this.currentContainer=this,this.refreshPositions(),this.helper=this._createHelper(e),this._cacheHelperProportions(),this._cacheMargins(),this.scrollParent=this.helper.scrollParent(),this.offset=this.currentItem.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},t.extend(this.offset,{click:{left:e.pageX-this.offset.left,top:e.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.helper.css("position","absolute"),this.cssPosition=this.helper.css("position"),this.originalPosition=this._generatePosition(e),this.originalPageX=e.pageX,this.originalPageY=e.pageY,a.cursorAt&&this._adjustOffsetFromHelper(a.cursorAt),this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]},this.helper[0]!==this.currentItem[0]&&this.currentItem.hide(),this._createPlaceholder(),a.containment&&this._setContainment(),a.cursor&&"auto"!==a.cursor&&(o=this.document.find("body"),this.storedCursor=o.css("cursor"),o.css("cursor",a.cursor),this.storedStylesheet=t("<style>*{ cursor: "+a.cursor+" !important; }</style>").appendTo(o)),a.opacity&&(this.helper.css("opacity")&&(this._storedOpacity=this.helper.css("opacity")),this.helper.css("opacity",a.opacity)),a.zIndex&&(this.helper.css("zIndex")&&(this._storedZIndex=this.helper.css("zIndex")),this.helper.css("zIndex",a.zIndex)),this.scrollParent[0]!==this.document[0]&&"HTML"!==this.scrollParent[0].tagName&&(this.overflowOffset=this.scrollParent.offset()),this._trigger("start",e,this._uiHash()),this._preserveHelperProportions||this._cacheHelperProportions(),!s)for(n=this.containers.length-1;n>=0;n--)this.containers[n]._trigger("activate",e,this._uiHash(this));return t.ui.ddmanager&&(t.ui.ddmanager.current=this),t.ui.ddmanager&&!a.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e),this.dragging=!0,this._addClass(this.helper,"ui-sortable-helper"),this._mouseDrag(e),!0},_mouseDrag:function(e){var i,s,n,o,a=this.options,r=!1;for(this.position=this._generatePosition(e),this.positionAbs=this._convertPositionTo("absolute"),this.lastPositionAbs||(this.lastPositionAbs=this.positionAbs),this.options.scroll&&(this.scrollParent[0]!==this.document[0]&&"HTML"!==this.scrollParent[0].tagName?(this.overflowOffset.top+this.scrollParent[0].offsetHeight-e.pageY<a.scrollSensitivity?this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop+a.scrollSpeed:e.pageY-this.overflowOffset.top<a.scrollSensitivity&&(this.scrollParent[0].scrollTop=r=this.scrollParent[0].scrollTop-a.scrollSpeed),this.overflowOffset.left+this.scrollParent[0].offsetWidth-e.pageX<a.scrollSensitivity?this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft+a.scrollSpeed:e.pageX-this.overflowOffset.left<a.scrollSensitivity&&(this.scrollParent[0].scrollLeft=r=this.scrollParent[0].scrollLeft-a.scrollSpeed)):(e.pageY-this.document.scrollTop()<a.scrollSensitivity?r=this.document.scrollTop(this.document.scrollTop()-a.scrollSpeed):this.window.height()-(e.pageY-this.document.scrollTop())<a.scrollSensitivity&&(r=this.document.scrollTop(this.document.scrollTop()+a.scrollSpeed)),e.pageX-this.document.scrollLeft()<a.scrollSensitivity?r=this.document.scrollLeft(this.document.scrollLeft()-a.scrollSpeed):this.window.width()-(e.pageX-this.document.scrollLeft())<a.scrollSensitivity&&(r=this.document.scrollLeft(this.document.scrollLeft()+a.scrollSpeed))),r!==!1&&t.ui.ddmanager&&!a.dropBehaviour&&t.ui.ddmanager.prepareOffsets(this,e)),this.positionAbs=this._convertPositionTo("absolute"),this.options.axis&&"y"===this.options.axis||(this.helper[0].style.left=this.position.left+"px"),this.options.axis&&"x"===this.options.axis||(this.helper[0].style.top=this.position.top+"px"),i=this.items.length-1;i>=0;i--)if(s=this.items[i],n=s.item[0],o=this._intersectsWithPointer(s),o&&s.instance===this.currentContainer&&n!==this.currentItem[0]&&this.placeholder[1===o?"next":"prev"]()[0]!==n&&!t.contains(this.placeholder[0],n)&&("semi-dynamic"===this.options.type?!t.contains(this.element[0],n):!0)){if(this.direction=1===o?"down":"up","pointer"!==this.options.tolerance&&!this._intersectsWithSides(s))break;this._rearrange(e,s),this._trigger("change",e,this._uiHash());break}return this._contactContainers(e),t.ui.ddmanager&&t.ui.ddmanager.drag(this,e),this._trigger("sort",e,this._uiHash()),this.lastPositionAbs=this.positionAbs,!1},_mouseStop:function(e,i){if(e){if(t.ui.ddmanager&&!this.options.dropBehaviour&&t.ui.ddmanager.drop(this,e),this.options.revert){var s=this,n=this.placeholder.offset(),o=this.options.axis,a={};o&&"x"!==o||(a.left=n.left-this.offset.parent.left-this.margins.left+(this.offsetParent[0]===this.document[0].body?0:this.offsetParent[0].scrollLeft)),o&&"y"!==o||(a.top=n.top-this.offset.parent.top-this.margins.top+(this.offsetParent[0]===this.document[0].body?0:this.offsetParent[0].scrollTop)),this.reverting=!0,t(this.helper).animate(a,parseInt(this.options.revert,10)||500,function(){s._clear(e)})}else this._clear(e,i);return!1}},cancel:function(){if(this.dragging){this._mouseUp(new t.Event("mouseup",{target:null})),"original"===this.options.helper?(this.currentItem.css(this._storedCSS),this._removeClass(this.currentItem,"ui-sortable-helper")):this.currentItem.show();for(var e=this.containers.length-1;e>=0;e--)this.containers[e]._trigger("deactivate",null,this._uiHash(this)),this.containers[e].containerCache.over&&(this.containers[e]._trigger("out",null,this._uiHash(this)),this.containers[e].containerCache.over=0)}return this.placeholder&&(this.placeholder[0].parentNode&&this.placeholder[0].parentNode.removeChild(this.placeholder[0]),"original"!==this.options.helper&&this.helper&&this.helper[0].parentNode&&this.helper.remove(),t.extend(this,{helper:null,dragging:!1,reverting:!1,_noFinalSort:null}),this.domPosition.prev?t(this.domPosition.prev).after(this.currentItem):t(this.domPosition.parent).prepend(this.currentItem)),this},serialize:function(e){var i=this._getItemsAsjQuery(e&&e.connected),s=[];return e=e||{},t(i).each(function(){var i=(t(e.item||this).attr(e.attribute||"id")||"").match(e.expression||/(.+)[\-=_](.+)/);i&&s.push((e.key||i[1]+"[]")+"="+(e.key&&e.expression?i[1]:i[2]))}),!s.length&&e.key&&s.push(e.key+"="),s.join("&")},toArray:function(e){var i=this._getItemsAsjQuery(e&&e.connected),s=[];return e=e||{},i.each(function(){s.push(t(e.item||this).attr(e.attribute||"id")||"")}),s},_intersectsWith:function(t){var e=this.positionAbs.left,i=e+this.helperProportions.width,s=this.positionAbs.top,n=s+this.helperProportions.height,o=t.left,a=o+t.width,r=t.top,l=r+t.height,h=this.offset.click.top,c=this.offset.click.left,u="x"===this.options.axis||s+h>r&&l>s+h,d="y"===this.options.axis||e+c>o&&a>e+c,p=u&&d;return"pointer"===this.options.tolerance||this.options.forcePointerForContainers||"pointer"!==this.options.tolerance&&this.helperProportions[this.floating?"width":"height"]>t[this.floating?"width":"height"]?p:e+this.helperProportions.width/2>o&&a>i-this.helperProportions.width/2&&s+this.helperProportions.height/2>r&&l>n-this.helperProportions.height/2},_intersectsWithPointer:function(t){var e,i,s="x"===this.options.axis||this._isOverAxis(this.positionAbs.top+this.offset.click.top,t.top,t.height),n="y"===this.options.axis||this._isOverAxis(this.positionAbs.left+this.offset.click.left,t.left,t.width),o=s&&n;return o?(e=this._getDragVerticalDirection(),i=this._getDragHorizontalDirection(),this.floating?"right"===i||"down"===e?2:1:e&&("down"===e?2:1)):!1},_intersectsWithSides:function(t){var e=this._isOverAxis(this.positionAbs.top+this.offset.click.top,t.top+t.height/2,t.height),i=this._isOverAxis(this.positionAbs.left+this.offset.click.left,t.left+t.width/2,t.width),s=this._getDragVerticalDirection(),n=this._getDragHorizontalDirection();return this.floating&&n?"right"===n&&i||"left"===n&&!i:s&&("down"===s&&e||"up"===s&&!e)},_getDragVerticalDirection:function(){var t=this.positionAbs.top-this.lastPositionAbs.top;return 0!==t&&(t>0?"down":"up")},_getDragHorizontalDirection:function(){var t=this.positionAbs.left-this.lastPositionAbs.left;return 0!==t&&(t>0?"right":"left")},refresh:function(t){return this._refreshItems(t),this._setHandleClassName(),this.refreshPositions(),this},_connectWith:function(){var t=this.options;return t.connectWith.constructor===String?[t.connectWith]:t.connectWith},_getItemsAsjQuery:function(e){function i(){r.push(this)}var s,n,o,a,r=[],l=[],h=this._connectWith();if(h&&e)for(s=h.length-1;s>=0;s--)for(o=t(h[s],this.document[0]),n=o.length-1;n>=0;n--)a=t.data(o[n],this.widgetFullName),a&&a!==this&&!a.options.disabled&&l.push([t.isFunction(a.options.items)?a.options.items.call(a.element):t(a.options.items,a.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),a]);for(l.push([t.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):t(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]),s=l.length-1;s>=0;s--)l[s][0].each(i);return t(r)},_removeCurrentsFromItems:function(){var e=this.currentItem.find(":data("+this.widgetName+"-item)");this.items=t.grep(this.items,function(t){for(var i=0;e.length>i;i++)if(e[i]===t.item[0])return!1;return!0})},_refreshItems:function(e){this.items=[],this.containers=[this];var i,s,n,o,a,r,l,h,c=this.items,u=[[t.isFunction(this.options.items)?this.options.items.call(this.element[0],e,{item:this.currentItem}):t(this.options.items,this.element),this]],d=this._connectWith();if(d&&this.ready)for(i=d.length-1;i>=0;i--)for(n=t(d[i],this.document[0]),s=n.length-1;s>=0;s--)o=t.data(n[s],this.widgetFullName),o&&o!==this&&!o.options.disabled&&(u.push([t.isFunction(o.options.items)?o.options.items.call(o.element[0],e,{item:this.currentItem}):t(o.options.items,o.element),o]),this.containers.push(o));for(i=u.length-1;i>=0;i--)for(a=u[i][1],r=u[i][0],s=0,h=r.length;h>s;s++)l=t(r[s]),l.data(this.widgetName+"-item",a),c.push({item:l,instance:a,width:0,height:0,left:0,top:0})},refreshPositions:function(e){this.floating=this.items.length?"x"===this.options.axis||this._isFloating(this.items[0].item):!1,this.offsetParent&&this.helper&&(this.offset.parent=this._getParentOffset());var i,s,n,o;for(i=this.items.length-1;i>=0;i--)s=this.items[i],s.instance!==this.currentContainer&&this.currentContainer&&s.item[0]!==this.currentItem[0]||(n=this.options.toleranceElement?t(this.options.toleranceElement,s.item):s.item,e||(s.width=n.outerWidth(),s.height=n.outerHeight()),o=n.offset(),s.left=o.left,s.top=o.top);if(this.options.custom&&this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this);else for(i=this.containers.length-1;i>=0;i--)o=this.containers[i].element.offset(),this.containers[i].containerCache.left=o.left,this.containers[i].containerCache.top=o.top,this.containers[i].containerCache.width=this.containers[i].element.outerWidth(),this.containers[i].containerCache.height=this.containers[i].element.outerHeight();return this},_createPlaceholder:function(e){e=e||this;var i,s=e.options;s.placeholder&&s.placeholder.constructor!==String||(i=s.placeholder,s.placeholder={element:function(){var s=e.currentItem[0].nodeName.toLowerCase(),n=t("<"+s+">",e.document[0]);return e._addClass(n,"ui-sortable-placeholder",i||e.currentItem[0].className)._removeClass(n,"ui-sortable-helper"),"tbody"===s?e._createTrPlaceholder(e.currentItem.find("tr").eq(0),t("<tr>",e.document[0]).appendTo(n)):"tr"===s?e._createTrPlaceholder(e.currentItem,n):"img"===s&&n.attr("src",e.currentItem.attr("src")),i||n.css("visibility","hidden"),n},update:function(t,n){(!i||s.forcePlaceholderSize)&&(n.height()||n.height(e.currentItem.innerHeight()-parseInt(e.currentItem.css("paddingTop")||0,10)-parseInt(e.currentItem.css("paddingBottom")||0,10)),n.width()||n.width(e.currentItem.innerWidth()-parseInt(e.currentItem.css("paddingLeft")||0,10)-parseInt(e.currentItem.css("paddingRight")||0,10)))}}),e.placeholder=t(s.placeholder.element.call(e.element,e.currentItem)),e.currentItem.after(e.placeholder),s.placeholder.update(e,e.placeholder)},_createTrPlaceholder:function(e,i){var s=this;e.children().each(function(){t("<td>&#160;</td>",s.document[0]).attr("colspan",t(this).attr("colspan")||1).appendTo(i)})},_contactContainers:function(e){var i,s,n,o,a,r,l,h,c,u,d=null,p=null;for(i=this.containers.length-1;i>=0;i--)if(!t.contains(this.currentItem[0],this.containers[i].element[0]))if(this._intersectsWith(this.containers[i].containerCache)){if(d&&t.contains(this.containers[i].element[0],d.element[0]))continue;d=this.containers[i],p=i}else this.containers[i].containerCache.over&&(this.containers[i]._trigger("out",e,this._uiHash(this)),this.containers[i].containerCache.over=0);if(d)if(1===this.containers.length)this.containers[p].containerCache.over||(this.containers[p]._trigger("over",e,this._uiHash(this)),this.containers[p].containerCache.over=1);else{for(n=1e4,o=null,c=d.floating||this._isFloating(this.currentItem),a=c?"left":"top",r=c?"width":"height",u=c?"pageX":"pageY",s=this.items.length-1;s>=0;s--)t.contains(this.containers[p].element[0],this.items[s].item[0])&&this.items[s].item[0]!==this.currentItem[0]&&(l=this.items[s].item.offset()[a],h=!1,e[u]-l>this.items[s][r]/2&&(h=!0),n>Math.abs(e[u]-l)&&(n=Math.abs(e[u]-l),o=this.items[s],this.direction=h?"up":"down"));if(!o&&!this.options.dropOnEmpty)return;if(this.currentContainer===this.containers[p])return this.currentContainer.containerCache.over||(this.containers[p]._trigger("over",e,this._uiHash()),this.currentContainer.containerCache.over=1),void 0;o?this._rearrange(e,o,null,!0):this._rearrange(e,null,this.containers[p].element,!0),this._trigger("change",e,this._uiHash()),this.containers[p]._trigger("change",e,this._uiHash(this)),this.currentContainer=this.containers[p],this.options.placeholder.update(this.currentContainer,this.placeholder),this.containers[p]._trigger("over",e,this._uiHash(this)),this.containers[p].containerCache.over=1}},_createHelper:function(e){var i=this.options,s=t.isFunction(i.helper)?t(i.helper.apply(this.element[0],[e,this.currentItem])):"clone"===i.helper?this.currentItem.clone():this.currentItem;return s.parents("body").length||t("parent"!==i.appendTo?i.appendTo:this.currentItem[0].parentNode)[0].appendChild(s[0]),s[0]===this.currentItem[0]&&(this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")}),(!s[0].style.width||i.forceHelperSize)&&s.width(this.currentItem.width()),(!s[0].style.height||i.forceHelperSize)&&s.height(this.currentItem.height()),s},_adjustOffsetFromHelper:function(e){"string"==typeof e&&(e=e.split(" ")),t.isArray(e)&&(e={left:+e[0],top:+e[1]||0}),"left"in e&&(this.offset.click.left=e.left+this.margins.left),"right"in e&&(this.offset.click.left=this.helperProportions.width-e.right+this.margins.left),"top"in e&&(this.offset.click.top=e.top+this.margins.top),"bottom"in e&&(this.offset.click.top=this.helperProportions.height-e.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var e=this.offsetParent.offset();return"absolute"===this.cssPosition&&this.scrollParent[0]!==this.document[0]&&t.contains(this.scrollParent[0],this.offsetParent[0])&&(e.left+=this.scrollParent.scrollLeft(),e.top+=this.scrollParent.scrollTop()),(this.offsetParent[0]===this.document[0].body||this.offsetParent[0].tagName&&"html"===this.offsetParent[0].tagName.toLowerCase()&&t.ui.ie)&&(e={top:0,left:0}),{top:e.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:e.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"===this.cssPosition){var t=this.currentItem.position();return{top:t.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:t.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var e,i,s,n=this.options;"parent"===n.containment&&(n.containment=this.helper[0].parentNode),("document"===n.containment||"window"===n.containment)&&(this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,"document"===n.containment?this.document.width():this.window.width()-this.helperProportions.width-this.margins.left,("document"===n.containment?this.document.height()||document.body.parentNode.scrollHeight:this.window.height()||this.document[0].body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top]),/^(document|window|parent)$/.test(n.containment)||(e=t(n.containment)[0],i=t(n.containment).offset(),s="hidden"!==t(e).css("overflow"),this.containment=[i.left+(parseInt(t(e).css("borderLeftWidth"),10)||0)+(parseInt(t(e).css("paddingLeft"),10)||0)-this.margins.left,i.top+(parseInt(t(e).css("borderTopWidth"),10)||0)+(parseInt(t(e).css("paddingTop"),10)||0)-this.margins.top,i.left+(s?Math.max(e.scrollWidth,e.offsetWidth):e.offsetWidth)-(parseInt(t(e).css("borderLeftWidth"),10)||0)-(parseInt(t(e).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,i.top+(s?Math.max(e.scrollHeight,e.offsetHeight):e.offsetHeight)-(parseInt(t(e).css("borderTopWidth"),10)||0)-(parseInt(t(e).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top])},_convertPositionTo:function(e,i){i||(i=this.position);var s="absolute"===e?1:-1,n="absolute"!==this.cssPosition||this.scrollParent[0]!==this.document[0]&&t.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,o=/(html|body)/i.test(n[0].tagName);return{top:i.top+this.offset.relative.top*s+this.offset.parent.top*s-("fixed"===this.cssPosition?-this.scrollParent.scrollTop():o?0:n.scrollTop())*s,left:i.left+this.offset.relative.left*s+this.offset.parent.left*s-("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():o?0:n.scrollLeft())*s}},_generatePosition:function(e){var i,s,n=this.options,o=e.pageX,a=e.pageY,r="absolute"!==this.cssPosition||this.scrollParent[0]!==this.document[0]&&t.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,l=/(html|body)/i.test(r[0].tagName);return"relative"!==this.cssPosition||this.scrollParent[0]!==this.document[0]&&this.scrollParent[0]!==this.offsetParent[0]||(this.offset.relative=this._getRelativeOffset()),this.originalPosition&&(this.containment&&(e.pageX-this.offset.click.left<this.containment[0]&&(o=this.containment[0]+this.offset.click.left),e.pageY-this.offset.click.top<this.containment[1]&&(a=this.containment[1]+this.offset.click.top),e.pageX-this.offset.click.left>this.containment[2]&&(o=this.containment[2]+this.offset.click.left),e.pageY-this.offset.click.top>this.containment[3]&&(a=this.containment[3]+this.offset.click.top)),n.grid&&(i=this.originalPageY+Math.round((a-this.originalPageY)/n.grid[1])*n.grid[1],a=this.containment?i-this.offset.click.top>=this.containment[1]&&i-this.offset.click.top<=this.containment[3]?i:i-this.offset.click.top>=this.containment[1]?i-n.grid[1]:i+n.grid[1]:i,s=this.originalPageX+Math.round((o-this.originalPageX)/n.grid[0])*n.grid[0],o=this.containment?s-this.offset.click.left>=this.containment[0]&&s-this.offset.click.left<=this.containment[2]?s:s-this.offset.click.left>=this.containment[0]?s-n.grid[0]:s+n.grid[0]:s)),{top:a-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.scrollParent.scrollTop():l?0:r.scrollTop()),left:o-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():l?0:r.scrollLeft())}},_rearrange:function(t,e,i,s){i?i[0].appendChild(this.placeholder[0]):e.item[0].parentNode.insertBefore(this.placeholder[0],"down"===this.direction?e.item[0]:e.item[0].nextSibling),this.counter=this.counter?++this.counter:1;var n=this.counter;this._delay(function(){n===this.counter&&this.refreshPositions(!s)})},_clear:function(t,e){function i(t,e,i){return function(s){i._trigger(t,s,e._uiHash(e))}}this.reverting=!1;var s,n=[];if(!this._noFinalSort&&this.currentItem.parent().length&&this.placeholder.before(this.currentItem),this._noFinalSort=null,this.helper[0]===this.currentItem[0]){for(s in this._storedCSS)("auto"===this._storedCSS[s]||"static"===this._storedCSS[s])&&(this._storedCSS[s]="");this.currentItem.css(this._storedCSS),this._removeClass(this.currentItem,"ui-sortable-helper")}else this.currentItem.show();for(this.fromOutside&&!e&&n.push(function(t){this._trigger("receive",t,this._uiHash(this.fromOutside))}),!this.fromOutside&&this.domPosition.prev===this.currentItem.prev().not(".ui-sortable-helper")[0]&&this.domPosition.parent===this.currentItem.parent()[0]||e||n.push(function(t){this._trigger("update",t,this._uiHash())}),this!==this.currentContainer&&(e||(n.push(function(t){this._trigger("remove",t,this._uiHash())}),n.push(function(t){return function(e){t._trigger("receive",e,this._uiHash(this))}}.call(this,this.currentContainer)),n.push(function(t){return function(e){t._trigger("update",e,this._uiHash(this))}}.call(this,this.currentContainer)))),s=this.containers.length-1;s>=0;s--)e||n.push(i("deactivate",this,this.containers[s])),this.containers[s].containerCache.over&&(n.push(i("out",this,this.containers[s])),this.containers[s].containerCache.over=0);if(this.storedCursor&&(this.document.find("body").css("cursor",this.storedCursor),this.storedStylesheet.remove()),this._storedOpacity&&this.helper.css("opacity",this._storedOpacity),this._storedZIndex&&this.helper.css("zIndex","auto"===this._storedZIndex?"":this._storedZIndex),this.dragging=!1,e||this._trigger("beforeStop",t,this._uiHash()),this.placeholder[0].parentNode.removeChild(this.placeholder[0]),this.cancelHelperRemoval||(this.helper[0]!==this.currentItem[0]&&this.helper.remove(),this.helper=null),!e){for(s=0;n.length>s;s++)n[s].call(this,t);this._trigger("stop",t,this._uiHash())}return this.fromOutside=!1,!this.cancelHelperRemoval},_trigger:function(){t.Widget.prototype._trigger.apply(this,arguments)===!1&&this.cancel()},_uiHash:function(e){var i=e||this;return{helper:i.helper,placeholder:i.placeholder||t([]),position:i.position,originalPosition:i.originalPosition,offset:i.positionAbs,item:i.currentItem,sender:e?e.element:null}}});var a="ui-effects-",r="ui-effects-style",l="ui-effects-animated",h=t;t.effects={effect:{}},function(t,e){function i(t,e,i){var s=u[e.type]||{};return null==t?i||!e.def?null:e.def:(t=s.floor?~~t:parseFloat(t),isNaN(t)?e.def:s.mod?(t+s.mod)%s.mod:0>t?0:t>s.max?s.max:t)}function s(i){var s=h(),n=s._rgba=[];return i=i.toLowerCase(),f(l,function(t,o){var a,r=o.re.exec(i),l=r&&o.parse(r),h=o.space||"rgba";return l?(a=s[h](l),s[c[h].cache]=a[c[h].cache],n=s._rgba=a._rgba,!1):e}),n.length?("0,0,0,0"===n.join()&&t.extend(n,o.transparent),s):o[i]}function n(t,e,i){return i=(i+1)%1,1>6*i?t+6*(e-t)*i:1>2*i?e:2>3*i?t+6*(e-t)*(2/3-i):t}var o,a="backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",r=/^([\-+])=\s*(\d+\.?\d*)/,l=[{re:/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(t){return[t[1],t[2],t[3],t[4]]}},{re:/rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(t){return[2.55*t[1],2.55*t[2],2.55*t[3],t[4]]}},{re:/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,parse:function(t){return[parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16)]}},{re:/#([a-f0-9])([a-f0-9])([a-f0-9])/,parse:function(t){return[parseInt(t[1]+t[1],16),parseInt(t[2]+t[2],16),parseInt(t[3]+t[3],16)]}},{re:/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,space:"hsla",parse:function(t){return[t[1],t[2]/100,t[3]/100,t[4]]}}],h=t.Color=function(e,i,s,n){return new t.Color.fn.parse(e,i,s,n)},c={rgba:{props:{red:{idx:0,type:"byte"},green:{idx:1,type:"byte"},blue:{idx:2,type:"byte"}}},hsla:{props:{hue:{idx:0,type:"degrees"},saturation:{idx:1,type:"percent"},lightness:{idx:2,type:"percent"}}}},u={"byte":{floor:!0,max:255},percent:{max:1},degrees:{mod:360,floor:!0}},d=h.support={},p=t("<p>")[0],f=t.each;p.style.cssText="background-color:rgba(1,1,1,.5)",d.rgba=p.style.backgroundColor.indexOf("rgba")>-1,f(c,function(t,e){e.cache="_"+t,e.props.alpha={idx:3,type:"percent",def:1}}),h.fn=t.extend(h.prototype,{parse:function(n,a,r,l){if(n===e)return this._rgba=[null,null,null,null],this;(n.jquery||n.nodeType)&&(n=t(n).css(a),a=e);var u=this,d=t.type(n),p=this._rgba=[];return a!==e&&(n=[n,a,r,l],d="array"),"string"===d?this.parse(s(n)||o._default):"array"===d?(f(c.rgba.props,function(t,e){p[e.idx]=i(n[e.idx],e)}),this):"object"===d?(n instanceof h?f(c,function(t,e){n[e.cache]&&(u[e.cache]=n[e.cache].slice())}):f(c,function(e,s){var o=s.cache;f(s.props,function(t,e){if(!u[o]&&s.to){if("alpha"===t||null==n[t])return;u[o]=s.to(u._rgba)}u[o][e.idx]=i(n[t],e,!0)}),u[o]&&0>t.inArray(null,u[o].slice(0,3))&&(u[o][3]=1,s.from&&(u._rgba=s.from(u[o])))}),this):e},is:function(t){var i=h(t),s=!0,n=this;return f(c,function(t,o){var a,r=i[o.cache];return r&&(a=n[o.cache]||o.to&&o.to(n._rgba)||[],f(o.props,function(t,i){return null!=r[i.idx]?s=r[i.idx]===a[i.idx]:e})),s}),s},_space:function(){var t=[],e=this;return f(c,function(i,s){e[s.cache]&&t.push(i)}),t.pop()},transition:function(t,e){var s=h(t),n=s._space(),o=c[n],a=0===this.alpha()?h("transparent"):this,r=a[o.cache]||o.to(a._rgba),l=r.slice();
return s=s[o.cache],f(o.props,function(t,n){var o=n.idx,a=r[o],h=s[o],c=u[n.type]||{};null!==h&&(null===a?l[o]=h:(c.mod&&(h-a>c.mod/2?a+=c.mod:a-h>c.mod/2&&(a-=c.mod)),l[o]=i((h-a)*e+a,n)))}),this[n](l)},blend:function(e){if(1===this._rgba[3])return this;var i=this._rgba.slice(),s=i.pop(),n=h(e)._rgba;return h(t.map(i,function(t,e){return(1-s)*n[e]+s*t}))},toRgbaString:function(){var e="rgba(",i=t.map(this._rgba,function(t,e){return null==t?e>2?1:0:t});return 1===i[3]&&(i.pop(),e="rgb("),e+i.join()+")"},toHslaString:function(){var e="hsla(",i=t.map(this.hsla(),function(t,e){return null==t&&(t=e>2?1:0),e&&3>e&&(t=Math.round(100*t)+"%"),t});return 1===i[3]&&(i.pop(),e="hsl("),e+i.join()+")"},toHexString:function(e){var i=this._rgba.slice(),s=i.pop();return e&&i.push(~~(255*s)),"#"+t.map(i,function(t){return t=(t||0).toString(16),1===t.length?"0"+t:t}).join("")},toString:function(){return 0===this._rgba[3]?"transparent":this.toRgbaString()}}),h.fn.parse.prototype=h.fn,c.hsla.to=function(t){if(null==t[0]||null==t[1]||null==t[2])return[null,null,null,t[3]];var e,i,s=t[0]/255,n=t[1]/255,o=t[2]/255,a=t[3],r=Math.max(s,n,o),l=Math.min(s,n,o),h=r-l,c=r+l,u=.5*c;return e=l===r?0:s===r?60*(n-o)/h+360:n===r?60*(o-s)/h+120:60*(s-n)/h+240,i=0===h?0:.5>=u?h/c:h/(2-c),[Math.round(e)%360,i,u,null==a?1:a]},c.hsla.from=function(t){if(null==t[0]||null==t[1]||null==t[2])return[null,null,null,t[3]];var e=t[0]/360,i=t[1],s=t[2],o=t[3],a=.5>=s?s*(1+i):s+i-s*i,r=2*s-a;return[Math.round(255*n(r,a,e+1/3)),Math.round(255*n(r,a,e)),Math.round(255*n(r,a,e-1/3)),o]},f(c,function(s,n){var o=n.props,a=n.cache,l=n.to,c=n.from;h.fn[s]=function(s){if(l&&!this[a]&&(this[a]=l(this._rgba)),s===e)return this[a].slice();var n,r=t.type(s),u="array"===r||"object"===r?s:arguments,d=this[a].slice();return f(o,function(t,e){var s=u["object"===r?t:e.idx];null==s&&(s=d[e.idx]),d[e.idx]=i(s,e)}),c?(n=h(c(d)),n[a]=d,n):h(d)},f(o,function(e,i){h.fn[e]||(h.fn[e]=function(n){var o,a=t.type(n),l="alpha"===e?this._hsla?"hsla":"rgba":s,h=this[l](),c=h[i.idx];return"undefined"===a?c:("function"===a&&(n=n.call(this,c),a=t.type(n)),null==n&&i.empty?this:("string"===a&&(o=r.exec(n),o&&(n=c+parseFloat(o[2])*("+"===o[1]?1:-1))),h[i.idx]=n,this[l](h)))})})}),h.hook=function(e){var i=e.split(" ");f(i,function(e,i){t.cssHooks[i]={set:function(e,n){var o,a,r="";if("transparent"!==n&&("string"!==t.type(n)||(o=s(n)))){if(n=h(o||n),!d.rgba&&1!==n._rgba[3]){for(a="backgroundColor"===i?e.parentNode:e;(""===r||"transparent"===r)&&a&&a.style;)try{r=t.css(a,"backgroundColor"),a=a.parentNode}catch(l){}n=n.blend(r&&"transparent"!==r?r:"_default")}n=n.toRgbaString()}try{e.style[i]=n}catch(l){}}},t.fx.step[i]=function(e){e.colorInit||(e.start=h(e.elem,i),e.end=h(e.end),e.colorInit=!0),t.cssHooks[i].set(e.elem,e.start.transition(e.end,e.pos))}})},h.hook(a),t.cssHooks.borderColor={expand:function(t){var e={};return f(["Top","Right","Bottom","Left"],function(i,s){e["border"+s+"Color"]=t}),e}},o=t.Color.names={aqua:"#00ffff",black:"#000000",blue:"#0000ff",fuchsia:"#ff00ff",gray:"#808080",green:"#008000",lime:"#00ff00",maroon:"#800000",navy:"#000080",olive:"#808000",purple:"#800080",red:"#ff0000",silver:"#c0c0c0",teal:"#008080",white:"#ffffff",yellow:"#ffff00",transparent:[null,null,null,0],_default:"#ffffff"}}(h),function(){function e(e){var i,s,n=e.ownerDocument.defaultView?e.ownerDocument.defaultView.getComputedStyle(e,null):e.currentStyle,o={};if(n&&n.length&&n[0]&&n[n[0]])for(s=n.length;s--;)i=n[s],"string"==typeof n[i]&&(o[t.camelCase(i)]=n[i]);else for(i in n)"string"==typeof n[i]&&(o[i]=n[i]);return o}function i(e,i){var s,o,a={};for(s in i)o=i[s],e[s]!==o&&(n[s]||(t.fx.step[s]||!isNaN(parseFloat(o)))&&(a[s]=o));return a}var s=["add","remove","toggle"],n={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};t.each(["borderLeftStyle","borderRightStyle","borderBottomStyle","borderTopStyle"],function(e,i){t.fx.step[i]=function(t){("none"!==t.end&&!t.setAttr||1===t.pos&&!t.setAttr)&&(h.style(t.elem,i,t.end),t.setAttr=!0)}}),t.fn.addBack||(t.fn.addBack=function(t){return this.add(null==t?this.prevObject:this.prevObject.filter(t))}),t.effects.animateClass=function(n,o,a,r){var l=t.speed(o,a,r);return this.queue(function(){var o,a=t(this),r=a.attr("class")||"",h=l.children?a.find("*").addBack():a;h=h.map(function(){var i=t(this);return{el:i,start:e(this)}}),o=function(){t.each(s,function(t,e){n[e]&&a[e+"Class"](n[e])})},o(),h=h.map(function(){return this.end=e(this.el[0]),this.diff=i(this.start,this.end),this}),a.attr("class",r),h=h.map(function(){var e=this,i=t.Deferred(),s=t.extend({},l,{queue:!1,complete:function(){i.resolve(e)}});return this.el.animate(this.diff,s),i.promise()}),t.when.apply(t,h.get()).done(function(){o(),t.each(arguments,function(){var e=this.el;t.each(this.diff,function(t){e.css(t,"")})}),l.complete.call(a[0])})})},t.fn.extend({addClass:function(e){return function(i,s,n,o){return s?t.effects.animateClass.call(this,{add:i},s,n,o):e.apply(this,arguments)}}(t.fn.addClass),removeClass:function(e){return function(i,s,n,o){return arguments.length>1?t.effects.animateClass.call(this,{remove:i},s,n,o):e.apply(this,arguments)}}(t.fn.removeClass),toggleClass:function(e){return function(i,s,n,o,a){return"boolean"==typeof s||void 0===s?n?t.effects.animateClass.call(this,s?{add:i}:{remove:i},n,o,a):e.apply(this,arguments):t.effects.animateClass.call(this,{toggle:i},s,n,o)}}(t.fn.toggleClass),switchClass:function(e,i,s,n,o){return t.effects.animateClass.call(this,{add:i,remove:e},s,n,o)}})}(),function(){function e(e,i,s,n){return t.isPlainObject(e)&&(i=e,e=e.effect),e={effect:e},null==i&&(i={}),t.isFunction(i)&&(n=i,s=null,i={}),("number"==typeof i||t.fx.speeds[i])&&(n=s,s=i,i={}),t.isFunction(s)&&(n=s,s=null),i&&t.extend(e,i),s=s||i.duration,e.duration=t.fx.off?0:"number"==typeof s?s:s in t.fx.speeds?t.fx.speeds[s]:t.fx.speeds._default,e.complete=n||i.complete,e}function i(e){return!e||"number"==typeof e||t.fx.speeds[e]?!0:"string"!=typeof e||t.effects.effect[e]?t.isFunction(e)?!0:"object"!=typeof e||e.effect?!1:!0:!0}function s(t,e){var i=e.outerWidth(),s=e.outerHeight(),n=/^rect\((-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto)\)$/,o=n.exec(t)||["",0,i,s,0];return{top:parseFloat(o[1])||0,right:"auto"===o[2]?i:parseFloat(o[2]),bottom:"auto"===o[3]?s:parseFloat(o[3]),left:parseFloat(o[4])||0}}t.expr&&t.expr.filters&&t.expr.filters.animated&&(t.expr.filters.animated=function(e){return function(i){return!!t(i).data(l)||e(i)}}(t.expr.filters.animated)),t.uiBackCompat!==!1&&t.extend(t.effects,{save:function(t,e){for(var i=0,s=e.length;s>i;i++)null!==e[i]&&t.data(a+e[i],t[0].style[e[i]])},restore:function(t,e){for(var i,s=0,n=e.length;n>s;s++)null!==e[s]&&(i=t.data(a+e[s]),t.css(e[s],i))},setMode:function(t,e){return"toggle"===e&&(e=t.is(":hidden")?"show":"hide"),e},createWrapper:function(e){if(e.parent().is(".ui-effects-wrapper"))return e.parent();var i={width:e.outerWidth(!0),height:e.outerHeight(!0),"float":e.css("float")},s=t("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",margin:0,padding:0}),n={width:e.width(),height:e.height()},o=document.activeElement;try{o.id}catch(a){o=document.body}return e.wrap(s),(e[0]===o||t.contains(e[0],o))&&t(o).trigger("focus"),s=e.parent(),"static"===e.css("position")?(s.css({position:"relative"}),e.css({position:"relative"})):(t.extend(i,{position:e.css("position"),zIndex:e.css("z-index")}),t.each(["top","left","bottom","right"],function(t,s){i[s]=e.css(s),isNaN(parseInt(i[s],10))&&(i[s]="auto")}),e.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"})),e.css(n),s.css(i).show()},removeWrapper:function(e){var i=document.activeElement;return e.parent().is(".ui-effects-wrapper")&&(e.parent().replaceWith(e),(e[0]===i||t.contains(e[0],i))&&t(i).trigger("focus")),e}}),t.extend(t.effects,{version:"1.12.1",define:function(e,i,s){return s||(s=i,i="effect"),t.effects.effect[e]=s,t.effects.effect[e].mode=i,s},scaledDimensions:function(t,e,i){if(0===e)return{height:0,width:0,outerHeight:0,outerWidth:0};var s="horizontal"!==i?(e||100)/100:1,n="vertical"!==i?(e||100)/100:1;return{height:t.height()*n,width:t.width()*s,outerHeight:t.outerHeight()*n,outerWidth:t.outerWidth()*s}},clipToBox:function(t){return{width:t.clip.right-t.clip.left,height:t.clip.bottom-t.clip.top,left:t.clip.left,top:t.clip.top}},unshift:function(t,e,i){var s=t.queue();e>1&&s.splice.apply(s,[1,0].concat(s.splice(e,i))),t.dequeue()},saveStyle:function(t){t.data(r,t[0].style.cssText)},restoreStyle:function(t){t[0].style.cssText=t.data(r)||"",t.removeData(r)},mode:function(t,e){var i=t.is(":hidden");return"toggle"===e&&(e=i?"show":"hide"),(i?"hide"===e:"show"===e)&&(e="none"),e},getBaseline:function(t,e){var i,s;switch(t[0]){case"top":i=0;break;case"middle":i=.5;break;case"bottom":i=1;break;default:i=t[0]/e.height}switch(t[1]){case"left":s=0;break;case"center":s=.5;break;case"right":s=1;break;default:s=t[1]/e.width}return{x:s,y:i}},createPlaceholder:function(e){var i,s=e.css("position"),n=e.position();return e.css({marginTop:e.css("marginTop"),marginBottom:e.css("marginBottom"),marginLeft:e.css("marginLeft"),marginRight:e.css("marginRight")}).outerWidth(e.outerWidth()).outerHeight(e.outerHeight()),/^(static|relative)/.test(s)&&(s="absolute",i=t("<"+e[0].nodeName+">").insertAfter(e).css({display:/^(inline|ruby)/.test(e.css("display"))?"inline-block":"block",visibility:"hidden",marginTop:e.css("marginTop"),marginBottom:e.css("marginBottom"),marginLeft:e.css("marginLeft"),marginRight:e.css("marginRight"),"float":e.css("float")}).outerWidth(e.outerWidth()).outerHeight(e.outerHeight()).addClass("ui-effects-placeholder"),e.data(a+"placeholder",i)),e.css({position:s,left:n.left,top:n.top}),i},removePlaceholder:function(t){var e=a+"placeholder",i=t.data(e);i&&(i.remove(),t.removeData(e))},cleanUp:function(e){t.effects.restoreStyle(e),t.effects.removePlaceholder(e)},setTransition:function(e,i,s,n){return n=n||{},t.each(i,function(t,i){var o=e.cssUnit(i);o[0]>0&&(n[i]=o[0]*s+o[1])}),n}}),t.fn.extend({effect:function(){function i(e){function i(){r.removeData(l),t.effects.cleanUp(r),"hide"===s.mode&&r.hide(),a()}function a(){t.isFunction(h)&&h.call(r[0]),t.isFunction(e)&&e()}var r=t(this);s.mode=u.shift(),t.uiBackCompat===!1||o?"none"===s.mode?(r[c](),a()):n.call(r[0],s,i):(r.is(":hidden")?"hide"===c:"show"===c)?(r[c](),a()):n.call(r[0],s,a)}var s=e.apply(this,arguments),n=t.effects.effect[s.effect],o=n.mode,a=s.queue,r=a||"fx",h=s.complete,c=s.mode,u=[],d=function(e){var i=t(this),s=t.effects.mode(i,c)||o;i.data(l,!0),u.push(s),o&&("show"===s||s===o&&"hide"===s)&&i.show(),o&&"none"===s||t.effects.saveStyle(i),t.isFunction(e)&&e()};return t.fx.off||!n?c?this[c](s.duration,h):this.each(function(){h&&h.call(this)}):a===!1?this.each(d).each(i):this.queue(r,d).queue(r,i)},show:function(t){return function(s){if(i(s))return t.apply(this,arguments);var n=e.apply(this,arguments);return n.mode="show",this.effect.call(this,n)}}(t.fn.show),hide:function(t){return function(s){if(i(s))return t.apply(this,arguments);var n=e.apply(this,arguments);return n.mode="hide",this.effect.call(this,n)}}(t.fn.hide),toggle:function(t){return function(s){if(i(s)||"boolean"==typeof s)return t.apply(this,arguments);var n=e.apply(this,arguments);return n.mode="toggle",this.effect.call(this,n)}}(t.fn.toggle),cssUnit:function(e){var i=this.css(e),s=[];return t.each(["em","px","%","pt"],function(t,e){i.indexOf(e)>0&&(s=[parseFloat(i),e])}),s},cssClip:function(t){return t?this.css("clip","rect("+t.top+"px "+t.right+"px "+t.bottom+"px "+t.left+"px)"):s(this.css("clip"),this)},transfer:function(e,i){var s=t(this),n=t(e.to),o="fixed"===n.css("position"),a=t("body"),r=o?a.scrollTop():0,l=o?a.scrollLeft():0,h=n.offset(),c={top:h.top-r,left:h.left-l,height:n.innerHeight(),width:n.innerWidth()},u=s.offset(),d=t("<div class='ui-effects-transfer'></div>").appendTo("body").addClass(e.className).css({top:u.top-r,left:u.left-l,height:s.innerHeight(),width:s.innerWidth(),position:o?"fixed":"absolute"}).animate(c,e.duration,e.easing,function(){d.remove(),t.isFunction(i)&&i()})}}),t.fx.step.clip=function(e){e.clipInit||(e.start=t(e.elem).cssClip(),"string"==typeof e.end&&(e.end=s(e.end,e.elem)),e.clipInit=!0),t(e.elem).cssClip({top:e.pos*(e.end.top-e.start.top)+e.start.top,right:e.pos*(e.end.right-e.start.right)+e.start.right,bottom:e.pos*(e.end.bottom-e.start.bottom)+e.start.bottom,left:e.pos*(e.end.left-e.start.left)+e.start.left})}}(),function(){var e={};t.each(["Quad","Cubic","Quart","Quint","Expo"],function(t,i){e[i]=function(e){return Math.pow(e,t+2)}}),t.extend(e,{Sine:function(t){return 1-Math.cos(t*Math.PI/2)},Circ:function(t){return 1-Math.sqrt(1-t*t)},Elastic:function(t){return 0===t||1===t?t:-Math.pow(2,8*(t-1))*Math.sin((80*(t-1)-7.5)*Math.PI/15)},Back:function(t){return t*t*(3*t-2)},Bounce:function(t){for(var e,i=4;((e=Math.pow(2,--i))-1)/11>t;);return 1/Math.pow(4,3-i)-7.5625*Math.pow((3*e-2)/22-t,2)}}),t.each(e,function(e,i){t.easing["easeIn"+e]=i,t.easing["easeOut"+e]=function(t){return 1-i(1-t)},t.easing["easeInOut"+e]=function(t){return.5>t?i(2*t)/2:1-i(-2*t+2)/2}})}();var c=t.effects;t.effects.define("blind","hide",function(e,i){var s={up:["bottom","top"],vertical:["bottom","top"],down:["top","bottom"],left:["right","left"],horizontal:["right","left"],right:["left","right"]},n=t(this),o=e.direction||"up",a=n.cssClip(),r={clip:t.extend({},a)},l=t.effects.createPlaceholder(n);r.clip[s[o][0]]=r.clip[s[o][1]],"show"===e.mode&&(n.cssClip(r.clip),l&&l.css(t.effects.clipToBox(r)),r.clip=a),l&&l.animate(t.effects.clipToBox(r),e.duration,e.easing),n.animate(r,{queue:!1,duration:e.duration,easing:e.easing,complete:i})}),t.effects.define("bounce",function(e,i){var s,n,o,a=t(this),r=e.mode,l="hide"===r,h="show"===r,c=e.direction||"up",u=e.distance,d=e.times||5,p=2*d+(h||l?1:0),f=e.duration/p,g=e.easing,m="up"===c||"down"===c?"top":"left",_="up"===c||"left"===c,v=0,b=a.queue().length;for(t.effects.createPlaceholder(a),o=a.css(m),u||(u=a["top"===m?"outerHeight":"outerWidth"]()/3),h&&(n={opacity:1},n[m]=o,a.css("opacity",0).css(m,_?2*-u:2*u).animate(n,f,g)),l&&(u/=Math.pow(2,d-1)),n={},n[m]=o;d>v;v++)s={},s[m]=(_?"-=":"+=")+u,a.animate(s,f,g).animate(n,f,g),u=l?2*u:u/2;l&&(s={opacity:0},s[m]=(_?"-=":"+=")+u,a.animate(s,f,g)),a.queue(i),t.effects.unshift(a,b,p+1)}),t.effects.define("clip","hide",function(e,i){var s,n={},o=t(this),a=e.direction||"vertical",r="both"===a,l=r||"horizontal"===a,h=r||"vertical"===a;s=o.cssClip(),n.clip={top:h?(s.bottom-s.top)/2:s.top,right:l?(s.right-s.left)/2:s.right,bottom:h?(s.bottom-s.top)/2:s.bottom,left:l?(s.right-s.left)/2:s.left},t.effects.createPlaceholder(o),"show"===e.mode&&(o.cssClip(n.clip),n.clip=s),o.animate(n,{queue:!1,duration:e.duration,easing:e.easing,complete:i})}),t.effects.define("drop","hide",function(e,i){var s,n=t(this),o=e.mode,a="show"===o,r=e.direction||"left",l="up"===r||"down"===r?"top":"left",h="up"===r||"left"===r?"-=":"+=",c="+="===h?"-=":"+=",u={opacity:0};t.effects.createPlaceholder(n),s=e.distance||n["top"===l?"outerHeight":"outerWidth"](!0)/2,u[l]=h+s,a&&(n.css(u),u[l]=c+s,u.opacity=1),n.animate(u,{queue:!1,duration:e.duration,easing:e.easing,complete:i})}),t.effects.define("explode","hide",function(e,i){function s(){b.push(this),b.length===u*d&&n()}function n(){p.css({visibility:"visible"}),t(b).remove(),i()}var o,a,r,l,h,c,u=e.pieces?Math.round(Math.sqrt(e.pieces)):3,d=u,p=t(this),f=e.mode,g="show"===f,m=p.show().css("visibility","hidden").offset(),_=Math.ceil(p.outerWidth()/d),v=Math.ceil(p.outerHeight()/u),b=[];for(o=0;u>o;o++)for(l=m.top+o*v,c=o-(u-1)/2,a=0;d>a;a++)r=m.left+a*_,h=a-(d-1)/2,p.clone().appendTo("body").wrap("<div></div>").css({position:"absolute",visibility:"visible",left:-a*_,top:-o*v}).parent().addClass("ui-effects-explode").css({position:"absolute",overflow:"hidden",width:_,height:v,left:r+(g?h*_:0),top:l+(g?c*v:0),opacity:g?0:1}).animate({left:r+(g?0:h*_),top:l+(g?0:c*v),opacity:g?1:0},e.duration||500,e.easing,s)}),t.effects.define("fade","toggle",function(e,i){var s="show"===e.mode;t(this).css("opacity",s?0:1).animate({opacity:s?1:0},{queue:!1,duration:e.duration,easing:e.easing,complete:i})}),t.effects.define("fold","hide",function(e,i){var s=t(this),n=e.mode,o="show"===n,a="hide"===n,r=e.size||15,l=/([0-9]+)%/.exec(r),h=!!e.horizFirst,c=h?["right","bottom"]:["bottom","right"],u=e.duration/2,d=t.effects.createPlaceholder(s),p=s.cssClip(),f={clip:t.extend({},p)},g={clip:t.extend({},p)},m=[p[c[0]],p[c[1]]],_=s.queue().length;l&&(r=parseInt(l[1],10)/100*m[a?0:1]),f.clip[c[0]]=r,g.clip[c[0]]=r,g.clip[c[1]]=0,o&&(s.cssClip(g.clip),d&&d.css(t.effects.clipToBox(g)),g.clip=p),s.queue(function(i){d&&d.animate(t.effects.clipToBox(f),u,e.easing).animate(t.effects.clipToBox(g),u,e.easing),i()}).animate(f,u,e.easing).animate(g,u,e.easing).queue(i),t.effects.unshift(s,_,4)}),t.effects.define("highlight","show",function(e,i){var s=t(this),n={backgroundColor:s.css("backgroundColor")};"hide"===e.mode&&(n.opacity=0),t.effects.saveStyle(s),s.css({backgroundImage:"none",backgroundColor:e.color||"#ffff99"}).animate(n,{queue:!1,duration:e.duration,easing:e.easing,complete:i})}),t.effects.define("size",function(e,i){var s,n,o,a=t(this),r=["fontSize"],l=["borderTopWidth","borderBottomWidth","paddingTop","paddingBottom"],h=["borderLeftWidth","borderRightWidth","paddingLeft","paddingRight"],c=e.mode,u="effect"!==c,d=e.scale||"both",p=e.origin||["middle","center"],f=a.css("position"),g=a.position(),m=t.effects.scaledDimensions(a),_=e.from||m,v=e.to||t.effects.scaledDimensions(a,0);t.effects.createPlaceholder(a),"show"===c&&(o=_,_=v,v=o),n={from:{y:_.height/m.height,x:_.width/m.width},to:{y:v.height/m.height,x:v.width/m.width}},("box"===d||"both"===d)&&(n.from.y!==n.to.y&&(_=t.effects.setTransition(a,l,n.from.y,_),v=t.effects.setTransition(a,l,n.to.y,v)),n.from.x!==n.to.x&&(_=t.effects.setTransition(a,h,n.from.x,_),v=t.effects.setTransition(a,h,n.to.x,v))),("content"===d||"both"===d)&&n.from.y!==n.to.y&&(_=t.effects.setTransition(a,r,n.from.y,_),v=t.effects.setTransition(a,r,n.to.y,v)),p&&(s=t.effects.getBaseline(p,m),_.top=(m.outerHeight-_.outerHeight)*s.y+g.top,_.left=(m.outerWidth-_.outerWidth)*s.x+g.left,v.top=(m.outerHeight-v.outerHeight)*s.y+g.top,v.left=(m.outerWidth-v.outerWidth)*s.x+g.left),a.css(_),("content"===d||"both"===d)&&(l=l.concat(["marginTop","marginBottom"]).concat(r),h=h.concat(["marginLeft","marginRight"]),a.find("*[width]").each(function(){var i=t(this),s=t.effects.scaledDimensions(i),o={height:s.height*n.from.y,width:s.width*n.from.x,outerHeight:s.outerHeight*n.from.y,outerWidth:s.outerWidth*n.from.x},a={height:s.height*n.to.y,width:s.width*n.to.x,outerHeight:s.height*n.to.y,outerWidth:s.width*n.to.x};n.from.y!==n.to.y&&(o=t.effects.setTransition(i,l,n.from.y,o),a=t.effects.setTransition(i,l,n.to.y,a)),n.from.x!==n.to.x&&(o=t.effects.setTransition(i,h,n.from.x,o),a=t.effects.setTransition(i,h,n.to.x,a)),u&&t.effects.saveStyle(i),i.css(o),i.animate(a,e.duration,e.easing,function(){u&&t.effects.restoreStyle(i)})})),a.animate(v,{queue:!1,duration:e.duration,easing:e.easing,complete:function(){var e=a.offset();0===v.opacity&&a.css("opacity",_.opacity),u||(a.css("position","static"===f?"relative":f).offset(e),t.effects.saveStyle(a)),i()}})}),t.effects.define("scale",function(e,i){var s=t(this),n=e.mode,o=parseInt(e.percent,10)||(0===parseInt(e.percent,10)?0:"effect"!==n?0:100),a=t.extend(!0,{from:t.effects.scaledDimensions(s),to:t.effects.scaledDimensions(s,o,e.direction||"both"),origin:e.origin||["middle","center"]},e);e.fade&&(a.from.opacity=1,a.to.opacity=0),t.effects.effect.size.call(this,a,i)}),t.effects.define("puff","hide",function(e,i){var s=t.extend(!0,{},e,{fade:!0,percent:parseInt(e.percent,10)||150});t.effects.effect.scale.call(this,s,i)}),t.effects.define("pulsate","show",function(e,i){var s=t(this),n=e.mode,o="show"===n,a="hide"===n,r=o||a,l=2*(e.times||5)+(r?1:0),h=e.duration/l,c=0,u=1,d=s.queue().length;for((o||!s.is(":visible"))&&(s.css("opacity",0).show(),c=1);l>u;u++)s.animate({opacity:c},h,e.easing),c=1-c;s.animate({opacity:c},h,e.easing),s.queue(i),t.effects.unshift(s,d,l+1)}),t.effects.define("shake",function(e,i){var s=1,n=t(this),o=e.direction||"left",a=e.distance||20,r=e.times||3,l=2*r+1,h=Math.round(e.duration/l),c="up"===o||"down"===o?"top":"left",u="up"===o||"left"===o,d={},p={},f={},g=n.queue().length;for(t.effects.createPlaceholder(n),d[c]=(u?"-=":"+=")+a,p[c]=(u?"+=":"-=")+2*a,f[c]=(u?"-=":"+=")+2*a,n.animate(d,h,e.easing);r>s;s++)n.animate(p,h,e.easing).animate(f,h,e.easing);n.animate(p,h,e.easing).animate(d,h/2,e.easing).queue(i),t.effects.unshift(n,g,l+1)}),t.effects.define("slide","show",function(e,i){var s,n,o=t(this),a={up:["bottom","top"],down:["top","bottom"],left:["right","left"],right:["left","right"]},r=e.mode,l=e.direction||"left",h="up"===l||"down"===l?"top":"left",c="up"===l||"left"===l,u=e.distance||o["top"===h?"outerHeight":"outerWidth"](!0),d={};t.effects.createPlaceholder(o),s=o.cssClip(),n=o.position()[h],d[h]=(c?-1:1)*u+n,d.clip=o.cssClip(),d.clip[a[l][1]]=d.clip[a[l][0]],"show"===r&&(o.cssClip(d.clip),o.css(h,d[h]),d.clip=s,d[h]=n),o.animate(d,{queue:!1,duration:e.duration,easing:e.easing,complete:i})});var c;t.uiBackCompat!==!1&&(c=t.effects.define("transfer",function(e,i){t(this).transfer(e,i)}))});/**
 * Created by zcf on 2016/9/22.
 */
BI.SingleSlider = BI.inherit(BI.Widget, {
    _constant: {
        EDITOR_WIDTH: 60,
        EDITOR_HEIGHT: 30,
        HEIGHT: 28,
        SLIDER_WIDTH_HALF: 15,
        SLIDER_WIDTH: 30,
        SLIDER_HEIGHT: 30,
        TRACK_HEIGHT: 24
    },
    _defaultConfig: function () {
        return BI.extend(BI.SingleSlider.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-slider bi-slider-track"
        });
    },
    _init: function () {
        BI.SingleSlider.superclass._init.apply(this, arguments);

        var self = this;
        var c = this._constant;
        this.enable = false;
        this.value = "";

        this.backgroundTrack = BI.createWidget({
            type: "bi.layout",
            cls: "background-track bi-background",
            height: c.TRACK_HEIGHT
        });
        this.grayTrack = BI.createWidget({
            type: "bi.layout",
            cls: "gray-track",
            height: 8
        });
        this.blueTrack = BI.createWidget({
            type: "bi.layout",
            cls: "blue-track bi-high-light-background",
            height: 8
        });
        this.track = this._createTrackWrapper();

        this.slider = BI.createWidget({
            type: "bi.single_slider_slider"
        });
        this.slider.element.draggable({
            axis: "x",
            containment: this.grayTrack.element,
            scroll: false,
            drag: function (e, ui) {
                var percent = (ui.position.left) * 100 / (self._getGrayTrackLength());
                var significantPercent = BI.parseFloat(percent.toFixed(1));//直接对计算出来的百分数保留到小数点后一位，相当于分成了1000份。
                self._setBlueTrack(significantPercent);
                self._setLabelPosition(significantPercent);
                var v = self._getValueByPercent(significantPercent);
                self.label.setValue(v);
                self.value = v;
            },
            stop: function (e, ui) {
                var percent = (ui.position.left) * 100 / (self._getGrayTrackLength());
                var significantPercent = BI.parseFloat(percent.toFixed(1));
                self._setSliderPosition(significantPercent);
                self.fireEvent(BI.SingleSlider.EVENT_CHANGE);
            }
        });
        var sliderVertical = BI.createWidget({
            type: "bi.vertical",
            items: [{
                type: "bi.absolute",
                items: [this.slider]
            }],
            hgap: c.SLIDER_WIDTH_HALF,
            height: c.SLIDER_HEIGHT
        });
        sliderVertical.element.click(function (e) {
            if (self.enable) {
                var offset = e.clientX - self.element.offset().left - c.SLIDER_WIDTH_HALF;
                var trackLength = self.track.element[0].scrollWidth;
                var percent = 0;
                if (offset < 0) {
                    percent = 0
                }
                if (offset > 0 && offset < (trackLength - c.SLIDER_WIDTH)) {
                    percent = offset * 100 / self._getGrayTrackLength();
                }
                if (offset > (trackLength - c.SLIDER_WIDTH)) {
                    percent = 100
                }
                var significantPercent = BI.parseFloat(percent.toFixed(1));
                self._setAllPosition(significantPercent);
                var v = self._getValueByPercent(significantPercent);
                self.label.setValue(v);
                self.value = v;
                self.fireEvent(BI.SingleSlider.EVENT_CHANGE);
            }
        });
        this.label = BI.createWidget({
            type: "bi.sign_editor",
            cls: "slider-editor-button bi-border",
            errorText: "",
            height: c.HEIGHT,
            width: c.EDITOR_WIDTH,
            allowBlank: false,
            validationChecker: function (v) {
                return self._checkValidation(v);
            },
            quitChecker: function (v) {
                return self._checkValidation(v);
            }
        });
        this.label.on(BI.SignEditor.EVENT_CONFIRM, function () {
            var percent = self._getPercentByValue(this.getValue());
            var significantPercent = BI.parseFloat(percent.toFixed(1));
            self._setAllPosition(significantPercent);
            self.fireEvent(BI.SingleSlider.EVENT_CHANGE);
        });
        this._setVisible(false);
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.vertical",
                    items: [{
                        type: "bi.absolute",
                        items: [{
                            el: this.track,
                            width: "100%",
                            height: c.TRACK_HEIGHT
                        }]
                    }],
                    hgap: 7,
                    height: c.TRACK_HEIGHT
                },
                top: 33,
                left: 0,
                width: "100%"
            }, {
                el: sliderVertical,
                top: 30,
                left: 0,
                width: "100%"
            }, {
                el: {
                    type: "bi.vertical",
                    items: [{
                        type: "bi.absolute",
                        items: [this.label]
                    }],
                    rgap: c.EDITOR_WIDTH/2,
                    height: c.EDITOR_HEIGHT
                },
                top: 0,
                left: 0,
                width: "100%"
            }]
        })
    },

    _createTrackWrapper: function () {
        return BI.createWidget({
            type: "bi.absolute",
            items: [{
                el: this.backgroundTrack,
                width: "100%"
            }, {
                el: {
                    type: "bi.vertical",
                    items: [{
                        type: "bi.absolute",
                        items: [{
                            el: this.grayTrack,
                            top: 0,
                            left: 0,
                            width: "100%"
                        }, {
                            el: this.blueTrack,
                            top: 0,
                            left: 0,
                            width: "0%"
                        }]
                    }],
                    hgap: 8,
                    height: 8
                },
                top: 8,
                left: 0,
                width: "100%"
            }]
        })
    },

    _checkValidation: function (v) {
        return !(BI.isNull(v) || v < this.min || v > this.max)
    },

    _setBlueTrack: function (percent) {
        this.blueTrack.element.css({"width": percent + "%"});
    },

    _setLabelPosition: function (percent) {
        this.label.element.css({"left": percent + "%"});
    },

    _setSliderPosition: function (percent) {
        this.slider.element.css({"left": percent + "%"});
    },

    _setAllPosition: function (percent) {
        this._setSliderPosition(percent);
        this._setLabelPosition(percent);
        this._setBlueTrack(percent);
    },

    _setVisible: function (visible) {
        this.slider.setVisible(visible);
        this.label.setVisible(visible);
    },

    _getGrayTrackLength: function () {
        return this.grayTrack.element[0].scrollWidth
    },

    _getValueByPercent: function (percent) {
        var thousandth = BI.parseInt(percent * 10);
        return (((this.max - this.min) * thousandth) / 1000 + this.min);
    },

    _getPercentByValue: function (v) {
        return (v - this.min) * 100 / (this.max - this.min);
    },

    getValue: function () {
        return this.value;
    },

    setValue: function (v) {
        var value = BI.parseFloat(v);
        if ((!isNaN(value))) {
            if (this._checkValidation(value)) {
                this.value = value;
            }
            if (value > this.max) {
                this.value = this.max;
            }
            if (value < this.min) {
                this.value = this.min;
            }
        }
    },

    setMinAndMax: function (v) {
        var minNumber = BI.parseFloat(v.min);
        var maxNumber = BI.parseFloat(v.max);
        if ((!isNaN(minNumber)) && (!isNaN(maxNumber)) && (maxNumber > minNumber )) {
            this.min = minNumber;
            this.max = maxNumber;
        }
    },

    reset: function () {
        this._setVisible(false);
        this.enable = false;
        this.value = "";
        this.min = 0;
        this.max = 0;
        this._setBlueTrack(0);
    },

    populate: function () {
        if (!isNaN(this.min) && !isNaN(this.max)) {
            this._setVisible(true);
            this.enable = true;
            this.label.setErrorText(BI.i18nText("BI-Please_Enter") + this.min + "-" + this.max + BI.i18nText("BI-Basic_De") + BI.i18nText("BI-Basic_Number"));
            if (BI.isNumeric(this.value) || BI.isNotEmptyString(this.value)) {
                this.label.setValue(this.value);
                this._setAllPosition(this._getPercentByValue(this.value));
            } else {
                this.label.setValue(this.max);
                this._setAllPosition(100);
            }
        }
    }
});
BI.SingleSlider.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.single_slider", BI.SingleSlider);/**
 * Created by zcf on 2016/9/22.
 */
BI.Slider = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.Slider.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-slider-slider"
        });
    },
    _init: function () {
        BI.extend(BI.Slider.superclass._init.apply(this, arguments));
        this.slider = BI.createWidget({
            type: "bi.icon_button",
            cls: "widget-slider-icon",
            iconWidth: 30,
            iconHeight: 30,
            height: 30,
            width: 30
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.slider,
                top: 0,
                left: -15
            }],
            width: 0,
            height: 30
        });
    }
});
BI.shortcut("bi.single_slider_slider", BI.Slider);/**
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
            behaviors: {},
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
            if (self.combo.isViewVisible()) {
                return;
            }
            if (this.getKey() && this.getKey() !== self.storeValue) {
                self.setValue(this.getKey());
            } else if (!this.getKey()) {
                self.setValue();
            }
            self.fireEvent(BI.YearCombo.EVENT_CONFIRM);
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            destroyWhenHide: true,
            isNeedAdjustHeight: false,
            isNeedAdjustWidth: false,
            el: this.trigger,
            popup: {
                minWidth: 85,
                stopPropagation: false,
                el: {
                    type: "bi.year_popup",
                    ref: function () {
                        self.popup = this;
                    },
                    listeners: [{
                        eventName: BI.YearPopup.EVENT_CHANGE,
                        action: function () {
                            self.setValue(self.popup.getValue());
                            self.combo.hideView();
                            self.fireEvent(BI.YearCombo.EVENT_CONFIRM);
                        }
                    }],
                    behaviors: o.behaviors,
                    min: o.min,
                    max: o.max
                }
            }
        });
        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            var value = self.trigger.getKey();
            if (BI.isNotNull(value)) {
                self.popup.setValue(value);
            } else if (!value && value !== self.storeValue) {
                self.popup.setValue(self.storeValue);
            } else {
                self.setValue();
            }
            self.fireEvent(BI.YearCombo.EVENT_BEFORE_POPUPVIEW);
        });
    },

    setValue: function (v) {
        this.combo.setValue(v);
    },

    getValue: function () {
        return this.popup.getValue();
    }
});
BI.YearCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.YearCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
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
            behaviors: {},
            min: '1900-01-01', //最小日期
            max: '2099-12-31' //最大日期
        });
    },

    _createYearCalendar: function (v) {
        var o = this.options, y = this._year;

        var calendar = BI.createWidget({
            type: "bi.year_calendar",
            behaviors: o.behaviors,
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
            single: true,
            logic: {
                dynamic: true
            },
            tab: {
                cls: "year-popup-navigation bi-high-light bi-border-top",
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
            yearBehaviors: {},
            monthBehaviors: {},
            height: 25
        });
    },
    _init: function () {
        BI.YearMonthCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.year = BI.createWidget({
            type: "bi.year_combo",
            behaviors: o.yearBehaviors
        });

        this.month = BI.createWidget({
            type: "bi.month_combo",
            behaviors: o.monthBehaviors
        });

        this.year.on(BI.YearCombo.EVENT_CONFIRM, function () {
            self.fireEvent(BI.YearMonthCombo.EVENT_CONFIRM);
        });
        this.year.on(BI.YearCombo.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.YearMonthCombo.EVENT_BEFORE_POPUPVIEW);
        });

        this.month.on(BI.MonthCombo.EVENT_CONFIRM, function () {
            self.fireEvent(BI.YearMonthCombo.EVENT_CONFIRM);
        });
        this.month.on(BI.MonthCombo.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.YearMonthCombo.EVENT_BEFORE_POPUPVIEW);
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
BI.YearMonthCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
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
            yearBehaviors: {},
            quarterBehaviors: {},
            height: 25
        });
    },
    _init: function () {
        BI.YearQuarterCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.year = BI.createWidget({
            type: "bi.year_combo",
            behaviors: o.yearBehaviors
        });

        this.quarter = BI.createWidget({
            type: "bi.quarter_combo",
            behaviors: o.quarterBehaviors
        });

        this.year.on(BI.YearCombo.EVENT_CONFIRM, function () {
            self.fireEvent(BI.YearQuarterCombo.EVENT_CONFIRM);
        });
        this.year.on(BI.YearCombo.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.YearQuarterCombo.EVENT_BEFORE_POPUPVIEW);
        });

        this.quarter.on(BI.QuarterCombo.EVENT_CONFIRM, function () {
            self.fireEvent(BI.YearQuarterCombo.EVENT_CONFIRM);
        });
        this.quarter.on(BI.QuarterCombo.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.YearQuarterCombo.EVENT_BEFORE_POPUPVIEW);
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
BI.YearQuarterCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
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
                createOneJson(node, node.parent && node.parent.id, getCount(selected[k], newParents));
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
            //例如选中了中国-江苏-南京， 取消中国或江苏或南京
            if (canFindKey(selectedValues, p)) {
                //如果搜索的值在父亲链中
                if (isSearchValueInParent(p)) {
                    //例如选中了 中国-江苏， 搜索江苏， 取消江苏
                    //例如选中了 中国-江苏， 搜索江苏， 取消中国
                    self._deleteNode(selectedValues, p);
                } else {
                    var searched = [];
                    var finded = search(parentValues, notSelectedValue, [], searched);
                    if (finded && BI.isNotEmptyArray(searched)) {
                        BI.each(searched, function (i, arr) {
                            var node = self._getNode(selectedValues, arr);
                            if (node) {
                                //例如选中了 中国-江苏-南京，搜索南京，取消中国
                                self._deleteNode(selectedValues, arr);
                            } else {
                                //例如选中了 中国-江苏，搜索南京，取消中国
                                expandSelectedValue(selectedValues, arr, BI.last(arr));
                            }
                        })
                    }
                }
            }

            //存储的值中不存在这个值，但父亲节点是全选的情况
            //例如选中了中国-江苏，取消南京
            //important 选中了中国-江苏，取消了江苏，但是搜索的是南京
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
                    //去掉点击的节点之后的结果集
                    expandSelectedValue(selectedValues, p, notSelectedValue);
                    //添加去掉搜索的结果集
                    if (result.length > 0) {
                        BI.each(result, function (i, strs) {
                            self._buildTree(selectedValues, strs);
                        })
                    }
                }
            }

        }

        function expandSelectedValue(selectedValues, parents, notSelectedValue) {
            var next = selectedValues;
            var childrenCount = [];
            var path = [];
            //去掉点击的节点之后的结果集
            BI.some(parents, function (i, v) {
                var t = next[v];
                if (t == null) {
                    if (i === 0) {
                        return true;
                    }
                    if (BI.isEmpty(next)) {
                        var split = parents.slice(0, i);
                        var expanded = self._getChildren(split);
                        path.push(split);
                        childrenCount.push(expanded.length);
                        //如果只有一个值且取消的就是这个值
                        if (i === parents.length - 1 && expanded.length === 1 && expanded[0] === notSelectedValue) {
                            for (var j = childrenCount.length - 1; j >= 0; j--) {
                                if (childrenCount[j] === 1) {
                                    self._deleteNode(selectedValues, path[j]);
                                } else {
                                    break;
                                }
                            }
                        } else {
                            BI.each(expanded, function (m, child) {
                                if (i === parents.length - 1 && child.value === notSelectedValue) {
                                    return true;
                                }
                                next[child.value] = {};
                            });
                        }
                        next = next[v];
                    } else {
                        return true;
                        // next = {};
                        // next[v] = {};
                    }
                } else {
                    next = t;
                }
            });
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
        if (pNode != null && pNode[name]) {
            delete pNode[name];
            //递归删掉空父节点
            while (p.length > 0 && BI.isEmpty(pNode)) {
                name = p[p.length - 1];
                p = p.slice(0, p.length - 1);
                pNode = this._getNode(selectedValues, p);
                if (pNode != null) {
                    delete pNode[name];
                }
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