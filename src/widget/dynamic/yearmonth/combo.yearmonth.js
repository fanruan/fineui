BI.DynamicYearMonthCombo = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-year-month-combo",
        behaviors: {},
        min: "1900-01-01", // 最小日期
        max: "2099-12-31", // 最大日期
        height: 25
    },

    _init: function () {
        BI.DynamicYearMonthCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.storeValue = o.value;
        this.trigger = BI.createWidget({
            type: "bi.dynamic_year_month_trigger",
            min: o.min,
            max: o.max,
            value: o.value || ""
        });
        this.trigger.on(BI.DynamicYearMonthTrigger.EVENT_START, function () {
            self.combo.isViewVisible() && self.combo.hideView();
        });
        this.trigger.on(BI.DynamicYearMonthTrigger.EVENT_STOP, function () {
            self.combo.showView();
        });
        this.trigger.on(BI.DynamicYearMonthTrigger.EVENT_ERROR, function () {
            self.combo.isViewVisible() && self.combo.hideView();
        });
        this.trigger.on(BI.DynamicYearMonthTrigger.EVENT_CONFIRM, function () {
            if (self.combo.isViewVisible()) {
                return;
            }
            self.storeValue = self.trigger.getValue();
            self.fireEvent(BI.DynamicYearMonthCombo.EVENT_CONFIRM);
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            isNeedAdjustHeight: false,
            isNeedAdjustWidth: false,
            el: this.trigger,
            popup: {
                minWidth: 85,
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
                            self.setValue({year: date.getFullYear()});
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
                    min: o.min,
                    max: o.max
                },
                value: o.value || ""
            }
        });
        this.combo.on(BI.Combo.EVENT_BEFORE_POPUPVIEW, function () {
            self.popup.setValue(self.storeValue);
            self.fireEvent(BI.DynamicYearMonthCombo.EVENT_BEFORE_POPUPVIEW);
        });
    },

    setValue: function (v) {
        this.storeValue = v;
        this.trigger.setValue(v);
    },

    getValue: function () {
        return this.storeValue;
    }

});
BI.DynamicYearMonthCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DynamicYearMonthCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.shortcut("bi.dynamic_year_month_combo", BI.DynamicYearMonthCombo);

BI.extend(BI.DynamicYearMonthCombo, {
    Static: 1,
    Dynamic: 2
});