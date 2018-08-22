/**
 * 可以改变图标的button
 *
 * Created by GUY on 2016/2/2.
 *
 * @class BI.IconChangeButton
 * @extends BI.Single
 */
BI.IconChangeButton = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.IconChangeButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-icon-change-button",
            iconCls: "",
            iconWidth: null,
            iconHeight: null,

            stopEvent: false,
            stopPropagation: false,
            selected: false,
            once: false, // 点击一次选中有效,再点无效
            forceSelected: false, // 点击即选中， 选中了就不会被取消
            forceNotSelected: false, // 无论怎么点击都不会被选中
            disableSelected: false, // 使能选中

            shadow: false,
            isShadowShowingOnSelected: false,  // 选中状态下是否显示阴影
            trigger: null,
            handler: BI.emptyFn
        });
    },

    _init: function () {
        BI.IconChangeButton.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.button = BI.createWidget({
            type: "bi.icon_button",
            element: this,
            cls: o.iconCls,
            height: o.height,
            iconWidth: o.iconWidth,
            iconHeight: o.iconHeight,

            stopEvent: o.stopEvent,
            stopPropagation: o.stopPropagation,
            selected: o.selected,
            once: o.once,
            forceSelected: o.forceSelected,
            forceNotSelected: o.forceNotSelected,
            disableSelected: o.disableSelected,

            shadow: o.shadow,
            isShadowShowingOnSelected: o.isShadowShowingOnSelected,
            trigger: o.trigger,
            handler: o.handler
        });

        this.button.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.button.on(BI.IconButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.IconChangeButton.EVENT_CHANGE, arguments);
        });
    },

    isSelected: function () {
        return this.button.isSelected();
    },

    setSelected: function (b) {
        this.button.setSelected(b);
    },

    setIcon: function (cls) {
        var o = this.options;
        if (o.iconCls !== cls) {
            this.element.removeClass(o.iconCls).addClass(cls);
            o.iconCls = cls;
        }
    }
});
BI.IconChangeButton.EVENT_CHANGE = "IconChangeButton.EVENT_CHANGE";
BI.shortcut("bi.icon_change_button", BI.IconChangeButton);/**
 * guy
 * @extends BI.Single
 * @type {*|void|Object}
 */
BI.HalfIconButton = BI.inherit(BI.IconButton, {
    _defaultConfig: function () {
        var conf = BI.HalfIconButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            extraCls: "bi-half-icon-button check-half-select-icon",
            height: 16,
            width: 16,
            iconWidth: 16,
            iconHeight: 16,
            selected: false
        });
    },

    _init: function () {
        BI.HalfIconButton.superclass._init.apply(this, arguments);
    },

    doClick: function () {
        BI.HalfIconButton.superclass.doClick.apply(this, arguments);
        if(this.isValid()) {
            this.fireEvent(BI.HalfIconButton.EVENT_CHANGE);
        }
    }
});
BI.HalfIconButton.EVENT_CHANGE = "HalfIconButton.EVENT_CHANGE";

BI.shortcut("bi.half_icon_button", BI.HalfIconButton);/**
 *  统一的trigger图标按钮
 *
 * Created by GUY on 2015/9/16.
 * @class BI.TriggerIconButton
 * @extends BI.IconButton
 */
BI.TriggerIconButton = BI.inherit(BI.IconButton, {

    _defaultConfig: function () {
        var conf = BI.TriggerIconButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-trigger-icon-button",
            extraCls: "pull-down-font"
        });
    },

    _init: function () {
        BI.TriggerIconButton.superclass._init.apply(this, arguments);
    },

    doClick: function () {
        BI.TriggerIconButton.superclass.doClick.apply(this, arguments);
        if (this.isValid()) {
            this.fireEvent(BI.TriggerIconButton.EVENT_CHANGE, this);
        }
    }
});
BI.TriggerIconButton.EVENT_CHANGE = "TriggerIconButton.EVENT_CHANGE";
BI.shortcut("bi.trigger_icon_button", BI.TriggerIconButton);/**
 * guy
 * 复选框item
 * @type {*|void|Object}
 */
BI.MultiSelectItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-multi-select-item",
            height: 24,
            logic: {
                dynamic: false
            },
            iconWrapperWidth: 26
        });
    },
    _init: function () {
        BI.MultiSelectItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.checkbox = BI.createWidget({
            type: "bi.checkbox"
        });
        this.text = BI.createWidget({
            type: "bi.label",
            cls: "list-item-text",
            textAlign: "left",
            whiteSpace: "nowrap",
            textHeight: o.height,
            height: o.height,
            hgap: o.hgap,
            rgap: o.rgap,
            text: o.text,
            keyword: o.keyword,
            value: o.value,
            py: o.py
        });
        this.checkbox.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {
                self.setSelected(self.isSelected());
            }
        });

        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic("horizontal", BI.extend(o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection("left", {
                type: "bi.center_adapt",
                items: [this.checkbox],
                width: o.iconWrapperWidth
            }, this.text)
        }))));
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doClick: function () {
        BI.MultiSelectItem.superclass.doClick.apply(this, arguments);
        this.checkbox.setSelected(this.isSelected());
        if (this.isValid()) {
            this.fireEvent(BI.MultiSelectItem.EVENT_CHANGE, this.getValue(), this);
        }
    },

    setSelected: function (v) {
        BI.MultiSelectItem.superclass.setSelected.apply(this, arguments);
        this.checkbox.setSelected(v);
    }
});
BI.MultiSelectItem.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.multi_select_item", BI.MultiSelectItem);/**
 * Created by GUY on 2016/2/2.
 *
 * @class BI.SingleSelectIconTextItem
 * @extends BI.BasicButton
 */
BI.SingleSelectIconTextItem = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectIconTextItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-single-select-icon-text-item bi-list-item-active",
            iconCls: "",
            height: 24
        });
    },
    _init: function () {
        BI.SingleSelectIconTextItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.text = BI.createWidget({
            type: "bi.icon_text_item",
            element: this,
            cls: o.iconCls,
            once: o.once,
            iconWrapperWidth: o.iconWrapperWidth,
            selected: o.selected,
            height: o.height,
            iconHeight: o.iconHeight,
            iconWidth: o.iconWidth,
            text: o.text,
            keyword: o.keyword,
            value: o.value,
            py: o.py
        });
        this.text.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
    },

    isSelected: function () {
        return this.text.isSelected();
    },

    setSelected: function (b) {
        this.text.setSelected(b);
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doClick: function () {
        BI.SingleSelectIconTextItem.superclass.doClick.apply(this, arguments);
    }
});

BI.shortcut("bi.single_select_icon_text_item", BI.SingleSelectIconTextItem);/**
 * guy
 * 复选框item
 * @type {*|void|Object}
 */
BI.SingleSelectItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-single-select-item bi-list-item-active",
            hgap: 10,
            height: 24,
            textAlign: "left"
        });
    },
    _init: function () {
        BI.SingleSelectItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.text = BI.createWidget({
            type: "bi.label",
            element: this,
            textAlign: o.textAlign,
            whiteSpace: "nowrap",
            textHeight: o.height,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            keyword: o.keyword,
            value: o.value,
            title: o.text,
            py: o.py
        });
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doClick: function () {
        BI.SingleSelectItem.superclass.doClick.apply(this, arguments);
    },

    setSelected: function (v) {
        BI.SingleSelectItem.superclass.setSelected.apply(this, arguments);
    }
});

BI.shortcut("bi.single_select_item", BI.SingleSelectItem);/**
 * guy
 * 单选框item
 * @type {*|void|Object}
 */
BI.SingleSelectRadioItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectRadioItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-single-select-radio-item",
            logic: {
                dynamic: false
            },
            hgap: 10,
            height: 24
        });
    },
    _init: function () {
        BI.SingleSelectRadioItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.radio = BI.createWidget({
            type: "bi.radio"
        });
        this.text = BI.createWidget({
            type: "bi.label",
            cls: "list-item-text",
            textAlign: "left",
            whiteSpace: "nowrap",
            textHeight: o.height,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            keyword: o.keyword,
            value: o.value,
            py: o.py
        });

        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic("horizontal", BI.extend(o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection("left", {
                type: "bi.center_adapt",
                items: [this.radio],
                width: 16
            }, this.text)
        }))));
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doClick: function () {
        BI.SingleSelectRadioItem.superclass.doClick.apply(this, arguments);
        this.radio.setSelected(this.isSelected());
    },

    setSelected: function (v) {
        BI.SingleSelectRadioItem.superclass.setSelected.apply(this, arguments);
        this.radio.setSelected(v);

    }
});

BI.shortcut("bi.single_select_radio_item", BI.SingleSelectRadioItem);/**
 * Created by roy on 15/10/16.
 */
BI.ArrowNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.ArrowNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-arrow-group-node bi-list-item",
            logic: {
                dynamic: false
            },
            id: "",
            pId: "",
            open: false,
            height: 24
        });
    },
    _init: function () {
        var self = this, o = this.options;
        BI.ArrowNode.superclass._init.apply(this, arguments);
        this.checkbox = BI.createWidget({
            type: "bi.arrow_group_node_checkbox"
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
            width: 24,
            el: this.checkbox
        }, this.text);
        BI.createWidget(BI.extend({
            element: this
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
        BI.ArrowNode.superclass.doClick.apply(this, arguments);
        this.checkbox.setSelected(this.isOpened());
    },
    
    setText: function (text) {
        BI.ArrowNode.superclass.setText.apply(this, arguments);
        this.text.setText(text);
    },

    setOpened: function (v) {
        BI.ArrowNode.superclass.setOpened.apply(this, arguments);
        this.checkbox.setSelected(v);
    }
});

BI.shortcut("bi.arrow_group_node", BI.ArrowNode);/**
 * 加号表示的组节点
 * Created by GUY on 2015/9/6.
 * @class BI.FirstPlusGroupNode
 * @extends BI.NodeButton
 */
BI.FirstPlusGroupNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.FirstPlusGroupNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-first-plus-group-node bi-list-item",
            logic: {
                dynamic: false
            },
            id: "",
            pId: "",
            open: false,
            height: 24
        });
    },
    _init: function () {
        BI.FirstPlusGroupNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.checkbox = BI.createWidget({
            type: "bi.first_tree_node_checkbox",
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
            width: 24,
            el: this.checkbox
        }, this.text);
        BI.createWidget(BI.extend({
            element: this
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
        BI.FirstPlusGroupNode.superclass.doClick.apply(this, arguments);
        this.checkbox.setSelected(this.isSelected());
    },

    setOpened: function (v) {
        BI.FirstPlusGroupNode.superclass.setOpened.apply(this, arguments);
        if (BI.isNotNull(this.checkbox)) {
            this.checkbox.setSelected(v);
        }
    }
});

BI.shortcut("bi.first_plus_group_node", BI.FirstPlusGroupNode);/**
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
            iconCls: ""
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
            width: 24,
            el: this.checkbox
        }, {
            width: 24,
            el: icon
        }, this.text);
        BI.createWidget(BI.extend({
            element: this
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

BI.shortcut("bi.icon_arrow_node", BI.IconArrowNode);/**
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
            height: 24
        });
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
            py: o.py,
            keyword: o.keyword
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
            width: 24,
            el: this.checkbox
        }, this.text);
        BI.createWidget(BI.extend({
            element: this
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

BI.shortcut("bi.last_plus_group_node", BI.LastPlusGroupNode);/**
 * 加号表示的组节点
 * Created by GUY on 2015/9/6.
 * @class BI.MidPlusGroupNode
 * @extends BI.NodeButton
 */
BI.MidPlusGroupNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.MidPlusGroupNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-mid-plus-group-node bi-list-item",
            logic: {
                dynamic: false
            },
            id: "",
            pId: "",
            open: false,
            height: 24
        });
    },
    _init: function () {
        BI.MidPlusGroupNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.checkbox = BI.createWidget({
            type: "bi.mid_tree_node_checkbox",
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
            width: 24,
            el: this.checkbox
        }, this.text);
        BI.createWidget(BI.extend({
            element: this
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
        BI.MidPlusGroupNode.superclass.doClick.apply(this, arguments);
        this.checkbox.setSelected(this.isSelected());
    },

    setOpened: function (v) {
        BI.MidPlusGroupNode.superclass.setOpened.apply(this, arguments);
        if (BI.isNotNull(this.checkbox)) {
            this.checkbox.setSelected(v);
        }
    }
});

BI.shortcut("bi.mid_plus_group_node", BI.MidPlusGroupNode);BI.MultiLayerIconArrowNode = BI.inherit(BI.NodeButton, {
    _defaultConfig: function () {
        var conf = BI.MultiLayerIconArrowNode.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            extraCls: "bi-multilayer-icon-arrow-node bi-list-item",
            layer: 0, // 第几层级
            id: "",
            pId: "",
            open: false,
            height: 24,
            iconHeight: 16,
            iconWidth: 16,
            iconCls: ""
        });
    },
    _init: function () {
        BI.MultiLayerIconArrowNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.node = BI.createWidget({
            type: "bi.icon_arrow_node",
            iconCls: o.iconCls,
            // logic: {
            //    dynamic: true
            // },
            id: o.id,
            pId: o.pId,
            open: o.open,
            height: o.height,
            iconHeight: o.iconHeight,
            iconWidth: o.iconWidth,
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
                width: 24,
                height: o.height
            });
        });
        items.push(this.node);
        BI.createWidget({
            type: "bi.td",
            element: this,
            columnSize: BI.makeArray(o.layer, 24),
            items: [items]
        });
    },

    isOnce: function () {
        return true;
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
        BI.MultiLayerIconArrowNode.superclass.setSelected.apply(this, arguments);
        this.node.setSelected(b);
    },

    doClick: function () {
        BI.NodeButton.superclass.doClick.apply(this, arguments);
        this.node.setSelected(this.isSelected());
    },

    setOpened: function (v) {
        BI.MultiLayerIconArrowNode.superclass.setOpened.apply(this, arguments);
        this.node.setOpened(v);
    }
});

BI.shortcut("bi.multilayer_icon_arrow_node", BI.MultiLayerIconArrowNode);
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
            height: 24
        });
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
            width: 24,
            el: this.checkbox
        }, this.text);
        BI.createWidget(BI.extend({
            element: this
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

BI.shortcut("bi.plus_group_node", BI.PlusGroupNode);/**
 * Created by Windy on 2018/2/1.
 */
BI.Switch = BI.inherit(BI.BasicButton, {

    props: {
        extraCls: "bi-switch",
        height: 22,
        width: 44,
        logic: {
            dynamic: false
        }
    },

    render: function () {
        var self = this;
        return {
            type: "bi.absolute",
            ref: function () {
                self.layout = this;
            },
            items: [{
                el: {
                    type: "bi.text_button",
                    cls: "circle-button bi-card"
                },
                width: 18,
                height: 18,
                top: 2,
                left: this.options.selected ? 24 : 2
            }]
        };
    },

    setSelected: function (v) {
        BI.Switch.superclass.setSelected.apply(this, arguments);
        this.layout.attr("items")[0].left = v ? 24 : 2;
        this.layout.resize();
    },

    doClick: function () {
        BI.Switch.superclass.doClick.apply(this, arguments);
        this.fireEvent(BI.Switch.EVENT_CHANGE);
    }
});
BI.Switch.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.switch", BI.Switch);/**
 * guy
 * 复选框item
 * @type {*|void|Object}
 */
BI.FirstTreeLeafItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.FirstTreeLeafItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-first-tree-leaf-item bi-list-item-active",
            logic: {
                dynamic: false
            },
            id: "",
            pId: "",
            layer: 0,
            height: 24
        });
    },
    _init: function () {
        BI.FirstTreeLeafItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.checkbox = BI.createWidget({
            type: "bi.checkbox"
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
        var items = BI.LogicFactory.createLogicItemsByDirection(BI.Direction.Left, ((o.layer === 0) ? "" : {
            width: 12,
            el: {
                type: "bi.layout",
                cls: "base-line-conn-background",
                width: 12,
                height: o.height
            }
        }), {
            width: 24,
            el: {
                type: "bi.layout",
                cls: "mid-line-conn-background",
                width: 24,
                height: o.height
            }
        }, {
            el: this.text
        });
        BI.createWidget(BI.extend({
            element: this
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

    doHighLight: function () {
        this.text.doHighLight.apply(this.text, arguments);
    },

    unHighLight: function () {
        this.text.unHighLight.apply(this.text, arguments);
    },

    getId: function () {
        return this.options.id;
    },

    getPId: function () {
        return this.options.pId;
    },

    doClick: function () {
        BI.FirstTreeLeafItem.superclass.doClick.apply(this, arguments);
        this.checkbox.setSelected(this.isSelected());
    },

    setSelected: function (v) {
        BI.FirstTreeLeafItem.superclass.setSelected.apply(this, arguments);
        this.checkbox.setSelected(v);
    }
});

BI.shortcut("bi.first_tree_leaf_item", BI.FirstTreeLeafItem);BI.IconTreeLeafItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.IconTreeLeafItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-icon-tree-leaf-item bi-list-item-active",
            logic: {
                dynamic: false
            },
            height: 24,
            iconWidth: 16,
            iconHeight: 16,
            iconCls: ""
        });
    },

    _init: function () {
        BI.IconTreeLeafItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        var icon = BI.createWidget({
            type: "bi.center_adapt",
            width: 24,
            cls: o.iconCls,
            items: [{
                type: "bi.icon",
                width: o.iconWidth,
                height: o.iconHeight
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
        var type = BI.LogicFactory.createLogicTypeByDirection(BI.Direction.Left);
        var items = BI.LogicFactory.createLogicItemsByDirection(BI.Direction.Left, {
            width: 24,
            el: icon
        }, {
            el: this.text
        });
        BI.createWidget(BI.extend({
            element: this
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

    doHighLight: function () {
        this.text.doHighLight.apply(this.text, arguments);
    },

    unHighLight: function () {
        this.text.unHighLight.apply(this.text, arguments);
    },

    getId: function () {
        return this.options.id;
    },

    getPId: function () {
        return this.options.pId;
    },

    doClick: function () {
        BI.IconTreeLeafItem.superclass.doClick.apply(this, arguments);
    },

    setSelected: function (v) {
        BI.IconTreeLeafItem.superclass.setSelected.apply(this, arguments);
    }
});

BI.shortcut("bi.icon_tree_leaf_item", BI.IconTreeLeafItem);/**
 * guy
 * 复选框item
 * @type {*|void|Object}
 */
BI.LastTreeLeafItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.LastTreeLeafItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-last-tree-leaf-item bi-list-item-active",
            logic: {
                dynamic: false
            },
            id: "",
            pId: "",
            layer: 0,
            height: 24
        });
    },
    _init: function () {
        BI.LastTreeLeafItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.checkbox = BI.createWidget({
            type: "bi.checkbox"
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
        var items = BI.LogicFactory.createLogicItemsByDirection(BI.Direction.Left, ((o.layer === 0) ? "" : {
            width: 12,
            el: {
                type: "bi.layout",
                cls: "base-line-conn-background",
                width: 12,
                height: o.height
            }
        }), {
            width: 24,
            el: {
                type: "bi.layout",
                cls: "mid-line-conn-background",
                width: 24,
                height: o.height
            }
        }, {
            el: this.text
        });
        BI.createWidget(BI.extend({
            element: this
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

    doHighLight: function () {
        this.text.doHighLight.apply(this.text, arguments);
    },

    unHighLight: function () {
        this.text.unHighLight.apply(this.text, arguments);
    },

    getId: function () {
        return this.options.id;
    },

    getPId: function () {
        return this.options.pId;
    },

    doClick: function () {
        BI.LastTreeLeafItem.superclass.doClick.apply(this, arguments);
        //    this.checkbox.setSelected(this.isSelected());
    },

    setSelected: function (v) {
        BI.LastTreeLeafItem.superclass.setSelected.apply(this, arguments);
        //    this.checkbox.setSelected(v);
    }
});

BI.shortcut("bi.last_tree_leaf_item", BI.LastTreeLeafItem);/**
 * guy
 * 复选框item
 * @type {*|void|Object}
 */
BI.MidTreeLeafItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.MidTreeLeafItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-mid-tree-leaf-item bi-list-item-active",
            logic: {
                dynamic: false
            },
            id: "",
            pId: "",
            layer: 0,
            height: 24
        });
    },
    _init: function () {
        BI.MidTreeLeafItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.checkbox = BI.createWidget({
            type: "bi.checkbox"
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
        var items = BI.LogicFactory.createLogicItemsByDirection(BI.Direction.Left, ((o.layer === 0) ? "" : {
            width: 12,
            el: {
                type: "bi.layout",
                cls: "base-line-conn-background",
                width: 12,
                height: o.height
            }
        }), {
            width: 24,
            el: {
                type: "bi.layout",
                cls: "mid-line-conn-background",
                width: 24,
                height: o.height
            }
        }, {
            el: this.text
        });
        BI.createWidget(BI.extend({
            element: this
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

    doHighLight: function () {
        this.text.doHighLight.apply(this.text, arguments);
    },

    unHighLight: function () {
        this.text.unHighLight.apply(this.text, arguments);
    },

    getId: function () {
        return this.options.id;
    },

    getPId: function () {
        return this.options.pId;
    },

    doClick: function () {
        BI.MidTreeLeafItem.superclass.doClick.apply(this, arguments);
        this.checkbox.setSelected(this.isSelected());
    },

    setSelected: function (v) {
        BI.MidTreeLeafItem.superclass.setSelected.apply(this, arguments);
        this.checkbox.setSelected(v);
    }
});

BI.shortcut("bi.mid_tree_leaf_item", BI.MidTreeLeafItem);/**
 * @class BI.MultiLayerIconTreeLeafItem
 * @extends BI.BasicButton
 */
BI.MultiLayerIconTreeLeafItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.MultiLayerIconTreeLeafItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-multilayer-icon-tree-leaf-item bi-list-item-active",
            layer: 0,
            height: 24,
            iconCls: "",
            iconHeight: 16,
            iconWidth: 16
        });
    },
    _init: function () {
        BI.MultiLayerIconTreeLeafItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.item = BI.createWidget({
            type: "bi.icon_tree_leaf_item",
            cls: "bi-list-item-none",
            iconCls: o.iconCls,
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
            if (type === BI.Events.CLICK) {// 本身实现click功能
                return;
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        var items = [];
        BI.count(0, o.layer, function () {
            items.push({
                type: "bi.layout",
                width: 24,
                height: o.height
            });
        });
        items.push(this.item);
        BI.createWidget({
            type: "bi.td",
            element: this,
            columnSize: BI.makeArray(o.layer, 24),
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

    getValue: function () {
        return this.options.value;
    }
});

BI.shortcut("bi.multilayer_icon_tree_leaf_item", BI.MultiLayerIconTreeLeafItem);
/**
 * 树叶子节点
 * Created by GUY on 2015/9/6.
 * @class BI.TreeTextLeafItem
 * @extends BI.BasicButton
 */
BI.TreeTextLeafItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.TreeTextLeafItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-tree-text-leaf-item bi-list-item-active",
            id: "",
            pId: "",
            height: 24,
            hgap: 0,
            lgap: 0,
            rgap: 0
        });
    },
    _init: function () {
        BI.TreeTextLeafItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.text = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            whiteSpace: "nowrap",
            textHeight: o.height,
            height: o.height,
            hgap: o.hgap,
            lgap: o.lgap,
            rgap: o.hgap,
            text: o.text,
            value: o.value,
            py: o.py
        });
        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: this.text
            }]
        });
    },

    doRedMark: function () {
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doHighLight: function () {
        this.text.doHighLight.apply(this.text, arguments);
    },

    unHighLight: function () {
        this.text.unHighLight.apply(this.text, arguments);
    },

    getId: function () {
        return this.options.id;
    },

    getPId: function () {
        return this.options.pId;
    }
});

BI.shortcut("bi.tree_text_leaf_item", BI.TreeTextLeafItem);/**
 * 专门为calendar的视觉加的button，作为私有button,不能配置任何属性，也不要用这个玩意
 */
BI.CalendarDateItem = BI.inherit(BI.BasicButton, {

    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.text_item",
                    cls: "bi-list-item-select",
                    textAlign: "center",
                    whiteSpace: "normal",
                    text: o.text,
                    value: o.value,
                    ref: function () {
                        self.text = this;
                    }
                },
                left: o.lgap,
                right: o.rgap,
                top: 0,
                bottom: 0
            }]
        };
    },

    doHighLight: function () {
        this.text.doHighLight.apply(this.text, arguments);
    },

    unHighLight: function () {
        this.text.unHighLight.apply(this.text, arguments);
    },

    setValue: function () {
        if (!this.isReadOnly()) {
            this.text.setValue.apply(this.text, arguments);
        }
    },

    setSelected: function (b) {
        BI.CalendarDateItem.superclass.setSelected.apply(this, arguments);
        this.text.setSelected(b);
    },

    getValue: function () {
        return this.text.getValue();
    }
});
BI.shortcut("bi.calendar_date_item", BI.CalendarDateItem);/**
 * Created by GUY on 2015/8/28.
 * @class BI.Calendar
 * @extends BI.Widget
 */
BI.Calendar = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.Calendar.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-calendar",
            logic: {
                dynamic: false
            },
            min: "1900-01-01", // 最小日期
            max: "2099-12-31", // 最大日期
            year: 2015,
            month: 8,
            day: 25
        });
    },

    _dateCreator: function (Y, M, D) {
        var self = this, o = this.options, log = {}, De = BI.getDate();
        var mins = o.min.match(/\d+/g);
        var maxs = o.max.match(/\d+/g);
        Y < (mins[0] | 0) && (Y = (mins[0] | 0));
        Y > (maxs[0] | 0) && (Y = (maxs[0] | 0));

        De.setFullYear(Y, M, D);
        log.ymd = [De.getFullYear(), De.getMonth(), De.getDate()];

        var MD = Date._MD.slice(0);
        MD[1] = BI.isLeapYear(log.ymd[0]) ? 29 : 28;

        // 日期所在月第一天
        De.setFullYear(log.ymd[0], log.ymd[1], 1);
        // 是周几
        log.FDay = De.getDay();

        // 当前月页第一天是几号
        log.PDay = MD[M === 0 ? 11 : M - 1] - log.FDay + 1;
        log.NDay = 1;

        var items = [];
        BI.each(BI.range(42), function (i) {
            var td = {}, YY = log.ymd[0], MM = log.ymd[1] + 1, DD;
            // 上个月的日期
            if (i < log.FDay) {
                td.lastMonth = true;
                DD = i + log.PDay;
                // 上一年
                MM === 1 && (YY -= 1);
                MM = MM === 1 ? 12 : MM - 1;
            } else if (i >= log.FDay && i < log.FDay + MD[log.ymd[1]]) {
                DD = i - log.FDay + 1;
                if (i - log.FDay + 1 === log.ymd[2]) {
                    td.currentDay = true;
                }
            } else {
                td.nextMonth = true;
                DD = log.NDay++;
                MM === 12 && (YY += 1);
                MM = MM === 12 ? 1 : MM + 1;
            }
            if (BI.checkDateVoid(YY, MM, DD, mins, maxs)[0]) {
                td.disabled = true;
            }
            td.text = DD;
            items.push(td);
        });
        return items;
    },

    _init: function () {
        BI.Calendar.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var items = BI.map(Date._SDN.slice(0, 7), function (i, value) {
            return {
                type: "bi.label",
                height: 24,
                text: value
            };
        });
        var title = BI.createWidget({
            type: "bi.button_group",
            height: 44,
            items: items,
            layouts: [{
                type: "bi.center",
                hgap: 5,
                vgap: 10
            }]
        });
        var days = this._dateCreator(o.year, o.month - 1, o.day);
        items = [];
        items.push(days.slice(0, 7));
        items.push(days.slice(7, 14));
        items.push(days.slice(14, 21));
        items.push(days.slice(21, 28));
        items.push(days.slice(28, 35));
        items.push(days.slice(35, 42));

        items = BI.map(items, function (i, item) {
            return BI.map(item, function (j, td) {
                var month = td.lastMonth ? o.month - 1 : (td.nextMonth ? o.month + 1 : o.month);
                return BI.extend(td, {
                    type: "bi.calendar_date_item",
                    textAlign: "center",
                    whiteSpace: "normal",
                    once: false,
                    forceSelected: true,
                    height: 24,
                    value: o.year + "-" + month + "-" + td.text,
                    disabled: td.lastMonth || td.nextMonth || td.disabled,
                    lgap: 5,
                    rgap: 5
                    // selected: td.currentDay
                });
            });
        });

        this.days = BI.createWidget({
            type: "bi.button_group",
            items: BI.createItems(items, {}),
            layouts: [BI.LogicFactory.createLogic("table", BI.extend({}, o.logic, {
                columns: 7,
                rows: 6,
                columnSize: [1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7],
                rowSize: 24,
                vgap: 10
            }))]
        });
        this.days.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        BI.createWidget(BI.extend({
            element: this

        }, BI.LogicFactory.createLogic("vertical", BI.extend({}, o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection("top", title, this.days)
        }))));
    },

    isFrontDate: function () {
        var o = this.options, c = this._const;
        var Y = o.year, M = o.month, De = BI.getDate(), day = De.getDay();
        Y = Y | 0;
        De.setFullYear(Y, M, 1);
        var newDate = De.getOffsetDate(-1 * (day + 1));
        return !!BI.checkDateVoid(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), o.min, o.max)[0];
    },

    isFinalDate: function () {
        var o = this.options, c = this._const;
        var Y = o.year, M = o.month, De = BI.getDate(), day = De.getDay();
        Y = Y | 0;
        De.setFullYear(Y, M, 1);
        var newDate = De.getOffsetDate(42 - day);
        return !!BI.checkDateVoid(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), o.min, o.max)[0];
    },

    setValue: function (ob) {
        this.days.setValue([ob.year + "-" + ob.month + "-" + ob.day]);
    },

    getValue: function () {
        var date = this.days.getValue()[0].match(/\d+/g);
        return {
            year: date[0] | 0,
            month: date[1] | 0,
            day: date[2] | 0
        };
    }
});

BI.extend(BI.Calendar, {
    getPageByDateJSON: function (json) {
        var year = BI.getDate().getFullYear();
        var month = BI.getDate().getMonth();
        var page = (json.year - year) * 12;
        page += json.month - 1 - month;
        return page;
    },
    getDateJSONByPage: function (v) {
        var months = BI.getDate().getMonth();
        var page = v;

        // 对当前page做偏移,使到当前年初
        page = page + months;

        var year = BI.parseInt(page / 12);
        if(page < 0 && page % 12 !== 0) {
            year--;
        }
        var month = page >= 0 ? (page % 12) : ((12 + page % 12) % 12);
        return {
            year: BI.getDate().getFullYear() + year,
            month: month + 1
        };
    }
});

BI.shortcut("bi.calendar", BI.Calendar);/**
 * Created by GUY on 2015/8/28.
 * @class BI.YearCalendar
 * @extends BI.Widget
 */
BI.YearCalendar = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        var conf = BI.YearCalendar.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-year-calendar",
            behaviors: {},
            logic: {
                dynamic: false
            },
            min: "1900-01-01", // 最小日期
            max: "2099-12-31", // 最大日期
            year: null
        });
    },

    _yearCreator: function (Y) {
        var o = this.options;
        Y = Y | 0;
        var start = BI.YearCalendar.getStartYear(Y);
        var items = [];
        BI.each(BI.range(BI.YearCalendar.INTERVAL), function (i) {
            var td = {};
            if (BI.checkDateVoid(start + i, 1, 1, o.min, o.max)[0]) {
                td.disabled = true;
            }
            td.text = start + i;
            items.push(td);
        });
        return items;
    },

    _init: function () {
        BI.YearCalendar.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.currentYear = BI.getDate().getFullYear();
        var years = this._yearCreator(o.year || this.currentYear);

        // 纵向排列年
        var len = years.length, tyears = BI.makeArray(len, "");
        var map = [0, 6, 1, 7, 2, 8, 3, 9, 4, 10, 5, 11];
        BI.each(years, function (i, y) {
            tyears[i] = years[map[i]];
        });
        var items = [];
        items.push(tyears.slice(0, 2));
        items.push(tyears.slice(2, 4));
        items.push(tyears.slice(4, 6));
        items.push(tyears.slice(6, 8));
        items.push(tyears.slice(8, 10));
        items.push(tyears.slice(10, 12));

        items = BI.map(items, function (i, item) {
            return BI.map(item, function (j, td) {
                return BI.extend(td, {
                    type: "bi.text_item",
                    cls: "bi-list-item-active",
                    textAlign: "center",
                    whiteSpace: "normal",
                    once: false,
                    forceSelected: true,
                    height: 24,
                    width: 45,
                    value: td.text,
                    disabled: td.disabled
                });
            });
        });

        this.years = BI.createWidget({
            type: "bi.button_group",
            behaviors: o.behaviors,
            items: BI.createItems(items, {}),
            layouts: [BI.LogicFactory.createLogic("table", BI.extend({}, o.logic, {
                columns: 2,
                rows: 6,
                columnSize: [1 / 2, 1 / 2],
                rowSize: 24
            })), {
                type: "bi.center_adapt",
                vgap: 1
            }]
        });
        this.years.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        BI.createWidget(BI.extend({
            element: this

        }, BI.LogicFactory.createLogic("vertical", BI.extend({}, o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection("top", this.years)
        }))));
    },

    isFrontYear: function () {
        var o = this.options;
        var Y = o.year;
        Y = Y | 0;
        return !!BI.checkDateVoid(BI.YearCalendar.getStartYear(Y) - 1, 1, 1, o.min, o.max)[0];
    },

    isFinalYear: function () {
        var o = this.options, c = this._const;
        var Y = o.year;
        Y = Y | 0;
        return !!BI.checkDateVoid(BI.YearCalendar.getEndYear(Y) + 1, 1, 1, o.min, o.max)[0];
    },

    setValue: function (val) {
        this.years.setValue([val]);
    },

    getValue: function () {
        return this.years.getValue()[0];
    }
});
// 类方法
BI.extend(BI.YearCalendar, {
    INTERVAL: 12,

    // 获取显示的第一年
    getStartYear: function (year) {
        var cur = BI.getDate().getFullYear();
        return year - ((year - cur + 3) % BI.YearCalendar.INTERVAL + 12) % BI.YearCalendar.INTERVAL;
    },

    getEndYear: function (year) {
        return BI.YearCalendar.getStartYear(year) + BI.YearCalendar.INTERVAL - 1;
    },

    getPageByYear: function (year) {
        var cur = BI.getDate().getFullYear();
        year = BI.YearCalendar.getStartYear(year);
        return (year - cur + 3) / BI.YearCalendar.INTERVAL;
    }
});

BI.shortcut("bi.year_calendar", BI.YearCalendar);/**
 * Created by roy on 15/10/16.
 * 右与下箭头切换的树节点
 */
BI.ArrowTreeGroupNodeCheckbox = BI.inherit(BI.IconButton, {
    _defaultConfig: function () {
        return BI.extend(BI.ArrowTreeGroupNodeCheckbox.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-arrow-group-node-checkbox"
        });
    },
    _init: function () {
        BI.ArrowTreeGroupNodeCheckbox.superclass._init.apply(this, arguments);
    },
    setSelected: function (v) {
        BI.ArrowTreeGroupNodeCheckbox.superclass.setSelected.apply(this, arguments);
        if(v) {
            this.element.removeClass("expander-right-font").addClass("expander-down-font");
        } else {
            this.element.removeClass("expander-down-font").addClass("expander-right-font");
        }
    }
});
BI.shortcut("bi.arrow_group_node_checkbox", BI.ArrowTreeGroupNodeCheckbox);/**
 * 十字型的树节点
 * @class BI.CheckingMarkNode
 * @extends BI.IconButton
 */
BI.CheckingMarkNode = BI.inherit(BI.IconButton, {
    _defaultConfig: function () {
        return BI.extend( BI.CheckingMarkNode.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "check-mark-font"
        });
    },
    _init: function () {
        BI.CheckingMarkNode.superclass._init.apply(this, arguments);
        this.setSelected(this.options.selected);

    },
    setSelected: function (v) {
        BI.CheckingMarkNode.superclass.setSelected.apply(this, arguments);
        if(v === true) {
            this.element.addClass("check-mark-font");
        } else {
            this.element.removeClass("check-mark-font");
        }
    }
});
BI.shortcut("bi.checking_mark_node", BI.CheckingMarkNode);/**
 * 十字型的树节点
 * @class BI.FirstTreeNodeCheckbox
 * @extends BI.IconButton
 */
BI.FirstTreeNodeCheckbox = BI.inherit(BI.IconButton, {
    _defaultConfig: function () {
        return BI.extend( BI.FirstTreeNodeCheckbox.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "tree-collapse-icon-type2",
            iconWidth: 24,
            iconHeight: 24
        });
    },
    _init: function () {
        BI.FirstTreeNodeCheckbox.superclass._init.apply(this, arguments);

    },
    setSelected: function (v) {
        BI.FirstTreeNodeCheckbox.superclass.setSelected.apply(this, arguments);
        if(v === true) {
            this.element.addClass("tree-expand-icon-type2");
        } else {
            this.element.removeClass("tree-expand-icon-type2");
        }
    }
});
BI.shortcut("bi.first_tree_node_checkbox", BI.FirstTreeNodeCheckbox);/**
 * 十字型的树节点
 * @class BI.LastTreeNodeCheckbox
 * @extends BI.IconButton
 */
BI.LastTreeNodeCheckbox = BI.inherit(BI.IconButton, {
    _defaultConfig: function () {
        return BI.extend( BI.LastTreeNodeCheckbox.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "tree-collapse-icon-type4",
            iconWidth: 24,
            iconHeight: 24
        });
    },
    _init: function () {
        BI.LastTreeNodeCheckbox.superclass._init.apply(this, arguments);

    },
    setSelected: function (v) {
        BI.LastTreeNodeCheckbox.superclass.setSelected.apply(this, arguments);
        if(v === true) {
            this.element.addClass("tree-expand-icon-type3");
        } else {
            this.element.removeClass("tree-expand-icon-type3");
        }
    }
});
BI.shortcut("bi.last_tree_node_checkbox", BI.LastTreeNodeCheckbox);/**
 * 十字型的树节点
 * @class BI.MidTreeNodeCheckbox
 * @extends BI.IconButton
 */
BI.MidTreeNodeCheckbox = BI.inherit(BI.IconButton, {
    _defaultConfig: function () {
        return BI.extend( BI.MidTreeNodeCheckbox.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "tree-collapse-icon-type3",
            iconWidth: 24,
            iconHeight: 24
        });
    },
    _init: function () {
        BI.MidTreeNodeCheckbox.superclass._init.apply(this, arguments);

    },
    setSelected: function (v) {
        BI.MidTreeNodeCheckbox.superclass.setSelected.apply(this, arguments);
        if(v === true) {
            this.element.addClass("tree-expand-icon-type3");
        } else {
            this.element.removeClass("tree-expand-icon-type3");
        }
    }
});
BI.shortcut("bi.mid_tree_node_checkbox", BI.MidTreeNodeCheckbox);/**
 * 十字型的树节点
 * @class BI.TreeNodeCheckbox
 * @extends BI.IconButton
 */
BI.TreeNodeCheckbox = BI.inherit(BI.IconButton, {
    _defaultConfig: function () {
        return BI.extend( BI.TreeNodeCheckbox.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "tree-collapse-icon-type1",
            iconWidth: 24,
            iconHeight: 24
        });
    },
    _init: function () {
        BI.TreeNodeCheckbox.superclass._init.apply(this, arguments);

    },
    setSelected: function (v) {
        BI.TreeNodeCheckbox.superclass.setSelected.apply(this, arguments);
        if(v) {
            this.element.addClass("tree-expand-icon-type1");
        } else {
            this.element.removeClass("tree-expand-icon-type1");
        }
    }
});
BI.shortcut("bi.tree_node_checkbox", BI.TreeNodeCheckbox);/**
 * 自定义选色
 *
 * Created by GUY on 2015/11/17.
 * @class BI.CustomColorChooser
 * @extends BI.Widget
 */
BI.CustomColorChooser = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.CustomColorChooser.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-custom-color-chooser",
            width: 227,
            height: 245
        });
    },

    _init: function () {
        BI.CustomColorChooser.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget(o.editor, {
            type: "bi.simple_color_picker_editor"
        });
        this.editor.on(BI.ColorPickerEditor.EVENT_CHANGE, function () {
            self.setValue(this.getValue());
        });
        this.farbtastic = BI.createWidget({
            type: "bi.farbtastic"
        });
        this.farbtastic.on(BI.Farbtastic.EVENT_CHANGE, function () {
            self.setValue(this.getValue());
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                type: "bi.absolute",
                items: [{
                    el: this.editor,
                    left: 0,
                    top: 0,
                    right: 0
                }],
                height: 30
            }, {
                type: "bi.absolute",
                items: [{
                    el: this.farbtastic,
                    left: 15,
                    right: 15,
                    top: 7
                }],
                height: 215
            }]
        });
    },

    setValue: function (color) {
        this.editor.setValue(color);
        this.farbtastic.setValue(color);
    },

    getValue: function () {
        return this.editor.getValue();
    }
});
BI.CustomColorChooser.EVENT_CHANGE = "CustomColorChooser.EVENT_CHANGE";
BI.shortcut("bi.custom_color_chooser", BI.CustomColorChooser);/**
 * 选色控件
 *
 * Created by GUY on 2015/11/17.
 * @class BI.ColorChooser
 * @extends BI.Widget
 */
BI.ColorChooser = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.ColorChooser.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-color-chooser",
            value: ""
        });
    },

    _init: function () {
        BI.ColorChooser.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            container: o.container,
            adjustLength: 1,
            isNeedAdjustWidth: false,
            isNeedAdjustHeight: false,
            el: BI.extend({
                type: o.width <= 24 ? "bi.color_chooser_trigger" : "bi.long_color_chooser_trigger",
                ref: function (_ref) {
                    self.trigger = _ref;
                },
                width: o.width,
                height: o.height
            }, o.el),
            popup: {
                el: BI.extend({
                    type: "bi.color_chooser_popup",
                    ref: function (_ref) {
                        self.colorPicker = _ref;
                    },
                    listeners: [{
                        eventName: BI.ColorChooserPopup.EVENT_VALUE_CHANGE,
                        action: function () {
                            fn();
                            if (!self._isRGBColor(self.colorPicker.getValue())) {
                                self.combo.hideView();
                            }
                        }
                    }, {
                        eventName: BI.ColorChooserPopup.EVENT_CHANGE,
                        action: function () {
                            fn();
                            self.combo.hideView();
                        }
                    }]
                }, o.popup),
                stopPropagation: true,
                width: 230
            },
            value: o.value
        });

        var fn = function () {
            var color = self.colorPicker.getValue();
            self.trigger.setValue(color);
            var colors = BI.string2Array(BI.Cache.getItem("colors") || "");
            var que = new BI.Queue(8);
            que.fromArray(colors);
            que.remove(color);
            que.unshift(color);
            BI.Cache.setItem("colors", BI.array2String(que.toArray()));
        };
        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.colorPicker.setStoreColors(BI.string2Array(BI.Cache.getItem("colors") || ""));
        });

        this.combo.on(BI.Combo.EVENT_AFTER_HIDEVIEW, function () {
            self.fireEvent(BI.ColorChooser.EVENT_CHANGE, arguments);
        });
    },

    _isRGBColor: function (color) {
        return BI.isNotEmptyString(color) && color !== "transparent";
    },

    isViewVisible: function () {
        return this.combo.isViewVisible();
    },

    hideView: function () {
        this.combo.hideView();
    },

    showView: function () {
        this.combo.showView();
    },

    setValue: function (color) {
        this.combo.setValue(color);
    },

    getValue: function () {
        return this.combo.getValue();
    }
});
BI.ColorChooser.EVENT_CHANGE = "ColorChooser.EVENT_CHANGE";
BI.shortcut("bi.color_chooser", BI.ColorChooser);/**
 * 选色控件
 *
 * Created by GUY on 2015/11/17.
 * @class BI.ColorChooserPopup
 * @extends BI.Widget
 */
BI.ColorChooserPopup = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-color-chooser-popup",
        width: 230,
        height: 145
    },

    render: function () {
        var self = this, o = this.options;
        this.colorEditor = BI.createWidget(o.editor, {
            type: "bi.color_picker_editor",
            value: o.value,
            cls: "bi-background bi-border-bottom",
            height: 30
        });

        this.colorEditor.on(BI.ColorPickerEditor.EVENT_CHANGE, function () {
            self.setValue(this.getValue());
            self.fireEvent(BI.ColorChooserPopup.EVENT_VALUE_CHANGE, arguments);
        });

        this.storeColors = BI.createWidget({
            type: "bi.color_picker",
            items: [[{
                value: "",
                disabled: true
            }, {
                value: "",
                disabled: true
            }, {
                value: "",
                disabled: true
            }, {
                value: "",
                disabled: true
            }, {
                value: "",
                disabled: true
            }, {
                value: "",
                disabled: true
            }, {
                value: "",
                disabled: true
            }, {
                value: "",
                disabled: true
            }]],
            width: 210,
            height: 24,
            value: o.value
        });
        this.storeColors.on(BI.ColorPicker.EVENT_CHANGE, function () {
            self.setValue(this.getValue()[0]);
            self.fireEvent(BI.ColorChooserPopup.EVENT_CHANGE, arguments);
        });

        this.colorPicker = BI.createWidget({
            type: "bi.color_picker",
            width: 210,
            height: 50,
            value: o.value
        });

        this.colorPicker.on(BI.ColorPicker.EVENT_CHANGE, function () {
            self.setValue(this.getValue()[0]);
            self.fireEvent(BI.ColorChooserPopup.EVENT_CHANGE, arguments);
        });

        this.customColorChooser = BI.createWidget({
            type: "bi.custom_color_chooser",
            editor: o.editor
        });

        var panel = BI.createWidget({
            type: "bi.popup_panel",
            buttons: [BI.i18nText("BI-Basic_Cancel"), BI.i18nText("BI-Basic_Save")],
            title: BI.i18nText("BI-Custom_Color"),
            el: this.customColorChooser,
            stopPropagation: false,
            bgap: -1,
            rgap: 1,
            lgap: 1,
            minWidth: 227
        });

        this.more = BI.createWidget({
            type: "bi.combo",
            container: null,
            direction: "right,top",
            isNeedAdjustHeight: false,
            el: {
                type: "bi.text_item",
                cls: "color-chooser-popup-more bi-list-item",
                textAlign: "center",
                height: 24,
                text: BI.i18nText("BI-Basic_More") + "..."
            },
            popup: panel
        });

        this.more.on(BI.Combo.EVENT_AFTER_POPUPVIEW, function () {
            self.customColorChooser.setValue(self.getValue());
        });
        panel.on(BI.PopupPanel.EVENT_CLICK_TOOLBAR_BUTTON, function (index) {
            switch (index) {
                case 0:
                    self.more.hideView();
                    break;
                case 1:
                    self.setValue(self.customColorChooser.getValue());
                    self.more.hideView();
                    self.fireEvent(BI.ColorChooserPopup.EVENT_CHANGE, arguments);
                    break;
            }
        });

        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.vtape",
                    items: [this.colorEditor, {
                        el: {
                            type: "bi.absolute",
                            items: [{
                                el: this.storeColors,
                                left: 10,
                                right: 10,
                                top: 5
                            }]
                        },
                        height: 29
                    }, {
                        el: {
                            type: "bi.absolute",
                            items: [{
                                el: this.colorPicker,
                                left: 10,
                                right: 10,
                                top: 5,
                                bottom: 5
                            }]
                        },
                        height: 60
                    }, {
                        el: this.more,
                        height: 24
                    }]
                },
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }, {
                el: {
                    type: "bi.layout",
                    cls: "disable-mask",
                    invisible: !o.disabled,
                    ref: function () {
                        self.mask = this;
                    }
                },
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }]
        };
    },

    mounted: function () {
        var self = this;
        var o = this.options;
        if (BI.isNotNull(o.value)) {
            this.setValue(o.value);
        }
    },

    _setEnable: function (enable) {
        BI.ColorChooserPopup.superclass._setEnable.apply(this, arguments);
        this.mask.setVisible(!enable);
    },

    setStoreColors: function (colors) {
        if (BI.isArray(colors)) {
            var items = BI.map(colors, function (i, color) {
                return {
                    value: color
                };
            });
            BI.count(colors.length, 8, function (i) {
                items.push({
                    value: "",
                    disabled: true
                });
            });
            this.storeColors.populate([items]);
        }
    },

    setValue: function (color) {
        this.colorEditor.setValue(color);
        this.colorPicker.setValue(color);
        this.storeColors.setValue(color);
    },

    getValue: function () {
        return this.colorEditor.getValue();
    }
});
BI.ColorChooserPopup.EVENT_VALUE_CHANGE = "ColorChooserPopup.EVENT_VALUE_CHANGE";
BI.ColorChooserPopup.EVENT_CHANGE = "ColorChooserPopup.EVENT_CHANGE";
BI.shortcut("bi.color_chooser_popup", BI.ColorChooserPopup);/**
 * 选色控件
 *
 * Created by GUY on 2015/11/17.
 * @class BI.SimpleColorChooserPopup
 * @extends BI.Widget
 */
BI.SimpleColorChooserPopup = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SimpleColorChooserPopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-color-chooser-popup"
        });
    },

    _init: function () {
        BI.SimpleColorChooserPopup.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.popup = BI.createWidget({
            type: "bi.color_chooser_popup",
            value: o.value,
            element: this,
            editor: {
                type: "bi.simple_color_picker_editor"
            }
        });
        this.popup.on(BI.ColorChooserPopup.EVENT_CHANGE, function () {
            self.fireEvent(BI.SimpleColorChooserPopup.EVENT_CHANGE, arguments);
        });
        this.popup.on(BI.ColorChooserPopup.EVENT_VALUE_CHANGE, function () {
            self.fireEvent(BI.SimpleColorChooserPopup.EVENT_VALUE_CHANGE, arguments);
        });
    },

    setStoreColors: function (colors) {
        this.popup.setStoreColors(colors);
    },

    setValue: function (color) {
        this.popup.setValue(color);
    },

    getValue: function () {
        return this.popup.getValue();
    }
});
BI.SimpleColorChooserPopup.EVENT_VALUE_CHANGE = "ColorChooserPopup.EVENT_VALUE_CHANGE";
BI.SimpleColorChooserPopup.EVENT_CHANGE = "ColorChooserPopup.EVENT_CHANGE";
BI.shortcut("bi.simple_color_chooser_popup", BI.SimpleColorChooserPopup);/**
 * 简单选色控件，没有自动和透明
 *
 * Created by GUY on 2015/11/17.
 * @class BI.SimpleColorChooser
 * @extends BI.Widget
 */
BI.SimpleColorChooser = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SimpleColorChooser.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-simple-color-chooser",
            value: "#ffffff"
        });
    },

    _init: function () {
        BI.SimpleColorChooser.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.combo = BI.createWidget({
            type: "bi.color_chooser",
            element: this,
            container: o.container,
            value: o.value,
            popup: {
                type: "bi.simple_color_chooser_popup"
            }
        });
        this.combo.on(BI.ColorChooser.EVENT_CHANGE, function () {
            self.fireEvent(BI.SimpleColorChooser.EVENT_CHANGE, arguments);
        });
    },

    isViewVisible: function () {
        return this.combo.isViewVisible();
    },

    hideView: function () {
        this.combo.hideView();
    },

    showView: function () {
        this.combo.showView();
    },

    setValue: function (color) {
        this.combo.setValue(color);
    },

    getValue: function () {
        return this.combo.getValue();
    }
});
BI.SimpleColorChooser.EVENT_CHANGE = "ColorChooser.EVENT_CHANGE";
BI.shortcut("bi.simple_color_chooser", BI.SimpleColorChooser);/**
 * 选色控件
 *
 * Created by GUY on 2015/11/17.
 * @class BI.ColorChooserTrigger
 * @extends BI.Trigger
 */
BI.ColorChooserTrigger = BI.inherit(BI.Trigger, {

    _defaultConfig: function () {
        var conf = BI.ColorChooserTrigger.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-color-chooser-trigger bi-border",
            height: 24
        });
    },

    _init: function () {
        BI.ColorChooserTrigger.superclass._init.apply(this, arguments);
        this.colorContainer = BI.createWidget({
            type: "bi.layout",
            cls: "color-chooser-trigger-content" + (BI.isIE9Below() ? " hack" : "")
        });

        var down = BI.createWidget({
            type: "bi.icon_button",
            disableSelected: true,
            cls: "icon-combo-down-icon trigger-triangle-font",
            width: 12,
            height: 8
        });

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.colorContainer,
                left: 3,
                right: 3,
                top: 3,
                bottom: 3
            }, {
                el: down,
                right: -1,
                bottom: 1
            }]
        });
        if (BI.isNotNull(this.options.value)) {
            this.setValue(this.options.value);
        }
    },

    setValue: function (color) {
        BI.ColorChooserTrigger.superclass.setValue.apply(this, arguments);
        if (color === "") {
            this.colorContainer.element.css("background-color", "").removeClass("trans-color-background").addClass("auto-color-background");
        } else if (color === "transparent") {
            this.colorContainer.element.css("background-color", "").removeClass("auto-color-background").addClass("trans-color-background");
        } else {
            this.colorContainer.element.css({"background-color": color}).removeClass("auto-color-background").removeClass("trans-color-background");
        }
    }
});
BI.ColorChooserTrigger.EVENT_CHANGE = "ColorChooserTrigger.EVENT_CHANGE";
BI.shortcut("bi.color_chooser_trigger", BI.ColorChooserTrigger);/**
 * 选色控件
 *
 * Created by GUY on 2015/11/17.
 * @class BI.LongColorChooserTrigger
 * @extends BI.Trigger
 */
BI.LongColorChooserTrigger = BI.inherit(BI.Trigger, {

    _defaultConfig: function () {
        var conf = BI.LongColorChooserTrigger.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-color-chooser-trigger bi-border",
            height: 24
        });
    },

    _init: function () {
        BI.LongColorChooserTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.colorContainer = BI.createWidget({
            type: "bi.htape",
            cls: "color-chooser-trigger-content",
            items: [{
                type: "bi.icon_change_button",
                ref: function (_ref) {
                    self.changeIcon = _ref;
                },
                iconCls: "auto-color-icon",
                width: 24,
                iconWidth: 16,
                iconHeight: 16
            }, {
                el: {
                    type: "bi.label",
                    ref: function (_ref) {
                        self.label = _ref;
                    },
                    textAlign: "left",
                    hgap: 5,
                    height: 18,
                    text: BI.i18nText("BI-Basic_Auto")
                }
            }]
        });

        var down = BI.createWidget({
            type: "bi.icon_button",
            disableSelected: true,
            cls: "icon-combo-down-icon trigger-triangle-font",
            width: 12,
            height: 8
        });

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.colorContainer,
                left: 3,
                right: 3,
                top: 3,
                bottom: 3
            }, {
                el: down,
                right: 3,
                bottom: 3
            }]
        });
        if (this.options.value) {
            this.setValue(this.options.value);
        }
    },

    setValue: function (color) {
        BI.LongColorChooserTrigger.superclass.setValue.apply(this, arguments);
        if (color === "") {
            this.colorContainer.element.css("background-color", "");
            this.changeIcon.setVisible(true);
            this.label.setVisible(true);
            this.changeIcon.setIcon("auto-color-icon");
            this.label.setText(BI.i18nText("BI-Basic_Auto"));
        } else if (color === "transparent") {
            this.colorContainer.element.css("background-color", "");
            this.changeIcon.setVisible(true);
            this.label.setVisible(true);
            this.changeIcon.setIcon("trans-color-icon");
            this.label.setText(BI.i18nText("BI-Transparent_Color"));
        } else {
            this.colorContainer.element.css({"background-color": color});
            this.changeIcon.setVisible(false);
            this.label.setVisible(false);
        }
    }
});
BI.LongColorChooserTrigger.EVENT_CHANGE = "ColorChooserTrigger.EVENT_CHANGE";
BI.shortcut("bi.long_color_chooser_trigger", BI.LongColorChooserTrigger);/**
 * 简单选色控件按钮
 *
 * Created by GUY on 2015/11/16.
 * @class BI.ColorPickerButton
 * @extends BI.BasicButton
 */
BI.ColorPickerButton = BI.inherit(BI.BasicButton, {

    _defaultConfig: function () {
        var conf = BI.ColorPickerButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-color-picker-button bi-background bi-border-top bi-border-left"
        });
    },

    _init: function () {
        BI.ColorPickerButton.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        if (o.value) {
            this.element.css("background-color", o.value);
            var name = this.getName();
            this.element.hover(function () {
                self._createMask();
                if (self.isEnabled()) {
                    BI.Maskers.show(name);
                }
            }, function () {
                if (!self.isSelected()) {
                    BI.Maskers.hide(name);
                }
            });
        }
    },

    _createMask: function () {
        var o = this.options, name = this.getName();
        if (this.isEnabled() && !BI.Maskers.has(name)) {
            var w = BI.Maskers.make(name, this, {
                offset: {
                    left: -1,
                    top: -1,
                    right: -1,
                    bottom: -1
                }
            });
            w.element.addClass("color-picker-button-mask").css("background-color", o.value);
        }
    },

    setSelected: function (b) {
        BI.ColorPickerButton.superclass.setSelected.apply(this, arguments);
        if (b) {
            this._createMask();
        }
        BI.Maskers[b ? "show" : "hide"](this.getName());
    }
});
BI.ColorPickerButton.EVENT_CHANGE = "ColorPickerButton.EVENT_CHANGE";
BI.shortcut("bi.color_picker_button", BI.ColorPickerButton);/**
 * 简单选色控件
 *
 * Created by GUY on 2015/11/16.
 * @class BI.ColorPicker
 * @extends BI.Widget
 */
BI.ColorPicker = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.ColorPicker.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-color-picker",
            items: null
        });
    },

    _items: [
        [{
            value: "#ffffff"
        }, {
            value: "#f2f2f2"
        }, {
            value: "#e5e5e5"
        }, {
            value: "#d9d9d9"
        }, {
            value: "#cccccc"
        }, {
            value: "#bfbfbf"
        }, {
            value: "#b2b2b2"
        }, {
            value: "#a6a6a6"
        }, {
            value: "#999999"
        }, {
            value: "#8c8c8c"
        }, {
            value: "#808080"
        }, {
            value: "#737373"
        }, {
            value: "#666666"
        }, {
            value: "#4d4d4d"
        }, {
            value: "#333333"
        }, {
            value: "#000000"
        }],
        [{
            value: "#d8b5a6"
        }, {
            value: "#ff9e9a"
        }, {
            value: "#ffc17d"
        }, {
            value: "#f5e56b"
        }, {
            value: "#d8e698"
        }, {
            value: "#e0ebaf"
        }, {
            value: "#c3d825"
        }, {
            value: "#bce2e8"
        }, {
            value: "#85d3cd"
        }, {
            value: "#bce2e8"
        }, {
            value: "#a0d8ef"
        }, {
            value: "#89c3eb"
        }, {
            value: "#bbc8e6"
        }, {
            value: "#bbbcde"
        }, {
            value: "#d6b4cc"
        }, {
            value: "#fbc0d3"
        }],
        [{
            value: "#bb9581"
        }, {
            value: "#f37d79"
        }, {
            value: "#fba74f"
        }, {
            value: "#ffdb4f"
        }, {
            value: "#c7dc68"
        }, {
            value: "#b0ca71"
        }, {
            value: "#99ab4e"
        }, {
            value: "#84b9cb"
        }, {
            value: "#00a3af"
        }, {
            value: "#2ca9e1"
        }, {
            value: "#0095d9"
        }, {
            value: "#4c6cb3"
        }, {
            value: "#8491c3"
        }, {
            value: "#a59aca"
        }, {
            value: "#cc7eb1"
        }, {
            value: "#e89bb4"
        }],
        [{
            value: "#9d775f"
        }, {
            value: "#dd4b4b"
        }, {
            value: "#ef8b07"
        }, {
            value: "#fcc800"
        }, {
            value: "#aacf53"
        }, {
            value: "#82ae46"
        }, {
            value: "#69821b"
        }, {
            value: "#59b9c6"
        }, {
            value: "#2a83a2"
        }, {
            value: "#007bbb"
        }, {
            value: "#19448e"
        }, {
            value: "#274a78"
        }, {
            value: "#4a488e"
        }, {
            value: "#7058a3"
        }, {
            value: "#884898"
        }, {
            value: "#d47596"
        }]
    ],

    _init: function () {
        BI.ColorPicker.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.colors = BI.createWidget({
            type: "bi.button_group",
            element: this,
            items: BI.createItems(o.items || this._items, {
                type: "bi.color_picker_button",
                once: false
            }),
            layouts: [{
                type: "bi.grid"
            }],
            value: o.value
        });
        this.colors.on(BI.ButtonGroup.EVENT_CHANGE, function () {
            self.fireEvent(BI.ColorPicker.EVENT_CHANGE, arguments);
        });
    },

    populate: function (items) {
        var args  = [].slice.call(arguments);
        args[0] = BI.createItems(items, {
            type: "bi.color_picker_button",
            once: false
        });
        this.colors.populate.apply(this.colors, args);
    },

    setValue: function (color) {
        this.colors.setValue(color);
    },

    getValue: function () {
        return this.colors.getValue();
    }
});
BI.ColorPicker.EVENT_CHANGE = "ColorPicker.EVENT_CHANGE";
BI.shortcut("bi.color_picker", BI.ColorPicker);/**
 * 简单选色控件
 *
 * Created by GUY on 2015/11/16.
 * @class BI.ColorPickerEditor
 * @extends BI.Widget
 */
BI.ColorPickerEditor = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.ColorPickerEditor.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-color-picker-editor",
            // width: 200,
            height: 30
        });
    },

    _init: function () {
        BI.ColorPickerEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.storeValue = {};
        this.colorShow = BI.createWidget({
            type: "bi.layout",
            cls: "color-picker-editor-display bi-card bi-border",
            height: 16,
            width: 16
        });
        var RGB = BI.createWidgets(BI.createItems([{text: "R"}, {text: "G"}, {text: "B"}], {
            type: "bi.label",
            cls: "color-picker-editor-label",
            width: 20,
            height: 20
        }));

        var checker = function (v) {
            return BI.isNumeric(v) && (v | 0) >= 0 && (v | 0) <= 255;
        };
        var Ws = BI.createWidgets([{}, {}, {}], {
            type: "bi.small_text_editor",
            cls: "color-picker-editor-input",
            validationChecker: checker,
            errorText: BI.i18nText("BI-Color_Picker_Error_Text"),
            allowBlank: true,
            value: 255,
            width: 32,
            height: 20
        });
        BI.each(Ws, function (i, w) {
            w.on(BI.TextEditor.EVENT_CHANGE, function () {
                self._checkEditors();
                if (checker(self.storeValue.r) && checker(self.storeValue.g) && checker(self.storeValue.b)) {
                    self.colorShow.element.css("background-color", self.getValue());
                    self.fireEvent(BI.ColorPickerEditor.EVENT_CHANGE);
                }
            });
        });
        this.R = Ws[0];
        this.G = Ws[1];
        this.B = Ws[2];

        this.none = BI.createWidget({
            type: "bi.icon_button",
            cls: "auto-color-icon",
            width: 24,
            height: 24,
            iconWidth: 16,
            iconHeight: 16,
            title: BI.i18nText("BI-Basic_Auto")
        });
        this.none.on(BI.IconButton.EVENT_CHANGE, function () {
            if (this.isSelected()) {
                self.lastColor = self.getValue();
                self.setValue("");
            } else {
                self.setValue(self.lastColor || "#ffffff");
            }
            if ((self.R.isValid() && self.G.isValid() && self.B.isValid()) || self._isEmptyRGB()) {
                self.colorShow.element.css("background-color", self.getValue());
                self.fireEvent(BI.ColorPickerEditor.EVENT_CHANGE);
            }
        });

        this.transparent = BI.createWidget({
            type: "bi.icon_button",
            cls: "trans-color-icon",
            width: 24,
            height: 24,
            iconWidth: 16,
            iconHeight: 16,
            title: BI.i18nText("BI-Transparent_Color")
        });
        this.transparent.on(BI.IconButton.EVENT_CHANGE, function () {
            if (this.isSelected()) {
                self.lastColor = self.getValue();
                self.setValue("transparent");
            } else {
                if (self.lastColor === "transparent") {
                    self.lastColor = "";
                }
                self.setValue(self.lastColor || "#ffffff");
            }
            if ((self.R.isValid() && self.G.isValid() && self.B.isValid()) ||
                self._isEmptyRGB()) {
                self.colorShow.element.css("background-color", self.getValue());
                self.fireEvent(BI.ColorPickerEditor.EVENT_CHANGE);
            }
        });

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.vertical_adapt",
                    items: [{
                        el: this.colorShow,
                        width: 16
                    }, {
                        el: RGB[0],
                        width: 20
                    }, {
                        el: this.R,
                        width: 30
                    }, {
                        el: RGB[1],
                        width: 20
                    }, {
                        el: this.G,
                        width: 30
                    }, {
                        el: RGB[2],
                        width: 20
                    }, {
                        el: this.B,
                        width: 30
                    }, {
                        el: this.transparent,
                        width: 24
                    }, {
                        el: this.none,
                        width: 24
                    }]
                },
                left: 10,
                right: 20,
                top: 0,
                bottom: 0
            }]
        });
    },

    _checkEditors: function () {
        if(BI.isEmptyString(this.R.getValue())) {
            this.R.setValue(0);
        }
        if(BI.isEmptyString(this.G.getValue())) {
            this.G.setValue(0);
        }
        if(BI.isEmptyString(this.B.getValue())) {
            this.B.setValue(0);
        }
        this.storeValue = {
            r: this.R.getValue() || 0,
            g: this.G.getValue() || 0,
            b: this.B.getValue() || 0
        };
    },

    _isEmptyRGB: function () {
        return BI.isEmptyString(this.storeValue.r) && BI.isEmptyString(this.storeValue.g) && BI.isEmptyString(this.storeValue.b);
    },

    _showPreColor: function (color) {
        if (color === "") {
            this.colorShow.element.css("background-color", "").removeClass("trans-color-background").addClass("auto-color-normal-background");
        } else if (color === "transparent") {
            this.colorShow.element.css("background-color", "").removeClass("auto-color-normal-background").addClass("trans-color-background");
        } else {
            this.colorShow.element.css({"background-color": color}).removeClass("auto-color-normal-background").removeClass("trans-color-background");
        }
    },

    _setEnable: function (enable) {
        BI.ColorPickerEditor.superclass._setEnable.apply(this, arguments);
        if (enable === true) {
            this.element.removeClass("base-disabled disabled");
        } else if (enable === false) {
            this.element.addClass("base-disabled disabled");
        }
    },

    setValue: function (color) {
        if (color === "transparent") {
            this.transparent.setSelected(true);
            this.none.setSelected(false);
            this._showPreColor("transparent");
            this.R.setValue("");
            this.G.setValue("");
            this.B.setValue("");
            this.storeValue = {
                r: "",
                g: "",
                b: ""
            };
            return;
        }
        if (!color) {
            color = "";
            this.none.setSelected(true);
        } else {
            this.none.setSelected(false);
        }
        this.transparent.setSelected(false);
        this._showPreColor(color);
        var json = BI.DOM.rgb2json(BI.DOM.hex2rgb(color));
        this.storeValue = {
            r: BI.isNull(json.r) ? "" : json.r,
            g: BI.isNull(json.r) ? "" : json.g,
            b: BI.isNull(json.r) ? "" : json.b
        };
        this.R.setValue(this.storeValue.r);
        this.G.setValue(this.storeValue.g);
        this.B.setValue(this.storeValue.b);
    },

    getValue: function () {
        if (this._isEmptyRGB() && this.transparent.isSelected()) {
            return "transparent";
        }
        return BI.DOM.rgb2hex(BI.DOM.json2rgb({
            r: this.storeValue.r,
            g: this.storeValue.g,
            b: this.storeValue.b
        }));
    }
});
BI.ColorPickerEditor.EVENT_CHANGE = "ColorPickerEditor.EVENT_CHANGE";
BI.shortcut("bi.color_picker_editor", BI.ColorPickerEditor);/**
 * 简单选色控件
 *
 * Created by GUY on 2015/11/16.
 * @class BI.SimpleColorPickerEditor
 * @extends BI.Widget
 */
BI.SimpleColorPickerEditor = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SimpleColorPickerEditor.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-color-picker-editor",
            // width: 200,
            height: 30
        });
    },

    _init: function () {
        BI.SimpleColorPickerEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.colorShow = BI.createWidget({
            type: "bi.layout",
            cls: "color-picker-editor-display bi-card bi-border",
            height: 16,
            width: 16
        });
        var RGB = BI.createWidgets(BI.createItems([{text: "R"}, {text: "G"}, {text: "B"}], {
            type: "bi.label",
            cls: "color-picker-editor-label",
            width: 20,
            height: 20
        }));

        var checker = function (v) {
            return BI.isNumeric(v) && (v | 0) >= 0 && (v | 0) <= 255;
        };
        var Ws = BI.createWidgets([{}, {}, {}], {
            type: "bi.small_text_editor",
            cls: "color-picker-editor-input",
            validationChecker: checker,
            errorText: BI.i18nText("BI-Color_Picker_Error_Text"),
            allowBlank: true,
            value: 255,
            width: 32,
            height: 20
        });
        BI.each(Ws, function (i, w) {
            w.on(BI.TextEditor.EVENT_CHANGE, function () {
                if (self.R.isValid() && self.G.isValid() && self.B.isValid()) {
                    self.colorShow.element.css("background-color", self.getValue());
                    self.fireEvent(BI.SimpleColorPickerEditor.EVENT_CHANGE);
                }
            });
        });
        this.R = Ws[0];
        this.G = Ws[1];
        this.B = Ws[2];

        BI.createWidget({
            type: "bi.vertical_adapt",
            element: this,
            items: [{
                el: this.colorShow,
                width: 16,
                lgap: 20,
                rgap: 15
            }, {
                el: RGB[0],
                width: 20
            }, {
                el: this.R,
                width: 30
            }, {
                el: RGB[1],
                width: 20
            }, {
                el: this.G,
                width: 30
            }, {
                el: RGB[2],
                width: 20
            }, {
                el: this.B,
                width: 30
            }]
        });
    },

    setValue: function (color) {
        this.colorShow.element.css({"background-color": color});
        var json = BI.DOM.rgb2json(BI.DOM.hex2rgb(color));
        this.R.setValue(BI.isNull(json.r) ? "" : json.r);
        this.G.setValue(BI.isNull(json.g) ? "" : json.g);
        this.B.setValue(BI.isNull(json.b) ? "" : json.b);
    },

    getValue: function () {
        return BI.DOM.rgb2hex(BI.DOM.json2rgb({
            r: this.R.getValue(),
            g: this.G.getValue(),
            b: this.B.getValue()
        }));
    }
});
BI.SimpleColorPickerEditor.EVENT_CHANGE = "SimpleColorPickerEditor.EVENT_CHANGE";
BI.shortcut("bi.simple_color_picker_editor", BI.SimpleColorPickerEditor);/**
 * 选色控件
 *
 * Created by GUY on 2015/11/16.
 * @class BI.Farbtastic
 * @extends BI.Widget
 */
BI.Farbtastic = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.Farbtastic.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-farbtastic",
            width: 195,
            height: 195
        });
    },

    _init: function () {
        BI.Farbtastic.superclass._init.apply(this, arguments);
    },

    mounted: function () {
        var self = this;
        this.farbtastic = $.farbtastic(this.element, function (v) {
            self.fireEvent(BI.Farbtastic.EVENT_CHANGE, self.getValue(), self);
        });
    },

    setValue: function (color) {
        this.farbtastic.setColor(color);
    },

    getValue: function () {
        return this.farbtastic.color;
    }
});
BI.Farbtastic.EVENT_CHANGE = "Farbtastic.EVENT_CHANGE";
BI.shortcut("bi.farbtastic", BI.Farbtastic);/**
 * Farbtastic Color Picker 1.2
 * © 2008 Steven Wittens
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 */

jQuery.fn.farbtastic = function (callback) {
    $.farbtastic(this, callback);
    return this;
};

jQuery.farbtastic = function (container, callback) {
    var container = $(container).get(0);
    return container.farbtastic || (container.farbtastic = new jQuery._farbtastic(container, callback));
};

jQuery._farbtastic = function (container, callback) {
    // Store farbtastic object
    var fb = this;

    // Insert markup
    $(container).html("<div class=\"farbtastic\"><div class=\"color\"></div><div class=\"wheel\"></div><div class=\"overlay\"></div><div class=\"h-marker marker\"></div><div class=\"sl-marker marker\"></div></div>");
    var e = $(".farbtastic", container);
    fb.wheel = $(".wheel", container).get(0);
    // Dimensions
    fb.radius = 84;
    fb.square = 100;
    fb.width = 194;

    // Fix background PNGs in IE6
    if (navigator.appVersion.match(/MSIE [0-6]\./)) {
        $("*", e).each(function () {
            if (this.currentStyle.backgroundImage != "none") {
                var image = this.currentStyle.backgroundImage;
                image = this.currentStyle.backgroundImage.substring(5, image.length - 2);
                $(this).css({
                    backgroundImage: "none",
                    filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='" + image + "')"
                });
            }
        });
    }

    /**
   * Link to the given element(s) or callback.
   */
    fb.linkTo = function (callback) {
    // Unbind previous nodes
        if (typeof fb.callback === "object") {
            $(fb.callback).unbind("keyup", fb.updateValue);
        }

        // Reset color
        fb.color = null;

        // Bind callback or elements
        if (typeof callback === "function") {
            fb.callback = callback;
        } else if (typeof callback === "object" || typeof callback === "string") {
            fb.callback = $(callback);
            fb.callback.bind("keyup", fb.updateValue);
            if (fb.callback.get(0).value) {
                fb.setColor(fb.callback.get(0).value);
            }
        }
        return this;
    };
    fb.updateValue = function (event) {
        if (this.value && this.value != fb.color) {
            fb.setColor(this.value);
        }
    };

    /**
   * Change color with HTML syntax #123456
   */
    fb.setColor = function (color) {
        var unpack = fb.unpack(color);
        if (fb.color != color && unpack) {
            fb.color = color;
            fb.rgb = unpack;
            fb.hsl = fb.RGBToHSL(fb.rgb);
            fb.updateDisplay();
        }
        return this;
    };

    /**
   * Change color with HSL triplet [0..1, 0..1, 0..1]
   */
    fb.setHSL = function (hsl) {
        fb.hsl = hsl;
        fb.rgb = fb.HSLToRGB(hsl);
        fb.color = fb.pack(fb.rgb);
        fb.updateDisplay();
        return this;
    };

    // ///////////////////////////////////////////////////

    /**
   * Retrieve the coordinates of the given event relative to the center
   * of the widget.
   */
    fb.widgetCoords = function (event) {
        var x, y;
        var el = event.target || event.srcElement;
        var reference = fb.wheel;

        if (typeof event.offsetX !== "undefined") {
            // Use offset coordinates and find common offsetParent
            var pos = { x: event.offsetX, y: event.offsetY };

            // Send the coordinates upwards through the offsetParent chain.
            var e = el;
            while (e) {
                e.mouseX = pos.x;
                e.mouseY = pos.y;
                pos.x += e.offsetLeft;
                pos.y += e.offsetTop;
                e = e.offsetParent;
            }

            // Look for the coordinates starting from the wheel widget.
            var e = reference;
            var offset = { x: 0, y: 0 };
            while (e) {
                if (typeof e.mouseX !== "undefined") {
                    x = e.mouseX - offset.x;
                    y = e.mouseY - offset.y;
                    break;
                }
                offset.x += e.offsetLeft;
                offset.y += e.offsetTop;
                e = e.offsetParent;
            }

            // Reset stored coordinates
            e = el;
            while (e) {
                e.mouseX = undefined;
                e.mouseY = undefined;
                e = e.offsetParent;
            }
        } else {
            // Use absolute coordinates
            var pos = fb.absolutePosition(reference);
            x = (event.pageX || 0 * (event.clientX + $("html").get(0).scrollLeft)) - pos.x;
            y = (event.pageY || 0 * (event.clientY + $("html").get(0).scrollTop)) - pos.y;
        }
        // Subtract distance to middle
        return { x: x - fb.width / 2, y: y - fb.width / 2 };
    };

    /**
   * Mousedown handler
   */
    fb.click = function (event) {
    // Capture mouse
    // if (!document.dragging) {
    //   $(document).bind('mousemove', fb.mousemove).bind('mouseup', fb.mouseup);
    //   document.dragging = true;
    // }

    // Check which area is being dragged
        var pos = fb.widgetCoords(event);
        fb.circleDrag = Math.max(Math.abs(pos.x), Math.abs(pos.y)) * 2 > fb.square;

        // Process
        fb.mousemove(event);
        return false;
    };

    /**
   * Mousemove handler
   */
    fb.mousemove = function (event) {
    // Get coordinates relative to color picker center
        var pos = fb.widgetCoords(event);

        // Set new HSL parameters
        if (fb.circleDrag) {
            var hue = Math.atan2(pos.x, -pos.y) / 6.28;
            if (hue < 0) hue += 1;
            fb.setHSL([hue, fb.hsl[1], fb.hsl[2]]);
        } else {
            var sat = Math.max(0, Math.min(1, -(pos.x / fb.square) + .5));
            var lum = Math.max(0, Math.min(1, -(pos.y / fb.square) + .5));
            fb.setHSL([fb.hsl[0], sat, lum]);
        }
        return false;
    };

    /**
   * Mouseup handler
   */
    // fb.mouseup = function () {
    //   // Uncapture mouse
    //   $(document).unbind('mousemove', fb.mousemove);
    //   $(document).unbind('mouseup', fb.mouseup);
    //   document.dragging = false;
    // }

    /**
   * Update the markers and styles
   */
    fb.updateDisplay = function () {
    // Markers
        var angle = fb.hsl[0] * 6.28;
        $(".h-marker", e).css({
            left: Math.round(Math.sin(angle) * fb.radius + fb.width / 2) + "px",
            top: Math.round(-Math.cos(angle) * fb.radius + fb.width / 2) + "px"
        });

        $(".sl-marker", e).css({
            left: Math.round(fb.square * (.5 - fb.hsl[1]) + fb.width / 2) + "px",
            top: Math.round(fb.square * (.5 - fb.hsl[2]) + fb.width / 2) + "px"
        });

        // Saturation/Luminance gradient
        $(".color", e).css("backgroundColor", fb.pack(fb.HSLToRGB([fb.hsl[0], 1, 0.5])));

        // Linked elements or callback
        if (typeof fb.callback === "object") {
            // Set background/foreground color
            $(fb.callback).css({
                backgroundColor: fb.color,
                color: fb.hsl[2] > 0.5 ? "#000" : "#fff"
            });

            // Change linked value
            $(fb.callback).each(function () {
                if (this.value && this.value != fb.color) {
                    this.value = fb.color;
                }
            });
        } else if (typeof fb.callback === "function") {
            fb.callback.call(fb, fb.color);
        }
    };

    /**
   * Get absolute position of element
   */
    fb.absolutePosition = function (el) {
        var r = { x: el.offsetLeft, y: el.offsetTop };
        // Resolve relative to offsetParent
        if (el.offsetParent) {
            var tmp = fb.absolutePosition(el.offsetParent);
            r.x += tmp.x;
            r.y += tmp.y;
        }
        return r;
    };

    /* Various color utility functions */
    fb.pack = function (rgb) {
        var r = Math.round(rgb[0] * 255);
        var g = Math.round(rgb[1] * 255);
        var b = Math.round(rgb[2] * 255);
        return "#" + (r < 16 ? "0" : "") + r.toString(16) +
           (g < 16 ? "0" : "") + g.toString(16) +
           (b < 16 ? "0" : "") + b.toString(16);
    };

    fb.unpack = function (color) {
        if (color.length == 7) {
            return [parseInt("0x" + color.substring(1, 3)) / 255,
                parseInt("0x" + color.substring(3, 5)) / 255,
                parseInt("0x" + color.substring(5, 7)) / 255];
        } else if (color.length == 4) {
            return [parseInt("0x" + color.substring(1, 2)) / 15,
                parseInt("0x" + color.substring(2, 3)) / 15,
                parseInt("0x" + color.substring(3, 4)) / 15];
        }
    };

    fb.HSLToRGB = function (hsl) {
        var m1, m2, r, g, b;
        var h = hsl[0], s = hsl[1], l = hsl[2];
        m2 = (l <= 0.5) ? l * (s + 1) : l + s - l * s;
        m1 = l * 2 - m2;
        return [this.hueToRGB(m1, m2, h + 0.33333),
            this.hueToRGB(m1, m2, h),
            this.hueToRGB(m1, m2, h - 0.33333)];
    };

    fb.hueToRGB = function (m1, m2, h) {
        h = (h < 0) ? h + 1 : ((h > 1) ? h - 1 : h);
        if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
        if (h * 2 < 1) return m2;
        if (h * 3 < 2) return m1 + (m2 - m1) * (0.66666 - h) * 6;
        return m1;
    };

    fb.RGBToHSL = function (rgb) {
        var min, max, delta, h, s, l;
        var r = rgb[0], g = rgb[1], b = rgb[2];
        min = Math.min(r, Math.min(g, b));
        max = Math.max(r, Math.max(g, b));
        delta = max - min;
        l = (min + max) / 2;
        s = 0;
        if (l > 0 && l < 1) {
            s = delta / (l < 0.5 ? (2 * l) : (2 - 2 * l));
        }
        h = 0;
        if (delta > 0) {
            if (max == r && max != g) h += (g - b) / delta;
            if (max == g && max != b) h += (2 + (b - r) / delta);
            if (max == b && max != r) h += (4 + (r - g) / delta);
            h /= 6;
        }
        return [h, s, l];
    };

    // Install mousedown handler (the others are set on the document on-demand)
    $("*", e).click(fb.click);

    // Init color
    fb.setColor("#000000");

    // Set linked elements/callback
    if (callback) {
        fb.linkTo(callback);
    }
};/**
 * Created by GUY on 2017/2/8.
 *
 * @class BI.BubbleCombo
 * @extends BI.Widget
 */
BI.BubbleCombo = BI.inherit(BI.Widget, {
    _const: {
        TRIANGLE_LENGTH: 6
    },
    _defaultConfig: function () {
        return BI.extend(BI.BubbleCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-bubble-combo",
            trigger: "click",
            toggle: true,
            direction: "bottom", // top||bottom||left||right||top,left||top,right||bottom,left||bottom,right
            isDefaultInit: false,
            destroyWhenHide: false,
            isNeedAdjustHeight: true, // 是否需要高度调整
            isNeedAdjustWidth: true,
            stopPropagation: false,
            adjustLength: 0, // 调整的距离
            // adjustXOffset: 0,
            // adjustYOffset: 10,
            hideChecker: BI.emptyFn,
            offsetStyle: "left", // left,right,center
            el: {},
            popup: {}
        });
    },
    _init: function () {
        BI.BubbleCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            trigger: o.trigger,
            toggle: o.toggle,
            container: o.container,
            direction: o.direction,
            isDefaultInit: o.isDefaultInit,
            destroyWhenHide: o.destroyWhenHide,
            isNeedAdjustHeight: o.isNeedAdjustHeight,
            isNeedAdjustWidth: o.isNeedAdjustWidth,
            adjustLength: this._getAdjustLength(),
            stopPropagation: o.stopPropagation,
            adjustXOffset: 0,
            adjustYOffset: 0,
            hideChecker: o.hideChecker,
            offsetStyle: o.offsetStyle,
            el: o.el,
            popup: BI.extend({
                type: "bi.bubble_popup_view"
            }, o.popup)
        });
        this.combo.on(BI.Combo.EVENT_TRIGGER_CHANGE, function () {
            self.fireEvent(BI.BubbleCombo.EVENT_TRIGGER_CHANGE, arguments);
        });
        this.combo.on(BI.Combo.EVENT_CHANGE, function () {
            self.fireEvent(BI.BubbleCombo.EVENT_CHANGE, arguments);
        });
        this.combo.on(BI.Combo.EVENT_EXPAND, function () {
            self.fireEvent(BI.BubbleCombo.EVENT_EXPAND, arguments);
        });
        this.combo.on(BI.Combo.EVENT_COLLAPSE, function () {
            self.fireEvent(BI.BubbleCombo.EVENT_COLLAPSE, arguments);
        });
        this.combo.on(BI.Combo.EVENT_AFTER_INIT, function () {
            self.fireEvent(BI.BubbleCombo.EVENT_AFTER_INIT, arguments);
        });
        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.fireEvent(BI.BubbleCombo.EVENT_BEFORE_POPUPVIEW, arguments);
        });
        this.combo.on(BI.Combo.EVENT_AFTER_POPUPVIEW, function () {
            self._showTriangle();
            self.fireEvent(BI.BubbleCombo.EVENT_AFTER_POPUPVIEW, arguments);
        });
        this.combo.on(BI.Combo.EVENT_BEFORE_HIDEVIEW, function () {
            self._hideTriangle();
            self.fireEvent(BI.BubbleCombo.EVENT_BEFORE_HIDEVIEW, arguments);
        });
        this.combo.on(BI.Combo.EVENT_AFTER_HIDEVIEW, function () {
            self.fireEvent(BI.BubbleCombo.EVENT_AFTER_HIDEVIEW, arguments);
        });
    },

    _getAdjustLength: function () {
        return this._const.TRIANGLE_LENGTH + this.options.adjustLength;
    },

    _createTriangle: function (direction) {
        var pos = {}, op = {};
        var adjustLength = this.options.adjustLength;
        var offset = this.element.offset();
        var left = offset.left, right = offset.left + this.element.outerWidth();
        var top = offset.top, bottom = offset.top + this.element.outerHeight();
        switch (direction) {
            case "left":
                pos = {
                    top: top,
                    height: this.element.outerHeight(),
                    left: left - adjustLength - this._const.TRIANGLE_LENGTH
                };
                op = {width: this._const.TRIANGLE_LENGTH};
                break;
            case "right":
                pos = {
                    top: top,
                    height: this.element.outerHeight(),
                    left: right + adjustLength
                };
                op = {width: this._const.TRIANGLE_LENGTH};
                break;
            case "top":
                pos = {
                    left: left,
                    width: this.element.outerWidth(),
                    top: top - adjustLength - this._const.TRIANGLE_LENGTH
                };
                op = {height: this._const.TRIANGLE_LENGTH};
                break;
            case "bottom":
                pos = {
                    left: left,
                    width: this.element.outerWidth(),
                    top: bottom + adjustLength
                };
                op = {height: this._const.TRIANGLE_LENGTH};
                break;
            default:
                break;
        }
        this.triangle && this.triangle.destroy();
        this.triangle = BI.createWidget(op, {
            type: "bi.center_adapt",
            cls: "button-combo-triangle-wrapper",
            items: [{
                type: "bi.layout",
                cls: "bubble-combo-triangle-" + direction + " bi-high-light-border"
            }]
        });
        pos.el = this.triangle;
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [pos]
        });
    },

    _createLeftTriangle: function () {
        this._createTriangle("left");
    },

    _createRightTriangle: function () {
        this._createTriangle("right");
    },

    _createTopTriangle: function () {
        this._createTriangle("top");
    },

    _createBottomTriangle: function () {
        this._createTriangle("bottom");
    },

    _showTriangle: function () {
        var pos = this.combo.getPopupPosition();
        switch (pos.dir) {
            case "left,top":
            case "left,bottom":
                this._createLeftTriangle();
                //this.combo.getView().showLine("right");
                break;
            case "right,top":
            case "right,bottom":
                this._createRightTriangle();
                //this.combo.getView().showLine("left");
                break;
            case "top,left":
            case "top,right":
                this._createTopTriangle();
                //this.combo.getView().showLine("bottom");
                break;
            case "bottom,left":
            case "bottom,right":
                this._createBottomTriangle();
                //this.combo.getView().showLine("top");
                break;
        }
    },

    _hideTriangle: function () {
        this.triangle && this.triangle.destroy();
        this.triangle = null;
        //this.combo.getView() && this.combo.getView().hideLine();
    },

    hideView: function () {
        this._hideTriangle();
        this.combo && this.combo.hideView();
    },

    showView: function () {
        this.combo && this.combo.showView();
    },

    isViewVisible: function () {
        return this.combo.isViewVisible();
    }
});

BI.BubbleCombo.EVENT_TRIGGER_CHANGE = "EVENT_TRIGGER_CHANGE";
BI.BubbleCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.BubbleCombo.EVENT_EXPAND = "EVENT_EXPAND";
BI.BubbleCombo.EVENT_COLLAPSE = "EVENT_COLLAPSE";
BI.BubbleCombo.EVENT_AFTER_INIT = "EVENT_AFTER_INIT";


BI.BubbleCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.BubbleCombo.EVENT_AFTER_POPUPVIEW = "EVENT_AFTER_POPUPVIEW";
BI.BubbleCombo.EVENT_BEFORE_HIDEVIEW = "EVENT_BEFORE_HIDEVIEW";
BI.BubbleCombo.EVENT_AFTER_HIDEVIEW = "EVENT_AFTER_HIDEVIEW";
BI.shortcut("bi.bubble_combo", BI.BubbleCombo);/**
 * Created by GUY on 2017/2/8.
 *
 * @class BI.BubblePopupView
 * @extends BI.PopupView
 */
BI.BubblePopupView = BI.inherit(BI.PopupView, {
    _defaultConfig: function () {
        var config = BI.BubblePopupView.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(config, {
            baseCls: config.baseCls + " bi-bubble-popup-view"
        });
    },
    _init: function () {
        BI.BubblePopupView.superclass._init.apply(this, arguments);
    },

    showLine: function (direction) {
        var pos = {}, op = {};
        switch (direction) {
            case "left":
                pos = {
                    top: 0,
                    bottom: 0,
                    left: -1
                };
                op = {width: 3};
                break;
            case "right":
                pos = {
                    top: 0,
                    bottom: 0,
                    right: -1
                };
                op = {width: 3};
                break;
            case "top":
                pos = {
                    left: 0,
                    right: 0,
                    top: -1
                };
                op = {height: 3};
                break;
            case "bottom":
                pos = {
                    left: 0,
                    right: 0,
                    bottom: -1
                };
                op = {height: 3};
                break;
            default:
                break;
        }
        this.line = BI.createWidget(op, {
            type: "bi.layout",
            cls: "bubble-popup-line bi-high-light-background"
        });
        pos.el = this.line;
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [pos]
        });
    },

    hideLine: function () {
        this.line && this.line.destroy();
    }
});

BI.shortcut("bi.bubble_popup_view", BI.BubblePopupView);

/**
 * Created by GUY on 2017/2/8.
 *
 * @class BI.BubblePopupBarView
 * @extends BI.BubblePopupView
 */
BI.BubblePopupBarView = BI.inherit(BI.BubblePopupView, {
    _defaultConfig: function () {
        return BI.extend(BI.BubblePopupBarView.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-bubble-bar-popup-view",
            buttons: [{value: BI.i18nText("BI-Basic_Cancel"), ghost: true}, {value: BI.i18nText(BI.i18nText("BI-Basic_Sure"))}]
        });
    },
    _init: function () {
        BI.BubblePopupBarView.superclass._init.apply(this, arguments);
    },
    _createToolBar: function () {
        var o = this.options, self = this;

        var items = [];
        BI.each(o.buttons, function (i, buttonOpt) {
            if(BI.isWidget(buttonOpt)) {
                items.push(buttonOpt);
            }else{
                items.push(BI.extend({
                    type: "bi.button",
                    height: 30,
                    handler: function (v) {
                        self.fireEvent(BI.BubblePopupBarView.EVENT_CLICK_TOOLBAR_BUTTON, v);
                    }
                }, buttonOpt));
            }
        });
        return BI.createWidget({
            type: "bi.right_vertical_adapt",
            height: 44,
            hgap: 10,
            bgap: 10,
            items: items
        });
    }
});
BI.BubblePopupBarView.EVENT_CLICK_TOOLBAR_BUTTON = "EVENT_CLICK_TOOLBAR_BUTTON";
BI.shortcut("bi.bubble_bar_popup_view", BI.BubblePopupBarView);

/**
 * Created by Windy on 2018/2/2.
 *
 * @class BI.TextBubblePopupBarView
 * @extends BI.BubblePopupView
 */
BI.TextBubblePopupBarView = BI.inherit(BI.Widget, {
    
    props: {
        baseCls: "bi-text-bubble-bar-popup-view",
        text: "",
        width: 250
    },

    render: function(){
        var self = this, o = this.options;
        return {
            type: "bi.bubble_bar_popup_view",
            ref: function () {
                self.popup = this;
            },
            el: {
                type: "bi.vertical",
                items: [{
                    type: "bi.label",
                    text: o.text,
                    whiteSpace: "normal",
                    textAlign: "left",
                    ref: function () {
                        self.text = this;
                    }
                }],
                hgap: 10,
                tgap: 25,
                bgap: 10
            },
            buttons: [{
                type: "bi.button",
                value: BI.i18nText("BI-Basic_Cancel"),
                ghost: true,
                height: 24,
                handler: function () {
                    self.fireEvent(BI.BubblePopupBarView.EVENT_CLICK_TOOLBAR_BUTTON, false);
                }
            }, {
                type: "bi.button",
                value: BI.i18nText("BI-Basic_Sure"),
                height: 24,
                handler: function () {
                    self.fireEvent(BI.BubblePopupBarView.EVENT_CLICK_TOOLBAR_BUTTON, true);
                }
            }]
        };
    },

    populate: function (v) {
        this.text.setText(v || this.options.text);
    },

    showLine: function (direction) {
        this.popup.showLine(direction);
    },

    hideLine: function () {
        this.popup.hideLine();
    }
});
BI.TextBubblePopupBarView.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.text_bubble_bar_popup_view", BI.TextBubblePopupBarView);/**
 * Created by Young's on 2016/4/28.
 */
BI.EditorIconCheckCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.EditorIconCheckCombo.superclass._defaultConfig.apply(this, arguments), {
            baseClass: "bi-check-editor-combo",
            width: 100,
            height: 24,
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn,
            allowBlank: true,
            watermark: "",
            errorText: ""
        });
    },

    _init: function () {
        BI.EditorIconCheckCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.editor_trigger",
            items: o.items,
            height: o.height,
            validationChecker: o.validationChecker,
            quitChecker: o.quitChecker,
            allowBlank: o.allowBlank,
            watermark: o.watermark,
            errorText: o.errorText,
            value: o.value
        });
        this.trigger.on(BI.EditorTrigger.EVENT_CHANGE, function () {
            self.popup.setValue(this.getValue());
            self.fireEvent(BI.EditorIconCheckCombo.EVENT_CHANGE);
        });
        this.popup = BI.createWidget({
            type: "bi.text_value_check_combo_popup",
            chooseType: o.chooseType,
            items: o.items,
            value: o.value
        });
        this.popup.on(BI.TextValueCheckComboPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.editorIconCheckCombo.hideView();
            self.fireEvent(BI.EditorIconCheckCombo.EVENT_CHANGE);
        });
        this.popup.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.editorIconCheckCombo = BI.createWidget({
            type: "bi.combo",
            container: o.container,
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: {
                el: this.popup,
                maxHeight: 300
            }
        });
    },

    setValue: function (v) {
        this.editorIconCheckCombo.setValue(v);
    },

    getValue: function () {
        return this.trigger.getValue();
    },

    populate: function (items) {
        this.options.items = items;
        this.editorIconCheckCombo.populate(items);
    }
});
BI.EditorIconCheckCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.editor_icon_check_combo", BI.EditorIconCheckCombo);/**
 * Created by GUY on 2016/2/2.
 *
 * @class BI.IconCombo
 * @extend BI.Widget
 */
BI.IconCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.IconCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-icon-combo",
            width: 24,
            height: 24,
            el: {},
            popup: {},
            minWidth: 100,
            maxWidth: "auto",
            maxHeight: 300,
            direction: "bottom",
            adjustLength: 3, // 调整的距离
            adjustXOffset: 0,
            adjustYOffset: 0,
            offsetStyle: "left",
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE
        });
    },

    _init: function () {
        BI.IconCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget(o.el, {
            type: "bi.icon_combo_trigger",
            iconCls: o.iconCls,
            title: o.title,
            items: o.items,
            width: o.width,
            height: o.height,
            iconWidth: o.iconWidth,
            iconHeight: o.iconHeight,
            value: o.value
        });
        this.popup = BI.createWidget(o.popup, {
            type: "bi.icon_combo_popup",
            chooseType: o.chooseType,
            items: o.items,
            value: o.value
        });
        this.popup.on(BI.IconComboPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.iconCombo.hideView();
            self.fireEvent(BI.IconCombo.EVENT_CHANGE);
        });
        this.popup.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.iconCombo = BI.createWidget({
            type: "bi.combo",
            element: this,
            direction: o.direction,
            trigger: o.trigger,
            container: o.container,
            adjustLength: o.adjustLength,
            adjustXOffset: o.adjustXOffset,
            adjustYOffset: o.adjustYOffset,
            offsetStyle: o.offsetStyle,
            el: this.trigger,
            popup: {
                el: this.popup,
                maxWidth: o.maxWidth,
                maxHeight: o.maxHeight,
                minWidth: o.minWidth
            }
        });
    },

    showView: function () {
        this.iconCombo.showView();
    },

    hideView: function () {
        this.iconCombo.hideView();
    },

    setValue: function (v) {
        this.trigger.setValue(v);
        this.popup.setValue(v);
    },

    getValue: function () {
        var value = this.popup.getValue();
        return BI.isNull(value) ? [] : (BI.isArray(value) ? value : [value]);
    },

    populate: function (items) {
        this.options.items = items;
        this.iconCombo.populate(items);
    }
});
BI.IconCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.icon_combo", BI.IconCombo);/**
 * Created by GUY on 2016/2/2.
 *
 * @class BI.IconComboPopup
 * @extend BI.Pane
 */
BI.IconComboPopup = BI.inherit(BI.Pane, {
    _defaultConfig: function () {
        return BI.extend(BI.IconComboPopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi.icon-combo-popup",
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE
        });
    },

    _init: function () {
        BI.IconComboPopup.superclass._init.apply(this, arguments);
        var o = this.options, self = this;
        this.popup = BI.createWidget({
            type: "bi.button_group",
            items: BI.createItems(o.items, {
                type: "bi.single_select_icon_text_item",
                height: 24
            }),
            chooseType: o.chooseType,
            layouts: [{
                type: "bi.vertical"
            }],
            value: o.value
        });

        this.popup.on(BI.Controller.EVENT_CHANGE, function (type, val, obj) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.IconComboPopup.EVENT_CHANGE, val, obj);
            }
        });

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            vgap: 5,
            items: [this.popup]
        });
    },

    populate: function (items) {
        BI.IconComboPopup.superclass.populate.apply(this, arguments);
        items = BI.createItems(items, {
            type: "bi.single_select_icon_text_item",
            height: 24
        });
        this.popup.populate(items);
    },

    getValue: function () {
        return this.popup.getValue();
    },

    setValue: function (v) {
        this.popup.setValue(v);
    }

});
BI.IconComboPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.icon_combo_popup", BI.IconComboPopup);/**
 * Created by GUY on 2016/2/2.
 *
 * @class BI.IconComboTrigger
 * @extend BI.Widget
 */
BI.IconComboTrigger = BI.inherit(BI.Trigger, {
    _defaultConfig: function () {
        return BI.extend(BI.IconComboTrigger.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-icon-combo-trigger",
            el: {},
            items: [],
            iconCls: "",
            width: 24,
            height: 24,
            isShowDown: true,
            value: ""
        });
    },

    _init: function () {
        BI.IconComboTrigger.superclass._init.apply(this, arguments);
        var o = this.options, self = this;
        var iconCls = "";
        if(BI.isKey(o.value)){
            iconCls = this._digest(o.value, o.items);
        }
        this.button = BI.createWidget(o.el, {
            type: "bi.icon_change_button",
            cls: "icon-combo-trigger-icon",
            iconCls: iconCls,
            disableSelected: true,
            width: o.isShowDown ? o.width - 12 : o.width,
            height: o.height,
            iconWidth: o.iconWidth,
            iconHeight: o.iconHeight,
            selected: BI.isNotEmptyString(iconCls)
        });
        this.down = BI.createWidget({
            type: "bi.icon_button",
            disableSelected: true,
            cls: "icon-combo-down-icon trigger-triangle-font font-size-12",
            width: 12,
            height: 8,
            selected: BI.isNotEmptyString(iconCls)
        });
        this.down.setVisible(o.isShowDown);
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.button,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }, {
                el: this.down,
                right: 3,
                bottom: 0
            }]
        });
    },

    _digest: function (v, items) {
        var iconCls = "";
        v = BI.isArray(v) ? v[0] : v;
        BI.any(items, function (i, item) {
            if (v === item.value) {
                iconCls = item.iconCls;
                return true;
            }
        });
        return iconCls;
    },

    populate: function (items) {
        var o = this.options;
        this.options.items = items || [];
        this.button.setIcon(o.iconCls);
        this.button.setSelected(false);
        this.down.setSelected(false);
    },

    setValue: function (v) {
        BI.IconComboTrigger.superclass.setValue.apply(this, arguments);
        var o = this.options;
        var iconCls = this._digest(v, this.options.items);
        v = BI.isArray(v) ? v[0] : v;
        if (BI.isNotEmptyString(iconCls)) {
            this.button.setIcon(iconCls);
            this.button.setSelected(true);
            this.down.setSelected(true);
        } else {
            this.button.setIcon(o.iconCls);
            this.button.setSelected(false);
            this.down.setSelected(false);
        }
    }
});
BI.IconComboTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.icon_combo_trigger", BI.IconComboTrigger);/**
 * Created by Windy on 2017/12/12.
 * combo : icon + text + icon, popup : icon + text
 */
BI.IconTextValueCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.IconTextValueCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-icon-text-value-combo",
            height: 24,
            iconHeight: null,
            iconWidth: null,
            value: "",
            attributes: {
                tabIndex: 0
            }
        });
    },

    _init: function () {
        BI.IconTextValueCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.select_icon_text_trigger",
            cls: "icon-text-value-trigger",
            items: o.items,
            height: o.height,
            text: o.text,
            iconCls: o.iconCls,
            value: o.value,
            iconHeight: o.iconHeight,
            iconWidth: o.iconWidth,
            iconWrapperWidth: o.iconWrapperWidth
        });
        this.popup = BI.createWidget({
            type: "bi.icon_text_value_combo_popup",
            items: o.items,
            value: o.value,
            iconHeight: o.iconHeight,
            iconWidth: o.iconWidth,
            iconWrapperWidth: o.iconWrapperWidth
        });
        this.popup.on(BI.IconTextValueComboPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.textIconCombo.hideView();
            self.fireEvent(BI.IconTextValueCombo.EVENT_CHANGE, arguments);
        });
        this.popup.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.textIconCombo = BI.createWidget({
            type: "bi.combo",
            element: this,
            container: o.container,
            adjustLength: 2,
            el: this.trigger,
            popup: {
                el: this.popup,
                maxHeight: 240
            }
        });
        if (BI.isKey(o.value)) {
            this.setValue(o.value);
        }
    },

    _checkError: function (v) {
        if(BI.isNotNull(v)) {
            v = BI.isArray(v) ? v : [v];
            var result = BI.find(this.options.items, function (idx, item) {
                return BI.contains(v, item.value);
            });
            if (BI.isNull(result)) {
                this.element.removeClass("combo-error").addClass("combo-error");
            } else {
                this.element.removeClass("combo-error");
            }
        }
    },

    setValue: function (v) {
        this.trigger.setValue(v);
        this.popup.setValue(v);
        this._checkError(v);
    },

    getValue: function () {
        var value = this.popup.getValue();
        return BI.isNull(value) ? [] : (BI.isArray(value) ? value : [value]);
    },

    populate: function (items) {
        this.options.items = items;
        this.textIconCombo.populate(items);
    }
});
BI.IconTextValueCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.icon_text_value_combo", BI.IconTextValueCombo);/**
 * Created by Windy on 2017/12/12.
 */
BI.IconTextValueComboPopup = BI.inherit(BI.Pane, {
    _defaultConfig: function () {
        return BI.extend(BI.IconTextValueComboPopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-icon-text-icon-popup"
        });
    },

    _init: function () {
        BI.IconTextValueComboPopup.superclass._init.apply(this, arguments);
        var o = this.options, self = this;
        this.popup = BI.createWidget({
            type: "bi.button_group",
            items: BI.createItems(o.items, {
                type: "bi.single_select_icon_text_item",
                height: 24,
                iconHeight: o.iconHeight,
                iconWidth: o.iconWidth,
                iconWrapperWidth: o.iconWrapperWidth
            }),
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
            layouts: [{
                type: "bi.vertical"
            }],
            value: o.value
        });

        this.popup.on(BI.Controller.EVENT_CHANGE, function (type, val, obj) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.IconTextValueComboPopup.EVENT_CHANGE, val, obj);
            }
        });

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            vgap: 5,
            items: [this.popup]
        });
    },

    populate: function (items) {
        BI.IconTextValueComboPopup.superclass.populate.apply(this, arguments);
        var o = this.options;
        items = BI.createItems(items, {
            type: "bi.single_select_icon_text_item",
            height: 24,
            iconWrapperWidth: o.iconWrapperWidth,
            iconHeight: o.iconHeight,
            iconWidth: o.iconWidth
        });
        this.popup.populate(items);
    },

    getValue: function () {
        return this.popup.getValue();
    },

    setValue: function (v) {
        this.popup.setValue(v);
    }

});
BI.IconTextValueComboPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.icon_text_value_combo_popup", BI.IconTextValueComboPopup);/**
 * Created by Windy on 2018/2/2.
 */
BI.SearchTextValueCombo = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-search-text-value-combo",
        height: 24,
        text: "",
        items: [],
        tipType: "",
        warningTitle: "",
        attributes: {
            tabIndex: 0
        }
    },

    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.combo",
                    container: o.container,
                    adjustLength: 2,
                    toggle: false,
                    ref: function () {
                        self.combo = this;
                    },
                    el: {
                        type: "bi.search_text_value_trigger",
                        cls: "search-text-value-trigger",
                        ref: function () {
                            self.trigger = this;
                        },
                        items: o.items,
                        height: o.height - 2,
                        text: o.text,
                        value: o.value,
                        tipType: o.tipType,
                        warningTitle: o.warningTitle,
                        title: o.title,
                        listeners: [{
                            eventName: BI.SearchTextValueTrigger.EVENT_CHANGE,
                            action: function () {
                                self.setValue(this.getValue());
                                self.combo.hideView();
                                self.fireEvent(BI.SearchTextValueCombo.EVENT_CHANGE);
                            }
                        }]
                    },
                    popup: {
                        el: {
                            type: "bi.text_value_combo_popup",
                            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
                            value: o.value,
                            items: o.items,
                            ref: function () {
                                self.popup = this;
                                self.trigger.getSearcher().setAdapter(self.popup);
                            },
                            listeners: [{
                                eventName: BI.TextValueComboPopup.EVENT_CHANGE,
                                action: function () {
                                    self.setValue(this.getValue());
                                    self.combo.hideView();
                                    self.fireEvent(BI.SearchTextValueCombo.EVENT_CHANGE);
                                }
                            }]
                        },
                        maxHeight: 252
                    },
                    listeners: [{
                        eventName: BI.Combo.EVENT_AFTER_HIDEVIEW,
                        action: function () {
                            // self.trigger.stopEditing();
                        }
                    }, {
                        eventName: BI.Combo.EVENT_BEFORE_POPUPVIEW,
                        action: function () {
                            self.fireEvent(BI.SearchTextValueCombo.EVENT_BEFORE_POPUPVIEW);
                        }
                    }],
                    hideChecker: function (e) {
                        return self.triggerBtn.element.find(e.target).length === 0;
                    }
                },
                left: 0,
                right: 0,
                bottom: 0,
                top: 0
            }, {
                el: {
                    type: "bi.trigger_icon_button",
                    cls: "trigger-icon-button",
                    ref: function () {
                        self.triggerBtn = this;
                    },
                    width: o.height,
                    height: o.height,
                    handler: function () {
                        if (self.combo.isViewVisible()) {
                            self.combo.hideView();
                        } else {
                            self.combo.showView();
                        }
                    }
                },
                right: 0,
                bottom: 0,
                top: 0
            }]
        };
    },

    mounted: function () {
        var o = this.options;
        if(BI.isKey(o.value)) {
            this._checkError(o.value);
        }
    },

    _checkError: function (v) {
        if(BI.isNotNull(v)) {
            v = BI.isArray(v) ? v : [v];
            var result = BI.find(this.options.items, function (idx, item) {
                return BI.contains(v, item.value);
            });
            if (BI.isNull(result)) {
                this.element.removeClass("combo-error").addClass("combo-error");
                this.trigger.attr("tipType", "warning");
            } else {
                this.element.removeClass("combo-error");
                this.trigger.attr("tipType", "success");
            }
        }
    },

    populate: function (items) {
        this.combo.populate(items);
    },

    setValue: function (v) {
        this.combo.setValue(v);
        this._checkError(v);
    },

    getValue: function () {
        var value = this.popup.getValue();
        return BI.isNull(value) ? [] : (BI.isArray(value) ? value : [value]);
    }
});
BI.SearchTextValueCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.SearchTextValueCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.shortcut("bi.search_text_value_combo", BI.SearchTextValueCombo);/**
 * Created by Windy on 2018/2/5.
 */
BI.SearchTextValueComboPopup = BI.inherit(BI.Pane, {

    props: {
        baseCls: "bi-search-text-value-popup"
    },

    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.vertical",
            vgap: 5,
            items: [{
                type: "bi.button_group",
                ref: function () {
                    self.popup = this;
                },
                items: BI.createItems(o.items, {
                    type: "bi.single_select_item",
                    textAlign: o.textAlign,
                    height: 24
                }),
                chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
                layouts: [{
                    type: "bi.vertical"
                }],
                behaviors: {
                    redmark: function () {
                        return true;
                    }
                },
                value: o.value,
                listeners: [{
                    eventName: BI.Controller.EVENT_CHANGE,
                    action: function (type, val, obj) {
                        self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
                        if (type === BI.Events.CLICK) {
                            self.fireEvent(BI.SearchTextValueComboPopup.EVENT_CHANGE, val, obj);
                        }
                    }
                }]
            }]
        };
    },

    populate: function (find, match, keyword) {
        var items = BI.concat(find, match);
        BI.SearchTextValueComboPopup.superclass.populate.apply(this, items);
        items = BI.createItems(items, {
            type: "bi.single_select_item",
            height: 24
        });
        this.popup.populate(items, keyword);
    },

    getValue: function () {
        return this.popup.getValue();
    },

    setValue: function (v) {
        this.popup.setValue(v);
    }

});
BI.SearchTextValueComboPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.search_text_value_combo_popup", BI.SearchTextValueComboPopup);/**
 * Created by Windy on 2018/2/2.
 */
BI.SearchTextValueTrigger = BI.inherit(BI.Trigger, {

    props: {
        extraCls: "bi-search-text-value-trigger bi-border",
        height: 24
    },

    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.htape",
            items: [
                {
                    el: {
                        type: "bi.searcher",
                        ref: function () {
                            self.searcher = this;
                        },
                        isAutoSearch: false,
                        el: {
                            type: "bi.state_editor",
                            ref: function () {
                                self.editor = this;
                            },
                            text: this._digest(o.value, o.items),
                            value: o.value,
                            height: o.height,
                            tipText: ""
                        },
                        popup: {
                            type: "bi.search_text_value_combo_popup",
                            cls: "bi-card",
                            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE
                        },
                        onSearch: function (obj, callback) {
                            var keyword = obj.keyword;
                            var finding = BI.Func.getSearchResult(o.items, keyword);
                            var matched = finding.match, find = finding.find;
                            callback(find, matched);
                        },
                        listeners: [{
                            eventName: BI.Searcher.EVENT_CHANGE,
                            action: function () {
                                self.fireEvent(BI.SearchTextValueTrigger.EVENT_CHANGE);
                            }
                        }]
                    }
                }, {
                    el: {
                        type: "bi.layout",
                        width: 24
                    },
                    width: 24
                }
            ]
        };
    },

    _setState: function (v) {
        this.editor.setState(v);
    },

    _digest: function(vals, items){
        var o = this.options;
        vals = BI.isArray(vals) ? vals : [vals];
        var result = [];
        var formatItems = BI.Tree.transformToArrayFormat(items);
        BI.each(formatItems, function (i, item) {
            if (BI.deepContains(vals, item.value) && !result.contains(item.text || item.value)) {
                result.push(item.text || item.value);
            }
        });

        if (result.length > 0) {
            return result.join(",");
        } else {
            return o.text;
        }
    },

    stopEditing: function () {
        this.searcher.stopSearch();
    },

    getSearcher: function () {
        return this.searcher;
    },

    populate: function (items) {
        this.options.items = items;
    },

    setValue: function (vals) {
        this._setState(this._digest(vals, this.options.items));
    },

    getValue: function () {
        return this.searcher.getValue();
    }
});
BI.SearchTextValueTrigger.EVENT_SEARCHING = "EVENT_SEARCHING";
BI.SearchTextValueTrigger.EVENT_STOP = "EVENT_STOP";
BI.SearchTextValueTrigger.EVENT_START = "EVENT_START";
BI.SearchTextValueTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.search_text_value_trigger", BI.SearchTextValueTrigger);/**
 * @class BI.TextValueCheckCombo
 * @extend BI.Widget
 * combo : text + icon, popup : check + text
 */
BI.TextValueCheckCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.TextValueCheckCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-text-value-check-combo",
            width: 100,
            height: 24,
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
            value: "",
            attributes: {
                tabIndex: 0
            }
        });
    },

    _init: function () {
        BI.TextValueCheckCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.select_text_trigger",
            cls: "text-value-trigger",
            items: o.items,
            height: o.height,
            text: o.text,
            value: o.value
        });
        this.popup = BI.createWidget({
            type: "bi.text_value_check_combo_popup",
            chooseType: o.chooseType,
            items: o.items,
            value: o.value
        });
        this.popup.on(BI.TextValueCheckComboPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.textIconCheckCombo.hideView();
            self.fireEvent(BI.TextValueCheckCombo.EVENT_CHANGE);
        });
        this.popup.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.textIconCheckCombo = BI.createWidget({
            type: "bi.combo",
            container: o.container,
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: {
                el: this.popup,
                maxHeight: 300
            }
        });

        if (BI.isKey(o.value)) {
            this.setValue(o.value);
        }
    },

    setTitle: function (title) {
        this.trigger.setTitle(title);
    },

    setValue: function (v) {
        this.trigger.setValue(v);
        this.popup.setValue(v);
    },

    setWarningTitle: function (title) {
        this.trigger.setWarningTitle(title);
    },

    getValue: function () {
        var value = this.popup.getValue();
        return BI.isNull(value) ? [] : (BI.isArray(value) ? value : [value]);
    },

    populate: function (items) {
        this.options.items = items;
        this.textIconCheckCombo.populate(items);
    }
});
BI.TextValueCheckCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.text_value_check_combo", BI.TextValueCheckCombo);/**
 * @class BI.SmallTextValueCheckCombo
 * @extend BI.Widget
 * combo : text + icon, popup : check + text
 */
BI.SmallTextValueCheckCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SmallTextValueCheckCombo.superclass._defaultConfig.apply(this, arguments), {
            width: 100,
            height: 24,
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
            text: ""
        });
    },

    _init: function () {
        BI.SmallTextValueCheckCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.small_select_text_trigger",
            items: o.items,
            height: o.height,
            text: o.text,
            value: o.value
        });
        this.popup = BI.createWidget({
            type: "bi.text_value_check_combo_popup",
            chooseType: o.chooseType,
            items: o.items,
            value: o.value
        });
        this.popup.on(BI.TextValueCheckComboPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.SmallTextIconCheckCombo.hideView();
            self.fireEvent(BI.SmallTextValueCheckCombo.EVENT_CHANGE);
        });
        this.popup.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.SmallTextIconCheckCombo = BI.createWidget({
            type: "bi.combo",
            container: o.container,
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: {
                el: this.popup,
                maxHeight: 300
            }
        });
    },

    setValue: function (v) {
        this.SmallTextIconCheckCombo.setValue(v);
    },

    getValue: function () {
        return this.popup.getValue();
    },

    populate: function (items) {
        this.options.items = items;
        this.SmallTextIconCheckCombo.populate(items);
    }
});
BI.SmallTextValueCheckCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.small_text_value_check_combo", BI.SmallTextValueCheckCombo);BI.TextValueCheckComboPopup = BI.inherit(BI.Pane, {
    _defaultConfig: function () {
        return BI.extend(BI.TextValueCheckComboPopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-text-icon-popup",
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE
        });
    },

    _init: function () {
        BI.TextValueCheckComboPopup.superclass._init.apply(this, arguments);
        var o = this.options, self = this;
        this.popup = BI.createWidget({
            type: "bi.button_group",
            items: this._formatItems(o.items),
            chooseType: o.chooseType,
            layouts: [{
                type: "bi.vertical"
            }],
            value: o.value
        });

        this.popup.on(BI.Controller.EVENT_CHANGE, function (type, val, obj) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.TextValueCheckComboPopup.EVENT_CHANGE, val, obj);
            }
        });

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            vgap: 5,
            items: [this.popup]
        });
    },

    _formatItems: function (items) {
        return BI.map(items, function (i, item) {
            return BI.extend({
                type: "bi.icon_text_item",
                cls: "item-check-font bi-list-item",
                height: 24
            }, item);
        });
    },

    populate: function (items) {
        BI.TextValueCheckComboPopup.superclass.populate.apply(this, arguments);
        this.popup.populate(this._formatItems(items));
    },

    getValue: function () {
        return this.popup.getValue();
    },

    setValue: function (v) {
        this.popup.setValue(v);
    }

});
BI.TextValueCheckComboPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.text_value_check_combo_popup", BI.TextValueCheckComboPopup);/**
 * @class BI.TextValueCombo
 * @extend BI.Widget
 * combo : text + icon, popup : text
 * 参见场景dashboard布局方式选择
 */
BI.TextValueCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.TextValueCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-text-value-combo",
            height: 24,
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
            text: "",
            value: "",
            attributes: {
                tabIndex: 0
            }
        });
    },

    _init: function () {
        BI.TextValueCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.select_text_trigger",
            cls: "text-value-trigger",
            items: o.items,
            height: o.height,
            text: o.text,
            value: o.value
        });
        this.popup = BI.createWidget({
            type: "bi.text_value_combo_popup",
            chooseType: o.chooseType,
            value: o.value,
            items: o.items
        });
        this.popup.on(BI.TextValueComboPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.textIconCombo.hideView();
            self.fireEvent(BI.TextValueCombo.EVENT_CHANGE, arguments);
        });
        this.popup.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.textIconCombo = BI.createWidget({
            type: "bi.combo",
            container: o.container,
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: {
                el: this.popup,
                maxHeight: 240
            }
        });
        if(BI.isKey(o.value)) {
            this._checkError(o.value);
        }
    },

    _checkError: function (v) {
        if(BI.isNotNull(v)) {
            v = BI.isArray(v) ? v : [v];
            var result = BI.find(this.options.items, function (idx, item) {
                return BI.contains(v, item.value);
            });
            if (BI.isNull(result)) {
                this.element.removeClass("combo-error").addClass("combo-error");
            } else {
                this.element.removeClass("combo-error");
            }
        }
    },

    setValue: function (v) {
        this.trigger.setValue(v);
        this.popup.setValue(v);
        this._checkError(v);
    },

    getValue: function () {
        var value = this.popup.getValue();
        return BI.isNull(value) ? [] : (BI.isArray(value) ? value : [value]);
    },

    populate: function (items) {
        this.options.items = items;
        this.textIconCombo.populate(items);
    }
});
BI.TextValueCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.text_value_combo", BI.TextValueCombo);/**
 * @class BI.SmallTextValueCombo
 * @extend BI.Widget
 * combo : text + icon, popup : text
 * 参见场景dashboard布局方式选择
 */
BI.SmallTextValueCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SmallTextValueCombo.superclass._defaultConfig.apply(this, arguments), {
            width: 100,
            height: 24,
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
            el: {},
            text: ""
        });
    },

    _init: function () {
        BI.SmallTextValueCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget(o.el, {
            type: "bi.small_select_text_trigger",
            items: o.items,
            height: o.height,
            text: o.text
        });
        this.popup = BI.createWidget({
            type: "bi.text_value_combo_popup",
            chooseType: o.chooseType,
            items: o.items
        });
        this.popup.on(BI.TextValueComboPopup.EVENT_CHANGE, function () {
            self.setValue(self.popup.getValue());
            self.SmallTextValueCombo.hideView();
            self.fireEvent(BI.SmallTextValueCombo.EVENT_CHANGE);
        });
        this.popup.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.SmallTextValueCombo = BI.createWidget({
            type: "bi.combo",
            element: this,
            container: o.container,
            adjustLength: 2,
            el: this.trigger,
            popup: {
                el: this.popup,
                maxHeight: 240
            }
        });
    },

    setValue: function (v) {
        this.trigger.setValue(v);
        this.popup.setValue(v);
    },

    getValue: function () {
        return this.popup.getValue();
    },

    populate: function (items) {
        this.options.items = items;
        this.SmallTextValueCombo.populate(items);
    }
});
BI.SmallTextValueCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.small_text_value_combo", BI.SmallTextValueCombo);BI.TextValueComboPopup = BI.inherit(BI.Pane, {
    _defaultConfig: function () {
        return BI.extend(BI.TextValueComboPopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-text-icon-popup",
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE
        });
    },

    _init: function () {
        BI.TextValueComboPopup.superclass._init.apply(this, arguments);
        var o = this.options, self = this;
        this.popup = BI.createWidget({
            type: "bi.button_group",
            items: BI.createItems(o.items, {
                type: "bi.single_select_item",
                textAlign: o.textAlign,
                height: 24
            }),
            chooseType: o.chooseType,
            layouts: [{
                type: "bi.vertical"
            }],
            value: o.value
        });

        this.popup.on(BI.Controller.EVENT_CHANGE, function (type, val, obj) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.TextValueComboPopup.EVENT_CHANGE, val, obj);
            }
        });
        this.check();

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            vgap: 5,
            items: [this.popup]
        });
    },

    populate: function (items) {
        BI.TextValueComboPopup.superclass.populate.apply(this, arguments);
        items = BI.createItems(items, {
            type: "bi.single_select_item",
            height: 24
        });
        this.popup.populate(items);
    },

    getValue: function () {
        return this.popup.getValue();
    },

    setValue: function (v) {
        this.popup.setValue(v);
    }

});
BI.TextValueComboPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.text_value_combo_popup", BI.TextValueComboPopup);/**
 * @class BI.TextValueDownListCombo
 * @extend BI.Widget
 */
BI.TextValueDownListCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.TextValueDownListCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-text-value-down-list-combo",
            height: 24,
            attributes: {
                tabIndex: 0
            }
        });
    },

    _init: function () {
        BI.TextValueDownListCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this._createValueMap();

        var value;
        if(BI.isNotNull(o.value)){
            value = this._digest(o.value);
        }
        this.trigger = BI.createWidget({
            type: "bi.down_list_select_text_trigger",
            cls: "text-value-down-list-trigger",
            height: o.height,
            items: o.items,
            text: o.text,
            value: value
        });

        this.combo = BI.createWidget({
            type: "bi.down_list_combo",
            element: this,
            chooseType: BI.Selection.Single,
            adjustLength: 2,
            height: o.height,
            el: this.trigger,
            value: BI.isNull(value) ? [] : [value],
            items: BI.deepClone(o.items)
        });

        this.combo.on(BI.DownListCombo.EVENT_CHANGE, function () {
            self.setValue(self.combo.getValue()[0].value);
            self.fireEvent(BI.TextValueDownListCombo.EVENT_CHANGE);
        });

        this.combo.on(BI.DownListCombo.EVENT_SON_VALUE_CHANGE, function () {
            self.setValue(self.combo.getValue()[0].childValue);
            self.fireEvent(BI.TextValueDownListCombo.EVENT_CHANGE);
        });
    },

    _createValueMap: function () {
        var self = this;
        this.valueMap = {};
        BI.each(BI.flatten(this.options.items), function (idx, item) {
            if (BI.has(item, "el")) {
                BI.each(item.children, function (id, it) {
                    self.valueMap[it.value] = {value: item.el.value, childValue: it.value};
                });
            } else {
                self.valueMap[item.value] = {value: item.value};
            }
        });
    },

    _digest: function (v) {
        return this.valueMap[v];
    },

    setValue: function (v) {
        v = this._digest(v);
        this.combo.setValue([v]);
        this.trigger.setValue(v);
    },

    getValue: function () {
        var v = this.combo.getValue()[0];
        return [v.childValue || v.value];
    },

    populate: function (items) {
        this.options.items = BI.flatten(items);
        this.combo.populate(items);
        this._createValueMap();
    }
});
BI.TextValueDownListCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.text_value_down_list_combo", BI.TextValueDownListCombo);/**
 * 选择字段trigger, downlist专用
 * 显示形式为 父亲值(儿子值)
 *
 * @class BI.DownListSelectTextTrigger
 * @extends BI.Trigger
 */
BI.DownListSelectTextTrigger = BI.inherit(BI.Trigger, {

    _defaultConfig: function () {
        return BI.extend(BI.DownListSelectTextTrigger.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-down-list-select-text-trigger",
            height: 24,
            text: ""
        });
    },

    _init: function () {
        BI.DownListSelectTextTrigger.superclass._init.apply(this, arguments);
        var o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.select_text_trigger",
            element: this,
            height: o.height,
            items: this._formatItemArray(o.items),
            text: o.text,
            value: BI.isNull(o.value) ? "" : o.value.childValue || o.value.value
        });
    },

    _formatItemArray: function () {
        var sourceArray = BI.flatten(BI.deepClone(this.options.items));
        var targetArray = [];
        BI.each(sourceArray, function (idx, item) {
            if(BI.has(item, "el")) {
                BI.each(item.children, function (id, it) {
                    it.text = item.el.text + "(" + it.text + ")";
                });
                targetArray = BI.concat(targetArray, item.children);
            }else{
                targetArray.push(item);
            }
        });
        return targetArray;
    },

    setValue: function (vals) {
        this.trigger.setValue(vals.childValue || vals.value);
    },

    populate: function (items) {
        this.trigger.populate(this._formatItemArray(items));
    }
});
BI.shortcut("bi.down_list_select_text_trigger", BI.DownListSelectTextTrigger);/**
 * 有清楚按钮的文本框
 * Created by GUY on 2015/9/29.
 * @class BI.SmallTextEditor
 * @extends BI.SearchEditor
 */
BI.ClearEditor = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.ClearEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-clear-editor",
            height: 24,
            errorText: "",
            watermark: "",
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn
        });
    },
    _init: function () {
        BI.ClearEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: "bi.editor",
            height: o.height,
            watermark: o.watermark,
            allowBlank: true,
            errorText: o.errorText,
            validationChecker: o.validationChecker,
            quitChecker: o.quitChecker,
            value: o.value
        });
        this.clear = BI.createWidget({
            type: "bi.icon_button",
            stopEvent: true,
            cls: "search-close-h-font"
        });
        this.clear.on(BI.IconButton.EVENT_CHANGE, function () {
            self.setValue("");
            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.STOPEDIT);
            self.fireEvent(BI.ClearEditor.EVENT_CLEAR);
        });
        BI.createWidget({
            element: this,
            type: "bi.htape",
            items: [
                {
                    el: this.editor
                },
                {
                    el: this.clear,
                    width: 24
                }]
        });
        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.editor.on(BI.Editor.EVENT_FOCUS, function () {
            self.fireEvent(BI.ClearEditor.EVENT_FOCUS);
        });
        this.editor.on(BI.Editor.EVENT_BLUR, function () {
            self.fireEvent(BI.ClearEditor.EVENT_BLUR);
        });
        this.editor.on(BI.Editor.EVENT_CLICK, function () {
            self.fireEvent(BI.ClearEditor.EVENT_CLICK);
        });
        this.editor.on(BI.Editor.EVENT_CHANGE, function () {
            self._checkClear();
            self.fireEvent(BI.ClearEditor.EVENT_CHANGE);
        });
        this.editor.on(BI.Editor.EVENT_KEY_DOWN, function (v) {
            self.fireEvent(BI.ClearEditor.EVENT_KEY_DOWN, v);
        });
        this.editor.on(BI.Editor.EVENT_SPACE, function () {
            self.fireEvent(BI.ClearEditor.EVENT_SPACE);
        });
        this.editor.on(BI.Editor.EVENT_BACKSPACE, function () {
            self.fireEvent(BI.ClearEditor.EVENT_BACKSPACE);
        });


        this.editor.on(BI.Editor.EVENT_VALID, function () {
            self.fireEvent(BI.ClearEditor.EVENT_VALID);
        });
        this.editor.on(BI.Editor.EVENT_ERROR, function () {
            self.fireEvent(BI.ClearEditor.EVENT_ERROR);
        });
        this.editor.on(BI.Editor.EVENT_ENTER, function () {
            self.fireEvent(BI.ClearEditor.EVENT_ENTER);
        });
        this.editor.on(BI.Editor.EVENT_RESTRICT, function () {
            self.fireEvent(BI.ClearEditor.EVENT_RESTRICT);
        });
        this.editor.on(BI.Editor.EVENT_EMPTY, function () {
            self._checkClear();
            self.fireEvent(BI.ClearEditor.EVENT_EMPTY);
        });
        this.editor.on(BI.Editor.EVENT_REMOVE, function () {
            self.fireEvent(BI.ClearEditor.EVENT_REMOVE);
        });
        this.editor.on(BI.Editor.EVENT_CONFIRM, function () {
            self.fireEvent(BI.ClearEditor.EVENT_CONFIRM);
        });
        this.editor.on(BI.Editor.EVENT_START, function () {
            self.fireEvent(BI.ClearEditor.EVENT_START);
        });
        this.editor.on(BI.Editor.EVENT_PAUSE, function () {
            self.fireEvent(BI.ClearEditor.EVENT_PAUSE);
        });
        this.editor.on(BI.Editor.EVENT_STOP, function () {
            self.fireEvent(BI.ClearEditor.EVENT_STOP);
        });

        if (BI.isKey(o.value)) {
            this.clear.visible();
        } else {
            this.clear.invisible();
        }
    },

    _checkClear: function () {
        if (!this.getValue()) {
            this.clear.invisible();
        } else {
            this.clear.visible();
        }
    },

    focus: function () {
        this.editor.focus();
    },

    blur: function () {
        this.editor.blur();
    },

    getValue: function () {
        if (this.isValid()) {
            var res = this.editor.getValue().match(/[\S]+/g);
            return BI.isNull(res) ? "" : res[res.length - 1];
        }
    },

    setValue: function (v) {
        this.editor.setValue(v);
        if (BI.isKey(v)) {
            this.clear.visible();
        }
    },

    isValid: function () {
        return this.editor.isValid();
    }
});
BI.ClearEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.ClearEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.ClearEditor.EVENT_BLUR = "EVENT_BLUR";
BI.ClearEditor.EVENT_CLICK = "EVENT_CLICK";
BI.ClearEditor.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.ClearEditor.EVENT_SPACE = "EVENT_SPACE";
BI.ClearEditor.EVENT_BACKSPACE = "EVENT_BACKSPACE";
BI.ClearEditor.EVENT_CLEAR = "EVENT_CLEAR";

BI.ClearEditor.EVENT_START = "EVENT_START";
BI.ClearEditor.EVENT_PAUSE = "EVENT_PAUSE";
BI.ClearEditor.EVENT_STOP = "EVENT_STOP";
BI.ClearEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.ClearEditor.EVENT_VALID = "EVENT_VALID";
BI.ClearEditor.EVENT_ERROR = "EVENT_ERROR";
BI.ClearEditor.EVENT_ENTER = "EVENT_ENTER";
BI.ClearEditor.EVENT_RESTRICT = "EVENT_RESTRICT";
BI.ClearEditor.EVENT_REMOVE = "EVENT_REMOVE";
BI.ClearEditor.EVENT_EMPTY = "EVENT_EMPTY";
BI.shortcut("bi.clear_editor", BI.ClearEditor);/**
 * 带标记的文本框
 * Created by GUY on 2016/1/25.
 * @class BI.ShelterEditor
 * @extends BI.Widget
 */
BI.ShelterEditor = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.ShelterEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-shelter-editor",
            hgap: 4,
            vgap: 2,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn,
            allowBlank: true,
            watermark: "",
            errorText: "",
            height: 24,
            textAlign: "left"
        });
    },

    _init: function () {
        BI.ShelterEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: "bi.editor",
            height: o.height,
            hgap: o.hgap,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            value: o.value,
            validationChecker: o.validationChecker,
            quitChecker: o.quitChecker,
            allowBlank: o.allowBlank,
            watermark: o.watermark,
            errorText: o.errorText
        });
        this.text = BI.createWidget({
            type: "bi.text_button",
            cls: "shelter-editor-text",
            title: o.title,
            warningTitle: o.warningTitle,
            tipType: o.tipType,
            textAlign: o.textAlign,
            height: o.height,
            hgap: o.hgap
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.text,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
        this.text.on(BI.Controller.EVENT_CHANGE, function () {
            arguments[2] = self;
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.text.on(BI.TextButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.ShelterEditor.EVENT_CLICK_LABEL);
        });
        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_FOCUS, function () {
            self.fireEvent(BI.ShelterEditor.EVENT_FOCUS, arguments);
        });
        this.editor.on(BI.Editor.EVENT_BLUR, function () {
            self.fireEvent(BI.ShelterEditor.EVENT_BLUR, arguments);
        });
        this.editor.on(BI.Editor.EVENT_CLICK, function () {
            self.fireEvent(BI.ShelterEditor.EVENT_CLICK, arguments);
        });
        this.editor.on(BI.Editor.EVENT_CHANGE, function () {
            self.fireEvent(BI.ShelterEditor.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_KEY_DOWN, function (v) {
            self.fireEvent(BI.ShelterEditor.EVENT_KEY_DOWN, arguments);
        });

        this.editor.on(BI.Editor.EVENT_VALID, function () {
            self.fireEvent(BI.ShelterEditor.EVENT_VALID, arguments);
        });
        this.editor.on(BI.Editor.EVENT_CONFIRM, function () {
            self._showHint();
            self._checkText();
            self.fireEvent(BI.ShelterEditor.EVENT_CONFIRM, arguments);
        });
        this.editor.on(BI.Editor.EVENT_START, function () {
            self.fireEvent(BI.ShelterEditor.EVENT_START, arguments);
        });
        this.editor.on(BI.Editor.EVENT_PAUSE, function () {
            self.fireEvent(BI.ShelterEditor.EVENT_PAUSE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_STOP, function () {
            self.fireEvent(BI.ShelterEditor.EVENT_STOP, arguments);
        });
        this.editor.on(BI.Editor.EVENT_SPACE, function () {
            self.fireEvent(BI.ShelterEditor.EVENT_SPACE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_ERROR, function () {
            self._checkText();
            self.fireEvent(BI.ShelterEditor.EVENT_ERROR, arguments);
        });
        this.editor.on(BI.Editor.EVENT_ENTER, function () {
            self.fireEvent(BI.ShelterEditor.EVENT_ENTER, arguments);
        });
        this.editor.on(BI.Editor.EVENT_RESTRICT, function () {
            self.fireEvent(BI.ShelterEditor.EVENT_RESTRICT, arguments);
        });
        this.editor.on(BI.Editor.EVENT_EMPTY, function () {
            self.fireEvent(BI.ShelterEditor.EVENT_EMPTY, arguments);
        });
        BI.createWidget({
            type: "bi.vertical",
            scrolly: false,
            element: this,
            items: [this.editor]
        });
        this._showHint();
        self._checkText();
        this.text.doRedMark(o.keyword);
    },

    _checkText: function () {
        var o = this.options;
        if (this.editor.getValue() === "") {
            this.text.setValue(o.watermark || "");
            this.text.element.addClass("bi-water-mark");
        } else {
            this.text.setValue(this.editor.getValue());
            this.text.element.removeClass("bi-water-mark");
        }
    },

    _showInput: function () {
        this.editor.visible();
        this.text.invisible();
    },

    _showHint: function () {
        this.editor.invisible();
        this.text.visible();
    },

    setTitle: function (title) {
        this.text.setTitle(title);
    },

    setWarningTitle: function (title) {
        this.text.setWarningTitle(title);
    },

    focus: function () {
        this._showInput();
        this.editor.focus();
    },

    blur: function () {
        this.editor.blur();
        this._showHint();
        this._checkText();
    },

    doRedMark: function () {
        if (this.editor.getValue() === "" && BI.isKey(this.options.watermark)) {
            return;
        }
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doHighLight: function () {
        if (this.editor.getValue() === "" && BI.isKey(this.options.watermark)) {
            return;
        }
        this.text.doHighLight.apply(this.text, arguments);
    },

    unHighLight: function () {
        this.text.unHighLight.apply(this.text, arguments);
    },

    isValid: function () {
        return this.editor.isValid();
    },

    setErrorText: function (text) {
        this.editor.setErrorText(text);
    },

    getErrorText: function () {
        return this.editor.getErrorText();
    },

    isEditing: function () {
        return this.editor.isEditing();
    },

    getLastValidValue: function () {
        return this.editor.getLastValidValue();
    },

    setTextStyle: function (style) {
        this.text.setStyle(style);
    },

    setValue: function (k) {
        this.editor.setValue(k);
        this._checkText();
        this.text.doRedMark(this.options.keyword);
    },

    getValue: function () {
        return this.editor.getValue();
    },

    getState: function () {
        return this.text.getValue();
    },

    setState: function (v) {
        this._showHint();
        this.text.setValue(v);
    }
});
BI.ShelterEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.ShelterEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.ShelterEditor.EVENT_BLUR = "EVENT_BLUR";
BI.ShelterEditor.EVENT_CLICK = "EVENT_CLICK";
BI.ShelterEditor.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.ShelterEditor.EVENT_CLICK_LABEL = "EVENT_CLICK_LABEL";

BI.ShelterEditor.EVENT_START = "EVENT_START";
BI.ShelterEditor.EVENT_PAUSE = "EVENT_PAUSE";
BI.ShelterEditor.EVENT_STOP = "EVENT_STOP";
BI.ShelterEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.ShelterEditor.EVENT_VALID = "EVENT_VALID";
BI.ShelterEditor.EVENT_ERROR = "EVENT_ERROR";
BI.ShelterEditor.EVENT_ENTER = "EVENT_ENTER";
BI.ShelterEditor.EVENT_RESTRICT = "EVENT_RESTRICT";
BI.ShelterEditor.EVENT_SPACE = "EVENT_SPACE";
BI.ShelterEditor.EVENT_EMPTY = "EVENT_EMPTY";

BI.shortcut("bi.shelter_editor", BI.ShelterEditor);
/**
 * 带标记的文本框
 * Created by GUY on 2015/8/28.
 * @class BI.SignEditor
 * @extends BI.Widget
 */
BI.SignEditor = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.SignEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-sign-editor",
            hgap: 4,
            vgap: 2,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn,
            allowBlank: true,
            watermark: "",
            errorText: "",
            height: 24
        });
    },

    _init: function () {
        BI.SignEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: "bi.editor",
            height: o.height,
            hgap: o.hgap,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            value: o.value,
            validationChecker: o.validationChecker,
            quitChecker: o.quitChecker,
            allowBlank: o.allowBlank,
            watermark: o.watermark,
            errorText: o.errorText
        });
        this.text = BI.createWidget({
            type: "bi.text_button",
            cls: "sign-editor-text",
            title: o.title,
            warningTitle: o.warningTitle,
            tipType: o.tipType,
            textAlign: "left",
            height: o.height,
            hgap: 4,
            handler: function () {
                self._showInput();
                self.editor.focus();
                self.editor.selectAll();
            }
        });
        this.text.on(BI.TextButton.EVENT_CHANGE, function () {
            BI.nextTick(function () {
                self.fireEvent(BI.SignEditor.EVENT_CLICK_LABEL);
            });
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.text,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_FOCUS, function () {
            self.fireEvent(BI.SignEditor.EVENT_FOCUS, arguments);
        });
        this.editor.on(BI.Editor.EVENT_BLUR, function () {
            self.fireEvent(BI.SignEditor.EVENT_BLUR, arguments);
        });
        this.editor.on(BI.Editor.EVENT_CLICK, function () {
            self.fireEvent(BI.SignEditor.EVENT_CLICK, arguments);
        });
        this.editor.on(BI.Editor.EVENT_CHANGE, function () {
            self.fireEvent(BI.SignEditor.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_KEY_DOWN, function (v) {
            self.fireEvent(BI.SignEditor.EVENT_KEY_DOWN, arguments);
        });

        this.editor.on(BI.Editor.EVENT_VALID, function () {
            self.fireEvent(BI.SignEditor.EVENT_VALID, arguments);
        });
        this.editor.on(BI.Editor.EVENT_CONFIRM, function () {
            self._showHint();
            self._checkText();
            self.fireEvent(BI.SignEditor.EVENT_CONFIRM, arguments);
        });
        this.editor.on(BI.Editor.EVENT_START, function () {
            self.fireEvent(BI.SignEditor.EVENT_START, arguments);
        });
        this.editor.on(BI.Editor.EVENT_PAUSE, function () {
            self.fireEvent(BI.SignEditor.EVENT_PAUSE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_STOP, function () {
            self.fireEvent(BI.SignEditor.EVENT_STOP, arguments);
        });
        this.editor.on(BI.Editor.EVENT_SPACE, function () {
            self.fireEvent(BI.SignEditor.EVENT_SPACE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_ERROR, function () {
            self._checkText();
            self.fireEvent(BI.SignEditor.EVENT_ERROR, arguments);
        });
        this.editor.on(BI.Editor.EVENT_ENTER, function () {
            self.fireEvent(BI.SignEditor.EVENT_ENTER, arguments);
        });
        this.editor.on(BI.Editor.EVENT_RESTRICT, function () {
            self.fireEvent(BI.SignEditor.EVENT_RESTRICT, arguments);
        });
        this.editor.on(BI.Editor.EVENT_EMPTY, function () {
            self.fireEvent(BI.SignEditor.EVENT_EMPTY, arguments);
        });
        BI.createWidget({
            type: "bi.vertical",
            scrolly: false,
            element: this,
            items: [this.editor]
        });
        this._showHint();
        self._checkText();
    },

    _checkText: function () {
        var o = this.options;
        BI.nextTick(BI.bind(function () {
            if (this.editor.getValue() === "") {
                this.text.setValue(o.watermark || "");
                this.text.element.addClass("bi-water-mark");
            } else {
                this.text.setValue(this.editor.getValue());
                this.text.element.removeClass("bi-water-mark");
            }
        }, this));
    },

    _showInput: function () {
        this.editor.visible();
        this.text.invisible();
    },

    _showHint: function () {
        this.editor.invisible();
        this.text.visible();
    },

    setTitle: function (title) {
        this.text.setTitle(title);
    },

    setWarningTitle: function (title) {
        this.text.setWarningTitle(title);
    },

    focus: function () {
        this._showInput();
        this.editor.focus();
    },

    blur: function () {
        this.editor.blur();
        this._showHint();
        this._checkText();
    },

    doRedMark: function () {
        if (this.editor.getValue() === "" && BI.isKey(this.options.watermark)) {
            return;
        }
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doHighLight: function () {
        if (this.editor.getValue() === "" && BI.isKey(this.options.watermark)) {
            return;
        }
        this.text.doHighLight.apply(this.text, arguments);
    },

    unHighLight: function () {
        this.text.unHighLight.apply(this.text, arguments);
    },

    isValid: function () {
        return this.editor.isValid();
    },

    setErrorText: function (text) {
        this.editor.setErrorText(text);
    },

    getErrorText: function () {
        return this.editor.getErrorText();
    },

    isEditing: function () {
        return this.editor.isEditing();
    },

    getLastValidValue: function () {
        return this.editor.getLastValidValue();
    },

    setValue: function (k) {
        this.editor.setValue(k);
        this._checkText();
    },

    getValue: function () {
        return this.editor.getValue();
    },

    getState: function () {
        return this.text.getValue();
    },

    setState: function (v) {
        this._showHint();
        this.text.setValue(v);
    }
});
BI.SignEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.SignEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.SignEditor.EVENT_BLUR = "EVENT_BLUR";
BI.SignEditor.EVENT_CLICK = "EVENT_CLICK";
BI.SignEditor.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.SignEditor.EVENT_CLICK_LABEL = "EVENT_CLICK_LABEL";

BI.SignEditor.EVENT_START = "EVENT_START";
BI.SignEditor.EVENT_PAUSE = "EVENT_PAUSE";
BI.SignEditor.EVENT_STOP = "EVENT_STOP";
BI.SignEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.SignEditor.EVENT_VALID = "EVENT_VALID";
BI.SignEditor.EVENT_ERROR = "EVENT_ERROR";
BI.SignEditor.EVENT_ENTER = "EVENT_ENTER";
BI.SignEditor.EVENT_RESTRICT = "EVENT_RESTRICT";
BI.SignEditor.EVENT_SPACE = "EVENT_SPACE";
BI.SignEditor.EVENT_EMPTY = "EVENT_EMPTY";

BI.shortcut("bi.sign_editor", BI.SignEditor);/**
 * guy
 * 记录状态的输入框
 * @class BI.StateEditor
 * @extends BI.Single
 */
BI.StateEditor = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.StateEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-state-editor",
            hgap: 4,
            vgap: 2,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn,
            allowBlank: true,
            watermark: "",
            errorText: "",
            height: 24,
            text: BI.i18nText("BI-Basic_Unrestricted")
        });
    },

    _init: function () {
        BI.StateEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: "bi.editor",
            height: o.height,
            hgap: o.hgap,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            value: o.value,
            validationChecker: o.validationChecker,
            quitChecker: o.quitChecker,
            allowBlank: o.allowBlank,
            watermark: o.watermark,
            errorText: o.errorText
        });
        this.text = BI.createWidget({
            type: "bi.text_button",
            cls: "state-editor-infinite-text tip-text-style",
            textAlign: "left",
            height: o.height,
            text: o.text,
            hgap: 4,
            handler: function () {
                self._showInput();
                self.editor.focus();
                self.editor.setValue("");
            },
            title: BI.isNotNull(o.tipText) ? o.tipText : function () {
                var title = "";
                if (BI.isString(self.stateValue)) {
                    title = self.stateValue;
                }
                if (BI.isArray(self.stateValue) && self.stateValue.length === 1) {
                    title = self.stateValue[0];
                }
                return title;
            }
        });
        this.text.on(BI.TextButton.EVENT_CHANGE, function () {
            BI.nextTick(function () {
                self.fireEvent(BI.StateEditor.EVENT_CLICK_LABEL);
            });
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.text,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_FOCUS, function () {
            self.fireEvent(BI.StateEditor.EVENT_FOCUS, arguments);
        });
        this.editor.on(BI.Editor.EVENT_BLUR, function () {
            self.fireEvent(BI.StateEditor.EVENT_BLUR, arguments);
        });
        this.editor.on(BI.Editor.EVENT_CLICK, function () {
            self.fireEvent(BI.StateEditor.EVENT_CLICK, arguments);
        });
        this.editor.on(BI.Editor.EVENT_CHANGE, function () {
            self.fireEvent(BI.StateEditor.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_KEY_DOWN, function (v) {
            self.fireEvent(BI.StateEditor.EVENT_KEY_DOWN, arguments);
        });

        this.editor.on(BI.Editor.EVENT_VALID, function () {
            self.fireEvent(BI.StateEditor.EVENT_VALID, arguments);
        });
        this.editor.on(BI.Editor.EVENT_CONFIRM, function () {
            self._showHint();
            self.fireEvent(BI.StateEditor.EVENT_CONFIRM, arguments);
        });
        this.editor.on(BI.Editor.EVENT_START, function () {
            self.fireEvent(BI.StateEditor.EVENT_START, arguments);
        });
        this.editor.on(BI.Editor.EVENT_PAUSE, function () {
            self.fireEvent(BI.StateEditor.EVENT_PAUSE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_STOP, function () {
            self.fireEvent(BI.StateEditor.EVENT_STOP, arguments);
        });
        this.editor.on(BI.Editor.EVENT_SPACE, function () {
            self.fireEvent(BI.StateEditor.EVENT_SPACE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_ERROR, function () {
            self.fireEvent(BI.StateEditor.EVENT_ERROR, arguments);
        });
        this.editor.on(BI.Editor.EVENT_ENTER, function () {
            self.fireEvent(BI.StateEditor.EVENT_ENTER, arguments);
        });
        this.editor.on(BI.Editor.EVENT_RESTRICT, function () {
            self.fireEvent(BI.StateEditor.EVENT_RESTRICT, arguments);
        });
        this.editor.on(BI.Editor.EVENT_EMPTY, function () {
            self.fireEvent(BI.StateEditor.EVENT_EMPTY, arguments);
        });
        BI.createWidget({
            type: "bi.vertical",
            scrolly: false,
            element: this,
            items: [this.editor]
        });
        this._showHint();
        if(BI.isNotNull(o.text)){
            this.setState(o.text);
        }
    },

    doRedMark: function () {
        if (this.editor.getValue() === "" && BI.isKey(this.options.watermark)) {
            return;
        }
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doHighLight: function () {
        if (this.editor.getValue() === "" && BI.isKey(this.options.watermark)) {
            return;
        }
        this.text.doHighLight.apply(this.text, arguments);
    },

    unHighLight: function () {
        this.text.unHighLight.apply(this.text, arguments);
    },

    focus: function () {
        if (this.options.disabled === false) {
            this._showInput();
            this.editor.focus();
        }
    },

    blur: function () {
        this.editor.blur();
        this._showHint();
    },

    _showInput: function () {
        this.editor.visible();
        this.text.invisible();
    },

    _showHint: function () {
        this.editor.invisible();
        this.text.visible();
    },

    isValid: function () {
        return this.editor.isValid();
    },

    setErrorText: function (text) {
        this.editor.setErrorText(text);
    },

    getErrorText: function () {
        return this.editor.getErrorText();
    },

    isEditing: function () {
        return this.editor.isEditing();
    },

    getLastValidValue: function () {
        return this.editor.getLastValidValue();
    },

    setValue: function (k) {
        this.editor.setValue(k);
    },

    getValue: function () {
        return this.editor.getValue();
    },

    getState: function () {
        return this.editor.getValue().match(/[^\s]+/g);
    },

    setState: function (v) {
        var o = this.options;
        BI.StateEditor.superclass.setValue.apply(this, arguments);
        this.stateValue = v;
        if (BI.isNumber(v)) {
            if (v === BI.Selection.All) {
                this.text.setText(BI.i18nText("BI-Select_All"));
                this.text.element.removeClass("state-editor-infinite-text");
            } else if (v === BI.Selection.Multi) {
                this.text.setText(BI.i18nText("BI-Select_Part"));
                this.text.element.removeClass("state-editor-infinite-text");
            } else {
                this.text.setText(o.text);
                this.text.element.addClass("state-editor-infinite-text");
            }
            return;
        }
        if (BI.isString(v)) {
            this.text.setText(v);
            this.text.element.removeClass("state-editor-infinite-text");
            return;
        }
        if (BI.isArray(v)) {
            if (BI.isEmpty(v)) {
                this.text.setText(o.text);
                this.text.element.addClass("state-editor-infinite-text");
            } else if (v.length === 1) {
                this.text.setText(v[0]);
                this.text.element.removeClass("state-editor-infinite-text");
            } else {
                this.text.setText(BI.i18nText("BI-Select_Part"));
                this.text.element.removeClass("state-editor-infinite-text");
            }
        }
    }
});
BI.StateEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.StateEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.StateEditor.EVENT_BLUR = "EVENT_BLUR";
BI.StateEditor.EVENT_CLICK = "EVENT_CLICK";
BI.StateEditor.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.StateEditor.EVENT_CLICK_LABEL = "EVENT_CLICK_LABEL";

BI.StateEditor.EVENT_START = "EVENT_START";
BI.StateEditor.EVENT_PAUSE = "EVENT_PAUSE";
BI.StateEditor.EVENT_STOP = "EVENT_STOP";
BI.StateEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.StateEditor.EVENT_VALID = "EVENT_VALID";
BI.StateEditor.EVENT_ERROR = "EVENT_ERROR";
BI.StateEditor.EVENT_ENTER = "EVENT_ENTER";
BI.StateEditor.EVENT_RESTRICT = "EVENT_RESTRICT";
BI.StateEditor.EVENT_SPACE = "EVENT_SPACE";
BI.StateEditor.EVENT_EMPTY = "EVENT_EMPTY";

BI.shortcut("bi.state_editor", BI.StateEditor);/**
 * 无限制-已选择状态输入框
 * Created by GUY on 2016/5/18.
 * @class BI.SimpleStateEditor
 * @extends BI.Single
 */
BI.SimpleStateEditor = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.SimpleStateEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-simple-state-editor",
            hgap: 4,
            vgap: 2,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn,
            mouseOut: false,
            allowBlank: true,
            watermark: "",
            errorText: "",
            height: 24
        });
    },

    _init: function () {
        BI.SimpleStateEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: "bi.editor",
            height: o.height,
            hgap: o.hgap,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            value: o.value,
            validationChecker: o.validationChecker,
            quitChecker: o.quitChecker,
            allowBlank: o.allowBlank,
            watermark: o.watermark,
            errorText: o.errorText
        });
        this.text = BI.createWidget({
            type: "bi.text_button",
            cls: "state-editor-infinite-text",
            textAlign: "left",
            height: o.height,
            text: BI.i18nText("BI-Basic_Unrestricted"),
            hgap: 4,
            handler: function () {
                self._showInput();
                self.editor.focus();
                self.editor.setValue("");
            }
        });
        this.text.on(BI.TextButton.EVENT_CHANGE, function () {
            BI.nextTick(function () {
                self.fireEvent(BI.SimpleStateEditor.EVENT_CLICK_LABEL);
            });
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.text,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_FOCUS, function () {
            self.fireEvent(BI.SimpleStateEditor.EVENT_FOCUS, arguments);
        });
        this.editor.on(BI.Editor.EVENT_BLUR, function () {
            self.fireEvent(BI.SimpleStateEditor.EVENT_BLUR, arguments);
        });
        this.editor.on(BI.Editor.EVENT_CLICK, function () {
            self.fireEvent(BI.SimpleStateEditor.EVENT_CLICK, arguments);
        });
        this.editor.on(BI.Editor.EVENT_CHANGE, function () {
            self.fireEvent(BI.SimpleStateEditor.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_KEY_DOWN, function (v) {
            self.fireEvent(BI.SimpleStateEditor.EVENT_KEY_DOWN, arguments);
        });

        this.editor.on(BI.Editor.EVENT_VALID, function () {
            self.fireEvent(BI.SimpleStateEditor.EVENT_VALID, arguments);
        });
        this.editor.on(BI.Editor.EVENT_CONFIRM, function () {
            self._showHint();
            self.fireEvent(BI.SimpleStateEditor.EVENT_CONFIRM, arguments);
        });
        this.editor.on(BI.Editor.EVENT_START, function () {
            self.fireEvent(BI.SimpleStateEditor.EVENT_START, arguments);
        });
        this.editor.on(BI.Editor.EVENT_PAUSE, function () {
            self.fireEvent(BI.SimpleStateEditor.EVENT_PAUSE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_STOP, function () {
            self.fireEvent(BI.SimpleStateEditor.EVENT_STOP, arguments);
        });
        this.editor.on(BI.Editor.EVENT_SPACE, function () {
            self.fireEvent(BI.SimpleStateEditor.EVENT_SPACE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_ERROR, function () {
            self.fireEvent(BI.SimpleStateEditor.EVENT_ERROR, arguments);
        });
        this.editor.on(BI.Editor.EVENT_ENTER, function () {
            self.fireEvent(BI.SimpleStateEditor.EVENT_ENTER, arguments);
        });
        this.editor.on(BI.Editor.EVENT_RESTRICT, function () {
            self.fireEvent(BI.SimpleStateEditor.EVENT_RESTRICT, arguments);
        });
        this.editor.on(BI.Editor.EVENT_EMPTY, function () {
            self.fireEvent(BI.SimpleStateEditor.EVENT_EMPTY, arguments);
        });
        BI.createWidget({
            type: "bi.vertical",
            scrolly: false,
            element: this,
            items: [this.editor]
        });
        this._showHint();
        if(BI.isNotNull(o.text)){
            this.setState(o.text);
        }
    },

    doRedMark: function () {
        if (this.editor.getValue() === "" && BI.isKey(this.options.watermark)) {
            return;
        }
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doHighLight: function () {
        if (this.editor.getValue() === "" && BI.isKey(this.options.watermark)) {
            return;
        }
        this.text.doHighLight.apply(this.text, arguments);
    },

    unHighLight: function () {
        this.text.unHighLight.apply(this.text, arguments);
    },

    focus: function () {
        this._showInput();
        this.editor.focus();
    },

    blur: function () {
        this.editor.blur();
        this._showHint();
    },

    _showInput: function () {
        this.editor.visible();
        this.text.invisible();
    },

    _showHint: function () {
        this.editor.invisible();
        this.text.visible();
    },

    isValid: function () {
        return this.editor.isValid();
    },

    setErrorText: function (text) {
        this.editor.setErrorText(text);
    },

    getErrorText: function () {
        return this.editor.getErrorText();
    },

    isEditing: function () {
        return this.editor.isEditing();
    },

    getLastValidValue: function () {
        return this.editor.getLastValidValue();
    },

    setValue: function (k) {
        this.editor.setValue(k);
    },

    getValue: function () {
        return this.editor.getValue();
    },

    getState: function () {
        return this.editor.getValue().match(/[^\s]+/g);
    },

    setState: function (v) {
        BI.SimpleStateEditor.superclass.setValue.apply(this, arguments);
        if (BI.isNumber(v)) {
            if (v === BI.Selection.All) {
                this.text.setText(BI.i18nText("BI-Already_Selected"));
                this.text.element.removeClass("state-editor-infinite-text");
            } else if (v === BI.Selection.Multi) {
                this.text.setText(BI.i18nText("BI-Already_Selected"));
                this.text.element.removeClass("state-editor-infinite-text");
            } else {
                this.text.setText(BI.i18nText("BI-Basic_Unrestricted"));
                this.text.element.addClass("state-editor-infinite-text");
            }
            return;
        }
        if (!BI.isArray(v) || v.length === 1) {
            this.text.setText(v);
            this.text.setTitle(v);
            this.text.element.removeClass("state-editor-infinite-text");
        } else if (BI.isEmpty(v)) {
            this.text.setText(BI.i18nText("BI-Basic_Unrestricted"));
            this.text.element.addClass("state-editor-infinite-text");
        } else {
            this.text.setText(BI.i18nText("BI-Already_Selected"));
            this.text.element.removeClass("state-editor-infinite-text");
        }
    }
});
BI.SimpleStateEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.SimpleStateEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.SimpleStateEditor.EVENT_BLUR = "EVENT_BLUR";
BI.SimpleStateEditor.EVENT_CLICK = "EVENT_CLICK";
BI.SimpleStateEditor.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.SimpleStateEditor.EVENT_CLICK_LABEL = "EVENT_CLICK_LABEL";

BI.SimpleStateEditor.EVENT_START = "EVENT_START";
BI.SimpleStateEditor.EVENT_PAUSE = "EVENT_PAUSE";
BI.SimpleStateEditor.EVENT_STOP = "EVENT_STOP";
BI.SimpleStateEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.SimpleStateEditor.EVENT_VALID = "EVENT_VALID";
BI.SimpleStateEditor.EVENT_ERROR = "EVENT_ERROR";
BI.SimpleStateEditor.EVENT_ENTER = "EVENT_ENTER";
BI.SimpleStateEditor.EVENT_RESTRICT = "EVENT_RESTRICT";
BI.SimpleStateEditor.EVENT_SPACE = "EVENT_SPACE";
BI.SimpleStateEditor.EVENT_EMPTY = "EVENT_EMPTY";

BI.shortcut("bi.simple_state_editor", BI.SimpleStateEditor);/**
 * 下拉框弹出层的多选版本，toolbar带有若干按钮, zIndex在1000w
 * @class BI.MultiPopupView
 * @extends BI.Widget
 */

BI.MultiPopupView = BI.inherit(BI.PopupView, {

    _defaultConfig: function () {
        var conf = BI.MultiPopupView.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-multi-list-view",
            buttons: [BI.i18nText("BI-Basic_Sure")]
        });
    },

    _init: function () {
        BI.MultiPopupView.superclass._init.apply(this, arguments);
    },

    _createToolBar: function () {
        var o = this.options, self = this;
        if (o.buttons.length === 0) {
            return;
        }

        var text = [];          // 构造[{text:content},……]
        BI.each(o.buttons, function (idx, item) {
            text.push({
                text: item,
                value: idx
            });
        });

        this.buttongroup = BI.createWidget({
            type: "bi.button_group",
            cls: "list-view-toolbar bi-high-light bi-border-top",
            height: 24,
            items: BI.createItems(text, {
                type: "bi.text_button",
                once: false,
                shadow: true,
                isShadowShowingOnSelected: true
            }),
            layouts: [{
                type: "bi.center",
                hgap: 0,
                vgap: 0
            }]
        });

        this.buttongroup.on(BI.ButtonGroup.EVENT_CHANGE, function (value, obj) {
            self.fireEvent(BI.MultiPopupView.EVENT_CLICK_TOOLBAR_BUTTON, value, obj);
        });

        return this.buttongroup;
    }

});

BI.MultiPopupView.EVENT_CHANGE = "EVENT_CHANGE";
BI.MultiPopupView.EVENT_CLICK_TOOLBAR_BUTTON = "EVENT_CLICK_TOOLBAR_BUTTON";

BI.shortcut("bi.multi_popup_view", BI.MultiPopupView);/**
 * 可以理解为MultiPopupView和Panel两个面板的结合体
 * @class BI.PopupPanel
 * @extends BI.MultiPopupView
 */

BI.PopupPanel = BI.inherit(BI.MultiPopupView, {

    _defaultConfig: function () {
        var conf = BI.PopupPanel.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-popup-panel",
            title: ""
        });
    },

    _init: function () {
        BI.PopupPanel.superclass._init.apply(this, arguments);
    },

    _createTool: function () {
        var self = this, o = this.options;
        var close = BI.createWidget({
            type: "bi.icon_button",
            cls: "close-h-font",
            width: 25,
            height: 25
        });
        close.on(BI.IconButton.EVENT_CHANGE, function () {
            self.setVisible(false);
            self.fireEvent(BI.PopupPanel.EVENT_CLOSE);
        });
        return BI.createWidget({
            type: "bi.htape",
            cls: "popup-panel-title bi-header-background",
            height: 25,
            items: [{
                el: {
                    type: "bi.label",
                    textAlign: "left",
                    text: o.title,
                    height: 25,
                    lgap: 10
                }
            }, {
                el: close,
                width: 25
            }]
        });
    }
});

BI.PopupPanel.EVENT_CHANGE = "EVENT_CHANGE";
BI.PopupPanel.EVENT_CLOSE = "EVENT_CLOSE";
BI.PopupPanel.EVENT_CLICK_TOOLBAR_BUTTON = "EVENT_CLICK_TOOLBAR_BUTTON";

BI.shortcut("bi.popup_panel", BI.PopupPanel);/**
 * list面板
 *
 * Created by GUY on 2015/10/30.
 * @class BI.ListPane
 * @extends BI.Pane
 */
BI.ListPane = BI.inherit(BI.Pane, {

    _defaultConfig: function () {
        var conf = BI.ListPane.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-list-pane",
            logic: {
                dynamic: true
            },
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            vgap: 0,
            hgap: 0,
            items: [],
            itemsCreator: BI.emptyFn,
            hasNext: BI.emptyFn,
            onLoaded: BI.emptyFn,
            el: {
                type: "bi.button_group"
            }
        });
    },
    _init: function () {
        BI.ListPane.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.button_group = BI.createWidget(o.el, {
            type: "bi.button_group",
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
            behaviors: {},
            items: o.items,
            itemsCreator: function (op, calback) {
                if (op.times === 1) {
                    self.empty();
                    BI.nextTick(function () {
                        self.loading();
                    });
                }
                o.itemsCreator(op, function () {
                    calback.apply(self, arguments);
                    op.times === 1 && BI.nextTick(function () {
                        self.loaded();
                    });
                });
            },
            hasNext: o.hasNext,
            layouts: [{
                type: "bi.vertical"
            }]
        });

        this.button_group.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.ListPane.EVENT_CHANGE, value, obj);
            }
        });
        this.check();

        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic(BI.LogicFactory.createLogicTypeByDirection(BI.Direction.Top), BI.extend({
            scrolly: true,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            vgap: o.vgap,
            hgap: o.hgap
        }, o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection(BI.Direction.Top, this.button_group)
        }))));
    },

    hasPrev: function () {
        return this.button_group.hasPrev && this.button_group.hasPrev();
    },

    hasNext: function () {
        return this.button_group.hasNext && this.button_group.hasNext();
    },

    prependItems: function (items) {
        this.options.items = items.concat(this.options.items);
        this.button_group.prependItems.apply(this.button_group, arguments);
        this.check();
    },

    addItems: function (items) {
        this.options.items = this.options.items.concat(items);
        this.button_group.addItems.apply(this.button_group, arguments);
        this.check();
    },

    removeItemAt: function (indexes) {
        indexes = indexes || [];
        BI.removeAt(this.options.items, indexes);
        this.button_group.removeItemAt.apply(this.button_group, arguments);
        this.check();
    },

    populate: function (items) {
        var self = this, o = this.options;
        if (arguments.length === 0 && (BI.isFunction(this.button_group.attr("itemsCreator")))) {// 接管loader的populate方法
            this.button_group.attr("itemsCreator").apply(this, [{times: 1}, function () {
                if (arguments.length === 0) {
                    throw new Error("参数不能为空");
                }
                self.populate.apply(self, arguments);
            }]);
            return;
        }
        BI.ListPane.superclass.populate.apply(this, arguments);
        this.button_group.populate.apply(this.button_group, arguments);
    },

    empty: function () {
        this.button_group.empty();
    },

    setNotSelectedValue: function () {
        this.button_group.setNotSelectedValue.apply(this.button_group, arguments);
    },

    getNotSelectedValue: function () {
        return this.button_group.getNotSelectedValue();
    },

    setValue: function () {
        this.button_group.setValue.apply(this.button_group, arguments);
    },

    getValue: function () {
        return this.button_group.getValue.apply(this.button_group, arguments);
    },

    getAllButtons: function () {
        return this.button_group.getAllButtons();
    },

    getAllLeaves: function () {
        return this.button_group.getAllLeaves();
    },

    getSelectedButtons: function () {
        return this.button_group.getSelectedButtons();
    },

    getNotSelectedButtons: function () {
        return this.button_group.getNotSelectedButtons();
    },

    getIndexByValue: function (value) {
        return this.button_group.getIndexByValue(value);
    },

    getNodeById: function (id) {
        return this.button_group.getNodeById(id);
    },

    getNodeByValue: function (value) {
        return this.button_group.getNodeByValue(value);
    }
});
BI.ListPane.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.list_pane", BI.ListPane);/**
 * 带有标题栏的pane
 * @class BI.Panel
 * @extends BI.Widget
 */
BI.Panel = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.Panel.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-panel bi-border",
            title: "",
            titleButtons: [],
            el: {},
            logic: {
                dynamic: false
            }
        });
    },

    _init: function () {
        BI.Panel.superclass._init.apply(this, arguments);
        var o = this.options;

        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic("vertical", BI.extend(o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection("top", this._createTitle()
                , this.options.el)
        }))));
    },

    _createTitle: function () {
        var self = this, o = this.options;
        this.text = BI.createWidget({
            type: "bi.label",
            cls: "panel-title-text",
            text: o.title,
            height: 30
        });

        this.button_group = BI.createWidget({
            type: "bi.button_group",
            items: o.titleButtons,
            layouts: [{
                type: "bi.center_adapt",
                lgap: 10
            }]
        });

        this.button_group.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.button_group.on(BI.ButtonGroup.EVENT_CHANGE, function (value, obj) {
            self.fireEvent(BI.Panel.EVENT_CHANGE, value, obj);
        });

        return {
            el: {
                type: "bi.left_right_vertical_adapt",
                cls: "panel-title bi-border-bottom",
                height: 29,
                items: {
                    left: [this.text],
                    right: [this.button_group]
                },
                lhgap: 10,
                rhgap: 10
            },
            height: 29
        };
    },

    setTitle: function (title) {
        this.text.setValue(title);
    }
});
BI.Panel.EVENT_CHANGE = "Panel.EVENT_CHANGE";

BI.shortcut("bi.panel", BI.Panel);BI.LinearSegmentButton = BI.inherit(BI.BasicButton, {

    props: {
        extraCls: "bi-line-segment-button bi-list-item-effect",
        once: true,
        readonly: true,
        hgap: 10,
        height: 25
    },

    render: function () {
        var self = this, o = this.options;

        return [{
            type: "bi.label",
            text: o.text,
            height: o.height,
            value: o.value,
            hgap: o.hgap,
            ref: function () {
                self.text = this;
            }
        }, {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.layout",
                    cls: "line-segment-button-line",
                    height: 2,
                    ref: function () {
                        self.line = this;
                    }
                },
                left: 0,
                right: 0,
                bottom: 0
            }]
        }];
    },

    setSelected: function (v) {
        BI.LinearSegmentButton.superclass.setSelected.apply(this, arguments);
        if (v) {
            this.line.element.addClass("bi-high-light-background");
        } else {
            this.line.element.removeClass("bi-high-light-background");
        }
    },

    setText: function (text) {
        this.text.setText(text);
    }
});
BI.shortcut("bi.linear_segment_button", BI.LinearSegmentButton);BI.LinearSegment = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-linear-segment bi-split-bottom",
        items: [],
        height: 29
    },

    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.button_group",
            items: BI.createItems(o.items, {
                type: "bi.linear_segment_button",
                height: o.height - 1
            }),
            layout: [{
                type: "bi.center"
            }],
            listeners: [{
                eventName: "__EVENT_CHANGE__",
                action: function () {
                    self.fireEvent("__EVENT_CHANGE__", arguments);
                }
            }, {
                eventName: "EVENT_CHANGE",
                action: function () {
                    self.fireEvent("EVENT_CHANGE");
                }
            }],
            ref: function () {
                self.buttonGroup = this;
            }
        };
    },

    setValue: function (v) {
        this.buttonGroup.setValue(v);
    },

    setEnabledValue: function (v) {
        this.buttonGroup.setEnabledValue(v);
    },


    getValue: function () {
        return this.buttonGroup.getValue();
    }
});
BI.shortcut("bi.linear_segment", BI.LinearSegment);/**
 * 选择列表
 *
 * Created by GUY on 2015/11/1.
 * @class BI.SelectList
 * @extends BI.Widget
 */
BI.SelectList = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SelectList.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-list",
            direction: BI.Direction.Top, // toolbar的位置
            logic: {
                dynamic: true
            },
            items: [],
            itemsCreator: BI.emptyFn,
            hasNext: BI.emptyFn,
            onLoaded: BI.emptyFn,
            toolbar: {
                type: "bi.multi_select_bar",
                iconWrapperWidth: 36
            },
            el: {
                type: "bi.list_pane"
            }
        });
    },
    _init: function () {
        BI.SelectList.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        // 全选
        this.toolbar = BI.createWidget(o.toolbar);
        this.allSelected = false;
        this.toolbar.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
            self.allSelected = this.isSelected();
            if (type === BI.Events.CLICK) {
                self.setAllSelected(self.allSelected);
                self.fireEvent(BI.SelectList.EVENT_CHANGE, value, obj);
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.list = BI.createWidget(o.el, {
            type: "bi.list_pane",
            items: o.items,
            itemsCreator: function (op, callback) {
                op.times === 1 && self.toolbar.setVisible(false);
                o.itemsCreator(op, function (items) {
                    callback.apply(self, arguments);
                    if (op.times === 1) {
                        self.toolbar.setVisible(items && items.length > 0);
                        self.toolbar.setEnable(items && items.length > 0);
                    }
                    self._checkAllSelected();
                });
            },
            onLoaded: o.onLoaded,
            hasNext: o.hasNext
        });

        this.list.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
            if (type === BI.Events.CLICK) {
                self._checkAllSelected();
                self.fireEvent(BI.SelectList.EVENT_CHANGE, value, obj);
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic(BI.LogicFactory.createLogicTypeByDirection(o.direction), BI.extend({
            scrolly: true
        }, o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection(o.direction, this.toolbar, this.list)
        }))));

        if (o.items.length <= 0) {
            this.toolbar.setVisible(false);
            this.toolbar.setEnable(false);
        }
        if(BI.isNotNull(o.value)){
            this.setValue(o.value);
        }
    },

    _checkAllSelected: function () {
        var selectLength = this.list.getValue().length;
        var notSelectLength = this.getAllLeaves().length - selectLength;
        var hasNext = this.list.hasNext();
        var isAlreadyAllSelected = this.toolbar.isSelected();
        var isHalf = selectLength > 0 && (notSelectLength > 0 || (!isAlreadyAllSelected && hasNext));
        isHalf = isHalf || (notSelectLength > 0 && hasNext && isAlreadyAllSelected);
        this.toolbar.setHalfSelected(isHalf);
        !isHalf && this.toolbar.setSelected(selectLength > 0 && notSelectLength <= 0 && (!hasNext || isAlreadyAllSelected));
    },

    setAllSelected: function (v) {
        BI.each(this.getAllButtons(), function (i, btn) {
            (btn.setSelected || btn.setAllSelected).apply(btn, [v]);
        });
        this.allSelected = !!v;
        this.toolbar.setSelected(v);
        this.toolbar.setHalfSelected(false);
    },

    setToolBarVisible: function (b) {
        this.toolbar.setVisible(b);
    },

    isAllSelected: function () {
        return this.allSelected;
        // return this.toolbar.isSelected();
    },

    hasPrev: function () {
        return this.list.hasPrev();
    },

    hasNext: function () {
        return this.list.hasNext();
    },

    prependItems: function (items) {
        this.list.prependItems.apply(this.list, arguments);
    },

    addItems: function (items) {
        this.list.addItems.apply(this.list, arguments);
    },

    setValue: function (data) {
        var selectAll = data.type === BI.ButtonGroup.CHOOSE_TYPE_ALL;
        this.setAllSelected(selectAll);
        this.list[selectAll ? "setNotSelectedValue" : "setValue"](data.value);
        this._checkAllSelected();
    },

    getValue: function () {
        if (this.isAllSelected() === false) {
            return {
                type: BI.ButtonGroup.CHOOSE_TYPE_MULTI,
                value: this.list.getValue(),
                assist: this.list.getNotSelectedValue()
            };
        }
        return {
            type: BI.ButtonGroup.CHOOSE_TYPE_ALL,
            value: this.list.getNotSelectedValue(),
            assist: this.list.getValue()
        };
        
    },

    empty: function () {
        this.list.empty();
    },

    populate: function (items) {
        this.toolbar.setVisible(!BI.isEmptyArray(items));
        this.toolbar.setEnable(!BI.isEmptyArray(items));
        this.list.populate.apply(this.list, arguments);
        this._checkAllSelected();
    },

    _setEnable: function (enable) {
        BI.SelectList.superclass._setEnable.apply(this, arguments);
        this.toolbar.setEnable(enable);
    },

    resetHeight: function (h) {
        var toolHeight = ( this.toolbar.element.outerHeight() || 25) * ( this.toolbar.isVisible() ? 1 : 0);
        this.list.resetHeight ? this.list.resetHeight(h - toolHeight) :
            this.list.element.css({"max-height": h - toolHeight + "px"});
    },

    setNotSelectedValue: function () {
        this.list.setNotSelectedValue.apply(this.list, arguments);
        this._checkAllSelected();
    },

    getNotSelectedValue: function () {
        return this.list.getNotSelectedValue();
    },

    getAllButtons: function () {
        return this.list.getAllButtons();
    },

    getAllLeaves: function () {
        return this.list.getAllLeaves();
    },

    getSelectedButtons: function () {
        return this.list.getSelectedButtons();
    },

    getNotSelectedButtons: function () {
        return this.list.getNotSelectedButtons();
    },

    getIndexByValue: function (value) {
        return this.list.getIndexByValue(value);
    },

    getNodeById: function (id) {
        return this.list.getNodeById(id);
    },

    getNodeByValue: function (value) {
        return this.list.getNodeByValue(value);
    }
});
BI.SelectList.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.select_list", BI.SelectList);/**
 * Created by roy on 15/11/6.
 */
BI.LazyLoader = BI.inherit(BI.Widget, {
    _const: {
        PAGE: 100
    },
    _defaultConfig: function () {
        return BI.extend(BI.LazyLoader.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-lazy-loader",
            el: {}
        });
    },

    _init: function () {
        var self = this, o = this.options;
        BI.LazyLoader.superclass._init.apply(this, arguments);
        var all = o.items.length;
        this.loader = BI.createWidget({
            type: "bi.loader",
            element: this,
            // 下面是button_group的属性
            el: o.el,

            itemsCreator: function (options, populate) {
                populate(self._getNextItems(options));
            },
            hasNext: function (option) {
                return option.count < all;
            }
        });

        this.loader.on(BI.Loader.EVENT_CHANGE, function (obj) {
            self.fireEvent(BI.LazyLoader.EVENT_CHANGE, obj);
        });
    },
    _getNextItems: function (options) {
        var self = this, o = this.options;
        var lastNum = o.items.length - this._const.PAGE * (options.times - 1);
        var lastItems = BI.takeRight(o.items, lastNum);
        var nextItems = BI.take(lastItems, this._const.PAGE);
        return nextItems;
    },

    populate: function (items) {
        this.loader.populate(items);
    },

    addItems: function (items) {
        this.loader.addItems(items);
    },

    empty: function () {
        this.loader.empty();
    },

    setNotSelectedValue: function () {
        this.loader.setNotSelectedValue.apply(this.loader, arguments);
    },

    getNotSelectedValue: function () {
        return this.loader.getNotSelectedValue();
    },

    setValue: function () {
        this.loader.setValue.apply(this.loader, arguments);
    },

    getValue: function () {
        return this.loader.getValue.apply(this.loader, arguments);
    },

    getAllButtons: function () {
        return this.loader.getAllButtons();
    },

    getAllLeaves: function () {
        return this.loader.getAllLeaves();
    },

    getSelectedButtons: function () {
        return this.loader.getSelectedButtons();
    },

    getNotSelectedButtons: function () {
        return this.loader.getNotSelectedButtons();
    },

    getIndexByValue: function (value) {
        return this.loader.getIndexByValue(value);
    },

    getNodeById: function (id) {
        return this.loader.getNodeById(id);
    },

    getNodeByValue: function (value) {
        return this.loader.getNodeByValue(value);
    }
});
BI.LazyLoader.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.lazy_loader", BI.LazyLoader);/**
 * 恶心的加载控件， 为解决排序问题引入的控件
 *
 * Created by GUY on 2015/11/12.
 * @class BI.ListLoader
 * @extends BI.Widget
 */
BI.ListLoader = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.ListLoader.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-list-loader",

            isDefaultInit: true, // 是否默认初始化数据

            // 下面是button_group的属性
            el: {
                type: "bi.button_group"
            },

            items: [],
            itemsCreator: BI.emptyFn,
            onLoaded: BI.emptyFn,

            // 下面是分页信息
            count: false,
            next: {},
            hasNext: BI.emptyFn
        });
    },

    _nextLoad: function () {
        var self = this, o = this.options;
        this.next.setLoading();
        o.itemsCreator.apply(this, [{times: ++this.times}, function () {
            self.next.setLoaded();
            self.addItems.apply(self, arguments);
        }]);
    },

    _init: function () {
        BI.ListLoader.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        if (o.itemsCreator === false) {
            o.next = false;
        }

        this.button_group = BI.createWidget(o.el, {
            type: "bi.button_group",
            element: this,
            chooseType: 0,
            items: o.items,
            behaviors: {},
            layouts: [{
                type: "bi.vertical"
            }]
        });
        this.button_group.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.ListLoader.EVENT_CHANGE, obj);
            }
        });

        if (o.next !== false) {
            this.next = BI.createWidget(BI.extend({
                type: "bi.loading_bar"
            }, o.next));
            this.next.on(BI.Controller.EVENT_CHANGE, function (type) {
                if (type === BI.Events.CLICK) {
                    self._nextLoad();
                }
            });
        }

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [this.next]
        });

        o.isDefaultInit && BI.isEmpty(o.items) && BI.nextTick(BI.bind(function () {
            this.populate();
        }, this));
        if (BI.isNotEmptyArray(o.items)) {
            this.populate(o.items);
        }
    },

    hasNext: function () {
        var o = this.options;
        if (BI.isNumber(o.count)) {
            return this.count < o.count;
        }
        return !!o.hasNext.apply(this, [{
            times: this.times,
            count: this.count
        }]);
    },

    addItems: function (items) {
        this.count += items.length;
        if (BI.isObject(this.next)) {
            if (this.hasNext()) {
                this.options.items = this.options.items.concat(items);
                this.next.setLoaded();
            } else {
                this.next.setEnd();
            }
        }
        this.button_group.addItems.apply(this.button_group, arguments);
        this.next.element.appendTo(this.element);
    },

    populate: function (items) {
        var self = this, o = this.options;
        if (arguments.length === 0 && (BI.isFunction(o.itemsCreator))) {
            o.itemsCreator.apply(this, [{times: 1}, function () {
                if (arguments.length === 0) {
                    throw new Error("参数不能为空");
                }
                self.populate.apply(self, arguments);
                o.onLoaded();
            }]);
            return;
        }
        this.options.items = items;
        this.times = 1;
        this.count = 0;
        this.count += items.length;
        if (BI.isObject(this.next)) {
            if (this.hasNext()) {
                this.next.setLoaded();
            } else {
                this.next.invisible();
            }
        }
        BI.DOM.hang([this.next]);
        this.button_group.populate.apply(this.button_group, arguments);
        this.next.element.appendTo(this.element);
    },

    empty: function () {
        BI.DOM.hang([this.next]);
        this.button_group.empty();
        this.next.element.appendTo(this.element);
        BI.each([this.next], function (i, ob) {
            ob && ob.setVisible(false);
        });
    },

    setNotSelectedValue: function () {
        this.button_group.setNotSelectedValue.apply(this.button_group, arguments);
    },

    getNotSelectedValue: function () {
        return this.button_group.getNotSelectedValue();
    },

    setValue: function () {
        this.button_group.setValue.apply(this.button_group, arguments);
    },

    getValue: function () {
        return this.button_group.getValue.apply(this.button_group, arguments);
    },

    getAllButtons: function () {
        return this.button_group.getAllButtons();
    },

    getAllLeaves: function () {
        return this.button_group.getAllLeaves();
    },

    getSelectedButtons: function () {
        return this.button_group.getSelectedButtons();
    },

    getNotSelectedButtons: function () {
        return this.button_group.getNotSelectedButtons();
    },

    getIndexByValue: function (value) {
        return this.button_group.getIndexByValue(value);
    },

    getNodeById: function (id) {
        return this.button_group.getNodeById(id);
    },

    getNodeByValue: function (value) {
        return this.button_group.getNodeByValue(value);
    }
});
BI.ListLoader.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.list_loader", BI.ListLoader);/**
 * Created by GUY on 2016/4/29.
 *
 * @class BI.SortList
 * @extends BI.Widget
 */
BI.SortList = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SortList.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-sort-list",

            isDefaultInit: true, // 是否默认初始化数据

            // 下面是button_group的属性
            el: {
                type: "bi.button_group"
            },

            items: [],
            itemsCreator: BI.emptyFn,
            onLoaded: BI.emptyFn,

            // 下面是分页信息
            count: false,
            next: {},
            hasNext: BI.emptyFn

            // containment: this.element,
            // connectWith: ".bi-sort-list",
        });
    },

    _init: function () {
        BI.SortList.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.loader = BI.createWidget({
            type: "bi.list_loader",
            element: this,
            isDefaultInit: o.isDefaultInit,
            el: o.el,
            items: this._formatItems(o.items),
            itemsCreator: function (op, callback) {
                o.itemsCreator(op, function (items) {
                    callback(self._formatItems(items));
                });
            },
            onLoaded: o.onLoaded,
            count: o.count,
            next: o.next,
            hasNext: o.hasNext
        });
        this.loader.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.SortList.EVENT_CHANGE, value, obj);
            }
        });

        this.loader.element.sortable({
            containment: o.containment || this.element,
            connectWith: o.connectWith || ".bi-sort-list",
            items: ".sort-item",
            cursor: o.cursor || "drag",
            tolerance: o.tolerance || "intersect",
            placeholder: {
                element: function ($currentItem) {
                    var holder = BI.createWidget({
                        type: "bi.layout",
                        cls: "bi-sortable-holder",
                        height: $currentItem.outerHeight()
                    });
                    holder.element.css({
                        "margin-left": $currentItem.css("margin-left"),
                        "margin-right": $currentItem.css("margin-right"),
                        "margin-top": $currentItem.css("margin-top"),
                        "margin-bottom": $currentItem.css("margin-bottom"),
                        margin: $currentItem.css("margin")
                    });
                    return holder.element;
                },
                update: function () {

                }
            },
            start: function (event, ui) {

            },
            stop: function (event, ui) {
                self.fireEvent(BI.SortList.EVENT_CHANGE);
            },
            over: function (event, ui) {

            }
        });
    },

    _formatItems: function (items) {
        BI.each(items, function (i, item) {
            item = BI.stripEL(item);
            item.cls = item.cls ? item.cls + " sort-item" : "sort-item";
            item.attributes = {
                sorted: item.value
            };
        });
        return items;
    },

    hasNext: function () {
        return this.loader.hasNext();
    },

    addItems: function (items) {
        this.loader.addItems(items);
    },

    populate: function (items) {
        if (items) {
            arguments[0] = this._formatItems(items);
        }
        this.loader.populate.apply(this.loader, arguments);
    },

    empty: function () {
        this.loader.empty();
    },

    setNotSelectedValue: function () {
        this.loader.setNotSelectedValue.apply(this.loader, arguments);
    },

    getNotSelectedValue: function () {
        return this.loader.getNotSelectedValue();
    },

    setValue: function () {
        this.loader.setValue.apply(this.loader, arguments);
    },

    getValue: function () {
        return this.loader.getValue();
    },

    getAllButtons: function () {
        return this.loader.getAllButtons();
    },

    getAllLeaves: function () {
        return this.loader.getAllLeaves();
    },

    getSelectedButtons: function () {
        return this.loader.getSelectedButtons();
    },

    getNotSelectedButtons: function () {
        return this.loader.getNotSelectedButtons();
    },

    getIndexByValue: function (value) {
        return this.loader.getIndexByValue(value);
    },

    getNodeById: function (id) {
        return this.loader.getNodeById(id);
    },

    getNodeByValue: function (value) {
        return this.loader.getNodeByValue(value);
    },

    getSortedValues: function () {
        return this.loader.element.sortable("toArray", {attribute: "sorted"});
    }
});
BI.SortList.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.sort_list", BI.SortList);
/**
 * 有总页数和总行数的分页控件
 * Created by Young's on 2016/10/13.
 */
BI.AllCountPager = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.AllCountPager.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-all-count-pager",
            height: 30,
            pages: 1, // 必选项
            curr: 1, // 初始化当前页， pages为数字时可用，
            count: 1 // 总行数
        });
    },
    _init: function () {
        BI.AllCountPager.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: "bi.small_text_editor",
            cls: "pager-editor",
            validationChecker: function (v) {
                return (self.rowCount.getValue() === 0 && v === "0") || BI.isPositiveInteger(v);
            },
            hgap: 4,
            vgap: 0,
            value: o.curr,
            errorText: BI.i18nText("BI-Please_Input_Positive_Integer"),
            width: 35,
            height: 20
        });

        this.pager = BI.createWidget({
            type: "bi.pager",
            width: 36,
            layouts: [{
                type: "bi.horizontal",
                hgap: 1,
                vgap: 1
            }],

            dynamicShow: false,
            pages: o.pages,
            curr: o.curr,
            groups: 0,

            first: false,
            last: false,
            prev: {
                type: "bi.icon_button",
                value: "prev",
                title: BI.i18nText("BI-Previous_Page"),
                warningTitle: BI.i18nText("BI-Current_Is_First_Page"),
                height: 20,
                cls: "all-pager-prev column-pre-page-h-font"
            },
            next: {
                type: "bi.icon_button",
                value: "next",
                title: BI.i18nText("BI-Next_Page"),
                warningTitle: BI.i18nText("BI-Current_Is_Last_Page"),
                height: 20,
                cls: "all-pager-next column-next-page-h-font"
            },

            hasPrev: o.hasPrev,
            hasNext: o.hasNext,
            firstPage: o.firstPage,
            lastPage: o.lastPage
        });

        this.editor.on(BI.TextEditor.EVENT_CONFIRM, function () {
            self.pager.setValue(BI.parseInt(self.editor.getValue()));
            self.fireEvent(BI.AllCountPager.EVENT_CHANGE);
        });
        this.pager.on(BI.Pager.EVENT_CHANGE, function () {
            self.fireEvent(BI.AllCountPager.EVENT_CHANGE);
        });
        this.pager.on(BI.Pager.EVENT_AFTER_POPULATE, function () {
            self.editor.setValue(self.pager.getCurrentPage());
        });

        this.allPages = BI.createWidget({
            type: "bi.label",
            width: 30,
            title: o.pages,
            text: "/" + o.pages
        });

        this.rowCount = BI.createWidget({
            type: "bi.label",
            height: o.height,
            hgap: 5,
            text: o.count,
            title: o.count
        });

        var count = BI.createWidget({
            type: "bi.left",
            height: o.height,
            scrollable: false,
            items: [{
                type: "bi.label",
                height: o.height,
                text: BI.i18nText("BI-Basic_Total"),
                width: 15
            }, this.rowCount, {
                type: "bi.label",
                height: o.height,
                text: BI.i18nText("BI-Tiao_Data"),
                width: 50,
                textAlign: "left"
            }]
        });
        BI.createWidget({
            type: "bi.center_adapt",
            element: this,
            columnSize: ["", 35, 40, 36],
            items: [count, this.editor, this.allPages, this.pager]
        });
    },

    alwaysShowPager: true,

    setAllPages: function (v) {
        this.allPages.setText("/" + v);
        this.allPages.setTitle(v);
        this.pager.setAllPages(v);
        this.editor.setEnable(v >= 1);
    },

    setValue: function (v) {
        this.pager.setValue(v);
    },

    setVPage: function (v) {
        this.pager.setValue(v);
    },

    setCount: function (count) {
        this.rowCount.setText(count);
        this.rowCount.setTitle(count);
    },

    getCurrentPage: function () {
        return this.pager.getCurrentPage();
    },

    hasPrev: function () {
        return this.pager.hasPrev();
    },

    hasNext: function () {
        return this.pager.hasNext();
    },

    setPagerVisible: function (b) {
        this.editor.setVisible(b);
        this.allPages.setVisible(b);
        this.pager.setVisible(b);
    },

    populate: function () {
        this.pager.populate();
    }
});
BI.AllCountPager.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.all_count_pager", BI.AllCountPager);/**
 * 显示页码的分页控件
 *
 * Created by GUY on 2016/6/30.
 * @class BI.DirectionPager
 * @extends BI.Widget
 */
BI.DirectionPager = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.DirectionPager.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-direction-pager",
            height: 30,
            horizontal: {
                pages: false, // 总页数
                curr: 1, // 初始化当前页， pages为数字时可用

                hasPrev: BI.emptyFn,
                hasNext: BI.emptyFn,
                firstPage: 1,
                lastPage: BI.emptyFn
            },
            vertical: {
                pages: false, // 总页数
                curr: 1, // 初始化当前页， pages为数字时可用

                hasPrev: BI.emptyFn,
                hasNext: BI.emptyFn,
                firstPage: 1,
                lastPage: BI.emptyFn
            }
        });
    },
    _init: function () {
        BI.DirectionPager.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var v = o.vertical, h = o.horizontal;
        this._createVPager();
        this._createHPager();
        this.layout = BI.createWidget({
            type: "bi.absolute",
            scrollable: false,
            element: this,
            items: [{
                el: this.vpager,
                top: 5,
                right: 74
            }, {
                el: this.vlabel,
                top: 5,
                right: 111
            }, {
                el: this.hpager,
                top: 5,
                right: -9
            }, {
                el: this.hlabel,
                top: 5,
                right: 28
            }]
        });
    },

    _createVPager: function () {
        var self = this, o = this.options;
        var v = o.vertical;
        this.vlabel = BI.createWidget({
            type: "bi.label",
            width: 24,
            height: 20,
            value: v.curr,
            title: v.curr,
            invisible: true
        });
        this.vpager = BI.createWidget({
            type: "bi.pager",
            width: 76,
            layouts: [{
                type: "bi.horizontal",
                scrollx: false,
                rgap: 24,
                vgap: 1
            }],
            invisible: true,

            dynamicShow: false,
            pages: v.pages,
            curr: v.curr,
            groups: 0,

            first: false,
            last: false,
            prev: {
                type: "bi.icon_button",
                value: "prev",
                title: BI.i18nText("BI-Up_Page"),
                warningTitle: BI.i18nText("BI-Current_Is_First_Page"),
                height: 20,
                iconWidth: 16,
                iconHeight: 16,
                cls: "direction-pager-prev column-pre-page-h-font"
            },
            next: {
                type: "bi.icon_button",
                value: "next",
                title: BI.i18nText("BI-Down_Page"),
                warningTitle: BI.i18nText("BI-Current_Is_Last_Page"),
                height: 20,
                iconWidth: 16,
                iconHeight: 16,
                cls: "direction-pager-next column-next-page-h-font"
            },

            hasPrev: v.hasPrev,
            hasNext: v.hasNext,
            firstPage: v.firstPage,
            lastPage: v.lastPage
        });

        this.vpager.on(BI.Pager.EVENT_CHANGE, function () {
            self.fireEvent(BI.DirectionPager.EVENT_CHANGE);
        });
        this.vpager.on(BI.Pager.EVENT_AFTER_POPULATE, function () {
            self.vlabel.setValue(this.getCurrentPage());
            self.vlabel.setTitle(this.getCurrentPage());
        });
    },

    _createHPager: function () {
        var self = this, o = this.options;
        var h = o.horizontal;
        this.hlabel = BI.createWidget({
            type: "bi.label",
            width: 24,
            height: 20,
            value: h.curr,
            title: h.curr,
            invisible: true
        });
        this.hpager = BI.createWidget({
            type: "bi.pager",
            width: 76,
            layouts: [{
                type: "bi.horizontal",
                scrollx: false,
                rgap: 24,
                vgap: 1
            }],
            invisible: true,

            dynamicShow: false,
            pages: h.pages,
            curr: h.curr,
            groups: 0,

            first: false,
            last: false,
            prev: {
                type: "bi.icon_button",
                value: "prev",
                title: BI.i18nText("BI-Left_Page"),
                warningTitle: BI.i18nText("BI-Current_Is_First_Page"),
                height: 20,
                iconWidth: 16,
                iconHeight: 16,
                cls: "direction-pager-prev row-pre-page-h-font"
            },
            next: {
                type: "bi.icon_button",
                value: "next",
                title: BI.i18nText("BI-Right_Page"),
                warningTitle: BI.i18nText("BI-Current_Is_Last_Page"),
                height: 20,
                iconWidth: 16,
                iconHeight: 16,
                cls: "direction-pager-next row-next-page-h-font"
            },

            hasPrev: h.hasPrev,
            hasNext: h.hasNext,
            firstPage: h.firstPage,
            lastPage: h.lastPage
        });

        this.hpager.on(BI.Pager.EVENT_CHANGE, function () {
            self.fireEvent(BI.DirectionPager.EVENT_CHANGE);
        });
        this.hpager.on(BI.Pager.EVENT_AFTER_POPULATE, function () {
            self.hlabel.setValue(this.getCurrentPage());
            self.hlabel.setTitle(this.getCurrentPage());
        });
    },

    getVPage: function () {
        return this.vpager.getCurrentPage();
    },

    getHPage: function () {
        return this.hpager.getCurrentPage();
    },

    setVPage: function (v) {
        this.vpager.setValue(v);
        this.vlabel.setValue(v);
        this.vlabel.setTitle(v);
    },

    setHPage: function (v) {
        this.hpager.setValue(v);
        this.hlabel.setValue(v);
        this.hlabel.setTitle(v);
    },

    hasVNext: function () {
        return this.vpager.hasNext();
    },

    hasHNext: function () {
        return this.hpager.hasNext();
    },

    hasVPrev: function () {
        return this.vpager.hasPrev();
    },

    hasHPrev: function () {
        return this.hpager.hasPrev();
    },

    setHPagerVisible: function (b) {
        this.hpager.setVisible(b);
        this.hlabel.setVisible(b);
    },

    setVPagerVisible: function (b) {
        this.vpager.setVisible(b);
        this.vlabel.setVisible(b);
    },

    populate: function () {
        this.vpager.populate();
        this.hpager.populate();
        var vShow = false, hShow = false;
        if (!this.hasHNext() && !this.hasHPrev()) {
            this.setHPagerVisible(false);
        } else {
            this.setHPagerVisible(true);
            hShow = true;
        }
        if (!this.hasVNext() && !this.hasVPrev()) {
            this.setVPagerVisible(false);
        } else {
            this.setVPagerVisible(true);
            vShow = true;
        }
        this.setVisible(hShow || vShow);
        var num = [74, 111, -9, 28];
        var items = this.layout.attr("items");

        if (vShow === true && hShow === true) {
            items[0].right = num[0];
            items[1].right = num[1];
            items[2].right = num[2];
            items[3].right = num[3];
        } else if (vShow === true) {
            items[0].right = num[2];
            items[1].right = num[3];
        } else if (hShow === true) {
            items[2].right = num[2];
            items[3].right = num[3];
        }
        this.layout.attr("items", items);
        this.layout.resize();
    },

    clear: function () {
        this.vpager.attr("curr", 1);
        this.hpager.attr("curr", 1);
    }
});
BI.DirectionPager.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.direction_pager", BI.DirectionPager);/**
 * 分页控件
 *
 * Created by GUY on 2015/8/31.
 * @class BI.DetailPager
 * @extends BI.Widget
 */
BI.DetailPager = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.DetailPager.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-detail-pager",
            behaviors: {},
            layouts: [{
                type: "bi.horizontal",
                hgap: 10,
                vgap: 0
            }],

            dynamicShow: true, // 是否动态显示上一页、下一页、首页、尾页， 若为false，则指对其设置使能状态
            // dynamicShow为false时以下两个有用
            dynamicShowFirstLast: false, // 是否动态显示首页、尾页
            dynamicShowPrevNext: false, // 是否动态显示上一页、下一页
            pages: false, // 总页数
            curr: function () {
                return 1;
            }, // 初始化当前页
            groups: 0, // 连续显示分页数
            jump: BI.emptyFn, // 分页的回调函数

            first: false, // 是否显示首页
            last: false, // 是否显示尾页
            prev: "上一页",
            next: "下一页",

            firstPage: 1,
            lastPage: function () { // 在万不得已时才会调用这个函数获取最后一页的页码,  主要作用于setValue方法
                return 1;
            },
            hasPrev: BI.emptyFn, // pages不可用时有效
            hasNext: BI.emptyFn  // pages不可用时有效
        });
    },
    _init: function () {
        BI.DetailPager.superclass._init.apply(this, arguments);
        var self = this;
        this.currPage = BI.result(this.options, "curr");
        // 翻页太灵敏
        this._lock = false;
        this._debouce = BI.debounce(function () {
            self._lock = false;
        }, 300);
        this._populate();
    },

    _populate: function () {
        var self = this, o = this.options, view = [], dict = {};
        this.empty();
        var pages = BI.result(o, "pages");
        var curr = BI.result(this, "currPage");
        var groups = BI.result(o, "groups");
        var first = BI.result(o, "first");
        var last = BI.result(o, "last");
        var prev = BI.result(o, "prev");
        var next = BI.result(o, "next");

        if (pages === false) {
            groups = 0;
            first = false;
            last = false;
        } else {
            groups > pages && (groups = pages);
        }

        // 计算当前组
        dict.index = Math.ceil((curr + ((groups > 1 && groups !== pages) ? 1 : 0)) / (groups === 0 ? 1 : groups));

        // 当前页非首页，则输出上一页
        if (((!o.dynamicShow && !o.dynamicShowPrevNext) || curr > 1) && prev !== false) {
            if (BI.isKey(prev)) {
                view.push({
                    text: prev,
                    value: "prev",
                    disabled: pages === false ? o.hasPrev(curr) === false : !(curr > 1 && prev !== false)
                });
            } else {
                view.push(BI.extend({
                    disabled: pages === false ? o.hasPrev(curr) === false : !(curr > 1 && prev !== false)
                }, prev));
            }
        }

        // 当前组非首组，则输出首页
        if (((!o.dynamicShow && !o.dynamicShowFirstLast) || (dict.index > 1 && groups !== 0)) && first) {
            view.push({
                text: first,
                value: "first",
                disabled: !(dict.index > 1 && groups !== 0)
            });
            if (dict.index > 1 && groups !== 0) {
                view.push({
                    type: "bi.label",
                    cls: "page-ellipsis",
                    text: "\u2026"
                });
            }
        }

        // 输出当前页组
        dict.poor = Math.floor((groups - 1) / 2);
        dict.start = dict.index > 1 ? curr - dict.poor : 1;
        dict.end = dict.index > 1 ? (function () {
            var max = curr + (groups - dict.poor - 1);
            return max > pages ? pages : max;
        }()) : groups;
        if (dict.end - dict.start < groups - 1) { // 最后一组状态
            dict.start = dict.end - groups + 1;
        }
        var s = dict.start, e = dict.end;
        if (first && last && (dict.index > 1 && groups !== 0) && (pages > groups && dict.end < pages && groups !== 0)) {
            s++;
            e--;
        }
        for (; s <= e; s++) {
            if (s === curr) {
                view.push({
                    text: s,
                    value: s,
                    selected: true
                });
            } else {
                view.push({
                    text: s,
                    value: s
                });
            }
        }

        // 总页数大于连续分页数，且当前组最大页小于总页，输出尾页
        if (((!o.dynamicShow && !o.dynamicShowFirstLast) || (pages > groups && dict.end < pages && groups !== 0)) && last) {
            if (pages > groups && dict.end < pages && groups !== 0) {
                view.push({
                    type: "bi.label",
                    cls: "page-ellipsis",
                    text: "\u2026"
                });
            }
            view.push({
                text: last,
                value: "last",
                disabled: !(pages > groups && dict.end < pages && groups !== 0)
            });
        }

        // 当前页不为尾页时，输出下一页
        dict.flow = !prev && groups === 0;
        if (((!o.dynamicShow && !o.dynamicShowPrevNext) && next) || (curr !== pages && next || dict.flow)) {
            view.push((function () {
                if (BI.isKey(next)) {
                    if (pages === false) {
                        return {text: next, value: "next", disabled: o.hasNext(curr) === false};
                    }
                    return (dict.flow && curr === pages)
                        ?
                        {text: next, value: "next", disabled: true}
                        :
                        {text: next, value: "next", disabled: !(curr !== pages && next || dict.flow)};
                }
                return BI.extend({
                    disabled: pages === false ? o.hasNext(curr) === false : !(curr !== pages && next || dict.flow)
                }, next);
                
            }()));
        }

        this.button_group = BI.createWidget({
            type: "bi.button_group",
            element: this,
            items: BI.createItems(view, {
                cls: "page-item bi-border bi-list-item-active",
                height: 23,
                hgap: 10
            }),
            behaviors: o.behaviors,
            layouts: o.layouts
        });
        this.button_group.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
            if (self._lock === true) {
                return;
            }
            self._lock = true;
            self._debouce();
            if (type === BI.Events.CLICK) {
                var v = self.button_group.getValue()[0];
                switch (v) {
                    case "first":
                        self.currPage = 1;
                        break;
                    case "last":
                        self.currPage = pages;
                        break;
                    case "prev":
                        self.currPage--;
                        break;
                    case "next":
                        self.currPage++;
                        break;
                    default:
                        self.currPage = v;
                        break;
                }
                o.jump.apply(self, [{
                    pages: pages,
                    curr: self.currPage
                }]);
                self._populate();
                self.fireEvent(BI.DetailPager.EVENT_CHANGE, obj);
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.fireEvent(BI.DetailPager.EVENT_AFTER_POPULATE);
    },

    getCurrentPage: function () {
        return this.currPage;
    },

    setAllPages: function (pages) {
        this.options.pages = pages;
    },

    hasPrev: function (v) {
        v || (v = 1);
        var o = this.options;
        var pages = this.options.pages;
        return pages === false ? o.hasPrev(v) : v > 1;
    },

    hasNext: function (v) {
        v || (v = 1);
        var o = this.options;
        var pages = this.options.pages;
        return pages === false ? o.hasNext(v) : v < pages;
    },

    setValue: function (v) {
        var o = this.options;
        v = v | 0;
        v = v < 1 ? 1 : v;
        if (o.pages === false) {
            var lastPage = BI.result(o, "lastPage"), firstPage = 1;
            this.currPage = v > lastPage ? lastPage : ((firstPage = BI.result(o, "firstPage")), (v < firstPage ? firstPage : v));
        } else {
            v = v > o.pages ? o.pages : v;
            this.currPage = v;
        }
        this._populate();
    },

    getValue: function () {
        var val = this.button_group.getValue()[0];
        switch (val) {
            case "prev":
                return -1;
            case "next":
                return 1;
            case "first":
                return BI.MIN;
            case "last":
                return BI.MAX;
            default :
                return val;
        }
    },

    attr: function (key, value) {
        BI.DetailPager.superclass.attr.apply(this, arguments);
        if (key === "curr") {
            this.currPage = BI.result(this.options, "curr");
        }
    },

    populate: function () {
        this._populate();
    }
});
BI.DetailPager.EVENT_CHANGE = "EVENT_CHANGE";
BI.DetailPager.EVENT_AFTER_POPULATE = "EVENT_AFTER_POPULATE";
BI.shortcut("bi.detail_pager", BI.DetailPager);/**
 * 分段控件使用的button
 *
 * Created by GUY on 2015/9/7.
 * @class BI.SegmentButton
 * @extends BI.BasicButton
 */
BI.SegmentButton = BI.inherit(BI.BasicButton, {

    _defaultConfig: function () {
        var conf = BI.SegmentButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-segment-button bi-list-item-select",
            shadow: true,
            readonly: true,
            hgap: 5
        });
    },

    _init: function () {
        BI.SegmentButton.superclass._init.apply(this, arguments);
        var opts = this.options, self = this;
        // if (BI.isNumber(opts.height) && BI.isNull(opts.lineHeight)) {
        //    this.element.css({lineHeight : (opts.height - 2) + 'px'});
        // }
        this.text = BI.createWidget({
            type: "bi.label",
            element: this,
            textHeight: opts.height,
            whiteSpace: opts.whiteSpace,
            text: opts.text,
            value: opts.value,
            hgap: opts.hgap
        });
    },

    setSelected: function () {
        BI.SegmentButton.superclass.setSelected.apply(this, arguments);
    },

    setText: function (text) {
        BI.SegmentButton.superclass.setText.apply(this, arguments);
        this.text.setText(text);
    },

    destroy: function () {
        BI.SegmentButton.superclass.destroy.apply(this, arguments);
    }
});
BI.shortcut("bi.segment_button", BI.SegmentButton);/**
 * 单选按钮组
 *
 * Created by GUY on 2015/9/7.
 * @class BI.Segment
 * @extends BI.Widget
 */
BI.Segment = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.Segment.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-segment",
            items: [],
            height: 24
        });
    },
    _init: function () {
        BI.Segment.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.buttonGroup = BI.createWidget({
            element: this,
            type: "bi.button_group",
            value: o.value,
            items: BI.createItems(o.items, {
                type: "bi.segment_button",
                height: o.height - 2,
                whiteSpace: o.whiteSpace
            }),
            layout: [
                {
                    type: "bi.center"
                }
            ]
        });
        this.buttonGroup.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.buttonGroup.on(BI.ButtonGroup.EVENT_CHANGE, function (value, obj) {
            self.fireEvent(BI.Segment.EVENT_CHANGE, value, obj);
        });
    },

    _setEnable: function (enable) {
        BI.Segment.superclass._setEnable.apply(this, arguments);
        if (enable === true) {
            this.element.removeClass("base-disabled disabled");
        } else if (enable === false) {
            this.element.addClass("base-disabled disabled");
        }
    },

    setValue: function (v) {
        this.buttonGroup.setValue(v);
    },

    setEnabledValue: function (v) {
        this.buttonGroup.setEnabledValue(v);
    },

    getValue: function () {
        return this.buttonGroup.getValue();
    }
});
BI.Segment.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.segment", BI.Segment);/**
 * guy
 * 复选导航条
 * Created by GUY on 2015/8/25.
 * @class BI.MultiSelectBar
 * @extends BI.BasicButton
 */
BI.MultiSelectBar = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectBar.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-multi-select-bar",
            height: 25,
            text: BI.i18nText("BI-Select_All"),
            isAllCheckedBySelectedValue: BI.emptyFn,
            // 手动控制选中
            disableSelected: true,
            isHalfCheckedBySelectedValue: function (selectedValues) {
                return selectedValues.length > 0;
            },
            halfSelected: false,
            iconWrapperWidth: 26
        });
    },
    _init: function () {
        BI.MultiSelectBar.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var isSelect = o.selected === true;
        var isHalfSelect = !o.selected && o.halfSelected;
        this.checkbox = BI.createWidget({
            type: "bi.checkbox",
            stopPropagation: true,
            handler: function () {
                self.setSelected(self.isSelected());
            },
            selected: isSelect,
            invisible: isHalfSelect
        });
        this.half = BI.createWidget({
            type: "bi.half_icon_button",
            stopPropagation: true,
            handler: function () {
                self.setSelected(true);
            },
            invisible: isSelect || !isHalfSelect
        });
        this.checkbox.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.CLICK, self.isSelected(), self);
        });
        this.checkbox.on(BI.Checkbox.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectBar.EVENT_CHANGE, self.isSelected(), self);
        });
        this.half.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.CLICK, self.isSelected(), self);
        });
        this.half.on(BI.HalfIconButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectBar.EVENT_CHANGE, self.isSelected(), self);
        });
        this.text = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            whiteSpace: "nowrap",
            textHeight: o.height,
            height: o.height,
            hgap: o.hgap,
            text: o.text,
            keyword: o.keyword,
            value: o.value,
            py: o.py
        });
        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                width: o.iconWrapperWidth,
                el: {
                    type: "bi.center_adapt",
                    items: [this.checkbox, this.half]
                }
            }, {
                el: this.text
            }]
        });
    },

    _setSelected: function (v) {
        this.checkbox.setSelected(!!v);
    },

    // 自己手动控制选中
    beforeClick: function () {
        var isHalf = this.isHalfSelected(), isSelected = this.isSelected();
        if (isHalf === true) {
            this.setSelected(true);
        } else {
            this.setSelected(!isSelected);
        }
    },

    setSelected: function (v) {
        this.checkbox.setSelected(v);
        this.setHalfSelected(false);
    },

    setHalfSelected: function (b) {
        this.halfSelected = !!b;
        if (b === true) {
            this.checkbox.setSelected(false);
            this.half.visible();
            this.checkbox.invisible();
        } else {
            this.half.invisible();
            this.checkbox.visible();
        }
    },

    isHalfSelected: function () {
        return !this.isSelected() && !!this.halfSelected;
    },

    isSelected: function () {
        return this.checkbox.isSelected();
    },

    setValue: function (selectedValues) {
        BI.MultiSelectBar.superclass.setValue.apply(this, arguments);
        var isAllChecked = this.options.isAllCheckedBySelectedValue.apply(this, arguments);
        this._setSelected(isAllChecked);
        !isAllChecked && this.setHalfSelected(this.options.isHalfCheckedBySelectedValue.apply(this, arguments));
    },

    doClick: function () {
        BI.MultiSelectBar.superclass.doClick.apply(this, arguments);
        if(this.isValid()) {
            this.fireEvent(BI.MultiSelectBar.EVENT_CHANGE, this.isSelected(), this);
        }
    }
});
BI.MultiSelectBar.EVENT_CHANGE = "MultiSelectBar.EVENT_CHANGE";
BI.shortcut("bi.multi_select_bar", BI.MultiSelectBar);
/**
 * guy
 * 异步树
 * @class BI.DisplayTree
 * @extends BI.TreeView
 */
BI.DisplayTree = BI.inherit(BI.TreeView, {
    _defaultConfig: function () {
        return BI.extend(BI.DisplayTree.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-display-tree"
        });
    },
    _init: function () {
        BI.DisplayTree.superclass._init.apply(this, arguments);
    },

    // 配置属性
    _configSetting: function () {
        var setting = {
            view: {
                selectedMulti: false,
                dblClickExpand: false,
                showIcon: false,
                nameIsHTML: true,
                showTitle: false
            },
            data: {
                key: {
                    title: "title",
                    name: "text"
                },
                simpleData: {
                    enable: true
                }
            },
            callback: {
                beforeCollapse: beforeCollapse
            }
        };

        function beforeCollapse (treeId, treeNode) {
            return false;
        }

        return setting;
    },

    _dealWidthNodes: function (nodes) {
        nodes = BI.DisplayTree.superclass._dealWidthNodes.apply(this, arguments);
        var self = this, o = this.options;
        BI.each(nodes, function (i, node) {
            if (node.text == null) {
                if (node.count > 0) {
                    node.text = node.value + "(" + BI.i18nText("BI-Basic_Altogether") + node.count + BI.i18nText("BI-Basic_Count") + ")";
                }
            }
        });
        return nodes;
    },

    initTree: function (nodes, setting) {
        var setting = setting || this._configSetting();
        this.nodes = $.fn.zTree.init(this.tree.element, setting, nodes);
    },

    destroy: function () {
        BI.DisplayTree.superclass.destroy.apply(this, arguments);
    }
});
BI.DisplayTree.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.display_tree", BI.DisplayTree);/**
 * guy
 * 二级树
 * @class BI.LevelTree
 * @extends BI.Single
 */
BI.LevelTree = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.LevelTree.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-level-tree",
            el: {
                chooseType: 0
            },
            expander: {},
            items: [],
            value: ""
        });
    },

    _init: function () {
        BI.LevelTree.superclass._init.apply(this, arguments);

        this.initTree(this.options.items);
    },

    _formatItems: function (nodes, layer) {
        var self = this;
        BI.each(nodes, function (i, node) {
            var extend = {layer: layer};
            if (!BI.isKey(node.id)) {
                node.id = BI.UUID();
            }
            if (node.isParent === true || BI.isNotEmptyArray(node.children)) {
                switch (i) {
                    case 0 :
                        extend.type = "bi.first_plus_group_node";
                        break;
                    case nodes.length - 1 :
                        extend.type = "bi.last_plus_group_node";
                        break;
                    default :
                        extend.type = "bi.mid_plus_group_node";
                        break;
                }
                BI.defaults(node, extend);
                self._formatItems(node.children, layer + 1);
            } else {
                switch (i) {
                    case nodes.length - 1:
                        extend.type = "bi.last_tree_leaf_item";
                        break;
                    default :
                        extend.type = "bi.mid_tree_leaf_item";
                }
                BI.defaults(node, extend);
            }
        });
        return nodes;
    },

    _assertId: function (sNodes) {
        BI.each(sNodes, function (i, node) {
            if (!BI.isKey(node.id)) {
                node.id = BI.UUID();
            }
        });
    },

    // 构造树结构，
    initTree: function (nodes) {
        var self = this, o = this.options;
        this.empty();
        this._assertId(nodes);
        this.tree = BI.createWidget({
            type: "bi.custom_tree",
            element: this,
            expander: BI.extend({
                el: {},
                popup: {
                    type: "bi.custom_tree"
                }
            }, o.expander),

            items: this._formatItems(BI.Tree.transformToTreeFormat(nodes), 0),
            value: o.value,

            el: BI.extend({
                type: "bi.button_tree",
                chooseType: 0,
                layouts: [{
                    type: "bi.vertical"
                }]
            }, o.el)
        });
        this.tree.on(BI.Controller.EVENT_CHANGE, function (type, value, ob) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.LevelTree.EVENT_CHANGE, value, ob);
            }
        });
    },

    // 生成树方法
    stroke: function (nodes) {
        this.tree.stroke.apply(this.tree, arguments);
    },

    populate: function (items, keyword) {
        items = this._formatItems(BI.Tree.transformToTreeFormat(items), 0);
        this.tree.populate(items, keyword);
    },

    setValue: function (v) {
        this.tree.setValue(v);
    },

    getValue: function () {
        return this.tree.getValue();
    },

    getAllLeaves: function () {
        return this.tree.getAllLeaves();
    },

    getNodeById: function (id) {
        return this.tree.getNodeById(id);
    },

    getNodeByValue: function (id) {
        return this.tree.getNodeByValue(id);
    }
});
BI.LevelTree.EVENT_CHANGE = "EVENT_CHANGE";

BI.shortcut("bi.level_tree", BI.LevelTree);/**
 * 简单的多选树
 *
 * Created by GUY on 2016/2/16.
 * @class BI.SimpleTreeView
 * @extends BI.Widget
 */
BI.SimpleTreeView = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SimpleTreeView.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-simple-tree",
            itemsCreator: BI.emptyFn,
            items: null
        });
    },
    _init: function () {
        BI.SimpleTreeView.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.structure = new BI.Tree();
        this.tree = BI.createWidget({
            type: "bi.tree_view",
            element: this,
            itemsCreator: function (op, callback) {
                var fn = function (items) {
                    callback({
                        items: items
                    });
                    self.structure.initTree(BI.Tree.transformToTreeFormat(items));
                };
                if (BI.isNotNull(o.items)) {
                    fn(o.items);
                } else {
                    o.itemsCreator(op, fn);
                }
            }
        });
        this.tree.on(BI.TreeView.EVENT_CHANGE, function () {
            self.fireEvent(BI.SimpleTreeView.EVENT_CHANGE, arguments);
        });
        if (BI.isNotEmptyArray(o.items)) {
            this.populate();
        }
        if (BI.isNotNull(o.value)) {
            this.setValue(o.value);
        }
    },

    populate: function (items, keyword) {
        if (items) {
            this.options.items = items;
        }
        this.tree.stroke({
            keyword: keyword
        });
    },

    _digest: function (v) {
        v || (v = []);
        var self = this, map = {};
        var selected = [];
        BI.each(v, function (i, val) {
            var node = self.structure.search(val, "value");
            if (node) {
                var p = node;
                p = p.getParent();
                if (p) {
                    if (!map[p.value]) {
                        map[p.value] = 0;
                    }
                    map[p.value]++;
                }

                while (p && p.getChildrenLength() <= map[p.value]) {
                    selected.push(p.value);
                    p = p.getParent();
                    if (p) {
                        if (!map[p.value]) {
                            map[p.value] = 0;
                        }
                        map[p.value]++;
                    }
                }
            }
        });
        return BI.makeObject(v.concat(selected));
    },

    setValue: function (v) {
        this.tree.setValue(this._digest(v));
    },

    _getValue: function () {
        var self = this, result = [], val = this.tree.getValue();
        var track = function (nodes) {
            BI.each(nodes, function (key, node) {
                if (BI.isEmpty(node)) {
                    result.push(key);
                } else {
                    track(node);
                }
            });
        };
        track(val);
        return result;
    },

    empty: function () {
        this.tree.empty();
    },

    getValue: function () {
        var self = this, result = [], val = this._getValue();
        BI.each(val, function (i, key) {
            var target = self.structure.search(key, "value");
            if (target) {
                self.structure._traverse(target, function (node) {
                    if (node.isLeaf()) {
                        result.push(node.value);
                    }
                });
            }
        });
        return result;
    }
});
BI.SimpleTreeView.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.simple_tree", BI.SimpleTreeView);
/**
 * 文本输入框trigger
 *
 * Created by GUY on 2015/9/15.
 * @class BI.EditorTrigger
 * @extends BI.Trigger
 */
BI.EditorTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4
    },

    _defaultConfig: function () {
        var conf = BI.EditorTrigger.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-editor-trigger bi-border",
            height: 24,
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn,
            allowBlank: false,
            watermark: "",
            errorText: ""
        });
    },

    _init: function () {
        this.options.height -= 2;
        BI.EditorTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            height: o.height,
            value: o.value,
            validationChecker: o.validationChecker,
            quitChecker: o.quitChecker,
            allowBlank: o.allowBlank,
            watermark: o.watermark,
            errorText: o.errorText
        });
        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.SignEditor.EVENT_CHANGE, function () {
            self.fireEvent(BI.EditorTrigger.EVENT_CHANGE, arguments);
        });

        BI.createWidget({
            element: this,
            type: "bi.htape",
            items: [
                {
                    el: this.editor
                }, {
                    el: {
                        type: "bi.trigger_icon_button",
                        width: o.triggerWidth || o.height
                    },
                    width: o.triggerWidth || o.height
                }
            ]
        });
    },

    getValue: function () {
        return this.editor.getValue();
    },

    setValue: function (value) {
        this.editor.setValue(value);
    },

    setText: function (text) {
        this.editor.setState(text);
    }
});
BI.EditorTrigger.EVENT_CHANGE = "BI.EditorTrigger.EVENT_CHANGE";
BI.shortcut("bi.editor_trigger", BI.EditorTrigger);/**
 * 图标按钮trigger
 *
 * Created by GUY on 2015/10/8.
 * @class BI.IconTrigger
 * @extends BI.Trigger
 */
BI.IconTrigger = BI.inherit(BI.Trigger, {

    _defaultConfig: function () {
        return BI.extend(BI.IconTrigger.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-icon-trigger",
            el: {},
            height: 24
        });
    },
    _init: function () {
        var o = this.options;
        BI.IconTrigger.superclass._init.apply(this, arguments);
        this.iconButton = BI.createWidget(o.el, {
            type: "bi.trigger_icon_button",
            element: this,
            width: o.width,
            height: o.height
        });
    }
});
BI.shortcut("bi.icon_trigger", BI.IconTrigger);/**
 * 文字trigger
 *
 * Created by GUY on 2015/9/15.
 * @class BI.IconTextTrigger
 * @extends BI.Trigger
 */
BI.IconTextTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4
    },

    _defaultConfig: function () {
        var conf = BI.IconTextTrigger.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-text-trigger",
            height: 24,
            iconHeight: null,
            iconWidth: null
        });
    },

    _init: function () {
        BI.IconTextTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.text = BI.createWidget({
            type: "bi.label",
            cls: "select-text-label",
            textAlign: "left",
            height: o.height,
            text: o.text
        });
        this.trigerButton = BI.createWidget({
            type: "bi.trigger_icon_button",
            width: o.triggerWidth || o.height
        });

        BI.createWidget({
            element: this,
            type: "bi.htape",
            ref: function (_ref) {
                self.wrapper = _ref;
            },
            items: [{
                el: {
                    type: "bi.icon_change_button",
                    cls: "icon-combo-trigger-icon",
                    iconCls: o.iconCls,
                    ref: function (_ref) {
                        self.icon = _ref;
                    },
                    iconHeight: o.iconHeight,
                    iconWidth: o.iconWidth,
                    disableSelected: true
                },
                width: BI.isEmptyString(o.iconCls) ? 0 : (o.iconWrapperWidth || o.height)
            },
            {
                el: this.text,
                lgap: BI.isEmptyString(o.iconCls) ? 5 : 0
            }, {
                el: this.trigerButton,
                width: o.triggerWidth || o.height
            }
            ]
        });
    },

    setValue: function (value) {
        this.text.setValue(value);
    },

    setIcon: function (iconCls) {
        var o = this.options;
        this.icon.setIcon(iconCls);
        var iconItem = this.wrapper.attr("items")[0];
        var textItem = this.wrapper.attr("items")[1];
        if(BI.isNull(iconCls) || BI.isEmptyString(iconCls)) {
            if(iconItem.width !== 0) {
                iconItem.width = 0;
                textItem.lgap = 5;
                this.wrapper.resize();
            }
        }else{
            if(iconItem.width !== (o.iconWrapperWidth || o.height)) {
                iconItem.width = (o.iconWrapperWidth || o.height);
                textItem.lgap = 0;
                this.wrapper.resize();
            }
        }
    },

    setText: function (text) {
        this.text.setText(text);
    }
});
BI.shortcut("bi.icon_text_trigger", BI.IconTextTrigger);/**
 * Created by Windy on 2017/12/12.
 */
BI.SelectIconTextTrigger = BI.inherit(BI.Trigger, {

    _defaultConfig: function () {
        return BI.extend(BI.SelectIconTextTrigger.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-text-trigger bi-border",
            height: 24,
            iconHeight: null,
            iconWidth: null,
            iconCls: ""
        });
    },

    _init: function () {
        this.options.height -= 2;
        BI.SelectIconTextTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var obj = this._digist(o.value, o.items);
        this.trigger = BI.createWidget({
            type: "bi.icon_text_trigger",
            element: this,
            text: obj.text,
            iconCls: obj.iconCls,
            height: o.height,
            iconHeight: o.iconHeight,
            iconWidth: o.iconWidth,
            iconWrapperWidth: o.iconWrapperWidth
        });
    },

    _digist: function (vals, items) {
        var o = this.options;
        vals = BI.isArray(vals) ? vals : [vals];
        var result;
        var formatItems = BI.Tree.transformToArrayFormat(items);
        BI.any(formatItems, function (i, item) {
            if (BI.deepContains(vals, item.value)) {
                result = {
                    text: item.text || item.value,
                    iconCls: item.iconCls
                };
                return true;
            }
        });

        if (BI.isNotNull(result)) {
            return {
                text: result.text,
                iconCls: result.iconCls
            };
        } else {
            return {
                text: o.text,
                iconCls: o.iconCls
            };
        }
    },

    setValue: function (vals) {
        var obj = this._digist(vals, this.options.items);
        this.trigger.setText(obj.text);
        this.trigger.setIcon(obj.iconCls);
    },

    populate: function (items) {
        this.options.items = items;
    }
});
BI.shortcut("bi.select_icon_text_trigger", BI.SelectIconTextTrigger);/**
 * 文字trigger
 *
 * Created by GUY on 2015/9/15.
 * @class BI.TextTrigger
 * @extends BI.Trigger
 */
BI.TextTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4
    },

    _defaultConfig: function () {
        var conf = BI.TextTrigger.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-text-trigger",
            height: 24
        });
    },

    _init: function () {
        BI.TextTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.text = BI.createWidget({
            type: "bi.label",
            cls: "select-text-label",
            textAlign: "left",
            height: o.height,
            text: o.text,
            title: function () {
                return self.text.getText();
            },
            hgap: c.hgap,
            readonly: o.readonly
        });
        this.trigerButton = BI.createWidget({
            type: "bi.trigger_icon_button",
            width: o.triggerWidth || o.height
        });

        BI.createWidget({
            element: this,
            type: "bi.htape",
            items: [
                {
                    el: this.text
                }, {
                    el: this.trigerButton,
                    width: o.triggerWidth || o.height
                }
            ]
        });
    },

    setText: function (text) {
        this.text.setText(text);
    }
});
BI.shortcut("bi.text_trigger", BI.TextTrigger);/**
 * 选择字段trigger
 *
 * Created by GUY on 2015/9/15.
 * @class BI.SelectTextTrigger
 * @extends BI.Trigger
 */
BI.SelectTextTrigger = BI.inherit(BI.Trigger, {

    _defaultConfig: function () {
        return BI.extend(BI.SelectTextTrigger.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-text-trigger bi-border bi-focus-shadow",
            height: 24
        });
    },

    _init: function () {
        this.options.height -= 2;
        BI.SelectTextTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.text_trigger",
            element: this,
            height: o.height,
            readonly: o.readonly,
            text: this._digest(o.value, o.items)
        });
    },
    
    _digest: function(vals, items){
        var o = this.options;
        vals = BI.isArray(vals) ? vals : [vals];
        var result = [];
        var formatItems = BI.Tree.transformToArrayFormat(items);
        BI.each(formatItems, function (i, item) {
            if (BI.deepContains(vals, item.value) && !result.contains(item.text || item.value)) {
                result.push(item.text || item.value);
            }
        });

        if (result.length > 0) {
            return result.join(",");
        } else {
            return o.text;
        }
    },

    setValue: function (vals) {
        this.trigger.setText(this._digest(vals, this.options.items));
    },

    populate: function (items) {
        this.options.items = items;
    }
});
BI.shortcut("bi.select_text_trigger", BI.SelectTextTrigger);/**
 * 选择字段trigger小一号的
 *
 * @class BI.SmallSelectTextTrigger
 * @extends BI.Trigger
 */
BI.SmallSelectTextTrigger = BI.inherit(BI.Trigger, {

    _defaultConfig: function () {
        return BI.extend(BI.SmallSelectTextTrigger.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-small-select-text-trigger bi-border",
            height: 20
        });
    },

    _init: function () {
        this.options.height -= 2;
        BI.SmallSelectTextTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var obj = this._digest(o.text, o.items);
        this.trigger = BI.createWidget({
            type: "bi.small_text_trigger",
            element: this,
            height: o.height - 2,
            text: obj.text,
            cls: obj.cls
        });
    },

    _digest: function(vals, items){
        var o = this.options;
        vals = BI.isArray(vals) ? vals : [vals];
        var result = [];
        var formatItems = BI.Tree.transformToArrayFormat(items);
        BI.each(formatItems, function (i, item) {
            if (BI.deepContains(vals, item.value) && !result.contains(item.text || item.value)) {
                result.push(item.text || item.value);
            }
        });

        if (result.length > 0) {
            return {
                cls: "",
                text: result.join(",")
            }
        } else {
            return {
                cls: "bi-water-mark",
                text: o.text
            }
        }
    },

    setValue: function (vals) {
        var formatValue = this._digest(vals, this.options.items);
        this.trigger.element.removeClass("bi-water-mark").addClass(formatValue.cls);
        this.trigger.setText(formatValue.text);
    },

    populate: function (items) {
        this.options.items = items;
    }
});
BI.shortcut("bi.small_select_text_trigger", BI.SmallSelectTextTrigger);/**
 * 文字trigger(右边小三角小一号的) ==
 *
 * @class BI.SmallTextTrigger
 * @extends BI.Trigger
 */
BI.SmallTextTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4
    },

    _defaultConfig: function () {
        var conf = BI.SmallTextTrigger.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-text-trigger",
            height: 20
        });
    },

    _init: function () {
        BI.SmallTextTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.text = BI.createWidget({
            type: "bi.label",
            textAlign: "left",
            height: o.height,
            text: o.text,
            hgap: c.hgap
        });
        this.trigerButton = BI.createWidget({
            type: "bi.trigger_icon_button",
            width: o.triggerWidth || o.height
        });

        BI.createWidget({
            element: this,
            type: "bi.htape",
            items: [
                {
                    el: this.text
                }, {
                    el: this.trigerButton,
                    width: o.triggerWidth || o.height
                }
            ]
        });
    },

    setValue: function (value) {
        this.text.setValue(value);
    },

    setText: function (text) {
        this.text.setText(text);
    }
});
BI.shortcut("bi.small_text_trigger", BI.SmallTextTrigger);