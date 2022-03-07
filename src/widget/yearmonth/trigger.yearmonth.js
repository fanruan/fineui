BI.DynamicYearMonthTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4,
        vgap: 2,
        iconWidth: 24
    },

    props: {
        extraCls: "bi-year-month-trigger",
        min: "1900-01-01", // 最小日期
        max: "2099-12-31", // 最大日期
        height: 24
    },

    beforeInit: function (callback) {
        var o = this.options;
        o.title = BI.bind(this._titleCreator, this);
        callback();
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
                    type: "bi.horizontal_fill",
                    columnSize: ["fill", ""],
                    items: [this.yearEditor, {
                        el: {
                            type: "bi.text_button",
                            text: BI.i18nText("BI-Multi_Date_Year"),
                        },
                    }]
                }, {
                    type: "bi.horizontal_fill",
                    columnSize: ["fill", ""],
                    items: [this.monthEditor, {
                        el: {
                            type: "bi.text_button",
                            text: BI.i18nText("BI-Multi_Date_Month"),
                        },
                    }]
                }]
            }, {
                el: {
                    type: "bi.trigger_icon_button",
                    width: this._const.iconWidth
                },
                width: this._const.iconWidth
            }]
        });
        this.setValue(o.value);
    },

    _createEditor: function (isYear) {
        var self = this, o = this.options, c = this._const;
        var editor = BI.createWidget({
            type: "bi.sign_editor",
            simple: o.simple,
            height: o.height,
            validationChecker: function (v) {
                if (isYear) {
                    var month = self.monthEditor.getValue();
                    if(BI.isEmptyString(month)) {
                        month = parseInt(v, 10) === BI.parseDateTime(o.min, "%Y-%X-%d").getFullYear() ? (BI.parseDateTime(o.min, "%Y-%X-%d").getMonth() + 1) : 1;
                    }
                    return v === "" || (BI.isPositiveInteger(v) && !BI.checkDateVoid(v, month, 1, o.min, o.max)[0]);
                }
                var year = self.yearEditor.getValue();

                return v === "" || ((BI.isPositiveInteger(v) && v >= 1 && v <= 12) && (BI.isEmptyString(year) ? true : !BI.checkDateVoid(self.yearEditor.getValue(), v, 1, o.min, o.max)[0]));
            },
            quitChecker: function () {
                return false;
            },
            watermark: BI.i18nText("BI-Basic_Unrestricted"),
            errorText: function (v) {
                var year = isYear ? v : self.yearEditor.getValue();
                var month = isYear ? self.monthEditor.getValue() : v;
                if (!BI.isPositiveInteger(year) || !BI.isPositiveInteger(month) || month > 12) {
                    return BI.i18nText("BI-Year_Trigger_Invalid_Text");
                }

                var start = BI.parseDateTime(o.min, "%Y-%X-%d");
                var end = BI.parseDateTime(o.max, "%Y-%X-%d");

                return BI.i18nText("BI-Basic_Year_Month_Range_Error",
                    start.getFullYear(),
                    start.getMonth() + 1,
                    end.getFullYear(),
                    end.getMonth() + 1
                );
            },
            hgap: c.hgap,
            vgap: c.vgap,
            allowBlank: true
        });
        editor.on(BI.SignEditor.EVENT_KEY_DOWN, function () {
            self.fireEvent(BI.DynamicYearMonthTrigger.EVENT_KEY_DOWN);
        });
        editor.on(BI.SignEditor.EVENT_FOCUS, function () {
            self.fireEvent(BI.DynamicYearMonthTrigger.EVENT_FOCUS);
        });
        editor.on(BI.SignEditor.EVENT_STOP, function () {
            self.fireEvent(BI.DynamicYearMonthTrigger.EVENT_STOP);
        });
        editor.on(BI.SignEditor.EVENT_CONFIRM, function () {
            self._doEditorConfirm(editor);
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
        editor.on(BI.SignEditor.EVENT_VALID, function () {
            var year = self.yearEditor.getValue();
            var month = self.monthEditor.getValue();
            if(BI.isNotEmptyString(year) && BI.isNotEmptyString(month)) {
                if(BI.isPositiveInteger(year) && month >= 1 && month <= 12 && !BI.checkDateVoid(year, month, 1, o.min, o.max)[0]) {
                    self.fireEvent(BI.DynamicYearMonthTrigger.EVENT_VALID);
                }
            }
        });
        editor.on(BI.SignEditor.EVENT_CHANGE, function () {
            if(isYear) {
                self._autoSwitch(editor);
            }
        });

        return editor;
    },

    _titleCreator: function () {
        var storeValue = this.storeValue || {};
        var type = storeValue.type || BI.DynamicDateCombo.Static;
        var value = storeValue.value;
        if(!this.monthEditor.isValid() || !this.yearEditor.isValid()) {
            return "";
        }
        switch (type) {
            case BI.DynamicDateCombo.Dynamic:
                var text = this._getText(value);
                var date = BI.getDate();
                date = BI.DynamicDateHelper.getCalculation(value);
                var dateStr = BI.print(date, "%Y-%x");
                return BI.isEmptyString(text) ? dateStr : (text + ":" + dateStr);
            case BI.DynamicDateCombo.Static:
            default:
                value = value || {};
                return this._getStaticTitle(value);
        }
    },

    _doEditorConfirm: function (editor) {
        var value = editor.getValue();
        if (BI.isNotNull(value)) {
            editor.setValue(value);
        }
        var monthValue = this.monthEditor.getValue();
        this.storeValue = {
            type: BI.DynamicDateCombo.Static,
            value: {
                year: this.yearEditor.getValue(),
                month: BI.isEmptyString(this.monthEditor.getValue()) ? "" : monthValue
            }
        };
    },

    _yearCheck: function (v) {
        var date = BI.print(BI.parseDateTime(v, "%Y-%X-%d"), "%Y-%X-%d");
        return BI.print(BI.parseDateTime(v, "%Y"), "%Y") === v && date >= this.options.min && date <= this.options.max;
    },

    _autoSwitch: function (editor) {
        var v = editor.getValue();
        if (BI.isNotEmptyString(v) && BI.checkDateLegal(v)) {
            if (v.length === 4 && this._yearCheck(v)) {
                this._doEditorConfirm(editor);
                this.fireEvent(BI.DynamicYearMonthTrigger.EVENT_CONFIRM);
                this.monthEditor.focus();
            }
        }
    },

    _getText: function (obj) {
        var value = "";
        if(BI.isNotNull(obj.year) && BI.parseInt(obj.year) !== 0) {
            value += Math.abs(obj.year) + BI.i18nText("BI-Basic_Year") + (obj.year < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
        }
        if(BI.isNotNull(obj.month) && BI.parseInt(obj.month) !== 0) {
            value += Math.abs(obj.month) + BI.i18nText("BI-Basic_Month") + (obj.month < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
        }
        return value;
    },

    _setInnerValue: function (date, text) {
        this.yearEditor.setValue(date.getFullYear());
        this.monthEditor.setValue(date.getMonth() + 1);
    },

    _getStaticTitle: function (value) {
        value = value || {};
        var hasYear = !(BI.isNull(value.year) || BI.isEmptyString(value.year));
        var hasMonth = !(BI.isNull(value.month) || BI.isEmptyString(value.month));
        switch ((hasYear << 1) | hasMonth) {
            // !hasYear && !hasMonth
            case 0:
                return "";
            // !hasYear && hasMonth
            case 1:
                return value.month;
            // hasYear && !hasMonth
            case 2:
                return value.year;
            // hasYear && hasMonth
            case 3:
            default:
                return value.year + "-" + value.month;
        }
    },

    setMinDate: function (minDate) {
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
                var month = BI.isNull(value.month) ? null : value.month;
                this.yearEditor.setValue(value.year);
                this.monthEditor.setValue(month);
                break;
        }
    },

    getValue: function () {
        return this.storeValue;
    },

    getKey: function () {
        return this.yearEditor.getValue() + "-" + this.monthEditor.getValue();
    },

    isStateValid: function () {
        return this.yearEditor.isValid() && this.monthEditor.isValid();
    }
});
BI.DynamicYearMonthTrigger.EVENT_VALID = "EVENT_VALID";
BI.DynamicYearMonthTrigger.EVENT_FOCUS = "EVENT_FOCUS";
BI.DynamicYearMonthTrigger.EVENT_ERROR = "EVENT_ERROR";
BI.DynamicYearMonthTrigger.EVENT_START = "EVENT_START";
BI.DynamicYearMonthTrigger.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DynamicYearMonthTrigger.EVENT_STOP = "EVENT_STOP";
BI.DynamicYearMonthTrigger.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.shortcut("bi.dynamic_year_month_trigger", BI.DynamicYearMonthTrigger);