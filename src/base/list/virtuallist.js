/**
 * 表示当前对象
 *
 * Created by GUY on 2015/9/7.
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
            items: []
        };
    },

    init: function () {
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
        }
    },

    mounted: function () {
        var self = this, o = this.options;
        this._populate();
        this.element.scroll(function (e) {
            o.scrollTop = self.element.scrollTop();
            self._calculateBlocksToRender();
        });
        BI.ResizeDetector.addResizeListener(this, function () {
            self._renderMoreIf();
        });
    },

    _renderMoreIf: function () {
        var o = this.options;
        var height = this.element.height();
        var minContentHeight = o.scrollTop + height + o.overscanHeight;
        var index = (this.cache[this.renderedIndex] && (this.cache[this.renderedIndex].index + o.blockSize)) || 0,
            cnt = this.renderedIndex + 1;
        var lastHeight;
        while ((lastHeight = this.container.element.height()) < minContentHeight && index < o.items.length) {
            var items = o.items.slice(index, index + o.blockSize);
            this.container.addItems(items);
            var addedHeight = this.container.element.height() - lastHeight;
            this.cache[cnt] = {
                index: index,
                height: addedHeight
            };
            this.tree.set(cnt, addedHeight);
            this.renderedIndex = cnt;
            cnt++;
            index += o.blockSize;
        }
    },

    _calculateBlocksToRender: function () {
        var o = this.options;
        this._renderMoreIf();
        // var height = this.element.height();
        // var minContentHeightFrom = o.scrollTop - o.overscanHeight;
        // var minContentHeightTo = o.scrollTop + height + o.overscanHeight;
        // var start = this.tree.greatestLowerBound(minContentHeightFrom);
        // var end = this.tree.leastUpperBound(minContentHeightTo);
        // var summaryTopHeight = 0;
        // this.topBlank.setHeight(0);
        // this.bottomBlank.setHeight(0);
        // var needDestroyed = [];
        // for (var i = 0; i < start; i++) {
        //     var index = this.cache[i].index;
        //     summaryTopHeight += this.cache[i].height;
        //     if (!this.cache[i].destroyed) {
        //         for (var j = index; j < index + o.blockSize && j < o.items.length; j++) {
        //             needDestroyed.push(this.container._children[j]);
        //             this.container._children[j] = null;
        //         }
        //         this.cache[i].destroyed = true;
        //         // this.topBlank.setHeight(summaryTopHeight);
        //     }
        // }
        // summaryTopHeight = 0;
        // for (var i = end + 1; i <= this.renderedIndex; i++) {
        //     var index = this.cache[i].index;
        //     summaryTopHeight += this.cache[i].height;
        //     if (!this.cache[i].destroyed) {
        //         for (var j = index; j < index + o.blockSize && j < o.items.length; j++) {
        //             needDestroyed.push(this.container._children[j]);
        //             this.container._children[j] = null;
        //         }
        //         this.cache[i].destroyed = true;
        //         // this.bottomBlank.setHeight(summaryTopHeight);
        //     }
        // }
        // var firstFragment = document.createDocumentFragment(), lastFragment = document.createDocumentFragment();
        // var currentFragment = firstFragment;
        // for (var i = (start < 0 ? 0 : start); i <= end && i <= this.renderedIndex; i++) {
        //     var index = this.cache[i].index;
        //     if (!this.cache[i].destroyed) {
        //         currentFragment = lastFragment;
        //     }
        //     if (this.cache[i].destroyed === true) {
        //         for (var j = index; j < index + o.blockSize && j < o.items.length; j++) {
        //             var w = this.container._children[j] = BI.createWidget(BI.extend({
        //                 root: true
        //             }, BI.stripEL(o.items[j])));
        //             currentFragment.appendChild(w.element[0]);
        //         }
        //         this.cache[i].destroyed = false;
        //     }
        // }
        // this.container.element.prepend(firstFragment);
        // this.container.element.append(lastFragment);
        // BI.each(needDestroyed, function (i, child) {
        //     child && child._destroy();
        // });
    },

    _populate: function () {
        var o = this.options;
        this.tree = BI.PrefixIntervalTree.empty(Math.ceil(o.items.length / o.blockSize));
        this._calculateBlocksToRender();
        this.element.scrollTop(o.scrollTop);
    },

    restore: function () {
        this.renderedIndex = -1;
        this.cache = {};
    },

    populate: function (items) {

    },

    destroyed: function () {
        this.restore();
    }
});
BI.shortcut('bi.virtual_list', BI.VirtualList);
