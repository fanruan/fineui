/**
 * 有清楚按钮的文本框
 * Created by GUY on 2015/9/29.
 * @class BI.SmallTextEditor
 * @extends BI.SearchEditor
 */
BI.ClearEditor = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        var conf = BI.ClearEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: "bi-clear-editor",
            height: 24,
            errorText: "",
            watermark: "",
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn
        });
    },
    _init: function () {
        BI.ClearEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget({
            type: "bi.editor",
            simple: o.simple,
            height: o.height,
            watermark: o.watermark,
            allowBlank: true,
            errorText: o.errorText,
            validationChecker: o.validationChecker,
            quitChecker: o.quitChecker,
            value: o.value
        });
        this.clear = BI.createWidget({
            type: "bi.icon_button",
            stopEvent: true,
            invisible: !BI.isKey(o.value),
            cls: "search-close-h-font"
        });
        this.clear.on(BI.IconButton.EVENT_CHANGE, function () {
            self.setValue("");
            self.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.STOPEDIT);
            self.fireEvent(BI.ClearEditor.EVENT_CLEAR);
        });
        BI.createWidget({
            element: this,
            type: "bi.htape",
            items: [
                {
                    el: this.editor
                },
                {
                    el: this.clear,
                    width: 24
                }]
        });
        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });

        this.editor.on(BI.Editor.EVENT_FOCUS, function () {
            self.fireEvent(BI.ClearEditor.EVENT_FOCUS);
        });
        this.editor.on(BI.Editor.EVENT_BLUR, function () {
            self.fireEvent(BI.ClearEditor.EVENT_BLUR);
        });
        this.editor.on(BI.Editor.EVENT_CLICK, function () {
            self.fireEvent(BI.ClearEditor.EVENT_CLICK);
        });
        this.editor.on(BI.Editor.EVENT_CHANGE, function () {
            self._checkClear();
            self.fireEvent(BI.ClearEditor.EVENT_CHANGE);
        });
        this.editor.on(BI.Editor.EVENT_KEY_DOWN, function (v) {
            self.fireEvent(BI.ClearEditor.EVENT_KEY_DOWN, v);
        });
        this.editor.on(BI.Editor.EVENT_SPACE, function () {
            self.fireEvent(BI.ClearEditor.EVENT_SPACE);
        });
        this.editor.on(BI.Editor.EVENT_BACKSPACE, function () {
            self.fireEvent(BI.ClearEditor.EVENT_BACKSPACE);
        });


        this.editor.on(BI.Editor.EVENT_VALID, function () {
            self.fireEvent(BI.ClearEditor.EVENT_VALID);
        });
        this.editor.on(BI.Editor.EVENT_ERROR, function () {
            self.fireEvent(BI.ClearEditor.EVENT_ERROR);
        });
        this.editor.on(BI.Editor.EVENT_ENTER, function () {
            self.fireEvent(BI.ClearEditor.EVENT_ENTER);
        });
        this.editor.on(BI.Editor.EVENT_RESTRICT, function () {
            self.fireEvent(BI.ClearEditor.EVENT_RESTRICT);
        });
        this.editor.on(BI.Editor.EVENT_EMPTY, function () {
            self._checkClear();
            self.fireEvent(BI.ClearEditor.EVENT_EMPTY);
        });
        this.editor.on(BI.Editor.EVENT_REMOVE, function () {
            self.fireEvent(BI.ClearEditor.EVENT_REMOVE);
        });
        this.editor.on(BI.Editor.EVENT_CONFIRM, function () {
            self.fireEvent(BI.ClearEditor.EVENT_CONFIRM);
        });
        this.editor.on(BI.Editor.EVENT_CHANGE_CONFIRM, function () {
            self.fireEvent(BI.ClearEditor.EVENT_CHANGE_CONFIRM);
        });
        this.editor.on(BI.Editor.EVENT_START, function () {
            self.fireEvent(BI.ClearEditor.EVENT_START);
        });
        this.editor.on(BI.Editor.EVENT_PAUSE, function () {
            self.fireEvent(BI.ClearEditor.EVENT_PAUSE);
        });
        this.editor.on(BI.Editor.EVENT_STOP, function () {
            self.fireEvent(BI.ClearEditor.EVENT_STOP);
        });
    },

    _checkClear: function () {
        if (!this.getValue()) {
            this.clear.invisible();
        } else {
            this.clear.visible();
        }
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

    getValue: function () {
        if (this.isValid()) {
            return this.editor.getValue();
        }
    },

    setValue: function (v) {
        this.editor.setValue(v);
        if (BI.isKey(v)) {
            this.clear.visible();
        }
    },

    isValid: function () {
        return this.editor.isValid();
    }
});
BI.ClearEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.ClearEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.ClearEditor.EVENT_BLUR = "EVENT_BLUR";
BI.ClearEditor.EVENT_CLICK = "EVENT_CLICK";
BI.ClearEditor.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.ClearEditor.EVENT_SPACE = "EVENT_SPACE";
BI.ClearEditor.EVENT_BACKSPACE = "EVENT_BACKSPACE";
BI.ClearEditor.EVENT_CLEAR = "EVENT_CLEAR";

BI.ClearEditor.EVENT_START = "EVENT_START";
BI.ClearEditor.EVENT_PAUSE = "EVENT_PAUSE";
BI.ClearEditor.EVENT_STOP = "EVENT_STOP";
BI.ClearEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.ClearEditor.EVENT_CHANGE_CONFIRM = "EVENT_CHANGE_CONFIRM";
BI.ClearEditor.EVENT_VALID = "EVENT_VALID";
BI.ClearEditor.EVENT_ERROR = "EVENT_ERROR";
BI.ClearEditor.EVENT_ENTER = "EVENT_ENTER";
BI.ClearEditor.EVENT_RESTRICT = "EVENT_RESTRICT";
BI.ClearEditor.EVENT_REMOVE = "EVENT_REMOVE";
BI.ClearEditor.EVENT_EMPTY = "EVENT_EMPTY";
BI.shortcut("bi.clear_editor", BI.ClearEditor);
