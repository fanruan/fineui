/**
 * Created by Windy on 2017/12/15.
 */
BI.SQLEditor = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return $.extend(BI.CodeEditor.superclass._defaultConfig.apply(), {
            baseCls: "bi-sql-editor",
            value: "",
            lineHeight: 2,
            showHint: true,
            supportFunction: true
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
                self.fireEvent(BI.FormulaEditor.EVENT_CHANGE);
            });
        });

        this.editor.on("focus", function () {
            self._checkWaterMark();
            self.fireEvent(BI.FormulaEditor.EVENT_FOCUS);
        });

        this.editor.on("blur", function () {
            self.fireEvent(BI.FormulaEditor.EVENT_BLUR);
        });

        // 水印
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

    insertParam: function (param) {
        var value = param;
        var from = this.editor.getCursor();
        this.editor.replaceSelection(param);
        var to = this.editor.getCursor();
        var options = {className: "param", atomic: true};
        options.value = value;
        this.editor.markText(from, to, options);
        this.editor.replaceSelection(" ");
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

    _analyzeContent: function (v) {
        var regx = /\$[\{][^\}]*[\}]|[^\$\{]*[^\$\{]/g;
        return v.match(regx);
    },

    getValue: function () {
        return this.editor.getValue("\n", function (line) {
            var rawText = line.text, value = line.text, num = 0;
            value.text = rawText;
            _.forEach(_.sortBy(line.markedSpans, "from"), function (i, ms) {
                switch (i.marker.className) {
                    case "param":
                    case "error-param":
                        var fieldNameLength = i.to - i.from;
                        value = value.substr(0, i.from + num) + "$\{" + i.marker.value + "\}" + value.substr(i.to + num, value.length);
                        // 加上${}的偏移
                        num += 3;
                        // 加上实际值和显示值的长度差的偏移
                        num += (i.marker.value.length - fieldNameLength);
                        break;
                }
            });
            return value;
        });
    },

    setValue: function (v) {
        var self = this, result;
        this.refresh();
        self.editor.setValue("");
        result = this._analyzeContent(v || "");
        BI.each(result, function (i, item) {
            var fieldRegx = /\$[\{][^\}]*[\}]/;
            var str = item.match(fieldRegx);
            if (BI.isNotEmptyArray(str)) {
                self.insertParam(str[0].substring(2, item.length - 1));
            } else {
                self.insertString(item);
            }
        });
        this._checkWaterMark();
    },

    refresh: function () {
        var self = this;
        BI.nextTick(function () {
            self.editor.refresh();
        });
    }
});
BI.shortcut("bi.sql_editor", BI.SQLEditor);