/**
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

        this.header = BI.createWidget(o.sequenceHeaderCreator || {
                type: "bi.table_style_cell",
                cls: "sequence-table-title-cell bi-border",
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
BI.shortcut('bi.sequence_table_list_number', BI.SequenceTableListNumber);