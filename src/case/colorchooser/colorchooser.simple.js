/**
 * 简单选色控件，没有自动和透明
 *
 * Created by GUY on 2015/11/17.
 * @class BI.SimpleColorChooser
 * @extends BI.Widget
 */
BI.SimpleColorChooser = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.SimpleColorChooser.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-simple-color-chooser",
            value: "#ffffff"
        });
    },

    _init: function () {
        BI.SimpleColorChooser.superclass._init.apply(this, arguments);
        var self = this, o = this.options;

        this.combo = BI.createWidget({
            type: "bi.color_chooser",
            element: this,
            container: o.container,
            value: o.value,
            width: o.width,
            height: o.height,
            destroyWhenHide: o.destroyWhenHide,
            popup: {
                type: "bi.simple_hex_color_chooser_popup",
                recommendColorsGetter: o.recommendColorsGetter,
            }
        });
        this.combo.on(BI.ColorChooser.EVENT_CHANGE, function () {
            self.fireEvent(BI.SimpleColorChooser.EVENT_CHANGE, arguments);
        });
        this.combo.on(BI.ColorChooser.EVENT_AFTER_POPUPVIEW, function () {
            self.fireEvent(BI.SimpleColorChooser.EVENT_AFTER_POPUPVIEW, arguments);
        });
    },

    isViewVisible: function () {
        return this.combo.isViewVisible();
    },

    hideView: function () {
        this.combo.hideView();
    },

    showView: function () {
        this.combo.showView();
    },

    setValue: function (color) {
        this.combo.setValue(color);
    },

    getValue: function () {
        return this.combo.getValue();
    }
});
BI.SimpleColorChooser.EVENT_CHANGE = "EVENT_CHANGE";
BI.SimpleColorChooser.EVENT_AFTER_POPUPVIEW = "EVENT_AFTER_POPUPVIEW";
BI.shortcut("bi.simple_color_chooser", BI.SimpleColorChooser);