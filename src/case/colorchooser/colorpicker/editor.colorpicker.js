/**
 * 简单选色控件
 *
 * Created by GUY on 2015/11/16.
 * @class BI.ColorPickerEditor
 * @extends BI.Widget
 */
BI.ColorPickerEditor = BI.inherit(BI.Widget, {

    constants: {
        RGB_WIDTH: 32
    },

    _defaultConfig: function () {
        return BI.extend(BI.ColorPickerEditor.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-color-picker-editor",
            // width: 200,
            height: 30
        });
    },

    _init: function () {
        BI.ColorPickerEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this.constants;
        this.storeValue = {};
        this.colorShow = BI.createWidget({
            type: "bi.layout",
            cls: "color-picker-editor-display bi-card bi-border",
            height: 16,
            width: 16
        });
        var RGB = BI.createWidgets(BI.createItems([{text: "R"}, {text: "G"}, {text: "B"}], {
            type: "bi.label",
            cls: "color-picker-editor-label",
            width: 20,
            height: 20
        }));

        var checker = function (v) {
            return BI.isNumeric(v) && (v | 0) >= 0 && (v | 0) <= 255;
        };
        var Ws = BI.createWidgets([{}, {}, {}], {
            type: "bi.small_text_editor",
            cls: "color-picker-editor-input",
            validationChecker: checker,
            errorText: BI.i18nText("BI-Color_Picker_Error_Text"),
            allowBlank: true,
            value: 255,
            width: c.RGB_WIDTH,
            height: 20
        });
        BI.each(Ws, function (i, w) {
            w.on(BI.TextEditor.EVENT_CHANGE, function () {
                self._checkEditors();
                if (checker(self.storeValue.r) && checker(self.storeValue.g) && checker(self.storeValue.b)) {
                    self.colorShow.element.css("background-color", self.getValue());
                    self.fireEvent(BI.ColorPickerEditor.EVENT_CHANGE);
                }
            });
        });
        this.R = Ws[0];
        this.G = Ws[1];
        this.B = Ws[2];

        this.none = BI.createWidget({
            type: "bi.icon_button",
            cls: "auto-color-icon",
            width: 16,
            height: 16,
            iconWidth: 16,
            iconHeight: 16,
            title: BI.i18nText("BI-Basic_Auto")
        });
        this.none.on(BI.IconButton.EVENT_CHANGE, function () {
            var value = self.getValue();
            self.setValue("");
            (value !== "") && self.fireEvent(BI.ColorPickerEditor.EVENT_CHANGE);
        });

        this.transparent = BI.createWidget({
            type: "bi.icon_button",
            cls: "trans-color-icon",
            width: 16,
            height: 16,
            iconWidth: 16,
            iconHeight: 16,
            title: BI.i18nText("BI-Transparent_Color")
        });
        this.transparent.on(BI.IconButton.EVENT_CHANGE, function () {
            var value = self.getValue();
            self.setValue("transparent");
            (value !== "transparent") && self.fireEvent(BI.ColorPickerEditor.EVENT_CHANGE);
        });

        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: {
                    type: "bi.vertical_adapt",
                    items: [{
                        el: this.colorShow,
                        width: 16
                    }, {
                        el: RGB[0],
                        width: 20
                    }, {
                        el: this.R,
                        width: c.RGB_WIDTH
                    }, {
                        el: RGB[1],
                        width: 20
                    }, {
                        el: this.G,
                        width: c.RGB_WIDTH
                    }, {
                        el: RGB[2],
                        width: 20
                    }, {
                        el: this.B,
                        width: c.RGB_WIDTH
                    }, {
                        el: this.transparent,
                        width: 16,
                        lgap: 5
                    }, {
                        el: this.none,
                        width: 16,
                        lgap: 5
                    }]
                },
                left: 10,
                right: 10,
                top: 0,
                bottom: 0
            }]
        });
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
    },

    _isEmptyRGB: function () {
        return BI.isEmptyString(this.storeValue.r) && BI.isEmptyString(this.storeValue.g) && BI.isEmptyString(this.storeValue.b);
    },

    _showPreColor: function (color) {
        if (color === "") {
            this.colorShow.element.css("background-color", "").removeClass("trans-color-background").addClass("auto-color-normal-background");
        } else if (color === "transparent") {
            this.colorShow.element.css("background-color", "").removeClass("auto-color-normal-background").addClass("trans-color-background");
        } else {
            this.colorShow.element.css({"background-color": color}).removeClass("auto-color-normal-background").removeClass("trans-color-background");
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
BI.ColorPickerEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.color_picker_editor", BI.ColorPickerEditor);