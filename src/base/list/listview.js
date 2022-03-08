/**
 * 表示当前对象
 *
 * Created by GUY on 2017/5/23.
 * @class BI.ListView
 * @extends BI.Widget
 */
BI.ListView = BI.inherit(BI.Widget, {
    props: function () {
        return {
            baseCls: "bi-list-view",
            overscanHeight: 100,
            blockSize: 10,
            scrollTop: 0,
            el: {},
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
            items: [BI.extend({
                type: "bi.vertical",
                scrolly: false,
                ref: function () {
                    self.container = this;
                }
            }, o.el)],
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
        var lastWidth = this.element.width(),
            lastHeight = this.element.height();
        BI.ResizeDetector.addResizeListener(this, function () {
            var width = self.element.width(),
                height = self.element.height();
            if (width !== lastWidth || height !== lastHeight) {
                lastWidth = width;
                lastHeight = height;
                self._calculateBlocksToRender();
            }
        });
    },

    _renderMoreIf: function () {
        var self = this, o = this.options;
        var height = this.element.height();
        var minContentHeight = o.scrollTop + height + o.overscanHeight;
        var index = (this.cache[this.renderedIndex] && (this.cache[this.renderedIndex].index + o.blockSize)) || 0,
            cnt = this.renderedIndex + 1;
        var lastHeight;
        var getElementHeight = function () {
            return self.container.element.height();
        };
        while ((lastHeight = getElementHeight()) < minContentHeight && index < o.items.length) {
            var items = o.items.slice(index, index + o.blockSize);
            this.container.addItems(items.map(function (item, i) {
                return o.itemFormatter(item, index + i);
            }), this);
            var addedHeight = getElementHeight() - lastHeight;
            this.cache[cnt] = {
                index: index,
                scrollTop: lastHeight,
                height: addedHeight
            };
            this.renderedIndex = cnt;
            cnt++;
            index += o.blockSize;
        }
    },

    _calculateBlocksToRender: function () {
        var o = this.options;
        this._renderMoreIf();
    },

    _populate: function (items) {
        var o = this.options;
        if (items && this.options.items !== items) {
            this.options.items = items;
        }
        this._calculateBlocksToRender();
        this.element.scrollTop(o.scrollTop);
    },

    restore: function () {
        this.renderedIndex = -1;
        this.container.empty();
        this.cache = {};
    },

    populate: function (items) {
        if (items && this.options.items !== items) {
            this.restore();
        }
        this._populate(items);
    },

    destroyed: function () {
        this.restore();
    }
});
BI.shortcut("bi.list_view", BI.ListView);

