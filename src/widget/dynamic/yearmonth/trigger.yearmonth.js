BI.DynamicYearMonthTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4,
        vgap: 2,
        errorText: BI.i18nText("BI-Please_Input_Positive_Integer"),
        errorTextInvalid: BI.i18nText("BI-Year_Trigger_Invalid_Text")
    },

    props: {
        extraCls: "bi-year-month-trigger",
        min: "1900-01-01", // 最小日期
        max: "2099-12-31", // 最大日期
        height: 24
    },

    _init: function () {
        BI.DynamicYearMonthTrigger.superclass._init.apply(this, arguments);
        var o = this.options;

        this.yearEditor = this._createEditor(true);
        this.monthEditor = this._createEditor(false);

        BI.createWidget({
            element: this,
            type: "bi.htape",
            items: [{
                type: "bi.center",
                items: [{
                    type: "bi.htape",
                    items: [this.yearEditor, {
                        el: {
                            type: "bi.text_button",
                            text: BI.i18nText("BI-Multi_Date_Year"),
                            width: o.height
                        },
                        width: o.height
                    }]
                }, {
                    type: "bi.htape",
                    items: [this.monthEditor, {
                        el: {
                            type: "bi.text_button",
                            text: BI.i18nText("BI-Multi_Date_Month"),
                            width: o.height
                        },
                        width: o.height}]
                }]
            }, {
                el: {
                    type: "bi.trigger_icon_button",
                    width: o.height
                },
                width: o.height
            }]
        });
        this.setValue(o.value);
    },

    _createEditor: function (isYear) {
        var self = this, o = this.options, c = this._const;
        var editor = BI.createWidget({
            type: "bi.sign_editor",
            height: o.height,
            validationChecker: function (v) {
                if(isYear) {
                    return v === "" || (BI.isPositiveInteger(v) && !BI.checkDateVoid(v, 1, 1, o.min, o.max)[0]);
                }
                return v === "" || ((v >= 1 && v <= 12) && !BI.checkDateVoid(BI.getDate().getFullYear(), v, 1, o.min, o.max)[0]);
            },
            quitChecker: function () {
                return false;
            },
            watermark: BI.i18nText("BI-Basic_Unrestricted"),
            errorText: function (v) {
                return !BI.isPositiveInteger(v) ? c.errorText : c.errorTextInvalid;
            },
            hgap: c.hgap,
            vgap: c.vgap,
            allowBlank: true
        });
        editor.on(BI.SignEditor.EVENT_FOCUS, function () {
            self.fireEvent(BI.DynamicYearMonthTrigger.EVENT_FOCUS);
        });
        editor.on(BI.SignEditor.EVENT_STOP, function () {
            self.fireEvent(BI.DynamicYearMonthTrigger.EVENT_STOP);
        });
        editor.on(BI.SignEditor.EVENT_CONFIRM, function () {
            var value = editor.getValue();
            if (BI.isNotNull(value)) {
                editor.setValue(value);
            }
            if (BI.isNotEmptyString(value)) {
                var monthValue = self.monthEditor.getValue();
                self.storeValue = {
                    type: BI.DynamicDateCombo.Static,
                    value: {
                        year: self.yearEditor.getValue(),
                        month: BI.isEmptyString(self.monthEditor.getValue()) ? "" : monthValue - 1
                    }
                };
            }

            self.fireEvent(BI.DynamicYearMonthTrigger.EVENT_CONFIRM);
        });
        editor.on(BI.SignEditor.EVENT_SPACE, function () {
            if (editor.isValid()) {
                editor.blur();
            }
        });
        editor.on(BI.SignEditor.EVENT_START, function () {
            self.fireEvent(BI.DynamicYearMonthTrigger.EVENT_START);
        });
        editor.on(BI.SignEditor.EVENT_ERROR, function () {
            self.fireEvent(BI.DynamicYearMonthTrigger.EVENT_ERROR);
        });
        editor.on(BI.SignEditor.EVENT_CHANGE, function () {
            if(isYear) {
                self._autoSwitch(editor.getValue());
            }
        });

        return editor;
    },

    _yearCheck: function (v) {
        var date = BI.parseDateTime(v, "%Y-%X-%d").print("%Y-%X-%d");
        return BI.parseDateTime(v, "%Y").print("%Y") === v && date >= this.options.min && date <= this.options.max;
    },

    _autoSwitch: function (v) {
        if (BI.checkDateLegal(v)) {
            if (v.length === 4 && this._yearCheck(v)) {
                this.monthEditor.focus();
            }
        }
    },

    _getText: function (obj) {
        var value = "";
        if(BI.isNotNull(obj.year)) {
            value += Math.abs(obj.year) + BI.i18nText("BI-Basic_Year") + (obj.year < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
        }
        if(BI.isNotNull(obj.month)) {
            value += Math.abs(obj.month) + BI.i18nText("BI-Basic_Year") + (obj.month < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
        }
        return value;
    },

    _setInnerValue: function (date, text) {
        var dateStr = date.print("%Y-%x");
        this.yearEditor.setValue(date.getFullYear());
        this.monthEditor.setValue(date.getMonth() + 1);
        this.setTitle(text + ":" + dateStr);
    },

    setValue: function (v) {
        var type, value;
        var date = BI.getDate();
        this.storeValue = v;
        if (BI.isNotNull(v)) {
            type = v.type || BI.DynamicDateCombo.Static;
            value = v.value || v;
        }
        switch (type) {
            case BI.DynamicDateCombo.Dynamic:
                var text = this._getText(value);
                date = BI.DynamicDateHelper.getCalculation(value);
                this._setInnerValue(date, text);
                break;
            case BI.DynamicDateCombo.Static:
            default:
                value = value || {};
                var month = BI.isNull(value.month) ? null : value.month + 1;
                this.yearEditor.setValue(value.year);
                this.yearEditor.setTitle(value.year);
                this.monthEditor.setValue(month);
                this.monthEditor.setTitle(month);
                break;
        }
    },

    getValue: function () {
        return this.storeValue;
    }
});
BI.DynamicYearMonthTrigger.EVENT_FOCUS = "EVENT_FOCUS";
BI.DynamicYearMonthTrigger.EVENT_ERROR = "EVENT_ERROR";
BI.DynamicYearMonthTrigger.EVENT_START = "EVENT_START";
BI.DynamicYearMonthTrigger.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DynamicYearMonthTrigger.EVENT_STOP = "EVENT_STOP";
BI.shortcut("bi.dynamic_year_month_trigger", BI.DynamicYearMonthTrigger);