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
            items: []
        };
    },

    init: function () {
        var self = this;
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
        this._populate();
        this._debounceRelease = BI.debounce(function () {
            self._scrollLock = false;
        }, 30);
        this.element.scroll(function (e) {
            if (self._scrollLock === true) {
                return;
            }
            self._scrollLock = true;
            o.scrollTop = self.element.scrollTop();
            self._debounceRelease();
            self._calculateBlocksToRender();
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
        while ((lastHeight = getElementHeight()) < minContentHeight && index < o.items.length) {
            var items = o.items.slice(index, index + o.blockSize);
            this.container.addItems(items, this);
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
            this.container.populate(items);
        } else {
            for (var i = (start < 0 ? 0 : start); i <= end; i++) {
                var index = i * o.blockSize;
                for (var j = index; j < index + o.blockSize && j < o.items.length; j++) {
                    items.push(o.items[j]);
                }
            }
            this.container.element.height(o.rowHeight * o.items.length - topHeight);
            this.container.populate(items);
        }
    },

    _populate: function (items) {
        var o = this.options;
        if (items && this.options.items !== items) {
            this.options.items = items;
        }
        this.tree = BI.PrefixIntervalTree.uniform(Math.ceil(o.items.length / o.blockSize), this._isAutoHeight() ? 0 : o.rowHeight * o.blockSize);

        this._calculateBlocksToRender();
        try {
            this.element.scrollTop(o.scrollTop);
        } catch (e) {
        }
    },

    restore: function () {
        this.renderedIndex = -1;
        this.options.scrollTop = 0;
        // 依赖于cache的占位元素也要初始化
        this.topBlank.setHeight(0);
        this.bottomBlank.setHeight(0);
    },

    populate: function (items) {
        this._populate(items);
    }
});
BI.shortcut("bi.virtual_group_list", BI.VirtualGroupList);

