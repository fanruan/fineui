/**
 * Created by Windy on 2017/12/15.
 */
BI.SQLEditor = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return $.extend(BI.CodeEditor.superclass._defaultConfig.apply(), {
            baseCls: 'bi-sql-editor',
            value: '',
            lineHeight: 2,
            showHint: true
        });
    },
    _init: function () {
        BI.CodeEditor.superclass._init.apply(this, arguments);
        var o = this.options, self = this;
        this.editor = CodeMirror(this.element[0], {
            mode: "text/x-sql",
            textWrapping: true,
            lineWrapping: true,
            lineNumbers: false
        });
        o.lineHeight === 1 ? this.element.addClass("codemirror-low-line-height") : this.element.addClass("codemirror-high-line-height");
        
        this.editor.on("change", function (cm, change) {
            self._checkWaterMark();
            if (o.showHint) {
                CodeMirror.showHint(cm, CodeMirror.sqlHint, {
                    completeSingle: false
                });
            }
            BI.nextTick(function () {
                self.fireEvent(BI.FormulaEditor.EVENT_CHANGE)
            });
        });

        this.editor.on("focus", function () {
            self._checkWaterMark();
            self.fireEvent(BI.FormulaEditor.EVENT_FOCUS);
        });

        this.editor.on("blur", function () {
            self.fireEvent(BI.FormulaEditor.EVENT_BLUR);
        });

        //水印
        this.watermark = BI.createWidget({
            type: "bi.label",
            text: BI.i18nText("Please_Enter_SQL"),
            cls: "bi-water-mark",
            whiteSpace: "nowrap",
            textAlign: "left"
        });
        this.watermark.element.bind(
            "mousedown", function (e) {
                self.insertString("");
                self.editor.focus();
                e.stopEvent();
            }
        );
        this.watermark.element.bind("click", function (e) {
            self.editor.focus();
            e.stopEvent();
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.watermark,
                top: 0,
                left: 5
            }]
        });
        if (BI.isKey(o.value)) {
            BI.nextTick(function () {
                self.setValue(o.value);
            });
        }
    },

    insertString: function (str) {
        this.editor.replaceSelection(str);
        this.editor.focus();
    },

    _checkWaterMark: function () {
        var o = this.options;
        if (!this.disabledWaterMark && BI.isEmptyString(this.editor.getValue()) && BI.isKey(o.watermark)) {
            this.watermark && this.watermark.visible();
        } else {
            this.watermark && this.watermark.invisible();
        }
    },

    getValue: function () {
        return this.editor.getValue();
    },

    setValue: function (v) {
        this.editor.setValue(v);
    }
});
BI.shortcut("bi.sql_editor", BI.SQLEditor);