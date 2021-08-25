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
            items: []
        };
    },

    render: function () {
        this._init4Margin();
        this._init4Scroll();
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

    _addElement: function (i, item, context) {
        var self = this, w;
        if (!this.hasWidget(this._getChildName(i))) {
            w = BI._lazyCreateWidget(item, context);
            w.on(BI.Events.DESTROY, function () {
                BI.each(self._children, function (name, child) {
                    if (child === w) {
                        BI.remove(self._children, child);
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
        delete this._children[this._getChildName(oldIndex)];
        var w = this._addElement(newIndex, item);
        this._children[this._getChildName(newIndex)] = w;
        if (oldIndex > 0) {
            this._children[this._getChildName(oldIndex - 1)].element.after(w.element);
        } else {
            w.element.prependTo(this._getWrapper());
        }
        del._destroy();
        w._mount();
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

    _handleGap: function (w, item, hIndex, vIndex) {
        var o = this.options;
        if (o.vgap + o.tgap + (item.tgap || 0) + (item.vgap || 0) !== 0) {
            w.element.css({
                "margin-top": (((BI.isNull(vIndex) || vIndex === 0) ? o.vgap : 0) + o.tgap + (item.tgap || 0) + (item.vgap || 0)) / BI.pixRatio + BI.pixUnit
            });
        }
        if (o.hgap + o.lgap + (item.lgap || 0) + (item.hgap || 0) !== 0) {
            w.element.css({
                "margin-left": (((BI.isNull(hIndex) || hIndex === 0) ? o.hgap : 0) + o.lgap + (item.lgap || 0) + (item.hgap || 0)) / BI.pixRatio + BI.pixUnit
            });
        }
        if (o.hgap + o.rgap + (item.rgap || 0) + (item.hgap || 0) !== 0) {
            w.element.css({
                "margin-right": (o.hgap + o.rgap + (item.rgap || 0) + (item.hgap || 0)) / BI.pixRatio + BI.pixUnit
            });
        }
        if (o.vgap + o.bgap + (item.bgap || 0) + (item.vgap || 0) !== 0) {
            w.element.css({
                "margin-bottom": (o.vgap + o.bgap + (item.bgap || 0) + (item.vgap || 0)) / BI.pixRatio + BI.pixUnit
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
            return child._update(this._getOptions(vnode), shouldUpdate);
        }
        if (shouldUpdate === null && !this._compare(oldVnode, vnode)) {
            // if (child.update) {
            //     return child.update(this._getOptions(vnode));
            // }
            return this._updateItemAt(oldIndex, newIndex, vnode);
        }
    },

    updateChildren: function (oldCh, newCh) {
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
                updated = this.patchItem(oldStartVnode, newStartVnode, oldStartIdx, newStartIdx) || updated;
                children[oldStartVnode.key == null ? oldStartIdx : oldStartVnode.key] = this._children[this._getChildName(oldStartIdx)];
                oldStartVnode = oldCh[++oldStartIdx];
                newStartVnode = newCh[++newStartIdx];
            } else if (sameVnode(oldEndVnode, newEndVnode, oldEndIdx, newEndIdx)) {
                updated = this.patchItem(oldEndVnode, newEndVnode, oldEndIdx, newEndIdx) || updated;
                children[oldEndVnode.key == null ? oldEndIdx : oldEndVnode.key] = this._children[this._getChildName(oldEndIdx)];
                oldEndVnode = oldCh[--oldEndIdx];
                newEndVnode = newCh[--newEndIdx];
            } else if (sameVnode(oldStartVnode, newEndVnode)) {
                updated = this.patchItem(oldStartVnode, newEndVnode, oldStartIdx, newStartIdx) || updated;
                children[oldStartVnode.key == null ? oldStartIdx : oldStartVnode.key] = this._children[this._getChildName(oldStartIdx)];
                insertBefore(oldStartVnode, oldEndVnode, true);
                oldStartVnode = oldCh[++oldStartIdx];
                newEndVnode = newCh[--newEndIdx];
            } else if (sameVnode(oldEndVnode, newStartVnode)) {
                updated = this.patchItem(oldEndVnode, newStartVnode, oldEndIdx, newEndIdx) || updated;
                children[oldEndVnode.key == null ? oldEndIdx : oldEndVnode.key] = this._children[this._getChildName(oldEndIdx)];
                insertBefore(oldEndVnode, oldStartVnode);
                oldEndVnode = oldCh[--oldEndIdx];
                newStartVnode = newCh[++newStartIdx];
            } else {
                var sameOldVnode = findOldVnode(oldCh, newStartVnode, oldStartIdx, oldEndIdx);
                if (BI.isNull(sameOldVnode[0])) {  //  不存在就把新的放到左边
                    delete self._children[self._getChildName(newStartIdx)];
                    var node = addNode(newStartVnode, newStartIdx);
                    insertBefore(node, oldStartVnode);
                } else {   //  如果新节点在旧节点区间中存在就复用一下
                    var sameOldIndex = sameOldVnode[1];
                    updated = self.patchItem(sameOldVnode[0], newStartVnode, sameOldIndex, newStartIdx) || updated;
                    children[sameOldVnode[0].key == null ? newStartIdx : sameOldVnode[0].key] = self._children[self._getChildName(sameOldIndex)];
                    if (newStartIdx !== sameOldIndex) {
                        delete self._children[self._getChildName(sameOldIndex)];
                    }
                    oldCh[sameOldIndex] = undefined;
                    insertBefore(sameOldVnode[0], oldStartVnode);
                }
                newStartVnode = newCh[++newStartIdx];
            }
        }
        if (oldStartIdx > oldEndIdx) {
            before = BI.isNull(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1];
            addVnodes(before, newCh, newStartIdx, newEndIdx);
        } else if (newStartIdx > newEndIdx) {
            removeVnodes(oldCh, oldStartIdx, oldEndIdx);
        }

        this._children = {};
        BI.each(newCh, function (i, child) {
            var node = self._getOptions(child);
            var key = node.key == null ? i : node.key;
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

        function addNode (vnode, index) {
            var opt = self._getOptions(vnode);
            var key = opt.key == null ? index : opt.key;
            delete self._children[self._getChildName(index)];
            return children[key] = self._addElement(index, vnode);
        }

        function addVnodes (before, vnodes, startIdx, endIdx) {
            for (; startIdx <= endIdx; ++startIdx) {
                var node = addNode(vnodes[startIdx], startIdx);
                insertBefore(node, before, false, startIdx);
            }
        }

        function removeVnodes (vnodes, startIdx, endIdx) {
            for (; startIdx <= endIdx; ++startIdx) {
                var ch = vnodes[startIdx];
                if (BI.isNotNull(ch)) {
                    var node = self._getOptions(ch);
                    var key = node.key == null ? startIdx : node.key;
                    delete self._children[self._getChildName(startIdx)];
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
        var oldItems = o.items;
        this.options.items = items;
        return this.updateChildren(oldItems, items);
    },

    stroke: function (items) {
        var self = this;
        BI.each(items, function (i, item) {
            if (item) {
                self._addElement(i, item);
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

    populate: function (items) {
        items = items || [];
        if (this._isMounted) {
            this.update({items: items});
            return;
        }
        this.options.items = items;
        this.stroke(items);
    },

    resize: function () {
        this.stroke(this.options.items);
    }
});
BI.shortcut("bi.layout", BI.Layout);
