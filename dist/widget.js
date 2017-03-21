/**
 * 普通控件
 *
 * @class BI.ParamPopupView
 * @extends BI.Widget
 * @abstract
 */
BI.ParamPopupView = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.ParamPopupView.superclass._defaultConfig.apply(this, arguments), {});
    },

    dateConfig: function(){

    },

    _init: function () {
        BI.ParamPopupView.superclass._init.apply(this, arguments);
        var self = this;

        this.radioGroup = BI.createWidget({
            type: "bi.button_group",
            chooseType: 0,
            items: this.dateConfig(),
            layouts: [{
                type: "bi.vertical",
                items: [{
                    type: "bi.vertical",
                    vgap: 5
                }],
                vgap: 5,
                hgap: 5
            }]
        });

        this.radioGroup.on(BI.ButtonGroup.EVENT_CHANGE, function () {
            self.setValue(self.getValue());
            self.fireEvent(BI.ParamPopupView.EVENT_CHANGE);
        });
        this.popup = BI.createWidget({
            type: 'bi.multi_popup_view',
            element: this,
            el: this.radioGroup,
            minWidth: 310,
            stopPropagation: false
        });

        this.popup.on(BI.MultiPopupView.EVENT_CLICK_TOOLBAR_BUTTON, function () {
            self.fireEvent(BI.ParamPopupView.EVENT_CONFIRM);
        });

    },

    setValue: function (v) {
        this.radioGroup.setValue(v.type);
        BI.each(this.radioGroup.getAllButtons(), function (i, button) {
            if (button.isSelected()) {
                button.setEnable(true);
                button.setInputValue(v.value);
            } else {
                button.setEnable(false);
            }
        });
    },

    getValue: function () {
        var button = this.radioGroup.getSelectedButtons()[0];
        var type = button.getValue(), value = button.getInputValue();
        return {
            type: type,
            value: value
        }
    },

    getCalculationValue: function () {
        var valueObject = this.getValue();
        var type = valueObject.type, value = valueObject.value;
        var fPrevOrAfter = value.foffset === 0 ? -1 : 1;
        var sPrevOrAfter = value.soffset === 0 ? -1 : 1;
        var start, end;
        start = end = new Date();
        var ydate = new Date((new Date().getFullYear() + fPrevOrAfter * value.fvalue), new Date().getMonth(), new Date().getDate());
        switch (type) {
            case BICst.YEAR:
                start = new Date((new Date().getFullYear() + fPrevOrAfter * value.fvalue), 0, 1);
                end = new Date(start.getFullYear(), 11, 31);
                break;
            case BICst.YEAR_QUARTER:
                ydate = new Date().getOffsetQuarter(ydate, sPrevOrAfter * value.svalue);
                start = ydate.getQuarterStartDate();
                end = ydate.getQuarterEndDate();
                break;
            case BICst.YEAR_MONTH:
                ydate = new Date().getOffsetMonth(ydate, sPrevOrAfter * value.svalue);
                start = new Date(ydate.getFullYear(), ydate.getMonth(), 1);
                end  = new Date(ydate.getFullYear(), ydate.getMonth(), (ydate.getLastDateOfMonth()).getDate());
                break;
            case BICst.YEAR_WEEK:
                start = ydate.getOffsetDate(sPrevOrAfter * 7 * value.svalue);
                end = start.getOffsetDate(7);
                break;
            case BICst.YEAR_DAY:
                start = ydate.getOffsetDate(sPrevOrAfter * value.svalue);
                end = start.getOffsetDate(1);
                break;
            case BICst.MONTH_WEEK:
                var mdate = new Date().getOffsetMonth(new Date(), fPrevOrAfter * value.fvalue);
                start = mdate.getOffsetDate(sPrevOrAfter * 7 * value.svalue);
                end = start.getOffsetDate(7);
                break;
            case BICst.MONTH_DAY:
                var mdate = new Date().getOffsetMonth(new Date(), fPrevOrAfter * value.fvalue);
                start = mdate.getOffsetDate(sPrevOrAfter * value.svalue);
                end = start.getOffsetDate(1);
                break;
        }
        return {
            start: start,
            end: end
        };
    },

    resetWidth: function(w){
        this.popup.resetWidth(w);
    },

    resetHeight: function(h){
        this.popup.resetHeight(h);
    }
});
BI.ParamPopupView.EVENT_CHANGE = "EVENT_CHANGE";
BI.ParamPopupView.EVENT_CONFIRM = "EVENT_CONFIRM";
$.shortcut("bi.param_popup_view", BI.ParamPopupView);/**
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

        this.header = BI.createWidget({
            type: "bi.table_style_cell",
            cls: "sequence-table-title-cell",
            styleGetter: o.headerCellStyleGetter,
            text: BI.i18nText("BI-Number_Index")
        });
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

        this.layout = BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: this.header,
                height: this._getHeaderHeight()
            }, {
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
            self.cache[node.text || node.value] = cnt++;
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
        var headerHeight = this._getHeaderHeight();
        var items = this.layout.attr("items");
        if (o.isNeedFreeze === false) {
            items[0].height = 0;
        } else if (o.isNeedFreeze === true) {
            items[0].height = headerHeight;
        }
        this.layout.attr("items", items);
        this.layout.resize();
        this.scrollContainer.element.scrollTop(o.scrollTop);
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
                    cls: "sequence-table-number-cell",
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
        this.header.populate();
        this._layout();
        this._calculateChildrenToRender();
    },

    setVerticalScroll: function (scrollTop) {
        if (this.options.scrollTop !== scrollTop) {
            this.options.scrollTop = scrollTop;
            this.scrollContainer.element.scrollTop(scrollTop);
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
$.shortcut('bi.sequence_table_tree_number', BI.SequenceTableTreeNumber);/**
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
$.shortcut('bi.adaptive_arrangement', BI.AdaptiveArrangement);/**
 * Arrangement的block面板
 *
 * Created by GUY on 2016/3/1.
 * @class BI.ArrangementBlock
 * @extends BI.Widget
 */
BI.ArrangementBlock = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.ArrangementBlock.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-arrangement-block"
        });
    },

    _init: function () {
        BI.ArrangementBlock.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        
    }
});
$.shortcut('bi.arrangement_block', BI.ArrangementBlock);/**
 * Arrangement的drop面板
 *
 * Created by GUY on 2016/3/1.
 * @class BI.ArrangementDroppable
 * @extends BI.Widget
 */
BI.ArrangementDroppable = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.ArrangementDroppable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-arrangement-droppable"
        });
    },

    _init: function () {
        BI.ArrangementDroppable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        
    }
});
$.shortcut('bi.arrangement_droppable', BI.ArrangementDroppable);/**
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
$.shortcut('bi.arrangement', BI.Arrangement);/**
 * Created by Young's on 2016/4/28.
 */
BI.EditorIconCheckCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.EditorIconCheckCombo.superclass._defaultConfig.apply(this, arguments), {
            baseClass: "bi-check-editor-combo",
            width: 100,
            height: 30,
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn,
            allowBlank: true,
            watermark: "",
            errorText: ""
        })
    },

    _init: function () {
        BI.EditorIconCheckCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.editor_trigger",
            items: o.items,
            height: o.height,
            validationChecker: o.validationChecker,
            quitChecker: o.quitChecker,
            allowBlank: o.allowBlank,
            watermark: o.watermark,
            errorText: o.errorText
        });
        this.trigger.on(BI.EditorTrigger.EVENT_CHANGE, function () {
            self.popup.setValue(this.getValue());
            self.fireEvent(BI.EditorIconCheckCombo.EVENT_CHANGE);
        });
        this.popup = BI.createWidget({
            type: "bi.text_value_check_combo_popup",
            chooseType: o.chooseType,
            items: o.items
        });
        this.popup.on(BI.TextValueCheckComboPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.editorIconCheckCombo.hideView();
            self.fireEvent(BI.EditorIconCheckCombo.EVENT_CHANGE);
        });
        this.popup.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.editorIconCheckCombo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: {
                el: this.popup,
                maxHeight: 300
            }
        });
    },

    setValue: function (v) {
        this.editorIconCheckCombo.setValue(v);
    },

    setEnable: function (v) {
        BI.EditorIconCheckCombo.superclass.setEnable.apply(this, arguments);
        this.editorIconCheckCombo.setEnable(v);
    },

    getValue: function () {
        return this.trigger.getValue();
    },

    populate: function (items) {
        this.options.items = items;
        this.editorIconCheckCombo.populate(items);
    }
});
BI.EditorIconCheckCombo.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.editor_icon_check_combo", BI.EditorIconCheckCombo);/**
 * Created by GUY on 2016/4/25.
 *
 * @class BI.FormulaCombo
 * @extend BI.Widget
 */
BI.FormulaCombo = BI.inherit(BI.Widget, {

    _constant: {
        POPUP_HEIGHT: 450,
        POPUP_WIDTH: 600,
        POPUP_V_GAP: 10,
        POPUP_H_GAP: 10,
        ADJUST_LENGTH: 2,
        HEIGHT_MAX: 10000,
        MAX_HEIGHT: 500,
        MAX_WIDTH: 600,
        COMBO_TRIGGER_WIDTH: 300
    },

    _defaultConfig: function () {
        return BI.extend(BI.FormulaCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-formula-combo",
            height: 30,
            items: []
        })
    },

    _init: function () {
        BI.FormulaCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.formula_ids = [];
        this.input = BI.createWidget({
            type: "bi.formula_combo_trigger",
            height: o.height,
            items: o.items
        });
        this.formulaPopup = BI.createWidget({
            type: "bi.formula_combo_popup",
            fieldItems: o.items
        });

        this.formulaInputCombo = BI.createWidget({
            type: "bi.combo",
            element: this,
            isNeedAdjustHeight: true,
            isNeedAdjustWidth: false,
            adjustLength: this._constant.CONDITION_TYPE_COMBO_ADJUST,
            el: this.input,
            popup: {
                el: {
                    type: "bi.absolute",
                    height: this._constant.HEIGHT_MAX,
                    width: this._constant.POPUP_WIDTH,
                    items: [{
                        el: this.formulaPopup,
                        top: this._constant.POPUP_V_GAP,
                        left: this._constant.POPUP_H_GAP,
                        right: this._constant.POPUP_V_GAP,
                        bottom: 0
                    }]
                },
                stopPropagation: false,
                maxHeight: this._constant.MAX_HEIGHT,
                width: this._constant.MAX_WIDTH
            }
        });
        this.formulaInputCombo.on(BI.Combo.EVENT_AFTER_POPUPVIEW, function () {
            self.formulaPopup.setValue(self.input.getValue());
        });
        this.formulaPopup.on(BI.FormulaComboPopup.EVENT_CHANGE, function () {
            self.setValue(self.formulaPopup.getValue());
            self.formulaInputCombo.hideView();
            self.fireEvent(BI.FormulaCombo.EVENT_CHANGE);
        });
        this.formulaPopup.on(BI.FormulaComboPopup.EVENT_VALUE_CANCEL, function () {
            self.formulaInputCombo.hideView();
        });
    },

    setValue: function (v) {
        if (this.formulaInputCombo.isViewVisible()) {
            this.formulaInputCombo.hideView();
        }
        this.input.setValue(v);
        this.input.setText(BI.Func.getFormulaStringFromFormulaValue(v));
        this.formulaPopup.setValue(this.input.getValue());
    },

    getFormulaTargetIds: function() {
        return this.formulaPopup.getFormulaTargetIds();
    },

    getValue: function () {
        return this.input.getValue();
    }
});
BI.FormulaCombo.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.formula_combo", BI.FormulaCombo);/**
 * Created by GUY on 2016/4/25.
 *
 * @class BI.FormulaComboPopup
 * @extend BI.Widget
 */
BI.FormulaComboPopup = BI.inherit(BI.Widget, {

    _constant: {
        BUTTON_HEIGHT: 30,
        SOUTH_HEIGHT: 60,
        SOUTH_H_GAP: 10
    },

    _defaultConfig: function () {
        return BI.extend(BI.FormulaComboPopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-formula-pane-popup"
        })
    },

    _init: function () {
        BI.FormulaComboPopup.superclass._init.apply(this, arguments);
        this.populate();
    },

    populate: function () {
        var self = this, fieldItems = this.options.fieldItems;
        this.formula = BI.createWidget({
            type: "bi.formula_insert"
        });
        this.formula.populate(fieldItems);
        var confirmButton = BI.createWidget({
            type: "bi.button",
            level: "common",
            height: this._constant.BUTTON_HEIGHT,
            text: BI.i18nText("BI-Basic_OK")
        });
        var cancelButton = BI.createWidget({
            type: "bi.button",
            level: "ignore",
            height: this._constant.BUTTON_HEIGHT,
            text: BI.i18nText("BI-Basic_Cancel")
        });

        this.formula.on(BI.FormulaInsert.EVENT_CHANGE, function () {
            confirmButton.setEnable(self.formula.checkValidation());
        });
        confirmButton.on(BI.Button.EVENT_CHANGE, function () {
            self.fireEvent(BI.FormulaComboPopup.EVENT_CHANGE);
        });
        cancelButton.on(BI.Button.EVENT_CHANGE, function () {
            self.setValue(self.oldValue);
            self.fireEvent(BI.FormulaComboPopup.EVENT_VALUE_CANCEL);
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: this.formula,
                height: "fill"
            }, {
                el: {
                    type: "bi.right_vertical_adapt",
                    height: this._constant.SOUTH_HEIGHT,
                    items: [cancelButton, confirmButton],
                    hgap: this._constant.SOUTH_H_GAP
                },
                height: this._constant.SOUTH_HEIGHT
            }]
        })
    },

    getFormulaTargetIds: function(){
        return this.formula.getUsedFields();
    },

    getValue: function () {
        return this.formula.getValue();
    },

    setValue: function (v) {
        this.oldValue = v;
        this.formula.setValue(v);
    }
});
BI.FormulaComboPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.FormulaComboPopup.EVENT_VALUE_CANCEL = "EVENT_VALUE_CANCEL";
$.shortcut("bi.formula_combo_popup", BI.FormulaComboPopup);/**
 * Created by GUY on 2016/4/25.
 *
 * @class BI.FormulaComboTrigger
 * @extend BI.Widget
 */
BI.FormulaComboTrigger = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.FormulaComboTrigger.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-formula-combo-trigger",
            height: 30,
            items: []
        })
    },

    _init: function () {
        BI.FormulaComboTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.label = BI.createWidget({
            type: "bi.label",
            element: this,
            textAlign: "left",
            textHeight: this.options.height,
            lgap: 10
        });
    },

    _getTextFromFormulaValue: function (formulaValue) {
        var self = this;
        var formulaString = "";
        var regx = /\$[\{][^\}]*[\}]|\w*\w|\$\{[^\$\(\)\+\-\*\/)\$,]*\w\}|\$\{[^\$\(\)\+\-\*\/]*\w\}|\$\{[^\$\(\)\+\-\*\/]*[\u4e00-\u9fa5]\}|\w|(.)/g;
        var result = formulaValue.match(regx);
        BI.each(result, function (i, item) {
            var fieldRegx = /\$[\{][^\}]*[\}]/;
            var str = item.match(fieldRegx);
            if (BI.isNotEmptyArray(str)) {
                var id = str[0].substring(2, item.length - 1);
                var item = BI.find(self.options.items, function (i, item) {
                    return id === item.value;
                });
                formulaString = formulaString + item.text;
            } else {
                formulaString = formulaString + item;
            }
        });
        return formulaString;
    },

    getValue: function () {
        return this.options.value;
    },

    setValue: function (v) {
        this.options.value = v;
        this.label.setText(this._getTextFromFormulaValue(v));
    }
});
$.shortcut("bi.formula_combo_trigger", BI.FormulaComboTrigger);/**
 * Created by GUY on 2016/2/2.
 *
 * @class BI.IconCombo
 * @extend BI.Widget
 */
BI.IconCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.IconCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-icon-combo",
            width: 24,
            height: 24,
            iconClass: "",
            el: {},
            popup: {},
            minWidth: 100,
            maxWidth: 'auto',
            maxHeight: 300,
            direction: "bottom",
            adjustLength: 3,//调整的距离
            adjustXOffset: 0,
            adjustYOffset: 0,
            offsetStyle: "left",
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE
        })
    },

    _init: function () {
        BI.IconCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget(o.el, {
            type: "bi.icon_combo_trigger",
            iconClass: o.iconClass,
            title: o.title,
            items: o.items,
            width: o.width,
            height: o.height,
            iconWidth: o.iconWidth,
            iconHeight: o.iconHeight
        });
        this.popup = BI.createWidget(o.popup, {
            type: "bi.icon_combo_popup",
            chooseType: o.chooseType,
            items: o.items
        });
        this.popup.on(BI.IconComboPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.iconCombo.hideView();
            self.fireEvent(BI.IconCombo.EVENT_CHANGE);
        });
        this.popup.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.iconCombo = BI.createWidget({
            type: "bi.combo",
            element: this,
            direction: o.direction,
            adjustLength: o.adjustLength,
            adjustXOffset: o.adjustXOffset,
            adjustYOffset: o.adjustYOffset,
            offsetStyle: o.offsetStyle,
            el: this.trigger,
            popup: {
                el: this.popup,
                maxWidth: o.maxWidth,
                maxHeight: o.maxHeight,
                minWidth: o.minWidth
            }
        });
    },

    showView: function () {
        this.iconCombo.showView();
    },

    hideView: function () {
        this.iconCombo.hideView();
    },

    setValue: function (v) {
        this.iconCombo.setValue(v);
    },

    setEnable: function (v) {
        BI.IconCombo.superclass.setEnable.apply(this, arguments);
        this.iconCombo.setEnable(v);
    },

    getValue: function () {
        return this.iconCombo.getValue();
    },

    populate: function (items) {
        this.options.items = items;
        this.iconCombo.populate(items);
    }
});
BI.IconCombo.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.icon_combo", BI.IconCombo);/**
 * Created by GUY on 2016/2/2.
 *
 * @class BI.IconComboPopup
 * @extend BI.Pane
 */
BI.IconComboPopup = BI.inherit(BI.Pane, {
    _defaultConfig: function () {
        return BI.extend(BI.IconComboPopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi.icon-combo-popup",
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE
        });
    },

    _init: function () {
        BI.IconComboPopup.superclass._init.apply(this, arguments);
        var o = this.options, self = this;
        this.popup = BI.createWidget({
            type: "bi.button_group",
            items: BI.createItems(o.items, {
                type: "bi.single_select_icon_text_item",
                height: 30
            }),
            chooseType: o.chooseType,
            layouts: [{
                type: "bi.vertical"
            }]
        });

        this.popup.on(BI.Controller.EVENT_CHANGE, function (type, val, obj) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.IconComboPopup.EVENT_CHANGE, val, obj);
            }
        });

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [this.popup]
        });
    },

    populate: function (items) {
        BI.IconComboPopup.superclass.populate.apply(this, arguments);
        items = BI.createItems(items, {
            type: "bi.single_select_icon_text_item",
            height: 30
        });
        this.popup.populate(items);
    },

    getValue: function () {
        return this.popup.getValue();
    },

    setValue: function (v) {
        this.popup.setValue(v);
    }

});
BI.IconComboPopup.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.icon_combo_popup", BI.IconComboPopup);/**
 * Created by GUY on 2016/2/2.
 *
 * @class BI.IconComboTrigger
 * @extend BI.Widget
 */
BI.IconComboTrigger = BI.inherit(BI.Trigger, {
    _defaultConfig: function () {
        return BI.extend(BI.IconComboTrigger.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-icon-combo-trigger",
            el: {},
            items: [],
            iconClass: "",
            width: 25,
            height: 25,
            isShowDown: true
        });
    },

    _init: function () {
        BI.IconComboTrigger.superclass._init.apply(this, arguments);
        var o = this.options, self = this;
        this.button = BI.createWidget(o.el, {
            type: "bi.icon_change_button",
            cls: "icon-combo-trigger-icon " + o.iconClass,
            disableSelected: true,
            width: o.width,
            height: o.height,
            iconWidth: o.iconWidth,
            iconHeight: o.iconHeight
        });
        this.down = BI.createWidget({
            type: "bi.icon_button",
            disableSelected: true,
            cls: "icon-combo-down-icon trigger-triangle-font",
            width: 12,
            height: 8
        });
        this.down.setVisible(o.isShowDown);
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.button,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }, {
                el: this.down,
                right: 0,
                bottom: 0
            }]
        });
        if (BI.isKey(o.value)) {
            this.setValue(o.value);
        }
    },

    populate: function (items) {
        var o = this.options;
        this.options.items = items || [];
        this.button.setIcon(o.iconClass);
        this.button.setSelected(false);
        this.down.setSelected(false);
    },

    setValue: function (v) {
        BI.IconComboTrigger.superclass.setValue.apply(this, arguments);
        var o = this.options;
        var iconClass = "";
        v = BI.isArray(v) ? v[0] : v;
        if (BI.any(this.options.items, function (i, item) {
                if (v === item.value) {
                    iconClass = item.iconClass;
                    return true;
                }
            })) {
            this.button.setIcon(iconClass);
            this.button.setSelected(true);
            this.down.setSelected(true);
        } else {
            this.button.setIcon(o.iconClass);
            this.button.setSelected(false);
            this.down.setSelected(false);
        }
    }
});
BI.IconComboTrigger.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.icon_combo_trigger", BI.IconComboTrigger);/**
 * 单选combo
 *
 * @class BI.StaticCombo
 * @extend BI.Widget
 */
BI.StaticCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.StaticCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-static-combo",
            height: 30,
            text: "",
            el: {},
            items: [],
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE
        })
    },

    _init: function () {
        BI.StaticCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget(o.el, {
            type: "bi.text_icon_item",
            cls: "bi-select-text-trigger pull-down-font",
            text: o.text,
            readonly: true,
            textLgap: 5,
            height: o.height - 2
        });
        this.popup = BI.createWidget({
            type: "bi.text_value_combo_popup",
            textAlign: o.textAlign,
            chooseType: o.chooseType,
            items: o.items
        });
        this.popup.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.popup.on(BI.TextValueComboPopup.EVENT_CHANGE, function () {
            self.combo.hideView();
            self.fireEvent(BI.StaticCombo.EVENT_CHANGE, arguments);
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
    },

    populate: function (items) {
        this.combo.populate(items);
    },

    setValue: function (v) {
        this.combo.setValue(v);
    },

    getValue: function () {
        return this.combo.getValue();
    }
});
BI.StaticCombo.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.static_combo", BI.StaticCombo);/**
 * @class BI.TextValueCheckCombo
 * @extend BI.Widget
 * combo : text + icon, popup : check + text
 */
BI.TextValueCheckCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.TextValueCheckCombo.superclass._defaultConfig.apply(this, arguments), {
            baseClass: "bi-text-value-check-combo",
            width: 100,
            height: 30,
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
            text: ""
        })
    },

    _init: function () {
        BI.TextValueCheckCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.select_text_trigger",
            items: o.items,
            height: o.height,
            text: o.text
        });
        this.popup = BI.createWidget({
            type: "bi.text_value_check_combo_popup",
            chooseType: o.chooseType,
            items: o.items
        });
        this.popup.on(BI.TextValueCheckComboPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.textIconCheckCombo.hideView();
            self.fireEvent(BI.TextValueCheckCombo.EVENT_CHANGE);
        });
        this.popup.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.textIconCheckCombo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: {
                el: this.popup,
                maxHeight: 300
            }
        });
    },

    setTitle: function (title) {
        this.trigger.setTitle(title);
    },

    setValue: function (v) {
        this.textIconCheckCombo.setValue(v);
    },

    setEnable: function (v) {
        BI.TextValueCheckCombo.superclass.setEnable.apply(this, arguments);
        this.textIconCheckCombo.setEnable(v);
    },

    setWarningTitle: function (title) {
        this.trigger.setWarningTitle(title);
    },

    getValue: function () {
        return this.textIconCheckCombo.getValue();
    },

    populate: function (items) {
        this.options.items = items;
        this.textIconCheckCombo.populate(items);
    }
});
BI.TextValueCheckCombo.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.text_value_check_combo", BI.TextValueCheckCombo);/**
 * @class BI.SmallTextValueCheckCombo
 * @extend BI.Widget
 * combo : text + icon, popup : check + text
 */
BI.SmallTextValueCheckCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SmallTextValueCheckCombo.superclass._defaultConfig.apply(this, arguments), {
            width: 100,
            height: 24,
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
            text: ""
        })
    },

    _init: function () {
        BI.SmallTextValueCheckCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.small_select_text_trigger",
            items: o.items,
            height: o.height,
            text: o.text
        });
        this.popup = BI.createWidget({
            type: "bi.text_value_check_combo_popup",
            chooseType: o.chooseType,
            items: o.items
        });
        this.popup.on(BI.TextValueCheckComboPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.SmallTextIconCheckCombo.hideView();
            self.fireEvent(BI.SmallTextValueCheckCombo.EVENT_CHANGE);
        });
        this.popup.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.SmallTextIconCheckCombo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: {
                el: this.popup,
                maxHeight: 300
            }
        });
    },

    setValue: function (v) {
        this.SmallTextIconCheckCombo.setValue(v);
    },

    setEnable: function (v) {
        BI.SmallTextValueCheckCombo.superclass.setEnable.apply(this, arguments);
        this.SmallTextIconCheckCombo.setEnable(v);
    },

    getValue: function () {
        return this.SmallTextIconCheckCombo.getValue();
    },

    populate: function (items) {
        this.options.items = items;
        this.SmallTextIconCheckCombo.populate(items);
    }
});
BI.SmallTextValueCheckCombo.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.small_text_value_check_combo", BI.SmallTextValueCheckCombo);BI.TextValueCheckComboPopup = BI.inherit(BI.Pane, {
    _defaultConfig: function () {
        return BI.extend(BI.TextValueCheckComboPopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-text-icon-popup",
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE
        });
    },

    _init: function () {
        BI.TextValueCheckComboPopup.superclass._init.apply(this, arguments);
        var o = this.options, self = this;
        this.popup = BI.createWidget({
            type: "bi.button_group",
            items: this._formatItems(o.items),
            chooseType: o.chooseType,
            layouts: [{
                type: "bi.vertical"
            }]
        });

        this.popup.on(BI.Controller.EVENT_CHANGE, function (type, val, obj) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.TextValueCheckComboPopup.EVENT_CHANGE, val, obj);
            }
        });

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [this.popup]
        });
    },

    _formatItems: function (items) {
        return BI.map(items, function (i, item) {
            return BI.extend({
                type: "bi.icon_text_item",
                cls: "item-check-font bi-list-item",
                height: 30
            }, item);
        });
    },

    populate: function (items) {
        BI.TextValueCheckComboPopup.superclass.populate.apply(this, arguments);
        this.popup.populate(this._formatItems(items));
    },

    getValue: function () {
        return this.popup.getValue();
    },

    setValue: function (v) {
        this.popup.setValue(v);
    }

});
BI.TextValueCheckComboPopup.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.text_value_check_combo_popup", BI.TextValueCheckComboPopup);/**
 * @class BI.TextValueCombo
 * @extend BI.Widget
 * combo : text + icon, popup : text
 * 参见场景dashboard布局方式选择
 */
BI.TextValueCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.TextValueCombo.superclass._defaultConfig.apply(this, arguments), {
            baseClass: "bi-text-value-combo",
            height: 30,
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
            text: "",
            el: {}
        })
    },

    _init: function () {
        BI.TextValueCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget(o.el, {
            type: "bi.select_text_trigger",
            items: o.items,
            height: o.height,
            text: o.text
        });
        this.popup = BI.createWidget({
            type: "bi.text_value_combo_popup",
            chooseType: o.chooseType,
            items: o.items
        });
        this.popup.on(BI.TextValueComboPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.textIconCombo.hideView();
            self.fireEvent(BI.TextValueCombo.EVENT_CHANGE, arguments);
        });
        this.popup.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.textIconCombo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: {
                el: this.popup,
                maxHeight: 300
            }
        });
    },

    setValue: function (v) {
        this.textIconCombo.setValue(v);
    },

    setEnable: function (v) {
        BI.TextValueCombo.superclass.setEnable.apply(this, arguments);
        this.textIconCombo.setEnable(v);
    },

    getValue: function () {
        return this.textIconCombo.getValue();
    },

    populate: function (items) {
        this.options.items = items;
        this.textIconCombo.populate(items);
    }
});
BI.TextValueCombo.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.text_value_combo", BI.TextValueCombo);/**
 * @class BI.SmallTextValueCombo
 * @extend BI.Widget
 * combo : text + icon, popup : text
 * 参见场景dashboard布局方式选择
 */
BI.SmallTextValueCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SmallTextValueCombo.superclass._defaultConfig.apply(this, arguments), {
            width: 100,
            height: 24,
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
            el: {},
            text: ""
        })
    },

    _init: function () {
        BI.SmallTextValueCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget(o.el, {
            type: "bi.small_select_text_trigger",
            items: o.items,
            height: o.height,
            text: o.text
        });
        this.popup = BI.createWidget({
            type: "bi.text_value_combo_popup",
            chooseType: o.chooseType,
            items: o.items
        });
        this.popup.on(BI.TextValueComboPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.SmallTextValueCombo.hideView();
            self.fireEvent(BI.SmallTextValueCombo.EVENT_CHANGE);
        });
        this.popup.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.SmallTextValueCombo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: {
                el: this.popup,
                maxHeight: 300
            }
        });
    },

    setValue: function (v) {
        this.SmallTextValueCombo.setValue(v);
    },

    setEnable: function (v) {
        BI.SmallTextValueCombo.superclass.setEnable.apply(this, arguments);
        this.SmallTextValueCombo.setEnable(v);
    },

    getValue: function () {
        return this.SmallTextValueCombo.getValue();
    },

    populate: function (items) {
        this.options.items = items;
        this.SmallTextValueCombo.populate(items);
    }
});
BI.SmallTextValueCombo.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.small_text_value_combo", BI.SmallTextValueCombo);BI.TextValueComboPopup = BI.inherit(BI.Pane, {
    _defaultConfig: function () {
        return BI.extend(BI.TextValueComboPopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-text-icon-popup",
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE
        });
    },

    _init: function () {
        BI.TextValueComboPopup.superclass._init.apply(this, arguments);
        var o = this.options, self = this;
        this.popup = BI.createWidget({
            type: "bi.button_group",
            items: BI.createItems(o.items, {
                type: "bi.single_select_item",
                textAlign: o.textAlign,
                height: 30
            }),
            chooseType: o.chooseType,
            layouts: [{
                type: "bi.vertical"
            }]
        });

        this.popup.on(BI.Controller.EVENT_CHANGE, function (type, val, obj) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.TextValueComboPopup.EVENT_CHANGE, val, obj);
            }
        });

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [this.popup]
        });
    },

    populate: function (items) {
        BI.TextValueComboPopup.superclass.populate.apply(this, arguments);
        items = BI.createItems(items, {
            type: "bi.single_select_item",
            height: 30
        });
        this.popup.populate(items);
    },

    getValue: function () {
        return this.popup.getValue();
    },

    setValue: function (v) {
        this.popup.setValue(v);
    }

});
BI.TextValueComboPopup.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.text_value_combo_popup", BI.TextValueComboPopup);/**
 * @class BI.TextValueDownListCombo
 * @extend BI.Widget
 */
BI.TextValueDownListCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.TextValueDownListCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-text-value-down-list-combo",
            height: 30,
            text: ""
        })
    },

    _init: function () {
        BI.TextValueDownListCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this._createValueMap();

        this.trigger = BI.createWidget({
            type: "bi.down_list_select_text_trigger",
            height: o.height,
            items: o.items
        });

        this.combo = BI.createWidget({
            type: "bi.down_list_combo",
            element: this,
            chooseType: BI.Selection.Single,
            adjustLength: 2,
            height: o.height,
            el: this.trigger,
            items: BI.deepClone(o.items)
        });

        this.combo.on(BI.DownListCombo.EVENT_CHANGE, function () {
            self.setValue(self.combo.getValue()[0].value);
            self.fireEvent(BI.TextValueDownListCombo.EVENT_CHANGE);
        });

        this.combo.on(BI.DownListCombo.EVENT_SON_VALUE_CHANGE, function () {
            self.setValue(self.combo.getValue()[0].childValue);
            self.fireEvent(BI.TextValueDownListCombo.EVENT_CHANGE);
        });
    },

    _createValueMap: function () {
        var self = this;
        this.valueMap = {};
        BI.each(BI.flatten(this.options.items), function (idx, item) {
            if (BI.has(item, "el")) {
                BI.each(item.children, function (id, it) {
                    self.valueMap[it.value] = {value: item.el.value, childValue: it.value}
                });
            } else {
                self.valueMap[item.value] = {value: item.value};
            }
        });
    },

    setValue: function (v) {
        v = this.valueMap[v];
        this.combo.setValue([v]);
        this.trigger.setValue(v.childValue || v.value);
    },

    setEnable: function (v) {
        BI.TextValueDownListCombo.superclass.setEnable.apply(this, arguments);
        this.combo.setEnable(v);
    },

    getValue: function () {
        var v = this.combo.getValue()[0];
        return [v.childValue || v.value];
    },

    populate: function (items) {
        this.options.items = BI.flatten(items);
        this.combo.populate(items);
        this._createValueMap();
    }
});
BI.TextValueDownListCombo.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.text_value_down_list_combo", BI.TextValueDownListCombo);/**
 * 选择字段trigger, downlist专用
 * 显示形式为 父亲值(儿子值)
 *
 * @class BI.DownListSelectTextTrigger
 * @extends BI.Trigger
 */
BI.DownListSelectTextTrigger = BI.inherit(BI.Trigger, {

    _defaultConfig: function () {
        return BI.extend(BI.DownListSelectTextTrigger.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-down-list-select-text-trigger",
            height: 24,
            text: ""
        });
    },

    _init: function () {
        BI.DownListSelectTextTrigger.superclass._init.apply(this, arguments);
        var o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.select_text_trigger",
            element: this,
            height: o.height,
            items: this._formatItemArray(o.items),
            text: o.text
        });
    },

    _formatItemArray: function(){
        var sourceArray = BI.flatten(BI.deepClone(this.options.items));
        var targetArray = [];
        BI.each(sourceArray, function(idx, item){
            if(BI.has(item, "el")){
                BI.each(item.children, function(id, it){
                    it.text = item.el.text + "(" + it.text + ")";
                });
                targetArray = BI.concat(targetArray, item.children);
            }else{
                targetArray.push(item);
            }
        });
        return targetArray;
    },

    setValue: function (vals) {
        this.trigger.setValue(vals);
    },

    populate: function (items) {
        this.trigger.populate(this._formatItemArray(items));
    }
});
$.shortcut("bi.down_list_select_text_trigger", BI.DownListSelectTextTrigger);/**
 * 根据内容自适应长度的输入框
 * @class BI.AdaptiveEditor
 * @extends BI.Single
 */
BI.AdaptiveEditor = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.AdaptiveEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-adapt-editor",
            hgap: 4,
            vgap: 2,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn,
            mouseOut: false,
            allowBlank: true,
            watermark: "",
            errorText: "",
            height: 30
        })
    },

    _init: function () {
        BI.AdaptiveEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            element: this,
            height: o.height,
            hgap: o.hgap,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            value: o.value,
            validationChecker: o.validationChecker,
            quitChecker: o.quitChecker,
            mouseOut: o.mouseOut,
            allowBlank: o.allowBlank,
            watermark: o.watermark,
            errorText: o.errorText
        });

        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.SignEditor.EVENT_FOCUS, function () {
            self.fireEvent(BI.AdaptiveEditor.EVENT_FOCUS);
        });
        this.editor.on(BI.SignEditor.EVENT_BLUR, function () {
            self.fireEvent(BI.AdaptiveEditor.EVENT_BLUR);
        });
        this.editor.on(BI.SignEditor.EVENT_CLICK, function () {
            self.fireEvent(BI.AdaptiveEditor.EVENT_CLICK);
        });
        this.editor.on(BI.SignEditor.EVENT_CHANGE, function () {
            self._checkEditorLength();
            self.fireEvent(BI.AdaptiveEditor.EVENT_CHANGE);
        });
        this.editor.on(BI.SignEditor.EVENT_KEY_DOWN, function (v) {
            self.fireEvent(BI.AdaptiveEditor.EVENT_KEY_DOWN);
        });

        this.editor.on(BI.SignEditor.EVENT_VALID, function () {
            self.fireEvent(BI.AdaptiveEditor.EVENT_VALID);
        });
        this.editor.on(BI.SignEditor.EVENT_CONFIRM, function () {
            self.fireEvent(BI.AdaptiveEditor.EVENT_CONFIRM);
        });
        this.editor.on(BI.SignEditor.EVENT_START, function () {
            self.fireEvent(BI.AdaptiveEditor.EVENT_START);
        });
        this.editor.on(BI.SignEditor.EVENT_PAUSE, function () {
            self.fireEvent(BI.AdaptiveEditor.EVENT_PAUSE);
        });
        this.editor.on(BI.Editor.EVENT_STOP, function () {
            self.fireEvent(BI.AdaptiveEditor.EVENT_STOP);
        });
        this.editor.on(BI.SignEditor.EVENT_SPACE, function () {
            self.fireEvent(BI.AdaptiveEditor.EVENT_SPACE);
        });
        this.editor.on(BI.SignEditor.EVENT_ERROR, function () {
            self.fireEvent(BI.AdaptiveEditor.EVENT_ERROR);
        });
        this.editor.on(BI.SignEditor.EVENT_ENTER, function () {
            self.fireEvent(BI.AdaptiveEditor.EVENT_ENTER);
        });
        this.editor.on(BI.SignEditor.EVENT_RESTRICT, function () {
            self.fireEvent(BI.AdaptiveEditor.EVENT_RESTRICT);
        });
        this.editor.on(BI.SignEditor.EVENT_EMPTY, function () {
            self.fireEvent(BI.AdaptiveEditor.EVENT_EMPTY);
        });
        this._checkEditorLength();
    },

    _checkEditorLength: function () {
        var o = this.options;
        this.element.width(BI.DOM.getTextSizeWidth(this.getValue(), 14) + 2 * o.hgap + o.lgap + o.rgap);
    },

    focus: function () {
        this.editor.focus();
    },

    blur: function () {
        this.editor.blur();
    },

    isValid: function () {
        return this.editor.isValid();
    },

    setErrorText: function (text) {
        this.editor.setErrorText(text);
    },

    getErrorText: function () {
        return this.editor.getErrorText();
    },

    setValue: function (k) {
        this.editor.setValue(k);
        this._checkEditorLength();
    },

    getValue: function () {
        return this.editor.getValue();
    },

    getState: function () {
        return this.editor.getState();
    },

    setState: function (v) {

    }
});
BI.AdaptiveEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.AdaptiveEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.AdaptiveEditor.EVENT_BLUR = "EVENT_BLUR";
BI.AdaptiveEditor.EVENT_CLICK = "EVENT_CLICK";
BI.AdaptiveEditor.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.AdaptiveEditor.EVENT_CLICK_LABEL = "EVENT_CLICK_LABEL";

BI.AdaptiveEditor.EVENT_START = "EVENT_START";
BI.AdaptiveEditor.EVENT_PAUSE = "EVENT_PAUSE";
BI.AdaptiveEditor.EVENT_STOP = "EVENT_STOP";
BI.AdaptiveEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.AdaptiveEditor.EVENT_VALID = "EVENT_VALID";
BI.AdaptiveEditor.EVENT_ERROR = "EVENT_ERROR";
BI.AdaptiveEditor.EVENT_ENTER = "EVENT_ENTER";
BI.AdaptiveEditor.EVENT_RESTRICT = "EVENT_RESTRICT";
BI.AdaptiveEditor.EVENT_SPACE = "EVENT_SPACE";
BI.AdaptiveEditor.EVENT_EMPTY = "EVENT_EMPTY";

$.shortcut("bi.adapt_editor", BI.AdaptiveEditor);/**
 * 有清楚按钮的文本框
 * Created by GUY on 2015/9/29.
 * @class BI.SmallTextEditor
 * @extends BI.SearchEditor
 */
BI.ClearEditor = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.ClearEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-clear-editor",
            height: 30,
            errorText: "",
            watermark: "",
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn
        });
    },
    _init: function () {
        BI.ClearEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: "bi.editor",
            height: o.height,
            watermark: o.watermark,
            allowBlank: true,
            errorText: o.errorText,
            validationChecker: o.validationChecker,
            quitChecker: o.quitChecker
        });
        this.clear = BI.createWidget({
            type: "bi.icon_button",
            stopEvent: true,
            cls: "search-close-h-font"
        });
        this.clear.on(BI.IconButton.EVENT_CHANGE, function () {
            self.setValue("");
            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.STOPEDIT);
            self.fireEvent(BI.ClearEditor.EVENT_CLEAR);
        });
        BI.createWidget({
            element: this,
            type: "bi.htape",
            items: [
                {
                    el: this.editor
                },
                {
                    el: this.clear,
                    width: 25
                }]
        });
        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.editor.on(BI.Editor.EVENT_FOCUS, function () {
            self.fireEvent(BI.ClearEditor.EVENT_FOCUS);
        });
        this.editor.on(BI.Editor.EVENT_BLUR, function () {
            self.fireEvent(BI.ClearEditor.EVENT_BLUR);
        });
        this.editor.on(BI.Editor.EVENT_CLICK, function () {
            self.fireEvent(BI.ClearEditor.EVENT_CLICK);
        });
        this.editor.on(BI.Editor.EVENT_CHANGE, function () {
            self._checkClear();
            self.fireEvent(BI.ClearEditor.EVENT_CHANGE);
        });
        this.editor.on(BI.Editor.EVENT_KEY_DOWN, function (v) {
            self.fireEvent(BI.ClearEditor.EVENT_KEY_DOWN, v);
        });
        this.editor.on(BI.Editor.EVENT_SPACE, function () {
            self.fireEvent(BI.ClearEditor.EVENT_SPACE)
        });
        this.editor.on(BI.Editor.EVENT_BACKSPACE, function () {
            self.fireEvent(BI.ClearEditor.EVENT_BACKSPACE)
        });


        this.editor.on(BI.Editor.EVENT_VALID, function () {
            self.fireEvent(BI.ClearEditor.EVENT_VALID)
        });
        this.editor.on(BI.Editor.EVENT_ERROR, function () {
            self.fireEvent(BI.ClearEditor.EVENT_ERROR)
        });
        this.editor.on(BI.Editor.EVENT_ENTER, function () {
            self.fireEvent(BI.ClearEditor.EVENT_ENTER);
        });
        this.editor.on(BI.Editor.EVENT_RESTRICT, function () {
            self.fireEvent(BI.ClearEditor.EVENT_RESTRICT)
        });
        this.editor.on(BI.Editor.EVENT_EMPTY, function () {
            self._checkClear();
            self.fireEvent(BI.ClearEditor.EVENT_EMPTY)
        });
        this.editor.on(BI.Editor.EVENT_REMOVE, function () {
            self.fireEvent(BI.ClearEditor.EVENT_REMOVE)
        });
        this.editor.on(BI.Editor.EVENT_CONFIRM, function () {
            self.fireEvent(BI.ClearEditor.EVENT_CONFIRM)
        });
        this.editor.on(BI.Editor.EVENT_START, function () {
            self.fireEvent(BI.ClearEditor.EVENT_START);
        });
        this.editor.on(BI.Editor.EVENT_PAUSE, function () {
            self.fireEvent(BI.ClearEditor.EVENT_PAUSE);
        });
        this.editor.on(BI.Editor.EVENT_STOP, function () {
            self.fireEvent(BI.ClearEditor.EVENT_STOP);
        });

        this.clear.invisible();
    },

    _checkClear: function () {
        if (!this.getValue()) {
            this.clear.invisible();
        } else {
            this.clear.visible();
        }
    },

    focus: function () {
        this.editor.focus();
    },

    blur: function () {
        this.editor.blur();
    },

    getValue: function () {
        if (this.isValid()) {
            var res = this.editor.getValue().match(/[\S]+/g);
            return BI.isNull(res) ? "" : res[res.length - 1];
        }
    },

    setValue: function (v) {
        this.editor.setValue(v);
        if (BI.isKey(v)) {
            this.clear.visible();
        }
    },

    isValid: function () {
        return this.editor.isValid();
    }
});
BI.ClearEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.ClearEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.ClearEditor.EVENT_BLUR = "EVENT_BLUR";
BI.ClearEditor.EVENT_CLICK = "EVENT_CLICK";
BI.ClearEditor.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.ClearEditor.EVENT_SPACE = "EVENT_SPACE";
BI.ClearEditor.EVENT_BACKSPACE = "EVENT_BACKSPACE";
BI.ClearEditor.EVENT_CLEAR = "EVENT_CLEAR";

BI.ClearEditor.EVENT_START = "EVENT_START";
BI.ClearEditor.EVENT_PAUSE = "EVENT_PAUSE";
BI.ClearEditor.EVENT_STOP = "EVENT_STOP";
BI.ClearEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.ClearEditor.EVENT_VALID = "EVENT_VALID";
BI.ClearEditor.EVENT_ERROR = "EVENT_ERROR";
BI.ClearEditor.EVENT_ENTER = "EVENT_ENTER";
BI.ClearEditor.EVENT_RESTRICT = "EVENT_RESTRICT";
BI.ClearEditor.EVENT_REMOVE = "EVENT_REMOVE";
BI.ClearEditor.EVENT_EMPTY = "EVENT_EMPTY";
$.shortcut("bi.clear_editor", BI.ClearEditor);/**
 * Created by roy on 15/9/14.
 */
BI.SearchEditor = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.SearchEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-search-editor",
            height: 30,
            errorText: "",
            watermark: BI.i18nText("BI-Basic_Search"),
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn
        });
    },
    _init: function () {
        this.options.height -= 2;
        BI.SearchEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: "bi.editor",
            height: o.height,
            watermark: o.watermark,
            allowBlank: true,
            errorText: o.errorText,
            validationChecker: o.validationChecker,
            quitChecker: o.quitChecker
        });
        this.clear = BI.createWidget({
            type: "bi.icon_button",
            stopEvent: true,
            cls: "search-close-h-font"
        });
        this.clear.on(BI.IconButton.EVENT_CHANGE, function () {
            self.setValue("");
            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.STOPEDIT);
            self.fireEvent(BI.SearchEditor.EVENT_CLEAR);
        });
        BI.createWidget({
            element: this,
            type: "bi.htape",
            items: [
                {
                    el: {
                        type: "bi.center_adapt",
                        cls: "search-font",
                        items: [{
                            el: {
                                type: "bi.icon"
                            }
                        }]
                    },
                    width: 25
                },
                {
                    el: self.editor
                },
                {
                    el: this.clear,
                    width: 25
                }
            ]
        });
        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.editor.on(BI.Editor.EVENT_FOCUS, function () {
            self.fireEvent(BI.SearchEditor.EVENT_FOCUS);
        });
        this.editor.on(BI.Editor.EVENT_BLUR, function () {
            self.fireEvent(BI.SearchEditor.EVENT_BLUR);
        });
        this.editor.on(BI.Editor.EVENT_CLICK, function () {
            self.fireEvent(BI.SearchEditor.EVENT_CLICK);
        });
        this.editor.on(BI.Editor.EVENT_CHANGE, function () {
            self._checkClear();
            self.fireEvent(BI.SearchEditor.EVENT_CHANGE);
        });
        this.editor.on(BI.Editor.EVENT_KEY_DOWN, function (v) {
            self.fireEvent(BI.SearchEditor.EVENT_KEY_DOWN, v);
        });
        this.editor.on(BI.Editor.EVENT_SPACE, function () {
            self.fireEvent(BI.SearchEditor.EVENT_SPACE)
        });
        this.editor.on(BI.Editor.EVENT_BACKSPACE, function () {
            self.fireEvent(BI.SearchEditor.EVENT_BACKSPACE)
        });


        this.editor.on(BI.Editor.EVENT_VALID, function () {
            self.fireEvent(BI.SearchEditor.EVENT_VALID)
        });
        this.editor.on(BI.Editor.EVENT_ERROR, function () {
            self.fireEvent(BI.SearchEditor.EVENT_ERROR)
        });
        this.editor.on(BI.Editor.EVENT_ENTER, function () {
            self.fireEvent(BI.SearchEditor.EVENT_ENTER);
        });
        this.editor.on(BI.Editor.EVENT_RESTRICT, function () {
            self.fireEvent(BI.SearchEditor.EVENT_RESTRICT)
        });
        this.editor.on(BI.Editor.EVENT_EMPTY, function () {
            self._checkClear();
            self.fireEvent(BI.SearchEditor.EVENT_EMPTY)
        });
        this.editor.on(BI.Editor.EVENT_REMOVE, function () {
            self.fireEvent(BI.SearchEditor.EVENT_REMOVE)
        });
        this.editor.on(BI.Editor.EVENT_CONFIRM, function () {
            self.fireEvent(BI.SearchEditor.EVENT_CONFIRM)
        });
        this.editor.on(BI.Editor.EVENT_START, function () {
            self.fireEvent(BI.SearchEditor.EVENT_START);
        });
        this.editor.on(BI.Editor.EVENT_PAUSE, function () {
            self.fireEvent(BI.SearchEditor.EVENT_PAUSE);
        });
        this.editor.on(BI.Editor.EVENT_STOP, function () {
            self.fireEvent(BI.SearchEditor.EVENT_STOP);
        });

        this.clear.invisible();
    },

    _checkClear: function () {
        if (!this.getValue()) {
            this.clear.invisible();
        } else {
            this.clear.visible();
        }
    },

    focus: function () {
        this.editor.focus();
    },

    blur: function () {
        this.editor.blur();
    },

    getValue: function () {
        if (this.isValid()) {
            var res = this.editor.getValue().match(/[\S]+/g);
            return BI.isNull(res) ? "" : res[res.length - 1];
        }
    },

    getLastValidValue: function () {
        return this.editor.getLastValidValue();
    },

    setValue: function (v) {
        this.editor.setValue(v);
        if (BI.isKey(v)) {
            this.clear.visible();
        }
    },

    setValid: function (b) {
        this.editor.setValid(b);
    },

    isEditing: function () {
        return this.editor.isEditing();
    },

    isValid: function () {
        return this.editor.isValid();
    },

    setEnable: function (b) {
        BI.Editor.superclass.setEnable.apply(this, arguments);
        this.editor && this.editor.setEnable(b);
        this.clear.setEnabled(b);
    }
});
BI.SearchEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.SearchEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.SearchEditor.EVENT_BLUR = "EVENT_BLUR";
BI.SearchEditor.EVENT_CLICK = "EVENT_CLICK";
BI.SearchEditor.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.SearchEditor.EVENT_SPACE = "EVENT_SPACE";
BI.SearchEditor.EVENT_BACKSPACE = "EVENT_BACKSPACE";
BI.SearchEditor.EVENT_CLEAR = "EVENT_CLEAR";

BI.SearchEditor.EVENT_START = "EVENT_START";
BI.SearchEditor.EVENT_PAUSE = "EVENT_PAUSE";
BI.SearchEditor.EVENT_STOP = "EVENT_STOP";
BI.SearchEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.SearchEditor.EVENT_VALID = "EVENT_VALID";
BI.SearchEditor.EVENT_ERROR = "EVENT_ERROR";
BI.SearchEditor.EVENT_ENTER = "EVENT_ENTER";
BI.SearchEditor.EVENT_RESTRICT = "EVENT_RESTRICT";
BI.SearchEditor.EVENT_REMOVE = "EVENT_REMOVE";
BI.SearchEditor.EVENT_EMPTY = "EVENT_EMPTY";
$.shortcut("bi.search_editor", BI.SearchEditor);/**
 * 小号搜索框
 * Created by GUY on 2015/9/29.
 * @class BI.SmallSearchEditor
 * @extends BI.SearchEditor
 */
BI.SmallSearchEditor = BI.inherit(BI.SearchEditor, {
    _defaultConfig: function () {
        var conf = BI.SmallSearchEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-small-search-editor",
            height: 24
        });
    },

    _init: function () {
        BI.SmallSearchEditor.superclass._init.apply(this, arguments);
    }
});
$.shortcut("bi.small_search_editor", BI.SmallSearchEditor);/**
 * sign是新值（初始value值）形式的自适应宽度的输入框
 * @class BI.SignInitialEditor
 * @extends BI.Single
 */
BI.SignInitialEditor = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.SignInitialEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-sign-initial-editor",
            hgap: 4,
            vgap: 2,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn,
            mouseOut: false,
            allowBlank: true,
            watermark: "",
            errorText: "",
            value: "",
            text: "",
            height: 30
        })
    },

    _init: function () {
        BI.SignInitialEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            element: this,
            height: o.height,
            hgap: o.hgap,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            value: o.value || o.text,
            validationChecker: o.validationChecker,
            quitChecker: o.quitChecker,
            mouseOut: o.mouseOut,
            allowBlank: o.allowBlank,
            watermark: o.watermark,
            errorText: o.errorText
        });
        if(BI.isNotNull(o.value)){
            this.setState(o.value);
        }
        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.SignEditor.EVENT_FOCUS, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_FOCUS);
        });
        this.editor.on(BI.SignEditor.EVENT_BLUR, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_BLUR);
        });
        this.editor.on(BI.SignEditor.EVENT_CLICK, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_CLICK);
        });
        this.editor.on(BI.SignEditor.EVENT_CHANGE, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_CHANGE);
        });
        this.editor.on(BI.SignEditor.EVENT_KEY_DOWN, function (v) {
            self.fireEvent(BI.SignInitialEditor.EVENT_KEY_DOWN);
        });

        this.editor.on(BI.SignEditor.EVENT_VALID, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_VALID);
        });
        this.editor.on(BI.SignEditor.EVENT_CONFIRM, function () {
            self.setState(self.editor.getValue());
            self.fireEvent(BI.SignInitialEditor.EVENT_CONFIRM);
        });
        this.editor.on(BI.SignEditor.EVENT_START, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_START);
        });
        this.editor.on(BI.SignEditor.EVENT_PAUSE, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_PAUSE);
        });
        this.editor.on(BI.SignEditor.EVENT_STOP, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_STOP);
        });
        this.editor.on(BI.SignEditor.EVENT_SPACE, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_SPACE);
        });
        this.editor.on(BI.SignEditor.EVENT_ERROR, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_ERROR);
        });
        this.editor.on(BI.SignEditor.EVENT_ENTER, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_ENTER);
        });
        this.editor.on(BI.SignEditor.EVENT_RESTRICT, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_RESTRICT);
        });
        this.editor.on(BI.SignEditor.EVENT_EMPTY, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_EMPTY);
        });
    },

    focus: function () {
        this.editor.focus();
    },

    blur: function () {
        this.editor.blur();
    },

    isValid: function () {
        return this.editor.isValid();
    },

    setErrorText: function (text) {
        this.editor.setErrorText(text);
    },

    getErrorText: function () {
        return this.editor.getErrorText();
    },

    setValue: function (v) {
        this.editor.setValue(v.value);
        this.setState(v.value);
    },

    getValue: function () {
        return {
            value: this.editor.getValue(),
            text: this.options.text
        }
    },

    getState: function () {
        return this.editor.getState();
    },

    setState: function (v) {
        var o = this.options;
        v = (BI.isEmpty(v) || v == o.text) ? o.text : v + "(" + o.text + ")";
        this.editor.setState(v);
    }
});
BI.SignInitialEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.SignInitialEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.SignInitialEditor.EVENT_BLUR = "EVENT_BLUR";
BI.SignInitialEditor.EVENT_CLICK = "EVENT_CLICK";
BI.SignInitialEditor.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.SignInitialEditor.EVENT_CLICK_LABEL = "EVENT_CLICK_LABEL";

BI.SignInitialEditor.EVENT_START = "EVENT_START";
BI.SignInitialEditor.EVENT_PAUSE = "EVENT_PAUSE";
BI.SignInitialEditor.EVENT_STOP = "EVENT_STOP";
BI.SignInitialEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.SignInitialEditor.EVENT_VALID = "EVENT_VALID";
BI.SignInitialEditor.EVENT_ERROR = "EVENT_ERROR";
BI.SignInitialEditor.EVENT_ENTER = "EVENT_ENTER";
BI.SignInitialEditor.EVENT_RESTRICT = "EVENT_RESTRICT";
BI.SignInitialEditor.EVENT_SPACE = "EVENT_SPACE";
BI.SignInitialEditor.EVENT_EMPTY = "EVENT_EMPTY";

$.shortcut("bi.sign_initial_editor", BI.SignInitialEditor);/**
 * sign标签分两段，可以自定义样式
 * @class BI.SignStyleEditor
 * @extends BI.Single
 */
BI.SignStyleEditor = BI.inherit(BI.Single, {

    constants: {
        tipTextGap: 4
    },

    _defaultConfig: function () {
        var conf = BI.SignStyleEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-sign-style-editor",
            text: "",
            hgap: 4,
            vgap: 2,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn,
            mouseOut: false,
            allowBlank: false,
            watermark: "",
            errorText: "",
            height: 30
        })
    },

    _init: function () {
        BI.SignStyleEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: "bi.editor",
            height: o.height,
            hgap: o.hgap,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            value: o.value,
            validationChecker: o.validationChecker,
            quitChecker: o.quitChecker,
            mouseOut: o.mouseOut,
            allowBlank: o.allowBlank,
            watermark: o.watermark,
            errorText: o.errorText
        });
        this.text = BI.createWidget({
            type: "bi.text_button",
            cls: "sign-style-editor-text",
            textAlign: "left",
            height: o.height,
            hgap: 4,
            handler: function () {
                self._showInput();
                self.editor.focus();
                self.editor.selectAll();
            }
        });

        this.tipText = BI.createWidget({
            type: "bi.text_button",
            cls: "sign-style-editor-tip",
            textAlign: "right",
            rgap: 4,
            height: o.height,
            text: o.text,
            handler: function () {
                self._showInput();
                self.editor.focus();
                self.editor.selectAll();
            }
        });

        this.text.on(BI.TextButton.EVENT_CHANGE, function () {
            BI.nextTick(function () {
                self.fireEvent(BI.SignStyleEditor.EVENT_CLICK_LABEL)
            });
        });

        this.tipText.on(BI.TextButton.EVENT_CHANGE, function () {
            BI.nextTick(function () {
                self.fireEvent(BI.SignStyleEditor.EVENT_CLICK_LABEL)
            });
        });

        this.wrap = BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [this.text, this.tipText]
        });

        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_FOCUS, function () {
            self.fireEvent(BI.SignStyleEditor.EVENT_FOCUS);
        });
        this.editor.on(BI.Editor.EVENT_BLUR, function () {
            self.fireEvent(BI.SignStyleEditor.EVENT_BLUR);
        });
        this.editor.on(BI.Editor.EVENT_CLICK, function () {
            self.fireEvent(BI.SignStyleEditor.EVENT_CLICK);
        });
        this.editor.on(BI.Editor.EVENT_CHANGE, function () {
            self.fireEvent(BI.SignStyleEditor.EVENT_CHANGE);
        });
        this.editor.on(BI.Editor.EVENT_KEY_DOWN, function (v) {
            self.fireEvent(BI.SignStyleEditor.EVENT_KEY_DOWN);
        });

        this.editor.on(BI.Editor.EVENT_VALID, function () {
            self.fireEvent(BI.SignStyleEditor.EVENT_VALID);
        });
        this.editor.on(BI.Editor.EVENT_CONFIRM, function () {
            self._showHint();
            self._checkText();
            self._resizeLayout();
            self.fireEvent(BI.SignStyleEditor.EVENT_CONFIRM);
        });
        this.editor.on(BI.Editor.EVENT_START, function () {
            self.fireEvent(BI.SignStyleEditor.EVENT_START);
        });
        this.editor.on(BI.Editor.EVENT_PAUSE, function () {
            self.fireEvent(BI.SignStyleEditor.EVENT_PAUSE);
        });
        this.editor.on(BI.Editor.EVENT_STOP, function () {
            self.fireEvent(BI.SignStyleEditor.EVENT_STOP);
        });
        this.editor.on(BI.Editor.EVENT_SPACE, function () {
            self.fireEvent(BI.SignStyleEditor.EVENT_SPACE);
        });
        this.editor.on(BI.Editor.EVENT_ERROR, function () {
            self.fireEvent(BI.SignStyleEditor.EVENT_ERROR);
        });
        this.editor.on(BI.Editor.EVENT_ENTER, function () {
            self.fireEvent(BI.SignStyleEditor.EVENT_ENTER);
        });
        this.editor.on(BI.Editor.EVENT_RESTRICT, function () {
            self.fireEvent(BI.SignStyleEditor.EVENT_RESTRICT);
        });
        this.editor.on(BI.Editor.EVENT_EMPTY, function () {
            self.fireEvent(BI.SignStyleEditor.EVENT_EMPTY);
        });
        BI.createWidget({
            type: "bi.vertical",
            scrolly: false,
            element: this,
            items: [this.editor]
        });
        this._showHint();
        this._checkText();

        BI.nextTick(function () {
            var tipTextSize = self.text.element.getStyle("font-size");
            self.tipTextSize = tipTextSize.substring(0, tipTextSize.length - 2);
            self._resizeLayout();
        });
    },

    _checkText: function () {
        var o = this.options;
        if (this.editor.getValue() === "") {
            this.text.setValue(o.watermark || "");
            this.text.element.addClass("bi-water-mark");
        } else {
            this.text.setValue(this.editor.getValue());
            this.tipText.setValue("(" + o.text + ")");
            this.text.element.removeClass("bi-water-mark");
        }
        this.setTitle(this.text.getValue() + this.tipText.getValue());
    },

    _showInput: function () {
        this.editor.setVisible(true);
        this.text.setVisible(false);
        this.tipText.setVisible(false);
    },

    _showHint: function () {
        this.editor.setVisible(false);
        this.text.setVisible(true);
        this.tipText.setVisible(true);
    },

    _resizeLayout: function () {
        this.wrap.attr("items")[0].width = BI.DOM.getTextSizeWidth(this.text.getValue(), this.tipTextSize) + 2 * this.constants.tipTextGap;
        this.wrap.resize();
    },

    focus: function () {
        this._showInput();
        this.editor.focus();
    },

    blur: function () {
        this.editor.blur();
        this._showHint();
        this._checkText();
    },

    isValid: function () {
        return this.editor.isValid();
    },

    setErrorText: function (text) {
        this.editor.setErrorText(text);
    },

    getErrorText: function () {
        return this.editor.getErrorText();
    },

    setValue: function (k) {
        BI.SignStyleEditor.superclass.setValue.apply(this, arguments);
        this.editor.setValue(k);
        this._checkText();
        this._resizeLayout();
    },

    getValue: function () {
        return this.editor.getValue();
    },

    getState: function () {
        return this.options.text;
    },

    setState: function (v) {
        var o = this.options;
        o.text = v;
        this._showHint();
        this.tipText.setValue("(" + v + ")");
        this._checkText();
    }
});
BI.SignStyleEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.SignStyleEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.SignStyleEditor.EVENT_BLUR = "EVENT_BLUR";
BI.SignStyleEditor.EVENT_CLICK = "EVENT_CLICK";
BI.SignStyleEditor.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.SignStyleEditor.EVENT_CLICK_LABEL = "EVENT_CLICK_LABEL";

BI.SignStyleEditor.EVENT_START = "EVENT_START";
BI.SignStyleEditor.EVENT_PAUSE = "EVENT_PAUSE";
BI.SignStyleEditor.EVENT_STOP = "EVENT_STOP";
BI.SignStyleEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.SignStyleEditor.EVENT_VALID = "EVENT_VALID";
BI.SignStyleEditor.EVENT_ERROR = "EVENT_ERROR";
BI.SignStyleEditor.EVENT_ENTER = "EVENT_ENTER";
BI.SignStyleEditor.EVENT_RESTRICT = "EVENT_RESTRICT";
BI.SignStyleEditor.EVENT_SPACE = "EVENT_SPACE";
BI.SignStyleEditor.EVENT_EMPTY = "EVENT_EMPTY";

$.shortcut("bi.sign_style_editor", BI.SignStyleEditor);/**
 * guy
 * @class BI.TextEditor
 * @extends BI.Single
 */
BI.TextEditor = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.TextEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            extraCls: "bi-text-editor",
            hgap: 4,
            vgap: 2,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn,
            mouseOut: false,
            allowBlank: false,
            watermark: "",
            errorText: "",
            height: 30
        })
    },

    _init: function () {
        BI.TextEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        if (BI.isNumber(o.height)) {
            this.element.css({height: o.height - 2});
        }
        if (BI.isNumber(o.width)) {
            this.element.css({width: o.width - 2});
        }
        this.editor = BI.createWidget({
            type: "bi.editor",
            height: o.height - 2,
            hgap: o.hgap,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            value: o.value,
            validationChecker: o.validationChecker,
            quitChecker: o.quitChecker,
            mouseOut: o.mouseOut,
            allowBlank: o.allowBlank,
            watermark: o.watermark,
            errorText: o.errorText
        });
        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.editor.on(BI.Editor.EVENT_FOCUS, function () {
            self.fireEvent(BI.TextEditor.EVENT_FOCUS);
        });
        this.editor.on(BI.Editor.EVENT_BLUR, function () {
            self.fireEvent(BI.TextEditor.EVENT_BLUR);
        });
        this.editor.on(BI.Editor.EVENT_CLICK, function () {
            self.fireEvent(BI.TextEditor.EVENT_CLICK);
        });
        this.editor.on(BI.Editor.EVENT_CHANGE, function () {
            self.fireEvent(BI.TextEditor.EVENT_CHANGE);
        });
        this.editor.on(BI.Editor.EVENT_KEY_DOWN, function (v) {
            self.fireEvent(BI.TextEditor.EVENT_KEY_DOWN);
        });
        this.editor.on(BI.Editor.EVENT_SPACE, function (v) {
            self.fireEvent(BI.TextEditor.EVENT_SPACE);
        });
        this.editor.on(BI.Editor.EVENT_BACKSPACE, function (v) {
            self.fireEvent(BI.TextEditor.EVENT_BACKSPACE);
        });


        this.editor.on(BI.Editor.EVENT_VALID, function () {
            self.fireEvent(BI.TextEditor.EVENT_VALID);
        });
        this.editor.on(BI.Editor.EVENT_CONFIRM, function () {
            self.fireEvent(BI.TextEditor.EVENT_CONFIRM);
        });
        this.editor.on(BI.Editor.EVENT_REMOVE, function (v) {
            self.fireEvent(BI.TextEditor.EVENT_REMOVE);
        });
        this.editor.on(BI.Editor.EVENT_START, function () {
            self.fireEvent(BI.TextEditor.EVENT_START);
        });
        this.editor.on(BI.Editor.EVENT_PAUSE, function () {
            self.fireEvent(BI.TextEditor.EVENT_PAUSE);
        });
        this.editor.on(BI.Editor.EVENT_STOP, function () {
            self.fireEvent(BI.TextEditor.EVENT_STOP);
        });
        this.editor.on(BI.Editor.EVENT_ERROR, function () {
            self.fireEvent(BI.TextEditor.EVENT_ERROR);
        });
        this.editor.on(BI.Editor.EVENT_ENTER, function () {
            self.fireEvent(BI.TextEditor.EVENT_ENTER);
        });
        this.editor.on(BI.Editor.EVENT_RESTRICT, function () {
            self.fireEvent(BI.TextEditor.EVENT_RESTRICT);
        });
        this.editor.on(BI.Editor.EVENT_EMPTY, function () {
            self.fireEvent(BI.TextEditor.EVENT_EMPTY);
        });
        BI.createWidget({
            type: "bi.vertical",
            scrolly: false,
            element: this,
            items: [this.editor]
        });
    },

    focus: function () {
        this.editor.focus();
    },

    blur: function () {
        this.editor.blur();
    },

    setErrorText: function (text) {
        this.editor.setErrorText(text);
    },

    getErrorText: function () {
        return this.editor.getErrorText();
    },

    isValid: function () {
        return this.editor.isValid();
    },

    setValue: function (v) {
        this.editor.setValue(v);
    },

    getValue: function () {
        return this.editor.getValue();
    },

    setEnable: function (b) {
        BI.Editor.superclass.setEnable.apply(this, arguments);
        this.editor && this.editor.setEnable(b);
    }
});
BI.TextEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.TextEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.TextEditor.EVENT_BLUR = "EVENT_BLUR";
BI.TextEditor.EVENT_CLICK = "EVENT_CLICK";
BI.TextEditor.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.TextEditor.EVENT_SPACE = "EVENT_SPACE";
BI.TextEditor.EVENT_BACKSPACE = "EVENT_BACKSPACE";

BI.TextEditor.EVENT_START = "EVENT_START";
BI.TextEditor.EVENT_PAUSE = "EVENT_PAUSE";
BI.TextEditor.EVENT_STOP = "EVENT_STOP";
BI.TextEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.TextEditor.EVENT_VALID = "EVENT_VALID";
BI.TextEditor.EVENT_ERROR = "EVENT_ERROR";
BI.TextEditor.EVENT_ENTER = "EVENT_ENTER";
BI.TextEditor.EVENT_RESTRICT = "EVENT_RESTRICT";
BI.TextEditor.EVENT_REMOVE = "EVENT_REMOVE";
BI.TextEditor.EVENT_EMPTY = "EVENT_EMPTY";

$.shortcut("bi.text_editor", BI.TextEditor);/**
 * 小号搜索框
 * Created by GUY on 2015/9/29.
 * @class BI.SmallTextEditor
 * @extends BI.SearchEditor
 */
BI.SmallTextEditor = BI.inherit(BI.TextEditor, {
    _defaultConfig: function () {
        var conf = BI.SmallTextEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-small-text-editor",
            height: 25
        });
    },

    _init: function () {
        BI.SmallTextEditor.superclass._init.apply(this, arguments);
    }
});
$.shortcut("bi.small_text_editor", BI.SmallTextEditor);/**
 * @class BI.LoadingCancelMask
 * @extend BI.Widget
 * 带有取消按钮的正在加载mask
 */
BI.LoadingCancelMask = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.LoadingCancelMask.superclass._defaultConfig.apply(this, arguments), {})
    },

    _init: function () {
        BI.LoadingCancelMask.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var cancelButton = BI.createWidget({
            type: "bi.button",
            level: "ignore",
            width: 100,
            height: 30,
            text: BI.i18nText("BI-Basic_Cancel")
        });
        cancelButton.on(BI.Button.EVENT_CHANGE, function () {
            self.fireEvent(BI.LoadingCancelMask.EVENT_VALUE_CANCEL);
            self.destroy();
        });
        var mask = BI.Maskers.create(this.getName(), o.masker);
        BI.createWidget({
            type: "bi.absolute",
            element: mask,
            items: [{
                el: {
                    type: "bi.layout",
                    cls: "bi-loading-main-background"
                },
                top: 0,
                left: 0,
                bottom: 0,
                right: 0
            }, {
                el: {
                    type: "bi.center_adapt",
                    cls: "bi-loading-mask-content",
                    items: [{
                        el: {
                            type: "bi.vertical",
                            items: [{
                                type: "bi.center_adapt",
                                cls: "loading-bar-icon",
                                items: [{
                                    type: "bi.icon",
                                    width: 208,
                                    height: 30
                                }]
                            }, {
                                type: "bi.label",
                                cls: "loading-bar-label",
                                text: o.text,
                                height: 30
                            }, {
                                type: "bi.center_adapt",
                                items: [cancelButton]
                            }],
                            vgap: 10
                        }
                    }]
                },
                top: 0,
                left: 0,
                bottom: 0,
                right: 0
            }]
        });
        BI.Maskers.show(this.getName());
        BI.nextTick(function () {
            BI.Maskers.show(self.getName());
        });
    },

    destroy: function () {
        BI.Maskers.remove(this.getName());
    }
});
BI.LoadingCancelMask.EVENT_VALUE_CANCEL = "EVENT_VALUE_CANCEL";
$.shortcut("bi.loading_cancel_mask", BI.LoadingCancelMask);/**
 * @class BI.LoadingBackground
 * @extend BI.Widget
 * 正在加载mask层
 */
BI.LoadingBackground = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.LoadingBackground.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "",
            backgroundCls: "loading-background-e50"
        })
    },

    _init: function () {
        BI.LoadingBackground.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var mask = BI.Maskers.create(this.getName(), o.masker, {offset: o.offset, container: o.container});
        BI.createWidget({
            type: "bi.center_adapt",
            element: mask,
            cls: "bi-loading-mask " + o.backgroundCls
        });
        BI.Maskers.show(this.getName());
        BI.nextTick(function () {
            BI.Maskers.show(self.getName());
        });
    },

    destroy: function () {
        BI.Maskers.remove(this.getName());
    }
});
$.shortcut("bi.loading_background", BI.LoadingBackground);/**
 * @class BI.LoadingMask
 * @extend BI.Widget
 * 正在加载mask层
 */
BI.LoadingMask = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.LoadingMask.superclass._defaultConfig.apply(this, arguments), {
            baseCls: ""
        });
    },

    _init: function () {
        BI.LoadingMask.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var mask = BI.Maskers.create(this.getName(), o.masker, {offset: o.offset, container: o.container});
        BI.createWidget({
            type: "bi.absolute",
            element: mask,
            items: [{
                el: {
                    type: "bi.layout",
                    cls: "bi-loading-main-background"
                },
                top: 0,
                left: 0,
                bottom: 0,
                right: 0
            }, {
                el: {
                    type: "bi.center_adapt",
                    cls: "bi-loading-mask-content",
                    items: [{
                        type: "bi.vertical",
                        items: [{
                            type: "bi.center_adapt",
                            cls: "loading-bar-icon",
                            items: [{
                                type: "bi.icon",
                                width: 208,
                                height: 30
                            }]
                        }, {
                            type: "bi.label",
                            cls: "loading-bar-label",
                            text: o.text,
                            height: 30
                        }]
                    }]
                },
                top: 0,
                left: 0,
                bottom: 0,
                right: 0
            }]
        });
        BI.Maskers.show(this.getName());
        BI.nextTick(function () {
            BI.Maskers.show(self.getName());
        });
    },

    destroy: function () {
        BI.Maskers.remove(this.getName());
    }
});
$.shortcut("bi.loading_mask", BI.LoadingMask);/**
 * 一个button选中的时候下面有条线
 *
 * Created by GUY on 2015/9/30.
 * @class BI.LineSegmentButton
 * @extends BI.BasicButton
 */
BI.LineSegmentButton = BI.inherit(BI.BasicButton, {

    _defaultConfig: function() {
        var conf = BI.LineSegmentButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend( conf, {
            baseCls : (conf.baseCls ||"")+' bi-line-segment-button bi-list-item-effect',
            once: true,
            readonly: true,
            hgap: 10,
            height: 25
        })
    },

    _init:function() {
        BI.LineSegmentButton.superclass._init.apply(this, arguments);
        var o = this.options, self = this;
        this.text = BI.createWidget({
            type: "bi.label",
            element: this,
            text: o.text,
            height: o.height,
            value: o.value,
            hgap: o.hgap
        });

        this.line = BI.createWidget({
            type: "bi.layout",
            cls: "line-segment-button-line",
            height: 3
        })
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.line,
                left: 0,
                right: 0,
                bottom: 0
            }]
        })
    },

    setSelected: function(v){
        BI.LineSegmentButton.superclass.setSelected.apply(this, arguments);
    },

    setText : function(text) {
        BI.LineSegmentButton.superclass.setText.apply(this, arguments);
        this.text.setText(text);
    },

    destroy : function() {
        BI.LineSegmentButton.superclass.destroy.apply(this, arguments);
    }
});
$.shortcut('bi.line_segment_button', BI.LineSegmentButton);/**
 * 另一套风格的单选按钮组
 *
 * Created by GUY on 2015/9/30.
 * @class BI.LineSegment
 * @extends BI.Widget
 */
BI.LineSegment = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.LineSegment.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-line-segment",
            items: [],
            height: 30
        });
    },
    _init: function () {
        BI.LineSegment.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        if (BI.isNumber(o.height)) {
            this.element.css({height: o.height - 1, lineHeight: (o.height - 1) + 'px'});
        }
        this.buttonGroup = BI.createWidget({
            element: this,
            type: "bi.button_group",
            items: BI.createItems(o.items, {
                type: "bi.line_segment_button",
                height: o.height - 1
            }),
            layout: [
                {
                    type: "bi.center"
                }
            ]
        });
        this.buttonGroup.on(BI.Controller.EVENT_CHANGE, function(){
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments)
        });
        this.buttonGroup.on(BI.ButtonGroup.EVENT_CHANGE, function () {
            self.fireEvent(BI.LineSegment.EVENT_CHANGE)
        })
    },

    setValue: function (v) {
        this.buttonGroup.setValue(v);
    },

    setEnabledValue: function (v) {
        this.buttonGroup.setEnabledValue(v);
    },

    setEnable: function (v) {
        BI.LineSegment.superclass.setEnable.apply(this, arguments);
        this.buttonGroup.setEnable(v)
    },


    getValue: function () {
        return this.buttonGroup.getValue();
    }
});
BI.LineSegment.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut('bi.line_segment', BI.LineSegment);/**
 * 拖拽字段的helper
 * Created by roy on 15/10/13.
 */
BI.Helper = BI.inherit(BI.Tip, {
    _defaultConfig: function () {
        return BI.extend(BI.Helper.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-helper",
            text: "",
            value: ""
        })
    },

    _init: function () {
        BI.Helper.superclass._init.apply(this, arguments);
        this.populate();
    },

    modifyContent: function(widget) {
        this.empty();
        BI.createWidget({
            type: "bi.left",
            element: this,
            cls: "dragging-modify",
            items: [widget],
            lgap: 15
        });
    },

    populate: function () {
        var o = this.options;
        this.element.data({helperWidget: this});
        this.empty();
        BI.createWidget({
            element: this,
            type: "bi.label",
            textAlign: "center",
            textHeight: 20,
            hgap: 5,
            text: o.text,
            value: o.value
        });
        this.element.removeClass("dragging-modify");
    }
});
$.shortcut("bi.helper", BI.Helper);/**
 * guy
 * 复选导航条
 * Created by GUY on 2015/12/24.
 * @class BI.ProgressBarBar
 * @extends BI.BasicButton
 */
BI.ProgressBarBar = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        return BI.extend(BI.ProgressBarBar.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-progress-bar-bar",
            height: 24
        })
    },
    _init: function () {
        BI.ProgressBarBar.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.svg = BI.createWidget({
            type: "bi.svg",
            width: 6,
            height: 6
        });
        this.svg.circle(3, 3, 3).attr({fill: "#ffffff", "stroke": ""});
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.svg,
                right: 10,
                top: 9
            }]
        });
        this.processor = BI.createWidget({
            type: "bi.progress_bar_processor",
            width: "0%",
            height: o.height
        });
        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [this.processor]
        });
    },

    setValue: function (process) {
        this.processor.setValue(process);

    }
});
$.shortcut("bi.progress_bar_bar", BI.ProgressBarBar);/**
 * guy
 * 复选导航条
 * Created by GUY on 2015/12/24.
 * @class BI.ProgressBar
 * @extends BI.BasicButton
 */
BI.ProgressBar = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        return BI.extend(BI.ProgressBar.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-progress-bar",
            height: 24
        })
    },
    _init: function () {
        BI.ProgressBar.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.bar = BI.createWidget({
            type: "bi.progress_bar_bar",
            height: o.height
        });
        this.label = BI.createWidget({
            type: "bi.label",
            cls: "progress-bar-label",
            width: 50,
            height: o.height,
            value: "0%"
        });
        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: this.bar
            }, {
                el: this.label,
                width: 50
            }]
        })
    },

    setValue: function (process) {
        if (process >= 100) {
            process = 100;
            this.label.element.addClass("success");
        } else {
            this.label.element.removeClass("success");
        }
        this.label.setValue(process + "%");
        this.bar.setValue(process);
    }
});
$.shortcut("bi.progress_bar", BI.ProgressBar);/**
 * guy
 * 复选导航条
 * Created by GUY on 2015/12/24.
 * @class BI.ProgressBarProcessor
 * @extends BI.BasicButton
 */
BI.ProgressBarProcessor = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        return BI.extend(BI.ProgressBarProcessor.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-progress-bar-processor",
            height: 24
        })
    },
    _init: function () {
        BI.ProgressBarProcessor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.svg = BI.createWidget({
            type: "bi.svg",
            width: 12,
            height: 12
        });
        this.svg.circle(6, 6, 6).attr({fill: "#eaeaea", "stroke": ""});

        this.dot = this.svg.circle(6, 6, 3).attr({fill: "#ffffff", "stroke": ""}).hide();
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.svg,
                right: 7,
                top: 6
            }]
        });
    },

    setValue: function (process) {
        if (process >= 100) {
            process = 100;
            this.dot.show();
            this.element.addClass("success");
        } else {
            this.dot.hide();
            this.element.removeClass("success");
        }
        this.element.width(process + "%");
    }
});
BI.ProgressBarProcessor.EVENT_CHANGE = "ProgressBarProcessor.EVENT_CHANGE";
$.shortcut("bi.progress_bar_processor", BI.ProgressBarProcessor);/**
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
$.shortcut("bi.branch_relation", BI.BranchRelation);/**
 * 自定义选色
 *
 * Created by GUY on 2015/11/17.
 * @class BI.CustomColorChooser
 * @extends BI.Widget
 */
BI.CustomColorChooser = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.CustomColorChooser.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-custom-color-chooser",
            width: 227,
            height: 245
        })
    },

    _init: function () {
        BI.CustomColorChooser.superclass._init.apply(this, arguments);
        var self = this;
        this.editor = BI.createWidget({
            type: "bi.color_picker_editor",
            width: 195
        });
        this.editor.on(BI.ColorPickerEditor.EVENT_CHANGE, function () {
            self.setValue(this.getValue());
        });
        this.farbtastic = BI.createWidget({
            type: "bi.farbtastic"
        });
        this.farbtastic.on(BI.Farbtastic.EVENT_CHANGE, function () {
            self.setValue(this.getValue());
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                type: "bi.absolute",
                items: [{
                    el: this.editor,
                    left: 15,
                    top: 10,
                    right: 15
                }],
                height: 30
            }, {
                type: "bi.absolute",
                items: [{
                    el: this.farbtastic,
                    left: 15,
                    right: 15,
                    top: 10
                }],
                height: 215
            }]
        })
    },

    setValue: function (color) {
        this.editor.setValue(color);
        this.farbtastic.setValue(color);
    },

    getValue: function () {
        return this.editor.getValue();
    }
});
BI.CustomColorChooser.EVENT_CHANGE = "CustomColorChooser.EVENT_CHANGE";
$.shortcut("bi.custom_color_chooser", BI.CustomColorChooser);/**
 * 选色控件
 *
 * Created by GUY on 2015/11/17.
 * @class BI.ColorChooser
 * @extends BI.Widget
 */
BI.ColorChooser = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.ColorChooser.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-color-chooser",
            el: {}
        })
    },

    _init: function () {
        BI.ColorChooser.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget(BI.extend({
            type: "bi.color_chooser_trigger",
            width: o.width,
            height: o.height
        }, o.el));
        this.colorPicker = BI.createWidget({
            type: "bi.color_chooser_popup"
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 1,
            el: this.trigger,
            popup: {
                el: this.colorPicker,
                stopPropagation: false,
                minWidth: 202
            }
        });

        var fn = function () {
            var color = self.colorPicker.getValue();
            self.trigger.setValue(color);
            var colors = BI.string2Array(BI.Cache.getItem("colors") || "");
            var que = new BI.Queue(8);
            que.fromArray(colors);
            que.remove(color);
            que.unshift(color);
            BI.Cache.setItem("colors", BI.array2String(que.toArray()));
        };

        this.colorPicker.on(BI.ColorChooserPopup.EVENT_VALUE_CHANGE, function () {
            fn();
        });

        this.colorPicker.on(BI.ColorChooserPopup.EVENT_CHANGE, function () {
            fn();
            self.combo.hideView();
        });
        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.colorPicker.setStoreColors(BI.string2Array(BI.Cache.getItem("colors") || ""));
        });

        this.combo.on(BI.Combo.EVENT_AFTER_HIDEVIEW, function () {
            self.fireEvent(BI.ColorChooser.EVENT_CHANGE, arguments);
        })
    },

    isViewVisible: function () {
        return this.combo.isViewVisible();
    },

    setEnable: function (v) {
        this.combo.setEnable(v)
    },

    setValue: function (color) {
        this.combo.setValue(color);
    },

    getValue: function () {
        return this.colorPicker.getValue();
    }
});
BI.ColorChooser.EVENT_CHANGE = "ColorChooser.EVENT_CHANGE";
$.shortcut("bi.color_chooser", BI.ColorChooser);/**
 * 选色控件
 *
 * Created by GUY on 2015/11/17.
 * @class BI.ColorChooserPopup
 * @extends BI.Widget
 */
BI.ColorChooserPopup = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.ColorChooserPopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-color-chooser-popup",
            height: 145
        })
    },

    _init: function () {
        BI.ColorChooserPopup.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.colorEditor = BI.createWidget({
            type: "bi.color_picker_editor"
        });

        this.colorEditor.on(BI.ColorPickerEditor.EVENT_CHANGE, function () {
            self.setValue(this.getValue());
            self.fireEvent(BI.ColorChooserPopup.EVENT_VALUE_CHANGE, arguments);
        });

        this.storeColors = BI.createWidget({
            type: "bi.color_picker",
            items: [[{
                value: "",
                disabled: true
            }, {
                value: "",
                disabled: true
            }, {
                value: "",
                disabled: true
            }, {
                value: "",
                disabled: true
            }, {
                value: "",
                disabled: true
            }, {
                value: "",
                disabled: true
            }, {
                value: "",
                disabled: true
            }, {
                value: "",
                disabled: true
            }]],
            width: 190,
            height: 25
        });
        this.storeColors.on(BI.ColorPicker.EVENT_CHANGE, function () {
            self.setValue(this.getValue()[0]);
            self.fireEvent(BI.ColorChooserPopup.EVENT_CHANGE, arguments);
        });

        this.colorPicker = BI.createWidget({
            type: "bi.color_picker",
            width: 190,
            height: 50
        });

        this.colorPicker.on(BI.ColorPicker.EVENT_CHANGE, function () {
            self.setValue(this.getValue()[0]);
            self.fireEvent(BI.ColorChooserPopup.EVENT_CHANGE, arguments);
        });

        this.customColorChooser = BI.createWidget({
            type: "bi.custom_color_chooser"
        });

        var panel = BI.createWidget({
            type: "bi.popup_panel",
            buttons: [BI.i18nText("BI-Basic_Cancel"), BI.i18nText("BI-Basic_Save")],
            title: BI.i18nText("BI-Custom_Color"),
            el: this.customColorChooser,
            stopPropagation: false,
            bgap: -1,
            rgap: 1,
            lgap: 1,
            minWidth: 227
        });

        this.more = BI.createWidget({
            type: "bi.combo",
            direction: "right,top",
            isNeedAdjustHeight: false,
            el: {
                type: "bi.text_item",
                cls: "color-chooser-popup-more",
                textAlign: "center",
                height: 20,
                text: BI.i18nText("BI-Basic_More") + "..."
            },
            popup: panel
        });

        this.more.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.customColorChooser.setValue(self.getValue());
        });
        panel.on(BI.PopupPanel.EVENT_CLICK_TOOLBAR_BUTTON, function (index) {
            switch (index) {
                case 0:
                    self.more.hideView();
                    break;
                case 1:
                    self.setValue(self.customColorChooser.getValue());
                    self.more.hideView();
                    self.fireEvent(BI.ColorChooserPopup.EVENT_CHANGE, arguments);
                    break;
            }
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: {
                    type: "bi.absolute",
                    cls: "color-chooser-popup-title",
                    items: [{
                        el: this.colorEditor,
                        left: 0,
                        right: 0,
                        top: 5
                    }]
                },
                height: 30
            }, {
                el: {
                    type: "bi.absolute",
                    items: [{
                        el: this.storeColors,
                        left: 5,
                        right: 5,
                        top: 5
                    }]
                },
                height: 30
            }, {
                el: {
                    type: "bi.absolute",
                    items: [{
                        el: this.colorPicker,
                        left: 5,
                        right: 5,
                        top: 5
                    }]
                },
                height: 65
            }, {
                el: this.more,
                height: 20
            }]
        })
    },

    setStoreColors: function (colors) {
        if (BI.isArray(colors)) {
            var items = BI.map(colors, function (i, color) {
                return {
                    value: color
                }
            });
            BI.count(colors.length, 8, function (i) {
                items.push({
                    value: "",
                    disabled: true
                })
            });
            this.storeColors.populate([items]);
        }
    },

    setValue: function (color) {
        this.colorEditor.setValue(color);
        this.colorPicker.setValue(color);
        this.storeColors.setValue(color);
    },

    getValue: function () {
        return this.colorEditor.getValue();
    }
});
BI.ColorChooserPopup.EVENT_VALUE_CHANGE = "ColorChooserPopup.EVENT_VALUE_CHANGE";
BI.ColorChooserPopup.EVENT_CHANGE = "ColorChooserPopup.EVENT_CHANGE";
$.shortcut("bi.color_chooser_popup", BI.ColorChooserPopup);/**
 * 选色控件
 *
 * Created by GUY on 2015/11/17.
 * @class BI.ColorChooserTrigger
 * @extends BI.Trigger
 */
BI.ColorChooserTrigger = BI.inherit(BI.Trigger, {

    _defaultConfig: function () {
        var conf = BI.ColorChooserTrigger.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-color-chooser-trigger",
            height: 30
        })
    },

    _init: function () {
        BI.ColorChooserTrigger.superclass._init.apply(this, arguments);
        this.colorContainer = BI.createWidget({
            type: "bi.layout"
        });

        var down = BI.createWidget({
            type: "bi.icon_button",
            disableSelected: true,
            cls: "icon-combo-down-icon trigger-triangle-font",
            width: 12,
            height: 8
        });

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.colorContainer,
                left: 3,
                right: 3,
                top: 3,
                bottom: 3
            }, {
                el: down,
                right: 3,
                bottom: 3
            }]
        });
        if (this.options.value) {
            this.setValue(this.options.value);
        }
    },

    setValue: function (color) {
        BI.ColorChooserTrigger.superclass.setValue.apply(this, arguments);
        this.colorContainer.element.css("background-color", color);
    }
});
BI.ColorChooserTrigger.EVENT_CHANGE = "ColorChooserTrigger.EVENT_CHANGE";
$.shortcut("bi.color_chooser_trigger", BI.ColorChooserTrigger);/**
 * 新建并选中某个分组按钮
 *
 * Created by GUY on 2015/9/25.
 * @class BI.Copy2GroupAddButton
 * @extends BI.BasicButton
 */
BI.Copy2GroupAddButton = BI.inherit(BI.BasicButton, {

    _defaultConfig: function () {
        var conf = BI.Copy2GroupAddButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + ' bi-copy2group-add-button',
            shadow: true,
            isShadowShowingOnSelected: true,
            height: 30
        })
    },

    _init: function () {
        BI.Copy2GroupAddButton.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.text = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            text: BI.i18nText("BI-Create_And_Select") + "\"江苏\"",
            height: o.height
        })
        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: {
                    type: "bi.icon_button",
                    cls: "move2group-add-font"
                },
                width: 30
            }, {
                el: this.text
            }]
        })
    },

    setValue: function (v) {
        this.text.setValue(BI.i18nText("BI-Create_And_Select") + "\"" + v + "\"");
        this.setTitle(BI.i18nText("BI-Create_And_Select") + "\"" + v + "\"", {
            container: "body"
        });
    },

    doClick: function () {
        BI.Copy2GroupAddButton.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.Copy2GroupAddButton.EVENT_CHANGE);
        }
    }
});
BI.Copy2GroupAddButton.EVENT_CHANGE = "Copy2GroupAddButton.EVENT_CHANGE";
$.shortcut('bi.copy2group_add_button', BI.Copy2GroupAddButton);/**
 * 复制到分组下拉框
 *
 * Created by GUY on 2015/9/25.
 * @class BI.Copy2GroupCombo
 * @extends BI.Widget
 */
BI.Copy2GroupCombo = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.Copy2GroupCombo.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-copy2group-combo",
            height: 30,
            tipType: "warning",
            items: []
        });
    },
    _init: function () {
        BI.Copy2GroupCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.trigger = BI.createWidget({
            type: "bi.button",
            text: BI.i18nText("BI-Copy_To_Group"),
            height: o.height
        });

        this.tools = BI.createWidget({
            type: "bi.copy2group_bar"
        });

        this.tools.on(BI.Copy2GroupBar.EVENT_START, function () {
            self.combo.adjustHeight();
            self.searcher.adjustHeight();
        });
        this.tools.on(BI.Copy2GroupBar.EVENT_EMPTY, function () {
            self.combo.adjustHeight();
        });
        this.tools.on(BI.Copy2GroupBar.EVENT_CLICK_BUTTON, function () {
            self.fireEvent(BI.Copy2GroupCombo.EVENT_CLICK_BUTTON);
            self.searcher.stopSearch();
        });
        this.tools.on(BI.Copy2GroupBar.EVENT_CHANGE, function () {
            this.setButtonVisible(!self.searcher.hasMatched());
            self.combo.adjustHeight();
            self.searcher.adjustHeight();
        });

        this.popup = this._createPopup(this.options.items);


        this.searcher = BI.createWidget({
            type: "bi.searcher",
            el: this.tools,
            chooseType: BI.Selection.Multi,
            adapter: this.popup
        });

        this.searcher.on(BI.Searcher.EVENT_CHANGE, function () {

        });

        this.multipopup = BI.createWidget({
            type: "bi.multi_popup_view",
            width: 200,
            stopPropagation: false,
            el: this.popup,
            tool: this.searcher
        });


        this.combo = BI.createWidget({
            type: "bi.combo",
            isNeedAdjustWidth: false,
            element: this,
            el: this.trigger,
            popup: this.multipopup
        });
        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.Copy2GroupCombo.EVENT_BEFORE_POPUPVIEW);
        });
        this.combo.on(BI.Combo.EVENT_AFTER_HIDEVIEW, function () {
            self.searcher.stopSearch();
        });

        this.multipopup.on(BI.MultiPopupView.EVENT_CLICK_TOOLBAR_BUTTON, function (value) {
            switch (value) {
                case 0 :
                    self.fireEvent(BI.Copy2GroupCombo.EVENT_CONFIRM);
                    self.combo.hideView();
                    break;
                default :
                    break;
            }
        });
    },

    _createItems: function (items) {
        return BI.createItems(items, {
            type: "bi.multi_select_item",
            height: 25,
            handler: function (v) {

            }
        })
    },

    _createPopup: function (items, opt) {
        return BI.createWidget(BI.extend({
            type: "bi.button_group",
            items: this._createItems(items),
            chooseType: 1,
            layouts: [{
                type: "bi.vertical"
            }]
        }, opt));
    },


    scrollToBottom: function () {
        var self = this;
        BI.delay(function () {
            self.popup.element.scrollTop(BI.MAX);
        }, 30);
    },

    populate: function (items) {
        this.options.items = items;
        this.combo.populate(this._createItems(items));
    },

    setValue: function (v) {
        this.combo.setValue(v);
        this.searcher.setValue(v);
    },

    setEnable: function (enable) {
        this.combo.setEnable.apply(this.combo, arguments);
    },

    getTargetValue: function () {
        return this.tools.getValue();
    },

    getValue: function () {
        return this.searcher.getValue();
    }
});
BI.Copy2GroupCombo.EVENT_BEFORE_POPUPVIEW = "Copy2GroupCombo.EVENT_BEFORE_POPUPVIEW";
BI.Copy2GroupCombo.EVENT_CHANGE = "Copy2GroupCombo.EVENT_CHANGE";
BI.Copy2GroupCombo.EVENT_CONFIRM = "Copy2GroupCombo.EVENT_CONFIRM";
BI.Copy2GroupCombo.EVENT_CLICK_BUTTON = "Copy2GroupCombo.EVENT_CLICK_BUTTON";
$.shortcut('bi.copy2group_combo', BI.Copy2GroupCombo);/**
 * guy
 * 复选导航条
 * Created by GUY on 2015/9/25.
 * @class BI.Copy2GroupBar
 * @extends BI.Widget
 */
BI.Copy2GroupBar = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.Copy2GroupBar.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-copy2group-bar"
        })
    },
    _init: function () {
        BI.Copy2GroupBar.superclass._init.apply(this, arguments);
        var self = this;
        this.search = BI.createWidget({
            type: "bi.text_editor",
            watermark: BI.i18nText("BI-Search_And_Create_Group"),
            allowBlank: true
        });

        this.search.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });


        this.search.on(BI.TextEditor.EVENT_CHANGE, function () {
            self.button.setValue(this.getValue());
            if(this.getValue() !== "") {
                self.fireEvent(BI.Copy2GroupBar.EVENT_CHANGE);
            }
        });

        this.search.on(BI.TextEditor.EVENT_EMPTY, function () {
            self.button.invisible();
            self.fireEvent(BI.Copy2GroupBar.EVENT_EMPTY);
        });

        this.search.on(BI.TextEditor.EVENT_START, function () {
            self.button.visible();
            self.fireEvent(BI.Copy2GroupBar.EVENT_START);
        });

        this.button = BI.createWidget({
            type: "bi.copy2group_add_button"
        });

        this.button.on(BI.Copy2GroupAddButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.Copy2GroupBar.EVENT_CLICK_BUTTON);
        });

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            vgap: 5,
            hgap: 5,
            items: [this.search, this.button]
        });

        this.button.invisible();
    },

    blur: function(){
        this.search.blur();
    },

    setButtonVisible: function (b) {
        this.button.setVisible(b);
    },

    getValue: function () {
        return this.search.getValue();
    },

    setValue: function (v) {
        this.search.setValue(v);
        this.button.setValue(v);
    }
});
BI.Copy2GroupBar.EVENT_CHANGE = "Copy2GroupBar.EVENT_CHANGE";
BI.Copy2GroupBar.EVENT_START = "Copy2GroupBar.EVENT_START";
BI.Copy2GroupBar.EVENT_EMPTY = "Copy2GroupBar.EVENT_EMPTY";
BI.Copy2GroupBar.EVENT_CLICK_BUTTON = "Copy2GroupBar.EVENT_CLICK_BUTTON";
$.shortcut("bi.copy2group_bar", BI.Copy2GroupBar);/**
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
$.shortcut('bi.month_date_combo', BI.MonthDateCombo);/**
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
$.shortcut('bi.year_date_combo', BI.YearDateCombo);/**
 * Created by GUY on 2015/9/7.
 * @class BI.DatePicker
 * @extends BI.Widget
 */
BI.DatePicker = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.DatePicker.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-date-picker",
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
$.shortcut("bi.date_picker", BI.DatePicker);/**
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
$.shortcut("bi.date_calendar_popup", BI.DateCalendarPopup);/**
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
$.shortcut('bi.date_triangle_trigger', BI.DateTriangleTrigger);/**
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
$.shortcut('bi.date_combo', BI.DateCombo);BI.DateTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4,
        vgap: 2,
        triggerWidth: 30,
        watermark: BI.i18nText("BI-Unrestricted"),
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
            watermark: c.watermark,
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
                    type: BICst.MULTI_DATE_CALENDAR,
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
        this.editor.on(BI.SignEditor.EVENT_STOP, function () {
            self.fireEvent(BI.DateTrigger.EVENT_STOP);
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
            type = v.type || BICst.MULTI_DATE_CALENDAR; value = v.value;
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
            case BICst.MULTI_DATE_YEAR_PREV:
                var text = value + BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_YEAR_PREV];
                date = new Date((date.getFullYear() - 1 * value), date.getMonth(), date.getDate());
                _setInnerValue(date, text);
                break;
            case BICst.MULTI_DATE_YEAR_AFTER:
                var text = value + BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_YEAR_AFTER];
                date = new Date((date.getFullYear() + 1 * value), date.getMonth(), date.getDate());
                _setInnerValue(date, text);
                break;
            case BICst.MULTI_DATE_YEAR_BEGIN:
                var text = BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_YEAR_BEGIN];
                date = new Date(date.getFullYear(), 0, 1);
                _setInnerValue(date, text);
                break;
            case BICst.MULTI_DATE_YEAR_END:
                var text = BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_YEAR_END];
                date = new Date(date.getFullYear(), 11, 31);
                _setInnerValue(date, text);
                break;
            case BICst.MULTI_DATE_QUARTER_PREV:
                var text = value + BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_QUARTER_PREV];
                date = new Date().getBeforeMulQuarter(value);
                _setInnerValue(date, text);
                break;
            case BICst.MULTI_DATE_QUARTER_AFTER:
                var text = value + BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_QUARTER_AFTER];
                date = new Date().getAfterMulQuarter(value);
                _setInnerValue(date, text);
                break;
            case BICst.MULTI_DATE_QUARTER_BEGIN:
                var text = BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_QUARTER_BEGIN];
                date = new Date().getQuarterStartDate();
                _setInnerValue(date, text);
                break;
            case BICst.MULTI_DATE_QUARTER_END:
                var text = BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_QUARTER_END];
                date = new Date().getQuarterEndDate();
                _setInnerValue(date, text);
                break;
            case BICst.MULTI_DATE_MONTH_PREV:
                var text = value + BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_MONTH_PREV];
                date = new Date().getBeforeMultiMonth(value);
                _setInnerValue(date, text);
                break;
            case BICst.MULTI_DATE_MONTH_AFTER:
                var text = value + BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_MONTH_AFTER];
                date = new Date().getAfterMultiMonth(value);
                _setInnerValue(date, text);
                break;
            case BICst.MULTI_DATE_MONTH_BEGIN:
                var text = BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_MONTH_BEGIN];
                date = new Date(date.getFullYear(), date.getMonth(), 1);
                _setInnerValue(date, text);
                break;
            case BICst.MULTI_DATE_MONTH_END:
                var text = BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_MONTH_END];
                date = new Date(date.getFullYear(), date.getMonth(), (date.getLastDateOfMonth()).getDate());
                _setInnerValue(date, text);
                break;
            case BICst.MULTI_DATE_WEEK_PREV:
                var text = value + BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_WEEK_PREV];
                date = date.getOffsetDate(-7 * value);
                _setInnerValue(date, text);
                break;
            case BICst.MULTI_DATE_WEEK_AFTER:
                var text = value + BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_WEEK_AFTER];
                date = date.getOffsetDate(7 * value);
                _setInnerValue(date, text);
                break;
            case BICst.MULTI_DATE_DAY_PREV:
                var text = value + BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_DAY_PREV];
                date = date.getOffsetDate(-1 * value);
                _setInnerValue(date, text);
                break;
            case BICst.MULTI_DATE_DAY_AFTER:
                var text = value + BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_DAY_AFTER];
                date = date.getOffsetDate(1 * value);
                _setInnerValue(date, text);
                break;
            case BICst.MULTI_DATE_DAY_TODAY:
                var text = BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_DAY_TODAY];
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
BI.DateTrigger.EVENT_FOCUS = "EVENT_FOCUS";
BI.DateTrigger.EVENT_START = "EVENT_START";
BI.DateTrigger.EVENT_STOP = "EVENT_STOP";
BI.DateTrigger.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DateTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.DateTrigger.EVENT_VALID = "EVENT_VALID";
BI.DateTrigger.EVENT_ERROR = "EVENT_ERROR";
BI.DateTrigger.EVENT_TRIGGER_CLICK = "EVENT_TRIGGER_CLICK";
BI.DateTrigger.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
$.shortcut("bi.date_trigger", BI.DateTrigger);/**
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
                dynamic: true
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
$.shortcut("bi.date_pane_widget", BI.DatePaneWidget);/**
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
$.shortcut('bi.direction_path_chooser', BI.DirectionPathChooser);/**
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
                maxHeight: 400
            }
        });

        this.downlistcombo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.DownListCombo.EVENT_BEFORE_POPUPVIEW);
        });
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

$.shortcut("bi.down_list_combo", BI.DownListCombo);/**
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
$.shortcut("bi.down_list_group", BI.DownListGroup);BI.DownListItem = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.DownListItem.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-down-list-item",
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
$.shortcut("bi.down_list_item", BI.DownListItem);BI.DownListGroupItem = BI.inherit(BI.BasicButton, {
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
$.shortcut("bi.down_list_group_item", BI.DownListGroupItem);/**
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
                            cls: "bi-down-list-spliter cursor-pointer",
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
$.shortcut("bi.down_list_popup", BI.DownListPopup);/**
 * Created by windy on 2016/12/20.
 */
BI.DynamicGroupTabButtonGroup = BI.inherit(BI.Widget, {

    _const: {
        MERGE_ADD_WIDTH: 65
    },

    _defaultConfig: function () {
        return BI.extend(BI.DynamicGroupTabButtonGroup.superclass._defaultConfig.apply(this, arguments), {
            cls: "bi-dynamic-group-tab-button-group",
            items: [],
            frozenButtons: [],
            height: 30
        })
    },

    _init: function () {
        BI.DynamicGroupTabButtonGroup.superclass._init.apply(this, arguments);
        var o = this.options;
        this.tab = BI.createWidget({
            type: "bi.button_group",
            height: o.height,
            items: [],
            layouts: [{
                type: "bi.horizontal",
                scrollable: false,
                scrollx: false
            }]
        });

        this.tab.on(BI.ButtonGroup.EVENT_CHANGE, function (value, obj) {
            self.fireEvent(BI.DynamicGroupTabButtonGroup.EVENT_CHANGE, arguments);
        });

        var self = this;

        this.scrollLeft = BI.createWidget({
            type: "bi.icon_button",
            cls: "pre-page-font bi-icon-button-scroll",
            invisible: true
        });

        this.scrollLeft.on(BI.IconButton.EVENT_CHANGE, function () {
            self._scrollLeft();
        });
        this.scrollRight = BI.createWidget({
            type: "bi.icon_button",
            cls: "next-page-font bi-icon-button-scroll",
            invisible: true
        });
        this.scrollRight.on(BI.IconButton.EVENT_CHANGE, function () {
            self._scrollRight();
        });
        BI.ResizeDetector.addResizeListener(this, function () {
            self.resize();
        });

        BI.createWidget({
            type: "bi.left",
            element: this,
            items: [{
                type: "bi.horizontal",
                tgap: -1,
                height: o.height,
                scrollx: false,
                cls: "bi-sheet-tab-dynamic-horizontal",
                items: [this.tab,
                    {
                        type: "bi.vertical_adapt",
                        items: [this.scrollLeft],
                        height: o.height
                    },
                    {
                        type: "bi.vertical_adapt",
                        items: [this.scrollRight],
                        height: o.height
                    },
                    {
                        type: "bi.vertical_adapt",
                        items: o.frozenButtons,
                        height: o.height,
                        lgap: 10
                    }
                ]
            }]
        })
    },

    _scrollLeft: function () {
        this._scrollTo(this.tab.element[0].scrollLeft - this.scrollSection)
    },

    _scrollRight: function () {
        this._scrollTo(this.tab.element[0].scrollLeft + this.scrollSection)
    },

    _getTotalWidth: function () {
        var totalWidth = this.element.outerWidth();
        totalWidth -= this._const.MERGE_ADD_WIDTH;
        BI.each(this.options.frozenButtons, function (idx, button) {
            if (BI.isWidget(button)) {
                totalWidth -= button.getWidth();
            } else {
                totalWidth -= button.width;
            }
        })
        return totalWidth;
    },

    _calculateButtonsWith: function (fn) {
        var buttonWidth = 0;
        var self = this;
        BI.some(this.tab.getAllButtons(), function (idx, item) {
            buttonWidth += item.element.outerWidth();
            if (BI.isNotNull(fn) && fn.apply(self, [item])) {
                return true;
            }
        })
        return buttonWidth;
    },

    _dealWithScrollButtonState: function () {
        var buttonWidth = this._calculateButtonsWith();
        if (this.tab.element[0].scrollLeft === 0) {
            this.scrollLeft.setEnable(false);
        } else {
            this.scrollLeft.setEnable(true);
        }
        var ulWidth = this.tab.element.outerWidth();
        //可以滚动的最大距离
        var maxLeft = buttonWidth - ulWidth;
        if (this.tab.element[0].scrollLeft === maxLeft) {
            this.scrollRight.setEnable(false);
        } else {
            this.scrollRight.setEnable(true);
        }
    },

    _needScroll: function (visibleWidth, buttonWidth) {
        var currentLeft = this.tab.element[0].scrollLeft;
        return (visibleWidth > currentLeft && visibleWidth - currentLeft > buttonWidth) ||
            (visibleWidth < currentLeft)
    },

    _scrollTo: function (value) {
        var self = this;
        BI.delay(function () {
            self.tab.element.scrollLeft(value);
            self._dealWithScrollButtonState();
        }, 30);
    },

    _scrollToEnd: function () {
        this._scrollTo(this._calculateButtonsWith())
    },

    resize: function () {
        //获取当前所有可使用的宽度，不包含添加和合并和导航按钮以及之间的空隙
        var totalWidth = this._getTotalWidth();
        //所有button的宽度
        var buttonWidth = this._calculateButtonsWith();
        var width = buttonWidth;
        var showScrollButton = false;
        if (buttonWidth > totalWidth) {
            width = totalWidth;
            showScrollButton = true;
        }
        this.scrollLeft.setVisible(showScrollButton);
        this.scrollRight.setVisible(showScrollButton);
        //这边动态改变buttongroup的宽度，因为最大宽度是变的
        this.tab.element.width(width);
        this._dealWithScrollButtonState();
        this.scrollSection = width * 2 / 3;
        this.scrollSelectedVisible();
    },

    scrollSelectedVisible: function () {
        var value = this.tab.getValue()[0];
        //从index 0到当前选中的tab的所有button的宽度
        var visibleWidth = this._calculateButtonsWith(function (item) {
            if (item.getValue() === value) {
                return true;
            }
        })
        var buttonWidth = this._getTotalWidth();
        var scrollWidth = visibleWidth - buttonWidth / 2;
        if (this._needScroll(visibleWidth, buttonWidth)) {
            this._scrollTo(scrollWidth)
        }
    },

    getAllButtons: function () {
        return this.tab.getAllButtons.apply(this.tab, arguments);
    },

    addItems: function (items) {
        this.tab.addItems.apply(this.tab, arguments);
        this.resize();
        this._scrollToEnd();
    },

    getValue: function () {
        this.tab.getValue.apply(this.tab, arguments);
    },

    setValue: function (v) {
        this.tab.setValue.apply(this.tab, arguments);
    },

    populate: function () {
        this.tab.populate.apply(this.tab, arguments);
        this.resize();
    }
})

BI.DynamicGroupTabButtonGroup.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.dynamic_group_tab_button_group", BI.DynamicGroupTabButtonGroup);/**
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
$.shortcut('bi.excel_table_cell', BI.ExcelTableCell);/**
 *
 * Created by GUY on 2016/3/28.
 * @class BI.ExcelTableHeaderCell
 * @extends BI.Widget
 */
BI.ExcelTableHeaderCell = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.ExcelTableHeaderCell.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-excel-table-header-cell",
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
$.shortcut('bi.excel_table_header_cell', BI.ExcelTableHeaderCell);/**
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
                type: "bi.adaptive_table"
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
            isNeedResize: o.isNeedResize,
            isResizeAdapt: o.isResizeAdapt,

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
$.shortcut('bi.excel_table', BI.ExcelTable);/**
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
$.shortcut("bi.file_manager_button_group", BI.FileManagerButtonGroup);/**
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
$.shortcut("bi.file_manager", BI.FileManager);/**
 * 文件管理控件
 *
 * Created by GUY on 2015/12/11.
 * @class BI.FileManagerFileItem
 * @extends BI.Single
 */
BI.FileManagerFileItem = BI.inherit(BI.Single, {

    _defaultConfig: function () {
        return BI.extend(BI.FileManagerFileItem.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-file-manager-file-item bi-list-item",
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
$.shortcut("bi.file_manager_file_item", BI.FileManagerFileItem);/**
 * 文件管理控件
 *
 * Created by GUY on 2015/12/11.
 * @class BI.FileManagerFolderItem
 * @extends BI.Single
 */
BI.FileManagerFolderItem = BI.inherit(BI.Single, {

    _defaultConfig: function () {
        return BI.extend(BI.FileManagerFolderItem.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-file-manager-folder-item bi-list-item",
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
$.shortcut("bi.file_manager_folder_item", BI.FileManagerFolderItem);/**
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
$.shortcut("bi.file_manager_list", BI.FileManagerList);/**
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
            cls: "file-manager-nav-button-text",
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
$.shortcut("bi.file_manager_nav_button", BI.FileManagerNavButton);/**
 * 文件管理导航
 *
 * Created by GUY on 2015/12/11.
 * @class BI.FileManagerNav
 * @extends BI.Widget
 */
BI.FileManagerNav = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.FileManagerNav.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-file-manager-nav",
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
$.shortcut("bi.file_manager_nav", BI.FileManagerNav);/**
 * 过滤条件抽象类
 *
 * @class BI.AbstractFilterItem
 * @extend BI.Widget
 */
BI.AbstractFilterItem = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.AbstractFilterItem.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-filter-item"
        })
    },

    _init: function () {
        BI.AbstractFilterItem.superclass._init.apply(this, arguments);
    },

    isSelectedCondition: function () {
        return this.emptyItem && this.emptyItem.isVisible();
    },

    setSelectedCondition: function (b) {
        if (!!b) {
            if (!this.emptyItem) {
                this.emptyItem = BI.createWidget({
                    type: "bi.absolute",
                    height: 40,
                    cls: "filter-item-empty-item",
                    items: [{
                        el: {
                            type: "bi.center_adapt",
                            cls: "empty-filter-item-leaf"
                        }
                    }],
                    hgap: 10,
                    vgap: 5
                });
                BI.createWidget({
                    type: "bi.vertical",
                    element: this,
                    items: [this.emptyItem],
                    scrolly: false
                });
            }
        }
        this.emptyItem && this.emptyItem.setVisible(b);
    }
});/**
 * @class BI.FilterExpander
 * @extend BI.AbstractFilterItem
 * 过滤树的一个expander节点
 */
BI.FilterExpander = BI.inherit(BI.AbstractFilterItem, {

    _constant: {
        EXPANDER_WIDTH: 20
    },

    _defaultConfig: function () {
        var conf = BI.FilterExpander.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-filter-expander",
            el: {},
            popup: {}
        })
    },

    _init: function () {
        BI.FilterExpander.superclass._init.apply(this, arguments);
        this._initExpander();
        this._initConditionsView();
        BI.createWidget({
            type: "bi.horizontal_adapt",
            element: this,
            items: [this.expander, this.conditionsView]
        });
    },

    _initExpander: function () {
        var self = this, o = this.options;
        var value = o.value, text = "";
        if (value === BICst.FILTER_TYPE.AND) {
            text = BI.i18nText("BI-Basic_And");
        } else {
            text = BI.i18nText("BI-Basic_Or");
        }
        this.expander = BI.createWidget({
            type: "bi.text_button",
            cls: "condition-and-or",
            text: text,
            value: value,
            id: o.id,
            width: this._constant.EXPANDER_WIDTH,
            height: "100%"
        });
        this.expander.on(BI.Controller.EVENT_CHANGE, function (type) {
            arguments[2] = self;
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
    },

    _initConditionsView: function () {
        var self = this, popup = this.options.popup;
        this.conditionsView = BI.createWidget(popup);
        this.conditionsView.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
    },

    getValue: function () {
        return {
            type: this.expander.getValue(),
            value: this.conditionsView.getValue(),
            id: this.options.id
        };
    },

    setValue: function () {

    },

    populate: function (items) {
        this.conditionsView.populate.apply(this.conditionsView, arguments);
    }
});
$.shortcut("bi.filter_expander", BI.FilterExpander);/**
 * 过滤
 *
 * Created by GUY on 2015/11/20.
 * @class BI.Filter
 * @extend BI.Widget
 */
BI.Filter = BI.inherit(BI.Widget, {

    constants: {
        FIELD_TYPE_NUMBER: 1,
        FIELD_TYPE_STRING: 0,
        FIELD_TYPE_DATE: 2
    },

    _defaultConfig: function () {
        return BI.extend(BI.Filter.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-filter",
            expander: {},
            items: [],
            el: {},
            itemCreator: BI.empty
        })
    },

    _init: function () {
        BI.Filter.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.filter = BI.createWidget(o.el,{
            type: "bi.filter_operation",
            expander: o.expander,
            items: o.items,
            element: this
        });
        this.filter.on(BI.FilterOperation.EVENT_OPERATION, function (type) {
            switch (type) {
                case BICst.FILTER_OPERATION_CONDITION:
                case BICst.FILTER_OPERATION_CONDITION_AND:
                    self._addAndOrCondition(BICst.FILTER_TYPE.EMPTY_CONDITION);
                    break;
                case BICst.FILTER_OPERATION_CONDITION_OR:
                    self._addAndOrCondition(BICst.FILTER_TYPE.EMPTY_CONDITION, 1);
                    break;
                case BICst.FILTER_OPERATION_FORMULA:
                case BICst.FILTER_OPERATION_FORMULA_AND:
                    self._addAndOrCondition(BICst.FILTER_TYPE.EMPTY_FORMULA);
                    break;
                case BICst.FILTER_OPERATION_FORMULA_OR:
                    self._addAndOrCondition(BICst.FILTER_TYPE.EMPTY_FORMULA, 1);
                    break;
            }
        });
        this.filter.on(BI.FilterOperation.EVENT_DESTROY_ITEM, function (id) {
            self._removeCondition(id);
        });

        this.tree = new BI.Tree();
        this.tree.initTree(o.items);
    },

    _removeCondition: function (id) {
        var finded = this.tree.search(id);
        if (BI.isNotNull(finded)) {
            var parent = finded.getParent();
            parent.removeChild(id);
            if (parent.getChildrenLength() <= 1) {
                var prev = parent.getParent();
                if (BI.isNotNull(prev)) {
                    var index = prev.getChildIndex(parent.id);
                    prev.removeChildByIndex(index);
                    if (parent.getChildrenLength() === 1) {
                        prev.addChild(parent.getFirstChild(), index);
                    }
                }
            }
            this._populate(this.tree.toJSONWithNode());
            this.fireEvent(BI.Filter.EVENT_CHANGE);
        }
    },

    _createEmptyNode: function (type) {
        var node = new BI.Node(BI.UUID());
        node.set("data", {
            value: type
        });
        return node;
    },

    _insertAndOrCondition: function (id, formulaOrField, type) {
        var ANDOR = ["AND", "OR"];
        type || (type = 0);
        var finded = this.tree.search(id);
        if (BI.isNotNull(finded)) {
            var data = finded.get("data");
            var parent = finded.getParent();
            var index = parent.getChildIndex(finded.id);
            var pdata = parent.get("data") || {};
            var node = this._createEmptyNode(formulaOrField);
            if (data.value === BICst.FILTER_TYPE[ANDOR[type]]) {
                this.tree.addNode(finded, node);
                return;
            }
            if (data.value === BICst.FILTER_TYPE[ANDOR[1 - type]]) {
                if (pdata.value === BICst.FILTER_TYPE[ANDOR[type]]) {
                    parent.addChild(node, index + 1);
                    return;
                }
            }
            if ((data.value === BICst.FILTER_TYPE[ANDOR[1 - type]] && pdata.value !== BICst.FILTER_TYPE[ANDOR[type]])
                || pdata.value === BICst.FILTER_TYPE[ANDOR[1 - type]]
                || (pdata.value !== BICst.FILTER_TYPE.AND && pdata.value !== BICst.FILTER_TYPE.OR)) {
                var andor = new BI.Node(BI.UUID());
                andor.set("data", {
                    value: BICst.FILTER_TYPE[ANDOR[type]],
                    children: [finded.get("data"), node.get("data")]
                });
                parent.removeChildByIndex(index);
                parent.addChild(andor, index);
                andor.addChild(finded);
                andor.addChild(node);
                return;
            }
            parent.addChild(node, index + 1);
        }
    },

    _addAndOrCondition: function (formulaOrField, type) {
        var ANDOR = ["AND", "OR"];
        type || (type = 0);
        var o = this.options;
        var currentSelectItem = this.filter.getCurrentSelectItem();
        if (BI.isNotNull(currentSelectItem)) {
            var id = currentSelectItem.attr("id");
            this._insertAndOrCondition(id, formulaOrField, type);
        } else {
            var node = this._createEmptyNode(formulaOrField);
            var root = this.tree.getRoot();
            var child = root.getLastChild();
            if (BI.isNotNull(child)) {
                var data = child.get("data");
                if (data.value === BICst.FILTER_TYPE[ANDOR[type]]) {
                    this.tree.addNode(child, node);
                } else {
                    var andor = new BI.Node(BI.UUID());
                    andor.set("data", {
                        value: BICst.FILTER_TYPE[ANDOR[type]],
                        children: [child.get("data"), node.get("data")]
                    });
                    root.removeChild(child.id);
                    this.tree.addNode(andor);
                    this.tree.addNode(andor, child);
                    this.tree.addNode(andor, node);
                }
            } else {
                this.tree.addNode(node);
            }
        }
        this._populate(this.tree.toJSONWithNode());
        this.fireEvent(BI.Filter.EVENT_CHANGE);
    },

    _populate: function (items) {
        var self = this, o = this.options;
        o.items = items;
        ArrayUtils.traversal(items, function (i, item) {
            o.itemCreator(item);
        });
        this.filter.populate.apply(this.filter, [items]);
    },

    populate: function (conditions) {
        this.tree.initTree(conditions);
        this._populate(this.tree.toJSONWithNode());
    },

    getValue: function () {
        return this.filter.getValue();
    }
});
BI.Filter.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.filter", BI.Filter);/**
 * 过滤条件
 *
 * Created by GUY on 2015/9/25.
 * @class BI.FilterOperation
 * @extend BI.Widget
 */
BI.FilterOperation = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.FilterOperation.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-filter-operation",
            expander: {},
            items: [],
            selections: [BICst.FILTER_OPERATION_CONDITION, BICst.FILTER_OPERATION_FORMULA],
            itemsCreator: BI.emptyFn
        })
    },

    _defaultState: function () {
        if (BI.isNotNull(this.currentSelected)) {
            this.currentSelected.setSelectedCondition(false);
        }
        this.buttonComboTab.setSelect(BI.FilterOperation.OPERATION_ADD_CONDITION);
    },

    _init: function () {
        BI.FilterOperation.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.currentSelected = null;

        this.filter = BI.createWidget({
            type: "bi.filter_pane",
            expander: o.expander,
            items: o.items,
            itemsCreator: o.itemsCreator
        });
        this.filter.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
            if (type === BI.Events.CLICK) {
                if (BI.isNotNull(self.currentSelected) && self.currentSelected === obj) {
                    obj.setSelectedCondition(!obj.isSelectedCondition());
                } else {
                    if (BI.isNotNull(self.currentSelected)) {
                        self.currentSelected.setSelectedCondition(false);
                    }
                    self.currentSelected = obj;
                    obj.setSelectedCondition(true);
                }
                if (self.currentSelected.isSelectedCondition()) {
                    self.buttonComboTab.setSelect(BI.FilterOperation.OPERATION_ADD_ANDOR_CONDITION);
                } else {
                    self.buttonComboTab.setSelect(BI.FilterOperation.OPERATION_ADD_CONDITION);
                }
            }
            if (type === BI.Events.DESTROY) {
                if (self.currentSelected === obj) {
                    self.currentSelected = null;
                    self.buttonComboTab.setSelect(BI.FilterOperation.OPERATION_ADD_CONDITION);
                }
                self.fireEvent(BI.FilterOperation.EVENT_DESTROY_ITEM, value, obj);
            }
        });
        this.filter.on(BI.FilterPane.EVENT_CHANGE, function () {
            self.fireEvent(BI.FilterOperation.EVENT_CHANGE, arguments);
        });
        var operation = this._buildOperationTab();

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: operation,
                height: 40
            }, {
                el: {
                    type: "bi.absolute",
                    scrollable: true,
                    items: [{
                        el: {
                            type: "bi.left",
                            items: [
                                this.filter
                            ]
                        },
                        top: 0,
                        right: 2,
                        bottom: 0,
                        left: 0
                    }]
                }
            }]
        })
    },

    _buildOperationTab: function () {
        this.buttonComboTab = BI.createWidget({
            type: "bi.tab",
            tab: null,
            cardCreator: BI.bind(this._createTabs, this)
        });
        this.buttonComboTab.setSelect(BI.FilterOperation.OPERATION_ADD_CONDITION);
        return this.buttonComboTab;
    },

    _createTabs: function (v) {
        var self = this;
        switch (v) {
            case BI.FilterOperation.OPERATION_ADD_CONDITION:
                var btnGroup = BI.createWidget({
                    type: "bi.button_group",
                    items: BI.createItems(self._createButtons(), {
                        type: "bi.button",
                        forceNotSelected: true,
                        level: "ignore",
                        height: 25
                    }),
                    chooseType: BI.ButtonGroup.CHOOSE_TYPE_DEFAULT,
                    layouts: [{
                        type: "bi.right",
                        hgap: 10,
                        vgap: 5
                    }]
                });
                btnGroup.on(BI.ButtonGroup.EVENT_CHANGE, function (value, obj) {
                    self.fireEvent(BI.FilterOperation.EVENT_OPERATION, obj.getValue());
                    self._defaultState();
                });
                return btnGroup;
            case BI.FilterOperation.OPERATION_ADD_ANDOR_CONDITION:
                var btnGroup = BI.createWidget({
                    type: "bi.button_group",
                    chooseType: BI.ButtonGroup.CHOOSE_TYPE_DEFAULT,
                    items: self._createCombos(),
                    layouts: [{
                        type: "bi.right",
                        hgap: 10,
                        vgap: 5
                    }]
                });
                return btnGroup;
        }
    },

    _createButtons: function(){
        var buttons = [];
        BI.each(this.options.selections, function(i, type){
            switch (type){
                case BICst.FILTER_OPERATION_FORMULA:
                    buttons.push({
                        text: BI.i18nText("BI-Add_Formula"),
                        value: BICst.FILTER_OPERATION_FORMULA
                    });
                    break;
                case BICst.FILTER_OPERATION_CONDITION:
                    buttons.push({
                        text: BI.i18nText("BI-Add_Condition"),
                        value: BICst.FILTER_OPERATION_CONDITION
                    });
                    break;
            }
        });
        return buttons;
    },

    _createCombos: function () {
        var self = this, combos = [];
        BI.each(this.options.selections, function(i, type){
            var text = "", items = [];
            switch (type) {
                case BICst.FILTER_OPERATION_FORMULA:
                    text = BI.i18nText("BI-Add_Formula");
                    items = BICst.FILTER_ADD_FORMULA_COMBO;
                    break;
                case BICst.FILTER_OPERATION_CONDITION:
                    text = BI.i18nText("BI-Add_Condition");
                    items = BICst.FILTER_ADD_CONDITION_COMBO;
                    break;
            }
            var addCombo = BI.createWidget({
                type: "bi.static_combo",
                text: text,
                width: 90,
                chooseType: BI.ButtonGroup.CHOOSE_TYPE_NONE,
                items: BI.createItems(items, {
                    type: "bi.single_select_item",
                    height: 25
                })
            });
            addCombo.on(BI.Combo.EVENT_CHANGE, function (value, obj) {
                self.fireEvent(BI.FilterOperation.EVENT_OPERATION, obj.getValue());
                self._defaultState();
            });
            combos.push(addCombo);
        });
        return combos;
    },

    getCurrentSelectItem: function () {
        if (BI.isNotNull(this.currentSelected) && this.currentSelected.isSelectedCondition()) {
            return this.currentSelected;
        }
    },

    populate: function (items) {

        this.filter.populate.apply(this.filter, arguments);
    },

    getValue: function () {
        return this.filter.getValue();
    }
});
BI.extend(BI.FilterOperation, {
    OPERATION_ADD_CONDITION: 0,
    OPERATION_ADD_ANDOR_CONDITION: 1
});
BI.FilterOperation.EVENT_OPERATION = "EVENT_OPERATION";
BI.FilterOperation.EVENT_CHANGE = "EVENT_CHANGE";
BI.FilterOperation.EVENT_DESTROY_ITEM = "BI.FilterOperation.EVENT_DESTROY_ITEM";
$.shortcut("bi.filter_operation", BI.FilterOperation);/**
 * @class BI.FilterPane
 * @extend BI.Widget
 * 过滤面板
 */
BI.FilterPane = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.FilterPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-filter-pane",
            expander: {},
            items: [],
            itemsCreator: BI.emptyFn
        })
    },

    _init: function () {
        BI.FilterPane.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.tree = BI.createWidget({
            type: "bi.custom_tree",
            element: this,
            expander: BI.extend({
                type: "bi.filter_expander",
                el: {},
                popup: {
                    type: "bi.custom_tree"
                }
            }, o.expander),
            el: {
                type: "bi.button_map",
                chooseType: BI.ButtonGroup.CHOOSE_TYPE_DEFAULT,
                layouts: [{
                    type: "bi.vertical",
                    scrolly: false
                }]
            }
        });

        this.tree.on(BI.Controller.EVENT_CHANGE, function (type) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.FilterPane.EVENT_CHANGE, [].slice.call(arguments, 1));
            }
        });

        if (BI.isNotEmptyArray(o.items)) {
            this.populate(o.items);
        }
    },

    populate: function (items) {
        this.tree.populate.apply(this.tree, arguments);
    },

    getValue: function () {
        return this.tree.getValue();
    }
});
BI.FilterPane.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.filter_pane", BI.FilterPane);/**
 * Created by windy on 2017/3/13.
 * 数值微调器
 */
BI.FineTuningNumberEditor = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.FineTuningNumberEditor.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-fine-tuning-number-editor",
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
            cls: "column-pre-page-h-font top-button"
        });
        this.topBtn.on(BI.IconButton.EVENT_CHANGE, function(){
            self._finetuning(1);
            self.fireEvent(BI.FineTuningNumberEditor.EVENT_CONFIRM);
        });
        this.bottomBtn = BI.createWidget({
            type: "bi.icon_button",
            cls: "column-next-page-h-font bottom-button"
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
        this.bottomBtn.setEnable((v + add) !== -1);
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
$.shortcut("bi.fine_tuning_number_editor", BI.FineTuningNumberEditor);/**
 * Created by roy on 15/9/29.
 */
/**
 * Created by roy on 15/9/1.
 */
BI.SymbolGroup = BI.inherit(BI.Widget, {
    constants: {
        hgap: 7.5,
        textWidth: 14,
        textHeight: 17
    },
    _defaultConfig: function () {
        return BI.extend(BI.SymbolGroup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-formula-symbol-group"
        })
    },
    _init: function () {
        BI.SymbolGroup.superclass._init.apply(this, arguments)
        var self = this, c = this.constants;

        var items = [{
            text: "+",
            value: "+"
        }, {
            text: "-",
            value: "-"
        }, {
            text: "*",
            value: "*"
        }, {
            text: "/",
            value: "/"
        }, {
            text: "(",
            value: "("
        }, {
            text: ")",
            value: ")"
        }];

        this.symbolgroup = BI.createWidget({
            type: "bi.button_group",
            element: self,
            chooseType:-1,
            items: BI.createItems(items, {
                type: "bi.text_button",
                forceNotSelected: true,
                once: false,
                textWidth: c.textWidth,
                textHeight: c.textHeight,
                cls: "symbol-button"
            }),
            layouts: [{
                type: "bi.left_vertical_adapt",
                hgap: c.hgap
            }]
        });

        this.symbolgroup.on(BI.ButtonGroup.EVENT_CHANGE,function(v){
            self.fireEvent(BI.SymbolGroup.EVENT_CHANGE,v)
        })
    }
});
BI.SymbolGroup.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.symbol_group", BI.SymbolGroup);/**
 * Created by roy on 15/9/9.
 */
//0更多函数为展开状态，1为函数框展开，显示返回状态
BI.FormulaInsert = BI.inherit(BI.Widget, {
    constants: {
        right_set_off: -322,
        height: 30,
        width: 160,
        right: 10,
        button_bottom: 5,
        pane_bottom: -1,
        retract: 1,
        more_function: 0,
        functionTypes: ["MATH", "DATETIME", "ARRAY", "TEXT", "LOGIC", "OTHER"],
        abandonFunctions: ["ACOS", "ACOSH", "ASIN", "ASINH", "ATAN", "ATAN2", "ATANH", "BITNOT", "BITOPERATION", "CHAR", "CLASS", "CODE", "COMBIN", "CORREL", "COS", "COSH", "DATETONUMBER", "DEGREES", "GETKEY", "GETUSERDEPARTMENTS", "GETUSERJOBTITLES", "NVL", "ODD", "PI", "POWER", "PRODUCT", "PROPER", "RADIANS", "REGEXP", "REVERSE", "RemoteIP", "SIN", "SINH", "STARTWITH", "TAN", "TANH", "TESTCONNECTION", "TESTMACANDUUID", "TOBINARY", "TOHEX", "TOOCTAL", "TOIMAGE"]
    },

    _defaultConfig: function () {
        var conf = BI.FormulaInsert.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-formula-insert",
            fieldItems: []


        })
    },

    _init: function () {
        BI.FormulaInsert.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this.constants;
        self.validation = "valid";

        this.formulatree = BI.createWidget({
            type: "bi.formula_field_tree",
            cls: "bi-formula-field-pane",
            items: o.fieldItems
        });

        this.formulatree.on(BI.FormulaFieldTree.EVENT_CHANGE, function () {
            var v = self.formulatree.getValue();
            self.formulaedit.insertField(self.fieldValueTextMap[v[0]]);
        });

        this.symbolgroup = BI.createWidget({
            type: "bi.symbol_group",
            height: c.height,
            cls: "symbol-group-column"
        });

        this.symbolgroup.on(BI.SymbolGroup.EVENT_CHANGE, function (v) {
            self.formulaedit.insertOperator(v);
        });


        this.formulaedit = BI.createWidget({
            type: "bi.formula",
            tipType: "warning",
            watermark: BI.i18nText("BI-Formula_Water_Mark")
        });

        this.formulaedit.on(BI.FormulaEditor.EVENT_CHANGE, function () {
            if (BI.Func.checkFormulaValidation(self.formulaedit.getCheckString())) {
                self.validation = "valid";
                BI.Bubbles.hide(self.getName() + "invalid");
            } else {
                BI.Bubbles.show(self.getName() + "invalid", BI.i18nText("BI-Formula_Valid"), self, {
                    offsetStyle: "center"
                });
                self.validation = "invalid"
            }
            self.fireEvent(BI.FormulaInsert.EVENT_CHANGE);
        });

        this.formulaedit.on(BI.FormulaEditor.EVENT_BLUR, function () {
            BI.Bubbles.hide(self.getName() + "invalid");
            if (!self.checkValidation()) {
                self.formulaedit.setTitle(BI.i18nText("BI-Formula_Valid"), {belowMouse: true});
            }


        });

        this.formulaedit.on(BI.FormulaEditor.EVENT_FOCUS, function () {
            self.formulaedit.setTitle("");
            if (!self.checkValidation()) {
                BI.Bubbles.show(self.getName() + "invalid", BI.i18nText("BI-Formula_Valid"), self, {offsetStyle: "center"});
            }
        });

        this.editorpane = BI.createWidget({
            type: "bi.vtape",

            items: [
                {
                    height: "fill",
                    el: self.formulaedit
                }, {
                    height: c.height,
                    el: self.symbolgroup
                }
            ]
        });


        this.functionbutton = BI.createWidget({
            type: "bi.text_button",
            text: BI.i18nText("BI-Formula_More_Function"),
            value: c.more_function,
            cls: "more-function-button"
        });

        this.functionpane = BI.createWidget({
            type: "bi.function_pane",
            items: self._createFunctionItems(),
        });

        this.functionCombo = BI.createWidget({
            type: "bi.combo",
            isNeedAdjustWidth: false,
            el: this.functionbutton,
            direction: "right,top",
            adjustYOffset: -16,
            adjustXOffset: 10,
            hideChecker: function () {
                return false;
            },
            popup: {
                el: self.functionpane,
                width: 372
            },
            width: 65
        });


        BI.createWidget({
            element: this,
            type: "bi.htape",
            items: [
                {
                    width: c.width,
                    el: self.formulatree
                },
                {

                    el: self.editorpane
                }
            ],
            height: o.height,
            width: o.width
        });
        BI.createWidget({
            element: this,
            type: "bi.absolute",
            items: [
                {
                    el: self.functionCombo,
                    right: c.right,
                    bottom: c.button_bottom
                }
            ]
        });


        self.formulaedit.element.droppable({
            accept: ".bi-tree-text-leaf-item",
            drop: function (event, ui) {
                var value = ui.helper.attr("text");
                self.formulaedit.insertField(value);
            }
        });


        this.functionCombo.on(BI.Combo.EVENT_AFTER_POPUPVIEW, function () {
            self.functionbutton.setText(BI.i18nText("BI-Formula_Retract"))
        });

        this.functionCombo.on(BI.Combo.EVENT_AFTER_HIDEVIEW, function () {
            self.functionbutton.setText(BI.i18nText("BI-Formula_More_Function"))
        });

        this.functionpane.on(BI.FunctionPane.EVENT_INSET, function (v) {
            if (BI.isNotEmptyString(v)) {
                self.formulaedit.insertFunction(v);
            }

        });

        this.populate(o.fieldItems);

    },


    _isFunction: function (str) {
        var self = this, o = this.options, result = false;
        BI.each(o.functionItems, function (i, item) {
            var text = item.text.toLowerCase();
            var lowerString = str.toLowerCase();
            if (text === lowerString) {
                result = true
            }
        });
        return result;
    },

    _analyzeContent: function (v) {
        var regx = /\$[\{][^\}]*[\}]|\w*\w|\$\{[^\$\(\)\+\-\*\/)\$,]*\w\}|\$\{[^\$\(\)\+\-\*\/]*\w\}|\$\{[^\$\(\)\+\-\*\/]*[\u4e00-\u9fa5]\}|\w|(.)|\n/g;
        return v.match(regx);
    },

    _getFunctionType: function (functionType) {
        switch (functionType) {
            case  "MATH":
                return BICst.FUNCTION.MATH;
            case "TEXT":
                return BICst.FUNCTION.TEXT;
            case "DATETIME":
                return BICst.FUNCTION.DATE;
            case "ARRAY":
                return BICst.FUNCTION.ARRAY;
            case "LOGIC":
                return BICst.FUNCTION.LOGIC;
            case "OTHER":
                return BICst.FUNCTION.OTHER;
        }
    },

    _createFunctionItems: function () {
        var self = this;
        var functionObjs = FormulaJSONs;
        var functionItems = [];
        BI.each(functionObjs, function (i, functionObj) {
            if (self.constants.functionTypes.contains(functionObj.type) && !self.constants.abandonFunctions.contains(functionObj.name)) {
                var item = {};
                item.text = functionObj.name;
                item.value = functionObj.name;
                item.fieldType = self._getFunctionType(functionObj.type);
                item.description = functionObj.def;
                item.title = functionObj.def;
                functionItems.push(item);
            }
        });
        this.options.functionItems = functionItems;
        return functionItems;
    },

    _createFieldTextValueMap: function (fieldItems) {
        var fieldMap = {};
        BI.each(fieldItems, function(idx, typeItems){
            BI.each(typeItems, function (i, fieldItem) {
                fieldMap[fieldItem.text] = fieldItem.value;
            });
        })
        return fieldMap;
    },

    _createFieldValueTextMap: function (fieldItems) {
        var fieldMap = {};
        BI.each(fieldItems, function (idx, typeItems) {
            BI.each(typeItems, function (i, fieldItem) {
                fieldMap[fieldItem.value] = fieldItem.text;
            })
        });
        return fieldMap;
    },

    _bindDragEvent: function () {
        var self = this;
        BI.each(self.formulatree.getAllLeaves(), function (i, node) {
            node.element.draggable({
                cursorAt: {top: 5, left: 5},
                helper: function () {
                    var hint = BI.createWidget({
                        type: "bi.helper",
                        value: node.getValue(),
                        text: self.fieldValueTextMap[node.getValue()]
                    });
                    BI.createWidget({
                        element: self,
                        type: "bi.default",
                        items: [hint]
                    });
                    hint.element.attr({text: self.fieldValueTextMap[node.getValue()]});
                    return hint.element;

                }
            })

        });
    },


    checkValidation: function () {
        return this.validation === "valid";
    },

    refresh: function () {
        this.formulaedit.refresh();
    },

    setValue: function (v) {
        var self = this, result;
        self.formulaedit.refresh();
        self.formulaedit.setValue("");
        result = this._analyzeContent(v || "");
        BI.each(result, function (i, item) {
            var fieldRegx = /\$[\{][^\}]*[\}]/;
            var str = item.match(fieldRegx);
            if (BI.isNotEmptyArray(str)) {
                self.formulaedit.insertField(self.fieldValueTextMap[str[0].substring(2, item.length - 1)]);
            } else if (self._isFunction(item)) {
                self.formulaedit.setFunction(item);
            } else {
                self.formulaedit.insertString(item);
            }
        })

    },

    getFormulaString: function () {
        return this.formulaedit.getFormulaString();
    },

    getUsedFields: function () {
        return this.formulaedit.getUsedFields();
    },

    getValue: function () {
        return this.formulaedit.getValue();
    },
    populate: function (fieldItems) {
        this.options.fieldItems = fieldItems;
        this.fieldTextValueMap = this._createFieldTextValueMap(fieldItems);
        this.fieldValueTextMap = this._createFieldValueTextMap(fieldItems);
        this.formulaedit.setFieldTextValueMap(this.fieldTextValueMap);
        this.formulatree.populate(fieldItems);
        this._bindDragEvent();
    }


});
BI.FormulaInsert.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.formula_insert", BI.FormulaInsert);BI.ButtonTextTreeLeafItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.ButtonTextTreeLeafItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-button-text-tree-item ",
            id: "",
            pId: "",
            height: 25,
            hgap: 0,
            lgap: 0,
            rgap: 0
        })
    },
    _init: function () {
        BI.ButtonTextTreeLeafItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.text = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            whiteSpace: "nowrap",
            textHeight: o.height,
            height: o.height,
            hgap: o.hgap,
            lgap: o.lgap,
            rgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py
        });
        this.button = BI.createWidget({
            type: "bi.text_button",
            height: 25,
            stopEvent:true,
            value: BI.i18nText("BI-Formula_Insert"),
            cls: "formula-function-insert-button"
        });
        this.button.on(BI.TextButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.ADD, self.text.getText());
        });
        this.button.invisible();
        this.leaf = BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: this.button,
                width: 30
            }, {
                el: this.text
            }],
            hgap: o.hgap
        })
        this.element.hover(function () {
            self.button.visible();
        }, function () {
            if (!self.isSelected()) {
                self.button.invisible();
            }

        })

    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doHighLight: function () {
        this.text.doHighLight.apply(this.text, arguments);
    },

    unHighLight: function () {
        this.text.unHighLight.apply(this.text, arguments);
    },

    setSelected: function (b) {
        BI.ButtonTextTreeLeafItem.superclass.setSelected.apply(this, arguments);
        if (BI.isNotNull(b) && b === true) {
            this.button.visible();
        } else {
            this.button.invisible();
        }
    },


    getId: function () {
        return this.options.id;
    },

    getPId: function () {
        return this.options.pId;
    }
});

$.shortcut("bi.button_text_tree_leaf_item", BI.ButtonTextTreeLeafItem);/**
 * Created by roy on 15/9/14.
 */
BI.FunctionPane = BI.inherit(BI.Widget, {
    constants: {
        search_height: 20,
        height: 200,
        width: 370,
        column_size_editor: 170,
        column_size_right: 200,
        row_size: 30,
        hgap: 10,
        vgap: 10,
        hgap_offset: 5
    },
    _defaultConfig: function () {
        var conf = BI.FunctionPane.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-formula-function-pane",
            width: 320,
            height: 200,
            items: []
        })
    },
    _init: function () {
        BI.FunctionPane.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this.constants;


        this.desLabel = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            whiteSpace: "normal",
            textWidth: 180
        });

        this.searchFunctionTree = BI.createWidget({
            type: "bi.function_tree",
            cls: "style-top",
            redmark: function (val, ob) {
                return true
            }
        });

        this.functiontree = BI.createWidget({
            type: "bi.function_tree",
            cls: "style-top",
            items: o.items
        });


        this.searcher = BI.createWidget({
            type: "bi.searcher",
            adapter: this.functiontree,
            isAutoSearch: false,
            onSearch: function (op, populate) {
                var keyword = op.keyword.toLowerCase();
                var resultArray = [];
                BI.each(o.items, function (i, item) {
                    if (item.value.toLowerCase().indexOf(keyword) > -1 && !BI.isEmptyString(keyword)) {
                        resultArray.push(item);
                    }
                });
                populate(resultArray, keyword);
            },
            el: {
                type: "bi.small_search_editor"
            },
            popup: {
                type: "bi.function_searcher_pane",
                searcher: self.searchFunctionTree
            },
            height: 25,
            width: 160
        });


        this.functionLabel = BI.createWidget({
            type: "bi.label"
        });

        BI.createWidget({
            element: this,
            type: "bi.window",
            width: c.width,
            cls: "style-out",
            columns: 2,
            rows: 2,
            columnSize: [c.column_size_editor, c.column_size_right],
            rowSize: [c.row_size, 'fill'],
            items: [
                [
                    {

                        el: {
                            type: "bi.center_adapt",
                            hgap: c.hgap_offset,
                            items: [
                                {
                                    el: self.searcher
                                }
                            ]


                        }
                    },
                    {
                        el: {
                            type: "bi.center_adapt",
                            cls: "style-left",
                            items: [
                                {
                                    type: "bi.left",
                                    hgap: c.hgap,
                                    items: [
                                        {
                                            el: self.functionLabel
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                ], [
                    {
                        el: self.functiontree
                    },
                    {
                        el: {
                            type: "bi.absolute",
                            cls: "style-inner",
                            items: [
                                {
                                    el: self.desLabel,
                                    left: c.hgap,
                                    right: c.hgap,
                                    top: c.hgap,
                                    bottom: c.hgap
                                }
                            ]
                        }
                    }
                ]
            ]
        });

        self.functiontree.on(BI.FunctionTree.FUNCTION_INSERT, function (value) {
            self.fireEvent(BI.FunctionPane.EVENT_INSET, value)
        });

        self.functiontree.on(BI.FunctionTree.EVENT_DESCRIPTION_CHANGE, function (v) {
            self.desLabel.setText(v);
        });

        self.functiontree.on(BI.FunctionTree.EVENT_CHANGE, function (v) {
            self.functionLabel.setText(v);
        });

        self.searchFunctionTree.on(BI.FunctionTree.FUNCTION_INSERT, function (value) {
            self.fireEvent(BI.FunctionPane.EVENT_INSET, value)
        });

        self.searchFunctionTree.on(BI.FunctionTree.EVENT_DESCRIPTION_CHANGE, function (v) {
            self.desLabel.setText(v);
        });

        self.searchFunctionTree.on(BI.FunctionTree.EVENT_CHANGE, function (v) {
            self.functionLabel.setText(v);
        });

    }

});
BI.FunctionPane.EVENT_INSET = "EVENT_INSET";
$.shortcut("bi.function_pane", BI.FunctionPane);/**
 * Created by roy on 16/1/21.
 */
BI.FunctionSearcherPane = BI.inherit(BI.SearcherView, {
    _defaultConfig: function () {
        var conf = BI.FunctionSearcherPane.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-function-searcher-pane"
        })
    },

    _init: function () {
        BI.FunctionSearcherPane.superclass._init.apply(this, arguments);
    },

    populate: function (searchResult, keyword) {
        searchResult || (searchResult = []);
        this.spliter.setVisible(false);
        this.searcher.populate(searchResult, keyword);
        this.searcher.expandAll();
        this.searcher.doBehavior(keyword);
    },


});
$.shortcut("bi.function_searcher_pane", BI.FunctionSearcherPane);BI.FormulaFieldTree = BI.inherit(BI.Widget, {
    _const: {
        leafGap: 40
    },
    _defaultConfig: function () {
        return BI.extend(BI.FormulaFieldTree.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-formula-field-tree",
            chooseType: 0,
            items: []
        });
    },

    _init: function () {
        BI.FormulaFieldTree.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _getFieldNum: function (map, fieldtype) {
        if (BI.isNotNull(map[fieldtype])) {
            return map[fieldtype].length
        } else {
            return 0
        }
    },

    populate: function (items) {
        var o = this.options, c = this._const, self = this;
        this.empty();
        var map = {};
        BI.each(items, function (i, typeItem) {
            BI.each(typeItem, function (i, item) {
                if (!map[item.fieldType]) {
                    map[item.fieldType] = [];
                }
                map[item.fieldType].push(item);
            })
        });

        var nodes = [{
            id: BICst.COLUMN.NUMBER,
            type: "bi.triangle_group_node",
            text: BI.i18nText("BI-Formula_Numberic_Field") + "(" + self._getFieldNum(map,BICst.COLUMN.NUMBER) + ")",
            value: BICst.COLUMN.NUMBER,
            isParent: true,
            open: items.length === 1
        }];

        if(items.length > 1){
            nodes.push({
                id: BICst.COLUMN.STRING,
                type: "bi.triangle_group_node",
                text: BI.i18nText("BI-Formula_Text_Field") + "(" + self._getFieldNum(map, BICst.COLUMN.STRING) + ")",
                value: BICst.COLUMN.STRING,
                isParent: true,
                open: false
            });
        }

        if(items.length > 2){
            nodes.push({
                id: BICst.COLUMN.DATE,
                type: "bi.triangle_group_node",
                text: BI.i18nText("BI-Formula_Time_Field") + "(" + self._getFieldNum(map, BICst.COLUMN.DATE) + ")",
                value: BICst.COLUMN.DATE,
                isParent: true,
                open: false
            });
        }

        BI.each(items, function(idx, typeItems){
            BI.each(typeItems, function (i, item) {
                nodes.push(BI.extend({
                    id: BI.UUID(),
                    pId: item.fieldType
                }, item, {
                    type: "bi.tree_text_leaf_item",
                    cls: "tree-text-leaf-item-draggable",
                    textAlign: "left",
                    lgap: c.leafGap
                }))
            });
        });
        this.fieldtree = BI.createWidget({
            type: "bi.level_tree",
            element: this,
            chooseType: o.chooseType,
            expander: {
                isDefaultInit: true
            },
            items: nodes
        });
        this.fieldtree.on(BI.LevelTree.EVENT_CHANGE, function () {
            self.fireEvent(BI.FormulaFieldTree.EVENT_CHANGE);
            self.fieldtree.setValue();
        })
    },

    getValue: function () {
        return this.fieldtree.getValue();
    },

    setValue: function (v) {
        this.fieldtree.setValue(v);
    },
    getAllLeaves: function () {
        return this.fieldtree.getAllLeaves()
    }
});
BI.FormulaFieldTree.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.formula_field_tree", BI.FormulaFieldTree);/**
 * Created by roy on 15/9/14.
 */
BI.FunctionTree = BI.inherit(BI.Widget, {
    _const: {
        leafGap: 10,
        nodeTypes: [BICst.FUNCTION.MATH, BICst.FUNCTION.ARRAY, BICst.FUNCTION.DATE, BICst.FUNCTION.LOGIC, BICst.FUNCTION.OTHER, BICst.FUNCTION.TEXT]
    },
    _defaultConfig: function () {
        return BI.extend(BI.FunctionTree.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-formula-function-tree",
            chooseType: 0,
            items: [],
            redmark: BI.emptyFn
        });
    },

    _init: function () {
        BI.FunctionTree.superclass._init.apply(this, arguments);
        this.populate(this.options.items);
    },

    _getFieldNum: function (map, fieldtype) {
        if (BI.isNotNull(map[fieldtype])) {
            return map[fieldtype].length
        } else {
            return 0
        }
    },

    populate: function (items) {
        var o = this.options, c = this._const, self = this;
        this.empty();
        var map = {};
        o.items = items;
        BI.each(items, function (i, item) {
            if (!map[item.fieldType]) {
                map[item.fieldType] = [];
            }
            map[item.fieldType].push(item);
        });
        this.nodes = [
            {
                id: BICst.FUNCTION.MATH,
                type: "bi.triangle_group_node",
                text: BI.i18nText("BI-Formula_Numberic_Function") + "(" + self._getFieldNum(map, BICst.FUNCTION.MATH) + ")",
                value: BICst.FUNCTION.MATH,
                isParent: true,
                open: false
            }, {
                id: BICst.FUNCTION.TEXT,
                type: "bi.triangle_group_node",
                text: BI.i18nText("BI-Formula_Text_Function") + "(" + self._getFieldNum(map, BICst.FUNCTION.TEXT) + ")",
                value: BICst.FUNCTION.TEXT,
                isParent: true,
                open: false
            }, {
                id: BICst.FUNCTION.DATE,
                type: "bi.triangle_group_node",
                text: BI.i18nText("BI-Formula_Time_Function") + "(" + self._getFieldNum(map, BICst.FUNCTION.DATE) + ")",
                value: BICst.FUNCTION.DATE,
                isParent: true,
                open: false
            }, {
                id: BICst.FUNCTION.ARRAY,
                type: "bi.triangle_group_node",
                text: BI.i18nText("BI-Formula_Array_Function") + "(" + self._getFieldNum(map, BICst.FUNCTION.ARRAY) + ")",
                value: BICst.FUNCTION.ARRAY,
                isParent: true,
                open: false
            }, {
                id: BICst.FUNCTION.LOGIC,
                type: "bi.triangle_group_node",
                text: BI.i18nText("BI-Formula_Logic_Function") + "(" + self._getFieldNum(map, BICst.FUNCTION.LOGIC) + ")",
                value: BICst.FUNCTION.LOGIC,
                isParent: true,
                open: false
            }, {
                id: BICst.FUNCTION.OTHER,
                type: "bi.triangle_group_node",
                text: BI.i18nText("BI-Formula_Other_Function") + "(" + self._getFieldNum(map, BICst.FUNCTION.OTHER) + ")",
                value: BICst.FUNCTION.OTHER,
                isParent: true,
                open: false
            }
        ];
        BI.each(items, function (i, item) {
            self.nodes.push(BI.extend({
                id: BI.UUID(),
                pId: item.fieldType
            }, item, {
                type: "bi.button_text_tree_leaf_item",
                textAlign: "left",
                lgap: c.leafGap
            }))
        });
        this.fieldtree = BI.createWidget({
            type: "bi.level_tree",
            element: this,
            items: self.nodes,
            el: {
                behaviors: {
                    "redmark": o.redmark
                }
            }
        });

        this.fieldtree.on(BI.Controller.EVENT_CHANGE, function (type, value) {
            if (type === BI.Events.ADD) {
                self.fireEvent(BI.FunctionTree.FUNCTION_INSERT, value);
            }
        });
        this.fieldtree.on(BI.LevelTree.EVENT_CHANGE, function () {
            self.fireEvent(BI.FunctionTree.EVENT_CHANGE, self.getValue());
            self.fireEvent(BI.FunctionTree.EVENT_DESCRIPTION_CHANGE, self._getDescription(self.getValue(), o.items))
            self.fieldtree.setValue(self.getValue());
        })
    },

    getValue: function () {
        return this.fieldtree.getValue();
    },

    setValue: function (v) {
        this.fieldtree.setValue(v);
    },

    doBehavior: function () {
        this.fieldtree.doBehavior.apply(this.fieldtree, arguments)
    },

    getNodeByValue: function (v) {
        return this.fieldtree.getNodeByValue(v)
    },

    setTriggerExpand: function (v) {
        var node = this.fieldtree.getNodeById(v);
        node.showView();
    },

    setTriggerCollapse: function (v) {
        var node = this.fieldtree.getNodeById(v);
        node.hideView();
    },

    expandAll: function () {
        var self = this;
        BI.each(self._const.nodeTypes, function (i, id) {
            self.setTriggerExpand(id);
        })
    },

    _getDescription: function (v, items) {
        var description = "";
        BI.each(items, function (i, item) {
            if (item.value === v[0]) {
                description = item.description;
            }
        });
        return description
    },

    getAllLeaves: function () {
        return this.fieldtree.getAllLeaves()
    }
});
BI.FunctionTree.EVENT_CHANGE = "EVENT_CHANGE";
BI.FunctionTree.EVENT_DESCRIPTION_CHANGE = "EVENT_DESCRIPTION_CHANGE";
BI.FunctionTree.FUNCTION_INSERT = "FUNCTION_INSERT";
$.shortcut("bi.function_tree", BI.FunctionTree);/**
 * Created by GameJian on 2016/1/28.
 */
BI.ImageButtonHref = BI.inherit(BI.Single, {

    _defaultConfig: function () {
        return BI.extend(BI.ImageButtonHref.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-image-button-href",
            title: BI.i18nText("BI-Add_Href")
        })
    },

    _init: function () {
        BI.ImageButtonHref.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.icon_button",
            cls: "img-href-font",
            title: o.title,
            height: 24,
            width: 24
        });

        this.input = BI.createWidget({
            type: "bi.clear_editor",
            watermark: BI.i18nText("BI-Input_Href"),
            width: 255,
            height: 30
        });
        this.input.on(BI.ClearEditor.EVENT_CONFIRM, function () {
            self.combo.hideView();
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            direction: "bottom,left",
            adjustYOffset: 3,
            el: this.trigger,
            popup: {
                el: this.input,
                stopPropagation: false,
                minWidth: 255
            }
        });

        this.combo.on(BI.Combo.EVENT_AFTER_POPUPVIEW, function () {
            self.input.focus()
        });

        this.combo.on(BI.Combo.EVENT_BEFORE_HIDEVIEW, function () {
            self.fireEvent(BI.ImageButtonHref.EVENT_CHANGE, arguments)
        })
    },

    isSelected: function(){
        return this.combo.isViewVisible();
    },

    showView: function(){
        this.combo.showView();
    },

    hideView: function () {
        this.combo.hideView();
    },

    getValue: function () {
        return this.input.getValue();
    },

    setValue: function (url) {
        this.input.setValue(url)
    }
});
BI.ImageButtonHref.EVENT_CHANGE = "BI.ImageButtonHref.EVENT_CHANGE";
$.shortcut("bi.image_button_href", BI.ImageButtonHref);/**
 * 图片尺寸控件
 * Created by GameJian on 2016/1/28.
 */
BI.ImageButtonSizeCombo = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.ImageButtonSizeCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-image-button-size-combo",
            title: BI.i18nText("BI-Image_Size")
        })
    },

    _init: function () {
        BI.ImageButtonSizeCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.icon_button",
            cls: "img-size-font",
            title: o.title,
            width: 24,
            height: 24
        });
        this.sizeChooser = BI.createWidget({
            type: "bi.image_button_size"
        });
        this.sizeChooser.on(BI.ImageButtonSize.EVENT_CHANGE, function(){
            self.fireEvent(BI.ImageButtonSizeCombo.EVENT_CHANGE,arguments)
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            isNeedAdjustWidth: false,
            direction: "top",
            adjustYOffset: 3,
            offsetStyle: "right",
            el: this.trigger,
            popup: {
                el: this.sizeChooser,
                stopPropagation: false
            }
        });
    },

    setValue: function (v) {
        this.sizeChooser.setValue(v);
    },

    getValue: function () {
        return this.sizeChooser.getValue();
    }
});
BI.ImageButtonSizeCombo.EVENT_CHANGE = "ImageButtonSizeCombo.EVENT_CHANGE";
$.shortcut("bi.image_button_size_combo", BI.ImageButtonSizeCombo);/**
 * 单选框
 * Created by GameJian on 2016/1/28.
 */
BI.ImageButtonSize = BI.inherit(BI.Widget, {

    _defaultConfig: function(){
        return BI.extend(BI.ImageButtonSize.superclass._defaultConfig.apply(this, arguments),{
            baseCls: "bi-image-button-size",
            width: 230,
            height: 30
        })
    },

    _init:function() {
        BI.ImageButtonSize.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.sizeChooser = BI.createWidget({
            type: "bi.button_group",
            scrollable: false,
            items: BI.createItems([{
                text: BI.i18nText("BI-Original_Size"),
                cls: "image-button-size-button-group",
                width: 55,
                selected: true,
                value: BICst.IMAGE_RESIZE_MODE.ORIGINAL
            },{
                text: BI.i18nText("BI-Equal_Size_Adapt"),
                cls: "image-button-size-button-group",
                width: 67,
                value: BICst.IMAGE_RESIZE_MODE.EQUAL
            },{
                text: BI.i18nText("BI-Widget_Size_Adapt"),
                cls: "image-button-size-button-group",
                width: 67,
                value: BICst.IMAGE_RESIZE_MODE.STRETCH
            }],{
                type: "bi.image_button_size_radio"
            }),
            layouts: [{
                type: "bi.left",
                hgap: 5
            }]
        });

        this.sizeChooser.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.sizeChooser.on(BI.ButtonGroup.EVENT_CHANGE, function () {
            self.fireEvent(BI.ImageButtonSize.EVENT_CHANGE, arguments);
        });
        BI.createWidget({
            type: "bi.left",
            element: this,
            items: [this.sizeChooser],
            hgap: 5
        });
        this.getValue()
    },

    getValue: function () {
        return this.sizeChooser.getValue()[0]
    },

    setValue: function (v) {
        this.sizeChooser.setValue(v)
    }
});
BI.ImageButtonSize.EVENT_CHANGE = "BI.ImageButtonSize.EVENT_CHANGE";
$.shortcut("bi.image_button_size" , BI.ImageButtonSize);/**
 * 单选框
 * Created by GameJian on 2016/1/28.
 */
BI.ImageButtonSizeRadio = BI.inherit(BI.BasicButton, {

    _defaultConfig: function(){
        return BI.extend(BI.ImageButtonSizeRadio.superclass._defaultConfig.apply(this, arguments),{
            width: 65,
            height: 30,
            text: "",
            selected: false
        })
    },

    _init:function() {
        BI.ImageButtonSizeRadio.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.radio = BI.createWidget({
            type: "bi.radio",
            selected: o.selected
        });

        this.label = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            lgap: 5,
            rgap: 0,
            textHeight: o.height,
            height: o.height,
            text: o.text
        });

        this.radio.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {
                self.setSelected(!self.isSelected());
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        BI.createWidget({
            element: this,
            type: "bi.absolute",
            items: [{
                el: this.radio,
                left: 0,
                top: 8.5
            },{
                el: this.label,
                left: 13
            }]
        });
    },

    doClick: function () {
        BI.ImageButtonSizeRadio.superclass.doClick.apply(this, arguments);
        this.radio.setSelected(this.isSelected());
    },

    setSelected: function (v) {
        BI.ImageButtonSizeRadio.superclass.setSelected.apply(this, arguments);
        this.radio.setSelected(v);

    }
});
$.shortcut("bi.image_button_size_radio" , BI.ImageButtonSizeRadio);/**
 * 图片组件
 * Created by GameJian on 2016/1/26.
 */
BI.UploadImage = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.UploadImage.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-upload-image"
        })
    },

    _init: function () {
        BI.UploadImage.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.label = BI.createWidget({
            type: "bi.text_button",
            trigger: "dblclick",
            cls: "upload-image-text-button-label",
            whiteSpace: "normal",
            text: BI.i18nText("BI-DoubleClick_To_Upload_Image")
        });

        this.file = BI.createWidget({
            type: "bi.multifile_editor",
            accept: "*.jpg;*.png;*.gif;*.bmp;*.jpeg;",
            maxSize: 1024 * 1024 * 100,
            title: BI.i18nText("BI-Upload_Image")
        });

        this.img = BI.createWidget({
            type: "bi.image_button",
            invalid: true,
            width: "100%",
            height: "100%"
        });

        this.label.on(BI.TextButton.EVENT_CHANGE, function () {
            if (self.isValid()) {
                self.file.select();
            }
        });

        this.file.on(BI.MultifileEditor.EVENT_CHANGE, function (data) {
            this.upload();
        });
        //直接把图片保存到resource目录下面
        this.file.on(BI.MultifileEditor.EVENT_UPLOADED, function () {
            var files = this.getValue();
            var file = files[files.length - 1];
            var attachId = file.attach_id, fileName = file.filename;
            var imageId = attachId + "_" + fileName;
            BI.requestAsync("fr_bi_base", "save_upload_image", {
                attach_id: attachId
            }, function (res) {
                self.img.setValue(imageId);
                self.img.setSrc(BI.UploadImage.getImageSrc(imageId));
                self._check();
                self._setSize("auto", "auto");
                self.fireEvent(BI.UploadImage.EVENT_CHANGE, imageId);
            })
        });

        this.uploadWrapper = BI.createWidget({
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.icon_button",
                    cls: "upload-image-icon-button img-upload-font",
                    width: 24,
                    height: 24
                },
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }, {
                el: this.file,
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }],
            width: 24,
            height: 24
        });

        this.del = BI.createWidget({
            type: "bi.bubble_combo",
            el: {
                type: "bi.icon_button",
                cls: "upload-image-icon-button img-shutdown-font",
                title: BI.i18nText("BI-Basic_Delete"),
                height: 24,
                width: 24
            },
            popup: {
                type: "bi.bubble_bar_popup_view",
                buttons: [{
                    value: BI.i18nText(BI.i18nText("BI-Basic_Sure")),
                    handler: function () {
                        self.fireEvent(BI.UploadImage.EVENT_DESTROY);
                    }
                }, {
                    value: BI.i18nText("BI-Basic_Cancel"),
                    level: "ignore",
                    handler: function () {
                        self.del.hideView();
                    }
                }],
                el: {
                    type: "bi.vertical_adapt",
                    items: [{
                        type: "bi.label",
                        text: BI.i18nText("BI-Sure_Delete_Current_Component"),
                        cls: "upload-image-delete-label",
                        textAlign: "left",
                        width: 300
                    }],
                    width: 300,
                    height: 100,
                    hgap: 20
                },
                maxHeight: 140,
                minWidth: 340
            },
            invisible: true,
            stopPropagation: true
        });

        this.size = BI.createWidget({
            type: "bi.image_button_size_combo",
            cls: "upload-image-icon-button"
        });

        this.size.on(BI.ImageButtonSizeCombo.EVENT_CHANGE, function () {
            self._sizeChange(self.size.getValue());
            self.fireEvent(BI.UploadImage.EVENT_CHANGE, arguments)
        });

        this.href = BI.createWidget({
            type: "bi.image_button_href",
            cls: "upload-image-icon-button"
        });

        this.href.on(BI.ImageButtonHref.EVENT_CHANGE, function () {
            if (BI.isNotEmptyString(self.href.getValue())) {
                self.img.setValid(true)
            } else {
                self.img.setValid(false)
            }
            self.fireEvent(BI.UploadImage.EVENT_CHANGE, arguments)
        });

        this.img.on(BI.ImageButton.EVENT_CHANGE, function () {
            window.open(BI.Func.formatAddress(self.href.getValue()));
        });

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.absolute",
                    scrollable: false,
                    items: [{
                        el: this.img
                    }]
                },
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }, {
                el: this.label,
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }, {
                el: this.del,
                right: 4,
                top: 8
            }, {
                el: this.href,
                right: 36,
                top: 8
            }, {
                el: this.size,
                right: 68,
                top: 8
            }, {
                el: this.uploadWrapper,
                right: 100,
                top: 8
            }]
        });

        this.setToolbarVisible(false);
        this.img.invisible();
    },

    _check: function () {
        var f = BI.isNotEmptyString(this.img.getValue());
        this.label.setVisible(!f);
        this.img.visible(f);
    },

    _setSize: function (w, h) {
        this.img.setImageWidth(w);
        this.img.setImageHeight(h)
    },

    _sizeChange: function (size) {
        var self = this, o = this.options;
        switch (size) {
            case BICst.IMAGE_RESIZE_MODE.ORIGINAL:
                self._setSize("auto", "auto");
                break;
            case BICst.IMAGE_RESIZE_MODE.EQUAL:
                self._setSize("auto", "auto");
                var width = this.img.getImageWidth(), height = this.img.getImageHeight();
                var W = this.element.width(), H = this.element.height();
                if (W / H > width / height) {
                    self._setSize("auto", "100%");
                } else {
                    self._setSize("100%", "auto");
                }
                break;
            case BICst.IMAGE_RESIZE_MODE.STRETCH:
                self._setSize("100%", "100%");
                break;
            default :
                self._setSize("auto", "auto");
        }
    },

    setToolbarVisible: function (v) {
        this.uploadWrapper.setVisible(v);
        this.size.setVisible(v);
        this.href.setVisible(v);
        this.del.setVisible(v);
    },

    getValue: function () {
        return {href: this.href.getValue(), size: this.size.getValue(), src: this.img.getValue()}
    },

    setValue: function (v) {
        var self = this;
        v || (v = {});
        if (BI.isNotEmptyString(v.href)) {
            self.img.setValid(true)
        }
        this.href.setValue(v.href);
        this.size.setValue(v.size);
        this.img.setValue(v.src);
        if (BI.isNotEmptyString(v.src)) {
            this.img.setSrc(BI.UploadImage.getImageSrc(v.src));
        }
        this._check();
        this._sizeChange(v.size)
    },

    resize: function () {
        this._sizeChange(this.size.getValue());
    }
});

BI.extend(BI.UploadImage, {
    getImageSrc: function (src) {
        return FR.servletURL + "?op=fr_bi&cmd=get_uploaded_image&image_id=" + src;
    }
});

BI.UploadImage.EVENT_DESTROY = "EVENT_DESTROY";
BI.UploadImage.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.upload_image", BI.UploadImage);/**
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
$.shortcut('bi.interactive_arrangement', BI.InteractiveArrangement);/**
 * Created by zcf on 2016/9/26.
 */
BI.IntervalSlider = BI.inherit(BI.Widget, {
    _constant: {
        EDITOR_WIDTH: 90,
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
            cls: "blue-track",
            height: 8
        });
        this.track = this._createTrackWrapper();

        this.labelOne = BI.createWidget({
            type: "bi.sign_editor",
            cls: "slider-editor-button",
            errorText: "",
            allowBlank: false,
            height: c.HEIGHT,
            width: c.EDITOR_WIDTH,
            validationChecker: function (v) {
                return self._checkValidation(v);
            },
            quitChecker: function (v) {
                return self._checkValidation(v);
            }
        });
        this.labelOne.on(BI.Editor.EVENT_CONFIRM, function () {
            var percent = self._getPercentByValue(this.getValue());
            var significantPercent = BI.parseFloat(percent.toFixed(1));//分成1000份
            self._setLabelOnePosition(significantPercent);
            self._setSliderOnePosition(significantPercent);
            self._setBlueTrack();
            self.fireEvent(BI.IntervalSlider.EVENT_CHANGE);
        });

        this.labelTwo = BI.createWidget({
            type: "bi.sign_editor",
            cls: "slider-editor-button",
            errorText: "",
            allowBlank: false,
            height: c.HEIGHT,
            width: c.EDITOR_WIDTH,
            validationChecker: function (v) {
                return self._checkValidation(v);
            },
            quitChecker: function (v) {
                return self._checkValidation(v);
            }
        });
        this.labelTwo.on(BI.Editor.EVENT_CONFIRM, function () {
            var percent = self._getPercentByValue(this.getValue());
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
                rgap: c.EDITOR_WIDTH,
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
        return !(BI.isNull(v) || v < this.min || v > this.max)
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

    _getValueByPercent: function (percent) {//return (((max-min)*percent)/100+min)
        var sub = this.calculation.accurateSubtraction(this.max, this.min);
        var mul = this.calculation.accurateMultiplication(sub, percent);
        var div = this.calculation.accurateDivisionTenExponent(mul, 2);
        return this.calculation.accurateAddition(div, this.min);
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
$.shortcut("bi.interval_slider", BI.IntervalSlider);/**
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
            return this._accurateSubtraction(num2, num1)
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
 * Created by fay on 2016/9/14.
 */
BI.ListLabelItemGroup = BI.inherit(BI.ButtonGroup, {
    _defaultConfig: function () {
        return BI.extend(BI.ListLabelItemGroup.superclass._defaultConfig.apply(this, arguments), {
            chooseType: BI.Selection.Multi
        });
    },

    _init: function () {
        BI.ListLabelItemGroup.superclass._init.apply(this, arguments);
        this.otherValues = [];
        if (BI.isEmptyArray(this.getValue())) {
            BI.each(this.buttons, function (idx, button) {
                if (button.getValue() === BICst.LIST_LABEL_TYPE.ALL) {
                    button.setSelected(true);
                }
            });
        }
        this._checkBtnStyle();
    },

    _createBtns: function (items) {
        var o = this.options;
        return BI.createWidgets(BI.createItems(items, {
            type: "bi.text_button",
            cls: "list-label-button"
        }));
    },


    _btnsCreator: function (items) {
        var self = this, args = Array.prototype.slice.call(arguments), o = this.options;
        var buttons = this._createBtns(items);
        args[0] = buttons;

        BI.each(this.behaviors, function (i, behavior) {
            behavior.doBehavior.apply(behavior, args);
        });
        BI.each(buttons, function (i, btn) {
            btn.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
                if (type === BI.Events.CLICK) {
                    switch (o.chooseType) {
                        case BI.ButtonGroup.CHOOSE_TYPE_MULTI:
                            if (btn.getValue() === BICst.LIST_LABEL_TYPE.ALL) {
                                self.setValue([BICst.LIST_LABEL_TYPE.ALL]);
                            } else {
                                self._checkBtnState();
                            }
                            self._checkBtnStyle();
                            break;
                        case BI.ButtonGroup.CHOOSE_TYPE_SINGLE:
                            self.setValue(btn.getValue());
                            break;
                        case BI.ButtonGroup.CHOOSE_TYPE_NONE:
                            self.setValue([]);
                            break;
                    }
                    self.fireEvent(BI.ButtonGroup.EVENT_CHANGE, value, obj);
                }
                self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            });
            btn.on(BI.Events.DESTROY, function () {
                BI.remove(self.buttons, btn);
            });
        });

        return buttons;
    },

    _checkBtnState: function () {
        if (BI.isEmptyArray(this.getValue()) && BI.isEmptyArray(this.otherValues)) {
            this.buttons[0].setSelected(true);
            this.fireEvent(BI.ButtonGroup.EVENT_CHANGE, this.buttons[0].getValue(), this.buttons[0]);
        } else if (this.getValue().length === 1 && BI.isEqual(this.getValue()[0], BICst.LIST_LABEL_TYPE.ALL)) {
            this.buttons[0].setSelected(true);
        }
        else {
            this.buttons[0].setSelected(false);
        }
    },

    _checkBtnStyle: function () {
        BI.each(this.buttons, function (idx, btn) {
            if (btn.isSelected()) {
                btn.doHighLight();
            } else {
                btn.unHighLight();
            }
        });
    },

    removeAllItems: function () {
        var indexes = [];
        for (var i = 1; i < this.buttons.length; i++) {
            indexes.push(i);
        }
        this.removeItemAt(indexes);
    },

    setValue: function (v) {
        var self = this;
        v = BI.isArray(v) ? v : [v];
        BI.each(this.buttons, function (i, item) {
            if (BI.deepContains(v, item.getValue())) {
                item.setSelected && item.setSelected(true);
            } else {
                item.setSelected && item.setSelected(false);
            }
        });
        var currentValues = this.getValue();
        this.otherValues = [];
        BI.each(v, function (idx, value) {
            if (currentValues.indexOf(value) === -1) {
                self.otherValues.push(value);
            }
        });
        this._checkBtnState();
        this._checkBtnStyle();

    },

    getValue: function () {
        var v = [];
        BI.each(this.buttons, function (i, item) {
            if (item.isEnabled() && item.isSelected && item.isSelected()) {
                v.push(item.getValue());
            }
        });
        v = v.concat(this.otherValues || []);
        return v;
    }
});

$.shortcut('bi.list_label_item_group', BI.ListLabelItemGroup);
/**
 * 文本标签
 *
 * Created by fay on 2016/9/11.
 */
BI.ListLabel = BI.inherit(BI.Widget, {

    _constant: {
        MAX_COLUMN_SIZE: 40,
        DEFAULT_LABEL_GAP: 15,
        DEFAULT_RIGHT_GAP: 10
    },

    _defaultConfig: function () {
        return BI.extend(BI.ListLabel.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-list-label",
            title: BI.i18nText("BI-List_Label_Con"),
            showTitle: true,
            items: [],
            height: 40
        })
    },

    _init: function () {
        BI.ListLabel.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.items = BI.clone(o.items);
        this.items.unshift({
            text: BI.i18nText("BI-Basic_Nolimited"),
            value: BICst.LIST_LABEL_TYPE.ALL
        });
        this.title = BI.createWidget({
            type: "bi.label",
            text: o.title + BI.i18nText("BI-Basic_Colon"),
            title: o.title,
            height: o.height
        });

        this.container = BI.createWidget({
            type: "bi.list_label_item_group",
            items: BI.createItems(this.items.slice(0, this._constant.MAX_COLUMN_SIZE), {
                type: "bi.text_button",
                height: o.height,
                rgap: this._constant.DEFAULT_RIGHT_GAP
            }),
            layouts: [{
                type: "bi.inline_vertical_adapt",
                rgap: this._constant.DEFAULT_LABEL_GAP,
                height: o.height
            }]
        });
        this.container.on(BI.ButtonGroup.EVENT_CHANGE, function (value) {
            self.fireEvent(BI.ListLabel.EVENT_CHANGE, value);
        });
        this.minTip = BI.createWidget({
            type: "bi.label",
            text: BI.i18nText("BI-No_Selected_Value"),
            disabled: true,
            height: o.height
        });
        this.maxTip = BI.createWidget({
            type: "bi.label",
            text: BI.i18nText("BI-Max_Show_40_Labels"),
            disabled: true,
            height: o.height
        });

        this.checkTipsState(o.items);
        this.right = BI.createWidget({
            type: "bi.horizontal",
            items: [this.container, this.minTip, this.maxTip],
            height: o.height
        });

        o.showTitle ? BI.createWidget({
            type: "bi.absolute",
            items: [{
                el: this.title,
                left:0,
                right:0,
                top:0,
                bottom:0,
                width: 60
            }, {
                el: this.right,
                left: 65,
                right:0,
                top:0,
                bottom:0
            }],
            element: this
        }) : BI.createWidget({
            type: "bi.horizontal",
            items: [this.right],
            element: this
        });
    },

    addItems: function (v) {
        this.checkTipsState(v);
        this.container.addItems(v.slice(0, this._constant.MAX_COLUMN_SIZE - 1));
    },

    checkTipsState: function (v) {
        if (BI.isEmptyArray(v)) {
            this.minTip.setVisible(true);
            this.container.setVisible(false);
        } else {
            this.minTip.setVisible(false);
            this.container.setVisible(true);
        }
        if (v.length >= this._constant.MAX_COLUMN_SIZE) {
            this.maxTip.setVisible(true);
        } else {
            this.maxTip.setVisible(false);
        }
    },

    removeAllItems: function () {
        this.container.removeAllItems();
    },

    getSelectedButtons: function () {
        return this.container.isVisible() ? this.container.getSelectedButtons() : [];
    },

    getAllButtons: function () {
        return this.container.getAllButtons();
    },

    setTitle: function (title) {
        this.title.setText(title + BI.i18nText("BI-Basic_Colon"));
        this.title.setTitle(title);
    },

    setItems: function (items) {
        this.removeAllItems();
        this.addItems(BI.createItems(items, {
            type: "bi.text_button",
            height: this.options.height,
            rgap: this._constant.DEFAULT_RIGHT_GAP
        }));
    },

    populate: function (v) {
        this.setTitle(v.title || BI.i18nText("BI-List_Label_Con"));
        this.setItems(v.items || []);
    },

    setValue: function (v) {
        this.container.setValue(v);
    },

    getValue: function () {
        return this.container.getValue();
    }
});

BI.ListLabel.EVENT_CHANGE = 'BI.ListLabel.EVENT_CHANGE';
$.shortcut('bi.list_label', BI.ListLabel);/**
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
$.shortcut('bi.month_combo', BI.MonthCombo);/**
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
$.shortcut("bi.month_popup", BI.MonthPopup);/**
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
            extraCls: "bi-month-trigger",
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
$.shortcut("bi.month_trigger", BI.MonthTrigger);/**
 * 新建并选中某个分组按钮
 *
 * Created by GUY on 2015/9/25.
 * @class BI.Move2GroupAddButton
 * @extends BI.BasicButton
 */
BI.Move2GroupAddButton = BI.inherit(BI.BasicButton, {

    _defaultConfig: function () {
        var conf = BI.Move2GroupAddButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + ' bi-move2group-add-button',
            shadow: true,
            isShadowShowingOnSelected: true,
            height: 30
        })
    },

    _init: function () {
        BI.Move2GroupAddButton.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.text = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            text: BI.i18nText("BI-Create_And_Move_To") + "\"江苏\"",
            height: o.height
        })
        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: {
                    type: "bi.icon_button",
                    cls: "move2group-add-font"
                },
                width: 30
            }, {
                el: this.text
            }]
        })
    },

    setValue: function (v) {
        this.text.setValue(BI.i18nText("BI-Create_And_Move_To") + "\"" + v + "\"");
        this.setTitle(BI.i18nText("BI-Create_And_Move_To") + "\"" + v + "\"", {
            container: "body"
        });
    },

    doClick: function () {
        BI.Move2GroupAddButton.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.Move2GroupAddButton.EVENT_CHANGE);
        }
    }
});
BI.Move2GroupAddButton.EVENT_CHANGE = "Move2GroupAddButton.EVENT_CHANGE";
$.shortcut('bi.move2group_add_button', BI.Move2GroupAddButton);/**
 * 移动到分组下拉框
 *
 * Created by GUY on 2015/9/25.
 * @class BI.Move2GroupCombo
 * @extends BI.Widget
 */
BI.Move2GroupCombo = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.Move2GroupCombo.superclass._defaultConfig.apply(this, arguments)
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-move2group-combo",
            height: 30,
            tipType: "warning",
            items: []
        });
    },
    _init: function () {
        BI.Move2GroupCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.trigger = BI.createWidget({
            type: "bi.button",
            text: BI.i18nText("BI-Move_To_Group"),
            title: o.title,
            height: o.height
        });

        this.tools = BI.createWidget({
            type: "bi.move2group_bar"
        });

        this.tools.on(BI.Move2GroupBar.EVENT_START, function () {
            self.combo.adjustHeight();
            self.searcher.adjustHeight();
        });
        this.tools.on(BI.Move2GroupBar.EVENT_EMPTY, function () {
            self.combo.adjustHeight();
        });
        this.tools.on(BI.Move2GroupBar.EVENT_CLICK_BUTTON, function () {
            self.fireEvent(BI.Move2GroupCombo.EVENT_CLICK_NEW_BUTTON);
            self.searcher.stopSearch();
            self.combo.hideView();
        });
        this.tools.on(BI.Move2GroupBar.EVENT_CHANGE, function () {
            this.setButtonVisible(!self.searcher.hasMatched());
            self.combo.adjustHeight();
            self.searcher.adjustHeight();
        });

        this.popup = this._createPopup(this.options.items);


        this.searcher = BI.createWidget({
            type: "bi.searcher",
            el: this.tools,
            adapter: this.popup
        });

        this.searcher.on(BI.Searcher.EVENT_CHANGE, function () {
            self.fireEvent(BI.Move2GroupCombo.EVENT_CONFIRM);
            self.combo.hideView();
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            el: this.trigger,
            isNeedAdjustWidth: false,
            popup: {
                width: 200,
                stopPropagation: false,
                el: this.popup,
                tool: this.searcher
            }
        });
        this.combo.on(BI.Combo.EVENT_CHANGE, function () {
            self.combo.hideView();
            self.fireEvent(BI.Move2GroupCombo.EVENT_CONFIRM);
        });
        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.Move2GroupCombo.EVENT_BEFORE_POPUPVIEW);
        });
        this.combo.on(BI.Combo.EVENT_AFTER_HIDEVIEW, function () {
            self.searcher.stopSearch();
        })
    },

    _createItems: function (items) {
        return BI.createItems(items, {
            type: "bi.single_select_item",
            height: 25,
            handler: function (v) {

            }
        })
    },

    _createPopup: function (items, opt) {
        return BI.createWidget(BI.extend({
            type: "bi.button_group",
            items: this._createItems(items),
            chooseType: 0,
            layouts: [{
                type: "bi.vertical"
            }]
        }, opt));
    },

    populate: function (items) {
        this.options.items = items;
        this.combo.populate(this._createItems(items));
    },

    setValue: function (v) {
        this.combo.setValue(v);
    },
    setEnable: function (enable) {
        this.combo.setEnable.apply(this.combo, arguments);
    },

    getTargetValue: function () {
        return this.tools.getValue();
    },

    getValue: function () {
        var value = this.searcher.getValue();
        return value[0];

    }
});
BI.Move2GroupCombo.EVENT_BEFORE_POPUPVIEW = "Move2GroupCombo.EVENT_BEFORE_POPUPVIEW";
BI.Move2GroupCombo.EVENT_CHANGE = "Move2GroupCombo.EVENT_CHANGE";
BI.Move2GroupCombo.EVENT_CONFIRM = "Move2GroupCombo.EVENT_CONFIRM";
BI.Move2GroupCombo.EVENT_CLICK_NEW_BUTTON = "Move2GroupCombo.EVENT_CLICK_NEW_BUTTON";
$.shortcut('bi.move2group_combo', BI.Move2GroupCombo);/**
 * guy
 * 复选导航条
 * Created by GUY on 2015/9/25.
 * @class BI.Move2GroupBar
 * @extends BI.Widget
 */
BI.Move2GroupBar = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.Move2GroupBar.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-move2group-bar"
        })
    },
    _init: function () {
        BI.Move2GroupBar.superclass._init.apply(this, arguments);
        var self = this;
        this.search = BI.createWidget({
            type: "bi.text_editor",
            watermark: BI.i18nText("BI-Search_And_Create_Group"),
            allowBlank: true
        });

        this.search.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });


        this.search.on(BI.TextEditor.EVENT_CHANGE, function () {
            self.button.setValue(this.getValue());
            if (this.getValue() !== "") {
                self.fireEvent(BI.Move2GroupBar.EVENT_CHANGE);
            }
        });

        this.search.on(BI.TextEditor.EVENT_EMPTY, function () {
            self.button.invisible();
            self.fireEvent(BI.Move2GroupBar.EVENT_EMPTY);
        });

        this.search.on(BI.TextEditor.EVENT_START, function () {
            self.button.visible();
            self.fireEvent(BI.Move2GroupBar.EVENT_START);
        });

        this.button = BI.createWidget({
            type: "bi.move2group_add_button"
        });

        this.button.on(BI.Move2GroupAddButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.Move2GroupBar.EVENT_CLICK_BUTTON);
        });

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            vgap: 5,
            hgap: 5,
            items: [this.search, this.button]
        });

        this.button.invisible();
    },

    blur: function(){
        this.search.blur();
    },

    setButtonVisible: function (b) {
        this.button.setVisible(b);
    },

    getValue: function () {
        return this.search.getValue();
    },

    setValue: function (v) {
        this.search.setValue(v);
        this.button.setValue(v);
    }
});
BI.Move2GroupBar.EVENT_START = "Move2GroupBar.EVENT_START";
BI.Move2GroupBar.EVENT_EMPTY = "Move2GroupBar.EVENT_EMPTY";
BI.Move2GroupBar.EVENT_CHANGE = "Move2GroupBar.EVENT_CHANGE";
BI.Move2GroupBar.EVENT_CLICK_BUTTON = "Move2GroupBar.EVENT_CLICK_BUTTON";
$.shortcut("bi.move2group_bar", BI.Move2GroupBar);/**
 * Created by fay on 2016/9/14.
 */
BI.TextLabelItemGroup = BI.inherit(BI.ButtonGroup, {
    _defaultConfig: function () {
        return BI.extend(BI.TextLabelItemGroup.superclass._defaultConfig.apply(this, arguments), {
            chooseType: BI.Selection.Multi
        });
    },

    _init: function () {
        BI.TextLabelItemGroup.superclass._init.apply(this, arguments);
        this._checkBtnStyle();
    },

    _btnsCreator: function (items) {
        var self = this, args = Array.prototype.slice.call(arguments), o = this.options;
        var buttons = this._createBtns(items);
        args[0] = buttons;

        BI.each(this.behaviors, function (i, behavior) {
            behavior.doBehavior.apply(behavior, args);
        });
        BI.each(buttons, function (i, btn) {
            btn.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
                if (type === BI.Events.CLICK) {
                    switch (o.chooseType) {
                        case BI.ButtonGroup.CHOOSE_TYPE_MULTI:
                            if (BI.isEmptyString(btn.getValue())) {
                                self.setValue([]);
                            } else {
                                self._checkBtnStyle();
                            }
                            break;
                        case BI.ButtonGroup.CHOOSE_TYPE_SINGLE:
                            self.setValue(btn.getValue());
                            break;
                        case BI.ButtonGroup.CHOOSE_TYPE_NONE:
                            self.setValue([]);
                            break;
                    }
                    self.fireEvent(BI.ButtonGroup.EVENT_CHANGE, value, obj);
                }
                self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            });
            btn.on(BI.Events.DESTROY, function () {
                BI.remove(self.buttons, btn);
            })
        });

        return buttons;
    },

    _checkBtnStyle: function () {
        var self = this;
        var flag = BI.isEmptyArray(this.getValue());
        BI.each(this.buttons, function (idx, btn) {
            if (flag && BI.isEmptyString(btn.getValue())) {
                btn.setSelected(true);
                btn.doHighLight();
            }
            if (!flag && BI.isEmptyString(btn.getValue())) {
                btn.setSelected(false);
                btn.unHighLight();
            }
            if (btn.isSelected()) {
                btn.doHighLight();
            } else {
                btn.unHighLight();
            }
        });
    },

    setValue: function (v) {
        BI.TextLabelItemGroup.superclass.setValue.apply(this, arguments);
        this._checkBtnStyle();
    }
});

$.shortcut('bi.text_label_item_group', BI.TextLabelItemGroup);
/**
 * 文本标签
 *
 * Created by fay on 2016/9/11.
 */
BI.TextLabel = BI.inherit(BI.Widget, {

    _constant: {
        MAX_COLUMN_SIZE: 40
    },

    _defaultConfig: function () {
        return BI.extend(BI.TextLabel.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-text-label",
            title: ""
        })
    },

    _init: function () {
        BI.TextLabel.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var title = BI.createWidget({
            type: "bi.label",
            text: o.title + ":"
        });
        this.container = BI.createWidget({
            type: "bi.text_label_item_group",
            items: BI.createItems(o.items.slice(0, this._constant.MAX_COLUMN_SIZE), {
                type: "bi.text_button"
            }),
            layouts: [{
                type: "bi.horizontal",

            }]
        });

        BI.createWidget({
            type: "bi.horizontal",
            items: [title, this.container],
            element: this
        })
    },
    
    setValue: function (v) {
        this.container.setValue(v);
    },
    
    getValue: function () {
        return this.container.getValue();
    }
});

$.shortcut('bi.text_label', BI.TextLabel);(function ($) {
    /**
     * 普通控件
     *
     * @class BI.MultiDateCard
     * @extends BI.Widget
     * @abstract
     */
    BI.MultiDateCard = BI.inherit(BI.Widget, {

        constants: {
            lgap: 80,
            itemHeight: 35,
            defaultEditorValue: "1"
        },

        _defaultConfig: function () {
            return $.extend(BI.MultiDateCard.superclass._defaultConfig.apply(this, arguments), {});
        },

        dateConfig: function () {

        },

        defaultSelectedItem: function () {

        },

        _init: function () {
            BI.MultiDateCard.superclass._init.apply(this, arguments);
            var self = this, opts = this.options;

            this.label = BI.createWidget({
                type: 'bi.label',
                height: this.constants.itemHeight,
                textAlign: "left",
                text: BI.i18nText("BI-Multi_Date_Relative_Current_Time"),
                cls: 'bi-multidate-inner-label'
            });
            this.radioGroup = BI.createWidget({
                type: "bi.button_group",
                chooseType: 0,
                items: BI.createItems(this.dateConfig(), {
                    type: 'bi.multidate_segment',
                    height: this.constants.itemHeight
                }),
                layouts: [{
                    type: "bi.vertical"
                }]
            });

            this.radioGroup.on(BI.Controller.EVENT_CHANGE, function (type) {
                if (type === BI.Events.CONFIRM) {
                    self.fireEvent(BI.MultiDateCard.EVENT_CHANGE);
                }
            });
            this.radioGroup.on(BI.ButtonGroup.EVENT_CHANGE, function () {
                self.setValue(self.getValue());
                self.fireEvent(BI.MultiDateCard.EVENT_CHANGE);
            });
            BI.createWidget({
                element: this,
                type: 'bi.center_adapt',
                lgap: this.constants.lgap,
                items: [{
                    type: 'bi.vertical',
                    items: [this.label, this.radioGroup]
                }]
            });
        },

        getValue: function () {
            var button = this.radioGroup.getSelectedButtons()[0];
            var type = button.getValue(), value = button.getInputValue();
            return {
                type: type,
                value: value
            }
        },

        _isTypeAvaliable: function (type) {
            var res = false;
            BI.find(this.dateConfig(), function (i, item) {
                if (item.value === type) {
                    res = true;
                    return true;
                }
            });
            return res;
        },

        setValue: function (v) {
            var self = this;
            if (BI.isNotNull(v) && this._isTypeAvaliable(v.type)) {
                this.radioGroup.setValue(v.type);
                BI.each(this.radioGroup.getAllButtons(), function (i, button) {
                    if (button.isEditorExist() === true && button.isSelected()) {
                        button.setInputValue(v.value);
                        button.setEnable(true);
                    } else {
                        button.setInputValue(self.constants.defaultEditorValue);
                        button.setEnable(false);
                    }
                });
            } else {
                this.radioGroup.setValue(this.defaultSelectedItem());
                BI.each(this.radioGroup.getAllButtons(), function (i, button) {
                    button.setInputValue(self.constants.defaultEditorValue);
                    if (button.isEditorExist() === true && button.isSelected()) {
                        button.setEnable(true);
                    } else {
                        button.setEnable(false);
                    }
                });
            }
        },

        getCalculationValue: function () {
            var valueObject = this.getValue();
            var type = valueObject.type, value = valueObject.value;
            switch (type) {
                case BICst.MULTI_DATE_DAY_PREV:
                    return new Date().getOffsetDate(-1 * value);
                case BICst.MULTI_DATE_DAY_AFTER:
                    return new Date().getOffsetDate(value);
                case BICst.MULTI_DATE_DAY_TODAY:
                    return new Date();
                case BICst.MULTI_DATE_MONTH_PREV:
                    return new Date().getBeforeMultiMonth(value);
                case BICst.MULTI_DATE_MONTH_AFTER:
                    return new Date().getAfterMultiMonth(value);
                case BICst.MULTI_DATE_MONTH_BEGIN:
                    return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
                case BICst.MULTI_DATE_MONTH_END:
                    return new Date(new Date().getFullYear(), new Date().getMonth(), (new Date().getLastDateOfMonth()).getDate());
                case BICst.MULTI_DATE_QUARTER_PREV:
                    return new Date().getBeforeMulQuarter(value);
                case BICst.MULTI_DATE_QUARTER_AFTER:
                    return new Date().getAfterMulQuarter(value);
                case BICst.MULTI_DATE_QUARTER_BEGIN:
                    return new Date().getQuarterStartDate();
                case BICst.MULTI_DATE_QUARTER_END:
                    return new Date().getQuarterEndDate();
                case BICst.MULTI_DATE_WEEK_PREV:
                    return new Date().getOffsetDate(-7 * value);
                case BICst.MULTI_DATE_WEEK_AFTER:
                    return new Date().getOffsetDate(7 * value);
                case BICst.MULTI_DATE_YEAR_PREV:
                    return new Date((new Date().getFullYear() - 1 * value), new Date().getMonth(), new Date().getDate());
                case BICst.MULTI_DATE_YEAR_AFTER:
                    return new Date((new Date().getFullYear() + 1 * value), new Date().getMonth(), new Date().getDate());
                case BICst.MULTI_DATE_YEAR_BEGIN:
                    return new Date(new Date().getFullYear(), 0, 1);
                case BICst.MULTI_DATE_YEAR_END:
                    return new Date(new Date().getFullYear(), 11, 31);
            }
        }
    });
    BI.MultiDateCard.EVENT_CHANGE = "EVENT_CHANGE";
})(jQuery);BICst.MULTI_DATE_YMD_CARD = 1;
BICst.MULTI_DATE_YEAR_CARD = 2;
BICst.MULTI_DATE_QUARTER_CARD = 3;
BICst.MULTI_DATE_MONTH_CARD = 4;
BICst.MULTI_DATE_WEEK_CARD = 5;
BICst.MULTI_DATE_DAY_CARD = 6;
BICst.MULTI_DATE_SEGMENT_NUM = {};
BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_YEAR_PREV] = BI.i18nText("BI-Multi_Date_Year_Prev");
BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_YEAR_AFTER] = BI.i18nText("BI-Multi_Date_Year_Next");
BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_YEAR_BEGIN] = BI.i18nText("BI-Multi_Date_Year_Begin");
BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_YEAR_END] = BI.i18nText("BI-Multi_Date_Year_End");

BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_QUARTER_PREV] = BI.i18nText("BI-Multi_Date_Quarter_Prev");
BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_QUARTER_AFTER] = BI.i18nText("BI-Multi_Date_Quarter_Next");
BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_QUARTER_BEGIN] = BI.i18nText("BI-Multi_Date_Quarter_Begin");
BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_QUARTER_END] = BI.i18nText("BI-Multi_Date_Quarter_End");

BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_MONTH_PREV] = BI.i18nText("BI-Multi_Date_Month_Prev");
BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_MONTH_AFTER] = BI.i18nText("BI-Multi_Date_Month_Next");
BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_MONTH_BEGIN] = BI.i18nText("BI-Multi_Date_Month_Begin");
BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_MONTH_END] = BI.i18nText("BI-Multi_Date_Month_End");

BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_WEEK_PREV] = BI.i18nText("BI-Multi_Date_Week_Prev");
BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_WEEK_AFTER] = BI.i18nText("BI-Multi_Date_Week_Next");

BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_DAY_PREV] = BI.i18nText("BI-Multi_Date_Day_Prev");
BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_DAY_AFTER] = BI.i18nText("BI-Multi_Date_Day_Next");
BICst.MULTI_DATE_SEGMENT_NUM[BICst.MULTI_DATE_DAY_TODAY] = BI.i18nText("BI-Multi_Date_Today");

(function ($) {
    /**
     * 日期控件
     * @class BI.MultiDateCombo
     * @extends BI.Widget
     */
    BI.MultiDateCombo = BI.inherit(BI.Single, {
        constants: {
            popupHeight: 259,
            popupWidth: 270,
            comboAdjustHeight: 1,
            border: 1,
            DATE_MIN_VALUE: "1900-01-01",
            DATE_MAX_VALUE: "2099-12-31"
        },
        _defaultConfig: function () {
            return BI.extend(BI.MultiDateCombo.superclass._defaultConfig.apply(this, arguments), {
                baseCls: 'bi-multidate-combo',
                height: 24
            });
        },
        _init: function () {
            BI.MultiDateCombo.superclass._init.apply(this, arguments);
            var self = this, opts = this.options;
            this.storeTriggerValue = "";
            var date = new Date();
            this.storeValue = null;
            this.trigger = BI.createWidget({
                type: 'bi.date_trigger',
                min: this.constants.DATE_MIN_VALUE,
                max: this.constants.DATE_MAX_VALUE
            });
            this.trigger.on(BI.DateTrigger.EVENT_KEY_DOWN, function(){
                if(self.combo.isViewVisible()){
                    self.combo.hideView();
                }
            });
            this.trigger.on(BI.DateTrigger.EVENT_STOP, function(){
                if(!self.combo.isViewVisible()){
                    self.combo.showView();
                }
            });
            this.trigger.on(BI.DateTrigger.EVENT_TRIGGER_CLICK, function(){
                self.combo.toggle();
            });
            this.trigger.on(BI.DateTrigger.EVENT_FOCUS, function () {
                self.storeTriggerValue = self.trigger.getKey();
                if(!self.combo.isViewVisible()){
                    self.combo.showView();
                }
                self.fireEvent(BI.MultiDateCombo.EVENT_FOCUS);
            });
            this.trigger.on(BI.DateTrigger.EVENT_ERROR, function () {
                self.storeValue = {
                    year: date.getFullYear(),
                    month: date.getMonth()
                };
                self.popup.setValue();
                self.fireEvent(BI.MultiDateCombo.EVENT_ERROR);
            });
            this.trigger.on(BI.DateTrigger.EVENT_VALID, function () {
                self.fireEvent(BI.MultiDateCombo.EVENT_VALID);
            });
            this.trigger.on(BI.DateTrigger.EVENT_CHANGE, function () {
                self.fireEvent(BI.MultiDateCombo.EVENT_CHANGE);
            });
            this.trigger.on(BI.DateTrigger.EVENT_CONFIRM, function () {
                if(self.combo.isViewVisible()) {
                    return;
                }
                var dateStore = self.storeTriggerValue;
                var dateObj = self.trigger.getKey();
                if (BI.isNotEmptyString(dateObj) && !BI.isEqual(dateObj, dateStore)) {
                    self.storeValue = self.trigger.getValue();
                    self.setValue(self.trigger.getValue());
                } else if (BI.isEmptyString(dateObj)) {
                    self.storeValue = null;
                    self.trigger.setValue();
                }
                self.fireEvent(BI.MultiDateCombo.EVENT_CONFIRM);
            });
            this.popup = BI.createWidget({
                type: "bi.multidate_popup",
                min: this.constants.DATE_MIN_VALUE,
                max: this.constants.DATE_MAX_VALUE
            });
            this.popup.on(BI.MultiDatePopup.BUTTON_CLEAR_EVENT_CHANGE, function () {
                self.setValue();
                self.combo.hideView();
                self.fireEvent(BI.MultiDateCombo.EVENT_CONFIRM);
            });
            this.popup.on(BI.MultiDatePopup.BUTTON_lABEL_EVENT_CHANGE, function () {
                var date = new Date();
                self.setValue({
                    year: date.getFullYear(),
                    month: date.getMonth(),
                    day: date.getDate()
                });
                self.combo.hideView();
                self.fireEvent(BI.MultiDateCombo.EVENT_CONFIRM);
            });
            this.popup.on(BI.MultiDatePopup.BUTTON_OK_EVENT_CHANGE, function () {
                self.setValue(self.popup.getValue());
                self.combo.hideView();
                self.fireEvent(BI.MultiDateCombo.EVENT_CONFIRM);
            });
            this.popup.on(BI.MultiDatePopup.CALENDAR_EVENT_CHANGE, function () {
                self.setValue(self.popup.getValue());
                self.combo.hideView();
                //self.fireEvent(BI.MultiDateCombo.EVENT_CHANGE);
                self.fireEvent(BI.MultiDateCombo.EVENT_CONFIRM);
            });
            this.combo = BI.createWidget({
                type: 'bi.combo',
                toggle: false,
                isNeedAdjustHeight: false,
                isNeedAdjustWidth: false,
                el: this.trigger,
                adjustLength: this.constants.comboAdjustHeight,
                popup: {
                    el: this.popup,
                    maxHeight: this.constants.popupHeight,
                    width: this.constants.popupWidth,
                    stopPropagation: false
                }
            });
            this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
                self.popup.setValue(self.storeValue);
                self.fireEvent(BI.MultiDateCombo.EVENT_BEFORE_POPUPVIEW);
            });

            var triggerBtn = BI.createWidget({
                type: "bi.trigger_icon_button",
                cls: "bi-trigger-date-button chart-date-normal-font",
                width: 30,
                height: 23
            });
            triggerBtn.on(BI.TriggerIconButton.EVENT_CHANGE, function () {
                if (self.combo.isViewVisible()) {
                    self.combo.hideView();
                } else {
                    self.combo.showView();
                }
            });
            this.changeIcon = BI.createWidget({
                type: "bi.icon_button",
                cls: "bi-trigger-date-change widget-date-h-change-font",
                width: 30,
                height: 23,
                invisible: true
            });


            BI.createWidget({
                type: "bi.absolute",
                element: this,
                items: [{
                    el: this.combo,
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }, {
                    el: triggerBtn,
                    top: 0,
                    left: 0
                }, {
                    el: this.changeIcon,
                    top: 0,
                    right: 0
                }]
            })
        },

        _checkDynamicValue: function(v){
            var type = null;
            if (BI.isNotNull(v)) {
                type = v.type
            }
            switch (type){
                case BICst.MULTI_DATE_YEAR_PREV:
                case BICst.MULTI_DATE_YEAR_AFTER:
                case BICst.MULTI_DATE_YEAR_BEGIN:
                case BICst.MULTI_DATE_YEAR_END:
                case BICst.MULTI_DATE_QUARTER_PREV:
                case BICst.MULTI_DATE_QUARTER_AFTER:
                case BICst.MULTI_DATE_QUARTER_BEGIN:
                case BICst.MULTI_DATE_QUARTER_END:
                case BICst.MULTI_DATE_MONTH_PREV:
                case BICst.MULTI_DATE_MONTH_AFTER:
                case BICst.MULTI_DATE_MONTH_BEGIN:
                case BICst.MULTI_DATE_MONTH_END:
                case BICst.MULTI_DATE_WEEK_PREV:
                case BICst.MULTI_DATE_WEEK_AFTER:
                case BICst.MULTI_DATE_DAY_PREV:
                case BICst.MULTI_DATE_DAY_AFTER:
                case BICst.MULTI_DATE_DAY_TODAY:
                    this.changeIcon.setVisible(true);
                    break;
                default:
                    this.changeIcon.setVisible(false);
                    break;
            }
        },

        setValue: function (v) {
            this.storeValue = v;
            this.popup.setValue(v);
            this.trigger.setValue(v);
            this._checkDynamicValue(v)
        },
        getValue: function () {
            return this.storeValue;
        },
        getKey: function(){
            return this.trigger.getKey();
        },
        hidePopupView: function () {
            this.combo.hideView();
        }
    });
    $.shortcut('bi.multidate_combo', BI.MultiDateCombo);

    BI.MultiDateCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
    BI.MultiDateCombo.EVENT_FOCUS = "EVENT_FOCUS";
    BI.MultiDateCombo.EVENT_CHANGE = "EVENT_CHANGE";
    BI.MultiDateCombo.EVENT_VALID = "EVENT_VALID";
    BI.MultiDateCombo.EVENT_ERROR = "EVENT_ERROR";
    BI.MultiDateCombo.EVENT_BEFORE_POPUPVIEW = "BI.MultiDateCombo.EVENT_BEFORE_POPUPVIEW";
})(jQuery);(function ($) {
    /**
     * 普通控件
     *
     * @class BI.DayCard
     * @extends BI.MultiDateCard
     */
    BI.DayCard = BI.inherit(BI.MultiDateCard, {

        _defaultConfig: function () {
            return $.extend(BI.DayCard.superclass._defaultConfig.apply(this, arguments), {
                baseCls: 'bi-multidate-daycard'
            });
        },

        _init: function () {
            BI.DayCard.superclass._init.apply(this, arguments);
        },

        dateConfig: function(){
            return [{
                isEditorExist: true,
                selected: true,
                text: BI.i18nText("BI-Multi_Date_Day_Prev"),
                value: BICst.MULTI_DATE_DAY_PREV
            },
                {
                    isEditorExist: true,
                    text: BI.i18nText("BI-Multi_Date_Day_Next"),
                    value: BICst.MULTI_DATE_DAY_AFTER
                },
                {
                    isEditorExist: false,
                    value: BICst.MULTI_DATE_DAY_TODAY,
                    text: BI.i18nText("BI-Multi_Date_Today")
                }];
        },

        defaultSelectedItem: function(){
            return BICst.MULTI_DATE_DAY_PREV
        }
    });
    BI.DayCard.EVENT_CHANGE = "EVENT_CHANGE";
    $.shortcut('bi.daycard', BI.DayCard);
})(jQuery);;
(function ($) {

    /**
     * 普通控件
     *
     * @class BI.MonthCard
     * @extends BI.MultiDateCard
     */
    BI.MonthCard = BI.inherit(BI.MultiDateCard, {
        _defaultConfig: function () {
            return $.extend(BI.MonthCard.superclass._defaultConfig.apply(this, arguments), {
                baseCls: 'bi-multidate-monthcard'
            });
        },

        _init: function () {
            BI.MonthCard.superclass._init.apply(this, arguments);
        },

        dateConfig: function(){
            return [{
                selected: true,
                isEditorExist: true,
                value: BICst.MULTI_DATE_MONTH_PREV,
                text: BI.i18nText("BI-Multi_Date_Month_Prev")
            },
                {
                    isEditorExist: true,
                    value: BICst.MULTI_DATE_MONTH_AFTER,
                    text: BI.i18nText("BI-Multi_Date_Month_Next")
                },
                {
                    value: BICst.MULTI_DATE_MONTH_BEGIN,
                    isEditorExist: false,
                    text: BI.i18nText("BI-Multi_Date_Month_Begin")
                },
                {
                    value: BICst.MULTI_DATE_MONTH_END,
                    isEditorExist: false,
                    text: BI.i18nText("BI-Multi_Date_Month_End")
                }];
        },

        defaultSelectedItem: function(){
            return BICst.MULTI_DATE_MONTH_PREV;
        }
    });
    BI.MonthCard.EVENT_CHANGE = "EVENT_CHANGE";
    $.shortcut('bi.monthcard', BI.MonthCard);
})(jQuery);(function ($) {
    /**
     * 日期控件
     * @class BI.MultiDatePopup
     * @extends BI.Widget
     */
    BI.MultiDatePopup = BI.inherit(BI.Widget, {
        constants: {
            tabHeight: 30,
            tabWidth: 42,
            titleHeight: 27,
            itemHeight: 30,
            triggerHeight: 24,
            buttonWidth: 90,
            buttonHeight: 25,
            cardHeight: 229,
            cardWidth: 270,
            popupHeight: 259,
            popupWidth: 270,
            comboAdjustHeight: 1,
            ymdWidth: 58,
            lgap: 2,
            border: 1
        },
        _defaultConfig: function () {
            return BI.extend(BI.MultiDatePopup.superclass._defaultConfig.apply(this, arguments), {
                baseCls: 'bi-multidate-popup',
                width: 268,
                height: 260
            });
        },
        _init: function () {
            BI.MultiDatePopup.superclass._init.apply(this, arguments);
            var self = this, opts = this.options;
            this.storeValue = "";
            this.textButton = BI.createWidget({
                type: 'bi.text_button',
                forceCenter: true,
                cls: 'bi-multidate-popup-label',
                shadow: true,
                text: BI.i18nText("BI-Multi_Date_Today")
            });
            this.textButton.on(BI.TextButton.EVENT_CHANGE, function () {
                self.fireEvent(BI.MultiDatePopup.BUTTON_lABEL_EVENT_CHANGE);
            });
            this.clearButton = BI.createWidget({
                type: "bi.text_button",
                forceCenter: true,
                cls: 'bi-multidate-popup-button',
                shadow: true,
                text: BI.i18nText("BI-Basic_Clear")
            });
            this.clearButton.on(BI.TextButton.EVENT_CHANGE, function () {
                self.fireEvent(BI.MultiDatePopup.BUTTON_CLEAR_EVENT_CHANGE);
            });
            this.okButton = BI.createWidget({
                type: "bi.text_button",
                forceCenter: true,
                cls: 'bi-multidate-popup-button',
                shadow: true,
                text: BI.i18nText("BI-Basic_OK")
            });
            this.okButton.on(BI.TextButton.EVENT_CHANGE, function () {
                self.fireEvent(BI.MultiDatePopup.BUTTON_OK_EVENT_CHANGE);
            });
            this.dateTab = BI.createWidget({
                type: 'bi.tab',
                tab: {
                    cls: "bi-multidate-popup-tab",
                    height: this.constants.tabHeight,
                    items: BI.createItems([{
                        text: BI.i18nText("BI-Multi_Date_YMD"),
                        value: BICst.MULTI_DATE_YMD_CARD,
                        width: this.constants.ymdWidth
                    }, {
                        text: BI.i18nText("BI-Multi_Date_Year"),
                        value: BICst.MULTI_DATE_YEAR_CARD
                    }, {
                        text: BI.i18nText("BI-Multi_Date_Quarter"),
                        value: BICst.MULTI_DATE_QUARTER_CARD
                    }, {
                        text: BI.i18nText("BI-Multi_Date_Month"),
                        value: BICst.MULTI_DATE_MONTH_CARD
                    }, {
                        text: BI.i18nText("BI-Multi_Date_Week"),
                        value: BICst.MULTI_DATE_WEEK_CARD
                    }, {
                        text: BI.i18nText("BI-Multi_Date_Day"),
                        value: BICst.MULTI_DATE_DAY_CARD
                    }], {
                        width: this.constants.tabWidth,
                        textAlign: "center",
                        height: this.constants.itemHeight,
                        cls: 'bi-multidate-popup-item'
                    }),
                    layouts: [{
                        type: 'bi.left'
                    }]
                },
                cardCreator: function (v) {
                    switch (v) {
                        case BICst.MULTI_DATE_YMD_CARD:
                            self.ymd = BI.createWidget({
                                type: "bi.date_calendar_popup",
                                min: self.options.min,
                                max: self.options.max
                            });
                            self.ymd.on(BI.DateCalendarPopup.EVENT_CHANGE, function () {
                                self.fireEvent(BI.MultiDatePopup.CALENDAR_EVENT_CHANGE);
                            });
                            return self.ymd;
                        case BICst.MULTI_DATE_YEAR_CARD:
                            self.year = BI.createWidget({
                                type: "bi.yearcard"
                            });
                            self.year.on(BI.MultiDateCard.EVENT_CHANGE, function (v) {
                                self._setInnerValue(self.year, v);
                            });
                            return self.year;
                        case BICst.MULTI_DATE_QUARTER_CARD:
                            self.quarter = BI.createWidget({
                                type: 'bi.quartercard'
                            });
                            self.quarter.on(BI.MultiDateCard.EVENT_CHANGE, function (v) {
                                self._setInnerValue(self.quarter, v);
                            });
                            return self.quarter;
                        case BICst.MULTI_DATE_MONTH_CARD:
                            self.month = BI.createWidget({
                                type: 'bi.monthcard'
                            });
                            self.month.on(BI.MultiDateCard.EVENT_CHANGE, function (v) {
                                self._setInnerValue(self.month, v);
                            });
                            return self.month;
                        case BICst.MULTI_DATE_WEEK_CARD:
                            self.week = BI.createWidget({
                                type: 'bi.weekcard'
                            });
                            self.week.on(BI.MultiDateCard.EVENT_CHANGE, function (v) {
                                self._setInnerValue(self.week, v);
                            });
                            return self.week;
                        case BICst.MULTI_DATE_DAY_CARD:
                            self.day = BI.createWidget({
                                type: 'bi.daycard'
                            });
                            self.day.on(BI.MultiDateCard.EVENT_CHANGE, function (v) {
                                self._setInnerValue(self.day, v);
                            });
                            return self.day;
                    }
                }
            });
            this.dateTab.setSelect(BICst.MULTI_DATE_YMD_CARD);
            this.cur = BICst.MULTI_DATE_YMD_CARD;
            this.dateTab.on(BI.Tab.EVENT_CHANGE, function () {
                var v = self.dateTab.getSelect();
                switch (v) {
                    case BICst.MULTI_DATE_YMD_CARD:
                        var date = this.getTab(self.cur).getCalculationValue();
                        self.ymd.setValue({
                            year: date.getFullYear(),
                            month: date.getMonth(),
                            day: date.getDate()
                        });
                        self._setInnerValue(self.ymd);
                        break;
                    case BICst.MULTI_DATE_YEAR_CARD:
                        self.year.setValue(self.storeValue);
                        self._setInnerValue(self.year);
                        break;
                    case BICst.MULTI_DATE_QUARTER_CARD:
                        self.quarter.setValue(self.storeValue);
                        self._setInnerValue(self.quarter);
                        break;
                    case BICst.MULTI_DATE_MONTH_CARD:
                        self.month.setValue(self.storeValue);
                        self._setInnerValue(self.month);
                        break;
                    case BICst.MULTI_DATE_WEEK_CARD:
                        self.week.setValue(self.storeValue);
                        self._setInnerValue(self.week);
                        break;
                    case BICst.MULTI_DATE_DAY_CARD:
                        self.day.setValue(self.storeValue);
                        self._setInnerValue(self.day);
                        break;
                }
                self.cur = v;
            });
            this.dateButton = BI.createWidget({
                type: "bi.grid",
                items: [[this.clearButton, this.textButton, this.okButton]]
            });
            BI.createWidget({
                element: this,
                type: "bi.vtape",
                items: [{
                    el: this.dateTab
                }, {
                    el: this.dateButton,
                    height: 30
                }]
            });
        },
        _setInnerValue: function (obj) {
            if (this.dateTab.getSelect() === BICst.MULTI_DATE_YMD_CARD) {
                this.textButton.setValue(BI.i18nText("BI-Multi_Date_Today"));
                this.textButton.setEnable(true);
            } else {
                var date = obj.getCalculationValue();
                date = date.print("%Y-%x-%e");
                this.textButton.setValue(date);
                this.textButton.setEnable(false);
            }
        },
        setValue: function (v) {
            this.storeValue = v;
            var self = this, date;
            var type, value;
            if (BI.isNotNull(v)) {
                type = v.type || BICst.MULTI_DATE_CALENDAR; value = v.value;
                if(BI.isNull(value)){
                    value = v;
                }
            }
            switch (type) {
                case BICst.MULTI_DATE_YEAR_PREV:
                case BICst.MULTI_DATE_YEAR_AFTER:
                case BICst.MULTI_DATE_YEAR_BEGIN:
                case BICst.MULTI_DATE_YEAR_END:
                    this.dateTab.setSelect(BICst.MULTI_DATE_YEAR_CARD);
                    this.year.setValue({type: type, value: value});
                    this.cur = BICst.MULTI_DATE_YEAR_CARD;
                    self._setInnerValue(this.year);
                    break;
                case BICst.MULTI_DATE_QUARTER_PREV:
                case BICst.MULTI_DATE_QUARTER_AFTER:
                case BICst.MULTI_DATE_QUARTER_BEGIN:
                case BICst.MULTI_DATE_QUARTER_END:
                    this.dateTab.setSelect(BICst.MULTI_DATE_QUARTER_CARD);
                    this.cur = BICst.MULTI_DATE_QUARTER_CARD;
                    this.quarter.setValue({type: type, value: value});
                    self._setInnerValue(this.quarter);
                    break;
                case BICst.MULTI_DATE_MONTH_PREV:
                case BICst.MULTI_DATE_MONTH_AFTER:
                case BICst.MULTI_DATE_MONTH_BEGIN:
                case BICst.MULTI_DATE_MONTH_END:
                    this.dateTab.setSelect(BICst.MULTI_DATE_MONTH_CARD);
                    this.cur = BICst.MULTI_DATE_MONTH_CARD;
                    this.month.setValue({type: type, value: value});
                    self._setInnerValue(this.month);
                    break;
                case BICst.MULTI_DATE_WEEK_PREV:
                case BICst.MULTI_DATE_WEEK_AFTER:
                    this.dateTab.setSelect(BICst.MULTI_DATE_WEEK_CARD);
                    this.cur = BICst.MULTI_DATE_WEEK_CARD;
                    this.week.setValue({type: type, value: value});
                    self._setInnerValue(this.week);
                    break;
                case BICst.MULTI_DATE_DAY_PREV:
                case BICst.MULTI_DATE_DAY_AFTER:
                case BICst.MULTI_DATE_DAY_TODAY:
                    this.dateTab.setSelect(BICst.MULTI_DATE_DAY_CARD);
                    this.cur = BICst.MULTI_DATE_DAY_CARD;
                    this.day.setValue({type: type, value: value});
                    self._setInnerValue(this.day);
                    break;
                default:
                    if (BI.isNull(value) || BI.isEmptyObject(value)) {
                        var date = new Date();
                        this.dateTab.setSelect(BICst.MULTI_DATE_YMD_CARD);
                        this.ymd.setValue({
                            year: date.getFullYear(),
                            month: date.getMonth(),
                            day: date.getDate()
                        });
                        this.textButton.setValue(BI.i18nText("BI-Multi_Date_Today"));
                    } else {
                        this.dateTab.setSelect(BICst.MULTI_DATE_YMD_CARD);
                        this.ymd.setValue(value);
                        this.textButton.setValue(BI.i18nText("BI-Multi_Date_Today"));
                    }
                    this.textButton.setEnable(true);
                    break;
            }
        },
        getValue: function () {
            var tab = this.dateTab.getSelect();
            switch (tab) {
                case BICst.MULTI_DATE_YMD_CARD:
                    return this.ymd.getValue();
                case BICst.MULTI_DATE_YEAR_CARD:
                    return this.year.getValue();
                case BICst.MULTI_DATE_QUARTER_CARD:
                    return this.quarter.getValue();
                case BICst.MULTI_DATE_MONTH_CARD:
                    return this.month.getValue();
                case BICst.MULTI_DATE_WEEK_CARD:
                    return this.week.getValue();
                case BICst.MULTI_DATE_DAY_CARD:
                    return this.day.getValue();
            }
        }
    });
    BI.MultiDatePopup.BUTTON_OK_EVENT_CHANGE = "BUTTON_OK_EVENT_CHANGE";
    BI.MultiDatePopup.BUTTON_lABEL_EVENT_CHANGE = "BUTTON_lABEL_EVENT_CHANGE";
    BI.MultiDatePopup.BUTTON_CLEAR_EVENT_CHANGE = "BUTTON_CLEAR_EVENT_CHANGE";
    BI.MultiDatePopup.CALENDAR_EVENT_CHANGE = "CALENDAR_EVENT_CHANGE";
    $.shortcut('bi.multidate_popup', BI.MultiDatePopup);
})(jQuery);(function ($) {

    /**
     * 普通控件
     *
     * @class BI.QuarterCard
     * @extends BI.MultiDateCard
     */
    BI.QuarterCard = BI.inherit(BI.MultiDateCard, {

        _defaultConfig: function () {
            return $.extend(BI.QuarterCard.superclass._defaultConfig.apply(this, arguments), {
                baseCls: 'bi-multidate-quartercard'
            });
        },

        _init: function () {
            BI.QuarterCard.superclass._init.apply(this, arguments);
        },

        dateConfig: function(){
            return [{
                selected: true,
                value: BICst.MULTI_DATE_QUARTER_PREV,
                isEditorExist: true,
                text: BI.i18nText("BI-Multi_Date_Quarter_Prev")
            },
                {
                    value: BICst.MULTI_DATE_QUARTER_AFTER,
                    isEditorExist: true,
                    text: BI.i18nText("BI-Multi_Date_Quarter_Next")
                },
                {
                    value: BICst.MULTI_DATE_QUARTER_BEGIN,
                    isEditorExist: false,
                    text: BI.i18nText("BI-Multi_Date_Quarter_Begin")
                },
                {
                    value: BICst.MULTI_DATE_QUARTER_END,
                    isEditorExist: false,
                    text: BI.i18nText("BI-Multi_Date_Quarter_End")
                }]
        },

        defaultSelectedItem: function(){
            return BICst.MULTI_DATE_QUARTER_PREV;
        }
    });
    BI.QuarterCard.EVENT_CHANGE = "EVENT_CHANGE";
    $.shortcut('bi.quartercard', BI.QuarterCard);
})(jQuery);(function ($) {

    /**
     * 普通控件
     *
     * @class BI.MultiDateSegment
     * @extends BI.Single
     */
    BI.MultiDateSegment = BI.inherit(BI.Single, {
        constants: {
            itemHeight: 24,
            maxGap: 15,
            minGap: 10,
            textWidth: 30,
            defaultEditorValue: "1"
        },

        _defaultConfig: function () {
            return $.extend(BI.MultiDateSegment.superclass._defaultConfig.apply(this, arguments), {
                baseCls: 'bi-multidate-segment',
                text: "",
                width: 130,
                height: 30,
                isEditorExist: true,
                selected: false,
                defaultEditorValue: "1"
            });
        },

        _init: function () {
            BI.MultiDateSegment.superclass._init.apply(this, arguments);
            var self = this, opts = this.options;
            this.radio = BI.createWidget({
                type: "bi.radio",
                selected: opts.selected
            });
            this.radio.on(BI.Controller.EVENT_CHANGE, function (v) {
                self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            });
            this.textEditor = BI.createWidget({
                type: 'bi.text_editor',
                value: this.constants.defaultEditorValue,
                title:this.constants.defaultEditorValue,
                cls: 'bi-multidate-editor',
                width: this.constants.textWidth,
                height: this.constants.itemHeight
            });
            this.textEditor.on(BI.Controller.EVENT_CHANGE, function (v) {
                self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            });
            this.textEditor.on(BI.TextEditor.EVENT_CONFIRM, function () {
                this.setTitle(this.getValue());
            });
            this.text = BI.createWidget({
                type: "bi.label",
                textAlign: "left",
                cls: 'bi-multidate-normal-label',
                text: opts.text,
                height: this.constants.itemHeight
            });
            this._createSegment();
        },
        _createSegment: function () {
            if (this.options.isEditorExist === true) {
                return BI.createWidget({
                    element: this,
                    type: 'bi.left',
                    items: [{
                        el: {
                            type: "bi.center_adapt",
                            items: [this.radio],
                            height: this.constants.itemHeight
                        },
                        lgap: 0
                    },
                        {
                            el: {
                                type: "bi.center_adapt",
                                items: [this.textEditor],
                                widgetName: 'textEditor'
                            },
                            lgap: this.constants.maxGap
                        },
                        {
                            el: this.text,
                            lgap: this.constants.minGap
                        }]
                });
            }
            return BI.createWidget({
                element: this,
                type: 'bi.left',
                items: [{
                    el: {
                        type: "bi.center_adapt",
                        items: [this.radio],
                        height: this.constants.itemHeight
                    },
                    lgap: 0
                },
                    {
                        el: this.text,
                        lgap: this.constants.maxGap
                    }]
            })
        },
        setSelected: function (v) {
            if (BI.isNotNull(this.radio)) {
                this.radio.setSelected(v);
            }
        },
        isSelected: function () {
            return this.radio.isSelected();
        },
        getValue: function () {
            return this.options.value;
        },
        getInputValue: function () {
            return this.textEditor.getValue() | 0;
        },
        setInputValue: function (v) {
            this.textEditor.setValue(v);
        },
        isEditorExist: function () {
            return this.options.isEditorExist;
        },
        setEnable: function (b) {
            BI.Editor.superclass.setEnable.apply(this, arguments);
            this.textEditor && this.textEditor.setEnable(b);
        }
    });
    BI.MultiDateSegment.EVENT_CHANGE = "EVENT_CHANGE";
    $.shortcut('bi.multidate_segment', BI.MultiDateSegment);
})(jQuery);;
(function ($) {

    /**
     * 普通控件
     *
     * @class BI.WeekCard
     * @extends BI.MultiDateCard
     */
    BI.WeekCard = BI.inherit(BI.MultiDateCard, {
        _defaultConfig: function () {
            return $.extend(BI.WeekCard.superclass._defaultConfig.apply(this, arguments), {
                baseCls: 'bi-multidate-weekcard'
            });
        },

        _init: function () {
            BI.WeekCard.superclass._init.apply(this, arguments);
        },

        dateConfig: function(){
            return [{
                selected: true,
                isEditorExist: true,
                text: BI.i18nText("BI-Multi_Date_Week_Prev"),
                value: BICst.MULTI_DATE_WEEK_PREV
            },
                {
                    isEditorExist: true,
                    text: BI.i18nText("BI-Multi_Date_Week_Next"),
                    value: BICst.MULTI_DATE_WEEK_AFTER
                }];
        },

        defaultSelectedItem: function(){
            return BICst.MULTI_DATE_WEEK_PREV;
        }
    });
    BI.WeekCard.EVENT_CHANGE = "EVENT_CHANGE";
    $.shortcut('bi.weekcard', BI.WeekCard);
})(jQuery);(function ($) {
    /**
     * 普通控件
     *
     * @class BI.YearCard
     * @extends BI.MultiDateCard
     */
    BI.YearCard = BI.inherit(BI.MultiDateCard, {
        _defaultConfig: function () {
            return $.extend(BI.YearCard.superclass._defaultConfig.apply(this, arguments), {
                baseCls: 'bi-multidate-yearcard'
            });
        },

        _init: function () {
            BI.YearCard.superclass._init.apply(this, arguments);
        },

        dateConfig: function(){
            return [{
                selected: true,
                isEditorExist: true,
                text: BI.i18nText("BI-Multi_Date_Year_Prev"),
                value: BICst.MULTI_DATE_YEAR_PREV
            },
                {
                    isEditorExist: true,
                    text: BI.i18nText("BI-Multi_Date_Year_Next"),
                    value: BICst.MULTI_DATE_YEAR_AFTER
                },
                {
                    isEditorExist: false,
                    value: BICst.MULTI_DATE_YEAR_BEGIN,
                    text: BI.i18nText("BI-Multi_Date_Year_Begin")
                },
                {
                    isEditorExist: false,
                    value: BICst.MULTI_DATE_YEAR_END,
                    text: BI.i18nText("BI-Multi_Date_Year_End")
                }]
        },

        defaultSelectedItem: function(){
            return BICst.MULTI_DATE_YEAR_PREV;
        }
    });
    BI.YearCard.EVENT_CHANGE = "EVENT_CHANGE";
    $.shortcut('bi.yearcard', BI.YearCard);
})(jQuery);/**
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
$.shortcut("bi.multilayer_select_tree_combo", BI.MultiLayerSelectTreeCombo);/**
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

$.shortcut("bi.multilayer_select_level_tree", BI.MultiLayerSelectLevelTree);/**
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
$.shortcut("bi.multilayer_select_tree_popup", BI.MultiLayerSelectTreePopup);/**
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

$.shortcut("bi.multilayer_select_tree_first_plus_group_node", BI.MultiLayerSelectTreeFirstPlusGroupNode);/**
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

$.shortcut("bi.multilayer_select_tree_last_plus_group_node", BI.MultiLayerSelectTreeLastPlusGroupNode);/**
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

$.shortcut("bi.multilayer_select_tree_mid_plus_group_node", BI.MultiLayerSelectTreeMidPlusGroupNode);/**
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
$.shortcut("bi.multilayer_single_tree_combo", BI.MultiLayerSingleTreeCombo);/**
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
        this.tree.on(BI.Controller.EVENT_CHANGE, function (type) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.MultiLayerSingleLevelTree.EVENT_CHANGE, arguments);
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

$.shortcut("bi.multilayer_single_level_tree", BI.MultiLayerSingleLevelTree);
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
$.shortcut("bi.multilayer_single_tree_popup", BI.MultiLayerSingleTreePopup);/**
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

$.shortcut("bi.multilayer_single_tree_first_plus_group_node", BI.MultiLayerSingleTreeFirstPlusGroupNode);/**
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

$.shortcut("bi.multilayer_single_tree_last_plus_group_node", BI.MultiLayerSingleTreeLastPlusGroupNode);/**
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

$.shortcut("bi.multilayer_single_tree_mid_plus_group_node", BI.MultiLayerSingleTreeMidPlusGroupNode);/**
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

$.shortcut("bi.multilayer_single_tree_first_tree_leaf_item", BI.MultiLayerSingleTreeFirstTreeLeafItem);/**
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

$.shortcut("bi.multilayer_single_tree_last_tree_leaf_item", BI.MultiLayerSingleTreeLastTreeLeafItem);/**
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

$.shortcut("bi.multilayer_single_tree_mid_tree_leaf_item", BI.MultiLayerSingleTreeMidTreeLeafItem);/**
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
            baseCls: "bi-multi-select-check-pane",
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
                    selected_values: self.storeValue.value
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
            cls: 'multi-select-check-selected'
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

$.shortcut("bi.multi_select_check_pane", BI.MultiSelectCheckPane);/**
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
            cls: 'cursor-default check-font display-list-item',
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

$.shortcut('bi.display_selected_list', BI.DisplaySelectedList);/**
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
        this.popup = BI.createWidget({
            type: 'bi.multi_select_popup_view',
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
        });

        this.popup.on(BI.MultiSelectPopupView.EVENT_CHANGE, function () {
            self.storeValue = this.getValue();
            self._adjust(function () {
                assertShowValue();
            });
        });
        this.popup.on(BI.MultiSelectPopupView.EVENT_CLICK_CONFIRM, function () {
            self._defaultState();
        });
        this.popup.on(BI.MultiSelectPopupView.EVENT_CLICK_CLEAR, function () {
            self.setValue();
            self._defaultState();
        });

        this.trigger = BI.createWidget({
            type: "bi.multi_select_trigger",
            height: o.height,
            adapter: this.popup,
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
            popup: this.popup
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
            cls: "multi-select-trigger-icon-button"
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
        this.trigger.setValue(this.storeValue);
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

$.shortcut('bi.multi_select_combo', BI.MultiSelectCombo);/**
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
                    selected_values: BI.isKey(startValue) && self.storeValue.type === BI.Selection.Multi
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

    setEnable: function (arg) {
        this.button_group.setEnable(arg);
    },

    resetHeight: function (h) {
        this.button_group.resetHeight(h);
    },

    resetWidth: function (w) {
        this.button_group.resetWidth(w);
    }
});

BI.MultiSelectLoader.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut('bi.multi_select_loader', BI.MultiSelectLoader);/**
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

    setEnable: function (arg) {
        this.popupView.setEnable(arg);
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


$.shortcut('bi.multi_select_popup_view', BI.MultiSelectPopupView);/**
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
            baseCls: "bi-multi-select-trigger",
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

    setValue: function (ob) {
        this.searcher.setValue(ob);
        this.numberCounter.setValue(ob);
    },

    setEnable: function (v) {
        this.searcher.setEnable(v);
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

$.shortcut('bi.multi_select_trigger', BI.MultiSelectTrigger);/**
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
                    selected_values: self.storeValue.value
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

    setEnable: function (arg) {
        this.button_group.setEnable(arg);
    },

    resetHeight: function (h) {
        this.button_group.resetHeight(h);
    },

    resetWidth: function (w) {
        this.button_group.resetWidth(w);
    }
});

BI.MultiSelectSearchLoader.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut('bi.multi_select_search_loader', BI.MultiSelectSearchLoader);/**
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
            baseCls: "bi-multi-select-search-pane",
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

$.shortcut("bi.multi_select_search_pane", BI.MultiSelectSearchPane);/**
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
            baseCls: 'bi-multi-select-check-selected-button',
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
$.shortcut('bi.multi_select_check_selected_button', BI.MultiSelectCheckSelectedButton);/**
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

    setEnable: function(v){
        this.editor.setEnable(v);
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
$.shortcut('bi.multi_select_editor', BI.MultiSelectEditor);/**
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

    setState: function (ob) {
        ob || (ob = {});
        ob.value || (ob.value = []);
        if (ob.type === BI.Selection.All) {
            this.editor.setState(BI.size(ob.value) > 0 ? BI.Selection.Multi : BI.Selection.All);
        } else {
            if (BI.size(ob.value) === 1) {
                this.editor.setState(ob.value[0] + "");
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

    setEnable: function (v) {
        this.editor.setEnable(v);
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
$.shortcut('bi.multi_select_searcher', BI.MultiSelectSearcher);/**
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
$.shortcut('bi.multi_select_check_selected_switcher', BI.MultiSelectCheckSelectedSwitcher);/**
 * Created by zcf on 2016/12/14.
 */
BI.MultiStringList = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.MultiStringList.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-multi-string-list',
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            height: 25
        })
    },
    _init: function () {
        BI.MultiStringList.superclass._init.apply(this, arguments);

        var self = this, o = this.options;

        var assertShowValue = function () {
            BI.isKey(self._startValue) && self.storeValue.value[self.storeValue.type === BI.Selection.All ? "remove" : "pushDistinct"](self._startValue);
            self.trigger.getSearcher().setState(self.storeValue);
            self.trigger.getCounter().setButtonChecked(self.storeValue);
        };
        this.storeValue = {};


        this.popup = BI.createWidget({
            type: "bi.multi_select_loader",
            cls: "popup-multi-string-list",
            itemsCreator: o.itemsCreator,
            valueFormatter: o.valueFormatter,
            onLoaded: o.onLoaded,
            el: {
                height: ""
            }
        });
        this.popup.on(BI.MultiSelectLoader.EVENT_CHANGE, function () {
            self.storeValue = this.getValue();
            self._adjust(function () {
                assertShowValue();
                self.fireEvent(BI.MultiStringList.EVENT_CHANGE);
            });
        });

        this.trigger = BI.createWidget({
            type: "bi.multi_select_trigger",
            height: o.height,
            adapter: this.popup,
            masker: {
                offset: {
                    left: 1,
                    top: 0,
                    right: 2,
                    bottom: 1
                }
            },
            valueFormatter: o.valueFormatter,
            itemsCreator: function (op, callback) {
                o.itemsCreator(op, function (res) {
                    if (op.times === 1 && BI.isNotNull(op.keyword)) {
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
                    self.trigger.setValue(self.storeValue);
                    self.popup.setValue(self.storeValue);
                    self._setStartValue(keyword);
                    assertShowValue();
                    self.populate();
                    self._setStartValue("");
                    self.fireEvent(BI.MultiStringList.EVENT_CHANGE);
                })
            }
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_SEARCHING, function (keywords) {
            var last = BI.last(keywords);
            keywords = BI.initial(keywords || []);
            if (keywords.length > 0) {
                self._joinKeywords(keywords, function () {
                    if (BI.isEndWithBlank(last)) {
                        self.trigger.setValue(self.storeValue);
                        self.popup.setValue(self.storeValue);
                        assertShowValue();
                        self.popup.populate();
                        self._setStartValue("");
                    } else {
                        self.trigger.setValue(self.storeValue);
                        self.popup.setValue(self.storeValue);
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
        var div = BI.createWidget({
            type: "bi.layout"
        });
        BI.createWidget({
            type: "bi.vtape",
            element: this,
            height: "100%",
            width: "100%",
            items: [{
                el: this.trigger,
                height: 25
            }, {
                el: div,
                height: 2
            }, {
                el: this.popup,
                height: "fill"
            }]
        });
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
                type: BI.MultiStringList.REQ_GET_ALL_DATA
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
            type: BI.MultiStringList.REQ_GET_ALL_DATA,
            keyword: this.trigger.getKey()
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
                type: BI.MultiStringList.REQ_GET_DATA_LENGTH
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

    // isAllSelected: function () {
    //     return this.popup.isAllSelected();
    // },

    resize: function () {
        this.trigger.getCounter().adjustView();
        this.trigger.getSearcher().adjustView();
    },

    setEnable: function (v) {
        this.trigger.setEnable(v);
        this.popup.setEnable(v);
    },

    setValue: function (v) {
        this.storeValue = v || {};
        this._assertValue(this.storeValue);
        this.popup.setValue(this.storeValue);
        this.trigger.setValue(this.storeValue);
    },

    getValue: function () {
        return this.storeValue;
    },

    populate: function () {
        this._count = null;
        this._allData = null;
        this.popup.populate.apply(this.popup, arguments);
        this.trigger.populate.apply(this.trigger, arguments);
    }
});

BI.extend(BI.MultiStringList, {
    REQ_GET_DATA_LENGTH: 0,
    REQ_GET_ALL_DATA: -1
});

BI.MultiStringList.EVENT_CHANGE = "BI.MultiStringList.EVENT_CHANGE";
$.shortcut("bi.multi_string_list", BI.MultiStringList);/**
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
            baseCls: "bi-multi-tree-check-pane",
            onClickContinueSelect: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiTreeCheckPane.superclass._init.apply(this, arguments);

        var self = this, opts = this.options;

        this.selected_values = {};

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
                op.type = BI.TreeView.REQ_TYPE_SELECTED_DATA;
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


$.shortcut("bi.multi_tree_check_pane", BI.MultiTreeCheckPane);/**
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

        this.popup = BI.createWidget({
            type: 'bi.multi_tree_popup_view',
            itemsCreator: o.itemsCreator,
            onLoaded: function () {
                BI.nextTick(function () {
                    self.trigger.getCounter().adjustView();
                    self.trigger.getSearcher().adjustView();
                });
            }
        });
        var isInit = false;
        var want2showCounter = false;

        this.popup.on(BI.MultiTreePopup.EVENT_AFTERINIT, function () {
            self.trigger.getCounter().adjustView();
            isInit = true;
            if (want2showCounter === true) {
                showCounter();
            }
        });

        this.trigger = BI.createWidget({
            type: "bi.multi_select_trigger",
            height: o.height,
            adapter: this.popup,
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
            popup: this.popup
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
        this.popup.on(BI.MultiTreePopup.EVENT_CHANGE, function () {
            change = true;
            var val = {
                type: BI.Selection.Multi,
                value: this.hasChecked() ? {1: 1} : {}
            };
            self.trigger.getSearcher().setState(val);
            self.trigger.getCounter().setButtonChecked(val);
        });

        this.popup.on(BI.MultiTreePopup.EVENT_CLICK_CONFIRM, function () {
            self._defaultState();
        });
        this.popup.on(BI.MultiTreePopup.EVENT_CLICK_CLEAR, function () {
            clear = true;
            self.setValue();
            self._defaultState();
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
            cls: "multi-select-trigger-icon-button"
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

    setEnable: function(v){
        this.combo.setEnable(v);
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

$.shortcut('bi.multi_tree_combo', BI.MultiTreeCombo);/**
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
            maxHeight: 250,
            onLoaded: BI.emptyFn
        });
    },

    _init: function () {
        BI.MultiTreePopup.superclass._init.apply(this, arguments);

        var self = this, opts = this.options;

        this.selected_values = {};

        this.tree = BI.createWidget({
            type: "bi.sync_tree",
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

    setEnable: function (arg) {
        this.popupView.setEnable(arg);
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


$.shortcut('bi.multi_tree_popup_view', BI.MultiTreePopup);/**
 *
 * 在搜索框中输入文本弹出的面板
 * @class BI.MultiTreeSearchPane
 * @extends BI.Pane
 */

BI.MultiTreeSearchPane = BI.inherit(BI.Pane, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiTreeSearchPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-tree-search-pane",
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

$.shortcut("bi.multi_tree_search_pane", BI.MultiTreeSearchPane);/**
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
$.shortcut('bi.multi_tree_check_selected_button', BI.MultiTreeCheckSelectedButton);/**
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

    setEnable: function(v){
        this.editor.setEnable(v);
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
$.shortcut('bi.multi_tree_searcher', BI.MultiTreeSearcher);/**
 * Created by zcf on 2016/12/20.
 */
BI.MultiTreeList = BI.inherit(BI.Widget, {
    constants: {
        offset: {
            left: 1,
            top: 0,
            right: 2,
            bottom: 1
        }
    },

    _defaultConfig: function () {
        return BI.extend(BI.MultiTreeList.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-multi-tree-combo',
            itemsCreator: BI.emptyFn,
            height: 25
        });
    },

    _init: function () {
        BI.MultiTreeList.superclass._init.apply(this, arguments);

        var self = this, o = this.options;

        var isInit = false;
        var want2showCounter = false;

        this.popup = BI.createWidget({
            type: "bi.multi_tree_list_popup",
            itemsCreator: o.itemsCreator
        });

        this.popup.on(BI.MultiStringListPopup.EVENT_AFTER_INIT, function () {
            self.trigger.getCounter().adjustView();
            isInit = true;
            if (want2showCounter === true) {
                showCounter();
            }
        });

        this.trigger = BI.createWidget({
            type: "bi.multi_select_trigger",
            height: o.height,
            adapter: this.popup,
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

        this.storeValue = {value: {}};

        var isSearching = function () {
            return self.trigger.getSearcher().isSearching();
        };

        this.trigger.on(BI.MultiSelectTrigger.EVENT_START, function () {
            self.storeValue = {value: self.popup.getValue()};
            this.setValue(self.storeValue);
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_STOP, function () {
            self.storeValue = {value: this.getValue()};
            self.trigger.setValue(self.storeValue);
            self.popup.setValue(self.storeValue);
            BI.nextTick(function () {
                self.trigger.populate();
                self.popup.populate();
            });
        });
        function showCounter() {
            if (isSearching()) {
                self.storeValue = {value: self.trigger.getValue()};
            } else {
                self.storeValue = {value: self.popup.getValue()};
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

        this.trigger.on(BI.MultiSelectTrigger.EVENT_CHANGE, function () {
            var val = {
                type: BI.Selection.Multi,
                value: this.getSearcher().hasChecked() ? {1: 1} : {}
            };
            this.getSearcher().setState(val);
            this.getCounter().setButtonChecked(val);
        });

        this.popup.on(BI.MultiStringListPopup.EVENT_CHANGE, function () {
            showCounter();
            var val = {
                type: BI.Selection.Multi,
                value: this.hasChecked() ? {1: 1} : {}
            };
            self.trigger.getSearcher().setState(val);
            self.trigger.getCounter().setButtonChecked(val);
            self.fireEvent(BI.MultiTreeList.EVENT_CHANGE);
        });

        var div = BI.createWidget({
            type: "bi.layout"
        });
        BI.createWidget({
            type: "bi.vtape",
            element: this,
            height: "100%",
            width: "100%",
            items: [{
                el: this.trigger,
                height: 25
            }, {
                el: div,
                height: 2
            }, {
                el: this.popup,
                height: "fill"
            }]
        })
    },

    _defaultState: function () {
        this.trigger.stopEditing();
    },

    resize: function () {
        this.trigger.getCounter().adjustView();
        this.trigger.getSearcher().adjustView();
    },

    setEnable: function (v) {
        this.trigger.setEnable(v);
        this.popup.setEnable(v);
    },

    setValue: function (v) {
        this.storeValue.value = v || {};
        this.popup.setValue({
            value: v || {}
        });
        this.trigger.setValue({
            value: v || {}
        });
    },

    getValue: function () {
        return this.storeValue.value;
    },

    populate: function () {
        this.trigger.populate.apply(this.trigger, arguments);
        this.popup.populate.apply(this.popup, arguments);
    }
});
BI.MultiTreeList.EVENT_CHANGE = "MultiTreeList.EVENT_CHANGE";
$.shortcut('bi.multi_tree_list', BI.MultiTreeList);/**
 * Created by zcf on 2016/12/21.
 */
BI.MultiStringListPopup=BI.inherit(BI.Widget,{
    _defaultConfig:function () {
        return BI.extend(BI.MultiStringListPopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-tree-list-popup",
            itemsCreator: BI.emptyFn
        });
    },
    _init:function () {
        BI.MultiStringListPopup.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.popup = BI.createWidget({
            type: "bi.sync_tree",
            height: 400,
            element: this,
            itemsCreator: o.itemsCreator
        });
        this.popup.on(BI.TreeView.EVENT_AFTERINIT, function () {
            self.fireEvent(BI.MultiStringListPopup.EVENT_AFTER_INIT)
        });
        this.popup.on(BI.TreeView.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiStringListPopup.EVENT_CHANGE)
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

    populate: function (config) {
        this.popup.stroke(config);
    }

});
BI.MultiStringListPopup.EVENT_AFTER_INIT="BI.MultiStringListPopup.EVENT_AFTER_INIT";
BI.MultiStringListPopup.EVENT_CHANGE="BI.MultiStringListPopup.EVENT_CHANGE";
$.shortcut("bi.multi_tree_list_popup",BI.MultiStringListPopup);//小于号的值为：0，小于等于号的值为:1
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
            type: "bi.sign_editor",
            height: o.height - 2,
            watermark: BI.i18nText("BI-Unrestricted"),
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
            cls: "numerical-interval-small-editor"
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
            type: "bi.sign_editor",
            height: o.height - 2,
            watermark: BI.i18nText("BI-Unrestricted"),
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
            cls: "numerical-interval-big-editor"
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
            cls: "numerical-interval-small-combo",
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
            cls: "numerical-interval-big-combo",
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
            text: BI.i18nText("BI-Value"),
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
        w.on(BI.SignEditor.EVENT_FOCUS, function () {
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
        w.on(BI.SignEditor.EVENT_BLUR, function () {
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
        w.on(BI.SignEditor.EVENT_ERROR, function () {
            self._checkValidation();
            BI.Bubbles.show(c.typeError, BI.i18nText("BI-Numerical_Interval_Input_Data"), self, {
                offsetStyle: "center"
            });
            self.fireEvent(BI.NumericalInterval.EVENT_ERROR);
        })
    },


    _setValidEvent: function (w) {
        var self = this, c = this.constants;
        w.on(BI.SignEditor.EVENT_VALID, function () {
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
        w.on(BI.SignEditor.EVENT_CHANGE, function () {
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

    setEnable: function (b) {
        this.smallEditor.setEnable(b);
        this.smallCombo.setEnable(b);
        this.bigEditor.setEnable(b);
        this.bigCombo.setEnable(b);
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
$.shortcut("bi.numerical_interval", BI.NumericalInterval);/**
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

$.shortcut("bi.page_table_cell", BI.PageTableCell);/**
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
            height: o.height - 30,

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
                self.table.setVPage ? self.table.setVPage(vpage) : self.table.setCurrentPage(vpage);
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
        this.table.setHeight(height - 30);
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
$.shortcut('bi.page_table', BI.PageTable);/**
 * @class BI.DateParamCombo
 * @extend BI.Widget
 * combo : text + icon, popup : text
 * 参见场景dashboard布局方式选择
 */
BI.DateParamCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.DateParamCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-date-param-combo",
            width: 130,
            height: 30
        })
    },

    _init: function () {
        BI.DateParamCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.text_trigger",
            cls: "param-trigger",
            height: o.height - 2
        });
        this.popup = BI.createWidget({
            type: "bi.date_param_popup_view",
            maxHeight: 300
        });

        this.popup.on(BI.ParamPopupView.EVENT_CONFIRM, function(){
            self.DateParamCombo.hideView();
        });

        this.DateParamCombo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: this.popup
        });

        this.DateParamCombo.on(BI.Combo.EVENT_AFTER_HIDEVIEW, function () {
            self.setValue(self.getValue());
            self.fireEvent(BI.DateParamCombo.EVENT_CONFIRM);
        });

        this.DateParamCombo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.setValue(self.getValue());
        });
    },

    _getShowTextByValue: function(v){
        v = v || {};
        var value = v.value;
        var midText = (value.foffset === 0 ? BI.i18nText("BI-Qian_First") : BI.i18nText("BI-Hou_Last")) +
        BI.i18nText("BI-Basic_De") + (value.soffset === 0 ? BI.i18nText("BI-Qian_First") : BI.i18nText("BI-Hou_Last")) + value.svalue;
        switch (v.type) {
            case BICst.YEAR:
                return value.fvalue + BI.i18nText("BI-Year") +
                (value.foffset === 0 ? BI.i18nText("BI-Qian_First") : BI.i18nText("BI-Hou_Last")) +
                BI.i18nText("BI-Basic_De") + BI.i18nText("BI-Year_Fen");
            case BICst.YEAR_QUARTER:
                return value.fvalue + BI.i18nText("BI-Year") + midText  + BI.i18nText("BI-Quarter_De");
            case BICst.YEAR_MONTH:
                return value.fvalue + BI.i18nText("BI-Year") + midText + BI.i18nText("BI-Month_De");
            case BICst.YEAR_WEEK:
                return value.fvalue + BI.i18nText("BI-Year") + midText + BI.i18nText("BI-Week_De");
            case BICst.YEAR_DAY:
                return value.fvalue + BI.i18nText("BI-Year") + midText + BI.i18nText("BI-Day_De");
            case BICst.MONTH_WEEK:
                return value.fvalue + BI.i18nText("BI-Basic_Month") + midText + BI.i18nText("BI-Week_De");
            case BICst.MONTH_DAY:
                return value.fvalue + BI.i18nText("BI-Basic_Month") + midText + BI.i18nText("BI-Day_De");
        }
    },

    setValue: function (v) {
        this.DateParamCombo.setValue(v);
        this.trigger.setValue(this._getShowTextByValue(v));
    },

    setEnable: function (v) {
        BI.DateParamCombo.superclass.setEnable.apply(this, arguments);
        this.DateParamCombo.setEnable(v);
    },

    getValue: function () {
        return this.DateParamCombo.getValue();
    },

    getCalculationValue: function(){
        return this.popup.getCalculationValue();
    }
});
BI.DateParamCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
$.shortcut("bi.date_param_combo", BI.DateParamCombo);/**
 * 普通控件
 *
 * @class BI.DateParamPopupView
 * @extends BI.ParamPopupView
 */
BI.DateParamPopupView = BI.inherit(BI.ParamPopupView, {

    _defaultConfig: function () {
        return BI.extend(BI.DateParamPopupView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-date-param-popup'
        });
    },

    _init: function () {
        BI.DateParamPopupView.superclass._init.apply(this, arguments);
    },

    dateConfig: function () {
        return [{
            type: "bi.param3_date_item",
            value: BICst.YEAR,
            selected: true
        }, {
            type: "bi.param1_date_item",
            value: BI.Param1DateItem.YEAR_QUARTER,
            disabled: true
        }, {
            type: "bi.param1_date_item",
            value: BI.Param1DateItem.YEAR_MONTH,
            disabled: true
        }, {
            type: "bi.param1_date_item",
            value: BI.Param1DateItem.YEAR_WEEK,
            disabled: true
        }, {
            type: "bi.param1_date_item",
            value: BI.Param1DateItem.YEAR_DAY,
            disabled: true
        }, {
            type: "bi.param1_date_item",
            value: BI.Param1DateItem.MONTH_WEEK,
            disabled: true
        }, {
            type: "bi.param1_date_item",
            value: BI.Param1DateItem.MONTH_DAY,
            disabled: true
        }]
    }
});
BI.DateParamPopupView.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut('bi.date_param_popup_view', BI.DateParamPopupView);/**
 * @class BI.DateIntervalParamCombo
 * @extend BI.Widget
 * combo : text + icon, popup : text
 * 参见场景dashboard布局方式选择
 */
BI.DateIntervalParamCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.DateIntervalParamCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-date-interval-param-combo",
            width: 130,
            height: 30
        })
    },

    _init: function () {
        BI.DateIntervalParamCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.text_trigger",
            cls: "param-trigger",
            height: o.height - 2
        });
        this.popup = BI.createWidget({
            type: "bi.date_interval_param_popup_view",
            maxHeight: 300
        });

        this.popup.on(BI.ParamPopupView.EVENT_CONFIRM, function(){
            self.DateIntervalParamCombo.hideView();
        });

        this.DateIntervalParamCombo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: this.popup
        });

        this.DateIntervalParamCombo.on(BI.Combo.EVENT_AFTER_HIDEVIEW, function () {
            self.setValue(self.getValue());
            self.fireEvent(BI.DateIntervalParamCombo.EVENT_CONFIRM);
        });

        this.DateIntervalParamCombo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.setValue(self.getValue());
        });
    },

    _getShowTextByValue: function(v){
        v = v || {};
        var value = v.value;
        var midText = (value.foffset === 0 ? BI.i18nText("BI-Qian_First") : BI.i18nText("BI-Hou_Last")) +
            BI.i18nText("BI-Basic_De") + (value.soffset === 0 ? BI.i18nText("BI-Qian_First") : BI.i18nText("BI-Hou_Last")) + value.svalue;
        switch (v.type) {
            case BICst.YEAR:
                return value.fvalue + BI.i18nText("BI-Year") +
                    (value.foffset === 0 ? BI.i18nText("BI-Qian_First") : BI.i18nText("BI-Hou_Last")) +
                    BI.i18nText("BI-Basic_De") + BI.i18nText("BI-Year_Fen");
            case BICst.YEAR_QUARTER:
                return value.fvalue + BI.i18nText("BI-Year") + midText  + BI.i18nText("BI-Basic_Quarter");
            case BICst.YEAR_MONTH:
                return value.fvalue + BI.i18nText("BI-Year") + midText + BI.i18nText("BI-Month_Fen");
            case BICst.YEAR_WEEK:
                return value.fvalue + BI.i18nText("BI-Year") + midText + BI.i18nText("BI-Week");
            case BICst.YEAR_DAY:
                return value.fvalue + BI.i18nText("BI-Year") + midText + BI.i18nText("BI-Day_De");
            case BICst.MONTH_WEEK:
                return value.fvalue + BI.i18nText("BI-Basic_Month") + midText + BI.i18nText("BI-Week");
            case BICst.MONTH_DAY:
                return value.fvalue + BI.i18nText("BI-Basic_Month") + midText + BI.i18nText("BI-Day_De");
        }
    },

    setValue: function (v) {
        this.DateIntervalParamCombo.setValue(v);
        this.trigger.setValue(this._getShowTextByValue(v));
    },

    setEnable: function (v) {
        BI.DateIntervalParamCombo.superclass.setEnable.apply(this, arguments);
        this.DateIntervalParamCombo.setEnable(v);
    },

    getValue: function () {
        return this.DateIntervalParamCombo.getValue();
    },

    getCalculationValue: function(){
        return this.popup.getCalculationValue();
    }
});
BI.DateIntervalParamCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
$.shortcut("bi.date_interval_param_combo", BI.DateIntervalParamCombo);/**
 * 普通控件
 *
 * @class BI.DateIntervalParamPopupView
 * @extends BI.ParamPopupView
 */
BI.DateIntervalParamPopupView = BI.inherit(BI.ParamPopupView, {

    _defaultConfig: function () {
        return BI.extend(BI.DateIntervalParamPopupView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-date-interval-param-popup'
        });
    },

    _init: function () {
        BI.DateIntervalParamPopupView.superclass._init.apply(this, arguments);
    },

    dateConfig: function () {
        return [{
            type: "bi.param0_date_item",
            value: BICst.YEAR,
            selected: true
        }, {
            type: "bi.param2_date_item",
            value: BI.Param2DateItem.YEAR_QUARTER,
            disabled: true
        }, {
            type: "bi.param2_date_item",
            value: BI.Param2DateItem.YEAR_MONTH,
            disabled: true
        }, {
            type: "bi.param2_date_item",
            value: BI.Param2DateItem.YEAR_WEEK,
            disabled: true
        }, {
            type: "bi.param2_date_item",
            value: BI.Param2DateItem.YEAR_DAY,
            disabled: true
        }, {
            type: "bi.param2_date_item",
            value: BI.Param2DateItem.MONTH_WEEK,
            disabled: true
        }, {
            type: "bi.param2_date_item",
            value: BI.Param2DateItem.MONTH_DAY,
            disabled: true
        }]
    }
});
BI.DateIntervalParamPopupView.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut('bi.date_interval_param_popup_view', BI.DateIntervalParamPopupView);/**
 * 普通控件
 *
 * @class BI.Param0DateItem
 * @extends BI.Single
 */
BI.Param0DateItem = BI.inherit(BI.Single, {
    constants: {
        itemHeight: 20,
        itemWidth: 20,
        textWidth: 40,
        comboWidth: 45
    },

    _defaultConfig: function () {
        return BI.extend(BI.Param0DateItem.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-param0-date-item',
            width: 310,
            height: 20,
            selected: false,
            defaultEditorValue: "0"
        });
    },

    _init: function () {
        BI.Param0DateItem.superclass._init.apply(this, arguments);
        var self = this, opts = this.options;
        this.radio = BI.createWidget({
            type: "bi.radio",
            selected: opts.selected
        });
        this.radio.on(BI.Controller.EVENT_CHANGE, function (v) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.firstEditor = BI.createWidget({
            type: 'bi.small_text_editor',
            value: opts.defaultEditorValue,
            validationChecker: function(v){
                return BI.isNaturalNumber(v);
            },
            errorText: BI.i18nText("BI-Please_Input_Integer"),
            width: this.constants.textWidth,
            height: this.constants.itemHeight
        });
        this.firstEditor.on(BI.Controller.EVENT_CHANGE, function (v) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.firstCombo = BI.createWidget({
            type: "bi.small_text_value_combo",
            width: this.constants.comboWidth,
            height: this.constants.itemHeight,
            items: BICst.BEFORE_AFTER_COMBO
        });

        this.firstCombo.setValue(0);

        BI.createWidget({
            type: 'bi.inline',
            element: this,
            items: [{
                type: "bi.center_adapt",
                items: [this.radio],
                width: this.constants.itemWidth,
                height: this.constants.itemHeight
            }, this.firstEditor, {
                type: "bi.label",
                textAlign: "center",
                cls: 'param-label',
                text: BI.i18nText("BI-Year"),
                width: this.constants.itemWidth,
                height: this.constants.itemHeight
            }, this.firstCombo, {
                type: "bi.label",
                textAlign: "center",
                cls: 'param-label',
                text: BI.i18nText("BI-Basic_De"),
                width: this.constants.itemWidth,
                height: this.constants.itemHeight
            }, {
                type: "bi.label",
                textAlign: "left",
                cls: 'param-label',
                text: BI.i18nText("BI-Year_Fen"),
                height: this.constants.itemHeight,
                lgap: 5
            }]
        });
    },

    _assertValue: function(v){
        var o = this.options;
        v = v || {};
        v.fvalue = v.fvalue || o.defaultEditorValue;
        v.foffset = v.foffset || 0;
        return v;
    },

    setSelected: function (v) {
        this.radio.setSelected(!!v);
    },

    isSelected: function () {
        return this.radio.isSelected();
    },

    getInputValue: function () {
        return {
            fvalue: this.firstEditor.getValue() || 0,
            foffset: this.firstCombo.getValue()[0]
        };
    },

    setInputValue: function (v) {
        v = this._assertValue(v);
        this.firstEditor.setValue(v.fvalue);
        this.firstCombo.setValue([v.foffset]);
    },

    getValue: function(){
        return BICst.YEAR;
    },

    setEnable: function (b) {
        this.firstEditor.setEnable(!!b);
        this.firstCombo.setEnable(!!b);
    }
});

BI.Param0DateItem.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut('bi.param0_date_item', BI.Param0DateItem);/**
 * 普通控件
 *
 * @class BI.Param1DateItem
 * @extends BI.Single
 */
BI.Param1DateItem = BI.inherit(BI.Single, {
    constants: {
        itemHeight: 20,
        itemWidth: 20,
        textWidth: 40,
        comboWidth: 45
    },

    _defaultConfig: function () {
        return BI.extend(BI.Param1DateItem.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-param1-date-item',
            value: BI.Param1DateItem.YEAR_DAY,
            width: 310,
            height: 20,
            selected: false,
            defaultEditorValue: "0"
        });
    },

    _init: function () {
        BI.Param1DateItem.superclass._init.apply(this, arguments);
        var self = this, opts = this.options;
        this.radio = BI.createWidget({
            type: "bi.radio",
            selected: opts.selected
        });
        this.radio.on(BI.Controller.EVENT_CHANGE, function (v) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.firstEditor = BI.createWidget({
            type: 'bi.small_text_editor',
            value: opts.defaultEditorValue,
            validationChecker: function(v){
                return BI.isNaturalNumber(v);
            },
            errorText: BI.i18nText("BI-Please_Input_Integer"),
            width: this.constants.textWidth,
            height: this.constants.itemHeight
        });
        this.firstEditor.on(BI.Controller.EVENT_CHANGE, function (v) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.secondEditor = BI.createWidget({
            type: 'bi.small_text_editor',
            value: opts.defaultEditorValue,
            validationChecker: function(v){
                return BI.isNaturalNumber(v);
            },
            errorText: BI.i18nText("BI-Please_Input_Integer"),
            width: this.constants.textWidth,
            height: this.constants.itemHeight
        });
        this.secondEditor.on(BI.Controller.EVENT_CHANGE, function (v) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.firstCombo = BI.createWidget({
            type: "bi.small_text_value_combo",
            width: this.constants.comboWidth,
            height: this.constants.itemHeight,
            items: BICst.BEFORE_AFTER_COMBO
        });
        this.secondCombo = BI.createWidget({
            type: "bi.small_text_value_combo",
            width: this.constants.comboWidth,
            height: this.constants.itemHeight,
            items: BICst.BEFORE_AFTER_COMBO
        });
        this.firstCombo.setValue(0);
        this.secondCombo.setValue(0);
        var textJson = this._getTextByDateType();

        BI.createWidget({
            type: 'bi.inline',
            element: this,
            items: [{
                type: "bi.center_adapt",
                items: [this.radio],
                width: this.constants.itemWidth,
                height: this.constants.itemHeight
            }, this.firstEditor, {
                type: "bi.label",
                textAlign: "center",
                cls: 'param-label',
                text: textJson.ftext,
                width: this.constants.itemWidth,
                height: this.constants.itemHeight
            }, this.firstCombo, {
                type: "bi.label",
                textAlign: "center",
                cls: 'param-label',
                text: BI.i18nText("BI-Basic_De"),
                width: this.constants.itemWidth,
                height: this.constants.itemHeight
            }, {
                el: this.secondCombo,
                rgap: 5
            }, this.secondEditor, {
                type: "bi.label",
                textAlign: "left",
                cls: 'param-label',
                text: textJson.stext,
                height: this.constants.itemHeight,
                lgap: 5
            }]
        });
    },

    _getTextByDateType: function(){
        switch (this.options.value) {
            case BI.Param1DateItem.MONTH_WEEK:
                return {ftext: BI.i18nText("BI-Basic_Month"), stext: BI.i18nText("BI-Week_De")};
            case BI.Param1DateItem.MONTH_DAY:
                return {ftext: BI.i18nText("BI-Basic_Month"), stext: BI.i18nText("BI-Day_De")};
            case BI.Param1DateItem.YEAR_MONTH:
                return {ftext: BI.i18nText("BI-Year"), stext: BI.i18nText("BI-Month_De")};
            case BI.Param1DateItem.YEAR_DAY:
                return {ftext: BI.i18nText("BI-Year"), stext: BI.i18nText("BI-Day_De")};
            case BI.Param1DateItem.YEAR_QUARTER:
                return {ftext: BI.i18nText("BI-Year"), stext: BI.i18nText("BI-Quarter_De")};
            case BI.Param1DateItem.YEAR_WEEK:
                return {ftext: BI.i18nText("BI-Year"), stext: BI.i18nText("BI-Week_De")};
        }
    },

    _assertValue: function(v){
        var o = this.options;
        v = v || {};
        v.fvalue = v.fvalue || o.defaultEditorValue;
        v.foffset = v.foffset || 0;
        v.svalue = v.svalue || o.defaultEditorValue;
        v.soffset = v.soffset || 0;
        return v;
    },

    setSelected: function (v) {
        this.radio.setSelected(!!v);
    },

    isSelected: function () {
        return this.radio.isSelected();
    },

    getValue: function () {
        return this.options.value;
    },

    getInputValue: function(){
        return {
            fvalue: this.firstEditor.getValue() || 0,
            foffset: this.firstCombo.getValue()[0],
            svalue: this.secondEditor.getValue() || 0,
            soffset: this.secondCombo.getValue()[0]
        };
    },

    setInputValue: function (v) {
        v = this._assertValue(v);
        this.firstEditor.setValue(v.fvalue);
        this.firstCombo.setValue([v.foffset]);
        this.secondEditor.setValue(v.svalue);
        this.secondCombo.setValue([v.soffset]);
    },

    setEnable: function (b) {
        this.firstEditor.setEnable(!!b);
        this.secondEditor.setEnable(!!b);
        this.firstCombo.setEnable(!!b);
        this.secondCombo.setEnable(!!b);
    }
});

BI.Param1DateItem.EVENT_CHANGE = "EVENT_CHANGE";
BI.extend(BI.Param1DateItem , {
    YEAR_QUARTER: BICst.YEAR_QUARTER,
    YEAR_MONTH: BICst.YEAR_MONTH,
    YEAR_WEEK: BICst.YEAR_WEEK,
    YEAR_DAY: BICst.YEAR_DAY,
    MONTH_WEEK: BICst.MONTH_WEEK,
    MONTH_DAY: BICst.MONTH_DAY
});
$.shortcut('bi.param1_date_item', BI.Param1DateItem);/**
 * 普通控件
 *
 * @class BI.Param2DateItem
 * @extends BI.Single
 */
BI.Param2DateItem = BI.inherit(BI.Single, {
    constants: {
        itemHeight: 20,
        itemWidth: 20,
        textWidth: 40,
        comboWidth: 45
    },

    _defaultConfig: function () {
        return BI.extend(BI.Param2DateItem.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-param2-date-item',
            value: BI.Param2DateItem.YEAR_DAY,
            width: 310,
            height: 20,
            selected: false,
            defaultEditorValue: "0"
        });
    },

    _init: function () {
        BI.Param2DateItem.superclass._init.apply(this, arguments);
        var self = this, opts = this.options;
        this.radio = BI.createWidget({
            type: "bi.radio",
            selected: opts.selected
        });
        this.radio.on(BI.Controller.EVENT_CHANGE, function (v) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.firstEditor = BI.createWidget({
            type: 'bi.small_text_editor',
            value: opts.defaultEditorValue,
            validationChecker: function(v){
                return BI.isNaturalNumber(v);
            },
            errorText: BI.i18nText("BI-Please_Input_Integer"),
            width: this.constants.textWidth,
            height: this.constants.itemHeight
        });
        this.firstEditor.on(BI.Controller.EVENT_CHANGE, function (v) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.secondEditor = BI.createWidget({
            type: 'bi.small_text_editor',
            value: opts.defaultEditorValue,
            validationChecker: function(v){
                return BI.isNaturalNumber(v);
            },
            errorText: BI.i18nText("BI-Please_Input_Integer"),
            width: this.constants.textWidth,
            height: this.constants.itemHeight
        });
        this.secondEditor.on(BI.Controller.EVENT_CHANGE, function (v) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.firstCombo = BI.createWidget({
            type: "bi.small_text_value_combo",
            width: this.constants.comboWidth,
            height: this.constants.itemHeight,
            items: BICst.BEFORE_AFTER_COMBO
        });
        this.secondCombo = BI.createWidget({
            type: "bi.small_text_value_combo",
            width: this.constants.comboWidth,
            height: this.constants.itemHeight,
            items: BICst.BEFORE_AFTER_COMBO
        });
        this.firstCombo.setValue(0);
        this.secondCombo.setValue(0);
        var textJson = this._getTextByDateType();

        BI.createWidget({
            type: 'bi.inline',
            element: this,
            items: [{
                type: "bi.center_adapt",
                items: [this.radio],
                width: this.constants.itemWidth,
                height: this.constants.itemHeight
            }, this.firstEditor, {
                type: "bi.label",
                textAlign: "center",
                cls: 'param-label',
                text: textJson.ftext,
                width: this.constants.itemWidth,
                height: this.constants.itemHeight
            }, this.firstCombo, {
                type: "bi.label",
                textAlign: "center",
                cls: 'param-label',
                text: BI.i18nText("BI-Basic_De"),
                width: this.constants.itemWidth,
                height: this.constants.itemHeight
            }, {
                el: this.secondCombo,
                rgap: 5
            }, this.secondEditor, {
                type: "bi.label",
                textAlign: "left",
                cls: 'param-label',
                text: textJson.stext,
                height: this.constants.itemHeight,
                lgap: 5
            }]
        });
    },

    _getTextByDateType: function(){
        switch (this.options.value) {
            case BI.Param2DateItem.MONTH_WEEK:
                return {ftext: BI.i18nText("BI-Basic_Month"), stext: BI.i18nText("BI-Week_Of_Week")};
            case BI.Param2DateItem.MONTH_DAY:
                return {ftext: BI.i18nText("BI-Basic_Month"), stext: BI.i18nText("BI-Day_De")};
            case BI.Param2DateItem.YEAR_MONTH:
                return {ftext: BI.i18nText("BI-Year"), stext: BI.i18nText("BI-Month_De_Month")};
            case BI.Param2DateItem.YEAR_DAY:
                return {ftext: BI.i18nText("BI-Year"), stext: BI.i18nText("BI-Day_De")};
            case BI.Param2DateItem.YEAR_QUARTER:
                return {ftext: BI.i18nText("BI-Year"), stext: BI.i18nText("BI-Quarter_Of_Quarter")};
            case BI.Param2DateItem.YEAR_WEEK:
                return {ftext: BI.i18nText("BI-Year"), stext: BI.i18nText("BI-Week_Of_Week")};
        }
    },

    _assertValue: function(v){
        var o = this.options;
        v = v || {};
        v.fvalue = v.fvalue || o.defaultEditorValue;
        v.foffset = v.foffset || 0;
        v.svalue = v.svalue || o.defaultEditorValue;
        v.soffset = v.soffset || 0;
        return v;
    },

    setSelected: function (v) {
        this.radio.setSelected(!!v);
    },

    isSelected: function () {
        return this.radio.isSelected();
    },

    getValue: function () {
        return this.options.value;
    },

    getInputValue: function(){
        return {
            fvalue: this.firstEditor.getValue() || 0,
            foffset: this.firstCombo.getValue()[0],
            svalue: this.secondEditor.getValue() || 0,
            soffset: this.secondCombo.getValue()[0]
        };
    },

    setInputValue: function (v) {
        v = this._assertValue(v);
        this.firstEditor.setValue(v.fvalue);
        this.firstCombo.setValue([v.foffset]);
        this.secondEditor.setValue(v.svalue);
        this.secondCombo.setValue([v.soffset]);
    },

    setEnable: function (b) {
        this.firstEditor.setEnable(!!b);
        this.secondEditor.setEnable(!!b);
        this.firstCombo.setEnable(!!b);
        this.secondCombo.setEnable(!!b);
    }
});

BI.Param2DateItem.EVENT_CHANGE = "EVENT_CHANGE";
BI.extend(BI.Param2DateItem , {
    YEAR_QUARTER: BICst.YEAR_QUARTER,
    YEAR_MONTH: BICst.YEAR_MONTH,
    YEAR_WEEK: BICst.YEAR_WEEK,
    YEAR_DAY: BICst.YEAR_DAY,
    MONTH_WEEK: BICst.MONTH_WEEK,
    MONTH_DAY: BICst.MONTH_DAY
});
$.shortcut('bi.param2_date_item', BI.Param2DateItem);/**
 * 普通控件
 *
 * @class BI.Param3DateItem
 * @extends BI.Single
 */
BI.Param3DateItem = BI.inherit(BI.Single, {
    constants: {
        itemHeight: 20,
        itemWidth: 20,
        textWidth: 40,
        comboWidth: 45
    },

    _defaultConfig: function () {
        return BI.extend(BI.Param3DateItem.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-param3-date-item',
            width: 310,
            height: 20,
            selected: false,
            defaultEditorValue: "0"
        });
    },

    _init: function () {
        BI.Param3DateItem.superclass._init.apply(this, arguments);
        var self = this, opts = this.options;
        this.radio = BI.createWidget({
            type: "bi.radio",
            selected: opts.selected
        });
        this.radio.on(BI.Controller.EVENT_CHANGE, function (v) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.firstEditor = BI.createWidget({
            type: 'bi.small_text_editor',
            value: opts.defaultEditorValue,
            validationChecker: function(v){
                return BI.isNaturalNumber(v);
            },
            errorText: BI.i18nText("BI-Please_Input_Integer"),
            width: this.constants.textWidth,
            height: this.constants.itemHeight
        });
        this.firstEditor.on(BI.Controller.EVENT_CHANGE, function (v) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.firstCombo = BI.createWidget({
            type: "bi.small_text_value_combo",
            width: this.constants.comboWidth,
            height: this.constants.itemHeight,
            items: BICst.BEFORE_AFTER_COMBO
        });

        this.firstCombo.setValue(0);

        BI.createWidget({
            type: 'bi.inline',
            element: this,
            items: [{
                type: "bi.center_adapt",
                items: [this.radio],
                width: this.constants.itemWidth,
                height: this.constants.itemHeight
            }, this.firstEditor, {
                type: "bi.label",
                textAlign: "center",
                cls: 'param-label',
                text: BI.i18nText("BI-Year"),
                width: this.constants.itemWidth,
                height: this.constants.itemHeight
            }, this.firstCombo, {
                type: "bi.label",
                textAlign: "center",
                cls: 'param-label',
                text: BI.i18nText("BI-Basic_De"),
                width: this.constants.itemWidth,
                height: this.constants.itemHeight
            }, {
                type: "bi.label",
                textAlign: "left",
                cls: 'param-label',
                text: BI.i18nText("BI-Multi_Date_Year_Begin"),
                height: this.constants.itemHeight,
                lgap: 5
            }]
        });
    },

    _assertValue: function(v){
        var o = this.options;
        v = v || {};
        v.fvalue = v.fvalue || o.defaultEditorValue;
        v.foffset = v.foffset || 0;
        return v;
    },

    setSelected: function (v) {
        this.radio.setSelected(!!v);
    },

    isSelected: function () {
        return this.radio.isSelected();
    },

    getInputValue: function () {
        return {
            fvalue: this.firstEditor.getValue() || 0,
            foffset: this.firstCombo.getValue()[0]
        };
    },

    setInputValue: function (v) {
        v = this._assertValue(v);
        this.firstEditor.setValue(v.fvalue);
        this.firstCombo.setValue([v.foffset]);
    },

    getValue: function(){
        return BICst.YEAR;
    },

    setEnable: function (b) {
        this.firstEditor.setEnable(!!b);
        this.firstCombo.setEnable(!!b);
    }
});

BI.Param3DateItem.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut('bi.param3_date_item', BI.Param3DateItem);/**
 * @class BI.RangeValueCombo
 * @extend BI.Widget
 */
BI.RangeValueCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.RangeValueCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-range-value-combo",
            width: 100,
            height: 30
        })
    },

    _init: function () {
        BI.RangeValueCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.dateRangeCombo = BI.createWidget({
            type: "bi.text_value_combo",
            height: o.height,
            width: o.width,
            items: BICst.Date_Range_FILTER_COMBO
        });
        this.dateRangeCombo.on(BI.TextValueCombo.EVENT_CHANGE, function(){
            self.fireEvent(BI.RangeValueCombo.EVENT_CHANGE);
        });

        BI.createWidget({
            type: "bi.default",
            element: this,
            items: [this.dateRangeCombo]
        });
    },

    setValue: function (v) {
        v = v || {};
        this.dateRangeCombo.setValue(v.type);
    },

    getValue: function () {
        return {
            type: this.dateRangeCombo.getValue()[0]
        };
    }
});
BI.RangeValueCombo.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.range_value_combo", BI.RangeValueCombo);/**
 * @class BI.YearParamCombo
 * @extend BI.Widget
 * combo : text + icon, popup : text
 * 参见场景dashboard布局方式选择
 */
BI.YearParamCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.YearParamCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-year-param-combo",
            width: 130,
            height: 30
        })
    },

    _init: function () {
        BI.YearParamCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.text_trigger",
            cls: "param-trigger",
            height: o.height - 2
        });

        this.popup = BI.createWidget({
            type: 'bi.multi_popup_view',
            el: {
                type: "bi.button_tree",
                chooseType: BI.Selection.None,
                items: [{
                    type: "bi.year_param_item"
                }],
                layouts: [{
                    type: "bi.vertical",
                    vgap: 5,
                    hgap: 5
                }]
            },
            minWidth: 310,
            maxHeight: 300,
            stopPropagation: false
        });

        this.popup.on(BI.MultiPopupView.EVENT_CLICK_TOOLBAR_BUTTON, function () {
            self.YearParamCombo.hideView();
        });

        this.YearParamCombo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: this.popup
        });

        this.YearParamCombo.on(BI.Combo.EVENT_AFTER_HIDEVIEW, function () {
            self.setValue(self.getValue());
            self.fireEvent(BI.YearParamCombo.EVENT_CONFIRM);
        });

        this.YearParamCombo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.setValue(self.getValue());
        });
    },

    _getShowTextByValue: function(v){
        v = v || {};
        return v.fvalue + BI.i18nText("BI-Year") +
            (v.foffset === 0 ? BI.i18nText("BI-Qian_First") : BI.i18nText("BI-Hou_Last")) +
            BI.i18nText("BI-Basic_De") + BI.i18nText("BI-Year_Fen");
    },

    getCalculationValue: function () {
        var value = this.YearParamCombo.getValue()[0];
        var fPrevOrAfter = value.foffset === 0 ? -1 : 1;
        var start = new Date((new Date().getFullYear() + fPrevOrAfter * value.fvalue), 0, 1);
        var end = new Date(start.getFullYear(), 11, 31);
        return {
            start: start,
            end: end
        };
    },

    setValue: function (v) {
        v = v || {};
        this.YearParamCombo.setValue(v.value);
        this.trigger.setValue(this._getShowTextByValue(v.value));
    },

    getValue: function () {
        return {
            type: BICst.YEAR,
            value: this.YearParamCombo.getValue()[0]
        }
    }

});
BI.YearParamCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
$.shortcut("bi.year_param_combo", BI.YearParamCombo);/**
 * 普通控件
 *
 * @class BI.YearParamItem
 * @extends BI.Single
 */
BI.YearParamItem = BI.inherit(BI.Single, {
    constants: {
        itemHeight: 20,
        itemWidth: 20,
        textWidth: 40,
        comboWidth: 45
    },

    _defaultConfig: function () {
        return BI.extend(BI.YearParamItem.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-year-param-item',
            width: 310,
            height: 20,
            defaultEditorValue: "0"
        });
    },

    _init: function () {
        BI.YearParamItem.superclass._init.apply(this, arguments);
        var self = this, opts = this.options;

        this.firstEditor = BI.createWidget({
            type: 'bi.small_text_editor',
            value: opts.defaultEditorValue,
            validationChecker: function(v){
                return BI.isNaturalNumber(v);
            },
            errorText: BI.i18nText("BI-Please_Input_Integer"),
            width: this.constants.textWidth,
            height: this.constants.itemHeight
        });
        this.firstEditor.on(BI.Controller.EVENT_CHANGE, function (v) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.firstCombo = BI.createWidget({
            type: "bi.small_text_value_combo",
            width: this.constants.comboWidth,
            height: this.constants.itemHeight,
            items: BICst.BEFORE_AFTER_COMBO
        });

        this.firstCombo.setValue(0);

        BI.createWidget({
            type: 'bi.inline',
            element: this,
            items: [this.firstEditor, {
                type: "bi.label",
                textAlign: "center",
                cls: 'param-label',
                text: BI.i18nText("BI-Year"),
                width: this.constants.itemWidth,
                height: this.constants.itemHeight
            }, this.firstCombo, {
                type: "bi.label",
                textAlign: "center",
                cls: 'param-label',
                text: BI.i18nText("BI-Basic_De"),
                width: this.constants.itemWidth,
                height: this.constants.itemHeight
            }, {
                type: "bi.label",
                textAlign: "left",
                cls: 'param-label',
                text: BI.i18nText("BI-Year_Fen"),
                height: this.constants.itemHeight,
                lgap: 5
            }]
        });
    },

    _assertValue: function(v){
        var o = this.options;
        if(BI.isArray(v)){
            v = v[0];
        }
        v = v || {};
        v.fvalue = v.fvalue || o.defaultEditorValue;
        v.foffset = v.foffset || 0;
        return v;
    },

    setValue: function (v) {
        v = this._assertValue(v);
        this.firstEditor.setValue(v.fvalue);
        this.firstCombo.setValue([v.foffset]);
    },

    getValue: function(){
        return {
            fvalue: this.firstEditor.getValue() || 0,
            foffset: this.firstCombo.getValue()[0]
        };
    }
});

BI.YearParamItem.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut('bi.year_param_item', BI.YearParamItem);/**
 * @class BI.YearMonthParamCombo
 * @extend BI.Widget
 * combo : text + icon, popup : text
 * 参见场景dashboard布局方式选择
 */
BI.YearMonthParamCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.YearMonthParamCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-year-month-param-combo",
            width: 130,
            height: 30
        })
    },

    _init: function () {
        BI.YearMonthParamCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.text_trigger",
            cls: "param-trigger",
            height: o.height - 2
        });
        this.popup = BI.createWidget({
            type: "bi.year_month_param_popup_view",
            maxHeight: 300
        });

        this.popup.on(BI.ParamPopupView.EVENT_CONFIRM, function(){
            self.YearMonthParamCombo.hideView();
        });

        this.YearMonthParamCombo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: this.popup
        });

        this.YearMonthParamCombo.on(BI.Combo.EVENT_AFTER_HIDEVIEW, function () {
            self.setValue(self.getValue());
            self.fireEvent(BI.YearMonthParamCombo.EVENT_CONFIRM);
        });

        this.YearMonthParamCombo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.setValue(self.getValue());
        });

    },

    _getShowTextByValue: function(v){
        v = v || {};
        var value = v.value;
        var midText = (value.foffset === 0 ? BI.i18nText("BI-Qian_First") : BI.i18nText("BI-Hou_Last")) +
            BI.i18nText("BI-Basic_De") + (value.soffset === 0 ? BI.i18nText("BI-Qian_First") : BI.i18nText("BI-Hou_Last")) + value.svalue;
        switch (v.type) {
            case BICst.YEAR:
                return value.fvalue + BI.i18nText("BI-Year") +
                    (value.foffset === 0 ? BI.i18nText("BI-Qian_First") : BI.i18nText("BI-Hou_Last")) +
                    BI.i18nText("BI-Basic_De") + BI.i18nText("BI-Year_Fen");
            case BICst.YEAR_MONTH:
                return value.fvalue + BI.i18nText("BI-Year") + midText + BI.i18nText("BI-Month_De");
        }
    },

    setValue: function (v) {
        this.YearMonthParamCombo.setValue(v);
        this.trigger.setValue(this._getShowTextByValue(v));
    },

    setEnable: function (v) {
        BI.YearMonthParamCombo.superclass.setEnable.apply(this, arguments);
        this.YearMonthParamCombo.setEnable(v);
    },

    getValue: function () {
        return this.YearMonthParamCombo.getValue();
    },

    getCalculationValue: function(){
        return this.popup.getCalculationValue();
    }
});
BI.YearMonthParamCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
$.shortcut("bi.year_month_param_combo", BI.YearMonthParamCombo);/**
 * 普通控件
 *
 * @class BI.YearMonthParamPopupView
 * @extends BI.ParamPopupView
 */
BI.YearMonthParamPopupView = BI.inherit(BI.ParamPopupView, {

    _defaultConfig: function () {
        return BI.extend(BI.YearMonthParamPopupView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-year-month-param-popup'
        });
    },

    _init: function () {
        BI.YearMonthParamPopupView.superclass._init.apply(this, arguments);
    },

    dateConfig: function () {
        return [{
            type: "bi.param0_date_item",
            selected: true
        }, {
            type: "bi.param2_date_item",
            value: BI.Param2DateItem.YEAR_MONTH,
            disabled: true
        }]
    }
});
BI.YearMonthParamPopupView.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut('bi.year_month_param_popup_view', BI.YearMonthParamPopupView);/**
 * @class BI.YearSeasonParamCombo
 * @extend BI.Widget
 * combo : text + icon, popup : text
 * 参见场景dashboard布局方式选择
 */
BI.YearSeasonParamCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.YearSeasonParamCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-year-season-param-combo",
            width: 130,
            height: 30
        })
    },

    _init: function () {
        BI.YearSeasonParamCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.text_trigger",
            cls: "param-trigger",
            height: o.height - 2
        });
        this.popup = BI.createWidget({
            type: "bi.year_season_param_popup_view",
            maxHeight: 300
        });

        this.popup.on(BI.ParamPopupView.EVENT_CONFIRM, function(){
            self.YearSeasonParamCombo.hideView();
        });

        this.YearSeasonParamCombo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: this.popup
        });

        this.YearSeasonParamCombo.on(BI.Combo.EVENT_AFTER_HIDEVIEW, function () {
            self.setValue(self.getValue());
            self.fireEvent(BI.YearSeasonParamCombo.EVENT_CONFIRM);
        });

        this.YearSeasonParamCombo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.setValue(self.getValue());
        });

    },

    _getShowTextByValue: function(v){
        v = v || {};
        var value = v.value;
        var midText = (value.foffset === 0 ? BI.i18nText("BI-Qian_First") : BI.i18nText("BI-Hou_Last")) +
            BI.i18nText("BI-Basic_De") + (value.soffset === 0 ? BI.i18nText("BI-Qian_First") : BI.i18nText("BI-Hou_Last")) + value.svalue;
        switch (v.type) {
            case BICst.YEAR:
                return value.fvalue + BI.i18nText("BI-Year") +
                    (value.foffset === 0 ? BI.i18nText("BI-Qian_First") : BI.i18nText("BI-Hou_Last")) +
                    BI.i18nText("BI-Basic_De") + BI.i18nText("BI-Year_Fen");
            case BICst.YEAR_QUARTER:
                return value.fvalue + BI.i18nText("BI-Year") + midText  + BI.i18nText("BI-Quarter_De");
        }
    },

    setValue: function (v) {
        this.YearSeasonParamCombo.setValue(v);
        this.trigger.setValue(this._getShowTextByValue(v));
    },

    setEnable: function (v) {
        BI.YearSeasonParamCombo.superclass.setEnable.apply(this, arguments);
        this.YearSeasonParamCombo.setEnable(v);
    },

    getValue: function () {
        return this.YearSeasonParamCombo.getValue();
        //return BI.extend(this.popup.getCalculationValue(), this.YearSeasonParamCombo.getValue());
    },

    getCalculationValue: function(){
        return this.popup.getCalculationValue();
    }
});
BI.YearSeasonParamCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
$.shortcut("bi.year_season_param_combo", BI.YearSeasonParamCombo);/**
 * 普通控件
 *
 * @class BI.YearSeasonParamPopupView
 * @extends BI.ParamPopupView
 */
BI.YearSeasonParamPopupView = BI.inherit(BI.ParamPopupView, {

    _defaultConfig: function () {
        return BI.extend(BI.YearSeasonParamPopupView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-year-season-param-popup'
        });
    },

    _init: function () {
        BI.YearSeasonParamPopupView.superclass._init.apply(this, arguments);
    },

    dateConfig: function () {
        return [{
            type: "bi.param0_date_item",
            selected: true
        }, {
            type: "bi.param1_date_item",
            value: BI.Param1DateItem.YEAR_QUARTER,
            disabled: true
        }]
    }
});
BI.YearSeasonParamPopupView.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut('bi.year_season_param_popup_view', BI.YearSeasonParamPopupView);/**
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
        if (this.start.contains(start)) {
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
            if (self.start.contains(start)) {
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
            if (self.start.contains(start)) {
                self.lines[self.regions[0].getValueByIndex(0)][0].toFront();
            }
            if (lines.length > 1 || self.start.contains(start)) {
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
            if (i > 0 || self.start.contains(id)) {
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
                        for(var j =index2; j < index1; j++){
                            regions[j] = regions[j+1];
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
                    if (e.contains(node)) {
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
$.shortcut("bi.path_chooser", BI.PathChooser);/**
 * 路径选择区域
 *
 * Created by GUY on 2015/12/4.
 * @class BI.PathRegion
 * @extends BI.Widget
 */
BI.PathRegion = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.PathRegion.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-path-region",
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
                cls: "path-region-label",
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
$.shortcut("bi.path_region", BI.PathRegion);/**
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
$.shortcut('bi.preview_table_cell', BI.PreviewTableCell);/**
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
$.shortcut('bi.preview_table_header_cell', BI.PreviewTableHeaderCell);/**
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
    },

    destroy: function () {
        this.table.destroy();
        BI.PreviewTable.superclass.destroy.apply(this, arguments);
    }
});
BI.PreviewTable.EVENT_CHANGE = "PreviewTable.EVENT_CHANGE";
$.shortcut('bi.preview_table', BI.PreviewTable);/**
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
$.shortcut('bi.quarter_combo', BI.QuarterCombo);/**
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
$.shortcut("bi.quarter_popup", BI.QuarterPopup);/**
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
            extraCls: "bi-quarter-trigger",
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
$.shortcut("bi.quarter_trigger", BI.QuarterTrigger);/**
 * 关联视图字段Item
 *
 * Created by GUY on 2015/12/23.
 * @class BI.RelationViewItem
 * @extends BI.Widget
 */
BI.RelationViewItem = BI.inherit(BI.BasicButton, {

    _defaultConfig: function () {
        return BI.extend(BI.RelationViewItem.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-relation-view-item",
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
$.shortcut('bi.relation_view_item', BI.RelationViewItem);/**
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
$.shortcut('bi.relation_view', BI.RelationView);/**
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
$.shortcut("bi.relation_view_region_container", BI.RelationViewRegionContainer);/**
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
                cls: "relation-view-region-container " + (o.belongPackage ? "" : "other-package"),
                items: [{
                    type: "bi.vertical_adapt",
                    cls: "relation-view-region-title",
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
$.shortcut('bi.relation_view_region', BI.RelationViewRegion);/**
 * 完成搜索功能模块
 *
 * Created by GUY on 2015/9/16.
 * @class BI.SelectDataSearcher
 * @extends BI.Widget
 */
BI.SelectDataSearcher = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SelectDataSearcher.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-data-searcher",
            packages: [],
            itemsCreator: BI.emptyFn
        });
    },

    _init: function () {
        BI.SelectDataSearcher.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.packagePane = BI.createWidget({
            type: "bi.select_data_switcher",
            packages: o.packages,
            itemsCreator: function (op) {
                op.packageId = self.getPackageId();
                if (!op.packageId) {
                    return;
                }
                o.itemsCreator.apply(self, arguments);
            }
        });
        this.packagePane.on(BI.SelectDataSwitcher.EVENT_CHANGE, function () {
            self.fireEvent(BI.SelectDataSearcher.EVENT_CLICK_PACKAGE, arguments);
        });
        this.packagePane.on(BI.SelectDataSwitcher.EVENT_CLICK_ITEM, function () {
            self.fireEvent(BI.SelectDataSearcher.EVENT_CLICK_ITEM, arguments);
        });

        this.searcherPane = BI.createWidget({
            type: "bi.select_data_search_result_pane",
            itemsCreator: function (op) {
                op.packageId = self.getPackageId();
                if (!op.packageId) {
                    return;
                }
                o.itemsCreator.apply(self, arguments);
            }
        });
        this.searcherPane.on(BI.SelectDataSearchResultPane.EVENT_SEARCH_TYPE_CHANGE, function () {
            self.searcher.doSearch();
        });
        this.searcherPane.on(BI.SelectDataSearchResultPane.EVENT_CHANGE, function () {
            self.fireEvent(BI.SelectDataSearcher.EVENT_CLICK_ITEM, arguments);
        });

        this.searcher = BI.createWidget({
            type: "bi.searcher",
            el: {
                type: "bi.small_search_editor"
            },
            isAutoSearch: false, //是否自动搜索
            isAutoSync: false,
            onSearch: function (op, populate) {
                o.itemsCreator(BI.extend(op, {
                    packageId: self.getPackageId(),
                    searchType: self.searcherPane.getSegmentValue()
                }), function (searchResult, matchResult) {
                    populate(searchResult, matchResult, op.keyword);
                })
            },
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_MULTI,
            popup: this.searcherPane,
            adapter: this.packagePane
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: {
                    type: "bi.absolute",
                    items: [{
                        el: this.searcher,
                        left: 10,
                        right: 10,
                        top: 10
                    }]
                },
                height: 45
            }, this.packagePane]
        })
    },

    setEnable: function (v) {
        BI.SelectDataSearcher.superclass.setEnable.apply(this, arguments);
        this.packagePane.setEnable(v)
    },

    setPackage: function (pId) {
        this.packagePane.setPackage(pId);
    },

    getPackageId: function () {
        return this.packagePane.getPackageId();
    },

    setValue: function (v) {

    },

    getValue: function () {
        return this.searcher.getValue();
    },

    populatePackages: function (packages) {
        this.options.packages = packages;
        this.packagePane.populatePackages(packages);
        this.searcher.stopSearch();
        this.populate();
    },

    populate: function () {
        this.packagePane.populate.apply(this.packagePane, arguments);
    }
});
BI.SelectDataSearcher.EVENT_CLICK_ITEM = "EVENT_CLICK_ITEM";
BI.SelectDataSearcher.EVENT_CLICK_PACKAGE = "EVENT_CLICK_PACKAGE";
$.shortcut('bi.select_data_searcher', BI.SelectDataSearcher);/**
 * 搜索结果面板
 *
 * Created by GUY on 2015/9/16.
 * @class BI.SelectDataSearchResultPane
 * @extends BI.Widget
 */
BI.SelectDataSearchResultPane = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SelectDataSearchResultPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-data-search-result-pane bi-searcher-view",
            itemsCreator: BI.emptyFn
        });
    },

    _init: function () {
        BI.SelectDataSearchResultPane.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.segment = BI.createWidget({
            type: "bi.select_data_search_segment",
            cls: "search-result-toolbar"
        });
        this.segment.on(BI.SelectDataSearchSegment.EVENT_CHANGE, function () {
            self.fireEvent(BI.SelectDataSearchResultPane.EVENT_SEARCH_TYPE_CHANGE);
        });

        this.resultPane = BI.createWidget({
            type: "bi.searcher_view",
            matcher: {
                type: "bi.select_data_tree",
                itemsCreator: o.itemsCreator
            },
            searcher: {
                type: "bi.select_data_tree",
                itemsCreator: o.itemsCreator
            }
        });
        this.resultPane.on(BI.SearcherView.EVENT_CHANGE, function () {
            self.fireEvent(BI.SelectDataSearchResultPane.EVENT_CHANGE, arguments);
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: this.segment,
                height: 60
            }, {
                type: "bi.border",
                cls: "search-result-line",
                height: 2
            }, {
                type: "bi.border",
                cls: "search-result-line",
                height: 1
            }, {
                type: "bi.absolute",
                items: [{
                    el: this.resultPane,
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }]
            }]
        });
    },

    startSearch: function () {

    },

    stopSearch: function () {

    },

    empty: function () {
        this.resultPane.empty();
    },

    populate: function (searchResult, matchResult, keyword) {
        this.resultPane.populate.apply(this.resultPane, arguments);
    },

    setValue: function (v) {

    },

    getSegmentValue: function () {
        return this.segment.getValue();
    },

    getValue: function () {
        return this.resultPane.getValue();
    }
});
BI.SelectDataSearchResultPane.EVENT_CHANGE = "EVENT_CHANGE";
BI.SelectDataSearchResultPane.EVENT_SEARCH_TYPE_CHANGE = "EVENT_SEARCH_TYPE_CHANGE";
$.shortcut('bi.select_data_search_result_pane', BI.SelectDataSearchResultPane);/**
 * search面板选项栏
 *
 * Created by GUY on 2015/9/16.
 * @class BI.SelectDataSearchSegment
 * @extends BI.Widget
 */
BI.SelectDataSearchSegment = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SelectDataSearchSegment.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-data-search-segment",
            height: 60
        });
    },

    //创建所有数据和业务包选项
    _createSectionTab: function () {
        var self = this;
        this.pack = BI.createWidget({
            type: "bi.line_segment_button",
            height: 24,
            selected: true,
            text: BI.i18nText("BI-Current_Package"),
            value: BI.SelectDataSearchSegment.SECTION_PACKAGE
        });
        this.all = BI.createWidget({
            type: "bi.line_segment_button",
            height: 24,
            text: BI.i18nText("BI-All_Data"),
            value: BI.SelectDataSearchSegment.SECTION_ALL
        });

        this.button_group = BI.createWidget({
            type: "bi.line_segment",
            height: 25,
            items: [this.all, this.pack]
        });

        this.button_group.on(BI.ButtonGroup.EVENT_CHANGE, function () {
            self.fireEvent(BI.SelectDataSearchSegment.EVENT_CHANGE);
        });
        return this.button_group;
    },

    _createSegmet: function () {
        var self = this;
        this.segment = BI.createWidget({
            type: "bi.segment",
            height: 20,
            cls: "search-segment-field-table",
            items: [{
                text: BI.i18nText("BI-Basic_Field"),
                selected: true,
                value: BI.SelectDataSearchSegment.SECTION_FIELD
            }, {
                text: BI.i18nText("BI-Basic_Table"),
                value: BI.SelectDataSearchSegment.SECTION_TABLE
            }]
        });
        this.segment.on(BI.Segment.EVENT_CHANGE, function () {
            self.fireEvent(BI.SelectDataSearchSegment.EVENT_CHANGE);
        });
        return this.segment;
    },

    _init: function () {
        BI.SelectDataSearchSegment.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [this._createSectionTab(), {
                type: "bi.absolute",
                height: 35,
                items: [{
                    el: this._createSegmet(),
                    top: 10,
                    right: 10,
                    left: 10,
                    bottom: 5
                }]
            }]
        });
    },

    setValue: function (v) {
        var self = this;
        BI.each([BI.SelectDataSearchSegment.SECTION_ALL,
            BI.SelectDataSearchSegment.SECTION_PACKAGE], function (i, key) {
            if (key & v) {
                self.button_group.setValue(key & v);
            }
        });
        BI.each([BI.SelectDataSearchSegment.SECTION_FIELD,
            BI.SelectDataSearchSegment.SECTION_TABLE], function (i, key) {
            if (key & v) {
                self.segment.setValue(key & v);
            }
        });
    },

    getValue: function () {
        return this.button_group.getValue()[0] | this.segment.getValue()[0]
    }
});

BI.extend(BI.SelectDataSearchSegment, {
    SECTION_ALL: 0x1,
    SECTION_PACKAGE: 0x10,
    SECTION_FIELD: 0x100,
    SECTION_TABLE: 0x1000
});
BI.SelectDataSearchSegment.EVENT_CHANGE = "SelectDataSearchSegment.EVENT_CHANGE";
$.shortcut('bi.select_data_search_segment', BI.SelectDataSearchSegment);/**
 * 切换业务包
 *
 * Created by GUY on 2015/9/16.
 * @class BI.SelectDataSwitcher
 * @extends BI.Widget
 */
BI.SelectDataSwitcher = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SelectDataSwitcher.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-data-switcher",
            packages: [],
            itemsCreator: BI.emptyFn
        });
    },

    _init: function () {
        BI.SelectDataSwitcher.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.combo = BI.createWidget({
            type: "bi.single_tree_combo",
            height: 25,
            items: o.packages
        });
        this.combo.on(BI.SingleTreeCombo.EVENT_CHANGE, function () {
            self.tree.populate();
            self.fireEvent(BI.SelectDataSwitcher.EVENT_CHANGE, arguments);
        });

        this.tree = BI.createWidget({
            type: "bi.select_data_tree",
            itemsCreator: function () {
                var args = Array.prototype.slice.call(arguments, 0);
                args[0].packageId = self.getPackageId();
                o.itemsCreator.apply(self, args);
            }
        });
        this.tree.on(BI.SelectDataTree.EVENT_CHANGE, function () {
            self.fireEvent(BI.SelectDataSwitcher.EVENT_CLICK_ITEM, arguments);
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: {
                    type: "bi.absolute",
                    hgap: 10,
                    items: [{
                        el: this.combo
                    }]
                },
                height: 30
            }, {
                el: this.tree
            }]
        });
    },

    setEnable: function (v) {
        BI.SelectDataSwitcher.superclass.setEnable.apply(this, arguments);
        this.tree.setEnable(v)
    },


    setPackage: function (pId) {
        this.combo.setValue([pId]);
        this.tree.populate();
    },

    getPackageId: function () {
        return this.combo.getValue()[0];
    },

    setValue: function (v) {
        this.tree.setValue(v);
    },

    getValue: function () {
        return this.tree.getValue();
    },

    populate: function () {
        this.tree.populate.apply(this.tree, arguments);
    },

    populatePackages: function (pacakges) {
        this.options.packages = pacakges;
        var pId = this.getPackageId();
        this.combo.populate(pacakges);
        if (BI.isKey(pId)) {
            this.combo.setValue(pId);
        }
    }
});
BI.SelectDataSwitcher.EVENT_CLICK_ITEM = "EVENT_CLICK_ITEM";
BI.SelectDataSwitcher.EVENT_CHANGE = "SelectDataSwitcher.EVENT_CHANGE";
$.shortcut('bi.select_data_switcher', BI.SelectDataSwitcher);/**
 * 字段列表展开Expander
 *
 * Created by GUY on 2015/9/14.
 * @class BI.SelectDataExpander
 * @extends BI.Widget
 */
BI.SelectDataExpander = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SelectDataExpander.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-data-expander",
            el: {},
            popup: {
                items: [],
                itemsCreator: BI.emptyFn
            }
        });
    },

    _init: function () {
        BI.SelectDataExpander.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget(o.el);
        this.expander = BI.createWidget({
            type: "bi.expander",
            element: this,
            isDefaultInit: false,
            el: this.trigger,
            popup: BI.extend({
                type: "bi.select_data_loader"
            }, o.popup)
        });
        this.expander.on(BI.Controller.EVENT_CHANGE, function (type) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.expander.on(BI.Expander.EVENT_EXPAND, function(){

        });
        this.expander.on(BI.Expander.EVENT_COLLAPSE, function(){
            this.getView().hideView();
        });
        this.expander.on(BI.Expander.EVENT_AFTER_INIT, function () {
            this.getView().populate();
        });
        this.expander.on(BI.Expander.EVENT_CHANGE, function () {
            self.trigger.setValue(this.getValue());
        });
    },

    setEnable: function (v) {
        BI.SelectDataExpander.superclass.setEnable.apply(this, arguments)
        this.expander.setEnable(v);
        this.trigger.setEnable(v)
    },

    doBehavior: function () {
        this.trigger.doRedMark.apply(this.trigger, arguments);
        this.expander.doBehavior.apply(this.expander, arguments);
    },

    setValue: function (v) {
        this.expander.setValue(v);
    },

    getValue: function () {
        return this.expander.getValue();
    },

    showView: function(b){
        this.expander.showView();
    },

    hideView: function(){
        this.expander.hideView();
    },

    isExpanded: function () {
        return this.expander.isExpanded();
    },

    getAllLeaves: function () {
        return this.expander.getAllLeaves();
    },

    getNodeById: function (id) {
        return this.expander.getNodeById(id);
    },

    getNodeByValue: function (value) {
        return this.expander.getNodeByValue(value);
    }
});
$.shortcut("bi.select_data_expander", BI.SelectDataExpander);/**
 * 字段列表
 *
 * Created by GUY on 2015/9/14.
 * @class BI.SelectDataLoader
 * @extends BI.Widget
 */
BI.SelectDataLoader = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SelectDataLoader.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-data-loader",
            items: [],
            el: {},
            itemsCreator: BI.emptyFn
        });
    },

    _init: function () {
        BI.SelectDataLoader.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.loader = BI.createWidget({
            type: "bi.loader",
            isDefaultInit: false,
            element: this,
            items: o.items,
            itemsCreator: o.itemsCreator,
            el: BI.extend({
                type: "bi.button_tree",
                behaviors: {
                    redmark: function () {
                        return true;
                    }
                },
                chooseType: BI.Selection.Multi,
                layouts: [{
                    type: "bi.vertical",
                    hgap: 0,
                    vgap: 0
                }]
            }, o.el)
        });
        this.loader.on(BI.Controller.EVENT_CHANGE, function (type, val, ob) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                if (ob.isSelected()) {
                    var index = this.getIndexByValue(val);
                    if (index > -1) {
                        var alls = this.getAllButtons();
                        if (index - 1 >= 0) {
                            if (BI.isNotNull(alls[index - 1]) && BI.isFunction(alls[index - 1].isSelected)
                                && alls[index - 1].isSelected()) {
                                alls[index - 1].setBottomLineVisible();
                                ob.setTopLineVisible();
                            }
                        }
                        if (index + 1 <= alls.length - 1) {
                            if (BI.isNotNull(alls[index + 1]) && BI.isFunction(alls[index + 1].isSelected)
                                && alls[index + 1].isSelected()) {
                                alls[index + 1].setTopLineVisible();
                                ob.setBottomLineVisible();
                            }
                        }
                    }
                } else {
                    var index = this.getIndexByValue(val);
                    if (index > -1) {
                        var alls = this.getAllButtons();
                        if (index - 1 >= 0) {
                            if (BI.isNotNull(alls[index - 1]) && BI.isFunction(alls[index - 1].isSelected)
                                && alls[index - 1].isSelected()) {
                                alls[index - 1].setBottomLineInVisible();
                            }
                        }
                        if (index + 1 <= alls.length - 1) {
                            if (BI.isNotNull(alls[index + 1]) && BI.isFunction(alls[index + 1].isSelected)
                                && alls[index + 1].isSelected()) {
                                alls[index + 1].setTopLineInVisible();
                            }
                        }
                    }
                }
                self.fireEvent(BI.SelectDataLoader.EVENT_CHANGE);
            }
        })
    },

    setEnable: function (v) {
        BI.SelectDataLoader.superclass.setEnable.apply(this, arguments);
        this.loader.setEnable(v)
    },

    doBehavior: function () {
        this.loader.doBehavior.apply(this.loader, arguments);
    },

    populate: function () {
        this.loader.populate.apply(this.loader, arguments);
    },

    getAllButtons: function(){
        return this.loader.getAllButtons();
    },

    showView: function(b){
        BI.each(this.loader.getAllButtons(),function(i, button){
            button.showView && button.showView(b);
        })
    },

    hideView: function(b){
        BI.each(this.loader.getAllButtons(),function(i, button){
            button.hideView && button.hideView(b);
        })
    },

    setValue: function (v) {
        this.loader.setValue(v);
    },

    getValue: function () {
        return this.loader.getValue();
    },

    empty: function () {
        this.loader.empty();
    }
});
BI.SelectDataLoader.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.select_data_loader", BI.SelectDataLoader);/**
 * Created by GUY on 2015/9/6.
 * @class BI.SelectDataLevelNode
 * @extends BI.NodeButton
 */
BI.SelectDataLevelNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        return BI.extend(BI.SelectDataLevelNode.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-select-data-level0-node bi-list-item",
            id: "",
            pId: "",
            layer: 0,
            open: false,
            height: 25
        })
    },
    _init: function () {
        var title = this.options.title;
        var warningTitle = this.options.warningTitle;
        this.options.title = "";
        this.options.warningTitle = "";
        BI.SelectDataLevelNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.checkbox = BI.createWidget({
            type: "bi.tree_group_node_checkbox"
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
            keyword: o.keyword,
            title: title,
            warningTitle: warningTitle,
            disabled: o.disabled,
            py: o.py
        });
        this.tip = BI.createWidget({
            type: "bi.label",
            cls: "select-data-selected-count-label",
            whiteSpace: "nowrap",
            width: 25,
            height: o.height
        });
        this.checkbox.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {
                self.setSelected(self.isSelected());
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: {
                    type: "bi.layout"
                },
                width: o.layer * 20
            }, {
                width: 23,
                el: this.checkbox
            }, {
                el: this.text
            }, {
                width: 25,
                el: this.tip
            }]
        })
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doClick: function () {
        BI.SelectDataLevelNode.superclass.doClick.apply(this, arguments);
        this.checkbox.setSelected(this.isOpened());
    },

    setOpened: function (v) {
        BI.SelectDataLevelNode.superclass.setOpened.apply(this, arguments);
        this.checkbox.setSelected(v);
    },

    setValue: function (items) {
        BI.SelectDataLevelNode.superclass.setValue.apply(this, arguments);
        if (BI.isEmpty(items)) {
            this.tip.setText("");
        } else {
            this.tip.setText("(" + items.length + ")");
        }
        this.tip.setTitle(items.toString());
    },

    setEnable: function (b) {
        BI.SelectDataLevelNode.superclass.setEnable.apply(this, arguments);
        this.checkbox.setEnable(b);
        this.text.setEnable(b);
    }
});

$.shortcut("bi.select_data_level_node", BI.SelectDataLevelNode);/**
 * Created by GUY on 2015/9/15.
 * @class BI.SelectDataLevel1DateNode
 * @extends BI.NodeButton
 */
BI.SelectDataLevel1DateNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        return BI.extend(BI.SelectDataLevel1DateNode.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-select-data-level1-date-node bi-list-item",
            id: "",
            pId: "",
            layer: 1,
            open: false,
            height: 25
        })
    },

    _getFieldClass: function (type) {
        switch (type) {
            case BICst.COLUMN.STRING:
                return "select-data-field-string-group-font";
            case BICst.COLUMN.NUMBER:
                return "select-data-field-number-group-font";
            case BICst.COLUMN.DATE:
                return "select-data-field-date-group-font";
            case BICst.COLUMN.COUNTER:
                return "select-data-field-number-group-font";
            default:
                return "select-data-field-date-group-font";
        }
    },

    _init: function () {
        BI.SelectDataLevel1DateNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.button = BI.createWidget({
            type: "bi.icon_text_item",
            cls: this._getFieldClass(o.fieldType),
            text: o.text,
            value: o.value,
            keyword: o.keyword,
            height: o.height,
            textLgap: 10,
            textRgap: 5
        });

        this.checkbox = BI.createWidget({
            type: "bi.tree_group_node_checkbox"
        });
        this.checkbox.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {
                self.setSelected(self.isSelected());
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.button.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: {
                    type: "bi.layout"
                },
                width: o.layer * 20
            }, {
                el: this.button
            }, {
                el: this.checkbox,
                width: 25
            }]
        })
    },

    doRedMark: function () {
        this.button.doRedMark.apply(this.button, arguments);
    },

    unRedMark: function () {
        this.button.unRedMark.apply(this.button, arguments);
    },

    doClick: function () {
        BI.SelectDataLevel1DateNode.superclass.doClick.apply(this, arguments);
        this.checkbox.setSelected(this.isOpened());
    },

    setOpened: function (v) {
        BI.SelectDataLevel1DateNode.superclass.setOpened.apply(this, arguments);
        this.checkbox.setSelected(v);
    },

    setValue: function (items) {
        BI.SelectDataLevel1DateNode.superclass.setValue.apply(this, arguments);
    },

    setEnable: function (b) {
        BI.SelectDataLevel1DateNode.superclass.setEnable.apply(this, arguments);
        this.checkbox.setEnable(b);
    }
});

$.shortcut("bi.select_data_level1_date_node", BI.SelectDataLevel1DateNode);/**
 * Created by GUY on 2015/9/15.
 * @class BI.SelectDataLevel2DateNode
 * @extends BI.NodeButton
 */
BI.SelectDataLevel2DateNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        return BI.extend(BI.SelectDataLevel2DateNode.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-select-data-level2-date-node bi-list-item",
            id: "",
            pId: "",
            layer: 2,
            open: false,
            height: 25
        })
    },

    _getFieldClass: function (type) {
        switch (type) {
            case BICst.COLUMN.STRING:
                return "select-data-field-string-group-font";
            case BICst.COLUMN.NUMBER:
                return "select-data-field-number-group-font";
            case BICst.COLUMN.DATE:
                return "select-data-field-date-group-font";
            case BICst.COLUMN.COUNTER:
                return "select-data-field-number-group-font";
            default:
                return "select-data-field-date-group-font";
        }
    },

    _init: function () {
        BI.SelectDataLevel2DateNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.button = BI.createWidget({
            type: "bi.icon_text_item",
            cls: this._getFieldClass(o.fieldType),
            text: o.text,
            value: o.value,
            keyword: o.keyword,
            height: o.height,
            textLgap: 10,
            textRgap: 5
        });

        this.checkbox = BI.createWidget({
            type: "bi.tree_group_node_checkbox"
        });
        this.checkbox.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {
                self.setSelected(self.isSelected());
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.button.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: {
                    type: "bi.layout"
                },
                width: o.layer * 20
            }, {
                el: this.button
            }, {
                el: this.checkbox,
                width: 25
            }]
        })
    },

    doRedMark: function () {
        this.button.doRedMark.apply(this.button, arguments);
    },

    unRedMark: function () {
        this.button.unRedMark.apply(this.button, arguments);
    },

    doClick: function () {
        BI.SelectDataLevel2DateNode.superclass.doClick.apply(this, arguments);
        this.checkbox.setSelected(this.isOpened());
    },

    setOpened: function (v) {
        BI.SelectDataLevel2DateNode.superclass.setOpened.apply(this, arguments);
        this.checkbox.setSelected(v);
    },

    setValue: function (items) {
        BI.SelectDataLevel2DateNode.superclass.setValue.apply(this, arguments);
    },

    setEnable: function (b) {
        BI.SelectDataLevel2DateNode.superclass.setEnable.apply(this, arguments);
        this.checkbox.setEnable(b);
    }
});

$.shortcut("bi.select_data_level2_date_node", BI.SelectDataLevel2DateNode);/**
 * 字段列表展开Expander
 *
 * Created by GUY on 2015/9/14.
 * @class BI.SelectDataTree
 * @extends BI.Widget
 */
BI.SelectDataTree = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SelectDataTree.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-data-tree",
            el: {},
            expander: {},
            items: [],
            itemsCreator: BI.emptyFn
        });
    },

    _init: function () {
        BI.SelectDataTree.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.tree = BI.createWidget({
            type: "bi.custom_tree",
            element: this,
            expander: BI.extend({
                type: "bi.select_data_expander",
                el: {},
                popup: {
                    type: "bi.select_data_tree"
                }
            }, o.expander),
            items: o.items,
            itemsCreator: o.itemsCreator,

            el: BI.extend({
                type: "bi.select_data_loader"
            }, o.el)
        });
        this.tree.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.tree.on(BI.CustomTree.EVENT_CHANGE, function () {
            self.fireEvent(BI.SelectDataTree.EVENT_CHANGE, arguments);
        })
    },


    setEnable: function (v) {
        BI.SelectDataTree.superclass.setEnable.apply(this, arguments);
        this.tree.setEnable(v)
    },

    showView: function(b){
        BI.each(this.tree.getAllButtons(),function(i, button){
            button.showView && button.showView(b);
        })
    },

    hideView: function(b){
        BI.each(this.tree.getAllButtons(),function(i, button){
            button.hideView && button.hideView(b);
        })
    },

    getAllButtons: function(){
        return this.tree.getAllButtons();
    },

    doBehavior: function () {
        this.tree.doBehavior.apply(this.tree, arguments);
    },

    empty: function () {

    },

    populate: function (items) {
        this.tree.populate.apply(this.tree, arguments);
    },

    setValue: function (v) {
        this.tree.setValue(v);
    },

    getValue: function () {
        //这里需要去重，因为很有可能expander中保存了之前的value值
        return BI.uniq(this.tree.getValue());
    }
});
BI.SelectDataTree.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.select_data_tree", BI.SelectDataTree);/**
 * Created by GUY on 2015/9/6.
 * @class BI.SelectDataLevelItem
 * @extends BI.Single
 */
BI.SelectDataLevelItem = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        return BI.extend(BI.SelectDataLevelItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-select-data-level0-item",
            height: 25,
            hgap: 0,
            layer: 1,
            fieldType: BICst.COLUMN.STRING,
            lgap: 0,
            rgap: 0
        })
    },

    _getFieldClass: function (type) {
        switch (type) {
            case BICst.COLUMN.STRING:
                return "select-data-field-string-font";
            case BICst.COLUMN.NUMBER:
                return "select-data-field-number-font";
            case BICst.COLUMN.DATE:
                return "select-data-field-date-font";
            case BICst.COLUMN.COUNTER:
                return "select-data-field-number-font";
            default:
                return "select-data-field-number-font";
        }
    },

    _init: function () {
        BI.SelectDataLevelItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.button = BI.createWidget({
            type: "bi.blank_icon_text_item",
            trigger: "mousedown",
            cls: "select-data-level0-item-button " + this._getFieldClass(o.fieldType),
            blankWidth: o.layer * 20,
            text: o.text,
            value: o.value,
            keyword: o.keyword,
            height: 25,
            textLgap: 10,
            textRgap: 5
        });
        this.button.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {
                self.setSelected(self.isSelected());
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.CLICK, self.getValue(), self);
        });

        this.topLine = BI.createWidget({
            type: "bi.layout",
            height: 0,
            cls: "select-data-top-line"
        });
        this.bottomLine = BI.createWidget({
            type: "bi.layout",
            height: 0,
            cls: "select-data-bottom-line"
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.topLine,
                top: 0,
                left: o.lgap,
                right: o.rgap
            }, {
                el: this.bottomLine,
                bottom: 0,
                left: o.lgap,
                right: o.rgap
            }, {
                el: this.button,
                top: 0,
                left: o.lgap,
                right: o.rgap
            }]
        });
        this.topLine.invisible();
        this.bottomLine.invisible();
    },

    setEnable: function (v) {
        BI.SelectDataLevelItem.superclass.setEnable.apply(this, arguments)
        this.button.setEnable(v);
        try {
            this.button.element.draggable(v ? "enable" : "disable");
        } catch (e) {

        }
        if (!v) {
            this.setSelected(false);
        }
    },

    isSelected: function () {
        return this.button.isSelected();
    },

    setSelected: function (b) {
        this.button.setSelected(b);
        if (!b) {
            this.topLine.invisible();
            this.bottomLine.invisible();
            this.element.removeClass("select-data-item-top");
            this.element.removeClass("select-data-item-bottom");
        }
    },

    setTopLineVisible: function () {
        this.topLine.visible();
        this.element.addClass("select-data-item-top");
    },

    setTopLineInVisible: function () {
        this.topLine.invisible();
        this.element.removeClass("select-data-item-top");
    },

    setBottomLineVisible: function () {
        this.bottomLine.visible();
        this.element.addClass("select-data-item-bottom");
    },

    setBottomLineInVisible: function () {
        this.bottomLine.invisible();
        this.element.removeClass("select-data-item-bottom");
    },

    doRedMark: function () {
        this.button.doRedMark.apply(this.button, arguments);
    },

    unRedMark: function () {
        this.button.unRedMark.apply(this.button, arguments);
    },

    doHighLight: function () {
        this.button.doHighLight.apply(this.button, arguments);
    },

    unHighLight: function () {
        this.button.unHighLight.apply(this.button, arguments);
    }
});

$.shortcut("bi.select_data_level_item", BI.SelectDataLevelItem);/**
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

$.shortcut("bi.select_tree_first_plus_group_node", BI.SelectTreeFirstPlusGroupNode);/**
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

$.shortcut("bi.select_tree_last_plus_group_node", BI.SelectTreeLastPlusGroupNode);/**
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

$.shortcut("bi.select_tree_mid_plus_group_node", BI.SelectTreeMidPlusGroupNode);/**
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


$.shortcut("bi.select_tree_combo", BI.SelectTreeCombo);/**
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

$.shortcut("bi.select_tree_expander", BI.SelectTreeExpander);/**
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
$.shortcut("bi.select_tree_popup", BI.SelectTreePopup);/**
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
$.shortcut('bi.sequence_table_dynamic_number', BI.SequenceTableDynamicNumber);/**
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

        this.header = BI.createWidget({
            type: "bi.table_style_cell",
            cls: "sequence-table-title-cell",
            styleGetter: o.headerCellStyleGetter,
            text: BI.i18nText("BI-Number_Index")
        });
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

        this.layout = BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: this.header,
                height: o.headerRowSize * o.header.length
            }, {
                el: this.scrollContainer
            }]
        });
        this._populate();
    },

    _layout: function () {
        var self = this, o = this.options;
        var headerHeight = o.headerRowSize * o.header.length;
        var items = this.layout.attr("items");
        if (o.isNeedFreeze === false) {
            items[0].height = 0;
        } else if (o.isNeedFreeze === true) {
            items[0].height = headerHeight;
        }
        this.layout.attr("items", items);
        this.layout.resize();
        this.container.setHeight(o.items.length * o.rowSize);
        this.scrollContainer.element.scrollTop(o.scrollTop);
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
                    cls: "sequence-table-number-cell",
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
        this.header.populate();
        this._layout();
        this._calculateChildrenToRender();
    },

    setVerticalScroll: function (scrollTop) {
        if (this.options.scrollTop !== scrollTop) {
            this.options.scrollTop = scrollTop;
            this.scrollContainer.element.scrollTop(scrollTop);
        }
    },

    getVerticalScroll: function () {
        return this.options.scrollTop;
    },

    setVPage: function (v) {
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
$.shortcut('bi.sequence_table_list_number', BI.SequenceTableListNumber);/**
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
            height: o.height - BI.GridTableScrollbar.SIZE,

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
$.shortcut('bi.sequence_table', BI.SequenceTable);/**
 * 简单的搜索功能
 *
 * Created by GUY on 2015/9/16.
 * @class BI.SimpleSearcher
 * @extends BI.Widget
 */
BI.SimpleSearcher = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SimpleSearcher.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-simple-searcher",
            items: [],
            itemsCreator: BI.emptyFn,
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE
        });
    },

    _init: function () {
        BI.SimpleSearcher.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;

        this.tree = BI.createWidget({
            type: "bi.select_data_tree",
            items: o.items,
            el: {
                el: {
                    chooseType: o.chooseType
                }
            },
            itemsCreator: o.itemsCreator
        });
        this.tree.on(BI.SelectDataTree.EVENT_CHANGE, function () {
            self.fireEvent(BI.SimpleSearcher.EVENT_CHANGE, arguments);
        });

        this.searcher = BI.createWidget({
            type: "bi.searcher",
            el: {
                type: "bi.small_search_editor"
            },
            isAutoSearch: false, //是否自动搜索
            isAutoSync: false,
            onSearch: function (op, populate) {
                o.itemsCreator(op, function (searchResult, matchResult) {
                    populate(searchResult, matchResult, op.keyword);
                })
            },
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
            popup: {
                matcher: {
                    type: "bi.select_data_tree",
                    el: {
                        el: {
                            chooseType: o.chooseType
                        }
                    },
                    itemsCreator: o.itemsCreator
                },
                searcher: {
                    type: "bi.select_data_tree",
                    el: {
                        el: {
                            chooseType: o.chooseType
                        }
                    },
                    itemsCreator: o.itemsCreator
                }
            },
            adapter: this.tree
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: {
                    type: "bi.absolute",
                    items: [{
                        el: this.searcher,
                        left: 10,
                        right: 10,
                        top: 10
                    }]
                },
                height: 45
            }, this.tree]
        })
    },

    stopSearch: function () {
        this.searcher.stopSearch();
    },

    setValue: function (v) {

    },

    getValue: function () {
        return this.searcher.getValue();
    },

    populate: function () {
        this.tree.populate.apply(this.tree, arguments);
    }
});
BI.SimpleSearcher.EVENT_CHANGE = "SimpleSearcher.EVENT_CHANGE";
$.shortcut('bi.simple_searcher', BI.SimpleSearcher);/**
 * 完成搜索功能模块
 *
 * Created by GUY on 2015/9/16.
 * @class BI.SimpleSelectDataSearcher
 * @extends BI.Widget
 */
BI.SimpleSelectDataSearcher = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SimpleSelectDataSearcher.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-simple-select-data-searcher",
            items: [],
            itemsCreator: BI.emptyFn,
            popup: {},
            adapter: {}
        });
    },

    _init: function () {
        BI.SimpleSelectDataSearcher.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;

        this.tree = BI.createWidget(o.adapter, {
            type: "bi.select_data_tree",
            items: o.items,
            el: {
                el: {
                    chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE
                }
            },
            itemsCreator: o.itemsCreator
        });
        this.tree.on(BI.SelectDataTree.EVENT_CHANGE, function () {
            self.fireEvent(BI.SimpleSelectDataSearcher.EVENT_CLICK_ITEM, arguments);
        });

        this.searcherPane = BI.createWidget(o.popup, {
            type: "bi.simple_select_data_search_result_pane",
            itemsCreator: o.itemsCreator
        });
        this.searcherPane.on(BI.SimpleSelectDataSearchResultPane.EVENT_SEARCH_TYPE_CHANGE, function () {
            self.searcher.doSearch();
        });
        this.searcherPane.on(BI.SimpleSelectDataSearchResultPane.EVENT_CHANGE, function () {
            self.fireEvent(BI.SimpleSelectDataSearcher.EVENT_CLICK_ITEM, arguments);
        });


        this.searcher = BI.createWidget({
            type: "bi.searcher",
            el: {
                type: "bi.small_search_editor"
            },
            isAutoSearch: false, //是否自动搜索
            isAutoSync: false,
            onSearch: function (op, populate) {
                o.itemsCreator(BI.extend(op, {
                    searchType: self.searcherPane.getSegmentValue()
                }), function (searchResult, matchResult) {
                    populate(searchResult, matchResult, op.keyword);
                })
            },
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
            popup: this.searcherPane,
            adapter: this.tree
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: {
                    type: "bi.absolute",
                    items: [{
                        el: this.searcher,
                        left: 10,
                        right: 10,
                        top: 10
                    }]
                },
                height: 45
            }, this.tree]
        })
    },

    stopSearch: function () {
        this.searcher.stopSearch();
    },

    setValue: function (v) {

    },

    getValue: function () {
        return this.searcher.getValue();
    },

    populate: function () {
        this.tree.populate.apply(this.tree, arguments);
    }
});
BI.SimpleSelectDataSearcher.EVENT_CLICK_ITEM = "EVENT_CLICK_ITEM";
$.shortcut('bi.simple_select_data_searcher', BI.SimpleSelectDataSearcher);/**
 * 搜索结果面板
 *
 * Created by GUY on 2015/9/16.
 * @class BI.SimpleSelectDataSearchResultPane
 * @extends BI.Widget
 */
BI.SimpleSelectDataSearchResultPane = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SimpleSelectDataSearchResultPane.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-select-data-search-result-pane bi-select-data-search-result-pane bi-searcher-view",
            itemsCreator: BI.emptyFn,
            segment: {}
        });
    },

    _init: function () {
        BI.SimpleSelectDataSearchResultPane.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.segment = BI.createWidget(o.segment, {
            type: "bi.simple_select_data_search_segment",
            cls: "search-result-toolbar"
        });
        this.segment.on(BI.SimpleSelectDataSearchSegment.EVENT_CHANGE, function () {
            self.fireEvent(BI.SimpleSelectDataSearchResultPane.EVENT_SEARCH_TYPE_CHANGE);
        });

        this.resultPane = BI.createWidget({
            type: "bi.searcher_view",
            matcher: {
                type: "bi.select_data_tree",
                el: {
                    el: {
                        chooseType: BI.Selection.Single
                    }
                },
                itemsCreator: o.itemsCreator
            },
            searcher: {
                type: "bi.select_data_tree",
                el: {
                    el: {
                        chooseType: BI.Selection.Single
                    }
                },
                itemsCreator: o.itemsCreator
            }
        });

        this.resultPane.on(BI.SearcherView.EVENT_CHANGE, function () {
            self.fireEvent(BI.SimpleSelectDataSearchResultPane.EVENT_CHANGE, arguments);
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: this.segment,
                height: 30
            }, {
                type: "bi.border",
                cls: "search-result-line",
                height: 2
            }, {
                type: "bi.border",
                cls: "search-result-line",
                height: 1
            }, {
                type: "bi.absolute",
                items: [{
                    el: this.resultPane,
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }]
            }]
        });
    },

    empty: function () {
        this.resultPane.empty();
    },

    populate: function (searchResult, matchResult, keyword) {
        this.resultPane.populate.apply(this.resultPane, arguments);
    },

    setValue: function (v) {

    },

    getSegmentValue: function () {
        return this.segment.getValue();
    },

    getValue: function () {
        return this.resultPane.getValue();
    }
});
BI.SimpleSelectDataSearchResultPane.EVENT_SEARCH_TYPE_CHANGE = "EVENT_SEARCH_TYPE_CHANGE";
BI.SimpleSelectDataSearchResultPane.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut('bi.simple_select_data_search_result_pane', BI.SimpleSelectDataSearchResultPane);/**
 * search面板选项栏
 *
 * Created by GUY on 2015/9/16.
 * @class BI.SimpleSelectDataSearchSegment
 * @extends BI.Widget
 */
BI.SimpleSelectDataSearchSegment = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SimpleSelectDataSearchSegment.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-select-data-search-segment",
            height: 30,
            items: [{
                text: BI.i18nText("BI-Basic_Field"),
                selected: true,
                value: BI.SelectDataSearchSegment.SECTION_FIELD
            }, {
                text: BI.i18nText("BI-Basic_Table"),
                value: BI.SelectDataSearchSegment.SECTION_TABLE
            }]
        });
    },

    _init: function () {
        BI.SimpleSelectDataSearchSegment.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.segment = BI.createWidget({
            type: "bi.segment",
            height: 20,
            cls: "search-segment-field-table",
            items: o.items
        });
        this.segment.on(BI.Segment.EVENT_CHANGE, function(){
            self.fireEvent(BI.SimpleSelectDataSearchSegment.EVENT_CHANGE);
        });
        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [{
                type: "bi.absolute",
                height: o.height,
                items: [{
                    el: this.segment,
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 5
                }]
            }]
        });
    },

    setValue: function (v) {
        var self = this;
        BI.each([BI.SelectDataSearchSegment.SECTION_FIELD,
            BI.SelectDataSearchSegment.SECTION_TABLE], function (i, key) {
            if (key & v) {
                self.segment.setValue(key & v);
            }
        });
    },

    getValue: function () {
        return this.segment.getValue()[0]
    }
});

BI.SimpleSelectDataSearchSegment.EVENT_CHANGE = "SimpleSelectDataSearchSegment.EVENT_CHANGE";
$.shortcut('bi.simple_select_data_search_segment', BI.SimpleSelectDataSearchSegment);/**
 * Created by GUY on 2015/9/6.
 * @class BI.SimpleSelectDataLevel0Node
 * @extends BI.NodeButton
 */
BI.SimpleSelectDataLevel0Node = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        return BI.extend(BI.SimpleSelectDataLevel0Node.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-simple-select-data-level0-node bi-list-item",
            id: "",
            pId: "",
            open: false,
            height: 25
        })
    },
    _init: function () {
        BI.SimpleSelectDataLevel0Node.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.checkbox = BI.createWidget({
            type: "bi.tree_group_node_checkbox"
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
                self.setSelected(self.isSelected());
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                width: 23,
                el: this.checkbox
            }, {
                el: this.text
            }]
        })
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doClick: function () {
        BI.SimpleSelectDataLevel0Node.superclass.doClick.apply(this, arguments);
        this.checkbox.setSelected(this.isOpened());
    },

    setOpened: function (v) {
        BI.SimpleSelectDataLevel0Node.superclass.setOpened.apply(this, arguments);
        this.checkbox.setSelected(v);
    },

    setEnable: function (b) {
        BI.SimpleSelectDataLevel0Node.superclass.setEnable.apply(this, arguments);
        this.checkbox.setEnable(b);
    }
});

$.shortcut("bi.simple_select_data_level0_node", BI.SimpleSelectDataLevel0Node);/**
 * Created by GUY on 2015/9/6.
 * @class BI.SimpleSelectDataLevel1Node
 * @extends BI.NodeButton
 */
BI.SimpleSelectDataLevel1Node = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        return BI.extend(BI.SimpleSelectDataLevel1Node.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-simple-select-data-level1-node bi-list-item",
            id: "",
            pId: "",
            open: false,
            height: 25
        })
    },
    _init: function () {
        BI.SimpleSelectDataLevel1Node.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.checkbox = BI.createWidget({
            type: "bi.tree_group_node_checkbox"
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
            if(type ===  BI.Events.CLICK) {
                self.setSelected(self.isSelected());
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: {
                    type: "bi.layout"
                },
                width: 10
            },{
                width: 23,
                el: this.checkbox
            }, {
                el: this.text
            }]
        })
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doClick: function () {
        BI.SimpleSelectDataLevel1Node.superclass.doClick.apply(this, arguments);
        this.checkbox.setSelected(this.isOpened());
    },

    setOpened: function (v) {
        BI.SimpleSelectDataLevel1Node.superclass.setOpened.apply(this, arguments);
        this.checkbox.setSelected(v);
    },

    setEnable: function (b) {
        BI.SimpleSelectDataLevel1Node.superclass.setEnable.apply(this, arguments);
        this.checkbox.setEnable(b);
    }
});

$.shortcut("bi.simple_select_data_level1_node", BI.SimpleSelectDataLevel1Node);/**
 * Created by zcf on 2016/9/22.
 */
BI.SingleSlider = BI.inherit(BI.Widget, {
    _constant: {
        EDITOR_WIDTH: 90,
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
            cls: "blue-track",
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
            cls: "slider-editor-button",
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
                    rgap: c.EDITOR_WIDTH,
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
$.shortcut("bi.single_slider", BI.SingleSlider);/**
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
$.shortcut("bi.single_slider_slider", BI.Slider);/**
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
$.shortcut("bi.single_tree_combo", BI.SingleTreeCombo);/**
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
$.shortcut("bi.single_tree_popup", BI.SingleTreePopup);/**
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

$.shortcut("bi.single_tree_trigger", BI.SingleTreeTrigger);BI.HorizontalDashLine = BI.inherit(BI.Widget, {


    _defaultConfig: function () {
        return BI.extend(BI.HorizontalDashLine.superclass._defaultConfig.apply(this, arguments), {
            baseCls:"bi-svg-line-horizontal",
            gap:5,
            line:8,
            stroke: "#009de3",
            fill:"white",
            height:3,
            width:200
        })
    },

    _init: function () {
        BI.HorizontalDashLine.superclass._init.apply(this, arguments);
        var o = this.options;
        this.svg = BI.createWidget({
            type:"bi.svg",
            element: this,
            height: o.height,
            width: o.width
        })
        this.setMove()
    },

    setLength : function (w) {
        if(w === this.options.width){
            return;
        }
        BI.HorizontalDashLine.superclass.setWidth.apply(this, arguments);
        var o = this.options;
        this.setMove()
    },


    setMove:function() {
        var o = this.options;
        this.svg.clear();
        this.svg.path(this._createPath(0)).attr({
            stroke: o.stroke,
            fill: o.fill
        })
    },

    _createPath : function (startPos) {
        var o = this.options;
        var path ="";
        for(var j = 0; j < o.height; j++) {
            for(var i = startPos - o.line; i < o.width; i+= o.line) {
                path +="M" + (i + j)+ ","+ j
                path +="L" + (i + j + o.line) + "," + j
                i+= o.gap
            }
        }
        return path;
    }

})
$.shortcut("bi.horizontal_dash_line", BI.HorizontalDashLine);BI.VerticalDashLine = BI.inherit(BI.Widget, {


    _defaultConfig: function () {
        return BI.extend(BI.VerticalDashLine.superclass._defaultConfig.apply(this, arguments), {
            baseCls:"bi-svg-line-vertical",
            gap:5,
            line:8,
            stroke: "#009de3",
            fill:"white",
            height:200,
            width:3
        })
    },

    _init: function () {
        BI.VerticalDashLine.superclass._init.apply(this, arguments);
        var o = this.options;
        this.svg = BI.createWidget({
            type:"bi.svg",
            element: this,
            height: o.height,
            width: o.width
        })
        this.setMove()
    },

    setLength : function (w) {
        if(w === this.options.height){
            return;
        }
        BI.VerticalDashLine.superclass.setHeight.apply(this, arguments);
        this.setMove()
    },


    setMove:function() {
        var o = this.options;
        this.svg.clear();
        this.svg.path(this._createPath(0)).attr({
            stroke: o.stroke,
            fill: o.fill
        })
    },

    _createPath : function (startPos) {
        var o = this.options;
        var path ="";
        for(var j = 0; j < o.width; j++) {
            for(var i = startPos - o.line; i < o.height; i+= o.line) {
                path +="M"+ j + "," + (i + j)
                path +="L" + j + "," + (i + j + o.line)
                i+= o.gap
            }
        }
        return path;
    }

})
$.shortcut("bi.vertical_dash_line", BI.VerticalDashLine);BI.TriangleDragButton = BI.inherit(BI.Widget, {
    _defaultConfig: function() {
        return BI.extend(BI.TriangleDragButton.superclass._defaultConfig.apply(this, arguments), {
            baseCls:  "bi-triangle-drag-button",
            height : 30,
            width : 30,
            lineCount:6,
            stroke: "#009de3",
            fill:"white",
            drag : null
        })
    },


    _init : function() {
        BI.TriangleDragButton.superclass._init.apply(this, arguments);
        var o = this.options;
        var svg = BI.createWidget({
            type:"bi.svg",
            element: this,
            height: o.height,
            width: o.width
        })
        var path = "";
        var h_step = o.height/ o.lineCount;
        var w_step = o.width/ o.lineCount;
        for(var i = 0; i < o.lineCount; i++){
            path +="M0," +(h_step * (i + 1));
            path +="L" + (w_step * (i + 1)) +",0"
        }
        svg.path(path).attr({
            stroke: o.stroke,
            fill: o.fill
        })
        this.reInitDrag();
    },

    reInitDrag : function () {
        var o = this.options;
        if(BI.isNotNull(o.drag)) {
            this.element.draggable(o.drag)
        }
    }
});

$.shortcut("bi.triangle_drag_button", BI.TriangleDragButton);/**
 * 可以交换列位置的表格
 *
 * @class BI.SortableTable
 * @extends BI.Widget
 */
BI.SortableTable = BI.inherit(BI.Widget, {

    _const: {
        perColumnSize: 100,
        dragButtonWidth: 24,
        dragButtonHeight: 24,
        lineCount: 6,
        lineWidth: 3
    },

    _defaultConfig: function () {
        return BI.extend(BI.SortableTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-sortable-table",

            headerRowSize: 30,
            footerRowSize: 25,
            rowSize: 25,
            sortable: true,

            header: [],
            items: [] //二维数组
        });
    },

    _init: function () {
        BI.SortableTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.insertLine = [];

        this.table = BI.createWidget({
            type: "bi.table_view",
            isNeedResize: false,
            isResizeAdapt: false,
            columnSize: [],
            headerRowSize: o.headerRowSize,
            footerRowSize: o.footerRowSize,
            rowSize: o.rowSize,
            regionColumnSize: false,
            header: o.header,
            items: o.items
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_INIT, function () {
            if(o.sortable === true){
                self._initDrag();
                self._createDashedLines();
                self._createInsertLine();
            }
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_INIT, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_RESIZE, function () {
            if(o.sortable === true){
                self._createDashedLines();
                self._createInsertLine();
            }
            self.fireEvent(BI.Table.EVENT_TABLE_RESIZE, arguments);
        });

        this.table.element.mousemove(function(e){
            BI.each(self.dragHelpers, function(idx, dragHelper){
                var visible = (idx === self._getMouseInColumnIndex(e));
                dragHelper.setVisible(visible);
                BI.each(self.dragHelpersLines[idx], function(id, line){
                    line.setVisible(visible);
                })
            })
        })

        this.table.element.hover(function(e){
        }, function(e){
            BI.each(self.dragHelpers, function(idx, dragHelper){
                dragHelper.setVisible(false);
                BI.each(self.dragHelpersLines[idx], function(id, line){
                    line.setVisible(false);
                })
            })
        });

        this.element.droppable({
            accept: ".drag-header",
            drop: function (e, ui) {
                var absolutePosition = ui.position.left + self.table.getRightHorizontalScroll() + (e.pageX - ui.helper.offset().left);
                var dropPosition = self._getColumnsLeftBorderDistance();
                var insertIndex = self._getNearIndexFromArray(dropPosition, absolutePosition)
                //这个insertIndex是包含原元素的index
                //调整item顺序，重新populate
                var flag = self._exchangeItemsAndHeaderPosition(ui.helper.data("index"), insertIndex)
                if(flag === true){
                    BI.nextTick(function(){
                        self.populate(o.items, o.header);
                    });
                    self.fireEvent(BI.SortableTable.EVENT_CHANGE, ui.helper.data("index"), insertIndex);
                }
            }
        });

        BI.createWidget({
            type: "bi.vertical",
            scrollx: false,
            element: this,
            items: [this.table]
        });
    },

    /**
     * 插入到对应列的辅助线
     * @private
     */
    _createInsertLine: function(){
        var self = this;
        var dropPosition = this._getColumnsLeftBorderDistance();
        var height = this.table.getClientRegionRowSize()[0];
        var lineObj = {
            type: "bi.layout",
            cls: "insert-help-line",
            invisible: true
        };
        this.insertLine = [BI.createWidget(lineObj)];
        var hearders = this.table.getColumns().header[0];
        BI.each(hearders, function(idx, header){
            var line = BI.createWidget(BI.extend(lineObj));
            self.insertLine.push(line);
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this.table.element,
            items: BI.map(self.insertLine, function(idx, line){
                if(idx === self.insertLine.length - 1){
                    return {
                        el: line,
                        top: 0,
                        height: height,
                        right: 0
                    }
                }
                return {
                    el: line,
                    top: 0,
                    height: height,
                    left: dropPosition[idx]
                }
            })
        })
    },

    _createDashedLines: function(){
        var self = this, c = this._const, o = this.options;
        var RowsSize = this.table.getClientRegionRowSize();
        var columnsSizes = this.table.getCalculateColumnSize();
        var dropPosition = this._getColumnsLeftBorderDistance();
        var len = this.table.getCalculateRegionColumnSize()[0];
        this.dragHelpersLines = [];
        BI.each(this.table.getColumns().header[0], function(idx, header){
            self.dragHelpersLines.push([BI.createWidget({
                type:"bi.horizontal_dash_line",      //上
                width: columnsSizes[idx],
                height: c.lineWidth,
                invisible: true
            }),BI.createWidget({
                type:"bi.vertical_dash_line",        //右
                width: c.lineWidth,
                height: RowsSize[0],
                invisible: true
            }),BI.createWidget({
                type:"bi.horizontal_dash_line",      //下
                width: columnsSizes[idx],
                height: c.lineWidth,
                invisible: true
            }),BI.createWidget({                //左
                type:"bi.vertical_dash_line",
                width: c.lineWidth,
                height: RowsSize[0],
                invisible: true
            })]);
        });
        var length = this.dragHelpersLines.length;
        BI.createWidget({
            type: "bi.absolute",
            element: self.table,
            items: BI.flatten(BI.map(this.dragHelpersLines, function(idx, children){
                return BI.map(children, function(id, child){
                    var baseObj = {
                        el: child,
                        width: id % 2 === 0 ? columnsSizes[idx] : c.lineWidth,
                        height: id % 2 === 0 ? c.lineWidth : RowsSize[0]
                    }
                    if(id === 0 || id === children.length - 1){     //上和左
                        return BI.extend({
                            top: 0,
                            left: dropPosition[idx],
                        }, baseObj)
                    }else{
                        return BI.extend({                                    //右和下
                            bottom: 0,
                            right:  idx === length - 1 ? 0 : len - dropPosition[idx + 1],
                        }, baseObj)
                    }
                });
            }))
        })
    },

    _initDrag: function(){
        var self = this, c = this._const, o = this.options;
        this.dragHelpers = [];
        BI.each(this.table.getColumns().header[0], function(idx, header){
            var dragButton = BI.createWidget({
                type: "bi.triangle_drag_button",
                cls: "drag-header",
                width: c.dragButtonWidth,
                height: c.dragButtonHeight,
                lineCount: c.lineCount,
                invisible: true
            });
            BI.createWidget({
                type: "bi.absolute",
                element: header,
                items: [{
                    el: dragButton,
                    top: 0,
                    left: 0
                }]
            })

            dragButton.element.draggable({
                axis: "x",      //拖拽路径
                revert: false,
                cursor: BICst.cursorUrl,
                cursorAt: {left: 5, top: 5},
                containment: self.element,   //约束拖拽区域
                drag: function(e, ui){
                    self._showInsertHelpLine(e, ui);
                },
                stop: function(){
                    BI.each(self.insertLine, function(idx, line){
                        line.setVisible(false);
                    })
                },
                helper: function () {
                    var RowsSize = self.table.getClientRegionRowSize();
                    var columnsSizes = self.table.getCalculateColumnSize();
                    var clone = BI.createWidget({
                        type: "bi.layout",
                        cls: "sortable_table_drag_clone",
                        data: {index: BI.parseInt(idx)},
                        width: columnsSizes[idx],
                        height: RowsSize[0]
                    })
                    clone.element.appendTo(self.element);
                    return clone.element;
                }
            })
            self.dragHelpers.push(dragButton);
        });
    },

    _getMouseInColumnIndex: function(e){
        var dropPosition = this._getColumnsLeftBorderDistance();
        var columnsSizes = this.table.getCalculateColumnSize();
        var tableHeight = this.table.getClientRegionRowSize()[0];
        var tableOffsetLeft = e.pageX - this.table.element.offset().left;
        var tableOffsetTop = this.table.element.offset().top;
        return BI.find(BI.makeArray(dropPosition.length, null), function(idx){
            return !(tableOffsetLeft < dropPosition[idx] || tableOffsetLeft > dropPosition[idx] + columnsSizes[idx]
            || e.pageY < tableOffsetTop || e.pageY >= tableOffsetTop + tableHeight);
        })
    },

    _getColumnsLeftBorderDistance: function(){
        var dropPosition = [];
        var columnSizes = this.table.getCalculateColumnSize();
        BI.each(columnSizes, function(idx, columnSize){
            if(idx === 0){
                dropPosition.push(0)
            }else{
                //+ 1边框偏移值
                dropPosition.push(dropPosition[idx - 1] + columnSizes[idx - 1] + 1)
            }
        });
        return dropPosition;
    },

    _showInsertHelpLine: function(e, ui){
        var absolutePosition =  ui.position.left + this.table.getRightHorizontalScroll() + (e.pageX - ui.helper.offset().left);
        var dropPosition = this._getColumnsLeftBorderDistance();
        var insertIndex = this._getNearIndexFromArray(dropPosition, absolutePosition);
        BI.each(this.insertLine, function(idx, line){
            line.setVisible(insertIndex === idx);
        })
        BI.each(this.dragHelpers, function(idx, helper){
            helper.setVisible(false);
        })
    },

    _exchangeItemsAndHeaderPosition: function (sourceIndex, targetIndex) {
        var o = this.options;
        if(sourceIndex === targetIndex){
            return false;
        }
        var header = BI.unzip(o.header);
        var items = BI.unzip(o.items);
        var sourceHeader = header[sourceIndex];
        var sourceitems = items[sourceIndex];
        header.splice(targetIndex, 0, sourceHeader);
        items.splice(targetIndex, 0, sourceitems);
        var deleteIndex = (sourceIndex < targetIndex) ? sourceIndex : sourceIndex + 1;
        BI.removeAt(header, deleteIndex);
        BI.removeAt(items, deleteIndex);
        o.header = BI.unzip(header);
        o.items = BI.unzip(items);
        return true;
    },

    _getNearIndexFromArray: function (array, v) {
        var self = this;
        var index = 0;
        BI.some(array, function (idx, item) {
            if (idx === array.length - 1) {
                index = idx;
                //如果是最后一列，且鼠标位置超出最后一列的中间位置，表示插入到最后
                var len = self.table.getCalculateRegionColumnSize()[0];
                var columnSizes = self.table.getCalculateColumnSize();
                if(v > len - columnSizes[idx] / 2){
                    index++;
                }
            } else {
                if (v < array[idx + 1]) {
                    var avg = (item + array[idx + 1]) / 2;

                    index = v < avg ? idx : idx + 1;
                    return true;
                }
            }
        })
        return index;
    },

    getColumns: function(){
        return this.table.getColumns();
    },

    setSortable: function(sortable){
        this.options.sortable = sortable;
    },

    populate: function (items, headers) {
        var self = this, o = this.options;
        o.header = headers;
        o.items = items;
        self.table.populate(o.items, o.header);
    },

    destroy: function () {
        this.table.destroy();
        BI.SortableTable.superclass.destroy.apply(this, arguments);
    }
});

BI.SortableTable.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut('bi.sortable_table', BI.SortableTable);/**
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
$.shortcut('bi.switch_tree', BI.SwitchTree);
/**
 * 文本组件中 编辑栏作为trigger
 *
 * Created by GameJian on 2016/1/24.
 */
BI.TextArea = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.TextArea.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-text-area"
        });
    },

    _init: function () {
        BI.TextArea.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.textarea = BI.createWidget({
            type: "bi.textarea_editor",
            width: "100%",
            height: "100%"
        });

        this.textarea.on(BI.TextAreaEditor.EVENT_FOCUS, function () {
            self.combo.showView();
        });

        this.textarea.on(BI.TextAreaEditor.EVENT_BLUR, function () {
            if (BI.isEmptyString(this.getValue()) && !self.combo.isViewVisible()) {
                self._showLabel();
            } else {
                self._showInput();
            }
            self.fireEvent(BI.TextArea.EVENT_VALUE_CHANGE, arguments)
        });

        this.toolbar = BI.createWidget({
            type: "bi.text_toolbar"
        });

        this.toolbar.on(BI.TextToolbar.EVENT_CHANGE, function () {
            var style = this.getValue();
            self.textarea.setStyle(style);
            self.element.css(style);
            self.fireEvent(BI.TextArea.EVENT_VALUE_CHANGE, arguments);
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            toggle: false,
            direction: "top",
            isNeedAdjustWidth: false,
            isNeedAdjustHeight: false,
            adjustLength: 1,
            el: this.textarea,
            popup: {
                el: this.toolbar,
                width: 253,
                height: 30,
                stopPropagation: false
            }
        });

        this.combo.on(BI.Combo.EVENT_AFTER_HIDEVIEW, function () {
            if (BI.isNotEmptyString(self.textarea.getValue())) {
                self._showInput();
            } else {
                self._showLabel();
            }
        });

        this.label = BI.createWidget({
            type: "bi.text_button",
            cls: "text-area-editor-text-button-label",
            whiteSpace: "normal",
            text: BI.i18nText("BI-Click_To_Input_Text")
        });

        this.label.on(BI.TextButton.EVENT_CHANGE, function () {
            self._showInput();
            self.textarea.focus();
        });

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.combo,
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }, {
                el: this.label,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
    },

    _showInput: function () {
        this.label.setVisible(false);
    },

    _showLabel: function () {
        this.label.setVisible(true);
    },

    setValue: function (v) {
        v || (v = {});
        if (BI.isNotEmptyString(v.content)) {
            this._showInput();
        }
        this.textarea.setValue(v.content);
        this.toolbar.setValue(v.style);
        this.textarea.setStyle(v.style);
        this.element.css(v.style);
    },

    getValue: function () {
        return {style: this.toolbar.getValue(), content: this.textarea.getValue()};
    }
});
BI.TextArea.EVENT_VALUE_CHANGE = "EVENT_VALUE_CHANGE";
$.shortcut("bi.text_area", BI.TextArea);/**
 * 对齐方式选择
 *
 * Created by GUY on 2015/11/26.
 * @class BI.TextToolbarAlignChooser
 * @extends BI.Widget
 */
BI.TextToolbarAlignChooser = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.TextToolbarAlignChooser.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-text-toolbar-align-chooser",
            width: 60,
            height: 20
        });
    },

    _init: function () {
        BI.TextToolbarAlignChooser.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.button_group = BI.createWidget({
            type: "bi.button_group",
            element: this,
            items: BI.createItems([{
                cls: "align-chooser-button text-align-left-font",
                selected: true,
                title: BI.i18nText("BI-Word_Align_Left"),
                value: BI.TextToolbarAlignChooser.TEXT_ALIGN_LEFT
            }, {
                cls: "align-chooser-button text-align-center-font",
                title: BI.i18nText("BI-Word_Align_Middle"),
                value: BI.TextToolbarAlignChooser.TEXT_ALIGN_CENTER
            }, {
                cls: "align-chooser-button text-align-right-font",
                title: BI.i18nText("BI-Word_Align_Right"),
                value: BI.TextToolbarAlignChooser.TEXT_ALIGN_RIGHT
            }], {
                type: "bi.icon_button",
                height: o.height
            }),
            layouts: [{
                type: "bi.center"
            }]
        });
        this.button_group.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.button_group.on(BI.ButtonGroup.EVENT_CHANGE, function () {
            self.fireEvent(BI.TextToolbarAlignChooser.EVENT_CHANGE, arguments);
        });
    },

    setValue: function (v) {
        this.button_group.setValue(v);
    },

    getValue: function () {
        return this.button_group.getValue()[0];
    }
});
BI.extend(BI.TextToolbarAlignChooser, {
    TEXT_ALIGN_LEFT: "left",
    TEXT_ALIGN_CENTER: "center",
    TEXT_ALIGN_RIGHT: "right"
});
BI.TextToolbarAlignChooser.EVENT_CHANGE = "BI.TextToolbarAlignChooser.EVENT_CHANGE";
$.shortcut('bi.text_toolbar_align_chooser', BI.TextToolbarAlignChooser);/**
 * 颜色选择trigger
 *
 * Created by GUY on 2015/11/26.
 * @class BI.TextToolbarBackgroundChooserTrigger
 * @extends BI.Widget
 */
BI.TextToolbarBackgroundChooserTrigger = BI.inherit(BI.Trigger, {
    _defaultConfig: function () {
        var conf = BI.TextToolbarBackgroundChooserTrigger.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-text-toolbar-background-chooser-trigger",
            width: 20,
            height: 20
        });
    },

    _init: function () {
        BI.TextToolbarBackgroundChooserTrigger.superclass._init.apply(this, arguments);
        this.font = BI.createWidget({
            type: "bi.icon_button",
            cls: "text-background-font"
        });

        this.underline = BI.createWidget({
            type: "bi.icon_button",
            cls: "text-color-underline-font"
        });

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.font,
                top: 3,
                left: 2
            }, {
                el: this.underline,
                top: 9,
                left: 2
            }]
        })
    },

    setValue: function (color) {
        this.underline.element.css("color", color);
    },

    getValue: function () {
        return this.font.element.css("color");
    }
});
$.shortcut('bi.text_toolbar_background_chooser_trigger', BI.TextToolbarBackgroundChooserTrigger);/**
 * 颜色选择trigger
 *
 * Created by GUY on 2015/11/26.
 * @class BI.TextToolbarColorChooserTrigger
 * @extends BI.Widget
 */
BI.TextToolbarColorChooserTrigger = BI.inherit(BI.Trigger, {
    _defaultConfig: function () {
        var conf = BI.TextToolbarColorChooserTrigger.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-text-toolbar-color-chooser-trigger",
            width: 20,
            height: 20
        });
    },

    _init: function () {
        BI.TextToolbarColorChooserTrigger.superclass._init.apply(this, arguments);
        this.font = BI.createWidget({
            type: "bi.icon_button",
            cls: "text-color-font"
        });

        this.underline = BI.createWidget({
            type: "bi.icon_button",
            cls: "text-color-underline-font"
        });

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.font,
                top: 4,
                left: 2
            },{
                el: this.underline,
                top: 9,
                left: 2
            }]
        })
    },

    setValue: function (color) {
        this.underline.element.css("color", color);
    },

    getValue: function () {
        return this.font.element.css("color");
    }
});
$.shortcut('bi.text_toolbar_color_chooser_trigger', BI.TextToolbarColorChooserTrigger);/**
 * 字体大小选择
 *
 * Created by GUY on 2015/11/26.
 * @class BI.TextToolbarSizeChooser
 * @extends BI.Widget
 */
BI.TextToolbarSizeChooser = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.TextToolbarSizeChooser.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-text-toolbar-size-chooser",
            width: 50,
            height: 20
        });
    },

    _items: [{
        value: 12
    }, {
        value: 14,
        selected: true
    }, {
        value: 16
    }, {
        value: 18
    }, {
        value: 20
    }, {
        value: 22
    }, {
        value: 24
    }, {
        value: 26
    }, {
        value: 28
    }, {
        value: 30
    }, {
        value: 32
    }, {
        value: 34
    }, {
        value: 36
    }, {
        value: 38
    }, {
        value: 40
    }, {
        value: 64
    }, {
        value: 128
    }],

    _init: function () {
        BI.TextToolbarSizeChooser.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.editor_trigger",
            cls: "text-toolbar-size-chooser-editor-trigger",
            height: o.height,
            triggerWidth: 12,
            validationChecker: function (size) {
                return BI.isInteger(size) && size > 0;
            },
            value: 14
        });
        this.trigger.on(BI.EditorTrigger.EVENT_CHANGE, function () {
            self.setValue(BI.parseInt(this.getValue()));
            self.fireEvent(BI.TextToolbarSizeChooser.EVENT_CHANGE, arguments);
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            el: this.trigger,
            adjustLength: 1,
            popup: {
                maxWidth: o.width,
                minWidth: o.width,
                el: {
                    type: "bi.button_group",
                    items: BI.createItems(this._items, {
                        type: "bi.single_select_item"
                    }),
                    layouts: [{
                        type: "bi.vertical"
                    }]
                }
            }
        });
        this.combo.on(BI.Combo.EVENT_CHANGE, function () {
            this.hideView();
            self.fireEvent(BI.TextToolbarSizeChooser.EVENT_CHANGE, arguments);
        })
    },

    setValue: function (v) {
        this.combo.setValue(v);
    },

    getValue: function () {
        return BI.parseInt(this.trigger.getValue());
    }
});
BI.TextToolbarSizeChooser.EVENT_CHANGE = "BI.TextToolbarSizeChooser.EVENT_CHANGE";
$.shortcut('bi.text_toolbar_size_chooser', BI.TextToolbarSizeChooser);/**
 * 颜色选择
 *
 * Created by GUY on 2015/11/26.
 * @class BI.TextToolbar
 * @extends BI.Widget
 */
BI.TextToolbar = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.TextToolbar.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-text-toolbar",
            width: 253,
            height: 28
        });
    },

    _init: function () {
        BI.TextToolbar.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.size = BI.createWidget({
            type: "bi.text_toolbar_size_chooser",
            cls: "text-toolbar-size-chooser-trigger",
            title: BI.i18nText("BI-Font_Size")
        });
        this.size.on(BI.TextToolbarSizeChooser.EVENT_CHANGE, function () {
            self.fireEvent(BI.TextToolbar.EVENT_CHANGE, arguments);
        });
        this.bold = BI.createWidget({
            type: "bi.icon_button",
            title: BI.i18nText("BI-Basic_Bold"),
            height: 20,
            width: 20,
            cls: "text-toolbar-button bi-list-item-active text-bold-font"
        });
        this.bold.on(BI.IconButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.TextToolbar.EVENT_CHANGE, arguments);
        });
        this.italic = BI.createWidget({
            type: "bi.icon_button",
            title: BI.i18nText("BI-Basic_Italic"),
            height: 20,
            width: 20,
            cls: "text-toolbar-button bi-list-item-active text-italic-font"
        });
        this.italic.on(BI.IconButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.TextToolbar.EVENT_CHANGE, arguments);
        });
        this.underline = BI.createWidget({
            type: "bi.icon_button",
            title: BI.i18nText("BI-Underline"),
            height: 20,
            width: 20,
            cls: "text-toolbar-button bi-list-item-active text-underline-font"
        });
        this.underline.on(BI.IconButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.TextToolbar.EVENT_CHANGE, arguments);
        });
        this.colorchooser = BI.createWidget({
            type: "bi.color_chooser",
            el: {
                type: "bi.text_toolbar_color_chooser_trigger",
                title: BI.i18nText("BI-Font_Colour"),
                cls: "text-toolbar-button"
            }
        });
        this.colorchooser.on(BI.ColorChooser.EVENT_CHANGE, function () {

            self.fireEvent(BI.TextToolbar.EVENT_CHANGE, arguments);
        });
        this.backgroundchooser = BI.createWidget({
            type: "bi.color_chooser",
            el: {
                type: "bi.text_toolbar_background_chooser_trigger",
                title: BI.i18nText("BI-Widget_Background_Colour"),
                cls: "text-toolbar-button"
            }
        });
        this.backgroundchooser.on(BI.ColorChooser.EVENT_CHANGE, function () {
            self.fireEvent(BI.TextToolbar.EVENT_CHANGE, arguments);
        });
        this.alignchooser = BI.createWidget({
            type: "bi.text_toolbar_align_chooser",
            cls: "text-toolbar-button"
        });
        this.alignchooser.on(BI.TextToolbarAlignChooser.EVENT_CHANGE, function () {
            self.fireEvent(BI.TextToolbar.EVENT_CHANGE, arguments);
        });

        BI.createWidget({
            type: "bi.left",
            element: this,
            items: [this.size, this.bold, this.italic, this.underline, this.colorchooser, this.backgroundchooser, this.alignchooser],
            hgap: 3,
            vgap: 3
        })
    },

    isColorChooserVisible: function () {
        return this.colorchooser.isViewVisible();
    },

    isBackgroundChooserVisible: function () {
        return this.backgroundchooser.isViewVisible();
    },

    setValue: function (v) {
        v || (v = {});
        this.size.setValue(v["fontSize"] || 14);
        this.bold.setSelected(v["fontWeight"] === "bold");
        this.italic.setSelected(v["fontStyle"] === "italic");
        this.underline.setSelected(v["textDecoration"] === "underline");
        this.colorchooser.setValue(v["color"] || "#000000");
        this.backgroundchooser.setValue(v["backgroundColor"] || "#ffffff");
        this.alignchooser.setValue(v["textAlign"] || "left");
    },

    getValue: function () {
        return {
            "fontSize": this.size.getValue(),
            "fontWeight": this.bold.isSelected() ? "bold" : "normal",
            "fontStyle": this.italic.isSelected() ? "italic" : "normal",
            "textDecoration": this.underline.isSelected() ? "underline" : "initial",
            "color": this.colorchooser.getValue(),
            "backgroundColor": this.backgroundchooser.getValue(),
            "textAlign": this.alignchooser.getValue()
        }
    }
});
BI.TextToolbar.EVENT_CHANGE = "BI.TextToolbar.EVENT_CHANGE";
$.shortcut('bi.text_toolbar', BI.TextToolbar);/**
 * Created by Baron on 2015/10/19.
 */
BI.TimeInterval = BI.inherit(BI.Single, {
    constants: {
        height: 25,
        width: 25,
        lgap: 15,
        offset: -15,
        timeErrorCls: "time-error",
        DATE_MIN_VALUE: "1900-01-01",
        DATE_MAX_VALUE: "2099-12-31"
    },
    _defaultConfig: function () {
        var conf = BI.TimeInterval.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            extraCls: "bi-time-interval"
        })
    },
    _init: function () {
        var self = this;
        BI.TimeInterval.superclass._init.apply(this, arguments);

        this.left = this._createCombo();
        this.right = this._createCombo();
        this.label = BI.createWidget({
            type: 'bi.label',
            height: this.constants.height,
            width: this.constants.width,
            text: "-"
        });
        BI.createWidget({
            element: self,
            type: "bi.center",
            hgap: 15,
            height: this.constants.height,
            items: [{
                type: "bi.absolute",
                items: [{
                    el: self.left,
                    left: this.constants.offset,
                    right: 0,
                    top: 0,
                    bottom: 0
                }]
            }, {
                type: "bi.absolute",
                items: [{
                    el: self.right,
                    left: 0,
                    right: this.constants.offset,
                    top: 0,
                    bottom: 0
                }]
            }]
        });
        BI.createWidget({
            type: "bi.horizontal_auto",
            element: this,
            items: [
                self.label
            ]
        });
    },

    _createCombo: function () {
        var self = this;
        var combo = BI.createWidget({
            type: 'bi.multidate_combo'
        });
        combo.on(BI.MultiDateCombo.EVENT_ERROR, function () {
            self._clearTitle();
            self.element.removeClass(self.constants.timeErrorCls);
            self.fireEvent(BI.TimeInterval.EVENT_ERROR);
        });

        combo.on(BI.MultiDateCombo.EVENT_VALID, function(){
            BI.Bubbles.hide("error");
            var smallDate = self.left.getKey(), bigDate = self.right.getKey();
            if (self._check(smallDate, bigDate) && self._compare(smallDate, bigDate)) {
                self._setTitle(BI.i18nText("BI-Time_Interval_Error_Text"));
                self.element.addClass(self.constants.timeErrorCls);
                BI.Bubbles.show("error", BI.i18nText("BI-Time_Interval_Error_Text"), self, {
                    offsetStyle: "center"
                });
                self.fireEvent(BI.TimeInterval.EVENT_ERROR);
            } else {
                self._clearTitle();
                self.element.removeClass(self.constants.timeErrorCls);
            }
        });

        combo.on(BI.MultiDateCombo.EVENT_FOCUS, function(){
            BI.Bubbles.hide("error");
            var smallDate = self.left.getKey(), bigDate = self.right.getKey();
            if (self._check(smallDate, bigDate) && self._compare(smallDate, bigDate)) {
                self._setTitle(BI.i18nText("BI-Time_Interval_Error_Text"));
                self.element.addClass(self.constants.timeErrorCls);
                BI.Bubbles.show("error", BI.i18nText("BI-Time_Interval_Error_Text"), self, {
                    offsetStyle: "center"
                });
                self.fireEvent(BI.TimeInterval.EVENT_ERROR);
            } else {
                self._clearTitle();
                self.element.removeClass(self.constants.timeErrorCls);
            }
        });

        combo.on(BI.MultiDateCombo.EVENT_BEFORE_POPUPVIEW, function () {
            self.left.hidePopupView();
            self.right.hidePopupView();
        });
        //combo.on(BI.MultiDateCombo.EVENT_CHANGE, function () {
        //    BI.Bubbles.hide("error");
        //    var smallDate = self.left.getKey(), bigDate = self.right.getKey();
        //    if (self._check(smallDate, bigDate) && self._compare(smallDate, bigDate)) {
        //        self._setTitle(BI.i18nText("BI-Time_Interval_Error_Text"));
        //        self.element.addClass(self.constants.timeErrorCls);
        //        BI.Bubbles.show("error", BI.i18nText("BI-Time_Interval_Error_Text"), self, {
        //            offsetStyle: "center"
        //        });
        //        self.fireEvent(BI.TimeInterval.EVENT_ERROR);
        //    } else {
        //        self._clearTitle();
        //        self.element.removeClass(self.constants.timeErrorCls);
        //    }
        //});

        combo.on(BI.MultiDateCombo.EVENT_CONFIRM, function(){
            BI.Bubbles.hide("error");
            var smallDate = self.left.getKey(), bigDate = self.right.getKey();
            if (self._check(smallDate, bigDate) && self._compare(smallDate, bigDate)) {
                self._setTitle(BI.i18nText("BI-Time_Interval_Error_Text"));
                self.element.addClass(self.constants.timeErrorCls);
                self.fireEvent(BI.TimeInterval.EVENT_ERROR);
            }else{
                self._clearTitle();
                self.element.removeClass(self.constants.timeErrorCls);
                self.fireEvent(BI.TimeInterval.EVENT_CHANGE);
            }
        });
        return combo;
    },
    _dateCheck: function (date) {
        return Date.parseDateTime(date, "%Y-%x-%d").print("%Y-%x-%d") == date || Date.parseDateTime(date, "%Y-%X-%d").print("%Y-%X-%d") == date || Date.parseDateTime(date, "%Y-%x-%e").print("%Y-%x-%e") == date || Date.parseDateTime(date, "%Y-%X-%e").print("%Y-%X-%e") == date;
    },
    _checkVoid: function (obj) {
        return !Date.checkVoid(obj.year, obj.month, obj.day, this.constants.DATE_MIN_VALUE, this.constants.DATE_MAX_VALUE)[0];
    },
    _check: function (smallDate, bigDate) {
        var smallObj = smallDate.match(/\d+/g), bigObj = bigDate.match(/\d+/g);
        return this._dateCheck(smallDate) && Date.checkLegal(smallDate) && this._checkVoid({
                year: smallObj[0],
                month: smallObj[1],
                day: smallObj[2]
            }) && this._dateCheck(bigDate) && Date.checkLegal(bigDate) && this._checkVoid({
                year: bigObj[0],
                month: bigObj[1],
                day: bigObj[2]
            });
    },
    _compare: function (smallDate, bigDate) {
        smallDate = Date.parseDateTime(smallDate, "%Y-%X-%d").print("%Y-%X-%d");
        bigDate = Date.parseDateTime(bigDate, "%Y-%X-%d").print("%Y-%X-%d");
        return BI.isNotNull(smallDate) && BI.isNotNull(bigDate) && smallDate > bigDate;
    },
    _setTitle: function (v) {
        this.left.setTitle(v);
        this.right.setTitle(v);
        this.label.setTitle(v);
    },
    _clearTitle: function () {
        this.left.setTitle("");
        this.right.setTitle("");
        this.label.setTitle("");
    },
    setValue: function (date) {
        date = date || {};
        this.left.setValue(date.start);
        this.right.setValue(date.end);
    },
    getValue: function () {
        return {start: this.left.getValue(), end: this.right.getValue()};
    }
});
BI.TimeInterval.EVENT_VALID = "EVENT_VALID";
BI.TimeInterval.EVENT_ERROR = "EVENT_ERROR";
BI.TimeInterval.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.time_interval", BI.TimeInterval);/**
 * Created by Young's on 2016/4/22.
 */
BI.DayTimeSetting = BI.inherit(BI.Widget, {
    _defaultConfig: function(){
        return BI.extend(BI.DayTimeSetting.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-time-setting-day",
            day: 1
        })
    },

    _init: function(){
        BI.DayTimeSetting.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var decrease = BI.createWidget({
            type: "bi.text_button",
            cls: "operator-button",
            text: "-",
            height: 28,
            width: 28
        });
        decrease.on(BI.Button.EVENT_CHANGE, function(){
            var day = BI.parseInt(self.day.getValue());
            if(day === 1) {
                day = 31;
            } else {
                day --;
            }
            self.day.setValue(day);
            self.fireEvent(BI.DayTimeSetting.EVENT_CHANGE);
        });

        var increase = BI.createWidget({
            type: "bi.text_button",
            cls: "operator-button",
            text: "+",
            height: 28,
            width: 28
        });
        increase.on(BI.Button.EVENT_CHANGE, function(){
            var day = BI.parseInt(self.day.getValue());
            if(day === 31) {
                day = 1;
            } else {
                day ++;
            }
            self.day.setValue(day);
            self.fireEvent(BI.DayTimeSetting.EVENT_CHANGE);
        });

        this.day = BI.createWidget({
            type: "bi.label",
            value: o.day,
            height: 30,
            width: 40
        });
        BI.createWidget({
            type: "bi.left",
            element: this,
            items: [decrease, this.day, increase, {
                type: "bi.label",
                text: BI.i18nText("BI-Day_Ri"),
                height: 30,
                width: 20
            }],
            height: 30
        })
    },

    getValue: function(){
        return BI.parseInt(this.day.getValue());
    },

    setValue: function(v) {
        this.day.setValue(v);
    }
});
BI.DayTimeSetting.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.day_time_setting", BI.DayTimeSetting);/**
 * Created by Young's on 2016/4/22.
 */
BI.HourTimeSetting = BI.inherit(BI.Widget, {
    _defaultConfig: function(){
        return BI.extend(BI.HourTimeSetting.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-time-setting-hour",
            hour: 0
        })
    },

    _init: function(){
        BI.HourTimeSetting.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var decrease = BI.createWidget({
            type: "bi.text_button",
            cls: "operator-button",
            text: "-",
            height: 28,
            width: 28
        });
        decrease.on(BI.Button.EVENT_CHANGE, function(){
            var hour = BI.parseInt(self.hour.getValue());
            if(hour === 0) {
                hour = 23;
            } else {
                hour --;
            }
            self.hour.setValue(hour);
            self.fireEvent(BI.HourTimeSetting.EVENT_CHANGE);
        });

        var increase = BI.createWidget({
            type: "bi.text_button",
            cls: "operator-button",
            text: "+",
            height: 28,
            width: 28
        });
        increase.on(BI.Button.EVENT_CHANGE, function(){
            var hour = BI.parseInt(self.hour.getValue());
            hour === 23 ? (hour = 0) : (hour ++);
            self.hour.setValue(hour);
            self.fireEvent(BI.HourTimeSetting.EVENT_CHANGE);
        });

        this.hour = BI.createWidget({
            type: "bi.label",
            value: o.hour,
            height: 30,
            width: 40
        });
        BI.createWidget({
            type: "bi.left",
            element: this,
            items: [decrease, this.hour, increase, {
                type: "bi.label",
                text: BI.i18nText("BI-Hour_Dian"),
                height: 30,
                width: 20
            }],
            height: 30
        })
    },

    getValue: function(){
        return BI.parseInt(this.hour.getValue());
    },

    setValue: function(v) {
        this.hour.setValue(v);
    }
});
BI.HourTimeSetting.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.hour_time_setting", BI.HourTimeSetting);BI.TreeLabel = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.TreeLabel.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-tree-label",
            itemsCreator: BI.emptyFn,
            titles: [],
            items: []
        })
    },

    _init: function () {
        BI.TreeLabel.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.titles = o.titles;
        this.items = o.items;

        this.view = BI.createWidget({
            type: "bi.tree_label_view",
            element: this,
            titles: o.titles,
            items: o.items
        });
        this.view.on(BI.TreeLabelView.EVENT_CHANGE, function (floors)  {
            var op = {};
            if (floors !== self.view.getMaxFloor() - 1) {
                op.floors = floors;
                op.selectedValues = self.getValue();
                self._itemsCreator(op);
            }
            self.fireEvent(BI.TreeLabel.EVENT_CHANGE, arguments);
        });
    },

    _itemsCreator: function (options) {
        var self = this, o = this.options;
        o.itemsCreator(options, function (data) {
            self.populate(data);
        })
    },

    populate: function (v) {
        this.view.populate(v);
    },

    getValue: function () {
        return this.view.getValue();
    }
});
BI.TreeLabel.EVENT_CHANGE = "BI.TreeLabel.EVENT_CHANGE";
$.shortcut('bi.tree_label', BI.TreeLabel);BI.TreeLabelView = BI.inherit(BI.Widget, {
    _constant: {
        LIST_LABEL_HEIGHT: 40,
        DEFAULT_LEFT_GAP: 5
    },

    _defaultConfig: function () {
        return BI.extend(BI.TreeLabelView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-tree-label-view",
            titleWidth: 60,
            titles: [],
            items: []
        })
    },

    _init: function () {
        BI.TreeLabelView.superclass._init.apply(this, arguments);
        this.items = [];
        this._initView();
    },

    _initView: function () {
        var self = this, o = this.options;
        this.title = BI.createWidget({
            type: "bi.button_group",
            height: this._constant.LIST_LABEL_HEIGHT * o.titles.length,
            layouts: [{
                type: "bi.vertical"
            }]
        });
        this.right = BI.createWidget({
            type: "bi.button_group",
            cls: "list-label-group",
            height: this._constant.LIST_LABEL_HEIGHT * this.items.length,
            layouts: [{
                type: "bi.horizontal"
            }]
        });
        this._setTitles(o.titles);
        this._setItems(o.items);
        BI.createWidget({
            type: "bi.absolute",
            items: [{
                el: this.title,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                width: 60
            }, {
                el: this.right,
                left: 65,
                right: 0,
                top: 0,
                bottom: 0
            }],
            element: this
        });
    },

    _setItems: function (items) {
        var self = this;
        var length = this.right.getAllButtons().length;
        var deletes = [];
        for (var i = 0; i < length; i++) {
            deletes.push(i);
        }
        this.right.removeItemAt(deletes);
        self.items = [];
        BI.each(items, function (idx, values) {
            var labelItems = [];
            BI.each(values, function (idx, value) {
                labelItems.push({
                    title: value,
                    text: value,
                    value: value
                })
            });
            var temp = BI.createWidget({
                type: "bi.list_label",
                items: labelItems,
                showTitle: false
            });
            temp.on(BI.ListLabel.EVENT_CHANGE, function () {
                self.fireEvent(BI.TreeLabelView.EVENT_CHANGE, idx);
            });
            self.items.push(temp);
        });
        var temp = BI.createWidget({
            type: "bi.default",
            items: self.items
        });
        this.right.addItems([temp]);
        this.right.setHeight(self.items.length * this._constant.LIST_LABEL_HEIGHT);
    },

    _setTitles: function (titles) {
        var length = this.title.getAllButtons().length;
        var deletes = [], titleItems = [];
        for (var i = 0; i < length; i++) {
            deletes.push(i);
        }
        BI.each(titles, function (idx, title) {
           titleItems.push({
               text: title,
               value: title,
               title: title
           });
        });
        this.title.removeItemAt(deletes);
        this.title.addItems(BI.createItems(titleItems, {
            type: "bi.label",
            height: this._constant.LIST_LABEL_HEIGHT,
            width: this.options.titleWidth
        }));
        this.title.setHeight(titles.length * this._constant.LIST_LABEL_HEIGHT);
    },

    _setValue: function (values) {
        BI.each(this.items, function (idx, item) {
            values[idx] && item.setValue(values[idx]);
        })
    },

    populate: function(v) {
        v.titles && this._setTitles(v.titles);
        v.items && this._setItems(v.items);
        v.values && this._setValue(v.values);
    },

    getMaxFloor: function () {
        return this.items.length || 0;
    },

    getValue: function () {
        var result = [];
        BI.each(this.items, function (idx, item) {
            result.push(item.getValue());
        });
        return result;
    }
});
BI.TreeLabelView.EVENT_CHANGE = "BI.TreeLabelView.EVENT_CHANGE";
$.shortcut('bi.tree_label_view', BI.TreeLabelView);/**
 * Created by Young's on 2016/4/21.
 */
BI.UploadFileWithProgress = BI.inherit(BI.Widget, {

    _constants: {
        UPLOAD_PROGRESS: "__upload_progress__"
    },

    _defaultConfig: function () {
        return BI.extend(BI.UploadFileWithProgress.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-upload-file-with-progress",
            progressEL: BICst.BODY_ELEMENT,
            multiple: false,
            maxSize: 1024 * 1024,
            accept: "",
            url: ""
        })
    },

    _init: function () {
        BI.UploadFileWithProgress.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.file = BI.createWidget({
            type: "bi.multifile_editor",
            width: "100%",
            height: "100%",
            name: o.name,
            url: o.url,
            multiple: o.multiple,
            accept: o.accept,
            maxSize: o.maxSize
        });

        this.file.on(BI.MultifileEditor.EVENT_CHANGE, function () {
            self.fireEvent(BI.UploadFileWithProgress.EVENT_CHANGE, arguments);
        });
        this.file.on(BI.MultifileEditor.EVENT_UPLOADSTART, function () {
            self.progressBar = BI.createWidget({
                type: "bi.progress_bar",
                width: 300
            });
            BI.createWidget({
                type: "bi.center_adapt",
                element: BI.Layers.create(self._constants.UPLOAD_PROGRESS, self.options.progressEL),
                items: [self.progressBar],
                width: "100%",
                height: "100%"
            });

            BI.Layers.show(self._constants.UPLOAD_PROGRESS);
            self.fireEvent(BI.UploadFileWithProgress.EVENT_UPLOADSTART, arguments);
        });
        this.file.on(BI.MultifileEditor.EVENT_ERROR, function () {
            BI.Layers.remove(self._constants.UPLOAD_PROGRESS);
            self.fireEvent(BI.UploadFileWithProgress.EVENT_ERROR, arguments);
        });
        this.file.on(BI.MultifileEditor.EVENT_PROGRESS, function (data) {
            var process = Math.ceil(data.loaded / data.total * 100);
            self.progressBar.setValue(process > 100 ? 100 : process);
            self.fireEvent(BI.UploadFileWithProgress.EVENT_PROGRESS, arguments);
        });
        this.file.on(BI.MultifileEditor.EVENT_UPLOADED, function () {
            BI.Layers.remove(self._constants.UPLOAD_PROGRESS);
            self.fireEvent(BI.UploadFileWithProgress.EVENT_UPLOADED, arguments);
        });

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.adaptive",
                    scrollable: false,
                    items: [this.file]
                },
                top: 0,
                right: 0,
                left: 0,
                bottom: 0
            }]
        });
    },

    select: function () {
        this.file.select();
    },

    getValue: function () {
        return this.file.getValue();
    },

    upload: function () {
        this.file.upload();
    },

    reset: function () {
        this.file.reset();
    },

    setEnable: function (enable) {
        BI.MultiFile.superclass.setEnable.apply(this, arguments);
        this.file.setEnable(enable);
    }
});
BI.UploadFileWithProgress.EVENT_CHANGE = "EVENT_CHANGE";
BI.UploadFileWithProgress.EVENT_UPLOADSTART = "EVENT_UPLOADSTART";
BI.UploadFileWithProgress.EVENT_ERROR = "EVENT_ERROR";
BI.UploadFileWithProgress.EVENT_PROGRESS = "EVENT_PROGRESS";
BI.UploadFileWithProgress.EVENT_UPLOADED = "EVENT_UPLOADED";
$.shortcut("bi.upload_file_with_progress", BI.UploadFileWithProgress);/**
 * web组件
 * Created by GameJian on 2016/3/1.
 */
BI.WebPage = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.WebPage.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-web-page"
        })
    },

    _init: function () {
        BI.WebPage.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.iframe = BI.createWidget({
            type: "bi.iframe"
        });

        this.label = BI.createWidget({
            type: "bi.label",
            cls: "web-page-text-button-label",
            whiteSpace: "normal",
            text: BI.i18nText("BI-Not_Add_Url")
        });

        this.del = BI.createWidget({
            type: "bi.bubble_combo",
            el: {
                type: "bi.icon_button",
                cls: "web-page-button img-shutdown-font",
                title: BI.i18nText("BI-Basic_Delete"),
                height: 24,
                width: 24
            },
            popup: {
                type: "bi.bubble_bar_popup_view",
                buttons: [{
                    value: BI.i18nText(BI.i18nText("BI-Basic_Sure")),
                    handler: function () {
                        self.fireEvent(BI.WebPage.EVENT_DESTROY)
                    }
                }, {
                    value: BI.i18nText("BI-Basic_Cancel"),
                    level: "ignore",
                    handler: function () {
                        self.del.hideView();
                    }
                }],
                el: {
                    type: "bi.vertical_adapt",
                    items: [{
                        type: "bi.label",
                        text: BI.i18nText("BI-Sure_Delete_Current_Component"),
                        cls: "web-page-delete-label",
                        textAlign: "left",
                        width: 300
                    }],
                    width: 300,
                    height: 100,
                    hgap: 20
                },
                maxHeight: 140,
                minWidth: 340
            },
            invisible: true,
            stopPropagation: true
        });


        this.href = BI.createWidget({
            type: "bi.image_button_href",
            cls: "web-page-button"
        });

        this.href.on(BI.ImageButtonHref.EVENT_CHANGE, function () {
            var url = this.getValue();
            self.setValue(this.getValue());
            self._checkUrl(url);
            self.fireEvent(BI.WebPage.EVENT_VALUE_CHANGE);
        });

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.iframe
            }, {
                el: this.del,
                right: 4,
                top: 8
            }, {
                el: this.href,
                right: 36,
                top: 8
            }, {
                el: this.label,
                top: 32,
                left: 0,
                bottom: 0,
                right: 0
            }]
        });

        this.setToolbarVisible(false);
        this._showLabel();
    },

    _checkUrl: function(url){
        BI.Bubbles.hide(this.getName());
        if(BI.isEmptyString(url)){
            BI.Bubbles.show(this.getName(), BI.i18nText("BI-Click_To_Add_Hyperlink"), this.href, {
                offsetStyle: "left"
            });
        }
    },

    _hideLabel: function () {
        this.label.invisible()
    },

    isSelected: function () {
        return this.href.isSelected();
    },

    _showLabel: function () {
        this.label.visible()
    },

    setToolbarVisible: function (v) {
        this.href.setVisible(v);
        this.del.setVisible(v);
    },

    getValue: function () {
        return this.href.getValue()
    },

    setValue: function (url) {
        var self = this;
        if (BI.isNotEmptyString(url)) {
            self._hideLabel();
        } else {
            this.setToolbarVisible(true);
            this.href.showView();
        }
        this.href.setValue(url);
        this.iframe.setSrc(BI.Func.formatAddress(url))
    }
});

BI.WebPage.EVENT_DESTROY = "EVENT_DESTROY";
BI.WebPage.EVENT_VALUE_CHANGE = "EVENT_VALUE_CHANGE";
$.shortcut("bi.web_page", BI.WebPage);/**
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
$.shortcut('bi.year_combo', BI.YearCombo);/**
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
                cls: "year-popup-navigation",
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
$.shortcut("bi.year_popup", BI.YearPopup);/**
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
        errorText: BI.i18nText("BI-Please_Input_Integer"),
        errorTextInvalid: BI.i18nText("BI-Year_Trigger_Invalid_Text")
    },

    _defaultConfig: function () {
        return BI.extend(BI.YearTrigger.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-year-trigger",
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
        })
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
$.shortcut("bi.year_trigger", BI.YearTrigger);/**
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
$.shortcut('bi.year_month_combo', BI.YearMonthCombo);/**
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
$.shortcut('bi.year_quarter_combo', BI.YearQuarterCombo);