;
(function ($) {
    /**
     * 公式编辑控件
     * @class BI.FormulaEditor
     * @extends BI.Widget
     */
    BI.FormulaEditor = BI.inherit(BI.Single, {
        _defaultConfig: function () {
            return $.extend(BI.FormulaEditor.superclass._defaultConfig.apply(), {
                baseCls: 'bi-formula-editor',
                watermark: '',
                value: '',
                fieldTextValueMap: {}
            });
        },
        _init: function () {
            BI.FormulaEditor.superclass._init.apply(this, arguments);
            var o = this.options, self = this;
            this.editor = CodeMirror(this.element[0], {
                textWrapping: true,
                lineWrapping: true,
                lineNumbers: false,
                mode: 'formula'
            });
            this.editor.on("change", function (cm, change) {
                self._checkWaterMark();
                CodeMirror.showHint(cm, CodeMirror.formulaHint, {completeSingle: false});
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


            if (BI.isKey(o.value)) {
                self.setValue(o.value);
            }

            if (BI.isKey(this.options.watermark)) {
                var self = this;
                this.watermark = BI.createWidget({
                    type: "bi.label",
                    cls: "bi-water-mark",
                    text: this.options.watermark,
                    whiteSpace: "nowrap",
                    textAlign: "left"
                });
                BI.createWidget({
                    type: "bi.absolute",
                    element: self.element,
                    items: [{
                        el: self.watermark,
                        left: 0,
                        top: 0
                    }]
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
                this.watermark.element.css({
                    position: "absolute",
                    left: 3,
                    right: 3,
                    top: 6,
                    bottom: 0
                });
            }
        },

        _checkWaterMark: function () {
            var o = this.options;
            if (!this.disabledWarterMark && BI.isEmptyString(this.editor.getValue()) && BI.isKey(o.watermark)) {
                this.watermark && this.watermark.visible();
            } else {
                this.watermark && this.watermark.invisible();
            }
        },

        disableWarterMark: function () {
            this.disabledWarterMark = true;
            this._checkWaterMark();
        },

        /**
         * 添加字段
         * @param field
         */
        insertField: function (field) {
            var from = this.editor.getCursor();
            this.editor.replaceSelection(field);
            var to = this.editor.getCursor();
            this.editor.markText(from, to, {className: 'fieldName', atomic: true, startStyle : "start", endStyle:"end"});
            this.editor.replaceSelection(" ");
            this.editor.focus();
        },

        insertFunction: function (fn) {
            var from = this.editor.getCursor();
            this.editor.replaceSelection(fn);
            var to = this.editor.getCursor();
            this.editor.markText(from, to, {className: "#function", atomic: true});
            this.editor.replaceSelection("() ");
            to = this.editor.getCursor();
            to.ch = to.ch - 2;
            this.editor.setCursor(to);
            this.editor.focus();
        },
        insertOperator: function (op) {
            var from = this.editor.getCursor();
            this.editor.replaceSelection(op);
            var to = this.editor.getCursor();
            this.editor.markText(from, to, {className: "%operator", atomic: true});
            this.editor.replaceSelection(" ");
            this.editor.focus();
        },

        setFunction: function (v) {
            var from = this.editor.getCursor();
            this.editor.replaceSelection(v);
            var to = this.editor.getCursor();
            this.editor.markText(from, to, {className: "#function", atomic: true});
        },

        insertString: function (str) {
            this.editor.replaceSelection(str);
            this.editor.focus();
        },

        getFormulaString: function () {
            return this.editor.getValue();
        },

        getUsedFields: function () {
            var fieldMap = this.options.fieldTextValueMap;
            var fields = [];
            this.editor.getValue(true, function (line) {
                var value = line.text;
                _.forEach(line.markedSpans, function (i, ms) {
                    switch (i.marker.className) {
                        case "fieldName":
                            var dId = fieldMap[value.substr(i.from, i.to - i.from)];
                            if (!fields.contains(dId)) {
                                fields.push(dId);
                            }

                    }
                });
            });
            return fields;
        },

        getCheckString: function () {
            return this.editor.getValue(true, function (line) {
                var rawText = line.text, value = line.text, num = 0;
                value.text = rawText;
                _.forEach(line.markedSpans, function (i, ms) {

                    switch (i.marker.className) {
                        case "fieldName":
                            var fieldNameLength = i.to - i.from;
                            value = value.substr(0, i.from + num) + "$a" + value.substr(i.to + num, value.length);
                            num = num + 2 - fieldNameLength;
                            break;
                    }

                });
                return value;
            });
        },

        getValue: function () {
            var fieldMap = this.options.fieldTextValueMap;
            return this.editor.getValue("\n", function (line) {
                var rawText = line.text, value = line.text, num = 0;
                value.text = rawText;
                _.forEach(line.markedSpans, function (i, ms) {
                    switch (i.marker.className) {
                        case "fieldName":
                            var fieldNameLength = i.to - i.from;
                            var fieldId = fieldMap[value.substr(i.from + num, fieldNameLength)];
                            value = value.substr(0, i.from + num) + "$\{" + fieldMap[value.substr(i.from + num, fieldNameLength)] + "\}" + value.substr(i.to + num, value.length);
                            num += fieldId.length - fieldNameLength + 3;
                            break;
                    }
                });
                return value;
            });
        },

        setValue: function (value) {
            this.editor.setValue(value);
        },

        setFieldTextValueMap: function (fieldTextValueMap) {
            this.options.fieldTextValueMap = fieldTextValueMap;
        },

        refresh: function () {
            var self = this;
            BI.nextTick(function () {
                self.editor.refresh();
            });
        }

    });
    BI.FormulaEditor.EVENT_CHANGE = "EVENT_CHANGE";
    BI.FormulaEditor.EVENT_BLUR = "EVENT_BLUR";
    BI.FormulaEditor.EVENT_FOCUS = "EVENT_FOCUS";
    $.shortcut("bi.formula", BI.FormulaEditor);
})(jQuery);
