/**
 * 布局容器类
 * @class BI.Layout
 * @extends BI.Widget
 *
 * @cfg {JSON} options 配置属性
 * @cfg {Boolean} [options.scrollable=false] 子组件超出容器边界之后是否会出现滚动条
 * @cfg {Boolean} [options.scrollx=false] 子组件超出容器边界之后是否会出现横向滚动条
 * @cfg {Boolean} [options.scrolly=false] 子组件超出容器边界之后是否会出现纵向滚动条
 */
BI.Layout = BI.inherit(BI.Widget, {
    props: function () {
        return {
            scrollable: null, //true, false, null
            scrollx: false, //true, false
            scrolly: false, //true, false
            items: []
        };
    },

    render: function () {
        this._init4Margin();
        this._init4Scroll();
    },

    _init4Margin: function () {
        if (this.options.top) {
            this.element.css('top', this.options.top);
        }
        if (this.options.left) {
            this.element.css('left', this.options.left);
        }
        if (this.options.bottom) {
            this.element.css('bottom', this.options.bottom);
        }
        if (this.options.right) {
            this.element.css('right', this.options.right);
        }
    },

    _init4Scroll: function () {
        switch (this.options.scrollable) {
            case true:
                this.element.css("overflow", "auto");
                break;
            case false:
                this.element.css("overflow", "hidden");
                break;
            default :
                break;
        }
        if (this.options.scrollx) {
            this.element.css({
                "overflow-x": "auto",
                "overflow-y": "hidden"
            });
        }
        if (this.options.scrolly) {
            this.element.css({
                "overflow-x": "hidden",
                "overflow-y": "auto"
            });
        }
    },

    _addElement: function (i, item) {
        var o = this.options;
        var w;
        if (!this.hasWidget(this.getName() + "-" + i)) {
            w = BI.createWidget(item);
            this.addWidget(this.getName() + "-" + i, w);
        } else {
            w = this.getWidgetByName(this.getName() + "-" + i);
        }
        return w;
    },

    stroke: function (items) {
        var self = this;
        BI.each(items, function (i, item) {
            if (!!item) {
                self._addElement(i, item);
            }
        });
    },

    populate: function (items) {
        var self = this;
        this.options.items = items || [];
        this.stroke(items);
    },

    resize: function () {

    },

    /**
     * 添加一个子组件到容器中
     * @param {JSON/BI.Widget} item 子组件
     */
    addItem: function (item) {
        var w = this._addElement(this.options.items.length, item);
        w._mount();
        this.options.items.push(item);
        w.element.appendTo(this.element);
        return w;
    },

    prependItem: function (item) {
        var w = this._addElement(this.options.items.length, item);
        w._mount();
        this.options.items.unshift(item);
        w.element.prependTo(this.element);
        return w;
    },

    addItems: function (items) {
        var self = this;
        BI.each(items, function (i, item) {
            self.addItem(item);
        })
    },

    prependItems: function (items) {
        var self = this;
        BI.each(items, function (i, item) {
            self.prependItem(item);
        })
    },

    getValue: function () {
        var value = [];
        BI.each(this._children, function (i, wi) {
            var v = wi.getValue();
            v = BI.isArray(v) ? v : [v];
            value = value.concat(v);
        });
        return value;
    },

    setValue: function (v) {
        BI.each(this._children, function (i, wi) {
            wi.setValue(v);
        })
    },

    setText: function (v) {
        BI.each(this._children, function (i, wi) {
            wi.setText(v);
        })
    }
});
$.shortcut('bi.layout', BI.Layout);