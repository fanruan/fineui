/**
 * guy
 * 局部树，两个请求树， 第一个请求构造树，第二个请求获取节点
 * @class BI.PartTree
 * @extends BI.AsyncTree
 */
BI.PartTree = BI.inherit(BI.AsyncTree, {
    _defaultConfig: function () {
        return BI.extend(BI.PartTree.superclass._defaultConfig.apply(this, arguments), {});
    },

    _loadMore: function () {
        var self = this, o = this.options;
        var op = BI.extend({}, o.paras, {
            type: BI.TreeView.REQ_TYPE_INIT_DATA,
            times: ++this.times
        });
        this.tip.setLoading();
        o.itemsCreator(op, function (d) {
            var hasNext = !!d.hasNext, nodes = d.items || [];
            o.paras.lastSearchValue = d.lastSearchValue;
            if (self._stop === true) {
                return;
            }
            if (!hasNext) {
                self.tip.setEnd();
            } else {
                self.tip.setLoaded();
            }
            if (nodes.length > 0) {
                self.nodes.addNodes(null, self._dealWidthNodes(nodes));
            }
        });
    },

    _selectTreeNode: function (treeId, treeNode) {
        var self = this, o = this.options;
        var parentValues = BI.deepClone(treeNode.parentValues || self._getParentValues(treeNode));
        var name = this._getNodeValue(treeNode);
        if (treeNode.checked === true) {
            this.options.paras.selectedValues = this._getUnionValue();
            // this._buildTree(self.options.paras.selectedValues, BI.concat(parentValues, name));
            o.itemsCreator(BI.extend({}, o.paras, {
                type: BI.TreeView.REQ_TYPE_ADJUST_DATA,
                curSelectedValue: name,
                parentValues: parentValues
            }), function (res) {
                self.options.paras.selectedValues = res;
                BI.AsyncTree.superclass._selectTreeNode.apply(self, arguments);
            });
        } else {
            // 如果选中的值中不存在该值不处理
            // 因为反正是不选中，没必要管
            var t = this.options.paras.selectedValues;
            var p = parentValues.concat(name);
            for (var i = 0, len = p.length; i < len; i++) {
                t = t[p[i]];
                if (t == null) {
                    return;
                }
                // 选中中国-江苏, 搜索南京，取消勾选
                if (BI.isEmpty(t)) {
                    break;
                }
            }
            o.itemsCreator(BI.extend({}, o.paras, {
                type: BI.TreeView.REQ_TYPE_SELECT_DATA,
                notSelectedValue: name,
                parentValues: parentValues
            }), function (new_values) {
                self.options.paras.selectedValues = new_values;
                BI.AsyncTree.superclass._selectTreeNode.apply(self, arguments);
            });
        }
    },

    _getSelectedValues: function () {
        var self = this;
        var hashMap = {};
        var rootNoots = this.nodes.getNodes();
        track(rootNoots);

        function track (nodes) {
            BI.each(nodes, function (i, node) {
                var checkState = node.getCheckStatus();
                if (checkState.checked === false) {
                    return true;
                }
                var parentValues = node.parentValues || self._getParentValues(node);
                // 把文字中的html去掉，其实就是把文字颜色去掉
                var values = parentValues.concat([self._getNodeValue(node)]);
                self._buildTree(hashMap, values);
                //                if(checkState.checked === true && checkState.half === false && nodes[i].flag === true){
                //                    continue;
                //                }
                if (BI.isNotEmptyArray(node.children)) {
                    track(node.children);
                    return true;
                }
                if (checkState.half === true) {
                    self._getHalfSelectedValues(hashMap, node);
                }
            });
        }

        return hashMap;
    },

    _initTree: function (setting, keyword) {
        var self = this, o = this.options;
        this.times = 1;
        var tree = this.tree;
        tree.empty();
        self.tip.setVisible(false);
        this.loading();
        var op = BI.extend({}, o.paras, {
            type: BI.TreeView.REQ_TYPE_INIT_DATA,
            times: this.times
        });
        var complete = function (d) {
            if (self._stop === true || keyword != o.paras.keyword) {
                return;
            }
            var hasNext = !!d.hasNext, nodes = d.items || [];
            o.paras.lastSearchValue = d.lastSearchValue;
            // 没有请求到数据也要初始化空树, 如果不初始化, 树就是上一次构造的树, 节点信息都是过期的
            callback(nodes.length > 0 ? self._dealWidthNodes(nodes) : []);
            self.setTipVisible(nodes.length <= 0);
            self.loaded();
            if (!hasNext) {
                self.tip.invisible();
            } else {
                self.tip.setLoaded();
            }
            self.fireEvent(BI.Events.AFTERINIT);
        };

        function callback (nodes) {
            if (self._stop === true) {
                return;
            }
            self.nodes = BI.$.fn.zTree.init(tree.element, setting, nodes);
        }

        BI.delay(function () {
            o.itemsCreator(op, complete);
        }, 100);
    },

    getValue: function () {
        return BI.deepClone(this.options.paras.selectedValues || {});
    },

    _getUnionValue: function () {
        if (!this.nodes) {
            return {};
        }
        var checkedValues = this._getSelectedValues();
        if (BI.isEmpty(checkedValues)) {
            return BI.deepClone(this.options.paras.selectedValues);
        }
        if (BI.isEmpty(this.options.paras.selectedValues)) {
            return checkedValues;
        }
        return this._union(checkedValues, this.options.paras.selectedValues);
    },

    _union: function (valueA, valueB) {
        var self = this;
        var map = {};
        track([], valueA, valueB);
        track([], valueB, valueA);

        function track (parent, node, compare) {
            BI.each(node, function (n, item) {
                if (BI.isNull(compare[n])) {
                    self._addTreeNode(map, parent, n, item);
                } else if (BI.isEmpty(compare[n])) {
                    self._addTreeNode(map, parent, n, {});
                } else {
                    track(parent.concat([n]), node[n], compare[n]);
                }
            });
        }

        return map;
    },

    // 生成树方法
    stroke: function (config) {
        var o = this.options;
        delete o.paras.keyword;
        BI.extend(o.paras, config);
        delete o.paras.lastSearchValue;
        var setting = this._configSetting();
        this._initTree(setting, o.paras.keyword);
    }
});

BI.shortcut("bi.part_tree", BI.PartTree);
