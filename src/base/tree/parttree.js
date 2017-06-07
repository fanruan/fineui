/**
 * guy
 * 局部树，两个请求树， 第一个请求构造树，第二个请求获取节点
 * @class BI.PartTree
 * @extends BI.AsyncTree
 */
BI.PartTree = BI.inherit(BI.AsyncTree, {
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
            BI.AsyncTree.superclass._selectTreeNode.apply(self, arguments);
        } else {
            //如果选中的值中不存在该值不处理
            var t = this.options.paras.selectedValues;
            var p = parentValues.concat(name);
            for (var i = 0, len = p.length; i < len; i++) {
                t = t[p[i]];
                if (t == null) {
                    return;
                }
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
            o.paras.lastSearchValue = d.lastSearchValue;
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
            selectedValues: result
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
        delete o.paras.lastSearchValue;
        var setting = this._configSetting();
        this._initTree(setting, o.paras.keyword);
    }
});

BI.shortcut("bi.part_tree", BI.PartTree);