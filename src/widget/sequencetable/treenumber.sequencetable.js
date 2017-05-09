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
        var headerHeight = this._getHeaderHeight() - 2;
        var items = this.layout.attr("items");
        if (o.isNeedFreeze === false) {
            items[0].height = 0;
        } else if (o.isNeedFreeze === true) {
            items[0].height = headerHeight;
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
BI.shortcut('bi.sequence_table_tree_number', BI.SequenceTableTreeNumber);