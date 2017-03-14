/**
 * guy
 * 局部树，两个请求树， 第一个请求构造树，第二个请求获取节点
 * @class BI.PartTree
 * @extends BI.SyncTree
 */
BI.PartTree = BI.inherit(BI.SyncTree, {
    _defaultConfig: function () {
        return BI.extend(BI.PartTree.superclass._defaultConfig.apply(this, arguments), {})
    },

    _init: function () {
        BI.PartTree.superclass._init.apply(this, arguments);
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
            o.paras.last_search_value = d.last_search_value;
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
        var parent_values = BI.deepClone(treeNode.parentValues || self._getParentValues(treeNode));
        var name = this._getNodeValue(treeNode)
//        var values = parent_values.concat([name]);
        if (treeNode.checked === true) {
            BI.SyncTree.superclass._selectTreeNode.apply(self, arguments);
        } else {
            o.itemsCreator(BI.extend({}, o.paras, {
                type: BI.TreeView.REQ_TYPE_CALCULATE_SELECT_DATA,
                selected_values: this.selected_values,
                not_selected_value: name,
                parent_values: parent_values
            }), function (new_values) {
                if (BI.isEqual(self.selected_values, new_values)) {
                    var tNode = treeNode;
                    var pNode = self._getTree(new_values, parent_values);
                    if (pNode[name]) {
                        delete pNode[name];
                    }
                    while (tNode != null && BI.isEmpty(pNode)) {
                        parent_values = parent_values.slice(0, parent_values.length - 1);
                        tNode = tNode.getParentNode();
                        if (tNode != null) {
                            pNode = self._getTree(new_values, parent_values);
                            name = self._getNodeValue(tNode);
                            delete pNode[name];
                        }
                    }
                }
                self.selected_values = new_values;
                BI.SyncTree.superclass._selectTreeNode.apply(self, arguments);
            });
        }
    },

    _getSelectedValues: function () {
        var self = this;
        var hashMap = {};
        var rootNoots = this.nodes.getNodes();
        track(rootNoots);
        function track(nodes) {
            BI.each(nodes, function (i, node) {
                var checkState = node.getCheckStatus();
                if (checkState.checked === false) {
                    return true;
                }
                var parentValues = node.parentValues || self._getParentValues(node);
                //把文字中的html去掉，其实就是把文字颜色去掉
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
            })
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
            o.paras.last_search_value = d.last_search_value;
            if (nodes.length > 0) {
                callback(self._dealWidthNodes(nodes));
            }
            self.setTipVisible(nodes.length <= 0);
            self.loaded();
            if (!hasNext) {
                self.tip.invisible();
            } else {
                self.tip.setLoaded();
            }
            self.fireEvent(BI.Events.AFTERINIT);
        };

        function callback(nodes) {
            if (self._stop === true) {
                return;
            }
            self.nodes = $.fn.zTree.init(tree.element, setting, nodes);
        }

        BI.delay(function () {
            o.itemsCreator(op, complete);
        }, 100);
    },

    getValue: function () {
        var o = this.options;
        var result = BI.PartTree.superclass.getValue.apply(this, arguments);
        o.itemsCreator({
            type: BI.TreeView.REQ_TYPE_ADJUST_DATA,
            selected_values: result
        }, function (res) {
            result = res;
        });
        return result;
    },

    //生成树方法
    stroke: function (config) {
        var o = this.options;
        delete o.paras.keyword;
        BI.extend(o.paras, config);
        delete o.paras.last_search_value;
        //取消选中时使用
        this.selected_values = BI.deepClone(o.paras.selected_values) || {};
        //delete this.options.paras.selected_values;
        var setting = this._configSetting();
        this._initTree(setting, o.paras.keyword);
    }
});

$.shortcut("bi.part_tree", BI.PartTree);