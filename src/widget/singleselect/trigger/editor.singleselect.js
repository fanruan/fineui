/**
 * 单选输入框
 * Created by guy on 15/11/3.
 * @class BI.SingleSelectEditor
 * @extends Widget
 */
BI.SingleSelectEditor = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SingleSelectEditor.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-single-select-editor",
            el: {},
            text: BI.i18nText("BI-Basic_Please_Select"),
            watermark: BI.i18nText("BI-Basic_Search"),
        });
    },

    _init: function () {
        BI.SingleSelectEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget(o.el, {
            type: "bi.select_patch_editor",
            element: this,
            height: o.height,
            watermark: o.watermark,
            allowBlank: true,
            value: o.value,
            defaultText: o.text,
            text: o.text,
        });

        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.StateEditor.EVENT_FOCUS, function () {
            self.fireEvent(BI.SingleSelectEditor.EVENT_FOCUS);
        });
        this.editor.on(BI.StateEditor.EVENT_BLUR, function () {
            self.fireEvent(BI.SingleSelectEditor.EVENT_BLUR);
        });
    },

    focus: function () {
        this.editor.focus();
    },

    blur: function () {
        this.editor.blur();
    },

    setState: function (state) {
        this.editor.setState(state);
    },

    setValue: function (v) {
        this.editor.setValue(v);
    },

    getValue: function () {
        return this.editor.getValue();
    },

    getKeywords: function () {
        var val = this.editor.getValue();
        var keywords = val.split(/\u200b\s\u200b/);
        if (BI.isEmptyString(keywords[keywords.length - 1])) {
            keywords = keywords.slice(0, keywords.length - 1);
        }
        if (/\u200b\s\u200b$/.test(val)) {
            return keywords.concat([BI.BlankSplitChar]);
        }

        return keywords;
    },

    getKeyword: function () {
        var val = this.editor.getValue();
        var keywords = val.split(/\u200b\s\u200b/);
        if (BI.isEmptyString(keywords[keywords.length - 1])) {
            keywords = keywords.slice(0, keywords.length - 1);
        }
        return BI.isEmptyArray(keywords) ? "" : keywords[keywords.length - 1];
    },

    populate: function (items) {

    }
});

BI.SingleSelectEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.SingleSelectEditor.EVENT_BLUR = "EVENT_BLUR";
BI.shortcut("bi.single_select_editor", BI.SingleSelectEditor);