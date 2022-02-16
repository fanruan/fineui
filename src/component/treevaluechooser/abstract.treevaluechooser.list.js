BI.AbstractListTreeValueChooser = BI.inherit(BI.AbstractTreeValueChooser, {

    _reqDisplayTreeNode: function (op, callback) {
        var self = this;
        var result = {};
        var selectedValues = op.selectedValues;

        if (selectedValues == null || BI.isEmpty(selectedValues)) {
            callback({});
            return;
        }

        doCheck([], this.tree.getRoot(), selectedValues);

        callback({
            items: BI.values(result)
        });

        function doCheck(parentValues, node, selected) {
            BI.each(selected, function (idx, path) {
                BI.each(path, function (id, value) {
                    var nodeValue = value;
                    var node = self._getTreeNode(path.slice(0, id), nodeValue);
                    // 找不到就是新增值
                    if (BI.isNull(node)) {
                        createOneJson({
                            id: BI.UUID(),
                            text: nodeValue,
                            value: nodeValue,
                            isLeaf: true
                        }, BI.UUID());
                    } else {
                        if(!BI.has(result, node.id)) {
                            createOneJson(node, node.parent && node.parent.id);
                        }
                        result[node.id].isLeaf !== true && (result[node.id].isLeaf = id === path.length - 1);
                    }
                });
            });
        }

        function createOneJson(node, pId) {
            result[node.id] = {
                id: node.id,
                pId: pId,
                text: node.text,
                value: node.value,
                open: true,
                isLeaf: node.isLeaf
            };
        }
    },

    _reqInitTreeNode: function (op, callback) {
        var self = this;
        var result = [];
        var keyword = op.keyword || "";
        var selectedValues = op.selectedValues;
        var lastSearchValue = op.lastSearchValue || ""; // 一次请求100个，但是搜索是拿全部的，lastSearchValue是上一次遍历到的节点索引
        var output = search();
        BI.nextTick(function () {
            callback({
                hasNext: output.length > self._const.perPage,
                items: result,
                lastSearchValue: BI.last(output)
            });
        });

        function search() {
            var children = self._getChildren([]);
            var start = children.length;
            if (lastSearchValue !== "") {
                for (var j = 0, len = start; j < len; j++) {
                    if (children[j].value === lastSearchValue) {
                        start = j + 1;
                        break;
                    }
                }
            } else {
                start = 0;
            }
            var output = [];
            for (var i = start, len = children.length; i < len; i++) {
                if (output.length < self._const.perPage) {
                    var find = nodeSearch(1, [], children[i].value, result);
                } else if (output.length === self._const.perPage) {
                    var find = nodeSearch(1, [], children[i].value, []);
                }
                if (find[0] === true) {
                    output.push(children[i].value);
                }
                if (output.length > self._const.perPage) {
                    break;
                }
            }

            // 深层嵌套的比较麻烦，这边先实现的是在根节点添加
            if (op.times === 1) {
                var nodes = self._getAddedValueNode([], selectedValues);
                result = BI.concat(BI.filter(nodes, function (idx, node) {
                    var find = BI.Func.getSearchResult([node.text || node.value], keyword);
                    return find.find.length > 0 || find.match.length > 0;
                }), result);
            }
            return output;
        }

        function nodeSearch(deep, parentValues, current, result) {
            if (self._isMatch(parentValues, current, keyword)) {
                var checked = isSelected(parentValues, current);
                createOneJson(parentValues, current, false, checked, true, result);
                return [true, checked];
            }
            var newParents = BI.clone(parentValues);
            newParents.push(current);
            var children = self._getChildren(newParents);

            var can = false, checked = false;

            BI.each(children, function (i, child) {
                var state = nodeSearch(deep + 1, newParents, child.value, result);
                if (state[1] === true) {
                    checked = true;
                }
                if (state[0] === true) {
                    can = true;
                }
            });
            if (can === true) {
                checked = isSelected(parentValues, current);
                createOneJson(parentValues, current, true, checked, false, result);
            }
            return [can, checked];
        }

        function createOneJson(parentValues, value, isOpen, checked, flag, result) {
            var node = self._getTreeNode(parentValues, value);
            result.push({
                id: node.id,
                pId: node.pId,
                text: node.text,
                value: node.value,
                title: node.title,
                isParent: node.getChildrenLength() > 0,
                open: isOpen,
                checked: checked,
                halfCheck: false,
                flag: flag,
                disabled: node.disabled
            });
        }

        function isHalf(parentValues, value) {
            var find = findSelectedObj(parentValues);
            if (find == null) {
                return null;
            }
            return BI.any(find, function (v, ob) {
                if (v === value) {
                    if (ob != null && !BI.isEmpty(ob)) {
                        return true;
                    }
                }
            });
        }

        function isAllSelected(parentValues, value) {
            var find = findSelectedObj(parentValues);
            if (find == null) {
                return null;
            }
            return BI.any(find, function (v, ob) {
                if (v === value) {
                    if (ob != null && BI.isEmpty(ob)) {
                        return true;
                    }
                }
            });
        }

        function isSelected(parentValues, value) {
            return BI.any(selectedValues, function (idx, array) {
                return BI.isEqual(parentValues, array.slice(0, parentValues.length)) && BI.last(array) === value;
            });
        }

        function findSelectedObj(parentValues) {
            var find = selectedValues;
            if (find == null) {
                return null;
            }
            BI.every(parentValues, function (i, v) {
                find = find[v];
                if (find == null) {
                    return false;
                }
                return true;
            });
            return find;
        }
    },

    _reqTreeNode: function (op, callback) {
        var self = this, o = this.options;
        var result = [];
        var times = op.times;
        var parentValues = op.parentValues || [];
        var selectedValues = op.selectedValues || [];
        var valueMap = dealWithSelectedValue(parentValues, selectedValues);
        var nodes = this._getChildren(parentValues);
        for (var i = (times - 1) * this._const.perPage; nodes[i] && i < times * this._const.perPage; i++) {
            var checked = BI.has(valueMap, nodes[i].value);
            result.push({
                id: nodes[i].id,
                pId: nodes[i].pId,
                value: nodes[i].value,
                text: nodes[i].text,
                times: 1,
                isParent: nodes[i].getChildrenLength() > 0,
                checked: checked,
                halfCheck: false,
                open: o.open,
                disabled: nodes[i].disabled
            });
        }
        // 如果指定节点全部打开
        if (o.open) {
            var allNodes = [];
            // 获取所有节点
            BI.each(nodes, function (idx, node) {
                allNodes = BI.concat(allNodes, self._getAllChildren(parentValues.concat([node.value])));
            });
            BI.each(allNodes, function (idx, node) {
                var valueMap = dealWithSelectedValue(node.parentValues, selectedValues);
                var checked = BI.has(valueMap, node.value);
                result.push({
                    id: node.id,
                    pId: node.pId,
                    value: node.value,
                    text: node.text,
                    times: 1,
                    isParent: node.getChildrenLength() > 0,
                    checked: checked,
                    halfCheck: false,
                    open: o.open,
                    disabled: node.disabled
                });
            });
        }
        // 深层嵌套的比较麻烦，这边先实现的是在根节点添加
        if (parentValues.length === 0 && times === 1) {
            result = BI.concat(self._getAddedValueNode(parentValues, selectedValues), result);
        }
        BI.nextTick(function () {
            callback({
                items: result,
                hasNext: nodes.length > times * self._const.perPage
            });
        });

        function dealWithSelectedValue(parentValues, selectedValues) {
            var valueMap = {};
            BI.each(selectedValues, function (idx, v) {
                if (BI.isEqual(parentValues, v.slice(0, parentValues.length))) {
                    valueMap[BI.last(v)] = [2, 0];
                }
            });
            return valueMap;
        }
    },

    _getAddedValueNode: function (parentValues, selectedValues) {
        var nodes = this._getChildren(parentValues);
        var values = BI.flatten(BI.filter(selectedValues, function (idx, array) {
            return array.length === 1;
        }));
        return BI.map(BI.difference(values, BI.map(nodes, "value")), function (idx, v) {
            return {
                id: BI.UUID(),
                pId: nodes.length > 0 ? nodes[0].pId : BI.UUID(),
                value: v,
                text: v,
                times: 1,
                isParent: false,
                checked: true,
                halfCheck: false
            };
        });
    }
});