BI.AbstractTreeValueChooser = BI.inherit(BI.Widget, {

    _const: {
        perPage: 100
    },

    _defaultConfig: function () {
        return BI.extend(BI.AbstractTreeValueChooser.superclass._defaultConfig.apply(this, arguments), {
            items: null,
            itemsCreator: BI.emptyFn,
            open: false
        });
    },

    _valueFormatter: function (v) {
        var text = v;
        if (this.options.valueFormatter) {
            return this.options.valueFormatter(v);
        }
        if (BI.isNotNull(this.items)) {
            BI.some(this.items, function (i, item) {
                if (item.value === v || item.value + "" === v) {
                    text = item.text;
                    return true;
                }
            });
        }
        return text;
    },

    _initData: function (items) {
        this.items = items;
        var nodes = BI.Tree.treeFormat(items);
        this.tree = new BI.Tree();
        this.tree.initTree(nodes);
    },

    _itemsCreator: function (options, callback) {
        var self = this, o = this.options;
        if (!this.items) {
            o.itemsCreator({}, function (items) {
                self._initData(items);
                call();
            });
        } else {
            call();
        }

        function call() {
            switch (options.type) {
                case BI.TreeView.REQ_TYPE_INIT_DATA:
                    self._reqInitTreeNode(options, callback);
                    break;
                case BI.TreeView.REQ_TYPE_ADJUST_DATA:
                    self._reqAdjustTreeNode(options, callback);
                    break;
                case BI.TreeView.REQ_TYPE_SELECT_DATA:
                    self._reqSelectedTreeNode(options, callback);
                    break;
                case BI.TreeView.REQ_TYPE_GET_SELECTED_DATA:
                    self._reqDisplayTreeNode(options, callback);
                    break;
                default :
                    self._reqTreeNode(options, callback);
                    break;
            }
        }
    },

    _reqDisplayTreeNode: function (op, callback) {
        var self = this;
        var result = [];
        var selectedValues = op.selectedValues;

        if (selectedValues == null || BI.isEmpty(selectedValues)) {
            callback({});
            return;
        }

        doCheck([], this.tree.getRoot(), selectedValues);

        callback({
            items: result
        });

        function doCheck(parentValues, node, selected) {
            if (selected == null || BI.isEmpty(selected)) {
                BI.each(node.getChildren(), function (i, child) {
                    var newParents = BI.clone(parentValues);
                    newParents.push(child.value);
                    var llen = self._getChildCount(newParents);
                    createOneJson(child, node.id, llen);
                    doCheck(newParents, child, {});
                });
                return;
            }
            BI.each(selected, function (k) {
                var node = self._getTreeNode(parentValues, k);
                // 找不到就是新增值
                if(BI.isNull(node)) {
                    createOneJson({
                        id: BI.UUID(),
                        text: k,
                        value: k
                    }, BI.UUID(), 0);
                } else {
                    var newParents = BI.clone(parentValues);
                    newParents.push(node.value);
                    createOneJson(node, node.parent && node.parent.id, getCount(selected[k], newParents));
                    doCheck(newParents, node, selected[k]);
                }
            });
        }

        function getCount(jo, parentValues) {
            if (jo == null) {
                return 0;
            }
            if (BI.isEmpty(jo)) {
                return self._getChildCount(parentValues);
            }

            return BI.size(jo);
        }

        function createOneJson(node, pId, llen) {
            result.push({
                id: node.id,
                pId: pId,
                text: node.text + (llen > 0 ? ("(" + BI.i18nText("BI-Basic_Altogether") + llen + BI.i18nText("BI-Basic_Count") + ")") : ""),
                value: node.value,
                open: true,
                disabled: node.disabled
            });
        }
    },

    _reqSelectedTreeNode: function (op, callback) {
        var self = this;
        var selectedValues = BI.deepClone(op.selectedValues);
        var notSelectedValue = op.notSelectedValue || {};
        var keyword = op.keyword || "";
        var parentValues = op.parentValues || [];

        if (selectedValues == null || BI.isEmpty(selectedValues)) {
            callback({});
            return;
        }

        dealWithSelectedValues(selectedValues);
        callback(selectedValues);


        function dealWithSelectedValues(selectedValues) {
            var p = parentValues.concat(notSelectedValue);
            // 存储的值中存在这个值就把它删掉
            // 例如选中了中国-江苏-南京， 取消中国或江苏或南京
            // p长度不大于selectedValues的情况才可能找到，这样可以直接删除selectedValues的节点
            if (canFindKey(selectedValues, p)) {
                // 如果搜索的值在父亲链中
                if (isSearchValueInParent(p)) {
                    // 例如选中了 中国-江苏， 搜索江苏， 取消江苏(干掉了江苏)
                    self._deleteNode(selectedValues, p);
                } else {
                    var searched = [];
                    // 要找到所有以notSelectedValue为叶子节点的链路
                    var find = search(parentValues, notSelectedValue, [], searched);
                    if (find && BI.isNotEmptyArray(searched)) {
                        BI.each(searched, function (i, arr) {
                            var node = self._getNode(selectedValues, arr);
                            if (node) {
                                // 例如选中了 中国-江苏， 搜索江苏， 取消中国（实际上只想删除中国-江苏，因为搜的是江苏）
                                // 例如选中了 中国-江苏-南京，搜索南京，取消中国（实际上只想删除中国-江苏-南京，因为搜的是南京）
                                self._deleteNode(selectedValues, arr);
                            } else {
                                // 例如选中了 中国-江苏，搜索南京，取消中国（实际上只想删除中国-江苏-南京，因为搜的是南京）
                                expandSelectedValue(selectedValues, arr, BI.last(arr));
                            }
                        });
                    }
                }
            }

            // 存储的值中不存在这个值，但父亲节点是全选的情况
            // 例如选中了中国-江苏，取消南京
            // important 选中了中国-江苏，取消了江苏，但是搜索的是南京
            if (isChild(selectedValues, p)) {
                var result = [], find = false;
                // 如果parentValues中有匹配的值，说明搜索结果不在当前值下
                if (isSearchValueInParent(p)) {
                    find = true;
                } else {
                    // 从当前值开始搜
                    find = search(parentValues, notSelectedValue, result);
                    p = parentValues;
                }

                if (find === true) {
                    // 去掉点击的节点之后的结果集
                    expandSelectedValue(selectedValues, p, notSelectedValue);
                    // 添加去掉搜索的结果集
                    if (result.length > 0) {
                        BI.each(result, function (i, strs) {
                            self._buildTree(selectedValues, strs);
                        });
                    }
                }
            }

        }

        function expandSelectedValue(selectedValues, parents, notSelectedValue) {
            var next = selectedValues;
            var childrenCount = [];
            var path = [];
            // 去掉点击的节点之后的结果集
            BI.some(parents, function (i, v) {
                var t = next[v];
                if (t == null) {
                    if (i === 0) {
                        return true;
                    }
                    if (BI.isEmpty(next)) {
                        var split = parents.slice(0, i);
                        var expanded = self._getChildren(split);
                        path.push(split);
                        childrenCount.push(expanded.length);
                        // 如果只有一个值且取消的就是这个值
                        if (i === parents.length - 1 && expanded.length === 1 && expanded[0].value === notSelectedValue) {
                            for (var j = childrenCount.length - 1; j >= 0; j--) {
                                if (childrenCount[j] === 1) {
                                    self._deleteNode(selectedValues, path[j]);
                                } else {
                                    break;
                                }
                            }
                        } else {
                            BI.each(expanded, function (m, child) {
                                if (i === parents.length - 1 && child.value === notSelectedValue) {
                                    return true;
                                }
                                next[child.value] = {};
                            });
                        }
                        next = next[v];
                    } else {
                        return true;
                        // next = {};
                        // next[v] = {};
                    }
                } else {
                    next = t;
                }
            });
        }

        function search(parents, current, result, searched) {
            var newParents = BI.clone(parents);
            newParents.push(current);
            if (self._isMatch(parents, current, keyword)) {
                searched && searched.push(newParents);
                return true;
            }

            var children = self._getChildren(newParents);

            var notSearch = [];
            var can = false;

            BI.each(children, function (i, child) {
                if (search(newParents, child.value, result, searched)) {
                    can = true;
                } else {
                    notSearch.push(child.value);
                }
            });
            if (can === true) {
                BI.each(notSearch, function (i, v) {
                    var next = BI.clone(newParents);
                    next.push(v);
                    result.push(next);
                });
            }
            return can;
        }

        function isSearchValueInParent(parentValues) {
            for (var i = 0, len = parentValues.length; i < len; i++) {
                if (self._isMatch(parentValues.slice(0, i), parentValues[i], keyword)) {
                    return true;
                }
            }
            return false;
        }

        function canFindKey(selectedValues, parents) {
            var t = selectedValues;
            for (var i = 0; i < parents.length; i++) {
                var v = parents[i];
                t = t[v];
                if (t == null) {
                    return false;
                }
            }
            return true;
        }

        function isChild(selectedValues, parents) {
            var t = selectedValues;
            for (var i = 0; i < parents.length; i++) {
                var v = parents[i];
                if (!BI.has(t, v)) {
                    return false;
                }
                t = t[v];
                if (BI.isEmpty(t)) {
                    return true;
                }
            }
            return false;
        }
    },

    _reqAdjustTreeNode: function (op, callback) {
        var self = this;
        var result = [];
        var selectedValues = op.selectedValues;
        if (selectedValues == null || BI.isEmpty(selectedValues)) {
            callback({});
            return;
        }
        BI.each(selectedValues, function (k, v) {
            result.push([k]);
        });

        dealWithSelectedValues(selectedValues, []);

        var jo = {};
        BI.each(result, function (i, strs) {
            self._buildTree(jo, strs);
        });
        callback(jo);

        function dealWithSelectedValues(selected, parents) {
            if (selected == null || BI.isEmpty(selected)) {
                return true;
            }
            var can = true;
            BI.each(selected, function (k, v) {
                var p = BI.clone(parents);
                p.push(k);
                if (!dealWithSelectedValues(selected[k], p)) {
                    BI.each(selected[k], function (nk, nv) {
                        var t = BI.clone(p);
                        t.push(nk);
                        result.push(t);
                    });
                    can = false;
                }
            });
            return can && isAllSelected(selected, parents);
        }

        function isAllSelected(selected, parents) {
            return BI.isEmpty(selected) || self._getChildCount(parents) === BI.size(selected);
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
                    var find = nodeSearch(1, [], children[i].value, false, result);
                } else if (output.length === self._const.perPage) {
                    var find = nodeSearch(1, [], children[i].value, false, []);
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

        function nodeSearch(deep, parentValues, current, isAllSelect, result) {
            if (self._isMatch(parentValues, current, keyword)) {
                var checked = isAllSelect || isSelected(parentValues, current);
                createOneJson(parentValues, current, false, checked, !isAllSelect && isHalf(parentValues, current), true, result);
                return [true, checked];
            }
            var newParents = BI.clone(parentValues);
            newParents.push(current);
            var children = self._getChildren(newParents);

            var can = false, checked = false;

            var isCurAllSelected = isAllSelect || isAllSelected(parentValues, current);
            BI.each(children, function (i, child) {
                var state = nodeSearch(deep + 1, newParents, child.value, isCurAllSelected, result);
                // 当前节点的子节点是否选中，并不确定全选还是半选
                if (state[1] === true) {
                    checked = true;
                }
                // 当前节点的子节点要不要加入到结果集中
                if (state[0] === true) {
                    can = true;
                }
            });
            // 子节点匹配, 补充父节点
            if (can === true) {
                checked = isCurAllSelected || (isSelected(parentValues, current) && checked);
                createOneJson(parentValues, current, true, checked, false, false, result);
            }
            return [can, checked];
        }

        function createOneJson(parentValues, value, isOpen, checked, half, flag, result) {
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
                halfCheck: half,
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
            var find = findSelectedObj(parentValues);
            if (find == null) {
                return false;
            }
            return BI.any(find, function (v) {
                if (v === value) {
                    return true;
                }
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
        var checkState = op.checkState || {};
        var parentValues = op.parentValues || [];
        var selectedValues = op.selectedValues || {};
        var valueMap = {};
        // if (judgeState(parentValues, selectedValues, checkState)) {
        valueMap = dealWithSelectedValue(parentValues, selectedValues);
        // }
        var nodes = this._getChildren(parentValues);
        for (var i = (times - 1) * this._const.perPage; nodes[i] && i < times * this._const.perPage; i++) {
            var state = getCheckState(nodes[i].value, parentValues, valueMap, checkState);
            result.push({
                id: nodes[i].id,
                pId: nodes[i].pId,
                value: nodes[i].value,
                text: nodes[i].text,
                times: 1,
                isParent: nodes[i].getChildrenLength() > 0,
                checked: state[0],
                halfCheck: state[1],
                open: o.open,
                disabled: nodes[i].disabled,
                title: nodes[i].title || nodes[i].text,
                warningTitle: nodes[i].warningTitle,
            });
        }
        // 如果指定节点全部打开
        if (o.open) {
            var allNodes = [];
            // 获取所有节点
            BI.each(nodes, function (idx, node) {
                allNodes = BI.concat(allNodes, self._getAllChildren(parentValues.concat([node.value])));
            });
            var lastFind;
            BI.each(allNodes, function (idx, node) {
                var valueMap = dealWithSelectedValue(node.parentValues, selectedValues);
                // REPORT-24409 fix: 设置节点全部展开，添加的节点没有给状态
                var parentCheckState = {};
                var find = BI.find(result, function (idx, pNode) {
                    return pNode.id === node.pId;
                });
                if (find) {
                    parentCheckState.checked = find.halfCheck ? false : find.checked;
                    parentCheckState.half = find.halfCheck;
                    // 默认展开也需要重置父节点的halfCheck
                    if (BI.isNotNull(lastFind) && (lastFind !== find || allNodes.length - 1 === idx)) {
                        lastFind.half = lastFind.halfCheck;
                        lastFind.halfCheck = false;
                    }
                }
                lastFind = find;
                var state = getCheckState(node.value, node.parentValues, valueMap, parentCheckState);
                result.push({
                    id: node.id,
                    pId: node.pId,
                    value: node.value,
                    text: node.text,
                    times: 1,
                    isParent: node.getChildrenLength() > 0,
                    checked: state[0],
                    halfCheck: state[1],
                    open: self.options.open,
                    disabled: node.disabled,
                    title: node.title || node.text,
                    warningTitle: node.warningTitle,
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

        function judgeState(parentValues, selected_value, checkState) {
            var checked = checkState.checked, half = checkState.half;
            if (parentValues.length > 0 && !checked) {
                return false;
            }
            return (parentValues.length === 0 || (checked && half) && !BI.isEmpty(selected_value));
        }

        function dealWithSelectedValue(parentValues, selectedValues) {
            var valueMap = {}, parents = (parentValues || []).slice(0);
            BI.each(parentValues, function (i, v) {
                parents.push(v);

                selectedValues = selectedValues[v] || {};
            });
            BI.each(selectedValues, function (value, obj) {
                var currentParents = BI.concat(parents, value);

                if (BI.isNull(obj)) {
                    valueMap[value] = [0, 0];
                    return;
                }
                if (BI.isEmpty(obj)) {
                    valueMap[value] = [2, 0];
                    return;
                }
                var nextNames = {};
                BI.each(obj, function (t, o) {
                    if (BI.isNull(o) || BI.isEmpty(o)) {
                        nextNames[t] = true;
                    } else {
                        isAllSelected(o, BI.concat(currentParents, [t])) && (nextNames[t] = true);
                    }
                });
                // valueMap的数组第一个参数为不选: 0, 半选: 1, 全选：2， 第二个参数为改节点下选中的子节点个数(子节点全选或者不存在)
                valueMap[value] = [1, BI.size(nextNames)];
            });
            return valueMap;
        }

        function isAllSelected(selected, parents) {
            if (BI.isEmpty(selected)) {
                return true;
            }

            if (self._getChildCount(parents) !== BI.size(selected)) {
                return false;
            }

            return BI.every(selected, function (value) {
               return isAllSelected(selected[value], BI.concat(parents, value));
            });
        }

        function getCheckState(current, parentValues, valueMap, checkState) {
            // 节点本身的checked和half优先级最高
            var checked = checkState.checked, half = checkState.half;
            var tempCheck = false, halfCheck = false;
            if (BI.has(valueMap, current)) {
                // 可能是半选
                if (valueMap[current][0] === 1) {
                    var values = BI.clone(parentValues);
                    values.push(current);
                    var childCount = self._getChildCount(values);
                    if (childCount > 0 && childCount !== valueMap[current][1]) {
                        halfCheck = true;
                    }
                } else if (valueMap[current][0] === 2) {
                    tempCheck = true;
                }
            }
            var check;
            // 展开的节点checked为false 且没有明确得出当前子节点是半选或者全选, 则check状态取决于valueMap
            if (!checked && !halfCheck && !tempCheck) {
                check = BI.has(valueMap, current);
            } else {
                // 不是上面那种情况就先看在节点没有带有明确半选的时候，通过节点自身的checked和valueMap的状态能都得到选中信息
                check = ((tempCheck || checked) && !half) || BI.has(valueMap, current);
            }
            return [check, halfCheck];
        }
    },

    _getAddedValueNode: function (parentValues, selectedValues) {
        var nodes = this._getChildren(parentValues);
        return BI.map(BI.difference(BI.keys(selectedValues), BI.map(nodes, "value")), function (idx, v) {
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
    },

    _getNode: function (selectedValues, parentValues) {
        var pNode = selectedValues;
        for (var i = 0, len = parentValues.length; i < len; i++) {
            if (pNode == null) {
                return null;
            }
            pNode = pNode[parentValues[i]];
        }
        return pNode;
    },

    _deleteNode: function (selectedValues, values) {
        var name = values[values.length - 1];
        var p = values.slice(0, values.length - 1);
        var pNode = this._getNode(selectedValues, p);
        if (pNode != null && pNode[name]) {
            delete pNode[name];
            // 递归删掉空父节点
            while (p.length > 0 && BI.isEmpty(pNode)) {
                name = p[p.length - 1];
                p = p.slice(0, p.length - 1);
                pNode = this._getNode(selectedValues, p);
                if (pNode != null) {
                    delete pNode[name];
                }
            }
        }
    },

    _buildTree: function (jo, values) {
        var t = jo;
        BI.each(values, function (i, v) {
            if (!BI.has(t, v)) {
                t[v] = {};
            }
            t = t[v];
        });
    },

    _isMatch: function (parentValues, value, keyword) {
        var o = this.options;
        var node = this._getTreeNode(parentValues, value);
        if (!node) {
            return false;
        }
        var find = BI.Func.getSearchResult([node.text || node.value], keyword);
        if(o.allowSearchValue && node.value) {
            var valueFind = BI.Func.getSearchResult([node.value], keyword);
            return valueFind.find.length > 0 || valueFind.match.length > 0 ||
                find.find.length > 0 || find.match.length > 0;
        }
        return find.find.length > 0 || find.match.length > 0;
    },

    _getTreeNode: function (parentValues, v) {
        var self = this;
        var findParentNode;
        var index = 0;
        var currentParent = this.tree.getRoot();
        this.tree.traverse(function (node) {
            if (self.tree.isRoot(node)) {
                return;
            }
            if (index > parentValues.length) {
                return false;
            }

            /**
             * 一个树结构。要找root_1_3的子节点
             * {root: { 1: {1: {}, 2: {}, 3: {}}, 3: {1: {}, 2: {}} } }
             * 当遍历到root_1节点时，index++，而下一个节点root_3时，符合下面的if逻辑，这样找到的节点就是root_3节点了，需要加步判断是否是root_1的子节点
             */
            if (index === parentValues.length && node.value === v) {
                if (node.getParent() !== currentParent) {
                    return;
                }

                findParentNode = node;

                return false;
            }
            if (node.value === parentValues[index] && node.getParent() === currentParent) {
                index++;
                currentParent = node;

                return;
            }

            return true;
        });

        return findParentNode;
    },

    _getChildren: function (parentValues) {
        if (parentValues.length > 0) {
            var value = BI.last(parentValues);
            var parent = this._getTreeNode(parentValues.slice(0, parentValues.length - 1), value);
        } else {
            var parent = this.tree.getRoot();
        }

        return parent ? parent.getChildren() : [];
    },

    _getAllChildren: function(parentValues) {
        var children = this._getChildren(parentValues);
        var nodes = [].concat(children);
        BI.each(nodes, function (idx, node) {
            node.parentValues = parentValues;
        });
        var queue = BI.map(children, function (idx, node) {
            return {
                parentValues: parentValues,
                value: node.value
            };
        });
        while (BI.isNotEmptyArray(queue)) {
            var node = queue.shift();
            var pValues = (node.parentValues).concat(node.value);
            var childNodes = this._getChildren(pValues);
            BI.each(childNodes, function (idx, node) {
                node.parentValues = pValues;
            });
            queue = queue.concat(childNodes);
            nodes = nodes.concat(childNodes);
        }
        return nodes;
    },

    _getChildCount: function (parentValues) {
        return this._getChildren(parentValues).length;
    },

    buildCompleteTree: function (selectedValues) {
        var self = this;
        var result = {};

        if (selectedValues !== null && !BI.isEmpty(selectedValues)) {
            fill([], this.tree.getRoot(), selectedValues, result);
        }

        return result;

        function fill(parentValues, node, selected, r) {
            if (selected === null || BI.isEmpty(selected)) {
                BI.each(node.getChildren(), function (i, child) {
                    var newParents = BI.clone(parentValues);
                    newParents.push(child.value);
                    r[child.value] = {};
                    fill(newParents, child, null, r[child.value]);
                });
                return;
            }
            BI.each(selected, function (k) {
                var node = self._getTreeNode(parentValues, k);
                var newParents = BI.clone(parentValues);
                newParents.push(node.value);
                r[k] = {};
                fill(newParents, node, selected[k], r[k]);
            });
        }
    },
});
