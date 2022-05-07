/**
 * guy
 * 异步树
 * @class BI.DisplayTree
 * @extends BI.TreeView
 */
BI.DisplayTree = BI.inherit(BI.TreeView, {
    _defaultConfig: function () {
        return BI.extend(BI.DisplayTree.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-display-tree"
        });
    },

    // 配置属性
    _configSetting: function () {
        var setting = {
            view: {
                selectedMulti: false,
                dblClickExpand: false,
                showIcon: false,
                nameIsHTML: true,
                showTitle: false
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
            callback: {
                beforeCollapse: beforeCollapse
            }
        };

        function beforeCollapse(treeId, treeNode) {
            return false;
        }

        return setting;
    },

    _dealWidthNodes: function (nodes) {
        nodes = BI.DisplayTree.superclass._dealWidthNodes.apply(this, arguments);
        var self = this, o = this.options;
        BI.each(nodes, function (i, node) {
            node.isParent = node.isParent || node.parent;
            if (node.text == null) {
                if (node.count > 0) {
                    node.text = node.value + "(" + BI.i18nText("BI-Basic_Altogether") + node.count + BI.i18nText("BI-Basic_Count") + ")";
                }
            }
        });
        return nodes;
    },

    initTree: function (nodes, setting) {
        var setting = setting || this._configSetting();
        this.nodes = BI.$.fn.zTree.init(this.tree.element, setting, nodes);
    }
});
BI.DisplayTree.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.display_tree", BI.DisplayTree);
