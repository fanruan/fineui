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
            element: this.element,
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
    },

    setEnable: function (b) {
        BI.IconChangeButton.superclass.setEnable.apply(this, arguments);
        this.button.setEnable(b);
    }
});
BI.IconChangeButton.EVENT_CHANGE = "IconChangeButton.EVENT_CHANGE";
$.shortcut("bi.icon_change_button", BI.IconChangeButton);/**
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

$.shortcut("bi.half_icon_button", BI.HalfIconButton);/**
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
$.shortcut("bi.trigger_icon_button", BI.TriggerIconButton);/**
 * guy
 * 复选框item
 * @type {*|void|Object}
 */
BI.MultiSelectItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function() {
        return BI.extend(BI.MultiSelectItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-multi-select-item",
            height: 25,
            logic: {
                dynamic: false
            }
        })
    },
    _init : function() {
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
        this.checkbox.on(BI.Controller.EVENT_CHANGE, function(type){
            if(type ===  BI.Events.CLICK) {
                self.setSelected(self.isSelected());
            }
        });

        BI.createWidget(BI.extend({
            element: this.element
        }, BI.LogicFactory.createLogic("horizontal", BI.extend(o.logic, {
            items: BI.LogicFactory.createLogicItemsByDirection("left", {
                type: "bi.center_adapt",
                items: [this.checkbox],
                width: 36
            } ,this.text)
        }))));
    },

    doRedMark: function(){
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function(){
        this.text.unRedMark.apply(this.text, arguments);
    },

    doClick: function(){
        BI.MultiSelectItem.superclass.doClick.apply(this, arguments);
        this.checkbox.setSelected(this.isSelected());
    },

    setSelected: function(v){
        BI.MultiSelectItem.superclass.setSelected.apply(this, arguments);
        this.checkbox.setSelected(v);
    }
});

$.shortcut("bi.multi_select_item", BI.MultiSelectItem);/**
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
            element: this.element,
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

$.shortcut("bi.single_select_icon_text_item", BI.SingleSelectIconTextItem);/**
 * guy
 * 复选框item
 * @type {*|void|Object}
 */
BI.SingleSelectItem = BI.inherit(BI.BasicButton, {
    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectItem.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-single-select-item bi-list-item-active",
            hgap: 10,
            height: 25
        })
    },
    _init: function () {
        BI.SingleSelectItem.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.text = BI.createWidget({
            type: "bi.label",
            element: this.element,
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

$.shortcut("bi.single_select_item", BI.SingleSelectItem);/**
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
            element: this.element
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

$.shortcut("bi.single_select_radio_item", BI.SingleSelectRadioItem);/**
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

$.shortcut("bi.arrow_group_node", BI.ArrowNode);/**
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

$.shortcut("bi.first_plus_group_node", BI.FirstPlusGroupNode);/**
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

$.shortcut("bi.icon_arrow_node", BI.IconArrowNode);/**
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

$.shortcut("bi.last_plus_group_node", BI.LastPlusGroupNode);/**
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

$.shortcut("bi.mid_plus_group_node", BI.MidPlusGroupNode);BI.MultiLayerIconArrowNode = BI.inherit(BI.NodeButton, {
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
            logic: {
                dynamic: true
            },
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
            element: this.element,
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

$.shortcut("bi.multilayer_icon_arrow_node", BI.MultiLayerIconArrowNode);/**
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

$.shortcut("bi.plus_group_node", BI.PlusGroupNode);/**
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

$.shortcut("bi.triangle_group_node", BI.TriangleGroupNode);/**
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

$.shortcut("bi.first_tree_leaf_item", BI.FirstTreeLeafItem);BI.IconTreeLeafItem = BI.inherit(BI.BasicButton, {
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

$.shortcut("bi.icon_tree_leaf_item", BI.IconTreeLeafItem);/**
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

$.shortcut("bi.last_tree_leaf_item", BI.LastTreeLeafItem);/**
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

$.shortcut("bi.mid_tree_leaf_item", BI.MidTreeLeafItem);/**
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

$.shortcut("bi.multilayer_icon_tree_leaf_item", BI.MultiLayerIconTreeLeafItem);/**
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
            element: this.element,
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

$.shortcut("bi.tree_text_leaf_item", BI.TreeTextLeafItem);/**
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

        Date._MD[1] = Date.isLeap(log.ymd[0]) ? 29 : 28;

        De.setFullYear(log.ymd[0], log.ymd[1], 1);
        log.FDay = De.getDay();

        log.PDay = Date._MD[M === 0 ? 11 : M - 1] - log.FDay + 1;
        log.NDay = 1;

        var items = [];
        BI.each(BI.range(42), function (i) {
            var td = {}, YY = log.ymd[0], MM = log.ymd[1] + 1, DD;
            if (i < log.FDay) {
                td.lastMonth = true;
                DD = i + log.PDay;
                MM === 1 && (YY -= 1);
                MM = MM === 1 ? 12 : MM - 1;
            } else if (i >= log.FDay && i < log.FDay + Date._MD[log.ymd[1]]) {
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
            element: this.element

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
    }
});

$.shortcut("bi.calendar", BI.Calendar);/**
 * Created by GUY on 2015/8/28.
 * @class BI.YearCalendar
 * @extends BI.Widget
 */
BI.YearCalendar = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        var conf = BI.YearCalendar.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-year-calendar",
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
            element: this.element

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

$.shortcut("bi.year_calendar", BI.YearCalendar);/**
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
            element: this.element,
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

$.shortcut("bi.complex_canvas", BI.ComplexCanvas);/**
 * 图表控件
 * @class BI.CombineChart
 * @extends BI.Widget
 */
BI.CombineChart = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.CombineChart.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-combine-chart",
            items: [],
            xAxis: [{type: "category"}],
            yAxis: [{type: "value"}],
            types: [[], []],
            formatConfig: function(config){return config;}
        })
    },

    _init: function () {
        BI.CombineChart.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        //图可配置属性
        this.CombineChart = BI.createWidget({
            type: "bi.chart",
            element: this.element
        });
        this.CombineChart.on(BI.Chart.EVENT_CHANGE, function (obj) {
            self.fireEvent(BI.CombineChart.EVENT_CHANGE, obj);
        });

        if (BI.isNotEmptyArray(o.items)) {
            this.populate(o.items);
        }
    },

    _formatItems: function (items) {
        var result = [], self = this, o = this.options;
        var yAxisIndex = 0;
        BI.each(items, function (i, belongAxisItems) {
            var combineItems = BI.ChartCombineFormatItemFactory.combineItems(o.types[i], belongAxisItems);
            BI.each(combineItems, function (j, axisItems) {
                if (BI.isArray(axisItems)) {
                    result = BI.concat(result, axisItems);
                } else {
                    result.push(BI.extend(axisItems, {"yAxis": yAxisIndex}));
                }
            });
            if (BI.isNotEmptyArray(combineItems)) {
                yAxisIndex++;
            }
        });
        var config = BI.ChartCombineFormatItemFactory.combineConfig();
        config.plotOptions.click = function () {
            self.fireEvent(BI.CombineChart.EVENT_CHANGE, this.pointOption);
        };
        return [result, config];
    },

    setTypes: function (types) {
        this.options.types = types || [[]];
    },

    populate: function (items, types) {
        var o = this.options;
        if (BI.isNotNull(types)) {
            this.setTypes(types);
        }
        var opts = this._formatItems(items);
        BI.extend(opts[1], {
            xAxis: o.xAxis,
            yAxis: o.yAxis
        });
        var result = o.formatConfig(opts[1], opts[0]);
        this.CombineChart.populate(result[0], result[1]);
    },

    resize: function () {
        this.CombineChart.resize();
    },

    magnify: function(){
        this.CombineChart.magnify();
    }
});
BI.CombineChart.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut('bi.combine_chart', BI.CombineChart);BI.ChartCombineFormatItemFactory = {
    combineItems: function (types, items) {
        var calItems = BI.values(items);
        return BI.map(calItems, function (idx, item) {
            return BI.ChartCombineFormatItemFactory.formatItems(types[idx], item);
        });
    },

    formatItems: function (type, items) {
        var item = {};
        switch (type) {
            case BICst.WIDGET.BAR:
            case BICst.WIDGET.ACCUMULATE_BAR:
            case BICst.WIDGET.COMPARE_BAR:
                item = BI.extend({"type": "bar"}, items);
                break;
            case BICst.WIDGET.BUBBLE:
            case BICst.WIDGET.FORCE_BUBBLE:
                item = BI.extend({"type": "bubble"}, items);
                break;
            case BICst.WIDGET.SCATTER:
                item = BI.extend({"type": "scatter"}, items);
                break;
            case BICst.WIDGET.AXIS:
            case BICst.WIDGET.ACCUMULATE_AXIS:
            case BICst.WIDGET.PERCENT_ACCUMULATE_AXIS:
            case BICst.WIDGET.COMPARE_AXIS:
            case BICst.WIDGET.FALL_AXIS:
                item = BI.extend({"type": "column"}, items);
                break;
            case BICst.WIDGET.LINE:
                item = BI.extend({"type": "line"}, items);
                break;
            case BICst.WIDGET.AREA:
            case BICst.WIDGET.ACCUMULATE_AREA:
            case BICst.WIDGET.COMPARE_AREA:
            case BICst.WIDGET.RANGE_AREA:
            case BICst.WIDGET.PERCENT_ACCUMULATE_AREA:
                item = BI.extend({"type": "area"}, items);
                break;
            case BICst.WIDGET.DONUT:
                item = BI.extend({"type": "pie"}, items);
                break;
            case BICst.WIDGET.RADAR:
            case BICst.WIDGET.ACCUMULATE_RADAR:
                item = BI.extend({"type": "radar"}, items);
                break;
            case BICst.WIDGET.PIE:
                item = BI.extend({"type": "pie"}, items);
                break;
            case BICst.WIDGET.DASHBOARD:
                item = BI.extend({"type": "gauge"}, items);
                break;
            case BICst.WIDGET.MAP:
                item = BI.extend({"type": "areaMap"}, items);
                break;
            case BICst.WIDGET.GIS_MAP:
                item = BI.extend({"type": "pointMap"}, items);
                break;
            default:
                item = BI.extend({"type": "column"}, items);
                break;
        }
        return item;
    },

    combineConfig: function () {
        return {
            "plotOptions": {
                "rotatable": false,
                "startAngle": 0,
                "borderRadius": 0,
                "endAngle": 360,
                "innerRadius": "0.0%",

                "layout": "horizontal",
                "hinge": "rgb(101,107,109)",
                "dataLabels": {
                    "style": {fontFamily: "inherit", color: "#808080", fontSize: "12px"},
                    "formatter": {
                        "identifier": "${VALUE}",
                        "valueFormat": this._contentFormat2Decimal,
                        "seriesFormat": this._contentFormat,
                        "percentFormat": this._contentFormatPercentage,
                        "categoryFormat": this._contentFormat,
                        "XFormat": this._contentFormat2Decimal,
                        "YFormat": this._contentFormat2Decimal,
                        "sizeFormat": this._contentFormat2Decimal
                    },
                    "align": "outside",
                    "enabled": false
                },
                "percentageLabel": {
                    "formatter": {
                        "identifier": "${PERCENT}",
                        "valueFormat": this._contentFormat2Decimal,
                        "seriesFormat": this._contentFormat,
                        "percentFormat": this._contentFormatPercentage,
                        "categoryFormat": this._contentFormat
                    },
                    "style": {
                        "fontFamily": "Microsoft YaHei, Hiragino Sans GB W3", "color": "#808080", "fontSize": "12px"
                    },
                    "align": "bottom",
                    "enabled": true
                },
                "valueLabel": {
                    "formatter": {
                        "identifier": "${SERIES}${VALUE}",
                        "valueFormat": this._contentFormat2Decimal,
                        "seriesFormat": this._contentFormat,
                        "percentFormat": this._contentFormatPercentage,
                        "categoryFormat": this._contentFormat
                    },
                    "backgroundColor": "rgb(255,255,0)",
                    "style": {
                        "fontFamily": "Microsoft YaHei, Hiragino Sans GB W3", "color": "#808080", "fontSize": "12px"
                    },
                    "align": "inside",
                    "enabled": true
                },
                "hingeBackgroundColor": "rgb(220,242,249)",
                "seriesLabel": {
                    "formatter": {
                        "identifier": "${CATEGORY}",
                        "valueFormat": this._contentFormat2Decimal,
                        "seriesFormat": this._contentFormat,
                        "percentFormat": this._contentFormatPercentage,
                        "categoryFormat": this._contentFormat
                    },
                    "style": {
                        "fontFamily": "Microsoft YaHei, Hiragino Sans GB W3", "color": "#808080", "fontSize": "12px"
                    },
                    "align": "bottom",
                    "enabled": true
                },
                "style": "pointer",
                "paneBackgroundColor": "rgb(252,252,252)",
                "needle": "rgb(229,113,90)",


                "large": false,
                "connectNulls": false,
                "shadow": true,
                "curve": false,
                "sizeBy": "area",
                "tooltip": {
                    "formatter": {
                        "identifier": "${SERIES}${X}${Y}${SIZE}{CATEGORY}${SERIES}${VALUE}",
                        "valueFormat": "function(){return window.FR ? FR.contentFormat(arguments[0], '#.##') : arguments[0];}",
                        "seriesFormat": this._contentFormat,
                        "percentFormat": this._contentFormatPercentage,
                        "categoryFormat": this._contentFormat,
                        "XFormat": this._contentFormat2Decimal,
                        "sizeFormat": this._contentFormat2Decimal,
                        "YFormat": this._contentFormat2Decimal
                    },
                    "shared": false,
                    "padding": 5,
                    "backgroundColor": "rgba(0,0,0,0.4980392156862745)",
                    "borderColor": "rgb(0,0,0)",
                    "shadow": false,
                    "borderRadius": 2,
                    "borderWidth": 0,
                    "follow": false,
                    "enabled": true,
                    "animation": true,
                    style: {
                        "fontFamily": "Microsoft YaHei, Hiragino Sans GB W3",
                        "color": "#c4c6c6",
                        "fontSize": "12px",
                        "fontWeight": ""
                    }
                },
                "maxSize": 80,
                "fillColorOpacity": 1.0,
                "step": false,
                "force": false,
                "minSize": 15,
                "displayNegative": true,
                "categoryGap": "16.0%",
                "borderColor": "rgb(255,255,255)",
                "borderWidth": 1,
                "gap": "22.0%",
                "animation": true,
                "lineWidth": 2,

                bubble: {
                    "large": false,
                    "connectNulls": false,
                    "shadow": true,
                    "curve": false,
                    "sizeBy": "area",
                    "maxSize": 80,
                    "minSize": 15,
                    "lineWidth": 0,
                    "animation": true,
                    "fillColorOpacity": 0.699999988079071,
                    "marker": {
                        "symbol": "circle",
                        "radius": 28.39695010101295,
                        "enabled": true
                    }
                }
            },
            dTools: {
                enabled: false,
                style: {
                    fontFamily: "Microsoft YaHei, Hiragino Sans GB W3",
                    color: "#1a1a1a",
                    fontSize: "12px"
                },
                backgroundColor: 'white'
            },
            dataSheet: {
                enabled: false,
                "borderColor": "rgb(0,0,0)",
                "borderWidth": 1,
                "formatter": this._contentFormat2Decimal,
                style: {
                    "fontFamily": "Microsoft YaHei, Hiragino Sans GB W3", "color": "#808080", "fontSize": "12px"
                }
            },
            "borderColor": "rgb(238,238,238)",
            "shadow": false,
            "legend": {
                "borderColor": "rgb(204,204,204)",
                "borderRadius": 0,
                "shadow": false,
                "borderWidth": 0,
                "visible": true,
                "style": {
                    "fontFamily": "Microsoft YaHei, Hiragino Sans GB W3", "color": "#1a1a1a", "fontSize": "12px"
                },
                "position": "right",
                "enabled": false
            },
            "rangeLegend": {
                "range": {
                    "min": 0,
                    "color": [
                        [
                            0,
                            "rgb(182,226,255)"
                        ],
                        [
                            0.5,
                            "rgb(109,196,255)"
                        ],
                        [
                            1,
                            "rgb(36,167,255)"
                        ]
                    ],
                    "max": 266393
                },
                "enabled": false
            },
            "zoom": {"zoomType": "xy", "zoomTool": {"visible": false, "resize": true, "from": "", "to": ""}},
            "plotBorderColor": "rgba(255,255,255,0)",
            "tools": {
                "hidden": true,
                "toImage": {"enabled": true},
                "sort": {"enabled": true},
                "enabled": false,
                "fullScreen": {"enabled": true}
            },
            "plotBorderWidth": 0,
            "colors": ["rgb(99,178,238)", "rgb(118,218,145)"],
            "borderRadius": 0,
            "borderWidth": 0,
            "style": "normal",
            "plotShadow": false,
            "plotBorderRadius": 0
        };
    },

    _contentFormat: function () {
        return BI.contentFormat(arguments[0], '')
    },

    _contentFormat2Decimal: function () {
        return BI.contentFormat(arguments[0], '#.##')
    },

    _contentFormatPercentage: function () {
        return BI.contentFormat(arguments[0], '#.##%')
    }
};/**
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
$.shortcut("bi.arrow_tree_group_node_checkbox",BI.ArrowTreeGroupNodeCheckbox);/**
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
$.shortcut("bi.checking_mark_node", BI.CheckingMarkNode);/**
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
$.shortcut("bi.first_tree_node_checkbox", BI.FirstTreeNodeCheckbox);/**
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
$.shortcut("bi.last_tree_node_checkbox", BI.LastTreeNodeCheckbox);/**
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
$.shortcut("bi.mid_tree_node_checkbox", BI.MidTreeNodeCheckbox);/**
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
$.shortcut("bi.tree_group_node_checkbox", BI.TreeGroupNodeCheckbox);/**
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
$.shortcut("bi.tree_node_checkbox", BI.TreeNodeCheckbox);/**
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
            baseCls: (conf.baseCls || "") + " bi-color-picker-button"
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
$.shortcut("bi.color_picker_button", BI.ColorPickerButton);/**
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
            value: "#ff0000"
        }, {
            value: "#ffff02"
        }, {
            value: "#00ff00"
        }, {
            value: "#00ffff"
        }, {
            value: "#0000ff"
        }, {
            value: "#ff02ff"
        }, {
            value: "#ffffff"
        }, {
            value: "#e6e6e6"
        }, {
            value: "#cccccc"
        }, {
            value: "#b3b3b3"
        }, {
            value: "#999999"
        }, {
            value: "#808080"
        }, {
            value: "#666666"
        }, {
            value: "#4d4d4d"
        }, {
            value: "#333333"
        }, {
            value: "#1a1a1a"
        }],
        [{
            value: "#ea9b5e"
        }, {
            value: "#ebb668"
        }, {
            value: "#efca69"
        }, {
            value: "#faf4a2"
        }, {
            value: "#c9da73"
        }, {
            value: "#b6d19c"
        }, {
            value: "#86be85"
        }, {
            value: "#87c5c3"
        }, {
            value: "#75bfec"
        }, {
            value: "#85a9e0"
        }, {
            value: "#8890d3"
        }, {
            value: "#a484b9"
        }, {
            value: "#b48bbf"
        }, {
            value: "#ba8dc6"
        }, {
            value: "#e697c8"
        }, {
            value: "#e49da0"
        }],
        [{
            value: "#df6a18"
        }, {
            value: "#df8d04"
        }, {
            value: "#efb500"
        }, {
            value: "#faf201"
        }, {
            value: "#b2cc23"
        }, {
            value: "#7dbd2f"
        }, {
            value: "#48a754"
        }, {
            value: "#27acaa"
        }, {
            value: "#09abe9"
        }, {
            value: "#357bcc"
        }, {
            value: "#4d67c1"
        }, {
            value: "#5b4aa5"
        }, {
            value: "#7e52a5"
        }, {
            value: "#a057a4"
        }, {
            value: "#d1689c"
        }, {
            value: "#d66871"
        }],
        [{
            value: "#d12d02"
        }, {
            value: "#db6700"
        }, {
            value: "#ee9106"
        }, {
            value: "#f7ed02"
        }, {
            value: "#92b801"
        }, {
            value: "#37a600"
        }, {
            value: "#289100"
        }, {
            value: "#1a9589"
        }, {
            value: "#0292e0"
        }, {
            value: "#005dbb"
        }, {
            value: "#005eb4"
        }, {
            value: "#0041a3"
        }, {
            value: "#00217f"
        }, {
            value: "#811e89"
        }, {
            value: "#cd2a7c"
        }, {
            value: "#cd324a"
        }]
    ],

    _init: function () {
        BI.ColorPicker.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.colors = BI.createWidget({
            type: "bi.button_group",
            element: this.element,
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
$.shortcut("bi.color_picker", BI.ColorPicker);/**
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
            width: 190,
            height: 20
        })
    },

    _init: function () {
        BI.ColorPickerEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.colorShow = BI.createWidget({
            type: "bi.layout",
            cls: "color-picker-editor-display",
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
            value: 255,
            width: 35,
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

        BI.createWidget({
            type: "bi.htape",
            element: this.element,
            items: [{
                el: this.colorShow,
                width: 'fill'
            }, {
                el: RGB[0],
                lgap: 10,
                width: 20
            }, {
                el: this.R,
                width: 35
            }, {
                el: RGB[1],
                lgap: 10,
                width: 20
            }, {
                el: this.G,
                width: 35
            }, {
                el: RGB[2],
                lgap: 10,
                width: 20
            }, {
                el: this.B,
                width: 35
            }]
        })
    },

    setValue: function (color) {
        color || (color = "#000000");
        this.colorShow.element.css("background-color", color);
        var json = BI.DOM.rgb2json(BI.DOM.hex2rgb(color));
        this.R.setValue(json.r);
        this.G.setValue(json.g);
        this.B.setValue(json.b);
    },

    getValue: function () {
        return BI.DOM.rgb2hex(BI.DOM.json2rgb({
            r: this.R.getValue(),
            g: this.G.getValue(),
            b: this.B.getValue()
        }))
    }
});
BI.ColorPickerEditor.EVENT_CHANGE = "ColorPickerEditor.EVENT_CHANGE";
$.shortcut("bi.color_picker_editor", BI.ColorPickerEditor);/**
 * guy
 * 记录内容的输入框
 * @class BI.RecordEditor
 * @extends BI.Single
 */
BI.RecordEditor = BI.inherit(BI.Single, {
    _defaultConfig: function() {
        var conf = BI.RecordEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf , {
            baseCls: (conf.baseCls || "") + " bi-record-editor",
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

    _init : function() {
        BI.RecordEditor.superclass._init.apply(this, arguments);
        this.contents = [];
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
            mouseOut: o.mouseOut,
            allowBlank : o.allowBlank,
            watermark: o.watermark,
            errorText: o.errorText
        });
        this.textContainer = BI.createWidget({
            type: "bi.vertical_adapt",
            hgap: 2,
            height: o.height
        });
        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_FOCUS, function(){
            self._checkInputState();
            self.fireEvent(BI.RecordEditor.EVENT_FOCUS, arguments);
        });
        this.editor.on(BI.Editor.EVENT_BLUR, function(){
            self._checkInputState();
            self.fireEvent(BI.RecordEditor.EVENT_BLUR, arguments);
        });
        this.editor.on(BI.Editor.EVENT_CLICK, function(){
            self.fireEvent(BI.RecordEditor.EVENT_CLICK, arguments);
        });
        this.editor.on(BI.Editor.EVENT_CHANGE, function(){
            self.fireEvent(BI.RecordEditor.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_KEY_DOWN, function(v){
            self.fireEvent(BI.RecordEditor.EVENT_KEY_DOWN, arguments);
        });

        this.editor.on(BI.Editor.EVENT_VALID, function(){
            self.fireEvent(BI.RecordEditor.EVENT_VALID, arguments);
        });
        this.editor.on(BI.Editor.EVENT_SPACE, function(){
            self.fireEvent(BI.RecordEditor.EVENT_SPACE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_CONFIRM, function(){
            self.setValue(self.getValue());
            self.editor.isValid() && self.editor.setValue("");
            self.fireEvent(BI.RecordEditor.EVENT_CONFIRM, arguments);
        });
        this.editor.on(BI.Editor.EVENT_START, function(){
            self.fireEvent(BI.RecordEditor.EVENT_START, arguments);
        });
        this.editor.on(BI.Editor.EVENT_PAUSE, function(){
            self.fireEvent(BI.RecordEditor.EVENT_PAUSE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_STOP, function(){
            self.fireEvent(BI.RecordEditor.EVENT_STOP, arguments);
        });
        this.editor.on(BI.Editor.EVENT_ENTER, function () {
            self.fireEvent(BI.RecordEditor.EVENT_ENTER, arguments);
        });
        this.editor.on(BI.Editor.EVENT_BACKSPACE, function(){
            self._checkInputState();
        });
        this.editor.on(BI.Editor.EVENT_REMOVE, function(){
            if(!BI.isEmpty(self.contents)){
                self.contents.pop().destroy();
                self.setValue(self.getValue());
                self._adjustInputWidth();
            }
        });
        this.editor.on(BI.Editor.EVENT_ERROR, function(){
            self.fireEvent(BI.RecordEditor.EVENT_ERROR, arguments);
        });
        this.editor.on(BI.Editor.EVENT_RESTRICT, function(){
            self.fireEvent(BI.RecordEditor.EVENT_RESTRICT, arguments);
        });
        this.editor.on(BI.Editor.EVENT_EMPTY, function(){
            self.fireEvent(BI.RecordEditor.EVENT_EMPTY, arguments);
        });
        BI.createWidget({
            type: "bi.inline",
            element: this.element,
            items: [this.textContainer, this.editor]
        });
        BI.Resizers.add(this.getName(), BI.bind(this._adjustInputWidth, this));
        this._adjustInputWidth();
    },

    _adjustInputWidth: function(){
        BI.nextTick(BI.bind(function(){
            this.editor.element.css("width", this.element.width() - this.textContainer.element.outerWidth() - 10);
        }, this));
    },

    _checkInputState: function(){
        if(BI.isEmpty(this.contents)){
            this.editor.enableWarterMark();
        } else {
            this.editor.disableWarterMark();
        }
    },

    focus: function(){
        this.editor.focus();
    },

    blur: function(){
        this.editor.blur();
    },

    isValid : function() {
        return this.editor.isValid();
    },

    setErrorText: function(text){
        this.editor.setErrorText(text);
    },

    getErrorText: function(){
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

    getState: function(){
        var values = BI.map(this.contents, function(i, lb){
            return lb.getText();
        });
        if(BI.isNotEmptyString(this.editor.getValue())){
            return values.concat([this.editor.getValue()]);
        }
        return values;
    },

    setState: function(v){
        BI.StateEditor.superclass.setValue.apply(this, arguments);
        v =  BI.isArray(v) ? v : (v == "" ? [] : [v]);
        var contents = this.contents = [];
        BI.each(v, function(i, lb){
            contents.push(BI.createWidget({
                type: "bi.label",
                height: 25,
                cls: "record-editor-text",
                text: lb
            }))
        });
        this.textContainer.empty();
        this.textContainer.populate(contents);
        this.editor.isValid() && this.editor.setValue("");
        this._checkInputState();
        this._adjustInputWidth();
    },

    destroy: function(){
        BI.Resizers.remove(this.getName());
        BI.RecordEditor.superclass.destroy.apply(this, arguments);
    }
});
BI.RecordEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.RecordEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.RecordEditor.EVENT_BLUR = "EVENT_BLUR";
BI.RecordEditor.EVENT_CLICK = "EVENT_CLICK";
BI.RecordEditor.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";

BI.RecordEditor.EVENT_START = "EVENT_START";
BI.RecordEditor.EVENT_PAUSE = "EVENT_PAUSE";
BI.RecordEditor.EVENT_STOP = "EVENT_STOP";
BI.RecordEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.RecordEditor.EVENT_VALID = "EVENT_VALID";
BI.RecordEditor.EVENT_ERROR = "EVENT_ERROR";
BI.RecordEditor.EVENT_ENTER = "EVENT_ENTER";
BI.RecordEditor.EVENT_RESTRICT = "EVENT_RESTRICT";
BI.RecordEditor.EVENT_SPACE = "EVENT_SPACE";
BI.RecordEditor.EVENT_EMPTY = "EVENT_EMPTY";

$.shortcut("bi.record_editor", BI.RecordEditor);/**
 * 带标记的文本框
 * Created by GUY on 2016/1/25.
 * @class BI.ShelterEditor
 * @extends BI.Single
 */
BI.ShelterEditor = BI.inherit(BI.Single, {
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
            mouseOut: false,
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
            mouseOut: o.mouseOut,
            allowBlank: o.allowBlank,
            watermark: o.watermark,
            errorText: o.errorText
        });
        this.text = BI.createWidget({
            type: "bi.text_button",
            cls: "shelter-editor-text",
            textAlign: o.textAlign,
            height: o.height,
            hgap: 4
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this.element,
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
            element: this.element,
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

$.shortcut("bi.shelter_editor", BI.ShelterEditor);/**
 * 带标记的文本框
 * Created by GUY on 2015/8/28.
 * @class BI.SignEditor
 * @extends BI.Single
 */
BI.SignEditor = BI.inherit(BI.Single, {
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
            mouseOut: false,
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
            mouseOut: o.mouseOut,
            allowBlank: o.allowBlank,
            watermark: o.watermark,
            errorText: o.errorText
        });
        this.text = BI.createWidget({
            type: "bi.text_button",
            cls: "sign-editor-text",
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
            element: this.element,
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
            element: this.element,
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

    setValid: function(v){
        BI.SignEditor.superclass.setValid.apply(this, arguments);
        this.editor.setValid(v);
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

$.shortcut("bi.sign_editor", BI.SignEditor);/**
 * guy
 * 记录状态的输入框
 * @class BI.StateEditor
 * @extends BI.Single
 */
BI.StateEditor = BI.inherit(BI.Single, {
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
            mouseOut: false,
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
            mouseOut: o.mouseOut,
            allowBlank: o.allowBlank,
            watermark: o.watermark,
            errorText: o.errorText
        });
        this.text = BI.createWidget({
            type: "bi.text_button",
            cls: "state-editor-infinite-text",
            textAlign: "left",
            height: o.height,
            text: BI.i18nText("BI-Unrestricted"),
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
            element: this.element,
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
            element: this.element,
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
        BI.StateEditor.superclass.setValue.apply(this, arguments);
        if (BI.isNumber(v)) {
            if (v === BI.Selection.All) {
                this.text.setText(BI.i18nText("BI-Select_All"));
                this.text.element.removeClass("state-editor-infinite-text");
            } else if (v === BI.Selection.Multi) {
                this.text.setText(BI.i18nText("BI-Select_Part"));
                this.text.element.removeClass("state-editor-infinite-text");
            } else {
                this.text.setText(BI.i18nText("BI-Unrestricted"));
                this.text.element.addClass("state-editor-infinite-text");
            }
            return;
        }
        if (!BI.isArray(v) || v.length === 1) {
            this.text.setText(v);
            this.text.setTitle(v);
            this.text.element.removeClass("state-editor-infinite-text");
        } else if (BI.isEmpty(v)) {
            this.text.setText(BI.i18nText("BI-Unrestricted"));
            this.text.element.addClass("state-editor-infinite-text");
        } else {
            this.text.setText(BI.i18nText("BI-Select_Part"));
            this.text.element.removeClass("state-editor-infinite-text");
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

$.shortcut("bi.state_editor", BI.StateEditor);/**
 * 无限制-已选择状态输入框
 * Created by GUY on 2016/5/18.
 * @class BI.SimpleStateEditor
 * @extends BI.Single
 */
BI.SimpleStateEditor = BI.inherit(BI.Single, {
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
            mouseOut: o.mouseOut,
            allowBlank: o.allowBlank,
            watermark: o.watermark,
            errorText: o.errorText
        });
        this.text = BI.createWidget({
            type: "bi.text_button",
            cls: "state-editor-infinite-text",
            textAlign: "left",
            height: o.height,
            text: BI.i18nText("BI-Unrestricted"),
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
            element: this.element,
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
            element: this.element,
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
                this.text.setText(BI.i18nText("BI-Aleady_Selected"));
                this.text.element.removeClass("state-editor-infinite-text");
            } else if (v === BI.Selection.Multi) {
                this.text.setText(BI.i18nText("BI-Aleady_Selected"));
                this.text.element.removeClass("state-editor-infinite-text");
            } else {
                this.text.setText(BI.i18nText("BI-Unrestricted"));
                this.text.element.addClass("state-editor-infinite-text");
            }
            return;
        }
        if (!BI.isArray(v) || v.length === 1) {
            this.text.setText(v);
            this.text.setTitle(v);
            this.text.element.removeClass("state-editor-infinite-text");
        } else if (BI.isEmpty(v)) {
            this.text.setText(BI.i18nText("BI-Unrestricted"));
            this.text.element.addClass("state-editor-infinite-text");
        } else {
            this.text.setText(BI.i18nText("BI-Aleady_Selected"));
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

$.shortcut("bi.simple_state_editor", BI.SimpleStateEditor);/**
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
            element: this.element
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
$.shortcut("bi.handstand_branch_expander", BI.HandStandBranchExpander);/**
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
            element: this.element
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
$.shortcut("bi.branch_expander", BI.BranchExpander);/**
 * 有确定取消按钮的弹出层
 * @class BI.BarFloatSection
 * @extends BI.FloatSection
 * @abstract
 */
BI.BarFloatSection = BI.inherit(BI.FloatSection, {
    _defaultConfig: function () {
        return BI.extend(BI.BarFloatSection.superclass._defaultConfig.apply(this, arguments), {
            btns: [BI.i18nText(BI.i18nText("BI-Sure")), BI.i18nText("BI-Cancel")]
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
            btns: [BI.i18nText(BI.i18nText("BI-Sure")), BI.i18nText(BI.i18nText("BI-Cancel"))]
        })
    },

    _init: function () {
        BI.BarPopoverSection.superclass._init.apply(this, arguments);
    },

    rebuildSouth: function (south) {
        var self = this;
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
            buttons: [BI.i18nText("BI-Sure")]
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
            cls: "list-view-toolbar",
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

$.shortcut("bi.multi_popup_view", BI.MultiPopupView);/**
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
            cls: "popup-panel-title",
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

$.shortcut("bi.popup_panel", BI.PopupPanel);/**
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
            element: this.element
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

    doBehavior: function () {
        this.button_group.doBehavior.apply(this.button_group, arguments);
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
$.shortcut("bi.list_pane", BI.ListPane);/**
 * 带有标题栏的pane
 * @class BI.Panel
 * @extends BI.Widget
 */
BI.Panel = BI.inherit(BI.Widget,{
    _defaultConfig : function(){
        return BI.extend(BI.Panel.superclass._defaultConfig.apply(this,arguments),{
            baseCls: "bi-panel",
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
            element: this.element
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
                cls: "panel-title",
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

$.shortcut("bi.panel",BI.Panel);/**
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
            element: this.element
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

    resetHeight: function (h) {
        var toolHeight = ( this.toolbar.element.outerHeight() || 25) * ( this.toolbar.isVisible() ? 1 : 0);
        this.list.resetHeight ? this.list.resetHeight(h - toolHeight) :
            this.list.element.css({"max-height": h - toolHeight + "px"})
    },

    doBehavior: function () {
        this.list.doBehavior.apply(this.list, arguments);
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
$.shortcut("bi.select_list", BI.SelectList);/**
 * Created by roy on 15/11/6.
 */
BI.LazyLoader = BI.inherit(BI.Widget, {
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
            element: this.element,
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
        var lastNum = o.items.length - BICst.PAGE_COUNT * (options.times - 1);
        var lastItems = BI.last(o.items, lastNum);
        var nextItems = BI.first(lastItems, BICst.PAGE_COUNT);
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

    doBehavior: function () {
        this.loader.doBehavior();
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
$.shortcut("bi.lazy_loader", BI.LazyLoader);/**
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
            element: this.element,
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
            element: this.element,
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

    doBehavior: function () {
        this.button_group.doBehavior.apply(this.button_group, arguments);
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
$.shortcut("bi.list_loader", BI.ListLoader);/**
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
            element: this.element,
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
            cursor: "drag",
            tolerance: "intersect",
            placeholder: {
                element: function ($currentItem) {
                    var holder = BI.createWidget({
                        type: "bi.label",
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
        this.loader.populate.apply(this.loader, arguments);
    },

    empty: function () {
        this.loader.empty();
    },

    doBehavior: function () {
        this.loader.doBehavior.apply(this.loader, arguments);
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
$.shortcut("bi.sort_list", BI.SortList);/**
 * 有总页数的分页控件
 *
 * Created by GUY on 2015/9/8.
 * @class BI.AllPagger
 * @extends BI.Widget
 */
BI.AllPagger = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.AllPagger.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-all-pager",
            width: 96,
            height: 25,
            pages: 1, //必选项
            curr: 1 //初始化当前页， pages为数字时可用
        })
    },
    _init: function () {
        BI.AllPagger.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: "bi.small_text_editor",
            cls: "pager-editor",
            validationChecker: function (v) {
                return BI.isPositiveInteger(v);
            },
            hgap: 4,
            vgap: 0,
            value: o.curr,
            errorText: BI.i18nText("BI-Please_Input_Integer"),
            width: 30,
            height: o.height - 2
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
                height: o.height - 2,
                cls: "all-pager-prev column-pre-page-h-font"
            },
            next: {
                type: "bi.icon_button",
                value: "next",
                title: BI.i18nText("BI-Next_Page"),
                warningTitle: BI.i18nText("BI-Current_Is_Last_Page"),
                height: o.height - 2,
                cls: "all-pager-next column-next-page-h-font"
            },

            hasPrev: o.hasPrev,
            hasNext: o.hasNext,
            firstPage: o.firstPage,
            lastPage: o.lastPage
        });

        this.editor.on(BI.TextEditor.EVENT_CONFIRM, function () {
            self.pager.setValue(BI.parseInt(self.editor.getValue()));
            self.fireEvent(BI.AllPagger.EVENT_CHANGE);
        });
        this.pager.on(BI.Pager.EVENT_CHANGE, function () {
            self.fireEvent(BI.AllPagger.EVENT_CHANGE);
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

        BI.createWidget({
            type: "bi.center_adapt",
            element: this.element,
            columnSize: [30, "", 36],
            items: [this.editor, this.allPages, this.pager]
        })
    },

    setAllPages: function (v) {
        this.allPages.setText("/" + v);
        this.allPages.setTitle(v);
        this.pager.setAllPages(v);
    },

    setValue: function (v) {
        this.pager.setValue(v);
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

    populate: function () {
        this.pager.populate();
    }
});
BI.AllPagger.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.all_pager", BI.AllPagger);/**
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
            width: 108,
            height: 25,
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
        BI.createWidget({
            type: "bi.absolute",
            scrollable: false,
            element: this.element,
            items: [{
                el: this.vpager,
                top: 0,
                left: -19
            }, {
                el: this.vlabel,
                top: 0,
                left: 16
            }, {
                el: this.hpager,
                top: 0,
                right: -19
            }, {
                el: this.hlabel,
                top: 0,
                right: 16
            }]
        });
    },

    _createVPager: function () {
        var self = this, o = this.options;
        var v = o.vertical;
        this.vlabel = BI.createWidget({
            type: "bi.label",
            width: 20,
            height: o.height,
            value: v.curr,
            title: v.curr
        });
        this.vpager = BI.createWidget({
            type: "bi.pager",
            width: 72,
            layouts: [{
                type: "bi.horizontal",
                lgap: 20,
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
                height: o.height - 2,
                iconWidth: o.height - 2,
                iconHeight: o.height - 2,
                cls: "direction-pager-prev column-pre-page-h-font"
            },
            next: {
                type: "bi.icon_button",
                value: "next",
                title: BI.i18nText("BI-Down_Page"),
                warningTitle: BI.i18nText("BI-Current_Is_Last_Page"),
                height: o.height - 2,
                iconWidth: o.height - 2,
                iconHeight: o.height - 2,
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
        });
    },

    _createHPager: function () {
        var self = this, o = this.options;
        var h = o.horizontal;
        this.hlabel = BI.createWidget({
            type: "bi.label",
            width: 20,
            height: o.height,
            value: h.curr,
            title: h.curr
        });
        this.hpager = BI.createWidget({
            type: "bi.pager",
            width: 72,
            layouts: [{
                type: "bi.horizontal",
                rgap: 20,
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
                height: o.height - 2,
                iconWidth: o.height - 2,
                iconHeight: o.height - 2,
                cls: "direction-pager-prev row-pre-page-h-font"
            },
            next: {
                type: "bi.icon_button",
                value: "next",
                title: BI.i18nText("BI-Right_Page"),
                warningTitle: BI.i18nText("BI-Current_Is_Last_Page"),
                height: o.height - 2,
                iconWidth: o.height - 2,
                iconHeight: o.height - 2,
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
    },
    
    refresh: function () {
        this.vpager.refresh();
        this.hpager.refresh();
    }
});
BI.DirectionPager.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.direction_pager", BI.DirectionPager);/**
 * 显示页码的分页控件
 *
 * Created by GUY on 2016/2/17.
 * @class BI.NumberPager
 * @extends BI.Widget
 */
BI.NumberPager = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.NumberPager.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-number-pager",
            width: 95,
            height: 25,
            pages: false, //总页数
            curr: 1, //初始化当前页， pages为数字时可用

            hasPrev: BI.emptyFn,
            hasNext: BI.emptyFn,
            firstPage: 1,
            lastPage: BI.emptyFn
        })
    },
    _init: function () {
        BI.NumberPager.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.currentPage = o.curr;
        this.label = BI.createWidget({
            type: "bi.label",
            height: o.height - 2,
            value: this.currentPage
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
                height: o.height - 2,
                iconWidth: o.height - 2,
                iconHeight: o.height - 2,
                cls: "number-pager-prev column-pre-page-h-font"
            },
            next: {
                type: "bi.icon_button",
                value: "next",
                title: BI.i18nText("BI-Next_Page"),
                warningTitle: BI.i18nText("BI-Current_Is_Last_Page"),
                height: o.height - 2,
                iconWidth: o.height - 2,
                iconHeight: o.height - 2,
                cls: "number-pager-next column-next-page-h-font"
            },

            hasPrev: o.hasPrev,
            hasNext: o.hasNext,
            firstPage: o.firstPage,
            lastPage: o.lastPage
        });

        this.pager.on(BI.Pager.EVENT_CHANGE, function () {
            if (self.getCurrentPage() !== self.pager.getCurrentPage()) {
                self.currentPage = self.pager.getCurrentPage();
                self.fireEvent(BI.NumberPager.EVENT_CHANGE);
            }
        });
        this.pager.on(BI.Pager.EVENT_AFTER_POPULATE, function () {
            self.label.setValue(self.pager.getCurrentPage());
        });

        BI.createWidget({
            type: "bi.center_adapt",
            element: this.element,
            columnSize: [20, "", 20, 36],
            items: [{type: "bi.label", text: "第"}, this.label, {type: "bi.label", text: "页"}, this.pager]
        })
    },

    getCurrentPage: function () {
        return this.currentPage;
    },

    hasPrev: function () {
        return this.pager.hasPrev();
    },

    hasNext: function () {
        return this.pager.hasNext();
    },

    setValue: function (v) {
        this.currentPage = v;
        this.pager.setValue(v);
    },

    populate: function () {
        this.pager.populate();
    }
});
BI.NumberPager.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.number_pager", BI.NumberPager);/**
 * 可以跳转的分页控件
 *
 * Created by GUY on 2015/9/8.
 * @class BI.SkipPager
 * @extends BI.Widget
 */
BI.SkipPager = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SkipPager.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-skip-pager",
            width: 110,
            height: 25,
            pages: false, //总页数
            curr: 1, //初始化当前页， pages为数字时可用

            hasPrev: BI.emptyFn,
            hasNext: BI.emptyFn,
            firstPage: 1,
            lastPage: BI.emptyFn
        })
    },
    _init: function () {
        BI.SkipPager.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.currentPage = o.curr;
        this.editor = BI.createWidget({
            type: "bi.small_text_editor",
            validationChecker: function (v) {
                return BI.isPositiveInteger(v);
            },
            hgap: 4,
            vgap: 0,
            value: o.curr,
            errorText: BI.i18nText("BI-Please_Input_Integer"),
            width: 30,
            height: o.height - 2
        });
        this.pager = BI.createWidget({
            type: "bi.pager",
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
                height: o.height - 2,
                cls: "number-pager-prev column-pre-page-h-font"
            },
            next: {
                type: "bi.icon_button",
                value: "next",
                title: BI.i18nText("BI-Next_Page"),
                warningTitle: BI.i18nText("BI-Current_Is_Last_Page"),
                height: o.height - 2,
                cls: "number-pager-next column-next-page-h-font"
            },

            hasPrev: o.hasPrev,
            hasNext: o.hasNext,
            firstPage: o.firstPage,
            lastPage: o.lastPage
        });

        this.editor.on(BI.TextEditor.EVENT_CONFIRM, function () {
            self.pager.setValue(self.editor.getValue());
        });
        this.pager.on(BI.Pager.EVENT_CHANGE, function () {
            if (self.getCurrentPage() !== self.pager.getCurrentPage()) {
                self.currentPage = self.pager.getCurrentPage();
                self.fireEvent(BI.SkipPager.EVENT_CHANGE);
            }
        });
        this.pager.on(BI.Pager.EVENT_AFTER_POPULATE, function () {
            self.editor.setValue(self.pager.getCurrentPage());
        });

        BI.createWidget({
            type: "bi.center_adapt",
            element: this.element,
            items: [{type: "bi.label", text: "第"}, this.editor, {type: "bi.label", text: "页"}, this.pager]
        })
    },

    getCurrentPage: function () {
        return this.currentPage;
    },

    setValue: function(v){
        this.currentPage = v;
        this.pager.setValue(v);
    },

    populate: function () {
        this.pager.populate();
    }
});
BI.SkipPager.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.skip_pager", BI.SkipPager);/**
 * 分段控件使用的button
 *
 * Created by GUY on 2015/9/7.
 * @class BI.SegmentButton
 * @extends BI.BasicButton
 */
BI.SegmentButton = BI.inherit(BI.BasicButton, {

    _defaultConfig: function() {
        var conf = BI.SegmentButton.superclass._defaultConfig.apply(this, arguments);
        return BI.extend( conf, {
            baseCls : (conf.baseCls ||"")+' bi-segment-button',
            shadow: true,
            readonly: true,
            hgap: 10
        })
    },

    _init:function() {
        BI.SegmentButton.superclass._init.apply(this, arguments);
        var opts = this.options, self = this;
        //if (BI.isNumber(opts.height) && BI.isNull(opts.lineHeight)) {
        //    this.element.css({lineHeight : (opts.height - 2) + 'px'});
        //}
        this.text = BI.createWidget({
            type: "bi.label",
            element: this.element,
            height: opts.height-2,
            whiteSpace: opts.whiteSpace,
            text: opts.text,
            value: opts.value,
            hgap: opts.hgap
        })
    },

    setSelected: function(){
        BI.SegmentButton.superclass.setSelected.apply(this, arguments);
    },

    setText : function(text) {
        BI.SegmentButton.superclass.setText.apply(this, arguments);
        this.text.setText(text);
    },

    destroy : function() {
        BI.SegmentButton.superclass.destroy.apply(this, arguments);
    }
});
$.shortcut('bi.segment_button', BI.SegmentButton);/**
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
            element: this.element,
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

    setEnable: function (v) {
        this.buttonGroup.setEnable(v);
    },

    getValue: function () {
        return this.buttonGroup.getValue();
    }
});
BI.Segment.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut('bi.segment', BI.Segment);/**
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
            logic: { //冻结的页面布局逻辑
                dynamic: false
            },

            isNeedResize: false,//是否需要调整列宽
            isResizeAdapt: true,//是否需要在调整列宽或区域宽度的时候它们自适应变化

            isNeedFreeze: false,//是否需要冻结单元格
            freezeCols: [], //冻结的列号,从0开始,isNeedFreeze为tree时生效

            isNeedMerge: true,//是否需要合并单元格
            mergeCols: [],
            mergeRule: function (row1, row2) { //合并规则, 默认相等时合并
                return BI.isEqual(row1, row2);
            },

            columnSize: [],
            headerRowSize: 25,
            footerRowSize: 25,
            rowSize: 25,

            regionColumnSize: false,

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
        var items = BI.DynamicSummaryTreeTable.formatCrossItems(o.crossItems, vDeep);
        var result = [];
        BI.each(items, function (row, node) {
            var c = [crossHeader[row]];
            result.push(c.concat(node || []));
        });
        var newHeader = this._formatColumns(header);
        var deep = this._getHDeep();
        if (deep <= 0) {
            newHeader.unshift({
                cls: "layer-tree-table-title",
                text: BI.i18nText("BI-Row_Header")
            });
        } else {
            newHeader[0] = {
                cls: "layer-tree-table-title",
                text: BI.i18nText("BI-Row_Header")
            };
        }
        result.push(newHeader);
        return result;
    },

    _formatItems: function (nodes, deep) {
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
                var next = [{cls: "summary-cell last", text: BI.i18nText("BI-Summary_Values")}].concat(node.values);
                result.push(next)
            }
        });
        return BI.DynamicSummaryTreeTable.formatSummaryItems(result, o.crossItems, deep);
    },

    _formatCols: function (cols, deep) {
        deep = deep || this._getHDeep();
        cols = this._formatColumns(cols);
        return BI.map(cols, function (i, c) {
            return c - (deep - 1);
        })
    },

    _formatColumns: function (columns, deep) {
        if (BI.isNotEmptyArray(columns)) {
            deep = deep || this._getHDeep();
            return columns.slice(Math.max(0, deep - 1));
        }
        return columns;
    },

    _init: function () {
        BI.DynamicSummaryLayerTreeTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var deep = this._getHDeep();
        var vDeep = this._getVDeep();
        var header = this._createHeader(vDeep);
        var items = this._formatItems(o.items, deep);
        this.table = BI.createWidget({
            type: "bi.table_view",
            element: this.element,
            logic: o.logic,
            isNeedResize: o.isNeedResize,
            isResizeAdapt: o.isResizeAdapt,
            isNeedFreeze: o.isNeedFreeze,
            freezeCols: this._formatCols(o.freezeCols, deep),
            isNeedMerge: o.isNeedMerge,
            mergeCols: [],
            mergeRule: o.mergeRule,
            columnSize: this._formatColumns(o.columnSize, deep),
            headerRowSize: o.headerRowSize,
            footerRowSize: o.footerRowSize,
            rowSize: o.rowSize,
            regionColumnSize: o.regionColumnSize,
            header: header,
            footer: this._formatColumns(o.footer, deep),
            items: items
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_INIT, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_INIT, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_SCROLL, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_BEFORE_REGION_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_BEFORE_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_REGION_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_BEFORE_COLUMN_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_BEFORE_COLUMN_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_COLUMN_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_COLUMN_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, arguments);
        });
    },

    resize: function () {
        this.table.resize();
    },

    setColumnSize: function (columnSize) {
        columnSize = this._formatColumns(columnSize);
        this.table.setColumnSize(columnSize);
    },

    getColumnSize: function () {
        var columnSize = this.table.getColumnSize();
        var deep = this._getHDeep();
        var pre = [];
        if (deep > 0) {
            pre = BI.makeArray(deep - 1, 0);
        }
        return pre.concat(columnSize);
    },

    getCalculateColumnSize: function () {
        var columnSize = this.table.getCalculateColumnSize();
        var deep = this._getHDeep();
        var pre = [];
        if (deep > 0) {
            pre = BI.makeArray(deep - 1, "");
        }
        return pre.concat(columnSize);
    },

    setHeaderColumnSize: function (columnSize) {
        columnSize = this._formatColumns(columnSize);
        this.table.setHeaderColumnSize(columnSize);
    },

    setRegionColumnSize: function (columnSize) {
        this.table.setRegionColumnSize(columnSize);
    },

    getRegionColumnSize: function () {
        return this.table.getRegionColumnSize();
    },

    getCalculateRegionColumnSize: function () {
        return this.table.getCalculateRegionColumnSize();
    },

    getCalculateRegionRowSize: function () {
        return this.table.getCalculateRegionRowSize();
    },

    getClientRegionColumnSize: function () {
        return this.table.getClientRegionColumnSize();
    },

    getScrollRegionColumnSize: function () {
        return this.table.getScrollRegionColumnSize();
    },

    getScrollRegionRowSize: function () {
        return this.table.getScrollRegionRowSize();
    },

    hasVerticalScroll: function () {
        return this.table.hasVerticalScroll();
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

    getColumns: function () {
        return this.table.getColumns();
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
            case "footer":
                value = this._formatColumns(value);
                break;
            case "freezeCols":
                value = value.length > 0 ? [0] : [];
                break;
            case "mergeCols":
                value = value.length > 0 ? [0] : [];
                break;
        }
        this.table.attr.apply(this.table, [key, value]);
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
        var deep = this._getHDeep();
        var vDeep = this._getVDeep();
        var header = this._createHeader(vDeep);
        items = this._formatItems(o.items, deep);
        this.table.populate(items, header);
    },

    destroy: function () {
        this.table.destroy();
        BI.DynamicSummaryLayerTreeTable.superclass.destroy.apply(this, arguments);
    }
});

$.shortcut("bi.dynamic_summary_layer_tree_table", BI.DynamicSummaryLayerTreeTable);/**
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
            logic: { //冻结的页面布局逻辑
                dynamic: false
            },

            isNeedResize: false,//是否需要调整列宽
            isResizeAdapt: true,//是否需要在调整列宽或区域宽度的时候它们自适应变化

            isNeedFreeze: false,//是否需要冻结单元格
            freezeCols: [], //冻结的列号,从0开始,isNeedFreeze为tree时生效

            isNeedMerge: true,//是否需要合并单元格
            mergeCols: [],
            mergeRule: function (row1, row2) { //合并规则, 默认相等时合并
                return BI.isEqual(row1, row2);
            },

            columnSize: [],
            headerRowSize: 25,
            footerRowSize: 25,
            rowSize: 25,

            regionColumnSize: false,

            header: [],
            footer: false,
            items: [],

            //交叉表头
            crossHeader: [],
            crossItems: []
        })
    },

    _createHeader: function (deep, vDeep) {
        var self = this, o = this.options;
        var header = o.header || [], crossHeader = o.crossHeader || [];
        var items = BI.DynamicSummaryTreeTable.formatCrossItems(o.crossItems, vDeep);
        var result = [];
        BI.each(items, function (row, node) {
            var c = [];
            for (var i = 0; i < deep; i++) {
                c.push(crossHeader[row]);
            }
            result.push(c.concat(node || []));
        });
        result.push(header);
        return result;
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
        var deep = this._getHDeep();
        var vDeep = this._getVDeep();
        var header = this._createHeader(deep, vDeep);
        var items = BI.DynamicSummaryTreeTable.formatItems(o.items, deep);
        items = BI.DynamicSummaryTreeTable.formatSummaryItems(items, o.crossItems, deep);
        this.table = BI.createWidget({
            type: "bi.table_view",
            element: this.element,
            logic: o.logic,

            isNeedResize: o.isNeedResize,
            isResizeAdapt: o.isResizeAdapt,

            isNeedFreeze: o.isNeedFreeze,
            freezeCols: o.freezeCols,
            isNeedMerge: o.isNeedMerge,
            mergeCols: o.mergeCols,
            mergeRule: o.mergeRule,

            columnSize: o.columnSize,
            headerRowSize: o.headerRowSize,
            footerRowSize: o.footerRowSize,
            rowSize: o.rowSize,

            regionColumnSize: o.regionColumnSize,

            header: header,
            footer: o.footer,
            items: items
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_INIT, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_INIT, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_SCROLL, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_BEFORE_REGION_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_BEFORE_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_REGION_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_BEFORE_COLUMN_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_BEFORE_COLUMN_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_COLUMN_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_COLUMN_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, arguments);
        });
    },

    resize: function () {
        this.table.resize();
    },

    setColumnSize: function (columnSize) {
        this.table.setColumnSize(columnSize);
    },

    getColumnSize: function () {
        return this.table.getColumnSize();
    },

    getCalculateColumnSize: function () {
        return this.table.getCalculateColumnSize();
    },

    setHeaderColumnSize: function (columnSize) {
        this.table.setHeaderColumnSize(columnSize);
    },

    setRegionColumnSize: function (columnSize) {
        this.table.setRegionColumnSize(columnSize);
    },

    getRegionColumnSize: function () {
        return this.table.getRegionColumnSize();
    },

    getCalculateRegionColumnSize: function () {
        return this.table.getCalculateRegionColumnSize();
    },

    getCalculateRegionRowSize: function () {
        return this.table.getCalculateRegionRowSize();
    },

    getClientRegionColumnSize: function () {
        return this.table.getClientRegionColumnSize();
    },

    getScrollRegionColumnSize: function () {
        return this.table.getScrollRegionColumnSize();
    },

    getScrollRegionRowSize: function () {
        return this.table.getScrollRegionRowSize();
    },

    hasVerticalScroll: function () {
        return this.table.hasVerticalScroll();
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

    getColumns: function () {
        return this.table.getColumns();
    },

    attr: function () {
        BI.DynamicSummaryTreeTable.superclass.attr.apply(this, arguments);
        this.table.attr.apply(this.table, arguments);
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
        var deep = this._getHDeep();
        var vDeep = this._getVDeep();
        var header = this._createHeader(deep, vDeep);
        items = BI.DynamicSummaryTreeTable.formatItems(o.items, deep);
        items = BI.DynamicSummaryTreeTable.formatSummaryItems(items, o.crossItems, deep);
        this.table.populate(items, header);
    },

    destroy: function () {
        this.table.destroy();
        BI.DynamicSummaryTreeTable.superclass.destroy.apply(this, arguments);
    }
});

BI.extend(BI.DynamicSummaryTreeTable, {
    formatItems: function (nodes, deep, isCross) {
        var self = this;
        var result = [];

        function track(store, node) {
            var next;
            if (BI.isArray(node.children)) {
                BI.each(node.children, function (index, child) {
                    var next;
                    if (store != -1) {
                        next = BI.clone(store);
                        next.push(node);
                    } else {
                        next = [];
                    }
                    track(next, child);
                });
                if (store != -1) {
                    next = BI.clone(store);
                    next.push(node);
                } else {
                    next = [];
                }
                if ((store == -1 || node.children.length > 1) && BI.isNotEmptyArray(node.values)) {
                    var cls = store === -1 ? " last" : "";
                    var id = BI.UUID();
                    for (var i = next.length; i < deep; i++) {
                        next.push({text: BI.i18nText("BI-Summary_Values"), tag: id, cls: "summary-cell" + cls});
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
                next = BI.clone(store);
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
            for (var i = line.length; i < deep; i++) {
                line.push(last);
            }
        });
        return result;
    },

    formatCrossItems: function (nodes, deep) {
        var items = BI.DynamicSummaryTreeTable.formatItems(nodes, deep, true);
        return BI.unzip(items);
    },

    formatSummaryItems: function (items, crossItems, deep) {
        //求纵向需要去除的列
        var cols = [];
        var leaf = 0;

        function track(node) {
            if (BI.isArray(node.children)) {
                BI.each(node.children, function (index, child) {
                    track(child);
                });
                if (BI.isNotEmptyArray(node.values)) {
                    leaf++;
                    if (node.children.length === 1) {
                        cols.push(leaf - 1 + deep);
                    }
                }
                return;
            }
            leaf++;
        }

        BI.each(crossItems, function (i, node) {
            track(node);
        });

        if (cols.length > 0) {
            BI.each(items, function (i, node) {
                BI.removeAt(node, cols);
            })
        }
        return items;
    }
});

$.shortcut("bi.dynamic_summary_tree_table", BI.DynamicSummaryTreeTable);/**
 * Created by GUY on 2016/5/7.
 * @class BI.LayerTreeTableCell
 * @extends BI.Single
 */
BI.LayerTreeTableCell = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.LayerTreeTableCell.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-layer-tree-table-cell",
            layer: 0,
            text: ""
        })
    },

    _init: function () {
        BI.LayerTreeTableCell.superclass._init.apply(this, arguments);
        var o = this.options;
        BI.createWidget({
            type: "bi.label",
            element: this.element,
            textAlign: "left",
            whiteSpace: "nowrap",
            height: o.height,
            text: o.text,
            value: o.value,
            lgap: 5 + 30 * o.layer,
            rgap: 5
        })
    }
});

$.shortcut("bi.layer_tree_table_cell", BI.LayerTreeTableCell);/**
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
            logic: { //冻结的页面布局逻辑
                dynamic: false
            },

            isNeedResize: false,//是否需要调整列宽
            isResizeAdapt: true,//是否需要在调整列宽或区域宽度的时候它们自适应变化

            isNeedFreeze: false,//是否需要冻结单元格
            freezeCols: [], //冻结的列号,从0开始,isNeedFreeze为tree时生效

            isNeedMerge: true,//是否需要合并单元格
            mergeCols: [],
            mergeRule: function (row1, row2) { //合并规则, 默认相等时合并
                return BI.isEqual(row1, row2);
            },

            columnSize: [],
            headerRowSize: 25,
            footerRowSize: 25,
            rowSize: 25,

            regionColumnSize: false,

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
        var items = BI.TableTree.formatCrossItems(o.crossItems, vDeep);
        var result = [];
        BI.each(items, function (row, node) {
            var c = [crossHeader[row]];
            result.push(c.concat(node || []));
        });
        var newHeader = this._formatColumns(header);
        var deep = this._getHDeep();
        if (deep <= 0) {
            newHeader.unshift({
                cls: "layer-tree-table-title",
                text: BI.i18nText("BI-Row_Header")
            });
        } else {
            newHeader[0] = {
                cls: "layer-tree-table-title",
                text: BI.i18nText("BI-Row_Header")
            };
        }
        result.push(newHeader);
        return result;
    },

    _formatItems: function (nodes) {
        var self = this;
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
                var next = [{cls: "summary-cell last", text: BI.i18nText("BI-Summary_Values")}].concat(node.values);
                result.push(next)
            }
        });
        return result;
    },

    _formatCols: function (cols, deep) {
        deep = deep || this._getHDeep();
        cols = this._formatColumns(cols);
        return BI.map(cols, function (i, c) {
            return c - (deep - 1);
        })
    },

    _formatColumns: function (columns, deep) {
        if (BI.isNotEmptyArray(columns)) {
            deep = deep || this._getHDeep();
            return columns.slice(Math.max(0, deep - 1));
        }
        return columns;
    },

    _init: function () {
        BI.LayerTreeTable.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var deep = this._getHDeep();
        var vDeep = this._getVDeep();
        var header = this._createHeader(vDeep);
        var items = this._formatItems(o.items);
        this.table = BI.createWidget({
            type: "bi.table_view",
            element: this.element,
            logic: o.logic,
            isNeedResize: o.isNeedResize,
            isResizeAdapt: o.isResizeAdapt,
            isNeedFreeze: o.isNeedFreeze,
            freezeCols: this._formatCols(o.freezeCols, deep),
            isNeedMerge: o.isNeedMerge,
            mergeCols: [],
            mergeRule: o.mergeRule,
            columnSize: this._formatColumns(o.columnSize, deep),
            headerRowSize: o.headerRowSize,
            footerRowSize: o.footerRowSize,
            rowSize: o.rowSize,
            regionColumnSize: o.regionColumnSize,
            header: header,
            footer: this._formatColumns(o.footer, deep),
            items: items
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_INIT, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_INIT, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_SCROLL, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_SCROLL, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_BEFORE_REGION_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_BEFORE_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_REGION_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_REGION_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_BEFORE_COLUMN_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_BEFORE_COLUMN_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_COLUMN_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_COLUMN_RESIZE, arguments);
        });
        this.table.on(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, function () {
            self.fireEvent(BI.Table.EVENT_TABLE_AFTER_COLUMN_RESIZE, arguments);
        });
    },

    resize: function () {
        this.table.resize();
    },

    setColumnSize: function (columnSize) {
        columnSize = this._formatColumns(columnSize);
        this.table.setColumnSize(columnSize);
    },

    getColumnSize: function () {
        var columnSize = this.table.getColumnSize();
        var deep = this._getHDeep();
        var pre = [];
        if (deep > 0) {
            pre = BI.makeArray(deep - 1, 0);
        }
        return pre.concat(columnSize);
    },

    getCalculateColumnSize: function () {
        var columnSize = this.table.getCalculateColumnSize();
        var deep = this._getHDeep();
        var pre = [];
        if (deep > 0) {
            pre = BI.makeArray(deep - 1, "");
        }
        return pre.concat(columnSize);
    },

    setHeaderColumnSize: function (columnSize) {
        columnSize = this._formatColumns(columnSize);
        this.table.setHeaderColumnSize(columnSize);
    },

    setRegionColumnSize: function (columnSize) {
        this.table.setRegionColumnSize(columnSize);
    },

    getRegionColumnSize: function () {
        return this.table.getRegionColumnSize();
    },

    getCalculateRegionColumnSize: function () {
        return this.table.getCalculateRegionColumnSize();
    },

    getCalculateRegionRowSize: function () {
        return this.table.getCalculateRegionRowSize();
    },

    getClientRegionColumnSize: function () {
        return this.table.getClientRegionColumnSize();
    },

    getScrollRegionColumnSize: function () {
        return this.table.getScrollRegionColumnSize();
    },

    getScrollRegionRowSize: function () {
        return this.table.getScrollRegionRowSize();
    },

    hasVerticalScroll: function () {
        return this.table.hasVerticalScroll();
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

    getColumns: function () {
        return this.table.getColumns();
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
            case "footer":
                value = this._formatColumns(value);
                break;
            case "freezeCols":
                value = value.length > 0 ? [0] : [];
                break;
            case "mergeCols":
                value = value.length > 0 ? [0] : [];
                break;
        }
        this.table.attr.apply(this.table, [key, value]);
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
        var vDeep = this._getVDeep();
        var header = this._createHeader(vDeep);
        items = this._formatItems(o.items);
        this.table.populate(items, header);
    },

    destroy: function () {
        this.table.destroy();
        BI.LayerTreeTable.superclass.destroy.apply(this, arguments);
    }
});

$.shortcut("bi.layer_tree_table", BI.LayerTreeTable);/**
 * 分页table
 *
 * Created by GUY on 2015/9/8.
 * @class BI.Tabler
 * @extends BI.Widget
 */
BI.Tabler = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.Tabler.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-tabler",

            pager: {},

            layouts: [{
                type: "bi.float_center_adapt"
            }],

            tabler: {
                isNeedFreeze: false,//是否需要冻结单元格
                freezeCols: [], //冻结的列号,从0开始,isNeedFreeze为tree时生效

                isNeedMerge: true,//是否需要合并单元格

                mergeRule: function (row1, row2) { //合并规则, 默认相等时合并
                    return BI.isEqual(row1, row2);
                },

                columnSize: [],
                rowSize: 37,
                header: [],
                items: [],

                //交叉表头
                crossHeader: [],
                crossItems: []
            }
        })
    },
    _init: function () {
        BI.Tabler.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.pager = BI.createWidget(o.pager, {
            type: "bi.pager"
        });
        var creater = BI.createWidget({
            type: "bi.button_tree",
            items: [{
                el: this.pager
            }],
            layouts: o.layouts
        })
        this.pager.on(BI.Controller.EVENT_CHANGE, function (type) {
            if (type === BI.Events.CLICK) {
                self.fireEvent(BI.Tabler.EVENT_CHANGE);
            }
        });
        this.container = BI.createWidget({
            type: "bi.layout"
        })
        BI.createWidget({
            type: "bi.vtape",
            element: this.element,
            items: [{
                el: this.container
            }, {
                el: creater,
                height: 40
            }]
        });
        this.populate();
    },

    getCurrentPage: function () {
        return this.pager.getValue();
    },

    populate: function (opt) {
        var o = this.options;
        this.container.empty();

        BI.extend(o.tabler, opt);
        this.table = BI.createWidget(this.options.tabler, {
            type: "bi.table_tree",
            element: this.container
        });
    }
});
BI.Tabler.EVENT_CHANGE = "EVENT_CHANGE";
$.shortcut("bi.tabler", BI.Tabler);/**
 * guy
 * 气泡提示
 * @class BI.Bubble
 * @extends BI.Tip
 * @type {*|void|Object}
 */
BI.Bubble = BI.inherit(BI.Tip, {
    _defaultConfig: function() {
        return BI.extend(BI.Bubble.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-bubble",
            direction: "top",
            text: "",
            height: 35
        })
    },
    _init : function() {
        BI.Bubble.superclass._init.apply(this, arguments);
        var fn = function (e) {
            e.stopPropagation();
            e.stopEvent();
            return false;
        };
        this.element.bind({"click": fn, "mousedown": fn, "mouseup": fn, "mouseover": fn, "mouseenter": fn, "mouseleave": fn, "mousemove": fn});
        BI.createWidget({
            type: "bi.left",
            element: this.element,
            items: [this["_" + this.options.direction]()]
        })
    },

    _createBubbleText: function(){
        return (this.text = BI.createWidget({
            type: "bi.label",
            cls: "bubble-text",
            text: this.options.text,
            hgap: 10,
            height: 30
        }));
    },

    _top: function(){
        return BI.createWidget({
            type: "bi.vertical",
            items: [{
                el: this._createBubbleText(),
                height: 30
            }, {
                el: {
                    type: "bi.layout"
                },
                height: 3
            }]
        })
    },

    _bottom: function(){
        return BI.createWidget({
            type: "bi.vertical",
            items: [{
                el: {
                    type: "bi.layout"
                },
                height: 3
            }, {
                el: this._createBubbleText(),
                height: 30
            }]
        })
    },

    _left: function(){
        return BI.createWidget({
            type: "bi.right",
            items: [{
                el: {
                    type: "bi.layout",
                    width: 3,
                    height: 30
                }
            }, {
                el: this._createBubbleText()
            }]
        })
    },

    _right: function(){
        return BI.createWidget({
            type: "bi.inline",
            items: [{
                el: {
                    type: "bi.layout",
                    width: 3,
                    height: 30
                }
            }, {
                el: this._createBubbleText()
            }]
        })
    },

    setText: function(text){
        this.text.setText(text);
    }
});

$.shortcut("bi.bubble", BI.Bubble);/**
 * toast提示
 *
 * Created by GUY on 2015/9/7.
 * @class BI.Toast
 * @extends BI.Tip
 */
BI.Toast = BI.inherit(BI.Tip, {
    _const: {
        minWidth: 200,
        hgap: 20
    },

    _defaultConfig: function () {
        return BI.extend(BI.Toast.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-toast",
            text: "",
            level: "success",//success或warning
            height: 30
        })
    },
    _init: function () {
        BI.Toast.superclass._init.apply(this, arguments);
        var o = this.options;
        this.element.css({
            minWidth: this._const.minWidth + "px"
        })
        this.element.addClass("toast-" + o.level);
        var fn = function (e) {
            e.stopPropagation();
            e.stopEvent();
            return false;
        };
        this.element.bind({"click": fn, "mousedown": fn, "mouseup": fn, "mouseover": fn, "mouseenter": fn, "mouseleave": fn, "mousemove": fn});

        this.text = BI.createWidget({
            type: "bi.label",
            element: this.element,
            text: o.text,
            height: 30,
            hgap: this._const.hgap
        })
    },

    setWidth: function(width){
        this.element.width(width);
    },

    setText: function (text) {
        this.text.setText(text);
    }
});

$.shortcut("bi.toast", BI.Toast);/**
 * toast提示
 *
 * Created by GUY on 2015/9/7.
 * @class BI.Tooltip
 * @extends BI.Tip
 */
BI.Tooltip = BI.inherit(BI.Tip, {
    _const: {
        hgap: 10
    },

    _defaultConfig: function () {
        return BI.extend(BI.Tooltip.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-tooltip",
            text: "",
            level: "success",//success或warning
            height: 20
        })
    },
    _init: function () {
        BI.Tooltip.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.element.addClass("tooltip-" + o.level);
        var fn = function (e) {
            e.stopPropagation();
            e.stopEvent();
            return false;
        };
        this.element.bind({"click": fn, "mousedown": fn, "mouseup": fn, "mouseover": fn, "mouseenter": fn, "mouseleave": fn, "mousemove": fn});

        this.text = BI.createWidget({
            type: "bi.label",
            element: this.element,
            textAlign: "left",
            whiteSpace: "normal",
            text: o.text,
            textHeight: 20,
            hgap: this._const.hgap
        });
    },

    setWidth: function(width){
        this.element.width(width - 2 * this._const.hgap);
    },

    setText: function (text) {
        this.text.setText(text);
    },

    setLevel: function (level) {
       this.element.removeClass("tooltip-success").removeClass("tooltip-warning");
        this.element.addClass("tooltip-" + level);
    }
});

$.shortcut("bi.tooltip", BI.Tooltip);/**
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
            onCheck: BI.emptyFn,
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
                o.onCheck.call(self, self.isSelected());
            }
        });
        this.half = BI.createWidget({
            type: "bi.half_icon_button",
            stopPropagation: true,
            handler: function () {
                self.setSelected(true);
                o.onCheck.call(self, self.isSelected());
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
            element: this.element,
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

    doClick: function () {
        var isHalf = this.isHalfSelected(), isSelected = this.isSelected();
        if (isHalf === true) {
            this.setSelected(true);
        } else {
            this.setSelected(!isSelected);
        }

        if (this.isValid()) {
            this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.CLICK, this.getValue(), this);
            this.options.onCheck.call(this, this.isSelected());
            this.fireEvent(BI.MultiSelectBar.EVENT_CHANGE, this.isSelected(), this);
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
    },

    setEnable: function (b) {
        BI.MultiSelectBar.superclass.setEnable.apply(this, arguments);
        this.checkbox.setEnable(b);
        this.half.setEnable(b);
        this.text.setEnable(b);
    }
});
BI.MultiSelectBar.EVENT_CHANGE = "MultiSelectBar.EVENT_CHANGE";
$.shortcut("bi.multi_select_bar", BI.MultiSelectBar);/**
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
            element: this.element,
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
$.shortcut("bi.handstand_branch_tree", BI.HandStandBranchTree);/**
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
            element: this.element,
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
$.shortcut("bi.branch_tree", BI.BranchTree);/**
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

    initTree: function (nodes, setting) {
        var setting = setting || this._configSetting();
        this.nodes = $.fn.zTree.init(this.tree.element, setting, nodes);
    },

    destroy: function () {
        BI.DisplayTree.superclass.destroy.apply(this, arguments);
    }
});
BI.DisplayTree.EVENT_CHANGE = "EVENT_CHANGE";

$.shortcut("bi.display_tree", BI.DisplayTree);/**
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
            element: this.element,
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

    doBehavior: function () {
        this.tree.doBehavior.apply(this.tree, arguments);
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

$.shortcut("bi.level_tree", BI.LevelTree);/**
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
            type: "bi.tree",
            element: this.element,
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
$.shortcut("bi.simple_tree", BI.SimpleTreeView);
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
            baseCls: (conf.baseCls || "") + " bi-editor-trigger",
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
            mouseOut: false,
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
            element: this.element,
            type: 'bi.htape',
            items: [
                {
                    el: this.editor
                }, {
                    el: {
                        type: "bi.trigger_icon_button",
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
$.shortcut("bi.editor_trigger", BI.EditorTrigger);/**
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
            element: this.element,
            width: o.width,
            height: o.height
        });
    }
});
$.shortcut('bi.icon_trigger', BI.IconTrigger);/**
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
            width: c.triggerWidth
        });

        BI.createWidget({
            element: this.element,
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

    setEnable: function (v) {
        BI.TextTrigger.superclass.setEnable.apply(this, arguments);
        this.trigerButton.setEnable(v);
        this.text.setEnable(v);
    },

    setValue: function (value) {
        this.text.setValue(value);
    },

    setText: function (text) {
        this.text.setText(text);
    }
});
$.shortcut("bi.text_trigger", BI.TextTrigger);/**
 * 选择字段trigger
 *
 * Created by GUY on 2015/9/15.
 * @class BI.SelectTextTrigger
 * @extends BI.Trigger
 */
BI.SelectTextTrigger = BI.inherit(BI.Trigger, {

    _defaultConfig: function () {
        return BI.extend(BI.SelectTextTrigger.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-select-text-trigger",
            height: 24
        });
    },

    _init: function () {
        this.options.height -= 2;
        BI.SelectTextTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.text_trigger",
            element: this.element,
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
            if (BI.deepContains(vals, item.value)) {
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
$.shortcut("bi.select_text_trigger", BI.SelectTextTrigger);/**
 * 选择字段trigger小一号的
 *
 * @class BI.SmallSelectTextTrigger
 * @extends BI.Trigger
 */
BI.SmallSelectTextTrigger = BI.inherit(BI.Trigger, {

    _defaultConfig: function () {
        return BI.extend(BI.SmallSelectTextTrigger.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-small-select-text-trigger",
            height: 20
        });
    },

    _init: function () {
        this.options.height -= 2;
        BI.SmallSelectTextTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.trigger = BI.createWidget({
            type: "bi.small_text_trigger",
            element: this.element,
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
            if (BI.deepContains(vals, item.value)) {
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
$.shortcut("bi.small_select_text_trigger", BI.SmallSelectTextTrigger);/**
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
            element: this.element,
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

    setEnable: function (v) {
        BI.SmallTextTrigger.superclass.setEnable.apply(this, arguments);
        this.trigerButton.setEnable(v);
        this.text.setEnable(v);
    },

    setValue: function (value) {
        this.text.setValue(value);
    },

    setText: function (text) {
        this.text.setText(text);
    }
});
$.shortcut("bi.small_text_trigger", BI.SmallTextTrigger);