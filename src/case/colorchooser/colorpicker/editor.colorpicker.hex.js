/**
 * 简单选色控件
 *
 * Created by GUY on 2015/11/16.
 * @class BI.ColorPickerEditor
 * @extends BI.Widget
 */
BI.HexColorPickerEditor = BI.inherit(BI.Widget, {

    constants: {
        RGB_WIDTH: 32,
        HEX_WIDTH: 70,
        HEX_PREFIX_POSITION: 1
    },

    props: {
        baseCls: "bi-color-picker-editor",
        height: 30
    },

    render: function () {
        var self = this, o = this.options, c = this.constants;
        this.storeValue = {};
        var RGB = BI.createItems([{text: "R"}, {text: "G"}, {text: "B"}], {
            type: "bi.label",
            cls: "color-picker-editor-label",
            height: 20
        });

        var checker = function (v) {
            return BI.isNumeric(v) && (v | 0) >= 0 && (v | 0) <= 255;
        };
        var Ws = BI.map(BI.range(0, 3), function () {
            return {
                type: "bi.small_text_editor",
                cls: "color-picker-editor-input",
                validationChecker: checker,
                errorText: BI.i18nText("BI-Color_Picker_Error_Text"),
                allowBlank: true,
                value: 255,
                width: c.RGB_WIDTH,
                height: 24,
                listeners: [{
                    eventName: BI.TextEditor.EVENT_CHANGE,
                    action: function () {
                        self._checkEditors();
                        if (checker(self.storeValue.r) && checker(self.storeValue.g) && checker(self.storeValue.b)) {
                            self.colorShow.element.css("background-color", self.getValue());
                            self.fireEvent(BI.ColorPickerEditor.EVENT_CHANGE);
                        }
                    }
                }]
            };
        });

        return {
            type: "bi.absolute",
            items: [{
                el: {
                    type: "bi.vertical",
                    tgap: 10,
                    items: [{
                        type: 'bi.vertical_adapt',
                        columnSize: ["fill", 'fill'],
                        height: 24,
                        items: [{
                            type: "bi.color_picker_show_button",
                            cls: "trans-color-icon",
                            height: 22,
                            title: BI.i18nText("BI-Transparent_Color"),
                            text: BI.i18nText("BI-Transparent_Color"),
                            listeners: [{
                                eventName: BI.ColorChooserShowButton.EVENT_CHANGE,
                                action: function () {
                                    self.setValue("transparent");
                                    self.fireEvent(BI.ColorPickerEditor.EVENT_CHANGE);
                                }
                            }],
                            ref: function (_ref) {
                                self.transparent = _ref;
                            }
                        }, {
                            el: {
                                type: "bi.color_picker_show_button",
                                cls: "auto-color-icon",
                                height: 22,
                                title: BI.i18nText("BI-Basic_Auto"),
                                text: BI.i18nText("BI-Basic_Auto"),
                                listeners: [{
                                    eventName: BI.ColorChooserShowButton.EVENT_CHANGE,
                                    action: function () {
                                        self.setValue("");
                                        self.fireEvent(BI.ColorPickerEditor.EVENT_CHANGE);
                                    }
                                }],
                                ref: function (_ref) {
                                    self.none = _ref;
                                }
                            },
                            lgap: 10,
                        }]
                    }, {
                        el: {
                            type: "bi.vertical_adapt",
                            columnSize: [22, 10, 'fill', 12, c.RGB_WIDTH, 12, c.RGB_WIDTH, 12, c.RGB_WIDTH],

                            rgap: 5,
                            items: [{
                                el: {
                                    type: "bi.layout",
                                    cls: "color-picker-editor-display bi-card bi-border",
                                    height: 22,
                                    width: 22,
                                    ref: function (_ref) {
                                        self.colorShow = _ref;
                                    }
                                },
                                width: 18
                            }, {
                                type: "bi.label",
                                text: "#",
                                width: 10
                            }, {
                                type: "bi.small_text_editor",
                                ref: function (_ref) {
                                    self.hexEditor = _ref;
                                },
                                cls: "color-picker-editor-input",
                                validationChecker: this._hexChecker,
                                allowBlank: true,
                                errorText: BI.i18nText("BI-Color_Picker_Error_Text_Hex"),
                                width: c.HEX_WIDTH,
                                height: 24,
                                listeners: [{
                                    eventName: "EVENT_CHANGE",
                                    action: function () {
                                        self._checkHexEditor();
                                        if (checker(self.storeValue.r) && checker(self.storeValue.g) && checker(self.storeValue.b)) {
                                            self.colorShow.element.css("background-color", self.getValue());
                                            self.fireEvent(BI.ColorPickerEditor.EVENT_CHANGE);
                                        }

                                    }
                                }]
                            }, RGB[0], {
                                el: BI.extend(Ws[0], {
                                    ref: function (_ref) {
                                        self.R = _ref
                                    }
                                }),
                                width: c.RGB_WIDTH
                            }, RGB[1], {
                                el: BI.extend(Ws[1], {
                                    ref: function (_ref) {
                                        self.G = _ref
                                    }
                                }),
                                width: c.RGB_WIDTH
                            }, RGB[2], {
                                el: BI.extend(Ws[2], {
                                    ref: function (_ref) {
                                        self.B = _ref
                                    }
                                }),
                                rgap: -5,
                                width: c.RGB_WIDTH
                            }]
                        }
                    }]
                },
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }]
        };
    },

    _hexChecker: function (v) {
        return /^[0-9a-fA-F]{6}$/.test(v);
    },

    _checkEditors: function () {
        if(BI.isEmptyString(this.R.getValue())) {
            this.R.setValue(0);
        }
        if(BI.isEmptyString(this.G.getValue())) {
            this.G.setValue(0);
        }
        if(BI.isEmptyString(this.B.getValue())) {
            this.B.setValue(0);
        }
        this.storeValue = {
            r: this.R.getValue() || 0,
            g: this.G.getValue() || 0,
            b: this.B.getValue() || 0
        };
        this.hexEditor.setValue(this.getValue().slice(this.constants.HEX_PREFIX_POSITION));
    },

    _isEmptyRGB: function () {
        return BI.isEmptyString(this.storeValue.r) && BI.isEmptyString(this.storeValue.g) && BI.isEmptyString(this.storeValue.b);
    },

    _checkHexEditor: function () {
        if (BI.isEmptyString(this.hexEditor.getValue())) {
            this.hexEditor.setValue("000000");
        }
        var json = BI.DOM.rgb2json(BI.DOM.hex2rgb("#" + this.hexEditor.getValue()));
        this.storeValue = {
            r: json.r || 0,
            g: json.g || 0,
            b: json.b || 0,
        };
        this.R.setValue(this.storeValue.r);
        this.G.setValue(this.storeValue.g);
        this.B.setValue(this.storeValue.b);
    },

    _showPreColor: function (color) {
        if (color === "") {
            this.colorShow.element.css("background-color", "").removeClass("trans-color-background").addClass("auto-color-square-normal-background");
        } else if (color === "transparent") {
            this.colorShow.element.css("background-color", "").removeClass("auto-color-square-normal-background").addClass("trans-color-background");
        } else {
            this.colorShow.element.css({"background-color": color}).removeClass("auto-color-square-normal-background").removeClass("trans-color-background");
        }
    },

    _setEnable: function (enable) {
        BI.ColorPickerEditor.superclass._setEnable.apply(this, arguments);
        if (enable === true) {
            this.element.removeClass("base-disabled disabled");
        } else if (enable === false) {
            this.element.addClass("base-disabled disabled");
        }
    },

    setValue: function (color) {
        if (color === "transparent") {
            this.transparent.setSelected(true);
            this.none.setSelected(false);
            this._showPreColor("transparent");
            this.R.setValue("");
            this.G.setValue("");
            this.B.setValue("");
            this.hexEditor.setValue("");
            this.storeValue = {
                r: "",
                g: "",
                b: ""
            };
            return;
        }
        if (!color) {
            color = "";
            this.none.setSelected(true);
        } else {
            this.none.setSelected(false);
        }
        this.transparent.setSelected(false);
        this._showPreColor(color);
        var json = BI.DOM.rgb2json(BI.DOM.hex2rgb(color));
        this.storeValue = {
            r: BI.isNull(json.r) ? "" : json.r,
            g: BI.isNull(json.g) ? "" : json.g,
            b: BI.isNull(json.b) ? "" : json.b
        };
        this.R.setValue(this.storeValue.r);
        this.G.setValue(this.storeValue.g);
        this.B.setValue(this.storeValue.b);
        this.hexEditor.setValue(color.slice(this.constants.HEX_PREFIX_POSITION));
    },

    getValue: function () {
        if (this._isEmptyRGB() && this.transparent.isSelected()) {
            return "transparent";
        }
        return BI.DOM.rgb2hex(BI.DOM.json2rgb({
            r: this.storeValue.r,
            g: this.storeValue.g,
            b: this.storeValue.b
        }));
    }
});
BI.HexColorPickerEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.hex_color_picker_editor", BI.HexColorPickerEditor);
