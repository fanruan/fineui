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
            border: 1
        },
        props: {
            baseCls: "bi-time-combo bi-border bi-border-radius",
            width: 80,
            height: 22
        },

        render: function () {
            var self = this, opts = this.options;

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
                            container: opts.container,
                            toggle: false,
                            isNeedAdjustHeight: false,
                            isNeedAdjustWidth: false,
                            el: {
                                type: "bi.time_trigger",
                                value: opts.value,
                                ref: function (_ref) {
                                    self.trigger = _ref;
                                }
                            },
                            adjustLength: this.constants.comboAdjustHeight,
                            popup: {
                                el: popup,
                                width: this.constants.popupWidth,
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
                            width: 22,
                            height: 22,
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
        }
    });

    BI.TimeCombo.EVENT_CONFIRM = "EVENT_CONFIRM";
    BI.TimeCombo.EVENT_CHANGE = "EVENT_CHANGE";
    BI.TimeCombo.EVENT_BEFORE_POPUPVIEW = "EVENT_BEFORE_POPUPVIEW";
    BI.shortcut("bi.time_combo", BI.TimeCombo);
})();