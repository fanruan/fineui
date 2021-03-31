/**
 * author: windy
 * 继承自treeView, 此树的父子节点的勾选状态互不影响, 此树不会有半选节点
 * 返回value格式为["A", ["A", "a"]]表示勾选了A且勾选了a
 * @class BI.ListListAsyncTree
 * @extends BI.TreeView
 */
BI.ListAsyncTree = BI.inherit(BI.ListTreeView, {
    _defaultConfig: function () {
        return BI.extend(BI.ListAsyncTree.superclass._defaultConfig.apply(this, arguments), {});
    },
    _init: function () {
        BI.ListAsyncTree.superclass._init.apply(this, arguments);
    },

    // 配置属性
    _configSetting: function () {
        var paras = this.options.paras;
        var self = this;
        var setting = {
            async: {
                enable: false,  // 很明显这棵树把异步请求关掉了，所有的异步请求都是手动控制的
                otherParam: BI.cjkEncodeDO(paras)
            },
            check: {
                enable: true,
                chkboxType: {Y: "", N: ""}
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
                onCheck: onCheck,
                beforeExpand: beforeExpand,
                beforeCheck: beforeCheck,
                onClick: onClick
            }
        };

        function beforeCheck (treeId, treeNode) {
            treeNode.half = false;
        }

        function onClick (event, treeId, treeNode) {
            var zTree = BI.$.fn.zTree.getZTreeObj(treeId);
            var checked = treeNode.checked;
            self._checkValue(treeNode, !checked);
            zTree.checkNode(treeNode, !checked, true, true);
        }

        function beforeExpand (treeId, treeNode) {
            self._beforeExpandNode(treeId, treeNode);
        }

        function onCheck (event, treeId, treeNode) {
            self._selectTreeNode(treeId, treeNode);
        }

        return setting;
    },

    // 展开节点
    _beforeExpandNode: function (treeId, treeNode) {
        var self = this, o = this.options;
        var parentValues = treeNode.parentValues || self._getParentValues(treeNode);
        var op = BI.extend({}, o.paras, {
            id: treeNode.id,
            times: 1,
            parentValues: parentValues.concat(this._getNodeValue(treeNode))
        });
        var complete = function (d) {
            var nodes = d.items || [];
            if (nodes.length > 0) {
                callback(self._dealWidthNodes(nodes), !!d.hasNext);
            }
        };
        var times = 1;

        function callback (nodes, hasNext) {
            self.nodes.addNodes(treeNode, nodes);
            // 展开节点是没有分页的
            if (hasNext === true) {
                BI.delay(function () {
                    times++;
                    op.times = times;
                    o.itemsCreator(op, complete);
                }, 100);
            }
        }

        if (!treeNode.children) {
            setTimeout(function () {
                o.itemsCreator(op, complete);
            }, 17);
        }
    },

    hasChecked: function () {
        return !BI.isEmpty(this.options.paras.selectedValues) || BI.ListAsyncTree.superclass.hasChecked.apply(this, arguments);
    },

    // 生成树方法
    stroke: function (config) {
        delete this.options.keyword;
        BI.extend(this.options.paras, config);
        var setting = this._configSetting();
        this._initTree(setting);
    }
});

BI.shortcut("bi.list_async_tree", BI.ListAsyncTree);