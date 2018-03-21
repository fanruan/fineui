BI.DynamicYearQuarterCombo = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-year-quarter-combo",
        behaviors: {},
        min: "1900-01-01", // 最小日期
        max: "2099-12-31", // 最大日期
        height: 25
    },

    _init: function () {
        BI.DynamicYearQuarterCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.storeValue = o.value;
        this.trigger = BI.createWidget({
            type: "bi.dynamic_year_quarter_trigger",
            min: o.min,
            max: o.max,
            value: o.value || ""
        });
        this.trigger.on(BI.DynamicYearQuarterTrigger.EVENT_START, function () {
            self.combo.isViewVisible() && self.combo.hideView();
        });
        this.trigger.on(BI.DynamicYearQuarterTrigger.EVENT_STOP, function () {
            self.combo.showView();
        });
        this.trigger.on(BI.DynamicYearQuarterTrigger.EVENT_ERROR, function () {
            self.combo.isViewVisible() && self.combo.hideView();
        });
        this.trigger.on(BI.DynamicYearQuarterTrigger.EVENT_CONFIRM, function () {
            if (self.combo.isViewVisible()) {
                return;
            }
            self.storeValue = self.trigger.getValue();
            self.fireEvent(BI.DynamicYearQuarterCombo.EVENT_CONFIRM);
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
                    type: "bi.dynamic_year_quarter_popup",
                    ref: function () {
                        self.popup = this;
                    },
                    listeners: [{
                        eventName: BI.DynamicYearQuarterPopup.EVENT_CHANGE,
                        action: function () {
                            self.setValue(self.popup.getValue());
                            self.combo.hideView();
                            self.fireEvent(BI.DynamicYearQuarterCombo.EVENT_CONFIRM);
                        }
                    }, {
                        eventName: BI.DynamicYearQuarterPopup.BUTTON_CLEAR_EVENT_CHANGE,
                        action: function () {
                            self.setValue();
                            self.combo.hideView();
                            self.fireEvent(BI.DynamicYearQuarterCombo.EVENT_CONFIRM);
                        }
                    }, {
                        eventName: BI.DynamicYearQuarterPopup.BUTTON_lABEL_EVENT_CHANGE,
                        action: function () {
                            var date = BI.getDate();
                            self.setValue({year: date.getFullYear()});
                            self.combo.hideView();
                            self.fireEvent(BI.DynamicDateCombo.EVENT_CONFIRM);
                        }
                    }, {
                        eventName: BI.DynamicYearQuarterPopup.BUTTON_OK_EVENT_CHANGE,
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
            self.fireEvent(BI.DynamicYearQuarterCombo.EVENT_BEFORE_POPUPVIEW);
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
BI.DynamicYearQuarterCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DynamicYearQuarterCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.shortcut("bi.dynamic_year_quarter_combo", BI.DynamicYearQuarterCombo);

BI.extend(BI.DynamicYearQuarterCombo, {
    Static: 1,
    Dynamic: 2
});