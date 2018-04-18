/**
 *
 * Created by GUY on 2016/1/15.
 * @class BI.CodeEditor
 * @extends BI.Single
 */
BI.CodeEditor = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        return $.extend(BI.CodeEditor.superclass._defaultConfig.apply(), {
            baseCls: "bi-code-editor",
            value: "",
            watermark: "",
            lineHeight: 2,
            readOnly: false,
            lineNumbers: false,
            // 参数显示值构造函数
            paramFormatter: function (v) {
                return v;
            }
        });
    },
    _init: function () {
        BI.CodeEditor.superclass._init.apply(this, arguments);
        var o = this.options, self = this;
        this.editor = CodeMirror(this.element[0], {
            textWrapping: true,
            lineWrapping: true,
            lineNumbers: o.lineNumbers,
            readOnly: o.readOnly,
            // 解决插入字段由括号或其他特殊字符包围时分裂的bug
            specialChars: /[\u0000-\u001f\u007f\u00ad\u200c-\u200f\u2028\u2029\ufeff]/
        });
        o.lineHeight === 1 ? this.element.addClass("codemirror-low-line-height") : this.element.addClass("codemirror-high-line-height");
        this.editor.on("change", function (cm, change) {
            BI.nextTick(function () {
                self.fireEvent(BI.CodeEditor.EVENT_CHANGE);
            });
        });

        this.editor.on("focus", function () {
            self.watermark.setVisible(false);
            self.fireEvent(BI.CodeEditor.EVENT_FOCUS);
        });

        this.editor.on("blur", function () {
            self.watermark.setVisible(BI.isEmptyString(self.getValue()));
            self.fireEvent(BI.CodeEditor.EVENT_BLUR);
        });

        // this.editor.on("mousedown", function (cm, e) {
        //     //IE下mousedown之后会触发blur,所以nextTick后再做focus
        //     BI.nextTick(function () {
        //         self.fireEvent(BI.CodeEditor.EVENT_FOCUS);
        //     });
        //     //e.stopPropagation();
        // });

        // this.editor.on("blur", function () {
        //     self.editor.execCommand("goLineEnd");
        // });

        // 水印
        this.watermark = BI.createWidget({
            type: "bi.label",
            text: o.watermark,
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
                left: o.lineNumbers ? 30 + 5 : 5
            }]
        });
    },

    mounted: function () {
        var o = this.options;
        if (BI.isNumber(o.value) || BI.isString(o.value)) {
            this.setValue(o.value);
        }

        if (BI.isNotNull(o.style)) {
            self.setStyle(o.style);
        }
    },

    _setEnable: function (b) {
        BI.CodeEditor.superclass._setEnable.apply(this, arguments);
        this.editor.setOption("readOnly", b === true ? false : "nocursor");
    },

    _checkWaterMark: function () {
        var o = this.options;
        if (BI.isEmptyString(this.editor.getValue()) && BI.isKey(o.watermark)) {
            this.watermark && this.watermark.visible();
        } else {
            this.watermark && this.watermark.invisible();
        }
    },

    insertParam: function (param) {
        var value = param;
        param = this.options.paramFormatter(param);
        var from = this.editor.getCursor();
        // 解决插入字段由括号或其他特殊字符包围时分裂的bug,在两端以不可见字符包裹一下
        this.editor.replaceSelection("\u200b" + param + "\u200b");
        var to = this.editor.getCursor();
        var options = {className: "param", atomic: true};
        if (BI.isNotNull(param.match(/^<!.*!>$/))) {
            options.className = "error-param";
        }
        options.value = value;
        this.editor.markText(from, to, options);
        this.editor.replaceSelection(" ");
        this.editor.focus();
    },

    insertString: function (str) {
        this.editor.replaceSelection(str);
        this.editor.focus();
    },

    getValue: function () {
        return this.editor.getValue("\n", function (line) {
            var rawText = line.text, value = line.text, num = 0;
            value.text = rawText;
            // 根据插入位置不同，line.markedSpan可能是乱序的
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

    _analyzeContent: function (v) {
        var regx = /\$[\{][^\}]*[\}]|[^\$\{]*[^\$\{]/g;
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
        });
        this._checkWaterMark();
    },

    focus: function () {
        this.editor.focus();
    },

    blur: function () {
        this.editor.getInputField().blur();
    },

    setStyle: function (style) {
        this.style = style;
        this.element.css(style);
    },

    getStyle: function () {
        return this.style;
    },

    refresh: function () {
        var self = this;
        BI.nextTick(function () {
            self.editor.refresh();
        });
    }
});
BI.CodeEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.CodeEditor.EVENT_BLUR = "EVENT_BLUR";
BI.CodeEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.shortcut("bi.code_editor", BI.CodeEditor);