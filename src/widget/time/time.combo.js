/**
 * 时间选择
 * qcc
 * 2019/2/28
 */

!(function () {
    BI.TimeCombo = BI.inherit(BI.Single, {
        constants: {
            popupHeight: 80,
            popupWidth: 240,
            comboAdjustHeight: 1,
            border: 1,
            iconWidth: 24
        },
        props: {
            baseCls: "bi-time-combo",
            height: 24,
            format: "",
            allowEdit: false,
            isNeedAdjustHeight: false,
            isNeedAdjustWidth: false
        },

        _init: function () {
            var o = this.options;
            BI.TimeCombo.superclass._init.apply(this, arguments);
        },

        render: function () {
            var self = this, opts = this.options;
            this.storeTriggerValue = "";
            this.storeValue = opts.value;

            var popup = {
                type: "bi.time_popup",
                value: opts.value,
                listeners: [{
                    eventName: BI.TimePopup.BUTTON_CLEAR_EVENT_CHANGE,
                    action: function () {
                        self.setValue();
                        self.hidePopupView();
                        self.fireEvent(BI.TimeCombo.EVENT_CONFIRM);
                    }
                }, {
                    eventName: BI.TimePopup.BUTTON_OK_EVENT_CHANGE,
                    action: function () {
                        self.setValue(self.popup.getValue());
                        self.hidePopupView();
                        self.fireEvent(BI.TimeCombo.EVENT_CONFIRM);
                    }
                }, {
                    eventName: BI.TimePopup.BUTTON_NOW_EVENT_CHANGE,
                    action: function () {
                        self._setNowTime();
                    }
                }],
                ref: function (_ref) {
                    self.popup = _ref;
                }
            };
            return {
                type: "bi.htape",
                items: [{
                    type: "bi.absolute",
                    items: [{
                        el: {
                            type: "bi.combo",
                            cls: "bi-border bi-border-radius",
                            container: opts.container,
                            toggle: false,
                            isNeedAdjustHeight: opts.isNeedAdjustHeight,
                            isNeedAdjustWidth: opts.isNeedAdjustWidth,
                            el: {
                                type: "bi.time_trigger",
                                height: opts.height - 2,
                                allowEdit: opts.allowEdit,
                                watermark: opts.watermark,
                                format: opts.format,
                                value: opts.value,
                                ref: function (_ref) {
                                    self.trigger = _ref;
                                },
                                listeners: [{
                                    eventName: "EVENT_KEY_DOWN",
                                    action: function () {
                                        if (self.combo.isViewVisible()) {
                                            self.combo.hideView();
                                        }
                                        self.fireEvent(BI.TimeCombo.EVENT_KEY_DOWN, arguments);
                                    }
                                }, {
                                    eventName: "EVENT_STOP",
                                    action: function () {
                                        if (!self.combo.isViewVisible()) {
                                            self.combo.showView();
                                        }
                                    }
                                }, {
                                    eventName: "EVENT_FOCUS",
                                    action: function () {
                                        self.storeTriggerValue = self.trigger.getKey();
                                        if (!self.combo.isViewVisible()) {
                                            self.combo.showView();
                                        }
                                        self.fireEvent("EVENT_FOCUS");
                                    }
                                }, {
                                    eventName: "EVENT_BLUR",
                                    action: function () {
                                        self.fireEvent("EVENT_BLUR");
                                    }
                                }, {
                                    eventName: "EVENT_ERROR",
                                    action: function () {
                                        var date = BI.getDate();
                                        self.storeValue = {
                                            hour: date.getHours(),
                                            minute: date.getMinutes(),
                                            second: date.getSeconds()
                                        };
                                        self.fireEvent("EVENT_ERROR");
                                    }
                                }, {
                                    eventName: "EVENT_VALID",
                                    action: function () {
                                        self.fireEvent("EVENT_VALID");
                                    }
                                }, {
                                    eventName: "EVENT_CHANGE",
                                    action: function () {
                                        self.fireEvent("EVENT_CHANGE");
                                    }
                                }, {
                                    eventName: "EVENT_CONFIRM",
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
                                        self.fireEvent("EVENT_CONFIRM");
                                    }
                                }]
                            },
                            adjustLength: this.constants.comboAdjustHeight,
                            popup: {
                                el: popup,
                                width: opts.isNeedAdjustWidth ? opts.width : this.constants.popupWidth,
                                stopPropagation: false
                            },
                            hideChecker: function (e) {
                                return self.triggerBtn.element.find(e.target).length === 0;
                            },
                            listeners: [{
                                eventName: BI.Combo.EVENT_BEFORE_POPUPVIEW,
                                action: function () {
                                    self.popup.setValue(self.storeValue);
                                    self.fireEvent(BI.TimeCombo.EVENT_BEFORE_POPUPVIEW);
                                }
                            }],
                            ref: function (_ref) {
                                self.combo = _ref;
                            }
                        },
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0
                    }, {
                        el: {
                            type: "bi.icon_button",
                            cls: "bi-trigger-icon-button time-font icon-size-16",
                            width: this.constants.iconWidth,
                            height: opts.height,
                            listeners: [{
                                eventName: BI.IconButton.EVENT_CHANGE,
                                action: function () {
                                    if (self.combo.isViewVisible()) {
                                        // self.combo.hideView();
                                    } else {
                                        self.combo.showView();
                                    }
                                }
                            }],
                            ref: function (_ref) {
                                self.triggerBtn = _ref;
                            }
                        },
                        top: 0,
                        right: 0
                    }]
                }]
            };
        },

        setValue: function (v) {
            this.storeValue = v;
            this.trigger.setValue(v);
        },
        getValue: function () {
            return this.storeValue;
        },

        hidePopupView: function () {
            this.combo.hideView();
        },

        _setNowTime: function () {
            var date = BI.getDate();
            var nowTome = {
                hour: date.getHours(),
                minute: date.getMinutes(),
                second: date.getSeconds()
            };
            this.setValue(nowTome);
            this.hidePopupView();
            this.fireEvent(BI.TimeCombo.EVENT_CONFIRM);
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

    BI.TimeCombo.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
    BI.TimeCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
    BI.TimeCombo.EVENT_CHANGE = "EVENT_CHANGE";
    BI.TimeCombo.EVENT_VALID = "EVENT_VALID";
    BI.TimeCombo.EVENT_ERROR = "EVENT_ERROR";
    BI.TimeCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
    BI.shortcut("bi.time_combo", BI.TimeCombo);
})();