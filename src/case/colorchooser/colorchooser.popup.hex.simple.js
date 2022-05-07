/**
 * @author windy
 * @version 2.0
 * Created by windy on 2020/11/10
 */
BI.SimpleHexColorChooserPopup = BI.inherit(BI.Widget, {

    props: {
        baseCls: "bi-color-chooser-popup",
    },

    render: function () {
        var self = this, o = this.options;
        return {
            type: "bi.hex_color_chooser_popup",
            recommendColorsGetter: o.recommendColorsGetter,
            value: o.value,
            simple: true, // 是否有自动
            listeners: [{
                eventName: BI.ColorChooserPopup.EVENT_CHANGE,
                action: function () {
                    self.fireEvent(BI.SimpleColorChooserPopup.EVENT_CHANGE, arguments);
                }
            }, {
                eventName: BI.ColorChooserPopup.EVENT_VALUE_CHANGE,
                action: function () {
                    self.fireEvent(BI.SimpleColorChooserPopup.EVENT_VALUE_CHANGE, arguments);
                }
            }],
            ref: function (_ref) {
                self.popup = _ref;
            }
        }
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
BI.SimpleHexColorChooserPopup.EVENT_VALUE_CHANGE = "EVENT_VALUE_CHANGE";
BI.SimpleHexColorChooserPopup.EVENT_CHANGE = "EVENT_CHANGE";
BI.shortcut("bi.simple_hex_color_chooser_popup", BI.SimpleHexColorChooserPopup);