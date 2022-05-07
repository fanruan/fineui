BI.DynamicYearQuarterCombo = BI.inherit(BI.Widget, {

    _consts:{
        iconWidth: 24
    },
    props: {
        baseCls: "bi-year-quarter-combo",
        behaviors: {},
        minDate: "1900-01-01", // 最小日期
        maxDate: "2099-12-31", // 最大日期
        height: 24,
        supportDynamic: true,
        isNeedAdjustHeight: false,
        isNeedAdjustWidth: false
    },

    _init: function () {
        var self = this, o = this.options;
        BI.DynamicYearQuarterCombo.superclass._init.apply(this, arguments);
        this.storeValue = o.value;
        var border = o.simple ? 1 : 2;
        self.storeTriggerValue = "";
        this.trigger = BI.createWidget({
            type: "bi.dynamic_year_quarter_trigger",
            simple: o.simple,
            min: o.minDate,
            max: o.maxDate,
            height: o.height - border,
            value: o.value || ""
        });
        this.trigger.on(BI.DynamicYearQuarterTrigger.EVENT_KEY_DOWN, function () {
            self.combo.isViewVisible() && self.combo.hideView();
        });
        this.trigger.on(BI.DynamicYearQuarterTrigger.EVENT_START, function () {
            self.combo.isViewVisible() && self.combo.hideView();
        });
        this.trigger.on(BI.DynamicYearQuarterTrigger.EVENT_STOP, function () {
            self.combo.showView();
        });
        this.trigger.on(BI.DynamicYearQuarterTrigger.EVENT_ERROR, function () {
            self.combo.isViewVisible() && self.combo.hideView();
            self.comboWrapper.element.addClass("error");
            self.fireEvent(BI.DynamicYearQuarterCombo.EVENT_ERROR);
        });
        this.trigger.on(BI.DynamicYearQuarterTrigger.EVENT_VALID, function () {
            self.comboWrapper.element.removeClass("error");
            self.fireEvent(BI.DynamicYearMonthCombo.EVENT_VALID);
        });
        this.trigger.on(BI.DynamicYearQuarterTrigger.EVENT_CONFIRM, function () {
            var dateStore = self.storeTriggerValue;
            var dateObj = self.trigger.getKey();
            if (BI.isEqual(dateObj, dateStore)) {
                return;
            }
            if (BI.isNotEmptyString(dateObj) && !BI.isEqual(dateObj, dateStore)) {
                self.storeValue = self.trigger.getValue();
                self.setValue(self.trigger.getValue());
            }
            self._checkDynamicValue(self.storeValue);
            self.fireEvent(BI.DynamicYearQuarterCombo.EVENT_CONFIRM);
        });
        this.trigger.on(BI.DynamicYearQuarterTrigger.EVENT_FOCUS, function () {
            self.storeTriggerValue = self.trigger.getKey();
            self.fireEvent(BI.DynamicYearQuarterCombo.EVENT_FOCUS);
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            container: o.container,
            isNeedAdjustHeight: o.isNeedAdjustHeight,
            isNeedAdjustWidth: o.isNeedAdjustWidth,
            el: this.trigger,
            destroyWhenHide: true,
            adjustLength: 1,
            popup: {
                minWidth: 85,
                stopPropagation: false,
                el: {
                    type: "bi.dynamic_year_quarter_popup",
                    width: o.isNeedAdjustWidth ? o.width : undefined,
                    supportDynamic: o.supportDynamic,
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
                            self.setValue({ type: BI.DynamicYearMonthCombo.Static, value: { year: date.getFullYear(), quarter: BI.getQuarter(date) } });
                            self.combo.hideView();
                            self.fireEvent(BI.DynamicDateCombo.EVENT_CONFIRM);
                        }
                    }, {
                        eventName: BI.DynamicYearQuarterPopup.BUTTON_OK_EVENT_CHANGE,
                        action: function () {
                            var value = self.popup.getValue();
                            if (self._checkValue(value)) {
                                self.setValue(value);
                            }
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
            self.popup.setMinDate(o.minDate);
            self.popup.setMaxDate(o.maxDate);
            self.popup.setValue(self.storeValue);
            self.fireEvent(BI.DynamicYearQuarterCombo.EVENT_BEFORE_POPUPVIEW);
        });

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.htape",
                    cls: (o.simple ? "bi-border-bottom" : "bi-border") + " bi-border-radius bi-focus-shadow",
                    ref: function () {
                        self.comboWrapper = this;
                    },
                    items: [{
                        el: {
                            type: "bi.icon_button",
                            cls: "bi-trigger-icon-button",
                            width: this._consts.iconWidth,
                            height: o.height - border,
                            ref: function () {
                                self.changeIcon = this;
                            }
                        },
                        width: this._consts.iconWidth
                    }, this.combo]
                },
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }]
        });
        this._checkDynamicValue(o.value);
    },

    _checkDynamicValue: function (v) {
        var type = null;
        if (BI.isNotNull(v)) {
            type = v.type;
        }
        switch (type) {
            case BI.DynamicYearQuarterCombo.Dynamic:
                this.changeIcon.setVisible(true);
                this.comboWrapper.attr("items")[0].width = this.options.height - this.options.simple ? 1 : 2;
                this.comboWrapper.resize();
                break;
            default:
                this.comboWrapper.attr("items")[0].width = 0;
                this.comboWrapper.resize();
                this.changeIcon.setVisible(false);
                break;
        }
    },

    _checkValue: function (v) {
        var o = this.options;
        switch (v.type) {
            case BI.DynamicDateCombo.Dynamic:
                return BI.isNotEmptyObject(v.value);
            case BI.DynamicDateCombo.Static:
                var value = v.value || {};

                return !BI.checkDateVoid(value.year, (value.quarter - 1) * 3 + 1, 1, o.minDate, o.maxDate)[0];
            default:
                return true;
        }
    },

    setMinDate: function (minDate) {
        var o = this.options;
        o.minDate = minDate;
        this.trigger.setMinDate(minDate);
        this.popup && this.popup.setMinDate(minDate);
    },

    setMaxDate: function (maxDate) {
        var o = this.options;
        o.maxDate = maxDate;
        this.trigger.setMaxDate(maxDate);
        this.popup && this.popup.setMaxDate(maxDate);
    },

    hideView: function () {
        this.combo.hideView();
    },

    getKey: function () {
        return this.trigger.getKey();
    },

    setValue: function (v) {
        this.storeValue = v;
        this.trigger.setValue(v);
        this._checkDynamicValue(v);
    },

    getValue: function () {
        return this.storeValue;
    },

    isStateValid: function () {
        return this.trigger.isStateValid();
    }

});
BI.DynamicYearQuarterCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DynamicYearQuarterCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.DynamicYearQuarterCombo.EVENT_ERROR = "EVENT_ERROR";
BI.DynamicYearQuarterCombo.EVENT_VALID = "EVENT_VALID";
BI.DynamicYearQuarterCombo.EVENT_FOCUS = "EVENT_FOCUS";
BI.shortcut("bi.dynamic_year_quarter_combo", BI.DynamicYearQuarterCombo);

BI.extend(BI.DynamicYearQuarterCombo, {
    Static: 1,
    Dynamic: 2
});
