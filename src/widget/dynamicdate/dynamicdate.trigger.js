BI.DynamicDateTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4,
        vgap: 2,
        yearLength: 4,
        yearMonthLength: 6,
        yearFullMonthLength: 7,
        compareFormat: "%Y-%X-%d",
        iconWidth: 24
    },

    props: {
        extraCls: "bi-date-trigger",
        min: "1900-01-01", // 最小日期
        max: "2099-12-31", // 最大日期
        height: 24,
        iconWidth: 24,
        format: "", // 显示的日期格式化方式
        allowEdit: true, // 是否允许编辑
        watermark: ""
    },

    _init: function () {
        BI.DynamicDateTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.storeTriggerValue = "";
        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            simple: o.simple,
            height: o.height,
            validationChecker: function (v) {
                var formatStr = self._getStandardDateStr(v);
                var date = formatStr.match(/\d+/g);
                !BI.isKey(o.format) && self._autoAppend(v, date);
                return self._dateCheck(formatStr) && BI.checkDateLegal(formatStr) && self._checkVoid({
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
            watermark: BI.isKey(o.watermark) ? o.watermark : BI.i18nText("BI-Basic_Unrestricted"),
            errorText: function (v) {
                var str = "";
                if (!BI.isKey(o.format)) {
                    if (!self._dateCheck(v)) {
                        str = self.editor.isEditing() ? BI.i18nText("BI-Date_Trigger_Error_Text") : BI.i18nText("BI-Year_Trigger_Invalid_Text");
                    } else {
                        var start = BI.parseDateTime(o.min, "%Y-%X-%d");
                        var end = BI.parseDateTime(o.max, "%Y-%X-%d");
                        str = BI.i18nText("BI-Basic_Date_Range_Error",
                            start.getFullYear(),
                            start.getMonth() + 1,
                            start.getDate(),
                            end.getFullYear(),
                            end.getMonth() + 1,
                            end.getDate()
                        );
                    }
                }

                return str;
            },
            title: BI.bind(this._getTitle, this)
        });
        this.editor.on(BI.SignEditor.EVENT_KEY_DOWN, function () {
            self.fireEvent(BI.DynamicDateTrigger.EVENT_KEY_DOWN, arguments);
        });
        this.editor.on(BI.SignEditor.EVENT_FOCUS, function () {
            self.storeTriggerValue = self.getKey();
            self.fireEvent(BI.DynamicDateTrigger.EVENT_FOCUS);
        });
        this.editor.on(BI.SignEditor.EVENT_BLUR, function () {
            self.fireEvent(BI.DynamicDateTrigger.EVENT_BLUR);
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

            if (BI.isNotEmptyString(value) && !BI.isEqual(self.storeTriggerValue, self.getKey())) {
                var formatStr = self._getStandardDateStr(value);
                var date = formatStr.match(/\d+/g);
                self.storeValue = {
                    type: BI.DynamicDateCombo.Static,
                    value: {
                        year: date[0] | 0,
                        month: date[1] | 0,
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
            columnSize: ["", this._const.iconWidth],
            items: [{
                el: this.editor
            }, {
                el: {
                    type: "bi.icon_button",
                    cls: "bi-trigger-icon-button date-font",
                    width: this._const.iconWidth
                },
                width: this._const.iconWidth
            }]
        });
        !o.allowEdit && BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.text",
                    title: BI.bind(this._getTitle, this)
                },
                left: 0,
                right: o.iconWidth,
                top: 0,
                bottom: 0
            }]
        });
        this.setValue(o.value);
    },

    _getTitle: function () {
        var storeValue = this.storeValue || {};
        var type = storeValue.type || BI.DynamicDateCombo.Static;
        var value = storeValue.value;
        switch (type) {
            case BI.DynamicDateCombo.Dynamic:
                var text = this._getText(value);
                var date = BI.getDate();
                date = BI.DynamicDateHelper.getCalculation(value);
                var dateStr = BI.print(date, this._getFormatString());
                return BI.isEmptyString(text) ? dateStr : (text + ":" + dateStr);
            case BI.DynamicDateCombo.Static:
            default:
                if (BI.isNull(value) || BI.isNull(value.day)) {
                    return "";
                }
                return BI.print(BI.getDate(value.year, (value.month - 1), value.day), this._getFormatString());
        }
    },

    _getStandardDateStr: function (v) {
        var c = this._const;
        var result = [0, 1, 2];
        var formatArray = this._getFormatString().match(/%./g);
        BI.each(formatArray, function (idx, v) {
            switch (v) {
                case "%Y":
                case "%y":
                    result[0] = idx;
                    break;
                case "%X":
                case "%x":
                    result[1] = idx;
                    break;
                case "%d":
                case "%e":
                default:
                    result[2] = idx;
                    break;
            }
        });
        // 这边不能直接用\d+去切日期, 因为format格式可能是20190607这样的没有分割符的 = =
        // 先看一下是否是合法的, 如果合法就变成标准格式的走原来的流程, 不合法不关心
        var date = BI.parseDateTime(v, this._getFormatString());
        if(BI.print(date, this._getFormatString()) === v) {
            v = BI.print(date, c.compareFormat);
            result = [0, 1, 2];
        }
        var dateArray = v.match(/\d+/g);
        var newArray = [];
        BI.each(dateArray, function (idx) {
            newArray[idx] = dateArray[result[idx]];
        });
        // 这边之所以不直接返回join结果是因为年的格式可能只有2位，所以需要format一下
        if(newArray.length === result.length && newArray[0].length === 2) {
            return BI.print(BI.parseDateTime(newArray.join("-"), c.compareFormat), c.compareFormat);
        }
        // 这边format成-20-也没关系, 反正都是不合法的
        return newArray.join("-");
    },

    _getFormatString: function () {
        return this.options.format || this._const.compareFormat;
    },

    _dateCheck: function (date) {
        return BI.print(BI.parseDateTime(date, "%Y-%x-%d"), "%Y-%x-%d") === date ||
            BI.print(BI.parseDateTime(date, "%Y-%X-%d"), "%Y-%X-%d") === date ||
            BI.print(BI.parseDateTime(date, "%Y-%x-%e"), "%Y-%x-%e") === date ||
            BI.print(BI.parseDateTime(date, "%Y-%X-%e"), "%Y-%X-%e") === date;
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
                case this._const.yearFullMonthLength:
                    var splitMonth = v.split("-")[1];
                    if ((BI.isNotNull(splitMonth) && splitMonth.length === 2) || this._monthCheck(v)) {
                        this.editor.setValue(v + "-");
                    }
                    break;
            }
        }
    },

    _yearCheck: function (v) {
        var date = BI.print(BI.parseDateTime(v, this._getFormatString()), this._const.compareFormat);
        return BI.print(BI.parseDateTime(v, "%Y"), "%Y") === v && date >= this.options.min && date <= this.options.max;
    },

    _monthCheck: function (v) {
        var date = BI.parseDateTime(v, this._getFormatString());
        var dateStr = BI.print(date, this._const.compareFormat);
        return (date.getMonth() >= 0 && (BI.print(BI.parseDateTime(v, "%Y-%X"), "%Y-%X") === v ||
            BI.print(BI.parseDateTime(v, "%Y-%x"), "%Y-%x") === v)) && dateStr >= this.options.min && dateStr <= this.options.max;
    },

    _setInnerValue: function (date) {
        var dateStr = BI.print(date, this._getFormatString());
        this.editor.setState(dateStr);
        this.editor.setValue(dateStr);
    },

    _getText: function (obj) {
        return BI.DynamicDateHelper.getDescription(obj);
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
                } else {
                    var dateStr = BI.print(BI.getDate(value.year, (value.month - 1), value.day), this._getFormatString());
                    this.editor.setState(dateStr);
                    this.editor.setValue(dateStr);
                }
                break;
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

    getKey: function () {
        return this.editor.getValue();
    },
    getValue: function () {
        return this.storeValue;
    },

    focus: function () {
        this.editor.focus();
    },

    blur: function () {
        this.editor.blur();
    },

    setWaterMark: function (v) {
        this.editor.setWaterMark(v);
    }
});

BI.DynamicDateTrigger.EVENT_BLUR = "EVENT_BLUR";
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
