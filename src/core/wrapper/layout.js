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
            scrollable: null, // true, false, null
            scrollx: false, // true, false
            scrolly: false, // true, false
            items: [],
            innerHgap: 0,
            innerVgap: 0,
        };
    },

    render: function () {
        var self = this, o = this.options;
        this._init4Margin();
        this._init4Scroll();
        if (BI.isFunction(o.columnSize)) {
            var columnSizeFn = o.columnSize;
            o.columnSize = this.__watch(columnSizeFn, function (context, newValue) {
                o.columnSize = newValue;
                self.resize();
            });
        }
        if (BI.isFunction(o.rowSize)) {
            var rowSizeFn = o.rowSize;
            o.rowSize = this.__watch(rowSizeFn, function (context, newValue) {
                o.rowSize = newValue;
                self.resize();
            });
        }
    },

    _init4Margin: function () {
        if (this.options.top) {
            this.element.css("top", BI.isNumber(this.options.top) ? this.options.top / BI.pixRatio + BI.pixUnit : this.options.top);
        }
        if (this.options.left) {
            this.element.css("left", BI.isNumber(this.options.left) ? this.options.left / BI.pixRatio + BI.pixUnit : this.options.left);
        }
        if (this.options.bottom) {
            this.element.css("bottom", BI.isNumber(this.options.bottom) ? this.options.bottom / BI.pixRatio + BI.pixUnit : this.options.bottom);
        }
        if (this.options.right) {
            this.element.css("right", BI.isNumber(this.options.right) ? this.options.right / BI.pixRatio + BI.pixUnit : this.options.right);
        }
    },

    _init4Scroll: function () {
        switch (this.options.scrollable) {
            case true:
            case "xy":
                this.element.css("overflow", "auto");
                return;
            case false:
                this.element.css("overflow", "hidden");
                return;
            case "x":
                this.element.css({
                    "overflow-x": "auto",
                    "overflow-y": "hidden"
                });
                return;
            case "y":
                this.element.css({
                    "overflow-x": "hidden",
                    "overflow-y": "auto"
                });
                return;
            default :
                break;
        }
        if (this.options.scrollx) {
            this.element.css({
                "overflow-x": "auto",
                "overflow-y": "hidden"
            });
            return;
        }
        if (this.options.scrolly) {
            this.element.css({
                "overflow-x": "hidden",
                "overflow-y": "auto"
            });
        }
    },

    appendFragment: function (frag) {
        this.element.append(frag);
    },

    _mountChildren: function () {
        var self = this;
        var frag = BI.Widget._renderEngine.createFragment();
        var hasChild = false;
        for (var key in this._children) {
            var child = this._children[key];
            if (child.element !== self.element) {
                frag.appendChild(child.element[0]);
                hasChild = true;
            }
        }
        if (hasChild === true) {
            this.appendFragment(frag);
        }
    },

    _getChildName: function (index) {
        return "" + index;
    },

    _addElement: function (i, item, context, widget) {
        var self = this, w;
        if (widget) {
            return widget;
        }
        if (!this.hasWidget(this._getChildName(i))) {
            w = BI._lazyCreateWidget(item, context);
            w.on(BI.Events.DESTROY, function () {
                BI.each(self._children, function (name, child) {
                    if (child === w) {
                        delete self._children[name];
                        self.removeItemAt(name | 0);
                    }
                });
            });
            this.addWidget(this._getChildName(i), w);
        } else {
            w = this.getWidgetByName(this._getChildName(i));
        }
        return w;
    },

    _newElement: function (i, item, context) {
        var self = this;
        var w = BI._lazyCreateWidget(item, context);
        w.on(BI.Events.DESTROY, function () {
            BI.each(self._children, function (name, child) {
                if (child === w) {
                    delete self._children[name];
                    self.removeItemAt(name | 0);
                }
            });
        });
        return this._addElement(i, item, context, w);
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

        // 不比较函数
        function eq (a, b, aStack, bStack) {
            if (a === b) {
                return a !== 0 || 1 / a === 1 / b;
            }
            if (a == null || b == null) {
                return a === b;
            }
            var className = Object.prototype.toString.call(a);
            switch (className) {
                case "[object RegExp]":
                case "[object String]":
                    return "" + a === "" + b;
                case "[object Number]":
                    if (+a !== +a) {
                        return +b !== +b;
                    }
                    return +a === 0 ? 1 / +a === 1 / b : +a === +b;
                case "[object Date]":
                case "[object Boolean]":
                    return +a === +b;
            }

            var areArrays = className === "[object Array]";
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
                if (aStack[length] === a) {
                    return bStack[length] === b;
                }
            }

            aStack.push(a);
            bStack.push(b);

            if (areArrays) {
                length = a.length;
                if (length !== b.length) {
                    return false;
                }
                while (length--) {
                    if (!eq(a[length], b[length], aStack, bStack)) {
                        return false;
                    }
                }
            } else {
                var keys = _.keys(a), key;
                length = keys.length;
                if (_.keys(b).length !== length) {
                    return false;
                }
                while (length--) {
                    key = keys[length];
                    if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) {
                        return false;
                    }
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

    // 不依赖于this.options.items进行更新
    _updateItemAt: function (oldIndex, newIndex, item) {
        var del = this._children[this._getChildName(oldIndex)];
        var w = this._newElement(newIndex, item);
        // 需要有个地方临时存一下新建的组件，否则如果直接使用newIndex的话，newIndex位置的元素可能会被用到
        this._children[this._getChildName(newIndex) + "-temp"] = w;
        var nextSibling = del.element.next();
        if (nextSibling.length > 0) {
            BI.Widget._renderEngine.createElement(nextSibling).before(w.element);
        } else {
            w.element.appendTo(this._getWrapper());
        }
        del._destroy();
        w._mount();
        return true;
    },

    _addItemAt: function (index, item) {
        for (var i = this.options.items.length; i > index; i--) {
            this._children[this._getChildName(i)] = this._children[this._getChildName(i - 1)];
        }
        delete this._children[this._getChildName(index)];
        this.options.items.splice(index, 0, item);
    },

    _removeItemAt: function (index) {
        for (var i = index; i < this.options.items.length - 1; i++) {
            this._children[this._getChildName(i)] = this._children[this._getChildName(i + 1)];
        }
        delete this._children[this._getChildName(this.options.items.length - 1)];
        this.options.items.splice(index, 1);
    },

    _clearGap: function (w) {
        w.element.css({
            "margin-top": "",
            "margin-bottom": "",
            "margin-left": "",
            "margin-right": ""
        });
    },

    _optimiseGap: function (gap) {
        return (gap > 0 && gap < 1) ? (gap * 100).toFixed(1) + "%" : gap / BI.pixRatio + BI.pixUnit;
    },

    _handleGap: function (w, item, hIndex, vIndex) {
        var o = this.options;
        var innerLgap, innerRgap, innerTgap, innerBgap;
        if (BI.isNull(vIndex)) {
            innerTgap = innerBgap = o.innerVgap;
            innerLgap = hIndex === 0 ? o.innerHgap : 0;
            innerRgap = hIndex === o.items.length - 1 ? o.innerHgap : 0;
        } else {
            innerLgap = innerRgap = o.innerHgap;
            innerTgap = vIndex === 0 ? o.innerVgap : 0;
            innerBgap = vIndex === o.items.length - 1 ? o.innerVgap : 0;
        }
        if (o.vgap + o.tgap + innerTgap + (item.tgap || 0) + (item.vgap || 0) !== 0) {
            var top = ((BI.isNull(vIndex) || vIndex === 0) ? o.vgap : 0) + o.tgap + innerTgap + (item.tgap || 0) + (item.vgap || 0);
            w.element.css({
                "margin-top": this._optimiseGap(top)
            });
        }
        if (o.hgap + o.lgap + innerLgap + (item.lgap || 0) + (item.hgap || 0) !== 0) {
            var left = ((BI.isNull(hIndex) || hIndex === 0) ? o.hgap : 0) + o.lgap + innerLgap + (item.lgap || 0) + (item.hgap || 0);
            w.element.css({
                "margin-left": this._optimiseGap(left)
            });
        }
        if (o.hgap + o.rgap + innerRgap + (item.rgap || 0) + (item.hgap || 0) !== 0) {
            var right = o.hgap + o.rgap + innerRgap + (item.rgap || 0) + (item.hgap || 0);
            w.element.css({
                "margin-right": this._optimiseGap(right)
            });
        }
        if (o.vgap + o.bgap + innerBgap + (item.bgap || 0) + (item.vgap || 0) !== 0) {
            var bottom = o.vgap + o.bgap + innerBgap + (item.bgap || 0) + (item.vgap || 0);
            w.element.css({
                "margin-bottom": this._optimiseGap(bottom)
            });
        }
    },

    // 横向换纵向
    _handleReverseGap: function (w, item, index) {
        var o = this.options;
        var innerLgap, innerRgap, innerTgap, innerBgap;
        innerLgap = innerRgap = o.innerHgap;
        innerTgap = index === 0 ? o.innerVgap : 0;
        innerBgap = index === o.items.length - 1 ? o.innerVgap : 0;
        if (o.vgap + o.tgap + innerTgap + (item.tgap || 0) + (item.vgap || 0) !== 0) {
            var top = (index === 0 ? o.vgap : 0) + (index === 0 ? o.tgap : 0) + innerTgap + (item.tgap || 0) + (item.vgap || 0);
            w.element.css({
                "margin-top": this._optimiseGap(top)
            });
        }
        if (o.hgap + o.lgap + innerLgap + (item.lgap || 0) + (item.hgap || 0) !== 0) {
            var left = o.hgap + o.lgap + innerLgap + (item.lgap || 0) + (item.hgap || 0);
            w.element.css({
                "margin-left": this._optimiseGap(left)
            });
        }
        if (o.hgap + o.rgap + innerRgap + (item.rgap || 0) + (item.hgap || 0) !== 0) {
            var right = o.hgap + o.rgap + innerRgap + (item.rgap || 0) + (item.hgap || 0);
            w.element.css({
                "margin-right": this._optimiseGap(right)
            });
        }
        // 这里的代码是关键
        if (o.vgap + o.hgap + o.bgap + innerBgap + (item.bgap || 0) + (item.vgap || 0) !== 0) {
            var bottom = (index === o.items.length - 1 ? o.vgap : o.hgap) + (index === o.items.length - 1 ? o.bgap : 0) + innerBgap + (item.bgap || 0) + (item.vgap || 0);
            w.element.css({
                "margin-bottom": this._optimiseGap(bottom)
            });
        }
    },

    /**
     * 添加一个子组件到容器中
     * @param {JSON/BI.Widget} item 子组件
     */
    addItem: function (item) {
        return this.addItemAt(this.options.items.length, item);
    },

    prependItem: function (item) {
        return this.addItemAt(0, item);
    },

    addItemAt: function (index, item) {
        if (index < 0 || index > this.options.items.length) {
            return;
        }
        this._addItemAt(index, item);
        var w = this._addElement(index, item);
        // addItemAt 还是用之前的找上个兄弟节点向后插入的方式
        if (index > 0) {
            this._children[this._getChildName(index - 1)].element.after(w.element);
        } else {
            w.element.prependTo(this._getWrapper());
        }
        w._mount();
        return w;
    },

    removeItemAt: function (indexes) {
        indexes = BI.isArray(indexes) ? indexes : [indexes];
        var deleted = [];
        var newItems = [], newChildren = {};
        for (var i = 0, len = this.options.items.length; i < len; i++) {
            var child = this._children[this._getChildName(i)];
            if (BI.contains(indexes, i)) {
                child && deleted.push(child);
            } else {
                newChildren[this._getChildName(newItems.length)] = child;
                newItems.push(this.options.items[i]);
            }
        }
        this.options.items = newItems;
        this._children = newChildren;
        BI.each(deleted, function (i, c) {
            c._destroy();
        });
    },

    shouldUpdateItem: function (index, item) {
        var child = this._children[this._getChildName(index)];
        if (!child || !child.shouldUpdate) {
            return null;
        }
        return child.shouldUpdate(this._getOptions(item));
    },

    addItems: function (items, context) {
        var self = this, o = this.options;
        var fragment = BI.Widget._renderEngine.createFragment();
        var added = [];
        BI.each(items, function (i, item) {
            var w = self._addElement(o.items.length, item, context);
            self._children[self._getChildName(o.items.length)] = w;
            o.items.push(item);
            added.push(w);
            fragment.appendChild(w.element[0]);
        });
        if (this._isMounted) {
            this._getWrapper().append(fragment);
            BI.each(added, function (i, w) {
                w._mount();
            });
        }
    },

    prependItems: function (items, context) {
        items = items || [];
        var fragment = BI.Widget._renderEngine.createFragment();
        var added = [];
        for (var i = items.length - 1; i >= 0; i--) {
            this._addItemAt(0, items[i]);
            var w = this._addElement(0, items[i], context);
            this._children[this._getChildName(0)] = w;
            this.options.items.unshift(items[i]);
            added.push(w);
            fragment.appendChild(w.element[0]);
        }
        if (this._isMounted) {
            this._getWrapper().prepend(fragment);
            BI.each(added, function (i, w) {
                w._mount();
            });
        }
    },

    getValue: function () {
        var self = this, value = [], child;
        BI.each(this.options.items, function (i) {
            if (child = self._children[self._getChildName(i)]) {
                var v = child.getValue();
                v = BI.isArray(v) ? v : [v];
                value = value.concat(v);
            }
        });
        return value;
    },

    setValue: function (v) {
        var self = this, child;
        BI.each(this.options.items, function (i) {
            if (child = self._children[self._getChildName(i)]) {
                child.setValue(v);
            }
        });
    },

    setText: function (v) {
        var self = this, child;
        BI.each(this.options.items, function (i) {
            if (child = self._children[self._getChildName(i)]) {
                child.setText(v);
            }
        });
    },

    patchItem: function (oldVnode, vnode, oldIndex, newIndex) {
        var shouldUpdate = this.shouldUpdateItem(oldIndex, vnode);
        var child = this._children[this._getChildName(oldIndex)];
        if (shouldUpdate) {
            this._children[this._getChildName(newIndex) + "-temp"] = child;
            return child._update(this._getOptions(vnode), shouldUpdate);
        }
        if (shouldUpdate === null && !this._compare(oldVnode, vnode)) {
            // if (child.update) {
            //     return child.update(this._getOptions(vnode));
            // }
            return this._updateItemAt(oldIndex, newIndex, vnode);
        }
    },

    updateChildren: function (oldCh, newCh, context) {
        var self = this;
        var oldStartIdx = 0, newStartIdx = 0;
        var oldEndIdx = oldCh.length - 1;
        var oldStartVnode = oldCh[0];
        var oldEndVnode = oldCh[oldEndIdx];
        var newEndIdx = newCh.length - 1;
        var newStartVnode = newCh[0];
        var newEndVnode = newCh[newEndIdx];
        var before;
        var updated;
        var children = {};
        BI.each(oldCh, function (i, child) {
            child = self._getOptions(child);
            var key = child.key == null ? i : child.key;
            if (BI.isKey(key)) {
                children[key] = self._children[self._getChildName(i)];
            }
        });

        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (BI.isNull(oldStartVnode)) {
                oldStartVnode = oldCh[++oldStartIdx];
            } else if (BI.isNull(oldEndVnode)) {
                oldEndVnode = oldCh[--oldEndIdx];
            } else if (sameVnode(oldStartVnode, newStartVnode, oldStartIdx, newStartIdx)) {
                var willUpdate = this.patchItem(oldStartVnode, newStartVnode, oldStartIdx, newStartIdx);
                updated = willUpdate || updated;
                children[oldStartVnode.key == null ? oldStartIdx : oldStartVnode.key] = willUpdate ? this._children[this._getChildName(newStartIdx) + "-temp"] : this._children[this._getChildName(oldStartIdx)];
                oldStartVnode = oldCh[++oldStartIdx];
                newStartVnode = newCh[++newStartIdx];
            } else if (sameVnode(oldEndVnode, newEndVnode, oldEndIdx, newEndIdx)) {
                var willUpdate = this.patchItem(oldEndVnode, newEndVnode, oldEndIdx, newEndIdx);
                updated = willUpdate || updated;
                children[oldEndVnode.key == null ? oldEndIdx : oldEndVnode.key] = willUpdate ? this._children[this._getChildName(newEndIdx) + "-temp"] : this._children[this._getChildName(oldEndIdx)];
                oldEndVnode = oldCh[--oldEndIdx];
                newEndVnode = newCh[--newEndIdx];
            } else if (sameVnode(oldStartVnode, newEndVnode)) {
                var willUpdate = this.patchItem(oldStartVnode, newEndVnode, oldStartIdx, newStartIdx);
                updated = willUpdate || updated;
                children[oldStartVnode.key == null ? oldStartIdx : oldStartVnode.key] = willUpdate ? this._children[this._getChildName(newStartIdx) + "-temp"] : this._children[this._getChildName(oldStartIdx)];
                insertBefore(oldStartVnode, oldEndVnode, true);
                oldStartVnode = oldCh[++oldStartIdx];
                newEndVnode = newCh[--newEndIdx];
            } else if (sameVnode(oldEndVnode, newStartVnode)) {
                var willUpdate = this.patchItem(oldEndVnode, newStartVnode, oldEndIdx, newEndIdx);
                updated = willUpdate || updated;
                children[oldEndVnode.key == null ? oldEndIdx : oldEndVnode.key] = willUpdate ? this._children[this._getChildName(newEndIdx) + "-temp"] : this._children[this._getChildName(oldEndIdx)];
                insertBefore(oldEndVnode, oldStartVnode);
                oldEndVnode = oldCh[--oldEndIdx];
                newStartVnode = newCh[++newStartIdx];
            } else {
                var sameOldVnode = findOldVnode(oldCh, newStartVnode, oldStartIdx, oldEndIdx);
                if (BI.isNull(sameOldVnode[0])) {  //  不存在就把新的放到左边
                    var node = addNode(newStartVnode, newStartIdx, context);
                    insertBefore(node, oldStartVnode);
                } else {   //  如果新节点在旧节点区间中存在就复用一下
                    var sameOldIndex = sameOldVnode[1];
                    var willUpdate = self.patchItem(sameOldVnode[0], newStartVnode, sameOldIndex, newStartIdx);
                    updated = willUpdate || updated;
                    children[sameOldVnode[0].key == null ? newStartIdx : sameOldVnode[0].key] = willUpdate ? this._children[this._getChildName(newStartIdx) + "-temp"] : self._children[self._getChildName(sameOldIndex)];
                    oldCh[sameOldIndex] = undefined;
                    insertBefore(sameOldVnode[0], oldStartVnode);
                }
                newStartVnode = newCh[++newStartIdx];
            }
        }
        if (oldStartIdx > oldEndIdx) {
            before = BI.isNull(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1];
            addVnodes(before, newCh, newStartIdx, newEndIdx, context);
        } else if (newStartIdx > newEndIdx) {
            removeVnodes(oldCh, oldStartIdx, oldEndIdx);
        }

        this._children = {};
        BI.each(newCh, function (i, child) {
            var node = self._getOptions(child);
            var key = node.key == null ? i : node.key;
            children[key]._setParent && children[key]._setParent(self);
            children[key]._mount();
            self._children[self._getChildName(i)] = children[key];
        });

        function sameVnode (vnode1, vnode2, oldIndex, newIndex) {
            vnode1 = self._getOptions(vnode1);
            vnode2 = self._getOptions(vnode2);
            if (BI.isKey(vnode1.key)) {
                return vnode1.key === vnode2.key;
            }
            if (oldIndex >= 0) {
                return oldIndex === newIndex;
            }
        }

        function addNode (vnode, index, context) {
            var opt = self._getOptions(vnode);
            var key = opt.key == null ? index : opt.key;
            return children[key] = self._newElement(index, vnode, context);
        }

        function addVnodes (before, vnodes, startIdx, endIdx, context) {
            for (; startIdx <= endIdx; ++startIdx) {
                var node = addNode(vnodes[startIdx], startIdx, context);
                insertBefore(node, before, false, startIdx);
            }
        }

        function removeVnodes (vnodes, startIdx, endIdx) {
            for (; startIdx <= endIdx; ++startIdx) {
                var ch = vnodes[startIdx];
                if (BI.isNotNull(ch)) {
                    var node = self._getOptions(ch);
                    var key = node.key == null ? startIdx : node.key;
                    children[key]._destroy();
                }
            }
        }

        function insertBefore (insert, before, isNext, index) {
            insert = self._getOptions(insert);
            before = before && self._getOptions(before);
            var insertKey = BI.isKey(insert.key) ? insert.key : index;
            if (before && children[before.key]) {
                var beforeKey = BI.isKey(before.key) ? before.key : index;
                var next;
                if (isNext) {
                    next = children[beforeKey].element.next();
                } else {
                    next = children[beforeKey].element;
                }
                if (next.length > 0) {
                    next.before(children[insertKey].element);
                } else {
                    self._getWrapper().append(children[insertKey].element);
                }
            } else {
                self._getWrapper().append(children[insertKey].element);
            }
        }

        function findOldVnode (vnodes, vNode, beginIdx, endIdx) {
            var i, found, findIndex;
            for (i = beginIdx; i <= endIdx; ++i) {
                if (vnodes[i] && sameVnode(vnodes[i], vNode)) {
                    found = vnodes[i];
                    findIndex = i;
                }
            }
            return [found, findIndex];
        }

        return updated;
    },

    forceUpdate: function (opt) {
        if (this._isMounted) {
            BI.each(this._children, function (i, c) {
                c.destroy();
            });
            this._children = {};
            this._isMounted = false;
        }
        this.options.items = opt.items;
        this.stroke(opt.items);
        this._mount();
    },

    update: function (opt) {
        var o = this.options;
        var items = opt.items || [];
        var context = opt.context;
        var oldItems = o.items;
        this.options.items = items;
        return this.updateChildren(oldItems, items, context);
    },

    stroke: function (items, options) {
        options = options || {};
        var self = this;
        BI.each(items, function (i, item) {
            if (item) {
                self._addElement(i, item, options.context);
            }
        });
    },

    removeWidget: function (nameOrWidget) {
        var removeIndex, self = this;
        if (BI.isWidget(nameOrWidget)) {
            BI.each(this._children, function (name, child) {
                if (child === nameOrWidget) {
                    removeIndex = name;
                }
            });
        } else {
            removeIndex = nameOrWidget;
        }
        if (removeIndex) {
            this._removeItemAt(removeIndex | 0);
        }
    },

    empty: function () {
        BI.Layout.superclass.empty.apply(this, arguments);
        this.options.items = [];
    },

    destroy: function () {
        BI.Layout.superclass.destroy.apply(this, arguments);
        this.options.items = [];
    },

    populate: function (items, options) {
        items = items || [];
        options = options || {};
        if (this._isMounted) {
            this.update({
                items: items,
                context: options.context
            });
            return;
        }
        this.options.items = items;
        this.stroke(items, options);
    },

    resize: function () {
        this.stroke(this.options.items);
    }
});
BI.shortcut("bi.layout", BI.Layout);
