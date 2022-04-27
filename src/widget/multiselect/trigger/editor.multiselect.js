/**
 * 多选输入框
 * Created by guy on 15/11/3.
 * @class BI.MultiSelectEditor
 * @extends Widget
 */
BI.MultiSelectEditor = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectEditor.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-multi-select-editor",
            el: {},
            watermark: BI.i18nText("BI-Basic_Search")
        });
    },

    _init: function () {
        BI.MultiSelectEditor.superclass._init.apply(this, arguments);
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
            tipType: o.tipType,
            warningTitle: o.warningTitle,
        });

        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.StateEditor.EVENT_FOCUS, function () {
            self.fireEvent(BI.MultiSelectEditor.EVENT_FOCUS);
        });
        this.editor.on(BI.StateEditor.EVENT_BLUR, function () {
            self.fireEvent(BI.MultiSelectEditor.EVENT_BLUR);
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

    setTipType: function (v) {
        this.editor.setTipType(v);
    },

    getValue: function () {
        return this.editor.getValue();
    },

    getState: function () {
        return this.editor.getText();
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

    },

    setWaterMark: function (v) {
        this.editor.setWaterMark(v);
    }
});

BI.MultiSelectEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.MultiSelectEditor.EVENT_BLUR = "EVENT_BLUR";
BI.MultiSelectEditor.EVENT_PAUSE = "EVENT_PAUSE";
BI.shortcut("bi.multi_select_editor", BI.MultiSelectEditor);
