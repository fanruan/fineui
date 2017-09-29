/**
 * 季度trigger
 *
 * Created by GUY on 2015/8/21.
 * @class BI.QuarterTrigger
 * @extends BI.Trigger
 */
BI.QuarterTrigger = BI.inherit(BI.Trigger, {
    _const: {
        hgap: 4,
        vgap: 2,
        triggerWidth: 30,
        textWidth: 40,
        errorText: BI.i18nText("BI-Quarter_Trigger_Error_Text")
    },

    _defaultConfig: function () {
        return BI.extend(BI.QuarterTrigger.superclass._defaultConfig.apply(this, arguments), {
            extraCls: "bi-quarter-trigger bi-border",
            height: 25
        });
    },
    _init: function () {
        BI.QuarterTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this._const;
        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            height: o.height,
            validationChecker: function (v) {
                return v === "" || (BI.isPositiveInteger(v) && v >= 1 && v <= 4);
            },
            quitChecker: function (v) {
                return false;
            },
            hgap: c.hgap,
            vgap: c.vgap,
            allowBlank: true,
            errorText: c.errorText
        });
        this.editor.on(BI.SignEditor.EVENT_FOCUS, function () {
            self.fireEvent(BI.QuarterTrigger.EVENT_FOCUS);
        });
        this.editor.on(BI.SignEditor.EVENT_CHANGE, function () {
            self.fireEvent(BI.QuarterTrigger.EVENT_CHANGE);
        });
        this.editor.on(BI.SignEditor.EVENT_CONFIRM, function () {
            var value = self.editor.getValue();
            if (BI.isNotNull(value)) {
                self.editor.setValue(value);
                self.editor.setTitle(value);
            }
            self.fireEvent(BI.QuarterTrigger.EVENT_CONFIRM);
        });
        this.editor.on(BI.SignEditor.EVENT_SPACE, function () {
            if (self.editor.isValid()) {
                self.editor.blur();
            }
        });
        this.editor.on(BI.SignEditor.EVENT_START, function () {
            self.fireEvent(BI.QuarterTrigger.EVENT_START);
        });
        this.editor.on(BI.SignEditor.EVENT_STOP, function () {
            self.fireEvent(BI.QuarterTrigger.EVENT_STOP);
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
                        baseCls: "bi-trigger-quarter-text",
                        text: BI.i18nText("BI-Multi_Date_Quarter"),
                        width: c.textWidth
                    },
                    width: c.textWidth
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
        v = v || "";
        this.editor.setState(v);
        this.editor.setValue(v);
        this.editor.setTitle(v);
    },

    getKey: function () {
        return this.editor.getValue();
    }
});
BI.QuarterTrigger.EVENT_FOCUS = "EVENT_FOCUS";
BI.QuarterTrigger.EVENT_CHANGE = "EVENT_CHANGE";
BI.QuarterTrigger.EVENT_START = "EVENT_START";
BI.QuarterTrigger.EVENT_STOP = "EVENT_STOP";
BI.QuarterTrigger.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.shortcut("bi.quarter_trigger", BI.QuarterTrigger);