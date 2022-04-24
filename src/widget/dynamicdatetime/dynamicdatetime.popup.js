BI.DynamicDateTimePopup = BI.inherit(BI.Widget, {
    constants: {
        tabHeight: 40,
        buttonHeight: 24
    },

    props: {
        baseCls: "bi-dynamic-date-time-popup",
        width: 272,
        supportDynamic: true,
    },

    _init: function () {
        BI.DynamicDateTimePopup.superclass._init.apply(this, arguments);
        var self = this, opts = this.options, c = this.constants;
        this.storeValue = {type: BI.DynamicDateCombo.Static};
        BI.createWidget({
            element: this,
            type: "bi.vertical",
            items: [{
                el: this._getTabJson()
            }, {
                el: {
                    type: "bi.grid",
                    items: [[{
                        type: "bi.text_button",
                        cls: "bi-high-light bi-split-top",
                        textHeight: BI.SIZE_CONSANTS.TOOL_BAR_HEIGHT - 1,
                        shadow: true,
                        text: BI.i18nText("BI-Basic_Clear"),
                        listeners: [{
                            eventName: BI.TextButton.EVENT_CHANGE,
                            action: function () {
                                self.fireEvent(BI.DynamicDateTimePopup.BUTTON_CLEAR_EVENT_CHANGE);
                            }
                        }]
                    }, {
                        type: "bi.text_button",
                        cls: "bi-split-left bi-split-right bi-high-light bi-split-top",
                        textHeight: BI.SIZE_CONSANTS.TOOL_BAR_HEIGHT - 1,
                        shadow: true,
                        text: BI.i18nText("BI-Multi_Date_Today"),
                        disabled: this._checkTodayValid(),
                        ref: function () {
                            self.todayButton = this;
                        },
                        listeners: [{
                            eventName: BI.TextButton.EVENT_CHANGE,
                            action: function () {
                                self.fireEvent(BI.DynamicDateTimePopup.BUTTON_lABEL_EVENT_CHANGE);
                            }
                        }]
                    }, {
                        type: "bi.text_button",
                        cls: "bi-high-light bi-split-top",
                        textHeight: BI.SIZE_CONSANTS.TOOL_BAR_HEIGHT - 1,
                        shadow: true,
                        text: BI.i18nText("BI-Basic_OK"),
                        listeners: [{
                            eventName: BI.TextButton.EVENT_CHANGE,
                            action: function () {
                                var type = self.dateTab.getSelect();
                                if (type === BI.DynamicDateCombo.Dynamic) {
                                    self.dynamicPane.checkValidation(true) && self.fireEvent(BI.DynamicDateTimePopup.BUTTON_OK_EVENT_CHANGE);
                                } else {
                                    self.fireEvent(BI.DynamicDateTimePopup.BUTTON_OK_EVENT_CHANGE)
                                }
                            }
                        }]
                    }]],
                    height: BI.SIZE_CONSANTS.TOOL_BAR_HEIGHT
                }
            }]
        });
        this.setValue(opts.value);
    },

    _getTabJson: function () {
        var self = this, o = this.options;
        return {
            type: "bi.tab",
            logic: {
                dynamic: true
            },
            ref: function () {
                self.dateTab = this;
            },
            tab: {
                type: "bi.linear_segment",
                invisible: !o.supportDynamic,
                cls: "bi-split-bottom",
                height: this.constants.tabHeight,
                items: BI.createItems([{
                    text: BI.i18nText("BI-Multi_Date_YMD"),
                    value: BI.DynamicDateCombo.Static
                }, {
                    text: BI.i18nText("BI-Basic_Dynamic_Title"),
                    value: BI.DynamicDateCombo.Dynamic
                }], {
                    textAlign: "center"
                })
            },
            cardCreator: function (v) {
                switch (v) {
                    case BI.DynamicDateCombo.Dynamic:
                        return {
                            type: "bi.dynamic_date_card",
                            cls: "dynamic-date-pane",
                            listeners: [{
                                eventName: "EVENT_CHANGE",
                                action: function () {
                                    self._setInnerValue(self.year, v);
                                }
                            }],
                            ref: function () {
                                self.dynamicPane = this;
                            },
                            min: self.options.min,
                            max: self.options.max,
                        };
                    case BI.DynamicDateCombo.Static:
                    default:
                        return {
                            type: "bi.vertical",
                            items: [{
                                type: "bi.date_calendar_popup",
                                behaviors: o.behaviors,
                                min: self.options.min,
                                max: self.options.max,
                                ref: function () {
                                    self.ymd = this;
                                },
                                listeners: [{
                                    eventName: BI.DateCalendarPopup.EVENT_BEFORE_YEAR_MONTH_POPUPVIEW,
                                    action: function () {
                                        self.fireEvent(BI.DynamicDateTimePopup.EVENT_BEFORE_YEAR_MONTH_POPUPVIEW);
                                    }
                                }],
                            }, {
                                el: {
                                    type: "bi.dynamic_date_time_select",
                                    cls: "bi-split-top",
                                    ref: function () {
                                        self.timeSelect = this;
                                    },
                                    height: 40
                                }
                            }]
                        };
                }
            },
            listeners: [{
                eventName: BI.Tab.EVENT_CHANGE,
                action: function () {
                    var v = self.dateTab.getSelect();
                    switch (v) {
                        case BI.DynamicDateCombo.Static:
                            var date = BI.DynamicDateHelper.getCalculation(self.dynamicPane.getValue());
                            self.ymd.setValue({
                                year: date.getFullYear(),
                                month: date.getMonth() + 1,
                                day: date.getDate()
                            });
                            self.timeSelect.setValue();
                            self._setInnerValue();
                            break;
                        case BI.DynamicDateCombo.Dynamic:
                        default:
                            if(self.storeValue && self.storeValue.type === BI.DynamicDateCombo.Dynamic) {
                                self.dynamicPane.setValue(self.storeValue.value);
                            }else{
                                self.dynamicPane.setValue({
                                    year: 0
                                });
                            }
                            self._setInnerValue();
                            break;
                    }
                }
            }]
        };
    },

    _setInnerValue: function () {
        if (this.dateTab.getSelect() === BI.DynamicDateCombo.Static) {
            this.todayButton.setValue(BI.i18nText("BI-Multi_Date_Today"));
            this.todayButton.setEnable(!this._checkTodayValid());
        } else {
            var date = BI.DynamicDateHelper.getCalculation(this.dynamicPane.getInputValue());
            date = BI.print(date, "%Y-%X-%d");
            this.todayButton.setValue(date);
            this.todayButton.setEnable(false);
        }
    },

    _checkValueValid: function (value) {
        return BI.isNull(value) || BI.isEmptyObject(value) || BI.isEmptyString(value);
    },

    _checkTodayValid: function () {
        var o = this.options;
        var today = BI.getDate();
        return !!BI.checkDateVoid(today.getFullYear(), today.getMonth() + 1, today.getDate(), o.min, o.max)[0];
    },

    setMinDate: function (minDate) {
        if (this.options.min !== minDate) {
            this.options.min = minDate;
            this.ymd.setMinDate(minDate);
        }
    },

    setMaxDate: function (maxDate) {
        if (this.options.max !== maxDate) {
            this.options.max = maxDate;
            this.ymd.setMaxDate(maxDate);
        }
    },

    setValue: function (v) {
        this.storeValue = v;
        var self = this;
        var type, value;
        v = v || {};
        type = v.type || BI.DynamicDateCombo.Static;
        value = v.value || v;
        this.dateTab.setSelect(type);
        switch (type) {
            case BI.DynamicDateCombo.Dynamic:
                this.dynamicPane.setValue(value);
                self._setInnerValue();
                break;
            case BI.DynamicDateCombo.Static:
            default:
                if (this._checkValueValid(value)) {
                    var date = BI.getDate();
                    this.ymd.setValue({
                        year: date.getFullYear(),
                        month: date.getMonth() + 1,
                        day: date.getDate()
                    });
                    this.timeSelect.setValue();
                    this.todayButton.setValue(BI.i18nText("BI-Multi_Date_Today"));
                } else {
                    this.ymd.setValue(value);
                    this.timeSelect.setValue({
                        hour: value.hour,
                        minute: value.minute,
                        second: value.second
                    });
                    this.todayButton.setValue(BI.i18nText("BI-Multi_Date_Today"));
                }
                this.todayButton.setEnable(!this._checkTodayValid());
                break;
        }
    },

    getValue: function () {
        var type = this.dateTab.getSelect();
        return {
            type: type,
            value: type === BI.DynamicDateTimeCombo.Static ? BI.extend(this.ymd.getValue(), this.timeSelect.getValue()) : this.dynamicPane.getValue()
        };
    }
});
BI.DynamicDateTimePopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.DynamicDateTimePopup.BUTTON_OK_EVENT_CHANGE = "BUTTON_OK_EVENT_CHANGE";
BI.DynamicDateTimePopup.BUTTON_lABEL_EVENT_CHANGE = "BUTTON_lABEL_EVENT_CHANGE";
BI.DynamicDateTimePopup.BUTTON_CLEAR_EVENT_CHANGE = "BUTTON_CLEAR_EVENT_CHANGE";
BI.DynamicDateTimePopup.EVENT_BEFORE_YEAR_MONTH_POPUPVIEW = "EVENT_BEFORE_YEAR_MONTH_POPUPVIEW";
BI.shortcut("bi.dynamic_date_time_popup", BI.DynamicDateTimePopup);