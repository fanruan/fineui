/**
 * 根据内容自适应长度的输入框
 * @class BI.AdaptiveEditor
 * @extends BI.Single
 */
BI.AdaptiveEditor = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.AdaptiveEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-adapt-editor",
            hgap: 4,
            vgap: 2,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn,
            mouseOut: false,
            allowBlank: true,
            watermark: "",
            errorText: "",
            height: 30
        })
    },

    _init: function () {
        BI.AdaptiveEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: "bi.sign_editor",
            element: this,
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

        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.SignEditor.EVENT_FOCUS, function () {
            self.fireEvent(BI.AdaptiveEditor.EVENT_FOCUS);
        });
        this.editor.on(BI.SignEditor.EVENT_BLUR, function () {
            self.fireEvent(BI.AdaptiveEditor.EVENT_BLUR);
        });
        this.editor.on(BI.SignEditor.EVENT_CLICK, function () {
            self.fireEvent(BI.AdaptiveEditor.EVENT_CLICK);
        });
        this.editor.on(BI.SignEditor.EVENT_CHANGE, function () {
            self._checkEditorLength();
            self.fireEvent(BI.AdaptiveEditor.EVENT_CHANGE);
        });
        this.editor.on(BI.SignEditor.EVENT_KEY_DOWN, function (v) {
            self.fireEvent(BI.AdaptiveEditor.EVENT_KEY_DOWN);
        });

        this.editor.on(BI.SignEditor.EVENT_VALID, function () {
            self.fireEvent(BI.AdaptiveEditor.EVENT_VALID);
        });
        this.editor.on(BI.SignEditor.EVENT_CONFIRM, function () {
            self.fireEvent(BI.AdaptiveEditor.EVENT_CONFIRM);
        });
        this.editor.on(BI.SignEditor.EVENT_START, function () {
            self.fireEvent(BI.AdaptiveEditor.EVENT_START);
        });
        this.editor.on(BI.SignEditor.EVENT_PAUSE, function () {
            self.fireEvent(BI.AdaptiveEditor.EVENT_PAUSE);
        });
        this.editor.on(BI.Editor.EVENT_STOP, function () {
            self.fireEvent(BI.AdaptiveEditor.EVENT_STOP);
        });
        this.editor.on(BI.SignEditor.EVENT_SPACE, function () {
            self.fireEvent(BI.AdaptiveEditor.EVENT_SPACE);
        });
        this.editor.on(BI.SignEditor.EVENT_ERROR, function () {
            self.fireEvent(BI.AdaptiveEditor.EVENT_ERROR);
        });
        this.editor.on(BI.SignEditor.EVENT_ENTER, function () {
            self.fireEvent(BI.AdaptiveEditor.EVENT_ENTER);
        });
        this.editor.on(BI.SignEditor.EVENT_RESTRICT, function () {
            self.fireEvent(BI.AdaptiveEditor.EVENT_RESTRICT);
        });
        this.editor.on(BI.SignEditor.EVENT_EMPTY, function () {
            self.fireEvent(BI.AdaptiveEditor.EVENT_EMPTY);
        });
        this._checkEditorLength();
    },

    _checkEditorLength: function () {
        var o = this.options;
        this.element.width(BI.DOM.getTextSizeWidth(this.getValue(), 14) + 2 * o.hgap + o.lgap + o.rgap);
    },

    focus: function () {
        this.editor.focus();
    },

    blur: function () {
        this.editor.blur();
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
        this.editor.setValue(k);
        this._checkEditorLength();
    },

    getValue: function () {
        return this.editor.getValue();
    },

    getState: function () {
        return this.editor.getState();
    },

    setState: function (v) {

    }
});
BI.AdaptiveEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.AdaptiveEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.AdaptiveEditor.EVENT_BLUR = "EVENT_BLUR";
BI.AdaptiveEditor.EVENT_CLICK = "EVENT_CLICK";
BI.AdaptiveEditor.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.AdaptiveEditor.EVENT_CLICK_LABEL = "EVENT_CLICK_LABEL";

BI.AdaptiveEditor.EVENT_START = "EVENT_START";
BI.AdaptiveEditor.EVENT_PAUSE = "EVENT_PAUSE";
BI.AdaptiveEditor.EVENT_STOP = "EVENT_STOP";
BI.AdaptiveEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.AdaptiveEditor.EVENT_VALID = "EVENT_VALID";
BI.AdaptiveEditor.EVENT_ERROR = "EVENT_ERROR";
BI.AdaptiveEditor.EVENT_ENTER = "EVENT_ENTER";
BI.AdaptiveEditor.EVENT_RESTRICT = "EVENT_RESTRICT";
BI.AdaptiveEditor.EVENT_SPACE = "EVENT_SPACE";
BI.AdaptiveEditor.EVENT_EMPTY = "EVENT_EMPTY";

BI.shortcut("bi.adapt_editor", BI.AdaptiveEditor);