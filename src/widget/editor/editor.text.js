/**
 * guy
 * @class BI.TextEditor
 * @extends BI.Single
 */
BI.TextEditor = BI.inherit(BI.Widget, {
    _defaultConfig: function (config) {
        var conf = BI.TextEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            extraCls: "bi-text-editor bi-focus-shadow " + (config.simple ? "bi-border-bottom" : "bi-border"),
            hgap: 4,
            vgap: 2,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn,
            allowBlank: false,
            watermark: "",
            errorText: "",
            height: 24
        });
    },

    _init: function () {
        BI.TextEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var border = o.simple ? 1 : 2;
        if (BI.isNumber(o.height)) {
            this.element.css({height: o.height - border});
        }
        if (BI.isNumber(o.width)) {
            this.element.css({width: o.width - border});
        }
        this.editor = BI.createWidget({
            type: "bi.editor",
            simple: o.simple,
            height: o.height - border,
            hgap: o.hgap,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            value: o.value,
            title: o.title,
            tipType: o.tipType,
            validationChecker: o.validationChecker,
            quitChecker: o.quitChecker,
            allowBlank: o.allowBlank,
            watermark: o.watermark,
            errorText: o.errorText,
            inputType: o.inputType,
            autocomplete: o.autocomplete
        });
        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.editor.on(BI.Editor.EVENT_FOCUS, function () {
            self.fireEvent(BI.TextEditor.EVENT_FOCUS);
        });
        this.editor.on(BI.Editor.EVENT_BLUR, function () {
            self.fireEvent(BI.TextEditor.EVENT_BLUR);
        });
        this.editor.on(BI.Editor.EVENT_CLICK, function () {
            self.fireEvent(BI.TextEditor.EVENT_CLICK);
        });
        this.editor.on(BI.Editor.EVENT_CHANGE, function () {
            self.fireEvent(BI.TextEditor.EVENT_CHANGE);
        });
        this.editor.on(BI.Editor.EVENT_KEY_DOWN, function (v) {
            self.fireEvent(BI.TextEditor.EVENT_KEY_DOWN);
        });
        this.editor.on(BI.Editor.EVENT_SPACE, function (v) {
            self.fireEvent(BI.TextEditor.EVENT_SPACE);
        });
        this.editor.on(BI.Editor.EVENT_BACKSPACE, function (v) {
            self.fireEvent(BI.TextEditor.EVENT_BACKSPACE);
        });


        this.editor.on(BI.Editor.EVENT_VALID, function () {
            self.element.removeClass("error");
            self.fireEvent(BI.TextEditor.EVENT_VALID);
        });
        this.editor.on(BI.Editor.EVENT_CONFIRM, function () {
            self.fireEvent(BI.TextEditor.EVENT_CONFIRM);
        });
        this.editor.on(BI.Editor.EVENT_CHANGE_CONFIRM, function () {
            self.fireEvent(BI.TextEditor.EVENT_CHANGE_CONFIRM);
        });
        this.editor.on(BI.Editor.EVENT_REMOVE, function (v) {
            self.fireEvent(BI.TextEditor.EVENT_REMOVE);
        });
        this.editor.on(BI.Editor.EVENT_START, function () {
            self.fireEvent(BI.TextEditor.EVENT_START);
        });
        this.editor.on(BI.Editor.EVENT_PAUSE, function () {
            self.fireEvent(BI.TextEditor.EVENT_PAUSE);
        });
        this.editor.on(BI.Editor.EVENT_STOP, function () {
            self.fireEvent(BI.TextEditor.EVENT_STOP);
        });
        this.editor.on(BI.Editor.EVENT_ERROR, function () {
            self.element.addClass("error");
            self.fireEvent(BI.TextEditor.EVENT_ERROR, arguments);
        });
        this.editor.on(BI.Editor.EVENT_ENTER, function () {
            self.fireEvent(BI.TextEditor.EVENT_ENTER);
        });
        this.editor.on(BI.Editor.EVENT_RESTRICT, function () {
            self.fireEvent(BI.TextEditor.EVENT_RESTRICT);
        });
        this.editor.on(BI.Editor.EVENT_EMPTY, function () {
            self.fireEvent(BI.TextEditor.EVENT_EMPTY);
        });
        BI.createWidget({
            type: "bi.vertical",
            scrolly: false,
            element: this,
            items: [this.editor]
        });
    },

    setWaterMark: function (v) {
        this.options.watermark = v;
        this.editor.setWaterMark(v);
    },

    focus: function () {
        this.editor.focus();
    },

    blur: function () {
        this.editor.blur();
    },

    setErrorText: function (text) {
        this.editor.setErrorText(text);
    },

    getErrorText: function () {
        return this.editor.getErrorText();
    },

    isValid: function () {
        return this.editor.isValid();
    },

    setValue: function (v) {
        this.editor.setValue(v);
    },

    getValue: function () {
        return this.editor.getValue();
    }
});
BI.TextEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.TextEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.TextEditor.EVENT_BLUR = "EVENT_BLUR";
BI.TextEditor.EVENT_CLICK = "EVENT_CLICK";
BI.TextEditor.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.TextEditor.EVENT_SPACE = "EVENT_SPACE";
BI.TextEditor.EVENT_BACKSPACE = "EVENT_BACKSPACE";

BI.TextEditor.EVENT_START = "EVENT_START";
BI.TextEditor.EVENT_PAUSE = "EVENT_PAUSE";
BI.TextEditor.EVENT_STOP = "EVENT_STOP";
BI.TextEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.TextEditor.EVENT_CHANGE_CONFIRM = "EVENT_CHANGE_CONFIRM";
BI.TextEditor.EVENT_VALID = "EVENT_VALID";
BI.TextEditor.EVENT_ERROR = "EVENT_ERROR";
BI.TextEditor.EVENT_ENTER = "EVENT_ENTER";
BI.TextEditor.EVENT_RESTRICT = "EVENT_RESTRICT";
BI.TextEditor.EVENT_REMOVE = "EVENT_REMOVE";
BI.TextEditor.EVENT_EMPTY = "EVENT_EMPTY";

BI.shortcut("bi.text_editor", BI.TextEditor);