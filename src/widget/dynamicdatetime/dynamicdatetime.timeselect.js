BI.DynamicDateTimeSelect = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-date-time-select bi-border-top"
    },

    render: function () {
        var self = this;
        return {
            type: "bi.center_adapt",
            items: [{
                type: "bi.vertical_adapt",
                items: [{
                    el: {
                        type: "bi.number_editor",
                        ref: function () {
                            self.hour = this;
                        },
                        validationChecker: function (v) {
                            return BI.isNaturalNumber(v) && BI.parseInt(v) < 24;
                        },
                        errorText: function () {
                            return BI.i18nText("BI-Basic_Input_From_To_Number", "\"00-23\"");
                        },
                        listeners: [{
                            eventName: BI.SignEditor.EVENT_CONFIRM,
                            action: function () {
                                this.setValue(self._formatValueToDoubleDigit(this.getValue()));
                                self.fireEvent(BI.DynamicDateTimeSelect.EVENT_CONFIRM);
                            }
                        }, {
                            eventName: BI.SignEditor.EVENT_CHANGE,
                            action: function () {
                                var value = self._autoSwitch(this.getValue(), BI.DynamicDateTimeSelect.HOUR);
                                this.setValue(value);
                            }
                        }],
                        width: 60,
                        height: 24
                    },
                    lgap: 14
                }, {
                    type: "bi.label",
                    text: ":",
                    width: 20
                }, {
                    type: "bi.number_editor",
                    ref: function () {
                        self.minute = this;
                    },
                    validationChecker: function (v) {
                        return BI.isNaturalNumber(v) && BI.parseInt(v) < 60;
                    },
                    errorText: function () {
                        return BI.i18nText("BI-Basic_Input_From_To_Number", "\"00-59\"");
                    },
                    listeners: [{
                        eventName: BI.SignEditor.EVENT_CONFIRM,
                        action: function () {
                            this.setValue(self._formatValueToDoubleDigit(this.getValue()), BI.DynamicDateTimeSelect.MINUTE);
                            self.fireEvent(BI.DynamicDateTimeSelect.EVENT_CONFIRM);
                        }
                    }, {
                        eventName: BI.SignEditor.EVENT_CHANGE,
                        action: function () {
                            var value = self._autoSwitch(this.getValue(), BI.DynamicDateTimeSelect.MINUTE);
                            this.setValue(value);
                        }
                    }],
                    width: 60,
                    height: 24
                }, {
                    type: "bi.label",
                    text: ":",
                    width: 20
                }, {
                    type: "bi.number_editor",
                    ref: function () {
                        self.second = this;
                    },
                    validationChecker: function (v) {
                        return BI.isNaturalNumber(v) && BI.parseInt(v) < 60;
                    },
                    errorText: function () {
                        return BI.i18nText("BI-Basic_Input_From_To_Number", "\"00-59\"");
                    },
                    listeners: [{
                        eventName: BI.SignEditor.EVENT_CONFIRM,
                        action: function () {
                            this.setValue(self._formatValueToDoubleDigit(this.getValue()));
                            self.fireEvent(BI.DynamicDateTimeSelect.EVENT_CONFIRM);
                        }
                    }],
                    width: 60,
                    height: 24
                }]
            }]
        };
    },

    _autoSwitch: function (v, type) {
        var limit = 0;
        var value = v;
        switch (type) {
            case BI.DynamicDateTimeSelect.HOUR:
                limit = 2;
                break;
            case BI.DynamicDateTimeSelect.MINUTE:
                limit = 6;
                break;
            default:
                break;
        }
        if(v.length === 1 && BI.parseInt(v) > limit) {
            value = "0" + value;
        }
        if (value.length === 2) {
            type === BI.DynamicDateTimeSelect.HOUR ? this.minute.focus() : this.second.focus();
        }
        return value;
    },

    _formatValueToDoubleDigit: function (v) {
        if(BI.isNull(v) || BI.isEmptyString(v)) {
            v = 0;
        }
        var value = BI.parseInt(v);
        if(value < 10) {
            value = "0" + value;
        }
        return value;
    },

    _assertValue: function (v) {
        v = v || {};
        v.hour = this._formatValueToDoubleDigit(v.hour) || "00";
        v.minute = this._formatValueToDoubleDigit(v.minute) || "00";
        v.second = this._formatValueToDoubleDigit(v.second) || "00";
        return v;
    },

    getValue: function () {
        return {
            hour: BI.parseInt(this.hour.getValue()),
            minute: BI.parseInt(this.minute.getValue()),
            second: BI.parseInt(this.second.getValue())
        };
    },

    setValue: function (v) {
        v = this._assertValue(v);
        this.hour.setValue(v.hour);
        this.minute.setValue(v.minute);
        this.second.setValue(v.second);
    }

});
BI.DynamicDateTimeSelect.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.shortcut("bi.dynamic_date_time_select", BI.DynamicDateTimeSelect);

BI.extend(BI.DynamicDateTimeSelect, {
    HOUR: 1,
    MINUTE: 2
});