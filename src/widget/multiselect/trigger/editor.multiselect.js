/**
 * 多选输入框
 * Created by guy on 15/11/3.
 * @class BI.MultiSelectEditor
 * @extends Widget
 */
BI.MultiSelectEditor = BI.inherit(BI.Widget, {

    _const: {
        checkSelected: BI.i18nText('BI-Check_Selected')
    },

    _defaultConfig: function () {
        return BI.extend(BI.MultiSelectEditor.superclass._defaultConfig.apply(this, arguments), {
            baseCls: 'bi-multi-select-editor',
            el: {}
        });
    },

    _init: function () {
        BI.MultiSelectEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget(o.el, {
            type: 'bi.state_editor',
            element: this,
            height: o.height,
            watermark: BI.i18nText('BI-Basic_Search'),
            allowBlank: true
        });

        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.editor.on(BI.StateEditor.EVENT_PAUSE, function () {
            self.fireEvent(BI.MultiSelectEditor.EVENT_PAUSE);
        });
        this.editor.on(BI.StateEditor.EVENT_CLICK_LABEL, function () {

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

    setEnable: function(v){
        this.editor.setEnable(v);
    },

    getValue: function () {
        var v = this.editor.getState();
        if (BI.isArray(v) && v.length > 0) {
            return v[v.length - 1];
        } else {
            return "";
        }
    },

    getKeywords: function () {
        var val = this.editor.getLastValidValue();
        var keywords = val.match(/[\S]+/g);
        if (BI.isEndWithBlank(val)) {
            return keywords.concat([' ']);
        }
        return keywords;
    },

    populate: function (items) {

    }
});
BI.MultiSelectEditor.EVENT_PAUSE = "MultiSelectEditor.EVENT_PAUSE";
BI.shortcut('bi.multi_select_editor', BI.MultiSelectEditor);