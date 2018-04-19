BI.DynamicDateTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4,
        vgap: 2,
        yearLength: 4,
        yearMonthLength: 7
    },

    props: {
        extraCls: "bi-date-trigger",
        min: "1900-01-01", // 最小日期
        max: "2099-12-31", // 最大日期
        height: 24
    },

    _init: function () {
        BI.DynamicDateTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            height: o.height,
            validationChecker: function (v) {
                var date = v.match(/\d+/g);
                self._autoAppend(v, date);
                return self._dateCheck(v) && BI.checkDateLegal(v) && self._checkVoid({
                    year: date[0] | 0,
                    month: date[1] | 0,
                    day: date[2] | 0
                });
            },
            quitChecker: function () {
                return false;
            },
            hgap: c.hgap,
            vgap: c.vgap,
            allowBlank: true,
            watermark: BI.i18nText("BI-Basic_Unrestricted"),
            errorText: function () {
                if (self.editor.isEditing()) {
                    return BI.i18nText("BI-Date_Trigger_Error_Text");
                }
                return BI.i18nText("BI-Year_Trigger_Invalid_Text");
            }
        });
        this.editor.on(BI.SignEditor.EVENT_KEY_DOWN, function () {
            self.fireEvent(BI.DynamicDateTrigger.EVENT_KEY_DOWN);
        });
        this.editor.on(BI.SignEditor.EVENT_FOCUS, function () {
            self.fireEvent(BI.DynamicDateTrigger.EVENT_FOCUS);
        });
        this.editor.on(BI.SignEditor.EVENT_STOP, function () {
            self.fireEvent(BI.DynamicDateTrigger.EVENT_STOP);
        });
        this.editor.on(BI.SignEditor.EVENT_VALID, function () {
            self.fireEvent(BI.DynamicDateTrigger.EVENT_VALID);
        });
        this.editor.on(BI.SignEditor.EVENT_ERROR, function () {
            self.fireEvent(BI.DynamicDateTrigger.EVENT_ERROR);
        });
        this.editor.on(BI.SignEditor.EVENT_CONFIRM, function () {
            var value = self.editor.getValue();
            if (BI.isNotNull(value)) {
                self.editor.setState(value);
            }

            if (BI.isNotEmptyString(value)) {
                var date = value.split("-");
                self.storeValue = {
                    type: BI.DynamicDateCombo.Static,
                    value: {
                        year: date[0] | 0,
                        month: date[1],
                        day: date[2] | 0
                    }
                };
            }
            self.fireEvent(BI.DynamicDateTrigger.EVENT_CONFIRM);
        });
        this.editor.on(BI.SignEditor.EVENT_SPACE, function () {
            if (self.editor.isValid()) {
                self.editor.blur();
            }
        });
        this.editor.on(BI.SignEditor.EVENT_START, function () {
            self.fireEvent(BI.DynamicDateTrigger.EVENT_START);
        });
        this.editor.on(BI.SignEditor.EVENT_CHANGE, function () {
            self.fireEvent(BI.DynamicDateTrigger.EVENT_CHANGE);
        });
        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: this.editor
            }, {
                el: BI.createWidget(),
                width: 30
            }]
        });
        this.setValue(o.value);
    },
    _dateCheck: function (date) {
        return BI.parseDateTime(date, "%Y-%x-%d").print("%Y-%x-%d") === date ||
            BI.parseDateTime(date, "%Y-%X-%d").print("%Y-%X-%d") === date ||
            BI.parseDateTime(date, "%Y-%x-%e").print("%Y-%x-%e") === date ||
            BI.parseDateTime(date, "%Y-%X-%e").print("%Y-%X-%e") === date;
    },
    _checkVoid: function (obj) {
        return !BI.checkDateVoid(obj.year, obj.month, obj.day, this.options.min, this.options.max)[0];
    },
    _autoAppend: function (v, dateObj) {
        if (BI.isNotNull(dateObj) && BI.checkDateLegal(v)) {
            switch (v.length) {
                case this._const.yearLength:
                    if (this._yearCheck(v)) {
                        this.editor.setValue(v + "-");
                    }
                    break;
                case this._const.yearMonthLength:
                    if (this._monthCheck(v)) {
                        this.editor.setValue(v + "-");
                    }
                    break;
            }
        }
    },

    _yearCheck: function (v) {
        var date = BI.parseDateTime(v, "%Y-%X-%d").print("%Y-%X-%d");
        return BI.parseDateTime(v, "%Y").print("%Y") === v && date >= this.options.min && date <= this.options.max;
    },

    _monthCheck: function (v) {
        var date = BI.parseDateTime(v, "%Y-%X-%d").print("%Y-%X-%d");
        return BI.parseDateTime(v, "%Y-%X").print("%Y-%X") === v && date >= this.options.min && date <= this.options.max;
    },

    _setInnerValue: function (date, text) {
        var dateStr = date.print("%Y-%x-%e");
        this.editor.setState(dateStr);
        this.editor.setValue(dateStr);
        this.setTitle(BI.isEmptyString(text) ? dateStr : (text + ":" + dateStr));
    },

    _getText: function (obj) {
        var value = "";
        var endText = "";
        if(BI.isNotNull(obj.year) && BI.parseInt(obj.year) !== 0) {
            value += Math.abs(obj.year) + BI.i18nText("BI-Basic_Year") + (obj.year < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
            endText = getPositionText(BI.i18nText("BI-Basic_Year"), obj.position);
        }
        if(BI.isNotNull(obj.quarter) && BI.parseInt(obj.quarter) !== 0) {
            value += Math.abs(obj.quarter) + BI.i18nText("BI-Basic_Single_Quarter") + (obj.quarter < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
            endText = getPositionText(BI.i18nText("BI-Basic_Single_Quarter"), obj.position);
        }
        if(BI.isNotNull(obj.month) && BI.parseInt(obj.month) !== 0) {
            value += Math.abs(obj.month) + BI.i18nText("BI-Basic_Month") + (obj.month < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
            endText = getPositionText(BI.i18nText("BI-Basic_Month"), obj.position);
        }
        if(BI.isNotNull(obj.week) && BI.parseInt(obj.week) !== 0) {
            value += Math.abs(obj.week) + BI.i18nText("BI-Basic_Week") + (obj.week < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
            endText = getPositionText(BI.i18nText("BI-Basic_Week"), obj.position);
        }
        if(BI.isNotNull(obj.day) && BI.parseInt(obj.day) !== 0) {
            value += Math.abs(obj.day) + BI.i18nText("BI-Basic_Day") + (obj.day < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
            endText = BI.size(obj) === 1 ? getPositionText(BI.i18nText("BI-Basic_Month"), obj.position) : "";
        }
        if(BI.isNotNull(obj.workDay) && BI.parseInt(obj.workDay) !== 0) {
            value += Math.abs(obj.workDay) + BI.i18nText("BI-Basic_Work_Day") + (obj.workDay < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
        }
        return value + endText;

        function getPositionText (baseText, position) {
            switch (position) {
                case BI.DynamicDateCard.OFFSET.BEGIN:
                    return baseText + BI.i18nText("BI-Basic_Begin_Start");
                case BI.DynamicDateCard.OFFSET.END:
                    return baseText + BI.i18nText("BI-Basic_End_Stop");
                case BI.DynamicDateCard.OFFSET.CURRENT:
                default:
                    return BI.i18nText("BI-Basic_Current_Day");
            }
        }
    },

    setValue: function (v) {
        var type, value, self = this;
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
                if (BI.isNull(value) || BI.isNull(value.day)) {
                    this.editor.setState("");
                    this.editor.setValue("");
                    this.setTitle("");
                } else {
                    var dateStr = value.year + "-" + (value.month) + "-" + value.day;
                    this.editor.setState(dateStr);
                    this.editor.setValue(dateStr);
                    this.setTitle(dateStr);
                }
                break;
        }
    },

    getKey: function () {
        return this.editor.getValue();
    },
    getValue: function () {
        return this.storeValue;
    }

});

BI.DynamicDateTrigger.EVENT_FOCUS = "EVENT_FOCUS";
BI.DynamicDateTrigger.EVENT_START = "EVENT_START";
BI.DynamicDateTrigger.EVENT_STOP = "EVENT_STOP";
BI.DynamicDateTrigger.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DynamicDateTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.DynamicDateTrigger.EVENT_VALID = "EVENT_VALID";
BI.DynamicDateTrigger.EVENT_ERROR = "EVENT_ERROR";
BI.DynamicDateTrigger.EVENT_TRIGGER_CLICK = "EVENT_TRIGGER_CLICK";
BI.DynamicDateTrigger.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.shortcut("bi.dynamic_date_trigger", BI.DynamicDateTrigger);