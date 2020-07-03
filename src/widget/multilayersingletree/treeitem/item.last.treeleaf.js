/**
 *
 * Created by GUY on 2016/1/27.
 * @class BI.MultiLayerSingleTreeLastTreeLeafItem
 * @extends BI.BasicButton
 */
BI.MultiLayerSingleTreeLastTreeLeafItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.MultiLayerSingleTreeLastTreeLeafItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-multilayer-single-tree-last-tree-leaf-item bi-list-item-active",
            logic: {
                dynamic: false
            },
            layer: 0,
            id: "",
            pId: "",
            height: 24
        });
    },
    _init: function () {
        BI.MultiLayerSingleTreeLastTreeLeafItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.item = BI.createWidget({
            type: "bi.last_tree_leaf_item",
            cls: "bi-list-item-none",
            logic: {
                dynamic: true
            },
            id: o.id,
            pId: o.pId,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py,
            keyword: o.keyword
        });
        this.item.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {// 本身实现click功能
                return;
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

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
        items.push(this.item);
        BI.createWidget({
            type: "bi.horizontal_adapt",
            element: this,
            columnSize: BI.makeArray(o.layer, 12),
            items: items
        });
    },

    doHighLight: function () {
        this.item.doHighLight.apply(this.item, arguments);
    },

    unHighLight: function () {
        this.item.unHighLight.apply(this.item, arguments);
    },

    getId: function () {
        return this.options.id;
    },

    getPId: function () {
        return this.options.pId;
    },

    doClick: function () {
        BI.MultiLayerSingleTreeLastTreeLeafItem.superclass.doClick.apply(this, arguments);
        this.item.setSelected(this.isSelected());
    },

    setSelected: function (v) {
        BI.MultiLayerSingleTreeLastTreeLeafItem.superclass.setSelected.apply(this, arguments);
        this.item.setSelected(v);
    }
});

BI.shortcut("bi.multilayer_single_tree_last_tree_leaf_item", BI.MultiLayerSingleTreeLastTreeLeafItem);