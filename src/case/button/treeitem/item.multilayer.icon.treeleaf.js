/**
 * @class BI.MultiLayerIconTreeLeafItem
 * @extends BI.BasicButton
 */
BI.MultiLayerIconTreeLeafItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.MultiLayerIconTreeLeafItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-multilayer-icon-tree-leaf-item bi-list-item-active",
            layer: 0,
            height: 25,
            iconCls: "",
            iconHeight: 14,
            iconWidth: 12
        })
    },
    _init: function () {
        BI.MultiLayerIconTreeLeafItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.item = BI.createWidget({
            type: "bi.icon_tree_leaf_item",
            iconCls: o.iconCls,
            logic: {
                dynamic: true
            },
            id: o.id,
            pId: o.pId,
            isFront: true,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py,
            iconWidth: o.iconWidth,
            iconHeight: o.iconHeight
        });
        this.item.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {//本身实现click功能
                return;
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        var items = [];
        BI.count(0, o.layer, function () {
            items.push({
                type: "bi.layout",
                width: 13,
                height: o.height
            })
        });
        items.push(this.item);
        BI.createWidget({
            type: "bi.td",
            element: this.element,
            columnSize: BI.makeArray(o.layer, 13),
            items: [items]
        });
    },

    doRedMark: function () {
        this.item.doRedMark.apply(this.item, arguments);
    },

    unRedMark: function () {
        this.item.unRedMark.apply(this.item, arguments);
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
        BI.MultiLayerIconTreeLeafItem.superclass.doClick.apply(this, arguments);
        this.item.setSelected(this.isSelected());
    },

    setSelected: function (v) {
        BI.MultiLayerIconTreeLeafItem.superclass.setSelected.apply(this, arguments);
        this.item.setSelected(v);
    },

    getValue: function(){
        return this.options.value;
    }
});

$.shortcut("bi.multilayer_icon_tree_leaf_item", BI.MultiLayerIconTreeLeafItem);