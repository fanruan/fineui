/**
 * sign标签分两段，可以自定义样式
 * @class BI.SignStyleEditor
 * @extends BI.Single
 */
BI.SignStyleEditor = BI.inherit(BI.Single, {

    constants: {
        tipTextGap: 4
    },

    _defaultConfig: function () {
        var conf = BI.SignStyleEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-sign-style-editor",
            text: "",
            hgap: 4,
            vgap: 2,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn,
            mouseOut: false,
            allowBlank: false,
            watermark: "",
            errorText: "",
            height: 30
        })
    },

    _init: function () {
        BI.SignStyleEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: "bi.editor",
            height: o.height,
            hgap: o.hgap,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            value: o.value,
            validationChecker: o.validationChecker,
            quitChecker: o.quitChecker,
            mouseOut: o.mouseOut,
            allowBlank: o.allowBlank,
            watermark: o.watermark,
            errorText: o.errorText
        });
        this.text = BI.createWidget({
            type: "bi.text_button",
            cls: "sign-style-editor-text",
            textAlign: "left",
            height: o.height,
            hgap: 4,
            handler: function () {
                self._showInput();
                self.editor.focus();
                self.editor.selectAll();
            }
        });

        this.tipText = BI.createWidget({
            type: "bi.text_button",
            cls: "sign-style-editor-tip",
            textAlign: "right",
            rgap: 4,
            height: o.height,
            text: o.text,
            handler: function () {
                self._showInput();
                self.editor.focus();
                self.editor.selectAll();
            }
        });

        this.text.on(BI.TextButton.EVENT_CHANGE, function () {
            BI.nextTick(function () {
                self.fireEvent(BI.SignStyleEditor.EVENT_CLICK_LABEL)
            });
        });

        this.tipText.on(BI.TextButton.EVENT_CHANGE, function () {
            BI.nextTick(function () {
                self.fireEvent(BI.SignStyleEditor.EVENT_CLICK_LABEL)
            });
        });

        this.wrap = BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [this.text, this.tipText]
        });

        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_FOCUS, function () {
            self.fireEvent(BI.SignStyleEditor.EVENT_FOCUS);
        });
        this.editor.on(BI.Editor.EVENT_BLUR, function () {
            self.fireEvent(BI.SignStyleEditor.EVENT_BLUR);
        });
        this.editor.on(BI.Editor.EVENT_CLICK, function () {
            self.fireEvent(BI.SignStyleEditor.EVENT_CLICK);
        });
        this.editor.on(BI.Editor.EVENT_CHANGE, function () {
            self.fireEvent(BI.SignStyleEditor.EVENT_CHANGE);
        });
        this.editor.on(BI.Editor.EVENT_KEY_DOWN, function (v) {
            self.fireEvent(BI.SignStyleEditor.EVENT_KEY_DOWN);
        });

        this.editor.on(BI.Editor.EVENT_VALID, function () {
            self.fireEvent(BI.SignStyleEditor.EVENT_VALID);
        });
        this.editor.on(BI.Editor.EVENT_CONFIRM, function () {
            self._showHint();
            self._checkText();
            self._resizeLayout();
            self.fireEvent(BI.SignStyleEditor.EVENT_CONFIRM);
        });
        this.editor.on(BI.Editor.EVENT_START, function () {
            self.fireEvent(BI.SignStyleEditor.EVENT_START);
        });
        this.editor.on(BI.Editor.EVENT_PAUSE, function () {
            self.fireEvent(BI.SignStyleEditor.EVENT_PAUSE);
        });
        this.editor.on(BI.Editor.EVENT_STOP, function () {
            self.fireEvent(BI.SignStyleEditor.EVENT_STOP);
        });
        this.editor.on(BI.Editor.EVENT_SPACE, function () {
            self.fireEvent(BI.SignStyleEditor.EVENT_SPACE);
        });
        this.editor.on(BI.Editor.EVENT_ERROR, function () {
            self.fireEvent(BI.SignStyleEditor.EVENT_ERROR);
        });
        this.editor.on(BI.Editor.EVENT_ENTER, function () {
            self.fireEvent(BI.SignStyleEditor.EVENT_ENTER);
        });
        this.editor.on(BI.Editor.EVENT_RESTRICT, function () {
            self.fireEvent(BI.SignStyleEditor.EVENT_RESTRICT);
        });
        this.editor.on(BI.Editor.EVENT_EMPTY, function () {
            self.fireEvent(BI.SignStyleEditor.EVENT_EMPTY);
        });
        BI.createWidget({
            type: "bi.vertical",
            scrolly: false,
            element: this,
            items: [this.editor]
        });
        this._showHint();
        this._checkText();

        BI.nextTick(function () {
            var tipTextSize = self.text.element.getStyle("font-size");
            self.tipTextSize = tipTextSize.substring(0, tipTextSize.length - 2);
            self._resizeLayout();
        });
    },

    _checkText: function () {
        var o = this.options;
        if (this.editor.getValue() === "") {
            this.text.setValue(o.watermark || "");
            this.text.element.addClass("bi-water-mark");
        } else {
            this.text.setValue(this.editor.getValue());
            this.tipText.setValue("(" + o.text + ")");
            this.text.element.removeClass("bi-water-mark");
        }
        this.setTitle(this.text.getValue() + this.tipText.getValue());
    },

    _showInput: function () {
        this.editor.setVisible(true);
        this.text.setVisible(false);
        this.tipText.setVisible(false);
    },

    _showHint: function () {
        this.editor.setVisible(false);
        this.text.setVisible(true);
        this.tipText.setVisible(true);
    },

    _resizeLayout: function () {
        this.wrap.attr("items")[0].width = BI.DOM.getTextSizeWidth(this.text.getValue(), this.tipTextSize) + 2 * this.constants.tipTextGap;
        this.wrap.resize();
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

    isValid: function () {
        return this.editor.isValid();
    },

    setErrorText: function (text) {
        this.editor.setErrorText(text);
    },

    getErrorText: function () {
        return this.editor.getErrorText();
    },

    setValue: function (k) {
        BI.SignStyleEditor.superclass.setValue.apply(this, arguments);
        this.editor.setValue(k);
        this._checkText();
        this._resizeLayout();
    },

    getValue: function () {
        return this.editor.getValue();
    },

    getState: function () {
        return this.options.text;
    },

    setState: function (v) {
        var o = this.options;
        o.text = v;
        this._showHint();
        this.tipText.setValue("(" + v + ")");
        this._checkText();
    }
});
BI.SignStyleEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.SignStyleEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.SignStyleEditor.EVENT_BLUR = "EVENT_BLUR";
BI.SignStyleEditor.EVENT_CLICK = "EVENT_CLICK";
BI.SignStyleEditor.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.SignStyleEditor.EVENT_CLICK_LABEL = "EVENT_CLICK_LABEL";

BI.SignStyleEditor.EVENT_START = "EVENT_START";
BI.SignStyleEditor.EVENT_PAUSE = "EVENT_PAUSE";
BI.SignStyleEditor.EVENT_STOP = "EVENT_STOP";
BI.SignStyleEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.SignStyleEditor.EVENT_VALID = "EVENT_VALID";
BI.SignStyleEditor.EVENT_ERROR = "EVENT_ERROR";
BI.SignStyleEditor.EVENT_ENTER = "EVENT_ENTER";
BI.SignStyleEditor.EVENT_RESTRICT = "EVENT_RESTRICT";
BI.SignStyleEditor.EVENT_SPACE = "EVENT_SPACE";
BI.SignStyleEditor.EVENT_EMPTY = "EVENT_EMPTY";

$.shortcut("bi.sign_style_editor", BI.SignStyleEditor);