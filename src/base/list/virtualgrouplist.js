/**
 * 同时用于virtualGroup和virtualList特性的虚拟列表
 *
 * Created by GUY on 2017/5/22.
 * @class BI.VirtualList
 * @extends BI.Widget
 */
BI.VirtualGroupList = BI.inherit(BI.Widget, {
    props: function () {
        return {
            baseCls: "bi-virtual-group-list",
            overscanHeight: 100,
            blockSize: 10,
            scrollTop: 0,
            rowHeight: "auto",
            items: [],
            itemFormatter: function (item, index) {
                return item;
            }
        };
    },

    init: function () {
        this.renderedIndex = -1;
    },

    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.layout",
                ref: function () {
                    self.topBlank = this;
                }
            }, {
                type: "bi.virtual_group",
                height: o.rowHeight * o.items.length,
                ref: function () {
                    self.container = this;
                },
                layouts: [{
                    type: "bi.vertical",
                    scrolly: false
                }]
            }, {
                type: "bi.layout",
                ref: function () {
                    self.bottomBlank = this;
                }
            }],
            element: this
        };
    },

    // mounted之后绑定事件
    mounted: function () {
        var self = this, o = this.options;
        o.items = BI.isFunction(o.items) ? this.__watch(o.items, function (context, newValue) {
            self.populate(newValue);
        }) : o.items;
        this._populate();
        this.ticking = false;
        this.element.scroll(function() {
            o.scrollTop = self.element.scrollTop();
            if (!self.ticking) {
                requestAnimationFrame(function () {
                    self._calculateBlocksToRender();
                    self.ticking = false;
                });
                self.ticking = true;
            }
        });
        BI.ResizeDetector.addResizeListener(this, function () {
            self._calculateBlocksToRender();
        });
    },

    _isAutoHeight: function () {
        return this.options.rowHeight === "auto";
    },

    _renderMoreIf: function () {
        var self = this, o = this.options;
        var height = this.element.height();
        var minContentHeight = o.scrollTop + height + o.overscanHeight;
        var index = (this.renderedIndex + 1) * o.blockSize, cnt = this.renderedIndex + 1;
        var lastHeight;
        var getElementHeight = function () {
            return self.container.element.height() + self.topBlank.element.height() + self.bottomBlank.element.height();
        };
        while ((lastHeight = this.renderedIndex === -1 ? 0 : getElementHeight()) < minContentHeight && index < o.items.length) {
            var items = o.items.slice(index, index + o.blockSize);
            this.container[self.renderedIndex === -1 ? "populate" : "addItems"](items.map(function (item, i) {
                return o.itemFormatter(item, index + i);
            }), this);
            var addedHeight = getElementHeight() - lastHeight;
            this.tree.set(cnt, addedHeight);
            this.renderedIndex = cnt;
            cnt++;
            index += o.blockSize;
        }
    },

    _calculateBlocksToRender: function () {
        var o = this.options;
        this._isAutoHeight() && this._renderMoreIf();
        var height = this.element.height();
        var minContentHeightFrom = o.scrollTop - o.overscanHeight;
        var minContentHeightTo = o.scrollTop + height + o.overscanHeight;
        var start = this.tree.greatestLowerBound(minContentHeightFrom);
        var end = this.tree.leastUpperBound(minContentHeightTo);
        var items = [];
        var topHeight = this.tree.sumTo(Math.max(-1, start - 1));
        this.topBlank.setHeight(topHeight);
        if (this._isAutoHeight()) {
            for (var i = (start < 0 ? 0 : start); i <= end && i <= this.renderedIndex; i++) {
                var index = i * o.blockSize;
                for (var j = index; j < index + o.blockSize && j < o.items.length; j++) {
                    items.push(o.items[j]);
                }
            }
            this.bottomBlank.setHeight(this.tree.sumTo(this.renderedIndex) - this.tree.sumTo(Math.min(end, this.renderedIndex)));
            this.container.populate(items.map(function (item, i) {
                return o.itemFormatter(item, (start < 0 ? 0 : start) * o.blockSize + i)
            }));
        } else {
            for (var i = (start < 0 ? 0 : start); i <= end; i++) {
                var index = i * o.blockSize;
                for (var j = index; j < index + o.blockSize && j < o.items.length; j++) {
                    items.push(o.items[j]);
                }
            }
            this.container.element.height(o.rowHeight * o.items.length - topHeight);
            this.container.populate(items.map(function (item, i) {
                return o.itemFormatter(item, (start < 0 ? 0 : start) * o.blockSize + i)
            }));
        }
    },

    _populate: function (items) {
        var o = this.options;
        if (items && this.options.items !== items) {
            // 重新populate一组items,需要重新对线段树分块
            this.options.items = items;
            this._restore();
        }
        this.tree = BI.PrefixIntervalTree.uniform(Math.ceil(o.items.length / o.blockSize), this._isAutoHeight() ? 0 : o.rowHeight * o.blockSize);

        this._calculateBlocksToRender();
        try {
            this.element.scrollTop(o.scrollTop);
        } catch (e) {
        }
    },

    _restore: function () {
        this.renderedIndex = -1;
        // 依赖于cache的占位元素也要初始化
        this.topBlank.setHeight(0);
        this.bottomBlank.setHeight(0);
    },

    restore: function () {
        this.options.scrollTop = 0;
        this._restore();
    },

    populate: function (items) {
        this._populate(items);
    }
});
BI.shortcut("bi.virtual_group_list", BI.VirtualGroupList);

