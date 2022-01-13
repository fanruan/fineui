BI.SignTextEditor = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.SignTextEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-sign-initial-editor",
            validationChecker: BI.emptyFn,
            text: "",
            height: 24
        });
    },

    _init: function () {
        BI.SignTextEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: "bi.editor",
            simple: o.simple,
            height: o.height,
            hgap: 4,
            vgap: 2,
            value: o.value,
            validationChecker: o.validationChecker,
            allowBlank: false
        });
        this.text = BI.createWidget({
            type: "bi.text_button",
            cls: "sign-editor-text",
            title: function () {
                return self.getValue();
            },
            textAlign: o.textAlign,
            height: o.height,
            hgap: 4,
            handler: function () {
                self._showInput();
                self.editor.focus();
                self.editor.selectAll();
            }
        });
        this.text.on(BI.TextButton.EVENT_CHANGE, function () {
            BI.nextTick(function () {
                self.fireEvent(BI.SignTextEditor.EVENT_CLICK_LABEL);
            });
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: this.text,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }]
        });
        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_CONFIRM, function () {
            self._showHint();
            self._checkText();
            self.fireEvent(BI.SignTextEditor.EVENT_CONFIRM, arguments);
        });
        this.editor.on(BI.Editor.EVENT_CHANGE_CONFIRM, function () {
            self._showHint();
            self._checkText();
            self.fireEvent(BI.SignTextEditor.EVENT_CHANGE_CONFIRM, arguments);
        });
        this.editor.on(BI.Editor.EVENT_ERROR, function () {
            self._checkText();
        });
        BI.createWidget({
            type: "bi.vertical",
            scrolly: false,
            element: this,
            items: [this.editor]
        });
        this._showHint();
        self._checkText();
    },

    _checkText: function () {
        var o = this.options;
        BI.nextTick(BI.bind(function () {
            if (this.editor.getValue() === "") {
                this.text.setValue(o.watermark || "");
                this.text.element.addClass("bi-water-mark");
            } else {
                var v = this.editor.getValue();
                v = (BI.isEmpty(v) || v == o.text) ? o.text : v + o.text;
                this.text.setValue(v);
                this.text.element.removeClass("bi-water-mark");
            }
        }, this));
    },

    _showInput: function () {
        this.editor.visible();
        this.text.invisible();
    },

    _showHint: function () {
        this.editor.invisible();
        this.text.visible();
    },

    setTitle: function (title) {
        this.text.setTitle(title);
    },

    setWarningTitle: function (title) {
        this.text.setWarningTitle(title);
    },

    focus: function () {
        this._showInput();
        this.editor.focus();
    },

    blur: function () {
        this.editor.blur();
        this._showHint();
        this._checkText();
    },

    doRedMark: function () {
        if (this.editor.getValue() === "" && BI.isKey(this.options.watermark)) {
            return;
        }
        this.text.doRedMark.apply(this.text, arguments);
    },

    unRedMark: function () {
        this.text.unRedMark.apply(this.text, arguments);
    },

    doHighLight: function () {
        if (this.editor.getValue() === "" && BI.isKey(this.options.watermark)) {
            return;
        }
        this.text.doHighLight.apply(this.text, arguments);
    },

    unHighLight: function () {
        this.text.unHighLight.apply(this.text, arguments);
    },

    isValid: function () {
        return this.editor.isValid();
    },

    setErrorText: function (text) {
        this.editor.setErrorText(text);
    },

    getErrorText: function () {
        return this.editor.getErrorText();
    },

    isEditing: function () {
        return this.editor.isEditing();
    },

    getLastValidValue: function () {
        return this.editor.getLastValidValue();
    },

    getLastChangedValue: function () {
        return this.editor.getLastChangedValue();
    },

    setValue: function (v) {
        this.editor.setValue(v);
        this._checkText();
    },

    getValue: function () {
        return this.editor.getValue();
    },

    getState: function () {
        return this.text.getValue();
    },

    setState: function (v) {
        var o = this.options;
        this._showHint();
        v = (BI.isEmpty(v) || v == o.text) ? o.text : v + o.text;
        this.text.setValue(v);
    }
});
BI.SignTextEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.SignTextEditor.EVENT_CHANGE_CONFIRM = "EVENT_CHANGE_CONFIRM";
BI.SignTextEditor.EVENT_CLICK_LABEL = "EVENT_CLICK_LABEL";

BI.shortcut("bi.sign_text_editor", BI.SignTextEditor);