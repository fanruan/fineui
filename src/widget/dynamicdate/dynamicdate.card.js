BI.DynamicDateCard = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-dynamic-date-card"
    },

    render: function () {
        var self = this;
        this.position = BI.DynamicDateCard.OFFSET.CURRENT;
        return {
            type: "bi.vertical",
            items: [{
                el: {
                    type: "bi.label",
                    text: BI.i18nText("BI-Multi_Date_Relative_Current_Time"),
                    textAlign: "left",
                    lgap: 10
                },
                tgap: 10,
                bgap: 5
            }, {
                type: "bi.button_group",
                ref: function () {
                    self.checkgroup = this;
                },
                chooseType: BI.ButtonGroup.CHOOSE_TYPE_MULTI,
                lgap: 4,
                value: [BI.DynamicDateCard.TYPE.YEAR],
                items: BI.createItems([{
                    text: BI.i18nText("BI-Basic_Year"),
                    value: BI.DynamicDateCard.TYPE.YEAR
                }, {
                    text: BI.i18nText("BI-Basic_Single_Quarter"),
                    value: BI.DynamicDateCard.TYPE.QUARTER
                }, {
                    text: BI.i18nText("BI-Basic_Month"),
                    value: BI.DynamicDateCard.TYPE.MONTH
                }, {
                    text: BI.i18nText("BI-Basic_Week"),
                    value: BI.DynamicDateCard.TYPE.WEEK
                }, {
                    text: BI.i18nText("BI-Basic_Day"),
                    value: BI.DynamicDateCard.TYPE.DAY
                }], {
                    type: "bi.multi_select_item",
                    logic: {
                        dynamic: true
                    },
                    iconWrapperWidth: 26,
                }),
                layouts: [{
                    type: "bi.left",
                    rgap: 4
                }],
                listeners: [{
                    eventName: BI.ButtonGroup.EVENT_CHANGE,
                    action: function () {
                        var value = self.checkgroup.getValue();
                        if(value.length !== 0) {
                            self.workDayBox.setSelected(false);
                        }

                        var plainValue = {};
                        BI.each(self.resultPane.getAllButtons(), function (idx, button) {
                            var value = button.getValue();
                            if(BI.isNotNull(value.dateType)) {
                                plainValue[value.dateType] = {
                                    value: value.value,
                                    offset: value.offset
                                };
                            }
                        });
                        self.resultPane.populate(self._getParamJson(BI.map(self.checkgroup.getValue(), function (idx, v) {
                            var obj = {
                                dateType: v
                            };
                            if(BI.has(plainValue, v)) {
                                obj.value = plainValue[v].value;
                                obj.offset = plainValue[v].offset;
                            }
                            return obj;
                        })));
                        self.position = BI.DynamicDateCard.OFFSET.CURRENT;
                        self.fireEvent("EVENT_CHANGE");
                    }
                }]
            }, {
                type: "bi.vertical_adapt",
                lgap: 2,
                items: [{
                    el: {
                        type: "bi.multi_select_item",
                        iconWrapperWidth: 26,
                        ref: function () {
                            self.workDayBox = this;
                        },
                        logic: {
                            dynamic: true
                        },
                        text: BI.i18nText("BI-Basic_Work_Day"),
                        value: BI.DynamicDateCard.TYPE.WORK_DAY,
                        listeners: [{
                            eventName: BI.MultiSelectItem.EVENT_CHANGE,
                            action: function () {
                                if(this.isSelected()) {
                                    self.checkgroup.setValue();
                                }
                                self.resultPane.populate(this.isSelected() ? self._getParamJson([{
                                    dateType: BI.DynamicDateCard.TYPE.WORK_DAY
                                }]) : []);
                                self.position = BI.DynamicDateCard.OFFSET.CURRENT;
                                self.fireEvent("EVENT_CHANGE");
                            }
                        }]
                    }
                }],
                ref: function () {
                    self.workDay = this;
                }
            }, {
                type: "bi.button_group",
                items: this._getParamJson([{
                    dateType: BI.DynamicDateCard.TYPE.YEAR
                }]),
                ref: function () {
                    self.resultPane = this;
                },
                layouts: [{
                    type: "bi.vertical",
                    bgap: 10,
                    hgap: 10
                }]
            }]
        };
    },

    _getParamJson: function (values, positionValue) {
        var self = this, o = this.options;
        var items = BI.map(values, function (idx, value) {
            return {
                el: {
                    type: "bi.dynamic_date_param_item",
                    validationChecker: BI.bind(self._checkDate, self),
                    dateType: value.dateType,
                    value: value.value,
                    offset: value.offset,
                    listeners: [{
                        eventName: "EVENT_CHANGE",
                        action: function () {
                            self.fireEvent("EVENT_CHANGE");
                        }
                    }, {
                        eventName: "EVENT_INPUT_CHANGE",
                        action: function () {
                            BI.Bubbles.hide("dynamic-date-error");
                        }
                    }]
                },
                tgap: idx === 0 ? 5 : 0
            };
        });

        if(values.length === 1 && values[0].dateType === BI.DynamicDateCard.TYPE.DAY) {
            var comboItems = this._getText(BI.DynamicDateCard.TYPE.MONTH);
            comboItems[0].text = BI.i18nText("BI-Basic_Empty");
            items.push({
                type: "bi.text_value_combo",
                height: BI.SIZE_CONSANTS.TOOL_BAR_HEIGHT,
                items: comboItems,
                container: null,
                value: positionValue || BI.DynamicDateCard.OFFSET.CURRENT,
                listeners: [{
                    eventName: "EVENT_CHANGE",
                    action: function () {
                        self.position = this.getValue()[0];
                        this.setValue(self.position);
                        self.fireEvent("EVENT_CHANGE");
                    }
                }]
            });
        }else{
            if(values.length !== 0 && BI.last(values).dateType !== BI.DynamicDateCard.TYPE.DAY && BI.last(values).dateType !== BI.DynamicDateCard.TYPE.WORK_DAY) {
                items.push({
                    type: "bi.text_value_combo",
                    height: BI.SIZE_CONSANTS.TOOL_BAR_HEIGHT,
                    container: null,
                    items: this._getText(BI.last(values).dateType),
                    value: positionValue || BI.DynamicDateCard.OFFSET.CURRENT,
                    listeners: [{
                        eventName: "EVENT_CHANGE",
                        action: function () {
                            self.position = this.getValue()[0];
                            this.setValue(self.position);
                            self.fireEvent("EVENT_CHANGE");
                        }
                    }]
                });

            }
        }

        return items;
    },

    _checkDate: function (obj) {
        var o = this.options;
        var date = BI.DynamicDateHelper.getCalculation(BI.extend(this._getValue(), this._digestDateTypeValue(obj)));

        return !BI.checkDateVoid(date.getFullYear(), date.getMonth() + 1, date.getDate(), o.min, o.max)[0];
    },

    _getText: function (lastValue) {
        switch (lastValue) {
            case BI.DynamicDateCard.TYPE.YEAR:
                return [{
                    text: BI.i18nText("BI-Basic_Current_Day"),
                    value: BI.DynamicDateCard.OFFSET.CURRENT
                }, {
                    text: BI.i18nText("BI-Basic_Year_Begin"),
                    value: BI.DynamicDateCard.OFFSET.BEGIN
                }, {
                    text: BI.i18nText("BI-Basic_Year_End"),
                    value: BI.DynamicDateCard.OFFSET.END
                }];
            case BI.DynamicDateCard.TYPE.QUARTER:
                return [{
                    text: BI.i18nText("BI-Basic_Current_Day"),
                    value: BI.DynamicDateCard.OFFSET.CURRENT
                }, {
                    text: BI.i18nText("BI-Basic_Quarter_Begin"),
                    value: BI.DynamicDateCard.OFFSET.BEGIN
                }, {
                    text: BI.i18nText("BI-Basic_Quarter_End"),
                    value: BI.DynamicDateCard.OFFSET.END
                }];
            case BI.DynamicDateCard.TYPE.MONTH:
                return [{
                    text: BI.i18nText("BI-Basic_Current_Day"),
                    value: BI.DynamicDateCard.OFFSET.CURRENT
                }, {
                    text: BI.i18nText("BI-Basic_Month_Begin"),
                    value: BI.DynamicDateCard.OFFSET.BEGIN
                }, {
                    text: BI.i18nText("BI-Basic_Month_End"),
                    value: BI.DynamicDateCard.OFFSET.END
                }];
            case BI.DynamicDateCard.TYPE.WEEK:
            default:
                return [{
                    text: BI.i18nText("BI-Basic_Current_Day"),
                    value: BI.DynamicDateCard.OFFSET.CURRENT
                }, {
                    text: BI.i18nText("BI-Basic_Week_Begin"),
                    value: BI.DynamicDateCard.OFFSET.BEGIN
                }, {
                    text: BI.i18nText("BI-Basic_Week_End"),
                    value: BI.DynamicDateCard.OFFSET.END
                }];
        }
    },

    _createValue: function (type, v) {
        return {
            dateType: type,
            value: Math.abs(v),
            offset: v > 0 ? 1 : 0
        };
    },

    _digestDateTypeValue: function (value) {
        var valueMap = {};
        switch (value.dateType) {
            case BI.DynamicDateCard.TYPE.YEAR:
                valueMap.year = (value.offset === 0 ? -value.value : +value.value);
                break;
            case BI.DynamicDateCard.TYPE.QUARTER:
                valueMap.quarter = (value.offset === 0 ? -value.value : +value.value);
                break;
            case BI.DynamicDateCard.TYPE.MONTH:
                valueMap.month = (value.offset === 0 ? -value.value : +value.value);
                break;
            case BI.DynamicDateCard.TYPE.WEEK:
                valueMap.week = (value.offset === 0 ? -value.value : +value.value);
                break;
            case BI.DynamicDateCard.TYPE.DAY:
                valueMap.day = (value.offset === 0 ? -value.value : +value.value);
                break;
            case BI.DynamicDateCard.TYPE.WORK_DAY:
                valueMap.workDay = (value.offset === 0 ? -value.value : +value.value);
                break;
            default:
                break;
        }
        if (BI.isNull(value.dateType)) {
            valueMap.position = this.position || BI.DynamicDateCard.OFFSET.CURRENT;
        }
        return valueMap;
    },

    setMinDate: function(minDate) {
        if (BI.isNotEmptyString(this.options.min)) {
            this.options.min = minDate;
        }
    },

    setMaxDate: function (maxDate) {
        if (BI.isNotEmptyString(this.options.max)) {
            this.options.max = maxDate;
        }
    },

    setValue: function (v) {
        v = v || {};
        this.position = v.position || BI.DynamicDateCard.OFFSET.CURRENT;
        var values = [];
        var valuesItems = [];
        if(BI.isNotNull(v.year)) {
            values.push(BI.DynamicDateCard.TYPE.YEAR);
            valuesItems.push(this._createValue(BI.DynamicDateCard.TYPE.YEAR, v.year));
        }
        if(BI.isNotNull(v.quarter)) {
            values.push(BI.DynamicDateCard.TYPE.QUARTER);
            valuesItems.push(this._createValue(BI.DynamicDateCard.TYPE.QUARTER, v.quarter));
        }
        if(BI.isNotNull(v.month)) {
            values.push(BI.DynamicDateCard.TYPE.MONTH);
            valuesItems.push(this._createValue(BI.DynamicDateCard.TYPE.MONTH, v.month));
        }
        if(BI.isNotNull(v.week)) {
            values.push(BI.DynamicDateCard.TYPE.WEEK);
            valuesItems.push(this._createValue(BI.DynamicDateCard.TYPE.WEEK, v.week));
        }
        if(BI.isNotNull(v.day)) {
            values.push(BI.DynamicDateCard.TYPE.DAY);
            valuesItems.push(this._createValue(BI.DynamicDateCard.TYPE.DAY, v.day));
        }
        if(BI.isNotNull(v.workDay)) {
            values.push(BI.DynamicDateCard.TYPE.WORK_DAY);
            valuesItems.push(this._createValue(BI.DynamicDateCard.TYPE.WORK_DAY, v.workDay));
        }
        this.checkgroup.setValue(values);
        this.workDayBox.setSelected(BI.isNotNull(v.workDay));
        this.resultPane.populate(this._getParamJson(valuesItems, v.position));
    },

    _getValue: function () {
        var self = this;
        var valueMap = {};
        var selectValues = this.checkgroup.getValue();
        var buttons = this.resultPane.getAllButtons();
        if(selectValues.length !== 0) {
            BI.each(buttons, function (idx, button) {
                var value = button.getValue();
                BI.extend(valueMap, self._digestDateTypeValue(value));
            });
        }
        if(this.workDayBox.isSelected()) {
            var value = buttons[0].getValue();
            valueMap.workDay = (value.offset === 0 ? -value.value : +value.value);
        }

        return valueMap;
    },

    _getErrorText: function () {
        var o = this.options;
        var start = BI.parseDateTime(o.min, "%Y-%X-%d");
        var end = BI.parseDateTime(o.max, "%Y-%X-%d");

        return BI.i18nText("BI-Basic_Date_Range_Error",
            start.getFullYear(),
            start.getMonth() + 1,
            start.getDate(),
            end.getFullYear(),
            end.getMonth() + 1,
            end.getDate()
        );
    },

    getValue: function () {
        return this.checkValidation() ? this._getValue() : {};
    },

    getInputValue: function () {
        return this._getValue();
    },

    checkValidation: function (show) {
        var buttons = this.resultPane.getAllButtons();
        var errorText;
        var invalid = BI.any(buttons, function (idx, button) {
            return button.checkValidation && !button.checkValidation();
        });
        if (invalid) {
            errorText = BI.i18nText("BI-Please_Input_Natural_Number");
        } else {
            invalid = !this._checkDate(this._getValue());
            errorText = this._getErrorText();
        }
        invalid && show && BI.Bubbles.show("dynamic-date-error", errorText, this.resultPane);

        return !invalid;
    },

});
BI.shortcut("bi.dynamic_date_card", BI.DynamicDateCard);

BI.extend(BI.DynamicDateCard, {
    TYPE: {
        YEAR: 1,
        QUARTER: 2,
        MONTH: 3,
        WEEK: 4,
        DAY: 5,
        WORK_DAY: 6
    },
    OFFSET: {
        CURRENT: 1,
        BEGIN: 2,
        END: 3
    }

});