BI.DynamicDateCombo = BI.inherit(BI.Single, {
    constants: {
        popupHeight: 259,
        popupWidth: 270,
        comboAdjustHeight: 1,
        border: 1,
        iconWidth: 24
    },

    props: {
        baseCls: "bi-dynamic-date-combo",
        height: 24,
        minDate: "1900-01-01",
        maxDate: "2099-12-31",
        format: "",
        allowEdit: true,
        supportDynamic: true,
        attributes: {
            tabIndex: -1
        },
        isNeedAdjustHeight: false,
        isNeedAdjustWidth: false
    },

    _init: function () {
        BI.DynamicDateCombo.superclass._init.apply(this, arguments);
    },

    render: function () {
        var self = this, opts = this.options;
        this.storeTriggerValue = "";
        var date = BI.getDate();
        this.storeValue = opts.value;
        var border = opts.simple ? 1 : 2;

        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.combo",
                    cls: (opts.simple ? "bi-border-bottom" : "bi-border") + " bi-border-radius bi-focus-shadow",
                    container: opts.container,
                    ref: function () {
                        self.combo = this;
                    },
                    toggle: false,
                    isNeedAdjustHeight: opts.isNeedAdjustHeight,
                    isNeedAdjustWidth: opts.isNeedAdjustWidth,
                    destroyWhenHide: true,
                    el: {
                        type: "bi.horizontal_fill",
                        columnSize: [this.constants.iconWidth, "fill"],
                        height: opts.height - border,
                        items: [{
                            el: {
                                type: "bi.icon_button",
                                cls: "bi-trigger-icon-button date-change-h-font",
                                width: opts.height - border,
                                height: opts.height - border,
                                ref: function () {
                                    self.changeIcon = this;
                                }
                            },
                        }, {
                            type: "bi.dynamic_date_trigger",
                            simple: opts.simple,
                            min: opts.minDate,
                            max: opts.maxDate,
                            format: opts.format,
                            allowEdit: opts.allowEdit,
                            watermark: opts.watermark,
                            iconWidth: opts.height - border,
                            height: opts.height - border,
                            value: opts.value,
                            ref: function () {
                                self.trigger = this;
                            },
                            listeners: [{
                                eventName: BI.DynamicDateTrigger.EVENT_KEY_DOWN,
                                action: function () {
                                    if (self.combo.isViewVisible()) {
                                        self.combo.hideView();
                                    }
                                    self.fireEvent(BI.DynamicDateCombo.EVENT_KEY_DOWN, arguments);
                                }
                            }, {
                                eventName: BI.DynamicDateTrigger.EVENT_STOP,
                                action: function () {
                                    if (!self.combo.isViewVisible()) {
                                        self.combo.showView();
                                    }
                                }
                            }, {
                                eventName: BI.DynamicDateTrigger.EVENT_FOCUS,
                                action: function () {
                                    self.storeTriggerValue = self.trigger.getKey();
                                    if (!self.combo.isViewVisible()) {
                                        self.combo.showView();
                                    }
                                    self.fireEvent(BI.DynamicDateCombo.EVENT_FOCUS);
                                }
                            }, {
                                eventName: BI.DynamicDateTrigger.EVENT_BLUR,
                                action: function () {
                                    self.fireEvent(BI.DynamicDateCombo.EVENT_BLUR);
                                }
                            }, {
                                eventName: BI.DynamicDateTrigger.EVENT_ERROR,
                                action: function () {
                                    self.storeValue = {
                                        type: BI.DynamicDateCombo.Static,
                                        value: {
                                            year: date.getFullYear(),
                                            month: date.getMonth() + 1
                                        }
                                    };
                                    self.combo.element.addClass("error");
                                    self.fireEvent(BI.DynamicDateCombo.EVENT_ERROR);
                                }
                            }, {
                                eventName: BI.DynamicDateTrigger.EVENT_VALID,
                                action: function () {
                                    self.combo.element.removeClass("error");
                                    self.fireEvent(BI.DynamicDateCombo.EVENT_VALID);
                                }
                            }, {
                                eventName: BI.DynamicDateTrigger.EVENT_CHANGE,
                                action: function () {
                                    self.fireEvent(BI.DynamicDateCombo.EVENT_CHANGE);
                                }
                            }, {
                                eventName: BI.DynamicDateTrigger.EVENT_CONFIRM,
                                action: function () {
                                    var dateStore = self.storeTriggerValue;
                                    var dateObj = self.trigger.getKey();
                                    if (self.combo.isViewVisible() || BI.isEqual(dateObj, dateStore)) {
                                        return;
                                    }
                                    if (BI.isNotEmptyString(dateObj) && !BI.isEqual(dateObj, dateStore)) {
                                        self.storeValue = self.trigger.getValue();
                                        self.setValue(self.trigger.getValue());
                                    } else if (BI.isEmptyString(dateObj)) {
                                        self.storeValue = null;
                                        self.trigger.setValue();
                                    }
                                    self._checkDynamicValue(self.storeValue);
                                    self.fireEvent(BI.DynamicDateCombo.EVENT_CONFIRM);
                                }
                            }]
                        }]
                    },
                    adjustLength: this.constants.comboAdjustHeight,
                    popup: {
                        el: {
                            type: "bi.dynamic_date_popup",
                            width: opts.isNeedAdjustWidth ? opts.width : undefined,
                            supportDynamic: opts.supportDynamic,
                            behaviors: opts.behaviors,
                            min: opts.minDate,
                            max: opts.maxDate,
                            ref: function () {
                                self.popup = this;
                            },
                            listeners: [{
                                eventName: BI.DynamicDatePopup.BUTTON_CLEAR_EVENT_CHANGE,
                                action: function () {
                                    self.setValue();
                                    self.combo.hideView();
                                    self.fireEvent(BI.DynamicDateCombo.EVENT_CONFIRM);
                                }
                            }, {
                                eventName: BI.DynamicDatePopup.BUTTON_lABEL_EVENT_CHANGE,
                                action: function () {
                                    var date = BI.getDate();
                                    self.setValue({
                                        type: BI.DynamicDateCombo.Static,
                                        value: {
                                            year: date.getFullYear(),
                                            month: date.getMonth() + 1,
                                            day: date.getDate()
                                        }
                                    });
                                    self.combo.hideView();
                                    self.fireEvent(BI.DynamicDateCombo.EVENT_CONFIRM);
                                }
                            }, {
                                eventName: BI.DynamicDatePopup.BUTTON_OK_EVENT_CHANGE,
                                action: function () {
                                    var value = self.popup.getValue();
                                    if (self._checkValue(value)) {
                                        self.setValue(value);
                                    }
                                    self.combo.hideView();
                                    self.fireEvent(BI.DynamicDateCombo.EVENT_CONFIRM);
                                }
                            }, {
                                eventName: BI.DynamicDatePopup.EVENT_CHANGE,
                                action: function () {
                                    self.setValue(self.popup.getValue());
                                    self.combo.hideView();
                                    self.fireEvent(BI.DynamicDateCombo.EVENT_CONFIRM);
                                }
                            }, {
                                eventName: BI.DynamicDatePopup.EVENT_BEFORE_YEAR_MONTH_POPUPVIEW,
                                action: function () {
                                    self.fireEvent(BI.DynamicDateCombo.EVENT_BEFORE_YEAR_MONTH_POPUPVIEW);
                                }
                            }]
                        },
                    },
                    // // DEC-4250 和复选下拉一样，点击triggerBtn不默认收起
                    // hideChecker: function (e) {
                    //     return self.triggerBtn.element.find(e.target).length === 0;
                    // },
                    listeners: [{
                        eventName: BI.Combo.EVENT_BEFORE_POPUPVIEW,
                        action: function () {
                            self.popup.setMinDate(opts.minDate);
                            self.popup.setMaxDate(opts.maxDate);
                            self.popup.setValue(self.storeValue);
                            self.fireEvent(BI.DynamicDateCombo.EVENT_BEFORE_POPUPVIEW);
                        }
                    }]
                },
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }]
        };
    },

    created: function () {
        this._checkDynamicValue(this.storeValue);
    },

    _checkDynamicValue: function (v) {
        var o = this.options;
        var type = null;
        if (BI.isNotNull(v)) {
            type = v.type;
        }
        switch (type) {
            case BI.DynamicDateCombo.Dynamic:
                this.changeIcon.setVisible(true);
                // this.comboWrapper.attr("items")[0].width = o.height - this.options.simple ? 1 : 2;
                // this.comboWrapper.resize();
                break;
            default:
                // this.comboWrapper.attr("items")[0].width = 0;
                // this.comboWrapper.resize();
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

                return !BI.checkDateVoid(value.year, value.month, value.day, o.minDate, o.maxDate)[0];
            default:
                return true;
        }
    },

    _defaultState: function () {

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
    hidePopupView: function () {
        this.combo.hideView();
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

BI.DynamicDateCombo.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.DynamicDateCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DynamicDateCombo.EVENT_FOCUS = "EVENT_FOCUS";
BI.DynamicDateCombo.EVENT_BLUR = "EVENT_BLUR";
BI.DynamicDateCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.DynamicDateCombo.EVENT_VALID = "EVENT_VALID";
BI.DynamicDateCombo.EVENT_ERROR = "EVENT_ERROR";
BI.DynamicDateCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
BI.DynamicDateCombo.EVENT_BEFORE_YEAR_MONTH_POPUPVIEW = "EVENT_BEFORE_YEAR_MONTH_POPUPVIEW";

BI.shortcut("bi.dynamic_date_combo", BI.DynamicDateCombo);

BI.extend(BI.DynamicDateCombo, {
    Static: 1,
    Dynamic: 2
});
