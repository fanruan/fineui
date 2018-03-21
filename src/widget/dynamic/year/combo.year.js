BI.DynamicYearCombo = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-year-combo",
        behaviors: {},
        min: "1900-01-01", // 最小日期
        max: "2099-12-31", // 最大日期
        height: 25
    },

    _init: function () {
        BI.DynamicYearCombo.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.storeValue = o.value;
        this.trigger = BI.createWidget({
            type: "bi.dynamic_year_trigger",
            min: o.min,
            max: o.max,
            value: o.value || ""
        });
        this.trigger.on(BI.DynamicYearTrigger.EVENT_FOCUS, function () {
            self.storeTriggerValue = this.getKey();
        });
        this.trigger.on(BI.DynamicYearTrigger.EVENT_START, function () {
            self.combo.isViewVisible() && self.combo.hideView();
        });
        this.trigger.on(BI.DynamicYearTrigger.EVENT_STOP, function () {
            self.combo.showView();
        });
        this.trigger.on(BI.DynamicYearTrigger.EVENT_ERROR, function () {
            self.combo.isViewVisible() && self.combo.hideView();
        });
        this.trigger.on(BI.DynamicYearTrigger.EVENT_CONFIRM, function () {
            if (self.combo.isViewVisible()) {
                return;
            }
            if (this.getKey() && this.getKey() !== self.storeTriggerValue) {
                self.storeValue = self.trigger.getValue();
                self.setValue(self.storeValue);
            } else if (!this.getKey()) {
                self.storeValue = null;
                self.setValue();
            }
            self.fireEvent(BI.DynamicYearCombo.EVENT_CONFIRM);
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
                    type: "bi.dynamic_year_popup",
                    ref: function () {
                        self.popup = this;
                    },
                    listeners: [{
                        eventName: BI.DynamicYearPopup.EVENT_CHANGE,
                        action: function () {
                            self.setValue(self.popup.getValue());
                            self.combo.hideView();
                            self.fireEvent(BI.DynamicYearCombo.EVENT_CONFIRM);
                        }
                    }, {
                        eventName: BI.DynamicYearPopup.BUTTON_CLEAR_EVENT_CHANGE,
                        action: function () {
                            self.setValue();
                            self.combo.hideView();
                            self.fireEvent(BI.DynamicYearCombo.EVENT_CONFIRM);
                        }
                    }, {
                        eventName: BI.DynamicYearPopup.BUTTON_lABEL_EVENT_CHANGE,
                        action: function () {
                            var date = BI.getDate();
                            self.setValue({year: date.getFullYear()});
                            self.combo.hideView();
                            self.fireEvent(BI.DynamicDateCombo.EVENT_CONFIRM);
                        }
                    }, {
                        eventName: BI.DynamicYearPopup.BUTTON_OK_EVENT_CHANGE,
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
            self.fireEvent(BI.DynamicYearCombo.EVENT_BEFORE_POPUPVIEW);
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
BI.DynamicYearCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DynamicYearCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.shortcut("bi.dynamic_year_combo", BI.DynamicYearCombo);

BI.extend(BI.DynamicYearCombo, {
    Static: 1,
    Dynamic: 2
});