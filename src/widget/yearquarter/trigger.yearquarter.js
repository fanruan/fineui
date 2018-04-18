BI.DynamicYearQuarterTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4,
        vgap: 2,
        errorText: BI.i18nText("BI-Please_Input_Positive_Integer"),
        errorTextInvalid: BI.i18nText("BI-Year_Trigger_Invalid_Text")
    },

    props: {
        extraCls: "bi-year-quarter-trigger",
        min: "1900-01-01", // 最小日期
        max: "2099-12-31", // 最大日期
        height: 24
    },

    _init: function () {
        BI.DynamicYearQuarterTrigger.superclass._init.apply(this, arguments);
        var o = this.options;

        this.yearEditor = this._createEditor(true);
        this.quarterEditor = this._createEditor(false);

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
                    items: [this.quarterEditor, {
                        el: {
                            type: "bi.text_button",
                            text: BI.i18nText("BI-Multi_Date_Quarter"),
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
                return v === "" || ((v >= 1 && v <= 4) && !BI.checkDateVoid(BI.getDate().getFullYear(), v, 1, o.min, o.max)[0]);
            },
            quitChecker: function () {
                return false;
            },
            errorText: function (v) {
                return !BI.isPositiveInteger(v) ? c.errorText : c.errorTextInvalid;
            },
            watermark: BI.i18nText("BI-Basic_Unrestricted"),
            hgap: c.hgap,
            vgap: c.vgap,
            allowBlank: true
        });
        editor.on(BI.SignEditor.EVENT_FOCUS, function () {
            self.fireEvent(BI.DynamicYearQuarterTrigger.EVENT_FOCUS);
        });
        editor.on(BI.SignEditor.EVENT_STOP, function () {
            self.fireEvent(BI.DynamicYearQuarterTrigger.EVENT_STOP);
        });
        editor.on(BI.SignEditor.EVENT_CONFIRM, function () {
            var value = editor.getValue();
            if (BI.isNotNull(value)) {
                editor.setValue(value);
            }
            if (BI.isNotEmptyString(value)) {
                var quarterValue = self.quarterEditor.getValue();
                self.storeValue = {
                    type: BI.DynamicYearQuarterCombo.Static,
                    value: {
                        year: self.yearEditor.getValue(),
                        quarter: BI.isEmptyString(self.quarterEditor.getValue()) ? "" : quarterValue
                    }
                };
            }
            self.setTitle(self._getStaticTitle(self.storeValue.value));

            self.fireEvent(BI.DynamicYearQuarterTrigger.EVENT_CONFIRM);
        });
        editor.on(BI.SignEditor.EVENT_SPACE, function () {
            if (editor.isValid()) {
                editor.blur();
            }
        });
        editor.on(BI.SignEditor.EVENT_START, function () {
            self.fireEvent(BI.DynamicYearQuarterTrigger.EVENT_START);
        });
        editor.on(BI.SignEditor.EVENT_ERROR, function () {
            self.fireEvent(BI.DynamicYearQuarterTrigger.EVENT_ERROR);
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
                this.quarterEditor.focus();
            }
        }
    },

    _getStaticTitle: function (value) {
        value = value || {};
        var yearStr = (BI.isNull(value.year) || BI.isEmptyString(value.year)) ? "" : value.year + "-";
        var quarterStr = (BI.isNull(value.quarter) || BI.isEmptyString(value.quarter)) ? "" : value.quarter;
        return yearStr + quarterStr;
    },

    _getText: function (obj) {
        var value = "";
        if(BI.isNotNull(obj.year) && obj.year !== 0) {
            value += Math.abs(obj.year) + BI.i18nText("BI-Basic_Year") + (obj.year < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
        }
        if(BI.isNotNull(obj.quarter) && obj.quarter !== 0) {
            value += Math.abs(obj.quarter) + BI.i18nText("BI-Basic_Single_Quarter") + (obj.quarter < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
        }
        return value;
    },

    _setInnerValue: function (date, text) {
        var dateStr = date.print("%Y-%x");
        this.yearEditor.setValue(date.getFullYear());
        this.quarterEditor.setValue(date.getQuarter());
        this.setTitle(BI.isEmptyString(text) ? dateStr : (text + ":" + dateStr));
    },

    setValue: function (v) {
        var type, value;
        var date = BI.getDate();
        this.storeValue = v;
        if (BI.isNotNull(v)) {
            type = v.type || BI.DynamicYearQuarterCombo.Static;
            value = v.value || v;
        }
        switch (type) {
            case BI.DynamicYearQuarterCombo.Dynamic:
                var text = this._getText(value);
                date = BI.DynamicDateHelper.getCalculation(value);
                this._setInnerValue(date, text);
                break;
            case BI.DynamicYearQuarterCombo.Static:
            default:
                value = value || {};
                var quarter = BI.isNull(value.quarter) ? null : value.quarter;
                this.yearEditor.setValue(value.year);
                this.yearEditor.setTitle(value.year);
                this.quarterEditor.setValue(quarter);
                this.quarterEditor.setTitle(quarter);
                this.setTitle(this._getStaticTitle(value));
                break;
        }
    },

    getValue: function () {
        return this.storeValue;
    }
});
BI.DynamicYearQuarterTrigger.EVENT_FOCUS = "EVENT_FOCUS";
BI.DynamicYearQuarterTrigger.EVENT_ERROR = "EVENT_ERROR";
BI.DynamicYearQuarterTrigger.EVENT_START = "EVENT_START";
BI.DynamicYearQuarterTrigger.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DynamicYearQuarterTrigger.EVENT_STOP = "EVENT_STOP";
BI.shortcut("bi.dynamic_year_quarter_trigger", BI.DynamicYearQuarterTrigger);