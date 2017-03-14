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
    _defaultConfig: function () {
        return BI.extend(BI.Layout.superclass._defaultConfig.apply(this, arguments), {
            scrollable: null, //true, false, null
            scrollx: false, //true, false
            scrolly: false, //true, false
            items: []
        });
    },
    _init: function () {
        BI.Layout.superclass._init.apply(this, arguments);
        this._init4Margin();
        this._init4Scroll();
    },

    /**
     * 初始化布局与外层容器的边间距
     * @private
     */
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

    /**
     * 初始化布局的滚动形态
     * @private
     */
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
        if (!this.hasWidget(this.getName() + i)) {
            w = BI.createWidget(item);
            this.addWidget(this.getName() + i, w);
        } else {
            w = this.getWidgetByName(this.getName() + i);
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
        this.reset(items);
        this.stroke(items);
    },

    reset: function (items) {
        this.options.items = items || [];
    },

    resize: function () {

    },

    /**
     * 添加一个子组件到容器中
     * @param {JSON/BI.Widget} item 子组件
     */
    addItem: function (item) {
        var w = this._addElement(this.options.items.length, item);
        this.options.items.push(item);
        w.element.appendTo(this.element);
        return w;
    },

    addItems: function (items) {
        var self = this;
        BI.each(items, function (i, item) {
            self.addItem(item);
        })
    },

    getValue: function (name) {
        if (name) {
            return this.getWidgetByName(name).getValue();
        }
        var value = [];
        BI.each(this.widgets, function (i, wi) {
            var v = wi.getValue(name);
            v = BI.isArray(v) ? v : [v];
            value = value.concat(v);
        });
        return value;
    },

    setValue: function (v, name) {
        if (name) {
            return this.getWidgetByName(name).setValue(v);
        }
        BI.each(this.widgets, function (i, wi) {
            wi.setValue(v);
        })
    },

    setText: function (v, name) {
        if (name) {
            return this.getWidgetByName(name).setText(v);
        }
        BI.each(this.widgets, function (i, wi) {
            wi.setText(v);
        })
    },

    empty: function () {
        BI.Layout.superclass.empty.apply(this, arguments);
        this.reset();
    }
});
$.shortcut('bi.layout', BI.Layout);