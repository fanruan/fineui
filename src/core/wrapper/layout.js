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

    _getChildName: function (index) {
        return index + "";
    },

    _addElement: function (i, item) {
        var self = this, w;
        if (!this.hasWidget(this._getChildName(i))) {
            w = BI.createWidget(item);
            this.addWidget(this._getChildName(i), w);
            w.on(BI.Events.DESTROY, function () {
                BI.each(self._children, function (name, child) {
                    if (child === w) {
                        self.removeItemAt(name | 0);
                    }
                });
            });
        } else {
            w = this.getWidgetByName(this._getChildName(i));
        }
        return w;
    },

    _getOptions: function (item) {
        if (item instanceof BI.Widget) {
            item = item.options;
        }
        item = BI.stripEL(item);
        if (item instanceof BI.Widget) {
            item = item.options;
        }
        return item;
    },

    _compare: function (item1, item2) {
        var self = this;
        return eq(item1, item2);

        //不比较函数
        function eq(a, b, aStack, bStack) {
            if (a === b) return a !== 0 || 1 / a === 1 / b;
            if (a == null || b == null) return a === b;
            var className = Object.prototype.toString.call(a);
            switch (className) {
                case '[object RegExp]':
                case '[object String]':
                    return '' + a === '' + b;
                case '[object Number]':
                    if (+a !== +a) return +b !== +b;
                    return +a === 0 ? 1 / +a === 1 / b : +a === +b;
                case '[object Date]':
                case '[object Boolean]':
                    return +a === +b;
            }

            var areArrays = className === '[object Array]';
            if (!areArrays) {
                if (BI.isFunction(a) && BI.isFunction(b)) {
                    return true;
                }
                a = self._getOptions(a);
                b = self._getOptions(b);
            }

            aStack = aStack || [];
            bStack = bStack || [];
            var length = aStack.length;
            while (length--) {
                if (aStack[length] === a) return bStack[length] === b;
            }

            aStack.push(a);
            bStack.push(b);

            if (areArrays) {
                length = a.length;
                if (length !== b.length) return false;
                while (length--) {
                    if (!eq(a[length], b[length], aStack, bStack)) return false;
                }
            } else {
                var keys = _.keys(a), key;
                length = keys.length;
                if (_.keys(b).length !== length) return false;
                while (length--) {
                    key = keys[length];
                    if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
                }
            }
            aStack.pop();
            bStack.pop();
            return true;
        }
    },

    _getWrapper: function () {
        return this.element;
    },

    _addItemAt: function (index, item) {
        for (var i = this.options.items.length; i > index; i--) {
            this._children[this._getChildName(i)] = this._children[this._getChildName(i - 1)];
        }
        delete this._children[index];
        this.options.items.splice(index, 0, item);
    },

    _removeItemAt: function (index) {
        for (var i = index; i < this.options.items.length - 1; i++) {
            this._children[this._getChildName(i)] = this._children[this._getChildName(i + 1)];
        }
        this.options.items.splice(index, 1);
    },

    /**
     * 添加一个子组件到容器中
     * @param {JSON/BI.Widget} item 子组件
     */
    addItem: function (item) {
        return this.addItemAt(this.options.items.length, item);
    },

    prependItem: function (item) {
        return this.addItemAt(0,item);
    },

    addItemAt: function (index, item) {
        if (index < 0 || index > this.options.items.length) {
            return;
        }
        this._addItemAt(index, item);
        var w = this._addElement(index, item);
        if (index > 0) {
            this._children[this._getChildName(index - 1)].element.after(w.element);
        } else {
            w.element.prependTo(this._getWrapper());
        }
        w._mount();
        return w;
    },

    removeItemAt: function (index) {
        if (index < 0 || index > this.options.items.length - 1) {
            return;
        }
        this._children[this._getChildName(index)].destroy();
        this._removeItemAt(index);
    },

    updateItemAt: function (index, item) {
        if (index < 0 || index > this.options.items.length - 1) {
            return;
        }

        var child = this._children[this._getChildName(index)];
        if (child.update) {
            child.update(this._getOptions(item));
            return true;
        }
        var del = this._children[this._getChildName(index)];
        delete this._children[this._getChildName(index)];
        this.options.items.splice(index, 1);
        var w = this._addElement(index, item);
        this.options.items.splice(index, 0, item);
        this._children[this._getChildName(index)] = w;
        if (index > 0) {
            this._children[this._getChildName(index - 1)].element.after(w.element);
        } else {
            w.element.prependTo(this._getWrapper());
        }
        del.destroy();
        w._mount();
    },

    addItems: function (items) {
        var self = this, o = this.options;
        var fragment = document.createDocumentFragment();
        var added = [];
        BI.each(items, function (i, item) {
            var w = self._addElement(o.items.length, item);
            self._children[self._getChildName(o.items.length)] = w;
            o.items.push(item);
            added.push(w);
            fragment.appendChild(w.element[0]);
        });
        this._getWrapper().append(fragment);
        BI.each(added, function (i, w) {
            w._mount();
        })
    },

    prependItems: function (items) {
        var self =this,items = items || [];
        var fragment = document.createDocumentFragment();
        var added = [];
        for (var i = items.length - 1; i >= 0; i--) {
            this._addItemAt(0, items[i]);
            var w = this._addElement(0, items[i]);
            self._children[self._getChildName(0)] = w;
            this.options.items.unshift(items[i]);
            added.push(w);
            fragment.appendChild(w.element[0]);
        }
        this._getWrapper().prepend(fragment);
        BI.each(added, function (i, w) {
            w._mount();
        })
    },

    getValue: function () {
        var self = this, value = [];
        BI.each(this.options.items, function (i) {
            var v = self._children[self._getChildName(i)].getValue();
            v = BI.isArray(v) ? v : [v];
            value = value.concat(v);
        });
        return value;
    },

    setValue: function (v) {
        var self = this;
        BI.each(this.options.items, function (i) {
            self._children[self._getChildName(i)].setValue(v);
        })
    },

    setText: function (v) {
        var self = this;
        BI.each(this.options.items, function (i) {
            self._children[self._getChildName(i)].setText(v);
        })
    },

    update: function (item) {
        var o = this.options;
        var items = item.items;
        var updated = false, i, len;
        for (i = 0, len = Math.min(o.items.length, items.length); i < len; i++) {
            if (!this._compare(o.items[i], items[i])) {
                updated = this.updateItemAt(i, items[i]) || updated;
            }
        }
        if (o.items.length > items.length) {
            var deleted = [];
            for (i = items.length; i < o.items.length; i++) {
                deleted.push(this._children[this._getChildName(i)]);
            }
            BI.each(deleted, function (i, w) {
                w.destroy();
            })
        } else if (items.length > o.items.length) {
            for (i = o.items.length; i < items.length; i++) {
                this.addItemAt(i, items[i]);
            }
        }
        this.options.items = items;
        return updated;
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
        var self = this, o = this.options;
        items = items || [];
        if (this._isMounted) {
            this.update({items: items});
            return;
        }
        this.options.items = items;
        this.stroke(items);
    },

    resize: function () {

    }
});
$.shortcut('bi.layout', BI.Layout);