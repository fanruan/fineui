/**
 * 年月展示面板
 *
 * Created by GUY on 2015/9/2.
 * @class BI.YearCard
 * @extends BI.Trigger
 */
BI.DynamicYearMonthCard = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-year-month-card"
    },

    render: function () {
        var self = this;
        return {
            type: "bi.vertical",
            items: [{
                type: "bi.label",
                text: BI.i18nText("BI-Multi_Date_Relative_Current_Time"),
                textAlign: "left",
                height: BI.SIZE_CONSANTS.LIST_ITEM_HEIGHT,
            }, {
                type: "bi.vertical",
                ref: function (_ref) {
                    self.wrapper = _ref;
                },
                items: [{
                    el: {
                        type: "bi.dynamic_date_param_item",
                        validationChecker: BI.bind(self._checkDate, self),
                        ref: function () {
                            self.year = this;
                        },
                        listeners: [{
                            eventName: "EVENT_CHANGE",
                            action: function () {
                                self.fireEvent("EVENT_CHANGE");
                            }
                        }, {
                            eventName: "EVENT_INPUT_CHANGE",
                            action: function () {
                                BI.Bubbles.hide("dynamic-year-month-error");
                            }
                        }]
                    },
                    bgap: 10,
                }, {
                    type: "bi.dynamic_date_param_item",
                    dateType: BI.DynamicDateCard.TYPE.MONTH,
                    ref: function () {
                        self.month = this;
                    },
                    listeners: [{
                        eventName: "EVENT_CHANGE",
                        action: function () {
                            self.fireEvent("EVENT_CHANGE");
                        }
                    }, {
                        eventName: "EVENT_INPUT_CHANGE",
                        action: function () {
                            BI.Bubbles.hide("dynamic-year-month-error");
                        }
                    }]
                }]
            }],
            vgap: 10,
            hgap: 10
        };
    },

    _getErrorText: function () {
        var o = this.options;
        var start = BI.parseDateTime(o.min, "%Y-%X-%d");
        var end = BI.parseDateTime(o.max, "%Y-%X-%d");
        return BI.i18nText("BI-Basic_Year_Month_Range_Error",
            start.getFullYear(),
            start.getMonth() + 1,
            end.getFullYear(),
            end.getMonth() + 1
        );
    },

    _checkDate: function (obj) {
        var o = this.options;
        var date = BI.DynamicDateHelper.getCalculation(BI.extend(this._getValue(), this._digestDateTypeValue(obj)));

        return !BI.checkDateVoid(date.getFullYear(), date.getMonth() + 1, date.getDate(), o.min, o.max)[0];
    },

    _digestDateTypeValue: function (value) {
        var valueMap = {};
        switch (value.dateType) {
            case BI.DynamicDateCard.TYPE.YEAR:
                valueMap.year = (value.offset === 0 ? -value.value : +value.value);
                break;
            case BI.DynamicDateCard.TYPE.MONTH:
                valueMap.month = (value.offset === 0 ? -value.value : +value.value);
                break;
            default:
                break;
        }
        return valueMap;
    },

    _createValue: function (type, v) {
        return {
            dateType: type,
            value: Math.abs(v),
            offset: v > 0 ? 1 : 0
        };
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
        v = v || {year: 0, month: 0};
        this.year.setValue(this._createValue(BI.DynamicDateCard.TYPE.YEAR, v.year));
        this.month.setValue(this._createValue(BI.DynamicDateCard.TYPE.MONTH, v.month));
    },

    _getValue: function () {
        var year = this.year.getValue();
        var month = this.month.getValue();
        return {
            year: (year.offset === 0 ? -year.value : year.value),
            month: (month.offset === 0 ? -month.value : month.value)
        };
    },

    getInputValue: function () {
        return this._getValue();
    },

    getValue: function () {
        return this.checkValidation() ? this._getValue() : {};
    },

    checkValidation: function (show) {
        var errorText;
        var yearInvalid = !this.year.checkValidation();
        var monthInvalid = !this.month.checkValidation();
        var invalid = yearInvalid || monthInvalid;
        if (invalid) {
            errorText = BI.i18nText("BI-Please_Input_Natural_Number");
        } else {
            invalid = !this._checkDate(this._getValue());
            errorText = this._getErrorText();
        }
        invalid && show && BI.Bubbles.show("dynamic-year-month-error", errorText, this.wrapper);

        return !invalid;
    },
});
BI.DynamicYearMonthCard.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.dynamic_year_month_card", BI.DynamicYearMonthCard);