BI.DynamicDateParamItem = BI.inherit(BI.Widget, {

    props: function() {
        return {
            baseCls: "bi-dynamic-date-param-item",
            dateType: BI.DynamicDateCard.TYPE.YEAR,
            validationChecker: function() {
                return true;
            },
            value: 0,
            offset: 0,
            height: BI.SIZE_CONSANTS.TOOL_BAR_HEIGHT,
        }
    },

    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.htape",
            items: [{
                el: {
                    type: "bi.sign_editor",
                    cls: "bi-border",
                    height: BI.SIZE_CONSANTS.TOOL_BAR_HEIGHT - 2,
                    validationChecker: function (v) {
                        return BI.isNaturalNumber(v);
                    },
                    value: o.value,
                    ref: function () {
                        self.editor = this;
                    },
                    errorText: function () {
                        return BI.i18nText("BI-Please_Input_Natural_Number");
                    },
                    allowBlank: false,
                    listeners: [{
                        eventName: BI.SignEditor.EVENT_CONFIRM,
                        action: function () {
                            self.fireEvent(BI.DynamicDateParamItem.EVENT_CHANGE);
                        }
                    }, {
                        eventName: BI.SignEditor.EVENT_CHANGE,
                        action: function () {
                            self.fireEvent(BI.DynamicDateParamItem.EVENT_INPUT_CHANGE);
                        }
                    }]
                },
                width: 60
            }, {
                el: {
                    type: "bi.label",
                    height: BI.SIZE_CONSANTS.TOOL_BAR_HEIGHT,
                    text: this._getText()
                },
                width: o.dateType === BI.DynamicDateCard.TYPE.WORK_DAY ? 60 : 20
            }, {
                type: "bi.text_value_combo",
                height: BI.SIZE_CONSANTS.TOOL_BAR_HEIGHT,
                items: [{
                    text: BI.i18nText("BI-Basic_Front"),
                    value: 0
                }, {
                    text: BI.i18nText("BI-Basic_Behind"),
                    value: 1
                }],
                ref: function () {
                    self.offsetCombo = this;
                },
                container: null,
                value: o.offset,
                listeners: [{
                    eventName: BI.TextValueCombo.EVENT_CHANGE,
                    action: function () {
                        self.fireEvent(BI.DynamicDateParamItem.EVENT_CHANGE);
                    }
                }]
            }]
        };
    },

    _getText: function () {
        var text = "";
        switch (this.options.dateType) {
            case BI.DynamicDateCard.TYPE.YEAR:
                text = BI.i18nText("BI-Basic_Year");
                break;
            case BI.DynamicDateCard.TYPE.QUARTER:
                text = BI.i18nText("BI-Basic_Single_Quarter");
                break;
            case BI.DynamicDateCard.TYPE.MONTH:
                text = BI.i18nText("BI-Basic_Month");
                break;
            case BI.DynamicDateCard.TYPE.WEEK:
                text = BI.i18nText("BI-Basic_Week");
                break;
            case BI.DynamicDateCard.TYPE.DAY:
                text = BI.i18nText("BI-Basic_Day");
                break;
            case BI.DynamicDateCard.TYPE.WORK_DAY:
            default:
                text = BI.i18nText("BI-Basic_Work_Day");
                break;
        }
        return text;
    },

    checkValidation: function () {
        return BI.isNaturalNumber(this.editor.getValue());
    },

    setValue: function (v) {
        v = v || {};
        v.value = v.value || 0;
        v.offset = v.offset || 0;
        this.editor.setValue(v.value);
        this.offsetCombo.setValue(v.offset);
    },

    getValue: function () {
        return {
            dateType: this.options.dateType,
            value: this.editor.getValue(),
            offset: this.offsetCombo.getValue()[0]
        };
    }

});
BI.DynamicDateParamItem.EVENT_CHANGE = "EVENT_CHANGE";
BI.DynamicDateParamItem.EVENT_INPUT_CHANGE = "EVENT_INPUT_CHANGE";
BI.shortcut("bi.dynamic_date_param_item", BI.DynamicDateParamItem);
