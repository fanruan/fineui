BI.DynamicYearCombo = BI.inherit(BI.Widget, {

    _const: {
        iconWidth: 24
    },

    props: {
        baseCls: "bi-year-combo",
        behaviors: {},
        minDate: "1900-01-01", // 最小日期
        maxDate: "2099-12-31", // 最大日期
        height: 24,
        supportDynamic: true
    },

    _init: function () {
        var self = this, o = this.options;
        BI.DynamicYearCombo.superclass._init.apply(this, arguments);
        this.storeValue = o.value;
        var border = o.simple ? 1 : 2;
        this.trigger = BI.createWidget({
            type: "bi.dynamic_year_trigger",
            simple: o.simple,
            min: o.minDate,
            max: o.maxDate,
            height: o.height - border,
            value: o.value || "",
            watermark: o.watermark
        });
        this.trigger.on(BI.DynamicYearTrigger.EVENT_KEY_DOWN, function () {
            if (self.combo.isViewVisible()) {
                self.combo.hideView();
            }
        });
        this.trigger.on(BI.DynamicYearTrigger.EVENT_FOCUS, function () {
            self.storeTriggerValue = this.getKey();
            self.fireEvent(BI.DynamicYearCombo.EVENT_FOCUS);
        });
        this.trigger.on(BI.DynamicYearTrigger.EVENT_START, function () {
            self.combo.isViewVisible() && self.combo.hideView();
        });
        this.trigger.on(BI.DynamicYearTrigger.EVENT_STOP, function () {
            self.combo.showView();
        });
        this.trigger.on(BI.DynamicYearTrigger.EVENT_ERROR, function () {
            self.combo.isViewVisible() && self.combo.hideView();
            self.comboWrapper.element.addClass("error");
            self.fireEvent(BI.DynamicYearCombo.EVENT_ERROR);
        });
        this.trigger.on(BI.DynamicYearTrigger.EVENT_VALID, function () {
            self.comboWrapper.element.removeClass("error");
            self.fireEvent(BI.DynamicYearCombo.EVENT_VALID);
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
            self._checkDynamicValue(self.storeValue);
            self.fireEvent(BI.DynamicYearCombo.EVENT_CONFIRM);
        });

        this.combo = BI.createWidget({
            type: "bi.combo",
            container: o.container,
            isNeedAdjustHeight: false,
            isNeedAdjustWidth: false,
            el: this.trigger,
            destroyWhenHide: true,
            adjustLength: 1,
            popup: {
                minWidth: 85,
                stopPropagation: false,
                el: {
                    type: "bi.dynamic_year_popup",
                    supportDynamic: o.supportDynamic,
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
                            self.setValue({ type: BI.DynamicYearCombo.Static, value: { year: date.getFullYear() } });
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
            self.fireEvent(BI.DynamicYearCombo.EVENT_BEFORE_POPUPVIEW);
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
                            width: this._const.iconWidth,
                            height: o.height - border,
                            ref: function () {
                                self.changeIcon = this;
                            }
                        },
                        width: this._const.iconWidth
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
            case BI.DynamicYearCombo.Dynamic:
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
        return this.trigger.getKey() + "";
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
        return this.trigger.isValid();
    },

    setWaterMark: function (v) {
        this.trigger.setWaterMark(v);
    }
});
BI.DynamicYearCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DynamicYearCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.DynamicYearCombo.EVENT_ERROR = "EVENT_ERROR";
BI.DynamicYearCombo.EVENT_VALID = "EVENT_VALID";
BI.DynamicYearCombo.EVENT_FOCUS = "EVENT_FOCUS";
BI.shortcut("bi.dynamic_year_combo", BI.DynamicYearCombo);

BI.extend(BI.DynamicYearCombo, {
    Static: 1,
    Dynamic: 2
});
