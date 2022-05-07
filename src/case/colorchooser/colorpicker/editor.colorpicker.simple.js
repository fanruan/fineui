/**
 * 简单选色控件
 *
 * Created by GUY on 2015/11/16.
 * @class BI.SimpleColorPickerEditor
 * @extends BI.Widget
 */
BI.SimpleColorPickerEditor = BI.inherit(BI.Widget, {

    constants: {
        RGB_WIDTH: 32
    },

    _defaultConfig: function () {
        return BI.extend(BI.SimpleColorPickerEditor.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-color-picker-editor",
            // width: 200,
            height: 30
        });
    },

    _init: function () {
        BI.SimpleColorPickerEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options, c = this.constants;
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
                if (self.R.isValid() && self.G.isValid() && self.B.isValid()) {
                    self.colorShow.element.css("background-color", self.getValue());
                    self.fireEvent(BI.SimpleColorPickerEditor.EVENT_CHANGE);
                }
            });
        });
        this.R = Ws[0];
        this.G = Ws[1];
        this.B = Ws[2];

        BI.createWidget({
            type: "bi.vertical_adapt",
            element: this,
            items: [{
                el: this.colorShow,
                width: 16,
                lgap: 20,
                rgap: 15
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

    setValue: function (color) {
        this.colorShow.element.css({"background-color": color});
        var json = BI.DOM.rgb2json(BI.DOM.hex2rgb(color));
        this.R.setValue(BI.isNull(json.r) ? "" : json.r);
        this.G.setValue(BI.isNull(json.g) ? "" : json.g);
        this.B.setValue(BI.isNull(json.b) ? "" : json.b);
    },

    getValue: function () {
        return BI.DOM.rgb2hex(BI.DOM.json2rgb({
            r: this.R.getValue(),
            g: this.G.getValue(),
            b: this.B.getValue()
        }));
    }
});
BI.SimpleColorPickerEditor.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.simple_color_picker_editor", BI.SimpleColorPickerEditor);