/**
 * guy
 * 异步树
 * @class BI.ListListDisplayTree
 * @extends BI.TreeView
 */
BI.ListDisplayTree = BI.inherit(BI.ListTreeView, {
    _defaultConfig: function () {
        return BI.extend(BI.ListDisplayTree.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-list-display-tree"
        });
    },
    _init: function () {
        BI.ListDisplayTree.superclass._init.apply(this, arguments);
    },

    // 配置属性
    _configSetting: function () {
        var setting = {
            view: {
                selectedMulti: false,
                dblClickExpand: false,
                showIcon: false,
                nameIsHTML: true,
                showTitle: false,
                fontCss: getFont
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

        function getFont(treeId, node) {
            return node.isLeaf ? {} : {color: "#999999"};
        }

        return setting;
    },

    _dealWidthNodes: function (nodes) {
        nodes = BI.ListDisplayTree.superclass._dealWidthNodes.apply(this, arguments);
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
    },

    destroy: function () {
        BI.ListDisplayTree.superclass.destroy.apply(this, arguments);
    }
});
BI.ListDisplayTree.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.list_display_tree", BI.ListDisplayTree);