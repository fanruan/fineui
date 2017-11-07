/**
 * guy
 * 同步树
 * @class BI.AsyncTree
 * @extends BI.TreeView
 */
BI.AsyncTree = BI.inherit(BI.TreeView, {
    _defaultConfig: function () {
        return BI.extend(BI.AsyncTree.superclass._defaultConfig.apply(this, arguments), {})
    },
    _init: function () {
        BI.AsyncTree.superclass._init.apply(this, arguments);
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
            self._beforeExpandNode(treeId, treeNode);
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
        var parentValues = BI.deepClone(treeNode.parentValues || self._getParentValues(treeNode));
        var name = this._getNodeValue(treeNode);
//        var values = parentValues.concat([name]);
        if (treeNode.checked === true) {
        } else {
            var tNode = treeNode;
            var pNode = this._getTree(this.options.paras.selectedValues, parentValues);
            if (BI.isNotNull(pNode[name])) {
                delete pNode[name];
            }
            while (tNode != null && BI.isEmpty(pNode)) {
                parentValues = parentValues.slice(0, parentValues.length - 1);
                tNode = tNode.getParentNode();
                if (tNode != null) {
                    pNode = this._getTree(this.options.paras.selectedValues, parentValues);
                    name = this._getNodeValue(tNode);
                    delete pNode[name];
                }
            }
        }
        BI.AsyncTree.superclass._selectTreeNode.apply(self, arguments);
    },

    //展开节点
    _beforeExpandNode: function (treeId, treeNode) {
        var self = this, o = this.options;
        var parentValues = treeNode.parentValues || self._getParentValues(treeNode);
        var op = BI.extend({}, o.paras, {
            id: treeNode.id,
            times: 1,
            parentValues: parentValues.concat(this._getNodeValue(treeNode)),
            checkState: treeNode.getCheckStatus()
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

    _join: function (valueA, valueB) {
        var self = this;
        var map = {};
        track([], valueA, valueB);
        track([], valueB, valueA);
        function track(parent, node, compare) {
            BI.each(node, function (n, item) {
                if (BI.isNull(compare[n])) {
                    self._addTreeNode(map, parent, n, item);
                } else if (BI.isEmpty(compare[n])) {
                    self._addTreeNode(map, parent, n, {});
                } else {
                    track(parent.concat([n]), node[n], compare[n]);
                }
            })
        }

        return map;
    },

    hasChecked: function () {
        return !BI.isEmpty(this.options.paras.selectedValues) || BI.AsyncTree.superclass.hasChecked.apply(this, arguments);
    },

    getValue: function () {
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
        return this._join(checkedValues, this.options.paras.selectedValues);
    },

    //生成树方法
    stroke: function (config) {
        delete this.options.keyword;
        BI.extend(this.options.paras, config);
        var setting = this._configSetting();
        this._initTree(setting);
    }
});

BI.shortcut("bi.async_tree", BI.AsyncTree);