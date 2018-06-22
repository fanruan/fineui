/**
 * 自定义选色
 *
 * Created by GUY on 2015/11/17.
 * @class BI.CustomColorChooser
 * @extends BI.Widget
 */
BI.CustomColorChooser = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.CustomColorChooser.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-custom-color-chooser",
            width: 227,
            height: 245
        });
    },

    _init: function () {
        BI.CustomColorChooser.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.editor = BI.createWidget(o.editor, {
            type: "bi.color_picker_editor"
        });
        this.editor.on(BI.ColorPickerEditor.EVENT_CHANGE, function () {
            self.setValue(this.getValue());
        });
        this.farbtastic = BI.createWidget({
            type: "bi.farbtastic"
        });
        this.farbtastic.on(BI.Farbtastic.EVENT_CHANGE, function () {
            self.setValue(this.getValue());
        });

        BI.createWidget({
            type: "bi.vtape",
            element: this,
            items: [{
                type: "bi.absolute",
                items: [{
                    el: this.editor,
                    left: 0,
                    top: 0,
                    right: 0
                }],
                height: 30
            }, {
                type: "bi.absolute",
                items: [{
                    el: this.farbtastic,
                    left: 15,
                    right: 15,
                    top: 10
                }],
                height: 215
            }]
        });
    },

    setValue: function (color) {
        this.editor.setValue(color);
        this.farbtastic.setValue(color);
    },

    getValue: function () {
        return this.editor.getValue();
    }
});
BI.CustomColorChooser.EVENT_CHANGE = "CustomColorChooser.EVENT_CHANGE";
BI.shortcut("bi.custom_color_chooser", BI.CustomColorChooser);