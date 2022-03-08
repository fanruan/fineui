/**
 *
 * @class BI.MultiTreeCombo
 * @extends BI.Single
 */

BI.MultiTreeCombo = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        return BI.extend(BI.MultiTreeCombo.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-tree-combo",
            itemsCreator: BI.emptyFn,
            valueFormatter: BI.emptyFn,
            height: 24,
            allowEdit: true,
            isNeedAdjustWidth: true,
        });
    },

    _init: function () {
        var self = this, o = this.options;
        BI.MultiTreeCombo.superclass._init.apply(this, arguments);
        var isInit = false;
        var want2showCounter = false;

        this.storeValue = {value: o.value || {}};

        this.trigger = BI.createWidget({
            type: "bi.multi_select_trigger",
            allowEdit: o.allowEdit,
            height: o.height - (o.simple ? 1 : 2),
            valueFormatter: o.valueFormatter,
            text: o.text,
            watermark: o.watermark,
            // adapter: this.popup,
            masker: {
                offset: {
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT + 1,
                },
            },
            searcher: {
                type: "bi.multi_tree_searcher",
                itemsCreator: o.itemsCreator
            },
            value: {value: o.value || {}}
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            cls: (o.simple ? "bi-border-bottom" : "bi-border") + " bi-border-radius",
            toggle: !o.allowEdit,
            container: o.container,
            el: this.trigger,
            adjustLength: 1,
            popup: {
                type: "bi.multi_tree_popup_view",
                ref: function () {
                    self.popup = this;
                    self.trigger.setAdapter(this);
                    self.numberCounter.setAdapter(this);
                },
                listeners: [{
                    eventName: BI.MultiTreePopup.EVENT_AFTERINIT,
                    action: function () {
                        self.numberCounter.adjustView();
                        isInit = true;
                        if (want2showCounter === true) {
                            showCounter();
                        }
                    }
                }, {
                    eventName: BI.MultiTreePopup.EVENT_CHANGE,
                    action: function () {
                        change = true;
                        var val = {
                            type: BI.Selection.Multi,
                            value: this.hasChecked() ? this.getValue() : {}
                        };
                        self.trigger.getSearcher().setState(val);
                        self.numberCounter.setButtonChecked(val);
                        self.fireEvent(BI.MultiTreeCombo.EVENT_CLICK_ITEM, self.combo.getValue());
                    }
                }, {
                    eventName: BI.MultiTreePopup.EVENT_CLICK_CONFIRM,
                    action: function () {
                        self.combo.hideView();
                    }
                }, {
                    eventName: BI.MultiTreePopup.EVENT_CLICK_CLEAR,
                    action: function () {
                        clear = true;
                        self.setValue();
                        self._defaultState();
                    }
                }],
                itemsCreator: o.itemsCreator,
                onLoaded: function () {
                    BI.nextTick(function () {
                        self.numberCounter.adjustView();
                        self.trigger.getSearcher().adjustView();
                    });
                },
                maxWidth: o.isNeedAdjustWidth ? "auto" : 500,
            },
            isNeedAdjustWidth: o.isNeedAdjustWidth,
            value: {value: o.value || {}},
            hideChecker: function (e) {
                return triggerBtn.element.find(e.target).length === 0 &&
                    self.numberCounter.element.find(e.target).length === 0;
            }
        });

        var change = false;
        var clear = false;          // 标识当前是否点击了清空

        var isSearching = function () {
            return self.trigger.getSearcher().isSearching();
        };

        var isPopupView = function () {
            return self.combo.isViewVisible();
        };

        this.trigger.on(BI.MultiSelectTrigger.EVENT_FOCUS, function () {
            self.fireEvent(BI.MultiTreeCombo.EVENT_FOCUS);
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_BLUR, function () {
            self.fireEvent(BI.MultiTreeCombo.EVENT_BLUR);
        });

        this.trigger.on(BI.MultiSelectTrigger.EVENT_START, function () {
            self.storeValue = {value: self.combo.getValue()};
            this.setValue(self.storeValue);
            self.numberCounter.setValue(self.storeValue);
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_STOP, function () {
            self.storeValue = {value: this.getValue()};
            self.combo.setValue(self.storeValue);
            self.numberCounter.setValue(self.storeValue);
            BI.nextTick(function () {
                if (isPopupView()) {
                    self.combo.populate();
                }
            });
            self.fireEvent(BI.MultiTreeCombo.EVENT_STOP);
        });

        this.trigger.on(BI.MultiSelectTrigger.EVENT_SEARCHING, function () {
            self.fireEvent(BI.MultiTreeCombo.EVENT_SEARCHING);
        });

        function showCounter () {
            if (isSearching()) {
                self.storeValue = {value: self.trigger.getValue()};
            } else if (isPopupView()) {
                self.storeValue = {value: self.combo.getValue()};
            }
            self.trigger.setValue(self.storeValue);
            self.numberCounter.setValue(self.storeValue);
        }

        this.trigger.on(BI.MultiSelectTrigger.EVENT_TRIGGER_CLICK, function () {
            self.combo.toggle();
        });
        this.trigger.on(BI.MultiSelectTrigger.EVENT_COUNTER_CLICK, function () {
            if (!self.combo.isViewVisible()) {
                self.combo.showView();
            }
        });

        this.trigger.on(BI.MultiSelectTrigger.EVENT_CHANGE, function () {
            var checked = this.getSearcher().hasChecked();
            var val = {
                type: BI.Selection.Multi,
                value: checked ? {1: 1} : {}
            };
            this.getSearcher().setState(checked ? BI.Selection.Multi : BI.Selection.None);
            self.numberCounter.setButtonChecked(val);
            self.fireEvent(BI.MultiTreeCombo.EVENT_CLICK_ITEM, self.combo.getValue());
        });

        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            if (isSearching()) {
                return;
            }
            if (change === true) {
                self.storeValue = {value: self.combo.getValue()};
                change = false;
            }
            self.combo.setValue(self.storeValue);
            self.numberCounter.setValue(self.storeValue);
            self.populate();
            self.fireEvent(BI.MultiTreeCombo.EVENT_BEFORE_POPUPVIEW);
        });
        this.combo.on(BI.Combo.EVENT_BEFORE_HIDEVIEW, function () {
            if (isSearching()) {
                self._stopEditing();
                self.fireEvent(BI.MultiTreeCombo.EVENT_CONFIRM);
            } else {
                if (isPopupView()) {
                    self._stopEditing();
                    self.storeValue = {value: self.combo.getValue()};
                    if (clear === true) {
                        self.storeValue = {value: {}};
                    }
                    self.fireEvent(BI.MultiTreeCombo.EVENT_CONFIRM);
                }
            }
            clear = false;
            change = false;
        });

        var triggerBtn = BI.createWidget({
            type: "bi.trigger_icon_button",
            width: o.height,
            height: o.height,
            cls: "multi-select-trigger-icon-button"
        });
        triggerBtn.on(BI.TriggerIconButton.EVENT_CHANGE, function () {
            self.numberCounter.hideView();
            if (self.combo.isViewVisible()) {
                self.combo.hideView();
            } else {
                self.combo.showView();
            }
        });

        this.numberCounter = BI.createWidget({
            type: "bi.multi_select_check_selected_switcher",
            el: {
                type: "bi.multi_tree_check_selected_button"
            },
            popup: {
                type: "bi.multi_tree_check_pane"
            },
            masker: {
                offset: {
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT + 1,
                },
            },
            itemsCreator: o.itemsCreator,
            valueFormatter: o.valueFormatter,
            value: {value: o.value || {}}
        });
        this.numberCounter.on(BI.MultiSelectCheckSelectedSwitcher.EVENT_TRIGGER_CHANGE, function () {
            if (!self.combo.isViewVisible()) {
                self.combo.showView();
            }
        });
        this.numberCounter.on(BI.MultiSelectCheckSelectedSwitcher.EVENT_BEFORE_POPUPVIEW, function () {
            if (want2showCounter === false) {
                want2showCounter = true;
            }
            if (isInit === true) {
                want2showCounter = null;
                showCounter();
            }
        });

        this.numberCounter.on(BI.Events.VIEW, function (b) {
            BI.nextTick(function () {// 自动调整宽度
                self.trigger.refreshPlaceHolderWidth((b === true ? self.numberCounter.element.outerWidth() + 8 : 0));
            });
        });

        this.numberCounter.on(BI.MultiSelectCheckSelectedSwitcher.EVENT_AFTER_HIDEVIEW, function () {
            BI.nextTick(function () {// 收起时自动调整宽度
                self.trigger.refreshPlaceHolderWidth(0);
            });
        });

        this.trigger.element.click(function (e) {
            if (self.trigger.element.find(e.target).length > 0) {
                self.numberCounter.hideView();
            }
        });

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.combo,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }, {
                el: triggerBtn,
                right: 0,
                top: 0,
                bottom: 0
            }, {
                el: {
                    type: "bi.vertical_adapt",
                    items: [this.numberCounter]
                },
                right: o.height,
                top: 0,
                bottom: 0
            }]
        });
    },

    _stopEditing: function() {
        this.trigger.stopEditing();
        this.numberCounter.hideView();
    },

    _defaultState: function () {
        this._stopEditing();
        this.combo.hideView();
    },

    showView: function () {
        this.combo.showView();
    },

    hideView: function () {
        this.combo.hideView();
    },

    setValue: function (v) {
        this.storeValue.value = v || {};
        this.combo.setValue({
            value: v || {}
        });
        this.numberCounter.setValue({
            value: v || {}
        });
    },

    getSearcher: function () {
        return this.trigger.getSearcher();
    },

    getValue: function () {
        return BI.deepClone(this.storeValue.value);
    },

    populate: function () {
        this.combo.populate();
    },

    focus: function () {
        this.trigger.focus();
    },

    blur: function () {
        this.trigger.blur();
    },

    setWaterMark: function (v) {
        this.trigger.setWaterMark(v);
    }
});

BI.MultiTreeCombo.EVENT_FOCUS = "EVENT_FOCUS";
BI.MultiTreeCombo.EVENT_BLUR = "EVENT_BLUR";
BI.MultiTreeCombo.EVENT_STOP = "EVENT_STOP";
BI.MultiTreeCombo.EVENT_SEARCHING = "EVENT_SEARCHING";
BI.MultiTreeCombo.EVENT_CLICK_ITEM = "EVENT_CLICK_ITEM";
BI.MultiTreeCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.MultiTreeCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";

BI.shortcut("bi.multi_tree_combo", BI.MultiTreeCombo);
