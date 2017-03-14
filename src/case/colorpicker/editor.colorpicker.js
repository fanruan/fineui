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
            width: 190,
            height: 20
        })
    },

    _init: function () {
        BI.ColorPickerEditor.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.colorShow = BI.createWidget({
            type: "bi.layout",
            cls: "color-picker-editor-display",
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
            value: 255,
            width: 35,
            height: 20
        });
        BI.each(Ws, function (i, w) {
            w.on(BI.TextEditor.EVENT_CHANGE, function () {
                if (self.R.isValid() && self.G.isValid() && self.B.isValid()) {
                    self.colorShow.element.css("background-color", self.getValue());
                    self.fireEvent(BI.ColorPickerEditor.EVENT_CHANGE);
                }
            });
        });
        this.R = Ws[0];
        this.G = Ws[1];
        this.B = Ws[2];

        BI.createWidget({
            type: "bi.htape",
            element: this.element,
            items: [{
                el: this.colorShow,
                width: 'fill'
            }, {
                el: RGB[0],
                lgap: 10,
                width: 20
            }, {
                el: this.R,
                width: 35
            }, {
                el: RGB[1],
                lgap: 10,
                width: 20
            }, {
                el: this.G,
                width: 35
            }, {
                el: RGB[2],
                lgap: 10,
                width: 20
            }, {
                el: this.B,
                width: 35
            }]
        })
    },

    setValue: function (color) {
        color || (color = "#000000");
        this.colorShow.element.css("background-color", color);
        var json = BI.DOM.rgb2json(BI.DOM.hex2rgb(color));
        this.R.setValue(json.r);
        this.G.setValue(json.g);
        this.B.setValue(json.b);
    },

    getValue: function () {
        return BI.DOM.rgb2hex(BI.DOM.json2rgb({
            r: this.R.getValue(),
            g: this.G.getValue(),
            b: this.B.getValue()
        }))
    }
});
BI.ColorPickerEditor.EVENT_CHANGE = "ColorPickerEditor.EVENT_CHANGE";
$.shortcut("bi.color_picker_editor", BI.ColorPickerEditor);