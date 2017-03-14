/**
 * guy
 * 同步树
 * @class BI.SyncTree
 * @extends BI.TreeView
 */
BI.SyncTree = BI.inherit(BI.TreeView, {
    _defaultConfig: function () {
        return BI.extend(BI.SyncTree.superclass._defaultConfig.apply(this, arguments), {})
    },
    _init: function () {
        BI.SyncTree.superclass._init.apply(this, arguments);
    },

    //配置属性
    _configSetting: function () {
        var paras = this.options.paras;
        var self = this;
        var setting = {
            async: {
                enable: false,
                otherParam: BI.cjkEncodeDO(paras)
            },
            check: {
                enable: true
            },
            data: {
                key: {
                    title: "title",
                    name: "text"
                },
                simpleData: {
                    enable: true
                }
            },
            view: {
                showIcon: false,
                expandSpeed: "",
                nameIsHTML: true,
                dblClickExpand: false
            },
            callback: {
                beforeCheck: beforeCheck,
                onCheck: onCheck,
                beforeExpand: beforeExpand,
                onExpand: onExpand,
                onCollapse: onCollapse,
                onClick: onClick
            }
        };

        function onClick(event, treeId, treeNode) {
            var zTree = $.fn.zTree.getZTreeObj(treeId);
            zTree.checkNode(treeNode, !treeNode.checked, true, true);
        }

        function beforeCheck(treeId, treeNode) {
            treeNode.halfCheck = false;
            if (treeNode.checked === true) {
                //将展开的节点halfCheck设为false，解决展开节点存在halfCheck=true的情况 guy
                //所有的半选状态都需要取消halfCheck=true的情况
                function track(children) {
                    BI.each(children, function (i, ch) {
                        if (ch.halfCheck === true) {
                            ch.halfCheck = false;
                            track(ch.children);
                        }
                    })
                }

                track(treeNode.children);

                var treeObj = $.fn.zTree.getZTreeObj(treeId);
                var nodes = treeObj.getSelectedNodes();
                BI.each(nodes, function (index, node) {
                    node.halfCheck = false;
                })
            }
        }

        function beforeExpand(treeId, treeNode) {
            self._expandNode(treeId, treeNode);
        }

        function onCheck(event, treeId, treeNode) {
            self._selectTreeNode(treeId, treeNode);
        }

        function onExpand(event, treeId, treeNode) {
            treeNode.halfCheck = false;
        }

        function onCollapse(event, treeId, treeNode) {
            treeNode.halfCheck = false;
        }

        return setting;
    },

    _selectTreeNode: function (treeId, treeNode) {
        var self = this, o = this.options;
        var parent_values = BI.deepClone(treeNode.parentValues || self._getParentValues(treeNode));
        var name = this._getNodeValue(treeNode)
//        var values = parent_values.concat([name]);
        if (treeNode.checked === true) {
        } else {
            var tNode = treeNode;
            var pNode = this._getTree(this.selected_values, parent_values);
            if (BI.isNotNull(pNode[name])) {
                delete pNode[name];
            }
            while (tNode != null && BI.isEmpty(pNode)) {
                parent_values = parent_values.slice(0, parent_values.length - 1);
                tNode = tNode.getParentNode();
                if (tNode != null) {
                    pNode = this._getTree(this.selected_values, parent_values);
                    name = this._getNodeValue(tNode);
                    delete pNode[name];
                }
            }
        }
        BI.SyncTree.superclass._selectTreeNode.apply(self, arguments);
    },

    //展开节点
    _expandNode: function (treeId, treeNode) {
        var self = this, o = this.options;
        var parentValues = treeNode.parentValues || self._getParentValues(treeNode);
        var op = BI.extend({}, o.paras, {
            "id": treeNode.id,
            "times": 1,
            "parent_values": parentValues.concat(this._getNodeValue(treeNode)),
            "check_state": treeNode.getCheckStatus()
        });
        var complete = function (d) {
            var nodes = d.items || [];
            if (nodes.length > 0) {
                callback(self._dealWidthNodes(nodes), !!d.hasNext);
            }
        };
        var times = 1;

        function callback(nodes, hasNext) {
            self.nodes.addNodes(treeNode, nodes);

            if (hasNext === true) {
                BI.delay(function () {
                    times++;
                    op.times = times;
                    o.itemsCreator(op, complete);
                }, 100);
            }
        }

        if (!treeNode.children) {
            o.itemsCreator(op, complete)
        }
    },

    _joinTree: function (map, values, isLast) {
        var cur = map;
        BI.each(values, function (i, value) {
            if (i > 0 && BI.isPlainObject(cur) && BI.isEmpty(cur)) {
                return;
            }
            if (isLast === true && i === values.length - 1) {
                cur[value] = {};
                return;
            }
            if (cur[value] == null) {
                cur[value] = {};
            }
            cur = cur[value];
        })
    },

    _join: function (valueA, valueB) {
        var self = this;
        var hashMap = valueA || {};
        track([], valueB);
        function track(parent, node) {
            BI.each(node, function (n, item) {
                var next = parent.concat([n]);
                self._joinTree(hashMap, next, BI.isPlainObject(item) && BI.isEmpty(item));
                track(next, item);
            })
        }

        return hashMap;
    },

    hasChecked: function () {
        return !BI.isEmpty(this.selected_values) || BI.SyncTree.superclass.hasChecked.apply(this, arguments);
    },

    getValue: function () {
        if (!this.nodes) {
            return {};
        }
        var checkedValues = this._getSelectedValues();
        if (BI.isEmpty(checkedValues)) {
            return this.selected_values;
        }
        if (BI.isEmpty(this.selected_values)) {
            return checkedValues;
        }
        return this._join(checkedValues, this.selected_values);
    },

    //生成树方法
    stroke: function (config) {
        delete this.options.keyword;
        BI.extend(this.options.paras, config);
        //取消选中时使用
        this.selected_values = BI.deepClone(this.options.paras.selected_values) || {};
        var setting = this._configSetting();
        this._initTree(setting);
    }
});

$.shortcut("bi.sync_tree", BI.SyncTree);