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
            iconClass: "",
            iconWidth: null,
            iconHeight: null,

            stopEvent: false,
            stopPropagation: false,
            selected: false,
            once: false, //点击一次选中有效,再点无效
            forceSelected: false, //点击即选中， 选中了就不会被取消
            forceNotSelected: false, //无论怎么点击都不会被选中
            disableSelected: false, //使能选中

            shadow: false,
            isShadowShowingOnSelected: false,  //选中状态下是否显示阴影
            trigger: null,
            handler: BI.emptyFn
        })
    },

    _init: function () {
        BI.IconChangeButton.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.button = BI.createWidget({
            type: "bi.icon_button",
            element: this,
            cls: o.iconClass,
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
        if (o.iconClass !== cls) {
            this.element.removeClass(o.iconClass).addClass(cls);
            o.iconClass = cls;
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
    _defaultConfig: function() {
        var conf = BI.HalfIconButton.superclass._defaultConfig.apply(this,arguments);
        return BI.extend(conf, {
            extraCls: "bi-half-icon-button check-half-select-icon",
            height: 16,
            width: 16,
            iconWidth: 16,
            iconHeight: 16,
            selected: false
        })
    },

    _init : function() {
        BI.HalfIconButton.superclass._init.apply(this, arguments);
    },

    doClick: function(){
        BI.HalfIconButton.superclass.doClick.apply(this, arguments);
        if(this.isValid()){
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
            height: 25,
            logic: {
                dynamic: false
            }
        })
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
                width: 36
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
            iconClass: "",
            hgap: 10,
            height: 25
        })
    },
    _init: function () {
        BI.SingleSelectIconTextItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.text = BI.createWidget({
            type: "bi.icon_text_item",
            element: this,
            cls: o.iconClass,
            once: o.once,
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
            height: 25,
            textAlign: "left",
        })
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
            extraCls: "bi-single-select-radio-item bi-list-item-active",
            logic: {
                dynamic: false
            },
            hgap: 10,
            height: 25
        })
    },
    _init: function () {
        BI.SingleSelectRadioItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.radio = BI.createWidget({
            type: "bi.radio"
        });
        this.radio.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {
                self.setSelected(!self.isSelected());
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
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
                width: 36
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
            height: 25
        });
    },
    _init: function () {
        var self = this, o = this.options;
        BI.ArrowNode.superclass._init.apply(this, arguments);
        this.checkbox = BI.createWidget({
            type: "bi.arrow_tree_group_node_checkbox",
            iconWidth: 13,
            iconHeight: 13
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
    setValue: function (v) {
        this.text.setValue(v);
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
            height: 25
        })
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
            height: 25
        })
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
            layer: 0,//第几层级
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
        BI.MultiLayerIconArrowNode.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.node = BI.createWidget({
            type: "bi.icon_arrow_node",
            iconCls: o.iconCls,
            //logic: {
            //    dynamic: true
            //},
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

BI.shortcut("bi.multilayer_icon_arrow_node", BI.MultiLayerIconArrowNode);/**
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

BI.shortcut("bi.triangle_group_node", BI.TriangleGroupNode);/**
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
            height: 25
        })
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
            py: o.py
        });
        this.checkbox.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {
                self.setSelected(self.isSelected());
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        var type = BI.LogicFactory.createLogicTypeByDirection(BI.Direction.Left);
        var items = BI.LogicFactory.createLogicItemsByDirection(BI.Direction.Left, ((o.layer === 0) ? "" : {
            width: 13,
            el: {
                type: "bi.layout",
                cls: "base-line-conn-background",
                width: 13,
                height: o.height
            }
        }), {
            width: 25,
            el: {
                type: "bi.layout",
                cls: "mid-line-conn-background",
                width: 25,
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
            height: 25,
            iconWidth: 16,
            iconHeight: 16,
            iconCls: ""
        })
    },

    _init: function () {
        BI.IconTreeLeafItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        var icon = BI.createWidget({
            type: "bi.center_adapt",
            width: 23,
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
            width: 23,
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
            height: 25
        })
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
            py: o.py
        });
        this.checkbox.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {
                self.setSelected(self.isSelected());
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        var type = BI.LogicFactory.createLogicTypeByDirection(BI.Direction.Left);
        var items = BI.LogicFactory.createLogicItemsByDirection(BI.Direction.Left, ((o.layer === 0) ? "" : {
            width: 13,
            el: {
                type: "bi.layout",
                cls: "base-line-conn-background",
                width: 13,
                height: o.height
            }
        }), {
            width: 25,
            el: {
                type: "bi.layout",
                cls: "mid-line-conn-background",
                width: 25,
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
            height: 25
        })
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
            py: o.py
        });
        this.checkbox.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {
                self.setSelected(self.isSelected());
            }
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        var type = BI.LogicFactory.createLogicTypeByDirection(BI.Direction.Left);
        var items = BI.LogicFactory.createLogicItemsByDirection(BI.Direction.Left, ((o.layer === 0) ? "" : {
            width: 13,
            el: {
                type: "bi.layout",
                cls: "base-line-conn-background",
                width: 13,
                height: o.height
            }
        }), {
            width: 25,
            el: {
                type: "bi.layout",
                cls: "mid-line-conn-background",
                width: 25,
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
            element: this,
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

BI.shortcut("bi.multilayer_icon_tree_leaf_item", BI.MultiLayerIconTreeLeafItem);/**
 * 树叶子节点
 * Created by GUY on 2015/9/6.
 * @class BI.TreeTextLeafItem
 * @extends BI.BasicButton
 */
BI.TreeTextLeafItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function() {
        return BI.extend(BI.TreeTextLeafItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-tree-text-leaf-item bi-list-item-active",
            id: "",
            pId: "",
            height: 25,
            hgap: 0,
            lgap: 0,
            rgap: 0
        })
    },
    _init : function() {
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
        })
    },

    doRedMark: function(){
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function(){
        this.text.unRedMark.apply(this.text, arguments);
    },

    doHighLight: function(){
        this.text.doHighLight.apply(this.text, arguments);
    },

    unHighLight: function(){
        this.text.unHighLight.apply(this.text, arguments);
    },

    getId: function(){
        return this.options.id;
    },

    getPId: function(){
        return this.options.pId;
    }
});

BI.shortcut("bi.tree_text_leaf_item", BI.TreeTextLeafItem);/**
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
            min: '1900-01-01', //最小日期
            max: '2099-12-31', //最大日期
            year: 2015,
            month: 7,  //7表示八月
            day: 25
        })
    },

    _dateCreator: function (Y, M, D) {
        var self = this, o = this.options, log = {}, De = new Date();
        var mins = o.min.match(/\d+/g);
        var maxs = o.max.match(/\d+/g);
        Y < (mins[0] | 0) && (Y = (mins[0] | 0));
        Y > (maxs[0] | 0) && (Y = (maxs[0] | 0));

        De.setFullYear(Y, M, D);
        log.ymd = [De.getFullYear(), De.getMonth(), De.getDate()];

        var MD = Date._MD.slice(0);
        MD[1] = Date.isLeap(log.ymd[0]) ? 29 : 28;

        De.setFullYear(log.ymd[0], log.ymd[1], 1);
        log.FDay = De.getDay();

        log.PDay = MD[M === 0 ? 11 : M - 1] - log.FDay + 1;
        log.NDay = 1;

        var items = [];
        BI.each(BI.range(42), function (i) {
            var td = {}, YY = log.ymd[0], MM = log.ymd[1] + 1, DD;
            if (i < log.FDay) {
                td.lastMonth = true;
                DD = i + log.PDay;
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
            if (Date.checkVoid(YY, MM, DD, mins, maxs)[0]) {
                td.disabled = true;
            }
            td.text = DD;
            items.push(td);
        })
        return items;
    },

    _init: function () {
        BI.Calendar.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var items = BI.map(Date._SDN.slice(0, 7), function (i, value) {
            return {
                type: "bi.label",
                height: 25,
                text: value
            }
        })
        var title = BI.createWidget({
            type: "bi.button_group",
            height: 25,
            items: items
        })
        var days = this._dateCreator(o.year, o.month, o.day);
        items = [];
        items.push(days.slice(0, 7));
        items.push(days.slice(7, 14));
        items.push(days.slice(14, 21));
        items.push(days.slice(21, 28));
        items.push(days.slice(28, 35));
        items.push(days.slice(35, 42));

        items = BI.map(items, function (i, item) {
            return BI.map(item, function (j, td) {
                return BI.extend(td, {
                    type: "bi.text_item",
                    cls: "bi-list-item-active",
                    textAlign: "center",
                    whiteSpace: "normal",
                    once: false,
                    forceSelected: true,
                    height: 25,
                    value: o.year + "-" + o.month + "-" + td.text,
                    disabled: td.lastMonth || td.nextMonth || td.disabled
                    //selected: td.currentDay
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
                rowSize: 25
            }))]
        });
        this.days.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        })
        BI.createWidget(BI.extend({
            element: this

        }, BI.LogicFactory.createLogic("vertical", BI.extend({}, o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection("top", title, this.days)
        }))));
    },

    isFrontDate: function () {
        var o = this.options, c = this._const;
        var Y = o.year, M = o.month, De = new Date(), day = De.getDay();
        Y = Y | 0;
        De.setFullYear(Y, M, 1);
        var newDate = De.getOffsetDate(-1 * (day + 1));
        return !!Date.checkVoid(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), o.min, o.max)[0];
    },

    isFinalDate: function () {
        var o = this.options, c = this._const;
        var Y = o.year, M = o.month, De = new Date(), day = De.getDay();
        Y = Y | 0;
        De.setFullYear(Y, M, 1);
        var newDate = De.getOffsetDate(42 - day);
        return !!Date.checkVoid(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), o.min, o.max)[0];
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
        }
    }
});

BI.extend(BI.Calendar, {
    getPageByDateJSON: function (json) {
        var year = new Date().getFullYear();
        var month = new Date().getMonth();
        var page = (json.year - year) * 12;
        page += json.month - month;
        return page;
    },
    getDateJSONByPage: function(v){
        var months = new Date().getMonth();
        var page = v;

        //对当前page做偏移,使到当前年初
        page = page + months;

        var year = BI.parseInt(page / 12);
        if(page < 0 && page % 12 !== 0){
            year--;
        }
        var month = page >= 0 ? (page % 12) : ((12 + page % 12) % 12);
        return {
            year: new Date().getFullYear() + year,
            month: month
        }
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
            min: '1900-01-01', //最小日期
            max: '2099-12-31', //最大日期
            year: null
        })
    },

    _yearCreator: function (Y) {
        var o = this.options;
        Y = Y | 0;
        var start = BI.YearCalendar.getStartYear(Y);
        var items = [];
        BI.each(BI.range(BI.YearCalendar.INTERVAL), function (i) {
            var td = {};
            if (Date.checkVoid(start + i, 1, 1, o.min, o.max)[0]) {
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
        this.currentYear = new Date().getFullYear();
        var years = this._yearCreator(o.year || this.currentYear);

        //纵向排列年
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
                    height: 23,
                    width: 38,
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
                rowSize: 25
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
        return !!Date.checkVoid(BI.YearCalendar.getStartYear(Y) - 1, 1, 1, o.min, o.max)[0];
    },

    isFinalYear: function () {
        var o = this.options, c = this._const;
        var Y = o.year;
        Y = Y | 0;
        return !!Date.checkVoid(BI.YearCalendar.getEndYear(Y) + 1, 1, 1, o.min, o.max)[0];
    },

    setValue: function (val) {
        this.years.setValue([val]);
    },

    getValue: function () {
        return this.years.getValue()[0];
    }
});
//类方法
BI.extend(BI.YearCalendar, {
    INTERVAL: 12,

    //获取显示的第一年
    getStartYear: function (year) {
        var cur = new Date().getFullYear();
        return year - ((year - cur + 3) % BI.YearCalendar.INTERVAL + 12) % BI.YearCalendar.INTERVAL;
    },

    getEndYear: function (year) {
        return BI.YearCalendar.getStartYear(year) + BI.YearCalendar.INTERVAL;
    },

    getPageByYear: function (year) {
        var cur = new Date().getFullYear();
        year = BI.YearCalendar.getStartYear(year);
        return (year - cur + 3) / BI.YearCalendar.INTERVAL;
    }
});

BI.shortcut("bi.year_calendar", BI.YearCalendar);/**
 * 绘制一些较复杂的canvas
 *
 * Created by GUY on 2015/11/24.
 * @class BI.ComplexCanvas
 * @extends BI.Widget
 */
BI.ComplexCanvas = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.ComplexCanvas.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-complex-canvas"
        })
    },


    _init: function () {
        BI.ComplexCanvas.superclass._init.apply(this, arguments);
        var o = this.options;
        this.canvas = BI.createWidget({
            type: "bi.canvas",
            element: this,
            width: o.width,
            height: o.height
        });
    },

    //绘制树枝节点
    branch: function (x0, y0, x1, y1, x2, y2) {
        var self = this, args = [].slice.call(arguments);
        if (args.length <= 5) {
            return this.canvas.line.apply(this.canvas, arguments);
        }
        var options;
        if (BI.isOdd(args.length)) {
            options = BI.last(args);
            args = BI.initial(args);
        }
        args = [].slice.call(args, 2);
        var odd = BI.filter(args, function (i) {
            return i % 2 === 0;
        });
        var even = BI.filter(args, function (i) {
            return i % 2 !== 0;
        });
        options || (options = {});
        var offset = options.offset || 20;
        if ((y0 > y1 && y0 > y2) || (y0 < y1 && y0 < y2)) {
            if (y0 > y1 && y0 > y2) {
                var y = Math.max.apply(this, even) + offset;
            } else {
                var y = Math.min.apply(this, even) - offset;
            }
            var minx = Math.min.apply(this, odd);
            var minix = BI.indexOf(odd, minx);
            var maxx = Math.max.apply(this, odd);
            var maxix = BI.indexOf(odd, maxx);
            this.canvas.line(minx, even[minix], minx, y, maxx, y, maxx, even[maxix], options);
            BI.each(odd, function (i, dot) {
                if (i !== maxix && i !== minix) {
                    self.canvas.line(dot, even[i], dot, y, options);
                }
            });
            this.canvas.line(x0, y, x0, y0, options);
            return;
        }
        if ((x0 > x1 && x0 > x2) || (x0 < x1 && x0 < x2)) {
            if (x0 > x1 && x0 > x2) {
                var x = Math.max.apply(this, odd) + offset;
            } else {
                var x = Math.min.apply(this, odd) - offset;
            }
            var miny = Math.min.apply(this, even);
            var miniy = BI.indexOf(even, miny);
            var maxy = Math.max.apply(this, even);
            var maxiy = BI.indexOf(even, maxy);
            this.canvas.line(odd[miniy], miny, x, miny, x, maxy, odd[maxiy], maxy, options);
            BI.each(even, function (i, dot) {
                if (i !== miniy && i !== maxiy) {
                    self.canvas.line(odd[i], dot, x, dot, options);
                }
            });
            this.canvas.line(x, y0, x0, y0, options);
            return;
        }
    },

    stroke: function (callback) {
        this.canvas.stroke(callback);
    }
});

BI.shortcut("bi.complex_canvas", BI.ComplexCanvas);/**
 * Created by roy on 15/10/16.
 * 上箭头与下箭头切换的树节点
 */
BI.ArrowTreeGroupNodeCheckbox=BI.inherit(BI.IconButton,{
    _defaultConfig:function(){
        return BI.extend(BI.ArrowTreeGroupNodeCheckbox.superclass._defaultConfig.apply(this,arguments),{
            extraCls:"bi-arrow-tree-group-node",
            iconWidth: 13,
            iconHeight: 13
        });
    },
    _init:function(){
        BI.ArrowTreeGroupNodeCheckbox.superclass._init.apply(this,arguments);
    },
    setSelected: function(v){
        BI.ArrowTreeGroupNodeCheckbox.superclass.setSelected.apply(this, arguments);
        if(v) {
            this.element.removeClass("column-next-page-h-font").addClass("column-pre-page-h-font");
        } else {
            this.element.removeClass("column-pre-page-h-font").addClass("column-next-page-h-font");
        }
    }
});
BI.shortcut("bi.arrow_tree_group_node_checkbox",BI.ArrowTreeGroupNodeCheckbox);/**
 * 十字型的树节点
 * @class BI.CheckingMarkNode
 * @extends BI.IconButton
 */
BI.CheckingMarkNode = BI.inherit(BI.IconButton, {
    _defaultConfig: function() {
        return BI.extend( BI.CheckingMarkNode.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "check-mark-font",
            iconWidth: 13,
            iconHeight: 13
        });
    },
    _init:function() {
        BI.CheckingMarkNode.superclass._init.apply(this, arguments);
        this.setSelected(this.options.selected);

    },
    setSelected: function(v){
        BI.CheckingMarkNode.superclass.setSelected.apply(this, arguments);
        if(v===true) {
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
    _defaultConfig: function() {
        return BI.extend( BI.FirstTreeNodeCheckbox.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "tree-collapse-icon-type2",
            iconWidth: 25,
            iconHeight: 25
        });
    },
    _init:function() {
        BI.FirstTreeNodeCheckbox.superclass._init.apply(this, arguments);

    },
    setSelected: function(v){
        BI.FirstTreeNodeCheckbox.superclass.setSelected.apply(this, arguments);
        if(v===true) {
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
    _defaultConfig: function() {
        return BI.extend( BI.LastTreeNodeCheckbox.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "tree-collapse-icon-type4",
            iconWidth: 25,
            iconHeight: 25
        });
    },
    _init:function() {
        BI.LastTreeNodeCheckbox.superclass._init.apply(this, arguments);

    },
    setSelected: function(v){
        BI.LastTreeNodeCheckbox.superclass.setSelected.apply(this, arguments);
        if(v===true) {
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
    _defaultConfig: function() {
        return BI.extend( BI.MidTreeNodeCheckbox.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "tree-collapse-icon-type3",
            iconWidth: 25,
            iconHeight: 25
        });
    },
    _init:function() {
        BI.MidTreeNodeCheckbox.superclass._init.apply(this, arguments);

    },
    setSelected: function(v){
        BI.MidTreeNodeCheckbox.superclass.setSelected.apply(this, arguments);
        if(v===true) {
            this.element.addClass("tree-expand-icon-type3");
        } else {
            this.element.removeClass("tree-expand-icon-type3");
        }
    }
});
BI.shortcut("bi.mid_tree_node_checkbox", BI.MidTreeNodeCheckbox);/**
 * 三角形的树节点
 * Created by GUY on 2015/9/6.
 * @class BI.TreeGroupNodeCheckbox
 * @extends BI.IconButton
 */
BI.TreeGroupNodeCheckbox = BI.inherit(BI.IconButton, {
    _defaultConfig: function() {
        return BI.extend( BI.TreeGroupNodeCheckbox.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "tree-node-triangle-collapse-font",
            iconWidth: 13,
            iconHeight: 13
        });
    },
    _init:function() {
        BI.TreeGroupNodeCheckbox.superclass._init.apply(this, arguments);

    },
    setSelected: function(v){
        BI.TreeGroupNodeCheckbox.superclass.setSelected.apply(this, arguments);
        if(v) {
            this.element.removeClass("tree-node-triangle-collapse-font").addClass("tree-node-triangle-expand-font");
        } else {
            this.element.removeClass("tree-node-triangle-expand-font").addClass("tree-node-triangle-collapse-font");
        }
    }
});
BI.shortcut("bi.tree_group_node_checkbox", BI.TreeGroupNodeCheckbox);/**
 * 十字型的树节点
 * @class BI.TreeNodeCheckbox
 * @extends BI.IconButton
 */
BI.TreeNodeCheckbox = BI.inherit(BI.IconButton, {
    _defaultConfig: function() {
        return BI.extend( BI.TreeNodeCheckbox.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "tree-collapse-icon-type1",
            iconWidth: 25,
            iconHeight: 25
        });
    },
    _init:function() {
        BI.TreeNodeCheckbox.superclass._init.apply(this, arguments);

    },
    setSelected: function(v){
        BI.TreeNodeCheckbox.superclass.setSelected.apply(this, arguments);
        if(v) {
            this.element.addClass("tree-expand-icon-type1");
        } else {
            this.element.removeClass("tree-expand-icon-type1");
        }
    }
});
BI.shortcut("bi.tree_node_checkbox", BI.TreeNodeCheckbox);/*!
 * clipboard.js v1.6.1
 * https://zenorocha.github.io/clipboard.js
 *
 * Licensed MIT © Zeno Rocha
 */
try {//IE8下会抛错
    (function (f) {
        if (typeof exports === "object" && typeof module !== "undefined") {
            module.exports = f()
        } else if (typeof define === "function" && define.amd) {
            define([], f)
        } else {
            var g;
            if (typeof window !== "undefined") {
                g = window
            } else if (typeof global !== "undefined") {
                g = global
            } else if (typeof self !== "undefined") {
                g = self
            } else {
                g = this
            }
            g.Clipboard = f()
        }
    })(function () {
        var define, module, exports;
        return (function e(t, n, r) {
            function s(o, u) {
                if (!n[o]) {
                    if (!t[o]) {
                        var a = typeof require == "function" && require;
                        if (!u && a)return a(o, !0);
                        if (i)return i(o, !0);
                        var f = new Error("Cannot find module '" + o + "'");
                        throw f.code = "MODULE_NOT_FOUND", f
                    }
                    var l = n[o] = {exports: {}};
                    t[o][0].call(l.exports, function (e) {
                        var n = t[o][1][e];
                        return s(n ? n : e)
                    }, l, l.exports, e, t, n, r)
                }
                return n[o].exports
            }

            var i = typeof require == "function" && require;
            for (var o = 0; o < r.length; o++)s(r[o]);
            return s
        })({
            1: [function (require, module, exports) {
                var DOCUMENT_NODE_TYPE = 9;

                /**
                 * A polyfill for Element.matches()
                 */
                if (typeof Element !== 'undefined' && !Element.prototype.matches) {
                    var proto = Element.prototype;

                    proto.matches = proto.matchesSelector ||
                        proto.mozMatchesSelector ||
                        proto.msMatchesSelector ||
                        proto.oMatchesSelector ||
                        proto.webkitMatchesSelector;
                }

                /**
                 * Finds the closest parent that matches a selector.
                 *
                 * @param {Element} element
                 * @param {String} selector
                 * @return {Function}
                 */
                function closest(element, selector) {
                    while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
                        if (element.matches(selector)) return element;
                        element = element.parentNode;
                    }
                }

                module.exports = closest;

            }, {}], 2: [function (require, module, exports) {
                var closest = require('./closest');

                /**
                 * Delegates event to a selector.
                 *
                 * @param {Element} element
                 * @param {String} selector
                 * @param {String} type
                 * @param {Function} callback
                 * @param {Boolean} useCapture
                 * @return {Object}
                 */
                function delegate(element, selector, type, callback, useCapture) {
                    var listenerFn = listener.apply(this, arguments);

                    element.addEventListener(type, listenerFn, useCapture);

                    return {
                        destroy: function () {
                            element.removeEventListener(type, listenerFn, useCapture);
                        }
                    }
                }

                /**
                 * Finds closest match and invokes callback.
                 *
                 * @param {Element} element
                 * @param {String} selector
                 * @param {String} type
                 * @param {Function} callback
                 * @return {Function}
                 */
                function listener(element, selector, type, callback) {
                    return function (e) {
                        e.delegateTarget = closest(e.target, selector);

                        if (e.delegateTarget) {
                            callback.call(element, e);
                        }
                    }
                }

                module.exports = delegate;

            }, {"./closest": 1}], 3: [function (require, module, exports) {
                /**
                 * Check if argument is a HTML element.
                 *
                 * @param {Object} value
                 * @return {Boolean}
                 */
                exports.node = function (value) {
                    return value !== undefined
                        && value instanceof HTMLElement
                        && value.nodeType === 1;
                };

                /**
                 * Check if argument is a list of HTML elements.
                 *
                 * @param {Object} value
                 * @return {Boolean}
                 */
                exports.nodeList = function (value) {
                    var type = Object.prototype.toString.call(value);

                    return value !== undefined
                        && (type === '[object NodeList]' || type === '[object HTMLCollection]')
                        && ('length' in value)
                        && (value.length === 0 || exports.node(value[0]));
                };

                /**
                 * Check if argument is a string.
                 *
                 * @param {Object} value
                 * @return {Boolean}
                 */
                exports.string = function (value) {
                    return typeof value === 'string'
                        || value instanceof String;
                };

                /**
                 * Check if argument is a function.
                 *
                 * @param {Object} value
                 * @return {Boolean}
                 */
                exports.fn = function (value) {
                    var type = Object.prototype.toString.call(value);

                    return type === '[object Function]';
                };

            }, {}], 4: [function (require, module, exports) {
                var is = require('./is');
                var delegate = require('delegate');

                /**
                 * Validates all params and calls the right
                 * listener function based on its target type.
                 *
                 * @param {String|HTMLElement|HTMLCollection|NodeList} target
                 * @param {String} type
                 * @param {Function} callback
                 * @return {Object}
                 */
                function listen(target, type, callback) {
                    if (!target && !type && !callback) {
                        throw new Error('Missing required arguments');
                    }

                    if (!is.string(type)) {
                        throw new TypeError('Second argument must be a String');
                    }

                    if (!is.fn(callback)) {
                        throw new TypeError('Third argument must be a Function');
                    }

                    if (is.node(target)) {
                        return listenNode(target, type, callback);
                    }
                    else if (is.nodeList(target)) {
                        return listenNodeList(target, type, callback);
                    }
                    else if (is.string(target)) {
                        return listenSelector(target, type, callback);
                    }
                    else {
                        throw new TypeError('First argument must be a String, HTMLElement, HTMLCollection, or NodeList');
                    }
                }

                /**
                 * Adds an event listener to a HTML element
                 * and returns a remove listener function.
                 *
                 * @param {HTMLElement} node
                 * @param {String} type
                 * @param {Function} callback
                 * @return {Object}
                 */
                function listenNode(node, type, callback) {
                    node.addEventListener(type, callback);

                    return {
                        destroy: function () {
                            node.removeEventListener(type, callback);
                        }
                    }
                }

                /**
                 * Add an event listener to a list of HTML elements
                 * and returns a remove listener function.
                 *
                 * @param {NodeList|HTMLCollection} nodeList
                 * @param {String} type
                 * @param {Function} callback
                 * @return {Object}
                 */
                function listenNodeList(nodeList, type, callback) {
                    Array.prototype.forEach.call(nodeList, function (node) {
                        node.addEventListener(type, callback);
                    });

                    return {
                        destroy: function () {
                            Array.prototype.forEach.call(nodeList, function (node) {
                                node.removeEventListener(type, callback);
                            });
                        }
                    }
                }

                /**
                 * Add an event listener to a selector
                 * and returns a remove listener function.
                 *
                 * @param {String} selector
                 * @param {String} type
                 * @param {Function} callback
                 * @return {Object}
                 */
                function listenSelector(selector, type, callback) {
                    return delegate(document.body, selector, type, callback);
                }

                module.exports = listen;

            }, {"./is": 3, "delegate": 2}], 5: [function (require, module, exports) {
                function select(element) {
                    var selectedText;

                    if (element.nodeName === 'SELECT') {
                        element.focus();

                        selectedText = element.value;
                    }
                    else if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
                        var isReadOnly = element.hasAttribute('readonly');

                        if (!isReadOnly) {
                            element.setAttribute('readonly', '');
                        }

                        element.select();
                        element.setSelectionRange(0, element.value.length);

                        if (!isReadOnly) {
                            element.removeAttribute('readonly');
                        }

                        selectedText = element.value;
                    }
                    else {
                        if (element.hasAttribute('contenteditable')) {
                            element.focus();
                        }

                        var selection = window.getSelection();
                        var range = document.createRange();

                        range.selectNodeContents(element);
                        selection.removeAllRanges();
                        selection.addRange(range);

                        selectedText = selection.toString();
                    }

                    return selectedText;
                }

                module.exports = select;

            }, {}], 6: [function (require, module, exports) {
                function E() {
                    // Keep this empty so it's easier to inherit from
                    // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
                }

                E.prototype = {
                    on: function (name, callback, ctx) {
                        var e = this.e || (this.e = {});

                        (e[name] || (e[name] = [])).push({
                            fn: callback,
                            ctx: ctx
                        });

                        return this;
                    },

                    once: function (name, callback, ctx) {
                        var self = this;

                        function listener() {
                            self.off(name, listener);
                            callback.apply(ctx, arguments);
                        };

                        listener._ = callback
                        return this.on(name, listener, ctx);
                    },

                    emit: function (name) {
                        var data = [].slice.call(arguments, 1);
                        var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
                        var i = 0;
                        var len = evtArr.length;

                        for (i; i < len; i++) {
                            evtArr[i].fn.apply(evtArr[i].ctx, data);
                        }

                        return this;
                    },

                    off: function (name, callback) {
                        var e = this.e || (this.e = {});
                        var evts = e[name];
                        var liveEvents = [];

                        if (evts && callback) {
                            for (var i = 0, len = evts.length; i < len; i++) {
                                if (evts[i].fn !== callback && evts[i].fn._ !== callback)
                                    liveEvents.push(evts[i]);
                            }
                        }

                        // Remove event from queue to prevent memory leak
                        // Suggested by https://github.com/lazd
                        // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

                        (liveEvents.length)
                            ? e[name] = liveEvents
                            : delete e[name];

                        return this;
                    }
                };

                module.exports = E;

            }, {}], 7: [function (require, module, exports) {
                (function (global, factory) {
                    if (typeof define === "function" && define.amd) {
                        define(['module', 'select'], factory);
                    } else if (typeof exports !== "undefined") {
                        factory(module, require('select'));
                    } else {
                        var mod = {
                            exports: {}
                        };
                        factory(mod, global.select);
                        global.clipboardAction = mod.exports;
                    }
                })(this, function (module, _select) {
                    'use strict';

                    var _select2 = _interopRequireDefault(_select);

                    function _interopRequireDefault(obj) {
                        return obj && obj.__esModule ? obj : {
                            "default": obj
                        };
                    }

                    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
                        return typeof obj;
                    } : function (obj) {
                        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                    };

                    function _classCallCheck(instance, Constructor) {
                        if (!(instance instanceof Constructor)) {
                            throw new TypeError("Cannot call a class as a function");
                        }
                    }

                    var _createClass = function () {
                        function defineProperties(target, props) {
                            for (var i = 0; i < props.length; i++) {
                                var descriptor = props[i];
                                descriptor.enumerable = descriptor.enumerable || false;
                                descriptor.configurable = true;
                                if ("value" in descriptor) descriptor.writable = true;
                                Object.defineProperty(target, descriptor.key, descriptor);
                            }
                        }

                        return function (Constructor, protoProps, staticProps) {
                            if (protoProps) defineProperties(Constructor.prototype, protoProps);
                            if (staticProps) defineProperties(Constructor, staticProps);
                            return Constructor;
                        };
                    }();

                    var ClipboardAction = function () {
                        /**
                         * @param {Object} options
                         */
                        function ClipboardAction(options) {
                            _classCallCheck(this, ClipboardAction);

                            this.resolveOptions(options);
                            this.initSelection();
                        }

                        /**
                         * Defines base properties passed from constructor.
                         * @param {Object} options
                         */


                        _createClass(ClipboardAction, [{
                            key: 'resolveOptions',
                            value: function resolveOptions() {
                                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                                this.action = options.action;
                                this.emitter = options.emitter;
                                this.target = options.target;
                                this.text = options.text;
                                this.trigger = options.trigger;

                                this.selectedText = '';
                            }
                        }, {
                            key: 'initSelection',
                            value: function initSelection() {
                                if (this.text) {
                                    this.selectFake();
                                } else if (this.target) {
                                    this.selectTarget();
                                }
                            }
                        }, {
                            key: 'selectFake',
                            value: function selectFake() {
                                var _this = this;

                                var isRTL = document.documentElement.getAttribute('dir') == 'rtl';

                                this.removeFake();

                                this.fakeHandlerCallback = function () {
                                    return _this.removeFake();
                                };
                                this.fakeHandler = document.body.addEventListener('click', this.fakeHandlerCallback) || true;

                                this.fakeElem = document.createElement('textarea');
                                // Prevent zooming on iOS
                                this.fakeElem.style.fontSize = '12pt';
                                // Reset box model
                                this.fakeElem.style.border = '0';
                                this.fakeElem.style.padding = '0';
                                this.fakeElem.style.margin = '0';
                                // Move element out of screen horizontally
                                this.fakeElem.style.position = 'absolute';
                                this.fakeElem.style[isRTL ? 'right' : 'left'] = '-9999px';
                                // Move element to the same position vertically
                                var yPosition = window.pageYOffset || document.documentElement.scrollTop;
                                this.fakeElem.style.top = yPosition + 'px';

                                this.fakeElem.setAttribute('readonly', '');
                                this.fakeElem.value = this.text;

                                document.body.appendChild(this.fakeElem);

                                this.selectedText = (0, _select2["default"])(this.fakeElem);
                                this.copyText();
                            }
                        }, {
                            key: 'removeFake',
                            value: function removeFake() {
                                if (this.fakeHandler) {
                                    document.body.removeEventListener('click', this.fakeHandlerCallback);
                                    this.fakeHandler = null;
                                    this.fakeHandlerCallback = null;
                                }

                                if (this.fakeElem) {
                                    document.body.removeChild(this.fakeElem);
                                    this.fakeElem = null;
                                }
                            }
                        }, {
                            key: 'selectTarget',
                            value: function selectTarget() {
                                this.selectedText = (0, _select2["default"])(this.target);
                                this.copyText();
                            }
                        }, {
                            key: 'copyText',
                            value: function copyText() {
                                var succeeded = void 0;

                                try {
                                    succeeded = document.execCommand(this.action);
                                } catch (err) {
                                    succeeded = false;
                                }

                                this.handleResult(succeeded);
                            }
                        }, {
                            key: 'handleResult',
                            value: function handleResult(succeeded) {
                                this.emitter.emit(succeeded ? 'success' : 'error', {
                                    action: this.action,
                                    text: this.selectedText,
                                    trigger: this.trigger,
                                    clearSelection: this.clearSelection.bind(this)
                                });
                            }
                        }, {
                            key: 'clearSelection',
                            value: function clearSelection() {
                                if (this.target) {
                                    this.target.blur();
                                }

                                window.getSelection().removeAllRanges();
                            }
                        }, {
                            key: 'destroy',
                            value: function destroy() {
                                this.removeFake();
                            }
                        }, {
                            key: 'action',
                            set: function set() {
                                var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'copy';

                                this._action = action;

                                if (this._action !== 'copy' && this._action !== 'cut') {
                                    throw new Error('Invalid "action" value, use either "copy" or "cut"');
                                }
                            },
                            get: function get() {
                                return this._action;
                            }
                        }, {
                            key: 'target',
                            set: function set(target) {
                                if (target !== undefined) {
                                    if (target && (typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object' && target.nodeType === 1) {
                                        if (this.action === 'copy' && target.hasAttribute('disabled')) {
                                            throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                                        }

                                        if (this.action === 'cut' && (target.hasAttribute('readonly') || target.hasAttribute('disabled'))) {
                                            throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');
                                        }

                                        this._target = target;
                                    } else {
                                        throw new Error('Invalid "target" value, use a valid Element');
                                    }
                                }
                            },
                            get: function get() {
                                return this._target;
                            }
                        }]);

                        return ClipboardAction;
                    }();

                    module.exports = ClipboardAction;
                });

            }, {"select": 5}], 8: [function (require, module, exports) {
                (function (global, factory) {
                    if (typeof define === "function" && define.amd) {
                        define(['module', './clipboard-action', 'tiny-emitter', 'good-listener'], factory);
                    } else if (typeof exports !== "undefined") {
                        factory(module, require('./clipboard-action'), require('tiny-emitter'), require('good-listener'));
                    } else {
                        var mod = {
                            exports: {}
                        };
                        factory(mod, global.clipboardAction, global.tinyEmitter, global.goodListener);
                        global.clipboard = mod.exports;
                    }
                })(this, function (module, _clipboardAction, _tinyEmitter, _goodListener) {
                    'use strict';

                    var _clipboardAction2 = _interopRequireDefault(_clipboardAction);

                    var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

                    var _goodListener2 = _interopRequireDefault(_goodListener);

                    function _interopRequireDefault(obj) {
                        return obj && obj.__esModule ? obj : {
                            "default": obj
                        };
                    }

                    function _classCallCheck(instance, Constructor) {
                        if (!(instance instanceof Constructor)) {
                            throw new TypeError("Cannot call a class as a function");
                        }
                    }

                    var _createClass = function () {
                        function defineProperties(target, props) {
                            for (var i = 0; i < props.length; i++) {
                                var descriptor = props[i];
                                descriptor.enumerable = descriptor.enumerable || false;
                                descriptor.configurable = true;
                                if ("value" in descriptor) descriptor.writable = true;
                                Object.defineProperty(target, descriptor.key, descriptor);
                            }
                        }

                        return function (Constructor, protoProps, staticProps) {
                            if (protoProps) defineProperties(Constructor.prototype, protoProps);
                            if (staticProps) defineProperties(Constructor, staticProps);
                            return Constructor;
                        };
                    }();

                    function _possibleConstructorReturn(self, call) {
                        if (!self) {
                            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        }

                        return call && (typeof call === "object" || typeof call === "function") ? call : self;
                    }

                    function _inherits(subClass, superClass) {
                        if (typeof superClass !== "function" && superClass !== null) {
                            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
                        }

                        subClass.prototype = Object.create(superClass && superClass.prototype, {
                            constructor: {
                                value: subClass,
                                enumerable: false,
                                writable: true,
                                configurable: true
                            }
                        });
                        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
                    }

                    var Clipboard = function (_Emitter) {
                        _inherits(Clipboard, _Emitter);

                        /**
                         * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
                         * @param {Object} options
                         */
                        function Clipboard(trigger, options) {
                            _classCallCheck(this, Clipboard);

                            var _this = _possibleConstructorReturn(this, (Clipboard.__proto__ || Object.getPrototypeOf(Clipboard)).call(this));

                            _this.resolveOptions(options);
                            _this.listenClick(trigger);
                            return _this;
                        }

                        /**
                         * Defines if attributes would be resolved using internal setter functions
                         * or custom functions that were passed in the constructor.
                         * @param {Object} options
                         */


                        _createClass(Clipboard, [{
                            key: 'resolveOptions',
                            value: function resolveOptions() {
                                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                                this.action = typeof options.action === 'function' ? options.action : this.defaultAction;
                                this.target = typeof options.target === 'function' ? options.target : this.defaultTarget;
                                this.text = typeof options.text === 'function' ? options.text : this.defaultText;
                            }
                        }, {
                            key: 'listenClick',
                            value: function listenClick(trigger) {
                                var _this2 = this;

                                this.listener = (0, _goodListener2["default"])(trigger, 'click', function (e) {
                                    return _this2.onClick(e);
                                });
                            }
                        }, {
                            key: 'onClick',
                            value: function onClick(e) {
                                var trigger = e.delegateTarget || e.currentTarget;

                                if (this.clipboardAction) {
                                    this.clipboardAction = null;
                                }

                                this.clipboardAction = new _clipboardAction2["default"]({
                                    action: this.action(trigger),
                                    target: this.target(trigger),
                                    text: this.text(trigger),
                                    trigger: trigger,
                                    emitter: this
                                });
                            }
                        }, {
                            key: 'defaultAction',
                            value: function defaultAction(trigger) {
                                return getAttributeValue('action', trigger);
                            }
                        }, {
                            key: 'defaultTarget',
                            value: function defaultTarget(trigger) {
                                var selector = getAttributeValue('target', trigger);

                                if (selector) {
                                    return document.querySelector(selector);
                                }
                            }
                        }, {
                            key: 'defaultText',
                            value: function defaultText(trigger) {
                                return getAttributeValue('text', trigger);
                            }
                        }, {
                            key: 'destroy',
                            value: function destroy() {
                                this.listener.destroy();

                                if (this.clipboardAction) {
                                    this.clipboardAction.destroy();
                                    this.clipboardAction = null;
                                }
                            }
                        }], [{
                            key: 'isSupported',
                            value: function isSupported() {
                                var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['copy', 'cut'];

                                var actions = typeof action === 'string' ? [action] : action;
                                var support = !!document.queryCommandSupported;

                                actions.forEach(function (action) {
                                    support = support && !!document.queryCommandSupported(action);
                                });

                                return support;
                            }
                        }]);

                        return Clipboard;
                    }(_tinyEmitter2["default"]);

                    /**
                     * Helper function to retrieve attribute value.
                     * @param {String} suffix
                     * @param {Element} element
                     */
                    function getAttributeValue(suffix, element) {
                        var attribute = 'data-clipboard-' + suffix;

                        if (!element.hasAttribute(attribute)) {
                            return;
                        }

                        return element.getAttribute(attribute);
                    }

                    module.exports = Clipboard;
                });

            }, {"./clipboard-action": 7, "good-listener": 4, "tiny-emitter": 6}]
        }, {}, [8])(8)
    });
} catch (e) {
    /*
     * zClip :: jQuery ZeroClipboard v1.1.1
     * http://steamdev.com/zclip
     *
     * Copyright 2011, SteamDev
     * Released under the MIT license.
     * http://www.opensource.org/licenses/mit-license.php
     *
     * Date: Wed Jun 01, 2011
     */


    (function ($) {

        $.fn.zclip = function (params) {

            if (typeof params == "object" && !params.length) {

                var settings = $.extend({

                    path: 'ZeroClipboard.swf',
                    copy: null,
                    beforeCopy: null,
                    afterCopy: null,
                    clickAfter: true,
                    setHandCursor: true,
                    setCSSEffects: true

                }, params);


                return this.each(function () {

                    var o = $(this);

                    if (o.is(':visible') && (typeof settings.copy == 'string' || $.isFunction(settings.copy))) {

                        ZeroClipboard.setMoviePath(settings.path);
                        var clip = new ZeroClipboard.Client();

                        if ($.isFunction(settings.copy)) {
                            o.bind('zClip_copy', settings.copy);
                        }
                        if ($.isFunction(settings.beforeCopy)) {
                            o.bind('zClip_beforeCopy', settings.beforeCopy);
                        }
                        if ($.isFunction(settings.afterCopy)) {
                            o.bind('zClip_afterCopy', settings.afterCopy);
                        }

                        clip.setHandCursor(settings.setHandCursor);
                        clip.setCSSEffects(settings.setCSSEffects);
                        clip.addEventListener('mouseOver', function (client) {
                            o.trigger('mouseenter');
                        });
                        clip.addEventListener('mouseOut', function (client) {
                            o.trigger('mouseleave');
                        });
                        clip.addEventListener('mouseDown', function (client) {

                            o.trigger('mousedown');

                            if (!$.isFunction(settings.copy)) {
                                clip.setText(settings.copy);
                            } else {
                                clip.setText(o.triggerHandler('zClip_copy'));
                            }

                            if ($.isFunction(settings.beforeCopy)) {
                                o.trigger('zClip_beforeCopy');
                            }

                        });

                        clip.addEventListener('complete', function (client, text) {

                            if ($.isFunction(settings.afterCopy)) {

                                o.trigger('zClip_afterCopy');

                            } else {
                                if (text.length > 500) {
                                    text = text.substr(0, 500) + "...\n\n(" + (text.length - 500) + " characters not shown)";
                                }

                                o.removeClass('hover');
                                alert("Copied text to clipboard:\n\n " + text);
                            }

                            if (settings.clickAfter) {
                                o.trigger('click');
                            }

                        });


                        clip.glue(o[0], o.parent()[0]);

                        $(window).bind('load resize', function () {
                            clip.reposition();
                        });


                    }

                });

            } else if (typeof params == "string") {

                return this.each(function () {

                    var o = $(this);

                    params = params.toLowerCase();
                    var zclipId = o.data('zclipId');
                    var clipElm = $('#' + zclipId + '.zclip');

                    if (params == "remove") {

                        clipElm.remove();
                        o.removeClass('active hover');

                    } else if (params == "hide") {

                        clipElm.hide();
                        o.removeClass('active hover');

                    } else if (params == "show") {

                        clipElm.show();

                    }

                });

            }

        }


    })(jQuery);


// ZeroClipboard
// Simple Set Clipboard System
// Author: Joseph Huckaby
    var ZeroClipboard = {

        version: "1.0.7",
        clients: {},
        // registered upload clients on page, indexed by id
        moviePath: 'ZeroClipboard.swf',
        // URL to movie
        nextId: 1,
        // ID of next movie
        $: function (thingy) {
            // simple DOM lookup utility function
            if (typeof(thingy) == 'string') thingy = document.getElementById(thingy);
            if (!thingy.addClass) {
                // extend element with a few useful methods
                thingy.hide = function () {
                    this.style.display = 'none';
                };
                thingy.show = function () {
                    this.style.display = '';
                };
                thingy.addClass = function (name) {
                    this.removeClass(name);
                    this.className += ' ' + name;
                };
                thingy.removeClass = function (name) {
                    var classes = this.className.split(/\s+/);
                    var idx = -1;
                    for (var k = 0; k < classes.length; k++) {
                        if (classes[k] == name) {
                            idx = k;
                            k = classes.length;
                        }
                    }
                    if (idx > -1) {
                        classes.splice(idx, 1);
                        this.className = classes.join(' ');
                    }
                    return this;
                };
                thingy.hasClass = function (name) {
                    return !!this.className.match(new RegExp("\\s*" + name + "\\s*"));
                };
            }
            return thingy;
        },

        setMoviePath: function (path) {
            // set path to ZeroClipboard.swf
            this.moviePath = path;
        },

        dispatch: function (id, eventName, args) {
            // receive event from flash movie, send to client
            var client = this.clients[id];
            if (client) {
                client.receiveEvent(eventName, args);
            }
        },

        register: function (id, client) {
            // register new client to receive events
            this.clients[id] = client;
        },

        getDOMObjectPosition: function (obj, stopObj) {
            // get absolute coordinates for dom element
            var info = {
                left: 0,
                top: 0,
                width: obj.width ? obj.width : obj.offsetWidth,
                height: obj.height ? obj.height : obj.offsetHeight
            };

            if (obj && (obj != stopObj)) {
                info.left += obj.offsetLeft;
                info.top += obj.offsetTop;
            }

            return info;
        },

        Client: function (elem) {
            // constructor for new simple upload client
            this.handlers = {};

            // unique ID
            this.id = ZeroClipboard.nextId++;
            this.movieId = 'ZeroClipboardMovie_' + this.id;

            // register client with singleton to receive flash events
            ZeroClipboard.register(this.id, this);

            // create movie
            if (elem) this.glue(elem);
        }
    };

    ZeroClipboard.Client.prototype = {

        id: 0,
        // unique ID for us
        ready: false,
        // whether movie is ready to receive events or not
        movie: null,
        // reference to movie object
        clipText: '',
        // text to copy to clipboard
        handCursorEnabled: true,
        // whether to show hand cursor, or default pointer cursor
        cssEffects: true,
        // enable CSS mouse effects on dom container
        handlers: null,
        // user event handlers
        glue: function (elem, appendElem, stylesToAdd) {
            // glue to DOM element
            // elem can be ID or actual DOM element object
            this.domElement = ZeroClipboard.$(elem);

            // float just above object, or zIndex 99 if dom element isn't set
            var zIndex = 99;
            if (this.domElement.style.zIndex) {
                zIndex = parseInt(this.domElement.style.zIndex, 10) + 1;
            }

            if (typeof(appendElem) == 'string') {
                appendElem = ZeroClipboard.$(appendElem);
            } else if (typeof(appendElem) == 'undefined') {
                appendElem = document.getElementsByTagName('body')[0];
            }

            // find X/Y position of domElement
            var box = ZeroClipboard.getDOMObjectPosition(this.domElement, appendElem);

            // create floating DIV above element
            this.div = document.createElement('div');
            this.div.className = "zclip";
            this.div.id = "zclip-" + this.movieId;
            $(this.domElement).data('zclipId', 'zclip-' + this.movieId);
            var style = this.div.style;
            style.position = 'absolute';
            style.left = '' + box.left + 'px';
            style.top = '' + box.top + 'px';
            style.width = '' + box.width + 'px';
            style.height = '' + box.height + 'px';
            style.zIndex = zIndex;

            if (typeof(stylesToAdd) == 'object') {
                for (addedStyle in stylesToAdd) {
                    style[addedStyle] = stylesToAdd[addedStyle];
                }
            }

            // style.backgroundColor = '#f00'; // debug
            appendElem.appendChild(this.div);

            this.div.innerHTML = this.getHTML(box.width, box.height);
        },

        getHTML: function (width, height) {
            // return HTML for movie
            var html = '';
            var flashvars = 'id=' + this.id + '&width=' + width + '&height=' + height;

            if (navigator.userAgent.match(/MSIE/)) {
                // IE gets an OBJECT tag
                var protocol = location.href.match(/^https/i) ? 'https://' : 'http://';
                html += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="' + protocol + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="' + width + '" height="' + height + '" id="' + this.movieId + '" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="' + ZeroClipboard.moviePath + '" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="' + flashvars + '"/><param name="wmode" value="transparent"/></object>';
            } else {
                // all other browsers get an EMBED tag
                html += '<embed id="' + this.movieId + '" src="' + ZeroClipboard.moviePath + '" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + width + '" height="' + height + '" name="' + this.movieId + '" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + flashvars + '" wmode="transparent" />';
            }
            return html;
        },

        hide: function () {
            // temporarily hide floater offscreen
            if (this.div) {
                this.div.style.left = '-2000px';
            }
        },

        show: function () {
            // show ourselves after a call to hide()
            this.reposition();
        },

        destroy: function () {
            // destroy control and floater
            if (this.domElement && this.div) {
                this.hide();
                this.div.innerHTML = '';

                var body = document.getElementsByTagName('body')[0];
                try {
                    body.removeChild(this.div);
                } catch (e) {
                    ;
                }

                this.domElement = null;
                this.div = null;
            }
        },

        reposition: function (elem) {
            // reposition our floating div, optionally to new container
            // warning: container CANNOT change size, only position
            if (elem) {
                this.domElement = ZeroClipboard.$(elem);
                if (!this.domElement) this.hide();
            }

            if (this.domElement && this.div) {
                var box = ZeroClipboard.getDOMObjectPosition(this.domElement);
                var style = this.div.style;
                style.left = '' + box.left + 'px';
                style.top = '' + box.top + 'px';
            }
        },

        setText: function (newText) {
            // set text to be copied to clipboard
            this.clipText = newText;
            if (this.ready) {
                this.movie.setText(newText);
            }
        },

        addEventListener: function (eventName, func) {
            // add user event listener for event
            // event types: load, queueStart, fileStart, fileComplete, queueComplete, progress, error, cancel
            eventName = eventName.toString().toLowerCase().replace(/^on/, '');
            if (!this.handlers[eventName]) {
                this.handlers[eventName] = [];
            }
            this.handlers[eventName].push(func);
        },

        setHandCursor: function (enabled) {
            // enable hand cursor (true), or default arrow cursor (false)
            this.handCursorEnabled = enabled;
            if (this.ready) {
                this.movie.setHandCursor(enabled);
            }
        },

        setCSSEffects: function (enabled) {
            // enable or disable CSS effects on DOM container
            this.cssEffects = !!enabled;
        },

        receiveEvent: function (eventName, args) {
            // receive event from flash
            eventName = eventName.toString().toLowerCase().replace(/^on/, '');

            // special behavior for certain events
            switch (eventName) {
                case 'load':
                    // movie claims it is ready, but in IE this isn't always the case...
                    // bug fix: Cannot extend EMBED DOM elements in Firefox, must use traditional function
                    this.movie = document.getElementById(this.movieId);
                    if (!this.movie) {
                        var self = this;
                        setTimeout(function () {
                            self.receiveEvent('load', null);
                        }, 1);
                        return;
                    }

                    // firefox on pc needs a "kick" in order to set these in certain cases
                    if (!this.ready && navigator.userAgent.match(/Firefox/) && navigator.userAgent.match(/Windows/)) {
                        var self = this;
                        setTimeout(function () {
                            self.receiveEvent('load', null);
                        }, 100);
                        this.ready = true;
                        return;
                    }

                    this.ready = true;
                    try {
                        this.movie.setText(this.clipText);
                    } catch (e) {
                    }
                    try {
                        this.movie.setHandCursor(this.handCursorEnabled);
                    } catch (e) {
                    }
                    break;

                case 'mouseover':
                    if (this.domElement && this.cssEffects) {
                        this.domElement.addClass('hover');
                        if (this.recoverActive) {
                            this.domElement.addClass('active');
                        }


                    }


                    break;

                case 'mouseout':
                    if (this.domElement && this.cssEffects) {
                        this.recoverActive = false;
                        if (this.domElement.hasClass('active')) {
                            this.domElement.removeClass('active');
                            this.recoverActive = true;
                        }
                        this.domElement.removeClass('hover');

                    }
                    break;

                case 'mousedown':
                    if (this.domElement && this.cssEffects) {
                        this.domElement.addClass('active');
                    }
                    break;

                case 'mouseup':
                    if (this.domElement && this.cssEffects) {
                        this.domElement.removeClass('active');
                        this.recoverActive = false;
                    }
                    break;
            } // switch eventName
            if (this.handlers[eventName]) {
                for (var idx = 0, len = this.handlers[eventName].length; idx < len; idx++) {
                    var func = this.handlers[eventName][idx];

                    if (typeof(func) == 'function') {
                        // actual function reference
                        func(this, args);
                    } else if ((typeof(func) == 'object') && (func.length == 2)) {
                        // PHP style object + method, i.e. [myObject, 'myMethod']
                        func[0][func[1]](this, args);
                    } else if (typeof(func) == 'string') {
                        // name of function
                        window[func](this, args);
                    }
                } // foreach event handler defined
            } // user defined handler for event
        }

    };
}/**
 * 复制
 * Created by GUY on 2016/2/16.
 * @class BI.ClipBoard
 * @extends BI.BasicButton
 */
BI.ClipBoard = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.ClipBoard.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-clipboard",
            copy: BI.emptyFn,
            afterCopy: BI.emptyFn
        })
    },

    _init: function () {
        BI.ClipBoard.superclass._init.apply(this, arguments);
    },

    mounted: function () {
        var self = this, o = this.options;
        if (window.Clipboard) {
            this.clipboard = new Clipboard(this.element[0], {
                text: function () {
                    return BI.isFunction(o.copy) ? o.copy() : o.copy;
                }
            });
            this.clipboard.on("success", o.afterCopy)
        } else {
            this.element.zclip({
                path: BI.resourceURL + "/ZeroClipboard.swf",
                copy: o.copy,
                beforeCopy: o.beforeCopy,
                afterCopy: o.afterCopy
            });
        }
    },

    destroyed: function () {
        this.clipboard && this.clipboard.destroy();
    }
});

BI.shortcut("bi.clipboard", BI.ClipBoard);/**
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
        })
    },

    _init: function () {
        BI.CustomColorChooser.superclass._init.apply(this, arguments);
        var self = this;
        this.editor = BI.createWidget({
            type: "bi.color_picker_editor",
            width: 195
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
                    left: 15,
                    top: 10,
                    right: 15
                }],
                height: 30
            }, {
                type: "bi.absolute",
                items: [{
                    el: this.farbtastic,
                    left: 15,
                    right: 15,
                    top: 10
                }],
                height: 215
            }]
        })
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
            el: {}
        })
    },

    _init: function () {
        BI.ColorChooser.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget(BI.extend({
            type: "bi.color_chooser_trigger",
            width: o.width,
            height: o.height
        }, o.el));
        this.colorPicker = BI.createWidget({
            type: "bi.color_chooser_popup"
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 1,
            el: this.trigger,
            popup: {
                el: this.colorPicker,
                stopPropagation: false,
                minWidth: 202
            }
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

        this.colorPicker.on(BI.ColorChooserPopup.EVENT_VALUE_CHANGE, function () {
            fn();
        });

        this.colorPicker.on(BI.ColorChooserPopup.EVENT_CHANGE, function () {
            fn();
            self.combo.hideView();
        });
        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.colorPicker.setStoreColors(BI.string2Array(BI.Cache.getItem("colors") || ""));
        });

        this.combo.on(BI.Combo.EVENT_AFTER_HIDEVIEW, function () {
            self.fireEvent(BI.ColorChooser.EVENT_CHANGE, arguments);
        })
    },

    isViewVisible: function () {
        return this.combo.isViewVisible();
    },

    setValue: function (color) {
        this.combo.setValue(color);
    },

    getValue: function () {
        return this.colorPicker.getValue();
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

    _defaultConfig: function () {
        return BI.extend(BI.ColorChooserPopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-color-chooser-popup",
            height: 145
        })
    },

    _init: function () {
        BI.ColorChooserPopup.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.colorEditor = BI.createWidget({
            type: "bi.color_picker_editor"
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
            width: 190,
            height: 25
        });
        this.storeColors.on(BI.ColorPicker.EVENT_CHANGE, function () {
            self.setValue(this.getValue()[0]);
            self.fireEvent(BI.ColorChooserPopup.EVENT_CHANGE, arguments);
        });

        this.colorPicker = BI.createWidget({
            type: "bi.color_picker",
            width: 190,
            height: 50
        });

        this.colorPicker.on(BI.ColorPicker.EVENT_CHANGE, function () {
            self.setValue(this.getValue()[0]);
            self.fireEvent(BI.ColorChooserPopup.EVENT_CHANGE, arguments);
        });

        this.customColorChooser = BI.createWidget({
            type: "bi.custom_color_chooser"
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
            direction: "right,top",
            isNeedAdjustHeight: false,
            el: {
                type: "bi.text_item",
                cls: "color-chooser-popup-more bi-list-item",
                textAlign: "center",
                height: 20,
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

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: {
                    type: "bi.absolute",
                    cls: "bi-background bi-border-bottom",
                    items: [{
                        el: this.colorEditor,
                        left: 0,
                        right: 0,
                        top: 5
                    }]
                },
                height: 30
            }, {
                el: {
                    type: "bi.absolute",
                    items: [{
                        el: this.storeColors,
                        left: 5,
                        right: 5,
                        top: 5
                    }]
                },
                height: 30
            }, {
                el: {
                    type: "bi.absolute",
                    items: [{
                        el: this.colorPicker,
                        left: 5,
                        right: 5,
                        top: 5
                    }]
                },
                height: 65
            }, {
                el: this.more,
                height: 20
            }]
        })
    },

    setStoreColors: function (colors) {
        if (BI.isArray(colors)) {
            var items = BI.map(colors, function (i, color) {
                return {
                    value: color
                }
            });
            BI.count(colors.length, 8, function (i) {
                items.push({
                    value: "",
                    disabled: true
                })
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
 * @class BI.ColorChooserTrigger
 * @extends BI.Trigger
 */
BI.ColorChooserTrigger = BI.inherit(BI.Trigger, {

    _defaultConfig: function () {
        var conf = BI.ColorChooserTrigger.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-color-chooser-trigger",
            height: 30
        })
    },

    _init: function () {
        BI.ColorChooserTrigger.superclass._init.apply(this, arguments);
        this.colorContainer = BI.createWidget({
            type: "bi.layout",
            cls: "bi-card color-chooser-trigger-content"
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
        BI.ColorChooserTrigger.superclass.setValue.apply(this, arguments);
        if (color === "") {
            this.colorContainer.element.css("background-color", "").removeClass("trans-color-background").addClass("auto-color-background");
        } else if (color === "transparent") {
            this.colorContainer.element.css("background-color", "").removeClass("auto-color-background").addClass("trans-color-background")
        } else {
            this.colorContainer.element.css({"background-color": color}).removeClass("auto-color-background").removeClass("trans-color-background");
        }
    }
});
BI.ColorChooserTrigger.EVENT_CHANGE = "ColorChooserTrigger.EVENT_CHANGE";
BI.shortcut("bi.color_chooser_trigger", BI.ColorChooserTrigger);/**
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
        })
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
        if (!!b) {
            this._createMask();
        }
        BI.Maskers[!!b ? "show" : "hide"](this.getName());
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
        })
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
            }]
        });
        this.colors.on(BI.ButtonGroup.EVENT_CHANGE, function () {
            self.fireEvent(BI.ColorPicker.EVENT_CHANGE, arguments);
        })
    },

    populate: function(items){
        var args  =[].slice.call(arguments);
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
            width: 200,
            height: 20
        })
    },

    _init: function () {
        BI.ColorPickerEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.colorShow = BI.createWidget({
            type: "bi.layout",
            cls: "color-picker-editor-display bi-card",
            height: 20
        });
        var RGB = BI.createWidgets(BI.createItems([{text: "R"}, {text: "G"}, {text: "B"}], {
            type: "bi.label",
            cls: "color-picker-editor-label",
            width: 10,
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
                    self.fireEvent(BI.ColorPickerEditor.EVENT_CHANGE);
                }
            });
        });
        this.R = Ws[0];
        this.G = Ws[1];
        this.B = Ws[2];

        this.none = BI.createWidget({
            type: "bi.checkbox",
            title: BI.i18nText("BI-Basic_Auto")
        });
        this.none.on(BI.Checkbox.EVENT_CHANGE, function () {
            if (this.isSelected()) {
                self.lastColor = self.getValue();
                self.setValue("");
            } else {
                self.setValue(self.lastColor || "#000000");
            }
            if (self.R.isValid() && self.G.isValid() && self.B.isValid()) {
                self.colorShow.element.css("background-color", self.getValue());
                self.fireEvent(BI.ColorPickerEditor.EVENT_CHANGE);
            }
        });

        this.transparent = BI.createWidget({
            type: "bi.checkbox",
            title: BI.i18nText("BI-Transparent_Color")
        });
        this.transparent.on(BI.Checkbox.EVENT_CHANGE, function () {
            if (this.isSelected()) {
                self.lastColor = self.getValue();
                self.setValue("transparent");
            } else {
                self.setValue(self.lastColor || "#000000");
            }
            if (self.R.isValid() && self.G.isValid() && self.B.isValid()) {
                self.colorShow.element.css("background-color", self.getValue());
                self.fireEvent(BI.ColorPickerEditor.EVENT_CHANGE);
            }
        });

        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: this.colorShow,
                width: 'fill'
            }, {
                el: RGB[0],
                lgap: 10,
                width: 16
            }, {
                el: this.R,
                width: 32
            }, {
                el: RGB[1],
                lgap: 10,
                width: 16
            }, {
                el: this.G,
                width: 32
            }, {
                el: RGB[2],
                lgap: 10,
                width: 16
            }, {
                el: this.B,
                width: 32
            }, {
                el: {
                    type: "bi.center_adapt",
                    items: [this.none]
                },
                width: 18
            }, {
                el: {
                    type: "bi.center_adapt",
                    items: [this.transparent]
                },
                width: 18
            }]
        })
    },

    setValue: function (color) {
        if (color === "transparent") {
            this.transparent.setSelected(true);
            this.none.setSelected(false);
            this.R.setValue("");
            this.G.setValue("");
            this.B.setValue("");
            return;
        }
        if (!color) {
            color = "";
            this.none.setSelected(true);
        } else {
            this.none.setSelected(false);
        }
        this.transparent.setSelected(false);
        this.colorShow.element.css("background-color", color);
        var json = BI.DOM.rgb2json(BI.DOM.hex2rgb(color));
        this.R.setValue(BI.isNull(json.r) ? "" : json.r);
        this.G.setValue(BI.isNull(json.g) ? "" : json.g);
        this.B.setValue(BI.isNull(json.b) ? "" : json.b);
    },

    getValue: function () {
        if (this.transparent.isSelected()) {
            return "transparent";
        }
        return BI.DOM.rgb2hex(BI.DOM.json2rgb({
            r: this.R.getValue(),
            g: this.G.getValue(),
            b: this.B.getValue()
        }))
    }
});
BI.ColorPickerEditor.EVENT_CHANGE = "ColorPickerEditor.EVENT_CHANGE";
BI.shortcut("bi.color_picker_editor", BI.ColorPickerEditor);/**
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
        })
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
}

jQuery._farbtastic = function (container, callback) {
  // Store farbtastic object
  var fb = this;

  // Insert markup
  $(container).html('<div class="farbtastic"><div class="color"></div><div class="wheel"></div><div class="overlay"></div><div class="h-marker marker"></div><div class="sl-marker marker"></div></div>');
  var e = $('.farbtastic', container);
  fb.wheel = $('.wheel', container).get(0);
  // Dimensions
  fb.radius = 84;
  fb.square = 100;
  fb.width = 194;

  // Fix background PNGs in IE6
  if (navigator.appVersion.match(/MSIE [0-6]\./)) {
    $('*', e).each(function () {
      if (this.currentStyle.backgroundImage != 'none') {
        var image = this.currentStyle.backgroundImage;
        image = this.currentStyle.backgroundImage.substring(5, image.length - 2);
        $(this).css({
          'backgroundImage': 'none',
          'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='" + image + "')"
        });
      }
    });
  }

  /**
   * Link to the given element(s) or callback.
   */
  fb.linkTo = function (callback) {
    // Unbind previous nodes
    if (typeof fb.callback == 'object') {
      $(fb.callback).unbind('keyup', fb.updateValue);
    }

    // Reset color
    fb.color = null;

    // Bind callback or elements
    if (typeof callback == 'function') {
      fb.callback = callback;
    }
    else if (typeof callback == 'object' || typeof callback == 'string') {
      fb.callback = $(callback);
      fb.callback.bind('keyup', fb.updateValue);
      if (fb.callback.get(0).value) {
        fb.setColor(fb.callback.get(0).value);
      }
    }
    return this;
  }
  fb.updateValue = function (event) {
    if (this.value && this.value != fb.color) {
      fb.setColor(this.value);
    }
  }

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
  }

  /**
   * Change color with HSL triplet [0..1, 0..1, 0..1]
   */
  fb.setHSL = function (hsl) {
    fb.hsl = hsl;
    fb.rgb = fb.HSLToRGB(hsl);
    fb.color = fb.pack(fb.rgb);
    fb.updateDisplay();
    return this;
  }

  /////////////////////////////////////////////////////

  /**
   * Retrieve the coordinates of the given event relative to the center
   * of the widget.
   */
  fb.widgetCoords = function (event) {
    var x, y;
    var el = event.target || event.srcElement;
    var reference = fb.wheel;

    if (typeof event.offsetX != 'undefined') {
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
      var offset = { x: 0, y: 0 }
      while (e) {
        if (typeof e.mouseX != 'undefined') {
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
    }
    else {
      // Use absolute coordinates
      var pos = fb.absolutePosition(reference);
      x = (event.pageX || 0*(event.clientX + $('html').get(0).scrollLeft)) - pos.x;
      y = (event.pageY || 0*(event.clientY + $('html').get(0).scrollTop)) - pos.y;
    }
    // Subtract distance to middle
    return { x: x - fb.width / 2, y: y - fb.width / 2 };
  }

  /**
   * Mousedown handler
   */
  fb.mousedown = function (event) {
    // Capture mouse
    if (!document.dragging) {
      $(document).bind('mousemove', fb.mousemove).bind('mouseup', fb.mouseup);
      document.dragging = true;
    }

    // Check which area is being dragged
    var pos = fb.widgetCoords(event);
    fb.circleDrag = Math.max(Math.abs(pos.x), Math.abs(pos.y)) * 2 > fb.square;

    // Process
    fb.mousemove(event);
    return false;
  }

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
    }
    else {
      var sat = Math.max(0, Math.min(1, -(pos.x / fb.square) + .5));
      var lum = Math.max(0, Math.min(1, -(pos.y / fb.square) + .5));
      fb.setHSL([fb.hsl[0], sat, lum]);
    }
    return false;
  }

  /**
   * Mouseup handler
   */
  fb.mouseup = function () {
    // Uncapture mouse
    $(document).unbind('mousemove', fb.mousemove);
    $(document).unbind('mouseup', fb.mouseup);
    document.dragging = false;
  }

  /**
   * Update the markers and styles
   */
  fb.updateDisplay = function () {
    // Markers
    var angle = fb.hsl[0] * 6.28;
    $('.h-marker', e).css({
      left: Math.round(Math.sin(angle) * fb.radius + fb.width / 2) + 'px',
      top: Math.round(-Math.cos(angle) * fb.radius + fb.width / 2) + 'px'
    });

    $('.sl-marker', e).css({
      left: Math.round(fb.square * (.5 - fb.hsl[1]) + fb.width / 2) + 'px',
      top: Math.round(fb.square * (.5 - fb.hsl[2]) + fb.width / 2) + 'px'
    });

    // Saturation/Luminance gradient
    $('.color', e).css('backgroundColor', fb.pack(fb.HSLToRGB([fb.hsl[0], 1, 0.5])));

    // Linked elements or callback
    if (typeof fb.callback == 'object') {
      // Set background/foreground color
      $(fb.callback).css({
        backgroundColor: fb.color,
        color: fb.hsl[2] > 0.5 ? '#000' : '#fff'
      });

      // Change linked value
      $(fb.callback).each(function() {
        if (this.value && this.value != fb.color) {
          this.value = fb.color;
        }
      });
    }
    else if (typeof fb.callback == 'function') {
      fb.callback.call(fb, fb.color);
    }
  }

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
    return '#' + (r < 16 ? '0' : '') + r.toString(16) +
           (g < 16 ? '0' : '') + g.toString(16) +
           (b < 16 ? '0' : '') + b.toString(16);
  }

  fb.unpack = function (color) {
    if (color.length == 7) {
      return [parseInt('0x' + color.substring(1, 3)) / 255,
        parseInt('0x' + color.substring(3, 5)) / 255,
        parseInt('0x' + color.substring(5, 7)) / 255];
    }
    else if (color.length == 4) {
      return [parseInt('0x' + color.substring(1, 2)) / 15,
        parseInt('0x' + color.substring(2, 3)) / 15,
        parseInt('0x' + color.substring(3, 4)) / 15];
    }
  }

  fb.HSLToRGB = function (hsl) {
    var m1, m2, r, g, b;
    var h = hsl[0], s = hsl[1], l = hsl[2];
    m2 = (l <= 0.5) ? l * (s + 1) : l + s - l*s;
    m1 = l * 2 - m2;
    return [this.hueToRGB(m1, m2, h+0.33333),
        this.hueToRGB(m1, m2, h),
        this.hueToRGB(m1, m2, h-0.33333)];
  }

  fb.hueToRGB = function (m1, m2, h) {
    h = (h < 0) ? h + 1 : ((h > 1) ? h - 1 : h);
    if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
    if (h * 2 < 1) return m2;
    if (h * 3 < 2) return m1 + (m2 - m1) * (0.66666 - h) * 6;
    return m1;
  }

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
  }

  // Install mousedown handler (the others are set on the document on-demand)
  $('*', e).mousedown(fb.mousedown);

    // Init color
  fb.setColor('#000000');

  // Set linked elements/callback
  if (callback) {
    fb.linkTo(callback);
  }
}/**
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
            direction: "bottom", //top||bottom||left||right||top,left||top,right||bottom,left||bottom,right
            isDefaultInit: false,
            destroyWhenHide: false,
            isNeedAdjustHeight: true,//是否需要高度调整
            isNeedAdjustWidth: true,
            stopPropagation: false,
            adjustLength: 0,//调整的距离
            // adjustXOffset: 0,
            // adjustYOffset: 10,
            hideChecker: BI.emptyFn,
            offsetStyle: "left", //left,right,center
            el: {},
            popup: {},
        })
    },
    _init: function () {
        BI.BubbleCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            trigger: o.trigger,
            toggle: o.toggle,
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
            }, o.popup),
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
        })
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
                this.combo.getView().showLine("right");
                break;
            case "right,top":
            case "right,bottom":
                this._createRightTriangle();
                this.combo.getView().showLine("left");
                break;
            case "top,left":
            case "top,right":
                this._createTopTriangle();
                this.combo.getView().showLine("bottom");
                break;
            case "bottom,left":
            case "bottom,right":
                this._createBottomTriangle();
                this.combo.getView().showLine("top");
                break;
        }
    },

    _hideTriangle: function () {
        this.triangle && this.triangle.destroy();
        this.triangle = null;
        this.combo.getView() && this.combo.getView().hideLine();
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
        })
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
        })
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
            buttons: [{value: BI.i18nText(BI.i18nText("BI-Basic_Sure"))}, {value: BI.i18nText("BI-Basic_Cancel"), level: "ignore"}]
        })
    },
    _init: function () {
        BI.BubblePopupBarView.superclass._init.apply(this, arguments);
    },
    _createToolBar: function () {
        var o = this.options, self = this;

        var items = [];
        BI.each(o.buttons.reverse(), function (i, buttonOpt) {
            if(BI.isWidget(buttonOpt)){
                items.push(buttonOpt);
            }else{
                items.push(BI.extend({
                    type: 'bi.button',
                    height: 30,
                    handler: function (v) {
                        self.fireEvent(BI.BubblePopupBarView.EVENT_CLICK_TOOLBAR_BUTTON, v);
                    }
                }, buttonOpt))
            }
        });
        return BI.createWidget({
            type: 'bi.right_vertical_adapt',
            height: 40,
            hgap: 10,
            bgap: 10,
            items: items
        });
    }
});
BI.BubblePopupBarView.EVENT_CLICK_TOOLBAR_BUTTON = "EVENT_CLICK_TOOLBAR_BUTTON";
BI.shortcut("bi.bubble_bar_popup_view", BI.BubblePopupBarView);/**
 * Created by Young's on 2016/4/28.
 */
BI.EditorIconCheckCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.EditorIconCheckCombo.superclass._defaultConfig.apply(this, arguments), {
            baseClass: "bi-check-editor-combo",
            width: 100,
            height: 30,
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn,
            allowBlank: true,
            watermark: "",
            errorText: ""
        })
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
            errorText: o.errorText
        });
        this.trigger.on(BI.EditorTrigger.EVENT_CHANGE, function () {
            self.popup.setValue(this.getValue());
            self.fireEvent(BI.EditorIconCheckCombo.EVENT_CHANGE);
        });
        this.popup = BI.createWidget({
            type: "bi.text_value_check_combo_popup",
            chooseType: o.chooseType,
            items: o.items
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
 * Created by GUY on 2016/4/25.
 *
 * @class BI.FormulaCombo
 * @extend BI.Widget
 */
BI.FormulaCombo = BI.inherit(BI.Widget, {

    _constant: {
        POPUP_HEIGHT: 450,
        POPUP_WIDTH: 600,
        POPUP_V_GAP: 10,
        POPUP_H_GAP: 10,
        ADJUST_LENGTH: 2,
        HEIGHT_MAX: 10000,
        MAX_HEIGHT: 500,
        MAX_WIDTH: 600,
        COMBO_TRIGGER_WIDTH: 300
    },

    _defaultConfig: function () {
        return BI.extend(BI.FormulaCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-formula-combo",
            height: 30,
            items: []
        })
    },

    _init: function () {
        BI.FormulaCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.formula_ids = [];
        this.input = BI.createWidget({
            type: "bi.formula_combo_trigger",
            height: o.height,
            items: o.items
        });
        this.formulaPopup = BI.createWidget({
            type: "bi.formula_combo_popup",
            fieldItems: o.items
        });

        this.formulaInputCombo = BI.createWidget({
            type: "bi.combo",
            element: this,
            isNeedAdjustHeight: true,
            isNeedAdjustWidth: false,
            adjustLength: this._constant.ADJUST_LENGTH,
            el: this.input,
            popup: {
                el: {
                    type: "bi.absolute",
                    height: this._constant.HEIGHT_MAX,
                    width: this._constant.POPUP_WIDTH,
                    items: [{
                        el: this.formulaPopup,
                        top: this._constant.POPUP_V_GAP,
                        left: this._constant.POPUP_H_GAP,
                        right: this._constant.POPUP_V_GAP,
                        bottom: 0
                    }]
                },
                stopPropagation: false,
                maxHeight: this._constant.MAX_HEIGHT,
                width: this._constant.MAX_WIDTH
            }
        });
        this.formulaInputCombo.on(BI.Combo.EVENT_AFTER_POPUPVIEW, function () {
            self.formulaPopup.setValue(self.input.getValue());
        });
        this.formulaPopup.on(BI.FormulaComboPopup.EVENT_CHANGE, function () {
            self.setValue(self.formulaPopup.getValue());
            self.formulaInputCombo.hideView();
            self.fireEvent(BI.FormulaCombo.EVENT_CHANGE);
        });
        this.formulaPopup.on(BI.FormulaComboPopup.EVENT_VALUE_CANCEL, function () {
            self.formulaInputCombo.hideView();
        });
    },

    setValue: function (v) {
        if (this.formulaInputCombo.isViewVisible()) {
            this.formulaInputCombo.hideView();
        }
        this.input.setValue(v);
        this.input.setText(BI.Func.getFormulaStringFromFormulaValue(v));
        this.formulaPopup.setValue(this.input.getValue());
    },

    getFormulaTargetIds: function() {
        return this.formulaPopup.getFormulaTargetIds();
    },

    getValue: function () {
        return this.input.getValue();
    }
});
BI.FormulaCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.formula_combo", BI.FormulaCombo);/**
 * Created by GUY on 2016/4/25.
 *
 * @class BI.FormulaComboPopup
 * @extend BI.Widget
 */
BI.FormulaComboPopup = BI.inherit(BI.Widget, {

    _constant: {
        BUTTON_HEIGHT: 30,
        SOUTH_HEIGHT: 60,
        SOUTH_H_GAP: 10
    },

    _defaultConfig: function () {
        return BI.extend(BI.FormulaComboPopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-formula-pane-popup"
        })
    },

    _init: function () {
        BI.FormulaComboPopup.superclass._init.apply(this, arguments);
        this.populate();
    },

    populate: function () {
        var self = this, fieldItems = this.options.fieldItems;
        this.formula = BI.createWidget({
            type: "bi.formula_insert"
        });
        this.formula.populate(fieldItems);
        var confirmButton = BI.createWidget({
            type: "bi.button",
            level: "common",
            height: this._constant.BUTTON_HEIGHT,
            text: BI.i18nText("BI-Basic_OK")
        });
        var cancelButton = BI.createWidget({
            type: "bi.button",
            level: "ignore",
            height: this._constant.BUTTON_HEIGHT,
            text: BI.i18nText("BI-Basic_Cancel")
        });

        this.formula.on(BI.FormulaInsert.EVENT_CHANGE, function () {
            confirmButton.setEnable(self.formula.checkValidation());
        });
        confirmButton.on(BI.Button.EVENT_CHANGE, function () {
            self.fireEvent(BI.FormulaComboPopup.EVENT_CHANGE);
        });
        cancelButton.on(BI.Button.EVENT_CHANGE, function () {
            self.setValue(self.oldValue);
            self.fireEvent(BI.FormulaComboPopup.EVENT_VALUE_CANCEL);
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: this.formula,
                height: "fill"
            }, {
                el: {
                    type: "bi.right_vertical_adapt",
                    height: this._constant.SOUTH_HEIGHT,
                    items: [cancelButton, confirmButton],
                    hgap: this._constant.SOUTH_H_GAP
                },
                height: this._constant.SOUTH_HEIGHT
            }]
        })
    },

    getFormulaTargetIds: function(){
        return this.formula.getUsedFields();
    },

    getValue: function () {
        return this.formula.getValue();
    },

    setValue: function (v) {
        this.oldValue = v;
        this.formula.setValue(v);
    }
});
BI.FormulaComboPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.FormulaComboPopup.EVENT_VALUE_CANCEL = "EVENT_VALUE_CANCEL";
BI.shortcut("bi.formula_combo_popup", BI.FormulaComboPopup);/**
 * Created by GUY on 2016/4/25.
 *
 * @class BI.FormulaComboTrigger
 * @extend BI.Widget
 */
BI.FormulaComboTrigger = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.FormulaComboTrigger.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-formula-combo-trigger",
            height: 30,
            items: []
        })
    },

    _init: function () {
        BI.FormulaComboTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.label = BI.createWidget({
            type: "bi.label",
            element: this,
            textAlign: "left",
            textHeight: this.options.height,
            lgap: 10
        });
    },

    _getTextFromFormulaValue: function (formulaValue) {
        var self = this;
        var formulaString = "";
        var regx = /\$[\{][^\}]*[\}]|\w*\w|\$\{[^\$\(\)\+\-\*\/)\$,]*\w\}|\$\{[^\$\(\)\+\-\*\/]*\w\}|\$\{[^\$\(\)\+\-\*\/]*[\u4e00-\u9fa5]\}|\w|(.)/g;
        var result = formulaValue.match(regx);
        BI.each(result, function (i, item) {
            var fieldRegx = /\$[\{][^\}]*[\}]/;
            var str = item.match(fieldRegx);
            if (BI.isNotEmptyArray(str)) {
                var id = str[0].substring(2, item.length - 1);
                var item = BI.find(BI.flatten(self.options.items), function (i, item) {
                    return id === item.value;
                });
                formulaString = formulaString + item.text;
            } else {
                formulaString = formulaString + item;
            }
        });
        return formulaString;
    },

    getValue: function () {
        return this.options.value;
    },

    setValue: function (v) {
        this.options.value = v;
        this.label.setText(this._getTextFromFormulaValue(v));
    }
});
BI.shortcut("bi.formula_combo_trigger", BI.FormulaComboTrigger);/**
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
            iconClass: "",
            el: {},
            popup: {},
            minWidth: 100,
            maxWidth: 'auto',
            maxHeight: 300,
            direction: "bottom",
            adjustLength: 3,//调整的距离
            adjustXOffset: 0,
            adjustYOffset: 0,
            offsetStyle: "left",
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE
        })
    },

    _init: function () {
        BI.IconCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget(o.el, {
            type: "bi.icon_combo_trigger",
            iconClass: o.iconClass,
            title: o.title,
            items: o.items,
            width: o.width,
            height: o.height,
            iconWidth: o.iconWidth,
            iconHeight: o.iconHeight
        });
        this.popup = BI.createWidget(o.popup, {
            type: "bi.icon_combo_popup",
            chooseType: o.chooseType,
            items: o.items
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
        this.iconCombo.setValue(v);
    },

    getValue: function () {
        return this.iconCombo.getValue();
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
                height: 30
            }),
            chooseType: o.chooseType,
            layouts: [{
                type: "bi.vertical"
            }]
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
            items: [this.popup]
        });
    },

    populate: function (items) {
        BI.IconComboPopup.superclass.populate.apply(this, arguments);
        items = BI.createItems(items, {
            type: "bi.single_select_icon_text_item",
            height: 30
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
            iconClass: "",
            width: 25,
            height: 25,
            isShowDown: true
        });
    },

    _init: function () {
        BI.IconComboTrigger.superclass._init.apply(this, arguments);
        var o = this.options, self = this;
        this.button = BI.createWidget(o.el, {
            type: "bi.icon_change_button",
            cls: "icon-combo-trigger-icon " + o.iconClass,
            disableSelected: true,
            width: o.width,
            height: o.height,
            iconWidth: o.iconWidth,
            iconHeight: o.iconHeight
        });
        this.down = BI.createWidget({
            type: "bi.icon_button",
            disableSelected: true,
            cls: "icon-combo-down-icon trigger-triangle-font",
            width: 12,
            height: 8
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
                right: 0,
                bottom: 0
            }]
        });
        if (BI.isKey(o.value)) {
            this.setValue(o.value);
        }
    },

    populate: function (items) {
        var o = this.options;
        this.options.items = items || [];
        this.button.setIcon(o.iconClass);
        this.button.setSelected(false);
        this.down.setSelected(false);
    },

    setValue: function (v) {
        BI.IconComboTrigger.superclass.setValue.apply(this, arguments);
        var o = this.options;
        var iconClass = "";
        v = BI.isArray(v) ? v[0] : v;
        if (BI.any(this.options.items, function (i, item) {
                if (v === item.value) {
                    iconClass = item.iconClass;
                    return true;
                }
            })) {
            this.button.setIcon(iconClass);
            this.button.setSelected(true);
            this.down.setSelected(true);
        } else {
            this.button.setIcon(o.iconClass);
            this.button.setSelected(false);
            this.down.setSelected(false);
        }
    }
});
BI.IconComboTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.icon_combo_trigger", BI.IconComboTrigger);/**
 * 单选combo
 *
 * @class BI.StaticCombo
 * @extend BI.Widget
 */
BI.StaticCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.StaticCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-static-combo",
            height: 30,
            text: "",
            el: {},
            items: [],
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE
        })
    },

    _init: function () {
        BI.StaticCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget(o.el, {
            type: "bi.text_icon_item",
            cls: "bi-select-text-trigger bi-border pull-down-font",
            text: o.text,
            readonly: true,
            textLgap: 5,
            height: o.height - 2
        });
        this.popup = BI.createWidget({
            type: "bi.text_value_combo_popup",
            textAlign: o.textAlign,
            chooseType: o.chooseType,
            items: o.items
        });
        this.popup.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.popup.on(BI.TextValueComboPopup.EVENT_CHANGE, function () {
            self.combo.hideView();
            self.fireEvent(BI.StaticCombo.EVENT_CHANGE, arguments);
        });
        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: {
                el: this.popup
            }
        });
    },

    populate: function (items) {
        this.combo.populate(items);
    },

    setValue: function (v) {
        this.combo.setValue(v);
    },

    getValue: function () {
        return this.combo.getValue();
    }
});
BI.StaticCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.static_combo", BI.StaticCombo);/**
 * @class BI.TextValueCheckCombo
 * @extend BI.Widget
 * combo : text + icon, popup : check + text
 */
BI.TextValueCheckCombo = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.TextValueCheckCombo.superclass._defaultConfig.apply(this, arguments), {
            baseClass: "bi-text-value-check-combo",
            width: 100,
            height: 30,
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
            text: ""
        })
    },

    _init: function () {
        BI.TextValueCheckCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.select_text_trigger",
            items: o.items,
            height: o.height,
            text: o.text
        });
        this.popup = BI.createWidget({
            type: "bi.text_value_check_combo_popup",
            chooseType: o.chooseType,
            items: o.items
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
            element: this,
            adjustLength: 2,
            el: this.trigger,
            popup: {
                el: this.popup,
                maxHeight: 300
            }
        });
    },

    setTitle: function (title) {
        this.trigger.setTitle(title);
    },

    setValue: function (v) {
        this.textIconCheckCombo.setValue(v);
    },

    setWarningTitle: function (title) {
        this.trigger.setWarningTitle(title);
    },

    getValue: function () {
        return this.textIconCheckCombo.getValue();
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
        })
    },

    _init: function () {
        BI.SmallTextValueCheckCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.small_select_text_trigger",
            items: o.items,
            height: o.height,
            text: o.text
        });
        this.popup = BI.createWidget({
            type: "bi.text_value_check_combo_popup",
            chooseType: o.chooseType,
            items: o.items
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
        return this.SmallTextIconCheckCombo.getValue();
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
            }]
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
            items: [this.popup]
        });
    },

    _formatItems: function (items) {
        return BI.map(items, function (i, item) {
            return BI.extend({
                type: "bi.icon_text_item",
                cls: "item-check-font bi-list-item",
                height: 30
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
            baseClass: "bi-text-value-combo",
            height: 30,
            chooseType: BI.ButtonGroup.CHOOSE_TYPE_SINGLE,
            text: "",
            el: {}
        })
    },

    _init: function () {
        BI.TextValueCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget(o.el, {
            type: "bi.select_text_trigger",
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
            self.textIconCombo.hideView();
            self.fireEvent(BI.TextValueCombo.EVENT_CHANGE, arguments);
        });
        this.popup.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.textIconCombo = BI.createWidget({
            type: "bi.combo",
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
        this.textIconCombo.setValue(v);
    },

    getValue: function () {
        return this.textIconCombo.getValue();
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
        })
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
            adjustLength: 2,
            el: this.trigger,
            popup: {
                el: this.popup,
                maxHeight: 300
            }
        });
    },

    setValue: function (v) {
        this.SmallTextValueCombo.setValue(v);
    },

    getValue: function () {
        return this.SmallTextValueCombo.getValue();
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
                height: 30
            }),
            chooseType: o.chooseType,
            layouts: [{
                type: "bi.vertical"
            }]
        });

        this.popup.on(BI.Controller.EVENT_CHANGE, function (type, val, obj) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.TextValueComboPopup.EVENT_CHANGE, val, obj);
            }
        });

        BI.createWidget({
            type: "bi.vertical",
            element: this,
            items: [this.popup]
        });
    },

    populate: function (items) {
        BI.TextValueComboPopup.superclass.populate.apply(this, arguments);
        items = BI.createItems(items, {
            type: "bi.single_select_item",
            height: 30
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
            height: 30,
            text: ""
        })
    },

    _init: function () {
        BI.TextValueDownListCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this._createValueMap();

        this.trigger = BI.createWidget({
            type: "bi.down_list_select_text_trigger",
            height: o.height,
            items: o.items
        });

        this.combo = BI.createWidget({
            type: "bi.down_list_combo",
            element: this,
            chooseType: BI.Selection.Single,
            adjustLength: 2,
            height: o.height,
            el: this.trigger,
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
                    self.valueMap[it.value] = {value: item.el.value, childValue: it.value}
                });
            } else {
                self.valueMap[item.value] = {value: item.value};
            }
        });
    },

    setValue: function (v) {
        v = this.valueMap[v];
        this.combo.setValue([v]);
        this.trigger.setValue(v.childValue || v.value);
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
            text: o.text
        });
    },

    _formatItemArray: function(){
        var sourceArray = BI.flatten(BI.deepClone(this.options.items));
        var targetArray = [];
        BI.each(sourceArray, function(idx, item){
            if(BI.has(item, "el")){
                BI.each(item.children, function(id, it){
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
        this.trigger.setValue(vals);
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
            height: 30,
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
            quitChecker: o.quitChecker
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
                    width: 25
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
            self.fireEvent(BI.ClearEditor.EVENT_SPACE)
        });
        this.editor.on(BI.Editor.EVENT_BACKSPACE, function () {
            self.fireEvent(BI.ClearEditor.EVENT_BACKSPACE)
        });


        this.editor.on(BI.Editor.EVENT_VALID, function () {
            self.fireEvent(BI.ClearEditor.EVENT_VALID)
        });
        this.editor.on(BI.Editor.EVENT_ERROR, function () {
            self.fireEvent(BI.ClearEditor.EVENT_ERROR)
        });
        this.editor.on(BI.Editor.EVENT_ENTER, function () {
            self.fireEvent(BI.ClearEditor.EVENT_ENTER);
        });
        this.editor.on(BI.Editor.EVENT_RESTRICT, function () {
            self.fireEvent(BI.ClearEditor.EVENT_RESTRICT)
        });
        this.editor.on(BI.Editor.EVENT_EMPTY, function () {
            self._checkClear();
            self.fireEvent(BI.ClearEditor.EVENT_EMPTY)
        });
        this.editor.on(BI.Editor.EVENT_REMOVE, function () {
            self.fireEvent(BI.ClearEditor.EVENT_REMOVE)
        });
        this.editor.on(BI.Editor.EVENT_CONFIRM, function () {
            self.fireEvent(BI.ClearEditor.EVENT_CONFIRM)
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

        this.clear.invisible();
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
 * Created by roy on 15/9/14.
 */
BI.SearchEditor = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.SearchEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-search-editor bi-border",
            height: 30,
            errorText: "",
            watermark: BI.i18nText("BI-Basic_Search"),
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn
        });
    },
    _init: function () {
        this.options.height -= 2;
        BI.SearchEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: "bi.editor",
            height: o.height,
            watermark: o.watermark,
            allowBlank: true,
            errorText: o.errorText,
            validationChecker: o.validationChecker,
            quitChecker: o.quitChecker
        });
        this.clear = BI.createWidget({
            type: "bi.icon_button",
            stopEvent: true,
            cls: "search-close-h-font"
        });
        this.clear.on(BI.IconButton.EVENT_CHANGE, function () {
            self.setValue("");
            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.STOPEDIT);
            self.fireEvent(BI.SearchEditor.EVENT_CLEAR);
        });
        BI.createWidget({
            element: this,
            type: "bi.htape",
            items: [
                {
                    el: {
                        type: "bi.center_adapt",
                        cls: "search-font",
                        items: [{
                            el: {
                                type: "bi.icon"
                            }
                        }]
                    },
                    width: 25
                },
                {
                    el: self.editor
                },
                {
                    el: this.clear,
                    width: 25
                }
            ]
        });
        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.editor.on(BI.Editor.EVENT_FOCUS, function () {
            self.fireEvent(BI.SearchEditor.EVENT_FOCUS);
        });
        this.editor.on(BI.Editor.EVENT_BLUR, function () {
            self.fireEvent(BI.SearchEditor.EVENT_BLUR);
        });
        this.editor.on(BI.Editor.EVENT_CLICK, function () {
            self.fireEvent(BI.SearchEditor.EVENT_CLICK);
        });
        this.editor.on(BI.Editor.EVENT_CHANGE, function () {
            self._checkClear();
            self.fireEvent(BI.SearchEditor.EVENT_CHANGE);
        });
        this.editor.on(BI.Editor.EVENT_KEY_DOWN, function (v) {
            self.fireEvent(BI.SearchEditor.EVENT_KEY_DOWN, v);
        });
        this.editor.on(BI.Editor.EVENT_SPACE, function () {
            self.fireEvent(BI.SearchEditor.EVENT_SPACE)
        });
        this.editor.on(BI.Editor.EVENT_BACKSPACE, function () {
            self.fireEvent(BI.SearchEditor.EVENT_BACKSPACE)
        });


        this.editor.on(BI.Editor.EVENT_VALID, function () {
            self.fireEvent(BI.SearchEditor.EVENT_VALID)
        });
        this.editor.on(BI.Editor.EVENT_ERROR, function () {
            self.fireEvent(BI.SearchEditor.EVENT_ERROR)
        });
        this.editor.on(BI.Editor.EVENT_ENTER, function () {
            self.fireEvent(BI.SearchEditor.EVENT_ENTER);
        });
        this.editor.on(BI.Editor.EVENT_RESTRICT, function () {
            self.fireEvent(BI.SearchEditor.EVENT_RESTRICT)
        });
        this.editor.on(BI.Editor.EVENT_EMPTY, function () {
            self._checkClear();
            self.fireEvent(BI.SearchEditor.EVENT_EMPTY)
        });
        this.editor.on(BI.Editor.EVENT_REMOVE, function () {
            self.fireEvent(BI.SearchEditor.EVENT_REMOVE)
        });
        this.editor.on(BI.Editor.EVENT_CONFIRM, function () {
            self.fireEvent(BI.SearchEditor.EVENT_CONFIRM)
        });
        this.editor.on(BI.Editor.EVENT_START, function () {
            self.fireEvent(BI.SearchEditor.EVENT_START);
        });
        this.editor.on(BI.Editor.EVENT_PAUSE, function () {
            self.fireEvent(BI.SearchEditor.EVENT_PAUSE);
        });
        this.editor.on(BI.Editor.EVENT_STOP, function () {
            self.fireEvent(BI.SearchEditor.EVENT_STOP);
        });

        this.clear.invisible();
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

    getLastValidValue: function () {
        return this.editor.getLastValidValue();
    },

    setValue: function (v) {
        this.editor.setValue(v);
        if (BI.isKey(v)) {
            this.clear.visible();
        }
    },
    
    isEditing: function () {
        return this.editor.isEditing();
    },

    isValid: function () {
        return this.editor.isValid();
    }
});
BI.SearchEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.SearchEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.SearchEditor.EVENT_BLUR = "EVENT_BLUR";
BI.SearchEditor.EVENT_CLICK = "EVENT_CLICK";
BI.SearchEditor.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.SearchEditor.EVENT_SPACE = "EVENT_SPACE";
BI.SearchEditor.EVENT_BACKSPACE = "EVENT_BACKSPACE";
BI.SearchEditor.EVENT_CLEAR = "EVENT_CLEAR";

BI.SearchEditor.EVENT_START = "EVENT_START";
BI.SearchEditor.EVENT_PAUSE = "EVENT_PAUSE";
BI.SearchEditor.EVENT_STOP = "EVENT_STOP";
BI.SearchEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.SearchEditor.EVENT_VALID = "EVENT_VALID";
BI.SearchEditor.EVENT_ERROR = "EVENT_ERROR";
BI.SearchEditor.EVENT_ENTER = "EVENT_ENTER";
BI.SearchEditor.EVENT_RESTRICT = "EVENT_RESTRICT";
BI.SearchEditor.EVENT_REMOVE = "EVENT_REMOVE";
BI.SearchEditor.EVENT_EMPTY = "EVENT_EMPTY";
BI.shortcut("bi.search_editor", BI.SearchEditor);/**
 * 小号搜索框
 * Created by GUY on 2015/9/29.
 * @class BI.SmallSearchEditor
 * @extends BI.SearchEditor
 */
BI.SmallSearchEditor = BI.inherit(BI.SearchEditor, {
    _defaultConfig: function () {
        var conf = BI.SmallSearchEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-small-search-editor",
            height: 24
        });
    },

    _init: function () {
        BI.SmallSearchEditor.superclass._init.apply(this, arguments);
    }
});
BI.shortcut("bi.small_search_editor", BI.SmallSearchEditor);/**
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
            height: 30,
            textAlign: "left"
        })
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
            hgap: 4
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

BI.shortcut("bi.shelter_editor", BI.ShelterEditor);/**
 * Created by User on 2017/7/28.
 */
BI.SignInitialEditor = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.SignInitialEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-sign-initial-editor",
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
            value: "",
            text: "",
            height: 30
        })
    },

    _init: function () {
        BI.SignInitialEditor.superclass._init.apply(this, arguments);
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
                self.fireEvent(BI.SignInitialEditor.EVENT_CLICK_LABEL)
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
            self.fireEvent(BI.SignInitialEditor.EVENT_FOCUS, arguments);
        });
        this.editor.on(BI.Editor.EVENT_BLUR, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_BLUR, arguments);
        });
        this.editor.on(BI.Editor.EVENT_CLICK, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_CLICK, arguments);
        });
        this.editor.on(BI.Editor.EVENT_CHANGE, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_KEY_DOWN, function (v) {
            self.fireEvent(BI.SignInitialEditor.EVENT_KEY_DOWN, arguments);
        });

        this.editor.on(BI.Editor.EVENT_VALID, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_VALID, arguments);
        });
        this.editor.on(BI.Editor.EVENT_CONFIRM, function () {
            self._showHint();
            self._checkText();
            self.fireEvent(BI.SignInitialEditor.EVENT_CONFIRM, arguments);
        });
        this.editor.on(BI.Editor.EVENT_START, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_START, arguments);
        });
        this.editor.on(BI.Editor.EVENT_PAUSE, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_PAUSE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_STOP, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_STOP, arguments);
        });
        this.editor.on(BI.Editor.EVENT_SPACE, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_SPACE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_ERROR, function () {
            self._checkText();
            self.fireEvent(BI.SignInitialEditor.EVENT_ERROR, arguments);
        });
        this.editor.on(BI.Editor.EVENT_ENTER, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_ENTER, arguments);
        });
        this.editor.on(BI.Editor.EVENT_RESTRICT, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_RESTRICT, arguments);
        });
        this.editor.on(BI.Editor.EVENT_EMPTY, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_EMPTY, arguments);
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
                var v = this.editor.getValue();
                v = (BI.isEmpty(v) || v == o.text) ? o.text : v + "(" + o.text + ")";
                this.text.setValue(v);
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

    setValue: function (v) {
        var o = this.options;
        this.editor.setValue(v.value);
        o.text = v.text || o.text;
        this._checkText();
    },

    getValue: function () {
        return {
            value: this.editor.getValue(),
            text: this.options.text
        }
    },

    getState: function () {
        return this.text.getValue();
    },

    setState: function (v) {
        var o = this.options;
        this._showHint();
        v = (BI.isEmpty(v) || v == o.text) ? o.text : v + "(" + o.text + ")";
        this.text.setValue(v);
    }
});
BI.SignInitialEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.SignInitialEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.SignInitialEditor.EVENT_BLUR = "EVENT_BLUR";
BI.SignInitialEditor.EVENT_CLICK = "EVENT_CLICK";
BI.SignInitialEditor.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.SignInitialEditor.EVENT_CLICK_LABEL = "EVENT_CLICK_LABEL";

BI.SignInitialEditor.EVENT_START = "EVENT_START";
BI.SignInitialEditor.EVENT_PAUSE = "EVENT_PAUSE";
BI.SignInitialEditor.EVENT_STOP = "EVENT_STOP";
BI.SignInitialEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.SignInitialEditor.EVENT_VALID = "EVENT_VALID";
BI.SignInitialEditor.EVENT_ERROR = "EVENT_ERROR";
BI.SignInitialEditor.EVENT_ENTER = "EVENT_ENTER";
BI.SignInitialEditor.EVENT_RESTRICT = "EVENT_RESTRICT";
BI.SignInitialEditor.EVENT_SPACE = "EVENT_SPACE";
BI.SignInitialEditor.EVENT_EMPTY = "EVENT_EMPTY";

BI.shortcut("bi.sign_initial_editor", BI.SignInitialEditor);/**
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
            height: 30
        })
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
                self.fireEvent(BI.SignEditor.EVENT_CLICK_LABEL)
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
            height: 30
        })
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
            cls: "state-editor-infinite-text bi-disabled",
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
        BI.StateEditor.superclass.setValue.apply(this, arguments);
        if (BI.isNumber(v)) {
            if (v === BI.Selection.All) {
                this.text.setText(BI.i18nText("BI-Select_All"));
                this.text.setTitle("");
                this.text.element.removeClass("state-editor-infinite-text");
            } else if (v === BI.Selection.Multi) {
                this.text.setText(BI.i18nText("BI-Select_Part"));
                this.text.setTitle("");
                this.text.element.removeClass("state-editor-infinite-text");
            } else {
                this.text.setText(BI.i18nText("BI-Basic_Unrestricted"));
                this.text.setTitle("");
                this.text.element.addClass("state-editor-infinite-text");
            }
            return;
        }
        if (BI.isString(v)) {
            // if (BI.isEmpty(v)) {
            //     this.text.setText(BI.i18nText("BI-Basic_Unrestricted"));
            //     this.text.setTitle("");
            //     this.text.element.addClass("state-editor-infinite-text");
            // } else {
            this.text.setText(v);
            this.text.setTitle(v);
            this.text.element.removeClass("state-editor-infinite-text");
            // }
            return;
        }
        if (BI.isArray(v)) {
            if (BI.isEmpty(v)) {
                this.text.setText(BI.i18nText("BI-Basic_Unrestricted"));
                this.text.element.addClass("state-editor-infinite-text");
            } else if (v.length === 1) {
                this.text.setText(v[0]);
                this.text.setTitle(v[0]);
                this.text.element.removeClass("state-editor-infinite-text");
            } else {
                this.text.setText(BI.i18nText("BI-Select_Part"));
                this.text.setTitle("");
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
            height: 30
        })
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
            cls: "state-editor-infinite-text bi-disabled",
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
 * guy
 * @class BI.TextEditor
 * @extends BI.Single
 */
BI.TextEditor = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.TextEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            extraCls: "bi-text-editor bi-border",
            hgap: 4,
            vgap: 2,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn,
            allowBlank: false,
            watermark: "",
            errorText: "",
            height: 30
        })
    },

    _init: function () {
        BI.TextEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        if (BI.isNumber(o.height)) {
            this.element.css({height: o.height - 2});
        }
        if (BI.isNumber(o.width)) {
            this.element.css({width: o.width - 2});
        }
        this.editor = BI.createWidget({
            type: "bi.editor",
            height: o.height - 2,
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
        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.editor.on(BI.Editor.EVENT_FOCUS, function () {
            self.fireEvent(BI.TextEditor.EVENT_FOCUS);
        });
        this.editor.on(BI.Editor.EVENT_BLUR, function () {
            self.fireEvent(BI.TextEditor.EVENT_BLUR);
        });
        this.editor.on(BI.Editor.EVENT_CLICK, function () {
            self.fireEvent(BI.TextEditor.EVENT_CLICK);
        });
        this.editor.on(BI.Editor.EVENT_CHANGE, function () {
            self.fireEvent(BI.TextEditor.EVENT_CHANGE);
        });
        this.editor.on(BI.Editor.EVENT_KEY_DOWN, function (v) {
            self.fireEvent(BI.TextEditor.EVENT_KEY_DOWN);
        });
        this.editor.on(BI.Editor.EVENT_SPACE, function (v) {
            self.fireEvent(BI.TextEditor.EVENT_SPACE);
        });
        this.editor.on(BI.Editor.EVENT_BACKSPACE, function (v) {
            self.fireEvent(BI.TextEditor.EVENT_BACKSPACE);
        });


        this.editor.on(BI.Editor.EVENT_VALID, function () {
            self.fireEvent(BI.TextEditor.EVENT_VALID);
        });
        this.editor.on(BI.Editor.EVENT_CONFIRM, function () {
            self.fireEvent(BI.TextEditor.EVENT_CONFIRM);
        });
        this.editor.on(BI.Editor.EVENT_REMOVE, function (v) {
            self.fireEvent(BI.TextEditor.EVENT_REMOVE);
        });
        this.editor.on(BI.Editor.EVENT_START, function () {
            self.fireEvent(BI.TextEditor.EVENT_START);
        });
        this.editor.on(BI.Editor.EVENT_PAUSE, function () {
            self.fireEvent(BI.TextEditor.EVENT_PAUSE);
        });
        this.editor.on(BI.Editor.EVENT_STOP, function () {
            self.fireEvent(BI.TextEditor.EVENT_STOP);
        });
        this.editor.on(BI.Editor.EVENT_ERROR, function () {
            self.fireEvent(BI.TextEditor.EVENT_ERROR, arguments);
        });
        this.editor.on(BI.Editor.EVENT_ENTER, function () {
            self.fireEvent(BI.TextEditor.EVENT_ENTER);
        });
        this.editor.on(BI.Editor.EVENT_RESTRICT, function () {
            self.fireEvent(BI.TextEditor.EVENT_RESTRICT);
        });
        this.editor.on(BI.Editor.EVENT_EMPTY, function () {
            self.fireEvent(BI.TextEditor.EVENT_EMPTY);
        });
        BI.createWidget({
            type: "bi.vertical",
            scrolly: false,
            element: this,
            items: [this.editor]
        });
    },

    focus: function () {
        this.editor.focus();
    },

    blur: function () {
        this.editor.blur();
    },

    setErrorText: function (text) {
        this.editor.setErrorText(text);
    },

    getErrorText: function () {
        return this.editor.getErrorText();
    },

    isValid: function () {
        return this.editor.isValid();
    },

    setValue: function (v) {
        this.editor.setValue(v);
    },

    getValue: function () {
        return this.editor.getValue();
    }
});
BI.TextEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.TextEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.TextEditor.EVENT_BLUR = "EVENT_BLUR";
BI.TextEditor.EVENT_CLICK = "EVENT_CLICK";
BI.TextEditor.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.TextEditor.EVENT_SPACE = "EVENT_SPACE";
BI.TextEditor.EVENT_BACKSPACE = "EVENT_BACKSPACE";

BI.TextEditor.EVENT_START = "EVENT_START";
BI.TextEditor.EVENT_PAUSE = "EVENT_PAUSE";
BI.TextEditor.EVENT_STOP = "EVENT_STOP";
BI.TextEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.TextEditor.EVENT_VALID = "EVENT_VALID";
BI.TextEditor.EVENT_ERROR = "EVENT_ERROR";
BI.TextEditor.EVENT_ENTER = "EVENT_ENTER";
BI.TextEditor.EVENT_RESTRICT = "EVENT_RESTRICT";
BI.TextEditor.EVENT_REMOVE = "EVENT_REMOVE";
BI.TextEditor.EVENT_EMPTY = "EVENT_EMPTY";

BI.shortcut("bi.text_editor", BI.TextEditor);/**
 * 小号搜索框
 * Created by GUY on 2015/9/29.
 * @class BI.SmallTextEditor
 * @extends BI.SearchEditor
 */
BI.SmallTextEditor = BI.inherit(BI.TextEditor, {
    _defaultConfig: function () {
        var conf = BI.SmallTextEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-small-text-editor",
            height: 25
        });
    },

    _init: function () {
        BI.SmallTextEditor.superclass._init.apply(this, arguments);
    }
});
BI.shortcut("bi.small_text_editor", BI.SmallTextEditor);/**
 * 有确定取消按钮的弹出层
 * @class BI.BarFloatSection
 * @extends BI.FloatSection
 * @abstract
 */
BI.BarFloatSection = BI.inherit(BI.FloatSection, {
    _defaultConfig: function () {
        return BI.extend(BI.BarFloatSection.superclass._defaultConfig.apply(this, arguments), {
            btns: [BI.i18nText(BI.i18nText("BI-Basic_Sure")), BI.i18nText("BI-Basic_Cancel")]
        })
    },

    _init: function () {
        BI.BarFloatSection.superclass._init.apply(this, arguments);
        var self = this;
        var flatten = ["_init", "_defaultConfig", "_vessel", "_render", "getName", "listenEnd", "local", "refresh", "load", "change"];
        flatten = BI.makeObject(flatten, true);
        BI.each(this.constructor.caller.caller.caller.caller.prototype, function (key) {
            if (flatten[key]) {
                return;
            }
            var f = self[key];
            if (BI.isFunction(f)) {
                self[key] = BI.bind(function () {
                    if (this.model._start === true) {
                        this._F.push({f: f, arg: arguments});
                        return;
                    }
                    return f.apply(this, arguments);
                }, self);
            }
        })
    },

    rebuildSouth: function (south) {
        var self = this, o = this.options;
        this.sure = BI.createWidget({
            type: 'bi.button',
            text: this.options.btns[0],
            height: 30,
            value: 0,
            handler: function (v) {
                self.end();
                self.close(v);
            }
        });
        this.cancel = BI.createWidget({
            type: 'bi.button',
            text: this.options.btns[1],
            height: 30,
            value: 1,
            level: 'ignore',
            handler: function (v) {
                self.close(v);
            }
        });
        BI.createWidget({
            type: 'bi.right_vertical_adapt',
            element: south,
            hgap: 5,
            items: [this.cancel, this.sure]
        });
    }
});

/**
 * 有确定取消按钮的弹出层
 * @class BI.BarPopoverSection
 * @extends BI.PopoverSection
 * @abstract
 */
BI.BarPopoverSection = BI.inherit(BI.PopoverSection, {
    _defaultConfig: function () {
        return BI.extend(BI.BarPopoverSection.superclass._defaultConfig.apply(this, arguments), {
            btns: [BI.i18nText(BI.i18nText("BI-Basic_Sure")), BI.i18nText(BI.i18nText("BI-Basic_Cancel"))]
        })
    },

    _init: function () {
        BI.BarPopoverSection.superclass._init.apply(this, arguments);
    },

    rebuildSouth: function (south) {
        var self = this, o = this.options;
        this.sure = BI.createWidget({
            type: 'bi.button',
            text: this.options.btns[0],
            warningTitle: o.warningTitle,
            height: 30,
            value: 0,
            handler: function (v) {
                self.end();
                self.close(v);
            }
        });
        this.cancel = BI.createWidget({
            type: 'bi.button',
            text: this.options.btns[1],
            height: 30,
            value: 1,
            level: 'ignore',
            handler: function (v) {
                self.close(v);
            }
        });
        BI.createWidget({
            type: 'bi.right_vertical_adapt',
            element: south,
            hgap: 5,
            items: [this.cancel, this.sure]
        });
    },

    setConfirmButtonEnable: function(v){
        this.sure.setEnable(!!v);
    }
});/**
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
        })
    },

    _init: function () {
        BI.MultiPopupView.superclass._init.apply(this, arguments);
    },

    _createToolBar: function () {
        var o = this.options, self = this;
        if (o.buttons.length === 0) {
            return;
        }

        var text = [];          //构造[{text:content},……]
        BI.each(o.buttons, function (idx, item) {
            text.push({
                text: item,
                value: idx
            })
        });

        this.buttongroup = BI.createWidget({
            type: "bi.button_group",
            cls: "list-view-toolbar bi-high-light bi-border-top",
            height: 30,
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
        })
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
            cls: "popup-panel-title bi-background bi-border",
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
        })
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
                        self.loading()
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
        if (arguments.length === 0 && (BI.isFunction(this.button_group.attr("itemsCreator")))) {//接管loader的populate方法
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
BI.Panel = BI.inherit(BI.Widget,{
    _defaultConfig : function(){
        return BI.extend(BI.Panel.superclass._defaultConfig.apply(this,arguments),{
            baseCls: "bi-panel bi-border",
            title:"",
            titleButtons:[],
            el:{},
            logic:{
                dynamic: false
            }
        });
    },

    _init:function(){
        BI.Panel.superclass._init.apply(this,arguments);
        var o = this.options;

        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic("vertical", BI.extend(o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection("top", this._createTitle()
                ,this.options.el)
        }))));
    },

    _createTitle:function(){
        var self = this, o = this.options;
        this.text = BI.createWidget({
            type: "bi.label",
            cls: "panel-title-text",
            text: o.title,
            height: 30
        });

        this.button_group = BI.createWidget({
            type:"bi.button_group",
            items: o.titleButtons,
            layouts: [{
                type: "bi.center_adapt",
                lgap:10
            }]
        });

        this.button_group.on(BI.Controller.EVENT_CHANGE, function(){
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.button_group.on(BI.ButtonGroup.EVENT_CHANGE, function(value, obj){
            self.fireEvent(BI.Panel.EVENT_CHANGE, value, obj);
        });

        return {
            el: {
                type: "bi.left_right_vertical_adapt",
                cls: "panel-title bi-tips bi-border-bottom bi-background",
                height: 30,
                items: {
                    left: [this.text],
                    right: [this.button_group]
                },
                lhgap: 10,
                rhgap: 10
            },
            height: 30
        };
    },

    setTitle: function(title){
        this.text.setValue(title);
    }
});
BI.Panel.EVENT_CHANGE = "Panel.EVENT_CHANGE";

BI.shortcut("bi.panel",BI.Panel);/**
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
            direction: BI.Direction.Top,//toolbar的位置
            logic: {
                dynamic: true
            },
            items: [],
            itemsCreator: BI.emptyFn,
            hasNext: BI.emptyFn,
            onLoaded: BI.emptyFn,
            toolbar: {
                type: "bi.multi_select_bar"
            },
            el: {
                type: "bi.list_pane"
            }
        })
    },
    _init: function () {
        BI.SelectList.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        //全选
        this.toolbar = BI.createWidget(o.toolbar);
        this.toolbar.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
            var isAllSelected = this.isSelected();
            if (type === BI.Events.CLICK) {
                self.setAllSelected(isAllSelected);
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
        this.toolbar.setSelected(v);
        this.toolbar.setHalfSelected(false);
    },

    setToolBarVisible: function (b) {
        this.toolbar.setVisible(b);
    },

    isAllSelected: function () {
        return this.toolbar.isSelected();
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
        } else {
            return {
                type: BI.ButtonGroup.CHOOSE_TYPE_ALL,
                value: this.list.getNotSelectedValue(),
                assist: this.list.getValue()
            };
        }
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
            this.list.element.css({"max-height": h - toolHeight + "px"})
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
        })
    },

    _init: function () {
        var self = this, o = this.options;
        BI.LazyLoader.superclass._init.apply(this, arguments);
        var all = o.items.length;
        this.loader = BI.createWidget({
            type: "bi.loader",
            element: this,
            //下面是button_group的属性
            el: o.el,

            itemsCreator: function (options, populate) {
                populate(self._getNextItems(options));
            },
            hasNext: function (option) {
                return option.count < all;
            }
        });

        this.loader.on(BI.Loader.EVENT_CHANGE, function (obj) {
            self.fireEvent(BI.LazyLoader.EVENT_CHANGE, obj)
        })
    },
    _getNextItems: function (options) {
        var self = this, o = this.options;
        var lastNum = o.items.length - this._const.PAGE * (options.times - 1);
        var lastItems = BI.last(o.items, lastNum);
        var nextItems = BI.first(lastItems, this._const.PAGE);
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

            isDefaultInit: true,//是否默认初始化数据

            //下面是button_group的属性
            el: {
                type: "bi.button_group"
            },

            items: [],
            itemsCreator: BI.emptyFn,
            onLoaded: BI.emptyFn,

            //下面是分页信息
            count: false,
            next: {},
            hasNext: BI.emptyFn
        })
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
            })
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
        }])
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

            isDefaultInit: true,//是否默认初始化数据

            //下面是button_group的属性
            el: {
                type: "bi.button_group"
            },

            items: [],
            itemsCreator: BI.emptyFn,
            onLoaded: BI.emptyFn,

            //下面是分页信息
            count: false,
            next: {},
            hasNext: BI.emptyFn

            //containment: this.element,
            //connectWith: ".bi-sort-list",
        })
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
                        "margin": $currentItem.css("margin")
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
BI.shortcut("bi.sort_list", BI.SortList);/**
 * 有总页数和总行数的分页控件
 * Created by Young's on 2016/10/13.
 */
BI.AllCountPager = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.AllCountPager.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-all-count-pager",
            height: 30,
            pages: 1, //必选项
            curr: 1, //初始化当前页， pages为数字时可用，
            count: 1 //总行数
        })
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
        })
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
                pages: false, //总页数
                curr: 1, //初始化当前页， pages为数字时可用

                hasPrev: BI.emptyFn,
                hasNext: BI.emptyFn,
                firstPage: 1,
                lastPage: BI.emptyFn
            },
            vertical: {
                pages: false, //总页数
                curr: 1, //初始化当前页， pages为数字时可用

                hasPrev: BI.emptyFn,
                hasNext: BI.emptyFn,
                firstPage: 1,
                lastPage: BI.emptyFn
            }
        })
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
            title: v.curr
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
            title: h.curr
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

            dynamicShow: true, //是否动态显示上一页、下一页、首页、尾页， 若为false，则指对其设置使能状态
            //dynamicShow为false时以下两个有用
            dynamicShowFirstLast: false,//是否动态显示首页、尾页
            dynamicShowPrevNext: false,//是否动态显示上一页、下一页
            pages: false, //总页数
            curr: function () {
                return 1;
            }, //初始化当前页
            groups: 0, //连续显示分页数
            jump: BI.emptyFn, //分页的回调函数

            first: false, //是否显示首页
            last: false, //是否显示尾页
            prev: "上一页",
            next: "下一页",

            firstPage: 1,
            lastPage: function () { //在万不得已时才会调用这个函数获取最后一页的页码,  主要作用于setValue方法
                return 1;
            },
            hasPrev: BI.emptyFn, //pages不可用时有效
            hasNext: BI.emptyFn  //pages不可用时有效
        })
    },
    _init: function () {
        BI.DetailPager.superclass._init.apply(this, arguments);
        var self = this;
        this.currPage = BI.result(this.options, "curr");
        //翻页太灵敏
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

        //计算当前组
        dict.index = Math.ceil((curr + ((groups > 1 && groups !== pages) ? 1 : 0)) / (groups === 0 ? 1 : groups));

        //当前页非首页，则输出上一页
        if (((!o.dynamicShow && !o.dynamicShowPrevNext) || curr > 1) && prev !== false) {
            if (BI.isKey(prev)) {
                view.push({
                    text: prev,
                    value: "prev",
                    disabled: pages === false ? o.hasPrev(curr) === false : !(curr > 1 && prev !== false)
                })
            } else {
                view.push(BI.extend({
                    disabled: pages === false ? o.hasPrev(curr) === false : !(curr > 1 && prev !== false)
                }, prev));
            }
        }

        //当前组非首组，则输出首页
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

        //输出当前页组
        dict.poor = Math.floor((groups - 1) / 2);
        dict.start = dict.index > 1 ? curr - dict.poor : 1;
        dict.end = dict.index > 1 ? (function () {
            var max = curr + (groups - dict.poor - 1);
            return max > pages ? pages : max;
        }()) : groups;
        if (dict.end - dict.start < groups - 1) { //最后一组状态
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
                })
            } else {
                view.push({
                    text: s,
                    value: s
                })
            }
        }

        //总页数大于连续分页数，且当前组最大页小于总页，输出尾页
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
            })
        }

        //当前页不为尾页时，输出下一页
        dict.flow = !prev && groups === 0;
        if (((!o.dynamicShow && !o.dynamicShowPrevNext) && next) || (curr !== pages && next || dict.flow)) {
            view.push((function () {
                if (BI.isKey(next)) {
                    if (pages === false) {
                        return {text: next, value: "next", disabled: o.hasNext(curr) === false}
                    }
                    return (dict.flow && curr === pages)
                        ?
                    {text: next, value: "next", disabled: true}
                        :
                    {text: next, value: "next", disabled: !(curr !== pages && next || dict.flow)};
                } else {
                    return BI.extend({
                        disabled: pages === false ? o.hasNext(curr) === false : !(curr !== pages && next || dict.flow)
                    }, next);
                }
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
            baseCls: (conf.baseCls || "") + ' bi-segment-button bi-list-item-active',
            shadow: true,
            readonly: true,
            hgap: 5
        })
    },

    _init: function () {
        BI.SegmentButton.superclass._init.apply(this, arguments);
        var opts = this.options, self = this;
        //if (BI.isNumber(opts.height) && BI.isNull(opts.lineHeight)) {
        //    this.element.css({lineHeight : (opts.height - 2) + 'px'});
        //}
        this.text = BI.createWidget({
            type: "bi.label",
            element: this,
            height: opts.height - 2,
            whiteSpace: opts.whiteSpace,
            text: opts.text,
            value: opts.value,
            hgap: opts.hgap
        })
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
BI.shortcut('bi.segment_button', BI.SegmentButton);/**
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
            height: 30
        });
    },
    _init: function () {
        BI.Segment.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.buttonGroup = BI.createWidget({
            element: this,
            type: "bi.button_group",
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
        })
        this.buttonGroup.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments)
        });
        this.buttonGroup.on(BI.ButtonGroup.EVENT_CHANGE, function (value, obj) {
            self.fireEvent(BI.Segment.EVENT_CHANGE, value, obj)
        })
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
BI.shortcut('bi.segment', BI.Segment);/**
 * 自适应宽度的表格
 *
 * Created by GUY on 2016/2/3.
 * @class BI.AdaptiveTable
 * @extends BI.Widget
 */
BI.AdaptiveTable = BI.inherit(BI.Widget, {

    _const: {
        perColumnSize: 100
    },

    _defaultConfig: function () {
        return BI.extend(BI.AdaptiveTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-adaptive-table",
            el: {
                type: "bi.resizable_table"
            },
            isNeedResize: true,
            isNeedFreeze: false,//是否需要冻结单元格
            freezeCols: [], //冻结的列号,从0开始,isNeedFreeze为true时生效

            isNeedMerge: false,//是否需要合并单元格
            mergeCols: [], //合并的单元格列号
            mergeRule: BI.emptyFn,

            columnSize: [],
            minColumnSize: [],
            maxColumnSize: [],

            headerRowSize: 25,
            rowSize: 25,

            regionColumnSize: [],

            header: [],
            items: [], //二维数组

            //交叉表头
            crossHeader: [],
            crossItems: []
        });
    },

    _init: function () {
        BI.AdaptiveTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        var data = this._digest();
        this.table = BI.createWidget(o.el, {
            type: "bi.resizable_table",
            element: this,
            width: o.width,
            height: o.height,
            isNeedResize: o.isNeedResize,
            isResizeAdapt: false,

            isNeedFreeze: o.isNeedFreeze,
            freezeCols: data.freezeCols,

            isNeedMerge: o.isNeedMerge,
            mergeCols: o.mergeCols,
            mergeRule: o.mergeRule,

            columnSize: data.columnSize,

            headerRowSize: o.headerRowSize,
            rowSize: o.rowSize,

            regionColumnSize: data.regionColumnSize,

            header: o.header,
            items: o.items,
            //交叉表头
            crossHeader: o.crossHeader,
            crossItems: o.crossItems
        });
        this.table.on(BI.Table.EVENT_TABLE_SCROLL, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, function () {
            o.regionColumnSize = this.getRegionColumnSize();
            self._populate();
            self.table.populate();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, arguments);
        });

        this.table.on(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, function () {
            o.columnSize = this.getColumnSize();
            self._populate();
            self.table.populate();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, arguments);
        });
    },

    _getFreezeColLength: function () {
        return this.options.isNeedFreeze === true ? this.options.freezeCols.length : 0;
    },

    _digest: function () {
        var o = this.options;
        var columnSize = o.columnSize.slice();
        var regionColumnSize = o.regionColumnSize.slice();
        var freezeCols = o.freezeCols.slice();
        var regionSize = o.regionColumnSize[0];
        var freezeColLength = this._getFreezeColLength();
        if (!regionSize || regionSize > o.width - 10 || regionSize < 10) {
            regionSize = (freezeColLength > o.columnSize.length / 2 ? 2 / 3 : 1 / 3) * o.width;
        }
        if (freezeColLength === 0) {
            regionSize = 0;
        }
        if (freezeCols.length >= columnSize.length) {
            freezeCols = [];
        }
        if (!BI.isNumber(columnSize[0])) {
            columnSize = o.minColumnSize.slice();
        }
        var summaryFreezeColumnSize = 0, summaryColumnSize = 0;
        BI.each(columnSize, function (i, size) {
            if (i < freezeColLength) {
                summaryFreezeColumnSize += size;
            }
            summaryColumnSize += size;
        });
        if (freezeColLength > 0) {
            columnSize[freezeColLength - 1] = BI.clamp(regionSize - (summaryFreezeColumnSize - columnSize[freezeColLength - 1]),
                o.minColumnSize[freezeColLength - 1] || 10, o.maxColumnSize[freezeColLength - 1] || Number.MAX_VALUE);
        }
        if (columnSize.length > 0) {
            columnSize[columnSize.length - 1] = BI.clamp(o.width - BI.GridTableScrollbar.SIZE - regionSize - (summaryColumnSize - summaryFreezeColumnSize - columnSize[columnSize.length - 1]),
                o.minColumnSize[columnSize.length - 1] || 10, o.maxColumnSize[columnSize.length - 1] || Number.MAX_VALUE);
        }
        regionColumnSize[0] = regionSize;

        return {
            freezeCols: freezeCols,
            columnSize: columnSize,
            regionColumnSize: regionColumnSize
        }
    },

    _populate: function () {
        var o = this.options;
        var data = this._digest();
        o.regionColumnSize = data.regionColumnSize;
        o.columnSize = data.columnSize;
        this.table.setColumnSize(data.columnSize);
        this.table.setRegionColumnSize(data.regionColumnSize);
        this.table.attr("freezeCols", data.freezeCols);
    },

    setWidth: function (width) {
        BI.AdaptiveTable.superclass.setWidth.apply(this, arguments);
        this.table.setWidth(width);
    },

    setHeight: function (height) {
        BI.AdaptiveTable.superclass.setHeight.apply(this, arguments);
        this.table.setHeight(height);
    },

    setColumnSize: function (columnSize) {
        this.options.columnSize = columnSize;
    },

    getColumnSize: function () {
        return this.table.getColumnSize();
    },

    setRegionColumnSize: function (regionColumnSize) {
        this.options.regionColumnSize = regionColumnSize;
    },

    getRegionColumnSize: function () {
        return this.table.getRegionColumnSize();
    },

    setVerticalScroll: function (scrollTop) {
        this.table.setVerticalScroll(scrollTop);
    },

    setLeftHorizontalScroll: function (scrollLeft) {
        this.table.setLeftHorizontalScroll(scrollLeft);
    },

    setRightHorizontalScroll: function (scrollLeft) {
        this.table.setRightHorizontalScroll(scrollLeft);
    },

    getVerticalScroll: function () {
        return this.table.getVerticalScroll();
    },

    getLeftHorizontalScroll: function () {
        return this.table.getLeftHorizontalScroll();
    },

    getRightHorizontalScroll: function () {
        return this.table.getRightHorizontalScroll();
    },

    attr: function (key, value) {
        var v = BI.AdaptiveTable.superclass.attr.apply(this, arguments);
        if (key === "freezeCols") {
            return v;
        }
        return this.table.attr.apply(this.table, arguments);
    },

    restore: function () {
        this.table.restore();
    },

    populate: function (items) {
        var self = this, o = this.options;
        this._populate();
        this.table.populate.apply(this.table, arguments);
    },

    destroy: function () {
        this.table.destroy();
        BI.AdaptiveTable.superclass.destroy.apply(this, arguments);
    }
});
BI.shortcut('bi.adaptive_table', BI.AdaptiveTable);/**
 *
 * 层级树状结构的表格
 *
 * Created by GUY on 2016/8/12.
 * @class BI.DynamicSummaryLayerTreeTable
 * @extends BI.Widget
 */
BI.DynamicSummaryLayerTreeTable = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.DynamicSummaryLayerTreeTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-dynamic-summary-layer-tree-table",

            el: {
                type: "bi.resizable_table"
            },
            isNeedResize: true,//是否需要调整列宽
            isResizeAdapt: true,//是否需要在调整列宽或区域宽度的时候它们自适应变化

            isNeedFreeze: false,//是否需要冻结单元格
            freezeCols: [], //冻结的列号,从0开始,isNeedFreeze为tree时生效

            isNeedMerge: true,//是否需要合并单元格
            mergeCols: [],
            mergeRule: BI.emptyFn,

            columnSize: [],
            minColumnSize: [],
            maxColumnSize: [],
            headerRowSize: 25,
            footerRowSize: 25,
            rowSize: 25,

            regionColumnSize: [],

            //行表头
            rowHeaderCreator: null,

            headerCellStyleGetter: BI.emptyFn,
            summaryCellStyleGetter: BI.emptyFn,
            sequenceCellStyleGetter: BI.emptyFn,

            header: [],
            footer: false,
            items: [],

            //交叉表头
            crossHeader: [],
            crossItems: []
        })
    },

    _getVDeep: function () {
        return this.options.crossHeader.length;//纵向深度
    },

    _getHDeep: function () {
        var o = this.options;
        return Math.max(o.mergeCols.length, o.freezeCols.length, BI.TableTree.maxDeep(o.items) - 1);
    },

    _createHeader: function (vDeep) {
        var self = this, o = this.options;
        var header = o.header || [], crossHeader = o.crossHeader || [];
        var items = BI.TableTree.formatCrossItems(o.crossItems, vDeep, o.headerCellStyleGetter);
        var result = [];
        BI.each(items, function (row, node) {
            var c = [crossHeader[row]];
            result.push(c.concat(node || []));
        });
        if (header && header.length > 0) {
            var newHeader = this._formatColumns(header);
            var deep = this._getHDeep();
            if (deep <= 0) {
                newHeader.unshift(o.rowHeaderCreator || {
                        type: "bi.table_style_cell",
                        text: BI.i18nText("BI-Row_Header"),
                        styleGetter: o.headerCellStyleGetter
                    });
            } else {
                newHeader[0] = o.rowHeaderCreator || {
                        type: "bi.table_style_cell",
                        text: BI.i18nText("BI-Row_Header"),
                        styleGetter: o.headerCellStyleGetter
                    };
            }
            result.push(newHeader);
        }
        return result;
    },

    _formatItems: function (nodes, header, deep) {
        var self = this, o = this.options;
        var result = [];

        function track(node, layer) {
            node.type || (node.type = "bi.layer_tree_table_cell");
            node.layer = layer;
            var next = [node];
            next = next.concat(node.values || []);
            if (next.length > 0) {
                result.push(next);
            }
            if (BI.isNotEmptyArray(node.children)) {
                BI.each(node.children, function (index, child) {
                    track(child, layer + 1);
                });
            }
        }

        BI.each(nodes, function (i, node) {
            BI.each(node.children, function (j, c) {
                track(c, 0);
            });
            if (BI.isArray(node.values)) {
                var next = [{
                    type: "bi.table_style_cell",
                    text: BI.i18nText("BI-Summary_Values"),
                    styleGetter: function () {
                        return o.summaryCellStyleGetter(true);
                    }
                }].concat(node.values);
                result.push(next)
            }
        });
        return BI.DynamicSummaryTreeTable.formatSummaryItems(result, header, o.crossItems, 1);
    },

    _formatColumns: function (columns, deep) {
        if (BI.isNotEmptyArray(columns)) {
            deep = deep || this._getHDeep();
            return columns.slice(Math.max(0, deep - 1));
        }
        return columns;
    },

    _formatFreezeCols: function () {
        if (this.options.freezeCols.length > 0) {
            return [0];
        }
        return [];
    },

    _formatColumnSize: function (columnSize, deep) {
        if (columnSize.length <= 0) {
            return [];
        }
        var result = [0];
        deep = deep || this._getHDeep();
        BI.each(columnSize, function (i, size) {
            if (i < deep) {
                result[0] += size;
                return;
            }
            result.push(size);
        });
        return result;
    },

    _recomputeColumnSize: function () {
        var o = this.options;
        o.regionColumnSize = this.table.getRegionColumnSize();
        var columnSize = this.table.getColumnSize().slice();
        if (o.freezeCols.length > 1) {
            for (var i = 0; i < o.freezeCols.length - 1; i++) {
                columnSize.splice(1, 0, 0);
            }
        }
        o.columnSize = columnSize;
    },

    _digest: function () {
        var o = this.options;
        var deep = this._getHDeep();
        var vDeep = this._getVDeep();
        var header = this._createHeader(vDeep);
        var data = this._formatItems(o.items, header, deep);
        var columnSize = o.columnSize.slice();
        var minColumnSize = o.minColumnSize.slice();
        var maxColumnSize = o.maxColumnSize.slice();
        BI.removeAt(columnSize, data.deletedCols);
        BI.removeAt(minColumnSize, data.deletedCols);
        BI.removeAt(maxColumnSize, data.deletedCols);
        return {
            header: data.header,
            items: data.items,
            columnSize: this._formatColumnSize(columnSize, deep),
            minColumnSize: this._formatColumns(minColumnSize, deep),
            maxColumnSize: this._formatColumns(maxColumnSize, deep),
            freezeCols: this._formatFreezeCols()
        }
    },

    _init: function () {
        BI.DynamicSummaryLayerTreeTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var data = this._digest();
        this.table = BI.createWidget(o.el, {
            type: "bi.resizable_table",
            element: this,
            width: o.width,
            height: o.height,
            isNeedResize: o.isNeedResize,
            isResizeAdapt: o.isResizeAdapt,
            isNeedFreeze: o.isNeedFreeze,
            freezeCols: data.freezeCols,
            isNeedMerge: o.isNeedMerge,
            mergeCols: [],
            mergeRule: o.mergeRule,
            columnSize: data.columnSize,
            minColumnSize: data.minColumnSize,
            maxColumnSize: data.maxColumnSize,
            headerRowSize: o.headerRowSize,
            rowSize: o.rowSize,
            regionColumnSize: o.regionColumnSize,
            header: data.header,
            items: data.items
        });
        this.table.on(BI.Table.EVENT_TABLE_SCROLL, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, function () {
            self._recomputeColumnSize();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, function () {
            self._recomputeColumnSize();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, arguments);
        });
    },

    setWidth: function (width) {
        BI.DynamicSummaryLayerTreeTable.superclass.setWidth.apply(this, arguments);
        this.table.setWidth(width);
    },

    setHeight: function (height) {
        BI.DynamicSummaryLayerTreeTable.superclass.setHeight.apply(this, arguments);
        this.table.setHeight(height);
    },

    setColumnSize: function (columnSize) {
        this.options.columnSize = columnSize;
    },

    getColumnSize: function () {
        return this.options.columnSize;
    },

    setRegionColumnSize: function (columnSize) {
        this.options.regionColumnSize = columnSize;
        this.table.setRegionColumnSize(columnSize);
    },

    getRegionColumnSize: function () {
        return this.table.getRegionColumnSize();
    },

    setVerticalScroll: function (scrollTop) {
        this.table.setVerticalScroll(scrollTop);
    },

    setLeftHorizontalScroll: function (scrollLeft) {
        this.table.setLeftHorizontalScroll(scrollLeft);
    },

    setRightHorizontalScroll: function (scrollLeft) {
        this.table.setRightHorizontalScroll(scrollLeft);
    },

    getVerticalScroll: function () {
        return this.table.getVerticalScroll();
    },

    getLeftHorizontalScroll: function () {
        return this.table.getLeftHorizontalScroll();
    },

    getRightHorizontalScroll: function () {
        return this.table.getRightHorizontalScroll();
    },

    attr: function (key, value) {
        var self = this;
        if (BI.isObject(key)) {
            BI.each(key, function (k, v) {
                self.attr(k, v);
            });
            return;
        }
        BI.DynamicSummaryLayerTreeTable.superclass.attr.apply(this, arguments);
        switch (key) {
            case "columnSize":
            case "minColumnSize":
            case "maxColumnSize":
            case "freezeCols":
            case "mergeCols":
                return;
        }
        this.table.attr.apply(this.table, [key, value]);
    },

    restore: function () {
        this.table.restore();
    },

    populate: function (items, header, crossItems, crossHeader) {
        var o = this.options;
        if (items) {
            o.items = items;
        }
        if (header) {
            o.header = header;
        }
        if (crossItems) {
            o.crossItems = crossItems;
        }
        if (crossHeader) {
            o.crossHeader = crossHeader;
        }
        var data = this._digest();
        this.table.setColumnSize(data.columnSize);
        this.table.attr("minColumnSize", data.minColumnSize);
        this.table.attr("maxColumnSize", data.maxColumnSize);
        this.table.attr("freezeCols", data.freezeCols);
        this.table.populate(data.items, data.header);
    },

    destroy: function () {
        this.table.destroy();
        BI.DynamicSummaryLayerTreeTable.superclass.destroy.apply(this, arguments);
    }
});

BI.shortcut("bi.dynamic_summary_layer_tree_table", BI.DynamicSummaryLayerTreeTable);/**
 *
 * 树状结构的表格
 *
 * Created by GUY on 2015/8/12.
 * @class BI.DynamicSummaryTreeTable
 * @extends BI.Widget
 */
BI.DynamicSummaryTreeTable = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.DynamicSummaryTreeTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-dynamic-summary-tree-table",
            el: {
                type: "bi.resizable_table"
            },

            isNeedResize: true,//是否需要调整列宽
            isResizeAdapt: true,//是否需要在调整列宽或区域宽度的时候它们自适应变化

            isNeedFreeze: false,//是否需要冻结单元格
            freezeCols: [], //冻结的列号,从0开始,isNeedFreeze为tree时生效

            isNeedMerge: true,//是否需要合并单元格
            mergeCols: [],
            mergeRule: BI.emptyFn,

            columnSize: [],
            minColumnSize: [],
            maxColumnSize: [],
            headerRowSize: 25,
            footerRowSize: 25,
            rowSize: 25,

            regionColumnSize: [],

            headerCellStyleGetter: BI.emptyFn,
            summaryCellStyleGetter: BI.emptyFn,
            sequenceCellStyleGetter: BI.emptyFn,

            header: [],
            footer: false,
            items: [],

            //交叉表头
            crossHeader: [],
            crossItems: []
        })
    },

    _getVDeep: function () {
        return this.options.crossHeader.length;//纵向深度
    },

    _getHDeep: function () {
        var o = this.options;
        return Math.max(o.mergeCols.length, o.freezeCols.length, BI.TableTree.maxDeep(o.items) - 1);
    },

    _init: function () {
        BI.DynamicSummaryTreeTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var data = this._digest();
        this.table = BI.createWidget(o.el, {
            type: "bi.resizable_table",
            element: this,
            width: o.width,
            height: o.height,

            isNeedResize: o.isNeedResize,
            isResizeAdapt: o.isResizeAdapt,

            isNeedFreeze: o.isNeedFreeze,
            freezeCols: o.freezeCols,
            isNeedMerge: o.isNeedMerge,
            mergeCols: o.mergeCols,
            mergeRule: o.mergeRule,

            columnSize: o.columnSize,
            minColumnSize: o.minColumnSize,
            maxColumnSize: o.maxColumnSize,
            headerRowSize: o.headerRowSize,
            rowSize: o.rowSize,

            regionColumnSize: o.regionColumnSize,

            header: data.header,
            items: data.items
        });
        this.table.on(BI.Table.EVENT_TABLE_SCROLL, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, function () {
            o.regionColumnSize = this.getRegionColumnSize();
            var columnSize = this.getColumnSize();
            var length = o.columnSize.length - columnSize.length;
            o.columnSize = columnSize.slice();
            o.columnSize  = o.columnSize.concat(BI.makeArray(length, 0));
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, function () {
            o.regionColumnSize = this.getRegionColumnSize();
            var columnSize = this.getColumnSize();
            var length = o.columnSize.length - columnSize.length;
            o.columnSize = columnSize.slice();
            o.columnSize  = o.columnSize.concat(BI.makeArray(length, 0));
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, arguments);
        });
    },

    _digest: function () {
        var o = this.options;
        var deep = this._getHDeep();
        var vDeep = this._getVDeep();
        var header = BI.TableTree.formatHeader(o.header, o.crossHeader, o.crossItems, deep, vDeep, o.headerCellStyleGetter);
        var items = BI.DynamicSummaryTreeTable.formatHorizontalItems(o.items, deep, false, o.summaryCellStyleGetter);
        var data = BI.DynamicSummaryTreeTable.formatSummaryItems(items, header, o.crossItems, deep);
        var columnSize = o.columnSize.slice();
        var minColumnSize = o.minColumnSize.slice();
        var maxColumnSize = o.maxColumnSize.slice();
        BI.removeAt(columnSize, data.deletedCols);
        BI.removeAt(minColumnSize, data.deletedCols);
        BI.removeAt(maxColumnSize, data.deletedCols);
        return {
            header: data.header,
            items: data.items,
            columnSize: columnSize,
            minColumnSize: minColumnSize,
            maxColumnSize: maxColumnSize
        };
    },

    setWidth: function (width) {
        BI.DynamicSummaryTreeTable.superclass.setWidth.apply(this, arguments);
        this.table.setWidth(width);
    },

    setHeight: function (height) {
        BI.DynamicSummaryTreeTable.superclass.setHeight.apply(this, arguments);
        this.table.setHeight(height);
    },

    setColumnSize: function (columnSize) {
        this.options.columnSize = columnSize;
    },

    getColumnSize: function () {
        return this.options.columnSize;
    },

    setRegionColumnSize: function (columnSize) {
        this.options.regionColumnSize = columnSize;
        this.table.setRegionColumnSize(columnSize);
    },

    getRegionColumnSize: function () {
        return this.table.getRegionColumnSize();
    },

    setVerticalScroll: function (scrollTop) {
        this.table.setVerticalScroll(scrollTop);
    },

    setLeftHorizontalScroll: function (scrollLeft) {
        this.table.setLeftHorizontalScroll(scrollLeft);
    },

    setRightHorizontalScroll: function (scrollLeft) {
        this.table.setRightHorizontalScroll(scrollLeft);
    },

    getVerticalScroll: function () {
        return this.table.getVerticalScroll();
    },

    getLeftHorizontalScroll: function () {
        return this.table.getLeftHorizontalScroll();
    },

    getRightHorizontalScroll: function () {
        return this.table.getRightHorizontalScroll();
    },

    attr: function (key) {
        BI.DynamicSummaryTreeTable.superclass.attr.apply(this, arguments);
        switch (key) {
            case "minColumnSize":
            case "maxColumnSize":
                return;
        }
        this.table.attr.apply(this.table, arguments);
    },

    restore: function () {
        this.table.restore();
    },

    populate: function (items, header, crossItems, crossHeader) {
        var o = this.options;
        if (items) {
            o.items = items;
        }
        if (header) {
            o.header = header;
        }
        if (crossItems) {
            o.crossItems = crossItems;
        }
        if (crossHeader) {
            o.crossHeader = crossHeader;
        }
        var data = this._digest();
        this.table.setColumnSize(data.columnSize);
        this.table.attr("minColumnSize", data.minColumnSize);
        this.table.attr("maxColumnSize", data.maxColumnSize);
        this.table.populate(data.items, data.header);
    },

    destroy: function () {
        this.table.destroy();
        BI.DynamicSummaryTreeTable.superclass.destroy.apply(this, arguments);
    }
});

BI.extend(BI.DynamicSummaryTreeTable, {

    formatHorizontalItems: function (nodes, deep, isCross, styleGetter) {
        var result = [];

        function track(store, node) {
            var next;
            if (BI.isArray(node.children)) {
                BI.each(node.children, function (index, child) {
                    var next;
                    if (store != -1) {
                        next = store.slice();
                        next.push(node);
                    } else {
                        next = [];
                    }
                    track(next, child);
                });
                if (store != -1) {
                    next = store.slice();
                    next.push(node);
                } else {
                    next = [];
                }
                if ((store == -1 || node.children.length > 1) && BI.isNotEmptyArray(node.values)) {
                    var summary = {
                        text: BI.i18nText("BI-Summary_Values"),
                        type: "bi.table_style_cell",
                        styleGetter: function () {
                            return styleGetter(store === -1)
                        }
                    };
                    for (var i = next.length; i < deep; i++) {
                        next.push(summary);
                    }
                    if (!isCross) {
                        next = next.concat(node.values);
                    }
                    if (next.length > 0) {
                        if (!isCross) {
                            result.push(next);
                        } else {
                            for (var k = 0, l = node.values.length; k < l; k++) {
                                result.push(next);
                            }
                        }
                    }
                }
                return;
            }
            if (store != -1) {
                next = store.slice();
                for (var i = next.length; i < deep; i++) {
                    next.push(node);
                }
            } else {
                next = [];
            }
            if (!isCross && BI.isArray(node.values)) {
                next = next.concat(node.values);
            }
            if (isCross && BI.isArray(node.values)) {
                for (var i = 0, len = node.values.length; i < len - 1; i++) {
                    if (next.length > 0) {
                        result.push(next);
                    }
                }
            }
            if (next.length > 0) {
                result.push(next);
            }
        }

        BI.each(nodes, function (i, node) {
            track(-1, node);
        });
        //填充空位
        BI.each(result, function (i, line) {
            var last = BI.last(line);
            for (var j = line.length; j < deep; j++) {
                line.push(last);
            }
        });
        return result;
    },

    formatSummaryItems: function (items, header, crossItems, deep) {
        //求纵向需要去除的列
        var cols = [];
        var leaf = 0;

        function track(node) {
            if (BI.isArray(node.children)) {
                BI.each(node.children, function (index, child) {
                    track(child);
                });
                if (BI.isNotEmptyArray(node.values)) {
                    if (node.children.length === 1) {
                        for (var i = 0; i < node.values.length; i++) {
                            cols.push(leaf + i + deep);
                        }
                    }
                    leaf += node.values.length;
                }
                return;
            }
            if (node.values && node.values.length > 1) {
                leaf += node.values.length;
            } else {
                leaf++;
            }
        }

        BI.each(crossItems, function (i, node) {
            track(node);
        });

        if (cols.length > 0) {
            var nHeader = [], nItems = [];
            BI.each(header, function (i, node) {
                var nNode = node.slice();
                BI.removeAt(nNode, cols);
                nHeader.push(nNode);
            });
            BI.each(items, function (i, node) {
                var nNode = node.slice();
                BI.removeAt(nNode, cols);
                nItems.push(nNode);;
            });
            header = nHeader;
            items = nItems;
        }
        return {items: items, header: header, deletedCols: cols};
    }
});

BI.shortcut("bi.dynamic_summary_tree_table", BI.DynamicSummaryTreeTable);/**
 *
 * 层级树状结构的表格
 *
 * Created by GUY on 2016/5/7.
 * @class BI.LayerTreeTable
 * @extends BI.Widget
 */
BI.LayerTreeTable = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.LayerTreeTable.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-layer-tree-table",
            el: {
                type: "bi.resizable_table"
            },

            isNeedResize: false,//是否需要调整列宽
            isResizeAdapt: true,//是否需要在调整列宽或区域宽度的时候它们自适应变化

            isNeedFreeze: false,//是否需要冻结单元格
            freezeCols: [], //冻结的列号,从0开始,isNeedFreeze为tree时生效

            isNeedMerge: true,//是否需要合并单元格
            mergeCols: [],
            mergeRule: BI.emptyFn,

            columnSize: [],
            minColumnSize: [],
            maxColumnSize: [],

            headerRowSize: 25,
            rowSize: 25,

            regionColumnSize: [],

            rowHeaderCreator: null,

            headerCellStyleGetter: BI.emptyFn,
            summaryCellStyleGetter: BI.emptyFn,
            sequenceCellStyleGetter: BI.emptyFn,

            header: [],
            items: [],

            //交叉表头
            crossHeader: [],
            crossItems: []
        })
    },

    _getVDeep: function () {
        return this.options.crossHeader.length;//纵向深度
    },

    _getHDeep: function () {
        var o = this.options;
        return Math.max(o.mergeCols.length, o.freezeCols.length, BI.TableTree.maxDeep(o.items) - 1);
    },

    _createHeader: function (vDeep) {
        var self = this, o = this.options;
        var header = o.header || [], crossHeader = o.crossHeader || [];
        var items = BI.TableTree.formatCrossItems(o.crossItems, vDeep, o.headerCellStyleGetter);
        var result = [];
        BI.each(items, function (row, node) {
            var c = [crossHeader[row]];
            result.push(c.concat(node || []));
        });
        if (header && header.length > 0) {
            var newHeader = this._formatColumns(header);
            var deep = this._getHDeep();
            if (deep <= 0) {
                newHeader.unshift(o.rowHeaderCreator || {
                        type: "bi.table_style_cell",
                        text: BI.i18nText("BI-Row_Header"),
                        styleGetter: o.headerCellStyleGetter
                    });
            } else {
                newHeader[0] = o.rowHeaderCreator || {
                        type: "bi.table_style_cell",
                        text: BI.i18nText("BI-Row_Header"),
                        styleGetter: o.headerCellStyleGetter
                    };
            }
            result.push(newHeader);
        }
        return result;
    },

    _formatItems: function (nodes) {
        var self = this, o = this.options;
        var result = [];

        function track(node, layer) {
            node.type || (node.type = "bi.layer_tree_table_cell");
            node.layer = layer;
            var next = [node];
            next = next.concat(node.values || []);
            if (next.length > 0) {
                result.push(next);
            }
            if (BI.isNotEmptyArray(node.children)) {
                BI.each(node.children, function (index, child) {
                    track(child, layer + 1);
                });
            }
        }

        BI.each(nodes, function (i, node) {
            BI.each(node.children, function (j, c) {
                track(c, 0);
            });
            if (BI.isArray(node.values)) {
                var next = [{
                    type: "bi.table_style_cell", text: BI.i18nText("BI-Summary_Values"), styleGetter: function () {
                        return o.summaryCellStyleGetter(true);
                    }
                }].concat(node.values);
                result.push(next)
            }
        });
        return result;
    },

    _formatColumns: function (columns, deep) {
        if (BI.isNotEmptyArray(columns)) {
            deep = deep || this._getHDeep();
            return columns.slice(Math.max(0, deep - 1));
        }
        return columns;
    },

    _formatFreezeCols: function () {
        if (this.options.freezeCols.length > 0) {
            return [0];
        }
        return [];
    },

    _formatColumnSize: function (columnSize, deep) {
        if (columnSize.length <= 0) {
            return [];
        }
        var result = [0];
        deep = deep || this._getHDeep();
        BI.each(columnSize, function (i, size) {
            if (i < deep) {
                result[0] += size;
                return;
            }
            result.push(size);
        });
        return result;
    },

    _digest: function () {
        var o = this.options;
        var deep = this._getHDeep();
        var vDeep = this._getVDeep();
        return {
            header: this._createHeader(vDeep),
            items: this._formatItems(o.items),
            columnSize: this._formatColumnSize(o.columnSize, deep),
            minColumnSize: this._formatColumns(o.minColumnSize, deep),
            maxColumnSize: this._formatColumns(o.maxColumnSize, deep),
            freezeCols: this._formatFreezeCols()
        }
    },

    _init: function () {
        BI.LayerTreeTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        var data = this._digest();
        this.table = BI.createWidget(o.el, {
            type: "bi.resizable_table",
            element: this,
            width: o.width,
            height: o.height,
            isNeedResize: o.isNeedResize,
            isResizeAdapt: o.isResizeAdapt,
            isNeedFreeze: o.isNeedFreeze,
            freezeCols: data.freezeCols,
            isNeedMerge: o.isNeedMerge,
            mergeCols: [],
            mergeRule: o.mergeRule,
            columnSize: data.columnSize,
            minColumnSize: data.minColumnSize,
            maxColumnSize: data.maxColumnSize,
            headerRowSize: o.headerRowSize,
            rowSize: o.rowSize,
            regionColumnSize: o.regionColumnSize,
            header: data.header,
            items: data.items
        });
        this.table.on(BI.Table.EVENT_TABLE_SCROLL, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, function () {
            o.regionColumnSize = this.getRegionColumnSize();
            o.columnSize = this.getColumnSize();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, function () {
            o.regionColumnSize = this.getRegionColumnSize();
            o.columnSize = this.getColumnSize();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, arguments);
        });
    },

    setWidth: function (width) {
        BI.LayerTreeTable.superclass.setWidth.apply(this, arguments);
        this.table.setWidth(width);
    },

    setHeight: function (height) {
        BI.LayerTreeTable.superclass.setHeight.apply(this, arguments);
        this.table.setHeight(height);
    },

    setColumnSize: function (columnSize) {
        this.options.columnSize = columnSize;
    },

    getColumnSize: function () {
        var columnSize = this.table.getColumnSize();
        var deep = this._getHDeep();
        var pre = [];
        if (deep > 0) {
            pre = BI.makeArray(deep, columnSize[0] / deep);
        }
        return pre.concat(columnSize.slice(1));
    },

    setRegionColumnSize: function (columnSize) {
        this.options.regionColumnSize = columnSize;
        this.table.setRegionColumnSize(columnSize);
    },

    getRegionColumnSize: function () {
        return this.table.getRegionColumnSize();
    },

    setVerticalScroll: function (scrollTop) {
        this.table.setVerticalScroll(scrollTop);
    },

    setLeftHorizontalScroll: function (scrollLeft) {
        this.table.setLeftHorizontalScroll(scrollLeft);
    },

    setRightHorizontalScroll: function (scrollLeft) {
        this.table.setRightHorizontalScroll(scrollLeft);
    },

    getVerticalScroll: function () {
        return this.table.getVerticalScroll();
    },

    getLeftHorizontalScroll: function () {
        return this.table.getLeftHorizontalScroll();
    },

    getRightHorizontalScroll: function () {
        return this.table.getRightHorizontalScroll();
    },

    attr: function (key, value) {
        var self = this;
        if (BI.isObject(key)) {
            BI.each(key, function (k, v) {
                self.attr(k, v);
            });
            return;
        }
        BI.LayerTreeTable.superclass.attr.apply(this, arguments);
        switch (key) {
            case "columnSize":
            case "minColumnSize":
            case "maxColumnSize":
            case "freezeCols":
            case "mergeCols":
                return;
        }
        this.table.attr.apply(this.table, [key, value]);
    },

    restore: function () {
        this.table.restore();
    },

    populate: function (items, header, crossItems, crossHeader) {
        var o = this.options;
        o.items = items || [];
        if (header) {
            o.header = header;
        }
        if (crossItems) {
            o.crossItems = crossItems;
        }
        if (crossHeader) {
            o.crossHeader = crossHeader;
        }
        var data = this._digest();
        this.table.setColumnSize(data.columnSize);
        this.table.attr("freezeCols", data.freezeCols);
        this.table.attr("minColumnSize", data.minColumnSize);
        this.table.attr("maxColumnSize", data.maxColumnSize);
        this.table.populate(data.items, data.header);
    },

    destroy: function () {
        this.table.destroy();
        BI.LayerTreeTable.superclass.destroy.apply(this, arguments);
    }
});

BI.shortcut("bi.layer_tree_table", BI.LayerTreeTable);/**
 *
 * Created by GUY on 2016/5/26.
 * @class BI.TableStyleCell
 * @extends BI.Single
 */
BI.TableStyleCell = BI.inherit(BI.Single, {

    _defaultConfig: function () {
        return BI.extend(BI.TableStyleCell.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-table-style-cell",
            styleGetter: BI.emptyFn
        });
    },

    _init: function () {
        BI.TableStyleCell.superclass._init.apply(this, arguments);
        var o = this.options;
        this.text = BI.createWidget({
            type: "bi.label",
            element: this,
            textAlign: "left",
            forceCenter: true,
            hgap: 5,
            text: o.text
        });
        this._digestStyle();
    },

    _digestStyle: function () {
        var o = this.options;
        var style = o.styleGetter();
        if (style) {
            this.text.element.css(style);
        }
    },

    setText: function (text) {
        this.text.setText(text);
    },

    populate: function () {
        this._digestStyle();
    }
});
BI.shortcut('bi.table_style_cell', BI.TableStyleCell);/**
 *
 * 树状结构的表格
 *
 * Created by GUY on 2015/9/22.
 * @class BI.TableTree
 * @extends BI.Widget
 */
BI.TableTree = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.TableTree.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-table-tree",
            el: {
                type: "bi.resizable_table"
            },
            isNeedResize: true,//是否需要调整列宽
            isResizeAdapt: true,//是否需要在调整列宽或区域宽度的时候它们自适应变化

            freezeCols: [], //冻结的列号,从0开始,isNeedFreeze为tree时生效

            isNeedMerge: true,//是否需要合并单元格
            mergeCols: [],
            mergeRule: BI.emptyFn,

            columnSize: [],
            minColumnSize: [],
            maxColumnSize: [],
            headerRowSize: 25,
            rowSize: 25,

            regionColumnSize: [],

            headerCellStyleGetter: BI.emptyFn,
            summaryCellStyleGetter: BI.emptyFn,
            sequenceCellStyleGetter: BI.emptyFn,

            header: [],
            items: [],

            //交叉表头
            crossHeader: [],
            crossItems: []
        })
    },

    _getVDeep: function () {
        return this.options.crossHeader.length;//纵向深度
    },

    _getHDeep: function () {
        var o = this.options;
        return Math.max(o.mergeCols.length, o.freezeCols.length, BI.TableTree.maxDeep(o.items) - 1);
    },

    _init: function () {
        BI.TableTree.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var data = this._digest();
        this.table = BI.createWidget(o.el, {
            type: "bi.resizable_table",
            element: this,
            width: o.width,
            height: o.height,
            isNeedResize: o.isNeedResize,
            isResizeAdapt: o.isResizeAdapt,

            isNeedFreeze: o.isNeedFreeze,
            freezeCols: o.freezeCols,
            isNeedMerge: o.isNeedMerge,
            mergeCols: o.mergeCols,
            mergeRule: o.mergeRule,

            columnSize: o.columnSize,
            minColumnSize: o.minColumnSize,
            maxColumnSize: o.maxColumnSize,

            headerRowSize: o.headerRowSize,
            rowSize: o.rowSize,

            regionColumnSize: o.regionColumnSize,

            header: data.header,
            items: data.items
        });
        this.table.on(BI.Table.EVENT_TABLE_SCROLL, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, function () {
            o.regionColumnSize = this.getRegionColumnSize();
            o.columnSize = this.getColumnSize();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, function () {
            o.regionColumnSize = this.getRegionColumnSize();
            o.columnSize = this.getColumnSize();
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, arguments);
        });
    },

    _digest: function () {
        var self = this, o = this.options;
        var deep = this._getHDeep();
        var vDeep = this._getVDeep();
        var header = BI.TableTree.formatHeader(o.header, o.crossHeader, o.crossItems, deep, vDeep, o.headerCellStyleGetter);
        var items = BI.TableTree.formatItems(o.items, deep, false, o.summaryCellStyleGetter);
        return {
            header: header,
            items: items
        }
    },

    setWidth: function (width) {
        BI.TableTree.superclass.setWidth.apply(this, arguments);
        this.table.setWidth(width);
    },

    setHeight: function (height) {
        BI.TableTree.superclass.setHeight.apply(this, arguments);
        this.table.setHeight(height);
    },

    setColumnSize: function (columnSize) {
        this.options.columnSize = columnSize;
        this.table.setColumnSize(columnSize);
    },

    getColumnSize: function () {
        return this.table.getColumnSize();
    },

    setRegionColumnSize: function (columnSize) {
        this.options.regionColumnSize = columnSize;
        this.table.setRegionColumnSize(columnSize);
    },

    getRegionColumnSize: function () {
        return this.table.getRegionColumnSize();
    },

    setVerticalScroll: function (scrollTop) {
        this.table.setVerticalScroll(scrollTop);
    },

    setLeftHorizontalScroll: function (scrollLeft) {
        this.table.setLeftHorizontalScroll(scrollLeft);
    },

    setRightHorizontalScroll: function (scrollLeft) {
        this.table.setRightHorizontalScroll(scrollLeft);
    },

    getVerticalScroll: function () {
        return this.table.getVerticalScroll();
    },

    getLeftHorizontalScroll: function () {
        return this.table.getLeftHorizontalScroll();
    },

    getRightHorizontalScroll: function () {
        return this.table.getRightHorizontalScroll();
    },

    attr: function () {
        BI.TableTree.superclass.attr.apply(this, arguments);
        this.table.attr.apply(this.table, arguments);
    },

    restore: function () {
        this.table.restore();
    },

    populate: function (items, header, crossItems, crossHeader) {
        var o = this.options;
        if (items) {
            o.items = items || [];
        }
        if (header) {
            o.header = header;
        }
        if (crossItems) {
            o.crossItems = crossItems;
        }
        if (crossHeader) {
            o.crossHeader = crossHeader;
        }
        var data = this._digest();
        this.table.populate(data.items, data.header);
    },

    destroy: function () {
        this.table.destroy();
        BI.TableTree.superclass.destroy.apply(this, arguments);
    }
});

BI.extend(BI.TableTree, {
    formatHeader: function (header, crossHeader, crossItems, hDeep, vDeep, styleGetter) {
        var items = BI.TableTree.formatCrossItems(crossItems, vDeep, styleGetter);
        var result = [];
        for (var i = 0; i < vDeep; i++) {
            var c = [];
            for (var j = 0; j < hDeep; j++) {
                c.push(crossHeader[i]);
            }
            result.push(c.concat(items[i] || []));
        }
        if (header && header.length > 0) {
            result.push(header);
        }
        return result;
    },

    formatItems: function (nodes, deep, isCross, styleGetter) {
        var self = this;
        var result = [];

        function track(store, node) {
            var next;
            if (BI.isArray(node.children)) {
                BI.each(node.children, function (index, child) {
                    var next;
                    if (store != -1) {
                        next = store.slice();
                        next.push(node);
                    } else {
                        next = [];
                    }
                    track(next, child);
                });
                if (store != -1) {
                    next = store.slice();
                    next.push(node);
                } else {
                    next = [];
                }
                if (/**(store == -1 || node.children.length > 1) &&**/ BI.isNotEmptyArray(node.values)) {
                    var summary = {
                        text: BI.i18nText("BI-Summary_Values"),
                        type: "bi.table_style_cell",
                        styleGetter: function () {
                            return styleGetter(store === -1)
                        }
                    };
                    for (var i = next.length; i < deep; i++) {
                        next.push(summary);
                    }
                    if (!isCross) {
                        next = next.concat(node.values);
                    }
                    if (next.length > 0) {
                        if (!isCross) {
                            result.push(next);
                        } else {
                            for (var k = 0, l = node.values.length; k < l; k++) {
                                result.push(next);
                            }
                        }
                    }
                }

                return;
            }
            if (store != -1) {
                next = store.slice();
                for (var i = next.length; i < deep; i++) {
                    next.push(node);
                }
            } else {
                next = [];
            }
            if (!isCross && BI.isArray(node.values)) {
                next = next.concat(node.values);
            }
            if (isCross && BI.isArray(node.values)) {
                for (var i = 0, len = node.values.length; i < len - 1; i++) {
                    if (next.length > 0) {
                        result.push(next);
                    }
                }
            }
            if (next.length > 0) {
                result.push(next);
            }
        }

        BI.each(nodes, function (i, node) {
            track(-1, node);
        });
        //填充空位
        BI.each(result, function (i, line) {
            var last = BI.last(line);
            for (var j = line.length; j < deep; j++) {
                line.push(last);
            }
        });
        return result;
    },

    formatCrossItems: function (nodes, deep, styleGetter) {
        var items = BI.TableTree.formatItems(nodes, deep, true, styleGetter);
        return BI.unzip(items);
    },

    maxDeep: function (nodes) {
        function track(deep, node) {
            var d = deep;
            if (BI.isNotEmptyArray(node.children)) {
                BI.each(node.children, function (index, child) {
                    d = Math.max(d, track(deep + 1, child));
                });
            }
            return d;
        }

        var deep = 1;
        if (BI.isObject(nodes)) {
            BI.each(nodes, function (i, node) {
                deep = Math.max(deep, track(1, node));
            });
        }
        return deep;
    }
});

BI.shortcut("bi.tree_table", BI.TableTree);/**
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
            text: BI.i18nText('BI-Select_All'),
            isAllCheckedBySelectedValue: BI.emptyFn,
            //手动控制选中
            disableSelected: true,
            isHalfCheckedBySelectedValue: function (selectedValues) {
                return selectedValues.length > 0;
            }
        })
    },
    _init: function () {
        BI.MultiSelectBar.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.checkbox = BI.createWidget({
            type: "bi.checkbox",
            stopPropagation: true,
            handler: function () {
                self.setSelected(self.isSelected());
            }
        });
        this.half = BI.createWidget({
            type: "bi.half_icon_button",
            stopPropagation: true,
            handler: function () {
                self.setSelected(true);
            }
        });
        this.checkbox.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.CLICK, self.isSelected(), self);
        });
        this.half.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.CLICK, self.isSelected(), self);
        });
        this.half.on(BI.HalfIconButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.MultiSelectBar.EVENT_CHANGE, self.isSelected(), self);
        });
        this.checkbox.on(BI.Checkbox.EVENT_CHANGE, function () {
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
                width: 36,
                el: {
                    type: "bi.center_adapt",
                    items: [this.checkbox, this.half]
                }
            }, {
                el: this.text
            }]
        });
        this.half.invisible();
    },

    //自己手动控制选中
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
        this._half = !!b;
        if (b === true) {
            this.half.visible();
            this.checkbox.invisible();
        } else {
            this.half.invisible();
            this.checkbox.visible();
        }
    },

    isHalfSelected: function () {
        return !!this._half;
    },

    isSelected: function () {
        return this.checkbox.isSelected();
    },

    setValue: function (selectedValues) {
        BI.MultiSelectBar.superclass.setValue.apply(this, arguments);
        var isAllChecked = this.options.isAllCheckedBySelectedValue.apply(this, arguments);
        this.setSelected(isAllChecked);
        !isAllChecked && this.setHalfSelected(this.options.isHalfCheckedBySelectedValue.apply(this, arguments));
    }
});
BI.MultiSelectBar.EVENT_CHANGE = "MultiSelectBar.EVENT_CHANGE";
BI.shortcut("bi.multi_select_bar", BI.MultiSelectBar);/**
 * 倒立的Branch
 * @class BI.HandStandBranchExpander
 * @extend BI.Widget
 * create by young
 */
BI.HandStandBranchExpander = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.HandStandBranchExpander.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-handstand-branch-expander",
            direction: BI.Direction.Top,
            logic: {
                dynamic: true
            },
            el: {type: "bi.label"},
            popup: {}
        })
    },

    _init: function () {
        BI.HandStandBranchExpander.superclass._init.apply(this, arguments);
        var o = this.options;
        this._initExpander();
        this._initBranchView();
        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic(BI.LogicFactory.createLogicTypeByDirection(o.direction), BI.extend({}, o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection(o.direction, {
                type: "bi.center_adapt",
                items: [this.expander]
            }, this.branchView)
        }))));
    },

    _initExpander: function () {
        var self = this, o = this.options;
        this.expander = BI.createWidget(o.el);
        this.expander.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
    },

    _initBranchView: function () {
        var self = this, o = this.options;
        this.branchView = BI.createWidget(o.popup, {});
        this.branchView.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
    },

    populate: function (items) {
        this.branchView.populate.apply(this.branchView, arguments);
    },

    getValue: function () {
        return this.branchView.getValue();
    }
});
BI.HandStandBranchExpander.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.handstand_branch_expander", BI.HandStandBranchExpander);/**
 * @class BI.BranchExpander
 * @extend BI.Widget
 * create by young
 */
BI.BranchExpander = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.BranchExpander.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-branch-expander",
            direction: BI.Direction.Left,
            logic: {
                dynamic: true
            },
            el: {},
            popup: {}
        })
    },

    _init: function () {
        BI.BranchExpander.superclass._init.apply(this, arguments);
        var o = this.options;
        this._initExpander();
        this._initBranchView();
        BI.createWidget(BI.extend({
            element: this
        }, BI.LogicFactory.createLogic(BI.LogicFactory.createLogicTypeByDirection(o.direction), BI.extend({}, o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection(o.direction, this.expander, this.branchView)
        }))));
    },

    _initExpander: function () {
        var self = this, o = this.options;
        this.expander = BI.createWidget(o.el, {
            type: "bi.label",
            width: 30,
            height: "100%"
        });
        this.expander.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
    },

    _initBranchView: function () {
        var self = this, o = this.options;
        this.branchView = BI.createWidget(o.popup, {});
        this.branchView.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
    },

    populate: function (items) {
        this.branchView.populate.apply(this.branchView, arguments);
    },

    getValue: function () {
        return this.branchView.getValue();
    }
});
BI.BranchExpander.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.branch_expander", BI.BranchExpander);/**
 * @class BI.HandStandBranchTree
 * @extends BI.Widget
 * create by young
 * 横向分支的树
 */
BI.HandStandBranchTree = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.HandStandBranchTree.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-handstand-branch-tree",
            expander: {},
            el: {},
            items: []
        })
    },
    _init: function () {
        BI.HandStandBranchTree.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.branchTree = BI.createWidget({
            type: "bi.custom_tree",
            element: this,
            expander: BI.extend({
                type: "bi.handstand_branch_expander",
                el: {},
                popup: {
                    type: "bi.custom_tree"
                }
            }, o.expander),
            el: BI.extend({
                type: "bi.button_tree",
                chooseType: BI.ButtonGroup.CHOOSE_TYPE_MULTI,
                layouts: [{
                    type: "bi.horizontal_adapt"
                }]
            }, o.el),
            items: this.options.items
        });
        this.branchTree.on(BI.CustomTree.EVENT_CHANGE, function(){
            self.fireEvent(BI.HandStandBranchTree.EVENT_CHANGE, arguments);
        });
        this.branchTree.on(BI.Controller.EVENT_CHANGE, function(){
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
    },

    populate: function () {
        this.branchTree.populate.apply(this.branchTree, arguments);
    },

    getValue: function () {
        return this.branchTree.getValue();
    }
});
BI.HandStandBranchTree.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.handstand_branch_tree", BI.HandStandBranchTree);/**
 * @class BI.BranchTree
 * @extends BI.Widget
 * create by young
 * 横向分支的树
 */
BI.BranchTree = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.BranchTree.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-branch-tree",
            expander: {},
            el: {},
            items: []
        })
    },
    _init: function () {
        BI.BranchTree.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.branchTree = BI.createWidget({
            type: "bi.custom_tree",
            element: this,
            expander: BI.extend({
                type: "bi.branch_expander",
                el: {},
                popup: {
                    type: "bi.custom_tree"
                }
            }, o.expander),
            el: BI.extend({
                type: "bi.button_tree",
                chooseType: BI.ButtonGroup.CHOOSE_TYPE_MULTI,
                layouts: [{
                    type: "bi.vertical"
                }]
            }, o.el),
            items: this.options.items
        });
        this.branchTree.on(BI.CustomTree.EVENT_CHANGE, function(){
            self.fireEvent(BI.BranchTree.EVENT_CHANGE, arguments);
        });
        this.branchTree.on(BI.Controller.EVENT_CHANGE, function(){
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
    },

    populate: function () {
        this.branchTree.populate.apply(this.branchTree, arguments);
    },

    getValue: function () {
        return this.branchTree.getValue();
    }
});
BI.BranchTree.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.branch_tree", BI.BranchTree);/**
 * guy
 * 异步树
 * @class BI.DisplayTree
 * @extends BI.TreeView
 */
BI.DisplayTree = BI.inherit(BI.TreeView, {
    _defaultConfig: function () {
        return BI.extend(BI.DisplayTree.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-display-tree"
        })
    },
    _init: function () {
        BI.DisplayTree.superclass._init.apply(this, arguments);
    },

    //配置属性
    _configSetting: function () {
        var setting = {
            view: {
                selectedMulti: false,
                dblClickExpand: false,
                showIcon: false,
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

        function beforeCollapse(treeId, treeNode) {
            return false;
        }

        return setting;
    },

    _dealWidthNodes: function (nodes) {
        nodes = BI.DisplayTree.superclass._dealWidthNodes.apply(this, arguments);
        var self = this, o = this.options;
        BI.each(nodes, function (i, node) {
            if (node.count > 0) {
                node.text = node.value + "(" + BI.i18nText("BI-Basic_Altogether") + node.count + BI.i18nText("BI-Basic_Count") + ")";
            } else {
                node.text = node.value;
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
            items: []
        })
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

    //构造树结构，
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

            el: BI.extend({
                type: "bi.button_tree",
                chooseType: 0,
                layouts: [{
                    type: "bi.vertical"
                }]
            }, o.el)
        });
        this.tree.on(BI.Controller.EVENT_CHANGE, function (type) {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.LevelTree.EVENT_CHANGE, arguments);
            }
        })
    },

    //生成树方法
    stroke: function (nodes) {
        this.tree.stroke.apply(this.tree, arguments);
    },

    populate: function (items) {
        items = this._formatItems(BI.Tree.transformToTreeFormat(items), 0);
        this.tree.populate(items);
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
        })
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
    },

    populate: function (items, keyword) {
        if (items) {
            this.options.items = items;
        }
        this.tree.stroke({
            keyword: keyword
        });
    },

    setValue: function (v) {
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

        this.tree.setValue(BI.makeObject(v.concat(selected)));
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
            })
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
                })
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
            height: 30,
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn,
            allowBlank: false,
            watermark: "",
            errorText: "",
            triggerWidth: 30
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
            type: 'bi.htape',
            items: [
                {
                    el: this.editor
                }, {
                    el: {
                        type: "bi.trigger_icon_button",
                        cls: "bi-border-left",
                        width: o.triggerWidth
                    },
                    width: o.triggerWidth
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
            height: 30
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
BI.shortcut('bi.icon_trigger', BI.IconTrigger);/**
 * 文字trigger
 *
 * Created by GUY on 2015/9/15.
 * @class BI.TextTrigger
 * @extends BI.Trigger
 */
BI.TextTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4,
        triggerWidth: 30
    },

    _defaultConfig: function () {
        var conf = BI.TextTrigger.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-text-trigger",
            height: 30
        });
    },

    _init: function () {
        BI.TextTrigger.superclass._init.apply(this, arguments);
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
            cls: "bi-border-left",
            width: c.triggerWidth
        });

        BI.createWidget({
            element: this,
            type: 'bi.htape',
            items: [
                {
                    el: this.text
                }, {
                    el: this.trigerButton,
                    width: c.triggerWidth
                }
            ]
        });
    },

    setValue: function (value) {
        this.text.setValue(value);
        this.text.setTitle(value);
    },

    setText: function (text) {
        this.text.setText(text);
        this.text.setTitle(text);
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
            baseCls: "bi-select-text-trigger bi-border",
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
            height: o.height
        });
        if (BI.isKey(o.text)) {
            this.setValue(o.text);
        }
    },

    setValue: function (vals) {
        var o = this.options;
        vals = BI.isArray(vals) ? vals : [vals];
        var result = [];
        var items = BI.Tree.transformToArrayFormat(this.options.items);
        BI.each(items, function (i, item) {
            if (BI.deepContains(vals, item.value) && !result.contains(item.text || item.value)) {
                result.push(item.text || item.value);
            }
        });

        if (result.length > 0) {
            this.trigger.setText(result.join(","));
        } else {
            this.trigger.setText(o.text);
        }
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
        this.trigger = BI.createWidget({
            type: "bi.small_text_trigger",
            element: this,
            height: o.height - 2
        });
        if (BI.isKey(o.text)) {
            this.setValue(o.text);
        }
    },

    setValue: function (vals) {
        var o = this.options;
        vals = BI.isArray(vals) ? vals : [vals];
        var result = [];
        var items = BI.Tree.transformToArrayFormat(this.options.items);
        BI.each(items, function (i, item) {
            if (BI.deepContains(vals, item.value) && !result.contains(item.text || item.value)) {
                result.push(item.text || item.value);
            }
        });

        if (result.length > 0) {
            this.trigger.element.removeClass("bi-water-mark");
            this.trigger.setText(result.join(","));
        } else {
            this.trigger.element.addClass("bi-water-mark");
            this.trigger.setText(o.text);
        }
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
        hgap: 4,
        triggerWidth: 20
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
            width: c.triggerWidth
        });

        BI.createWidget({
            element: this,
            type: 'bi.htape',
            items: [
                {
                    el: this.text
                }, {
                    el: this.trigerButton,
                    width: c.triggerWidth
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