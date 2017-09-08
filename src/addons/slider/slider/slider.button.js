/**
 * Created by Urthur on 2017/9/4.
 */
BI.SliderButton = BI.inherit(BI.Widget, {
    _defaultConfig: function () {
        return BI.extend(BI.SliderButton.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-slider-button"
        });
    },
    _init: function () {
        BI.extend(BI.SliderButton.superclass._init.apply(this, arguments));
        var self = this;
        var sliderButton = BI.createWidget({
            type: "bi.icon_button",
            cls: "column-next-page-h-font",
            iconWidth: 16,
            iconHeight: 16,
            height: 16,
            width: 16
        });
        BI.createWidget({
            type: "bi.absolute",
            element: this,
            items: [{
                el: sliderButton,
                left: -8
            }, {
                el: {
                    type: "bi.label",
                    ref: function (_ref) {
                        self.label = _ref;
                    }
                },
                left: -8,
                top: -10
            }]
        });
    },

    setValue: function (v) {
        this.label.setText(v);
    }
});
BI.shortcut("bi.slider_button", BI.SliderButton);