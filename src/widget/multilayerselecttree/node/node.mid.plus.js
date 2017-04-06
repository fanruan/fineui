/**
 * 加号表示的组节点
 *
 * Created by GUY on 2016/1/27.
 * @class BI.MultiLayerSelectTreeMidPlusGroupNode
 * @extends BI.NodeButton
 */
BI.MultiLayerSelectTreeMidPlusGroupNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.MultiLayerSelectTreeMidPlusGroupNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            extraCls: "bi-multilayer-select-tree-mid-plus-group-node bi-list-item-active",
            layer: 0,//第几层级
            id: "",
            pId: "",
            readonly: true,
            open: false,
            height: 25
        })
    },
    _init: function () {
        BI.MultiLayerSelectTreeMidPlusGroupNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.node = BI.createWidget({
            type: "bi.select_tree_mid_plus_group_node",
            stopPropagation: true,
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
            py: o.py
        });
        this.node.on(BI.Controller.EVENT_CHANGE, function (type) {
            self.setSelected(self.isSelected());
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        var items = [];
        BI.count(0, o.layer, function () {
            items.push({
                type: "bi.layout",
                cls: "base-line-conn-background",
                width: 13,
                height: o.height
            })
        });
        items.push(this.node);
        BI.createWidget({
            type: "bi.td",
            element: this,
            columnSize: BI.makeArray(o.layer, 13),
            items: [items]
        })
    },

    doRedMark: function () {
        this.node.doRedMark.apply(this.node, arguments);
    },

    unRedMark: function () {
        this.node.unRedMark.apply(this.node, arguments);
    },

    isSelected: function () {
        return this.node.isSelected();
    },

    setSelected: function (b) {
        BI.MultiLayerSelectTreeMidPlusGroupNode.superclass.setSelected.apply(this, arguments);
        this.node.setSelected(b);
    },

    doClick: function () {
        BI.MultiLayerSelectTreeMidPlusGroupNode.superclass.doClick.apply(this, arguments);
        this.node.setSelected(this.isSelected());
    },

    setOpened: function (v) {
        BI.MultiLayerSelectTreeMidPlusGroupNode.superclass.setOpened.apply(this, arguments);
        this.node.setOpened(v);
    }
});

BI.shortcut("bi.multilayer_select_tree_mid_plus_group_node", BI.MultiLayerSelectTreeMidPlusGroupNode);