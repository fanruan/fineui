/**
 * 过滤条件
 *
 * Created by GUY on 2015/9/25.
 * @class BI.FilterOperation
 * @extend BI.Widget
 */
!(function () {
    var OPERATION_ADD_CONDITION = 0, OPERATION_ADD_ANDOR_CONDITION = 1;
    var FilterOperation = BI.inherit(BI.Widget, {
        _defaultConfig: function () {
            return BI.extend(FilterOperation.superclass._defaultConfig.apply(this, arguments), {
                constants: {
                    FORMULA_COMBO: [{
                        text: BI.i18nText("BI-Conf_Formula_And"),
                        value: BI.AbstractFilterItem.FILTER_OPERATION_FORMULA_AND
                    }, {
                        text: BI.i18nText("BI-Conf_Formula_Or"),
                        value: BI.AbstractFilterItem.FILTER_OPERATION_FORMULA_OR
                    }],
                    CONDITION_COMBO: [{
                        text: BI.i18nText("BI-Conf_Condition_And"),
                        value: BI.AbstractFilterItem.FILTER_OPERATION_CONDITION_AND
                    }, {
                        text: BI.i18nText("BI-Conf_Condition_Or"),
                        value: BI.AbstractFilterItem.FILTER_OPERATION_CONDITION_OR
                    }]
                }
            });
        },
        
        props: {
            baseCls: "bi-filter-operation",
            expander: {},
            items: [],
            selections: [BI.AbstractFilterItem.FILTER_OPERATION_CONDITION, BI.AbstractFilterItem.FILTER_OPERATION_FORMULA],
            itemsCreator: BI.emptyFn
        },

        render: function () {
            var self = this, o = this.options;
            this.currentSelected = null;

            return {
                type: "bi.vtape",
                items: [{
                    el: {
                        type: "bi.tab",
                        showIndex: OPERATION_ADD_CONDITION,
                        cardCreator: BI.bind(this._createTabs, this),
                        ref: function (_ref) {
                            self.buttonComboTab = _ref;
                        }
                    },
                    height: 40
                }, {
                    el: {
                        type: "bi.absolute",
                        scrollable: true,
                        items: [{
                            el: {
                                type: "bi.left",
                                items: [{
                                    type: "bi.filter_pane",
                                    expander: o.expander,
                                    items: o.items,
                                    itemsCreator: o.itemsCreator,
                                    listeners: [{
                                        eventName: "EVENT_CHANGE",
                                        action: function (type, value, obj) {
                                            if (type === BI.Events.CLICK) {
                                                if (BI.isNotNull(self.currentSelected) && self.currentSelected === obj) {
                                                    obj.setSelectedCondition(!obj.isSelectedCondition());
                                                } else {
                                                    if (BI.isNotNull(self.currentSelected)) {
                                                        self.currentSelected.setSelectedCondition(false);
                                                    }
                                                    self.currentSelected = obj;
                                                    obj.setSelectedCondition(true);
                                                }
                                                if (self.currentSelected.isSelectedCondition()) {
                                                    self.buttonComboTab.setSelect(OPERATION_ADD_ANDOR_CONDITION);
                                                } else {
                                                    self.buttonComboTab.setSelect(OPERATION_ADD_CONDITION);
                                                }
                                            }
                                            if (type === BI.Events.DESTROY) {
                                                if (self.currentSelected === obj) {
                                                    self.currentSelected = null;
                                                    self.buttonComboTab.setSelect(OPERATION_ADD_CONDITION);
                                                }
                                                self.fireEvent("BI.FilterOperation.EVENT_DESTROY_ITEM", value, obj);
                                            }
                                        }
                                    }],
                                    ref: function (_ref) {
                                        self.filter = _ref;
                                    }
                                }]
                            },
                            top: 0,
                            right: 2,
                            bottom: 0,
                            left: 0
                        }]
                    }
                }]
            };
        },

        _createTabs: function (v) {
            var self = this;
            switch (v) {
                case OPERATION_ADD_CONDITION:
                    return {
                        type: "bi.button_group",
                        items: BI.createItems(self._createButtons(), {
                            type: "bi.icon_text_item",
                            height: 30,
                            width: 100
                        }),
                        chooseType: BI.ButtonGroup.CHOOSE_TYPE_DEFAULT,
                        layouts: [{
                            type: "bi.left",
                            vgap: 5
                        }],
                        listeners: [{
                            eventName: BI.ButtonGroup.EVENT_CHANGE,
                            action: function (value, obj) {
                                if (BI.isEmptyArray(self.filter.getValue())) {
                                    self.filter.element.addClass("bi-border-top bi-border-left");
                                }
                                self.fireEvent("EVENT_OPERATION", obj.getValue());
                                self.defaultState();
                            }
                        }]
                    };
                case OPERATION_ADD_ANDOR_CONDITION:
                    return {
                        type: "bi.button_group",
                        chooseType: BI.ButtonGroup.CHOOSE_TYPE_DEFAULT,
                        items: self._buildOperationButton(),
                        layouts: [{
                            type: "bi.left",
                            vgap: 5
                        }]
                    };
            }
        },

        _createButtons: function () {
            var buttons = [];
            BI.each(this.options.selections, function (i, type) {
                switch (type) {
                    case BI.AbstractFilterItem.FILTER_OPERATION_FORMULA:
                        buttons.push({
                            text: BI.i18nText("BI-Conf_Add_Formula"),
                            value: BI.AbstractFilterItem.FILTER_OPERATION_FORMULA,
                            cls: "operation-trigger filter-formula-font"
                        });
                        break;
                    case BI.AbstractFilterItem.FILTER_OPERATION_CONDITION:
                        buttons.push({
                            text: BI.i18nText("BI-Conf_Add_Condition"),
                            value: BI.AbstractFilterItem.FILTER_OPERATION_CONDITION,
                            cls: "operation-trigger filter-condition-font"
                        });
                        break;
                }
            });
            return buttons;
        },

        _buildOperationButton: function () {
            var self = this, combos = [];
            BI.each(this.options.selections, function (i, type) {
                var text = "", cls = "", items = [];
                switch (type) {
                    case BI.AbstractFilterItem.FILTER_OPERATION_FORMULA:
                        text = BI.i18nText("BI-Conf_Add_Formula");
                        cls = "filter-formula-font";
                        items = self.options.constants.FORMULA_COMBO;
                        break;
                    case BI.AbstractFilterItem.FILTER_OPERATION_CONDITION:
                    default:
                        text = BI.i18nText("BI-Conf_Add_Condition");
                        cls = "filter-condition-font";
                        items = self.options.constants.CONDITION_COMBO;
                        break;
                }

                var trigger = BI.createWidget({
                    type: "bi.icon_text_item",
                    cls: "operation-trigger " + cls,
                    text: text,
                    height: 30,
                    width: 100
                });
                combos.push({
                    type: "bi.combo",
                    el: trigger,
                    popup: {
                        el: {
                            type: "bi.button_group",
                            chooseType: BI.ButtonGroup.CHOOSE_TYPE_NONE,
                            items: BI.createItems(items, {
                                type: "bi.single_select_item",
                                height: 25
                            }),
                            layouts: [{
                                type: "bi.vertical"
                            }]
                        }
                    },
                    listeners: [{
                        eventName: BI.Combo.EVENT_CHANGE,
                        action: function (value, obj) {
                            if (BI.isEmptyArray(self.filter.getValue())) {
                                self.filter.element.addClass("bi-border-top bi-border-left");
                            }

                            switch (value) {
                                case BI.AbstractFilterItem.FILTER_OPERATION_CONDITION_AND:
                                case BI.AbstractFilterItem.FILTER_OPERATION_CONDITION_OR:
                                    trigger.setText(BI.i18nText("BI-Conf_Add_Condition"));
                                    break;
                                case BI.AbstractFilterItem.FILTER_OPERATION_FORMULA_AND:
                                case BI.AbstractFilterItem.FILTER_OPERATION_FORMULA_OR:
                                    trigger.setText(BI.i18nText("BI-Conf_Add_Formula"));
                                    break;
                                default:
                                    trigger.setText();
                            }
                            self.fireEvent("EVENT_OPERATION", obj.getValue());
                            self.defaultState();
                            this.hideView();
                        }
                    }]
                });
            });
            return combos;
        },

        defaultState: function () {
            if (BI.isNotNull(this.currentSelected)) {
                this.currentSelected.setSelectedCondition(false);
            }
            this.buttonComboTab.setSelect(OPERATION_ADD_CONDITION);
        },

        getCurrentSelectItem: function () {
            if (BI.isNotNull(this.currentSelected) && this.currentSelected.isSelectedCondition()) {
                return this.currentSelected;
            }
        },

        populate: function (items) {
            this.filter.populate.apply(this.filter, arguments);
        },

        getValue: function () {
            return this.filter.getValue();
        }
    });
    BI.shortcut("bi.filter_operation", FilterOperation);
}());
