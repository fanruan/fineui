/**
 * 加号表示的组节点
 * Created by GUY on 2015/9/6.
 * @class BI.LastPlusGroupNode
 * @extends BI.NodeButton
 */
BI.LastPlusGroupNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.LastPlusGroupNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-last-plus-group-node bi-list-item",
            logic: {
                dynamic: false
            },
            id: "",
            pId: "",
            open: false,
            height: 25
        })
    },
    _init: function () {
        BI.LastPlusGroupNode.superclass._init.apply(this, arguments);
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
            py: o.py
        });
        this.checkbox.on(BI.Controller.EVENT_CHANGE, function (type) {
            if(type ===  BI.Events.CLICK) {
                if (this.isSelected()) {
                    self.triggerExpand();
                } else {
                    self.triggerCollapse();
                }
            }
        });
        var type = BI.LogicFactory.createLogicTypeByDirection(BI.Direction.Left);
        var items = BI.LogicFactory.createLogicItemsByDirection(BI.Direction.Left, {
            width: 25,
            el: this.checkbox
        }, this.text);
        BI.createWidget(BI.extend({
            element: this.element
        }, BI.LogicFactory.createLogic(type, BI.extend(o.logic, {
            items: items
        }))));
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doClick: function () {
        BI.LastPlusGroupNode.superclass.doClick.apply(this, arguments);
        this.checkbox.setSelected(this.isSelected());
    },

    setOpened: function (v) {
        BI.LastPlusGroupNode.superclass.setOpened.apply(this, arguments);
        if (BI.isNotNull(this.checkbox)) {
            this.checkbox.setSelected(v);
        }
    }
});

$.shortcut("bi.last_plus_group_node", BI.LastPlusGroupNode);