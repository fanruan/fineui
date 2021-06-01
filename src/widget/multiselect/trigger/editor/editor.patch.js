/**
 * @author windy
 * @version 2.0
 * Created by windy on 2021/5/18
 */
BI.SelectPatchEditor = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-patch-select-editor",
        height: 24,
    },

    render: function () {
        var self = this, o = this.options;

        var debounceInputChange = BI.debounce(BI.bind(this._dealChange, this), 300);

        return BI.extend({
            type: "bi.state_editor",
            ref: function (_ref) {
                self.editor = _ref;
            },
            hgap: o.hgap,
            vgap: o.vgap,
            lgap: o.lgap,
            rgap: o.rgap,
            tgap: o.tgap,
            bgap: o.bgap,
            height: o.height,
            watermark: o.watermark,
            allowBlank: true,
            value: o.value,
            defaultText: o.text,
            text: o.text,
            tipType: o.tipType,
            warningTitle: o.warningTitle,
            el: {
                type: 'bi.textarea_editor',
                scrolly: false,
                validationChecker: function () {
                    return true;
                },
                throttle: true,
            },
            listeners: [{
                eventName: BI.Controller.EVENT_CHANGE,
                action: function (type, v) {
                    if (BI.contains(v, "\n")) {
                        self._dealChange(type, v);
                    } else {
                        debounceInputChange(type, v);
                    }
                },
            }, {
                eventName: BI.Editor.EVENT_KEY_DOWN,
                action: function (keyCode) {
                    if (keyCode === BI.KeyCode.ENTER) {
                        self._clearSplitValue();
                    }
                },
            }, {
                eventName: BI.Editor.EVENT_FOCUS,
                action: function () {
                    self.fireEvent(BI.SelectPatchEditor.EVENT_FOCUS, arguments);
                },
            }, {
                eventName: BI.Editor.EVENT_BLUR,
                action: function () {
                    self._start = false;
                    self.fireEvent(BI.SelectPatchEditor.EVENT_BLUR, arguments);
                },
            }],
        }, o.el);
    },

    _clearSplitValue: function () {
        this.editor.setValue("");
    },

    _dealChange: function (type, v) {
        var value = "";
        if (v !== this.editor.getValue()) {
            return;
        }
        if (BI.isKey(v)) {
            value = this._formatText(v);
        }
        if (type === BI.Events.CHANGE) {
            this._setValue(value);
            if (this._trimValue(value) !== "") {
                if (!this._start || !BI.isKey(this._lastValue) || (this._pause === true && this._trimValue(this._lastValue) !== this._trimValue(value))) {
                    this._start = true;
                    this._pause = false;
                    this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.STARTEDIT, this.getValue(), this);
                }
            }
            if (this._trimValue(this._lastValue) !== this._trimValue(value)) {
                this.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
            }
            if (BI.endWith(value, BI.BlankSplitChar)) {
                this._pause = true;
                this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.PAUSE, "", this);
            }
        }
        if (type === BI.Events.EMPTY || type === BI.Events.STOPEDIT) {
            this.fireEvent(BI.Controller.EVENT_CHANGE, BI.Events.EMPTY);
        }
        this._lastValue = value;
    },

    _trimValue: function (v) {
        return BI.trim(BI.replaceAll(v || "", BI.BlankSplitChar, ""));
    },

    _formatText: function (v) {
        return BI.replaceAll(v || "", "\n", BI.BlankSplitChar);
    },

    setWaterMark: function (v) {
        this.editor.setWaterMark(v);
    },

    doRedMark: function () {
        this.editor.doRedMark.apply(this.editor, arguments);
    },

    unRedMark: function () {
        this.editor.unRedMark.apply(this.editor, arguments);
    },

    doHighLight: function () {
        this.editor.doHighLight.apply(this.editor, arguments);
    },

    unHighLight: function () {
        this.text.unHighLight.apply(this.text, arguments);
    },

    focus: function () {
        this.editor.focus();
    },

    blur: function () {
        this.editor.blur();
    },

    _setValue: function (v) {
        this.editor.setValue(this._formatText(v));
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

    getLastChangedValue: function () {
        return this.editor.getLastChangedValue();
    },

    setValue: function (v) {
        this._setValue(v);
        this._lastValue = this._trimValue(v);
    },

    getValue: function () {
        return BI.trim(this.editor.getValue());
    },

    getState: function () {
        return this.editor.getState();
    },

    setState: function (v) {
        this.editor.setState(v);
    },

    setTipType: function (v) {
        this.editor.setTipType(v);
    },

    getText: function () {
        return this.editor.getText();
    },
});
BI.SelectPatchEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.SelectPatchEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.SelectPatchEditor.EVENT_BLUR = "EVENT_BLUR";

BI.shortcut("bi.select_patch_editor", BI.SelectPatchEditor);