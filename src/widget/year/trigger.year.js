BI.DynamicYearTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4,
        vgap: 2
    },

    _defaultConfig: function () {
        return BI.extend(BI.DynamicYearTrigger.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-year-trigger",
            min: "1900-01-01", // 最小日期
            max: "2099-12-31", // 最大日期
            height: 24
        });
    },
    _init: function () {
        BI.DynamicYearTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            height: o.height,
            validationChecker: function (v) {
                return v === "" || (BI.isPositiveInteger(v) && !BI.checkDateVoid(v, 1, 1, o.min, o.max)[0]);
            },
            quitChecker: function (v) {
                return false;
            },
            hgap: c.hgap,
            vgap: c.vgap,
            watermark: BI.i18nText("BI-Basic_Unrestricted"),
            allowBlank: true,
            errorText: function (v) {
                return !BI.isPositiveInteger(v) ? BI.i18nText("BI-Please_Input_Positive_Integer") : BI.i18nText("BI-Year_Trigger_Invalid_Text");
            }
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
        BI.createWidget({
            element: this,
            type: "bi.htape",
            items: [{
                el: this.editor
            }, {
                el: {
                    type: "bi.text_button",
                    baseCls: "bi-trigger-year-text",
                    text: BI.i18nText("BI-Multi_Date_Year"),
                    width: o.height
                },
                width: o.height
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

    _getText: function (obj) {
        var value = "";
        if(BI.isNotNull(obj.year) && obj.year !== 0) {
            value += Math.abs(obj.year) + BI.i18nText("BI-Basic_Year") + (obj.year < 0 ? BI.i18nText("BI-Basic_Front") : BI.i18nText("BI-Basic_Behind"));
        }
        return value;
    },

    _setInnerValue: function (date, text) {
        var dateStr = date.print("%Y");
        this.editor.setState(dateStr);
        this.editor.setValue(dateStr);
        this.setTitle(BI.isEmptyString(text) ? dateStr : (text + ":" + dateStr));
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
                this.setTitle(value.year);
                break;
        }
    },

    getValue: function () {
        return this.storeValue;
    },

    getKey: function () {
        return this.editor.getValue() | 0;
    }
});
BI.DynamicYearTrigger.EVENT_FOCUS = "EVENT_FOCUS";
BI.DynamicYearTrigger.EVENT_ERROR = "EVENT_ERROR";
BI.DynamicYearTrigger.EVENT_START = "EVENT_START";
BI.DynamicYearTrigger.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.DynamicYearTrigger.EVENT_STOP = "EVENT_STOP";
BI.shortcut("bi.dynamic_year_trigger", BI.DynamicYearTrigger);