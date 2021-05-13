/**
 *
 * Created by GUY on 2016/1/18.
 * @class BI.TextAreaEditor
 * @extends BI.Single
 */
BI.TextAreaEditor = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        return BI.extend(BI.TextAreaEditor.superclass._defaultConfig.apply(), {
            baseCls: "bi-textarea-editor",
            value: "",
            errorText: "",
            adjustYOffset: 2,
            adjustXOffset: 0,
            offsetStyle: "left",
            validationChecker: function () {
                return true;
            },
        });
    },

    render: function () {
        var o = this.options, self = this;
        this.content = BI.createWidget({
            type: "bi.layout",
            tagName: "textarea",
            width: "100%",
            height: "100%",
            cls: "bi-textarea textarea-editor-content display-block"
        });
        this.content.element.css({ resize: "none" });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.adaptive",
                    items: [this.content]
                },
                left: 4,
                right: 4,
                top: 2,
                bottom: 2
            }]
        });

        this.content.element.on("input propertychange", function (e) {
            self._checkError();
            self._checkWaterMark();
            self.fireEvent(BI.TextAreaEditor.EVENT_CHANGE);
        });

        this.content.element.focus(function () {
            self._checkError();
            self._focus();
            self.fireEvent(BI.TextAreaEditor.EVENT_FOCUS);
            BI.Widget._renderEngine.createElement(document).bind("mousedown." + self.getName(), function (e) {
                if (BI.DOM.isExist(self) && !self.element.__isMouseInBounds__(e)) {
                    BI.Widget._renderEngine.createElement(document).unbind("mousedown." + self.getName());
                    self.content.element.blur();
                }
            });
        });
        this.content.element.blur(function () {
            self._setErrorVisible(false);
            self._blur();
            self.fireEvent(BI.TextAreaEditor.EVENT_BLUR);
            BI.Widget._renderEngine.createElement(document).unbind("mousedown." + self.getName());
        });
        if (BI.isKey(o.value)) {
            this.setValue(o.value);
        }
        if (BI.isNotNull(o.style)) {
            this.setStyle(o.style);
        }
        this._checkWaterMark();
    },

    _checkWaterMark: function () {
        var self = this, o = this.options;
        var val = this.getValue();
        if (BI.isNotEmptyString(val)) {
            this.watermark && this.watermark.destroy();
            this.watermark = null;
        } else {
            if (BI.isNotEmptyString(o.watermark)) {
                if (!this.watermark) {
                    this.watermark = BI.createWidget({
                        type: "bi.label",
                        cls: "bi-water-mark cursor-text textarea-watermark",
                        textAlign: "left",
                        whiteSpace: "normal",
                        text: o.watermark,
                        invalid: o.invalid,
                        disabled: o.disabled,
                        hgap: 4,
                        vgap: 4
                    });
                    this.watermark.element.bind({
                        mousedown: function (e) {
                            if (self.isEnabled()) {
                                self.focus();
                            } else {
                                self.blur();
                            }
                            e.stopEvent();
                        }
                    });
                    BI.createWidget({
                        type: "bi.absolute",
                        element: this,
                        items: [{
                            el: this.watermark,
                            left: 0,
                            top: 0,
                            right: 0
                        }]
                    });
                } else {
                    this.watermark.setText(o.watermark);
                    this.watermark.setValid(!o.invalid);
                    this.watermark.setEnable(!o.disabled);
                }
            }
        }
    },

    _checkError: function () {
        this._setErrorVisible(this.isEnabled() && !this.options.validationChecker(this.getValue()));
    },

    _focus: function () {
        this.content.element.addClass("textarea-editor-focus");
        this._checkWaterMark();
    },

    _blur: function () {
        this.content.element.removeClass("textarea-editor-focus");
        this._checkWaterMark();
    },

    _setErrorVisible: function (b) {
        var o = this.options;
        var errorText = o.errorText;
        if (BI.isFunction(errorText)) {
            errorText = errorText(BI.trim(this.getValue()));
        }
        if (!this.disabledError && BI.isKey(errorText)) {
            BI.Bubbles[b ? "show" : "hide"](this.getName(), errorText, this, {
                adjustYOffset: o.adjustYOffset,
                adjustXOffset: o.adjustXOffset,
                offsetStyle: o.offsetStyle,
            });
            return BI.Bubbles.get(this.getName());
        }
    },

    focus: function () {
        this._focus();
        this.content.element.focus();
    },

    blur: function () {
        this._blur();
        this.content.element.blur();
    },

    getValue: function () {
        return this.content.element.val();
    },

    setValue: function (value) {
        this.content.element.val(value);
        this._checkError();
        this._checkWaterMark();
    },

    setStyle: function (style) {
        this.style = style;
        this.element.css(style);
        this.content.element.css(BI.extend({}, style, {
            color: style.color || BI.DOM.getContrastColor(BI.DOM.isRGBColor(style.backgroundColor) ? BI.DOM.rgb2hex(style.backgroundColor) : style.backgroundColor)
        }));
    },

    getStyle: function () {
        return this.style;
    },

    setWatermark: function (v) {
        this.options.watermark = v;
        this._checkWaterMark();
    },

    _setValid: function (b) {
        BI.TextAreaEditor.superclass._setValid.apply(this, arguments);
        // this.content.setValid(b);
        // this.watermark && this.watermark.setValid(b);
    },

    _setEnable: function (b) {
        BI.TextAreaEditor.superclass._setEnable.apply(this, [b]);
        this.content && (this.content.element[0].disabled = !b);
    }
});
BI.TextAreaEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.TextAreaEditor.EVENT_BLUR = "EVENT_BLUR";
BI.TextAreaEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.shortcut("bi.textarea_editor", BI.TextAreaEditor);
