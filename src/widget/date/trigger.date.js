BI.DateTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4,
        vgap: 2,
        triggerWidth: 30,
        yearLength: 4,
        yearMonthLength: 7
    },

    _defaultConfig: function () {
        return BI.extend(BI.DateTrigger.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-date-trigger",
            min: '1900-01-01', //最小日期
            max: '2099-12-31', //最大日期
            height: 25
        });
    },
    _init: function () {
        BI.DateTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            height: o.height,
            validationChecker: function (v) {
                var date = v.match(/\d+/g);
                self._autoAppend(v, date);
                return self._dateCheck(v) && Date.checkLegal(v) && self._checkVoid({
                        year: date[0],
                        month: date[1],
                        day: date[2]
                    });
            },
            quitChecker: function () {
                return false;
            },
            hgap: c.hgap,
            vgap: c.vgap,
            allowBlank: true,
            watermark: BI.i18nText("BI-Unrestricted"),
            errorText: function () {
                if (self.editor.isEditing()) {
                    return BI.i18nText("BI-Date_Trigger_Error_Text");
                }
                return BI.i18nText("BI-Year_Trigger_Invalid_Text");
            }
        });
        this.editor.on(BI.SignEditor.EVENT_KEY_DOWN, function () {
            self.fireEvent(BI.DateTrigger.EVENT_KEY_DOWN)
        });
        this.editor.on(BI.SignEditor.EVENT_FOCUS, function () {
            self.fireEvent(BI.DateTrigger.EVENT_FOCUS);
        });
        this.editor.on(BI.SignEditor.EVENT_STOP, function () {
            self.fireEvent(BI.DateTrigger.EVENT_STOP);
        });
        this.editor.on(BI.SignEditor.EVENT_VALID, function () {
            self.fireEvent(BI.DateTrigger.EVENT_VALID);
        });
        this.editor.on(BI.SignEditor.EVENT_ERROR, function () {
            self.fireEvent(BI.DateTrigger.EVENT_ERROR);
        });
        this.editor.on(BI.SignEditor.EVENT_CONFIRM, function () {
            var value = self.editor.getState();
            if (BI.isNotNull(value)) {
                self.editor.setState(value);
            }

            if (BI.isNotEmptyString(value)) {
                var date = value.split("-");
                self.store_value = {
                    type: BI.DateTrigger.MULTI_DATE_CALENDAR,
                    value:{
                        year: date[0] | 0,
                        month: date[1] - 1,
                        day: date[2] | 0
                    }
                };
            }
            self.fireEvent(BI.DateTrigger.EVENT_CONFIRM);
        });
        this.editor.on(BI.SignEditor.EVENT_SPACE, function () {
            if (self.editor.isValid()) {
                self.editor.blur();
            }
        });
        this.editor.on(BI.SignEditor.EVENT_START, function () {
            self.fireEvent(BI.DateTrigger.EVENT_START);
        });
        this.editor.on(BI.SignEditor.EVENT_CHANGE, function () {
            self.fireEvent(BI.DateTrigger.EVENT_CHANGE);
        });
        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: BI.createWidget(),
                width: 30
            }, {
                el: this.editor
            }]
        })
    },
    _dateCheck: function (date) {
        return Date.parseDateTime(date, "%Y-%x-%d").print("%Y-%x-%d") == date || Date.parseDateTime(date, "%Y-%X-%d").print("%Y-%X-%d") == date || Date.parseDateTime(date, "%Y-%x-%e").print("%Y-%x-%e") == date || Date.parseDateTime(date, "%Y-%X-%e").print("%Y-%X-%e") == date;
    },
    _checkVoid: function (obj) {
        return !Date.checkVoid(obj.year, obj.month, obj.day, this.options.min, this.options.max)[0];
    },
    _autoAppend: function (v, dateObj) {
        var self = this;
        var date = Date.parseDateTime(v, "%Y-%X-%d").print("%Y-%X-%d");
        var yearCheck = function (v) {
            return Date.parseDateTime(v, "%Y").print("%Y") == v && date >= self.options.min && date <= self.options.max;
        };
        var monthCheck = function (v) {
            return Date.parseDateTime(v, "%Y-%X").print("%Y-%X") == v && date >= self.options.min && date <= self.options.max;
        };
        if (BI.isNotNull(dateObj) && Date.checkLegal(v)) {
            switch (v.length) {
                case this._const.yearLength:
                    if (yearCheck(v)) {
                        this.editor.setValue(v + "-");
                    }
                    break;
                case this._const.yearMonthLength:
                    if (monthCheck(v)) {
                        this.editor.setValue(v + "-");
                    }
                    break;
            }
        }
    },

    setValue: function (v) {
        var type, value, self = this;
        var date = new Date();
        this.store_value = v;
        if (BI.isNotNull(v)) {
            type = v.type || BI.DateTrigger.MULTI_DATE_CALENDAR; value = v.value;
            if(BI.isNull(value)){
                value = v;
            }
        }
        var _setInnerValue = function (date, text) {
            var dateStr = date.print("%Y-%x-%e");
            self.editor.setState(dateStr);
            self.editor.setValue(dateStr);
            self.setTitle(text + ":" + dateStr);
        };
        switch (type) {
            case BI.DateTrigger.MULTI_DATE_YEAR_PREV:
                var text = value + BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_YEAR_PREV];
                date = new Date((date.getFullYear() - 1 * value), date.getMonth(), date.getDate());
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_YEAR_AFTER:
                var text = value + BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_YEAR_AFTER];
                date = new Date((date.getFullYear() + 1 * value), date.getMonth(), date.getDate());
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_YEAR_BEGIN:
                var text = BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_YEAR_BEGIN];
                date = new Date(date.getFullYear(), 0, 1);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_YEAR_END:
                var text = BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_YEAR_END];
                date = new Date(date.getFullYear(), 11, 31);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_QUARTER_PREV:
                var text = value + BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_QUARTER_PREV];
                date = new Date().getBeforeMulQuarter(value);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_QUARTER_AFTER:
                var text = value + BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_QUARTER_AFTER];
                date = new Date().getAfterMulQuarter(value);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_QUARTER_BEGIN:
                var text = BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_QUARTER_BEGIN];
                date = new Date().getQuarterStartDate();
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_QUARTER_END:
                var text = BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_QUARTER_END];
                date = new Date().getQuarterEndDate();
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_MONTH_PREV:
                var text = value + BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_MONTH_PREV];
                date = new Date().getBeforeMultiMonth(value);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_MONTH_AFTER:
                var text = value + BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_MONTH_AFTER];
                date = new Date().getAfterMultiMonth(value);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_MONTH_BEGIN:
                var text = BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_MONTH_BEGIN];
                date = new Date(date.getFullYear(), date.getMonth(), 1);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_MONTH_END:
                var text = BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_MONTH_END];
                date = new Date(date.getFullYear(), date.getMonth(), (date.getLastDateOfMonth()).getDate());
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_WEEK_PREV:
                var text = value + BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_WEEK_PREV];
                date = date.getOffsetDate(-7 * value);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_WEEK_AFTER:
                var text = value + BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_WEEK_AFTER];
                date = date.getOffsetDate(7 * value);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_DAY_PREV:
                var text = value + BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_DAY_PREV];
                date = date.getOffsetDate(-1 * value);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_DAY_AFTER:
                var text = value + BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_DAY_AFTER];
                date = date.getOffsetDate(1 * value);
                _setInnerValue(date, text);
                break;
            case BI.DateTrigger.MULTI_DATE_DAY_TODAY:
                var text = BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_DAY_TODAY];
                date = new Date();
                _setInnerValue(date, text);
                break;
            default:
                if (BI.isNull(value) || BI.isNull(value.day)) {
                    this.editor.setState("");
                    this.editor.setValue("");
                    this.setTitle("");
                } else {
                    var dateStr = value.year + "-" + (value.month + 1) + "-" + value.day;
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
        return this.store_value;
    }

});

BI.DateTrigger.MULTI_DATE_YEAR_PREV = 1;
BI.DateTrigger.MULTI_DATE_YEAR_AFTER = 2;
BI.DateTrigger.MULTI_DATE_YEAR_BEGIN = 3;
BI.DateTrigger.MULTI_DATE_YEAR_END = 4;

BI.DateTrigger.MULTI_DATE_MONTH_PREV = 5;
BI.DateTrigger.MULTI_DATE_MONTH_AFTER = 6;
BI.DateTrigger.MULTI_DATE_MONTH_BEGIN = 7;
BI.DateTrigger.MULTI_DATE_MONTH_END = 8;

BI.DateTrigger.MULTI_DATE_QUARTER_PREV = 9;
BI.DateTrigger.MULTI_DATE_QUARTER_AFTER = 10;
BI.DateTrigger.MULTI_DATE_QUARTER_BEGIN = 11;
BI.DateTrigger.MULTI_DATE_QUARTER_END = 12;

BI.DateTrigger.MULTI_DATE_WEEK_PREV = 13;
BI.DateTrigger.MULTI_DATE_WEEK_AFTER = 14;

BI.DateTrigger.MULTI_DATE_DAY_PREV = 15;
BI.DateTrigger.MULTI_DATE_DAY_AFTER = 16;
BI.DateTrigger.MULTI_DATE_DAY_TODAY = 17;

BI.DateTrigger.MULTI_DATE_PARAM = 18;
BI.DateTrigger.MULTI_DATE_CALENDAR = 19;

BI.DateTrigger.MULTI_DATE_SEGMENT_NUM = {};
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_YEAR_PREV] = BI.i18nText("BI-Multi_Date_Year_Prev");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_YEAR_AFTER] = BI.i18nText("BI-Multi_Date_Year_Next");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_YEAR_BEGIN] = BI.i18nText("BI-Multi_Date_Year_Begin");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_YEAR_END] = BI.i18nText("BI-Multi_Date_Year_End");

BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_QUARTER_PREV] = BI.i18nText("BI-Multi_Date_Quarter_Prev");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_QUARTER_AFTER] = BI.i18nText("BI-Multi_Date_Quarter_Next");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_QUARTER_BEGIN] = BI.i18nText("BI-Multi_Date_Quarter_Begin");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_QUARTER_END] = BI.i18nText("BI-Multi_Date_Quarter_End");

BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_MONTH_PREV] = BI.i18nText("BI-Multi_Date_Month_Prev");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_MONTH_AFTER] = BI.i18nText("BI-Multi_Date_Month_Next");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_MONTH_BEGIN] = BI.i18nText("BI-Multi_Date_Month_Begin");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_MONTH_END] = BI.i18nText("BI-Multi_Date_Month_End");

BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_WEEK_PREV] = BI.i18nText("BI-Multi_Date_Week_Prev");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_WEEK_AFTER] = BI.i18nText("BI-Multi_Date_Week_Next");

BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_DAY_PREV] = BI.i18nText("BI-Multi_Date_Day_Prev");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_DAY_AFTER] = BI.i18nText("BI-Multi_Date_Day_Next");
BI.DateTrigger.MULTI_DATE_SEGMENT_NUM[BI.DateTrigger.MULTI_DATE_DAY_TODAY] = BI.i18nText("BI-Multi_Date_Today");

BI.DateTrigger.EVENT_FOCUS = "EVENT_FOCUS";
BI.DateTrigger.EVENT_START = "EVENT_START";
BI.DateTrigger.EVENT_STOP = "EVENT_STOP";
BI.DateTrigger.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DateTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.DateTrigger.EVENT_VALID = "EVENT_VALID";
BI.DateTrigger.EVENT_ERROR = "EVENT_ERROR";
BI.DateTrigger.EVENT_TRIGGER_CLICK = "EVENT_TRIGGER_CLICK";
BI.DateTrigger.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.shortcut("bi.date_trigger", BI.DateTrigger);