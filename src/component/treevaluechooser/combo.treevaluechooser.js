/**
 * 简单的复选下拉树控件, 适用于数据量少的情况
 *
 * Created by GUY on 2015/10/29.
 * @class BI.TreeValueChooserCombo
 * @extends BI.Widget
 */
BI.TreeValueChooserCombo = BI.inherit(BI.Widget, {

    _const: {
        perPage: 10
    },

    _defaultConfig: function () {
        return BI.extend(BI.TreeValueChooserCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-tree-value-chooser-combo",
            width: 200,
            height: 30,
            items: null,
            itemsCreator: BI.emptyFn
        });
    },

    _init: function () {
        BI.TreeValueChooserCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        if (BI.isNotNull(o.items)) {
            this._initData(o.items);
        }
        this.combo = BI.createWidget({
            type: 'bi.multi_tree_combo',
            element: this,
            itemsCreator: BI.bind(this._itemsCreator, this),
            width: o.width,
            height: o.height
        });

        this.combo.on(BI.MultiTreeCombo.EVENT_CONFIRM, function () {
            self.fireEvent(BI.TreeValueChooserCombo.EVENT_CONFIRM);
        });
    },

    _initData: function (items) {
        this.items = items;
        var nodes = BI.Tree.transformToTreeFormat(items);
        this.tree = new BI.Tree();
        this.tree.initTree(nodes);
        this._initMap();
        this._initFloors();
    },

    _initMap: function () {
        var map = this.map = {};
        BI.each(this.items, function (i, item) {
            map[item.value] = item;
        });
    },

    _initFloors: function () {
        this.floors = -1;
        var root = this.tree.getRoot();
        while (root) {
            this.floors++;
            root = root.getChildren()[0];
        }
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

        doCheck(0, [], selectedValues);

        callback({
            items: result
        });

        function doCheck(floor, parentValues, selected) {
            if (floor >= self.floors) {
                return;
            }
            if (selected == null || BI.isEmpty(selected)) {
                var children = self._getChildren(parentValues);
                BI.each(children, function (i, child) {
                    var newParents = BI.clone(parentValues);
                    newParents.push(child.value);
                    var llen = self._getChildCount(newParents);
                    createOneJson(child, llen);
                    doCheck(floor + 1, newParents, {});
                });
                return;
            }
            BI.each(selected, function (k) {
                var node = self._getNode(k);
                var newParents = BI.clone(parentValues);
                newParents.push(node.value);
                createOneJson(node, getCount(selected[k], newParents));
                doCheck(floor + 1, newParents, selected[k]);
            })
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

        function createOneJson(node, llen) {
            result.push({
                id: node.id,
                pId: node.pId,
                text: node.text + (llen > 0 ? ("(" + BI.i18nText("BI-Basic_Altogether") + llen + BI.i18nText("BI-Basic_Count") + ")") : ""),
                value: node.value,
                open: true
            });
        }
    },

    _reqSelectedTreeNode: function (op, callback) {
        var self = this;
        var selectedValues = op.selectedValues;
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
            var p = BI.clone(parentValues);
            p.push(notSelectedValue);

            if (isChild(selectedValues, p)) {
                var result = [];
                var finded = search(parentValues.length + 1, parentValues, notSelectedValue, result);

                if (finded === true) {
                    var next = selectedValues;
                    BI.each(p, function (i, v) {
                        var t = next[v];
                        if (t == null) {
                            if (BI.isEmpty(next)) {
                                var split = p.slice(0, i);
                                var expanded = self._getChildren(split);
                                BI.each(expanded, function (m, child) {
                                    if (i === p.length - 1 && child.value === notSelectedValue) {
                                        return true;
                                    }
                                    next[child.value] = {};
                                });
                                next = next[v];
                            } else {
                                next = {};
                                next[v] = {};
                            }
                        } else {
                            next = t;
                        }
                    });

                    if (result.length > 0) {
                        BI.each(result, function (i, strs) {
                            self._buildTree(selectedValues, strs);
                        })
                    }
                }
            }

        }

        function search(deep, parents, current, result) {
            var newParents = BI.clone(parents);
            newParents.push(current);
            if (self._isMatch(current, keyword)) {
                return true;
            }
            if (deep >= self.floors) {
                return false;
            }

            var children = self._getChildren(newParents);

            var notSearch = [];
            var can = false;

            BI.each(children, function (i, child) {
                if (search(deep + 1, newParents, child.value, result)) {
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

        function isChild(selectedValues, parents) {
            var t = selectedValues;
            for (var i = 0; i < parents.length; i++) {
                var v = parents[i];
                if (!BI.has(t, v)) {
                    return false;
                }
                t = t[v];
                if (t == null || BI.isEmpty(t)) {
                    return true;
                }
            }
            return true;
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
        var lastSearchValue = op.lastSearchValue || "";
        var output = search();
        BI.nextTick(function () {
            callback({
                hasNext: output.length > self._const.perPage,
                items: result,
                lastSearchValue: BI.last(output)
            })
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
            return output;
        }

        function nodeSearch(deep, parentValues, current, isAllSelect, result) {
            if (self._isMatch(current, keyword)) {
                var checked = isAllSelect || isSelected(parentValues, current);
                createOneJson(parentValues, current, false, checked, !isAllSelect && isHalf(parentValues, current), true, result);
                return [true, checked];
            }
            if (deep >= self.floors) {
                return [false, false];
            }
            var newParents = BI.clone(parentValues);
            newParents.push(current);
            var children = self._getChildren(newParents);

            var can = false, checked = false;

            var isCurAllSelected = isAllSelect || isAllSelected(parentValues, current);
            BI.each(children, function (i, child) {
                var state = nodeSearch(deep + 1, newParents, child.value, isCurAllSelected, result);
                if (state[1] === true) {
                    checked = true;
                }
                if (state[0] === true) {
                    can = true;
                }
            });
            if (can === true) {
                checked = isCurAllSelected || (isSelected(parentValues, current) && checked);
                createOneJson(parentValues, current, true, checked, false, false, result);
            }
            return [can, checked];
        }

        function createOneJson(parentValues, value, isOpen, checked, half, flag, result) {
            var node = self.map[value];
            result.push({
                id: node.id,
                pId: node.pId,
                text: node.text,
                value: node.value,
                title: node.title,
                isParent: parentValues.length + 1 < self.floors,
                open: isOpen,
                checked: checked,
                halfCheck: half,
                flag: flag
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
        var self = this;
        var result = [];
        var times = op.times;
        var checkState = op.checkState || {};
        var parentValues = op.parentValues || [];
        var selectedValues = op.selectedValues;
        var valueMap = {};
        if (judgeState(parentValues, selectedValues, checkState)) {
            valueMap = dealWidthSelectedValue(parentValues, selectedValues);
        }
        var nodes = this._getChildren(parentValues);
        for (var i = (times - 1) * this._const.perPage; nodes[i] && i < times * this._const.perPage; i++) {
            var state = getCheckState(nodes[i].value, parentValues, valueMap, checkState);
            result.push({
                id: nodes[i].id,
                pId: nodes[i].pId,
                value: nodes[i].value,
                text: nodes[i].text,
                times: 1,
                isParent: parentValues.length + 1 < this.floors,
                checked: state[0],
                halfCheck: state[1]
            })
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

        function dealWidthSelectedValue(parentValues, selectedValues) {
            var valueMap = {};
            BI.each(parentValues, function (i, v) {
                selectedValues = selectedValues[v];
            });
            BI.each(selectedValues, function (value, obj) {
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
                    }
                });
                valueMap[value] = [1, BI.size(nextNames)];
            });
            return valueMap;
        }

        function getCheckState(current, parentValues, valueMap, checkState) {
            var checked = checkState.checked, half = checkState.half;
            var hasChild = parentValues.length + 1 < self.floors;
            var tempCheck = false, halfCheck = false;
            if (BI.has(valueMap, current)) {
                //可能是半选
                if (valueMap[current][0] === 1) {
                    var values = BI.clone(parentValues);
                    values.push(current);
                    if (hasChild && self._getChildCount(values) != valueMap[current][1]) {
                        halfCheck = true;
                    }
                } else if (valueMap[current][0] === 2) {
                    tempCheck = true;
                }
            }
            var check;
            if (!checked && !halfCheck && !tempCheck) {
                check = BI.has(valueMap, current);
            } else {
                check = ((tempCheck || checked) && !half) || BI.has(valueMap, current);
            }
            return [check, halfCheck];
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

    _isMatch: function (value, keyword) {
        var finded = BI.Func.getSearchResult([value], keyword);
        return finded.finded.length > 0 || finded.matched.length > 0;
    },

    _getNode: function (v) {
        return this.tree.search(v, "value");
    },

    _getChildren: function (parentValues) {
        if (parentValues.length > 0) {
            var value = BI.last(parentValues);
            var parent = this.tree.search(value, "value");
        } else {
            var parent = this.tree.getRoot();
        }
        return parent.getChildren();
    },

    _getChildCount: function (parentValues) {
        return this._getChildren(parentValues).length;
    },

    setValue: function (v) {
        this.combo.setValue(v);
    },

    getValue: function () {
        return this.combo.getValue();
    },

    populate: function () {
        this.combo.populate.apply(this, arguments);
    }
});
BI.TreeValueChooserCombo.EVENT_CONFIRM = "TreeValueChooserCombo.EVENT_CONFIRM";
BI.shortcut('bi.tree_value_chooser_combo', BI.TreeValueChooserCombo);