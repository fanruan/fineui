/**
 * 虚拟列表
 *
 * Created by GUY on 2017/5/22.
 * @class BI.VirtualList
 * @extends BI.Widget
 */
BI.VirtualList = BI.inherit(BI.Widget, {
    props: function () {
        return {
            baseCls: "bi-virtual-list",
            overscanHeight: 100,
            blockSize: 10,
            scrollTop: 0,
            items: [],
            itemFormatter: function (item, index) {
                return item;
            }
        };
    },

    init: function () {
        var self = this;
        this.renderedIndex = -1;
        this.cache = {};
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
                type: "bi.vertical",
                scrolly: false,
                ref: function () {
                    self.container = this;
                }
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
        this.element.scroll(function (e) {
            o.scrollTop = self.element.scrollTop();
            self._calculateBlocksToRender();
        });
        BI.ResizeDetector.addResizeListener(this, function () {
            self._calculateBlocksToRender();
        });
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
            this.container.addItems(items.map(function (item, i) {
                return o.itemFormatter(item, index + i)
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
        this._renderMoreIf();
        var height = this.element.height();
        var minContentHeightFrom = o.scrollTop - o.overscanHeight;
        var minContentHeightTo = o.scrollTop + height + o.overscanHeight;
        var start = this.tree.greatestLowerBound(minContentHeightFrom);
        var end = this.tree.leastUpperBound(minContentHeightTo);
        var needDestroyed = [], needMount = [];
        for (var i = 0; i < start; i++) {
            var index = i * o.blockSize;
            if (!this.cache[i]) {
                this.cache[i] = {};
            }
            if (!this.cache[i].destroyed) {
                for (var j = index; j < index + o.blockSize && j < o.items.length; j++) {
                    needDestroyed.push(this.container._children[j]);
                    this.container._children[j] = null;
                }
                this.cache[i].destroyed = true;
            }
        }
        for (var i = end + 1; i <= this.renderedIndex; i++) {
            var index = i * o.blockSize;
            if (!this.cache[i]) {
                this.cache[i] = {};
            }
            if (!this.cache[i].destroyed) {
                for (var j = index; j < index + o.blockSize && j < o.items.length; j++) {
                    needDestroyed.push(this.container._children[j]);
                    this.container._children[j] = null;
                }
                this.cache[i].destroyed = true;
            }
        }
        var firstFragment = BI.Widget._renderEngine.createFragment(),
            lastFragment = BI.Widget._renderEngine.createFragment();
        var currentFragment = firstFragment;
        for (var i = (start < 0 ? 0 : start); i <= end && i <= this.renderedIndex; i++) {
            var index = i * o.blockSize;
            if (!this.cache[i]) {
                this.cache[i] = {};
            }
            if (!this.cache[i].destroyed) {
                currentFragment = lastFragment;
            }
            if (this.cache[i].destroyed === true) {
                for (var j = index; j < index + o.blockSize && j < o.items.length; j++) {
                    var w = this.container._addElement(j, o.itemFormatter(o.items[j], j), this);
                    needMount.push(w);
                    currentFragment.appendChild(w.element[0]);
                }
                this.cache[i].destroyed = false;
            }
        }
        this.container.element.prepend(firstFragment);
        this.container.element.append(lastFragment);
        this.topBlank.setHeight(this.tree.sumTo(Math.max(-1, start - 1)));
        this.bottomBlank.setHeight(this.tree.sumTo(this.renderedIndex) - this.tree.sumTo(Math.min(end, this.renderedIndex)));
        BI.each(needMount, function (i, child) {
            child && child._mount();
        });
        BI.each(needDestroyed, function (i, child) {
            child && child._destroy();
        });
    },

    _populate: function (items) {
        var o = this.options;
        if (items && this.options.items !== items) {
            this.options.items = items;
        }
        this.tree = BI.PrefixIntervalTree.empty(Math.ceil(o.items.length / o.blockSize));

        this._calculateBlocksToRender();
        try {
            this.element.scrollTop(o.scrollTop);
        } catch (e) {
        }
    },

    _clearChildren: function () {
        BI.each(this.container._children, function (i, cell) {
            cell && cell._destroy();
        });
        this.container._children = {};
        this.container.attr("items", []);
    },

    restore: function () {
        this.renderedIndex = -1;
        this._clearChildren();
        this.cache = {};
        this.options.scrollTop = 0;
        // 依赖于cache的占位元素也要初始化
        this.topBlank.setHeight(0);
        this.bottomBlank.setHeight(0);
    },

    populate: function (items) {
        if (items && this.options.items !== items) {
            this.restore();
        }
        this._populate(items);
    },

    destroyed: function () {
        this.cache = {};
        this.renderedIndex = -1;
    }
});
BI.shortcut("bi.virtual_list", BI.VirtualList);

