BI.DynamicYearQuarterPopup = BI.inherit(BI.Widget, {
    constants: {
        tabHeight: 40,
        buttonHeight: 24
    },

    props: {
        baseCls: "bi-year-quarter-popup",
        behaviors: {},
        min: "1900-01-01", // 最小日期
        max: "2099-12-31", // 最大日期,
        width: 180,
        supportDynamic: true,
    },

    render: function () {
        var self = this, opts = this.options, c = this.constants;
        this.storeValue = {type: BI.DynamicYearQuarterCombo.Static};
        return {
            type: "bi.vertical",
            items: [{
                el: this._getTabJson()
            }, {
                el: {
                    type: "bi.grid",
                    items: [[{
                        type: "bi.text_button",
                        cls: "bi-split-top bi-high-light",
                        shadow: true,
                        textHeight: BI.SIZE_CONSANTS.TOOL_BAR_HEIGHT - 1,
                        text: BI.i18nText("BI-Basic_Clear"),
                        listeners: [{
                            eventName: BI.TextButton.EVENT_CHANGE,
                            action: function () {
                                self.fireEvent(BI.DynamicYearQuarterPopup.BUTTON_CLEAR_EVENT_CHANGE);
                            }
                        }]
                    }, {
                        type: "bi.text_button",
                        cls: "bi-split-left bi-split-right bi-high-light bi-split-top",
                        textHeight: BI.SIZE_CONSANTS.TOOL_BAR_HEIGHT - 1,
                        shadow: true,
                        text: BI.i18nText("BI-Basic_Current_Quarter"),
                        disabled: this._checkTodayValid(),
                        ref: function () {
                            self.textButton = this;
                        },
                        listeners: [{
                            eventName: BI.TextButton.EVENT_CHANGE,
                            action: function () {
                                self.fireEvent(BI.DynamicYearQuarterPopup.BUTTON_lABEL_EVENT_CHANGE);
                            }
                        }]
                    }, {
                        type: "bi.text_button",
                        cls: "bi-split-top bi-high-light",
                        shadow: true,
                        textHeight: BI.SIZE_CONSANTS.TOOL_BAR_HEIGHT - 1,
                        text: BI.i18nText("BI-Basic_OK"),
                        listeners: [{
                            eventName: BI.TextButton.EVENT_CHANGE,
                            action: function () {
                                var type = self.dateTab.getSelect();
                                if (type === BI.DynamicDateCombo.Dynamic) {
                                    self.dynamicPane.checkValidation(true) && self.fireEvent(BI.DynamicDatePopup.BUTTON_OK_EVENT_CHANGE);
                                } else {
                                    self.fireEvent(BI.DynamicYearQuarterPopup.BUTTON_OK_EVENT_CHANGE);
                                }
                            }
                        }]
                    }]],
                    height: BI.SIZE_CONSANTS.TOOL_BAR_HEIGHT
                },
            }]
        };
    },

    _setInnerValue: function () {
        if (this.dateTab.getSelect() === BI.DynamicYearQuarterCombo.Static) {
            this.textButton.setValue(BI.i18nText("BI-Basic_Current_Quarter"));
            this.textButton.setEnable(!this._checkTodayValid());
        } else {
            var date = BI.DynamicDateHelper.getCalculation(this.dynamicPane.getInputValue());
            date = BI.print(date, "%Y-%Q");
            this.textButton.setValue(date);
            this.textButton.setEnable(false);
        }
    },

    _checkTodayValid: function () {
        var o = this.options;
        var today = BI.getDate();
        return !!BI.checkDateVoid(today.getFullYear(), today.getMonth() + 1, today.getDate(), o.min, o.max)[0];
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
                cls: "bi-split-bottom",
                invisible: !o.supportDynamic,
                height: this.constants.tabHeight,
                items: BI.createItems([{
                    text: BI.i18nText("BI-Basic_Year_Quarter"),
                    value: BI.DynamicYearQuarterCombo.Static
                }, {
                    text: BI.i18nText("BI-Basic_Dynamic_Title"),
                    value: BI.DynamicYearQuarterCombo.Dynamic
                }], {
                    textAlign: "center"
                })
            },
            cardCreator: function (v) {
                switch (v) {
                    case BI.DynamicYearQuarterCombo.Dynamic:
                        return {
                            type: "bi.dynamic_year_quarter_card",
                            cls: "dynamic-year-quarter-pane",
                            min: self.options.min,
                            max: self.options.max,
                            listeners: [{
                                eventName: "EVENT_CHANGE",
                                action: function () {
                                    self._setInnerValue(self.year, v);
                                }
                            }],
                            ref: function () {
                                self.dynamicPane = this;
                            }
                        };
                    case BI.DynamicYearQuarterCombo.Static:
                    default:
                        return {
                            type: "bi.static_year_quarter_card",
                            behaviors: o.behaviors,
                            min: self.options.min,
                            max: self.options.max,
                            listeners: [{
                                eventName: BI.DynamicYearCard.EVENT_CHANGE,
                                action: function () {
                                    self.fireEvent(BI.DynamicYearQuarterPopup.EVENT_CHANGE);
                                }
                            }],
                            ref: function () {
                                self.year = this;
                            }
                        };
                }
            },
            listeners: [{
                eventName: BI.Tab.EVENT_CHANGE,
                action: function () {
                    var v = self.dateTab.getSelect();
                    switch (v) {
                        case BI.DynamicYearQuarterCombo.Static:
                            var date = BI.DynamicDateHelper.getCalculation(self.dynamicPane.getValue());
                            self.year.setValue({year: date.getFullYear(), quarter: BI.getQuarter(date)});
                            self._setInnerValue();
                            break;
                        case BI.DynamicYearQuarterCombo.Dynamic:
                        default:
                            if(self.storeValue && self.storeValue.type === BI.DynamicYearQuarterCombo.Dynamic) {
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

    setMinDate: function (minDate) {
        if (this.options.min !== minDate) {
            this.options.min = minDate;
            this.year && this.year.setMinDate(minDate);
            this.dynamicPane && this.dynamicPane.setMinDate(minDate);
        }
    },

    setMaxDate: function (maxDate) {
        if (this.options.max !== maxDate) {
            this.options.max = maxDate;
            this.year && this.year.setMaxDate(maxDate);
            this.dynamicPane && this.dynamicPane.setMaxDate(maxDate);
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
                this.year.setValue(value);
                this.textButton.setValue(BI.i18nText("BI-Basic_Current_Quarter"));
                this.textButton.setEnable(!this._checkTodayValid());
                break;
        }
    },

    getValue: function () {
        return {
            type: this.dateTab.getSelect(),
            value: this.dateTab.getValue()
        };
    }

});
BI.DynamicYearQuarterPopup.BUTTON_CLEAR_EVENT_CHANGE = "BUTTON_CLEAR_EVENT_CHANGE";
BI.DynamicYearQuarterPopup.BUTTON_lABEL_EVENT_CHANGE = "BUTTON_lABEL_EVENT_CHANGE";
BI.DynamicYearQuarterPopup.BUTTON_OK_EVENT_CHANGE = "BUTTON_OK_EVENT_CHANGE";
BI.DynamicYearQuarterPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.dynamic_year_quarter_popup", BI.DynamicYearQuarterPopup);