/**
 * 加号表示的组节点
 * Created by GUY on 2015/9/6.
 * @class BI.SelectTreeLastPlusGroupNode
 * @extends BI.NodeButton
 */
BI.SelectTreeLastPlusGroupNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.SelectTreeLastPlusGroupNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-select-tree-last-plus-group-node bi-list-item-active",
            logic: {
                dynamic: false
            },
            id: "",
            pId: "",
            readonly: true,
            open: false,
            height: 24
        });
    },
    _init: function () {
        BI.SelectTreeLastPlusGroupNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.checkbox = BI.createWidget({
            type: "bi.last_tree_node_checkbox",
            stopPropagation: true
        });
        this.text = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            whiteSpace: "nowrap",
            textHeight: o.height,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            value: o.value,
            keyword: o.keyword,
            py: o.py
        });
        this.checkbox.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {
                if (this.isSelected()) {
                    self.triggerExpand();
                } else {
                    self.triggerCollapse();
                }
            }
        });
        var type = BI.LogicFactory.createLogicTypeByDirection(BI.Direction.Left);
        var items = BI.LogicFactory.createLogicItemsByDirection(BI.Direction.Left, {
            width: BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT,
            el: this.checkbox
        }, this.text);
        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic(type, BI.extend(o.logic, {
            items: items
        }))));
    },

    isOnce: function () {
        return true;
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doClick: function () {
        BI.NodeButton.superclass.doClick.apply(this, arguments);
    },

    setOpened: function (v) {
        BI.SelectTreeLastPlusGroupNode.superclass.setOpened.apply(this, arguments);
        if (BI.isNotNull(this.checkbox)) {
            this.checkbox.setSelected(v);
        }
    }
});

BI.shortcut("bi.select_tree_last_plus_group_node", BI.SelectTreeLastPlusGroupNode);