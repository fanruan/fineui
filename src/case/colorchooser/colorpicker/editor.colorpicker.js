/**
 * 简单选色控件
 *
 * Created by GUY on 2015/11/16.
 * @class BI.ColorPickerEditor
 * @extends BI.Widget
 */
BI.ColorPickerEditor = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.ColorPickerEditor.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-color-picker-editor",
            // width: 200,
            height: 20
        });
    },

    _init: function () {
        BI.ColorPickerEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.colorShow = BI.createWidget({
            type: "bi.layout",
            cls: "color-picker-editor-display bi-card",
            height: 20
        });
        var RGB = BI.createWidgets(BI.createItems([{text: "R"}, {text: "G"}, {text: "B"}], {
            type: "bi.label",
            cls: "color-picker-editor-label",
            width: 10,
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
            allowBlank: false,
            value: 255,
            width: 32,
            height: 20
        });
        BI.each(Ws, function (i, w) {
            w.on(BI.TextEditor.EVENT_CHANGE, function () {
                self._checkEditors();
                if (self.R.isValid() && self.G.isValid() && self.B.isValid()) {
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
            if (this.isSelected()) {
                self.lastColor = self.getValue();
                self.setValue("");
            } else {
                self.setValue(self.lastColor || "#ffffff");
            }
            if (self.R.isValid() && self.G.isValid() && self.B.isValid()) {
                self.colorShow.element.css("background-color", self.getValue());
                self.fireEvent(BI.ColorPickerEditor.EVENT_CHANGE);
            }
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
            if (this.isSelected()) {
                self.lastColor = self.getValue();
                self.setValue("transparent");
            } else {
                if (self.lastColor === "transparent") {
                    self.lastColor = "";
                }
                self.setValue(self.lastColor || "#ffffff");
            }
            if (self.R.isValid() && self.G.isValid() && self.B.isValid()) {
                self.colorShow.element.css("background-color", self.getValue());
                self.fireEvent(BI.ColorPickerEditor.EVENT_CHANGE);
            }
        });

        BI.createWidget({
            type: "bi.htape",
            element: this,
            items: [{
                el: this.colorShow,
                width: "fill"
            }, {
                el: RGB[0],
                lgap: 10,
                width: 16
            }, {
                el: this.R,
                width: 32
            }, {
                el: RGB[1],
                lgap: 10,
                width: 16
            }, {
                el: this.G,
                width: 32
            }, {
                el: RGB[2],
                lgap: 10,
                width: 16
            }, {
                el: this.B,
                width: 32
            }, {
                el: {
                    type: "bi.center_adapt",
                    items: [this.none]
                },
                width: 18
            }, {
                el: {
                    type: "bi.center_adapt",
                    items: [this.transparent]
                },
                width: 18
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
    },

    _showPreColor: function (color) {
        if (color === "") {
            this.colorShow.element.css("background-color", "").removeClass("trans-color-background").addClass("auto-color-background");
        } else if (color === "transparent") {
            this.colorShow.element.css("background-color", "").removeClass("auto-color-background").addClass("trans-color-background");
        } else {
            this.colorShow.element.css({"background-color": color}).removeClass("auto-color-background").removeClass("trans-color-background");
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
        this.R.setValue(BI.isNull(json.r) ? "" : json.r);
        this.G.setValue(BI.isNull(json.g) ? "" : json.g);
        this.B.setValue(BI.isNull(json.b) ? "" : json.b);
    },

    getValue: function () {
        if (this.transparent.isSelected()) {
            return "transparent";
        }
        return BI.DOM.rgb2hex(BI.DOM.json2rgb({
            r: this.R.getValue(),
            g: this.G.getValue(),
            b: this.B.getValue()
        }));
    }
});
BI.ColorPickerEditor.EVENT_CHANGE = "ColorPickerEditor.EVENT_CHANGE";
BI.shortcut("bi.color_picker_editor", BI.ColorPickerEditor);