/**
 * 过滤条件
 *
 * Created by GUY on 2015/9/25.
 * @class BI.FilterOperation
 * @extend BI.Widget
 */
BI.FilterOperation = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.FilterOperation.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-filter-operation",
            expander: {},
            items: [],
            selections: [BICst.FILTER_OPERATION_CONDITION, BICst.FILTER_OPERATION_FORMULA],
            itemsCreator: BI.emptyFn
        })
    },

    _defaultState: function () {
        if (BI.isNotNull(this.currentSelected)) {
            this.currentSelected.setSelectedCondition(false);
        }
        this.buttonComboTab.setSelect(BI.FilterOperation.OPERATION_ADD_CONDITION);
    },

    _init: function () {
        BI.FilterOperation.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.currentSelected = null;

        this.filter = BI.createWidget({
            type: "bi.filter_pane",
            expander: o.expander,
            items: o.items,
            itemsCreator: o.itemsCreator
        });
        this.filter.on(BI.Controller.EVENT_CHANGE, function (type, value, obj) {
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
                    self.buttonComboTab.setSelect(BI.FilterOperation.OPERATION_ADD_ANDOR_CONDITION);
                } else {
                    self.buttonComboTab.setSelect(BI.FilterOperation.OPERATION_ADD_CONDITION);
                }
            }
            if (type === BI.Events.DESTROY) {
                if (self.currentSelected === obj) {
                    self.currentSelected = null;
                    self.buttonComboTab.setSelect(BI.FilterOperation.OPERATION_ADD_CONDITION);
                }
                self.fireEvent(BI.FilterOperation.EVENT_DESTROY_ITEM, value, obj);
            }
        });
        this.filter.on(BI.FilterPane.EVENT_CHANGE, function () {
            self.fireEvent(BI.FilterOperation.EVENT_CHANGE, arguments);
        });
        var operation = this._buildOperationTab();

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                el: operation,
                height: 40
            }, {
                el: {
                    type: "bi.absolute",
                    scrollable: true,
                    items: [{
                        el: {
                            type: "bi.left",
                            items: [
                                this.filter
                            ]
                        },
                        top: 0,
                        right: 2,
                        bottom: 0,
                        left: 0
                    }]
                }
            }]
        })
    },

    _buildOperationTab: function () {
        this.buttonComboTab = BI.createWidget({
            type: "bi.tab",
            tab: null,
            cardCreator: BI.bind(this._createTabs, this)
        });
        this.buttonComboTab.setSelect(BI.FilterOperation.OPERATION_ADD_CONDITION);
        return this.buttonComboTab;
    },

    _createTabs: function (v) {
        var self = this;
        switch (v) {
            case BI.FilterOperation.OPERATION_ADD_CONDITION:
                var btnGroup = BI.createWidget({
                    type: "bi.button_group",
                    items: BI.createItems(self._createButtons(), {
                        type: "bi.button",
                        forceNotSelected: true,
                        level: "ignore",
                        height: 25
                    }),
                    chooseType: BI.ButtonGroup.CHOOSE_TYPE_DEFAULT,
                    layouts: [{
                        type: "bi.right",
                        hgap: 10,
                        vgap: 5
                    }]
                });
                btnGroup.on(BI.ButtonGroup.EVENT_CHANGE, function (value, obj) {
                    self.fireEvent(BI.FilterOperation.EVENT_OPERATION, obj.getValue());
                    self._defaultState();
                });
                return btnGroup;
            case BI.FilterOperation.OPERATION_ADD_ANDOR_CONDITION:
                var btnGroup = BI.createWidget({
                    type: "bi.button_group",
                    chooseType: BI.ButtonGroup.CHOOSE_TYPE_DEFAULT,
                    items: self._createCombos(),
                    layouts: [{
                        type: "bi.right",
                        hgap: 10,
                        vgap: 5
                    }]
                });
                return btnGroup;
        }
    },

    _createButtons: function(){
        var buttons = [];
        BI.each(this.options.selections, function(i, type){
            switch (type){
                case BICst.FILTER_OPERATION_FORMULA:
                    buttons.push({
                        text: BI.i18nText("BI-Add_Formula"),
                        value: BICst.FILTER_OPERATION_FORMULA
                    });
                    break;
                case BICst.FILTER_OPERATION_CONDITION:
                    buttons.push({
                        text: BI.i18nText("BI-Add_Condition"),
                        value: BICst.FILTER_OPERATION_CONDITION
                    });
                    break;
            }
        });
        return buttons;
    },

    _createCombos: function () {
        var self = this, combos = [];
        BI.each(this.options.selections, function(i, type){
            var text = "", items = [];
            switch (type) {
                case BICst.FILTER_OPERATION_FORMULA:
                    text = BI.i18nText("BI-Add_Formula");
                    items = BICst.FILTER_ADD_FORMULA_COMBO;
                    break;
                case BICst.FILTER_OPERATION_CONDITION:
                    text = BI.i18nText("BI-Add_Condition");
                    items = BICst.FILTER_ADD_CONDITION_COMBO;
                    break;
            }
            var addCombo = BI.createWidget({
                type: "bi.static_combo",
                text: text,
                width: 90,
                chooseType: BI.ButtonGroup.CHOOSE_TYPE_NONE,
                items: BI.createItems(items, {
                    type: "bi.single_select_item",
                    height: 25
                })
            });
            addCombo.on(BI.Combo.EVENT_CHANGE, function (value, obj) {
                self.fireEvent(BI.FilterOperation.EVENT_OPERATION, obj.getValue());
                self._defaultState();
            });
            combos.push(addCombo);
        });
        return combos;
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
BI.extend(BI.FilterOperation, {
    OPERATION_ADD_CONDITION: 0,
    OPERATION_ADD_ANDOR_CONDITION: 1
});
BI.FilterOperation.EVENT_OPERATION = "EVENT_OPERATION";
BI.FilterOperation.EVENT_CHANGE = "EVENT_CHANGE";
BI.FilterOperation.EVENT_DESTROY_ITEM = "BI.FilterOperation.EVENT_DESTROY_ITEM";
$.shortcut("bi.filter_operation", BI.FilterOperation);