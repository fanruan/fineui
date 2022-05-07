/**
 * 选色控件
 *
 * Created by GUY on 2015/11/17.
 * @class BI.SimpleColorChooserPopup
 * @extends BI.Widget
 */
BI.SimpleColorChooserPopup = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SimpleColorChooserPopup.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-color-chooser-popup"
        });
    },

    _init: function () {
        BI.SimpleColorChooserPopup.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        this.popup = BI.createWidget({
            type: o.hex ? "bi.hex_color_chooser_popup" : "bi.color_chooser_popup",
            value: o.value,
            element: this,
            simple: true // 是否有自动
        });
        this.popup.on(BI.ColorChooserPopup.EVENT_CHANGE, function () {
            self.fireEvent(BI.SimpleColorChooserPopup.EVENT_CHANGE, arguments);
        });
        this.popup.on(BI.ColorChooserPopup.EVENT_VALUE_CHANGE, function () {
            self.fireEvent(BI.SimpleColorChooserPopup.EVENT_VALUE_CHANGE, arguments);
        });
    },

    setStoreColors: function (colors) {
        this.popup.setStoreColors(colors);
    },

    setValue: function (color) {
        this.popup.setValue(color);
    },

    getValue: function () {
        return this.popup.getValue();
    }
});
BI.SimpleColorChooserPopup.EVENT_VALUE_CHANGE = "EVENT_VALUE_CHANGE";
BI.SimpleColorChooserPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.simple_color_chooser_popup", BI.SimpleColorChooserPopup);