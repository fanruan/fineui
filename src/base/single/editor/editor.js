/**
 * Created by GUY on 2015/4/15.
 * @class BI.Editor
 * @extends BI.Single
 */
BI.Editor = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        var conf = BI.Editor.superclass._defaultConfig.apply(this, arguments);

        return BI.extend(conf, {
            baseCls: "bi-editor bi-focus-shadow",
            hgap: 4,
            vgap: 2,
            lgap: 0,
            rgap: 0,
            tgap: 0,
            bgap: 0,
            // title,warningTitle这两个属性没用
            tipType: "warning",
            inputType: "text",
            validationChecker: BI.emptyFn,
            quitChecker: BI.emptyFn,
            allowBlank: false,
            watermark: "",
            errorText: "",
        });
    },

    render: function () {
        var self = this, o = this.options;
        // 密码输入框设置autocomplete="new-password"的情况下Firefox和chrome不会自动填充密码
        var autocomplete = o.autocomplete ? " autocomplete=" + o.autocomplete : "";
        this.editor = this.addWidget(BI.createWidget({
            type: "bi.input",
            element: "<input type='" + o.inputType + "'" + autocomplete + " />",
            root: true,
            value: o.value,
            watermark: o.watermark,
            validationChecker: o.validationChecker,
            quitChecker: o.quitChecker,
            allowBlank: o.allowBlank
        }));
        this.editor.element.css({
            width: "100%",
            height: "100%",
            border: "none",
            outline: "none",
            padding: "0",
            margin: "0"
        });

        var items = [{
            el: {
                type: "bi.absolute",
                ref: function (_ref) {
                    self.contentWrapper = _ref;
                },
                items: [{
                    el: this.editor,
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }]
            },
            left: o.hgap + o.lgap,
            right: o.hgap + o.rgap,
            top: o.vgap + o.tgap,
            bottom: o.vgap + o.bgap
        }];

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: items
        });

        this.setWaterMark(this.options.watermark);

        this.editor.on(BI.Controller.EVENT_CHANGE, function () {
            self.fireEvent(BI.Controller.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.Input.EVENT_FOCUS, function () {
            self._checkError();
            self.element.addClass("bi-editor-focus");
            self.fireEvent(BI.Editor.EVENT_FOCUS, arguments);
        });
        this.editor.on(BI.Input.EVENT_BLUR, function () {
            self._setErrorVisible(false);
            self.element.removeClass("bi-editor-focus");
            self.fireEvent(BI.Editor.EVENT_BLUR, arguments);
        });
        this.editor.on(BI.Input.EVENT_CLICK, function () {
            self.fireEvent(BI.Editor.EVENT_CLICK, arguments);
        });
        this.editor.on(BI.Input.EVENT_CHANGE, function () {
            self.fireEvent(BI.Editor.EVENT_CHANGE, arguments);
        });
        this.editor.on(BI.Input.EVENT_KEY_DOWN, function (v) {
            self.fireEvent(BI.Editor.EVENT_KEY_DOWN, arguments);
        });
        this.editor.on(BI.Input.EVENT_QUICK_DOWN, function (e) {
            // tab键就不要隐藏了
            if (e.keyCode !== BI.KeyCode.TAB && self.watermark) {
                self.watermark.invisible();
            }
        });

        this.editor.on(BI.Input.EVENT_VALID, function () {
            self._checkWaterMark();
            self._setErrorVisible(false);
            self.element.removeClass("error");
            self.fireEvent(BI.Editor.EVENT_VALID, arguments);
        });
        this.editor.on(BI.Input.EVENT_ERROR, function () {
            self._checkWaterMark();
            self.fireEvent(BI.Editor.EVENT_ERROR, arguments);
            self._setErrorVisible(self.isEditing());
            self.element.addClass("error");
        });
        this.editor.on(BI.Input.EVENT_RESTRICT, function () {
            self._checkWaterMark();
            var tip = self._setErrorVisible(true);
            tip && tip.element.fadeOut(100, function () {
                tip.element.fadeIn(100);
            });
            self.fireEvent(BI.Editor.EVENT_RESTRICT, arguments);
        });
        this.editor.on(BI.Input.EVENT_EMPTY, function () {
            self._checkWaterMark();
            self.fireEvent(BI.Editor.EVENT_EMPTY, arguments);
        });
        this.editor.on(BI.Input.EVENT_ENTER, function () {
            self.fireEvent(BI.Editor.EVENT_ENTER, arguments);
        });
        this.editor.on(BI.Input.EVENT_SPACE, function () {
            self.fireEvent(BI.Editor.EVENT_SPACE, arguments);
        });
        this.editor.on(BI.Input.EVENT_BACKSPACE, function () {
            self.fireEvent(BI.Editor.EVENT_BACKSPACE, arguments);
        });
        this.editor.on(BI.Input.EVENT_REMOVE, function () {
            self.fireEvent(BI.Editor.EVENT_REMOVE, arguments);
        });
        this.editor.on(BI.Input.EVENT_START, function () {
            self.fireEvent(BI.Editor.EVENT_START, arguments);
        });
        this.editor.on(BI.Input.EVENT_PAUSE, function () {
            self.fireEvent(BI.Editor.EVENT_PAUSE, arguments);
        });
        this.editor.on(BI.Input.EVENT_STOP, function () {
            self.fireEvent(BI.Editor.EVENT_STOP, arguments);
        });
        this.editor.on(BI.Input.EVENT_CONFIRM, function () {
            self.fireEvent(BI.Editor.EVENT_CONFIRM, arguments);
        });
        this.editor.on(BI.Input.EVENT_CHANGE_CONFIRM, function () {
            self.fireEvent(BI.Editor.EVENT_CHANGE_CONFIRM, arguments);
        });
        this.element.click(function (e) {
            e.stopPropagation();
            return false;
        });
        if (BI.isKey(this.options.value) || BI.isEmptyString(this.options.value)) {
            this._checkError();
            this._checkWaterMark();
        } else {
            this._checkWaterMark();
        }
    },

    _checkToolTip: function () {
        var o = this.options;
        var errorText = o.errorText;
        if (BI.isFunction(errorText)) {
            errorText = errorText(this.editor.getValue());
        }
        if (BI.isKey(errorText)) {
            if (!this.isEnabled() || this.isValid() || BI.Bubbles.has(this.getName())) {
                this.setTitle("");
            } else {
                this.setTitle(errorText);
            }
        }
    },

    _assertWaterMark: function () {
        var self = this, o = this.options;
        if (BI.isNull(this.watermark)) {
            this.watermark = BI.createWidget({
                type: "bi.label",
                cls: "bi-water-mark",
                text: this.options.watermark,
                height: o.height - 2 * o.vgap - o.tgap,
                hgap: 2,
                whiteSpace: "nowrap",
                textAlign: "left"
            });
            this.watermark.element.bind({
                mousedown: function (e) {
                    if (self.isEnabled()) {
                        self.editor.isEditing() || self.editor.focus();
                    } else {
                        self.editor.isEditing() && self.editor.blur();
                    }
                    e.stopEvent();
                }
            });
            this.watermark.element.bind("click", function (e) {
                if (self.isEnabled()) {
                    self.editor.isEditing() || self.editor.focus();
                } else {
                    self.editor.isEditing() && self.editor.blur();
                }
                e.stopEvent();
            });
        }
    },

    _checkError: function () {
        this._setErrorVisible(this.isEnabled() && !this.isValid());
        this._checkToolTip();
    },

    _checkWaterMark: function () {
        var o = this.options;
        if (!this.disabledWaterMark && this.editor.getValue() === "" && BI.isKey(o.watermark)) {
            this.watermark && this.watermark.visible();
        } else {
            this.watermark && this.watermark.invisible();
        }
    },

    setErrorText: function (text) {
        this.options.errorText = text;
    },

    getErrorText: function () {
        return this.options.errorText;
    },

    setWaterMark: function (v) {
        if (!BI.isKey(v)) {
            return;
        }

        this.options.watermark = v;

        if (BI.isNull(this.watermark)) {
            this._assertWaterMark();
            BI.createWidget({
                type: "bi.absolute",
                element: this.contentWrapper,
                items: [{
                    el: this.watermark,
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                }],
            });
        }
        this.watermark.setText(v);
    },

    _setErrorVisible: function (b) {
        var o = this.options;
        var errorText = o.errorText;
        if (BI.isFunction(errorText)) {
            errorText = errorText(BI.trim(this.editor.getValue()));
        }
        if (!this.disabledError && BI.isKey(errorText)) {
            BI.Bubbles[b ? "show" : "hide"](this.getName(), errorText, this, {
                adjustYOffset: o.simple ? 1 : 2
            });
            this._checkToolTip();
        }
    },

    disableError: function () {
        this.disabledError = true;
        this._checkError();
    },

    enableError: function () {
        this.disabledError = false;
        this._checkError();
    },

    disableWaterMark: function () {
        this.disabledWaterMark = true;
        this._checkWaterMark();
    },

    enableWaterMark: function () {
        this.disabledWaterMark = false;
        this._checkWaterMark();
    },

    focus: function () {
        this.element.addClass("text-editor-focus");
        this.editor.focus();
    },

    blur: function () {
        this.element.removeClass("text-editor-focus");
        this.editor.blur();
    },

    selectAll: function () {
        this.editor.selectAll();
    },

    onKeyDown: function (k) {
        this.editor.onKeyDown(k);
    },

    setValue: function (v) {
        BI.Editor.superclass.setValue.apply(this, arguments);
        this.editor.setValue(v);
        this._checkError();
        this._checkWaterMark();
    },

    getLastValidValue: function () {
        return this.editor.getLastValidValue();
    },

    getLastChangedValue: function () {
        return this.editor.getLastChangedValue();
    },

    getValue: function () {
        if (!this.isValid()) {
            return BI.trim(this.editor.getLastValidValue());
        }
        return BI.trim(this.editor.getValue());
    },

    isEditing: function () {
        return this.editor.isEditing();
    },

    isValid: function () {
        return this.editor.isValid();
    },

    destroyed: function () {
        BI.Bubbles.remove(this.getName());
    }
});
BI.Editor.EVENT_CHANGE = "EVENT_CHANGE";
BI.Editor.EVENT_FOCUS = "EVENT_FOCUS";
BI.Editor.EVENT_BLUR = "EVENT_BLUR";
BI.Editor.EVENT_CLICK = "EVENT_CLICK";
BI.Editor.EVENT_KEY_DOWN = "EVENT_KEY_DOWN";
BI.Editor.EVENT_SPACE = "EVENT_SPACE";
BI.Editor.EVENT_BACKSPACE = "EVENT_BACKSPACE";

BI.Editor.EVENT_START = "EVENT_START";
BI.Editor.EVENT_PAUSE = "EVENT_PAUSE";
BI.Editor.EVENT_STOP = "EVENT_STOP";
BI.Editor.EVENT_CONFIRM = "EVENT_CONFIRM";
BI.Editor.EVENT_CHANGE_CONFIRM = "EVENT_CHANGE_CONFIRM";
BI.Editor.EVENT_VALID = "EVENT_VALID";
BI.Editor.EVENT_ERROR = "EVENT_ERROR";
BI.Editor.EVENT_ENTER = "EVENT_ENTER";
BI.Editor.EVENT_RESTRICT = "EVENT_RESTRICT";
BI.Editor.EVENT_REMOVE = "EVENT_REMOVE";
BI.Editor.EVENT_EMPTY = "EVENT_EMPTY";

BI.shortcut("bi.editor", BI.Editor);
