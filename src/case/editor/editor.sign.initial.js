/**
 * sign是新值（初始value值）形式的自适应宽度的输入框
 * @class BI.SignInitialEditor
 * @extends BI.Single
 */
BI.SignInitialEditor = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.SignInitialEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-sign-initial-editor",
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
            value: "",
            text: "",
            height: 30
        })
    },

    _init: function () {
        BI.SignInitialEditor.superclass._init.apply(this, arguments);
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
            value: o.value || o.text,
            validationChecker: o.validationChecker,
            quitChecker: o.quitChecker,
            mouseOut: o.mouseOut,
            allowBlank: o.allowBlank,
            watermark: o.watermark,
            errorText: o.errorText
        });
        if(BI.isNotNull(o.value)){
            this.setState(o.value);
        }
        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.SignEditor.EVENT_FOCUS, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_FOCUS);
        });
        this.editor.on(BI.SignEditor.EVENT_BLUR, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_BLUR);
        });
        this.editor.on(BI.SignEditor.EVENT_CLICK, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_CLICK);
        });
        this.editor.on(BI.SignEditor.EVENT_CHANGE, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_CHANGE);
        });
        this.editor.on(BI.SignEditor.EVENT_KEY_DOWN, function (v) {
            self.fireEvent(BI.SignInitialEditor.EVENT_KEY_DOWN);
        });

        this.editor.on(BI.SignEditor.EVENT_VALID, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_VALID);
        });
        this.editor.on(BI.SignEditor.EVENT_CONFIRM, function () {
            self.setState(self.editor.getValue());
            self.fireEvent(BI.SignInitialEditor.EVENT_CONFIRM);
        });
        this.editor.on(BI.SignEditor.EVENT_START, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_START);
        });
        this.editor.on(BI.SignEditor.EVENT_PAUSE, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_PAUSE);
        });
        this.editor.on(BI.SignEditor.EVENT_STOP, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_STOP);
        });
        this.editor.on(BI.SignEditor.EVENT_SPACE, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_SPACE);
        });
        this.editor.on(BI.SignEditor.EVENT_ERROR, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_ERROR);
        });
        this.editor.on(BI.SignEditor.EVENT_ENTER, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_ENTER);
        });
        this.editor.on(BI.SignEditor.EVENT_RESTRICT, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_RESTRICT);
        });
        this.editor.on(BI.SignEditor.EVENT_EMPTY, function () {
            self.fireEvent(BI.SignInitialEditor.EVENT_EMPTY);
        });
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

    setValue: function (v) {
        this.editor.setValue(v.value);
        this.setState(v.value);
    },

    getValue: function () {
        return {
            value: this.editor.getValue(),
            text: this.options.text
        }
    },

    getState: function () {
        return this.editor.getState();
    },

    setState: function (v) {
        var o = this.options;
        v = (BI.isEmpty(v) || v == o.text) ? o.text : v + "(" + o.text + ")";
        this.editor.setState(v);
    }
});
BI.SignInitialEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.SignInitialEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.SignInitialEditor.EVENT_BLUR = "EVENT_BLUR";
BI.SignInitialEditor.EVENT_CLICK = "EVENT_CLICK";
BI.SignInitialEditor.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.SignInitialEditor.EVENT_CLICK_LABEL = "EVENT_CLICK_LABEL";

BI.SignInitialEditor.EVENT_START = "EVENT_START";
BI.SignInitialEditor.EVENT_PAUSE = "EVENT_PAUSE";
BI.SignInitialEditor.EVENT_STOP = "EVENT_STOP";
BI.SignInitialEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.SignInitialEditor.EVENT_VALID = "EVENT_VALID";
BI.SignInitialEditor.EVENT_ERROR = "EVENT_ERROR";
BI.SignInitialEditor.EVENT_ENTER = "EVENT_ENTER";
BI.SignInitialEditor.EVENT_RESTRICT = "EVENT_RESTRICT";
BI.SignInitialEditor.EVENT_SPACE = "EVENT_SPACE";
BI.SignInitialEditor.EVENT_EMPTY = "EVENT_EMPTY";

BI.shortcut("bi.sign_initial_editor", BI.SignInitialEditor);