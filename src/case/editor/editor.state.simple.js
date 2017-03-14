/**
 * 无限制-已选择状态输入框
 * Created by GUY on 2016/5/18.
 * @class BI.SimpleStateEditor
 * @extends BI.Single
 */
BI.SimpleStateEditor = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.SimpleStateEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-simple-state-editor",
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
        BI.SimpleStateEditor.superclass._init.apply(this, arguments);
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
            cls: "state-editor-infinite-text",
            textAlign: "left",
            height: o.height,
            text: BI.i18nText("BI-Unrestricted"),
            hgap: 4,
            handler: function () {
                self._showInput();
                self.editor.focus();
                self.editor.setValue("");
            }
        });
        this.text.on(BI.TextButton.EVENT_CHANGE, function () {
            BI.nextTick(function () {
                self.fireEvent(BI.SimpleStateEditor.EVENT_CLICK_LABEL);
            });
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this.element,
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
        this.editor.on(BI.Editor.EVENT_FOCUS, function () {
            self.fireEvent(BI.SimpleStateEditor.EVENT_FOCUS, arguments);
        });
        this.editor.on(BI.Editor.EVENT_BLUR, function () {
            self.fireEvent(BI.SimpleStateEditor.EVENT_BLUR, arguments);
        });
        this.editor.on(BI.Editor.EVENT_CLICK, function () {
            self.fireEvent(BI.SimpleStateEditor.EVENT_CLICK, arguments);
        });
        this.editor.on(BI.Editor.EVENT_CHANGE, function () {
            self.fireEvent(BI.SimpleStateEditor.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_KEY_DOWN, function (v) {
            self.fireEvent(BI.SimpleStateEditor.EVENT_KEY_DOWN, arguments);
        });

        this.editor.on(BI.Editor.EVENT_VALID, function () {
            self.fireEvent(BI.SimpleStateEditor.EVENT_VALID, arguments);
        });
        this.editor.on(BI.Editor.EVENT_CONFIRM, function () {
            self._showHint();
            self.fireEvent(BI.SimpleStateEditor.EVENT_CONFIRM, arguments);
        });
        this.editor.on(BI.Editor.EVENT_START, function () {
            self.fireEvent(BI.SimpleStateEditor.EVENT_START, arguments);
        });
        this.editor.on(BI.Editor.EVENT_PAUSE, function () {
            self.fireEvent(BI.SimpleStateEditor.EVENT_PAUSE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_STOP, function () {
            self.fireEvent(BI.SimpleStateEditor.EVENT_STOP, arguments);
        });
        this.editor.on(BI.Editor.EVENT_SPACE, function () {
            self.fireEvent(BI.SimpleStateEditor.EVENT_SPACE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_ERROR, function () {
            self.fireEvent(BI.SimpleStateEditor.EVENT_ERROR, arguments);
        });
        this.editor.on(BI.Editor.EVENT_ENTER, function () {
            self.fireEvent(BI.SimpleStateEditor.EVENT_ENTER, arguments);
        });
        this.editor.on(BI.Editor.EVENT_RESTRICT, function () {
            self.fireEvent(BI.SimpleStateEditor.EVENT_RESTRICT, arguments);
        });
        this.editor.on(BI.Editor.EVENT_EMPTY, function () {
            self.fireEvent(BI.SimpleStateEditor.EVENT_EMPTY, arguments);
        });
        BI.createWidget({
            type: "bi.vertical",
            scrolly: false,
            element: this.element,
            items: [this.editor]
        });
        this._showHint();
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

    focus: function () {
        this._showInput();
        this.editor.focus();
    },

    blur: function () {
        this.editor.blur();
        this._showHint();
    },

    _showInput: function () {
        this.editor.visible();
        this.text.invisible();
    },

    _showHint: function () {
        this.editor.invisible();
        this.text.visible();
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

    setValue: function (k) {
        this.editor.setValue(k);
    },

    getValue: function () {
        return this.editor.getValue();
    },

    getState: function () {
        return this.editor.getValue().match(/[^\s]+/g);
    },

    setState: function (v) {
        BI.SimpleStateEditor.superclass.setValue.apply(this, arguments);
        if (BI.isNumber(v)) {
            if (v === BI.Selection.All) {
                this.text.setText(BI.i18nText("BI-Aleady_Selected"));
                this.text.element.removeClass("state-editor-infinite-text");
            } else if (v === BI.Selection.Multi) {
                this.text.setText(BI.i18nText("BI-Aleady_Selected"));
                this.text.element.removeClass("state-editor-infinite-text");
            } else {
                this.text.setText(BI.i18nText("BI-Unrestricted"));
                this.text.element.addClass("state-editor-infinite-text");
            }
            return;
        }
        if (!BI.isArray(v) || v.length === 1) {
            this.text.setText(v);
            this.text.setTitle(v);
            this.text.element.removeClass("state-editor-infinite-text");
        } else if (BI.isEmpty(v)) {
            this.text.setText(BI.i18nText("BI-Unrestricted"));
            this.text.element.addClass("state-editor-infinite-text");
        } else {
            this.text.setText(BI.i18nText("BI-Aleady_Selected"));
            this.text.element.removeClass("state-editor-infinite-text");
        }
    }
});
BI.SimpleStateEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.SimpleStateEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.SimpleStateEditor.EVENT_BLUR = "EVENT_BLUR";
BI.SimpleStateEditor.EVENT_CLICK = "EVENT_CLICK";
BI.SimpleStateEditor.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.SimpleStateEditor.EVENT_CLICK_LABEL = "EVENT_CLICK_LABEL";

BI.SimpleStateEditor.EVENT_START = "EVENT_START";
BI.SimpleStateEditor.EVENT_PAUSE = "EVENT_PAUSE";
BI.SimpleStateEditor.EVENT_STOP = "EVENT_STOP";
BI.SimpleStateEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.SimpleStateEditor.EVENT_VALID = "EVENT_VALID";
BI.SimpleStateEditor.EVENT_ERROR = "EVENT_ERROR";
BI.SimpleStateEditor.EVENT_ENTER = "EVENT_ENTER";
BI.SimpleStateEditor.EVENT_RESTRICT = "EVENT_RESTRICT";
BI.SimpleStateEditor.EVENT_SPACE = "EVENT_SPACE";
BI.SimpleStateEditor.EVENT_EMPTY = "EVENT_EMPTY";

$.shortcut("bi.simple_state_editor", BI.SimpleStateEditor);