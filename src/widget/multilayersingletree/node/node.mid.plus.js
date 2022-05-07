/**
 * 加号表示的组节点
 *
 * Created by GUY on 2016/1/27.
 * @class BI.MultiLayerSingleTreeMidPlusGroupNode
 * @extends BI.NodeButton
 */
BI.MultiLayerSingleTreeMidPlusGroupNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.MultiLayerSingleTreeMidPlusGroupNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            extraCls: "bi-multilayer-single-tree-mid-plus-group-node bi-list-item",
            layer: 0, // 第几层级
            id: "",
            pId: "",
            open: false,
            height: 24
        });
    },
    _init: function () {
        BI.MultiLayerSingleTreeMidPlusGroupNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.node = this._createNode();

        var items = [];

        items.push({
            el: this.node,
            lgap: o.layer * BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT / 2
        });
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
        BI.MultiLayerSingleTreeMidPlusGroupNode.superclass.doClick.apply(this, arguments);
        this.node.setSelected(this.isSelected());
    },

    setOpened: function (v) {
        BI.MultiLayerSingleTreeMidPlusGroupNode.superclass.setOpened.apply(this, arguments);
        if (BI.isNotNull(this.node)) {
            this.node.setOpened(v);
        }
    },

    _createNode: function () {
        var self = this, o = this.options;

        return BI.createWidget({
            type: "bi.mid_plus_group_node",
            cls: "bi-list-item-none",
            logic: {
                dynamic: true
            },
            id: o.id,
            pId: o.pId,
            open: o.open,
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

BI.shortcut("bi.multilayer_single_tree_mid_plus_group_node", BI.MultiLayerSingleTreeMidPlusGroupNode);
