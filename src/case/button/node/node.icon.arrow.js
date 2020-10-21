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
            height: 24,
            iconHeight: 12,
            iconWidth: 12,
            iconCls: "",
            iconWrapperWidth: 16
        });
    },
    _init: function () {
        BI.IconArrowNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.checkbox = BI.createWidget({
            type: "bi.arrow_group_node_checkbox",
            width: 24,
            stopPropagation: true
        });

        var icon = BI.createWidget({
            type: "bi.icon_label",
            width: 24,
            cls: o.iconCls,
            iconWidth: o.iconWidth,
            iconHeight: o.iconHeight
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
                if (this.isSelected()) {
                    self.triggerExpand();
                } else {
                    self.triggerCollapse();
                }
            }
        });
        var type = BI.LogicFactory.createLogicTypeByDirection(BI.Direction.Left);
        var items = BI.LogicFactory.createLogicItemsByDirection(BI.Direction.Left, {
            width: o.iconWrapperWidth,
            el: this.checkbox
        }, {
            width: 16,
            el: icon
        }, this.text);
        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic(type, BI.extend(o.logic, {
            items: items,
            rgap: 5
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

BI.shortcut("bi.icon_arrow_node", BI.IconArrowNode);
