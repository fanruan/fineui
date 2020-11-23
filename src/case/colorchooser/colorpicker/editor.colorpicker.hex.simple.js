/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/11/10
 */
BI.SimpleHexColorPickerEditor = BI.inherit(BI.Widget, {

    constants: {
        RGB_WIDTH: 40,
        HEX_WIDTH: 70,
        HEX_PREFIX_POSITION: 1
    },

    props: {
        baseCls: "bi-color-picker-editor",
        // width: 200,
        height: 50
    },

    render: function () {
        var self = this, o = this.options, c = this.constants;

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
                height: 20,
                listeners: [{
                    eventName: BI.TextEditor.EVENT_CHANGE,
                    action: function () {
                        self._checkEditors();
                        if (self.R.isValid() && self.G.isValid() && self.B.isValid()) {
                            self.colorShow.element.css("background-color", self.getValue());
                            self.fireEvent(BI.SimpleColorPickerEditor.EVENT_CHANGE);
                        }
                    }
                }]
            }
        });

        return {
            type: "bi.vertical",
            tgap: 5,
            items: [{
                type: "bi.vertical_adapt",
                rgap: 10,
                items: [{
                    el: {
                        type: "bi.layout",
                        cls: "color-picker-editor-display bi-card bi-border",
                        height: 16,
                        width: 16,
                        ref: function (_ref) {
                            self.colorShow = _ref;
                        }
                    },
                    width: 16,
                    lgap: 10,
                    rgap: 5
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
                    height: 20,
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
                }, {
                    el: BI.extend(Ws[0], {
                        ref: function (_ref) {
                            self.R = _ref
                        }
                    }),
                    width: c.RGB_WIDTH
                }, {
                    el: BI.extend(Ws[1], {
                        ref: function (_ref) {
                            self.G = _ref
                        }
                    }),
                    width: c.RGB_WIDTH
                }, {
                    el: BI.extend(Ws[2], {
                        ref: function (_ref) {
                            self.B = _ref
                        }
                    }),
                    width: c.RGB_WIDTH
                }]
            }, {
                type: "bi.vertical_adapt",
                items: [{
                    el: {
                        type: "bi.label",
                        cls: "color-picker-editor-label",
                        height: 20,
                        text: "HEX"
                    },
                    lgap: 86
                },{
                    el: RGB[0].el,
                    lgap: 50
                }, {
                    el: RGB[1].el,
                    lgap: 40
                }, {
                    el: RGB[2].el,
                    lgap: 40
                }]
            }]

        }
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
        this.hexEditor.setValue(this.getValue().slice(this.constants.HEX_PREFIX_POSITION));
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

    setValue: function (color) {
        this.colorShow.element.css({"background-color": color});
        var json = BI.DOM.rgb2json(BI.DOM.hex2rgb(color));
        this.R.setValue(BI.isNull(json.r) ? "" : json.r);
        this.G.setValue(BI.isNull(json.g) ? "" : json.g);
        this.B.setValue(BI.isNull(json.b) ? "" : json.b);
        this.hexEditor.setValue(color.slice(this.constants.HEX_PREFIX_POSITION));
    },

    getValue: function () {
        return BI.DOM.rgb2hex(BI.DOM.json2rgb({
            r: this.R.getValue(),
            g: this.G.getValue(),
            b: this.B.getValue()
        }));
    }
});
BI.SimpleHexColorPickerEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.simple_hex_color_picker_editor", BI.SimpleHexColorPickerEditor);