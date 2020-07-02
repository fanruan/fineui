/**
 *@desc 根节点,既是第一个又是最后一个
 *@author dailer
 *@date 2018/09/16
 */
BI.MultiLayerSingleTreePlusGroupNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.MultiLayerSingleTreePlusGroupNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            extraCls: "bi-multilayer-single-tree-plus-group-node bi-list-item",
            layer: 0, // 第几层级
            id: "",
            pId: "",
            open: false,
            height: 24
        });
    },
    _init: function () {
        BI.MultiLayerSingleTreePlusGroupNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.node = this._createNode();

        var needBlankLayers = [];
        var pNode = o.pNode;
        while (pNode) {
            if (pNode.isLastNode) {
                needBlankLayers.push(pNode.layer)
            }
            pNode = pNode.pNode;
        }

        var items = [];
        BI.count(0, o.layer, function (index) {
            items.push({
                type: "bi.layout",
                cls: BI.contains(needBlankLayers, index) ? "" : "base-line-conn-background",
                width: 12,
                height: o.height
            });
        });
        items.push(this.node);
        BI.createWidget({
            type: "bi.horizontal_adapt",
            element: this,
            columnSize: BI.makeArray(o.layer, 12),
            items: items
        });
    },

    doRedMark: function () {
        this.node.doRedMark.apply(this.node, arguments);
    },

    unRedMark: function () {
        this.node.unRedMark.apply(this.node, arguments);
    },

    doClick: function () {
        BI.MultiLayerSingleTreePlusGroupNode.superclass.doClick.apply(this, arguments);
        this.node.setSelected(this.isSelected());
    },

    setOpened: function (v) {
        BI.MultiLayerSingleTreePlusGroupNode.superclass.setOpened.apply(this, arguments);
        if (BI.isNotNull(this.node)) {
            this.node.setOpened(v);
        }
    },

    _createNode: function () {
        var self = this, o = this.options;

        return BI.createWidget({
            type: "bi.plus_group_node",
            cls: "bi-list-item-none",
            logic: {
                dynamic: true
            },
            id: o.id,
            pId: o.pId,
            open: o.open,
            isLastNode: o.isLastNode,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py,
            keyword: o.keyword,
            listeners: [{
                eventName: BI.Controller.EVENT_CHANGE,
                action: function (type) {
                    if (type === BI.Events.CLICK) {// 本身实现click功能
                        return;
                    }
                    self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                }
            }]
        });
    }
});

BI.shortcut("bi.multilayer_single_tree_plus_group_node", BI.MultiLayerSingleTreePlusGroupNode);