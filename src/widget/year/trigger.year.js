/**
 * 年份trigger
 *
 * Created by GUY on 2015/8/21.
 * @class BI.YearTrigger
 * @extends BI.Trigger
 */
BI.YearTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4,
        vgap: 2,
        triggerWidth: 25,
        errorText: BI.i18nText("BI-Please_Input_Integer"),
        errorTextInvalid: BI.i18nText("BI-Year_Trigger_Invalid_Text")
    },

    _defaultConfig: function () {
        return BI.extend(BI.YearTrigger.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-year-trigger",
            min: '1900-01-01', //最小日期
            max: '2099-12-31', //最大日期
            height: 25
        });
    },
    _init: function () {
        BI.YearTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            height: o.height,
            validationChecker: function (v) {
                self.editor.setErrorText(!BI.isPositiveInteger(v) ? c.errorText : c.errorTextInvalid);
                return v === "" || (BI.isPositiveInteger(v) && !Date.checkVoid(v, 1, 1, o.min, o.max)[0]);
            },
            quitChecker: function (v) {
                return false;
            },
            hgap: c.hgap,
            vgap: c.vgap,
            allowBlank: true,
            errorText: c.errorText
        })
        this.editor.on(BI.SignEditor.EVENT_FOCUS, function () {
            self.fireEvent(BI.YearTrigger.EVENT_FOCUS);
        });
        this.editor.on(BI.SignEditor.EVENT_STOP, function () {
            self.fireEvent(BI.YearTrigger.EVENT_STOP);
        });
        this.editor.on(BI.SignEditor.EVENT_CONFIRM, function () {
            var value = self.editor.getValue();
            if (BI.isNotNull(value)) {
                self.editor.setValue(value);
                self.editor.setTitle(value);
            }
            self.fireEvent(BI.YearTrigger.EVENT_CONFIRM);
        })
        this.editor.on(BI.SignEditor.EVENT_SPACE, function () {
            if (self.editor.isValid()) {
                self.editor.blur();
            }
        });
        this.editor.on(BI.SignEditor.EVENT_START, function () {
            self.fireEvent(BI.YearTrigger.EVENT_START);
        });
        this.editor.on(BI.SignEditor.EVENT_ERROR, function () {
            self.fireEvent(BI.YearTrigger.EVENT_ERROR);
        });
        BI.createWidget({
            element: this,
            type: 'bi.htape',
            items: [
                {
                    el: this.editor
                }, {
                    el: {
                        type: "bi.text_button",
                        baseCls: "bi-trigger-year-text",
                        text: BI.i18nText("BI-Multi_Date_Year"),
                        width: c.triggerWidth
                    },
                    width: c.triggerWidth
                }, {
                    el: {
                        type: "bi.trigger_icon_button",
                        width: c.triggerWidth
                    },
                    width: c.triggerWidth
                }
            ]
        });
    },
    setValue: function (v) {
        this.editor.setState(v);
        this.editor.setValue(v);
        this.editor.setTitle(v);
    },
    getKey: function () {
        return this.editor.getValue() | 0;
    }
});
BI.YearTrigger.EVENT_FOCUS = "EVENT_FOCUS";
BI.YearTrigger.EVENT_ERROR = "EVENT_ERROR";
BI.YearTrigger.EVENT_START = "EVENT_START";
BI.YearTrigger.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.YearTrigger.EVENT_STOP = "EVENT_STOP";
BI.shortcut("bi.year_trigger", BI.YearTrigger);