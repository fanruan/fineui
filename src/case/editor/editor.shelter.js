/**
 * 带标记的文本框
 * Created by GUY on 2016/1/25.
 * @class BI.ShelterEditor
 * @extends BI.Single
 */
BI.ShelterEditor = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.ShelterEditor.superclass._defaultConfig.apply(this, arguments);
        return BI.extend(conf, {
            baseCls: (conf.baseCls || "") + " bi-shelter-editor",
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
            height: 30,
            textAlign: "left"
        })
    },

    _init: function () {
        BI.ShelterEditor.superclass._init.apply(this, arguments);
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
            cls: "shelter-editor-text",
            textAlign: o.textAlign,
            height: o.height,
            hgap: 4
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
        this.text.on(BI.Controller.EVENT_CHANGE, function () {
            arguments[2] = self;
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.text.on(BI.TextButton.EVENT_CHANGE, function () {
            self.fireEvent(BI.ShelterEditor.EVENT_CLICK_LABEL);
        });
        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_FOCUS, function () {
            self.fireEvent(BI.ShelterEditor.EVENT_FOCUS, arguments);
        });
        this.editor.on(BI.Editor.EVENT_BLUR, function () {
            self.fireEvent(BI.ShelterEditor.EVENT_BLUR, arguments);
        });
        this.editor.on(BI.Editor.EVENT_CLICK, function () {
            self.fireEvent(BI.ShelterEditor.EVENT_CLICK, arguments);
        });
        this.editor.on(BI.Editor.EVENT_CHANGE, function () {
            self.fireEvent(BI.ShelterEditor.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_KEY_DOWN, function (v) {
            self.fireEvent(BI.ShelterEditor.EVENT_KEY_DOWN, arguments);
        });

        this.editor.on(BI.Editor.EVENT_VALID, function () {
            self.fireEvent(BI.ShelterEditor.EVENT_VALID, arguments);
        });
        this.editor.on(BI.Editor.EVENT_CONFIRM, function () {
            self._showHint();
            self._checkText();
            self.fireEvent(BI.ShelterEditor.EVENT_CONFIRM, arguments);
        });
        this.editor.on(BI.Editor.EVENT_START, function () {
            self.fireEvent(BI.ShelterEditor.EVENT_START, arguments);
        });
        this.editor.on(BI.Editor.EVENT_PAUSE, function () {
            self.fireEvent(BI.ShelterEditor.EVENT_PAUSE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_STOP, function () {
            self.fireEvent(BI.ShelterEditor.EVENT_STOP, arguments);
        });
        this.editor.on(BI.Editor.EVENT_SPACE, function () {
            self.fireEvent(BI.ShelterEditor.EVENT_SPACE, arguments);
        });
        this.editor.on(BI.Editor.EVENT_ERROR, function () {
            self._checkText();
            self.fireEvent(BI.ShelterEditor.EVENT_ERROR, arguments);
        });
        this.editor.on(BI.Editor.EVENT_ENTER, function () {
            self.fireEvent(BI.ShelterEditor.EVENT_ENTER, arguments);
        });
        this.editor.on(BI.Editor.EVENT_RESTRICT, function () {
            self.fireEvent(BI.ShelterEditor.EVENT_RESTRICT, arguments);
        });
        this.editor.on(BI.Editor.EVENT_EMPTY, function () {
            self.fireEvent(BI.ShelterEditor.EVENT_EMPTY, arguments);
        });
        BI.createWidget({
            type: "bi.vertical",
            scrolly: false,
            element: this.element,
            items: [this.editor]
        });
        this._showHint();
        self._checkText();
    },

    _checkText: function () {
        var o = this.options;
        if (this.editor.getValue() === "") {
            this.text.setValue(o.watermark || "");
            this.text.element.addClass("bi-water-mark");
        } else {
            this.text.setValue(this.editor.getValue());
            this.text.element.removeClass("bi-water-mark");
        }
    },

    _showInput: function () {
        this.editor.visible();
        this.text.invisible();
    },

    _showHint: function () {
        this.editor.invisible();
        this.text.visible();
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

    setValue: function (k) {
        this.editor.setValue(k);
        this._checkText();
    },

    getValue: function () {
        return this.editor.getValue();
    },

    getState: function () {
        return this.text.getValue();
    },

    setState: function (v) {
        this._showHint();
        this.text.setValue(v);
    }
});
BI.ShelterEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.ShelterEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.ShelterEditor.EVENT_BLUR = "EVENT_BLUR";
BI.ShelterEditor.EVENT_CLICK = "EVENT_CLICK";
BI.ShelterEditor.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.ShelterEditor.EVENT_CLICK_LABEL = "EVENT_CLICK_LABEL";

BI.ShelterEditor.EVENT_START = "EVENT_START";
BI.ShelterEditor.EVENT_PAUSE = "EVENT_PAUSE";
BI.ShelterEditor.EVENT_STOP = "EVENT_STOP";
BI.ShelterEditor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.ShelterEditor.EVENT_VALID = "EVENT_VALID";
BI.ShelterEditor.EVENT_ERROR = "EVENT_ERROR";
BI.ShelterEditor.EVENT_ENTER = "EVENT_ENTER";
BI.ShelterEditor.EVENT_RESTRICT = "EVENT_RESTRICT";
BI.ShelterEditor.EVENT_SPACE = "EVENT_SPACE";
BI.ShelterEditor.EVENT_EMPTY = "EVENT_EMPTY";

$.shortcut("bi.shelter_editor", BI.ShelterEditor);