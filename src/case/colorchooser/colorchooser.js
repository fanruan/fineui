/**
 * 选色控件
 *
 * Created by GUY on 2015/11/17.
 * @class BI.ColorChooser
 * @extends BI.Widget
 */
BI.ColorChooser = BI.inherit(BI.Widget, {

    _defaultConfig: function () {
        return BI.extend(BI.ColorChooser.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-color-chooser",
            value: "",
            height: 24,
            el: {},
        });
    },

    _init: function () {
        var self = this, o = this.options;
        BI.ColorChooser.superclass._init.apply(this, arguments);
        o.value = (o.value || "").toLowerCase();
        this.combo = BI.createWidget({
            type: "bi.combo",
            element: this,
            container: o.container,
            adjustLength: 1,
            destroyWhenHide: o.destroyWhenHide,
            isNeedAdjustWidth: false,
            isNeedAdjustHeight: false,
            el: BI.extend({
                type: o.width <= 24 ? "bi.color_chooser_trigger" : "bi.long_color_chooser_trigger",
                ref: function (_ref) {
                    self.trigger = _ref;
                },
                value: o.value,
                width: o.el.type ? o.width : o.width - 2,
                height: o.el.type ? o.height : o.height - 2
            }, o.el),
            popup: {
                el: BI.extend({
                    type: "bi.hex_color_chooser_popup",
                    recommendColorsGetter: o.recommendColorsGetter,
                    ref: function (_ref) {
                        self.colorPicker = _ref;
                    },
                    listeners: [{
                        eventName: BI.ColorChooserPopup.EVENT_VALUE_CHANGE,
                        action: function () {
                            fn();
                            if (!self._isRGBColor(self.colorPicker.getValue())) {
                                self.combo.hideView();
                            }
                        }
                    }, {
                        eventName: BI.ColorChooserPopup.EVENT_CHANGE,
                        action: function () {
                            fn();
                            self.combo.hideView();
                        }
                    }]
                }, o.popup),
                value: o.value,
                width: 300
            },
            value: o.value
        });

        var fn = function () {
            var color = self.colorPicker.getValue();
            self.trigger.setValue(color);
        };

        this.combo.on(BI.Combo.EVENT_BEFORE_HIDEVIEW, function () {
            self.fireEvent(BI.ColorChooser.EVENT_CHANGE, arguments);
        });
        this.combo.on(BI.Combo.EVENT_AFTER_POPUPVIEW, function () {
            self.fireEvent(BI.ColorChooser.EVENT_AFTER_POPUPVIEW, arguments);
        });
    },

    _isRGBColor: function (color) {
        return BI.isNotEmptyString(color) && color !== "transparent";
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
        this.combo.setValue((color || "").toLowerCase());
    },

    getValue: function () {
        return this.combo.getValue();
    }
});
BI.ColorChooser.EVENT_CHANGE = "EVENT_CHANGE";
BI.ColorChooser.EVENT_AFTER_POPUPVIEW = "EVENT_AFTER_POPUPVIEW";
BI.shortcut("bi.color_chooser", BI.ColorChooser);
