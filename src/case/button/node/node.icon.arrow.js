/**
 * Created by User on 2016/3/31.
 */
/**
 * > + icon + 文本
 * @class BI.IconArrowNode
 * @extends BI.NodeButton
 */
BI.IconArrowNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.IconArrowNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-icon-arrow-node bi-list-item",
            logic: {
                dynamic: false
            },
            id: "",
            pId: "",
            open: false,
            height: 25,
            iconHeight: 13,
            iconWidth: 13,
            iconCls: ""
        })
    },
    _init: function () {
        BI.IconArrowNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.checkbox = BI.createWidget({
            type: "bi.tree_group_node_checkbox",
            width: 23,
            stopPropagation: true
        });

        var icon = BI.createWidget({
            type: "bi.center_adapt",
            cls: o.iconCls,
            width: 23,
            items: [{
                type: "bi.icon",
                height: o.iconHeight,
                width: o.iconWidth
            }]
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
        }, {
            width: 23,
            el: icon
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
        BI.IconArrowNode.superclass.doClick.apply(this, arguments);
        this.checkbox.setSelected(this.isSelected());
    },

    setOpened: function (v) {
        BI.IconArrowNode.superclass.setOpened.apply(this, arguments);
        if (BI.isNotNull(this.checkbox)) {
            this.checkbox.setSelected(v);
        }
    }
});

$.shortcut("bi.icon_arrow_node", BI.IconArrowNode);