/**
 *
 * Created by GUY on 2016/1/15.
 * @class BI.CodeEditor
 * @extends BI.Single
 */
BI.CodeEditor = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        return $.extend(BI.CodeEditor.superclass._defaultConfig.apply(), {
            baseCls: 'bi-code-editor',
            value: '',
            watermark: ""
        });
    },
    _init: function () {
        BI.CodeEditor.superclass._init.apply(this, arguments);
        var o = this.options, self = this;
        this.editor = CodeMirror(this.element[0], {
            textWrapping: true,
            lineWrapping: true,
            lineNumbers: false
        });
        this.editor.on("change", function (cm, change) {
            BI.nextTick(function () {
                self.fireEvent(BI.CodeEditor.EVENT_CHANGE)
            });
        });

        this.editor.on("focus", function () {
            watermark.setVisible(false);
            self.fireEvent(BI.CodeEditor.EVENT_FOCUS);
        });

        this.editor.on("blur", function () {
            watermark.setVisible(BI.isEmptyString(self.getValue()));
            self.fireEvent(BI.CodeEditor.EVENT_BLUR);
        });

        // this.editor.on("blur", function () {
        //     self.editor.execCommand("goLineEnd");
        // });

        //水印
        var watermark = BI.createWidget({
            type: "bi.label",
            text: o.watermark,
            cls: "bi-water-mark",
            whiteSpace: "nowrap",
            textAlign: "left"
        });
        watermark.element.bind(
            "mousedown", function (e) {
                self.insertString("");
                self.editor.focus();
                e.stopEvent();
            }
        );
        watermark.element.bind("click", function (e) {
            self.editor.focus();
            e.stopEvent();
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this.element,
            items: [{
                el: watermark,
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

    setEnable: function (b) {
        BI.CodeEditor.superclass.setEnable.apply(this, arguments);
        this.editor.setOption("readOnly", b === true ? false : "nocursor")
    },

    insertParam: function(param){
        var from = this.editor.getCursor();
        this.editor.replaceSelection(param);
        var to = this.editor.getCursor();
        this.editor.markText(from, to, {className: 'param', atomic: true});
        this.editor.replaceSelection(" ");
        this.editor.focus();
    },

    insertString: function(str){
        this.editor.replaceSelection(str);
        this.editor.focus();
    },

    getValue: function () {
        return this.editor.getValue("\n", function (line) {
            var rawText = line.text, value = line.text, num = 0;
            value.text = rawText;
            _.forEach(line.markedSpans, function (i, ms) {
                switch (i.marker.className) {
                    case "param":
                        var fieldNameLength = i.to - i.from;
                        value = value.substr(0, i.from + num) + "$\{" + value.substr(i.from + num, fieldNameLength) + "\}" + value.substr(i.to + num, value.length);
                        num += fieldNameLength + 3;
                        break;
                }
            });
            return value;
        });
    },

    _analyzeContent: function (v) {
        var regx = /\$[\{][^\}]*[\}]|\w*\w|\$\{[^\$\(\)\+\-\*\/)\$,]*\w\}|\$\{[^\$\(\)\+\-\*\/]*\w\}|\$\{[^\$\(\)\+\-\*\/]*[\u4e00-\u9fa5]\}|\w|(.)|\n/g;
        return v.match(regx);
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
        })
    },

    refresh: function(){
        var self = this;
        BI.nextTick(function () {
            self.editor.refresh();
        });
    }
});
BI.CodeEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.CodeEditor.EVENT_BLUR = "EVENT_BLUR";
BI.CodeEditor.EVENT_FOCUS = "EVENT_FOCUS";
$.shortcut("bi.code_editor", BI.CodeEditor);