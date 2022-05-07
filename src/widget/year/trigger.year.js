BI.DynamicYearTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4,
        vgap: 2,
        iconWidth: 24
    },

    _defaultConfig: function () {
        return BI.extend(BI.DynamicYearTrigger.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-year-trigger",
            min: "1900-01-01", // 最小日期
            max: "2099-12-31", // 最大日期
            height: 24,
            watermark: BI.i18nText("BI-Basic_Unrestricted")
        });
    },

    beforeInit: function (callback) {
        var o = this.options;
        o.title = BI.bind(this._titleCreator, this);
        callback();
    },

    _init: function () {
        BI.DynamicYearTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            simple: o.simple,
            height: o.height,
            validationChecker: function (v) {
                return v === "" || (BI.isPositiveInteger(v) && !BI.checkDateVoid(v, 1, 1, o.min, o.max)[0]);
            },
            quitChecker: function (v) {
                return false;
            },
            hgap: c.hgap,
            vgap: c.vgap,
            watermark: o.watermark,
            allowBlank: true,
            errorText: function (v) {
                if (BI.isPositiveInteger(v)) {
                    var start = BI.parseDateTime(o.min, "%Y-%X-%d");
                    var end = BI.parseDateTime(o.max, "%Y-%X-%d");

                    return BI.i18nText("BI-Basic_Year_Range_Error",
                        start.getFullYear(),
                        end.getFullYear());
                }

                return BI.i18nText("BI-Year_Trigger_Invalid_Text");
            },
        });
        this.editor.on(BI.SignEditor.EVENT_KEY_DOWN, function () {
            self.fireEvent(BI.DynamicYearTrigger.EVENT_KEY_DOWN, arguments);
        });
        this.editor.on(BI.SignEditor.EVENT_FOCUS, function () {
            self.fireEvent(BI.DynamicYearTrigger.EVENT_FOCUS);
        });
        this.editor.on(BI.SignEditor.EVENT_STOP, function () {
            self.fireEvent(BI.DynamicYearTrigger.EVENT_STOP);
        });
        this.editor.on(BI.SignEditor.EVENT_CONFIRM, function () {
            var value = self.editor.getValue();
            if (BI.isNotNull(value)) {
                self.editor.setValue(value);
            }
            if (BI.isNotEmptyString(value)) {
                self.storeValue = {
                    type: BI.DynamicDateCombo.Static,
                    value: {
                        year: value
                    }
                };
            }

            self.fireEvent(BI.DynamicYearTrigger.EVENT_CONFIRM);
        });
        this.editor.on(BI.SignEditor.EVENT_SPACE, function () {
            if (self.editor.isValid()) {
                self.editor.blur();
            }
        });
        this.editor.on(BI.SignEditor.EVENT_START, function () {
            self.fireEvent(BI.DynamicYearTrigger.EVENT_START);
        });
        this.editor.on(BI.SignEditor.EVENT_ERROR, function () {
            self.fireEvent(BI.DynamicYearTrigger.EVENT_ERROR);
        });
        this.editor.on(BI.SignEditor.EVENT_VALID, function () {
            self.fireEvent(BI.DynamicYearTrigger.EVENT_VALID);
        });
        BI.createWidget({
            element: this,
            type: "bi.horizontal_fill",
            columnSize: ["fill", ""],
            items: [{
                el: this.editor
            }, {
                el: {
                    type: "bi.text_button",
                    baseCls: "bi-trigger-year-text",
                    text: BI.i18nText("BI-Multi_Date_Year"),
                },
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

    _getText: function (obj) {
        var value = "";
        if(BI.isNotNull(obj.year) && BI.parseInt(obj.year) !== 0) {
            value += Math.abs(obj.year) + BI.i18nText("BI-Basic_Year") + (obj.year < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
        }
        return value;
    },

    _setInnerValue: function (date, text) {
        var dateStr = BI.print(date, "%Y");
        this.editor.setState(dateStr);
        this.editor.setValue(dateStr);
    },

    _titleCreator: function () {
        var storeValue = this.storeValue || {};
        var type = storeValue.type || BI.DynamicDateCombo.Static;
        var value = storeValue.value;
        if(!this.editor.isValid()) {
            return "";
        }
        switch (type) {
            case BI.DynamicDateCombo.Dynamic:
                var text = this._getText(value);
                var date = BI.getDate();
                date = BI.DynamicDateHelper.getCalculation(value);
                var dateStr = BI.print(date, "%Y");
                return BI.isEmptyString(text) ? dateStr : (text + ":" + dateStr);
            case BI.DynamicDateCombo.Static:
            default:
                value = value || {};
                return value.year;
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
                this.editor.setState(value.year);
                this.editor.setValue(value.year);
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

    getValue: function () {
        return this.storeValue;
    },

    getKey: function () {
        return this.editor.getValue() | 0;
    },

    setWaterMark: function (v) {
        this.editor.setWaterMark(v);
    }
});
BI.DynamicYearTrigger.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.DynamicYearTrigger.EVENT_FOCUS = "EVENT_FOCUS";
BI.DynamicYearTrigger.EVENT_ERROR = "EVENT_ERROR";
BI.DynamicYearTrigger.EVENT_START = "EVENT_START";
BI.DynamicYearTrigger.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DynamicYearTrigger.EVENT_STOP = "EVENT_STOP";
BI.DynamicYearTrigger.EVENT_VALID = "EVENT_VALID";
BI.shortcut("bi.dynamic_year_trigger", BI.DynamicYearTrigger);