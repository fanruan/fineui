/**
 *
 * Created by GUY on 2016/1/18.
 * @class BI.TextAreaEditor
 * @extends BI.Single
 */
BI.TextAreaEditor = BI.inherit(BI.Single, {
    _defaultConfig: function () {
        return $.extend(BI.TextAreaEditor.superclass._defaultConfig.apply(), {
            baseCls: 'bi-textarea-editor bi-card',
            value: ''
        });
    },
    _init: function () {
        BI.TextAreaEditor.superclass._init.apply(this, arguments);
        var o = this.options, self = this;
        this.content = BI.createWidget({
            type: "bi.layout",
            tagName: "textarea",
            width: "100%",
            height: "100%",
            cls: "bi-textarea textarea-editor-content display-block"
        });
        this.content.element.css({"resize": "none"});
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.adaptive",
                    items: [this.content]
                },
                left: 0,
                right: 3,
                top: 0,
                bottom: 5
            }]
        });

        this.content.element.on("input propertychange", function (e) {
            self._checkWaterMark();
            self.fireEvent(BI.TextAreaEditor.EVENT_CHANGE);
        });

        this.content.element.focus(function () {
            if (self.isValid()) {
                self._focus();
                self.fireEvent(BI.TextAreaEditor.EVENT_FOCUS);
            }
            $(document).bind("mousedown." + self.getName(), function (e) {
                if (BI.DOM.isExist(self) && !self.element.__isMouseInBounds__(e)) {
                    $(document).unbind("mousedown." + self.getName());
                    self.content.element.blur();
                }
            });
        });
        this.content.element.blur(function () {
            if (self.isValid()) {
                self._blur();
                self.fireEvent(BI.TextAreaEditor.EVENT_BLUR);
            }
            $(document).unbind("mousedown." + self.getName());
        });
        if (BI.isKey(o.value)) {
            self.setValue(o.value);
        }
        if (BI.isNotNull(o.style)) {
            self.setValue(o.style);
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
                        type: "bi.text_button",
                        cls: "bi-water-mark",
                        textAlign: "left",
                        height: 30,
                        text: o.watermark,
                        invalid: o.invalid,
                        disabled: o.disabled
                    });
                    this.watermark.on(BI.TextButton.EVENT_CHANGE, function () {
                        self.focus();
                    });
                    BI.createWidget({
                        type: 'bi.absolute',
                        element: this,
                        items: [{
                            el: this.watermark,
                            left: 0,
                            top: 0,
                            right: 0
                        }]
                    })
                } else {
                    this.watermark.setText(o.watermark);
                    this.watermark.setValid(!o.invalid);
                    this.watermark.setEnable(!o.disabled);
                }
            }
        }
    },

    _focus: function () {
        this.content.element.addClass("textarea-editor-focus");
        this._checkWaterMark();
    },

    _blur: function () {
        this.content.element.removeClass("textarea-editor-focus");
        this._checkWaterMark();
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
        this._checkWaterMark();
    },

    setStyle: function (style) {
        this.style = style;
        this.element.css(style);
        this.content.element.css(BI.extend({}, style, {
            color: style.color || BI.DOM.getContrastColor(BI.DOM.isRGBColor(style.backgroundColor) ? BI.DOM.rgb2hex(style.backgroundColor) : style.backgroundColor)
        }))
    },

    getStyle: function () {
        return this.style;
    },

    _setValid: function (b) {
        BI.TextAreaEditor.superclass._setValid.apply(this, arguments);
        // this.content.setValid(b);
        // this.watermark && this.watermark.setValid(b);
    }
});
BI.TextAreaEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.TextAreaEditor.EVENT_BLUR = "EVENT_BLUR";
BI.TextAreaEditor.EVENT_FOCUS = "EVENT_FOCUS";
BI.shortcut("bi.textarea_editor", BI.TextAreaEditor);