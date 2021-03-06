BI.DynamicYearMonthCombo = BI.inherit(BI.Single, {

    props: {
        baseCls: "bi-year-month-combo bi-border bi-focus-shadow",
        behaviors: {},
        minDate: "1900-01-01", // 最小日期
        maxDate: "2099-12-31", // 最大日期
        height: 22
    },

    _init: function () {
        BI.DynamicYearMonthCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.storeValue = o.value;
        this.storeTriggerValue = "";
        this.trigger = BI.createWidget({
            type: "bi.dynamic_year_month_trigger",
            min: o.minDate,
            max: o.maxDate,
            height: o.height,
            value: o.value || ""
        });
        this.trigger.on(BI.DynamicYearMonthTrigger.EVENT_KEY_DOWN, function () {
            self.combo.isViewVisible() && self.combo.hideView();
        });
        this.trigger.on(BI.DynamicYearMonthTrigger.EVENT_START, function () {
            self.combo.isViewVisible() && self.combo.hideView();
        });
        this.trigger.on(BI.DynamicYearMonthTrigger.EVENT_STOP, function () {
            self.combo.showView();
        });
        this.trigger.on(BI.DynamicYearMonthTrigger.EVENT_ERROR, function () {
            self.combo.isViewVisible() && self.combo.hideView();
            self.fireEvent(BI.DynamicYearMonthCombo.EVENT_ERROR);
        });
        this.trigger.on(BI.DynamicYearMonthTrigger.EVENT_VALID, function () {
            self.fireEvent(BI.DynamicYearMonthCombo.EVENT_VALID);
        });
        this.trigger.on(BI.DynamicYearMonthTrigger.EVENT_CONFIRM, function () {
            // 没看出来干啥的，先去掉
            // if (self.combo.isViewVisible()) {
            //     return;
            // }
            var dateStore = self.storeTriggerValue;
            var dateObj = self.trigger.getKey();
            if (BI.isNotEmptyString(dateObj) && !BI.isEqual(dateObj, dateStore)) {
                self.storeValue = self.trigger.getValue();
                self.setValue(self.trigger.getValue());
            }
            self._checkDynamicValue(self.storeValue);
            self.fireEvent(BI.DynamicYearMonthCombo.EVENT_CONFIRM);
        });
        this.trigger.on(BI.DynamicYearMonthTrigger.EVENT_FOCUS, function () {
            self.storeTriggerValue = self.trigger.getKey();
            self.fireEvent(BI.DynamicYearMonthCombo.EVENT_FOCUS);
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            container: o.container,
            isNeedAdjustHeight: false,
            isNeedAdjustWidth: false,
            el: this.trigger,
            popup: {
                minWidth: 100,
                stopPropagation: false,
                el: {
                    type: "bi.dynamic_year_month_popup",
                    ref: function () {
                        self.popup = this;
                    },
                    listeners: [{
                        eventName: BI.DynamicYearMonthPopup.EVENT_CHANGE,
                        action: function () {
                            self.setValue(self.popup.getValue());
                            self.combo.hideView();
                            self.fireEvent(BI.DynamicYearMonthCombo.EVENT_CONFIRM);
                        }
                    }, {
                        eventName: BI.DynamicYearMonthPopup.BUTTON_CLEAR_EVENT_CHANGE,
                        action: function () {
                            self.setValue();
                            self.combo.hideView();
                            self.fireEvent(BI.DynamicYearMonthCombo.EVENT_CONFIRM);
                        }
                    }, {
                        eventName: BI.DynamicYearMonthPopup.BUTTON_lABEL_EVENT_CHANGE,
                        action: function () {
                            var date = BI.getDate();
                            self.setValue({type: BI.DynamicYearMonthCombo.Static, value: {year: date.getFullYear(), month: date.getMonth() + 1}});
                            self.combo.hideView();
                            self.fireEvent(BI.DynamicDateCombo.EVENT_CONFIRM);
                        }
                    }, {
                        eventName: BI.DynamicYearMonthPopup.BUTTON_OK_EVENT_CHANGE,
                        action: function () {
                            self.setValue(self.popup.getValue());
                            self.combo.hideView();
                            self.fireEvent(BI.DynamicDateCombo.EVENT_CONFIRM);
                        }
                    }],
                    behaviors: o.behaviors,
                    min: o.minDate,
                    max: o.maxDate
                },
                value: o.value || ""
            }
        });
        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.popup.setValue(self.storeValue);
            self.fireEvent(BI.DynamicYearMonthCombo.EVENT_BEFORE_POPUPVIEW);
        });

        BI.createWidget({
            type: "bi.htape",
            element: this,
            ref: function () {
                self.comboWrapper = this;
            },
            items: [{
                el: {
                    type: "bi.icon_button",
                    cls: "bi-trigger-icon-button date-change-h-font",
                    width: 24,
                    height: 24,
                    ref: function () {
                        self.changeIcon = this;
                    }
                },
                width: 24
            }, this.combo]
        });
        this._checkDynamicValue(o.value);
    },

    _checkDynamicValue: function (v) {
        var type = null;
        if (BI.isNotNull(v)) {
            type = v.type;
        }
        switch (type) {
            case BI.DynamicYearMonthCombo.Dynamic:
                this.changeIcon.setVisible(true);
                this.comboWrapper.attr("items")[0].width = 24;
                this.comboWrapper.resize();
                break;
            default:
                this.comboWrapper.attr("items")[0].width = 0;
                this.comboWrapper.resize();
                this.changeIcon.setVisible(false);
                break;
        }
    },

    hideView: function () {
        this.combo.hideView();
    },

    setValue: function (v) {
        this.storeValue = v;
        this.trigger.setValue(v);
        this._checkDynamicValue(v);
    },

    getValue: function () {
        return this.storeValue;
    },

    getKey: function () {
        return this.trigger.getKey();
    },

    isValid: function () {
        return this.trigger.isValid();
    }

});
BI.DynamicYearMonthCombo.EVENT_ERROR = "EVENT_ERROR";
BI.DynamicYearMonthCombo.EVENT_VALID = "EVENT_VALID";
BI.DynamicYearMonthCombo.EVENT_FOCUS = "EVENT_FOCUS";
BI.DynamicYearMonthCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DynamicYearMonthCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.shortcut("bi.dynamic_year_month_combo", BI.DynamicYearMonthCombo);

BI.extend(BI.DynamicYearMonthCombo, {
    Static: 1,
    Dynamic: 2
});