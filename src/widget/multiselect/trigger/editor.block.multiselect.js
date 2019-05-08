/**
 * 多选输入框, 选中项将会以块状形式出现, 可以在触发器中删除item
 * @author windy
 * @class BI.MultiSelectBlockEditor
 * @extends Widget
 */
BI.MultiSelectBlockEditor = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-multi-select-editor",
        el: {}
    },

    render: function () {
        return {
            type: "bi.htape",
            items: [{
                type: "bi.vertical_adapt",
                items: [],
                width: 24
            }, {
                el: {
                    type: "bi.editor"
                },

            }]
        };
    },

    mounted: function () {
        this._checkSize();
    },

    getBlockSize: function() {
        // return BI.redu
    },

    _checkSize: function () {
        this.comboWrapper.attr("items")[0].width = o.height;
        this.comboWrapper.resize();
    },

    _init: function () {
        BI.MultiSelectBlockEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget(o.el, {
            type: "bi.state_editor",
            element: this,
            height: o.height,
            watermark: BI.i18nText("BI-Basic_Search"),
            allowBlank: true,
            value: o.value,
            text: o.text,
            tipType: o.tipType,
            warningTitle: o.warningTitle,
        });

        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.editor.on(BI.StateEditor.EVENT_PAUSE, function () {
            self.fireEvent(BI.MultiSelectBlockEditor.EVENT_PAUSE);
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

    setTipType: function (v) {
        this.editor.setTipType(v);
    },

    getValue: function () {
        var v = this.editor.getState();
        if (BI.isArray(v) && v.length > 0) {
            return v[v.length - 1];
        }
        return "";

    },

    getKeywords: function () {
        var val = this.editor.getLastValidValue();
        var keywords = val.match(/[\S]+/g);
        if (BI.isEndWithBlank(val)) {
            return keywords.concat([" "]);
        }
        return keywords;
    },

    populate: function (items) {

    }
});
BI.MultiSelectBlockEditor.EVENT_PAUSE = "MultiSelectBlockEditor.EVENT_PAUSE";
BI.shortcut("bi.multi_select_block_editor", BI.MultiSelectBlockEditor);
