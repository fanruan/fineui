BI.DynamicDateTimeCombo = BI.inherit(BI.Single, {
    constants: {
        popupHeight: 259,
        popupWidth: 270,
        comboAdjustHeight: 1,
        border: 1,
        DATE_MIN_VALUE: "1900-01-01",
        DATE_MAX_VALUE: "2099-12-31"
    },

    props: {
        baseCls: "bi-dynamic-date-combo bi-border",
        height: 24
    },


    render: function () {
        var self = this, opts = this.options;
        this.storeTriggerValue = "";
        var date = BI.getDate();
        this.storeValue = opts.value;
        return {
            type: "bi.htape",
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
            }, {
                type: "bi.absolute",
                items: [{
                    el: {
                        type: "bi.combo",
                        ref: function () {
                            self.combo = this;
                        },
                        toggle: false,
                        isNeedAdjustHeight: false,
                        isNeedAdjustWidth: false,
                        el: {
                            type: "bi.dynamic_date_time_trigger",
                            min: this.constants.DATE_MIN_VALUE,
                            max: this.constants.DATE_MAX_VALUE,
                            value: opts.value,
                            ref: function () {
                                self.trigger = this;
                            },
                            listeners: [{
                                eventName: BI.DynamicDateTimeTrigger.EVENT_KEY_DOWN,
                                action: function () {
                                    if (self.combo.isViewVisible()) {
                                        self.combo.hideView();
                                    }
                                }
                            }, {
                                eventName: BI.DynamicDateTimeTrigger.EVENT_STOP,
                                action: function () {
                                    if (!self.combo.isViewVisible()) {
                                        self.combo.showView();
                                    }
                                }
                            }, {
                                eventName: BI.DynamicDateTimeTrigger.EVENT_TRIGGER_CLICK,
                                action: function () {
                                    self.combo.toggle();
                                }
                            }, {
                                eventName: BI.DynamicDateTimeTrigger.EVENT_FOCUS,
                                action: function () {
                                    self.storeTriggerValue = self.trigger.getKey();
                                    if (!self.combo.isViewVisible()) {
                                        self.combo.showView();
                                    }
                                    self.fireEvent(BI.DynamicDateTimeCombo.EVENT_FOCUS);
                                }
                            }, {
                                eventName: BI.DynamicDateTimeTrigger.EVENT_ERROR,
                                action: function () {
                                    self.storeValue = {
                                        year: date.getFullYear(),
                                        month: date.getMonth() + 1
                                    };
                                    self.fireEvent(BI.DynamicDateTimeCombo.EVENT_ERROR);
                                }
                            }, {
                                eventName: BI.DynamicDateTimeTrigger.EVENT_VALID,
                                action: function () {
                                    self.fireEvent(BI.DynamicDateTimeCombo.EVENT_VALID);
                                }
                            }, {
                                eventName: BI.DynamicDateTimeTrigger.EVENT_CHANGE,
                                action: function () {
                                    self.fireEvent(BI.DynamicDateTimeCombo.EVENT_CHANGE);
                                }
                            }, {
                                eventName: BI.DynamicDateTimeTrigger.EVENT_CONFIRM,
                                action: function () {
                                    if (self.combo.isViewVisible()) {
                                        return;
                                    }
                                    var dateStore = self.storeTriggerValue;
                                    var dateObj = self.trigger.getKey();
                                    if (BI.isNotEmptyString(dateObj) && !BI.isEqual(dateObj, dateStore)) {
                                        self.storeValue = self.trigger.getValue();
                                        self.setValue(self.trigger.getValue());
                                    } else if (BI.isEmptyString(dateObj)) {
                                        self.storeValue = null;
                                        self.trigger.setValue();
                                    }
                                    self._checkDynamicValue(self.storeValue);
                                    self.fireEvent(BI.DynamicDateTimeCombo.EVENT_CONFIRM);
                                }
                            }]
                        },
                        adjustLength: this.constants.comboAdjustHeight,
                        popup: {
                            el: {
                                type: "bi.dynamic_date_time_popup",
                                min: this.constants.DATE_MIN_VALUE,
                                max: this.constants.DATE_MAX_VALUE,
                                value: opts.value,
                                ref: function () {
                                    self.popup = this;
                                },
                                listeners: [{
                                    eventName: BI.DynamicDateTimePopup.BUTTON_CLEAR_EVENT_CHANGE,
                                    action: function () {
                                        self.setValue();
                                        self.combo.hideView();
                                        self.fireEvent(BI.DynamicDateTimeCombo.EVENT_CONFIRM);
                                    }
                                }, {
                                    eventName: BI.DynamicDateTimePopup.BUTTON_lABEL_EVENT_CHANGE,
                                    action: function () {
                                        var date = BI.getDate();
                                        self.setValue({
                                            year: date.getFullYear(),
                                            month: date.getMonth() + 1,
                                            day: date.getDate(),
                                            hour: 0,
                                            minute: 0,
                                            second: 0
                                        });
                                        self.combo.hideView();
                                        self.fireEvent(BI.DynamicDateTimeCombo.EVENT_CONFIRM);
                                    }
                                }, {
                                    eventName: BI.DynamicDateTimePopup.BUTTON_OK_EVENT_CHANGE,
                                    action: function () {
                                        self.setValue(self.popup.getValue());
                                        self.combo.hideView();
                                        self.fireEvent(BI.DynamicDateTimeCombo.EVENT_CONFIRM);
                                    }
                                }, {
                                    eventName: BI.DynamicDateTimePopup.EVENT_CHANGE,
                                    action: function () {
                                        self.setValue(self.popup.getValue());
                                        self.combo.hideView();
                                        self.fireEvent(BI.DynamicDateTimeCombo.EVENT_CONFIRM);
                                    }
                                }]
                            },
                            stopPropagation: false
                        },
                        listeners: [{
                            eventName: BI.Combo.EVENT_BEFORE_POPUPVIEW,
                            action: function () {
                                self.popup.setValue(self.storeValue);
                                self.fireEvent(BI.DynamicDateTimeCombo.EVENT_BEFORE_POPUPVIEW);
                            }
                        }]
                    },
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0
                }, {
                    el: {
                        type: "bi.icon_button",
                        cls: "bi-trigger-icon-button date-font",
                        width: 24,
                        height: 24,
                        listeners: [{
                            eventName: BI.IconButton.EVENT_CHANGE,
                            action: function () {
                                if (self.combo.isViewVisible()) {
                                    self.combo.hideView();
                                } else {
                                    self.combo.showView();
                                }
                            }
                        }]
                    },
                    top: 0,
                    right: 0
                }]
            }],
            ref: function (_ref) {
                self.comboWrapper = _ref;
            }
        };
    },

    mounted: function () {
        this._checkDynamicValue(this.options.value);
    },

    _checkDynamicValue: function (v) {
        var type = null;
        if (BI.isNotNull(v)) {
            type = v.type;
        }
        switch (type) {
            case BI.DynamicDateTimeCombo.Dynamic:
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
    }
});

BI.DynamicDateTimeCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DynamicDateTimeCombo.EVENT_FOCUS = "EVENT_FOCUS";
BI.DynamicDateTimeCombo.EVENT_CHANGE = "EVENT_CHANGE";
BI.DynamicDateTimeCombo.EVENT_VALID = "EVENT_VALID";
BI.DynamicDateTimeCombo.EVENT_ERROR = "EVENT_ERROR";
BI.DynamicDateTimeCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";

BI.shortcut("bi.dynamic_date_time_combo", BI.DynamicDateTimeCombo);

BI.extend(BI.DynamicDateTimeCombo, {
    Static: 1,
    Dynamic: 2
});