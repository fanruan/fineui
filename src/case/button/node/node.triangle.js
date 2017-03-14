/**
 * 三角号表示的组节点
 * Created by GUY on 2015/9/6.
 * @class BI.TriangleGroupNode
 * @extends BI.NodeButton
 */
BI.TriangleGroupNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.TriangleGroupNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-triangle-group-node bi-list-item",
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
        BI.TriangleGroupNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.checkbox = BI.createWidget({
            iconWidth: 13,
            iconHeight: 13,
            type: "bi.tree_group_node_checkbox"
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
            py: o.py,
            keyword: o.keyword
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
        BI.TriangleGroupNode.superclass.doClick.apply(this, arguments);
        this.checkbox.setSelected(this.isOpened());
    },

    setOpened: function (v) {
        BI.TriangleGroupNode.superclass.setOpened.apply(this, arguments);
        this.checkbox.setSelected(v);
    },

    setText: function(text){
        BI.TriangleGroupNode.superclass.setText.apply(this, arguments);
        this.text.setText(text);
    }
});

$.shortcut("bi.triangle_group_node", BI.TriangleGroupNode);