/**
 * 加号表示的组节点
 * Created by GUY on 2015/9/6.
 * @class BI.PlusGroupNode
 * @extends BI.NodeButton
 */
BI.PlusGroupNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.PlusGroupNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-plus-group-node bi-list-item",
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
        BI.PlusGroupNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.checkbox = BI.createWidget({
            type: "bi.tree_node_checkbox"
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
            if (type === BI.Events.CLICK) {
                self.setSelected(self.isSelected());
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
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
        BI.PlusGroupNode.superclass.doClick.apply(this, arguments);
        this.checkbox.setSelected(this.isSelected());
    },

    setOpened: function (v) {
        BI.PlusGroupNode.superclass.setOpened.apply(this, arguments);
        if (this.checkbox) {
            this.checkbox.setSelected(v);
        }
    }
});

$.shortcut("bi.plus_group_node", BI.PlusGroupNode);